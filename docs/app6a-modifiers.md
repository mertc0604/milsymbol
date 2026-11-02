# APP-6A (1998) S-scheme modifiers, identity and size/mobility

Source: `APP_6_A_.pdf` (403 PDF pages). Citations give the **physical PDF page / printed page**
(the printed number is not `PDF - 6` everywhere). Scope: SIDC first character `S`
(warfighting). `G` tactical graphic points keep their earlier Table III handling and are not
extended. Implementation: `src/modifierprofiles/app6a.js` (`app6aProfile`), wired in
`src/lettersidc/metadata.js`; tests: `test/app6a-modifiers.test.js`.

This is rule coverage for the S-scheme modifier and identity layer. It is **not** a full-image
audit of the 713 S catalogue entries and not a conformance certificate.

## Rule matrix

### Table III fields (PDF 25-27 / printed 19-21). U = units, E = equipment, I = installations

| Field | Option key | U | E | I | Kind | Rule implemented |
|---|---|---:|---:|---:|---|---|
| A symbol | - | G | G | G | graphic | frame, fill, icon |
| B size | - (SIDC 12) | 10 | 2 | G | graphic | unit echelon glyph from SIDC; installation indicator from `H-`. The 10 / 2 / G cells are recorded, not "fixed": no text option, no echelon for equipment |
| C quantity | `quantity` | - | 9 | - | text | equipment only, above the frame |
| D task force | - (SIDC 11) | G | - | - | graphic | bracket, units only |
| E | derived | 1 | 1 | 1 | text, derived from identity | `?` for P/A/S, `J`, `K`; never a free option |
| F | `reinforcedReduced` | 3 | - | - | choice | exactly `(+)`, `(-)`, `(±)` (the third is a plus-minus; PDF text extraction shows `(+)`, PDF 25 / 19 image) |
| G | `staffComments` | 20 | 20 | 20 | text | free text |
| H | `additionalInformation` | 20 | 20 | 20 | text | free text |
| J | `evaluationRating` | 2 | 2 | 2 | choice | letter A-F plus digit 1-6, independent axes, all 36 pairs (note b) |
| K | `combatEffectiveness` | 5 | - | 5 | text | unit effectiveness, installation capability; no token list invented |
| L | `signatureEquipment` | - | 1 | - | choice | `!`, hostile equipment only (see decisions) |
| M | `higherFormation` | 21 | - | - | text | units only |
| N | `hostile` | - | 3 | - | choice | `ENY`, equipment only |
| P | `iffSif` | 5 | 5 | 5 | text | no sub-grammar invented |
| Q | `direction` | 4 | 4 | 4 | graphic | arrow; ground: bent arrow from the bottom (505.1a, PDF 30 / 24) |
| R mobility | - (SIDC 11-12) | - | G | - | graphic | equipment only, `MO`-`MY` |
| S | - (SIDC 11) | G | G | G | graphic | unit: headquarters staff; equipment and installation: location offset |
| T | `uniqueDesignation` | 21 | 21 | 21 | text | |
| V | `type` | - | 24 | - | text | equipment only |
| W | `dtg` | 14 | 14 | 14 | text | no calendar grammar invented |
| X | `altitudeDepth` | 6 | 6 | 6 | text | |
| Y | `location` | 19 | 19 | 19 | text | WGS-84 note d; no regex invented |
| Z | `speed` | 8 | 8 | 8 | text | installations also 8 |
| AA | `specialHeadquarters` | 9 | - | - | text | inside the frame, units only |
| AB | - (SIDC 11) | G | G | G | graphic | feint/dummy chevron |

There is no `AC`, `AH`, `AI`, `AO`, `AD`, `AE`, `AF`, `AQ`, `AR` or visible country text in APP-6A.
Those option keys are reported in `modifierErrors` and are not drawn. SIDC positions 13-14 (FIPS
country) are not a visible field.

### Figure 2a layout (PDF 28 / 22) and 506.2 (PDF 32-33 / 26-27)

```
left (right-justified)      right (left-justified)
W                           E F
X Y                         G
V                           H
T                           M
Z                           J K L N P
top: B/C/D (C = quantity)   inner: AA
```

`textLayout()` returns these rows filtered to the fields that apply to the symbol class. Values in
one row are joined with one space; empty values collapse (no reserved gap). Left rows end at the
frame (`textanchor: end`), right rows start there. The row grid is the library's existing one.

