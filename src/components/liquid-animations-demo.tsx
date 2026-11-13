"use client";

import { useId, useState } from "react";
import { RuneIcon } from "runeicons-react";
import { LiquidButton, LiquidMenu, LiquidSelect, LiquidTooltip, LiquidTooltipProvider } from "@/registry/liquid-animations/LiquidControls";
import { LiquidProvider } from "@/registry/liquid-animations/LiquidProvider";
import { InterfaceSlider } from "./interface-slider";
import { LiquidTabs } from "@/registry/liquid-animations/LiquidTrack";
import "./liquid-animations-demo.css";

const examples = ["Menu", "Select", "Tooltip", "Account", "Language", "Reactions", "Color"];
const colors = [
  { value: "Red", label: "Red", color: "#f52d50" }, { value: "Orange", label: "Orange", color: "#ff7319" },
  { value: "Amber", label: "Amber", color: "#ffb900" }, { value: "Green", label: "Green", color: "#0bdd68" },
  { value: "Teal", label: "Teal", color: "#09cfb0" }, { value: "Blue", label: "Blue", color: "#3986ff" },
  { value: "Indigo", label: "Indigo", color: "#6957f6" }, { value: "Violet", label: "Violet", color: "#9647f8" },
  { value: "Pink", label: "Pink", color: "#ef29a4" }, { value: "Gray", label: "Gray", color: "#606060" },
];

export function LiquidAnimationsDemo({ initialExample = "Tooltip", compact = false }: { initialExample?: string; compact?: boolean }) {
  const id = useId();
  const [example, setExample] = useState(initialExample), [speed, setSpeed] = useState(100);
  const [color, setColor] = useState("Blue"), [language, setLanguage] = useState("English"), [selected, setSelected] = useState("Option 1");
  const [reaction, setReaction] = useState("React"), [favorite, setFavorite] = useState(false), [status, setStatus] = useState("");
  const action = (label: string) => () => setStatus(`${label} selected`);
  return <LiquidProvider speed={speed / 100}>
    <div className={`liquid-demo ${compact ? "liquid-demo-compact" : ""}`}>
      <section className="liquid-demo-stage" aria-label="Liquid Animations preview">
        <div className="liquid-demo-example" id={id} role="tabpanel" aria-label={example} tabIndex={0}>
          {example === "Tooltip" && <LiquidTooltipProvider><div className="liquid-demo-tools">
            <LiquidTooltip label="Copy link"><LiquidButton icon aria-label="Copy link" onClick={action("Copy link")}><RuneIcon name="code-link" size={20} /></LiquidButton></LiquidTooltip>
            <LiquidTooltip label="Download"><LiquidButton icon aria-label="Download" onClick={action("Download")}><RuneIcon name="arrows-arrow-down-to-line" size={20} /></LiquidButton></LiquidTooltip>
            <LiquidTooltip label="Add to favorites"><LiquidButton icon aria-label="Add to favorites" aria-pressed={favorite} onClick={() => { setFavorite(!favorite); setStatus(favorite ? "Removed from favorites" : "Added to favorites"); }}><RuneIcon name="tools-heart" size={20} /></LiquidButton></LiquidTooltip>
          </div></LiquidTooltipProvider>}
          {example === "Menu" && <div className="liquid-demo-anchor"><LiquidMenu label="Menu" className="liquid-demo-trigger" entries={["Copy link", "Download", "Add to favorites", "Share"].map(label => ({ kind: "action", label, onClick: action(label) }))} /></div>}
          {example === "Select" && <div className="liquid-demo-anchor"><LiquidSelect label="Select" className="liquid-demo-trigger" value={selected} options={["Option 1", "Option 2", "Option 3", "Option 4"].map(value => ({ value, label: value }))} onValueChange={value => { setSelected(value); setStatus(`${value} selected`); }} /></div>}
          {example === "Language" && <div className="liquid-demo-anchor"><LiquidSelect label="Language" className="liquid-demo-trigger" value={language} options={["English", "Hindi", "French", "Japanese"].map(value => ({ value, label: value }))} onValueChange={value => { setLanguage(value); setStatus(`${value} selected`); }} /></div>}
          {example === "Color" && <div className="liquid-demo-anchor"><LiquidSelect label="Color" className="liquid-demo-trigger" width={210} palette value={color} options={colors}
            triggerValue={<span className="liquid-demo-color"><span className="liquid-demo-dot" style={{ background: colors.find(item => item.value === color)?.color }} />{color}</span>}
            onValueChange={value => { setColor(value); setStatus(`${value} selected`); }} /></div>}
          {example === "Reactions" && <div className="liquid-demo-anchor"><LiquidMenu label="Reactions" className="liquid-demo-trigger" width={226} layout="reactions" entries={[
            { label: "Like", emoji: "👍" }, { label: "Love", emoji: "❤️" }, { label: "Laugh", emoji: "😂" }, { label: "Fire", emoji: "🔥" }, { label: "Celebrate", emoji: "🎉" },
          ].map(item => ({ kind: "action", label: item.label, content: <span aria-hidden="true">{item.emoji}</span>, onClick: () => { setReaction(item.emoji); setStatus(`${item.label} selected`); } }))}>{reaction}</LiquidMenu></div>}
          {example === "Account" && <div className="liquid-demo-account-anchor"><LiquidMenu label="Jane Doe account" round align="end" sideOffset={10} radius={16} popupClassName="liquid-demo-account"
            heading={<div className="liquid-demo-identity"><strong>Jane Doe</strong><span>jane@example.com</span></div>} entries={[
              { label: "Profile", icon: "indicators-circle-user" }, { label: "Settings", icon: "metrics-sliders-horizontal" },
              { label: "Billing", icon: "money-credit-card" }, { label: "Sign out", icon: "identity-log-out" },
            ].map(item => ({ kind: "action", label: item.label, icon: <RuneIcon name={item.icon} size={16} />, onClick: action(item.label) }))}>JD</LiquidMenu></div>}
        </div>
        <div className="liquid-demo-tabs"><LiquidTabs label="Examples" value={example} panelId={id} options={examples.map(value => ({ value, label: value }))} onValueChange={value => { setExample(value); setStatus(""); }} /></div>
      </section>
      {!compact && <div className="liquid-demo-speed"><InterfaceSlider label="Motion speed" value={speed} min={25} max={150} step={1} onValueChange={setSpeed} formatValue={value => `${value}%`} showValue={false} /></div>}
      {!compact && <p className="liquid-demo-status" role="status" aria-live="polite">{status}</p>}
    </div>
  </LiquidProvider>;
}
