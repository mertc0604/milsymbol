# Military Symbol Studio

The repository includes an English military symbol editor in `studio/`, with a light interface, a searchable library, tabbed configuration, and a persistent export preview.

## Run locally

```bash
npm install
npm run studio:build
npm run studio:serve
```

Open `http://127.0.0.1:4173`.

The build creates `dist/studio/`, including a normalized searchable catalog generated from the standard data packages already used by milsymbol. The site offers MIL-STD-2525C/D/E and APP-6A/B/D/E views. APP-6E uses a compatibility catalog. FM 1-02.2 is not offered in the editor; the underlying library is unchanged. Symbols can be exported as SVG or PNG.

The Text amplifiers tab provides 27 controls grouped by purpose: identity and
organization, information and assessment, time/location/movement, equipment and
installations, and engagement/maritime. New fields include quantity,
reinforced/reduced, staff comments, evaluation rating, combat effectiveness,
IFF/SIF/AIS, altitude/depth, speed, special headquarters, country text,
platform type, teardown time, common identifier, installation composition,
engagement bar and type, guarded unit, and special designator. Each field has
its identifier and guidance; actual placement follows the renderer's symbol-set
rules. APP-6A retains publication-specific applicability and length limits.
Reset clears every amplifier, including fields hidden by the current edition.
Text values are included in SVG/PNG, separately from the SIDC.

Graphic controls include speed-leader length, HQ staff length, and an optional
symbol stack outside APP-6A. E editions also offer frame-shape overrides,
encoded at SIDC position 23. Map range rings and
general-rank stars from the reference generator are separate features, not
rendered modifiers supplied by this library.

Echelon and mobility start unspecified, including after Reset or switching their
mode. A deliberately selected value is not silently replaced by clicking the
same mode. Search accepts names, function codes and full SIDCs; Clear / Escape
resets search and pagination. Section switches return the form to its top.
On narrow screens, the compact symbol links to the full preview/download panel.
The editor opens on APP-6A. Standard tabs are grouped in edition order:
APP-6A/B/D/E, then MIL-2525C/D/E. The desktop preview receives approximately
one third of the workspace, with a larger symbol stage.

The SIDC input accepts `*` placeholders in letter-based publication examples,
including whitespace and line breaks copied from PDFs. Identity and status
placeholders use the current editor selections; other `*` characters become
`-` (unspecified). Explicit identity, status and modifier codes are preserved.
The input and exported SIDC show the resolved code. Numeric SIDCs still require
20–30 digits.

Applying a SIDC selects the matching catalog entry and synchronizes identity,
status, echelon/mobility, HQ/task force/feint, and numeric modifiers. Subsequent
control edits replace only their own SIDC fields, preserving country, order of
battle and national extensions. Unknown catalog entries retain their entered
function code. Recognized numeric D/E versions select the corresponding edition
within the current NATO or MIL family before decoding extension fields.

APP-6A (1998) displays 713 publication-derived S-scheme tactical symbols.
Seven of those entries are taxonomy headings without separate Annex D artwork.
They remain selectable, with a **Category** badge and an explanatory preview note.
G-scheme tactical graphics are excluded from this editor view and from manual
APP-6A code entry. The library retains its existing 907-entry point profile.
The editor provides
edition-specific SIDC validation, Present/Planned status, and automatic installation
modifiers. It reuses the library's NATO drawing primitives; it is not a complete
implementation of multipoint tactical graphics or weather symbols. See
[APP-6A support and publication errata](docs/app6a.md).

The current visual audit covers only the 713 S-scheme entries. Follow the local
commands in [APP-6A documentation](docs/app6a.md), then open
`/audit/symbols/index.html` for publication / before / current / difference views.
G graphics are excluded.

## Distribution and attribution

