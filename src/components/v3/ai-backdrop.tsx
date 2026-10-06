"use client";

import { useEffect, useRef, useState } from "react";
import { isSoftwareGL } from "@/lib/gl-support";

/**
 * /ai BACKDROP — a live background under the whole landing page, hero to the
 * closing call to action (Brad, 2026-10-06: "we need a background for it";
 * chose "live animated (code)" over the homepage film, an AI still or texture
 * alone, and "whole page" over hero only).
 *
 * WHAT IT IS. Contour lines over a slowly moving field, a topographic map of
 * data: faint white, running red where the field rises, every fifth line a
 * little brighter, quiet patches so it never reads as wallpaper. The field
 * drifts on its own and rides the scroll at about half the page's speed, so
 * it reads as depth behind the sections, not a pattern stuck to them.
 *
 * COST. One WebGL2 fragment shader on one triangle, no three.js, no image.
 * Capped at 30fps (the motion is slow), pixel count capped, started after
 * the first paint on idle, paused off screen and in a hidden tab. A CPU
 * rasteriser or no WebGL2 renders nothing (the page keeps its red light
 * pools); reduced motion draws ONE frame and stops. Decorative: aria-hidden,
 * and the text never depends on it (grey lines ~6% white, red ones ~24%).
 *
 * The canvas sits in a 100svh `sticky` box inside an `absolute inset-0`
 * layer, so it stays put while the page scrolls past and leaves with the
 * closing call to action (the contact form and footer keep plain black).
 */

const VERT = /* glsl */ `#version 300 es
in vec2 p;
void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = /* glsl */ `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uScroll;
out vec4 o;

/* Ashima/Stefan Gustavson 2D simplex noise (MIT), the standard GLSL port. */
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;
  i=mod289(i);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m=m*m;m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0;vec3 h=abs(x)-0.5;vec3 ox=floor(x+0.5);vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}
float fbm(vec2 p){
  float a=0.5,s=0.0;
  for(int i=0;i<4;i++){s+=a*snoise(p);p=p*2.02+vec2(17.1,9.2);a*=0.5;}
  return s;
}

void main(){
  // One unit = the screen's height, so the field's scale holds at any width.
  vec2 uv=gl_FragCoord.xy/uRes.y;
  vec2 p=uv*1.1;
  p.y-=uScroll*0.5;                       // rides the scroll at half the page's speed
  float t=uTime*0.03;
  // A slow domain warp keeps the contours liquid rather than marching.
  vec2 q=vec2(fbm(p+vec2(0.0,t)),fbm(p+vec2(5.2,1.3-t)));
  float f=fbm(p+0.85*q+vec2(t*0.6,-t*0.4));

  float g=f*5.5;                          // contour spacing
  float w=fwidth(g);
  float d=abs(fract(g+0.5)-0.5);          // distance to the nearest line, in levels
  float line=1.0-smoothstep(0.0,w*1.3,d);
  line*=1.0-smoothstep(0.3,0.7,w);        // where lines crowd past a pixel, let them go
  float major=1.0-step(0.5,mod(floor(g+0.5),5.0));

  float heat=smoothstep(0.05,0.5,f);      // higher ground runs red
  vec3 col=mix(vec3(1.0),vec3(0.941,0.169,0.259),heat);
  float a=line*mix(0.055,0.24,heat)*(1.0+major*1.2);
  // Quiet patches, drifting, so it never reads as wallpaper.
  a*=mix(0.18,1.0,smoothstep(-0.3,0.5,snoise(p*0.45+vec2(t*0.25,0.0))));
  o=vec4(col*a,a);
}`;

export function AiBackdrop() {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = box.current;
    const cv = canvas.current;
    if (!el || !cv) return;
    let disposed = false;
    let cleanup = () => {};

    const start = () => {
      if (disposed || isSoftwareGL()) return;
      const gl = cv.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: "low-power" });
      if (!gl) return;

      const compile = (type: number, src: string) => {
        const s = gl.createShader(type)!;
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
      };
      const prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
      gl.useProgram(prog);

      // One triangle that covers the screen.
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "p");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      const uRes = gl.getUniformLocation(prog, "uRes");
      const uTime = gl.getUniformLocation(prog, "uTime");
      const uScroll = gl.getUniformLocation(prog, "uScroll");

      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const resize = () => {
        const w = cv.clientWidth;
        const h = cv.clientHeight;
        if (!w || !h) return;
        // Up to 1.5x on fine pointers, 1x on touch, and never past ~2.4M pixels.
        let scale = Math.min(window.devicePixelRatio || 1, coarse ? 1 : 1.5);
        scale = Math.min(scale, Math.sqrt(2.4e6 / (w * h)));
        cv.width = Math.round(w * scale);
        cv.height = Math.round(h * scale);
        gl.viewport(0, 0, cv.width, cv.height);
      };
      resize();

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const t0 = performance.now();
      const draw = (now: number) => {
        gl.uniform2f(uRes, cv.width, cv.height);
        gl.uniform1f(uTime, reduced ? 40 : (now - t0) / 1000 + 40);
        gl.uniform1f(uScroll, reduced ? 0 : window.scrollY / window.innerHeight);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      };

      let raf = 0;
      let last = 0;
      let onScreen = true;
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        if (now - last < 33) return; // 30fps is plenty for motion this slow
        last = now;
        draw(now);
      };
      const run = () => {
        const want = !reduced && onScreen && document.visibilityState === "visible";
        if (want && !raf) raf = requestAnimationFrame(loop);
        if (!want && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      };

      const io = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        run();
      });
      io.observe(el);
      const ro = new ResizeObserver(() => {
        resize();
        draw(performance.now());
      });
      ro.observe(cv);
      document.addEventListener("visibilitychange", run);

      draw(performance.now()); // the first frame now, so the fade-in has something to show
      setDrawn(true);
      run();

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        document.removeEventListener("visibilitychange", run);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    };

    // After the first paint, when the browser is idle: the page never waits on it.
    const idle = window.requestIdleCallback ? window.requestIdleCallback(start, { timeout: 1200 }) : window.setTimeout(start, 300);
    return () => {
      disposed = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      cleanup();
    };
  }, []);

  return (
    <div ref={box} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <canvas
          ref={canvas}
          className={`h-full w-full transition-opacity duration-[1600ms] [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] ${drawn ? "opacity-100" : "opacity-0"}`}
        />
      </div>
    </div>
  );
}
