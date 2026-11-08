"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getOrigin = () => window.location.origin;
const getServerOrigin = () => "<registry-url>";

export function RegistryConfiguration() {
  const origin = useSyncExternalStore(subscribe, getOrigin, getServerOrigin);
  const config = JSON.stringify({ registries: { "@modulo": {
    url: `${origin}/r/{name}.json`, headers: { Authorization: "Bearer ${MODULO_REGISTRY_KEY}" },
  } } }, null, 2);
  return <>
    <p>Set <code>MODULO_REGISTRY_KEY</code> to your key. Add this registry entry to <code>components.json</code>.</p>
    <pre><code>{config}</code></pre>
  </>;
}
