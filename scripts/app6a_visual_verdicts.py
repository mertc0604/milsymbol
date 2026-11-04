"""Pure image metrics and cell verdicts for the APP-6A visual audit.

No report generation, cache writes, or dataset loading takes place at import.
"""
import itertools
import numpy as np
from PIL import Image
from scipy import ndimage
from scipy.optimize import linear_sum_assignment
from scipy.signal import fftconvolve
from skimage.morphology import skeletonize
from skimage.transform import hough_line, hough_line_peaks

SIZE = 256
TOLERANCE = 6  # px on the 256px normalized canvas (~2.3 %)
PASS, REVIEW = 0.92, 0.78
PATTERN_OK = 0.80  # registered icon pattern: same drawing at another size/position
PATTERN_TOLERANCE = 0.04  # of the publication icon's size, at least 4 px, after registration
SCALES = np.geomspace(0.4, 3.0, 21)
ANGLES = (-6, 0, 6)
LAYOUT_WARN, LAYOUT_FAIL = 1.0, 1.6  # part layout deviation (1.0 = parts 25 % off in size or 15 % in position)
EDGE_BAND = 12  # px of the frame (and decorations hugging it) ignored for the icon

# Local shape comparison (geometry_comparison), in px of the 256 px canvas.
# Calibrated against synthetic wrong letters (none may pass), the pre-fix
# renderings of the symbols marked "fix" in the triage, and visual review.
ICON_SCALE, ICON_ASPECT, ICON_DISPLACEMENT = 1.33, 1.2, 0.15  # whole-icon registration bounds
PART_SHIFT_SHARE, MIN_PART_SHIFT, PART_SHIFT = 0.2, 4, 6  # how far a part may move: share of its size, px
PART_SCALES = (0.89, 0.945, 1.0, 1.06, 1.12)  # and how much it may be resized (another typeface)
LINE_SHIFT = 3  # long straight lines only move, by up to this many px
PART_TOLERANCE, MIN_TOLERANCE = 0.08, 1.25  # centre line tolerance: share of the part size, at least px
RESIDUAL_TOLERANCE = 6.0  # and at most px (the largest parts)
RUN_SHARE, MIN_RUN, RESIDUAL_MAX = 0.15, 3.0, 12.0  # unexplained run accepted: share of its part, px
RUN_JOIN = 2  # unexplained pixels this close belong to one difference
LONG_LINE = 30  # straight runs this long are parts of their own
CHEVRON_ARM = 20  # oblique straight strokes this long in the side strips: theater/corps marks
SOLID_DEPTH = 4  # half-width from which a shape counts as solid
THIN_INK = 40  # a thin line this much darker than its surroundings is line work
THIN_STROKE, STROKE_SLACK, MAX_SLACK = 1.5, 0.5, 2.0  # plain line half-width; extra tolerance per px beyond, capped
MIN_STROKES = 15  # centre line pixels needed for a comparison


def fit(a, stretch):
    """Crop to the drawn foreground and fit it on a 256px canvas. With
    stretch=True both axes fill the box, which removes a pure frame aspect
    ratio difference so the icon inside the frame can still be compared."""
    y, x = np.where(a.min(axis=2) < 215)
    if not len(x):
        return a
    # The report loads images as int arrays for arithmetic; PIL needs uint8.
    crop = Image.fromarray(a[y.min():y.max() + 1, x.min():x.max() + 1].astype(np.uint8))
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


def without_side_strips(mask, fg):
    """Clear the frame's left and right 22 %, where theater/corps chevrons sit."""
    xs = np.nonzero(fg.any(axis=0))[0]
    w = xs.max() - xs.min()
    mask = mask.copy()
    mask[:, :int(xs.min() + 0.22 * w)] = False
    mask[:, int(xs.max() - 0.22 * w) + 1:] = False
    return mask


def ink(a):
    """Line work of a drawing: black, or a thin line clearly darker than what
    surrounds it. Thin scanned lines are grey, not black, on any fill."""
    fg, dark = masks(a)
    a = a.astype(int)
    luma = (a[..., 0] * 299 + a[..., 1] * 587 + a[..., 2] * 114) // 1000
    valley = ndimage.grey_closing(luma, size=(7, 7)) - luma > THIN_INK
    return fg, dark | (valley & fg)


