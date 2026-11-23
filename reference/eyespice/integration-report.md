# EyeSpice integration and rendering fix

The public detail and full-view previews use the private EyeSpice module at revision `41a3a9155a6fe1e05ebfe142543214587317d4fc`. Original implementation remains ignored in the public app. The module repository was confirmed private.

## Rendering defects

A fixed 480px native render at yaw .7 reproduced a horizontal longitude seam and near-black sclera patches. The wrapped angular derivative selected the wrong texture mip level. The inferred view illumination contained near-zero values, which the output curve turned into black regions.

The material now unwraps angular derivatives before gradient texture sampling and uses a smooth illumination minimum. The latter makes the darkest surface areas lighter. This is a defect correction to the user-approved reconstruction, not an exact-source fidelity claim. Eyelid normals are computed directly from shell positions, removing discontinuities at duplicated edge vertices. Lid buffers and bounds remain fixed. Gaze rendering caches layout bounds until resize/scroll and caps DPR at 1.5. The offscreen render target uses four-sample antialiasing.

The unchanged focused pixel check measured 6,937 near-black sclera pixels and seam mean difference 11.043 before the fix. Afterward it measured 46 pixels and seam difference 5.974. Its original limits were 100 pixels and 8 respectively. These measurements cover the named side-angle case, not every possible pose.

## Checks

- Five focused private-module tests passed, with 32 assertions for proximity hysteresis, invalid settings, interruption, smooth lid normals and fixed topology.
- Strict private-module typecheck passed.
- Twenty-five-second bounded Bombadil exploration of the actual React component fixture passed. It checked console errors, uncaught errors, overflow and valid eye states under controls, scrolling, reload and remount/multiple-eye operations.
- Actual pointer approach, retreat and reduced-motion endpoints passed in Agent Browser. Rendering captures are retained in local ignored verification artifacts.
- Public media was regenerated from the fixed component. Public metadata-only registry was rebuilt.
- App lint, typecheck, access verification and production build passed. Lint retains three pre-existing warnings in unrelated components.
- A separate snapshot containing only the staged EyeSpice integration fetched every private source file and passed typecheck and production build without concurrent Portrait Wave edits. Dependency installation reused the existing local node_modules. This is not an independent clean dependency-install check.
- The earlier integration verification installed all seven files through the actual shadcn CLI, compared installed bytes to the manifest, typechecked the consumer and checked next-request key/session revocation. The renderer changed afterward. Re-running that HTTP check was blocked by a foreign process serving the shared named route. The updated pin itself synced successfully from GitHub and typechecked.

## Limits and resource cleanup

Final browser testing of the staged app snapshot was blocked by the local proxy closing TLS connections for its separate named route. The exact fixed component was tested through its local React fixture. Owned snapshot servers and browser sessions were closed; the foreign server was left untouched.

Instrumented Bombadil previously reproduced an app hydration warning. The uninstrumented app run passed. That tooling-dependent warning remains unresolved. No hardware frame-time measurement supports a universal smoothness or FPS claim.

The original eye media is attributed to @o6scure. Reconstructed surface maps derive from its rendered views; original authoring source and reuse terms were unavailable. The user accepted the reconstructed appearance. Neither this integration nor its defect corrections establish 1:1 visual fidelity or transfer asset rights. Raw source captures remain untracked.
