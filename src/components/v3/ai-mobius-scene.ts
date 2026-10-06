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
 * FRAMING. The still is a trimmed crop of a 2000px square render. The canvas
 * renders that same crop through `setViewOffset`, grown by PAD on every side
 * for the parts of the strip that swing outside the still's box as it turns;
 * the component positions the canvas over the image with the same margins.
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
  Scene,
  SRGBColorSpace,
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
  dispose: () => void;
};

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

  const { full, x, y, w, h, pad } = FRAME;
  const camera = new PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 5.2);
  camera.setViewOffset(full, full, x - pad, y - pad, w + pad * 2, h + pad * 2);

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
  const frame = (now: number) => {
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now;
    speed += ((Math.PI * 2) / SPIN - speed) * Math.min(1, dt * 0.8);
    angle += speed * dt;
    band.rotation.z = -0.35 + angle;
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