def icon_mask(a, framed, echelon_marks, layers=None):
    """Central icon line work, without the frame. Theater/corps chevrons at
    the frame's left and right edges are excluded as frame decorations.
    `layers`: (foreground, line work) to use instead of masks(), such as
    ink(); the frame band is then measured from the filled frame outline,
    since light scan halos inside a pale fill are not the outside."""
    fg, dark = layers or masks(a)
    if framed:
        inside = ndimage.binary_fill_holes(fg) if layers else fg
        ic = dark & (ndimage.distance_transform_edt(inside) >= EDGE_BAND)
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


def judge(c, row_pattern, row_failing, row_layout, row_geometry=False):
    """Cell verdict. Reasons explain a KONTROL/FARKLI result in the cell note."""
    c["reasons"] = []
    if c["colour"]:
        c["reasons"].append("renk")
        return "fail"
    if c["frame"] and c["frameScore"] < REVIEW:
        c["reasons"].append("çerçeve")
        return "fail"
    geometry = c.get('geometry') or {}
    equivalent = geometry.get('equivalent', False)
    # A measured local difference (changed letter, missing/added line or
    # part, unreasonable icon scale) blocks every pass route.
    contradiction = (geometry.get('decorationMismatch', False) or
                     (geometry.get('comparable', False) and geometry.get('residual', 0) >= 1))
    if row_geometry and not contradiction and c['score'] >= REVIEW:
        c['reasons'].append('geometri')
        return 'pass'
    if row_layout is not None and row_layout >= LAYOUT_FAIL and not equivalent:
        # Parts drawn out of proportion to each other (e.g. SOF over a small
        # SPT): resizing the whole icon cannot explain this.
        c["reasons"].append("düzen")
        return "fail"
    if c["score"] >= PASS and not contradiction:
        return "pass"
    if contradiction:
        c['reasons'].append('geometri')
        if c['score'] >= PASS:
            return 'review'
    same_pattern = row_pattern is not None and row_pattern >= PATTERN_OK
    if c["score"] >= REVIEW and (same_pattern or not row_failing):
        return "review"
    if same_pattern:
        c["reasons"].append("boyut/konum")
        return "review"
    c["reasons"].append("desen")
    return "fail"


def _box(mask):
    y, x = np.nonzero(mask)
    return (int(y.min()), int(x.min()), int(y.max()) + 1, int(x.max()) + 1) if len(x) else None


def _long_lines(skeleton, length=LONG_LINE):
    """Centre line pixels on straight runs of at least `length` px (box
    edges, frame-spanning lines), and those of them that run obliquely. A
    letter or shape touching such a line is still compared as a part of its
    own size."""
    ys, xs = np.nonzero(skeleton)
    on_line, oblique = np.zeros(len(ys), bool), np.zeros(len(ys), bool)
    if len(ys) >= length:
        votes, angles, distances = hough_line(skeleton, theta=np.linspace(-np.pi / 2, np.pi / 2, 180, endpoint=False))
        for _, angle, distance in zip(*hough_line_peaks(votes, angles, distances, min_distance=3, min_angle=3,
                                                        threshold=length, num_peaks=60)):
            near = np.abs(xs * np.cos(angle) + ys * np.sin(angle) - distance) <= 1.5
            along = (ys * np.cos(angle) - xs * np.sin(angle))[near]
            index = np.nonzero(near)[0][np.argsort(along)]
            along = np.sort(along)
            # Unbroken stretches (gaps up to 3 px) along the line.
            starts = np.r_[0, np.nonzero(np.diff(along) > 3)[0] + 1]
            for start, end in zip(starts, np.r_[starts[1:], len(along)]):
                if along[end - 1] - along[start] + 1 >= length:
                    on_line[index[start:end]] = True
                    oblique[index[start:end]] |= abs(np.sin(2 * angle)) > 0.5
    lines, slanted = np.zeros_like(skeleton), np.zeros_like(skeleton)
    lines[ys[on_line], xs[on_line]] = True
    slanted[ys[oblique], xs[oblique]] = True
    return lines, slanted


