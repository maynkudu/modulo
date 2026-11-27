export const designStorageKey = "modulo-design-mode";
export type SiteDesign = "artistic" | "bold";

export function isSiteDesign(value: unknown): value is SiteDesign {
  return value === "artistic" || value === "bold";
}

export const designInitialization = `(()=>{let mode="artistic";try{const saved=localStorage.getItem("${designStorageKey}");if(saved==="bold"||saved==="artistic")mode=saved}catch{}document.documentElement.dataset.design=mode})()`;
