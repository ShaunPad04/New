"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/**
 * ICED MATCHA — the interactive 3D hero.
 *
 * The template's hero carries a three.js scene the visitor can spin. Its
 * model was a coffee cup from a third-party asset library, so rather than
 * ship someone else's file this scene is built procedurally: a tapered
 * tumbler, a two-layer matcha-over-milk pour, ice and a paper straw. No
 * model or texture is downloaded — the whole thing is geometry and
 * materials, and the environment lighting is generated on the GPU.
 *
 * Interaction: drag (mouse or touch) to spin, with inertia; the glass
 * tilts gently toward the pointer; it idles on a slow turn. Vertical
 * touch drags still scroll the page (`touch-action: pan-y`).
 *
 * Performance: pixel ratio is capped, transmission renders at half
 * resolution, the loop only runs while the canvas is on screen and the
 * tab is visible, and everything is disposed on unmount. Under
 * `prefers-reduced-motion` the drink neither floats nor turns on its own —
 * it renders once and re-renders only while the visitor is dragging it.
 */

const MILK = new THREE.Color("#f4ecdd");
const MATCHA = new THREE.Color("#7f9a5b");
const MATCHA_TOP = new THREE.Color("#9fb47e");

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function buildGlass() {
  const pts: THREE.Vector2[] = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.72, 0),
    new THREE.Vector2(0.76, 0.06),
    new THREE.Vector2(0.95, 2.56),
    new THREE.Vector2(0.97, 2.62),
    new THREE.Vector2(0.92, 2.64),
    new THREE.Vector2(0.88, 2.56),
    new THREE.Vector2(0.69, 0.24),
    new THREE.Vector2(0, 0.24),
  ];
  const geometry = new THREE.LatheGeometry(pts, 96);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 1,
    thickness: 0.35,
    roughness: 0.04,
    ior: 1.48,
    metalness: 0,
    envMapIntensity: 1.1,
    clearcoat: 0.2,
    clearcoatRoughness: 0.1,
  });
  return new THREE.Mesh(geometry, material);
}

