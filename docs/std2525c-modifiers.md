# MIL-STD-2525C scheme S modifier profile

Source: MIL-STD-2525C, 17 November 2008. Page citations give the physical PDF
page first and the printed page second (printed = PDF - 6). Code:
`src/modifierprofiles/std2525c.js`, wired in `src/lettersidc/metadata.js`.

## Scope and activation

- The profile is active only for letter SIDCs when the edition is selected with
  `ms.setStandard("2525C")` or the style `standard: "2525C"`. `ms.setStandard("2525")`
  (the 2525B/C mix) keeps its rendering unchanged.
- Scheme S only. Every other first character (G, I, O, E, W) gets a neutral
  result: no field restriction, always valid, no layout. S-scheme rules are not
  applied to them.
- `validate()` returns `details.modifierErrors` (source-backed violations, which
  make `isValid()` false) and `details.notes` (source tensions and product
  policy, which do not).

## Symbol class

Class is the real object class, derived from SIDC positions 3 and 5:

| SIDC | Class |
|---|---|
| dimension G, function ID starts with `I` | installation |
| dimension G, function ID starts with `E` | equipment |
| dimension G, any other (`U...`, `------`) | unit |
| dimension P A S U (space, air, sea surface, subsurface) | equipment (Table IV note 2, PDF 30 / 24) |
| dimension F (SOF) | unit (product policy, see decision 12) |
| dimension Z X | unknown: only fields that apply to U, E and I alike are open |

Limits: the class is read from the first function letter, so a hand-written
function ID is classified by that letter only. The `H` installation modifier
(SIDC 11) does not change the class; a unit shown with H keeps the unit fields.

## Table IV matrix (PDF 28-30 / printed 22-24)

`G` graphic, number = maximum display characters, `-` not applicable. 39 entries:
the 37 Table IV rows plus AM and AN (Table XIV only; always `-` for U/E/I).
The data is `std2525cTableIV` in the profile; Studio, validator and layout read
the same table.

| Field | Key | U | E | I | Notes |
|---|---|---|---|---|---|
| A | icon | G | G | G | catalogue icon |
| B | echelon (SIDC 12) | G | - | - | Table A-II echelon letters |
| C | quantity | - | 9 | - | `9` with note 3, not "93" and not an installation value |
| D | taskForce (SIDC 11) | G | - | - | |
| E | frameDescriptor (derived) | G | G | G | exercise `X`, Joker `J`, Faker `K` |
| F | reinforcedReduced | 3 | - | - | display `(+)` `(-)` `(±)` |
| G | staffComments | 20 | 20 | 20 | free text |
| H | additionalInformation | 20 | 20 | 20 | free text |
| J | evaluationRating | 2 | 2 | 2 | `[A-F][1-6]`, 36 pairs |
| K | combatEffectiveness | 5 | - | 5 | free text, SO value 3 not carried |
| L | signatureEquipment | - | 1 | - | `!` only, hostile (H, S) |
| M | higherFormation | 21 | - | - | |
| N | hostile | - | 3 | - | `ENY` only |
| P | iffSif | 5 | 5 | 5 | |
| Q | direction | G | G | - | |
| R | mobility (SIDC 11-12) | - | G | - | `MO`-`MY`, equipment only |
| R2 | sigint | - | - | - | SIGINT only |
| S | headquarters / offset | G | G | G | HQ staff via SIDC 11 A-D |
| T | uniqueDesignation | 21 | 21 | 21 | |
| V | type | - | 24 | - | |
| W | dtg | 16 | 16 | 16 | `DDHHMMSSZMONYYYY`, short forms, `O/O` |
| X | altitudeDepth | 14 | 14 | 14 | alternatives in 5.5.2.5 |
| Y | location | 19 | 19 | 19 | |
| Z | speed | 8 | 8 | - | |
| AA | specialHeadquarters | 9 | - | - | inside the frame |
| AB | feintDummy (SIDC 11) | G | G | G | |
| AC | installation (SIDC 11 `H`) | G | G | G | graphic block, not a country |
| AD AE AF | platformType, equipmentTeardownTime, commonIdentifier | - | - | - | SIGINT only |
| AG | towedArray (SIDC `NS`/`NL`) | - | G | - | |
| AH AI AK | dynamic map graphics | G | G | - | not rendered (reported) |
| AJ | speedLeader | G | G | - | static line of caller-given length |
| AL | operational condition (status C D X F) | - | G | G | |
| AM AN | distance, azimuth | - | - | - | Table XIV only |
| AO | engagementBar | G/8 | G/8 | G/8 | length 8 only; no `A:BBB-CC` grammar in 2525C |

Display length is counted in Unicode code points (a modern-display choice; the
transmission lengths of Table XIV are ASCII and are a separate matter). The
source gives no character set, so none is enforced.

## Values

- **J**: reliability A-F and credibility 1-6, 36 pairs (Table IV, PDF 28 / 22).
- **L**: `!` only, and only on hostile equipment (identity H or S; product reading
  of "text modifier for hostile equipment"; exercise Joker/Faker are not included).
- **N**: `ENY` only. Independent of identity H: choosing H does not generate it
  and `hostile: "ENY"` does not change the SIDC.
