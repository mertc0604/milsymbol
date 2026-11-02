# Studio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move Military Symbol Studio to the proposal 3 layout without losing any of its 51 current features, and add the new features from the spec.

**Architecture:** The editor logic in `studio/app.js` stays in place. New pure helpers go to `studio/editor-helpers.js` (unit tested in Node) and the reference tables go to `studio/field-reference.js`. The page skeleton (`index.html`) and stylesheet (`styles.css`) are rebuilt. Identity and status chips are adapters over the existing `<select>` elements, so the import and edit logic keeps working unchanged.

**Tech Stack:** Plain ES modules, milsymbol UMD bundle (`window.ms`), tead tests, rollup bundle.

**Spec:** `docs/superpowers/specs/2026-11-02-studio-redesign-design.md`

## Global Constraints

- No framework and no new dependency. `src/` is unchanged.
- Every new `studio/*.js` file goes into both lists in `scripts/build-studio.mjs`: the copy list and the public `allowed` set.
- Keep the existing control ids used by `app.js`, unless a task renames one explicitly.
- UI copy stays English, in sentence case.
- Tests run with `NODE_OPTIONS='--import=data:text/javascript,globalThis.__version__=%22dev%22' npx tead`. The baseline is 15181 passing.

## Review Focus

- Pasting a SIDC that contains line breaks or `*` still applies, with the same resolution rules as today.
- Switching standards with an imported SIDC keeps the country and the order of battle. Hidden APP-6A fields stay out of the export.
- In Field positions mode, an export still uses the normal render, not the tagged one.
- The narrow layout (< 1100 px) is usable: the columns stack and nothing scrolls sideways.
- Search panel keyboard flow: `/` opens it, Esc clears and then closes, Enter picks a result, and focus returns to the launcher.

---

### Task 1: Pure helpers, reference tables, signature select, build lists

**Files:**
- Create: `studio/editor-helpers.js`, `studio/field-reference.js`, `test/studio-editor-helpers.test.js`
- Modify: `studio/modifier-fields.js` (give `signatureEquipment` the choices `["", "Not applicable"], ["!", "! (electronic signature)"]`), `scripts/build-studio.mjs` (both lists)

**Interfaces (produces):**
- `fieldStates(textModifiers, app6a)` returns one entry per field: `{key, field, label, available, maxLength, reason}`.
  - `app6a` is `null` for every other standard, where all fields are available, `maxLength` is `null` and `reason` is `""`.
  - Otherwise `app6a` is `{available: getApp6aFields(sidc), table: app6aTextFields, kind, identity}`.
  - Possible reasons: `"Not in APP-6A"`, `"Equipment only"`, `"Units only"`, `"Hostile or suspect only"`, `"Not for <kind label>"`.
- `formatDtg(date)` returns `DDHHMMZMONYY` in UTC.
- `evaluationRating(reliability, credibility)` returns, for example, `"B2"`, or `""` when either part is invalid.
- `sidcParts(sidc, dEdition)` returns `[{key, label, value}]`, covering the same parts as today's `updateSegments`.
- `pushRecent(list, id, max = 8)` returns a new array with the id moved to the front and no duplicates.
- `placeholderOptions(states, values)` returns `{options, codes}`:
  - Each available, empty text field gets `[CODE]` in `options`.
  - `engagementType` is skipped.
  - `codes` maps `"[CODE]"` to the field key.
- `fieldReference` maps a field key to `{title, rows: [[code, meaning]], note}`. It has entries for `evaluationRating`, `engagementBar`, `dtg` and `location`.

- [ ] Step 1: Write the tests. They assert:
  - `formatDtg(new Date(Date.UTC(2026, 10, 2, 14, 35)))` returns `"021435ZNOV26"`.
  - `evaluationRating("b", "2")` returns `"B2"`; `evaluationRating("G", "2")` returns `""`.
  - For APP-6A unit `SFGPUCI--------`: quantity is unavailable with reason `"Equipment only"`, `higherFormation.maxLength` is 21, and `platformType.reason` is `"Not in APP-6A"`.
  - For friend equipment `SFGPEVATM------`: quantity is available and `signatureEquipment.reason` is `"Hostile or suspect only"`.
  - For a non-APP-6A standard, every field is available.
  - `sidcParts("SFGPUCI----F---", false)` labels match today's eight legacy parts.
  - `pushRecent(["a", "b"], "b")` returns `["b", "a"]`.
  - `placeholderOptions` puts `"[T]"` on an empty T and keeps a filled value.
- [ ] Step 2: Run the new test and confirm it fails.
- [ ] Step 3: Implement the helpers and the tables. Add the signature choices and both build list entries.
- [ ] Step 4: Run the full suite and confirm 15181 + new tests pass.

### Task 2: Page skeleton and stylesheet

**Files:** Modify `studio/index.html` and `studio/styles.css`.

- Header: brand, `#searchLauncher`, `#standardSelect`, source link and `#helpButton`.
- `#searchPanel`, a hidden overlay, contains: `#symbolSearch`, `#clearSearch`, `#categoryList`, `#resultCount`, `#recentSection` with `#recentGrid`, `#symbolGrid` and `#loadMore`.
- Left `aside#previewPanel` contains:
  - Heading: `#selectedName`, `#selectedPath`, `#symbolClass`, `#renderState`.
  - Preview: `#stage` with `#symbolPreview`, and the toggles `#positionsToggle`, `#gridToggle`, `#outlineToggle`.
  - Export: `#downloadSvg`, `#downloadPng`, `#copySvg`.
  - SIDC console: `#sidcInput`, `#applySidc`, `#sidcLength`, `#sidcStatus`, `#sidcSegments`, `#copySidc`.
  - Footer: `#supportNote`, `#publicationAudit`, attribution.