### Identity, colour, frame (Tables I-II, C-II; PDF 21-23 / 15-17)

| SIDC 2 | Frame family | Colour family (fill) | Mark |
|---|---|---|---|
| P | Unknown | yellow `(255,255,128)` | `?` inside the frame |
| U | Unknown | yellow | none |
| A | Friend | cyan `(128,224,255)` | `?` in field E |
| F | Friend | cyan | none |
| N | Neutral | green `(170,255,170)` | none |
| S | Hostile | red `(255,128,128)` | `?` in field E |
| H | Hostile | red | none |
| J | **Friend** | **red** | `J` in field E |
| K | **Friend** | **red** | `K` in field E |
| O | **none defined** | none | `identityErrors`, no frame, no icon |

Frame geometry per dimension comes from the existing base geometries (land unit and installation
rectangle, land equipment and sea circle, air open at the bottom, subsurface open at the top).
A battle dimension without a Table I frame (`X`, `Z`, `T`, `C`, `O`) is treated like `O`.

Field E sits first in row E/F, so `A` plus `F=(+)` renders `? (+)` as one text. With the Studio
style `infoFields: false` the mark is drawn alone at the same position. It is never drawn in both
places. Option `uncertaintyMarker`: `"table"` (default: pending inside, A/S in E), `"field"`,
`"frame"` (503.1a allows field E *or* in the frame for pending, assumed friend and suspect;
J and K always use E). An unframed symbol cannot embed a mark, so pending falls back to E.

Status (503.1c, Table II, PDF 23 / 17): `P` solid, `A` dashed frame (the existing dashed overlay).
Pending is not "planned" and a dashed frame is not uncertainty. An unframed or dot symbol cannot
show planned status; no dash is applied to the icon and `details.notes` records the limit.
Other editions' status values draw no condition bar.

### SIDC positions 11-12 (Table B-II, PDF 75-77 / 69-71; Table IV PDF 30-31 / 24-25)

| Position 11 | HQ staff | TF bracket | Feint/dummy | Position 12 |
|---|:-:|:-:|:-:|---|
| `-` | | | | `-`, A-M echelon |
| A | x | | | |
| B | x | x | | |
| C | x | | x | |
| D | x | x | x | |
| E | | x | | |
| F | | | x | |
| G | | x | x | |
| H | installation | | `HB` | `-` or `B` only; the B of `HB` is not a squad |
| M | | | | `-` heading (valid, nothing drawn, noted) or `O`-`Y` mobility |
| K | | | | `K-` nuclear yield is a tactical graphic code; invalid for S |

Echelon A-M only (no `N` command echelon). Units: HQ, TF, FD and echelon. Equipment and
installation cannot carry TF or an echelon; equipment A/C/F are the location offset / feint bits.
Ground installations require `H-` or `HB`. Mobility: MO MP MQ MR MS MT MU MV MW MX MY; no `NS`,
`NL`. The validator (`isApp6aSidc`), `decodeApp6aSizeMobility`, the renderer metadata and the
tests share one decoder.

## Decisions on source conflicts and gaps

