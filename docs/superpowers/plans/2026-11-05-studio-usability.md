# Studio Usability Implementation Plan

> Execute inline using executing-plans. The user requested implementation of the numbered review suggestions.

**Goal:** Simplify the editor and preserve complete drafts without modifying the rendering library.
**Architecture:** Add a versioned local storage module; adapt the existing editor state and form fields. Native disclosure controls expose technical notes and secondary identities.
**Tech Stack:** Existing JavaScript, HTML, CSS and Node tests.
**Spec:** `docs/superpowers/specs/2026-11-05-studio-usability-design.md`

## Global Constraints

- Keep `src/` and rendering rules unchanged.
- No new dependencies.
- Save locally; handle corrupt, outdated or unavailable storage gracefully.
- Preserve custom SIDCs, duplicate catalog row selections, disabled text, flags and style.

## Review Focus

- Restore flags after asynchronous artwork loading, including display-only flags.
- Restore imported SIDCs without losing noncatalog functions or tail digits.
- Reset Undo must restore all form values and must not overwrite subsequent edits.
- Selecting a secondary identity must remain apparent while its disclosure is closed.
- Larger typography must fit small screens and long standard-specific labels.

## Task 1: Draft persistence and Reset Undo

- [x] Add Node tests for storage round trips, corruption, version mismatch and storage failure; run them failing.
- [x] Add `studio/draft-store.js`, integrate snapshot/restore and visible storage status into `studio/app.js` and `studio/index.html`; include the module in `scripts/build-studio.mjs`.
- [x] Verify reload, standard/flag/style/text restoration and Reset Undo in the browser.

## Task 2: Information hierarchy and typography

- [x] Move technical notes into native disclosure elements; keep warnings visible and the SIDC breakdown collapsible.
- [x] Split primary and secondary identities with selection visibility and keyboard focus preserved.
- [x] Adjust typography and reduce nested card decoration; check desktop and narrow layouts.

## Task 3: Verification

- [x] Run Node tests, lint, full project tests and Studio public build.
- [x] Review final diff and confirm `src/` is unchanged. Record actual results in the final response.

## Verification results

- `npm test`: 24,976 passing.
- `npm run test:node`: 17 passing, including eight draft storage tests.
- `npm run lint`, `npm run studio:build:public`, and `git diff --check`: passed.
- Live browser: text/style/standard/coded and display-only flag restoration, custom SIDC national tails, Reset Undo, and selected secondary identity visibility verified. Delayed flag request reproduced and verified the pending-flag fix.
- 320px and 390px viewports: no horizontal overflow; the 30-character SIDC input grows to fit.
- Read-only reviewer found two persistence issues; both fixed and re-reviewed without further findings. `src/` is unchanged.