- Right `section.editor-panel` contains:
  - Tab bar with `#textFilledBadge` and `#resetButton`, plus `#compactPreview`.
  - Scroll container `.control-scroll`.
  - Symbol panel: identity card (`#identityChips` plus the hidden `#affiliation` select, `#contextField`), status card (`#statusChips` plus the hidden `#status`), unit designation card (`#hq`, `#taskForce`, `#feintDummy`, `#designationNote`), echelon card (`#amplifierMode`, `#amplifierValue`, `#amplifierLabel`), country card (`#countryFlag`, `#flagSwatch`, `#countryFlagNote`), and edition card (`#symbolModifiers`, `#frameShapeField`, `#legacyNote`).
  - Text panel: `#textSummary`, `#toggleUnavailable`, `#clearText`, `#app6aTextFields`, `#app6aFieldNote`.
  - Graphics panel:
    - Direction: `#direction`, `#directionNumber`, `[data-direction]` buttons, `#directionDial`, `#directionOutput`.
    - Graphic amplifiers: `#speedLeader`, `#hqStaffLength`, `#hqStaffNote`.
    - Display: `#fill`, `#frame`, `#icon`, `#infoFields`, `#showFlag`.
    - Style: `#colorMode`, `#stack`, `#symbolSize`, `#strokeWidth`.
    - Advanced style: `#fillColorOn`, `#fillColor`, `#monoColorOn`, `#monoColor`, `#fillOpacity`, `#infoColorOn`, `#infoColor`, `#infoSize`, `#infoBackgroundOn`, `#infoBackground`, `#outlineWidth`, `#outlineColor`.
- `#helpDialog` text describes the search panel, Field positions and the SIDC console. `#toast` stays.

- [ ] Step 1: Write the markup and CSS. Desktop layout: grid `396px minmax(0, 1fr)`. Below 1100 px the columns stack. Below 700 px paddings shrink and the tab bar scrolls.
- [ ] Step 2: Check every id that `app.js` reads, with a grep of `dom` keys against the markup. The check must print nothing.

### Task 3: Editor wiring

**Files:** Modify `studio/app.js`.

**Interfaces (consumes):** the Task 1 helpers and the Task 2 ids.

- [ ] Step 1: Search panel.
  - Behavior: open and close, the `/` shortcut, Esc (clear first, then close), backdrop click, ArrowDown from the input into the grid, Enter selects, and focus returns to the launcher.
  - `#categoryList` buttons with counts replace `#categoryFilter`.
  - Recently used list: key `symbol-studio:recent:<standard>`, updated with `pushRecent`, every read and write in `try/catch`.
- [ ] Step 2: Identity and status chips.
  - Render them from the options of the hidden selects.
  - Glyphs: mini symbols built from the current SIDC with the identity or status position replaced (legacy positions 2 and 4; numeric positions 4 and 7), cached by SIDC.
  - A disabled select disables the chips. Clicking a chip sets `select.value` and dispatches `change`.
- [ ] Step 3: SIDC console.
  - The draft is not overwritten while `state.sidcDirty` is true.
  - Esc reverts. Apply results go to `#sidcStatus`, in the kinds `ok`, `error`, `info` and `pending`.
  - Render validity errors from `isValid(true)` appear there too.
  - `#sidcSegments` cells show each part's meaning.
- [ ] Step 4: Text fields.
  - `fieldStates` drives availability. Unavailable fields render as reason rows; `#toggleUnavailable` hides them.
  - `#textSummary` and `#textFilledBadge` counts.
  - Descriptions show on focus. Reference `<details>` come from `fieldReference`.
  - DTG "Now (UTC)" button. J builder selects.
- [ ] Step 5: Field positions.
  - The preview renders with `placeholderOptions`, while `currentSvg` stays the normal render.
  - Tagged text gets the `field-tag` class and `data-field`. A click opens the Text tab and focuses the field.
- [ ] Step 6: Graphics.
  - The dial, the number input and the quick buttons stay in sync with `#direction`.
  - The `#showFlag` switch.
  - Advanced style options map to `fillColor`, `monoColor`, `fillOpacity`, `infoColor`, `infoSize`, `infoBackground`, `outlineWidth` and `outlineColor`.
  - Reset clears them all.
- [ ] Step 7: Notes and rule text.
  - The class badge `#symbolClass` comes from `app6aSymbolClass` on APP-6A, and from the icon category elsewhere.
  - `#designationNote` gives the reasons for disabled toggles. `#hqStaffNote`.

### Task 4: Docs, build and verification

**Files:** Modify `STUDIO.md`.

- [ ] Step 1: Document the new layout and features in `STUDIO.md`.
- [ ] Step 2: Run the full suite (expect all passing), `npm run lint`, `npm run studio:build` and `npm run studio:build:public`.
- [ ] Step 3: Browser check on `npm run studio:serve`, in all 7 standards:
  - The 51-row parity table from the spec.
  - The new features.
  - Width 375 px.
  - The console has no errors.