- **F**: the API accepts the display forms `(+)`, `(-)`, `(±)`. The transmission
  codes `R`, `D`, `RD` (Table XIV) are a different representation: they are
  rejected with an explanatory error and are not mapped silently. The combined
  reinforced-and-reduced glyph (plus over minus) has no ASCII form; `(±)` is the
  closest character and is a product choice.
- **W**: length 16. Long `DDHHMMSSZMONYYYY`, short forms such as `DDHHMMZMONYY`
  and `O/O` are all accepted; no regex is invented. On order is status `A` plus
  W `O/O`; W `O/O` with any other status is a modifier error (5.3.1.4).
- **X**: length 14. The documented alternatives (GL/MSL, relative altitude with
  FT/M/KM/SM, depth in FT, AGL/AMSL/HAE/BMSL, FL nnn) are content guidance, not
  enforced beyond the length.
- **Q**: any value; no closed range because 2525C defines none.

## Status (Table A-I, PDF 57 / 51)

A planned (dashed frame); P present, "Units only"; C, D, X, F equipment and
installations only (units are an error, the renderer draws no AL on units).
P on equipment/installation is allowed and recorded as a note (decision 5).

## Identities (Tables I/II, A-I)

All 14 codes P U A F N S H G W M D L J K are accepted. Joker and Faker use the
Friend shape in the hostile (red) colour with descriptor J/K; exercise codes use
the X descriptor. Unknown dimension Z with D, L, M, J, K is N/A in Table II: a
modifier error and no frame. Battle dimension X (Other) is "No frame" in Table
A-I: the renderer draws no frame or question mark and a note records it.

## SIDC 11-12 (Table A-II, PDF 58-60 / 52-54)

First character `-` or `A`-`G` with second `-` or `A`-`N` (N is Command);
`H-` and `HB` only (no HA, HC...); `MO`-`MY` mobility; `NS`/`NL` towed array.
The validator and renderer share `std2525cModifierRules`: invalid or inapplicable
echelon, task force, mobility and array are neither drawn nor accepted. For
equipment and installations only `-`, `A`, `C`, `F`, `H-`, `HB` (HQ and
feint/dummy, U/E/I per Table IV S and AB) are valid with an empty second
character; echelon letters and task-force codes (B, D, E, G) are unit-only.
Mobility is equipment-only and not intrinsic to the icon. Towed array on
non-sonar equipment is not further restricted.

## Layout (Figure 2, PDF 27 / 21; 5.4.4, PDF 40 / 34)

Left rows, top to bottom: W; X Y; V; T; Z (right aligned). Right rows: E F; G; H;
M; J K L N P (left aligned). Joined with one space, empties collapse. Quantity C
is in the top group, AA inside the frame. Keys that do not apply to the class
are removed from the layout, so they are not drawn. The derived E descriptor
(X, J or K) is the first token of the E/F row when F text is shown (`X (+)`); it
is then not drawn a second time. Without F it stays the bold frame marker.
AB, AO (above), R/AG and the AL bar (below) are graphics drawn by their parts.

## Decision records (appendix section 8)

1. **C quantity 9 with note 3** (PDF 28 / 22, PDF 52 / 46): implemented as U- E9 I-.
2. **K columns** (PDF 28 / 22): U5 E- I5; SI and SO values are not carried to S.
3. **F glyph** (PDF 28 / 22): display `(+)` `(-)` `(±)` and transmission R/D/RD kept
   distinct; see Values.
4. **Identity dotted contour vs status** (Tables I/II, 5.3.1.4): identity
   uncertainty (`metadata.identityUncertain`) and planned status
   (`metadata.plannedStatus`) are separate data. The existing identity contour
   rendering is kept. When both apply the source gives no combining algorithm; a
   note records it. APP-6D's precedence rule is not copied.
5. **P status vs catalogue** (Table A-I vs Table A-V): the SIDC is never
   rewritten; P on equipment/installation yields a note, not an error.
6. **Full to capacity** (Tables III-1 / III-2, A-I): F is accepted on equipment
   and installations; a note records the N/A row in III-1.
7. **AG transmission** (Table XIV R/AG, A-II): display graphic, transmission
   field and SIDC encoding are separate; `NS`/`NL` are two SIDC characters.
8. **E transmission** (Table XIV SIDC 3-4 vs Table A-I position 2): the identity
   is read from position 2 as Table A-I defines it.
9. **Special C2 reference** (PDF 206, C.4.4.2 not found): AA is kept as the inner
   text only; no new glyph is added.
10. **AO grammar**: only the 8-character limit is enforced.
11. **AB cross-reference** (5.3.4.7 says table III): the field definition in
    Table IV is used.
12. **SOF class** (Table IV note 2 lists SOF under equipment; every catalogue
    entry is "SOF UNIT" and 5.3.1.3 gives the unit frame): SOF is treated as
    units. This is product policy; equipment-only fields (C L N R V) are errors
    on SOF.

## Coverage limits

No full image audit of the catalogue was done: the 860 framing declarations, the
FO icon pairs and the full Table A-III/A-V reconciliation are not checked. AH, AI
and AK (dynamic map graphics) and offset location are not rendered. Tests cover
the rules above through `test/std2525c-modifiers.test.js`; they are not a
certificate that every 2525C symbol is visually correct.
