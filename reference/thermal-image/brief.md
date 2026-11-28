# Thermal image reconstruction

Source: https://www.blankinterfaces.com/f1/heatcar.html, embedded on https://www.blankinterfaces.com/.

The user requests an editable 2D replica of its thermal postprocessing, a cleaned Porsche photograph as the input, and integration under Shaders in Modulo's existing Fine/Artistic and Bold themes. The 3D camera and model are explicitly out of scope for this version.

## Mechanism

A three-second radial wave selects between seven anisotropically blurred versions of a subject's shading and alpha coverage, then maps the resulting field through a cyclic five-color spectrum with a broad halo, a six-second background band, coordinate distortion, and grain.

## Fidelity contract

- Keep immutable delivered HTML, dependencies and model under raw/. Record their hashes and provenance in manifest.json.
- Preserve the recovered blur kernel, seven stretch values, color stops, phase relationships, radial origin, wave shaping, background field and grain function in the reference preset.
- Preserve a recording and fixed-time samples of the original 3D source. This proves source appearance and timing, not 2D image equivalence.
- Compare a 2D baseline made from the pinned source against the packaged 2D engine using the same input, viewport, DPR, renderer, clock and default uniforms. Compare at 0, 0.75, 1.5 and 2.25 seconds.
- Before measurement, use a channel threshold of 3/255 and report changed-pixel fraction and maximum/mean error. Do not loosen the threshold to conceal differences. Report renderer-version differences if present.
- The replaced input pass is an explicit user-authorized departure. Photograph luminance and alpha replace model lighting and coverage. No camera motion or invented depth is permitted.
- Unknown shader reuse terms remain unknown. Keep the source attribution. The source's model attribution applies to reference evidence only; the model is not part of the new installable 2D component.

## Product checks

The thermal palette remains the same in both site themes. The surrounding controls use existing tokens, typography and panel geometry. Verify native keyboard controls, pause/replay/reset, reduced motion, hidden/offscreen pause, image errors, upload lifecycle, responsive proportions, theme switching without remounting, and no horizontal overflow.

## Input asset

Original user attachment: IMG_2260.jpeg, attachment 43c3353e-b6b9-47d4-b084-b38b3081ab57-b4a5ff62-3dce-4fac-bfe6-b6437594a392.

The built-in image editor returned HTTP 403, "Image generation is not enabled for this group." The user then explicitly approved local cleanup. An editable manual vector mask isolates the car; a gamma 0.88 curve lifts shadows. The supplied photograph remains unchanged. The derivative and reproducible cleanup are under `.plannotator/thermal-shader/assets/`.

The user subsequently requested a synthetic background and slimmer framing with balanced gaps. Studio mode adds soft light pools, a floor and a subtle reflection; original-field mode remains available. A 3:1 frame with imageScale 1 uses the 1920 by 640 derivative. Its alpha bounds leave 25 pixels on the left and 26 on the other sides at 960 by 320, before animated displacement and blur. Controls sit below the wide image. Meaningful visual updates include playable clips, as requested.
