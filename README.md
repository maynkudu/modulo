# Modulo

A component library by maynkudu, inspired by Compronents' preview, documentation, and source installation model.

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

- `src/app/page.tsx` shows one thumbnail per component at `/`, with GIF previews on hover and keyboard focus.
- `src/app/components/page.tsx` lists component names and added dates, with keyword and date filters.
- `src/app/components/interactive-art/page.tsx` contains the garden preview, controls, installation, API, and source.
- `src/registry/interactive-art/` contains fetched source from its private component repository, including six installable garden files.
- `src/app/components/root-infection/page.tsx` contains the text-only horror preview, installation, API, implementation notes, and source.
- `src/registry/root-infection/` contains fetched source from its private repository, including the ten installable files for the independent Verlet solver, mesh renderer, audio engine, and React lifecycle.
- `src/lib/catalog.ts` contains component metadata, installation targets, and API documentation.
- `src/lib/seo.ts` and `src/lib/site.ts` set page metadata, structured data, and the site origin.
- `public/media/` contains each component's thumbnail, GIF, and MP4.
- `src/app/registry/page.tsx` documents authenticated installation through `@modulo`.
- `components.lock.json` pins private component repositories and source checksums. `scripts/sync-components.ts` fetches their files into ignored local directories.
- `scripts/build-registry.ts` generates source manifests under ignored `.private-registry/`. Authenticated `/r/<name>.json` routes serve them. The root `registry.json` contains metadata and file paths only.
- `/mint` creates and revokes source keys. `src/lib/access.ts` verifies passphrases and sessions, and `src/lib/mint-store.ts` persists key hashes and revocation state.
- `src/components/interface-sounds.tsx` and `src/lib/interface-sounds.ts` handle soft interaction sounds and the saved sound preference.
- `public/brand/` contains the supplied Modulo logo.
- `components.json` configures shadcn and source registries.

## Install the first component

Run this from a React project configured for shadcn and the authenticated `@modulo` registry described below:

```sh
bunx shadcn@latest add @modulo/interactive-art
```

Import `GardenCanvas` from `@/components/interactive-art/examples/GardenCanvas`. Its canvas engine handles growth, elastic stems, keyboard interaction, reduced motion, and PNG layer exports. The component page documents its props and controller methods. The registry contains source files and requires no animation dependency.

The site uses the supplied black and white logo, Geist Pixel Square headings, Geist Mono body text, and square panels. Use Rune Icons when adding icons.

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

Each component owns its original source in a separate private GitHub repository:

- [Interactive art](https://github.com/maynkudu/modulo-interactive-art).
- [Root Infection](https://github.com/maynkudu/modulo-root-infection).
- [Nilkamal](https://github.com/maynkudu/modulo-nilkamal).

Modulo itself is private because its earlier history contains the component source. The website, live interactive previews, usage examples, and API documentation remain public.

For local source sync, authenticate with `gh auth login`. Deployment builds use `MODULO_COMPONENTS_TOKEN`, a fine-grained GitHub token with read-only Contents access to the three component repositories. Credentials never go in `components.lock.json`.

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
      "url": "https://modulo.maynkudu.com/r/{name}.json",
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

The canonical origin defaults to `https://modulo.maynkudu.com`. Set `NEXT_PUBLIC_SITE_URL` in the deployment environment to select another origin. Until the production domain is connected, the current deployment can use:

```sh
NEXT_PUBLIC_SITE_URL=https://modulo-maynkudu.vercel.app bun run build
```

The home, Components, and Registry pages use the Modulo logo for sharing. Each component uses its thumbnail for Open Graph and Twitter images, and its matching MP4 for `og:video`. GIFs play in the home grid on hover or keyboard focus. Reduced motion keeps the thumbnails still.

`/sitemap.xml` lists the six public pages and their images. `/robots.txt` points to the sitemap. Vercel preview deployments have `noindex` metadata. Registry JSON responses have a `noindex` header.

Regenerate the component media with FFmpeg installed:

```sh
bun run media:build --dry-run
bun run media:build
```

The command bundles the existing components into a local capture page and uses Webreel to record them. Capture files and the recording config live in `.plannotator/component-media/`. JPGs and MP4s are 1200 by 630 pixels. GIFs are 640 by 336 pixels and four seconds long. Use `--output-dir <directory>` to inspect regenerated assets in a separate directory.

Add a capture scenario in `scripts/build-component-media.ts` and its preview in `scripts/component-media-preview.tsx` when adding a component. The registry build checks that every component has nonempty media files before generating the manifests.
