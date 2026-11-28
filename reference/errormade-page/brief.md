# Errormade video reconstruction

Source: https://x.com/iamerrormade/status/2126280581004587412

The user requests a 1:1 reconstruction as another Modulo Pages example, using Cat's Paw for reconstruction and Zephyr for implementation. Images may come from their ugrfr or chapterup repositories. The user subsequently confirmed that the video is the authoritative reference and asked to use every frame to measure positions and reactions.

## Source contract

- Preserve the downloaded video in `raw/reference.mp4`. Its SHA-256 and acquisition URL are in `manifest.json`.
- The stream contains 865 decoded frames, 2386 by 1904 pixels, presentation timestamps 0 through 15.77 seconds, time base 1/60000. Frame durations vary. Do not derive time from frame index divided by 60.
- Every decoded frame is retained in `captures/frames/`. `observations/frame-times.csv` maps frame numbers to timestamps. Fourteen contact sheets include all frames and timestamps without temporal sampling.
- `observations/every-frame-measurements.json` records change metrics and bounded image-content measurements for every frame. The reproducible analysis script is `.plannotator/errormade-page/measure-video.py`.
- Current errormade.tech delivers a different Work layout. Its downloaded files establish provenance and access, but its CSS and JavaScript are not evidence for the video's scene. Do not substitute the current site's grid or typography for the recorded version.

## Reconstruction scope

Preserve the white canvas, centered cropped media, project index, caption rail, horizontal-axis project turns, vertical-axis case turns, shared image expansion, fixed Back and Info controls, scrollable case media, and return to the selected project. Distinguish a video's internal motion from outer page scroll. Preserve video playback position when changing presentation.

Zephyr's allowed changes are the user-authorized photography and related project names. It does not authorize redesigning the composition or replacing the observed transitions. Source selection ticks, index numbers and edge marks are retained under the exact-copy exception. Do not add navigation, decorative labels or northeast arrows.

## Measurement and comparison conditions

- Source pixel dimensions are authoritative. A 1193 by 952 CSS viewport at DPR 2 is a working interpretation, not recovered browser metadata. Compare at 1193 by 952 after downsampling the source by exactly 2.
- Desktop rest stage is approximately x378, y312, width437, height329 CSS pixels. Selected title is x603, y258.5. Index starts at x603, y228.5. Adjacent indices are 298.25 pixels apart.
- Use original source crops in isolated baseline mode for geometry comparison. Photography mode is an explicitly different-content comparison and cannot establish pixel equality.
- Initial pixel-diff channel threshold is16. Retain unmasked pairs and report differences. Do not increase the threshold to make a result pass. Geometry target is within1CSSpixel of measured endpoints. Motion phases must use source timestamps and input-relative timing.
- Wait for fonts, decoded images and layout transitions to settle. The first preview capture occurred during a resize transition and is retained as an invalid setup capture. `preview-rest-after-ready.png` is the valid replacement. This is a setup correction, not a tolerance change.

## Evidence limits

Original DOM, font file, source easing functions, wheel deltas, key events and mobile layout are not present in the video. Measure rendered trajectories rather than claiming original-source recovery. Keyboard and reduced-motion support are required operable additions. Phone reflow is inferred because the source only shows desktop. An untouched original crop proves its captured pixels, not reconstruction of the nested product shop.

## Integration constraints

Implement source in a dedicated private `maynkudu/modulo-<slug>` repository. The main public repository stores the wrapper, metadata, documentation and public preview media. Add the ignore before fetched implementation enters the main checkout. Pin every installable file by full commit SHA and SHA-256. No commits or pushes are authorized by the request so far.

Existing thermal-image modifications and missing thermal-image/porsche-gt3rs files can block shared sync and capture commands. Preserve that work. Do not run forced sync. Any shared validation blocked by those files must be reported separately from checks of this page. The user authorized committing and pushing the current checkout on 2026-11-28. The Cube Archive Pages integration remains pending.
