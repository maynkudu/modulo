# Image shader reconstruction report

## Result

Exact fidelity failed. Do not integrate this proof as an exact Modulo shader.

The isolated WebGL 2/React proof genuinely renders replacement URL arrays and computes spatial deformation from those inputs. The investigation established a more specific tile mechanism than the earlier generic grid crossfade, but it did not recover the artist's original morph correspondences, unmorphed portraits, interpolation curves or compositing masks.

Runnable proof:

`file:///home/maynkudu/Code/Projects/modulo/.plannotator/image-shader/reconstruction/index.html`

Implementation and API:

- `.plannotator/image-shader/reconstruction/portrait-shader.ts`
- `.plannotator/image-shader/reconstruction/flow-worker.ts`
- `.plannotator/image-shader/reconstruction/app.tsx`
- `.plannotator/image-shader/reconstruction/README.md`

The default view has two legitimately free-source portraits and starts paused. The baseline choices are labeled GIF-derived fixtures, never original portraits or the promised stock demo. No server is required.

## What the pixel investigation established

`measure.py` detects fixed seams from time-differenced spatial derivatives, without assuming the earlier grid. It finds 16 columns and 16 rows.

Horizontal boundaries are 25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350 and 375 pixels. The final column is 26 pixels wide. Vertical boundaries are 19, 38, 56, 75, 94, 113, 132, 150, 169, 188, 207, 226, 245, 263 and 282 pixels. These agree with rounding multiples of 301/16, not the earlier provisional 18.75-pixel row interval.

Across 480 shared tile edges, 454 best integer temporal alignments are two GIF frames. A weighted graph fit has 0.1811-frame shared-edge residual. A diagonal plane fit has 0.1520-frame residual. Undoing the delay with the correct sign lowers mean seam jumps from 13.5126 to 7.6801 intensity levels. The wrong sign increases them to 19.2709.

This supports an effective delayed morph timeline, with the top-left leading the bottom-right. The tested mechanism samples a continuous cyclic morph at `mod(timeMs - 40 * (column + row), 1940)`. The diagonal spans 1,200 ms. At the local phase, the two input faces deform toward common intermediate geometry through bidirectional image-derived fields. A linear blend combines their warped samples.

The 40 ms increment is a tested observational model, not recovered original authoring data. A subframe border fit prefers about 44 ms, but its reconstruction is worse. That failed refinement remains in `subframe-delay.json` and `fractional-offline-results.json`. Pixels establish effective phase relationships, not a unique implementation of the original gradient/opacity masks.

Measurements and source decisions are recorded in:

- `.plannotator/image-shader/reconstruction/measurements.json`
- `.plannotator/image-shader/reconstruction/delay-experiment.json`
- `.plannotator/image-shader/reconstruction/source-ledger.md`

## Comparisons

The contract was declared before testing. All comparisons use 401 x 301 pixels, all 97 pinned timestamps, no masks and zero channel tolerance. Explicit seek at 1,940 ms matches seek at zero byte for byte. Demanding intermediate frames include 3, 6, 9, 18, 30, 42, 54, 66, 78, 90 and 96.

| Attempt | Mean absolute channel error | Changed pixels | Result |
| --- | ---: | ---: | --- |
| Prior saved optical-flow prototype | 13.678950 | 90.4405% | Failed, preserved unchanged |
| New offline DIS, eight integer-delay-corrected fixtures, geometric warp | 13.143900 | 88.3105% | Failed, offline experiment only |
| First browser geometric warp, corrected fixtures, strength 1 | 16.465694 | 88.7396% | Failed |
| Current browser v2, corrected fixtures, strength 1 | 16.279931 | 88.7608% | Failed |
| Current browser v2, corrected fixtures, strength 0.15 | 13.667656 | 88.4387% | Failed, exploratory fit against all frames |
| Current browser v2, corrected fixtures, no warp | 13.648659 | 88.5206% | Failed and does not qualify as geometric morphing |

The small numerical improvement at strength 0.15 does not demonstrate a 1:1 effect. The default proof keeps strength 1 to make actual input-derived deformation inspectable. It is not the best reference pixel fit. The no-warp result cannot satisfy the requested mechanism.

Every baseline in this table uses eight GIF-derived samples rather than recovered original photos. Delay-corrected samples remain mixed/morphed diagnostic inputs. The renderer does not encode all reference frames as video or an atlas. No fitted reference-face color residual or reference-derived displacement field contaminates replacements.

Evidence:

- `reconstruction/browser-comparison-summary.json`, `browser-comparison-v2-summary.json`, `browser-comparison-strength-summary.json`
- `reconstruction/inverse-results.json`
- `reconstruction/comparisons/browser-v2-dequilt-delay40-warp1/comparison-sheet.png`
- `reconstruction/comparisons/browser-strength-dequilt-strength-fit-delay40-warp0.15/comparison-sheet.png`

The paths above are relative to `.plannotator/image-shader/`. Their comparison folders also retain absolute differences and signed actual-minus-reference images centered at 128. Earlier results were not overwritten or reclassified.

## Working array and lifecycle behavior

