# Review Findings Fix Plan

**Goal:** Fix the eight reproducible findings in `output/review-2026-11-04/inceleme.md` and verify library and Studio behavior.

**Architecture:** Keep the existing metadata/profile pipeline and shared renderer. Reject unsupported numeric versions through its validation contract; resolve exercise identities from context. Make scaling non-mutating, fix Canvas alpha and final-bounds anchors, and align package exports with declarations. Keep existing uncommitted APP-6A/UI work intact.

**Tech stack:** JavaScript ES modules, tead, Node test runner, ESLint, Rollup, static Studio.

**Spec:** The eight findings and remedies in the review, authorized by the user with “tamam düzelt bakalım bunları”. Optional product features from the review are not part of these fixes.

## Constraints

- Preserve user changes; do not reset, stash, publish or deploy them.
- Retain the default UMD `ms` global and CommonJS API while correcting ESM declarations.
- Add focused regression tests and observe failures before implementation.
- Keep permissive rendering available while reporting unsupported SIDC versions invalid.
- Preserve APP-6D's documented frame differences and all existing valid versions 10–16.

## Tasks

- [x] Metadata/Studio: test unsupported versions, corrected context 1/5/6 Joker/Faker and reality/simulation controls; implement R1/R2.
- [x] Rendering: test stable saved symbols across cache scaling, opaque Canvas strokes, square/HQ octagon coordinates; implement R3/R4/R5.
- [x] Toolchain/package: test the declared ESM runtime exports and default entry; implement R6/R7 with working non-mutating lint and CI checks.
- [x] APP-6E: test alphanumeric AS length/format independently of MIL's three-letter field; implement R8 and update field help.
- [x] Integration: run full tests, Node smoke checks, lint, normal build, public Studio build, local browser checks and independent review.

## Review focus

Unknown versions must not become valid when display switches are changed. Context changes must retain restricted/no-strike markers and correct exercise identity. Nested drawing arrays must remain immutable. UMD output must remain `window.ms.Symbol`. Existing user changes must remain present.

## Execution record

Implementation authorized directly against a concrete review; proceed without another approval round. Work in the existing checkout so the dirty APP-6A/UI changes remain available for integration. Preserve an initial snapshot under ignored `.superpowers/review-fixes-baseline/`; no automatic commits or publication.

Verification: metadata/Studio/AS regressions RED 61 failures, GREEN 150 passing;
renderer regressions RED 17 failures, GREEN 18 passing; ESM tests initially failed
on missing exports. Full `npm run build` passed 23,541 tead assertions, lint,
bundle and minify. Public Studio build and five Node integration tests passed.
Local browser confirmed unsupported version error, correct restricted-exercise
Faker `K`, and APP-6E AS `792` without a format warning. Independent review found
no confirmed regressions. Original untouched user diff blocks matched the snapshot.
