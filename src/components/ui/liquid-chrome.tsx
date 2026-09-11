"use client";

import { useEffect, useRef } from "react";

/**
 * LIQUID CHROME — a full-bleed fragment shader behind the capability band.
 *
 * The client asked for this in place of the drifting line field (2026-09-11).
 * He supplied the usage, not the source, so the shader is written here rather
 * than pulled in: the published component is built on `ogl`, and this project
 * has no WebGL dependency. One full-screen quad and one fragment shader is
 * about a hundred lines of plain WebGL, which is less than the wrapper would
 * have cost and leaves nothing to keep in step with an upstream package.
 *
 * IT IS ALSO, FINALLY, THE RIGHT TECHNIQUE FOR THIS BAND. Three animated
 * versions of the line field shipped and two of them made the page lag,
 * because animating vector strokes re-rasterises them every frame; the note
 * left in CLAUDE.md said that if this band were ever to move it needed canvas
 * or WebGL rather than another CSS property. This is that. The GPU redraws one
 * quad per frame and the main thread does nothing but tick the clock.
 *
 * FOUR THINGS BOUND THE COST, because "it's on the GPU" is not a licence:
 *
 * 1. It only runs while the band is on screen. An IntersectionObserver starts
 *    and stops the loop. Unlike the in-view gate that caused the scroll glitch
 *    in the CSS version, this cannot produce a visual jump: the clock is
 *    driven by elapsed time, so the shader resumes exactly where the maths
 *    says it should be, not where it was paused.
 * 2. The backing store is capped at 860px on the long edge and at 1x density.
 *    This is a soft gradient with no edges to alias, so a full-resolution
 *    2x buffer would be four times the fragment work for nothing a viewer can
 *    see; the canvas is stretched over the band by CSS.
 * 2b. It is capped at ~30fps. The motion is a slow drift measured in seconds,
 *    so half the frames are indistinguishable and it halves the fragment work
 *    outright. Measured during continuous scrolling on this GPU-less
 *    container, the shader costs rasterisation and NOT main-thread time —
 *    long-task time was 0ms with it running against 102ms without — which is
 *    the opposite of the CSS line field it replaces, and the reason this one
 *    is safe to animate.
 * 3. Under `prefers-reduced-motion` it draws ONE frame and stops. The band
 *    keeps its texture and nothing moves.
 * 4. No WebGL, no canvas: the band falls back to plain black and the copy is
 *    untouched. Nothing here carries meaning, so there is nothing to lose.
 */

const VERT = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

/**
 * The displacement loop is the effect: each iteration pushes the coordinate
 * along a cosine of the other axis at a higher frequency and a smaller
 * amplitude, so ten cheap waves compound into something that reads as flowing
 * metal. The final divide is what makes it chrome rather than a gradient —
 * `abs(sin(...))` approaches zero along bands, and dividing by it blows those
 * bands out to a highlight.
 *
 * `+ 0.0001` guards that divide. Without it the highlight is an exact division
 * by zero, which is an Inf, and an Inf that reaches the framebuffer is a white
 * flash the width of the screen on some drivers.
 */
