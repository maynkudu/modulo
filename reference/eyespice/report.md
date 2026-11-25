# EyeSpice evidence report

## Recovered source

The supplied pin resolves to `794674296784100176`. Its main image delivers `https://i.pinimg.com/originals/94/3c/9f/943c9f351186f1b98e3ed3bfb855c8e0.gif`.

The pin's `og:see_also` links to GIPHY ID `rt0WoGHmAvWtFgHSeM`. The creator's GIPHY page names `@o6scure`, dates publication to 2024-10-26 11:01:01 without an explicit timezone, and links to `https://t.me/o6scure`. The Telegram channel links to `https://lynkfire.com/o6scure`, whose profile identifies a CG artist and links to Behance. These are provenance observations, not proof of a transferable license.

Both delivered GIFs are preserved. Their byte hashes differ. The canonical target for this task is the Pinterest file actually displayed by the supplied pin, not the recompressed GIPHY variant.

## Measured image-space values

Measurements are observations of rendered output, not recovered 3D parameters. See `observations/measurements.json`, `observations/radial-profile-*.json` and the decoded timestamp samples.

| Property | Result | Method and limit |
| --- | --- | --- |
| Resolution | 480 by 480 | GIF stream and decoded frame dimensions |
| Duration | 3.070 seconds | Sum of exact GIF frame delays and FFprobe time base 1/100 |
| Frames | 91 | Actual decoded frames |
| Delays | 57 frames at 30 ms, 34 at 40 ms | Variable frame duration. Effective mean 29.642 fps, not nominal 33.333 fps |
| Loop | Infinite | GIF `NETSCAPE2.0`, loop value 0 |
| Audio | None | One GIF video stream |
| Frame 0 silhouette | Bounds x 24..457, y 22..455 | Gray >32. Inclusive width and height 434 pixels |
| Frame 0 rim radius | 216.51 px | Median radius from row endpoints at gray >48 |
| Sampled rim radius | 213.56..216.51 px | Ten sampled frames. Variation may include rotation, silhouette texture and threshold error |
| Center | Near 240,240 | Sampled threshold-bound centers vary by several pixels. Camera movement is not uniquely established |
| Iris image-space rings | Peaks near radii 92..95 px and 114..119 px | Circular mean luminance in front-facing frames. These are rendered ring landmarks, not an extracted iris mesh |
| Approximate iris form | Outer visible ring about 230 px across, roughly 0.53 of the 433 px sphere diameter | Image-space ring observation. Visible iris disk boundary is blur-dependent |
| Pupil at 0.000 s | Thresholded equivalent diameter 55.92 px | Gray <=5 connected component. Conservative, excludes blurred edge |
| Pupil at 1.340 s | Thresholded equivalent diameter 95.13 px | Same method and threshold |
| Pupil at 3.030 s | Thresholded equivalent diameter 65.38 px | Same method and threshold |
| Palette | Achromatic in all ten measured samples | Every sampled pixel has R=G=B |
| Mean full-frame gray | 21.80..23.01 out of 255 | Includes black background. Does not recover material albedo |

The camera appears centered, with little scale change and no background horizon. Orthographic projection and a long focal length remain competing explanations. Original FOV, camera distance and world-space sphere radius are unavailable.

The rendered eye has a dark rough sclera, fine radial iris fibers, a black pupil and a grainy bright silhouette rim. Roughness, IOR, clearcoat, normal map, environment texture, light positions and exposure are unavailable. A rim shader, backlight and composited glow can produce related outputs. None is recovered from pixels alone.

## Actual media mechanism

The eye's projected iris and pupil move around the spherical silhouette on the media clock. Pupil size changes. Surface details rotate with the eye, while black background and framing stay nearly fixed. There are no supplied cursor inputs or visible closing eyelids. The frame sheet covers 0.000, 0.340, 0.670, 1.010, 1.340, 1.680, 2.020, 2.350, 2.690 and 3.030 seconds.

## Comparisons

Comparison contract was fixed in `brief.md` before evaluation. All comparisons use native 480 by 480 RGBA, threshold zero, no masks, no resizing and no registration.

- The two delivered variants have equal frame count, duration and per-frame timestamps.
- Their mean changed-pixel fraction across 91 frames is 0.0003309581, or 0.03310%.
- The largest measured variant difference occurs at frame 40, 1.340 seconds. Changed-pixel fraction 0.0040277778, or 0.40278%. Mean absolute RGBA channel error 0.0162467, largest channel error 48.
- Frame 0 variant diff has zero changed pixels.
- The desktop source review's native-size browser crop has zero changed pixels against decoded Pinterest frame 0. This verifies that the review presents that frame unchanged, not a reconstructed 3D scene.
- A real-3D reconstruction now exists after the user's explicit continuation. It uses inferred geometry/material/pose settings, not recovered authoring source. Exact 1:1 fidelity fails the current native-frame comparisons. See `.plannotator/eyespice/handoff.md` for actual differences.