This is an independent modified version of
[milsymbol by Måns Beckman / Spatial Illusions](https://github.com/spatialillusions/milsymbol).
The original `LICENSE` and bundle license banner remain intact. The editor's
catalog uses `mil-std-2525`, `milstandard-e` and `stanag-app6`, each distributed
under MIT with its original copyright notice. The build includes their full
license texts in `THIRD_PARTY_LICENSES.txt`, linked from the editor, and copies
the original library license to `LICENSE.txt`.

For a public site, run `npm run studio:build:public` and publish **only**
`dist/studio-public/`, not the local `dist/studio/` audit directory. This separate
allow-listed build omits PDF reference images, audit snapshots and local hosting
configuration. Its publication-audit link is hidden. Nothing is deployed by
this command.

### GitHub Pages

The `.github/workflows/pages.yml` workflow runs the rendering tests, builds the
public site, and deploys only `dist/studio-public/`. It runs on pushes to `main`
or `master`, and can also be started manually from the Actions tab. In the fork's
**Settings → Pages**, select **GitHub Actions** as the publishing source. Forks
may also require enabling Actions before their first run.

The site uses relative asset URLs, so it works at a repository subpath such as
`https://<owner>.github.io/<repository>/` without changing the renderer or
adding a framework. PDF references and generated visual-audit files stay local;
they are not required by the build or deployed by the workflow.

Using GitHub's Fork button is recommended for the visible upstream relationship
and future contributions; MIT does not require it. Preserve original copyright
and permission notices whether publishing a fork, another repository or a static
site. Do not publish an unchanged upstream package name as though this were an
official release. The editor explicitly identifies itself as an independent
extension and does not claim full APP-6A conformance.

The NATO publication is a separate reference document, not relicensed by the
software's MIT license. PDF/crop redistribution rights have not been established;
keep them local unless separately authorized. These packaging measures are not
a legal certification of every possible use of the standard.

Country / organization flags are available under Appearance for every edition.
The Studio uses a separate SVG extension and MIT-licensed flag-icons artwork,
plus a public-domain NATO flag (provenance in `studio/flags/NOTICE.txt`),
not the proprietary country-flag extension from Spatial Illusions. The selected
flag sits at the lower right, beyond the complete symbol width, preserving labels and arrows.
SVG download, SVG copy, compact preview, and PNG export share the same embedded
vector artwork. The artwork represents the same national flags, but is not a
pixel-identical copy of the reference site's proprietary assets. Flags are
bundled locally and require no external service.

Country selection and SIDC entry are linked in both directions:

- APP-6A / APP-6B: FIPS country code at positions 13–14 (`TU` for Türkiye).
- MIL-STD-2525C: ISO alpha-2 at positions 13–14 (`TR` for Türkiye).
- APP-6D / MIL-STD-2525D: ISO numeric at positions 21–23 (`792` for Türkiye).
  This is the **symbology originator** of national extensions, not a separate
  nationality field. APP-6D Annex A, Figure A-1, A.12 and Table A-9 define it;
  MIL-STD-2525D A.5.5 uses the same arrangement. The Studio uses that originator
  country for the flag. Positions 24–30 remain the originator's symbol set/data.
- MIL-STD-2525E: nationality/country code at positions 28–30 (`792` for Türkiye).
  Positions 21–22 remain common modifier identifiers, and 23 remains frame shape.
- The Studio's APP-6E compatibility view shares the 2525E catalog and encoding;
  it does not claim a separately verified APP-6E catalog or SIDC layout.

The renderer applies the common modifier identifiers at 21–22 only in edition E;
an edition D national-originator code cannot change the core symbol's modifiers.

Applying a SIDC selects its country automatically. Empty, incomplete or unknown
country fields clear any previous flag; there is no fallback between FIPS and
ISO. Selecting another country preserves the rest of a custom SIDC, including
order of battle. Switching standard preserves the selected country and encodes
it for the new edition. Flags with no assigned code (for example organizations)
remain display-only and explicitly say so; their selection clears any previous
country code. The Country (AC) free-text amplifier remains independent. Reset
clears the flag. Historical dissolved countries are not silently mapped to
modern successors. Mapping provenance is recorded in `studio/country-code-data.js`.
