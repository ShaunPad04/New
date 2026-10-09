/**
 * S & L Jewellers — interactive 3D mark.
 *
 *   import { mount } from './sl-mark.js';
 *   const mark = mount(document.querySelector('#hero-mark'), { ... });
 *
 * Returns { start, stop, destroy, ready, supported, canvas, setRotation }.
 *
 * The geometry, the creased-normal pass, the materials and every motion
 * constant are unchanged from the approved build. Everything in this file is
 * integration: lifecycle, render gating, pointer scoping and disposal.
 */

import * as THREE from 'three';
import SHAPES from './sl-mark-geometry.js';

/** Rotation the poster PNG was rendered at. Pass as initialRotation so the
 *  cross-fade from poster to canvas has nothing to jump between. */
export const POSTER_ROTATION = { x: 0, y: -0.26 };

const DEFAULTS = {
  initialRotation: { x: 0, y: 0 },
  /** CSS selector for elements that must not start a drag (an overlaid CTA). */
  ignore: null,
  /** Auto-pause when the tab is hidden / the element leaves the viewport. */
  autoPause: true,
  /** Fraction of the element that must be visible to keep rendering. */
  intersectionThreshold: 0.01,
  /** Slow idle turn once the pointer has been away for a while. */
  idleSpin: true,
  /** Max device pixel ratio. Second value applies below `mobileBreakpoint`. */
  maxPixelRatio: 2,
  mobilePixelRatio: 1.5,
  /** Extrusion detail. 20/5 is the desktop look; a phone cannot show the
   *  difference and the geometry build is the single longest task on load. */
  curveSegments: 20,
  bevelSegments: 5,
  /** Frame cap for the *idle* turn only, 0 = every display frame. 30 halves the
   *  per-frame cost while the mark is just turning; a drag, a burst or a change
   *  of scrub position lifts the cap for the next 400 ms so anything the visitor
   *  is driving renders at the full display rate. */
  idleFps: 0,
  /** CSS touch-action on the canvas. 'none' lets a finger drag the mark in any
   *  direction; 'pan-y' hands vertical swipes to the page (the visitor can
   *  scroll straight through a full-screen stage) and keeps horizontal ones. */
  touchAction: 'none',

  /* --- the burst -------------------------------------------------- *
   * The mark comes apart into the sixteen paths it is drawn from, turns
   * loose for a beat, and is set back. A jeweller's mark performing the
   * thing the shop does, rather than a generic explosion.
   *
   * Off by default: this is the site's one signature moment and the hero
   * decides when it happens, not this module.
   * ----------------------------------------------------------------- */
  burst: false,
  /** How far a piece travels, in mark-widths. Portrait gets its own, or
   *  the pieces leave the top and bottom of a phone's frame entirely. */
  burstRadius: 0.5,
  burstRadiusPortrait: 0.3,
  /** Radians a piece turns at full separation. */
  burstSpin: 2.1,
  /** Seconds. Out on expo.out, loose, then set back on a back-out tail
   *  that carries ~2% past home before it settles. */
  burstOut: 0.9,
  burstHold: 0.5,
  burstIn: 1.1,
  /** Seconds the leading piece starts before the trailing one. Deliberately
   *  short: 16 pieces on the house 60-80ms stagger would take over a second
   *  to leave and read as a queue emptying rather than one gesture. */
  burstStagger: 0.28,
  /** ms after the first frame before it plays itself. 0 never does. */
  burstAuto: 1400,
  /** ms between repeats. 0 plays once and then only on tap. */
  burstInterval: 0,
  mobileBreakpoint: 720,
  /** Fires once, after the first frame has actually been rendered. */
  onFirstFrame: null,
  /** Called instead of mounting if WebGL is unavailable. */
  onUnsupported: null,
  /** Called on the first pointer interaction (use it to fade out a hint). */
  onInteract: null,
  /** Distance of the camera. Scaled up slightly on very small elements. */
  cameraZ: 2.35,
  /** Horizontal placement of the mark, as a fraction of the visible width:
   *  0 is centred, 0.5 is the right edge. A full-bleed hero needs the mark
   *  off-centre so overlaid copy has clear ground, and moving the object is
   *  the only way to do that while the canvas still fills the frame and stays
   *  draggable edge to edge. Recomputed on resize, so it holds at any width. */
  offsetX: 0,
  /** How far to darken the extruded side walls relative to the polished
   *  front faces, 0 to 1. Every surface currently takes the light equally, so
   *  as the mark turns the interlaced ribbons flatten into each other and the
   *  eye cannot tell which one is in front. Real jewellery reads the other
   *  way: the face takes the light, the recessed sides sit in shadow. */
  sideDarken: 0,
  /** Extra roughness on those same walls. Polished faces stay mirror-like. */
  sideRough: 0,
  /** Where the hover parallax starts and stops responding, as a distance
   *  from the mark's centre in element heights. Inside `parallaxNear` it is
   *  at full strength, past `parallaxFar` it is off, and between the two it
   *  eases out. Without this a full-bleed canvas tilts the mark just as hard
   *  from the far corner of the screen as from right on top of it. */
  parallaxNear: 0.32,
  parallaxFar: 0.95,
  /** Camera distance on a portrait frame, where the mark is fitted by width
   *  rather than height. Defaults to cameraZ so landscape is untouched. */
  cameraZPortrait: null,
  /** Fit by width below this aspect (width / height): the camera backs off in
   *  proportion, so the mark keeps the same share of the frame's width on
   *  every narrow screen (a 390 x 844 phone and a 360 x 780 one alike) instead
   *  of overflowing the narrower ones. null keeps the fixed distances above. */
  fitAspect: null,
  /** Vertical placement on a portrait frame, same units as offsetY. */
  offsetYPortrait: 0,
  /** Vertical placement, same units as offsetX: positive lifts the mark.
   *  A reflection needs floor space under the object, so a mark centred in
   *  the frame has to rise to make room for one. */
  offsetY: 0,
  /** Brightness of the line where the mark meets its reflection, 0 for none.
   *  The mirror implies a surface but nothing marks it, so the mark reads as
   *  hovering rather than standing. A horizon is what settles it. */
  horizon: 0,
  /** Opacity of the mirrored copy under the mark, 0 to switch it off. A gold
   *  object floating in a void reads as a render; the reflection is what makes
   *  it read as an object standing on something. */
  reflection: 0,
  /** Gap between the mark and the surface it stands on, in mark heights. */
  reflectionGap: 0.035,
  /** Distance over which the reflection fades out, in mark heights. */
  reflectionFade: 0.55,
  /** Peak opacity of the haze lying on the floor, 0 for none. Needs
   *  `reflection`, because the floor it lies on is the one the reflection
   *  implies - there is no floor geometry to put it on otherwise.
   *  It is what turns the ground from an edge into a room: the reflection
   *  ends in a hard line without it. Keep it low; this is air catching the
   *  light off the mark, not a smoke machine. */
  fog: 0,
  /** How fast the haze drifts, in texture widths per second. Slow enough
   *  that it reads as air moving rather than as something scrolling. */
  fogSpeed: 0.012,
  /** How many points of light sit behind the mark. 0 for none.
   *  They live in the same scene as the mark, so they share its camera, its
   *  pause rules and its one animation loop - a second canvas would need its
   *  own of all three. */
  stars: 0,
  /** Peak brightness of a star, before its own twinkle scales it down. */
  starOpacity: 0.85,
  /** Field radius as a multiple of the frustum's half-diagonal at each
   *  star's depth. 1 exactly fills the frame; a little over covers the edges
   *  as the field turns and leans. */
  starSpread: 1.12,
  /** Extra yaw, in radians, applied across one full scroll-out of the host
   *  element. Additive: it never touches the rotation the visitor dragged to,
   *  so scrolling back up returns the mark exactly where they left it. */
  scrollYaw: 0,
  /** How far the mark recedes over the same distance, as a fraction. */
  scrollScale: 0,
  /** Max yaw either side of front, radians. The mark is a flat relief, not a
   *  solid: past ~0.7 the diamond outline collapses and the script becomes
   *  unreadable, and near a right angle it reads as loose fragments. The idle
   *  turn reverses here rather than stopping. */
  /** Max yaw either side of front, radians. Infinity lets it turn freely -
   *  which only looks right because the relief below is deep enough to read
   *  as a solid from the side. Shallow it back and this needs a limit again. */
  maxYaw: Infinity,
  /** Speed of the idle turn, in radians per second. It has become a thing
   *  worth tuning rather than a constant buried in the frame loop. */
  idleSpeed: 0.16,
  /** How far the *idle* turn may drift from front-on, in radians. Dragging
   *  ignores this entirely - it is only what the mark does when left alone.
   *  Infinity gives a continuous turn, which also means the wordmark spends
   *  part of every cycle mirrored. */
  idleYaw: Infinity,
  /** Extrusion depth of each colour, in the same units as the 1.0-tall mark.
   *  The original 0.072 is a 7% relief - it reads beautifully face-on but has
   *  no body to show side-on, which is why a free spin falls apart. Deepen
   *  both together or the script detaches from the letters. */
  goldDepth: 0.072,
  whiteDepth: 0.034,
  /** Scroll-scrubbed disassembly. As the host scrolls out (scrollOut 0..1)
   *  the pieces come apart to this fraction of burstRadius, centre-out with
   *  the same stagger as the timed burst, and seat themselves again on the
   *  way back up. 0 disables it. Added for the Next.js rebuild so the mark
   *  answers the scroll wheel, not just the clock. */
  scrollBurst: 0,
  /** Scroll-scrubbed journey. When true, setScrub(p) with p in 0..1 drives the
   *  mark: it turns `scrubTurns` full revolutions across the journey, comes
   *  apart between scrubOut[0] and scrubOut[1], holds, and seats itself again
   *  between scrubIn[0] and scrubIn[1]. Additive to drag and the idle turn. */
  scrub: false,
  scrubTurns: 2,
  scrubOut: [0.18, 0.34],
  scrubIn: [0.48, 0.68],
  /** Horizontal drift (fraction of frame width) applied as the scrub settles,
   *  so the copy landing on the left has clear ground. Landscape only. */
  scrubShiftX: 0,
  /** Portrait frames instead lift the mark upward by this fraction of the frame height over the same range,
   *  so the settle caption never sits on top of it. */
  scrubShiftYPortrait: 0,
  /** How much the mark shrinks (fraction of its size) over the same settle, portrait only. */
  scrubShrinkPortrait: 0.16,
  /** Easing rate (per second) between the scroll position and the scrub turn.
   *  0 = the turn tracks the scroll exactly, which is right wherever the page
   *  itself is not smoothed (phones, native scroll); 7.5 is a ~130 ms trail
   *  that reads as weight under a smoothed desktop wheel. */
  scrubEase: 7.5,
};

