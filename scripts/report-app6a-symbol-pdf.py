"""Turn the S-symbol image audit into a printable PDF test report.

Run after compare-app6a-symbol-images.py. For every illustrated cell of
Annex D (printed pp. 130-261) the report shows the publication image, the
current milsymbol rendering and a difference overlay. Two automatic scores
triage visual review (they do not certify conformance):

- direct similarity: frame silhouette and stroke-width-independent line
  skeletons, compared in place;
- icon pattern: the central icon of the milsymbol rendering is registered
  onto the publication icon (scale 0.4-3x, rotation +/-6 deg, shift), so a
  correctly drawn but resized, moved or slightly rotated icon is reported as
  KONTROL instead of FARKLI. The icon glyph is the same in all four
  identities, so the pattern decision uses the median over those cells;
- part layout: the icon may be resized as a whole, but its parts (text
  lines, shapes) must keep their proportions to each other. SOF over a much
  smaller SPT, where the publication draws both alike, is FARKLI.

    python3 scripts/report-app6a-symbol-pdf.py [output.pdf]

Requires Pillow, NumPy, SciPy, scikit-image and reportlab.
"""
import itertools
import json
import multiprocessing
import statistics
import subprocess
import sys
from collections import Counter
from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor
from datetime import datetime
from pathlib import Path

import numpy as np
from PIL import Image
from reportlab import rl_config
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.lib.fonts import addMapping
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph
from scipy import ndimage
from scipy.optimize import linear_sum_assignment
from scipy.signal import fftconvolve
from skimage.morphology import skeletonize

SYMBOLS = Path("output/app6a-audit/symbols")
OUTPUT = Path(sys.argv[1] if len(sys.argv) > 1 else "output/app6a-audit/APP6A-karsilastirma-raporu.pdf")
SIZE = 256
TOLERANCE = 6  # px on the 256px normalized canvas (~2.3 %)
PASS, REVIEW = 0.92, 0.78
PATTERN_OK = 0.80  # registered icon pattern: same drawing at another size/position
PATTERN_TOLERANCE = 0.04  # of the publication icon's size, at least 4 px, after registration
LAYOUT_WARN, LAYOUT_FAIL = 1.0, 1.6  # part layout deviation (1.0 = parts 25 % off in size or 15 % in position)
EDGE_BAND = 12  # px of the frame (and decorations hugging it) ignored for the icon
SCALES = np.geomspace(0.4, 3.0, 21)
ANGLES = (-6, 0, 6)
PATTERN_CACHE = SYMBOLS / "pattern-cache.json"
PATTERN_VERSION = 11  # bump when the pattern metric changes

# ---------------------------------------------------------------- metric


def load(path):
    return np.asarray(Image.open(path).convert("RGB"))


