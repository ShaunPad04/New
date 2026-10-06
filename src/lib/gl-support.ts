/**
 * Is this browser's WebGL2 a CPU rasteriser (or missing)? A software renderer
 * reports itself in the renderer string; on one, a live WebGL scene stalls
 * scrolling (the chrome monogram's SwiftShader lesson, CLAUDE.md), so callers
 * keep their static fallback. Shared by the /ai hero core and its backdrop.
 * The answer is kept: probing makes a throwaway WebGL context, so once a visit.
 */
let known: boolean | undefined;

export function isSoftwareGL(): boolean {
  known ??= probe();
  return known;
}

function probe(): boolean {
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
