# Amplifier profiles: APP-6(B), MIL-STD-2525D, MIL-STD-2525E, APP-6(E)

These four editions now have modifier profiles like APP-6A, MIL-STD-2525C and APP-6(D). A profile says which fields a symbol class has, how long they may be, which values they take and where the renderer places them.

Code: `src/modifierprofiles/app6b.js`, `std2525d.js`, `std2525e.js`, `app6e.js`, with the shared builder `fieldtable.js`. Tests: `test/edition-modifiers.test.js`. Those tests render each class and compare the drawn rows with the rows copied from each figure.

Citations are "PDF physical page / printed page".

| Edition | Source file | Active when |
|---|---|---|
| APP-6(B) | `APP-6(B).pdf` | letter SIDC, standard `APP6`, scheme S |
| MIL-STD-2525D Change 1 | `MIL-STD-2525D-Change1.pdf` | numeric version 10-12, standard `2525` |
| MIL-STD-2525E Change 1 | `MIL-STD-2525E-Change1.pdf` | numeric version 13-16, standard `2525` |
| APP-06 Edition E Version 2 | `APP-06 EDE V2 E.pdf` | numeric version 13-16, standard `APP6` |

Sets without a figure keep the old rows and every field: 00 Unknown, 25 Control Measures, 45-47 METOC and, in edition E, 50-54 SIGINT. APP-6(D) (version 10-12, standard `APP6`) keeps its own profile.

## What was wrong

The old renderer had one row plan for all numeric land symbols and joined shared fields with `/`.

| Finding | Editions | Now |
|---|---|---|
| Fields in one cell were joined with `/` | all four | One space. APP-6(B) 0213.b PDF 38/2-16 requires it. The others say only "the most critical amplifier" should be used and give no rule, so they follow 2525C and APP-6(D) |
| AE and AF were swapped on equipment | 2525D, 2525E | V/AD/AE on the left, H/AF on the right (Figures D-5, E-4). APP-6(E) really has the reverse, V/AD/AF and H/AE (Figure 3-9) |
| AQ and AR were not drawn on land equipment | 2525D | W/AR and G/AQ (Figure D-5) |
| Quantity C drew above the frame on all classes | 2525E | With T on the left: C/T (Figures E-3, E-4), C/AE on installations (Figure E-5), the fourth left row on activities (Figure I-2). B/C above the frame only on air and space (Figures D-3, C-2) |
| Air, space and sea had the 2525D rows | 2525E | Left W; AR; AD and right AS; T/Y; V/AF; P/X/Z; G/H/J on air and space. Six right rows on sea surface and subsurface (Figures G-2, H-3) |
| AS was missing on sea, air and space | 2525E, APP-6(E) | Own row in 2525E, shared with T in APP-6(E) (T/AS) |
| P appeared on space | 2525D, APP-6(E) | Space has T; V; Z/X; G/H (Figures B-3, 6-2) |
| Activities used the land unit rows | all numeric | W; Y and AS; G; H; J in 2525D. See the class tables for E |
| Cyberspace used the equipment rows, so F was lost | 2525D, 2525E, APP-6(E) | F/AS on the first right row, T/V or V and T on the left (Figures L-2, K-2, 9-2) |
| Mine warfare took amplifiers | 2525E | None. 5.3.7 PDF 38/21: "Mine Warfare (MIW) symbols do not use amplifiers" |
| Land units drew the condition bar | 2525D | No AL (Table VII PDF 40/24, Figure D-4). 2525E and APP-6(E) do have it (Figures E-3, 3-3) |
| Status C, D, X and F drew a condition bar | APP-6(B) | Table B-I PDF 104/B-2 has status A and P only |
| An engagement bar and speed leader were accepted | APP-6(B) | Table I has no AO or AJ |
| Versions 14, 15 and 16 were unknown | edition E | Table A-1 PDF 76/59 and PDF 747/713. 14 is APP-06(E)(1), 15 is 2525E(1), 16 is APP-06(E)(2) |
| The Studio wrote version 13 for APP-6E | APP-6(E) | 16. Version 13 is MIL-STD-2525E |
| Contexts 3-8 had no meaning | edition E | Restricted target and no-strike contexts keep their frame context. APP-6(E) draws the marks of Figures 1-6 and 1-7 PDF 92/58 |
| AT and AY had no option | APP-6(E) | New options `installationCapacity` and `networkIdentifier` |
| E descriptor drew twice when other text was set | APP-6(B), 2525C | Once: in the E row when there is other text, by the frame when there is none |

## Field positions

Rows are top to bottom. A `/` in the source is a cell shared by several fields.

### MIL-STD-2525D Change 1