function buildLiquid() {
  const height = 2.02;
  const geometry = new THREE.CylinderGeometry(0.84, 0.69, height, 96, 24, false);
  const position = geometry.attributes.position;
  const colors = new Float32Array(position.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < position.count; i++) {
    const y = position.getY(i) / height + 0.5; // 0 bottom → 1 top
    // Milk below, a soft pour line, matcha above.
    let t = THREE.MathUtils.smoothstep(y, 0.4, 0.62);
    // Slight swirl so the pour line is not a hard ring.
    const x = position.getX(i);
    const z = position.getZ(i);
    t = THREE.MathUtils.clamp(t + Math.sin(Math.atan2(z, x) * 3) * 0.06 * (1 - t) * t * 4, 0, 1);
    c.copy(MILK).lerp(MATCHA, t);
    if (y > 0.9) c.lerp(MATCHA_TOP, (y - 0.9) * 6);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const material = new THREE.MeshPhysicalMaterial({
    vertexColors: true,
    roughness: 0.42,
    metalness: 0,
    clearcoat: 0.35,
    clearcoatRoughness: 0.3,
    envMapIntensity: 0.6,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = 0.25 + height / 2;
  return mesh;
}

function buildFoam() {
  const geometry = new THREE.SphereGeometry(0.83, 64, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const material = new THREE.MeshPhysicalMaterial({
    color: MATCHA_TOP,
    roughness: 0.7,
    metalness: 0,
    envMapIntensity: 0.4,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.set(1, 0.09, 1);
  mesh.position.y = 2.27;
  return mesh;
}

function buildIce() {
  const rand = seeded(7);
  const group = new THREE.Group();
  const geometry = new RoundedBoxGeometry(0.44, 0.44, 0.44, 3, 0.09);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.92,
    thickness: 0.5,
    roughness: 0.18,
    ior: 1.31,
    envMapIntensity: 1.2,
  });
  const spots: Array<[number, number, number]> = [
    [0.22, 2.05, 0.18],
    [-0.3, 1.9, 0.05],
    [0.05, 2.22, -0.32],
    [-0.12, 1.62, 0.35],
    [0.34, 1.7, -0.3],
  ];
  for (const [x, y, z] of spots) {
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, z);
    cube.rotation.set(rand() * Math.PI, rand() * Math.PI, rand() * Math.PI);
    const s = 0.85 + rand() * 0.3;
    cube.scale.setScalar(s);
    group.add(cube);
  }
  return group;
}

function buildStraw() {
  const geometry = new THREE.CylinderGeometry(0.055, 0.055, 3.3, 24);
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#d9a99b"),
    roughness: 0.55,
    metalness: 0,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0.28, 1.75, -0.15);
  mesh.rotation.z = -0.16;
  mesh.rotation.x = 0.06;
  return mesh;
}

function buildShadow() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, 10, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(43,29,24,0.42)");
    g.addColorStop(0.45, "rgba(43,29,24,0.16)");
    g.addColorStop(1, "rgba(43,29,24,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 3.6), material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = -0.02;
  return mesh;
}

export function HeroScene({ onReady }: { onReady?: () => void }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    if ("transmissionResolutionScale" in renderer) {
      (renderer as THREE.WebGLRenderer & { transmissionResolutionScale: number })
        .transmissionResolutionScale = 0.5;
    }
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 40);

    const key = new THREE.DirectionalLight(new THREE.Color("#fff1e0"), 1.6);
    key.position.set(3, 6, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(new THREE.Color("#e9d6ff"), 0.5);
    fill.position.set(-4, 2, -3);
    scene.add(fill);

    const drink = new THREE.Group();
    drink.add(buildLiquid(), buildFoam(), buildIce(), buildStraw(), buildGlass());
    drink.position.y = -1.32;

    const rig = new THREE.Group();
    rig.add(drink, buildShadow());
    rig.children[1].position.y = -1.34;
    scene.add(rig);

    // ---- Interaction state ----
    let dragging = false;
    let lastX = 0;
    let velocity = 0;
    let spin = 0.55;
    let tiltX = 0;
    let tiltZ = 0;
    let targetTiltX = 0;
    let targetTiltZ = 0;
    let visible = true;
    let pageVisible = !document.hidden;
    let raf = 0;
    let running = false;
    let intro = reduced ? 1 : 0;
    const clock = new THREE.Clock();

    const fit = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const distance = camera.aspect < 1 ? 7.9 / Math.max(camera.aspect, 0.62) * 0.92 : 7.4;
      camera.position.set(0, 0.35, distance);
      camera.lookAt(0, -0.05, 0);
      camera.updateProjectionMatrix();
    };

    const render = () => renderer.render(scene, camera);

    const frame = () => {
      raf = 0;
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      if (intro < 1) intro = Math.min(1, intro + dt / 1.4);
      const ease = 1 - Math.pow(1 - intro, 3);

      if (!dragging) {
        velocity *= Math.pow(0.02, dt); // exponential decay, frame-rate independent
        spin += velocity * dt * 60;
        if (!reduced) spin += 0.16 * dt;
      }
      tiltX += (targetTiltX - tiltX) * Math.min(1, dt * 4);
      tiltZ += (targetTiltZ - tiltZ) * Math.min(1, dt * 4);

      rig.rotation.y = spin;
      rig.rotation.x = 0.12 + tiltX;
      rig.rotation.z = tiltZ;
      rig.position.y = reduced ? 0 : Math.sin(t * 0.9) * 0.05;
      rig.scale.setScalar(0.88 + 0.12 * ease);
      rig.position.x = 0;

      render();

      const settled =
        reduced && !dragging && Math.abs(velocity) < 0.0005 && Math.abs(targetTiltX - tiltX) < 0.001;
      if (running && visible && pageVisible && !settled) {
        raf = requestAnimationFrame(frame);
      } else {
        running = false;
      }
    };

    const start = () => {
      if (running || !visible || !pageVisible) return;
      running = true;
      clock.getDelta();
      raf = requestAnimationFrame(frame);
    };

    // ---- Pointer ----
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragging = true;
      lastX = e.clientX;
      velocity = 0;
      host.setPointerCapture(e.pointerId);
      host.style.cursor = "grabbing";
      start();
    };
    const onMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      if (dragging) {
        const dx = e.clientX - lastX;
        lastX = e.clientX;
        const step = dx * 0.0085;
        spin += step;
        velocity = step;
        start();
        return;
      }
      if (e.pointerType === "mouse") {
        targetTiltX = ny * 0.16;
        targetTiltZ = -nx * 0.1;
        start();
      }
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      host.style.cursor = "grab";
      try {
        host.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
      start();
    };
    const onLeave = () => {
      targetTiltX = 0;
      targetTiltZ = 0;
      start();
    };

    host.addEventListener("pointerdown", onDown);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerup", onUp);
    host.addEventListener("pointercancel", onUp);
    host.addEventListener("pointerleave", onLeave);

    const ro = new ResizeObserver(() => {
      fit();
      render();
    });
    ro.observe(host);

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible) start();
      },
      { threshold: 0.05 }
    );
    io.observe(host);

    const onVisibility = () => {
      pageVisible = !document.hidden;
      if (pageVisible) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    fit();
    render();
    onReady?.();
    start();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      host.removeEventListener("pointerdown", onDown);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerup", onUp);
      host.removeEventListener("pointercancel", onUp);
      host.removeEventListener("pointerleave", onLeave);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          for (const m of mats) {
            const mat = m as THREE.Material & { map?: THREE.Texture | null };
            mat.map?.dispose();
            mat.dispose();
          }
        }
      });
      scene.environment?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onReady]);

  return (
    <div
      ref={hostRef}
      className="absolute inset-0 cursor-grab select-none"
      style={{ touchAction: "pan-y" }}
      aria-hidden="true"
    />
  );
}
