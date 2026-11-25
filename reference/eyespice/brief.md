# EyeSpice capture contract

## Scope

- Supplied source: https://pin.it/2wQNeVPdn
- Canonical pin: https://www.pinterest.com/pin/794674296784100176/
- Artifact: the square animated eyeball, excluding Pinterest chrome and related pins.
- Destination: a future Modulo component, developed privately. This task owns only `reference/eyespice/` and ignored `.plannotator/eyespice/`.
- Required order: Cat's Paw 1:1 baseline, then a separately identified Zephyr adaptation with global cursor gaze and proximity-driven eyelid geometry.
- Output requested: editable real 3D geometry and lighting, plus a runnable isolated representative preview for the parent's human review.
- Current output: pinned delivered media, source review, editable real-3D reconstruction and separate cursor/eyelid adaptation proof inside `.plannotator/eyespice/`. The user explicitly instructed continued 3D construction after the source-only handoff. Original authoring files remain unavailable and exact fidelity is not passed.

## Source and rights

Pinterest describes the animation as `3d eye animation by @o6scure`. Its source points to GIPHY ID `rt0WoGHmAvWtFgHSeM`. That GIPHY page names `@o6scure` and links to the creator's Telegram channel. The channel links to the creator's Lynkfire portfolio, which links to Behance.

No reuse license, model download or authoring project was provided by the inspected pages. Capture for local comparison does not establish redistribution rights. Do not stage the GIFs or their derivatives for public release without permission or an applicable license.

## Conditions fixed before comparison

1. Raw GIF files remain byte-for-byte unchanged.
2. Decode both with the same Pillow version to compare delivered variants. Compare frames at their actual presentation timestamps. Never divide frame index by nominal fps.
3. Compare decoded RGBA at native 480 by 480. Threshold is zero. No crop, mask, resizing, color correction or registration.
4. Quantitative reconstruction acceptance uses the same native 480 by 480 RGBA comparison, threshold zero, at pinned presentation timestamps. No reconstruction mask, resize, registration or relaxed tolerance. Equality between media variants does not certify mesh, rig, camera or shader fidelity.
5. The local source review uses the original Pinterest GIF without processing and native-size decoded PNG samples. It is a media baseline, not editable 3D.
6. Browser capture uses the task-owned `eyespice-design-01a20464` session, Agent Browser 0.37.1, Linux, desktop viewport 1440 by 1000, DPR 1, zoom 100%, anonymous state, no imported profile. Actual UA and preference values are in `observations/pinterest-artifact-metadata.json`.
7. GIF metadata has no asserted color-space profile or original renderer. GPU backend, focal length, seed, render resolution before GIF export and source rig are unavailable.

## Mechanism and known limits

The delivered GIF rotates a dark textured eyeball, moves the projected iris and pupil around its spherical silhouette, and changes pupil size on the media clock while the camera framing remains nearly fixed.

No cursor interaction or closing eyelids exists in the delivered artifact. Rotational pose, lighting and shader details cannot be uniquely recovered from rendered frames. A new eyelid rig is an adaptation, not recovered original source.

## Source recovery limit and authorized continuation

The source and linked creator pages delivered rendered media only. The linked Behance profile failed with HTTP 400 on two attempts. No original mesh, textures, camera, shaders or rig were recovered.

After the first blocked handoff, the user instructed, `we don't want just the animation, build the proper 3d component, with all mesh, scene, etc`, then explicitly named Cat's Paw and Zephyr. This authorizes isolated construction, not a claim that inferred scene settings are recovered facts or that measured mismatches pass fidelity.

The proper 3D proof is `.plannotator/eyespice/eyespice-preview.html`. Source capture remains immutable. Reconstruction comparison evidence and remaining gaps are in `.plannotator/eyespice/handoff.md`. Public redistribution remains blocked on rights review.
