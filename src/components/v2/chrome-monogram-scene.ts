/**
 * The BL monogram as a real 3D object in mirror chrome.
 *
 * Loaded ONLY by dynamic import from `chrome-monogram.tsx`, when the section
 * comes near the viewport, so three.js never touches the first page load.
 *
 * GEOMETRY. The same traced strokes as `src/app/icon.svg` (the favicon the
 * client approved): the B is `M447 875V328H612A106 106 0 0 1 612 540H700
 * A132 132 0 0 1 700 804H590` and the L is `M528 395V897H860`, stroke 56,
 * miter joins. A stroke cannot be extruded, so each straight run and each
 * bowl is rebuilt as the filled outline it paints (rectangles and half
 * annuli), in SVG units, y flipped, then UNIONED into one outline per
 * letterform before extruding (see `monogramShapes`), so the chrome has no
 * seams where the strokes meet.
 *
 * CHROME. Metal only looks like metal because of what it reflects, and this
 * page is black. So the environment is a studio built in code — a black
 * room with a few white softbox strips — pre-filtered once with PMREM. The
 * strips are what draw the bright bands across the letters; rotating the
 * environment with the scroll sweeps them across the face. No HDR file is
 * downloaded.
 */
import {
  ACESFilmicToneMapping,
  BackSide,
  Box3,
  Color,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  Path,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  Shape,
  SphereGeometry,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import polygonClipping, { type MultiPolygon } from "polygon-clipping";

const W = 56; // stroke width in the SVG
const H = W / 2;

type Ring = [number, number][];

/** Rectangle from SVG-space bounds (y down), as a ring in y-up space. */
function rect(x0: number, y0: number, x1: number, y1: number): Ring {
  return [
    [x0, -y0],
    [x1, -y0],
    [x1, -y1],
    [x0, -y1],
    [x0, -y0],
  ];
}

/** Right-hand half annulus: top → right → bottom, as the SVG arcs sweep. */
function bowl(cx: number, cy: number, r: number): Ring {
  const ro = r + H;
  const ri = r - H;
  const n = 64;
  const ring: Ring = [];
  for (let i = 0; i <= n; i++) {
    const a = -Math.PI / 2 + (Math.PI * i) / n;
    ring.push([cx + ro * Math.cos(a), -(cy + ro * Math.sin(a))]);
  }
  for (let i = n; i >= 0; i--) {
    const a = -Math.PI / 2 + (Math.PI * i) / n;
    ring.push([cx + ri * Math.cos(a), -(cy + ri * Math.sin(a))]);
  }
  ring.push(ring[0]);
  return ring;
}

/**
 * ONE outline per connected letterform, not eight pieces.
 *
 * The first build extruded each stroke segment separately. Every piece
 * bevelled its own edges and had to sit a hair in front of its neighbour to
 * avoid z-fighting, so each joint read as a line cut across the chrome —
 * Brad: "I don't like the lines on it". The pieces are now unioned in 2D
 * (polygon-clipping) and each resulting outline, holes included, is
 * extruded once: bevels land only on the mark's real edges and the faces
 * are continuous metal.
 */
function monogramShapes(letter: "B" | "L"): Shape[] {
  /* The B and the L never touch (checked: every B piece clears the L stem
     and base), so each letter is its own outline and its own mesh group —
     which is what lets them come apart on click. */
  const pieces: Ring[] =
    letter === "B"
      ? [
          rect(447 - H, 328 - H, 447 + H, 875), // stem (butt end at 875)
          rect(447 + H, 328 - H, 612, 328 + H), // top bar
          bowl(612, 434, 106), // upper bowl
          rect(612, 540 - H, 700, 540 + H), // waist
          bowl(700, 672, 132), // lower bowl
          rect(590, 804 - H, 700, 804 + H), // foot (butt end at 590)
        ]
      : [
          rect(528 - H, 395, 528 + H, 897 - H), // stem
          rect(528 - H, 897 - H, 860, 897 + H), // base (miter corner)
        ];
  const [first, ...rest] = pieces.map((r) => [[r]] as MultiPolygon);
  const merged = polygonClipping.union(first, ...rest);
  const toPoints = (ring: Ring) => ring.slice(0, -1).map(([x, y]) => new Vector2(x, y));
  return merged.map(([outer, ...holes]) => {
    const shape = new Shape(toPoints(outer));
    holes.forEach((h) => shape.holes.push(new Path(toPoints(h))));
    return shape;
  });
}

/** A black studio with white softboxes, for the chrome to reflect. */
function studio(): Scene {
  const env = new Scene();
  env.background = new Color(0x000000);
  env.add(
    new Mesh(
      new SphereGeometry(50, 32, 16),
      new MeshBasicMaterial({ color: 0x050505, side: BackSide }),
    ),
  );
  const strip = (
    w: number,
    h: number,
    pos: [number, number, number],
    intensity: number,
    tilt = 0,
  ) => {
    const m = new Mesh(
      new PlaneGeometry(w, h),
      new MeshBasicMaterial({ color: new Color(1, 1, 1).multiplyScalar(intensity) }),
    );
    m.position.set(...pos);
    m.lookAt(0, 0, 0);
    m.rotateZ(tilt);
    env.add(m);
  };
  /* GLISTEN (Brad, 2026-09-26: "it should actually spin and glisten in
     monochrome rather than looking white face on"). A flat chrome face
     reflects one direction, so a bright wash anywhere it can see reads as a
     flat white plate. The room is near-black with softboxes set all the way
     round: as the mark turns, each face sweeps across them at twice the
     turn rate, so light runs across the metal in bands.

     FLICKER (Brad, same day: "the screen kind of flickers" while it
     spins). Hair-thin, very bright strips alias: on a fast turn a band is
     one frame on a bevel and gone the next, which reads as strobing. The
     strips are now wider and dimmer, fewer, and the environment is
     pre-blurred more (see PMREM sigma), so a band travels across the metal
     instead of blinking on and off it. */
  strip(60, 60, [0, 0, 24], 0.07); // just enough that steel is never pure black
  strip(2.4, 60, [-3.6, 0, 20], 1.9, 0.55); // the foil diagonal, face-on
  strip(1.2, 60, [4.8, 0, 20], 1.3, 0.55);
  // A ring of tall strips round the room, uneven on purpose, so the turn
  // never sits in a gap for long.
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2 + 0.35;
    const r = 20;
    strip(k % 2 ? 2.2 : 3.6, 50, [Math.sin(a) * r, 0, Math.cos(a) * r], k % 2 ? 0.9 : 1.5, 0.35);
  }
  strip(40, 4, [0, 18, 4], 1.2); // key overhead, for the top bevels
  strip(30, 3, [0, -16, 6], 0.6); // floor bounce, for the bottom bevels
  return env;
}