def _strokes(a, framed, marks):
    """Icon line work as stroke centre lines: pixel coordinates, parts, slack
    and whether each pixel belongs to a part attached to the frame. The frame
    band is left out; theater/corps chevrons are compared separately."""
    fg, dark = ink(a) if framed else masks(a)
    mask = icon_mask(a, framed, False, (fg, dark) if framed else None)
    attached = np.zeros_like(mask)
    if framed:
        labels, _ = ndimage.label(dark)
        edge = ndimage.distance_transform_edt(ndimage.binary_fill_holes(fg)) <= 3
        on_frame = np.unique(labels[dark & edge])
        attached = mask & np.isin(labels, on_frame[on_frame > 0])
    depth = ndimage.distance_transform_edt(mask)
    # Thinning collapses a solid shape (hull, dot, wedge) to a few pixels, so
    # its inner outline at SOLID_DEPTH is drawn too. For a stroke just over
    # that width this outline lies on the centre line and changes nothing.
    core = depth >= SOLID_DEPTH
    skeleton = skeletonize(mask) | (core & ~ndimage.binary_erosion(core))
    # Parts: long straight lines, and the connected letters and shapes left
    # once those lines are taken out.
    lines, slanted = _long_lines(skeleton)
    if marks and framed:
        # Theater/corps chevrons: oblique straight strokes in the side strips.
        chevrons = _long_lines(skeleton, CHEVRON_ARM)[1] & ~without_side_strips(skeleton, fg)
        skeleton &= ~chevrons
        lines &= ~chevrons
    ys, xs = np.nonzero(skeleton)
    eight = np.ones((3, 3))
    rest, count = ndimage.label(skeleton & ~lines, structure=eight)
    straight = ndimage.label(lines, structure=eight)[0]
    part = np.where(lines[ys, xs], straight[ys, xs] + count, rest[ys, xs])
    size = np.ones(part.max() + 1 if len(part) else 1)
    for i in np.unique(part):
        sel = part == i
        size[i] = max(np.ptp(ys[sel]), np.ptp(xs[sel])) + 1
    # Bold strokes and solid shapes: their centre lines bend at corners and
    # junctions by about half the stroke width, so they get more slack.
    slack = np.clip(depth[ys, xs] - THIN_STROKE, 0, MAX_SLACK)
    return dict(skeleton=skeleton, ys=ys, xs=xs, weight=np.ones(len(ys)), slack=slack, part=part,
                halfwidth=float(np.median(depth[ys, xs])) if len(ys) else 0.0,
                straight=lines[ys, xs], size=size[part] if len(part) else size[:0], attached=attached[ys, xs],
                icon=_box(skeleton & ~attached), lines=_box(skeleton), all=_box(fg))


def _distance(skeleton):
    if not skeleton.any():
        return np.full(skeleton.shape, np.inf)
    return ndimage.distance_transform_edt(~skeleton)


def _bbox_map(source, target):
    """Axis-aligned map of one bounding box (y0, x0, y1, x1) onto another."""
    sy = (target[2] - target[0]) / max(1, source[2] - source[0])
    sx = (target[3] - target[1]) / max(1, source[3] - source[1])
    return (sy, target[0] - sy * source[0], sx, target[1] - sx * source[1])


def _inverse(m):
    return (1 / m[0], -m[1] / m[0], 1 / m[2], -m[3] / m[2])


