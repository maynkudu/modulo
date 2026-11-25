# Reference and preview status

The original delivered X video is captured, hashed and decoded. Stream and exact frame timestamps are retained. Both seven by seven cell sequences are sampled from all 240 frames. The text silhouette is derived from the video and used only for the local baseline. Original code, original font, interaction behavior and redistribution terms are unavailable.

The local reconstruction reproduces the measured matrix sequence and reconstructs the shell and text light separately. It is not a recovered original implementation. Five matched-time comparisons are in comparisons/metrics.json, with expected images, actual images, fourfold difference images and 50% overlays. No region is masked.

| Acceptance item | Status | Evidence and gap |
| --- | --- | --- |
| Original delivered media | Recovered | raw/source.mp4, manifest.json and observations/streams.json |
| Recorded matrix brightness and timing | Observed and reconstructed | observations/grid-samples.json and frame-timestamps.json. Color samples do not establish the original light-generating formulas. |
| Label shape | Extracted raster silhouette | observations/reference-label-mask.png. This is not an original font file or editable original type. |
| Exact 1:1 appearance | Failed | At the five sampled times, 2.10% to 3.95% of pixels in each button crop differ by more than 16/255 in at least one channel. Remaining differences include cell edge profiles, blur falloff, compression and shadow details. |
| Original renderer and interaction contract | Unavailable | Only a four-second video was delivered. Hover, press, focus, cancel, error, success and responsive behavior cannot be recovered from it. |
| Proposed Modulo adaptation | Prototype | .plannotator/state-buttons/preview.html. New formulas, editable text, seven states, six active motion choices and five accent presets plus custom color. |
| Prototype behavior | Verified within isolated fixture | Fourteen focused checks passed. Enter activation, Escape cancel, interruption, independent animation/color, native disabled, reduced-motion freeze/resume, demo completion, light surface and overflow at 1280, 728, 390 and 320 px. |
| Prototype automated accessibility | Partial | Zero WCAG A/AA violations in the static reduced-motion fixture. One incomplete contrast assessment remains because of the text highlight pseudo-element. This is not a screen-reader certification. |
| Bounded prototype exploration | Verified for measured properties | A 20-second, 390 x 900 Bombadil run found no console-error, uncaught-exception, unhandled-rejection or horizontal-overflow violation while interacting with scoped local controls. .plannotator/state-buttons/exploration.bin and bombadil.log. |
| System reduced-motion changes | Verified in fixture | Emulating prefers-reduced-motion while mounted produced a stable matrix over ten render frames and hid the label highlight. |
| Proposed interaction recording | Verified scripted path | .plannotator/state-buttons/videos/proposed-state-buttons.mp4, 1100 x 800, 60 fps, 14.4 seconds. Demonstrates motion/color changes, reduced motion, Escape cancel and the demo completing. Final completion frame and contact sheet were inspected. |
| Production React module and integration | Pending design review | No production app, catalog, source gate, lockfile or registry file has been changed. |

The first comparison iteration is retained under comparisons/iteration-1. Correcting text placement, cell size and text glow reduced the maximum changed-pixel proportion in the button crops from 12.92% to 3.95%, with the same comparison threshold and no masks.

Secondary references were discovered through BLANK. Thinking Orbs at libraries.dev/orbs informed independent state and size controls; its shipped orbs entry source was inspected and is not reused. Devouring Details' system/button describes separating color, size and appearance and keeping a loading control visually active; those principles informed the API. Its delivered system-layout chunk is navigation code, not recovered button source. Neither is used to substitute a different animation for the X reference.

Raw captures and source-derived artwork remain local. Publication needs a provenance check and must exclude the video, sampled reference tables and extracted silhouette.
