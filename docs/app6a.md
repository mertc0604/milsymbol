# APP-6A point-symbol support

Source: **APP-6A, Military Symbols for Land Based Systems, October 1998**,
the user-supplied 403-page publication. Catalog entries retain both the printed
Annex B page and the one-based PDF page, plus the original hierarchy identifier.

## Scope

The independent catalog contains **907 entries**: 713 warfighting entries from
Tables B-III through B-VIII and 194 single-glyph tactical entries from Table B-IX
(including fixed-affiliation entries). The current publication-image audit is
strictly **S-scheme only**; G-scheme graphics are outside that audit.
Entries include generic/parent symbols where a drawable symbol exists.
This is **point-symbol support, not certification of full APP-6A conformance**.
Annex E multipoint lines/areas, Annex B-X weather symbols, and intelligence/mapping
schemes are not implemented by this profile. Do not use it as a full tactical
graphics or map renderer.

Existing milsymbol NATO drawing primitives are reused. Naval station symbols
removed from later catalogs are explicitly included through the older 2525
primitive bundle. The missing `G-C-OXAH--` mapping now uses the existing ASW rotary
wing primitive instead of an undefined primitive. Sample icons were visually
compared with Annex D/E; the entire catalog is tested for valid rendering in four
affiliations and both APP-6A statuses. This does not establish pixel-for-pixel
agreement with every printed example.

## Library usage

```js
import ms from "milsymbol";

const infantry = new ms.Symbol("SFGPUCI----D---", {
  standard: "APP6A",
  uniqueDesignation: "1/23 INF",
});
infantry.isValid(); // true
infantry.asSVG();

// Or select the default for subsequent symbols:
ms.setStandard("APP6A");
```

For a source-level selective build:

```js
import { ms, app6a } from "./index.mjs";
ms.addIcons(app6a);
ms.setStandard("APP6A");
```

`isValid()` checks membership in the independent APP-6A point catalog, status
and the basic Annex B modifier/order-of-battle vocabulary. `isValid(true).standard`
reports this profile check separately. It is not a semantic validator for every
allowed unit/modifier combination or country code. Table III text-field availability,
character limits, equipment mobility, unit echelon/task-force and installation
flags are checked separately; later-edition text modifiers are rejected.
As with other milsymbol
profiles, rendering is permissive: check `isValid()` before accepting an imported
SIDC. Ten-character core codes are allowed with unspecified trailing fields.
Explicit per-symbol `standard` overrides the global selection; selecting `APP6`
or `2525`, or calling `reset()`, clears the APP-6A profile.

The studio offers APP-6A independently of APP-6B. It restricts status to
Present/Planned, excludes later command/towed-array amplifiers, and automatically
encodes installations as H- (or HB for feint/dummy installations). Names and
provenance come from the APP-6A catalog rather than the APP-6B npm dataset.
Its selectable catalog and manual code entry are restricted to the 713 S-scheme
tactical symbols; G-scheme tactical graphics are excluded from the editor.

## Publication ambiguities and editorial decisions

- **Light reconnaissance**, hierarchy 1.X.3.1.1.8.7, printed pp. 80 and 192:
  the publication prints seven function characters `UCRLL--`, although the
  function field must have six. The catalog normalizes it to `UCRL--`, the
  existing light-reconnaissance glyph. The original spelling and correction
  are recorded on that entry and displayed in the editor.
- **`G-C-SPM---`**, printed pp. 107-108: shared by Maintenance Collection Point
  and the Ammunition Points category. Keep the drawable maintenance point;
  omit the ammunition parent category while retaining its coded children.
- **`G-C-OXRD--`**, printed pp. 108-109 (also Annex E): shared by DLRP and
  Diversions, which have different glyphs. Both are excluded from the APP-6A
  profile rather than silently choosing the later-edition interpretation.

Supply classes I-IX (`S-G-USS1--` ... `S-G-USS9C-`, 30 entries, Annex B
pp. 85-86) have digits in the function ID. Earlier catalog extraction and SIDC
validation accepted letters only and silently dropped them; both now accept
digits.

## Reproducing the catalog

The PDF is not redistributed with this repository. With a local copy and Poppler:

```sh
pdftotext -layout APP_6_A_.pdf app6a.txt
node scripts/extract-app6a.mjs app6a.txt
node scripts/extract-app6a.mjs app6a.txt --codes
```

