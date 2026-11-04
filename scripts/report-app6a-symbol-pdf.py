"""Turn the S-symbol image audit into a printable PDF test report.

Run after compare-app6a-symbol-images.py. For every illustrated cell of
Annex D (printed pp. 130-261) the report shows the publication image, the
current milsymbol rendering and a difference overlay. Automatic metrics
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
- local shape comparison (geometry): stroke centre lines of the icon, split
  into parts (letters, shapes, long lines), compared after a bounded
  whole-icon registration and small per-part moves; a changed letter, a
  missing or added part or line leaves an unexplained run and blocks UYUMLU.
  An equivalent drawing can pass with a lower raw in-place score.

    python3 scripts/report-app6a-symbol-pdf.py [output.pdf]

Requires Pillow, NumPy, SciPy, scikit-image and reportlab.
"""
import hashlib
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

import app6a_visual_verdicts as visual_metrics
from app6a_visual_verdicts import (
    TOLERANCE, PASS, REVIEW, PATTERN_OK, PATTERN_TOLERANCE, LAYOUT_WARN, LAYOUT_FAIL,
    ICON_SCALE, ICON_DISPLACEMENT, PART_SHIFT_SHARE, MIN_PART_SHIFT, PART_SHIFT, PART_SCALES, LINE_SHIFT,
    PART_TOLERANCE, RUN_SHARE,
    fit, aspect, masks, outline, measure, icon_metrics, judge, colour_mismatch,
)

SYMBOLS = Path("output/app6a-audit/symbols")
OUTPUT = Path(sys.argv[1] if len(sys.argv) > 1 else "output/app6a-audit/APP6A-karsilastirma-raporu.pdf")
PATTERN_CACHE = SYMBOLS / "pattern-cache.json"
PATTERN_VERSION = 14  # wrapper version; pure metric changes also invalidate by content hash
METRIC_SIGNATURE = hashlib.sha256(Path(visual_metrics.__file__).read_bytes()).hexdigest()[:16]

# ---------------------------------------------------------------- metric


def load(path):
    return np.asarray(Image.open(path).convert("RGB"))


def score(key):
    e, a = load(SYMBOLS / f"{key}-expected.png"), load(SYMBOLS / f"{key}-actual.png")
    ratio = float(aspect(a) / aspect(e) - 1)
    plain = measure(fit(e, False), fit(a, False))
    stretched = measure(fit(e, True), fit(a, True))
    use_stretch = min(stretched[:2]) > min(plain[:2]) + 0.01
    shape, detail, frame = stretched if use_stretch else plain
    colour = colour_mismatch(e, a)
    return key, shape, detail, bool(colour), ratio, use_stretch, max(plain[2], stretched[2])


def pattern(args):
    """Icon pattern registration, part layout and geometry of one cell:
    (key, score, scale, angle, shift, layout, geometry); see icon_metrics."""
    key, framed, marks = args
    e_img, a_img = load(SYMBOLS / f"{key}-expected.png").astype(int), load(SYMBOLS / f"{key}-actual.png").astype(int)
    return (key,) + icon_metrics(e_img, a_img, framed, marks)


def patterns(jobs):
    """Pattern scores, cached by the mtimes of both images."""
    try:
        cache = json.loads(PATTERN_CACHE.read_text())
    except (OSError, ValueError):
        cache = {}
    stamp = {k: [[(SYMBOLS / f"{k}-{s}.png").stat().st_mtime_ns,
                   (SYMBOLS / f"{k}-{s}.png").stat().st_size] for s in ("expected", "actual")]
             for k, _, _ in jobs}
    todo = [j for j in jobs if cache.get(j[0], {}).get("stamp") != [PATTERN_VERSION, METRIC_SIGNATURE, stamp[j[0]]]]
    if todo:
        try:
            pool = ProcessPoolExecutor(mp_context=multiprocessing.get_context("fork"))
        except ValueError:
            pool = ThreadPoolExecutor(8)
        with pool:
            for result in pool.map(pattern, todo, chunksize=16):
                cache[result[0]] = {"stamp": [PATTERN_VERSION, METRIC_SIGNATURE, stamp[result[0]]], "result": list(result[1:])}
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


for row in rows:
    for c in row.get("cases", []):
        shape, detail, colour, ratio, stretched, frame = scores[c["key"]]
        c.update(shape=shape, detail=detail, colour=colour, ratio=ratio, stretched=stretched, frameScore=frame,
                 score=min(shape, detail))
        p = pattern_scores.get(c["key"])
        c["pattern"], c["iconScale"], c["iconAngle"], c["iconShift"], c["layout"], c["geometry"] = p if p else (None,) * 6
    # The icon glyph is identical in all identities: decide its pattern once
    # per frame mode from the median, so raster noise in one cell cannot flip it.
    for framed in (True, False):
        group = [c for c in row.get("cases", []) if c["frame"] == framed and not c.get("sourceConflict")]
        row_pattern = median(c["pattern"] for c in group)
        row_layout = median(c["layout"] for c in group)
        row_failing = sum(c["score"] < REVIEW for c in group) * 2 > len(group)
        support = sum(bool((c.get("geometry") or {}).get("equivalent")) for c in group)
        row_geometry = support >= max(2, (len(group) + 1) // 2)
        for c in row.get("cases", []):
            if c["frame"] != framed:
                continue
            c["rowPattern"], c["rowLayout"] = row_pattern, row_layout
            c["rowGeometry"] = row_geometry
            verdict = judge(c, row_pattern, row_failing, row_layout, row_geometry)
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
                f"göre oranı bozuk (düzen) {reasons['düzen']}, kimlik rengi yanlış {reasons['renk']}, çerçeve "
                f"biçimi farklı {reasons['çerçeve']}.")
