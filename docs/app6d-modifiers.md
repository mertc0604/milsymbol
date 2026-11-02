# APP-6(D) Edition D Version 1: modifier and identity profile

Source: `APP-6D_EDD_V1_E.pdf` (922 physical pages). Citations are "PDF physical page / printed page". The profile is active when `metadata.app6d` is true: a numeric SIDC with version 10-12 rendered with `ms.setStandard("APP6")` (not 2525). Rendering of 2525D/E and APP-6E (version 13-14) is unchanged. Code: `src/modifierprofiles/app6d.js`, `src/modifierprofiles/app6d-sectors.js`; tests: `test/app6d-modifiers.test.js`.

Scope: symbol sets 01, 02, 05, 10, 15, 20, 30, 35, 36 and 00 Unknown (fallback). Sets 11 (civilian organization) and 27 (dismounted individual) are classified and deliberately not profiled; 25, 40, METOC, 50-54, 60-64 and 06 are untouched.

## Identity, context, status (Table A-2 PDF 718/A-4; A-6 PDF 723/A-9; section 1.2.1 PDF 33/1-9)

| Digit | Rule |
|---|---|
| 3 context | 0 Reality; 1 Exercise and 2 Simulation are US-only (note 1); 3-9 reserved: error |
| 4 identity | 0 Pending, 2 Assumed Friend, 5 Suspect are uncertain (dotted frame, status not shown); 1, 3, 4, 6 certain (present solid, planned dashed); 7-9 reserved: error. Joker/Faker names exist only with context 1 (note 2). Groups follow Table A-3 PDF 719/A-5: 5 and 6 are the Hostile group |
| 7 status | 0-5; 6-8 reserved: error; 9 Version Extension Flag, reported under `details.versionExtension` (valid=false: extension content cannot be interpreted). 2-5 (operational condition) are N/A for Land Unit (Tables 1-3/1-4 PDF 35/1-11) |
| 8 HQ/TF/dummy | 0-7; 8 reserved; 9 VEF. Per class: Land Unit 0-7, Equipment 0-1 (dummy), Installation 0-3 (dummy, HQ), others 0 |
| 9-10 amplifier | Table A-8 PDF 724-726/A-10..A-12. Echelon 11-18, 21-26 (Land Unit, Installation); mobility 31-37, 41-42, 51-52 (Equipment); towed array 61-62 (Sea Surface, Subsurface); 71-72 leadership is set 27 only; 19/29/x9 VEF; reserved: 27-28, 38, 43-48, 53-58, 63-68, 73-78 and the whole 8x group; 9x VEF |

Rendering (only under the guard): uncertain identities use the dotted frame and the planned dash is not added (existing `notpresent` precedence, now covered by tests); Joker/Faker keep the Hostile frame instead of the 2525 Friend shape; Land Unit draws no condition bar. Operational condition uses the Table 1-4 bar (alternative representation); Full-to-capacity blue is one library colour because the PDF gives no RGB (Air/Space/Subsurface darker, Equipment/Installation/Sea Surface lighter in the figure).

Unknown dimension 00: Friend is the circle with `?` (Sea Friend geometry plus the unknown-dimension question mark); verified by test, not by image audit.

## Field matrix per class (placement = source order, left/right rows top to bottom)

| Class | Left | Right | Top / inner / bottom | Source |
|---|---|---|---|---|
| Air, Air Missile | none | T; P (IFF/SIF); V; Z X; G H | AO | Fig 2-2 PDF 54/2-4, Table 2-2 PDF 55-56/2-5..2-6 |
| Land Unit | AR W; X Y; V AD AE; T; Z | F; G; H AF; M; J K P | AO, AA inner, AH bottom | Fig 3-3 PDF 84/3-4, Table 3-2 PDF 85-88/3-5..3-8 |
| Land Equipment | W; X Y; V AD AF; T; Z | AC; G; H AE; M; J K L N P | C top | Fig 3-14 PDF 161/3-81, Table 3-16 PDF 162-164/3-82..3-84 |
| Land Installation | W; X Y; AI; T | AC; G; H AE; M; J K | none | Fig 3-18 PDF 216/3-136, Table 3-22 PDF 217-219/3-137..3-139 |
| Sea Surface | AQ AR | T; V; P (AIS); G H; Y Z | AO | Fig 5-3 PDF 293/5-5, Table 5-2 PDF 294-295/5-6..5-7 |
| Subsurface, Mine Warfare | AR | T; V; X (depth); G; H | AO | Fig 5-6 / Table 5-9 PDF 326-327/5-38..5-39; Table A-5 PDF 722/A-8 |
| Space | none | T; V; X; G | AO | Fig 6-2 PDF 361/6-4, Table 6-2 PDF 362-363/6-5..6-6 |
| 00 Unknown | no source layout | | | Fig 1-4 PDF 34/1-10 has unlabeled cells; legacy rows kept, no field restriction (policy) |

