# Image-array portrait shader

Source: https://pin.it/24VEWvBBt. The pin is accessible and links to the Graphic Design Stack Exchange question at https://graphicdesign.stackexchange.com/questions/15512/how-to-create-the-effect-in-this-animated-gif-of-morphing-faces.

The pinned media is `raw/source.gif`, SHA-256 `e210e0d2b71cac628d5154a1ac0dcc462fe4a0583e5dedb5a4bce9de904d1ee1`. It has 97 frames at 401 by 301 pixels, each lasting 20 ms, for a 1.94 second loop.

## Requested output

Add another installable shader to Modulo's Shaders collection. Accept an array of image URLs, render the supplied images rather than playing the reference animation, and allow later replacement without changing the implementation. Use free-source portraits temporarily and retain their provenance. Exact reproduction applies to the effect. The user explicitly permits different portrait content. Zephyr applies only to Modulo's controls and documentation, not to changing the reference effect.

## Mechanism and evidence

The animation morphs aligned grayscale faces while different rectangular tiles show different transition phases. The apparent 16 by 16 tile grid remains a provisional measurement. The linked answers describe face morphing plus tiles, waves and a gradient mask. They do not supply the original software, morph correspondences, masks or timing curves.

The linked filename identifies the work as `Internetism2_Micael_Reynaud.gif`. That attribution has not been independently verified against an accessible original artist project. The old media URL returned an error document, not a valid GIF. Do not treat `raw/original-internetism.gif` as usable media.

## Existing progress

`.plannotator/image-shader/` contains a previous optical-flow prototype's comparisons and per-tile phase fitting data. Its best saved comparison differs on 90.4405% of pixels, with mean absolute channel error 13.67895 across the 97 reference frames at zero tolerance. This is a failed fidelity check, not an accepted reconstruction. Its comparison inputs were eight decoded GIF keyframes, not the original unmorphed photos. The editable implementation was not found in the project or the bounded local recovery search.

Keep the raw source and failed comparison evidence unchanged. Do not add a GIF playback implementation, relabel the failed prototype as exact, or integrate an approximation without authorization. Production integration requires a representative image-array proof and a supported comparison of intermediate morph states, tile phases and timing.

## Unresolved requirement

The original face-morph correspondence and transition masks have not been recovered. The available GIF establishes rendered output, not a transferable original morphing algorithm for replacement image arrays. Original source, an editable project, or a documented original method would materially improve this proof. Another download of the same GIF does not resolve that gap.
