import type { PhysicsWorld } from "../engine/world";
import { RootGeometry, VERTEX_SIZE } from "./root-geometry";

const vertexSource = `#version 300 es
precision highp float;
layout(location = 0) in vec3 a_position;
layout(location = 1) in vec3 a_normal;
layout(location = 2) in float a_phase;
uniform vec2 u_viewport;
out vec2 v_position;
out vec3 v_normal;
flat out float v_phase;
void main() {
  float depth = 0.98 / (1.0 + max(0.0, a_position.z) * 0.006);
  gl_Position = vec4(a_position.xy / u_viewport * vec2(2.0, -2.0) + vec2(-1.0, 1.0), depth * 2.0 - 1.0, 1.0);
  v_position = a_position.xy;
  v_normal = a_normal;
  v_phase = a_phase;
}`;

const tissueInputs = `#version 300 es
precision highp float;
in vec2 v_position;
in vec3 v_normal;
flat in float v_phase;
out vec4 outColor;`;

const tubeSource = `
vec3 tube() {
  // Interpolated shared vertex normals keep the material continuous through bends and broad overlaps.
  float distance = length(v_normal.xy);
  float edge = max(0.0002, fwidth(distance));
  float alpha = 1.0 - smoothstep(1.0 - edge, 1.0, distance);
  if (alpha < 0.01) discard;
  return vec3(normalize(v_normal).xy, alpha);
}`;

const skinSource = `
uniform float u_darkness;
float hash(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + 1.0), f.x), f.y);
}
vec4 skin(vec2 position, vec2 profile, float phase, float alpha) {
  float distance = length(profile);
  float height = sqrt(max(0.0, 1.0 - distance * distance));
  vec3 surface = normalize(vec3(profile, height));
  vec3 light = normalize(vec3(-0.42, -0.68, 0.65));
  float diffuse = max(0.0, dot(surface, light));
  // One coordinate field per organism prevents texture jumps between segments and rounded joins.
  vec2 direction = vec2(cos(phase), sin(phase));
  vec2 material = vec2(dot(position, direction), dot(position, vec2(-direction.y, direction.x))) + phase * 43.0;
  float tissue = noise(material * vec2(0.017, 0.032) + phase);
  float grain = hash(floor(position * 1.6) + phase) - 0.5;
  vec3 darkBase = mix(vec3(0.077, 0.032, 0.043), vec3(0.102, 0.052, 0.061), tissue);
  vec3 brightBase = mix(vec3(0.37, 0.17, 0.20), vec3(0.52, 0.25, 0.29), tissue);
  vec3 base = mix(darkBase, brightBase, u_darkness);
  vec3 color = base * (mix(0.36, 0.60, u_darkness) + diffuse * 0.84) + grain * 0.009;
  if (u_detail > 0.5) {
    float vein = pow(1.0 - abs(sin(material.y * 0.09 + tissue * 7.0 + phase)), 20.0);
    color *= 1.0 - vein * 0.17;
    vec3 halfLight = normalize(light + vec3(0.0, 0.0, 1.0));
    float wet = noise(material * vec2(0.032, 0.11) + 16.0);
    float gloss = pow(max(0.0, dot(surface, halfLight)), 48.0) * (0.015 + wet * 0.085);
    color += vec3(0.9, 0.66, 0.62) * gloss;
  }
  if (u_detail > 1.5) {
    vec2 cell = floor(material / vec2(36.0, 24.0));
    vec2 local = mod(material, vec2(36.0, 24.0)) - vec2(18.0, 12.0);
    float scar = (1.0 - smoothstep(0.2, 0.9, abs(local.y + local.x * 0.21 + (hash(cell) - 0.5) * 12.0)))
      * (1.0 - smoothstep(2.0, 7.0, abs(local.x))) * step(0.6, hash(cell + phase));
    color += scar * vec3(0.013, 0.008, 0.009);
    color *= 0.96 + noise(material * 0.18) * 0.08;
  }
  if (phase < 0.0) { color = mix(vec3(0.24, 0.11, 0.14), vec3(0.55, 0.26, 0.31), u_darkness); alpha *= 0.16; }
  return vec4(max(color, vec3(0.0)) * alpha, alpha);
}`;