The extractor prints candidate catalog/code modules to stdout and diagnostics
to stderr. Review candidates before updating `studio/app6a-catalog.js` and the
APP-6A vocabulary in `src/lettersidc/metadata.js`. It intersects publication tactical codes with the existing
single-glyph renderer; it does not take names or membership from APP-6B. The
APP-6B dataset is consulted only to flag potentially missed point candidates.

Tests: `test/app6a.test.js`; build the editor with `pnpm studio:build`.

## Independent S-symbol image audit

After building the studio, run the local developer checks explicitly. Preserve a
pre-change snapshot before editing the renderer; set `APP6A_BASELINE` to that
snapshot when rendering comparison images:

```sh
export NODE_OPTIONS='--import=data:text/javascript,globalThis.__version__=%22dev%22'
node scripts/audit-app6a.mjs snapshot after
python3 scripts/extract-app6a-references.py /absolute/path/APP_6_A_.pdf
python3 scripts/extract-app6a-symbol-images.py /absolute/path/APP_6_A_.pdf
APP6A_BASELINE=output/app6a-audit/before.json node scripts/render-app6a-symbol-images.mjs
python3 scripts/compare-app6a-symbol-images.py
node scripts/audit-app6a.mjs report
```

Before/after reports require the original local `before.json` snapshot. On a
fresh checkout, capture a baseline with `snapshot before` **before modifying the
renderer**; a snapshot made afterwards is not evidence of the original behavior.
For a later review cycle, point `APP6A_BASELINE` at a separately preserved
pre-change snapshot instead.
Python must provide `pdfplumber`, Pillow and NumPy; Node must provide `sharp`
(or set `SHARP_MODULE` to its installation). Set `PYTHON` to select the interpreter.
The PDF and generated images stay local under ignored `output/app6a-audit/` and
`dist/studio/audit/`. Open `/audit/symbols/index.html` on the local studio server.

The audit extracts actual Annex D pixels, preserving PDF page/crop coordinates,
and compares them to independently rendered SVGs. It covers **706 illustrated S
entries / 3,300 image pairs** across U/F/N/H and the F/FO/UF frame modes shown in
the publication. Seven gray taxonomy headings contain no illustration:
`S-G-EW----`, `S-G-EX----`, `S-G-IM----`, `S-S-X-----`, `S-S-E-----`,
`S-S-Z-----`, `S-U-N-----`.
They are explicitly unverified, never counted as passing image comparisons.

The report shows publication, preserved pre-fix snapshot (where available),
current rendering and a cyan/magenta difference overlay. Aspect-preserving
foreground normalization and a 2px outline tolerance compensate for PDF raster
resolution. Stroke widths 1–4 are compared and the selected width is disclosed.
Color error is separate. Neither a high score nor a valid SVG certifies conformance;
remaining geometry/font differences remain visible and require review.

Reviewed edition-specific corrections include merchant labels and opaque white
framed icons, affiliation-colored unframed merchant icons, removal of later
civilian purple, solid CIV lettering, less-than-lethal mine horns, ammunition
production sizing, and isolation from overlapping EMS icon providers.
Later shape corrections (not size or position tuning): NBC lines that leave the
dots inwards and run to the bottom, an upright mortuary coffin, maintenance
recovery as a bar with end wheels, a centre line in the ordnance missile, eight
sun rays for equipment manufacture, crossed picks for mines, a claymore drawn
like the less than lethal mine, and one wheel under a wing for airports.
Unframed less than lethal, claymore and armoured-vehicle icons are no longer
clipped by their bounding box. Size-only and position-only differences normally
remain as rendered by milsymbol, except for the 90 entries explicitly selected
for correction in the local triage review described below.
The subsurface review also corrects the ten sea-mine variants, underwater decoy,
and man-made seabed installation in the existing subsurface primitive module.
Annex D's smaller horns, oval bodies, mooring stems, bottom/wave/side marks and
fine dealt lines are used only for APP-6A. The decoy's top bar is separated from
its three triangles. These twelve entries were checked against 48 independent
publication cells; two inconsistent Unknown cells remain flagged for review.