def _unexplained(src, m, target_distance):
    """Centre line pixels of `src` without a counterpart in the other image.

    Pixels are mapped with `m`; then every part (connected stroke group: a
    letter, a shape, a line) is moved as a whole by up to PART_SHIFT px and
    resized by PART_SCALES to meet the other drawing, so parts may sit a
    little differently or come from another typeface but keep their own
    shape. A pixel is unexplained if it stays farther from the other drawing
    than the part's tolerance: RESIDUAL_TOLERANCE, or PART_TOLERANCE of the
    part's size for small parts (a 14 px letter must match within 1.4 px)."""
    ys, xs, weight, part = src['ys'], src['xs'], src['weight'], src['part']
    if not len(ys):
        return np.zeros(0, bool)
    my, mx = ys * m[0] + m[1], xs * m[2] + m[3]
    count = part.max() + 1
    centre = np.zeros((count, 2))
    for i in np.unique(part):
        sel = part == i
        centre[i] = my[sel].mean(), mx[sel].mean()
    tolerance = np.clip(PART_TOLERANCE * src['size'], MIN_TOLERANCE, RESIDUAL_TOLERANCE) + STROKE_SLACK * src['slack']
    steps = np.arange(-PART_SHIFT, PART_SHIFT + 1)
    dy, dx = [v.ravel() for v in np.meshgrid(steps, steps, indexing='ij')]
    # A part may move by up to PART_SHIFT_SHARE of its own size (5-10 px).
    # Long straight lines carry the drawing's overall shape (a box is not a
    # circle): they may only move by LINE_SHIFT px, not be resized.
    reach = np.zeros(count)
    reach[part] = np.where(src['straight'], LINE_SHIFT,
                           np.clip(PART_SHIFT_SHARE * src['size'], MIN_PART_SHIFT, PART_SHIFT))
    straight = np.zeros(count, bool)
    straight[part] = src['straight']
    h, w = target_distance.shape
    bad, penalty = [], []
    for scale in PART_SCALES:
        py = centre[part, 0] + scale * (my - centre[part, 0])
        px = centre[part, 1] + scale * (mx - centre[part, 1])
        ty = np.clip(np.round(py[:, None] + dy), 0, h - 1).astype(int)
        tx = np.clip(np.round(px[:, None] + dx), 0, w - 1).astype(int)
        bad.append(target_distance[ty, tx] > tolerance[:, None])
        # Among equally good placements the least moved one wins.
        penalty.append(1e-3 * (np.hypot(dy, dx) + 10 * abs(np.log(scale))))
    bad, penalty = np.concatenate(bad, axis=1), np.concatenate(penalty)
    members = np.zeros((count, len(ys)))
    members[part, np.arange(len(ys))] = weight
    cost = members @ bad
    cost[np.hypot(*np.tile([dy, dx], len(PART_SCALES)))[None, :] > reach[:, None]] = np.inf
    resized = np.repeat(np.array(PART_SCALES) != 1, len(dy))
    cost[np.ix_(straight, resized)] = np.inf
    best = np.argmin(cost + penalty, axis=1)
    return bad[np.arange(len(ys)), best[part]]


def _runs(src, unexplained, retreat=0.0):
    """Every connected run of unexplained centre line pixels, as its weight
    relative to what its parts tolerate (>= 1: a real local difference) and
    its location. A run may weigh RUN_SHARE of its part's size, at least
    MIN_RUN and at most RESIDUAL_MAX px: 4 px of an extra bar change a 16 px
    letter, but not a 120 px outline. `retreat`: how much farther the other
    drawing's centre lines stop short of their stroke ends, being bolder."""
    mask = np.zeros(src['skeleton'].shape, bool)
    ys, xs = src['ys'][unexplained], src['xs'][unexplained]
    mask[ys, xs] = True
    # Unexplained pixels a few px apart (both ends of a changed letter bar)
    # are one local difference.
    labels, count = ndimage.label(ndimage.binary_dilation(mask, iterations=RUN_JOIN) if mask.any() else mask)
    if not count:
        return []
    ids = labels[ys, xs]
    weights = np.bincount(ids, src['weight'][unexplained], count + 1)
    limits = np.clip(RUN_SHARE * src['size'][unexplained], MIN_RUN, RESIDUAL_MAX) + 2 * src['slack'][unexplained] \
        + retreat
    found = []
    for i in range(1, count + 1):
        sel = ids == i
        found.append((float(weights[i] / np.median(limits[sel])),
                      [int(round(ys[sel].mean())), int(round(xs[sel].mean()))]))
    return found


def _decoration_signature(image):
    """Long frame-attached oblique strokes on each side, unlike short icon tips."""
    normalized = fit(image, True)
    mask = icon_mask(normalized, True, False) & ~free_parts(normalized, True, False)
    mask = skeletonize(mask, method='lee')
    signature = []
    for band in (mask[:, :72], mask[:, 184:]):
        votes, _, _ = hough_line(band, theta=np.linspace(-np.pi / 2, np.pi / 2, 91))
        signature.append(bool(int(votes.max()) >= 15))
    return signature


