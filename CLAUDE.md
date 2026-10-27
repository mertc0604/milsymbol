# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

milsymbol: a dependency-free JavaScript library that renders military unit symbols (MIL-STD-2525B/C/D/E, APP-6A/B/D/E) as SVG or Canvas from a SIDC code. This checkout also contains **Military Symbol Studio** (`studio/`), a browser editor built on the library, and an APP-6A (1998) point-symbol profile. See `STUDIO.md` and `docs/app6a.md`.

## Commands

Node is at `/opt/homebrew/bin` (Homebrew). It may not be on `PATH` in non-login shells.

```bash
npm run bundle          # rollup: index.js -> dist/milsymbol.development.js (UMD, global `ms`)
npm run build           # prebuild runs lint (with --fix) + tests, then bundle + minify -> dist/milsymbol.js
npm run lint            # eslint src test --fix (rewrites files)
npm run studio:build    # bundle + scripts/build-studio.mjs -> dist/studio/ (catalog.json, vendor/milsymbol.js)
npm run studio:serve    # static server for dist/studio on http://127.0.0.1:4173 (PORT env overrides)
```

**Tests need the `__version__` global.** `src/ms.js` references `__version__`, which rollup's replace plugin injects only at bundle time. So a plain `npm test` / `npx tead` fails with `ReferenceError: __version__ is not defined`. Inject it with `NODE_OPTIONS`:

```bash
NODE_OPTIONS='--import=data:text/javascript,globalThis.__version__=%22dev%22' npx tead
NODE_OPTIONS='--import=data:text/javascript,globalThis.__version__=%22dev%22' npx tead --testPattern='app6a\.test\.js$'
```

Any Node script that imports from `src/` directly needs the same injection (see the header of `scripts/audit-app6a.mjs`).

The test runner is [tead](https://github.com/teadjs/tead). A test file default-exports nested objects whose leaves are `[actual, expected]` pairs, compared with deep equality. There are no `describe`/`it`/`expect`. Most `test/*-<symbolset>.test.js` files iterate the official symbol tables from the `mil-std-2525`, `stanag-app6` and `milstandard-e` devDependencies, using the helpers `test/letter-sidc.js` and `test/number-sidc.js`. Each file calls `ms.reset()` and adds only the icon sets it needs.

Style: Prettier with `trailingComma: "none"`; ESLint requires semicolons and `prefer-const`.

## Architecture

**The `ms` singleton is a plugin registry** (`src/ms.js`). Rendering is assembled from pluggable pieces that are registered at runtime:
- **Symbol parts** (`src/symbolfunctions/*`): `ms.reset()` registers them in order (stack, basegeometry, icon, modifier, statusmodifier, engagementbar, affiliation/dimension, textfields, directionarrow). Each part is called with `this` = the Symbol and returns `{pre, post, bbox}` draw instructions.
- **Icon sets** (`ms.addIcons(...)`): `src/lettersidc.js` (15-character letter SIDCs, which group modules into `app6a`, `app6b`, `std2525b`, `std2525c`) and `src/numbersidc.js` (20/30-digit number SIDCs, which group into `app6d`, `std2525d`, `std2525e`). Each module under `*/sidc/*.js` is `{type: "letter"|"number", getMetadata, getIcons, iconParts, icons}`. `icons(sId, bbox, icn, STD2525)` maps SIDC keys such as `"S-A-MFB---"` to arrays of named primitives from `src/iconparts/*.js`.
- `index.mjs` exports the pieces for tree-shaking. `index.js` (the rollup input) registers every set and default-exports `ms`.

**Rendering pipeline**: `new ms.Symbol(sidc, options)` → `setOptions` (`src/ms/symbol/setoptions.js`). The steps are:
1. Split options into `style` and `options`.
2. `getMetadata()` decides letter vs number SIDC by whether the first two characters are numeric, then dispatches to `ms._getMetadata[type]`.
3. `getColors()`.
4. Run every registered symbol part, accumulating `drawInstructions` and a `BBox`.

`asSVG()`/`asCanvas()` serialize those abstract draw instructions; no DOM is needed for SVG. `isValid()` checks for `null` in the draw instructions and for an invalid icon.

**Icon cache**: `src/symbolfunctions/icon.js` caches resolved icon tables in `ms._iconCache`. The cache key is built from standard, edition, dimension, affiliation, colors, etc. Anything that changes which icons resolve must also be part of that key. `ms.addIcons` clears the cache.

**Standard selection**: `ms.setStandard("2525" | "APP6" | "APP6A")` sets `ms._STD2525` and `ms._standardEdition`. A per-symbol `style.standard` override takes precedence. 2525 vs APP6 mostly changes frame and icon variants through the `STD2525` flag passed to icon functions.

### APP-6A profile (fork extension, partial conformance)

- APP-6A explicitly lists the existing `lettersidc/sidc` and `iconparts` domain modules, registered through `ms.addIcons(app6a)`. It must not derive its bundle from `app6b` or load `std2525bextra`. Shared naval station geometry lives in the sea/subsurface icon-part modules. Do not add a second renderer or global provider registry.
- `src/lettersidc/metadata.js` contains the independent Annex B code vocabulary, `isApp6aSidc` and Table III field/modifier rules. The registered metadata provider returns optional `metadata.validation = {valid, details}`; `isValid()` consumes this result without importing edition-specific code. `setOptions()` recalculates it. APP-6A fails closed until a letter provider validates it.
- `studio/app6a-catalog.js` holds 907 editor/test entries with publication references. It is not part of the rendering library. Tests assert its IDs match the metadata vocabulary.
- EMS, US tactical, stability and SIGINT providers guard against overriding APP-6A definitions. Only explicitly registered modules are available after `ms.reset()`.
- Scope is point symbols only: no multipoint graphics, weather, or intel/mapping schemes. `docs/app6a.md` lists the errata and explicit local image-audit commands. Generated evidence stays in `output/app6a-audit/` and local `dist/studio/audit/`; the active image audit is S-scheme only.

### Studio

`studio/` (`index.html`, `app.js`, `styles.css`) is plain static HTML/JS. `scripts/build-studio.mjs` copies it to `dist/studio/` and does the following:
- Normalizes the symbol tables from the three standards devDependencies, plus the APP-6A catalog, into `catalog.json`.
- Copies the bundled `dist/milsymbol.development.js` to `vendor/milsymbol.js` and `src/lettersidc/metadata.js` to `vendor/letter-metadata.js` for shared modifier rules.
- Preserves the library and three catalog packages' complete licenses in the generated site. `npm run studio:build:public` uses allow-listed `dist/studio-public/`, excluding local PDF audits and hiding their link. It does not deploy.

Because the studio loads the bundled library, library changes are invisible in the studio until `npm run studio:build` runs again. `.openai/hosting.json` serves `dist/studio` statically.

## Releasing (from dev/README.md)

Bump `version` in `package.json`. The version string reaches the bundle via rollup replace. Then run `npm publish` and create a GitHub release tagged `vX.Y.Z`. For prereleases, use `npm pack` + `npm publish <tgz> --tag next`.