const fragmentSource = `${tissueInputs}
uniform float u_detail;
${tubeSource}
${skinSource}
void main() {
  vec3 tissue = tube();
  outColor = skin(v_position, tissue.xy, v_phase, tissue.z);
}`;

const fieldSource = `${tissueInputs}
${tubeSource}
void main() {
  vec3 tissue = tube();
  outColor = vec4(tissue.xy, v_phase, tissue.z);
}`;

const sphereVertexSource = `#version 300 es
layout(location = 0) in vec4 a_sphere;
uniform vec2 u_viewport;
out vec2 v_position;
flat out vec4 v_sphere;
void main() {
  const vec2 corners[6] = vec2[6](vec2(-1.0, -1.0), vec2(1.0, -1.0), vec2(-1.0, 1.0),
    vec2(-1.0, 1.0), vec2(1.0, -1.0), vec2(1.0, 1.0));
  v_position = a_sphere.xy + corners[gl_VertexID] * a_sphere.z;
  v_sphere = a_sphere;
  gl_Position = vec4(v_position / u_viewport * vec2(2.0, -2.0) + vec2(-1.0, 1.0), 0.0, 1.0);
}`;

const sphereInputs = `#version 300 es
precision highp float;
in vec2 v_position;
flat in vec4 v_sphere;
out vec4 outColor;`;

const sphereSource = `
vec3 sphere() {
  vec2 profile = (v_position - v_sphere.xy) / max(0.01, v_sphere.z);
  float distance = length(profile);
  float edge = max(0.0002, fwidth(distance));
  float alpha = 1.0 - smoothstep(1.0 - edge, 1.0, distance);
  if (alpha < 0.01) discard;
  float height = sqrt(max(0.0, 1.0 - distance * distance));
  gl_FragDepth = 0.98 / (1.0 + v_sphere.z * height * 0.006);
  return vec3(profile, alpha);
}`;

const sphereFragmentSource = `${sphereInputs}
uniform float u_detail;
${sphereSource}
${skinSource}
void main() {
  vec3 tissue = sphere();
  outColor = skin(v_position, tissue.xy, v_sphere.w, tissue.z);
}`;

const sphereFieldSource = `${sphereInputs}
${sphereSource}
void main() {
  vec3 tissue = sphere();
  outColor = vec4(tissue.xy, v_sphere.w, tissue.z);
}`;

const screenVertexSource = `#version 300 es
out vec2 v_uv;
void main() {
  vec2 corner = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  v_uv = corner;
  gl_Position = vec4(corner * 2.0 - 1.0, 0.0, 1.0);
}`;

const screenFragmentSource = `#version 300 es
precision highp float;
in vec2 v_uv;
uniform sampler2D u_field;
uniform vec2 u_viewport;
uniform float u_detail;
out vec4 outColor;
${skinSource}
void main() {
  vec4 tissue = texture(u_field, v_uv);
  if (tissue.a < 0.01) discard;
  vec2 position = vec2(v_uv.x, 1.0 - v_uv.y) * u_viewport;
  outColor = skin(position, tissue.xy, tissue.z, tissue.w);
}`;

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Root Infection could not allocate a shader.");
  gl.shaderSource(shader, source); gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Root Infection shader failed: ${message}`);
  }
  return shader;
}

function link(gl: WebGL2RenderingContext, vertexSource: string, fragmentSource: string) {
  const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource);
  let fragment: WebGLShader;
  try { fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource); }
  catch (error) { gl.deleteShader(vertex); throw error; }
  const program = gl.createProgram();
  if (!program) {
    gl.deleteShader(vertex); gl.deleteShader(fragment);
    throw new Error("Root Infection could not allocate a material.");
  }
  gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
  gl.deleteShader(vertex); gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Root Infection material failed: ${message}`);
  }
  return program;
}