def _central(strokes, image):
    """Centre line pixels outside the frame's left and right side strips."""
    inside = without_side_strips(np.ones(image.shape[:2], bool), masks(image)[0])
    return inside[strokes['ys'], strokes['xs']]


def _icon_map(source, target):
    """Whole-icon registration of one box onto another, with its scale,
    aspect change and displacement; None beyond reasonable bounds."""
    if not source or not target:
        return None
    m = _bbox_map(source, target)
    scale, ratio = float(np.sqrt(m[0] * m[2])), float(m[2] / m[0])
    displacement = float(np.hypot((source[0] + source[2] - target[0] - target[2]) / 2,
                                  (source[1] + source[3] - target[1] - target[3]) / 2) / SIZE)
    if 1 / ICON_SCALE <= scale <= ICON_SCALE and 1 / ICON_ASPECT <= ratio <= ICON_ASPECT \
            and displacement <= ICON_DISPLACEMENT:
        return m, dict(iconScale=scale, iconAspect=ratio, iconDisplacement=displacement)
    return None


def _fit_map(e, a, de, da):
    """The uniform scale (0.75-1.33x) and shift (up to 15 %) that best lay
    one drawing's centre lines onto the other's: a whole-icon registration
    that does not depend on bounding boxes, which an extra tip or a mark
    touching the icon would change."""
    if min(len(e['ys']), len(a['ys'])) < MIN_STROKES:
        return None
    cy, cx = a['ys'].mean(), a['xs'].mean()
    ey, ex = e['ys'].mean(), e['xs'].mean()
    h, w = de.shape
    reach = ICON_DISPLACEMENT * SIZE
    steps = np.arange(-24, 25, 3)
    dy, dx = [v.ravel() for v in np.meshgrid(steps, steps, indexing='ij')]
    best = None
    for scale in np.geomspace(1 / ICON_SCALE, ICON_SCALE, 13):
        ty = np.clip(np.round(ey + scale * (a['ys'] - cy))[:, None] + dy, 0, h - 1).astype(int)
        tx = np.clip(np.round(ex + scale * (a['xs'] - cx))[:, None] + dx, 0, w - 1).astype(int)
        cost = np.minimum(de[ty, tx], 6).mean(axis=0)
        i = int(np.argmin(cost))
        if best is None or cost[i] < best[0]:
            best = (cost[i], scale, dy[i], dx[i])
    _, scale, dy, dx = best
    m = (scale, ey + dy - scale * cy, scale, ex + dx - scale * cx)
    displacement = float(np.hypot(m[1] + (scale - 1) * cy, m[3] + (scale - 1) * cx) / SIZE)
    if displacement > ICON_DISPLACEMENT or np.hypot(dy, dx) > reach:
        return None
    return m, dict(iconScale=float(scale), iconAspect=1.0, iconDisplacement=displacement)