Field semantics per class (not shared letters): AC is the installation graphic block on Land Unit (no option; `country` is rejected) and a three-letter country text on Equipment/Installation (STANAG 1059 reference; character set not given beyond letters). K is FO/SO/MO/NO/UNK on units, the four long descriptions on equipment, free capacity text on installations. P is IFF/SIF except AIS on Sea Surface. X is altitude, height in feet (equipment/installation) or depth (subsurface). Y has the 22-character limit on Land Unit only. W is `DDHHMM[SS]ZMONYYYY` on units and `...YY` on equipment/installations, or `O/O`. J is one letter A-F and one digit 1-6 (all 36 pairs). F is `+ - ±` (Table 3-9) with the parenthesised Table 3-2 forms accepted and noted; only at echelon 11-18/21 (or unspecified). L `!` and N `ENY` only on hostile-group equipment (Table 3-16 PDF 163/3-83). AQ is exactly `BG`, AR `NRT`/`SIG` on Sea Surface/Subsurface (free text with examples on Land Unit). AO is `A:BBB-CC` with the closed Table 1-5/1-6 dictionaries (PDF 40-41/1-16..1-17). The separator for shared positions is one space (product policy, the source gives none).

Fields not in a class table are errors (no other-edition borrowing): e.g. quantity on Air/Land Unit, DTG on Air/Sea, R2 SIGINT and AG anywhere.

## Sector modifiers (Annex A PDF 735-815; printed = physical - 714)

All 15 dictionaries (Tables A-11, A-12, A-14, A-15, A-17, A-18, A-20, A-21, A-26, A-28, A-29, A-35, A-36, A-38, A-39) are in `app6d-sectors.js` with 00, reserved ranges and 99 VEF. Air Missile sectors are left/right (PDF 76-79), all others top/bottom. Land Equipment has no sector 2 (section 3.4.7 PDF 210/3-130), Mine Warfare and Unknown have no dictionary.

Entity constraints (validation; the renderer also draws only defined codes and none on local tracks): Air 38/39 rotary-wing entities 1102xx/1202xx (Table 2-5 PDF 73/2-23); Air Missile sector 2 07-11 only with sector 1 08 (PDF 78-79); Space sector 2 01-04 only with satellite entities (Table 6-5 PDF 372/6-15; "Antisatellite Weapon" is not treated as a satellite: policy); Subsurface sector 1 02, 03, 08-18 and sector 2 01-13 submarine entity type 1101xx, sector 2 14-16 AUV/UUV 1104xx/1202xx (Tables 5-11/5-12 PDF 331-336); sector 1 code 19 is `unresolved` D-SUB19 (accepted only with Torpedo 1301xx or Submarine, flagged); local tracks 30/160000, 30/170000, 35/140000, 35/150000, 35/160000 allow no sector modifier but still allow outer text amplifiers (PDF 316/5-28, 336-337/5-48..5-49); Own Ship 30/150000 Friend only, fused and ETC/POSCON Pending, IED 35/130200 Hostile only (Suspect does not substitute); Sea Surface sector 1 code 01 Own Ship is separate data. Installation remarks (Electric Power, Telecommunication, CRBN) are noted, not enforced.

## Decision record (appendix section 9)

| ID | Sources | Decision |
|---|---|---|
| D-AL-01 | Table 1-4 PDF 35 vs section tables | threat and condition colours are not merged; note emitted; bar uses Table 1-4 colours |
| D-UNIT-AL | Fig 3-3/Table 3-2 vs Tables 1-3/1-4 | status 2-5 is an error on Land Unit; no bar drawn |
| D-EQ-AO | Fig 3-14 vs Table 3-16 | AO accepted on Equipment with a note |
| D-INST-AE | Fig 3-18 vs Table 3-22 | AE rendered in the figure position with a note; equipment semantics not assumed |
| D-SPACE | Fig 6-2/Table 6-2/section 6.2.4 PDF 361-363 | layout is T; V; X; G; H and Z are `unresolved` (valid=false), not rendered; Air rows not copied |
| D-F | Table 3-2 PDF 85 vs Table 3-9 PDF 149 | both literal forms accepted, note; no `R`/`D` glyph generated |
| D-W | Tables 3-2/3-16/3-22 | per-class DTG pattern |
| D-AO-TYPO | Table 3-2 PDF 88 | `A:BBB-CC` used |
| D-SUB19 | Table 5-11 PDF 334 vs A-38 PDF 814 | `unresolved`, never reported conforming |
| D-EXT | Fig A-1 PDF 717 vs A.12 PDF 730 | only the 20-digit base is validated; 30 digits get a note |
| D-OFFSET | section 1.2.1.6 PDF 36 vs 3.3.9 PDF 151 | not changed in this iteration (renderer keeps its anchors) |
| D-K-EQ | Table 3-2 vs 3-16 | per-class K dictionaries |
| D-AC | Table 3-2 vs 3-16/3-22 | per-class meaning kept in the data model |
| A.11 item 2 | PDF 727/A-13 | entity Unspecified with non-zero remainder: note only (policy: the symbol-table tests build sector-only SIDCs) |

## Coverage limits

No image-by-image audit of the main icon or sector glyph tables was done (graphics come from the existing icon parts; the profile checks codes, not glyph geometry). Air Missile left/right and Air top/bottom placement were not checked by rendering. Offset/HQ staff anchors, Table 1-7 frame sizes, towed-array glyph geometry, engagement bar colours/contrast and 30-digit extensions were not re-verified. Studio changes (field choices, identity/status/amplifier pickers, sector dropdowns from `app6d-sectors.js`) are not implemented.