const noop = () => {};

/* Fraction of drag velocity surviving one second. The original 0.94 per frame
 * is 0.024/s at 60Hz; this is slower, so the mark keeps coasting after the
 * hand leaves it, which is what reads as weight rather than as a switch. */
const GLIDE_PER_SECOND = 0.024;

/* --- three.js version compatibility ---------------------------------- *
 * The approved look was tuned on r128. Two later changes alter how those
 * exact values land, so the module compensates rather than the artist
 * re-tuning per release:
 *   r152  ColorManagement on by default — a hex colour is treated as sRGB
 *         and converted to linear, which darkens and saturates it.
 *   r155  the legacy PI multiplier on light intensity was dropped, so every
 *         light became ~3.14x dimmer for the same `intensity`.
 * Setting colours as already-linear reproduces r128 without touching the
 * global ColorManagement flag, which would affect the rest of the page.
 * ---------------------------------------------------------------------- */
const REV = parseInt(THREE.REVISION, 10) || 0;
const LIGHT_SCALE = REV >= 155 ? Math.PI : 1;
const LINEAR = THREE.LinearSRGBColorSpace;

function setLinearHex(color, hex) {
  // LinearSRGBColorSpace only exists from r152, which is exactly when the
  // conversion we are opting out of was introduced.
  if (LINEAR !== undefined) color.setHex(hex, LINEAR);
  else color.setHex(hex);
  return color;
}

/* Object-space |normal.z|: 1 on the flat front and back faces, 0 on the
 * extruded walls, sweeping between the two across the bevel. Object space, not
 * view space, so a wall stays a wall whichever way the mark is turned. */
function injectSideShading(shader, darken, rough) {
  if (!darken && !rough) return;
  shader.uniforms.uSideDarken = { value: darken };
  shader.uniforms.uSideRough = { value: rough };
  shader.vertexShader = `varying float vFaceZ;
${shader.vertexShader.replace(
  '#include <beginnormal_vertex>',
  `#include <beginnormal_vertex>
  vFaceZ = abs(objectNormal.z);`
)}`;
  shader.fragmentShader = `uniform float uSideDarken;
uniform float uSideRough;
varying float vFaceZ;
${shader.fragmentShader
  .replace(
    '#include <color_fragment>',
    `#include <color_fragment>
  float slFace = smoothstep(0.10, 0.62, vFaceZ);
  diffuseColor.rgb *= mix(1.0 - uSideDarken, 1.0, slFace);`
  )
  .replace(
    '#include <roughnessmap_fragment>',
    `#include <roughnessmap_fragment>
  roughnessFactor = mix(min(roughnessFactor + uSideRough, 1.0), roughnessFactor, smoothstep(0.10, 0.62, vFaceZ));`
  )}`;
}

function inertHandle(reason) {
  return {
    supported: false,
    reason,
    canvas: null,
    ready: Promise.resolve(false),
    start: noop,
    stop: noop,
    destroy: noop,
    setRotation: noop,
    setScrollProgress: noop,
    getRotation: () => ({ x: 0, y: 0, tiltX: 0, tiltY: 0, scrollOut: 0, dragging: false }),
  };
}

/* ------------------------------------------------------------------ *
 * Environment — drawn here, so the page fetches no image for it.
 * ------------------------------------------------------------------ */

function buildEnvTexture() {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 512;
  const g = c.getContext('2d');

  const base = g.createLinearGradient(0, 0, 0, 512);
  base.addColorStop(0.0, '#2a2620');
  base.addColorStop(0.42, '#14120e');
  base.addColorStop(0.7, '#0a0908');
  base.addColorStop(1.0, '#191410');
  g.fillStyle = base;
  g.fillRect(0, 0, 1024, 512);

  const card = (x, y, w, h, inner, alpha) => {
    const rg = g.createRadialGradient(x, y, 0, x, y, Math.max(w, h));
    rg.addColorStop(0, `rgba(${inner},${alpha})`);
    rg.addColorStop(1, `rgba(${inner},0)`);
    g.fillStyle = rg;
    g.beginPath();
    g.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
    g.fill();
  };
  card(300, 110, 320, 160, '255,248,230', 1.0);   // key, upper left
  card(760, 150, 230, 130, '255,236,205', 0.62);  // fill, upper right
  card(520, 470, 440, 150, '186,146,92', 0.52);   // warm bounce from below
  card(60, 300, 150, 200, '120,140,170', 0.22);   // cool edge, for separation

  // Two long softbox strips. A polished flat face reflects these as a travelling
  // band of light as the piece turns, which is what reads as "gold" rather than
  // "yellow plastic" once the caps are perfectly flat.
  const strip = (x, y, w, h, inner, alpha, blur) => {
    g.save();
    g.filter = `blur(${blur}px)`;
    const lg = g.createLinearGradient(x - w, 0, x + w, 0);
    lg.addColorStop(0, `rgba(${inner},0)`);
    lg.addColorStop(0.5, `rgba(${inner},${alpha})`);
    lg.addColorStop(1, `rgba(${inner},0)`);
    g.fillStyle = lg;
    g.beginPath();
    g.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
    g.fill();
    g.restore();
  };
  strip(430, 96, 400, 26, '255,252,244', 0.95, 10);
  strip(690, 206, 260, 14, '255,240,214', 0.7, 8);

  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  // r152+ renamed encoding -> colorSpace. Set whichever this build understands.
  if ('colorSpace' in tex) tex.colorSpace = THREE.SRGBColorSpace;
  else tex.encoding = THREE.sRGBEncoding;
  return tex;
}

