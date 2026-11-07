import { clamp } from './engine/math';
import type { Weather, WeatherEvent } from './weather';

export function createNilkamalAudio(enabled = true, volume = .45) {
  let context: AudioContext | null = null, master: GainNode | null = null;
  let noise: AudioBuffer | null = null, rain: GainNode | null = null, wind: GainNode | null = null, pond: GainNode | null = null;
  let active = false, destroyed = false, selected: Weather = 'clear', intensity = .8, voices = 0, eventsPlayed = 0, lastEvent = -1;
  const loops: AudioBufferSourceNode[] = [];
  const liveVoices = new Set<AudioScheduledSourceNode>();
  const disconnects = new Map<AudioScheduledSourceNode, () => void>();

  function level(gain: GainNode | null, value: number, duration = .2) {
    if (!gain || !context) return;
    gain.gain.cancelScheduledValues(context.currentTime);
    gain.gain.setTargetAtTime(value, context.currentTime, duration);
  }

  function sync() {
    level(master, enabled && active ? clamp(volume) : 0, .08);
    level(rain, (selected === 'storm' ? .24 : selected === 'rain' ? .15 : selected === 'hail' ? .045 : selected === 'snow' ? .012 : 0) * intensity, .5);
    level(wind, (selected === 'storm' ? .3 : selected === 'snow' || selected === 'hail' ? .14 : .045) * intensity, .6);
    level(pond, selected === 'clear' ? .025 : selected === 'rain' ? .01 : 0, .4);
  }

  function bed(frequency: number, type: BiquadFilterType, q: number) {
    if (!context || !noise || !master) return null;
    const source = context.createBufferSource(), filter = context.createBiquadFilter(), gain = context.createGain();
    source.buffer = noise; source.loop = true; filter.type = type; filter.frequency.value = frequency; filter.Q.value = q;
    gain.gain.value = 0; source.connect(filter).connect(gain).connect(master); source.start(); loops.push(source);
    disconnects.set(source, () => { source.disconnect(); filter.disconnect(); gain.disconnect(); });
    return gain;
  }

  async function unlock() {
    if (!enabled || destroyed || !active) return;
    if (!context) {
      context = new AudioContext(); master = context.createGain(); master.gain.value = 0;
      const compressor = context.createDynamicsCompressor(); compressor.threshold.value = -18; compressor.ratio.value = 5;
      master.connect(compressor).connect(context.destination);
      noise = context.createBuffer(2, context.sampleRate * 4, context.sampleRate);
      for (let channel = 0; channel < 2; channel++) {
        const data = noise.getChannelData(channel); let previous = 0;
        for (let i = 0; i < data.length; i++) { previous = (previous + (Math.random() * 2 - 1) * .05) / 1.05; data[i] = previous * 4; }
      }
      rain = bed(4400, 'highpass', .3); wind = bed(260, 'lowpass', .4); pond = bed(1100, 'bandpass', 1.8);
    }
    if (context.state === 'suspended') await context.resume();
    sync();
  }

  function event(event: WeatherEvent) {
    if (!context || !master || !noise || !enabled || !active || destroyed || context.state !== 'running' || voices >= 12) return;
    const now = context.currentTime;
    if (event !== 'thunder' && now - lastEvent < .08) return;
    lastEvent = now; eventsPlayed++; voices++;
    const gain = context.createGain(), pan = context.createStereoPanner(), filter = context.createBiquadFilter();
    const noisy = event === 'thunder' || event === 'ice' || event === 'weather';
    const source = noisy ? context.createBufferSource() : context.createOscillator();
    const duration = event === 'thunder' ? 4 : event === 'ice' ? .7 : event === 'lotus' ? .8 : event === 'weather' ? .6 : .15;
    const peak = event === 'thunder' ? .6 : event === 'ice' ? .14 : event === 'lotus' ? .07 : event === 'weather' ? .055 : .045;
    if (source instanceof AudioBufferSourceNode) { source.buffer = noise; source.playbackRate.value = event === 'thunder' ? .65 : event === 'ice' ? 1.8 : 1; }
    else {
      source.type = 'sine';
      source.frequency.setValueAtTime(event === 'lotus' ? 660 : event === 'hail' ? 2300 : 1100, now);
      source.frequency.exponentialRampToValueAtTime(event === 'lotus' ? 440 : event === 'hail' ? 750 : 220, now + duration);
    }
    filter.type = noisy ? 'lowpass' : 'allpass'; filter.frequency.value = event === 'thunder' ? 180 : event === 'ice' ? 3500 : 1800;
    pan.pan.value = event === 'lotus' ? 0 : Math.random() * 1.2 - .6;
    gain.gain.setValueAtTime(.0001, now); gain.gain.exponentialRampToValueAtTime(peak, now + (event === 'thunder' ? .18 : .012));
    gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
    source.connect(filter).connect(gain).connect(pan).connect(master);
    liveVoices.add(source);
    const cleanup = () => { source.disconnect(); filter.disconnect(); gain.disconnect(); pan.disconnect(); liveVoices.delete(source); disconnects.delete(source); voices = Math.max(0, voices - 1); };
    disconnects.set(source, cleanup); source.onended = cleanup; source.start(now); source.stop(now + duration + .05);
  }

  function stopVoices() {
    for (const source of [...liveVoices]) {
      source.onended = null;
      try { source.stop(); } catch {}
      disconnects.get(source)?.();
    }
  }

  return {
    unlock, event,
    setWeather(weather: Weather) { selected = weather; sync(); },
    setIntensity(value: number) { intensity = clamp(value, .2, 1); sync(); },
    setActive(value: boolean) {
      if (active === value || destroyed) return;
      active = value; sync();
      if (!value) {
        stopVoices();
        void context?.suspend().catch(() => {});
      } else if (enabled && context) void context.resume().catch(() => {});
    },
    setAudio(value: boolean, nextVolume = volume) {
      enabled = value; volume = clamp(Number.isFinite(nextVolume) ? nextVolume : .45); sync();
      if (!value) { stopVoices(); void context?.suspend().catch(() => {}); }
      else if (active && context) void context.resume().catch(() => {});
    },
    snapshot() { return { enabled, active, unlocked: Boolean(context), state: context?.state ?? 'locked', voices, eventsPlayed, volume }; },
    destroy() {
      if (destroyed) return; destroyed = true;
      for (const source of [...loops, ...liveVoices]) { source.onended = null; try { source.stop(); } catch {} disconnects.get(source)?.(); }
      disconnects.clear(); liveVoices.clear(); loops.length = 0; voices = 0;
      master?.disconnect(); void context?.close().catch(() => {}); context = null;
    },
  };
}
