# Brick noise integration

Source: https://pin.it/63qzQQIsv. The pinned GIF SHA-256 is `279d162172bc9bc009adc02561416e7d632b12831e6604684e3cea0bb6d68b94`.

The reference is a 500 by 500 animation with 45 frames of 30 milliseconds each. The WebGL fragment shader draws the staggered grid and samples recovered tile brightness values. It does not play the GIF or video. The original noise generator, original implementation and author are unavailable. The pin does not state reuse terms, and this integration does not assert rights to the original artwork.

The installable implementation is private at `maynkudu/modulo-brick-noise`, pinned in `components.lock.json`. Public integration adds `/shaders`, `/shaders/brick-noise`, a full-view preview, playback controls, metadata, sitemap entries and generated preview media. Projects, Pages and Components retain their own collections. The existing mint-key source gate is reused.

## Verified

- All 45 integrated GPU frames have byte-identical RGBA hashes to the decoded reference at 500 by 500, DPR 1. See `integration/gpu-comparison.json`.
- The ordinary browser viewport capture, cropped to the measured canvas bounds, has zero changed pixels for frame 0. The comparison has zero tolerance and no masks. See `integration/screenshot-comparison.json`, `integration/frame-00.png` and `integration/screenshot-diff.png`.
- Playback wrap intervals measured 1350 ms and 1349.9 ms. Display refresh still governs frame presentation.
- Desktop and 390 by 844 mobile checks covered pause, resume, reset, keyboard frame selection, reduced motion, offscreen suspension, full-view navigation, context-loss fallback and unmount cleanup. All GPU resource counts reach zero on cleanup.
- The new preview and buttons have no visible CSS borders. Mobile document overflow is absent. Axe reported no violations, with inherited contrast checks marked incomplete.
- A real shadcn CLI installation using an active local verification key installed all four files. Installed TypeScript passed. Browser source unlock returned 200. Anonymous source access and the next CLI and browser requests after revocation returned 401. Verification keys were revoked.
- Lint passed with three pre-existing warnings. Typecheck, 101 access assertions and the production build passed. A fresh source tree synced every private module through GitHub and built. This used the existing dependency cache, not a fresh dependency install.
- Thumbnail, GIF and MP4 were generated from the actual React component through the media build workflow.

## Limits and capture corrections

Native-size fidelity is measured on Chromium on Linux at DPR 1. Other engines and graphics hardware are not verified. Responsive framing is verified; native-size comparisons do not prove every resized rendering condition.

Element-only screenshots produced invalid black or clipped captures. They were not accepted as evidence. The retained comparison uses a normal viewport screenshot and its contemporaneous canvas bounds.

Bombadil's instrumented run reported a React hydration warning. The original trace and reproduction are retained locally. The same scoped 20-second mobile exploration with JavaScript instrumentation disabled completed with no property violations. Console, exception and overflow properties remained enabled; coverage instrumentation was not measured. Ordinary Agent Browser checks did not report the hydration warning.

Vercel masks sensitive environment values as `[REDACTED]` when downloaded. Testing that placeholder returned 401 and does not establish that the actual stored component token is invalid. No secret was replaced based on that result. Deployment-side private-repository access must be verified by the deployment build.

Detailed browser, installation, media and exploration artifacts remain under `.plannotator/brick-noise/`. Raw reference captures and unrelated EyeSpice and image-shader evidence were not included in this integration commit.