/* ------------------------------------------------------------------ *
 * Creased normals. Unchanged.
 * ------------------------------------------------------------------ */

function creaseNormals(geo, angleDeg) {
  const pos = geo.attributes.position.array;
  const triCount = pos.length / 9;
  const fn = new Float32Array(triCount * 3);
  let i, f;

  for (f = 0; f < triCount; f++) {
    const o = f * 9;
    const ax = pos[o], ay = pos[o + 1], az = pos[o + 2];
    const bx = pos[o + 3], by = pos[o + 4], bz = pos[o + 5];
    const cx = pos[o + 6], cy = pos[o + 7], cz = pos[o + 8];
    const e1x = bx - ax, e1y = by - ay, e1z = bz - az;
    const e2x = cx - ax, e2y = cy - ay, e2z = cz - az;
    const nx = e1y * e2z - e1z * e2y;
    const ny = e1z * e2x - e1x * e2z;
    const nz = e1x * e2y - e1y * e2x;
    const L = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
    fn[f * 3] = nx / L; fn[f * 3 + 1] = ny / L; fn[f * 3 + 2] = nz / L;
  }

  const map = new Map();
  for (f = 0; f < triCount; f++) {
    for (let v = 0; v < 3; v++) {
      const o = f * 9 + v * 3;
      const k =
        Math.round(pos[o] * 8192) + '|' +
        Math.round(pos[o + 1] * 8192) + '|' +
        Math.round(pos[o + 2] * 8192);
      let arr = map.get(k);
      if (!arr) { arr = []; map.set(k, arr); }
      arr.push(f * 3 + v);
    }
  }

  const cosT = Math.cos((angleDeg * Math.PI) / 180);
  // The flat front/back caps are a hard surface: they must never borrow normals
  // from the first bevel strip, which sits only a few degrees off them. Letting
  // that happen tilts the cap's rim normals and smears the triangulation across
  // the whole face as large shaded facets.
  const cap = new Uint8Array(triCount);
  for (f = 0; f < triCount; f++) cap[f] = Math.abs(fn[f * 3 + 2]) > 0.999 ? 1 : 0;

  const out = new Float32Array(pos.length);
  map.forEach((list) => {
    for (i = 0; i < list.length; i++) {
      const vi = list[i], fi = (vi / 3) | 0;
      if (cap[fi]) {
        out[vi * 3] = 0; out[vi * 3 + 1] = 0;
        out[vi * 3 + 2] = fn[fi * 3 + 2] > 0 ? 1 : -1;
        continue;
      }
      let sx = 0, sy = 0, sz = 0;
      for (let j = 0; j < list.length; j++) {
        const fj = (list[j] / 3) | 0;
        if (cap[fj]) continue;
        const d =
          fn[fi * 3] * fn[fj * 3] +
          fn[fi * 3 + 1] * fn[fj * 3 + 1] +
          fn[fi * 3 + 2] * fn[fj * 3 + 2];
        if (d >= cosT) { sx += fn[fj * 3]; sy += fn[fj * 3 + 1]; sz += fn[fj * 3 + 2]; }
      }
      const L = Math.sqrt(sx * sx + sy * sy + sz * sz) || 1;
      out[vi * 3] = sx / L; out[vi * 3 + 1] = sy / L; out[vi * 3 + 2] = sz / L;
    }
  });

  geo.setAttribute('normal', new THREE.BufferAttribute(out, 3));
}

/* ------------------------------------------------------------------ *
 * Shapes
 * ------------------------------------------------------------------ */

function applyRing(r, target) {
  target.moveTo(r.m[0], r.m[1]);
  for (let i = 0; i < r.s.length; i++) {
    const c = r.s[i];
    if (c[0] === 'L') target.lineTo(c[1], c[2]);
    else target.bezierCurveTo(c[1], c[2], c[3], c[4], c[5], c[6]);
  }
  target.closePath();
}

function toShapes(group) {
  return group.map((sp) => {
    const sh = new THREE.Shape();
    applyRing(sp.shell, sh);
    sp.holes.forEach((h) => {
      const pa = new THREE.Path();
      applyRing(h, pa);
      sh.holes.push(pa);
    });
    return sh;
  });
}

/* One mesh per subpath rather than one merged mesh per material.
 *
 * The mark is drawn from sixteen separate closed paths - a crown, the
 * interlaced ribbons of the diamond, and the script wordmark along the
 * bottom - and merging them into two geometries threw that structure away.
 * Kept apart, each is a piece that can leave and be set back, which is what
 * makes a disassembly possible instead of a shatter.
 *
 * Each geometry is re-centred on its own bounding box and the offset moved
 * to the mesh, so a piece turns about itself instead of swinging around the
 * mark's origin on a long arm. Sixteen draws where there were two; the
 * fragment cost, which is what actually matters here, is unchanged.
 */
function buildPieces(group, depth, bevel, mat, detail = {}) {
  return group.map((sp) => {
    const geo = new THREE.ExtrudeGeometry(toShapes([sp]), {
      depth,
      curveSegments: detail.curveSegments ?? 20,
      steps: 1,
      bevelEnabled: true,
      bevelThickness: bevel * 1.15,
      bevelSize: bevel,
      bevelOffset: 0,
      bevelSegments: detail.bevelSegments ?? 5,
    });
    geo.translate(0, 0, -depth / 2);
    creaseNormals(geo, 34);
    geo.computeBoundingBox();
    const c = new THREE.Vector3();
    geo.boundingBox.getCenter(c);
    geo.translate(-c.x, -c.y, -c.z);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(c);
    return mesh;
  });
}

/* ------------------------------------------------------------------ *
 * mount
 * ------------------------------------------------------------------ */

