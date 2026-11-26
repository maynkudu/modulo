# Modulo

A library of interactive pages, components, and shaders by maynkudu, inspired by Compronents' preview, documentation, and source installation model.

Compronents' verified implementation stores its source in a public monorepo and gates website downloads. Modulo stores its original component files in separate private repositories.

## Development

Use Bun to install dependencies and run the app:

```sh
bun install --frozen-lockfile
bun run components:sync
bun run dev
```

Portless serves the app at `https://modulo.localhost`. If the machine already runs a proxy with different settings, the command prints its configured named URL.

```sh
bun run lint
bun run typecheck
bun run build
```

## Structure

- `src/app/(site)/page.tsx` shows project thumbnails at `/`, with looping MP4 previews on hover and keyboard focus.
- `src/app/(site)/components/page.tsx` lists Components with keyword and date filters through `CatalogIndex`.
- `src/app/(site)/pages/page.tsx` and `src/app/(site)/shaders/page.tsx` show Pages and Shaders through `ComponentLibrary`.
- `src/components/work-collection-layout.tsx` supplies the shared category navigation. `src/app/(site)/layout.tsx` supplies the site header, footer, fonts, and theme.
- `src/app/(site)/components/interactive-art/page.tsx` contains the garden preview, controls, installation, API, and source.
- `src/registry/interactive-art/` contains fetched source from its private component repository, including six installable garden files.
- `src/app/(site)/components/root-infection/page.tsx` contains the text-only horror preview, installation, API, implementation notes, and source.
- `src/registry/root-infection/` contains fetched source from its private repository, including the ten installable files for the independent Verlet solver, mesh renderer, audio engine, and React lifecycle.
- `src/lib/catalog.ts` contains separate `catalogItems`, `pageCatalogItems`, and `shaderCatalogItems` arrays, installation targets, and API documentation. `getCatalogPath` returns each module's documentation URL.
- `src/app/view/[slug]/page.tsx` and `FullView` host standalone Component and Shader previews. `src/app/play/<slug>/page.tsx` hosts a complete Page preview.
- `src/lib/seo.ts` and `src/lib/site.ts` set page metadata, structured data, and the site origin.
- `public/media/` contains each component's JPG thumbnail and silent MP4 loop.
- `src/app/(site)/registry/page.tsx` documents authenticated installation through `@modulo`.
- `components.lock.json` pins private component repositories and source checksums. `scripts/sync-components.ts` fetches their files into ignored local directories.
- `scripts/build-registry.ts` generates source manifests under ignored `.private-registry/`. Authenticated `/r/<name>.json` routes serve them. The root `registry.json` contains metadata and file paths only.
- `/mint` creates and revokes source keys. `src/lib/access.ts` verifies passphrases and sessions, and `src/lib/mint-store.ts` persists key hashes and revocation state.
- `src/components/interface-sounds.tsx` and `src/lib/interface-sounds.ts` handle soft interaction sounds and the saved sound preference.
- `public/brand/` contains the supplied Modulo logo.
- `components.json` configures shadcn and source registries.

## Add a Page, Component, or Shader