/** A floating-point tissue field shades only visible pixels, preserving detail under heavy overlap. */
function makeField(gl: WebGL2RenderingContext) {
  if (!gl.getExtension("EXT_color_buffer_float")) return null;
  const tissue = link(gl, vertexSource, fieldSource);
  let skin: WebGLProgram;
  try { skin = link(gl, screenVertexSource, screenFragmentSource); }
  catch (error) { gl.deleteProgram(tissue); throw error; }
  let spheres: WebGLProgram;
  try { spheres = link(gl, sphereVertexSource, sphereFieldSource); }
  catch (error) { gl.deleteProgram(tissue); gl.deleteProgram(skin); throw error; }
  const texture = gl.createTexture(), framebuffer = gl.createFramebuffer();
  const depth = gl.createRenderbuffer(), vao = gl.createVertexArray();
  if (!texture || !framebuffer || !depth || !vao) {
    gl.deleteProgram(tissue); gl.deleteProgram(skin); gl.deleteProgram(spheres); gl.deleteTexture(texture);
    gl.deleteFramebuffer(framebuffer); gl.deleteRenderbuffer(depth); gl.deleteVertexArray(vao);
    return null;
  }
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return { texture, framebuffer, depth, vao, tissue, skin, spheres, width: 0, height: 0,
    tissueViewport: gl.getUniformLocation(tissue, "u_viewport"),
    sphereViewport: gl.getUniformLocation(spheres, "u_viewport"),
    skinViewport: gl.getUniformLocation(skin, "u_viewport"),
    darkness: gl.getUniformLocation(skin, "u_darkness"),
    detail: gl.getUniformLocation(skin, "u_detail"), sampler: gl.getUniformLocation(skin, "u_field") };
}

function disposeField(gl: WebGL2RenderingContext, field: NonNullable<ReturnType<typeof makeField>>) {
  gl.deleteProgram(field.tissue); gl.deleteProgram(field.skin); gl.deleteProgram(field.spheres); gl.deleteTexture(field.texture);
  gl.deleteFramebuffer(field.framebuffer); gl.deleteRenderbuffer(field.depth); gl.deleteVertexArray(field.vao);
}

function resizeField(gl: WebGL2RenderingContext, field: NonNullable<ReturnType<typeof makeField>>, width: number, height: number) {
  gl.bindTexture(gl.TEXTURE_2D, field.texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, width, height, 0, gl.RGBA, gl.HALF_FLOAT, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, field.depth);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT24, width, height);
  gl.bindFramebuffer(gl.FRAMEBUFFER, field.framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, field.texture, 0);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, field.depth);
  const complete = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  field.width = width; field.height = height;
  return complete;
}

function makeGpu(gl: WebGL2RenderingContext) {
  const program = link(gl, vertexSource, fragmentSource);
  const buffer = gl.createBuffer(), vao = gl.createVertexArray();
  if (!buffer || !vao) {
    gl.deleteProgram(program); gl.deleteBuffer(buffer); gl.deleteVertexArray(vao);
    throw new Error("Root Infection could not allocate rendering resources.");
  }
  let field: ReturnType<typeof makeField>;
  try { field = makeField(gl); }
  catch (error) { gl.deleteProgram(program); gl.deleteBuffer(buffer); gl.deleteVertexArray(vao); throw error; }
  let sphereProgram: WebGLProgram;
  try { sphereProgram = link(gl, sphereVertexSource, sphereFragmentSource); }
  catch (error) {
    if (field) disposeField(gl, field);
    gl.deleteProgram(program); gl.deleteBuffer(buffer); gl.deleteVertexArray(vao); throw error;
  }
  const sphereBuffer = gl.createBuffer(), sphereVao = gl.createVertexArray();
  if (!sphereBuffer || !sphereVao) {
    if (field) disposeField(gl, field);
    gl.deleteProgram(program); gl.deleteProgram(sphereProgram); gl.deleteBuffer(buffer);
    gl.deleteBuffer(sphereBuffer); gl.deleteVertexArray(vao); gl.deleteVertexArray(sphereVao);
    throw new Error("Root Infection could not allocate particle rendering resources.");
  }
  gl.bindVertexArray(sphereVao); gl.bindBuffer(gl.ARRAY_BUFFER, sphereBuffer);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 16, 0); gl.vertexAttribDivisor(0, 1);
  gl.bindVertexArray(vao); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  for (let attribute = 0; attribute < 3; attribute++) {
    gl.enableVertexAttribArray(attribute);
    const offset = attribute === 0 ? 0 : attribute === 1 ? 3 : 6;
    const size = attribute === 2 ? 1 : 3;
    gl.vertexAttribPointer(attribute, size, gl.FLOAT, false, VERTEX_SIZE * 4, offset * 4);
  }
  gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL);
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.disable(gl.CULL_FACE); gl.clearColor(0, 0, 0, 0); gl.clearDepth(1);
  return { program, buffer, vao, field, bytes: 0, sphereBuffer, sphereVao, sphereProgram, sphereBytes: 0,
    viewport: gl.getUniformLocation(program, "u_viewport"), detail: gl.getUniformLocation(program, "u_detail"),
    darkness: gl.getUniformLocation(program, "u_darkness"), sphereDarkness: gl.getUniformLocation(sphereProgram, "u_darkness"),
    sphereViewport: gl.getUniformLocation(sphereProgram, "u_viewport"), sphereDetail: gl.getUniformLocation(sphereProgram, "u_detail") };
}

