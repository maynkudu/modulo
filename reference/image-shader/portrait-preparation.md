# Portrait preparation

Use the same prompt for each image, then align the approved result locally. The prompt requests the portrait. The alignment step fixes its crop, scale and eye line. Neither step establishes a 1:1 replica of the shader.

## Reusable image-edit prompt

Attach one authorized source photograph to an image editor and use this prompt:

> Edit the supplied photograph into a realistic, straight-on portrait of the same person. Preserve their identity, apparent age, facial proportions, natural asymmetry, hairline, hair texture, facial hair, freckles, moles, scars and other distinguishing features. Keep recognizable eyewear and headwear when present. Do not beautify, slim, reshape, smooth away skin texture or replace features with a generic face.
>
> Turn the head and shoulders directly toward the camera. Keep the head upright, with no sideways tilt, upward or downward pitch, or camera roll. Both eyes must look directly into the lens. Use a relaxed, closed-mouth neutral expression, with lips gently together, no smile, no visible teeth and relaxed eyebrows. Preserve the person's natural resting mouth shape.
>
> Make one close-up black-and-white photograph against a plain dark charcoal background. Use consistent soft frontal illumination, readable detail in both eyes, natural facial shading and unclipped skin highlights. Keep the same lighting treatment across the series. No scenery, props, text, collage, tiles, morphing or shader effects.
>
> Use a landscape 401:301 frame, ideally 1604 by 1204 pixels. Aim for the image-left pupil center at 38.65% of the width and 33.22% of the height, and the image-right pupil center at 63.59% of the width at the same height. This places the eye midpoint at 51.12% of the width and pupil separation at 24.94% of the width. Keep the chin fully visible, roughly four-fifths down the frame, with the neck and upper shoulders below. A tight crop may cut the top of the hair. Keep enough surrounding image for a later crop. Do not stretch the face or move individual features to meet these guides.
>
> If the photograph hides essential facial features, do not claim an exact reconstruction of them. Preserve what is visible and avoid inventing distinctive details.

Optional negative prompt:

> Different identity, face reshaping, beauty retouching, plastic skin, forced facial symmetry, smile, visible teeth, open mouth, side gaze, profile, three-quarter view, head tilt, camera roll, extreme perspective, hard side lighting, clipped highlights, patterned background, text, watermark, collage, tiles.

These are requests, not guaranteed output properties. If the editor does not support custom dimensions, generate a larger approximate landscape frame and crop it with the procedure below.

## What the source establishes

Pinned source `reference/image-shader/raw/source.gif`, SHA-256 `e210e0d2b71cac628d5154a1ac0dcc462fe4a0583e5dedb5a4bce9de904d1ee1`. Measurements use Pillow-decoded composited frames, not screenshots of Pinterest. Coordinates start at the top left. Normalized positions use x/W and y/H.

| Property | Evidence and result | Status |
| --- | --- | --- |
| Frame dimensions and ratio | 401 by 301, W/H = 1.3322259136. Exact 401:301, close to but not exactly 4:3. | Recovered |
| Grayscale | All 97 decoded frames have R = G = B at every pixel. Maximum channel spread is 0. | Recovered |
| Opacity | No decoded pixel has alpha below 255. | Recovered |
| Timeline | 97 frames, 20 ms each, 1940 ms total. Matches the existing timestamp ledger. | Recovered |
| Dark features near the eye band | Nine samples at frames 0, 12, 24, 36, 48, 60, 72, 84 and 96. Median regional dark centroids are approximately (155.15, 100.40) and (255.70, 99.32). | Measured pixel proxies, not validated pupil centers |
| Proxy separation | 98.37 to 104.97 px across those nine samples, about 24.53% to 26.18% of width. | Measured pixel proxies |
| Background | Corner values vary. Frame 0's 16 px corner-patch medians are 24, 54, 137 and 14 on a 0 to 255 scale. Corners can include hair or clothing. A uniform charcoal background cannot be recovered from these values. | Measured pixels; background interpretation unresolved |
| Face framing | The coarse ASCII decode suggests a large close-up face, eyes near y = 100, chin near y = 240 and upper hair cropped. | Inferred, not visually validated |
| Lighting, lens and exposure | Neither the GIF nor the linked answers establishes camera height, focal length, aperture, lighting positions or the original grayscale conversion. | Unavailable |

The dark centroids use fixed patches [150,94,178,106) and [249,94,276,106), weighted by darkness below each patch's 20th percentile. These patches were selected from a 100-column ASCII decode. They may include eyelids, brows or tile artifacts. They are not face-detector results. Every GIF frame can contain mixed or morphed faces, so none is certified as an original source photograph.

