# Solas TF reference contract

Create a variable display typeface and a Fonts showcase in Modulo. Original implementation belongs in the private `maynkudu/solas-tf` repository. No public source publication is authorized.

The supplied `maynkudu-logo.png` is the primary shape reference. `modulo-sparkle.png` is secondary. Preserve the broad m, diagonal terminals, descending y, unequal n stems, connected k/u and raised star. The user rejected the initial freehand approximation and spacing star on 2026-11-27. Exact reference reconstruction now takes priority over stylistic adaptation. Zephyr applies to the product integration after the reference proof is accepted.

`*` must render as a raised zero-advance mark between letters. Inserting it must leave all other glyph origins unchanged, including contextual forms. It must not reserve its own letter space. It is also mapped to U+20F0 and U+2726 in the current proof.

The raster reference does not contain a font file, a complete alphabet, weight masters or hidden contours at overlapping joins. Visible shapes can be reconstructed. New letters and standalone joins require design and must not be described as recovered originals.

The corrected proof is isolated under `.plannotator/solas-tf/`. It contains the seven unique lowercase letters present in the primary reference. No whole-word logo ligature substitutes for the individual letters. The contextual u after k is a separate glyph because the reference has a distinct join. The actual font has a continuous RHYT axis, with the source silhouette at 100.

Comparison uses the pinned primary source cropped to x=430, y=165, width=1150, height=355. Foreground threshold is 128. Compare equal dimensions, Chromium 141 on this Linux host, DPR 1, zero letter spacing, native font shaping, RHYT 100 and the literal string `may*nkudu`. Targets fixed before the supersampled trace are at most 2% foreground disagreement and no outline pixels outside a one-pixel neighbourhood. Raster texture and color are outside this silhouette comparison. Original source recovery remains unavailable.

The initial 1x trace failed the foreground target at 4.88%. A 4x trace of the original grayscale edge reduced disagreement to 1.7395%. This changed outline recovery, not the fixed comparison threshold. The final proof has no pixels outside the one-pixel neighbourhood. Original raster artifacts and cut joins remain limits.
