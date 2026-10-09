/**
 * Whether the device can draw WebGL in hardware. A context the browser can only render in software
 * (SwiftShader, llvmpipe: a blocklisted GPU, a virtual machine, the servers PageSpeed Insights and
 * Lighthouse run on) turns a mark that spins on its own into a slideshow that holds up the page,
 * so there the still poster is shown instead (pre-launch QA, 8 Oct 2026: software WebGL took
 * /about to 207 s of blocked main thread). `failIfMajorPerformanceCaveat` asks the browser to
 * refuse such a context; Chrome does not when it was started on SwiftShader, so the renderer's
 * name is checked too.
 */
const SOFTWARE = /swiftshader|llvmpipe|softpipe|software|basic render/i;

export function hasFastWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    const o: WebGLContextAttributes = { failIfMajorPerformanceCaveat: true };
    const gl = c.getContext("webgl2", o) || c.getContext("webgl", o);
    if (!gl) return false;
    // Firefox gives the real renderer here (and warns if the debug extension is asked for);
    // Chrome and Safari say "WebKit WebGL" and keep it behind the extension
    let renderer = String(gl.getParameter(gl.RENDERER) ?? "");
    if (/^webkit webgl$/i.test(renderer)) {
      const info = gl.getExtension("WEBGL_debug_renderer_info");
      if (info) renderer = String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL) ?? "");
    }
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return !SOFTWARE.test(renderer);
  } catch {
    return false;
  }
}