/** Rounded tube meshes share joint normals. The optional skin pass shades each visible pixel once. */
export class RootRenderer {
  detail = 2;
  private width = 1;
  private height = 1;
  private density = 1;
  private backgroundLuminance = 1;
  private darkness = 0;
  private skinDarkness = -1;
  private readonly geometry = new RootGeometry();
  private readonly gl: WebGL2RenderingContext | null;
  private readonly context: CanvasRenderingContext2D | null;
  private gpu: ReturnType<typeof makeGpu> | null = null;
  private skin: CanvasPattern | null = null;
  private lost = false;
  private disposed = false;
  readonly timings = { geometryMs: 0, bodyMs: 0, detailMs: 0 };

  constructor(readonly canvas: HTMLCanvasElement) {
    this.gl = canvas.getContext("webgl2", { alpha: true, antialias: true, premultipliedAlpha: true, depth: true });
    this.context = this.gl ? null : canvas.getContext("2d", { alpha: true });
    if (this.gl) {
      this.gpu = makeGpu(this.gl);
      canvas.addEventListener("webglcontextlost", this.onLost);
      canvas.addEventListener("webglcontextrestored", this.onRestored);
    } else if (this.context) this.updateCanvasSkin();
    else throw new Error("Root Infection requires WebGL 2 or Canvas 2D.");
  }

  /** Sampled page luminance selects contrast without changing geometry or skin detail. */
  setBackgroundLuminance(luminance: number) {
    this.backgroundLuminance = Math.max(0, Math.min(1, luminance));
    const blend = Math.max(0, Math.min(1, (this.backgroundLuminance - 0.02) / 0.33));
    this.darkness = 1 - blend * blend * (3 - 2 * blend);
    if (this.context && Math.abs(this.skinDarkness - this.darkness) > 0.02) this.updateCanvasSkin();
  }

  private updateCanvasSkin() {
    if (this.context) {
      this.skinDarkness = this.darkness;
      const canvas = this.canvas;
      const tile = canvas.ownerDocument.createElement("canvas");
      tile.width = tile.height = 128;
      const context = tile.getContext("2d");
      if (context) {
        const pixels = context.createImageData(128, 128);
        let seed = 34591;
        for (let index = 0; index < pixels.data.length; index += 4) {
          seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
          const grain = seed / 4294967296 * 8;
          pixels.data[index] = 18 + this.darkness * 82 + grain;
          pixels.data[index + 1] = 8 + this.darkness * 38 + grain * 0.5;
          pixels.data[index + 2] = 12 + this.darkness * 44 + grain * 0.7; pixels.data[index + 3] = 255;
        }
        context.putImageData(pixels, 0, 0);
        this.skin = this.context.createPattern(tile, "repeat");
      }
    }
  }

  private onLost = (event: Event) => { event.preventDefault(); this.lost = true; };
  private onRestored = () => {
    if (this.disposed || !this.gl) return;
    this.gpu = makeGpu(this.gl); this.lost = false;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  };

