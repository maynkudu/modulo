import { createRoot } from "react-dom/client";
import { GardenCanvas } from "../src/registry/interactive-art/examples/GardenCanvas";
import { Nilkamal } from "../src/registry/nilkamal/Nilkamal";
import { Diwali26, type Diwali26Controller, type FrameState } from "../src/registry/diwali-26/Diwali26";
import { RootInfection } from "../src/registry/root-infection/RootInfection";

function markReady(controller: unknown) {
  if (controller) document.body.dataset.ready = "true";
}

let diwaliController: Diwali26Controller | null = null;
let nextLaunch = .2;
let launchIndex = 0;
const positions = [[.5, .21], [.5, .38], [.25, .27], [.80, .32]];
function diwaliReady(controller: Diwali26Controller | null) { diwaliController = controller; markReady(controller); }
function diwaliFrame(frame: FrameState) {
  if (!diwaliController || frame.time < nextLaunch) return;
  nextLaunch = frame.time + 1.2;
  const index = launchIndex++;
  diwaliController.setPattern(index % 3 === 0 ? "diwali" : index % 3 === 1 ? "2026" : "lotus");
  const position = positions[index % positions.length];
  diwaliController.launch(position[0], position[1]);
}

function MediaPreview() {
  const name = new URLSearchParams(location.search).get("component");
  if (name === "diwali-26") {
    return <Diwali26 className="media-scene" enableAudio={false} onReady={diwaliReady} onFrame={diwaliFrame} />;
  }
  if (name === "root-infection") {
    return <RootInfection className="media-scene" enableAudio={false} onReady={markReady} />;
  }
  if (name === "nilkamal") {
    return <Nilkamal className="media-scene" weather="rain" enableAudio={false} onReady={markReady} />;
  }
  if (name === "interactive-art") {
    return <GardenCanvas className="media-scene" initialTime={34} timeScale={1} wind={1} onReady={markReady} />;
  }
  throw new Error("Select a component for media capture.");
}

const root = document.getElementById("root");
if (!root) throw new Error("Media preview root is missing.");
createRoot(root).render(<MediaPreview />);