The API accepts `readonly string[]`, copies the array, supports up to 64 images, and reports loading, ready, empty, error and disposed states. It computes fresh bidirectional correspondence in a Web Worker for every supplied cyclic pair. It does not detect semantic facial landmarks or normalize pose.

Actual browser checks passed for:

- Empty arrays clear textures and render black. One-image arrays render a stable grayscale portrait.
- Two- and eight-image arrays load and render. Invalid image data returns an error while retaining the previous valid set.
- Later requests supersede earlier ones. A running worker was explicitly observed, then terminated by replacement.
- Pause leaves no engine RAF. Resume continues the clock. Negative and positive seeks wrap into the 1,940 ms period.
- Actual consecutive wall-clock wraps were 1,933.2 ms apart. This passes the predeclared 20 ms display-sampling tolerance around 1,940 ms. That timing tolerance does not relax pixel acceptance.
- Keyboard ArrowRight on Time changes both the control and shader clock by 1 ms.
- Hidden-tab events cancel RAF and visible-tab events restart it. Offscreen intersection also suspends and resumes RAF.
- Reduced motion renders the first portrait without morphing or tile animation, with no engine RAF.
- Actual React unmount during a running worker empties the DOM, settles the pending request as false and leaves zero textures, workers and RAF. Further calls do not restart the disposed engine.

The synthetic two-face correspondence fixture has a known 30-pixel horizontal feature displacement. The v1 warped midpoint reduces MSE from 144.4504 for crossfade to 35.6833. Current v2 local-contrast flow reduces it to 48.2816. This verifies spatial geometry rather than a texture-only crossfade. It does not verify correct semantic landmarks on arbitrary portraits.

Runtime artifacts include `two-image-summary.json`, `two-image-v2-summary.json`, `worker-cancel.json`, `react-unmount.json`, `hidden-tab.json`, `offscreen.json`, `keyboard-seek.json`, `reduced-motion.json` and `playback-timing.json`.

## UI, assets and verification limits

The two used portraits are Christopher Campbell's rDEOVtE7vOs and Michael Dam's mEZ3PoFGs_k. Their inspected pages identify them as free under the Unsplash License. Media and attribution are pinned in the owned research folder. They are temporary, face-cropped photos, not normalized straight-look outputs. Initial mismatched photo guesses were rejected and are not used.

BLANK Cell Portrait source and live page were inspected. Its circles/capsules and shuffled silhouette do not implement face correspondence. Morphing Icons, Great UI Image Hover Reveal and Melt Effect were inspected and rejected as effect implementations. Zephyr was limited to the controls and disclosures. No reference-effect redesign or production integration occurred.

At 390 x 844, measured document width is 390 pixels, controls remain inside the viewport, and buttons/selects/inputs have zero visible border width. Focus indicators remain. Axe 4.12.1 reports zero WCAG 2A/2AA violations for this proof. Browser exceptions and console errors were absent.

Bombadil 0.8.0 ran 25 seconds on the disposable file, with only click and reload actions, and recorded 115 states with no violations. It mostly exercised loading interruptions and inputs; it is not broad verification of every ready-state control. Its trace and log are retained. Context7 supplied the first documentation result and then hit monthly quota on a follow-up query. No credentials or configuration were changed.

Desktop/mobile screenshots and comparison sheets are retained. This model session cannot inspect raster attachments, so subjective visual inspection remains unverified. Numeric pixel comparison, real runtime operation, accessibility and measured layout ran successfully. The failed pixel comparisons already rule out a fidelity pass.

## Remaining blockers and next discriminating experiment

Missing evidence is specific: original unmorphed portraits, facial landmark correspondence or morph maps, original interpolation and occlusion rules, source photo boundaries, and the actual tile/gradient-opacity composition. Original artwork terms are also unknown. The linked filename attribution remains unconfirmed. Recovery attempts found a 404 at the old host's aggregate index, search challenges and a guessed-domain DNS failure, not an editable project.

The next useful pixel experiment is to measure facial feature trajectory phase separately from luminance/opacity phase on high-contrast eye and mouth patches across several neighboring tiles. Hold out one diagonal from fitting. Compare a constant-delay geometric timeline against a separate opacity-wave model using the same inferred geometry. A shared feature lag with different luminance lag would discriminate separate masks from a single delayed morph. The current border fit mixes these signals and cannot settle that distinction.

An original editable morph project or original portraits plus a transition correspondence map would allow a controlled replacement-image mechanism comparison. More samples of the same GIF alone cannot uniquely recover those inputs. Do not expand this proof into production until that gap or the reconstruction itself is resolved.

## Scope and cleanup

Only `.plannotator/image-shader/reconstruction/` and this report were written. The sibling portrait-preparation files, raw baseline and earlier comparisons were not edited. Final baseline hash remains e210e0d2b71cac628d5154a1ac0dcc462fe4a0583e5dedb5a4bce9de904d1ee1.

No server, production route, catalog, lockfile, gitignore, media script, GitHub repository, secret configuration, commit or push was created or changed. Investigation Python dependencies are confined to the owned local `.venv`. Both task-owned Agent Browser sessions were closed. After interruption, process inspection found no running task commands and `agent-browser session list` reported no active sessions. There are no retained task servers.
