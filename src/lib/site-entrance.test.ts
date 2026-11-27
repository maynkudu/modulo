import assert from "node:assert/strict";
import { runInNewContext } from "node:vm";
import { test } from "node:test";
import { entranceInitialization } from "./site-entrance";

function initializeEntrance(pathname: string, reduceMotion = false) {
  const root = { dataset: {} as Record<string, string> };
  const shell = { inert: false };
  const listeners = new Map<string, EventListener>();
  let deadline: (() => void) | undefined;
  const window: { top?: unknown } = {};
  window.top = window;
  const document = {
    documentElement: root,
    getElementById: () => shell,
    addEventListener: (name: string, listener: EventListener) => listeners.set(name, listener),
    dispatchEvent: () => true,
  };

  runInNewContext(entranceInitialization, {
    window,
    document,
    location: { pathname },
    matchMedia: () => ({ matches: reduceMotion }),
    setTimeout: (callback: () => void) => { deadline = callback; return 1; },
    clearTimeout: () => {},
    Event: class {},
  });

  return { root, shell, listeners, finishDeadline: () => deadline?.() };
}

test("the full entrance is limited to a motion-enabled home load", () => {
  assert.equal(initializeEntrance("/pages").root.dataset.entrance, "complete");
  assert.equal(initializeEntrance("/", true).root.dataset.entrance, "complete");
  assert.equal(initializeEntrance("/").root.dataset.entrance, "pending");
});

test("a failed client mount releases the home shell after its bounded deadline", () => {
  const entrance = initializeEntrance("/");
  entrance.finishDeadline();

  assert.equal(entrance.root.dataset.entrance, "complete");
  assert.equal(entrance.shell.inert, false);
  assert.ok(entrance.listeners.has("modulo-entrance-complete"));
});

test("the entrance setup does not wait for page images or fonts", () => {
  assert.doesNotMatch(entranceInitialization, /\.decode\(|document\.fonts/);
});
