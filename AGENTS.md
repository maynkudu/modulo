<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Add or update a Page, Component, or Shader

The main `maynkudu/modulo` repository is public. Every new module's original implementation belongs in its own private `maynkudu/modulo-<slug>` repository. Public pages keep real interactive previews. Original source downloads and installation require an active mint key.

### Choose the category and current layout

Add the module to exactly one category in `src/lib/catalog.ts`:

| Category | Catalog array | Documentation route | Full preview | Reference implementation |
| --- | --- | --- | --- | --- |
| Pages | `pageCatalogItems` | `src/app/(site)/pages/<slug>/page.tsx` | `src/app/play/<slug>/page.tsx` | Switchback documentation and `SpriteRacerDemo` |
| Components | `catalogItems` | `src/app/(site)/components/<slug>/page.tsx` | `/view/<slug>` through `FullView` | State buttons documentation and `StateButtonsDemo` |
| Shaders | `shaderCatalogItems` | `src/app/(site)/shaders/<slug>/page.tsx` | `/view/<slug>` through `FullView` | Halftone documentation and `HalftoneDemo` |

Use `getCatalogPath(slug)` for documentation links. `previewCatalogItems` combines Components and Shaders for `/view`; `allCatalogItems` also includes Pages for media, registry generation, and source authorization. Keep these derived arrays intact.

Keep documentation under `(site)` so it inherits the shared header, footer, fonts, and theme. Reuse `page.module.css`, `ComponentSection`, and the existing documentation components. Use `DemoSurface`, `DemoPanel`, and controls from `demo-controls.tsx` when the preview needs controls. Preserve accessible focus and reduced-motion behavior.

Category index pages use `WorkCollectionLayout`. Pages and Shaders use `ComponentLibrary`; Components uses `CatalogIndex`. Update the category's data instead of adding a separate gallery or navigation system. Page previews use `/play/<slug>` and can be embedded in their documentation. Add Components and Shaders to the `views` map in `src/components/full-view.tsx`.

### Integrate private source and public previews

1. Choose a unique lowercase, hyphenated slug. Create the module repository as private and verify its GitHub visibility. Keep installable components, engines, styles, and their internal dependencies there. Use relative internal imports or declared registry dependencies so installation works without Modulo's app code. The main app stores demo controls, documentation, metadata, and public media.
2. Before fetching or writing implementation files in the main checkout, add `/src/registry/<slug>/` to `.gitignore`. Preserve the ignores for `.private-registry/`, `public/r/`, and `.env*`. Check `git check-ignore src/registry/<slug>/example.ts` and confirm `git ls-files -- src/registry/<slug>/ .private-registry/ public/r/` returns no source files. Ignoring a file does not remove it from Git history.
3. Add the module to `components.lock.json` with its private repository, full 40-character commit SHA, and every required file's repository-relative path and SHA-256 checksum. Include preview assets needed at build time. Update the same entry when changing an existing module. Develop source changes in the private repository, then update the pin and checksums, rather than editing fetched copies.
4. Give the existing `MODULO_COMPONENTS_TOKEN` read-only Contents access to the new repository if it uses selected repositories. One token can cover all module repositories. Update the existing Vercel Production and Preview secret if the token changes. Local sync can use `gh auth login`. Run `bun run components:sync`; it checks hashes and refuses modified local files. Use `--force` only when intentionally replacing local copies with the pinned source. Keep credentials out of commands, logs, and tracked files.
5. Define the registry item and add it to the chosen category array. Declare npm dependencies, registry dependencies, and every installable file with its source path, installation target, and registry type. Page modules may include an `app/<name>/page.tsx` installation target. Install dependencies needed by the public preview in the main app too. Include the title, description, added date, keywords, SEO description, and media. Keep metadata free of source contents.
6. Add the category's documentation route and a client demo wrapper under `src/components/`. Follow the reference implementation in the table. Import synced source for a working preview. Include usage, API documentation, `InstallCommand`, `ComponentMediaLinks`, `ComponentSource`, `getComponentMetadata`, and `StructuredData` using `getComponentStructuredData`. Use `ComponentHeadingActions` for Components and Shaders, and a `/play/<slug>` action for Pages. Keep implementation source out of page props and public JSON. Reuse the source gate and header-based `@modulo` installation. Preview browser JavaScript is intentionally public.
7. Follow [Record a compact preview](README.md#record-a-compact-preview) before adding or changing media. Add one capture case and shot specification for the slug. Generate only that slug into an isolated directory, inspect playback and the loop join, then publish its verified MP4/JPG pair. All three categories follow `scripts/component-media-policy.ts`. Keep raw recordings outside `public/media`; GIFs and uncataloged assets fail the build. Run `bun run media:verify` and `bun run registry:build`. Source manifests stay under ignored `.private-registry/`; tracked `registry.json` contains metadata and paths only. `next.config.ts` traces private manifests for `/r/*`.
8. Run lint, typecheck, access verification, and the production build. Verify the module appears only in its intended category and its documentation, full preview, metadata, sitemap, media links, and registry route resolve correctly. Verify a fresh checkout can sync and build with private-repository access. Operate the preview anonymously on desktop and mobile, including keyboard and reduced motion. Verify anonymous source denial, active-key source unlock and actual Shadcn installation, installed files, and denial on the next request after revocation. Revoke verification keys and close owned browser sessions.
9. Review `git status` and the staged diff before any authorized commit or push. Only the app integration, lockfile, metadata-only registry, documentation, and public media belong in the main repository. Verify the new repository remains private and the synced implementation, manifests, and credentials remain untracked. Commit and push only when the user asks.
