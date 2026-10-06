/**
 * THE MÖBIUS — the live chrome strip on the /ai "0 follow-ups forgotten" card
 * (Brad, 2026-10-06: "make this spin in motion rather than being static").
 *
 * Loaded ONLY by dynamic import from `mobius-spin.tsx`, on a browser that
 * will run it (real GPU, motion allowed, no data saver); it shares the hero
 * core's three.js chunk. Everywhere else the card keeps the still,
 * `public/images/ai/mobius.2026-10-06.webp`, which this scene was rendered
 * from: same geometry, studio, material, camera and pose, so its first frame
 * IS the still and the hand-over cannot be seen.
 *
 * THE SPIN. The strip turns about its own loop axis (the innermost Euler
 * angle, so the tilt never changes), which sends the half twist travelling
 * round the loop while the studio stays put, so the white keys and red rims
 * roll across the metal. One turn per SPIN seconds, eased in from rest.
 *
 * DRAG (Brad, 2026-10-06: "you should be able to spin it if you click your
 * mouse on it ... move it freely"). The pointer turns the whole strip about
 * the screen's axes, trackball style, so it rolls whichever way it is pulled
 * whatever its current angle; touch turns it sideways only, so a vertical
 * swipe still scrolls the page. Let go and it carries on with the speed it
 * was thrown at, slowing to a stop; left alone for a couple of seconds, it
 * eases back to its resting pose, so the card is never left with the strip
 * at an odd angle. Its own turn about the loop never stops.
 *
 * FRAMING. The still is a trimmed crop of a 2000px square render. The canvas
 * renders the square the strip can reach at any angle (`FRAME.view`) through
 * `setViewOffset`, so nothing is ever cut at the canvas edge; the component
 * positions the canvas over the image from the same numbers.
 */
import {
  ACESFilmicToneMapping,
  BufferGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Quaternion,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from "three";
import { isSoftwareGL } from "@/lib/gl-support";
import { FRAME } from "./ai-mobius-frame";
import { studio } from "./ai-studio";

/** Seconds a turn, once up to speed. */
const SPIN = 16;

/* A solid Möbius ribbon: a rounded-rectangle section swept round a circle,
   turning half a turn on the way, normals worked out exactly (no seam). */
function mobius({ R = 1, W = 0.82, Tk = 0.1, r = 0.045, N = 520, C = 10 } = {}): BufferGeometry {
  const sec: [number, number, number, number][] = [];
  const hw = W / 2 - r;
  const ht = Tk / 2 - r;
  const corners: [number, number, number][] = [
    [hw, ht, 0],
    [-hw, ht, Math.PI / 2],
    [-hw, -ht, Math.PI],
    [hw, -ht, Math.PI * 1.5],
  ];
  for (const [cx, cy, a0] of corners) {
    for (let k = 0; k <= C; k++) {
      const a = a0 + (k / C) * (Math.PI / 2);
      sec.push([cx + r * Math.cos(a), cy + r * Math.sin(a), Math.cos(a), Math.sin(a)]);
    }
  }
  const M = sec.length;
  const pos: number[] = [];
  const nrm: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= N; i++) {
    const u = (i / N) * Math.PI * 2;
    const th = u / 2;
    const ex = Math.cos(u);
    const ey = Math.sin(u);
    const A = [ex * Math.cos(th), ey * Math.cos(th), Math.sin(th)]; // width axis
    const B = [-ex * Math.sin(th), -ey * Math.sin(th), Math.cos(th)]; // thickness axis
    for (const [a, b, na, nb] of sec) {
      pos.push(R * ex + a * A[0] + b * B[0], R * ey + a * A[1] + b * B[1], a * A[2] + b * B[2]);
      const n = [na * A[0] + nb * B[0], na * A[1] + nb * B[1], na * A[2] + nb * B[2]];
      const l = Math.hypot(n[0], n[1], n[2]);
      nrm.push(n[0] / l, n[1] / l, n[2] / l);
    }
  }
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      const a = i * M + j;
      const b = i * M + ((j + 1) % M);
      const c = (i + 1) * M + j;
      const d = (i + 1) * M + ((j + 1) % M);
      idx.push(a, c, b, b, c, d);
    }
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.setAttribute("normal", new Float32BufferAttribute(nrm, 3));
  g.setIndex(idx);
  return g;
}

export type MobiusHandle = {
  /** Start or stop the render loop (off screen, hidden tab). */
  setActive: (on: boolean) => void;
  /** A drag in CSS pixels; `free` turns on both axes, otherwise sideways only. */
  drag: (dx: number, dy: number, free: boolean) => void;
  /** The pointer let go: keep the throw's speed, then settle. */
  release: () => void;
  dispose: () => void;
};

