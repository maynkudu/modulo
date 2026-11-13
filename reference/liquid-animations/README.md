# Liquid Animations reference

Pinned source video from https://x.com/koppkev/status/2120471771602092136.
The post links to https://www.details.so/vault/liquid, titled Liquid UI 2.0.
Saved on 2026-11-12 at 1152 by 720, 17.55 seconds.

SHA-256 of `source.mp4` is `f6d34778e9d7de39673db6f3a2b38d1f3ef6194a6ff2250c7b8749d3930dd805`.

The live example and original code require Details.so Max. No original implementation was obtained. The user authorized reconstruction from the video and scratch components, then requested a 1:1 copy with smoother motion. The approved revision uses Inter Variable and Rune icons across Modulo. Exact original fidelity remains unverified.

The video shows Tooltip, Color and Account interactions. Menu, Select, Language and Reactions appear in the tab bar but are never opened. Their unseen contents and behavior are unverified.

Observed mechanisms:

- Each tooltip grows upward out of its circular action button, separates, then retracts into that button. Switching hover targets retracts the old tooltip while the next grows.
- The color panel grows downward from the selected-color trigger with a temporary liquid connection. The panel and trigger share their left edge. Ten swatches form two rows of five.
- The account panel grows down and left from JD. The panel and avatar share their right edge. Its contents are Jane Doe, jane@example.com, Profile, Settings, Billing and Sign out.

The clip includes camera pans and zooms. Its recorded pixel dimensions are not the original CSS dimensions. Source frames and transition strips are retained under `.plannotator/liquid-animations/`. The revised preview uses relative geometry measured from those frames. Original CSS values, icon paths, spring parameters and pixel parity remain unverified.

Keep the existing Liquid Cluster implementation independent. Its displayed title will become Apple Liquid Cluster. The new module is Liquid Animations.