export type MonogramHandle = {
  /** 0..1 progress through the section. */
  setProgress: (p: number) => void;
  dispose: () => void;
};

/**
 * True when WebGL is running on a CPU rasteriser rather than a GPU.
 * `failIfMajorPerformanceCaveat` alone does not catch it: Chrome's ANGLE
 * reports SwiftShader-on-Vulkan as a normal device (measured 2026-09-25 —
 * the flag granted a context and scrolling still stalled), so read the
 * renderer string as well. Where the debug extension is withheld, the
 * string is unknown and the mark is allowed to try.
 */
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

export function mountMonogram(canvas: HTMLCanvasElement): MonogramHandle | null {
  if (isSoftwareGL()) return null;
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      /* No GPU, no chrome. Without hardware acceleration the browser falls
         back to a software rasteriser (SwiftShader, llvmpipe), where one
         frame of this material costs long enough to starve the main thread
         — the test browser, which has no GPU, stopped being able to scroll
         the page (2026-09-25). This flag makes context creation FAIL there
         instead, so the caller keeps the flat foil mark. */
      failIfMajorPerformanceCaveat: true,
    });
  } catch {
    return null; // no (hardware) WebGL — the caller keeps the flat mark
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const envScene = studio();
  const envMap = pmrem.fromScene(envScene, 0.045).texture;
  scene.environment = envMap;

  const material = new MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 1,
    roughness: 0.18,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    envMapIntensity: 1.25,
  });

  const geometries: ExtrudeGeometry[] = [];
  const extrude = {
    depth: 64,
    bevelEnabled: true,
    // One outline per letter, so the bevel only rounds real edges and can
    // be generous enough to catch the light.
    bevelThickness: 7,
    bevelSize: 4,
    bevelSegments: 6,
    curveSegments: 1,
  };
  const letter = (which: "B" | "L") => {
    const g = new Group();
    monogramShapes(which).forEach((shape) => {
      const geo = new ExtrudeGeometry(shape, extrude);
      geometries.push(geo);
      g.add(new Mesh(geo, material));
    });
    return g;
  };
  const letterB = letter("B");
  const letterL = letter("L");
  const mark = new Group();
  mark.add(letterB, letterL);

  // Centre the pair on the origin (in SVG units); scale to ~2.2 units tall.
  const box = new Box3().setFromObject(mark);
  const centre = box.getCenter(new Vector3());
  const size = box.getSize(new Vector3());
  mark.children.forEach((g) => g.children.forEach((m) => m.position.sub(centre)));
  const pivot = new Group();
  pivot.add(mark);
  const k = 2.2 / size.y;
  pivot.scale.setScalar(k);
  scene.add(pivot);

  const camera = new PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 5.2);

  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Keep the mark the same size on a tall phone as on a wide monitor.
    camera.position.z = w / h < 1 ? 5.2 / (w / h) ** 0.75 : 5.2;
    camera.updateProjectionMatrix();
    render();
  };

  let target = 0;
  let current = 0;
  let raf = 0;

  function render() {
    /* ONE FULL TURN (Brad, 2026-09-26). Face-on at the start, 360° across
       the first 88% of the pinned ride, face-on again for the rest so the
       page releases on the logo. ease-in-out, and a slight nod on x. The
       environment stays still: turning the mark through a fixed room is
       what makes the bands run across it. The split overrides the turn —
       the word is always read face-on. */
    const t = Math.min(1, current / 0.88);
    const e = t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
    pivot.rotation.y = e * Math.PI * 2;
    pivot.rotation.x = Math.sin(e * Math.PI * 2) * 0.14;
    renderer.render(scene, camera);
  }

  // Ease toward the scroll target; stop requesting frames once settled, so a
  // still page costs nothing.
  const loop = () => {
    current += (target - current) * 0.12;
    render();
    const moving = Math.abs(target - current) > 0.0004;
    raf = moving ? requestAnimationFrame(loop) : 0;
  };

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  return {
    setProgress(p) {
      target = p;
      if (!raf) raf = requestAnimationFrame(loop);
    },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      geometries.forEach((g) => g.dispose());
      material.dispose();
      envMap.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