def geometry_comparison(expected, actual, framed, marks=False):
    """Local shape comparison of the icon line work, independent of stroke width.

    Both drawings are reduced to stroke centre lines (the frame band left
    out) and split into parts: long straight lines, and the letters and
    shapes left once those are taken out. Candidate registrations: as drawn,
    frame boxes stretched onto each other, and the whole icon (free parts, or
    all line work) scaled 0.75-1.33x and moved up to 15 %. Frame-attached and
    free parts each take the registration that explains them best; then each
    part may move a few px and change size a little (another typeface), but
    must keep its shape. The heaviest connected run of centre line pixels
    still unexplained, relative to what its part tolerates, is the residual
    (>= 1: a changed letter, a missing or added line or part, a resized
    part). A large frame cannot drown it out: runs are measured locally, not
    as a share of the whole drawing.
    """
    expected, actual = np.asarray(expected), np.asarray(actual)
    e, a = _strokes(expected, framed, marks), _strokes(actual, framed, marks)
    decorations_e = _decoration_signature(expected) if marks and framed else []
    decorations_a = _decoration_signature(actual) if marks and framed else []
    decoration_mismatch = decorations_e != decorations_a
    result = dict(equivalent=False, comparable=False, decorationMismatch=bool(decoration_mismatch),
                  decorationsExpected=decorations_e, decorationsActual=decorations_a,
                  strokesExpected=int(len(e['ys'])), strokesActual=int(len(a['ys'])))
    if max(len(e['ys']), len(a['ys'])) < MIN_STROKES:
        return result
    maps, scales = {'drawn': (1.0, 0.0, 1.0, 0.0)}, {}
    if e['all'] and a['all']:
        maps['frame'] = _bbox_map(a['all'], e['all'])
    for name in ('icon', 'lines'):
        found = _icon_map(a[name], e[name])
        if found:
            maps[name], scales[name] = found
    de, da = _distance(e['skeleton']), _distance(a['skeleton'])
    found = _fit_map(e, a, de, da)
    if found:
        maps['fit'], scales['fit'] = found
    misses = {name: (_unexplained(a, m, de), _unexplained(e, _inverse(m), da)) for name, m in maps.items()}
    chosen, unexplained_a, unexplained_e = {}, np.zeros(len(a['ys']), bool), np.zeros(len(e['ys']), bool)
    for part in ('attached', 'free'):
        sel_a = a['attached'] if part == 'attached' else ~a['attached']
        sel_e = e['attached'] if part == 'attached' else ~e['attached']
        cost = {name: float(a['weight'][misses[name][0] & sel_a].sum() + e['weight'][misses[name][1] & sel_e].sum())
                for name in maps}
        chosen[part] = min(cost, key=lambda name: (cost[name], name != 'drawn'))
        unexplained_a |= misses[chosen[part]][0] & sel_a
        unexplained_e |= misses[chosen[part]][1] & sel_e
    if marks and framed:
        # The side strips hold the theater/corps chevrons, compared by the
        # decoration signature instead.
        unexplained_a &= _central(a, actual)
        unexplained_e &= _central(e, expected)
    runs = [(w, at, 'extra') for w, at in _runs(a, unexplained_a, max(0.0, e['halfwidth'] - a['halfwidth']))]
    runs += [(w, at, 'missing') for w, at in _runs(e, unexplained_e, max(0.0, a['halfwidth'] - e['halfwidth']))]
    worst = max(runs, default=(0.0, None, None))
    residual = float(worst[0])
    result.update(scales.get(chosen['free'], {}))
    result.update(comparable=True, registration=chosen, residual=residual, residualSide=worst[2],
                  residualAt=worst[1], equivalent=bool(min(len(e['ys']), len(a['ys'])) >= MIN_STROKES
                                                       and residual < 1 and not decoration_mismatch))
    return result


def register_pattern(e_sk, a_sk):
    """Register the milsymbol icon onto the publication icon: the best F1 over
    scale, small rotation and (FFT cross-correlation) shift, as (score, scale,
    angle, shift)."""
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
    return best


def icon_metrics(expected, actual, framed, marks):
    """(pattern score, icon scale, angle, shift, part layout, geometry) of
    one cell. Without line work to register (solid shapes, empty icons) the
    pattern values are None, but layout and geometry are still measured."""
    e_sk, a_sk = line_work(expected, framed, marks), line_work(actual, framed, marks)
    registered = register_pattern(e_sk, a_sk) if e_sk.sum() >= 10 and a_sk.sum() >= 10 else (None,) * 4
    deviation = layout(free_parts(expected, framed, marks), free_parts(actual, framed, marks))
    return registered + (deviation, geometry_comparison(expected, actual, framed, marks))


def colour_mismatch(expected, actual):
    """Identity fill hue and the loss/addition of identity colour, not brightness."""
    if abs(coloured_share(expected) - coloured_share(actual)) > .5:
        return True
    hues = []
    for image in (expected, actual):
        a = image.astype(float)
        chroma = a.max(axis=2) - a.min(axis=2)
        saturated = a[chroma > 60]
        if len(saturated) < 20:
            return False
        colour = np.median(saturated, axis=0)
        hue = colour - colour.min()
        hues.append(hue / max(1., np.linalg.norm(hue)))
    return bool(np.dot(*hues) < .75)