The audit flags 79 affiliation/frame image pairs with publication conflicts.
These include apparent copy/paste errors such as Unknown `S-U-WMOD--` (PDF 166)
and Hostile `S-U-NM----` (PDF 167), which show an HZ merchant ship, Hostile
`S-U-SN----` and `S-U-NBW---`, Unknown `S-F-AFUL--`, and Unknown/Hostile
`S-F-AHU---` (cells copied from other rows), plus four missile rows and the four
antitank gun rows `S-G-EWGR/EWGL/EWGM/EWGH--`, whose Annex B code meanings
disagree with the Annex D table (Annex D shifts the gun rows by one). Their
source images are retained and marked as conflicts rather than being copied into
unrelated icons. The remaining image pairs still require visual review; the
comparison score is a triage aid, not a conformance verdict.
The Unknown `S-U-WMFD--` cell (PDF 165) also differs from the other three identities:
it shows a solid arrow in a circle rather than a crossed floating mine.
The original `before.json` is never overwritten. `--resume` on the comparison
script reuses unchanged image results; omit it after changing the metric itself.

### Selected triage corrections (2–3 November 2026)

The local comparison tool's 90 `fix` decisions select 58 ground-unit entries,
17 equipment/installation entries, and 15 space, air, naval and SOF entries.
Their Annex D icon shapes, internal line weights, relative component sizes and
positions are corrected only when `metadata.app6a` is active. Shared drawing
primitives and other editions retain their existing behavior. Triage decisions
remain the user's review history and are not changed into automatic approvals.

The selected AD missile-launcher and antitank-gun entries explicitly follow the
illustration printed beside their SIDC in Annex D, including its disagreement
with the Annex B names:

| Function ID | Annex B meaning | Annex D illustration used by APP-6A |
| --- | --- | --- |
| EWMAT- | Theatre AD launcher | Short range, one bar |
| EWMAL- | Long range AD launcher | Intermediate range, two bars |
| EWMAI- | Intermediate range AD launcher | Long range, three bars |
| EWMAS- | Short range AD launcher | Theatre, T |
| EWGR-- | Recoilless antitank gun | Light, one bar |
| EWGL-- | Light antitank gun | Medium, two bars |
| EWGM-- | Medium antitank gun | Heavy, three bars |
| EWGH-- | Heavy antitank gun | Recoilless arrow |

Catalog names continue to describe Annex B. This is an explicit illustration
choice for the selected rows, not a resolution of the publication's conflicting
code meanings. The marine-life entry follows the consistent Unknown, Friend and
Neutral cells; its erroneous Hostile merchant-ship illustration is retained as
a source conflict rather than reproduced as marine life.

Regression tests are grouped in `test/app6a-triage-ground.test.js`,
`test/app6a-triage-equipment.test.js`, and `test/app6a-triage-other.test.js`.
The local pre-change snapshot is
`output/app6a-audit/triage-pre-fix-2026-11-02.json`; it includes all 713 S-scheme
entries, four affiliations and both frame modes for APP-6A, APP-6B and 2525.
The final comparison changes exactly those 90 APP-6A entries, with no changes
to the other 623 APP-6A entries or the 11,408 APP-6B/2525 SVG outputs. Selected
unframed ground bounds also retain full waves, support marks and medical stems.
The root test suite passes 21,178 assertions; the Studio build and the changed
files' ESLint check (using ECMAScript 2022 for the repository's existing syntax)
pass. The 3,300 publication comparisons and local triage data were regenerated;
automatic scores remain review aids rather than conformity certificates.

### Additional triage corrections (3 November 2026)

The next 28 `fix` decisions add 22 ground-unit entries and six equipment,
naval, underwater and SOF entries, bringing the selected total to 118. The
additional shapes and their bounds are guarded by `metadata.app6a`; the shared
drawing primitives and other editions keep their existing output. The user's
triage decisions remain unchanged.

The round's snapshot is
`output/app6a-audit/review-2026-11-03/before.json`. Comparing all 713 S-scheme
entries across four affiliations, two frame modes and three editions changes
exactly the 28 newly selected APP-6A entries. The other APP-6A entries, including
the previous 90 corrections, and all 11,408 APP-6B/2525 outputs are unchanged.
The new regression files are `test/app6a-triage-ground-round2.test.js` and
`test/app6a-triage-naval-round2.test.js`; they also exercise unframed bounds and
different stroke widths. The root test suite passes 23,027 assertions; the
isolation check covers 17,112 SVG comparisons.

### Third pass over the selected rows (4 November 2026)