Evidence lives under `comparisons/`. The `.plannotator/eyespice/measure-source.py` script measures all decoded variant frames and ten geometric samples. Cat's Paw's installed pixel comparator supplies the standalone diff metrics.

## Bounded source recovery

1. Opened the supplied short link in an isolated anonymous browser. The initial invite modal was avoided by using the observed canonical pin, without signing in.
2. Captured the pin's actual image URL, artifact metadata and scoped DOM fragment.
3. Followed its GIPHY attribution and recovered both delivered GIFs.
4. Followed GIPHY's creator source to Telegram. The initial channel navigation timed out, then the page was available. Operated its public channel preview and followed one older page containing October 2024 material.
5. Followed the channel's Lynkfire portfolio. It links to Telegram and Behance. No authoring download or license was visible.
6. Opened the linked Behance profile. HTTP 400. Retried once, same failure. No access controls were bypassed and no guessed private endpoints were used.

The public channel's nearby media is not attributed to this exact GIF by a matching caption in the inspected page. It was not substituted as the source. A broad media extraction included signed CDN URLs and nested-message descendants, so those raw files were kept only inside ignored `.plannotator/eyespice/`. The sanitized summary is navigation context only, not reliable per-post media attribution.

Recovery stopped here. It did not recover a Blender project, model, textures, lights, camera, shader, seed or rig. A media source alone cannot recover the original authoring project.

## Direction inspection

BLANK registry-search `3d eye shader` returned no installable fit. Discovery `3d eye cursor tracking` returned inspirations with reranking unavailable, so that result is not evidence that the collection is empty.

- `insp_dot-sphere-card-whitespace-experiments`, https://experiments.thisiswhitespace.com/dot-sphere-card. Operated its live page and pointer movement, inspected its explanation and runtime controls, and retained rest/hover screenshots. Its layering mixes CSS 3D, canvas point cloud, video and real asteroid GLBs. Rejected as an eye baseline. No eye rig is supplied.
- `insp_cursor-nav-whitespace-experiments`, https://experiments.thisiswhitespace.com/cursor-nav. Operated pointer movement/click and inspected its explanation and exposed controls. It changes a fake cursor into a 3D navigation state. Rejected as visual source, with global pointer-state ownership noted in the adaptation contract.
- `insp_3d-lego-dither-artifacts`, https://artifacts.deeo.studio/3d-lego-dither. Opened the exact experiment and moved the pointer over its field. Retained a screenshot and page inventory. Rejected because its moving Lego field and dithering do not recover the supplied eye's form.

No inspiration source changed the recovered baseline, and no component was installed. No source code from these experiments was reused or executed locally.

## Acceptance results

| Item | Status | Evidence or gap |
| --- | --- | --- |
| Delivered reference media pinned | Verified | Raw GIFs, scoped DOM, metadata and manifest |
| Attribution chain | Observed | Pinterest, GIPHY, creator channel and portfolio snapshots |
| Rights for public distribution | Unavailable | No reuse license recovered |
| Native source frame in local review | Verified | Zero-pixel browser diff |
| Exact media timing inventory | Verified | FFprobe frame PTS and GIF delays |
| Original source/rig recovery | Unavailable | Public pages deliver rendered media only |
| Real-3D 1:1 baseline | Failed current pixel comparison | Real meshes built. Source texture, halo, rim and off-axis pose differences remain |
| Global gaze and proximity eyelids | Verified for stated isolated checks | Runtime open/close/retreat/interruption checks, global corner targets, mobile and reduced motion |
| Source review desktop/mobile | Verified for stated checks | 1440x1000 and 390x844, no horizontal overflow, square media |
| Source review keyboard and reduced motion | Verified for stated checks | Enter plays/stops; starts still under reduced motion |
| Source review exploratory check | Bounded pass | Bombadil 0.8.0, 12-second exact-file run, default properties, retained trace. This does not validate eye interaction |

## Authorized 3D continuation

The user explicitly requested the proper 3D component after the source-only handoff. The implementation and bundle remain entirely in ignored `.plannotator/eyespice/`. Cat's Paw baseline and Zephyr interaction are separate modes. The original GIF bytes and capture comparisons are unchanged.

Actual frame 0, frame 20 at 0.670 s and frame 40 at 1.340 s were compared at 480x480 RGBA, threshold zero. Changed-pixel fractions are 63.7995%, 64.4314% and 62.3255%. Mean absolute RGBA channel errors are 8.4783, 11.3908 and 8.0813 out of 255. These are failures against exact pixel equality, not a claim of perceptual fidelity. Fine grain is stochastic across renders, and original textures and pose curves remain unavailable.

The reconstruction's front iris is less softly integrated with the sclera, its limbus ring remains more uniform, and its sclera texture and backlight differ. The off-axis pose samples are image-space fits. Smooth interpolation between ten measured samples is inferred and is not the original motion rig.

Rights review and original rig recovery remain open. Parent can review the functional representative proof, but should not mark the Cat's Paw 1:1 acceptance complete.
