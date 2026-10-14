# APP-6A point-symbol support

Source: **APP-6A, Military Symbols for Land Based Systems, October 1998**,
the user-supplied 403-page publication. Catalog entries retain both the printed
Annex B page and the one-based PDF page, plus the original hierarchy identifier.

## Scope

The independent catalog contains **877 entries**: 683 warfighting entries from
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

After building the studio, run the local developer checks explicitly:

```sh
export NODE_OPTIONS='--import=data:text/javascript,globalThis.__version__=%22dev%22'
node scripts/audit-app6a.mjs snapshot after
python3 scripts/extract-app6a-references.py /absolute/path/APP_6_A_.pdf
python3 scripts/extract-app6a-symbol-images.py /absolute/path/APP_6_A_.pdf
node scripts/render-app6a-symbol-images.mjs
python3 scripts/compare-app6a-symbol-images.py
node scripts/audit-app6a.mjs report
```

Before/after reports require the original local `before.json` snapshot. On a
fresh checkout, capture a baseline with `snapshot before` **before modifying the
renderer**; a snapshot made afterwards is not evidence of the original behavior.
Python must provide `pdfplumber`, Pillow and NumPy; Node must provide `sharp`
(or set `SHARP_MODULE` to its installation). Set `PYTHON` to select the interpreter.
The PDF and generated images stay local under ignored `output/app6a-audit/` and
`dist/studio/audit/`. Open `/audit/symbols/` on the local studio server.

The audit extracts actual Annex D pixels, preserving PDF page/crop coordinates,
and compares them to independently rendered SVGs. It covers **678 illustrated S
entries / 3,188 image pairs** across U/F/N/H and the F/FO/UF frame modes shown in
the publication. Five gray taxonomy headings contain no illustration:
`S-G-EW----`, `S-G-EX----`, `S-G-IM----`, `S-S-X-----`, `S-U-N-----`.
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

Two printed cells appear to be copy/paste errors: Unknown `S-U-WMOD--` (PDF 166)
and Hostile `S-U-NM----` (PDF 167) show an HZ merchant ship. Their source images
are retained and marked as conflicts, not copied into mine/marine-life icons.
The original `before.json` is never overwritten. `--resume` on the comparison
script reuses unchanged image results; omit it after changing the metric itself.

## Integration and distribution

APP-6A follows the normal `ms.addIcons(app6a)` registration path. Its bundle is
assembled in `src/lettersidc.js`; glyph definitions and edition differences live
in the existing `src/lettersidc/sidc/` and `src/iconparts/` modules. SIDC vocabulary,
validation and Table III rules live in the existing letter metadata module.
There is no separate APP-6A renderer, global provider registry or `src/standards`
layer. EMS and US tactical providers guard against overriding APP-6A definitions.

`studio/app6a-catalog.js` contains names/provenance for the editor and independent
catalog tests only. It is not exported from the library entry point or bundled
into the renderer. Audit scripts remain developer tools, not runtime dependencies.

The software's MIT license does not establish redistribution rights for the
supplied NATO PDF or extracted page images. They are excluded from public builds.
Publication of reference material requires its own rights review; this project
does not assert ownership of the standard or official NATO endorsement.
