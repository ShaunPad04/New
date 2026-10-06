/**
 * THE AI CORE — the /ai hero's live 3D object (Brad, 2026-10-06: "try live
 * 3d in code that reacts to the mouse", black + Black Line red, after
 * utomic.framer.website).
 *
 * Loaded ONLY by dynamic import from `ai-hero.tsx`, so three.js is never in
 * the first load. Same guards as the chrome monogram: no hardware WebGL, a
 * software rasteriser or reduced motion → the caller keeps its static orb.
 *
 * WHAT IT IS. A chrome blob whose surface breathes (3D noise, displaced in
 * the vertex shader with the normals rebuilt there, so the reflections bend
 * with it), inside a slow red wireframe shell and a ring of drifting
 * particles. The environment is built in code like the monogram's studio,
 * but with red softboxes behind and to the sides, so the chrome carries the
 * accent as a rim. No HDR or model is downloaded.
 *
 * THE MOUSE. The pointer, in -1..1 across the hero, (1) turns the core toward
 * it, (2) raises a swell on the surface on the side nearest the cursor, and
 * (3) slides the red key light after it. Everything eases, so a flick of the
 * mouse reads as weight, not jitter. On touch, the core idles on its own.
 *
 * COST. It only renders while the hero is on screen and the tab is visible;
 * `setActive(false)` stops the loop outright.
 */
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Color,
  EdgesGeometry,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from "three";

const RED = new Color(0xf02b42);

/** Black room, white key strips, red rims behind — for the chrome to reflect. */
function studio(): Scene {
  const env = new Scene();
  env.background = new Color(0x000000);
  env.add(new Mesh(new SphereGeometry(50, 32, 16), new MeshBasicMaterial({ color: 0x040404, side: BackSide })));
  const strip = (w: number, h: number, pos: [number, number, number], color: Color, tilt = 0) => {
    const m = new Mesh(new PlaneGeometry(w, h), new MeshBasicMaterial({ color }));
    m.position.set(...pos);
    m.lookAt(0, 0, 0);
    m.rotateZ(tilt);
    env.add(m);
  };
  const white = (k: number) => new Color(1, 1, 1).multiplyScalar(k);
  const red = (k: number) => RED.clone().multiplyScalar(k);
  strip(3, 40, [-6, 2, 18], white(1.6), 0.4); // face-on key diagonal
  strip(1.2, 40, [5, 0, 18], white(0.9), 0.4);
  strip(40, 3, [0, 18, 2], white(1.1)); // overhead, for the crown
  strip(6, 50, [-20, 0, -4], red(2.6), 0.2); // red rims, left and right
  strip(6, 50, [20, 0, -4], red(2.2), -0.2);
  strip(30, 30, [0, 0, -22], red(0.9)); // red glow behind
  strip(30, 3, [0, -16, 4], red(0.8)); // red floor bounce
  return env;
}

/** Same check as the monogram: a CPU rasteriser reports itself in the renderer string. */
function isSoftwareGL(): boolean {
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    if (!gl) return true;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const name = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(name);
  } catch {
    return true;
  }
}