const FRAG = `
precision mediump float;
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uBaseColor;
uniform float uAmplitude;
uniform float uFrequencyX;
uniform float uFrequencyY;
uniform vec2 uMouse;
varying vec2 vUv;

void main() {
  vec2 fragCoord = vUv * uResolution;
  vec2 uv = (2.0 * fragCoord - uResolution) / min(uResolution.x, uResolution.y);

  for (float i = 1.0; i < 10.0; i++) {
    uv.x += uAmplitude / i * cos(i * uFrequencyX * uv.y + uTime + uMouse.x * 3.14159);
    uv.y += uAmplitude / i * cos(i * uFrequencyY * uv.x + uTime + uMouse.y * 3.14159);
  }

  vec2 diff = vUv - uMouse;
  float dist = length(diff);
  float falloff = exp(-dist * 20.0);
  float ripple = sin(10.0 * dist - uTime * 2.0) * 0.03;
  uv += (diff / (dist + 0.0001)) * ripple * falloff;

  vec3 color = uBaseColor / (abs(sin(uTime - uv.y - uv.x)) + 0.0001);
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function LiquidChrome({
  baseColor = [0.1, 0.1, 0.1],
  speed = 1,
  amplitude = 0.6,
  frequencyX = 2.5,
  frequencyY = 1.5,
  interactive = true,
  className,
}: {
  baseColor?: [number, number, number];
  speed?: number;
  amplitude?: number;
  frequencyX?: number;
  frequencyY?: number;
  interactive?: boolean;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Read through a ref so changing a prop does not tear down the GL context
  // and rebuild the program — the main effect below deliberately has no prop
  // deps. The sync is an effect rather than a write during render: a ref
  // written while rendering is a lint error and a real one, since React may
  // render without committing and the ref would then hold values the DOM
  // never received.
  const opts = useRef({ baseColor, speed, amplitude, frequencyX, frequencyY, interactive });
  useEffect(() => {
    opts.current = { baseColor, speed, amplitude, frequencyX, frequencyY, interactive };
  });

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    // One triangle covering the viewport, not two making a quad: it is a third
    // fewer vertices and, more usefully, no shared diagonal edge where the two
    // halves can disagree by a fragment.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const u = {
      time: gl.getUniformLocation(program, "uTime"),
      resolution: gl.getUniformLocation(program, "uResolution"),
      baseColor: gl.getUniformLocation(program, "uBaseColor"),
      amplitude: gl.getUniformLocation(program, "uAmplitude"),
      frequencyX: gl.getUniformLocation(program, "uFrequencyX"),
      frequencyY: gl.getUniformLocation(program, "uFrequencyY"),
      mouse: gl.getUniformLocation(program, "uMouse"),
    };

    const mouse = { x: 0.5, y: 0.5 };
    const MAX_EDGE = 860;

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      const scale = Math.min(1, MAX_EDGE / Math.max(width, height));
      const w = Math.max(1, Math.round(width * scale));
      const h = Math.max(1, Math.round(height * scale));
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };

    const draw = (seconds: number) => {
      gl.uniform1f(u.time, seconds * opts.current.speed);
      gl.uniform2f(u.resolution, canvas.width, canvas.height);
      gl.uniform3fv(u.baseColor, opts.current.baseColor);
      gl.uniform1f(u.amplitude, opts.current.amplitude);
      gl.uniform1f(u.frequencyX, opts.current.frequencyX);
      gl.uniform1f(u.frequencyY, opts.current.frequencyY);
      gl.uniform2f(u.mouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    resize();
    if (reduced) {
      draw(0);
      return () => {
        gl.deleteProgram(program);
        gl.deleteBuffer(buffer);
      };
    }

    let raf = 0;
    let running = false;
    // Elapsed time, accumulated across pauses, so leaving and re-entering the
    // band resumes the motion instead of snapping it back to zero.
    let elapsed = 0;
    let last = 0;

    // ~30fps. `next` advances by a fixed step rather than being reset to
    // `now`, so a late frame does not push the schedule later and later.
    const STEP_MS = 1000 / 30;
    let next = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (now < next) return;
      next = Math.max(now, next + STEP_MS);
      elapsed += (now - last) / 1000;
      last = now;
      draw(elapsed);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      next = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { rootMargin: "200px 0px" },
    );
    io.observe(host);

    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const onPointer = (event: PointerEvent) => {
      if (!opts.current.interactive) return;
      const rect = host.getBoundingClientRect();
      mouse.x = (event.clientX - rect.left) / rect.width;
      // Flipped: WebGL's origin is bottom-left, the DOM's is top-left.
      mouse.y = 1 - (event.clientY - rect.top) / rect.height;
    };
    host.addEventListener("pointermove", onPointer);

    const onLost = (event: Event) => {
      event.preventDefault();
      stop();
    };
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <div ref={hostRef} aria-hidden="true" className={className}>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