The remaining differences in the `fix` rows were measured directly. Each
publication cell was mapped into milsymbol's SVG units through the symbol's
frame box, then compared with the current drawing on the same grid. Lines,
arcs, circles, labels and part positions were fitted per identity, and the
drawings were redrawn to those measurements. Every change is guarded by
`metadata.app6a` and limited to the selected rows; the shared icon parts are
unchanged:

- **Ground units (`ground.js`):**
  - The signal bolt is flatter in the Unknown and Hostile frames, and each
    signal label sits individually above it. The same flatter geometry applies
    to the reconnaissance diagonal in the Unknown and Hostile frames.
  - Chemical units draw their dots lower and further in, with the lines ending
    at the bottom of the body.
  - Supply rows: the Neutral supply bar sits lower; ammunition, medical and
    aviation-fuel (glass and rotor) shapes follow the publication's
    proportions.
  - Individual shapes follow the publication's proportions and placements: the
    airport wheel and bar, the antitank air-assault V (and the Unknown legs),
    the Vulcan barrel and the Friend/Neutral air-defence dome, the tracked
    mortar, the engineer bracket, the wheeled security body, the rocket
    launchers on wheels, and the riverine waterline (Unknown and Hostile).
  - The large-configuration arcs and the EW label are repositioned.
- **Installations (`installations.js`):** the naval-base and ship-construction
  rings are octagons, with the ring and crossbar per frame.
- **Sea surface (`sea.js`):** the law-enforcement vessel has a narrower keel
  and a thin line beside the stripe.
- **Subsurface (`subsurface.js`):** the conventional submarine and the other
  submersible are positioned and sized per frame.

Unframed bounds are extended to these drawings.
`test/app6a-triage-round3.test.js` records the measured geometry, and the
earlier triage tests were updated where they asserted the replaced shapes.
Compared with the pre-round-2 snapshot, 68 APP-6A rows changed in total. All of
them are rows marked `fix`; APP-6 and 2525 are byte-identical and every symbol
stays valid (`output/app6a-audit/review-2026-11-04/verify-isolation.mjs`). The
root test suite passes 23,111 assertions.

For the 118 rows marked `fix`, the report's row verdicts changed from 36 UYUMLU,
71 KONTROL and 3 FARKLI to 65 UYUMLU, 43 KONTROL and 2 FARKLI. Their cells
changed from 292 UYUMLU and 174 KONTROL to 391 UYUMLU and 79 KONTROL.

The local sheet `output/app6a-audit/APP6A-son-durum-karsilastirma.pdf` (built by
`review-2026-11-04/before-after.py`) shows, for the 54 rows whose drawing
changed in this pass, the publication cell, the drawing before the pass and the
current drawing for each identity.

The remaining flags are of four kinds:

- **Installation frames:** the publication's installation frames place the top
  bar differently (`IBN`, `IMS`).
- **Air and subsurface frames:** their Unknown and Neutral frames have other
  proportions.
- **Typography:** the condensed publication typeface is wider or taller than
  Arial.
- **Solid shapes:** small centre-line artefacts on solid shapes (hulls, dots).

The space-station ring is the same drawing in a slightly flatter perspective.

### Report verdicts and their limits

`scripts/report-app6a-symbol-pdf.py` turns the comparison into the PDF report
and the local triage data. Its metrics are pure functions in
`scripts/app6a_visual_verdicts.py` and are tested with synthetic drawings (and,
when the local audit corpus exists, publication cells) by
`scripts/tests/test_app6a_visual_verdicts.py`:

```sh
PYTHONPATH=scripts python3 -m unittest discover -s scripts/tests -v
python3 scripts/report-app6a-symbol-pdf.py
```

Besides the direct in-place similarity, the registered icon pattern and the
part layout, every cell gets a local shape comparison:

- The icon line work, without the frame band, is reduced to stroke centre lines.
  Thin grey scanned lines count as ink, and solid shapes add an inner outline.
  The lines are split into parts: long straight lines, and the letters and
  shapes that remain once those lines are removed. A letter standing on a line
  is therefore judged at its own size.
- The whole icon is registered by its boxes, or by the uniform scale and shift
  that best explains it, within 0.75–1.33× and 15 % of the canvas. Each part
  may then move by 20 % of its size (4–6 px) and change size by ±12 % to allow
  for another typeface. Long lines may only move by 3 px.