| Class (sets) | Left | Right | Top / inner | Source |
|---|---|---|---|---|
| Air (01, 02) | none | T; P; V; Z/X; G/H | AO | Figure C-3 PDF 167/151 |
| Space (05, 06) | none | T; V; Z/X; G/H | AO | Figure B-3 PDF 153/137 |
| Land unit, civilian (10, 11) | W; X/Y; T; Z | F/AS; G; H; M; J/K/P | AO; AA inside | Figure D-4 PDF 190/174 |
| Land equipment (15) | W/AR; X/Y; V/AD/AE; T; Z | G/AQ; H/AF; J/L/N/P | AO; C | Figure D-5 PDF 251/235 |
| Land installation (20) | W; X/Y; T | G; H; J/K/P | AO | Figure D-6 PDF 296/280 |
| Sea surface (30) | AQ/AR | T; V; P; G/H; Y/Z | AO | Figure E-2 PDF 326/310 |
| Subsurface, mines (35, 36) | AR | T; V; X; G; H | AO | Figure F-3 PDF 352/336 |
| Activities (40) | W; Y | AS; G; H; J | none | Figure G-2 PDF 378/362 |
| Cyberspace (60) | W; Y; T/V | F/AS; G; H; M; K/L | AO | Figure L-2 PDF 721/705 |
| SIGINT (50-54) | W; Y; V/AD/AE; T | R2; G; H/AF; M; J/L | none | Table VII column SI, no figure (policy) |

### MIL-STD-2525E Change 1

| Class (sets) | Left | Right | Top / inner / bottom | Source |
|---|---|---|---|---|
| Air, space (01, 02, 05, 06) | W; AR; AD | AS; T/Y; V/AF; P/X/Z; G/H/J | AO; B/C | Figures D-3 PDF 192/175, C-2 PDF 176/159 |
| Land unit, civilian (10, 11) | W; X/Y; V/AD/AE; C/T; Z | F/AS; G/AQ; H/AF; M; J/K/L/P | AO; AA inside; AW below | Figure E-3 PDF 212/195 |
| Land equipment (15) | W; X/Y; V/AD/AE; C/T; Z | AS; G/AQ; H/AF; J/K/L/P | AO | Figure E-4 PDF 266/249 |
| Land installation (20) | W; X/Y; C/AE; T | AS; G/AQ; H; M; J/K/P | AA inside | Figure E-5 PDF 300/283 |
| Dismounted (27) | W; X/Y; V/AF; T; Z | AS; G; H; M; J/K/P | C below | Figure F-2 PDF 329/312 |
| Sea surface (30) | AQ/AR | AS; T; V; P; G/H; Y/Z | AO | Figure G-2 PDF 346/329 |
| Subsurface (35) | AR; X | AS; T; V; P; G/H; Y/Z | AO | Figure H-3 PDF 368/351 |
| Mine warfare (36) | none | none | none | 5.3.7 PDF 38/21 |
| Activities (40) | W; Y; empty; C | AS; T; G; H; J | none | Figure I-2 PDF 390/373 |
| Cyberspace (60) | W; Y; V; T | F/AS; G; H; M; K/L | AO | Figure K-2 PDF 432/415 |

### APP-06 Edition E Version 2

| Class (sets) | Left | Right | Top / inner / bottom | Source |
|---|---|---|---|---|
| Air (01, 02) | none | T/AS; P; V; Z/X; G/H | AO | Figure 2-2 PDF 119/85 |
| Space (05, 06) | none | T/AS; V; Z/X; G/H | AO | Figure 6-2 PDF 389/355 |
| Land unit, civilian (10, 11) | AR/W; X/Y; V/AD/AE; T; Z | F/AS; G; H/AF; M; J/K/P | AO; C; AA inside; AW below | Figure 3-3 PDF 147/113 |
| Land equipment (15) | W; X/Y; V/AD/AF; T; Z | AS; G; H/AE; M; J/K/L/N/P | AO; C | Figure 3-9 PDF 219/185 |
| Land installation (20) | W; X/Y; AX; T | AS; G; H/AE; M; J/K/AT | none | Figure 3-13 PDF 265/231 |
| Dismounted (27) | W; X/Y; V/AF; T; Z | AS; G; H; M; J/K/P | C below | Figure 4-3 PDF 296/262 |
| Sea surface (30) | AQ/AR | T/AS; V; P; G/H; Y/Z | AO | Figure 5-3 PDF 324/290 |
| Subsurface, mines (35, 36) | AR | T/AS; V; P/X; G/H; Y/Z | AO | Figure 5-6 PDF 355/321 |
| Activities (40) | W; Y; T | AS; G; H; empty; J | none | Figure 7-2 PDF 403/369 |
| Cyberspace unit (60) | AR/W; Y; V/AD/AE; T; AY | F/AS; G; H/AF; M; K/L/P | AO; C; AA inside; AW below | Figure 9-2 PDF 713/679 |
| Cyberspace non-unit (64) | W; X/Y; V/AD/AF; T; Z | AS; G; H/AE; M; J/K/L/N/P | AO; C | Figure 9-3 PDF 714/680 |

### APP-6(B)

Figure 5 PDF 33/2-11 serves all classes: left W; X/Y; V; T; Z, right E/F; G; H; M; J/K/L/N/P, B/C/D above and AA inside. Table I PDF 30-32/2-8..2-10 decides which fields a class has.

