# Modulo

A component library by maynkudu, inspired by Compronents' preview, documentation, and source installation model.

## Development

Use Bun to install dependencies and run the app:

```sh
bun install --frozen-lockfile
bun run dev
```

Portless serves the app at `https://modulo.localhost`. If the machine already runs a proxy with different settings, the command prints its configured named URL.

```sh
bun run lint
bun run typecheck
bun run build
```

## Structure

- `src/app/page.tsx` lists component names and added dates at `/`, with keyword and date filters.
- `src/app/components/interactive-art/page.tsx` contains the garden preview, controls, installation, API, and source.
- `src/registry/interactive-art/` contains the six installable garden files.
- `src/lib/catalog.ts` contains component metadata, installation targets, and API documentation.
- `src/app/registry/page.tsx` documents direct installation and the `@modulo` namespace.
- `scripts/build-registry.ts` generates the source `registry.json` and the served catalog and item manifests under `public/r/`.
- `src/components/interface-sounds.tsx` and `src/lib/interface-sounds.ts` handle soft interaction sounds and the saved sound preference.
- `public/brand/` contains the supplied Modulo logo.
- `components.json` configures shadcn and source registries.

## Install the first component

Run this from a React project configured for shadcn. Replace the origin with the URL printed by Modulo's dev command:

```sh
bunx shadcn@latest add https://modulo.localhost/r/interactive-art.json
```

Import `GardenCanvas` from `@/components/interactive-art/examples/GardenCanvas`. Its canvas engine handles growth, elastic stems, keyboard interaction, reduced motion, and PNG layer exports. The component page documents its props and controller methods. The registry contains source files and requires no animation dependency.

The site uses the supplied black and white logo, Geist Pixel Square headings, Geist Mono body text, and square panels. Use Rune Icons when adding icons.

Sound feedback starts after user interaction. The header's sound toggle mutes clicks, slider ticks, and drag feedback, and remembers the choice. Press motion stays small and stops under reduced motion.

## Sharing

The registry needs no central registration for URL installs. Serve `public/r/` from a public origin and set `REGISTRY_BASE_URL` to that origin when building so catalog metadata uses the public URL. Consumers can use `npx shadcn@latest add <origin>/r/interactive-art.json`, or configure `@modulo` through the Registry page.

The root `registry.json` also prepares the source for a GitHub registry. Public hosting and publishing still require a destination. They are not part of this local preview.

Inspect BLANK source with `blank source <name>`. After choosing a component for the app, configure access with `blank configure .`, then install it with `blank shadcn add @compronents/<name>`. The helper supplies authentication at runtime.