- Every centre-line pixel must then lie within 8 % of its part's size of the
  other drawing (1.25–6 px, plus slack for bold strokes). A connected run of
  unexplained pixels longer than 15 % of its part is a local difference: a
  changed letter, a missing or added line or part, or a resized part. The limit
  is 3–12 px, plus the shorter stroke ends of a bolder partner. A local
  difference blocks every pass route.
- Theater and corps chevrons are compared by a separate decoration signature.
  The frame's side strips that hold them are left out of the local comparison.

A cell passes when its direct score is at least 92 % and it shows no local
difference. A cell scoring at least 78 % also passes when it shows no local
difference itself and at least two cells (and at least half) of its row show
none either. Wrong colour and wrong frame still fail first. The percentage
printed under a cell is always the raw direct score.

The thresholds were calibrated on 3 November 2026 against three sets:
synthetic labels, the pre-fix renderings of the 118 rows marked `fix`
(rasterized from the preserved snapshots), and visual review of the cells whose
verdict changed.

- **Synthetic labels.** Every letter change among 17 Arial 22 letters is
  rejected, both free-standing and standing on a line (264 pairs each,
  including L→T and H→X). The same letters drawn bolder pass.
- **Pre-fix renderings.** 475 cells differ from the current rendering. They
  are rejected in 109 of 110 row groups. 21 cells still pass, mostly entries
  whose fix only thinned strokes or nudged parts by a few pixels. The previous
  direct-score rule let 26 of these cells pass.
- **User's example.** MAINTENANCE RECOVERY CORPS (`S-G-USXRC-`, PDF 233) passes
  in all four identities. The THEATER (`USXRT`) and OPS (`UUSO`) rows drawn in
  its place do not.

The report now counts 1,377 UYUMLU, 1,646 KONTROL and 198 FARKLI image pairs,
plus 79 publication conflicts. Compared with the previous triage data:

| Verdict change | Image pairs | Reason |
| --- | --- | --- |
| KONTROL → UYUMLU | 412 | Mostly equivalent drawings at another scale or stroke width |
| FARKLI → UYUMLU | 18 | All in rows already fixed or marked `skip` |
| UYUMLU → KONTROL | 396 | Mostly a measured local difference, such as a second arrow chevron, a different crossbar or a misplaced line |

Limits:

- **No text recognition.** The comparison is geometric and does not read
  letters.
- **Lines near the frame.** Lines within 12 px of the frame, such as side lines
  hugging it, are seen only by the direct score.
- **Theater/corps rows.** The side strips are not compared locally.
- **Solid shapes.** Solid shapes are compared by an inner outline, so very small
  dots carry little weight.
- **Borderline cases.** Changes at the part limits (a part 12 % larger, a line
  3 px away) remain judgement calls. The verdicts are review aids, not
  conformance certificates.

## Integration and distribution

APP-6A follows the normal `ms.addIcons(app6a)` registration path. Its bundle is
an explicit list of domain modules in `src/lettersidc.js`, not derived from
`app6b` and not dependent on the `std2525bextra` provider. Naval station geometry
is shared through the existing sea/subsurface icon-part modules; the 2525B extra
module retains its legacy names. Glyph definitions and edition differences live
in the existing `src/lettersidc/sidc/` and `src/iconparts/` modules. SIDC vocabulary,
validation and Table III rules live in the existing letter metadata module.
That registered metadata provider supplies an optional `validation` result
(`valid` and extended `details`), recalculated by `setOptions`. The general
`isValid()` consumer does not import a standard-specific module. APP-6A starts
with a failed validation result until a letter provider validates it, so a
numeric SIDC or a missing letter provider cannot bypass the edition checks.
There is no separate APP-6A renderer, global provider registry or `src/standards`
layer. EMS and US tactical providers guard against overriding APP-6A definitions.

Registration-isolation tests compare 14,512 combinations of catalog entry,
identity, status and frame with APP-6A alone and with all bundles registered in
both orders. SVG output and public validation results must match. This verifies
integration isolation, not conformance of every illustration to the publication.

`studio/app6a-catalog.js` contains names/provenance for the editor and independent
catalog tests only. It is not exported from the library entry point or bundled
into the renderer. Audit scripts remain developer tools, not runtime dependencies.

The software's MIT license does not establish redistribution rights for the
supplied NATO PDF or extracted page images. They are excluded from public builds.
Publication of reference material requires its own rights review; this project
does not assert ownership of the standard or official NATO endorsement.