resized = [c for c in all_cases if c["verdict"] == "review" and "boyut/konum" in c["reasons"]]
if resized:
    findings.append(f"<b>{len(resized)} hücre boyut/konum incelemesinde:</b> geniş hizalama puanı yüksek (hizalama sonrası "
                    f"≥ %{PATTERN_OK * 100:.0f}); sınırlı geometrik eşleşme doğrulanmadığı için "
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
icon_scales = f"{1 / ICON_SCALE:.2f}–{ICON_SCALE:.2f}".replace(".", ",")
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
    "<b>5. Desen ve düzen.</b> Çerçeve çıkarılıp ikon 0,4–3 kat ölçek, ±6° dönme ve kaydırmayla hizalanır; "
    f"±%{100 * PATTERN_TOLERANCE:.0f} (en az 4 px) çizgi toleransı uygulanır. Kimlikler arasındaki desen puanının "
    f"ortancası ≥ %{PATTERN_OK * 100:.0f} ise bu yalnızca KONTROL lehine kanıttır; aynı glif olduğunun garantisi değildir. "
    "Harf/şekil parçaları eşleştirilip satırların birbirine göre boyut ve yeri de ölçülür. "
    f"Düzen sapması ≥ {LAYOUT_FAIL:.1f} ise (ör. büyük SOF / küçük SPT) FARKLI olur; geometrik eşleşmenin "
    "doğruladığı çizimde parça gruplama kaynaklı sapma bu kararı tek başına değiştirmez.",
    "<b>6. Yerel şekil karşılaştırması ve karar.</b> İkon çizgileri kalınlıktan bağımsız merkez çizgilerine "
    "indirilip parçalara ayrılır: uzun düz çizgiler ve bunlar çıkınca kalan harf/şekiller (çizgiye değen harf de "
    f"kendi boyutuyla ölçülür). İkon bütün olarak {icon_scales} kat ölçek ve "
    f"%{100 * ICON_DISPLACEMENT:.0f}'e kadar kaydırmayla hizalanır; sonra her parça boyutunun %{100 * PART_SHIFT_SHARE:.0f}'si "
    f"({MIN_PART_SHIFT}–{PART_SHIFT} px) kayabilir, ±%{100 * (PART_SCALES[-1] - 1):.0f} büyüyüp küçülebilir (yazı tipi); "
    f"uzun çizgiler yalnız {LINE_SHIFT} px kayar. Her merkez çizgisi pikseli diğer çizimde parça boyutunun "
    f"%{100 * PART_TOLERANCE:.0f}'i içinde karşılık bulmalıdır; karşılıksız bitişik bir koşu parçanın "
    f"%{100 * RUN_SHARE:.0f}'ini aşarsa yerel farktır: değişen harf, eksik/fazla çizgi veya parça. Yerel fark varsa "
    "hücre hiçbir yoldan UYUMLU olamaz (<i>geometri kontrolü</i>); THEATER/CORPS işaretleri ayrıca denetlenir. "
    "Satırın en az iki ve yarı hücresinde fark yoksa, kendisinde de fark olmayan ve doğrudan puanı ≥ "
    f"%{REVIEW * 100:.0f} olan hücre UYUMLU (<i>geometri</i>). Hücre altındaki yüzde daima ham doğrudan puandır. "
    f"Diğer hücrelerde ≥ %{PASS * 100:.0f} UYUMLU; %{REVIEW * 100:.0f}–%{PASS * 100:.0f} genelde KONTROL; daha düşükte "
    "desen tutuyorsa KONTROL, yoksa FARKLI. Kimlik rengi veya çerçeve yanlışsa FARKLI. OCR yapılmaz; belirsiz "
    "çizimler gözle incelenir. isValid() false → GEÇERSİZ; yayın içi çelişkiler KAYNAK HATASI. Sembolün kararı "
    "en kötü hücresidir.",
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
             "boyut, konum, renk, oran, çerçeve; geometri = ham puandan bağımsız yapısal eşleşme; ÇS = çerçevesiz.",
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
for key, text in [("pass", "benzerlik / geometri uygun"), ("review", "küçük fark — göz ile kontrol"),
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
    if "geometri" in c["reasons"]:
        notes.append("geometri" if c["verdict"] == "pass" else "geometri kontrolü")
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
