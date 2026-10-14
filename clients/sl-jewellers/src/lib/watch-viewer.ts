/**
 * A watch on a turntable: one GLB, drag to turn, a slow idle turn, studio reflections.
 *
 *   const v = await mountWatch(host, "/models/x.glb", { onProgress, reduced });
 *   v.destroy();
 *
 * Loaded with a dynamic import from components/pages/Watch3D.tsx, so three.js never reaches
 * a page without a model. The page keeps the photo underneath until the model is ready.
 */
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";


export type WatchViewer = { destroy: () => void; reset: () => void; setActive: (on: boolean) => void };

/** The catalogue studio (Shaun, 8 Oct 2026: "it just doesn't look real ... like the stuff you see on
 *  the Rolex website"). Watch photography is near-black with a few hard, narrow light strips: polished
 *  metal shows them as crisp bright edges running along each link and the case flank, and the dark
 *  between them is what makes it read as polished. The old room was a soft grey wash, so every
 *  surface came out the same mid grey. Rendered almost sharp into a PMREM; each metal's own
 *  roughness (set in the Blender build, scripts/3d) decides how soft its reflections are. */
function studio(renderer: THREE.WebGLRenderer) {
  const env = new THREE.Scene();
  const room = new THREE.SphereGeometry(10, 48, 24);
  const pos = room.attributes.position;
  const col: number[] = [];
  for (let i = 0; i < pos.count; i++) {
    const t = (pos.getY(i) / 10 + 1) / 2;
    // near black low down, a soft grey overhead: the far side of the bracelet, which faces away
    // from the strips, picks up a dim gradient instead of reading as black glass
    const v = 0.006 + 0.24 * Math.pow(t, 2);
    col.push(v, v, v * 1.02);
  }
  room.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  env.add(new THREE.Mesh(room, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })));
  const strip = (w: number, h: number, i: number, at: [number, number, number], warm = false) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(warm ? 0xfff1dc : 0xffffff).multiplyScalar(i), side: THREE.DoubleSide }));
    m.position.set(...at);
    m.lookAt(0, 0, 0);
    env.add(m);
  };
  strip(9, 2.4, 5, [-1.5, 6, 4.5], true); // the overhead key softbox, a little in front
  strip(0.7, 10, 7, [5.5, 0.5, 3.5]); // a narrow upright strip each side: the bright edge down the case
  strip(0.7, 10, 6, [-5.5, 0.5, 3]);
  strip(0.5, 10, 4, [3.5, 0.5, -5.5]); // two rims from behind
  strip(0.5, 10, 4, [-3.5, 0.5, -5.5]);
  strip(10, 0.5, 3, [0, 4.5, -5]); // a line along the top from behind
  strip(7, 1.2, 1.2, [0, -5, 4]); // a low card for the underside of the bracelet
  strip(12, 7, 0.55, [0, 5.5, -3.5]); // a broad dim panel above and behind: soft fill for the far links
  const pmrem = new THREE.PMREMGenerator(renderer);
  const tex = pmrem.fromScene(env, 0.012).texture;
  pmrem.dispose();
  env.traverse((o) => {
    if (o instanceof THREE.Mesh) { o.geometry.dispose(); (o.material as THREE.Material).dispose(); }
  });
  return tex;
}

/** A soft shadow under the bracelet loop, drawn once into a small canvas. */
function contactShadow(width: number, depth: number) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, "rgba(0,0,0,0.55)");
  r.addColorStop(0.55, "rgba(0,0,0,0.18)");
  r.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
  m.rotation.x = -Math.PI / 2;
  return m;
}