| Topic | Source | Decision |
|---|---|---|
| Figure number | text says "figure 3a", the figure is "Figure 2a" (PDF 28 / 22; 505 PDF 24 / 18) | layout follows Figure 2a; applies to all dimensions |
| B 10 / E 2 / I G | Table III (PDF 25 / 19) | recorded as a graphic only; no text option, no equipment echelon |
| L "hostile equipment only" | Table III L (PDF 25 / 19: "hostile equipment only"); definition 17 Hostile = "a contact positively identified as enemy" (PDF 15 / 9); definition 32 Suspect = "a track or contact which is potentially hostile" (PDF 16 / 10) | strict: identity `H` and equipment only. The source defines Suspect as a separate identity that is only potentially hostile, so S is not hostile; J, K and the exercise identities are not hostile either. MIL-STD-2525C reads its own "hostile equipment" the same way (Table IV, PDF 28 / 22 with 3.2.42 Suspect, PDF 16 / 10). The Studio helper `studio/editor-helpers.js` that says H/S is out of line with both |
| N `ENY` | Table III N | equipment of any identity; H does not add the text and the text does not change identity (a note is recorded for non-H) |
| E placement | 503.1a "field E or embedded"; Table I | pending inside, A/S in E by default; `uncertaintyMarker` selects the alternative; one mark only |
| `O` identity | Table B-I lists it, Table I and C-II give no frame | no frame, no icon, `identityErrors`; never Unknown/Friend |
| `M-` | Table B-II heading row | accepted, nothing drawn, note recorded |
| Equipment HQ bit | Table III S (U/E/I) | drawn like a staff; `metadata.locationOffset` true and `headquarters` false semantics for units only (`staffRole`) |
| F `(±)` glyph | PDF text shows `(+)` | image-checked: plus-minus |
| Character count | not defined | product policy: Unicode code points, no normalization |
| Whitespace-only text | not defined | product policy: a value that is only whitespace is empty. It creates no row, reserves no separator and is not "present" for validation (so an inapplicable or out-of-range field with a blank value is no error). Non-blank text is not trimmed. Implemented once in `src/modifierprofiles/common.js` (`isBlank`, `joinFields`, `clearBlankText`, which `applyProfile` runs on the symbol's own options) |
| Q units | not defined | `direction` stays degrees (existing API); not source-defined |
| Q ground arrow with a headquarters staff | 505.1a (PDF 30 / 24): "for land symbols ... bent arrow extending downward from the bottom center of the frame or icon"; Figure 2a (PDF 28 / 22) shows S (staff at the left edge) and Q (GROUND) together, the arrow starting at the bottom centre; 506.3 (PDF 33 / 27): the staff base marks the location | APP-6A land symbols always draw the arrow from the bottom centre of the frame, also for headquarters and offset-location symbols (`src/symbolfunctions/directionarrow.js`, guarded by `metadata.app6a`). The legacy 2525B/APP-6B habit of starting the arrow at the staff end is kept for those editions. The symbol anchor stays at the staff base. Non-land symbols: arrow from the centre (505.1a) |
| Staff length | Annex C.4.1c (PDF 124 / 118): "one frame height below the bottom of the frame" | the existing staff length (one frame height) is kept; tests assert it |
| Engagement bar AO | not an APP-6A Table III field | not drawn, no space reserved (tested for bbox equality) |
| Catalogue image errors (Annex D PDF 136, 154, 163-167 / printed 130, 148, 157-161, 261) | duplicated SIDC columns, wrong frames in UF rows, `modifier c` wording for installations | unresolved and unchanged; no icon or restriction derived from them |
| Faker defined as an aircraft (302.9) vs Table I other dimensions | Table I shows K in all five columns | K is not restricted to air |

## Known visual limits (not source-defined, left unchanged)

- The task force bracket (field D) and the widest echelon glyph (observed for Region `M`) are wider than the
  frame (the bracket spans 215 units for Region, the frame 150). They can reach 5-13 units into the first
  text rows on both sides. Figure 3 (PDF 29 / 23) draws a bracket that is narrower than the frame and Annex
  C gives no numeric width, so the width is a geometry question, not a text-placement rule; it was not
  changed. Tests exclude `milsymbol-echelon` and `milsymbol-taskforce` from the "rows clear of graphics" check.
- A non-land arrow (from the centre, length one frame height) can cross a text row near the arrow tip
  (for example direction 90 and the H or V row). 505.1a and Figure 2a show the same crossing; 506.2 (PDF 32 /
  26) allows fields to be offset or dropped. Not changed.
- The bounding box is the symbol geometry; the SVG viewBox adds the stroke width on every side. "Contains every
  drawn part" is checked against that viewBox with half the stroke added to each stroked part
  (`test/draw-extents.js`); the arrowhead of a land arrow pointing sideways sticks out of the bare bbox by one
  unit and stays inside the viewBox.

## Coverage limits

- Verified against the PDF text and page images: Tables I-III (PDF 21-27), Figure 2a (28), Table IV
  (30-31), 505-506 (24, 30-33), Annex B-I/B-II (74-77). Annex C geometry ratios (PDF 122-133), Table C-IV
  mobility shapes (129-132) were not re-compared against the SVG paths.
- Not done: image audit of catalogue cells against identity/frame, Annex D framing (F/FO/UF) metadata,
  Canvas execution in tests (Canvas and SVG share the same draw instructions; only SVG output
  is asserted). Bounding-box and row-placement tests now cover 38 S combinations of HQ/offset staff,
  task force, feint/dummy, echelon A-M subsets, mobility, and nine direction angles each.
- The Studio still reads the legacy `getApp6aFields` shape; use `app6aProfile.fields()` for graphics,
  derived E and choice fields.