def fit(a, stretch):
    """Crop to the drawn foreground and fit it on a 256px canvas. With
    stretch=True both axes fill the box, which removes a pure frame aspect
    ratio difference so the icon inside the frame can still be compared."""
    y, x = np.where(a.min(axis=2) < 215)
    if not len(x):
        return a
    crop = Image.fromarray(a[y.min():y.max() + 1, x.min():x.max() + 1])
    inner = SIZE - 32
    if stretch:
        size = (inner, inner)
    else:
        scale = inner / max(crop.size)
        size = (max(1, round(crop.width * scale)), max(1, round(crop.height * scale)))
    crop = crop.resize(size, Image.Resampling.LANCZOS)
    out = Image.new("RGB", (SIZE, SIZE), "white")
    out.paste(crop, ((SIZE - size[0]) // 2, (SIZE - size[1]) // 2))
    return np.asarray(out)


def aspect(a):
    y, x = np.where(a.min(axis=2) < 215)
    return (x.max() - x.min() + 1) / (y.max() - y.min() + 1) if len(x) else 1.0


def masks(a):
    a = a.astype(int)
    luma = (a[..., 0] * 299 + a[..., 1] * 587 + a[..., 2] * 114) // 1000
    return a.min(axis=2) < 215, luma < 130


def f1(a, b):
    if not a.any() and not b.any():
        return 1.0
    if not a.any() or not b.any():
        return 0.0
    da, db = ndimage.distance_transform_edt(~a), ndimage.distance_transform_edt(~b)
    recall, precision = float((db[a] <= TOLERANCE).mean()), float((da[b] <= TOLERANCE).mean())
    return 2 * precision * recall / max(1e-9, precision + recall)


def outline(mask):
    return mask & ~ndimage.binary_erosion(mask, iterations=2)


def measure(e, a):
    fe, de = masks(e)
    fa, da = masks(a)
    shape = f1(outline(fe), outline(fa))
    # Outer contour only (holes filled): the frame for framed symbols.
    frame = f1(outline(ndimage.binary_fill_holes(fe)), outline(ndimage.binary_fill_holes(fa)))
    se, sa = skeletonize(de), skeletonize(da)
    if se.sum() >= 15 and sa.sum() >= 15:
        detail = f1(se, sa)
    else:
        # Unframed coloured icons may have no black line work: compare the
        # skeleton of everything drawn instead.
        detail = f1(skeletonize(fe), skeletonize(fa))
    return shape, detail, frame


def coloured_share(a):
    """Share of drawn pixels that are saturated (identity colour, not black)."""
    a = a.astype(int)
    fg = a.min(axis=2) < 215
    return float(((a.max(axis=2) - a.min(axis=2))[fg] > 60).mean()) if fg.any() else 0.0


def score(key):
    e, a = load(SYMBOLS / f"{key}-expected.png"), load(SYMBOLS / f"{key}-actual.png")
    ratio = float(aspect(a) / aspect(e) - 1)
    plain = measure(fit(e, False), fit(a, False))
    stretched = measure(fit(e, True), fit(a, True))
    use_stretch = min(stretched[:2]) > min(plain[:2]) + 0.01
    shape, detail, frame = stretched if use_stretch else plain
    # Unframed icons carry the identity only through their colour.
    colour = key.endswith("-unframed") and abs(coloured_share(e) - coloured_share(a)) > 0.5
    return key, shape, detail, bool(colour), ratio, use_stretch, max(plain[2], stretched[2])


def without_side_strips(mask, fg):
    """Clear the frame's left and right 22 %, where theater/corps chevrons sit."""
    xs = np.nonzero(fg.any(axis=0))[0]
    w = xs.max() - xs.min()
    mask = mask.copy()
    mask[:, :int(xs.min() + 0.22 * w)] = False
    mask[:, int(xs.max() - 0.22 * w) + 1:] = False
    return mask


def icon_mask(a, framed, echelon_marks):
    """Central icon line work, without the frame. Theater/corps chevrons at
    the frame's left and right edges are excluded as frame decorations."""
    fg, dark = masks(a)
    if framed:
        ic = dark & (ndimage.distance_transform_edt(fg) >= EDGE_BAND)
        if echelon_marks:
            ic = without_side_strips(ic, fg)
    else:
        ic = dark if dark.sum() >= 40 else fg
    lab, n = ndimage.label(ic)
    if n:
        sizes = ndimage.sum(ic, lab, range(1, n + 1))
        ic = np.isin(lab, [i + 1 for i, size in enumerate(sizes) if size >= 12])
    return ic


def line_work(a, framed, marks):
    """Stroke-width-independent drawing: centre lines. A coloured unframed
    icon without black line work is a filled shape, whose form a centre line
    alone would not describe, so its contour is added."""
    mask = icon_mask(a, framed, marks)
    if not framed and masks(a)[1].sum() < 40:
        return skeletonize(mask) | outline(ndimage.binary_opening(mask, iterations=6))
    return skeletonize(mask)


def parts(mask, join):
    """Letters and shapes of an icon: bounding box, centroid and pixel count.
    `join` is the gap (share of the icon size) still treated as one part."""
    y, x = np.nonzero(mask)
    if not len(x):
        return []
    size = max(y.max() - y.min(), x.max() - x.min()) + 1
    labels, n = ndimage.label(ndimage.binary_dilation(mask, iterations=max(1, round(join * size))))
    total = mask.sum()
    found = []
    for i in range(1, n + 1):
        part = mask & (labels == i)
        if part.sum() >= 0.01 * total:
            py, px = np.nonzero(part)
            found.append((py.min(), px.min(), py.max() + 1, px.max() + 1, int(part.sum()), py.mean(), px.mean()))
    return found


def free_parts(a, framed, marks):
    """Icon line work without the parts attached to the frame (bars or lines
    spanning the frame keep the frame's size, not the icon's)."""
    if not framed:
        return icon_mask(a, framed, marks)
    # Attached = connected to the frame line in the full drawing (decided
    # before the theater/corps strips are cleared, which would cut a spanning
    # bar loose). Parts merely close to the frame stay.
    fg, dark = masks(a)
    labels, _ = ndimage.label(dark)
    on_frame = np.unique(labels[dark & (ndimage.distance_transform_edt(fg) <= 3)])
    mask = icon_mask(a, framed, False) & ~np.isin(labels, on_frame[on_frame > 0])
    return without_side_strips(mask, fg) if marks else mask


def layout(e_mask, a_mask):
    """How far the rows of the milsymbol icon (text lines, stacked shapes)
    deviate from the publication's proportions once the whole icon is scaled
    alike; None without at least two comparable rows. 1.0 = a row 25 % larger
    or smaller, or displaced by 15 %, relative to the whole icon (SOF over a
    small SPT where the publication draws both alike scores about 4).

    Letters and shapes are matched between the images first; rows are built
    from the publication's parts and carried over through that matching, so
    both images are grouped the same way. Rows holding less than a quarter of
    the drawing count proportionally less."""
    for join in (0.015, 0.025, 0.04):
        pe, pa = parts(e_mask, join), parts(a_mask, join)
        if len(pe) == len(pa) and 2 <= len(pe) <= 16:
            break
    else:
        return None

    def frame_of(ps):
        y0, x0 = min(p[0] for p in ps), min(p[1] for p in ps)
        return y0, x0, max(p[2] for p in ps) - y0, max(p[3] for p in ps) - x0

    fe, fa = frame_of(pe), frame_of(pa)
    norm = lambda p, f: ((p[5] - f[0]) / f[2], (p[6] - f[1]) / f[3])
    cost = np.array([[np.hypot(*np.subtract(norm(e, fe), norm(a, fa))) for a in pa] for e in pe])
    rows_idx, cols_idx = linear_sum_assignment(cost)
    match = dict(zip(rows_idx, cols_idx))
    # Rows: publication parts overlapping each other vertically.
    groups = [[i] for i in range(len(pe))]
    merged = True
    while merged:
        merged = False
        for g, h in itertools.combinations(range(len(groups)), 2):
            ga, gb = frame_of([pe[i] for i in groups[g]]), frame_of([pe[i] for i in groups[h]])
            overlap = min(ga[0] + ga[2], gb[0] + gb[2]) - max(ga[0], gb[0])
            if overlap > 0.5 * min(ga[2], gb[2]):
                groups[g] += groups.pop(h)
                merged = True
                break
    if len(groups) < 2:
        return None
    total = sum(p[4] for p in pe)
    deviation = 0.0
    for group in groups:
        re, ra = frame_of([pe[i] for i in group]), frame_of([pa[match[i]] for i in group])
        he, we, ha, wa = re[2] / fe[2], re[3] / fe[3], ra[2] / fa[2], ra[3] / fa[3]
        ye, xe = (re[0] + re[2] / 2 - fe[0]) / fe[2], (re[1] + re[3] / 2 - fe[1]) / fe[3]
        ya, xa = (ra[0] + ra[2] / 2 - fa[0]) / fa[2], (ra[1] + ra[3] / 2 - fa[1]) / fa[3]
        row = max(abs(np.log(max(ha, .02) / max(he, .02))) / np.log(1.25),
                  abs(np.log(max(wa, .02) / max(we, .02))) / np.log(1.25), abs(ya - ye) / 0.15, abs(xa - xe) / 0.15)
        share = sum(pe[i][4] for i in group) / total
        deviation = max(deviation, row * min(1.0, share / 0.25))
    return float(deviation)


def pattern(args):
    """Register the milsymbol icon onto the publication icon: the best F1 over
    scale, small rotation and (FFT cross-correlation) shift. Returns
    (key, score, scale, angle, shift) or (key, None) without line work."""
    key, framed, marks = args
    e_img, a_img = load(SYMBOLS / f"{key}-expected.png").astype(int), load(SYMBOLS / f"{key}-actual.png").astype(int)
    e_sk, a_sk = line_work(e_img, framed, marks), line_work(a_img, framed, marks)
    if e_sk.sum() < 10 or a_sk.sum() < 10:
        return key, None
    deviation = layout(free_parts(e_img, framed, marks), free_parts(a_img, framed, marks))
    n = SIZE
    blur = ndimage.gaussian_filter(e_sk.astype(float), 3)
    ys, xs = np.nonzero(a_sk)
    cy, cx = ys.mean(), xs.mean()
    ey, ex = np.nonzero(e_sk)
    ecy, ecx = ey.mean(), ex.mean()
    tolerance = max(4.0, PATTERN_TOLERANCE * max(ey.max() - ey.min(), ex.max() - ex.min()))
    de = ndimage.distance_transform_edt(~e_sk)
    best = (0.0, 1.0, 0, 0.0)
    for s in SCALES:
        for angle in ANGLES:
            t = np.deg2rad(angle)
            y, x = (ys - cy) * s, (xs - cx) * s
            raster = np.zeros((n, n), bool)
            raster[np.clip(np.round(y * np.cos(t) - x * np.sin(t) + ecy).astype(int), 0, n - 1),
                   np.clip(np.round(y * np.sin(t) + x * np.cos(t) + ecx).astype(int), 0, n - 1)] = True
            if s > 1.15:
                raster = skeletonize(ndimage.binary_dilation(raster))
            corr = fftconvolve(blur, raster[::-1, ::-1].astype(float), mode="same")
            c = n // 2
            window = corr[c - 40:c + 41, c - 40:c + 41]
            dy, dx = np.unravel_index(np.argmax(window), window.shape)
            moved = np.roll(raster, (dy - 40, dx - 40), axis=(0, 1))
            da = ndimage.distance_transform_edt(~moved)
            recall = float((da[e_sk] <= tolerance).mean())
            precision = float((de[moved] <= tolerance).mean())
            f = 2 * precision * recall / max(1e-9, precision + recall)
            if f > best[0]:
                best = (f, float(s), angle, float(np.hypot(dy - 40, dx - 40)))
    return (key,) + best + (deviation,)


def patterns(jobs):
    """Pattern scores, cached by the mtimes of both images."""
    try:
        cache = json.loads(PATTERN_CACHE.read_text())
    except (OSError, ValueError):
        cache = {}
    stamp = {k: max((SYMBOLS / f"{k}-{s}.png").stat().st_mtime for s in ("expected", "actual")) for k, _, _ in jobs}
    todo = [j for j in jobs if cache.get(j[0], {}).get("stamp") != [PATTERN_VERSION, stamp[j[0]]]]
    if todo:
        try:
            pool = ProcessPoolExecutor(mp_context=multiprocessing.get_context("fork"))
        except ValueError:
            pool = ThreadPoolExecutor(8)
        with pool:
            for result in pool.map(pattern, todo, chunksize=16):
                cache[result[0]] = {"stamp": [PATTERN_VERSION, stamp[result[0]]], "result": list(result[1:]) if result[1] is not None else None}
        PATTERN_CACHE.write_text(json.dumps(cache))
    return {k: cache[k]["result"] for k, _, _ in jobs}


def overlay(key, stretch, size=132):
    """Gray = both, cyan = only in publication, magenta = only in milsymbol."""
    fe, de = masks(fit(load(SYMBOLS / f"{key}-expected.png"), stretch))
    fa, da = masks(fit(load(SYMBOLS / f"{key}-actual.png"), stretch))
    le = de if de.sum() > 40 else outline(fe)
    la = da if da.sum() > 40 else outline(fa)
    out = np.full(fe.shape + (3,), 255, np.uint8)
    out[fe | fa] = [238, 240, 243]
    out[le & ~la] = [0, 150, 205]
    out[la & ~le] = [215, 40, 120]
    out[le & la] = [45, 50, 60]
    return Image.fromarray(out).resize((size, size), Image.Resampling.LANCZOS)


def thumb(path, size=132):
    return Image.open(path).convert("RGB").resize((size, size), Image.Resampling.LANCZOS)


# ---------------------------------------------------------------- data

rows = json.loads((SYMBOLS / "comparison.json").read_text())["rows"]
cases = [c for r in rows for c in r.get("cases", [])]
with ThreadPoolExecutor(8) as pool:
    scores = {r[0]: r[1:] for r in pool.map(score, [c["key"] for c in cases])}
pattern_scores = patterns([(c["key"], c["frame"], r["name"].split()[-1] in ("THEATER", "CORPS"))
                           for r in rows for c in r.get("cases", [])])

names = {r["hierarchy"]: r["name"] for r in rows}
SECTIONS = {"P": "Uzay (Space)", "A": "Hava (Air)", "G": "Kara (Ground)",
            "S": "Su Üstü (Sea Surface)", "U": "Su Altı (Subsurface)", "F": "Özel Kuvvetler (SOF)"}
SECTION_ORDER = "PAGSUF"
AFFILIATIONS = {"U": "Bilinmeyen", "F": "Dost", "N": "Tarafsız", "H": "Düşman"}
VERDICTS = {
    "missing": ("PROFİLDE YOK", HexColor("#6d28d9")),
    "invalid": ("GEÇERSİZ", HexColor("#7a1020")),
    "fail": ("FARKLI", HexColor("#c62f3b")),
    "review": ("KONTROL", HexColor("#c98a00")),
    "pass": ("UYUMLU", HexColor("#1f8a4c")),
    "conflict": ("KAYNAK HATASI", HexColor("#6b7280")),
    "none": ("GÖRSEL YOK", HexColor("#9ca3af")),
}
SEVERITY = list(VERDICTS)


def path_name(row):
    parts = row["hierarchy"].split(".")
    chain = [names.get(".".join(parts[:i])) for i in range(3, len(parts) + 1)]
    return " › ".join(n for n in chain if n)


def hierarchy_key(row):
    return [int(p) if p.isdigit() else 0 for p in row["hierarchy"].split(".")]


def median(values):
    values = [v for v in values if v is not None]
    return statistics.median(values) if values else None


def judge(c, row_pattern, row_failing, row_layout):
    """Cell verdict. Reasons explain a KONTROL/FARKLI result in the cell note."""
    c["reasons"] = []
    if c["colour"]:
        c["reasons"].append("renk")
        return "fail"
    if c["frame"] and c["frameScore"] < REVIEW:
        c["reasons"].append("çerçeve")
        return "fail"
    if row_layout is not None and row_layout >= LAYOUT_FAIL:
        # Parts drawn out of proportion to each other (e.g. SOF over a small
        # SPT): resizing the whole icon cannot explain this.
        c["reasons"].append("düzen")
        return "fail"
    if c["score"] >= PASS:
        return "pass"
    same_pattern = row_pattern is not None and row_pattern >= PATTERN_OK
    if c["score"] >= REVIEW and (same_pattern or not row_failing):
        return "review"
    if same_pattern:
        c["reasons"].append("boyut/konum")
        return "review"
    c["reasons"].append("desen")
    return "fail"


for row in rows:
    for c in row.get("cases", []):
        shape, detail, colour, ratio, stretched, frame = scores[c["key"]]
        c.update(shape=shape, detail=detail, colour=colour, ratio=ratio, stretched=stretched, frameScore=frame,
                 score=min(shape, detail))
        p = pattern_scores.get(c["key"])
        c["pattern"], c["iconScale"], c["iconAngle"], c["iconShift"], c["layout"] = p if p else (None,) * 5
    # The icon glyph is identical in all identities: decide its pattern once
    # per frame mode from the median, so raster noise in one cell cannot flip it.
    for framed in (True, False):
        group = [c for c in row.get("cases", []) if c["frame"] == framed and not c.get("sourceConflict")]
        row_pattern = median(c["pattern"] for c in group)
        row_layout = median(c["layout"] for c in group)
        row_failing = sum(c["score"] < REVIEW for c in group) * 2 > len(group)
        for c in row.get("cases", []):
            if c["frame"] != framed:
                continue
            c["rowPattern"], c["rowLayout"] = row_pattern, row_layout
            verdict = judge(c, row_pattern, row_failing, row_layout)
            if row.get("notInCatalog"):
                verdict = "missing"
            elif c.get("sourceConflict"):
                verdict = "conflict"
            elif not all(v["valid"] for v in c["variants"]):
                verdict = "invalid"
            c["verdict"] = verdict
    row["verdict"] = min((c["verdict"] for c in row.get("cases", [])), key=SEVERITY.index, default="none")
    row["firstPage"] = min((c["pdfPage"] for c in row.get("cases", [])), default=None)
    row["section"] = row["id"][2]
    row["path"] = path_name(row)

# Gray taxonomy headings have no illustration: place them before their first child.
first_child = {}
for row in rows:
    if row["firstPage"]:
        for i in range(3, len(row["hierarchy"].split("."))):
            parent = ".".join(row["hierarchy"].split(".")[:i])
            first_child[parent] = min(first_child.get(parent, 10 ** 4), row["firstPage"])
for row in rows:
    row["sortPage"] = row["firstPage"] or first_child.get(row["hierarchy"], 10 ** 4)
ordered = sorted(rows, key=lambda r: (SECTION_ORDER.index(r["section"]), r["sortPage"], hierarchy_key(r)))


def git(*args):
    try:
        return subprocess.run(["git", *args], capture_output=True, text=True).stdout.strip()
    except OSError:
        return ""


commit = git("log", "-1", "--format=%h") or "?"
commit_subject = git("log", "-1", "--format=%s")
dirty = bool(git("status", "--porcelain", "src", "index.js"))
generated = datetime.now().strftime("%d.%m.%Y %H:%M")

all_cases = [c for r in ordered for c in r.get("cases", [])]
counts = Counter(c["verdict"] for c in all_cases)
scored = [c for c in all_cases if c["verdict"] not in ("conflict",)]
missing_rows = [r for r in ordered if r.get("notInCatalog")]
fail_rows = sorted((r for r in ordered if r["verdict"] in ("fail", "invalid")),
                   key=lambda r: min(c["score"] for c in r["cases"] if c["verdict"] in ("fail", "invalid")))
review_rows = [r for r in ordered if r["verdict"] == "review"]

# ---------------------------------------------------------------- PDF setup

for name, files in {"R": ["Arial.ttf", "DejaVuSans.ttf"], "B": ["Arial Bold.ttf", "DejaVuSans-Bold.ttf"]}.items():
    for folder in ["/System/Library/Fonts/Supplemental", "/Library/Fonts", "/usr/share/fonts/truetype/dejavu",
                   "C:/Windows/Fonts"]:
        found = [Path(folder) / f for f in files if (Path(folder) / f).exists()]
        if found:
            pdfmetrics.registerFont(TTFont(name, str(found[0])))
            break
    else:
        sys.exit("No Unicode TrueType font (Arial or DejaVu Sans) found for Turkish text.")
for bold, italic, face in [(0, 0, "R"), (1, 0, "B"), (0, 1, "R"), (1, 1, "B")]:
    addMapping("R", bold, italic, face)
rl_config.useA85 = 0  # binary image streams: about 20 % smaller than ASCII85

W, H = landscape(A4)
M = 24
NAVY, INK, MUTED = HexColor("#14213d"), HexColor("#1b2430"), HexColor("#5b6675")
LINE, PANEL, LINK = HexColor("#d5dbe3"), HexColor("#f5f7fa"), HexColor("#1d4ed8")
CYAN, MAGENTA = HexColor("#0096cd"), HexColor("#d72878")
name_style = ParagraphStyle("n", fontName="B", fontSize=8, leading=9.6, textColor=INK)
path_style = ParagraphStyle("p", fontName="R", fontSize=6.4, leading=7.7, textColor=MUTED)
note_style = ParagraphStyle("c", fontName="R", fontSize=6, leading=7.2, textColor=HexColor("#8a4b00"))
missing_style = ParagraphStyle("m", parent=note_style, textColor=HexColor("#5b21b6"))
body_style = ParagraphStyle("b", fontName="R", fontSize=8.8, leading=12.4, textColor=INK)
bullet_style = ParagraphStyle("u", parent=body_style, fontSize=8.4, leading=11.6, leftIndent=10, bulletIndent=0)

INFO_W = 196
IMG = 41
GAP = 3
CELL_W = 3 * IMG + 2 * GAP + 7
GRID_X = M + INFO_W + 10
MODE_H = IMG + 17
TOP = H - M - 58
THUMB = 108


def esc(text):
    return str(text).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def row_lines(row):
    c0 = row["cases"][0] if row.get("cases") else None
    lines = [f"Hiyerarşi {row['hierarchy']} · Çerçeve {row.get('framePrescription') or '—'}"]
    if c0:
        lines.append(f"Annex D s. {c0.get('printedPage', '?')} (PDF {c0['pdfPage']})"
                     + (f" · Annex B s. {row['page']}" if row.get("page") else ""))
        lines.append(f"SIDC (Dost): {next((c['sidc'] for c in row['cases'] if c['affiliation'] == 'F'), c0['sidc'])}")
    elif row.get("page"):
        lines.append(f"Annex B s. {row['page']} (PDF {row['pdfPage']})")
    return lines


def row_note(row):
    if row.get("notInCatalog"):
        return Paragraph("Profilde yok: Annex B'de kodlu, Annex D'de çizili; katalog/sözlükte bulunmuyor, "
                         "isValid() false. Çıktı kütüphanedeki mevcut ikonla çizildi.", missing_style)
    if row.get("sourceOnlyCategory"):
        return Paragraph("Yayında yalnızca gri sınıflandırma başlığı; çizim yok, görsel karşılaştırma yapılamaz.",
                         note_style)
    notes = list(dict.fromkeys(c["sourceConflict"] for c in row.get("cases", []) if c.get("sourceConflict")))
    notes += [row[k] for k in ("frameNote",) if row.get(k)]
    return Paragraph(esc(" ".join(notes)), note_style) if notes else None


def info_height(row):
    h = 15 + Paragraph(esc(row["path"]), path_style).wrap(INFO_W - 10, 400)[1] + 1 + 7.4 * len(row_lines(row))
    note = row_note(row)
    if note:
        h += 3 + note.wrap(INFO_W - 10, 400)[1]
    return h + 8


def row_height(row):
    modes = len({c["frame"] for c in row.get("cases", [])}) or 1
    return max(60, modes * MODE_H + 8, info_height(row))


# Detail pagination first, so the cover and the findings list can link to page numbers.
pages, current, y = [], [], TOP
for row in ordered:
    h = row_height(row)
    if current and (y - h < M + 8 or current[-1]["section"] != row["section"]):
        pages.append(current)
        current, y = [], TOP
    current.append(row)
    y -= h
pages.append(current)

INDEX_LINES = 38
index_items = []
if missing_rows:
    index_items += [("heading", f"Profilde olmayan semboller — {len(missing_rows)} sembol (Annex B'de tanımlı, "
                                "Annex D'de çizili; APP-6A katalog/sözlüğünde yok)")]
    index_items += [("row", r) for r in missing_rows]
index_items += [("heading", f"FARKLI sonuç veren semboller — {len(fail_rows)} sembol, en düşük puandan başlayarak")]
index_items += [("row", r) for r in fail_rows]
index_pages, chunk, used = [], [], 0
for item in index_items:
    cost = 3 if item[0] == "heading" else 1
    if used + cost > INDEX_LINES or (item[0] == "heading" and used + cost + 2 > INDEX_LINES):
        index_pages.append(chunk)
        chunk, used = [], 0
    chunk.append(item)
    used += cost
index_pages.append(chunk)

FIRST_DETAIL = 2 + len(index_pages) + 1
TOTAL_PAGES = FIRST_DETAIL - 1 + len(pages)
detail_page = {row["id"]: FIRST_DETAIL + i for i, page in enumerate(pages) for row in page}

pdf = canvas.Canvas(str(OUTPUT), pagesize=(W, H), pageCompression=1)
pdf.setTitle("APP-6A Taktik Sembol Uygunluk Raporu")
pdf.setAuthor("milsymbol APP-6A audit")
pdf.setSubject("APP-6A Annex D (basılı s. 130-261) ile milsymbol çıktısının karşılaştırması")
pdf.showOutline()
page_no = [0]


def pct(value):
    return f"%{100 * value:.0f}"


def badge(x, y, verdict, size=6.2):
    label, colour = VERDICTS[verdict]
    w = pdf.stringWidth(label, "B", size) + 7
    pdf.setFillColor(colour)
    pdf.roundRect(x, y - 2.4, w, size + 4, 2, stroke=0, fill=1)
    pdf.setFillColor(white)
    pdf.setFont("B", size)
    pdf.drawString(x + 3.5, y, label)
    return w


def footer():
    pdf.setStrokeColor(LINE)
    pdf.setLineWidth(0.5)
    pdf.line(M, M - 1, W - M, M - 1)
    pdf.setFont("R", 6.8)
    pdf.setFillColor(MUTED)
    pdf.drawString(M, M - 10, f"APP-6A (Ekim 1998) Annex D  ↔  milsymbol {commit}  ·  {generated}")
    pdf.drawRightString(W - M, M - 10, f"Sayfa {page_no[0]} / {TOTAL_PAGES}")


def header(title, subtitle="", chip=None):
    page_no[0] += 1
    pdf.setFillColor(NAVY)
    pdf.rect(0, H - 6, W, 6, stroke=0, fill=1)
    pdf.setFillColor(INK)
    pdf.setFont("B", 13)
    pdf.drawString(M, H - M - 10, title)
    x = M + pdf.stringWidth(title, "B", 13) + 10
    if chip:
        x += badge(x, H - M - 9, chip, 6.4) + 8
    if subtitle:
        pdf.setFont("R", 8.2)
        pdf.setFillColor(MUTED)
        pdf.drawString(x, H - M - 9, subtitle)
    pdf.setStrokeColor(LINE)
    pdf.setLineWidth(0.6)
    pdf.line(M, H - M - 18, W - M, H - M - 18)
    footer()


def image(img, x, y, size):
    pdf.drawImage(ImageReader(img), x, y, size, size)
    pdf.setStrokeColor(LINE)
    pdf.setLineWidth(0.4)
    pdf.rect(x, y, size, size, stroke=1, fill=0)


def para(text, style, x, y_top, width):
    p = Paragraph(text, style)
    _, h = p.wrap(width, 400)
    p.drawOn(pdf, x, y_top - h)
    return h


def fit_text(text, font, size, width):
    if pdf.stringWidth(text, font, size) <= width:
        return text
    while text and pdf.stringWidth(text + "…", font, size) > width:
        text = text[:-1]
    return text + "…"


# ---------------------------------------------------------------- page 1: cover

page_no[0] += 1
footer()
pdf.bookmarkPage("summary")
pdf.addOutlineEntry("Özet", "summary", 0)
pdf.setFillColor(NAVY)
pdf.rect(0, H - 150, W, 150, stroke=0, fill=1)
pdf.setFillColor(HexColor("#fca311"))
pdf.rect(0, H - 150, W, 3, stroke=0, fill=1)
pdf.setFillColor(white)
pdf.setFont("B", 25)
pdf.drawString(M + 4, H - 66, "APP-6A Taktik Sembol Uygunluk Raporu")
pdf.setFont("R", 11.5)
pdf.setFillColor(HexColor("#dfe6f2"))
pdf.drawString(M + 4, H - 88, "milsymbol çıktısının APP-6A (Ekim 1998) Annex D çizimleriyle otomatik görsel karşılaştırması")
pdf.setFont("R", 8.6)
pdf.setFillColor(HexColor("#aab6cc"))
pdf.drawString(M + 4, H - 112, f"Kaynak: APP_6_A_.pdf · basılı s. 130–261 (PDF s. 136–268) · {len(ordered)} sembol satırı · "
               f"{len(all_cases)} PDF hücresi · 4 kimlik (U/F/N/H) × yayında gösterilen çerçeve biçimleri")
meta = (f"Test edilen: milsymbol {commit}{' + commit edilmemiş çalışma ağacı değişiklikleri' if dirty else ''}"
        f" ({commit_subject}) · Rapor tarihi: {generated}")
pdf.drawString(M + 4, H - 126, fit_text(meta, "R", 8.6, W - 2 * M - 8))

# KPI tiles
tiles = [
    ("Sembol satırı", str(len(ordered)), f"{sum(1 for r in ordered if r.get('cases'))} resimli · "
                                         f"{sum(1 for r in ordered if not r.get('cases'))} başlık", NAVY),
    ("Görüntü çifti", str(len(all_cases)), "PDF hücresi ↔ milsymbol", NAVY),
    ("Uyumlu", str(counts["pass"]), f"{pct(counts['pass'] / len(all_cases))} çift", VERDICTS["pass"][1]),
    ("Kontrol", str(counts["review"]), f"{pct(counts['review'] / len(all_cases))} çift", VERDICTS["review"][1]),
    ("Farklı", str(counts["fail"] + counts["invalid"]),
     f"{pct((counts['fail'] + counts['invalid']) / len(all_cases))} çift", VERDICTS["fail"][1]),
    ("Profilde yok", str(len(missing_rows)), f"sembol · {counts['missing']} çift", VERDICTS["missing"][1]),
]
tile_w = (W - 2 * M - 5 * 10) / 6
ty = H - 150 - 22 - 64
for i, (label, value, sub, colour) in enumerate(tiles):
    x = M + i * (tile_w + 10)
    pdf.setFillColor(PANEL)
    pdf.roundRect(x, ty, tile_w, 64, 4, stroke=0, fill=1)
    pdf.setFillColor(colour)
    pdf.rect(x, ty, 4, 64, stroke=0, fill=1)
    pdf.setFont("R", 8)
    pdf.setFillColor(MUTED)
    pdf.drawString(x + 12, ty + 48, label.upper())
    pdf.setFont("B", 22)
    pdf.setFillColor(colour if colour != NAVY else INK)
    pdf.drawString(x + 12, ty + 22, value)
    pdf.setFont("R", 7.4)
    pdf.setFillColor(MUTED)
    pdf.drawString(x + 12, ty + 9, sub)

# stacked bar
y = ty - 26
pdf.setFont("B", 9.5)
pdf.setFillColor(INK)
pdf.drawString(M, y, "Görüntü çiftlerinin dağılımı")
y -= 20
x = M
for key in ["pass", "review", "fail", "invalid", "missing", "conflict"]:
    n = counts.get(key, 0)
    if not n:
        continue
    w = (W - 2 * M) * n / len(all_cases)
    pdf.setFillColor(VERDICTS[key][1])
    pdf.rect(x, y, w, 13, stroke=0, fill=1)
    if w > 48:
        pdf.setFillColor(white)
        pdf.setFont("B", 7.2)
        pdf.drawString(x + 4, y + 4, f"{VERDICTS[key][0]} {n}")
    x += w
y -= 15
x = M
for key in ["pass", "review", "fail", "invalid", "missing", "conflict"]:
    w = badge(x, y, key, 5.8)
    text = f"{counts.get(key, 0)}"
    pdf.setFillColor(INK)
    pdf.setFont("R", 7.6)
    pdf.drawString(x + w + 4, y, text)
    x += w + pdf.stringWidth(text, "R", 7.6) + 16

# section table (left) and findings (right)
y -= 30
col_w = (W - 2 * M - 24) / 2
pdf.setFont("B", 9.5)
pdf.setFillColor(INK)
pdf.drawString(M, y, "Bölümlere göre semboller (sembolün en kötü hücresine göre)")
pdf.drawString(M + col_w + 24, y, "Öne çıkan bulgular")
ty = y - 16
cols = [0, 112, 148, 184, 220, 256, 300, 340]
heads = ["Bölüm", "Sembol", "Uyum", "Kont.", "Farklı", "Yok", "Diğer", "Ort."]
pdf.setFont("B", 7.2)
pdf.setFillColor(MUTED)
for cx, h in zip(cols, heads):
    pdf.drawString(M + cx, ty, h)
ty -= 5
pdf.setStrokeColor(LINE)
pdf.line(M, ty, M + col_w, ty)
section_avg = {}
for sec in SECTION_ORDER:
    rs = [r for r in ordered if r["section"] == sec]
    rc = Counter(r["verdict"] for r in rs)
    sc = [c["score"] for r in rs for c in r.get("cases", []) if c["verdict"] != "conflict"]
    section_avg[sec] = np.mean(sc) if sc else 1
    ty -= 12.5
    values = [SECTIONS[sec], len(rs), rc["pass"], rc["review"], rc["fail"] + rc["invalid"], rc["missing"],
              rc["conflict"] + rc["none"], pct(section_avg[sec])]
    pdf.setFont("R", 8)
    pdf.setFillColor(INK)
    for cx, v in zip(cols, values):
        pdf.drawString(M + cx, ty, str(v))
    pdf.linkRect("", "section-" + sec, (M, ty - 3, M + 105, ty + 9), relative=0, thickness=0)
ty -= 5
pdf.line(M, ty, M + col_w, ty)
ty -= 12
rc = Counter(r["verdict"] for r in ordered)
pdf.setFont("B", 8)
for cx, v in zip(cols, ["Toplam", len(ordered), rc["pass"], rc["review"], rc["fail"] + rc["invalid"], rc["missing"],
                        rc["conflict"] + rc["none"], pct(np.mean([c["score"] for c in scored]))]):
    pdf.drawString(M + cx, ty, str(v))
ty -= 16
para("“Diğer”: kaynak hatası (yayındaki çelişkili hücreler) ve görseli olmayan gri başlık satırları. "
     "Bölüm adına tıklayarak detay sayfalarına gidebilirsiniz.", path_style, M, ty, col_w)

findings = []
if missing_rows:
    b_pages = sorted({r["page"] for r in missing_rows if r.get("page")})
    d_pages = sorted({c.get("printedPage") for r in missing_rows for c in r["cases"] if c.get("printedPage")})
    findings.append(
        f"<b>{len(missing_rows)} sembol APP-6A profilinde yok.</b> Annex B s. {b_pages[0]}–{b_pages[-1]}'de kodlu ve "
        f"Annex D s. {d_pages[0]}–{d_pages[-1]}'de çizili oldukları halde katalog/sözlükte bulunmuyorlar; "
        f"<font name='B'>isValid()</font> false dönüyor. ({esc(missing_rows[0]['id'])} … {esc(missing_rows[-1]['id'])}: "
        f"{esc(missing_rows[0]['name'])} … {esc(missing_rows[-1]['name'])})")
reasons = Counter(r for c in all_cases if c["verdict"] == "fail" for r in c["reasons"])
findings.append(f"<b>FARKLI hücrelerin nedeni:</b> ikon deseni farklı {reasons['desen']}, ikon parçalarının birbirine "
                f"göre oranı bozuk (düzen) {reasons['düzen']}, çerçevesiz ikon rengi yanlış {reasons['renk']}, çerçeve "
                f"biçimi farklı {reasons['çerçeve']}.")
resized = [c for c in all_cases if c["verdict"] == "review" and "boyut/konum" in c["reasons"]]
if resized:
    findings.append(f"<b>{len(resized)} hücrede yalnızca boyut/konum farkı:</b> ikon deseni yayınla aynı (hizalama sonrası "
                    f"≥ %{PATTERN_OK * 100:.0f}) ama farklı ölçekte, yerde veya hafif açıyla çizilmiş; FARKLI yerine "
                    "KONTROL sayıldı.")
worst = sorted(section_avg, key=section_avg.get)[0]
findings.append(f"<b>En düşük ortalama benzerlik:</b> {SECTIONS[worst]} ({pct(section_avg[worst])}). "
                f"FARKLI sonuç veren {len(fail_rows)} sembolün listesi s. {3}'te.")
valid = sum(1 for c in all_cases if c["verdict"] not in ("missing", "invalid"))
findings.append(f"<b>isValid():</b> katalogdaki sembollerin {valid}/{len(all_cases) - counts['missing']} çıktısı "
                f"geçerli. <b>Kaynak hatası:</b> yayındaki {counts['conflict']} çelişkili hücre (yanlış satıra "
                "kopyalanmış görseller, Annex B/D anlam farkları) puanlamaya katılmadı.")
fy = y - 14
for text in findings:
    fy -= para(text, bullet_style, M + col_w + 24, fy, col_w) + 5
fy -= 4
para("Puanlar ön elemedir: UYUMLU piksel eşliği garantisi, FARKLI kesin hata değildir. "
     "Nihai karar için detay sayfalarındaki görseller incelenmelidir.", path_style, M + col_w + 24, fy, col_w)

# ---------------------------------------------------------------- page 2: method

pdf.showPage()
header("Yöntem ve okuma kılavuzu")
pdf.bookmarkPage("method")
pdf.addOutlineEntry("Yöntem ve okuma kılavuzu", "method", 0)
y = H - M - 40
method = [
    "<b>1. Kapsam.</b> APP-6A Annex D, Tablo D-I (basılı s. 130–261 / PDF s. 136–268) içindeki <b>tüm</b> S-şeması "
    f"satırları: {len(ordered)} satır (uzay, hava, kara, su üstü, su altı, özel kuvvetler). Satırlar katalogdan bağımsız "
    "olarak PDF'den bulunur; katalogda olmayan satırlar SIDC ve adlarıyla Annex B'den alınır ve <b>PROFİLDE YOK</b> "
    "olarak işaretlenir. Görseli olmayan gri sınıflandırma başlıkları <b>GÖRSEL YOK</b> olarak listelenir.",
    "<b>2. Beklenen görüntü.</b> Her satırın dört kimlik sütunu (Bilinmeyen, Dost, Tarafsız, Düşman) ve yayında "
    "gösterilen her çerçeve biçimi (F = çerçeveli, UF = çerçevesiz, FO = ikisi de) PDF sayfasından 288 dpi ile "
    "doğrudan kesilir. Referans görüntüler kütüphaneden üretilmez.",
    "<b>3. Gerçek çıktı.</b> Aynı satır için SIDC kurulur ve güncel kaynak koddan "
    "<font name='B'>new ms.Symbol(sidc, {standard: \"APP6A\", frame, fill: true})</font> ile SVG çizilir. "
    "1–4 px çizgi kalınlıklarından yayına en yakın olanı seçilir.",
    "<b>4. Doğrudan benzerlik</b> (hücredeki yüzde). İki görüntü çizim sınırına göre kırpılıp 256 px'e ölçeklenir; "
    f"<b>şekil</b> (çerçeve/silüet sınırları) ve <b>çizim</b> (siyah çizgilerin kalınlıktan bağımsız iskeletleri) ±{TOLERANCE} "
    "px toleransla F1 örtüşmesiyle ölçülür, küçüğü alınır. Çerçeve en-boy oranı %5'ten fazla farklıysa <i>oran</i> "
    "notu gösterilir ve görüntüler ayrıca aynı kareye sığdırılarak da ölçülür.",
    "<b>5. İkon deseni.</b> Çerçeve (ve THEATER/CORPS satırlarında çerçeve kenarındaki &gt; &lt; işaretleri) çıkarılır; "
    "milsymbol ikonu yayındaki ikonun üzerine 0,4–3 kat ölçek, ±6° dönme ve kaydırma ile <b>hizalanır</b> ve "
    f"ikon boyutunun ±%{100 * PATTERN_TOLERANCE:.0f}'ü (en az 4 px) toleransla örtüşmesi ölçülür. İkon dört kimlikte aynı glif olduğundan karar, o satırın "
    f"hücrelerindeki desen puanının ortancasıyla verilir. Ortanca ≥ %{PATTERN_OK * 100:.0f} ise ikon aynı çizimdir; "
    "fark yalnızca boyut, konum veya açıdır. Örneğin ikon yayındakinden küçük çizilmişse sonuç KONTROL olur. "
    "<b>Parça düzeni:</b> ikon bütün olarak büyüyüp küçülebilir, ama parçaları (yazı satırları, şekiller) birbirine "
    "göre oranını ve yerini korumalıdır. Harf ve şekiller iki görüntüde eşleştirilir, yayındaki satırlara göre "
    "gruplanır (çerçeve çizgisine bağlı çizgiler hariç) ve her satırın ikonun bütününe göre boyutu ve yeri karşılaştırılır. "
    f"Bir satır yaklaşık %{100 * (1.25 ** LAYOUT_FAIL - 1):.0f}'tan fazla büyük/küçükse veya ikonun "
    f"%{100 * 0.15 * LAYOUT_FAIL:.0f}'i kadar kaymışsa (sapma ≥ {LAYOUT_FAIL:.1f}) sonuç FARKLI olur; daha küçük sapmalar "
    "<i>düzen</i> notuyla KONTROL'de kalır. Örnek: yayında eşit boyutlu ve ortalı SOF/SPT yazılarının büyük SOF ve küçük "
    "SPT olarak çizilmesi. Çizimin dörtte birinden azını tutan satırlar ağırlıklarıyla orantılı sayılır.",
    f"<b>6. Karar.</b> Doğrudan benzerlik ≥ %{PASS * 100:.0f} → UYUMLU. %{REVIEW * 100:.0f}–%{PASS * 100:.0f} → KONTROL; "
    "ancak satırın çoğu hücresi düşükse ve desen de tutmuyorsa FARKLI. Daha düşük puanlarda desen aynıysa KONTROL "
    "(<i>boyut</i>/<i>konum</i> notu), değilse FARKLI (<i>desen</i> notu). Parça düzeni bozuksa (<i>düzen</i>), "
    "çerçevesiz ikon kimlik renginde değilse (<i>renk</i>) veya çerçeve biçimi farklıysa (<i>çerçeve</i>), sonuç "
    "doğrudan benzerlikten bağımsız olarak FARKLI olur. "
    "<font name='B'>isValid()</font> false → GEÇERSİZ. Yayının kendi içinde çelişkili olduğu bilinen hücreler "
    "KAYNAK HATASI olarak ayrılır. Sembolün kararı, en kötü hücresinin kararıdır.",
]
for text in method:
    y -= para(text, body_style, M, y, W - 2 * M) + 6

y -= 8
pdf.setFont("B", 10)
pdf.setFillColor(INK)
pdf.drawString(M, y, "Detay sayfalarında bir hücre nasıl okunur")
y -= 14
example = next(c for r in ordered for c in r.get("cases", []) if c["verdict"] == "fail" and c["frame"])
big = 84
for i, (img, label) in enumerate([(thumb(SYMBOLS / f"{example['key']}-expected.png", 220), "PDF (beklenen)"),
                                  (thumb(SYMBOLS / f"{example['key']}-actual.png", 220), "milsymbol (gerçek)"),
                                  (overlay(example["key"], example["stretched"], 220), "Fark")]):
    x = M + i * (big + 12)
    image(img, x, y - big, big)
    pdf.setFont("R", 7.6)
    pdf.setFillColor(MUTED)
    pdf.drawCentredString(x + big / 2, y - big - 11, label)
x = M + 3 * (big + 12) + 18
yy = y - 8
for colour, text in [(HexColor("#2d323c"), "Koyu gri: iki görüntüde de bulunan çizgiler"),
                     (CYAN, "Camgöbeği: PDF'de olan, milsymbol çıktısında eksik kalan çizgiler"),
                     (MAGENTA, "Macenta: milsymbol çıktısında olan, PDF'de bulunmayan çizgiler"),
                     (HexColor("#e5e8ec"), "Açık gri: dolgu / silüet (iki görüntüden herhangi birinde)")]:
    pdf.setFillColor(colour)
    pdf.rect(x, yy - 1, 10, 8, stroke=0, fill=1)
    pdf.setFillColor(INK)
    pdf.setFont("R", 8.4)
    pdf.drawString(x + 16, yy, text)
    yy -= 14
yy -= 4
for text in ["Hücre altı: doğrudan benzerlik, karar rozeti ve notlar: desen (ikon deseni puanı), düzen (parça oranları),",
             "boyut (milsymbol ikonunun yayına göre boyutu), konum, renk, oran, çerçeve; ÇS = çerçevesiz biçim.",
             "Kimlikler ve bölüm adları tıklanabilir; PDF okuyucunun yer imleri panelinde her sembol listelenir."]:
    pdf.setFont("R", 8.4)
    pdf.setFillColor(INK)
    pdf.drawString(x, yy, text)
    yy -= 12
y = y - big - 30
pdf.setFont("B", 10)
pdf.drawString(M, y, "Kararlar")
y -= 14
x = M
for key, text in [("pass", "benzerlik yüksek"), ("review", "küçük fark — göz ile kontrol"),
                  ("fail", "belirgin fark"), ("invalid", "isValid() false"),
                  ("missing", "profilde tanımlı değil"), ("conflict", "yayın kendi içinde çelişkili"),
                  ("none", "yayında çizim yok")]:
    span = pdf.stringWidth(VERDICTS[key][0], "B", 6) + 7 + pdf.stringWidth(text, "R", 7.8) + 20
    if x + span > W - M:
        x, y = M, y - 15
    w = badge(x, y, key, 6)
    pdf.setFont("R", 7.8)
    pdf.setFillColor(INK)
    pdf.drawString(x + w + 4, y, text)
    x += span

# ---------------------------------------------------------------- findings list

for p, chunk in enumerate(index_pages):
    pdf.showPage()
    header("Bulgu listesi", f"tıklanabilir — {p + 1}/{len(index_pages)}" if len(index_pages) > 1 else "tıklanabilir")
    if p == 0:
        pdf.bookmarkPage("findings")
        pdf.addOutlineEntry("Bulgu listesi", "findings", 0)
    cx = [M, M + 76, M + 140, M + 470, M + 556, M + 628, M + 736]

    def column_heads(y):
        pdf.setFont("B", 7.2)
        pdf.setFillColor(MUTED)
        for x, h in zip(cx, ["Karar", "Kimlik", "Ad", "Hiyerarşi", "Basılı / PDF s.", "Sorunlu hücreler",
                             "Min. puan · detay"]):
            pdf.drawString(x, y, h)
        pdf.setStrokeColor(LINE)
        pdf.line(M, y - 4, W - M, y - 4)
        return y - 4

    y = H - M - 34
    if chunk[0][0] == "row":
        y = column_heads(y - 10)
    for kind, item in chunk:
        if kind == "heading":
            y -= 18 if y < H - M - 40 else 10
            pdf.setFont("B", 9.4)
            pdf.setFillColor(INK)
            pdf.drawString(M, y, item)
            y = column_heads(y - 13)
            continue
        row = item
        y -= 12.4
        bad = [c for c in row["cases"] if c["verdict"] in ("fail", "invalid", "missing")]
        badge(cx[0], y, row["verdict"], 5.6)
        pdf.setFillColor(LINK)
        pdf.setFont("B", 7.6)
        pdf.drawString(cx[1], y, row["id"])
        pdf.linkRect("", row["id"], (cx[1], y - 2, cx[1] + 60, y + 8), relative=0, thickness=0)
        pdf.setFillColor(INK)
        pdf.setFont("R", 7.4)
        pdf.drawString(cx[2], y, fit_text(row["path"], "R", 7.4, cx[3] - cx[2] - 8))
        pdf.drawString(cx[3], y, row["hierarchy"])
        c0 = row["cases"][0]
        pdf.drawString(cx[4], y, f"{c0.get('printedPage', '?')} / {c0['pdfPage']}")
        affected = ", ".join(f"{c['affiliation']}{'' if c['frame'] else '-ÇS'}" for c in bad)
        why = sorted({r for c in bad for r in c.get("reasons", [])} - {"boyut/konum"})
        if why and row["verdict"] != "missing":
            affected += " — " + ", ".join(why)
        pdf.drawString(cx[5], y, fit_text(affected, "R", 7.4, cx[6] - cx[5] - 6))
        pdf.drawString(cx[6], y, f"{pct(min(c['score'] for c in bad))} · s. {detail_page[row['id']]}")

# ---------------------------------------------------------------- detail pages


def draw_cell(c, x, y):
    for i, img in enumerate([thumb(SYMBOLS / f"{c['key']}-expected.png", THUMB),
                             thumb(SYMBOLS / f"{c['key']}-actual.png", THUMB),
                             overlay(c["key"], c["stretched"], THUMB)]):
        image(img, x + i * (IMG + GAP), y, IMG)
    pdf.setFont("B", 6.8)
    pdf.setFillColor(INK)
    score_text = pct(c["score"])
    pdf.drawString(x, y - 9.5, score_text)
    bx = x + pdf.stringWidth(score_text, "B", 6.8) + 3
    bx += badge(bx, y - 9.5, c["verdict"], 5.3) + 3
    notes = [] if c["frame"] else ["ÇS"]
    if c["colour"]:
        notes.append("renk")
    if "çerçeve" in c["reasons"]:
        notes.append("çerçeve")
    if "düzen" in c["reasons"] or (c["verdict"] == "review" and (c.get("rowLayout") or 0) >= LAYOUT_WARN):
        notes.append("düzen")
    if c["verdict"] not in ("pass", "conflict") and c.get("rowPattern") is not None:
        notes.append(f"desen {pct(c['rowPattern'])}")
        if c["iconScale"] and abs(1 / c["iconScale"] - 1) >= 0.12:
            notes.append(f"boyut %{100 * (1 / c['iconScale'] - 1):+.0f}".replace("-", "−"))
        if c["iconShift"] and c["iconShift"] > 10:
            notes.append("konum")
    if abs(c["ratio"]) > 0.05:
        notes.append(f"oran %{100 * c['ratio']:+.0f}".replace("-", "−"))
    pdf.setFont("R", 5.8)
    pdf.setFillColor(MUTED)
    pdf.drawString(bx, y - 9.5, fit_text(" · ".join(notes), "R", 5.8, x + CELL_W - bx - 4))


current_section = None
for i, page in enumerate(pages):
    pdf.showPage()
    section = page[0]["section"]
    sec_pages = [p for p in pages if p[0]["section"] == section]
    sec_rows = [r for r in ordered if r["section"] == section]
    header(SECTIONS[section], f"{len(sec_rows)} sembol · bölüm sayfası {sec_pages.index(page) + 1}/{len(sec_pages)}")
    if section != current_section:
        current_section = section
        pdf.bookmarkPage("section-" + section)
        pdf.addOutlineEntry(SECTIONS[section], "section-" + section, 0)
    # column heads
    y = H - M - 32
    pdf.setFont("B", 7.4)
    pdf.setFillColor(MUTED)
    pdf.drawString(M + 8, y, "Sembol")
    for k, (aff, label) in enumerate(AFFILIATIONS.items()):
        x = GRID_X + k * CELL_W
        pdf.setFont("B", 7.4)
        pdf.setFillColor(INK)
        pdf.drawString(x, y, f"{label} ({aff})")
        pdf.setFont("R", 5.9)
        pdf.setFillColor(MUTED)
        for j, t in enumerate(["PDF", "milsymbol", "fark"]):
            pdf.drawCentredString(x + j * (IMG + GAP) + IMG / 2, y - 10, t)
    y = TOP + 6
    for n, row in enumerate(page):
        h = row_height(row)
        if n % 2:
            pdf.setFillColor(PANEL)
            pdf.rect(M, y - h, W - 2 * M, h, stroke=0, fill=1)
        pdf.setFillColor(VERDICTS[row["verdict"]][1])
        pdf.rect(M, y - h + 2, 3, h - 4, stroke=0, fill=1)
        pdf.bookmarkPage(row["id"], fit="XYZ", top=y + 4)
        pdf.addOutlineEntry(f"{row['id']}  {row['name']}", row["id"], 1, closed=True)
        tx, ty = M + 9, y - 12
        pdf.setFont("B", 8.6)
        pdf.setFillColor(INK)
        pdf.drawString(tx, ty, row["id"])
        badge(tx + pdf.stringWidth(row["id"], "B", 8.6) + 6, ty, row["verdict"], 5.6)
        ty -= 3
        ty -= para(esc(row["path"]), path_style, tx, ty, INFO_W - 10) + 1
        pdf.setFont("R", 6.2)
        pdf.setFillColor(MUTED)
        for line in row_lines(row):
            ty -= 7.4
            pdf.drawString(tx, ty, line)
        note = row_note(row)
        if note:
            _, nh = note.wrap(INFO_W - 10, 400)
            note.drawOn(pdf, tx, ty - 3 - nh)
        modes = sorted({c["frame"] for c in row.get("cases", [])}, reverse=True)
        for m, framed in enumerate(modes):
            for k, aff in enumerate(AFFILIATIONS):
                c = next((c for c in row["cases"] if c["affiliation"] == aff and c["frame"] == framed), None)
                if c:
                    draw_cell(c, GRID_X + k * CELL_W, y - 6 - IMG - m * MODE_H)
        if not row.get("cases"):
            pdf.setFont("R", 7.4)
            pdf.setFillColor(MUTED)
            pdf.drawString(GRID_X, y - 30, "Yayında bu satır için çizim bulunmuyor (gri başlık hücreleri).")
        y -= h
    if page_no[0] % 20 == 0:
        print(f"sayfa {page_no[0]}/{TOTAL_PAGES}", flush=True)

pdf.showPage()
pdf.save()
assert page_no[0] == TOTAL_PAGES, (page_no[0], TOTAL_PAGES)
print(f"{OUTPUT}: {page_no[0]} sayfa, {len(ordered)} sembol, {len(all_cases)} görüntü çifti, {dict(counts)}")