export async function mountWatch(
  host: HTMLElement,
  src: string,
  { onProgress, reduced = false }: { onProgress?: (f: number) => void; reduced?: boolean } = {},
): Promise<WatchViewer> {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  // at least 1.5x on a 1x screen: the bracelet's fine edges shimmer at 1x
  renderer.setPixelRatio(Math.min(Math.max(window.devicePixelRatio || 1, 1.5), 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  const canvas = renderer.domElement;
  canvas.className = "w3d-canvas";
  // vertical swipes still scroll the page on a phone; sideways ones turn the watch
  canvas.style.touchAction = "pan-y";

  const scene = new THREE.Scene();
  scene.environment = studio(renderer);
  // the environment gives the metal its edges; these light the non-metal parts (the ceramic
  // bezel, the dial printing), which a dark room alone leaves near black
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
  keyLight.position.set(-1.5, 2.5, 3);
  scene.add(keyLight, new THREE.HemisphereLight(0xffffff, 0x0c0c0e, 0.45));
  const camera = new THREE.PerspectiveCamera(26, 1, 0.001, 50);

  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  const gltf = await new Promise<{ scene: THREE.Group }>((ok, fail) =>
    loader.load(src, ok, (e) => e.total && onProgress?.(e.loaded / e.total), fail),
  );

  // centre the watch on the turntable and size the camera to it
  const model = gltf.scene;
  // Real refraction (KHR_materials_transmission) costs a second render pass, and in WebGL it
  // only bends what is already on screen: the crystal went frosted and the date under the
  // Cyclops went blank. A thin clear glaze reads the same at this size and keeps the dial sharp.
  model.traverse((o) => {
    if (!(o instanceof THREE.Mesh)) return;
    for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
      if (m instanceof THREE.MeshPhysicalMaterial && m.transmission > 0) {
        m.transmission = 0;
        m.thickness = 0;
        m.roughness = 0.02;
        m.transparent = true;
        m.opacity = 0.1;
        m.depthWrite = false;
      }
    }
  });
  // The metal's finish comes from the build (Oystersteel at about 60 % reflectance, satin links
  // brushed with anisotropy, gaps shaded by baked occlusion in the vertex colours); here its
  // reflections are lifted a little against the dark studio so polished edges carry the light.
  const METAL = /^(bracelet|bezel|hands|indices|case|clasp|crown|caseback)/;
  model.traverse((o) => {
    if (!(o instanceof THREE.Mesh)) return;
    if (!METAL.test(o.name) && !METAL.test(o.parent?.name ?? "")) return;
    for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
      if (m instanceof THREE.MeshStandardMaterial) m.envMapIntensity = 1.2;
    }
  });
  const box = new THREE.Box3().setFromObject(model);
  const centre = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  model.position.sub(centre);
  const turn = new THREE.Group();
  turn.add(model);
  scene.add(turn);
  const radius = size.length() / 2;
  const shadow = contactShadow(size.x * 1.5, size.z * 1.9);
  shadow.position.y = -size.y / 2 - radius * 0.002;
  scene.add(shadow);

  const fit = () => {
    const w = host.clientWidth || 1;
    const h = host.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // fit the bounding sphere in whichever side is tighter
    const vFov = (camera.fov * Math.PI) / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
    const sphere = (radius * 1.08) / Math.sin(Math.min(vFov, hFov) / 2);
    // A tall, flat piece (a bar standing up) has a small sphere for its height, so the sphere fit
    // filled the stage top to bottom and ran it under the name bar at the foot. Hold the near edge
    // of anything to 70% of the stage height; the watches sit at about 68% and stay as they were.
    const tall = size.y / 2 / (0.7 * Math.tan(vFov / 2)) + Math.hypot(size.x, size.z) / 2;
    const dist = Math.max(sphere, tall);
    camera.position.set(0, radius * 0.12, dist);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    dirty = true;
  };

  // turntable state: yaw spins freely, pitch is held to a gentle tilt
  const START = { yaw: -0.38, pitch: 0.06 };
  let yaw = START.yaw;
  let pitch = START.pitch;
  let vYaw = 0;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let lastInput = 0;
  let dirty = true;
  const IDLE_AFTER = 2600;
  const IDLE_SPEED = 0.22; // rad/s, about one turn every 28 s

  const down = (e: PointerEvent) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    vYaw = 0;
    lastInput = performance.now();
    canvas.setPointerCapture(e.pointerId);
    host.dataset.grab = "1";
  };
  const move = (e: PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    const k = 5.2 / Math.max(host.clientWidth, 320);
    vYaw = dx * k;
    yaw += vYaw;
    if (e.pointerType !== "touch") pitch = Math.max(-0.45, Math.min(0.55, pitch + dy * k * 0.7));
    lastInput = performance.now();
    dirty = true;
  };
  const up = (e: PointerEvent) => {
    dragging = false;
    lastInput = performance.now();
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    delete host.dataset.grab;
  };
  canvas.addEventListener("pointerdown", down);
  canvas.addEventListener("pointermove", move);
  canvas.addEventListener("pointerup", up);
  canvas.addEventListener("pointercancel", up);

  // keyboard: arrows turn it, for anyone not using a pointer
  canvas.tabIndex = 0;
  canvas.setAttribute("role", "img");
  const key = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 0.6 : 0.2;
    if (e.key === "ArrowLeft") yaw -= step;
    else if (e.key === "ArrowRight") yaw += step;
    else if (e.key === "ArrowUp") pitch = Math.max(-0.45, pitch - step / 2);
    else if (e.key === "ArrowDown") pitch = Math.min(0.55, pitch + step / 2);
    else return;
    e.preventDefault();
    lastInput = performance.now();
    dirty = true;
  };
  canvas.addEventListener("keydown", key);

  // render only while it is on screen, the tab is showing and the stage shows the model (not
  // the photo, which the canvas only fades out over)
  let visible = true;
  let active = true;
  const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) kick(); }, { threshold: 0.01 });
  io.observe(host);
  const ro = new ResizeObserver(fit);
  ro.observe(host);
  const onVis = () => document.visibilityState === "visible" && kick();
  document.addEventListener("visibilitychange", onVis);

  let raf = 0;
  let prev = performance.now();
  const frame = (now: number) => {
    raf = 0;
    const dt = Math.min(0.05, (now - prev) / 1000);
    prev = now;
    let moving = false;
    if (!dragging && Math.abs(vYaw) > 0.0004) {
      vYaw *= Math.pow(0.0025, dt); // inertia after a flick
      yaw += vYaw;
      moving = true;
    }
    if (!reduced && !dragging && now - lastInput > IDLE_AFTER) {
      yaw += IDLE_SPEED * dt;
      moving = true;
    }
    if (moving || dragging || dirty) {
      turn.rotation.set(pitch, yaw, 0, "XYZ");
      renderer.render(scene, camera);
      dirty = false;
    }
    if (active && visible && document.visibilityState === "visible" && (moving || dragging || !reduced)) raf = requestAnimationFrame(frame);
  };
  const kick = () => {
    if (active && !raf) {
      prev = performance.now();
      raf = requestAnimationFrame(frame);
    }
  };
  canvas.addEventListener("pointerdown", kick);
  canvas.addEventListener("keydown", kick);

  host.appendChild(canvas);
  fit();
  kick();

  return {
    reset: () => {
      yaw = START.yaw;
      pitch = START.pitch;
      vYaw = 0;
      lastInput = performance.now();
      dirty = true;
      kick();
    },
    setActive: (on: boolean) => {
      active = on;
      if (on) kick();
      else {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    destroy: () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach((m) => {
            Object.values(m).forEach((v) => v instanceof THREE.Texture && v.dispose());
            m.dispose();
          });
        }
      });
      scene.environment?.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}