This session's model cannot view the image attachments. I read the existing contact-sheet path and timestamps, then inspected decoded pixel statistics and ASCII representations. Anatomical landmarks and face boundaries remain visually unverified. A sighted inspection or a validated local landmark detector should check them before the parent treats the following template as source-exact.

## Preparation template

The canonical template is a practical proposal informed by those proxies. It is not a recovered original registration map.

| Requirement | Base 401 by 301 | Master 1604 by 1204 | Basis |
| --- | --- | --- | --- |
| Image-left pupil | (155,100) | (620,400) | Rounded proxy-informed choice |
| Image-right pupil | (255,100) | (1020,400) | Rounded proxy-informed choice |
| Eye midpoint | (205,100) | (820,400) | Exact arithmetic on proposed targets |
| Pupil separation | 100 px | 400 px | Chosen face-scale anchor |
| Chin | Aim near y = 240; review y = 220 to 260 | Aim near y = 960; review y = 880 to 1040 | Inferred framing guide, not a mandatory facial ratio |
| Eye-to-chin distance | Aim near 140 px; preserve natural variation | Aim near 560 px; preserve natural variation | Diagnostic only |

The close face scale is defined by pupil separation, not a forced cheek width or an arbitrary face bounding box. Faces have different shapes. Do not move mouths, narrow jaws or stretch foreheads to give every face equal landmark coordinates. Review an outlying chin crop individually. Preserve identity rather than forcing every facial ratio into the template.

Soft frontal light, a plain charcoal background, lens-directed gaze, square shoulders and a neutral closed mouth are preparation choices for the approved change of portrait content. They are not claims about the reference's exact photography. Zephyr's permitted adaptation stops at portrait content. It does not authorize changing the shader's geometry, timing or transition mechanism.

## Deterministic local alignment

1. Review the edited portrait against its input. Reject changed identity, invented distinguishing features, side gaze, non-neutral expression or residual head pitch/yaw. Crop alignment cannot repair these.
2. Open the EXIF-oriented image locally. Mark the center of each visible pupil, ordered image-left then image-right. Inspect at high zoom. Do not substitute an eyelid midpoint or glasses reflection. If a pupil is obscured, resolve the portrait first instead of guessing.
3. Apply one similarity transform. Translate, uniformly scale and rotate the whole photograph to map the marked pupils to the two template targets. Never mirror or apply unequal horizontal and vertical scaling. Crop the resulting canvas to exactly 401:301.
4. Reject missing source coverage. Do not silently fill missing face or hair pixels. Obtain a wider authorized edit or reframe the input. The included script refuses out-of-bounds crops and transparent inputs.
5. Export opaque lossless RGB PNG with equal R, G and B channels. The script uses a fixed encoded-sRGB grayscale mix, 0.2126 R + 0.7152 G + 0.0722 B. This conversion is a repeatability choice, not the recovered reference transfer curve. Convert unusual input color profiles to sRGB locally first.
6. Re-mark the pupils in the exported raster and check the acceptance tolerances below. The script's analytic report proves the transform maps the supplied coordinates. It does not prove those coordinates were accurate anatomical landmarks.

The script is `.plannotator/image-shader/portrait-preparation/align_portrait.py`. It requires Pillow and has no network calls, face detector or generation model. Keep user portraits and outputs in an authorized local/private location, not a tracked public reference directory.

```sh
python .plannotator/image-shader/portrait-preparation/align_portrait.py \
  /authorized/local/input.png /authorized/local/prepared.png \
  --eyes <left-x> <left-y> <right-x> <right-y> --scale 4
```

Replace the placeholders with measured coordinates after EXIF orientation. `--scale 4` exports 1604 by 1204. `--scale 1` exports 401 by 301. The script refuses existing output files, writes an adjacent `.alignment.json` record and reports upsampling. An input pupil separation below 400 px needs upsampling for the master; this adds no facial detail. Prefer a sufficiently detailed source over a large but blurred export.

Two-eye alignment guarantees the supplied coordinates map to the targets within floating-point precision. It cannot guarantee all other landmarks coincide without deforming each person's face. It also cannot remove perspective or recover the hidden side of a head from an arbitrary photograph. Any transferable face-morph implementation needs its own reviewed per-image landmarks or correspondences. This preparation does not recover the original shader's morph map.

## Acceptance checklist

Use the same tolerances for the whole set. These are proposed preparation tolerances, not a source-fidelity threshold.