/** Radians a CSS pixel of drag turns the strip. */
const DRAG = 0.009;
const X_AXIS = new Vector3(1, 0, 0);
const Y_AXIS = new Vector3(0, 1, 0);
const HOME = new Quaternion();

export function mountMobius(canvas: HTMLCanvasElement, opts: { lite?: boolean; onFirstFrame?: () => void } = {}): MobiusHandle | null {
  if (isSoftwareGL()) return null;
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance", failIfMajorPerformanceCaveat: true });
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
  const envMap = pmrem.fromScene(studio({ red: 0.6, softboxes: 1.2 }), 0.04).texture;
  scene.environment = envMap;
  scene.environmentRotation.set(0.15, 2.9, 0);

  const geo = mobius({ N: opts.lite ? 360 : 520 });
  const mat = new MeshPhysicalMaterial({ color: 0xffffff, metalness: 1, roughness: 0.13, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.3, side: DoubleSide });
  const band = new Mesh(geo, mat);
  // The still's pose: Euler XYZ applies z first, so z alone turns the strip about its loop.
  const pose = new Group();
  pose.add(band);
  band.rotation.set(1.1, 0.35, -0.35);
  scene.add(pose);

  const { full, view } = FRAME;
  const camera = new PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 5.2);
  camera.setViewOffset(full, full, view.x, view.y, view.w, view.h);

  const resize = () => {
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    if (cw && ch) renderer.setSize(cw, ch, false);
  };

  let active = false;
  let raf = 0;
  let angle = 0;
  let speed = 0; // eased in from rest, so the first frames match the still
  let last = 0;

  /* The pointer's part: a velocity in radians a second about the screen's
     axes, the time of the last touch, and whether a finger is down. */
  let held = false;
  let touched = 0;
  let vYaw = 0;
  let vPitch = 0;
  let moved = 0;
  const q = new Quaternion();
  const turn = (yaw: number, pitch: number) => {
    if (yaw) pose.quaternion.premultiply(q.setFromAxisAngle(Y_AXIS, yaw));
    if (pitch) pose.quaternion.premultiply(q.setFromAxisAngle(X_AXIS, pitch));
  };

  const frame = (now: number) => {
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now;
    speed += ((Math.PI * 2) / SPIN - speed) * Math.min(1, dt * 0.8);
    angle += speed * dt;
    band.rotation.z = -0.35 + angle;
    if (!held) {
      // The throw carries on and dies away...
      turn(vYaw * dt, vPitch * dt);
      const decay = Math.exp(-dt * 3.2);
      vYaw *= decay;
      vPitch *= decay;
      // ...then, left alone, the strip settles back to its resting pose.
      if (now - touched > 2200 && Math.hypot(vYaw, vPitch) < 0.15) pose.quaternion.slerp(HOME, 1 - Math.exp(-dt * 1.6));
    }
    renderer.render(scene, camera);
    raf = active ? requestAnimationFrame(frame) : 0;
  };

  const ro = new ResizeObserver(() => {
    resize();
    renderer.render(scene, camera);
  });
  ro.observe(canvas);
  resize();
  renderer.render(scene, camera); // the still's frame, before anything moves
  opts.onFirstFrame?.();

  return {
    drag(dx, dy, free) {
      const now = performance.now();
      const yaw = dx * DRAG;
      const pitch = free ? dy * DRAG : 0;
      turn(yaw, pitch);
      // Velocity from this move, smoothed, so a flick is thrown, not dropped.
      const step = Math.max(0.008, (now - (moved || now - 16)) / 1000);
      vYaw = vYaw * 0.4 + (yaw / step) * 0.6;
      vPitch = vPitch * 0.4 + (pitch / step) * 0.6;
      moved = now;
      touched = now;
      held = true;
    },
    release() {
      // A pause before letting go means it was placed, not thrown.
      if (performance.now() - moved > 90) vYaw = vPitch = 0;
      const cap = 9;
      vYaw = Math.max(-cap, Math.min(cap, vYaw));
      vPitch = Math.max(-cap, Math.min(cap, vPitch));
      held = false;
      moved = 0;
      touched = performance.now();
    },
    setActive(on) {
      if (on === active) return;
      active = on;
      if (on && !raf) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
      if (!on) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    dispose() {
      active = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      geo.dispose();
      mat.dispose();
      envMap.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
