import childProcess from "node:child_process";
import { syncBuiltinESMExports } from "node:module";
const originalSpawn = childProcess.spawn;
const children = new Set();
process.once("exit", () => { for (const child of children) child.kill(); });

// Webreel 0.1.4 enables manual compositor frames without driving them.
// Keep normal rendering enabled; software WebGL is an opt-in for headless hosts.
childProcess.spawn = function (command, args, options) {
  if (String(command).endsWith("chrome-headless-shell")) {
    const blocked = new Set(["--enable-begin-frame-control", "--run-all-compositor-stages-before-draw", "--disable-threaded-animation"]);
    args = args.filter(arg => !blocked.has(arg));
    args.unshift("--disable-dev-shm-usage");
    if (process.env.MODULO_MEDIA_SOFTWARE_GL === "1") args.unshift("--enable-unsafe-swiftshader", "--use-angle=swiftshader");
  }
  const child = originalSpawn.call(this, command, args, options);
  children.add(child);
  child.once("exit", () => children.delete(child));
  return child;
};
syncBuiltinESMExports();
