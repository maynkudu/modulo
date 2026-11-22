/** Local preview images. These are temporary stock portraits, not normalized outputs. */
export const portraitWaveImages = [
  "/artwork/portrait-wave/christopher-campbell.jpg",
  "/artwork/portrait-wave/michael-dam.jpg",
];

/** Reusable image-edit prompt. Eye targets are a proposed preparation template. */
export const portraitPreparationPrompt = `Edit the supplied photograph into a realistic, straight-on portrait of the same person. Preserve their identity, apparent age, facial proportions, natural asymmetry, hairline, hair texture, facial hair, freckles, moles, scars and other distinguishing features. Keep recognizable eyewear and headwear when present. Do not beautify, slim, reshape, smooth away skin texture or replace features with a generic face.

Turn the head and shoulders directly toward the camera. Keep the head upright, with no sideways tilt, upward or downward pitch, or camera roll. Both eyes must look directly into the lens. Use a relaxed, closed-mouth neutral expression, with lips gently together, no smile, no visible teeth and relaxed eyebrows. Preserve the person's natural resting mouth shape.

Make one close-up black-and-white photograph against a plain dark charcoal background. Use consistent soft frontal illumination, readable detail in both eyes, natural facial shading and unclipped skin highlights. Keep the same lighting treatment across the series. No scenery, props, text, collage, tiles, morphing or shader effects.

Use a landscape 401:301 frame, ideally 1604 by 1204 pixels. Aim for the image-left pupil center at 38.65% of the width and 33.22% of the height, and the image-right pupil center at 63.59% of the width at the same height. Keep the chin fully visible, roughly four-fifths down the frame, with the neck and upper shoulders below. A tight crop may cut the top of the hair. Keep enough surrounding image for a later crop. Do not stretch the face or move individual features to meet these guides.

If the photograph hides essential facial features, do not claim an exact reconstruction of them. Preserve what is visible and avoid inventing distinctive details.`;
