# Portrait wave integration

Portrait wave is the user-approved reconstruction of https://pin.it/24VEWvBBt. The user accepted the shown comparison and authorized publishing, committing and pushing it. Exact reference fidelity did not pass and is not claimed.

The installable React/WebGL 2 component accepts an ordered `readonly string[]`. It computes fresh bidirectional correspondence from each supplied cyclic image pair in a local Web Worker and renders a diagonal 16 by 16 tile wave. It does not play the reference GIF or transfer fitted reference-face pixels to replacements.

The source is private in `maynkudu/modulo-portrait-wave`, pinned with all five file checksums in `components.lock.json`. The public app contains the live preview, controls, portrait-preparation prompt, API and installation documentation, licensed sample images and generated preview media. The optional local two-pupil alignment script installs with the source. The prompt's eye targets are proposed preparation coordinates, not recovered original anatomical landmarks.

## Checks

- Private component TypeScript and two focused correspondence tests passed. The local alignment script passed its synthetic self-test. Real generated portraits have not been produced or identity-validated.
- A clean release snapshot fetched every private module and built without using the uncommitted EyeSpice integration. It reused the existing dependency cache. Lint passed with three existing warnings, typecheck passed, and 105 access assertions passed.
- Actual shadcn installation retrieved all five files, and the installed component typechecked. Anonymous access was denied. Active-key installation and browser source unlock succeeded. The next CLI and browser requests after revocation were denied. Verification keys were revoked.
- Browser checks covered the public prompt and copying, image replacement, empty/single/multiple arrays, replacement races, pause and keyboard seeking, reduced motion, cleanup and loading failures. Initial loading failure retains a usable controller for later replacement. Clearing the controller's image set clears the static fallback too.
- Mobile layout exposed a real pointer-readout overflow. The demo now reserves 24 pixels around both ends of the deformation track, rather than hiding overflow. Both endpoint readouts remain within the viewport.
- The production-mode snapshot completed scoped mobile Bombadil exploration with no violations. JavaScript coverage instrumentation was disabled; console, exception and overflow properties remained enabled. Failed developer-mode and pre-fix traces were retained.
- Axe reported zero violations, with inherited contrast checks marked incomplete. The new controls and prompt textarea have no visible borders. Subjective visual inspection remains limited; the user approved the supplied reconstruction comparison.
- Thumbnail, GIF and MP4 were generated from the actual component. Sample portraits by Christopher Campbell and Michael Dam are attributed and used under the Unsplash License. They are temporary, unnormalized inputs.

Detailed runtime, installation, comparison and exploration artifacts remain under `.plannotator/image-shader/integration/`. The original source capture and prior failed comparisons remain unchanged. Original morph maps, compositing rules and artwork reuse terms remain unavailable. Raw reference media and unrelated EyeSpice work are not part of this release.
