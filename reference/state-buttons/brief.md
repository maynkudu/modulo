# State buttons reference contract

Source: https://x.com/uixamjad/status/2125155886922625241

Captured on November 25, 2026 from the original delivered X video stream. The clip is 1600 x 1200, 60 frames per second, 240 frames, four seconds, with no audio. Both visible buttons are in scope. The source shows no pointer, keyboard, operation completion, responsive layout or error behavior.

The visible mechanism is a fixed seven by seven matrix whose cell colors change over time, accompanied by a left-to-right highlight across the Thinking label. Cells do not move. The upper button expands light outward; the lower button uses several moving light clusters. Their exact source formulas and original rendering system are unavailable.

The reference reconstruction is local evidence. It draws measured cell colors at source timestamps, a reconstructed rounded shell and a label silhouette extracted across the video. It does not recover original code or an original font. The Modulo adaptation uses new procedural animations and editable text, and must not ship the reference silhouette, recorded color tables or video.

## Comparison conditions declared before comparison

- Source frames use decoded presentation timestamps from observations/frame-timestamps.json. No frame-rate conversion is used for measurements.
- Reconstruction canvas is 1600 x 1200 logical pixels. Export the canvas directly to avoid page scale or browser DPR resampling.
- Compare full unmasked frame and both button bounding boxes, upper at x312 y152 w976 h306 and lower at x312 y741 w976 h306.
- Compare at 0, 0.5, 1, 2 and 3 seconds. Source decoder offset of one microsecond is retained in frame metadata.
- Report absolute RGB error and proportion of pixels with any channel difference over 16 of 255. This threshold defines measurement, not permission to call a visibly different result exact.
- There are no masked regions. Full-frame background dots and shadows remain visible in the differences.
- Exact visual parity requires no material unexplained difference. A failed comparison stays failed. A recorded matrix match cannot establish equality of the original source mechanism.

## Provenance and permitted change

Raw video, sampled colors and extracted label silhouette have unknown redistribution terms. Keep them local and out of published module repositories. Attribute the visual reference to uixamjad. The reconstruction is a video-derived approximation until the comparisons establish otherwise.

Zephyr may change geometry, typography, palette, animation formulas and state behavior for Modulo. It must preserve the fixed matrix, legible operation label, controlled state, immediate input and static reduced-motion path. No unrelated page changes, borders, decorative labels or northeast arrow icons are authorized.