- **Units:** F, G, H, J, K, M, P, T, W, X, Y, Z, AA.
- **Equipment:** C, G, H, J, L, N, P, T, V, W, X, Y, Z.
- **Installations:** G, H, J, K, P, T, W, X, Y, Z.

E is the Joker or Faker letter, from SIDC position 2. Unlike 2525C, Z applies to installations and X stops at 6 characters.

## Decisions where the sources disagree

| ID | Sources | Decision |
|---|---|---|
| Figure over table | 2525D 5.3.7 PDF 37/21 | Amplifier descriptions "vary by dimension and are detailed within the respective appendices", so the figure and table of the class win over Table VII. Table VII gives activities T, K, P and others that Table G-II and Figure G-2 do not, and they are not offered. Table D-III lists V and L for land units, Figure D-4 and Table VII do not, and they are not offered |
| D-INST | 2525D Table VII, Figure D-6 | Table VII gives installations AJ and no Q. The figure shows neither, and the renderer starts AJ from Q, so neither is offered |
| Echelon on installations | 2525D 5.3.7.1 PDF 42/26 against Table VII | Accepted with a note, as in APP-6(D) |
| Echelon on air and space | 2525E Table VI PDF 39/22 against Figures D-3, C-2 and Tables D-II, C-II | Accepted with a note |
| AJ without Q | 2525E, APP-6(E) | Air, space and sea have AJ and no Q, but the renderer needs a heading to draw AJ. A heading is accepted, and a note is shown when it has no speed leader |
| E-N | 2525E Table VI PDF 40/23 against Figure E-4 | N has no cell in the figure. It keeps the 2525D place after L, hostile identities only, with a note |
| E-Y | 2525E Table VI PDF 44/27 against Table E-II PDF 214/197 | The table says {3,16}, but its own example has 22 characters. The limit is 22 |
| E-AR | 2525E Table VI PDF 47/30 against Figure E-3 | AR is listed for set 10 with no cell. It joins W, as in 2525D Figure D-5 and APP-6(E) Figure 3-3, with a note |
| E-AW | 2525E Table VI PDF 47/30 against Figure E-3 | AW is listed for set 10 with no cell. It is drawn below the frame, in the bottom field of Figure 13, with a note |
| E-AX | 2525E Table VI PDF 47/30 against Figure E-5 | AX is listed for set 20 with no cell. It joins C/AE, the row AX has in APP-6(E) Figure 3-13, with a note |
| E-AA | 2525E Figure E-5 against Table VI PDF 45/28 | The figure draws A/AA on installations. Accepted with a note |
| E-C27 | 2525E Table VI PDF 39/22 against Figure F-2 | C is listed for set 27 with no cell. It stays below the frame, as in APP-6(E) Figure 4-3, with a note |
| F length | 2525E Table VI, APP-6(E) Table 1-5 | Both say one character and describe (+). The one-character form is listed and the bracket form accepted. 2525D uses the bracket form (3 characters) |
| AO stage | APP-6(E) Table 1-5 PDF 83/49 | MT there, M<T in 2525D, 2525E and APP-6(D). Each edition takes its own form, and APP-6(E) takes both |
| L in APP-6(E) | Table 1-5 PDF 69/35 | "for equipment", with no hostile limit, unlike 2525 |
| Figure against set list | APP-6(E) Table 1-5 | Figures draw AE on Land Unit and installations, K on installations, T on activities and Y on subsurface, though the Table 1-5 set lists omit them. Accepted with a note |
| Mobility | 2525E Table VI lists set 10, APP-6(E) sets 10, 15, 20, 27, 64 | The class figures decide. Sets with no R cell are accepted with a note |
| Exercise letters | APP-6(B) Table B-I against the Studio | G, W, D, L and M are not in Table B-I. The Studio has offered them since the identity work, so they stay as a note, not an error |
| B on equipment | APP-6(B) Table I PDF 30/2-8 | The row prints 10, 2 and G for units, equipment and installations. An echelon is not rejected on any of them |
| Version digit | 2525D A.5.4.1 PDF 67/51 | "shall be populated with code 10": the Studio keeps 10 for 2525D and 13 for 2525E. Their Change 1 codes are read as well |

## Limits

- Icons and sector modifiers were not audited image by image. Only amplifier placement, fields and SIDC digits were checked.
- Text rows use the renderer's row spacing, so a column with fewer rows than the figure keeps its order, not the figure's exact height.
- S2/BA offset lines, AH, AI and AK need map data the library does not take. The Studio lists them as gaps.
- Set 64 has no frame or icon in the library. The profile places its fields, but the symbol does not render until that work is done.
- SIGINT placement in 2525D is product policy: no figure exists.
- 2525E set 60 lists AE and AP in Table K-II with no cell, so they are not offered.
- The studio catalogue for APP-6E is still the compatibility catalogue.