  resize(width: number, height: number, density: number) {
    this.width = width; this.height = height; this.density = density;
    this.canvas.width = Math.round(width * density); this.canvas.height = Math.round(height * density);
    this.gl?.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  private triangles(c: CanvasRenderingContext2D, first: number, count: number) {
    const data = this.geometry.vertices;
    for (let vertex = first; vertex < first + count; vertex += 3) {
      const a = vertex * VERTEX_SIZE, b = a + VERTEX_SIZE, d = b + VERTEX_SIZE;
      const positive = (data[b] - data[a]) * (data[d + 1] - data[a + 1]) - (data[b + 1] - data[a + 1]) * (data[d] - data[a]) >= 0;
      c.moveTo(data[a], data[a + 1]);
      c.lineTo(data[positive ? b : d], data[(positive ? b : d) + 1]);
      c.lineTo(data[positive ? d : b], data[(positive ? d : b) + 1]); c.closePath();
    }
  }

  private circles(c: CanvasRenderingContext2D, first: number, count: number) {
    const circles = this.geometry.circles;
    for (let circle = first; circle < first + count; circle++) {
      const offset = circle * 4, x = circles[offset], y = circles[offset + 1], radius = circles[offset + 2];
      c.moveTo(x + radius, y); c.arc(x, y, radius, 0, Math.PI * 2);
    }
  }

  private paintCanvas() {
    const c = this.context;
    if (!c) return;
    const geometry = this.geometry;
    let bodyMs = 0, detailMs = 0, end = 0, lastCircle = 0;
    c.lineCap = c.lineJoin = "round";
    for (let slot = 0; slot < geometry.rootCount; slot++) {
      const index = geometry.order[slot], g = geometry.chains[index], phase = g.phase;
      const start = performance.now();
      c.save(); c.beginPath(); this.triangles(c, g.firstVertex, g.vertexCount);
      this.circles(c, g.firstCircle, g.circleCount);
      c.fillStyle = this.skin ?? "#1b0b10"; c.fill(); c.clip();
      const detailStart = performance.now(); bodyMs += detailStart - start;
      for (let layer = 0; layer < (this.detail > 1 ? 3 : 1); layer++) {
        c.beginPath();
        for (let span = 0; span < g.spans; span++) for (let joint = g.starts[span]; joint < g.ends[span]; joint++) {
          const next = joint + 1, radius = g.radius[joint], variation = Math.sin(g.arc[joint] / 43 + phase);
          const ridge = layer === 0 ? (-g.nx[joint] * 0.6 - g.ny[joint] * 0.8) * 0.3 : layer === 1 ? -0.2 + variation * 0.1 : 0.6;
          const x = g.x[joint] + g.nx[joint] * radius * ridge, y = g.y[joint] + g.ny[joint] * radius * ridge;
          c.moveTo(x, y);
          if (layer === 2 && joint % 3 === 0) c.lineTo(x - g.nx[joint] * Math.min(8, radius * 0.3), y - g.ny[joint] * Math.min(8, radius * 0.3));
          else if (variation > -0.2) c.lineTo(g.x[next] + g.nx[next] * g.radius[next] * ridge, g.y[next] + g.ny[next] * g.radius[next] * ridge);
        }
        c.strokeStyle = layer === 0 ? "rgba(154,99,103,0.22)" : layer === 1 ? "rgba(3,1,2,0.45)" : "rgba(111,66,72,0.13)";
        c.lineWidth = layer === 0 ? 1.5 : 0.65; c.stroke();
      }
      c.restore(); detailMs += performance.now() - detailStart;
      end = g.firstVertex + g.vertexCount;
      lastCircle = g.firstCircle + g.circleCount;
    }
    c.beginPath(); this.triangles(c, end, geometry.vertexCount - end);
    this.circles(c, lastCircle, geometry.circleCount - lastCircle);
    c.fillStyle = `rgb(${52 + this.darkness * 65}, ${24 + this.darkness * 30}, ${31 + this.darkness * 35})`; c.fill();
    this.timings.bodyMs = bodyMs; this.timings.detailMs = detailMs;
  }

  paint(world: PhysicsWorld, interpolation: number) {
    if (this.disposed || this.lost) return;
    const gl = this.gl, gpu = this.gpu, c = this.context;
    if (gl) gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if (c) { c.setTransform(this.density, 0, 0, this.density, 0, 0); c.clearRect(0, 0, this.width, this.height); }
    if (world.state === "IDLE") {
      this.geometry.floats = this.geometry.rootCount = this.geometry.circleCount = 0;
      this.timings.geometryMs = this.timings.bodyMs = this.timings.detailMs = 0;
      return;
    }
    const start = performance.now();
    this.geometry.build(world, interpolation, this.detail);
    this.timings.geometryMs = performance.now() - start;
    if (gl && gpu) {
      const submit = performance.now();
      gl.bindVertexArray(gpu.vao); gl.bindBuffer(gl.ARRAY_BUFFER, gpu.buffer);
      if (gpu.bytes !== this.geometry.vertices.byteLength) {
        gpu.bytes = this.geometry.vertices.byteLength; gl.bufferData(gl.ARRAY_BUFFER, gpu.bytes, gl.DYNAMIC_DRAW);
      }
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.geometry.vertices, 0, this.geometry.floats);
      gl.bindVertexArray(gpu.sphereVao); gl.bindBuffer(gl.ARRAY_BUFFER, gpu.sphereBuffer);
      if (gpu.sphereBytes !== this.geometry.circles.byteLength) {
        gpu.sphereBytes = this.geometry.circles.byteLength; gl.bufferData(gl.ARRAY_BUFFER, gpu.sphereBytes, gl.DYNAMIC_DRAW);
      }
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.geometry.circles, 0, this.geometry.circleCount * 4);
      gl.bindVertexArray(gpu.vao);
      if (gpu.field && (gpu.field.width !== this.canvas.width || gpu.field.height !== this.canvas.height)
        && !resizeField(gl, gpu.field, this.canvas.width, this.canvas.height)) {
        disposeField(gl, gpu.field); gpu.field = null;
      }
      if (gpu.field) {
        const field = gpu.field;
        gl.bindFramebuffer(gl.FRAMEBUFFER, field.framebuffer);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST); gl.disable(gl.BLEND);
        gl.useProgram(field.tissue); gl.uniform2f(field.tissueViewport, this.width, this.height);
        gl.drawArrays(gl.TRIANGLES, 0, this.geometry.vertexCount);
        gl.useProgram(field.spheres); gl.bindVertexArray(gpu.sphereVao);
        gl.uniform2f(field.sphereViewport, this.width, this.height);
        gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, this.geometry.circleCount);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.disable(gl.DEPTH_TEST); gl.enable(gl.BLEND);
        gl.useProgram(field.skin); gl.bindVertexArray(field.vao);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, field.texture);
        gl.uniform1i(field.sampler, 0); gl.uniform2f(field.skinViewport, this.width, this.height);
        gl.uniform1f(field.detail, this.detail); gl.uniform1f(field.darkness, this.darkness); gl.drawArrays(gl.TRIANGLES, 0, 3);
      } else {
        gl.enable(gl.DEPTH_TEST); gl.enable(gl.BLEND); gl.useProgram(gpu.program);
        gl.uniform2f(gpu.viewport, this.width, this.height); gl.uniform1f(gpu.detail, this.detail);
        gl.uniform1f(gpu.darkness, this.darkness);
        gl.drawArrays(gl.TRIANGLES, 0, this.geometry.vertexCount);
        gl.useProgram(gpu.sphereProgram); gl.bindVertexArray(gpu.sphereVao);
        gl.uniform2f(gpu.sphereViewport, this.width, this.height); gl.uniform1f(gpu.sphereDetail, this.detail);
        gl.uniform1f(gpu.sphereDarkness, this.darkness);
        gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, this.geometry.circleCount);
      }
      this.timings.bodyMs = performance.now() - submit; this.timings.detailMs = 0;
    } else this.paintCanvas();
  }

  inspect() {
    return { backend: this.gl ? "webgl2" : "canvas2d", passes: this.gpu?.field ? 2 : 1,
      backgroundLuminance: this.backgroundLuminance, brightness: this.darkness,
      vertices: this.geometry.vertexCount, spheres: this.geometry.circleCount,
      bufferBytes: this.geometry.vertices.byteLength + this.geometry.circles.byteLength, contextLost: this.lost };
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.canvas.removeEventListener("webglcontextlost", this.onLost);
    this.canvas.removeEventListener("webglcontextrestored", this.onRestored);
    if (this.gl && this.gpu) {
      if (this.gpu.field) disposeField(this.gl, this.gpu.field);
      this.gl.deleteProgram(this.gpu.sphereProgram); this.gl.deleteBuffer(this.gpu.sphereBuffer); this.gl.deleteVertexArray(this.gpu.sphereVao);
      this.gl.deleteProgram(this.gpu.program); this.gl.deleteBuffer(this.gpu.buffer); this.gl.deleteVertexArray(this.gpu.vao);
    }
    this.gl?.getExtension("WEBGL_lose_context")?.loseContext();
    this.geometry.floats = this.geometry.rootCount = this.geometry.circleCount = 0;
    this.gpu = null; this.skin = null;
  }
}
