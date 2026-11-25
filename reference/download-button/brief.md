# Inline download: source brief and recreation record

## Scope

- Supplied reference: https://x.com/pmalay694/status/2124918617603260680, a 5.6 s, 1200 × 1200 video of a download button.
- Live artifact behind it: https://uibrik.com/components/download-button, with the shadcn registry item at https://uibrik.com/r/download-button.json.
- Destination: the `inline-download` component in Modulo, a public catalogue page at `/components/inline-download`, and a private source repository `maynkudu/modulo-inline-download`.
- Direction: the user asked first for a 1:1 copy, then redirected to "a proper recreation with better design and all". The verbatim baseline below is therefore evidence for the mechanism, not the deliverable.

## Source and rights

uibrik's spec sheet states the component is free to use, no account required, free for commercial use. The glyph paths follow Rune Icons. The original authoring files were not supplied; the registry item is the authoring source and was read end to end (210 lines).

## Captured evidence

Raw files live in `raw/`, and the decoded/detected values in `observations/live-values.json`.

- `raw/tweet-video-1200.mp4`: the tweet's 1200 × 1200, 60 fps, 5.6 s clip. Near-black page (`#0a0a0a`), a light card about 594 × 207 px centred, the pill on it, ending on the green finished state.
- `raw/registry-download-button.json` and `raw/download-button.tsx.source`: the shipped source, unmodified.
- `raw/page.md`: the published documentation and property table.
- `observations/live-values.json`: computed styles, geometry and per-frame state captured from the live preview iframe with Agent Browser at 1280 × 800, DPR 1.

## Mechanism in one sentence

Pressing the pill starts a simulated transfer: an arrow drops repeatedly toward a tray, a fill sweeps the surface from the left while the label is replaced by a percentage that counts up with a stall past halfway, then the finished state draws a check, takes the success colour and offers the next action; pressing while running cancels, and pressing when finished opens.

## Exact values read from the source

| Property | Value |
| --- | --- |
| Sizes (sm/md/lg) | height 32/40/48, inline padding 12/15/18, label 13/14/15, glyph 15/17/19 |
| Radius | fully round |
| Rest surface | `#171717` with white text (light theme), `#fff` with `#171717` text (dark theme) |
| Working surface | `#f5f5f5`, fill `#e5e5e5` |
| Finished surface | working surface + `color-mix(success 12%, transparent)`, label and check in `successColor`, default `#16a34a` |
| Press scale | 0.96 |
| Width settle | 300 ms, `cubic-bezier(0.23, 1, 0.32, 1)` |
| Simulated track | values `[0, .22, .46, .5, .84, 1]` at times `[0, .18, .42, .58, .84, 1]`, `easeInOut` per segment |
| Controlled follow | 300 ms, same ease-out, `done` after 320 ms at 1 |
| Label swap | 280 ms, translate 100 % with 2 px blur both ways, `popLayout` |
| Arrow drop loop | 900 ms in, opacity in at 25 %, out by 100 % |
| Check draw | `pathLength` 0 → 1 over 300 ms with an 80 ms delay |
| Reduced motion | all durations zero; the simulated run takes 0.6 s |

## Value verification

`.plannotator/download-button/fidelity/` mounts the shipped source verbatim with its own dependencies. Against the live preview it produced:

- identical geometry to three decimals (113.844 × 40), identical computed colour, radius, tracking, padding, glyph size and stroke;
- identical fill ratios across the loading run (0.0943 vs 0.0950, then equal to four decimals) and identical finished state;
- 4 differing pixels out of 4560 at rest, 2 of 3400 when finished, all 1 to 6 levels on anti-aliased glyph edges. Repeated captures of the live page differ by the same 4 pixels, so the difference is capture noise, not code.

That establishes the extracted values, not the visual result. No human saw the frames in this session; every visual claim below rests on measured values, not on looking.

## What the recreation keeps

Pill geometry and the three size steps; the arrow-into-tray gesture and its repeated drop; the left-to-right fill; the counting percentage with the mid-run stall; the check drawing on completion; the label turning into the next action; press scale; the width settling to its own content; cancellation by pressing again.

## What it changes, and why

1. Dependencies. `motion`, `@number-flow/react` and `react-use-measure` are replaced by CSS, one `ResizeObserver`, one `requestAnimationFrame` driver and a cubic Bezier solver. Modulo ships source, so a component that installs with no runtime package is worth more than one that adds three.
2. Surface language. Modulo is a dark product. Rest is the ink colour on black, the working surface is the same ink at 10 %, and the finished surface is the success colour at 16 %. Every non-rest state is the same bath at a different tint, so the state reads before the label does.
3. Success colour. `#43dc84` instead of `#16a34a`, which measures about 2.9:1 on its own wash. The replacement clears 4.5:1 on the finished surface.
4. A fourth state. `error` shows the failed surface, names the failure and offers `retryLabel`, because a real transfer fails and the reference had no path for it. The sibling `multi-step-download` already established failure as part of this product's download vocabulary.
5. Discoverable cancellation. Pointing at a running button, or reaching it with the keyboard, swaps the dropping arrow for a cross in the same glyph slot. `Escape` also cancels. The reference hid cancellation in an `aria-label` only.
6. Accessible naming. The name is stable per phase and never includes the live percentage, so a screen reader is not read a number 100 times. `aria-busy` marks the run.
7. Reset that respects a reader. The finished state resets on its own, except while the button holds keyboard focus, so the action it offers is not taken away mid-decision.
8. Motion language. The project's `--ease-out` (`cubic-bezier(.16, 1, .3, 1)`) replaces the source's near-identical curve, and per-digit swaps with a 40 ms stagger replace the single rolling number.
9. Glyph system. Rune's arrow-down-to-line and check geometry on a 24-unit grid at stroke 2, with a cross and alert mark built on the same grid, replacing the source's bespoke 16-unit tray.

## Limits

- Fidelity of the *recreation* is by construction not pixel-matched: the surfaces, glyph geometry, easing and state model deliberately differ. The pixel work above validates the starting values only.
- The tweet video is presentation of the same component; its card size and framing are not reproduced.
- No error, offline, resumable or multi-file transfer is modelled. Progress is a single ratio owned by the caller.
- The component was verified in Chromium at 1280 × 800 and 390 × 844. Safari and Firefox behaviour for `:focus-visible`, `color-mix` and `pathLength` was not exercised here.
