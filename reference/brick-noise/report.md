# Brick noise proof

The original animation is accessible. It is pinned in `raw/reference.gif`, with its origin and SHA-256 in `manifest.json`.

The reconstruction draws the staggered grid in a fragment shader and samples one measured grayscale value per tile and source frame. Its light texture contains 53,550 bytes. The runtime does not play the reference GIF or video. The original shader code and noise generator remain unavailable.

| Acceptance item | Result | Evidence | Limit |
| --- | --- | --- | --- |
| Pin and original animated media accessible | Verified | `raw/reference.gif`, `manifest.json`, `captures/pinterest-page.png` | Pin provides no original implementation or external source link |
| Tile geometry and grayscale values | Verified at native size | `comparisons/offline/results.json` | 45 of 45 decoded frames have zero changed pixels |
| Standalone WebGL rendering | Verified at native size | `comparisons/webgl/results.json` | 45 of 45 GPU frame exports have zero changed pixels at 500 by 500 |
| Native browser screenshot | Verified | `captures/native-browser-comparison.png`, `comparisons/webgl/screenshot-results.json` | Zero changed pixels for frame 0 at DPR 1 |
| Reusable React component rendering | Verified at native size | `comparisons/react-webgl/results.json` | 45 of 45 GPU frame exports have zero changed pixels at 500 by 500 |
| Native React browser screenshot | Verified | `captures/react-native-comparison.png`, `comparisons/react-webgl/screenshot-results.json` | Zero changed pixels for frame 0 at DPR 1 |
| Playback period | Verified in the standalone browser proof | `observations/playback-browser.json` | Measured source-frame wrap interval is 1350 ms. Display refresh still governs presentation |
| Narrow-screen framing | Verified in the standalone browser proof | `captures/proposed-shaders-mobile.png`, `captures/proposed-detail-mobile.png` | Chromium viewport 390 by 844, DPR 1. No horizontal overflow |
| Reduced motion | Verified in the standalone browser proof | `observations/reduced-motion-browser.json`, `captures/reduced-motion-mobile.png` | Automatic drawing stops and the disabled playback control has an explanation |
| Pause, reset, frame selection and scrolling | Verified in bounded preview exploration | `.plannotator/brick-noise/preview-mobile.bin` and its log | 20 seconds at 390 by 844 with scoped control clicks and scroll. No property violations |
| React TypeScript interface | Verified | Typecheck of the isolated module | Main app integration has not begun |
| Graphics cleanup and fallback | Verified for the controller cleanup path | `observations/react-cleanup.json` | All owned GPU resource counts reach zero. The embedded poster is visible and controls are disabled |
| Production source gating and installation | Unverified | Planned app checks | Requires integration and a published private source pin |
| Original implementation recovered | Unavailable | Delivered pin metadata | The reconstruction uses measured output data |

The source comparison uses a zero channel threshold and no masks. Browser evidence records Chromium 158 on Linux, DPR 1, with ANGLE and SwiftShader. It does not establish parity on other browsers or graphics hardware.

The proposed host UI keeps the existing Modulo typography and proportions. BLANK's Shader Grid Gallery source was inspected. Its draggable image atlas, lens warp and project selection solve a different task, so it was not installed. The pinned animation supplies the shader's visual and timing decisions.

The independent image-array shader requested later has its own evidence package. It does not change this source baseline.
