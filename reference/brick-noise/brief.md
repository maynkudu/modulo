# Brick noise reference

The requested source is https://pin.it/63qzQQIsv. Pinterest resolves the saved pin to https://www.pinterest.com/pin/1061653312183376959/ and identifies https://www.pinterest.com/pin/509329039083816894/ as its canonical pin.

Reconstruct the complete square animation as an editable WebGL shader for Modulo. Add a Shaders collection alongside Projects, Pages and Components. Preserve the reference effect exactly. Fit the surrounding page, controls and installation documentation to Modulo's existing components. Original implementation source belongs in a private module repository. Public previews and media follow the existing mint-key installation system.

The delivered artifact is a 500 by 500 GIF with 45 frames, each lasting 30 milliseconds. Its loop lasts 1.35 seconds. The pin provides no original shader, Processing project, external source link or author attribution. The GIF is evidence of the rendered result. Asset reuse terms are unspecified in the delivered pin.

## Mechanism

The grid stays fixed while each tile's grayscale brightness changes on a repeating 45-frame clock. The reconstructed fragment shader calculates the staggered grid and reads one recovered brightness value per tile and frame. It does not play the GIF or a video at runtime. The original noise formula remains unavailable.

## Capture and comparison contract

- Preserve the original GIF bytes in `raw/reference.gif` and hash them in the manifest.
- Use decoded GIF presentation times. Frame n begins at n times 30 milliseconds.
- First compare all 45 decoded frames against a reconstruction at exactly 500 by 500 pixels.
- Compare a WebGL canvas at 500 by 500 physical pixels, DPR 1, integer position, opaque output, nearest texture sampling, dithering disabled, no CSS transforms, and a fixed selected frame.
- Require zero changed pixels and a zero maximum channel error for this native-size frame comparison. There are no masks.
- Retain browser version, OS, renderer, viewport, DPR and actual results with the comparisons.
- At responsive sizes, preserve square framing and the same grid and phase. The reference has no responsive implementation to recover. Scaling is an explicit integration choice.
- Verify playback, pause, resume, seek, reset, keyboard focus, reduced motion, hidden-tab suspension and graphics failure separately. Pixel equality does not prove those behaviors.

## Scope and approval

The shader's geometry, grayscale values, phase order and loop cadence are fixed requirements. Zephyr applies only to the Modulo page surrounding the shader. No redesign of unrelated pages, no new decorative labels or borders, and no northeast arrow icons.

Prepare the shader proof and category layout in an isolated preview. Production integration awaits the plan review required by `~/dotfiles/skills/reference/plan-review.md`. No commit or push is authorized.