export function mount(el, options = {}) {
  if (!el) throw new Error('sl-mark: mount() needs an element');
  const opts = { ...DEFAULTS, ...options };
  if (opts.cameraZPortrait == null) opts.cameraZPortrait = opts.cameraZ;
  const marks = typeof performance !== 'undefined' && performance.mark
    ? (n) => performance.mark(n)
    : noop;

  const reduce =
    typeof matchMedia === 'function' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- renderer ---------------------------------------------------- */
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
  } catch (e) {
    opts.onUnsupported?.(e);
    return inertHandle('webgl-throw');
  }
  if (!renderer || !renderer.getContext()) {
    opts.onUnsupported?.(new Error('no webgl context'));
    return inertHandle('webgl-missing');
  }

  // r152+ renamed outputEncoding -> outputColorSpace.
  if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
  else renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.setClearColor(0x000000, 0);

  const canvas = renderer.domElement;
  canvas.style.display = 'block';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.touchAction = opts.touchAction;
  el.insertBefore(canvas, el.firstChild);

  /* --- scene ------------------------------------------------------- */
  marks('sl-mark:build-start');
  const t0 = performance.now();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, opts.cameraZ);

  const envTex = buildEnvTexture();
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const envRT = pmrem.fromEquirectangular(envTex);
  scene.environment = envRT.texture;
  pmrem.dispose();
  envTex.dispose();
  const tEnv = performance.now();

  const dirLight = (hex, intensity, x, y, z) => {
    const l = new THREE.DirectionalLight(0xffffff, intensity * LIGHT_SCALE);
    setLinearHex(l.color, hex);
    l.position.set(x, y, z);              // Object3D.position is read-only; set in place
    return l;
  };
  const ambient = new THREE.AmbientLight(0xffffff, 1.0 * LIGHT_SCALE);
  setLinearHex(ambient.color, 0x352f26);
  const lights = [
    dirLight(0xfff2d8, 1.7, -2.2, 2.6, 3.0),
    dirLight(0xffd79a, 0.85, 2.8, 1.2, -2.2),
    dirLight(0xffe6bd, 0.42, 0.4, -1.6, 2.4),
    ambient,
  ];
  lights.forEach((l) => scene.add(l));

  /* The matte look was mostly one value: clearcoatRoughness 0.3 lays a hazy
     varnish over the whole surface, which is what reads as waxy rather than
     polished. Dropping it, and the base roughness with it, gives the specular
     somewhere to land - which is how real gold jewellery actually behaves. */
  const goldMat = new THREE.MeshPhysicalMaterial({
    metalness: 1.0, roughness: 0.12,
    envMapIntensity: 1.95, clearcoat: 0.45, clearcoatRoughness: 0.06,
  });
  // 0xcba748 sat olive - closer to antique brass than to a polished chain.
  setLinearHex(goldMat.color, 0xd8b24b);
  const platMat = new THREE.MeshPhysicalMaterial({
    metalness: 0.98, roughness: 0.09, envMapIntensity: 1.8,
  });
  // 0xf0ede6 was warm enough to read as cream, which made the script look like
  // tarnished silver next to the gold. Neutral-cool separates the two metals.
  setLinearHex(platMat.color, 0xeceef3);

  if (opts.sideDarken || opts.sideRough) {
    for (const m of [goldMat, platMat]) {
      m.onBeforeCompile = (shader) =>
        injectSideShading(shader, opts.sideDarken, opts.sideRough);
      m.customProgramCacheKey = () => 'sl-mark-sides';
    }
  }

  const mark = new THREE.Group();
  const meshes = [];
  [
    ...buildPieces(SHAPES.gold, opts.goldDepth, SHAPES.bevel.gold, goldMat, opts),
    ...buildPieces(SHAPES.white, opts.whiteDepth, SHAPES.bevel.white, platMat, opts),
  ].forEach((m) => { mark.add(m); meshes.push(m); });

  /* --- burst state --------------------------------------------------- *
   * Direction, spin and delay are derived from each piece's own position,
   * not Math.random, so the mark comes apart the same way every time. It
   * is art direction, not confetti - and it means what the client signs
   * off is what every visitor sees.
   * -------------------------------------------------------------------- */
  const pieces = meshes.map((mesh, i) => {
    const home = mesh.position.clone();
    const dir = new THREE.Vector3(home.x, home.y, 0);
    // A piece sitting on the axis has no outward direction of its own.
    if (dir.lengthSq() < 1e-6) dir.set(Math.cos(i * 2.399), Math.sin(i * 2.399), 0);
    dir.normalize();
    // Out of plane as well, alternating, so it separates in depth and reads
    // as a solid object coming apart rather than a flat badge peeling.
    dir.z = ((i % 3) - 1) * 0.55;
    dir.normalize();
    const axis = new THREE.Vector3(
      Math.sin(i * 1.7) * 0.6, Math.cos(i * 2.3), Math.sin(i * 0.9) * 0.5,
    ).normalize();
    return { mesh, home, dir, axis, reach: 0.75 + ((i * 7) % 5) * 0.11, last: -1 };
  });
  // Centre-out, so the break travels from the core of the diamond rather
  // than every piece leaving at once.
  {
    let far = 1e-6;
    pieces.forEach((p) => { far = Math.max(far, Math.hypot(p.home.x, p.home.y)); });
    pieces.forEach((p) => { p.delay = (Math.hypot(p.home.x, p.home.y) / far) * opts.burstStagger; });
  }

  const easeExpoOut = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
  /* easeOutBack with the standard 1.70158 overshoots about 10%. Scaled to
     0.2 it carries ~2% past home - a piece being seated, not bouncing. */
  const easeBackOut = (x) => {
    const c = 1.70158 * 0.2;
    return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
  };

  let burstT = -1;                       // <0 idle; otherwise seconds elapsed
  let burstNext = 0;                     // ms timestamp of the next auto play
  let burstMoving = false;               // something is off its home this frame
  let burstSettling = false;             // one more mirror sync to land it
  const burstSpan = () => opts.burstOut + opts.burstHold + opts.burstIn + opts.burstStagger;

  function pieceAmount(p) {
    const t = burstT - p.delay;
    if (t <= 0) return 0;
    if (t < opts.burstOut) return easeExpoOut(t / opts.burstOut);
    if (t < opts.burstOut + opts.burstHold) return 1;
    const u = (t - opts.burstOut - opts.burstHold) / opts.burstIn;
    if (u >= 1) return 0;
    return 1 - easeBackOut(u);
  }

  function applyBurst() {
    const portrait = canvas.clientHeight > canvas.clientWidth;
    const radius = portrait ? opts.burstRadiusPortrait : opts.burstRadius;
    let moving = false;
    const sb = opts.scrollBurst;
    for (let i = 0; i < pieces.length; i++) {
      const p = pieces[i];
      let a = burstT < 0 ? 0 : pieceAmount(p);
      if (opts.scrub) {
        // Centre-out stagger, same order as the timed burst, across the scrub.
        const lead = (p.delay / Math.max(opts.burstStagger, 1e-6)) * 0.05;
        const up = smooth((scrubP - opts.scrubOut[0] - lead) / (opts.scrubOut[1] - opts.scrubOut[0]));
        const down = smooth((scrubP - opts.scrubIn[0] - lead) / (opts.scrubIn[1] - opts.scrubIn[0]));
        const sa = up * (1 - down);
        if (sa > a) a = sa;
      } else if (sb > 0 && scrollOut > 0) {
        // Same centre-out order as the timed burst, spread over the first
        // ~70% of the scroll-out so the mark is fully apart before it leaves.
        const lead = (p.delay / Math.max(opts.burstStagger, 1e-6)) * 0.18;
        const u = Math.min(1, Math.max(0, (scrollOut - 0.04 - lead) / 0.6));
        const sa = u * u * (3 - 2 * u) * sb;
        if (sa > a) a = sa;
      }
      if (a !== 0) moving = true;
      if (a === p.last) continue;        // nothing to write for a still piece
      p.last = a;
      p.mesh.position.copy(p.home).addScaledVector(p.dir, a * radius * p.reach);
      p.mesh.quaternion.setFromAxisAngle(p.axis, a * opts.burstSpin);
    }
    return moving;
  }

  /** Start a disassembly. Ignored while one is already running, and under
   *  prefers-reduced-motion, where the mark simply stays whole. */
  function burst() {
    if (!opts.burst || reduce || burstT >= 0) return false;
    burstT = 0;
    return true;
  }
  // Placement moves this, never the mark, so the mark stays at the origin
  // its reflection's floor plane is measured from.
  const stand = new THREE.Group();
  stand.add(mark);
  scene.add(stand);

  /* --- floor reflection -------------------------------------------- *
   * A mirrored copy of the mark below it, faded out with distance. Two extra
   * draws of geometry that is already on the GPU and no second render pass,
   * which a real mirror would need.
   *
   * The fade has to happen in the shader rather than by drawing a gradient
   * over the top: the canvas is transparent and composites onto the page's
   * own background, so anything painted over the reflection would also paint
   * over that background as a visible block.
   * ----------------------------------------------------------------- */
  let mirror = null;
  let mirrorPivot = null;
  let horizon = null;
  const fogLayers = [];
  const mirrorMats = [];
  if (opts.reflection > 0) {
    const floorY = new THREE.Box3().setFromObject(mark).min.y - opts.reflectionGap;

    mirror = mark.clone(true);
    mirror.traverse((o) => {
      if (!o.isMesh) return;
      // clone() shares materials by reference - the reflection needs its own
      // or making it transparent would make the mark transparent too.
      const m = o.material.clone();
      m.transparent = true;
      m.opacity = opts.reflection;
      m.depthWrite = false;
      m.side = THREE.DoubleSide;       // the pivot's negative scale flips winding
      m.onBeforeCompile = (shader) => {
        // The reflection sets its own onBeforeCompile, so it has to re-apply
        // the side shading or the mirror would be lit differently to the mark.
        injectSideShading(shader, opts.sideDarken, opts.sideRough);
        shader.uniforms.uFloorY = { value: floorY };
        shader.uniforms.uFade = { value: opts.reflectionFade };
        shader.vertexShader = `varying vec3 vReflWorld;
${shader.vertexShader.replace(
  '#include <begin_vertex>',
  `#include <begin_vertex>
  vReflWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;`
)}`;
        shader.fragmentShader = `uniform float uFloorY;
uniform float uFade;
varying vec3 vReflWorld;
${shader.fragmentShader.replace(
  '#include <dithering_fragment>',
  `#include <dithering_fragment>
  gl_FragColor.a *= clamp(1.0 - (uFloorY - vReflWorld.y) / uFade, 0.0, 1.0);`
)}`;
      };
      // Without a distinct key three reuses the program compiled for the
      // mark's material and the injection above never reaches the GPU.
      m.customProgramCacheKey = () => 'sl-mark-reflection';
      o.material = m;
      mirrorMats.push(m);
    });

    if (opts.horizon > 0) {
      // Drawn rather than lit: a real light would need a floor to fall on, and
      // there is no floor geometry - only the mirrored copy that implies one.
      const g = document.createElement('canvas');
      g.width = 256; g.height = 64;
      const ctx = g.getContext('2d');
      // Warm gold, not white: the only light in this picture comes off the
      // mark, so a neutral highlight reads as a rule drawn across the frame.
      // The stops crowd the centre so it pools under the mark rather than
      // running edge to edge.
      const across = ctx.createLinearGradient(0, 0, 256, 0);
      across.addColorStop(0, 'rgba(198,162,86,0)');
      across.addColorStop(0.34, 'rgba(198,162,86,.12)');
      across.addColorStop(0.5, 'rgba(210,176,104,1)');
      across.addColorStop(0.66, 'rgba(198,162,86,.12)');
      across.addColorStop(1, 'rgba(198,162,86,0)');
      ctx.fillStyle = across;
      ctx.fillRect(0, 0, 256, 64);
      // Fading only across left a hard edge along the top and bottom of the
      // plane, which read as a seam rather than a surface. destination-in
      // multiplies the alpha by a second gradient, so it falls off both ways.
      const down = ctx.createLinearGradient(0, 0, 0, 64);
      down.addColorStop(0, 'rgba(0,0,0,0)');
      down.addColorStop(0.5, 'rgba(0,0,0,1)');
      down.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalCompositeOperation = 'destination-in';
      ctx.fillStyle = down;
      ctx.fillRect(0, 0, 256, 64);
      const tex = new THREE.CanvasTexture(g);
      if ('colorSpace' in tex) tex.colorSpace = THREE.SRGBColorSpace;
      const line = new THREE.Mesh(
        new THREE.PlaneGeometry(1.9, 0.05),
        new THREE.MeshBasicMaterial({
          map: tex, transparent: true, opacity: opts.horizon,
          depthWrite: false, blending: THREE.AdditiveBlending,
        })
      );
      line.position.y = floorY;
      line.position.z = -0.35;          // behind the mark, so it never crosses it
      line.renderOrder = -1;
      horizon = line;
      stand.add(line);
    }

    /* --- floor haze --------------------------------------------------- *
     * Three wide, very faint planes lying just above the implied floor,
     * drifting at different speeds so they separate instead of moving as one
     * sheet. Additive, so it only ever lightens - on a near-black ground that
     * reads as air catching the light off the mark rather than as grey paint.
     *
     * The drift is the texture's offset, not the mesh's position: with
     * RepeatWrapping that scrolls forever with no seam and no wrap logic, and
     * it never moves a vertex. Three quads is the whole cost. */
    if (opts.fog > 0) {
      const FW = 512, FH = 128;
      const puff = (ctx, x, y, r, a) => {
        const g2 = ctx.createRadialGradient(x, y, 0, x, y, r);
        /* Neutral, not gold. The horizon line is warm because it is light
           coming off the mark; the haze is air, and air is not gold - tinting
           it just washed the whole floor yellow. */
        g2.addColorStop(0, 'rgba(198,200,204,' + a + ')');
        g2.addColorStop(0.55, 'rgba(186,188,192,' + (a * 0.35) + ')');
        g2.addColorStop(1, 'rgba(170,172,176,0)');
        ctx.fillStyle = g2;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      };
      const layer = (seed, count, scale, alpha) => {
        const c = document.createElement('canvas');
        c.width = FW; c.height = FH;
        const ctx = c.getContext('2d');
        let n = seed;
        const rnd = () => (n = (n * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
        for (let i = 0; i < count; i++) {
          const x = rnd() * FW, y = FH * (0.42 + rnd() * 0.3);
          const r = FH * scale * (0.6 + rnd() * 0.7);
          const a = alpha * (0.5 + rnd() * 0.5);
          puff(ctx, x, y, r, a);
          // drawn again either side so the texture tiles without a seam
          if (x < r) puff(ctx, x + FW, y, r, a);
          if (x > FW - r) puff(ctx, x - FW, y, r, a);
        }
        // fade top and bottom, so the plane has no visible edge
        const down = ctx.createLinearGradient(0, 0, 0, FH);
        down.addColorStop(0, 'rgba(0,0,0,0)');
        down.addColorStop(0.45, 'rgba(0,0,0,1)');
        down.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalCompositeOperation = 'destination-in';
        ctx.fillStyle = down;
        ctx.fillRect(0, 0, FW, FH);
        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        if ('colorSpace' in tex) tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
      };

      // near layer smallest and faintest, far layer widest - depth without
      // needing more than three quads
      const specs = [
        { seed: 7,   count: 9,  scale: 0.30, w: 4.6, h: 0.42, y: 0.055, z: -0.22, speed: 1.00 },
        { seed: 41,  count: 7,  scale: 0.46, w: 6.2, h: 0.58, y: 0.095, z: -0.62, speed: 0.62 },
        { seed: 113, count: 5,  scale: 0.62, w: 8.0, h: 0.78, y: 0.135, z: -1.05, speed: 0.38 },
      ];
      specs.forEach((sp, i) => {
        const tex = layer(sp.seed, sp.count, sp.scale, 1);
        const mesh = new THREE.Mesh(
          new THREE.PlaneGeometry(sp.w, sp.h),
          new THREE.MeshBasicMaterial({
            map: tex, transparent: true,
            opacity: opts.fog * (1 - i * 0.22),
            depthWrite: false, blending: THREE.AdditiveBlending,
          })
        );
        mesh.position.set(0, floorY + sp.h * sp.y, sp.z);
        mesh.renderOrder = -2 - i;      // behind the horizon line and the mark
        fogLayers.push({ mesh: mesh, tex: tex, speed: sp.speed * opts.fogSpeed });
        stand.add(mesh);
      });
    }

    // Reflect about y = floorY: a child at local y renders at 2*floorY - y.
    mirrorPivot = new THREE.Group();
    mirrorPivot.scale.set(1, -1, 1);
    mirrorPivot.position.y = 2 * floorY;
    mirrorPivot.add(mirror);
    stand.add(mirrorPivot);
  }

  /* --- starfield ---------------------------------------------------- *
   * Points, not sprites: one draw call for the whole sky, and the twinkle is
   * a sine in the vertex shader rather than anything the CPU touches per
   * frame. They sit well behind the mark and never in front of it, so the
   * mark is still the only thing in focus.
   *
   * The warmth varies per point. A field of identical white dots reads as
   * dead pixels on a near-black ground; a gold bias on some of them reads as
   * light catching dust in a dark room, which is what a jeweller's counter
   * actually looks like. */
  let starField = null, starPos = null, fillStars = null;
  if (opts.stars > 0) {
    const n = opts.stars;
    const pos = new Float32Array(n * 3);
    const phase = new Float32Array(n);
    const size = new Float32Array(n);
    const warm = new Float32Array(n);
    // Kept so a refit moves each star along its own ray instead of teleporting
    // the whole field to a fresh random arrangement.
    const unit = new Float32Array(n);
    const angle = new Float32Array(n);
    /* Fitted to what the camera can actually see, not to a fixed box. A box
       sized by guesswork either leaves the corners of a wide window empty or
       puts most of the field off-screen - the first version put roughly six
       stars in seven somewhere nobody would ever look.

       Each star sits on a disc whose radius is the half-diagonal of the
       frustum at that star's depth. A disc, because the field turns about z:
       a rectangle would swing its corners in and out of frame.

       It refits on resize rather than over-covering for the widest possible
       window, because density is per unit area - a field sized for ultrawide
       would be three times too thin on a phone held upright. */
    fillStars = () => {
      const halfFov = (camera.fov * Math.PI) / 360;
      for (let i = 0; i < n; i++) {
        // Depth is kept, so a resize does not reshuffle the whole sky.
        const z = pos[i * 3 + 2];
        const hh = Math.tan(halfFov) * (camera.position.z - z);
        const hw = hh * (camera.aspect || 1);
        const radius = Math.sqrt(hh * hh + hw * hw) * opts.starSpread;
        // sqrt keeps density even across the disc rather than crowding the
        // middle, which is exactly where the mark already is.
        const r = Math.sqrt(unit[i]) * radius;
        pos[i * 3] = Math.cos(angle[i]) * r;
        pos[i * 3 + 1] = Math.sin(angle[i]) * r;
      }
      starPos.needsUpdate = true;
    };

    for (let i = 0; i < n; i++) {
      // Never nearer than the mark's own back face, so nothing crosses it.
      pos[i * 3 + 2] = -3.6 - Math.random() * 5.6;
      unit[i] = Math.random();
      angle[i] = Math.random() * Math.PI * 2;
      phase[i] = Math.random() * Math.PI * 2;
      // Mostly small. A handful of larger ones give the field a foreground.
      // Kept tight: anything over about four CSS pixels stops reading as a
      // point of light and starts reading as an out-of-focus blob.
      size[i] = 1.0 + Math.pow(Math.random(), 3.0) * 2.2;
      warm[i] = Math.pow(Math.random(), 1.6);
    }
    const geo = new THREE.BufferGeometry();
    starPos = new THREE.BufferAttribute(pos, 3);
    geo.setAttribute('position', starPos);
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
    geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    geo.setAttribute('aWarm', new THREE.BufferAttribute(warm, 1));

    const starMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        // gl_PointSize is in device pixels, so this is divided back down by
        // the device pixel ratio before it reaches the screen.
        uScale: { value: 26 },
        uOpacity: { value: opts.starOpacity },
        uCool: { value: new THREE.Color(0xdfe6f2) },
        uWarm: { value: new THREE.Color(0xf2d79a) },
      },
      vertexShader: `
        attribute float aPhase;
        attribute float aSize;
        attribute float aWarm;
        uniform float uTime;
        uniform float uScale;
        varying float vTwinkle;
        varying float vWarm;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          // Two frequencies so the field never pulses in unison.
          /* Every star ran at the same two frequencies, separated only by
             phase, which is why the field shimmered in step and read as one
             gentle pulse. Giving each its own rate is what makes a sky look
             alive. It is derived from aPhase - uniform across 0..2pi - rather
             than from a new attribute, and deliberately not from aWarm, or
             the gold ones would all twinkle at the same speed.

             The floor now dips just below zero, so the faintest few wink out
             for a moment rather than merely dimming. A handful doing that at
             any instant is twinkle; all of them at once would be a fault, and
             the spread of rates is what keeps them out of step. */
          float rate = 0.65 + aPhase * 0.16;
          vTwinkle = 0.46 + 0.34 * sin(uTime * rate + aPhase)
                          + 0.20 * sin(uTime * rate * 2.7 + aPhase * 1.7);
          vWarm = aWarm;
          gl_PointSize = aSize * uScale / -mv.z;
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        uniform vec3 uCool;
        uniform vec3 uWarm;
        varying float vTwinkle;
        varying float vWarm;
        void main() {
          // Round, with a soft core - a square point reads as a dead pixel.
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.0, d);
          a *= a;
          gl_FragColor = vec4(mix(uCool, uWarm, vWarm), a * vTwinkle * uOpacity);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    starField = new THREE.Points(geo, starMat);
    starField.renderOrder = -2;       // behind the horizon, behind everything
    starField.frustumCulled = false;  // one draw call either way
    scene.add(starField);
  }

  const tBuild = performance.now();
  marks('sl-mark:build-end');
  const timing = {
    env: +(tEnv - t0).toFixed(1),
    geometry: +(tBuild - tEnv).toFixed(1),
    total: +(tBuild - t0).toFixed(1),
  };

  /* --- motion state ------------------------------------------------ */
  let rotX = Math.max(-0.85, Math.min(0.85, opts.initialRotation?.x ?? 0));
  let rotY = Math.max(-opts.maxYaw, Math.min(opts.maxYaw, opts.initialRotation?.y ?? 0));
  mark.rotation.x = rotX;
  mark.rotation.y = rotY;

  let velX = 0, velY = 0;
  let targetTiltX = 0, targetTiltY = 0;
  let dragging = false, lastX = 0, lastY = 0, dragTravel = 0;
  let lastMove = performance.now();
  let idleSpin = 0;
  let starTime = Math.random() * 40;   // so two marks on a page never match
  let pointerInside = false;
  let interacted = false;
  // How far the host element has scrolled out of view, 0 to 1. Driven by
  // the caller, because the module has no business knowing about the page.
  let scrollOut = 0;
  // Scroll-scrub progress, 0..1, driven by the caller when opts.scrub is on.
  let scrubP = 0;
  let scrubStamp = -1e9;                 // ms, last time scrubP changed (lifts the idle frame cap)
  let scrubEased = 0;                    // the yaw actually shown for the scrub, after scrubEase
  let worldW = 1;
  let worldH = 1;
  let isPortrait = false;
  const smooth = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

  /* --- sizing ------------------------------------------------------ */
  function pixelRatioCap() {
    const narrow =
      (typeof window !== 'undefined' ? window.innerWidth : 0) < opts.mobileBreakpoint;
    return narrow ? opts.mobilePixelRatio : opts.maxPixelRatio;
  }

  function resize() {
    const w = el.clientWidth, h = el.clientHeight;
    if (!w || !h) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelRatioCap()));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // A portrait frame fits the mark by width, so it needs its own distance;
    // the old `min(w,h) < 420` rule was written for small embedded stages and
    // on a full-screen phone it pushed the camera back and shrank the mark.
    const portrait = camera.aspect < 0.9;
    let z = portrait ? opts.cameraZPortrait : opts.cameraZ;
    if (opts.fitAspect && camera.aspect < opts.fitAspect) z = Math.max(z, (opts.cameraZ * opts.fitAspect) / camera.aspect);
    camera.position.z = z;
    // World units visible at z=0, so offsetX can be expressed as a fraction of
    // the frame rather than a magic number that breaks at the next viewport.
    worldH = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
    worldW = worldH * camera.aspect;
    isPortrait = portrait;
    stand.position.x = opts.offsetX * worldW;
    stand.position.y = (portrait ? opts.offsetYPortrait : opts.offsetY) * worldH;
    if (fillStars) fillStars();
  }

  let ro = null;
  if (typeof ResizeObserver === 'function') {
    ro = new ResizeObserver(resize);
    ro.observe(el);
  } else {
    window.addEventListener('resize', resize);
  }
  resize();

  /* --- pointer ----------------------------------------------------- *
   * pointerdown is on the canvas, so an overlaid CTA that is a real element
   * never reaches us. opts.ignore additionally covers overlays that pass
   * pointer events through (pointer-events:none wrappers, ::after shims).
   * Parallax lives on the container; window-level listeners exist only for
   * the duration of a drag.
   * ----------------------------------------------------------------- */

  function blockedByIgnore(e) {
    if (!opts.ignore) return false;
    if (e.target && e.target.closest && e.target.closest(opts.ignore)) return true;
    if (typeof document.elementsFromPoint === 'function') {
      const stack = document.elementsFromPoint(e.clientX, e.clientY);
      for (const node of stack) {
        if (node === canvas) break;            // nothing above us matched
        if (node.closest && node.closest(opts.ignore)) return true;
      }
    }
    return false;
  }

  function markInteracted() {
    if (interacted) return;
    interacted = true;
    opts.onInteract?.();
  }

  function onDown(e) {
    if (e.button !== undefined && e.button !== 0) return;
    if (blockedByIgnore(e)) return;            // let the click through untouched
    dragging = true; dragTravel = 0;
    el.classList.add('is-dragging');
    lastX = e.clientX; lastY = e.clientY;
    lastMove = performance.now();
    velX = velY = 0;
    markInteracted();
    try { canvas.setPointerCapture(e.pointerId); } catch { /* the pointer has already gone */ }
    window.addEventListener('pointermove', onDragMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  }

  function applyMove(e) {
    const r = el.getBoundingClientRect();
    if (!r.height) return;
    // Where the mark actually is on screen, which is not the middle of the
    // element once offsetX/offsetY have moved it.
    const cx = (0.5 + opts.offsetX) * r.width;
    const cy = (0.5 - opts.offsetY) * r.height;
    // Normalise both axes by height so the falloff is a circle, not an
    // ellipse stretched across a wide hero.
    const dx = (e.clientX - r.left - cx) / r.height;
    const dy = (e.clientY - r.top - cy) / r.height;

    const near = opts.parallaxNear;
    const far = Math.max(opts.parallaxFar, near + 1e-3);
    const d = Math.sqrt(dx * dx + dy * dy);
    // smoothstep, so there is no edge where the tilt switches on
    const t = Math.min(Math.max((d - near) / (far - near), 0), 1);
    const strength = 1 - t * t * (3 - 2 * t);

    const clamp1 = (v) => Math.max(-1, Math.min(1, v));
    targetTiltY = clamp1(dx) * 0.38 * strength;
    targetTiltX = clamp1(dy) * 0.26 * strength;
  }

  // Container-level: parallax only. While dragging the window handler owns it,
  // so bail here rather than applying the same delta twice.
  function onHoverMove(e) {
    if (dragging) return;
    applyMove(e);
  }

  function onDragMove(e) {
    applyMove(e);
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    dragTravel += Math.abs(dx) + Math.abs(dy);
    lastX = e.clientX; lastY = e.clientY;
    lastMove = performance.now();
    rotY += dx * 0.0068;
    rotX += dy * 0.0055;
    velX = dy * 0.0055;
    velY = dx * 0.0068;
    idleSpin = 0;
  }

  function onUp(e) {
    if (!dragging) return;
    /* A tap is a tap; a drag that happens to end where it began is not.
       Measured against total travel rather than start-to-end distance, so
       spinning the mark and returning it does not fire the burst. */
    if (dragTravel < 6) burst();
    dragging = false;
    el.classList.remove('is-dragging');
    try { if (e && e.pointerId != null) canvas.releasePointerCapture(e.pointerId); } catch { /* not captured */ }
    lastMove = performance.now();
    window.removeEventListener('pointermove', onDragMove);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('pointercancel', onUp);
  }

  function onEnter() { pointerInside = true; }
  function onLeave() { pointerInside = false; targetTiltX = targetTiltY = 0; }

  canvas.addEventListener('pointerdown', onDown);
  el.addEventListener('pointermove', onHoverMove);
  el.addEventListener('pointerenter', onEnter);
  el.addEventListener('pointerleave', onLeave);

  /* --- render gating ----------------------------------------------- *
   * `wanted` is the caller's intent (start/stop). `pageVisible` and
   * `inView` are automatic. The loop runs only when all three agree, so
   * auto-pausing never overrides an explicit stop() and vice versa.
   * ----------------------------------------------------------------- */

  let wanted = false;
  let pageVisible = typeof document === 'undefined' || !document.hidden;
  let inView = true;
  let rafId = 0;
  let prev = performance.now();
  // The eased pose (drag, idle turn, pointer tilt). Kept apart from the scrub
  // yaw so the scroll can be applied 1:1 on top without inheriting the trail.
  let easeX = mark.rotation.x, easeY = mark.rotation.y;
  const clampYaw = (v) => Math.max(-opts.maxYaw, Math.min(opts.maxYaw, v));
  let spinDir = 1;
  let firstFrameDone = false;
  let resolveReady;
  const ready = new Promise((res) => { resolveReady = res; });

  function shouldRun() { return wanted && pageVisible && inView; }

  function sync() {
    if (shouldRun() && !rafId) {
      prev = performance.now();            // don't integrate the paused gap
      rafId = requestAnimationFrame(frame);
    } else if (!shouldRun() && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  function frame(now) {
    // The loop decides for itself whether to continue. An IntersectionObserver
    // callback can land either side of the rAF callback in a given frame, so a
    // cancel from sync() alone can be undone by a frame that has already been
    // dispatched and re-arms itself. Checking here makes the stop unconditional.
    if (!shouldRun()) { rafId = 0; return; }
    rafId = requestAnimationFrame(frame);
    // Idle frame cap: skip the display frames in between, the next one integrates
    // the gap. Lifted while anything the visitor drives is moving (a drag, a burst,
    // a scroll within the last 400 ms) so the scrub never looks stepped.
    const calm = !dragging && !burstMoving && now - scrubStamp > 400;
    if (calm && opts.idleFps > 0 && now - prev < 1000 / opts.idleFps - 2) return;
    const dt = Math.min((now - prev) / 1000, 0.05);
    prev = now;

    if (!dragging) {
      rotX += velX; rotY += velY;
      // 0.94 per *frame* made the glide shorter on a 120Hz screen than a 60Hz
      // one. Decay per second instead so the weight feels the same everywhere.
      const decay = Math.pow(GLIDE_PER_SECOND, dt);
      velX *= decay; velY *= decay;
      if (Math.abs(velX) < 1e-5) velX = 0;
      if (Math.abs(velY) < 1e-5) velY = 0;
      /* Only a settle after a *drag*, not after hovering. lastMove is stamped
         by pointerdown / drag / pointerup and by nothing else, so this waits
         for a visitor who has just spun the mark by hand to let go.

         It used to also require the pointer to be outside the stage, which on
         a full-bleed hero means the spin stopped the moment anyone moved onto
         the page and never started again. The tilt is added on top of the
         turn rather than replacing it, so the mark now leans toward the
         pointer while it keeps turning. */
      // Short: long enough not to fight a visitor still mid-gesture, short
      // enough that the mark is never sitting still for long.
      const settled = now - lastMove > 900;
      /* Precedence is drag, then scroll, then idle: as the hero leaves, the
         idle turn backs off rather than competing with the scroll rotation.

         This used to be a hard `scrollOut < 0.02` gate, which assumed the
         mark is only ever seen at the very top of the page. It is not: the
         hero's buttons sit near its lower edge, so by the time anyone has
         scrolled far enough to reach them scrollOut is past 0.4 and the mark
         had stopped dead - which read as "the logo freezes when I hover the
         CTA". Tapered to zero by the time the hero is 80% gone instead, so
         it is still turning while the buttons are in view and still hands
         over cleanly to the scroll rotation. */
      if (!reduce && opts.idleSpin && scrollOut < 0.8) {
        const fade = 1 - scrollOut / 0.8;
        idleSpin += ((settled ? opts.idleSpeed * fade : 0) - idleSpin) * Math.min(dt * 1.6, 1);
        rotY += idleSpin * spinDir * dt;
        /* Steer on the angle the visitor can see, not on the raw total. A
           drag leaves rotY unbounded - spin it five times and it is past 30
           radians - so comparing that against the band would send the mark
           the long way home, or never. atan2 folds it back into (-pi, pi]
           without touching rotY itself, so nothing jumps.

           Dragging is still unlimited: this only decides which way the idle
           turn pushes, and it pushes back toward a legible mark. Leave the
           logo facing backwards and it will right itself. */
        const seen = Math.atan2(Math.sin(rotY), Math.cos(rotY));
        const band = Math.min(opts.idleYaw, opts.maxYaw);
        if (seen > band) spinDir = -1;
        else if (seen < -band) spinDir = 1;
      }
      // ease back toward facing the viewer on the vertical axis
      rotX += (0 - rotX) * Math.min(dt * 0.9, 1) * 0.55;
    }
    rotX = Math.max(-0.85, Math.min(0.85, rotX));
    rotY = clampYaw(rotY);

    const away = reduce ? 0 : scrollOut;
    const tx = rotX + (pointerInside ? targetTiltX : 0);
    // Additive, not a mutation of rotY: scrolling back up returns the mark
    // exactly to the angle the visitor left it at.
    const scrubYaw = opts.scrub ? scrubP * opts.scrubTurns * Math.PI * 2 : 0;
    if (opts.scrub && opts.scrubShiftX && !isPortrait) {
      stand.position.x = (opts.offsetX + smooth((scrubP - 0.58) / 0.3) * opts.scrubShiftX) * worldW;
    }
    let settleShrink = 0;
    if (opts.scrub && opts.scrubShiftYPortrait && isPortrait) {
      const s = smooth((scrubP - 0.58) / 0.3);
      stand.position.y = (opts.offsetYPortrait + s * opts.scrubShiftYPortrait) * worldH;
      settleShrink = s * opts.scrubShrinkPortrait; // and it shrinks, so it clears the caption
    }
    const ty = clampYaw(rotY + (pointerInside ? targetTiltY : 0) + away * opts.scrollYaw);
    const k = Math.min(dt * 7.5, 1);
    easeX += (tx - easeX) * k;
    easeY += (ty - easeY) * k;
    // The scrub rides on top of the eased pose. With scrubEase 0 it is the scroll
    // position itself, so the mark is wherever the thumb put it this very frame.
    scrubEased += (scrubYaw - scrubEased) * (opts.scrubEase > 0 ? Math.min(dt * opts.scrubEase, 1) : 1);
    mark.rotation.x = easeX;
    mark.rotation.y = clampYaw(easeY + scrubEased);
    if (opts.scrollScale || settleShrink) mark.scale.setScalar((1 - away * (opts.scrollScale || 0)) * (1 - settleShrink));

    /* The disassembly. Advanced here rather than on a timer so it stops
       dead with the render loop - a backgrounded tab must not come back to
       a mark mid-flight, and a paused one must not keep moving. */
    if (opts.burst && !reduce) {
      if (burstT >= 0) {
        burstT += dt;
        if (burstT > burstSpan()) {
          burstT = -1;
          burstNext = opts.burstInterval ? now + opts.burstInterval : 0;
        }
      } else if (burstNext && now >= burstNext) {
        burstT = 0;
      }
      burstMoving = applyBurst();
    }

    if (mirror) {
      mirror.rotation.copy(mark.rotation);
      mirror.scale.copy(mark.scale);
      /* The reflection is a static clone, so the group's rotation is all it
         used to need. Now that the pieces move independently it has to copy
         them too, or the mark comes apart while its reflection stays whole.
         Only while something is actually in flight. */
      if (burstMoving || burstSettling) {
        const src = mark.children, dst = mirror.children;
        for (let i = 0; i < src.length && i < dst.length; i++) {
          dst[i].position.copy(src[i].position);
          dst[i].quaternion.copy(src[i].quaternion);
        }
        burstSettling = burstMoving;
      }
    }

    /* The haze drifts by scrolling its texture, so nothing here touches a
       vertex or a matrix. Frozen under prefers-reduced-motion - it is
       decorative movement, which is exactly what that setting asks to lose -
       and faded out as the hero scrolls away so it does not linger over the
       section below. */
    if (fogLayers.length) {
      for (let i = 0; i < fogLayers.length; i++) {
        const f = fogLayers[i];
        if (!reduce) f.tex.offset.x -= f.speed * dt;
        f.mesh.material.opacity = opts.fog * (1 - i * 0.22) * (1 - away);
      }
    }

    if (starField) {
      // Frozen for anyone who has asked for less motion: the field is still
      // worth having, the twinkle is not.
      if (!reduce) {
        starTime += dt;
        starField.material.uniforms.uTime.value = starTime;
        // Slower than the eye tracks on purpose - a full turn takes minutes.
        starField.rotation.z += dt * 0.009;
      }
      /* Leans against the pointer, which is what gives the gap between the
         field and the mark any depth.

         The pointer tilt only - NOT ty. ty carries the mark's accumulated
         rotation, which a drag leaves unbounded, so the field used to slide
         further off-frame with every spin until its edge came into view and
         half the sky looked empty. */
      starField.position.x = -(pointerInside ? targetTiltY : 0) * 0.30;
      starField.position.y = (pointerInside ? targetTiltX : 0) * 0.18;
    }

    renderer.render(scene, camera);

    if (!firstFrameDone) {
      firstFrameDone = true;
      marks('sl-mark:first-frame');
      opts.onFirstFrame?.({ timing });
      resolveReady(true);
      /* Scheduled from the first frame, not from mount: the mark fades up
         over its poster, and playing the disassembly during that cross-fade
         would spend the moment while nobody can see it. */
      if (opts.burst && !reduce && opts.burstAuto && !opts.scrub) burstNext = now + opts.burstAuto;
    }
  }

  function onVisibility() {
    pageVisible = !document.hidden;
    sync();
  }

  let io = null;
  if (opts.autoPause) {
    document.addEventListener('visibilitychange', onVisibility);
    if (typeof IntersectionObserver === 'function') {
      // Start optimistic: the observer's first callback arrives within a frame
      // or two and corrects us. Assuming "out" instead would mean an above-the-
      // fold hero renders nothing until that callback lands.
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) inView = entry.isIntersecting;
          sync();
        },
        { threshold: opts.intersectionThreshold }
      );
      io.observe(el);
    }
  }

  /* --- public handle ----------------------------------------------- */
  let destroyed = false;

  function start() {
    if (destroyed) return;
    wanted = true;
    sync();
  }

  function stop() {
    wanted = false;
    sync();
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    wanted = false;
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }

    canvas.removeEventListener('pointerdown', onDown);
    el.removeEventListener('pointermove', onHoverMove);
    el.removeEventListener('pointerenter', onEnter);
    el.removeEventListener('pointerleave', onLeave);
    window.removeEventListener('pointermove', onDragMove);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('pointercancel', onUp);
    document.removeEventListener('visibilitychange', onVisibility);
    if (ro) ro.disconnect(); else window.removeEventListener('resize', resize);
    if (io) io.disconnect();

    meshes.forEach((m) => m.geometry.dispose());
    // the mirror shares the mark's geometry, so only its materials are ours
    mirrorMats.forEach((m) => m.dispose());
    if (horizon) { horizon.geometry.dispose(); horizon.material.map.dispose(); horizon.material.dispose(); }
    if (starField) { starField.geometry.dispose(); starField.material.dispose(); scene.remove(starField); }
    if (mirrorPivot) stand.remove(mirrorPivot);
    goldMat.dispose();
    platMat.dispose();
    lights.forEach((l) => { scene.remove(l); l.dispose?.(); });
    scene.remove(stand);
    envRT.dispose();                 // the PMREM render target holds the env map
    scene.environment = null;

    renderer.dispose();
    const ctx = renderer.getContext();
    const lose = ctx && ctx.getExtension && ctx.getExtension('WEBGL_lose_context');
    lose?.loseContext();
    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
  }

  /** Scroll-scrub progress through the pinned hero, 0..1. */
  function setScrub(p) {
    const v = p < 0 ? 0 : p > 1 ? 1 : p;
    if (v !== scrubP) scrubStamp = performance.now();
    scrubP = v;
  }

  /** 0 while the element is fully in view, 1 once it has scrolled out. */
  function setScrollProgress(p) {
    // A drag owns the mark while it is held; scroll waits its turn.
    if (dragging) return;
    scrollOut = p < 0 ? 0 : p > 1 ? 1 : p;
  }

  /** Current composed angles, for tests and for tuning the feel from a
   *  console. Read-only snapshot; setRotation() is the way to change them. */
  function getRotation() {
    return {
      x: mark.rotation.x, y: mark.rotation.y,
      tiltX: targetTiltX, tiltY: targetTiltY,
      scrollOut, dragging,
    };
  }

  function setRotation(x, y) {
    rotX = Math.max(-0.85, Math.min(0.85, x));
    rotY = clampYaw(y);
    easeX = rotX; easeY = rotY;
    mark.rotation.x = rotX; mark.rotation.y = rotY + scrubEased;
    velX = velY = 0;
  }

  const api = {
    supported: true,
    canvas,
    ready,
    timing,
    start,
    stop,
    destroy,
    setRotation,
    setScrollProgress,
    setScrub,
    getRotation,
    /** Play one disassembly. Returns false if it declined - already running,
     *  not enabled, or the visitor asked for reduced motion. */
    burst,
    get bursting() { return burstT >= 0; },
    get running() { return !!rafId; },
  };
  /* getRotation() is documented as being for tests and for tuning the feel
     from a console, but the instance was only ever held in a module-scoped
     variable in hero-mark.js, so neither was actually possible. Hanging it on
     the element makes it reachable without exporting anything global. */
  el.slMark = api;
  return api;
}

export default mount;
