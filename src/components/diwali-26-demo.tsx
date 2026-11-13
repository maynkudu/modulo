"use client";

import { useCallback, useId, useRef, useState } from "react";
import { Diwali26, type Diwali26Controller, type Pattern, type FrameState } from "@/registry/diwali-26/Diwali26";
import { useSoundSettings } from "@/lib/interface-sounds";
import { LiquidButton } from "@/registry/liquid-animations/LiquidControls";
import { InterfaceSlider } from "./interface-slider";
import { LiquidTrack } from "@/registry/liquid-animations/LiquidTrack";
import styles from "./diwali-26-demo.module.css";

declare global { interface Window { diwali26?: Diwali26Controller; } }
const patterns=[{value:"surprise",label:"Surprise me"},{value:"chrysanthemum",label:"Chrysanthemum"},{value:"lotus",label:"Lotus"},{value:"rings",label:"Double ring"},{value:"willow",label:"Golden willow"},{value:"diwali",label:"DIWALI"},{value:"2026",label:"2026"}] satisfies {value:Pattern;label:string}[];

export function Diwali26Demo() {
 const id=useId(),controller=useRef<Diwali26Controller|null>(null),lastStatus=useRef("");
 const artwork=useRef<HTMLElement|null>(null),pendingLaunch=useRef(false);
 const sound=useSoundSettings(),enabled=sound.enabled&&sound.volume>0;
 const [pattern,setPattern]=useState<Pattern>("surprise"),[volume,setVolume]=useState(1),[paused,setPaused]=useState(false);
 const [reduced,setReduced]=useState(false),[ready,setReady]=useState(false),[saving,setSaving]=useState(false),[error,setError]=useState("");
 const onReady=useCallback((instance:Diwali26Controller|null)=>{controller.current=instance;pendingLaunch.current=false;setReady(Boolean(instance));if(process.env.NODE_ENV==="development"){if(instance)window.diwali26=instance;else delete window.diwali26;}},[]);
 const onFrame=useCallback((frame:FrameState)=>{if(pendingLaunch.current&&frame.visible&&!frame.paused){pendingLaunch.current=false;controller.current?.launch();}const value=String(frame.reducedMotion);if(lastStatus.current!==value){lastStatus.current=value;setReduced(frame.reducedMotion);}},[]);
 const onError=useCallback((error:Error)=>setError(error.message),[]);
 const unlock=()=>{void controller.current?.unlockAudio();};
 function launch(){
  const instance=controller.current;if(!instance)return;
  void instance.unlockAudio();
  if(instance.snapshot().visible){pendingLaunch.current=false;instance.launch();}
  else{pendingLaunch.current=true;artwork.current?.scrollIntoView({block:"nearest",behavior:"instant"});}
 }
 async function save(){
  if(!controller.current)return;setSaving(true);setError("");
  try{const blob=await controller.current.exportPNG();const url=URL.createObjectURL(blob),link=document.createElement("a");link.href=url;link.download="diwali-26.png";link.click();URL.revokeObjectURL(url);}
  catch(error){setError(error instanceof Error?error.message:"Could not save the artwork.");}finally{setSaving(false);}
 }
 return <>
  <section ref={artwork} className={styles.artwork} aria-label="Diwali/26 preview">
   <header className={styles.artworkHeader}><h2>Diwali/26</h2><span>{reduced?"Still skyshots":paused?"Paused":"Click the sky"}</span></header>
   <Diwali26 pattern={pattern} volume={volume * sound.volume} paused={paused} enableAudio={enabled} fallback={error ? "/artwork/diwali-26.png" : undefined} onReady={onReady} onFrame={onFrame} onError={onError}/>
  </section>
  <section className={styles.controlsPanel} aria-labelledby={`${id}-controls`}>
   <h2 id={`${id}-controls`}>Skyshots</h2>
   <LiquidTrack className={styles.weather} role="group" aria-label="Skyshot pattern">{patterns.map(({value,label})=><LiquidButton type="button" key={value} aria-pressed={pattern===value} disabled={!ready} onClick={()=>{unlock();setPattern(value);}}>{label}</LiquidButton>)}</LiquidTrack>
   <p className={styles.hint}>{reduced?"Click the sky for a still skyshot. Motion follows your reduced-motion preference.":"Click the sky to launch. Brush the petals and powder, or Tab to a flower and press Enter."}</p>
   <InterfaceSlider className={styles.slider} label="Volume" min={0} max={1} step={.05} value={volume} disabled={!ready || !enabled}
     formatValue={value => enabled ? `${Math.round(value * 100)}%` : "Muted"} onValueChange={value => { unlock(); setVolume(value); }} />
   <div className={styles.actions}>
    <LiquidButton type="button" disabled={!ready||paused} data-festival-feedback onClick={launch}>Launch</LiquidButton>
    <LiquidButton type="button" disabled={!ready||(reduced&&!paused)} aria-pressed={paused} onClick={()=>{pendingLaunch.current=false;setPaused(!paused);}}>{paused?"Resume":"Pause"}</LiquidButton>
    <LiquidButton type="button" disabled={!ready} onClick={()=>{pendingLaunch.current=false;controller.current?.clear();}}>Clear sky</LiquidButton>
    <LiquidButton type="button" disabled={!ready||saving} onClick={save}>{saving?"Saving...":"Save PNG"}</LiquidButton>
   </div>
   {error&&<p className={styles.error} role="alert">{error}</p>}
  </section>
 </>;
}
