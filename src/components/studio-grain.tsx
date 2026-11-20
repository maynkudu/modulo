"use client";

import { useEffect, useRef } from "react";
import type { ShaderMount } from "@paper-design/shaders";

const stillFrame = 10_500;
const waveExpression = "float wave = cos(.5 * shape_uv.x - 4. * t) * sin(1.5 * shape_uv.x + 2. * t) * (.75 + .25 * cos(6. * t));";
const colorOutput = "vec3 color = gradient.rgb * totalShape;";

/** Renders a grainy red ridge on the moving burgundy wave. */
export function StudioGrain({ className }: { className: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let shader: ShaderMount | undefined;
    let visible = true;
    let disposed = false;
    let canvas: HTMLCanvasElement | null = null;
    const speed = .72;

    function syncMotion() {
      shader?.setSpeed(visible && !document.hidden && !motion.matches ? speed : 0);
      if (motion.matches) shader?.setFrame(stillFrame);
    }

    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncMotion();
    });
    visibility.observe(host);
    motion.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncMotion);

    function showFallback() {
      shader?.dispose();
      shader = undefined;
      canvas?.remove();
      if (host) host.dataset.shader = "fallback";
    }

    void (async () => {
      try {
        const { ShaderMount, grainGradientFragmentShader, getShaderColorFromString, getShaderNoiseTexture } = await import("@paper-design/shaders");
        if (disposed) return;
        const noise = getShaderNoiseTexture();
        if (!noise || !grainGradientFragmentShader.includes(waveExpression) || !grainGradientFragmentShader.includes(colorOutput)) {
          showFallback();
          return;
        }
        await noise.decode();
        if (disposed) return;
        const baseWave = waveExpression.slice("float wave = ".length, -1).replaceAll("shape_uv.x", "x");
        const fragment = grainGradientFragmentShader
          .replace("void main()", `float studioWave(float x, float t) { return ${baseWave}; }\nvoid main()`)
          .replace("float shape = 0.;", "float shape = 0.;\nfloat ridge = 0.;")
          .replace(waveExpression, `
            float wave = studioWave(shape_uv.x, 1.75) + .25 * (studioWave(shape_uv.x, t) - studioWave(shape_uv.x, 1.75));
            float crossWave = shape_uv.y + wave;
            float fold = .22 * sin(shape_uv.x * 1.8 + .4 * sin(t * .7));
            float ridgeDistance = crossWave + .32 - fold;
            ridge = exp(-4.2 * ridgeDistance * ridgeDistance);
          `)
          .replace(colorOutput, `
            float grain = .92 + .08 * clamp(baseNoise + .4, 0., 1.);
            float highlight = pow(ridge, 1.5) * smoothstep(.20, .56, shape) * grain;
            vec3 color = mix(gradient.rgb * totalShape, u_colors[3].rgb, highlight);
          `);
        const palette = getComputedStyle(host);
        const ground = getShaderColorFromString(palette.getPropertyValue("--page-background"));
        const burgundy = getShaderColorFromString(palette.getPropertyValue("--shader-burgundy"));
        const highlight = getShaderColorFromString(palette.color);
        const blend = (channel: number, weight: number) => ground[channel] + (burgundy[channel] - ground[channel]) * weight;
        shader = new ShaderMount(host, fragment, {
          u_colorBack: ground,
          u_colors: [[blend(0, .25), blend(1, .25), blend(2, .25), 1], [blend(0, .64), blend(1, .64), blend(2, .64), 1], burgundy, highlight],
          u_colorsCount: 3, u_softness: .87, u_intensity: .26, u_noise: .065, u_shape: 1,
          u_fit: 1, u_scale: 1.64, u_rotation: 168, u_originX: .5, u_originY: .5,
          u_offsetX: .04, u_offsetY: .12, u_worldWidth: 0, u_worldHeight: 0, u_noiseTexture: noise,
        }, undefined, 0, stillFrame, 1, 1_250_000);
        canvas = host.querySelector("canvas");
        if (!canvas) { showFallback(); return; }
        canvas.addEventListener("webglcontextlost", showFallback, { once: true });
        host.dataset.shader = "ready";
        syncMotion();
      } catch {
        canvas = host.querySelector("canvas");
        showFallback();
      }
    })();

    return () => {
      disposed = true;
      visibility.disconnect();
      motion.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncMotion);
      canvas?.removeEventListener("webglcontextlost", showFallback);
      shader?.dispose();
      delete host.dataset.shader;
    };
  }, []);

  return <div ref={hostRef} className={className} aria-hidden="true" />;
}