Follow [the module workflow in AGENTS.md](AGENTS.md#add-or-update-a-page-component-or-shader). It defines category placement, current layout references, private source handling, preview routes, and verification.

Choose Pages for a complete installed page, Components for a reusable interface element, and Shaders for a visual shader. Category placement is separate from individual files' shadcn registry types. Keep each module in one category and use `getCatalogPath` for its documentation links.

## Install the first component

Run this from a React project configured for shadcn and the authenticated `@modulo` registry described below:

```sh
bunx shadcn@latest add @modulo/interactive-art
```

Import `GardenCanvas` from `@/components/interactive-art/examples/GardenCanvas`. Its canvas engine handles growth, elastic stems, keyboard interaction, reduced motion, and PNG layer exports. The component page documents its props and controller methods. The registry contains source files and requires no animation dependency.

Inherit typography and colors from the shared site layout and CSS tokens. Follow the current category reference in `AGENTS.md` when adding a demo or documentation page. Use Rune Icons for new icons.

Sound feedback starts after user interaction. The header's sound toggle mutes clicks, slider ticks, and drag feedback, and remembers the choice. Press motion stays small and stops under reduced motion.

## Root Infection

```sh
bunx shadcn@latest add @modulo/root-infection
```

Import `RootInfection` from `@/components/root-infection/RootInfection`. Keep the pointer still in the preview to start the infection. Moving retracts the roots along their paths. Clicking releases falling fragments. Hold Shift and drag a root to pull it, scroll to push it sideways, or press Escape to clear it. Roots spread breadth-first and wrap control edges. Later branches start thicker with wider segment spacing.

Consolidation starts halfway through `fullInfectionDelay`, after at least eight seconds. It gradually absorbs older thin roots and detached worms while preserving substantial forks. New mature branches inherit at least 60% of their parent's radius before tapering. They target uncovered areas and keep pushing toward the edges after the viewport fills. Crowded leaves merge into their parents to reuse particles. Merges transfer new tissue without repeatedly counting inherited birth girth. Roots keep thickening without a size ceiling.

Physics and rendering iterate active particles. Pools reuse released storage, and finite allocation budgets remain optional. Auto quality keeps full resolution, physics passes, and skin detail. It can advance consolidation when frame cost grows. Rounded WebGL 2 meshes share normals at their joints, and connected forks share a continuous skin field. A floating-point geometry pass keeps only visible tissue before calculating grain, veins, scars, and wet highlights. The same material renders directly when floating-point targets are unavailable. Canvas 2D provides a fallback. Geometry and GPU buffers are reused.

The component requires React, WebGL 2 or Canvas 2D, and optional Web Audio. It ships no runtime dependency. The demo uses Modulo's sound preference, but the installable component owns its audio independently. Reduced motion disables automatic growth. Hidden tabs stop the clock, and unmount removes all temporary resources, including GPU objects.

Run the focused solver checks and optional CPU benchmark:

```sh
bun scripts/verify-root-infection.ts
bun scripts/verify-root-infection.ts --benchmark
```

The benchmark measures physics only. Use the controller's `snapshot()` for actual browser frame and rendering timings. These measurements are specific to the machine and current load.

## Nilkamal

```sh
bunx shadcn@latest add @modulo/nilkamal
```

Import `Nilkamal` from `@/components/nilkamal/Nilkamal`. The single blue lotus responds to hovering and dragging. Choose clear, rain, storm, snow, or hail. Rain beads on the petals and splashes into the pond. Snow accumulates while ice spreads across the water. Warmer weather melts the accumulation.

Weather, intensity, pause, and audio props update the existing scene. The controller supports bloom, lightning, reset, state inspection, and PNG layer exports. Each instance owns its Canvas and Web Audio resources. Sound unlocks after interaction. Pause, hidden tabs, offscreen visibility, and reduced motion stop continuous work.

The component page at `/components/nilkamal` includes controls, installation, API documentation, and the ten installable source files. It requires React and browser Canvas 2D, with optional Web Audio, and adds no runtime dependency.

## Private component repositories

Each module owns its original source in a separate private GitHub repository. `components.lock.json` lists every repository and pinned revision. Examples include:

- [Interactive art](https://github.com/maynkudu/modulo-interactive-art).
- [Root Infection](https://github.com/maynkudu/modulo-root-infection).
- [Nilkamal](https://github.com/maynkudu/modulo-nilkamal).

The main Modulo repository is public. Every new module stores its original implementation in a separate private repository. The website, live interactive previews, usage examples, and API documentation remain public. See `AGENTS.md` for the module integration workflow.

For local source sync, authenticate with `gh auth login`. Deployment builds use `MODULO_COMPONENTS_TOKEN`, a fine-grained GitHub token with read-only Contents access to the repositories listed in `components.lock.json`. Credentials never go in that file.

`bun run components:sync` verifies existing files and downloads missing ones. It refuses to overwrite modified source. `bun run components:sync --force` explicitly fetches all pinned files again. Develop component changes in their private repository, update its pinned revision and SHA-256 checksums in `components.lock.json`, then sync. Build and typecheck run source sync automatically. A fresh checkout needs private GitHub access.

## Mint and source access

The mint requires the configured passphrase. Input remains masked and has no reveal control. It creates `maynkudu_` keys with 32 random bytes and displays each complete key once. The database retains a SHA-256 hash, a masked suffix, a label, and dates. Mint sessions expire after eight hours. Revocation denies the next source request, including requests from existing browser sessions.

Set `MODULO_MINT_PASSPHRASE_HASH` in the server environment. Generate its scrypt verifier through stdin and pass the output directly to the environment-setting tool. Do not save the passphrase or verifier in repository files. The `bun run mint:passphrase` helper accepts stdin only. To start a local development process without writing credentials:

```sh
read -rsp 'Mint passphrase: ' modulo_passphrase
export MODULO_MINT_PASSPHRASE_HASH="$(printf '%s' "$modulo_passphrase" | bun run mint:passphrase)"
unset modulo_passphrase
bun run dev
```

Development defaults to an ignored SQLite database at `.data/mint.db`. Vercel requires a persistent hosted Turso primary, configured with `MODULO_DATABASE_URL` and `MODULO_DATABASE_AUTH_TOKEN`. Authorization reads the primary on every request and does not use an embedded replica or cache. Missing configuration or database failures deny access. The schema initializes automatically on first use.

An active key unlocks the original files in each component's Source section. Browser access uses an opaque HttpOnly cookie, never a plaintext key in local storage. An owner mint session does not grant source access without a key. Already downloaded or installed files cannot be removed by revocation.

Run the focused route and persistence checks:

```sh
bun run verify:access
```

## Authenticated installation

Add this entry to the consumer project's `components.json`, preserving its existing registries:

```json
{
  "registries": {
    "@modulo": {
      "url": "https://modulo-maynkudu.vercel.app/r/{name}.json",
      "headers": { "Authorization": "Bearer ${MODULO_REGISTRY_KEY}" }
    }
  }
}
```

For local installation, replace the origin with the named URL printed by the dev command. Set the key in the consumer shell without saving it to configuration:

```sh
read -rsp 'Modulo key: ' MODULO_REGISTRY_KEY
export MODULO_REGISTRY_KEY
bunx shadcn@latest add @modulo/interactive-art
```

Use `npx` in place of `bunx` for npm projects. Direct `/r/*.json` URLs require a Bearer header or an active browser source session, including the full registry catalog. Source responses are private and cannot be cached. `REGISTRY_BASE_URL` controls media URLs in generated registry metadata.

Inspect BLANK source with `blank source <name>`. After choosing a component for the app, configure access with `blank configure .`, then install it with `blank shadcn add @compronents/<name>`. The helper supplies authentication at runtime.

## SEO and component media

`DOMAIN_ACTIVE` selects the canonical origin used by Open Graph images and videos, structured data, the sitemap, and registry media links. It defaults to false:

```sh
DOMAIN_ACTIVE=false # https://modulo-maynkudu.vercel.app
DOMAIN_ACTIVE=true  # https://modulo.maynkudu.com
```

Set the variable in the deployment environment and rebuild after changing it. `NEXT_PUBLIC_SITE_URL` overrides this selection for local verification or another origin. `REGISTRY_BASE_URL` separately overrides generated registry media URLs. Update the consumer's static `components.json` registry URL when switching to the custom domain.

The home, Components, and Registry pages use the Modulo logo for sharing. Each component uses its thumbnail for Open Graph and Twitter images, and its matching MP4 for `og:video`. MP4s play in the home grid on hover or keyboard focus. Reduced motion, video failure, and loading keep the thumbnails visible.

`/sitemap.xml` lists site pages, category documentation, full previews, and their images. `/robots.txt` points to the sitemap. Vercel preview deployments have `noindex` metadata. Registry JSON responses have a `noindex` header.

## Record a compact preview

Use this workflow for Pages, Components, and Shaders. Install Node.js 24, Bun, FFmpeg, and FFprobe before recording.

1. Add the slug to its category in `src/lib/catalog.ts`. Set its real aspect ratio and a short duration. `componentMedia` scales the existing 1200 px reference dimensions to a 720 px output with an even height.
2. Add its actual interactive implementation to `scripts/component-media-preview.tsx`. Mark the page ready after fonts, images, and the renderer initialize. Keep demo data deterministic and disable audio.
3. Add a named shot specification and any scripted interaction to `scripts/build-component-media.ts`. Start with the subject ready, show one interaction and its outcome, then return to the starting state. For ambient scenes, use the existing wrap blend. Omit startup waits, unrelated controls, tutorial key overlays, and added captions. Match the current demo's fonts, colors, and background.
4. Aim for a 3.5 to 6 second loop. Keep duration within six seconds and on a whole 60 fps frame boundary. Preserve 60 fps when compressing. Trim the shot or simplify its framing when it exceeds the size limit.
5. Sync source and inspect a targeted dry-run. Replace `state-buttons` in these commands with the new slug:

```sh
bun run components:sync
bun run media:build --component state-buttons --dry-run
bun run media:build --component state-buttons --output-dir .plannotator/media-preview
```

6. Play the generated MP4 in a browser and inspect its JPG poster. Check framing, readable details, the interaction's outcome, and several loop joins. Before publishing, generation checks actual frames, fully decodes the video, and checks the poster dimensions. A frame-rate label alone does not prove a valid recording.
7. Publish only the inspected `<slug>.mp4` and `<slug>.jpg` pair into `public/media/`. Run the checks below. Keep the full interactive preview working; a video supplements it.

```sh
bun scripts/component-media-policy.ts
bun run media:verify
bun run registry:build
```

The shared limits live in `scripts/component-media-policy.ts`. Each output is a silent 60 fps H.264 MP4 with `yuv420p` pixels and fast-start metadata. Videos are 720 px wide and preserve the aspect ratio. JPG posters have matching dimensions. The hard video limit is **1,000,000 bytes**, with an 850,000-byte encoding target for headroom. Keep simple previews below 500,000 bytes when possible. The encoder retries oversized output with two-pass compression and refuses to publish files that still exceed the limit.

Registry generation, typecheck, and production builds run a lightweight check for the file list, sizes, and catalog metadata. This rejects GIFs, raw captures, missing files, uncataloged files, and invalid dimensions or duration without requiring FFmpeg on the deployment host. `media:verify` additionally probes the real codecs, frame counts, dimensions, and duration, then decodes every video with FFmpeg.

Record only changed slugs. Comma-separated `--component` names select a small batch; omit the flag only for an intentional full refresh. After changing encoding settings, reuse the original raw frames:

```sh
bun run media:build --component state-buttons --encode-only --output-dir .plannotator/media-preview
```

`--encode-only` skips browser capture, bundling, and capture-page preparation. Use a fresh capture after implementation or interaction changes. `--dry-run` and `--encode-only` are separate modes.

The pinned Webreel adapter advances the animation clock once per captured frame. Capture can take longer than playback on a slow host. It samples each frame instead of duplicating screenshots to fill a timeline. This is an offline rendering workflow, not a runtime performance benchmark.

Raw recordings, configuration, and reports live in `~/.webreel/modulo-component-media/`. `MODULO_MEDIA_WORKSPACE` overrides that path. Keep it on the same filesystem as `~/.webreel` to avoid a cross-filesystem rename failure. Run one capture or encode process per workspace. Use a different workspace for independent concurrent work. Keep raw captures, GIFs, WebM files, and review artifacts out of `public/media/` and Git.

Set `MODULO_MEDIA_SOFTWARE_GL=1` on a headless host without a graphics driver. `FFMPEG_PATH` and `FFPROBE_PATH` select existing binaries. Run `bun test scripts/component-media-policy.test.ts` after changing the policy or its enforcement.
