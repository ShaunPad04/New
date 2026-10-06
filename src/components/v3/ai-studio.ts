import { BackSide, Color, Mesh, MeshBasicMaterial, PlaneGeometry, Scene, SphereGeometry } from "three";

export const RED = new Color(0xf02b42);

/**
 * The /ai chrome's studio: a black room with white key strips and red rims
 * behind, for chrome to reflect. No HDR is downloaded; the room is built in
 * code and baked to an environment map with PMREM by the caller.
 *
 * Shared by the hero core (`ai-core-scene.ts`, the defaults) and the Möbius
 * strip on the "0" card (`ai-mobius-scene.ts`: red rims at 0.6 and three
 * broad white softboxes, so the band reads as chrome, not red glass).
 */
export function studio({ red = 1, softboxes = 0 }: { red?: number; softboxes?: number } = {}): Scene {
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
  const rim = (k: number) => RED.clone().multiplyScalar(k * red);
  strip(3, 40, [-6, 2, 18], white(1.6), 0.4); // face-on key diagonal
  strip(1.2, 40, [5, 0, 18], white(0.9), 0.4);
  strip(40, 3, [0, 18, 2], white(1.1)); // overhead, for the crown
  strip(6, 50, [-20, 0, -4], rim(2.6), 0.2); // red rims, left and right
  strip(6, 50, [20, 0, -4], rim(2.2), -0.2);
  strip(30, 30, [0, 0, -22], rim(0.9)); // red glow behind
  strip(30, 3, [0, -16, 4], rim(0.8)); // red floor bounce
  if (softboxes > 0) {
    strip(9, 40, [9, 5, 15], white(1.3 * softboxes), -0.3);
    strip(40, 7, [0, 19, 6], white(1.5 * softboxes));
    strip(6, 30, [-13, -4, 12], white(0.9 * softboxes), 0.5);
  }
  return env;
}
