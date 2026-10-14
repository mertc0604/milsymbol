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

Echelon and mobility start unspecified, including after Reset or switching their
mode. A deliberately selected value is not silently replaced by clicking the
same mode. Search accepts names, function codes and full SIDCs; Clear / Escape
resets search and pagination. Section switches return the form to its top.
On narrow screens, the compact symbol links to the full preview/download panel.

APP-6A (1998) has its own publication-derived catalog: 877 point-symbol entries,
edition-specific SIDC validation, Present/Planned status, and automatic installation
modifiers. It reuses the library's NATO drawing primitives; it is not a complete
implementation of multipoint tactical graphics or weather symbols. See
[APP-6A support and publication errata](docs/app6a.md).

The current visual audit covers only the 683 S-scheme entries. Follow the local
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