- Identity and distinguishing features pass a side-by-side human review against the authorized input. Grayscale intentionally removes color, so keep the original separately for identity comparison.
- Both eyes gaze at the lens. The head is frontal and upright, shoulders face forward, and there is no visible pitch, yaw or camera roll. A level pupil line alone does not establish those properties.
- Lips are gently closed, teeth are hidden, and the expression is relaxed and neutral. Preserve natural facial asymmetry.
- Exact output is 401 by 301 or 1604 by 1204, opaque PNG, with equal R, G and B channels. No baked tiles, motion, labels or shader effects.
- Independently re-marked pupil centers lie within 1 base pixel of each template target, or 4 px on the master. Their vertical difference is at most 1 base pixel. Pupil separation is within 1 base pixel of 100, or 4 px of 400 on the master.
- Chin and eyes are not clipped. Chin position outside y = 220 to 260 base pixels triggers framing review, not automatic face reshaping. Neck and some upper shoulders remain visible. Upper hair may be cropped consistently with the tight reference framing.
- Background is plain charcoal and has no pattern or sharp scene detail. For repeatability, propose a working background value of RGB (24,24,24). If a clean background patch is available, its median should be within 8 levels and its 95th-minus-5th percentile range at most 12 levels. These are proposed consistency checks, not recovered source values. Do not test a patch occupied by hair or clothing.
- Both eyes and natural skin texture remain readable under the same soft frontal lighting treatment across the series. No clipped areas obscure distinguishing facial features. Review lighting as a set, rather than normalizing every person's skin to the same brightness.
- No missing crop coverage, invented pixels, uneven scaling or unreviewed upsampling. Retain the original input and alignment record locally.

## Input/output contract for the shader agent

Input to preparation is one authorized photograph per person. Input may vary in pose, framing and color, but severe occlusion, blur and profile views may prevent a faithful frontal edit. A sufficiently detailed existing frontal photograph is safer than generating an unseen face view.

Output to the shader is an ordered array of individually approved, static, opaque grayscale portraits. Use one common resolution throughout the set, preferably 1604 by 1204, all with the exact 401:301 ratio. The canonical eyes are (620,400) and (1020,400) at that resolution. At 401 by 301 they are (155,100) and (255,100). Do not apply another cover crop or per-image auto-centering after preparation. Supply real image URLs only after hosting/access is authorized. A browser renderer needs images it can decode and, if sampled by WebGL or Canvas, suitable same-origin or CORS access.

The adjacent alignment record is QA evidence, not an original morph correspondence map or a new public API requirement. Other landmarks remain person-specific. The shader agent must separately establish its correspondence requirements. A prepared portrait array does not prove a 1:1 reconstruction of the reference effect.

## Evidence, provenance and verification limits

- `measure_reference.py` produces `measurements.json`, `decoded-ascii.txt` and decoded frames 0, 48 and 84 under `.plannotator/image-shader/portrait-preparation/`. These PNGs are reference-analysis derivatives, not original photographs or licensed demo portraits.
- Existing evidence read without modification includes `brief.md`, `manifest.json`, `raw/question.json`, `raw/answers.json`, `observations/contact-sheet.jpg` and `observations/frame-timestamps.json`. The answers describe face morphing plus tiles, waves and a gradient mask. They provide no portrait camera recipe or exact landmarks.
- BLANK searches were `portrait image alignment` and `head on portrait preparation`. The returned Cell Portrait source was read end to end. Its cell silhouette/keying mechanism is unrelated to photographic face registration and was not installed. No UI or production files were authorized for this research task.
- The captured Random User copyright page says its photographs came from the authorized section of UI Faces and directs reuse questions to the UI Faces FAQ. That captured page alone does not establish permission for a particular portrait. No Random User photograph was used.
- The captured Unsplash license permits free downloading, modification and commercial/noncommercial use, excludes unmodified resale and competing image collections, and recommends attribution. It does not establish a particular portrait's provenance or settle all depicted-person rights. No temporary portrait was needed or downloaded. Readable extracts are `portrait-terms.txt` and `unsplash-license.txt`, derived locally from the unchanged raw HTML.
- No image-generation/editing tool was available through tool discovery in this session. No example portrait render was generated, and no user or private image was sent to an external service. Prompt quality and identity-preserving edits remain unverified on real portraits.
- `alignment-self-test.json` records a passed synthetic test of endpoint mapping, equal RGB channels, exact base dimensions and refusal of missing crop coverage. The fixture was a plain colored field, not a fake portrait demonstration. Real raster landmark accuracy, face identity, gaze, expression and lighting remain unverified.
- Reproduce measurements with `doc-python .plannotator/image-shader/portrait-preparation/measure_reference.py`. Run focused alignment checks with `python .plannotator/image-shader/portrait-preparation/align_portrait.py --self-test`.

Only this report and the portrait-preparation artifact folder were written. No source evidence, shared contract, production code or sibling reconstruction files were changed. No server or browser session was started, so this subtask owns no runtime resources to finalize. The parent workflow remains active.