/* Ashima/Stefan Gustavson 3D simplex noise (MIT), the standard GLSL port. */
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
uniform float uTime;
uniform float uAmp;
uniform vec3 uPull;
uniform float uPullAmt;
vec3 displaceCore(vec3 p){
  vec3 n=normalize(p);
  float d=snoise(n*1.1+vec3(0.0,0.0,uTime*0.22))*uAmp
         +snoise(n*2.2-vec3(uTime*0.12))*uAmp*0.18;
  // The swell toward the pointer: strongest where the surface faces it.
  float f=max(dot(n,uPull),0.0);
  d+=pow(f,3.0)*uPullAmt;
  return p*(1.0+d);
}
`;

export type CoreHandle = {
  /** Pointer in -1..1 across the hero (x right, y up). */
  setPointer: (x: number, y: number) => void;
  /** Start or stop the render loop (off screen, hidden tab). */
  setActive: (on: boolean) => void;
  dispose: () => void;
};

export function mountCore(canvas: HTMLCanvasElement, opts: { lite?: boolean } = {}): CoreHandle | null {
  if (isSoftwareGL()) return null;
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      failIfMajorPerformanceCaveat: true,
    });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, opts.lite ? 1.5 : 1.75));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const envMap = pmrem.fromScene(studio(), 0.04).texture;
  scene.environment = envMap;

  /* ---- The core ---- */
  const uniforms = {
    uTime: { value: 0 },
    uAmp: { value: 0.11 },
    uPull: { value: new Vector3(0, 0, 1) },
    uPullAmt: { value: 0 },
  };
  const coreGeo = new IcosahedronGeometry(1.12, opts.lite ? 36 : 64);
  const coreMat = new MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 1,
    roughness: 0.14,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    envMapIntensity: 1.3,
  });
  coreMat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", `#include <common>\n${NOISE}`)
      /* Rebuild the normal from two displaced neighbours, so reflections
         follow the bumps instead of staying a sphere's. */
      .replace(
        "#include <beginnormal_vertex>",
        `vec3 nrm=normalize(position);
         vec3 tA=normalize(cross(nrm,abs(nrm.y)<0.99?vec3(0.0,1.0,0.0):vec3(1.0,0.0,0.0)));
         vec3 tB=normalize(cross(nrm,tA));
         float e=0.012;
         vec3 c0=displaceCore(position);
         vec3 c1=displaceCore(normalize(position+tA*e)*length(position));
         vec3 c2=displaceCore(normalize(position+tB*e)*length(position));
         vec3 objectNormal=normalize(cross(c1-c0,c2-c0));
         if(dot(objectNormal,nrm)<0.0) objectNormal=-objectNormal;
         #ifdef USE_TANGENT
         vec3 objectTangent=vec3(tangent.xyz);
         #endif`,
      )
      .replace("#include <begin_vertex>", "vec3 transformed=c0;");
  };
  const core = new Mesh(coreGeo, coreMat);

  /* ---- The shell: a red wireframe icosahedron, turning the other way ---- */
  const shellGeo = new EdgesGeometry(new IcosahedronGeometry(1.62, 1));
  const shellMat = new LineBasicMaterial({ color: RED, transparent: true, opacity: 0.38 });
  const shell = new LineSegments(shellGeo, shellMat);
  const shell2Geo = new EdgesGeometry(new IcosahedronGeometry(2.05, 0));
  const shell2Mat = new LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.08 });
  const shell2 = new LineSegments(shell2Geo, shell2Mat);

  /* ---- The particles: a tilted ring of drifting points ---- */
  const COUNT = opts.lite ? 500 : 1100;
  const pos = new Float32Array(COUNT * 3);
  const col = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 2.2 + Math.random() ** 2 * 1.6;
    const y = (Math.random() - 0.5) * 0.35 * (r - 1.6);
    pos.set([Math.cos(a) * r, y, Math.sin(a) * r], i * 3);
    const c = Math.random() < 0.3 ? RED : new Color(0xffffff).multiplyScalar(0.55 + Math.random() * 0.45);
    col.set([c.r, c.g, c.b], i * 3);
  }
  const dustGeo = new BufferGeometry();
  dustGeo.setAttribute("position", new BufferAttribute(pos, 3));
  dustGeo.setAttribute("color", new BufferAttribute(col, 3));
  const dustMat = new PointsMaterial({
    size: 0.022,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: AdditiveBlending,
    sizeAttenuation: true,
  });
  const dust = new Points(dustGeo, dustMat);
  const ring = new Group();
  ring.add(dust);
  ring.rotation.set(0.42, 0, -0.18);

  const rig = new Group(); // turns toward the pointer
  rig.add(core, shell, shell2, ring);
  scene.add(rig);

  const camera = new PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0, 8.2);

  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Keep the whole ring in frame on a tall phone.
    camera.position.z = w / h < 1.15 ? 8.2 / Math.min(1, w / h) ** 0.9 + 0.8 : 8.2;
    camera.updateProjectionMatrix();
  };

  /* ---- Motion ---- */
  const target = { x: 0, y: 0 };
  const eased = { x: 0, y: 0 };
  let lastMove = -1e9;
  let active = false;
  let raf = 0;
  const start = performance.now();
  const pull = new Vector3();

  const frame = (now: number) => {
    const t = (now - start) / 1000;
    // Idle drift when the pointer has been still for a while (and on touch).
    const idle = now - lastMove > 2600;
    const tx = idle ? Math.sin(t * 0.35) * 0.35 : target.x;
    const ty = idle ? Math.cos(t * 0.27) * 0.25 : target.y;
    eased.x += (tx - eased.x) * 0.06;
    eased.y += (ty - eased.y) * 0.06;

    uniforms.uTime.value = t;
    // The swell follows the pointer, in the core's own space.
    pull.set(eased.x * 1.2, eased.y * 1.2, 1).normalize();
    uniforms.uPull.value.copy(pull);
    const want = idle ? 0.06 : 0.14 + Math.min(0.08, Math.hypot(target.x, target.y) * 0.06);
    uniforms.uPullAmt.value += (want - uniforms.uPullAmt.value) * 0.05;

    rig.rotation.y = eased.x * 0.55;
    rig.rotation.x = -eased.y * 0.4;
    core.rotation.y = t * 0.12;
    shell.rotation.set(t * 0.07, -t * 0.11, 0);
    shell2.rotation.set(-t * 0.04, t * 0.05, t * 0.02);
    dust.rotation.y = t * 0.06;
    // The red key slides after the pointer: rotate the environment a touch.
    scene.environmentRotation.set(eased.y * 0.5, -eased.x * 0.9, 0);

    renderer.render(scene, camera);
    raf = active ? requestAnimationFrame(frame) : 0;
  };

  const ro = new ResizeObserver(() => {
    resize();
    if (!active) renderer.render(scene, camera);
  });
  ro.observe(canvas);
  resize();
  frame(performance.now()); // one frame now, so the canvas is never blank

  return {
    setPointer(x, y) {
      target.x = x;
      target.y = y;
      lastMove = performance.now();
    },
    setActive(on) {
      if (on === active) return;
      active = on;
      if (on && !raf) raf = requestAnimationFrame(frame);
      if (!on) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    dispose() {
      active = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      [coreGeo, shellGeo, shell2Geo, dustGeo].forEach((g) => g.dispose());
      [coreMat, shellMat, shell2Mat, dustMat].forEach((m) => m.dispose());
      envMap.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
