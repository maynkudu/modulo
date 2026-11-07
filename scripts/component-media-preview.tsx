import { createRoot } from "react-dom/client";
import { GardenCanvas } from "../src/registry/interactive-art/examples/GardenCanvas";
import { Nilkamal } from "../src/registry/nilkamal/Nilkamal";
import { RootInfection } from "../src/registry/root-infection/RootInfection";

function markReady(controller: unknown) {
  if (controller) document.body.dataset.ready = "true";
}

function MediaPreview() {
  const name = new URLSearchParams(location.search).get("component");
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
