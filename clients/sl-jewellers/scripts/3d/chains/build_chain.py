"""Chains for the product page's 3D view, built in Blender (bpy 5.2).

    python build_chain.py <spec.json> <out.glb>

spec: {"path": "46.json",            # chain_path.py's output: the line down the chain, in pixels
       "type": "curb" | "cuban" | "rope" | "belcher",
       "width_px": 54, "pitch_px": 45, "mm_per_px": 0.22,
       "clasp": {"kind": "box" | "lobster" | "none", "at": [452, 260] | "top", "len": 1.5, "wid": 1.0},
       "metal": [0.96, 0.78, 0.52], "rough": 0.16}
The chain hangs upright as in its photo, facing the camera (-Y), the line in the XZ plane. Links
are signed distance fields meshed once (the watch build's kernel, ../rolex/gmt_geo.py) and placed
along the line, alternating as real links do; the rope is swept strands. Symmetric links make
the back the mirror of the front, as the studio back image shows. Millimetres in the build,
metres in the file.
"""
import json
import math
import os
import sys

import bpy
import bmesh  # noqa: E402  (only importable once bpy is)
import numpy as np
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'rolex'))
import gmt_geo as G  # noqa: E402

MM = 0.001


# ------------------------------------------------------------------ the line
def load_path(spec):
    j = json.load(open(spec['path'] if os.path.isabs(spec['path']) else os.path.join(os.path.dirname(SPEC_PATH), spec['path'])))
    P = np.array(j['path'], float)
    closed = j['closed']
    if not closed:
        # a little more smoothing than the extractor's: the U should not ripple link by link
        P = np.column_stack([ndimage.gaussian_filter1d(P[:, 0], 6, mode='nearest'),
                             ndimage.gaussian_filter1d(P[:, 1], 6, mode='nearest')])
    s = spec['mm_per_px']
    c = (P.max(0) + P.min(0)) / 2
    X = (P[:, 0] - c[0]) * s
    Z = -(P[:, 1] - c[1]) * s
    Q = np.column_stack([X, Z])
    seg = np.linalg.norm(np.diff(np.vstack([Q, Q[:1]]) if closed else Q, axis=0), axis=1)
    cum = np.r_[0, np.cumsum(seg)]
    if closed:
        Q = np.vstack([Q, Q[:1]])
    return Q, cum, closed, c, s


def frame_at(Q, cum, d):
    """Point and unit tangent at arc length d along the line (XZ)."""
    d = np.clip(d, 0, cum[-1] - 1e-6)
    i = np.searchsorted(cum, d) - 1
    i = int(np.clip(i, 0, len(Q) - 2))
    t = (d - cum[i]) / max(cum[i + 1] - cum[i], 1e-9)
    p = Q[i] * (1 - t) + Q[i + 1] * t
    a, b = Q[max(i - 2, 0)], Q[min(i + 3, len(Q) - 1)]
    tg = (b - a) / (np.linalg.norm(b - a) + 1e-12)
    return p, tg


def to_world(p, tg, local):
    """Link-frame points (x along the chain, y across it in the plane, z toward the camera)
    to Blender world, in mm."""
    tx, tz = tg
    nx, nz = -tz, tx
    x, y, z = local[:, 0], local[:, 1], local[:, 2]
    return np.column_stack([p[0] + x * tx + y * nx, -z, p[1] + x * tz + y * nz])


def to_world_dir(tg, local):
    return to_world(np.zeros(2), tg, local)


def rot_x(V, a):
    c, s = math.cos(a), math.sin(a)
    out = V.copy()
    out[:, 1] = V[:, 1] * c - V[:, 2] * s
    out[:, 2] = V[:, 1] * s + V[:, 2] * c
    return out


# ------------------------------------------------------------------ links (SDF)
class CurbLink:
    """An oval ring of round wire, twisted along its length and ground flat on both faces: the
    curb link. Cuban links are the same, thicker, rounder and less ground."""

    def __init__(self, L, W, r, twist, grind):
        self.c = L / 2 - W / 2
        self.R = W / 2 - r
        self.r, self.tw, self.h, self.L = r, twist, grind, L

    def __call__(self, P):
        x, y, z = P[:, 0], P[:, 1], P[:, 2]
        a = self.tw * np.clip(x / (self.L / 2), -1, 1)
        ca, sa = np.cos(a), np.sin(a)
        y2 = y * ca - z * sa
        z2 = y * sa + z * ca
        q = np.hypot(np.maximum(np.abs(x) - self.c, 0), y2) - self.R
        d = np.hypot(q, z2) - self.r
        return np.maximum(d, np.abs(z) - self.h)


class OvalLink:
    """The belcher's link: an oval ring, its wire D-shaped (flatter toward the camera and away)."""

    def __init__(self, a, b, r, flat):
        self.a, self.b, self.r, self.f = a, b, r, flat

    def __call__(self, P):
        x, y, z = P[:, 0], P[:, 1], P[:, 2]
        # distance to an ellipse, approximated by scaling to a circle
        k = np.hypot(x / self.a, y / self.b)
        q = (k - 1) * min(self.a, self.b)
        return np.hypot(q, z / self.f) * self.f - self.r


class Barrel:
    """A link standing on edge: an oval ring in the plane of the chain line and the depth (x, z),
    its wire a wide flattened band (half-width hy across the chain), so from the front it shows
    a broad textured face, as chain 32's links do."""

    def __init__(self, a, b, r, hy):
        self.a, self.b, self.r, self.hy = a, b, r, hy

    def __call__(self, P):
        x, y, z = P[:, 0], P[:, 1], P[:, 2]
        k = np.hypot(x / self.a, z / self.b)
        q = (k - 1) * min(self.a, self.b)
        return np.hypot(q, y * self.r / self.hy) - self.r


class Ring:
    def __init__(self, R, r):
        self.R, self.r = R, r

    def __call__(self, P):
        x, y, z = P[:, 0], P[:, 1], P[:, 2]
        q = np.hypot(x, y) - self.R
        return np.hypot(q, z) - self.r


class BoxClasp:
    def __init__(self, L, W, T, rr):
        self.h = np.array([L / 2 - rr, W / 2 - rr, T / 2 - rr])
        self.rr = rr

    def __call__(self, P):
        q = np.abs(P) - self.h
        out = np.linalg.norm(np.maximum(q, 0), axis=1) + np.minimum(q.max(1), 0) - self.rr
        # the seam between the box and its tongue, a shallow groove round the middle
        groove = 0.06 * self.rr * np.exp(-(P[:, 0] / (0.04 * self.h[0] + 1e-6)) ** 2)
        return out + groove


class Lobster:
    def __init__(self, L, W, T):
        self.a, self.b, self.c = L / 2, W / 2, T / 2

    def __call__(self, P):
        x, y, z = P[:, 0], P[:, 1], P[:, 2]
        k = np.sqrt((x / self.a) ** 2 + (y / self.b) ** 2 + (z / self.c) ** 2)
        return (k - 1) * min(self.a, self.b, self.c)


def mesh_sdf(name, f, half, h, tris):
    me, V, T, N = G.sdf_mesh(name, f, tuple(-half), tuple(half), h, tris)
    bpy.data.meshes.remove(me)
    return V, T, N


# ------------------------------------------------------------------ rope (swept)
def rope(Q, cum, w, pitch, skip):
    """Four strands wound round the line, each a tube that swells and narrows once per link,
    so it reads as the rope chain's twisted links."""
    n_str, rs = 4, 0.21 * w
    Rh = w / 2 - rs
    Vs, Fs = [], []
    ring = 10
    step = 0.16 * rs
    ds = np.arange(0, cum[-1], step)
    keep = np.ones(len(ds), bool)
    for a, b in skip:
        keep &= ~((ds > a) & (ds < b))
    for k in range(n_str):
        pts, rad = [], []
        for d in ds:
            p, tg = frame_at(Q, cum, d)
            th = 2 * math.pi * d / pitch + 2 * math.pi * k / n_str
            local = np.array([[0.0, Rh * math.cos(th), Rh * math.sin(th)]])
            pts.append(to_world(p, tg, local)[0])
            ph = (d / (pitch / 2)) % 1.0
            rad.append(rs * (0.86 + 0.14 * math.sin(math.pi * ph)))
        pts = np.array(pts)
        rad = np.array(rad)
        # break the tube where the clasp sits
        runs = np.split(np.arange(len(ds)), np.nonzero(np.diff(keep.astype(int)))[0] + 1)
        for run in runs:
            if not keep[run[0]] or len(run) < 3:
                continue
            C = pts[run]
            T = np.gradient(C, axis=0)
            T /= np.linalg.norm(T, axis=1)[:, None] + 1e-12
            up = np.array([0, -1.0, 0])
            N1 = np.cross(T, up)
            N1 /= np.linalg.norm(N1, axis=1)[:, None] + 1e-12
            N2 = np.cross(T, N1)
            base = sum(len(v) for v in Vs)
            ang = np.linspace(0, 2 * math.pi, ring, endpoint=False)
            V = (C[:, None, :] + rad[run][:, None, None] * (np.cos(ang)[None, :, None] * N1[:, None, :] +
                                                             np.sin(ang)[None, :, None] * N2[:, None, :])).reshape(-1, 3)
            F = []
            for i in range(len(run) - 1):
                for j in range(ring):
                    a0 = base + i * ring + j
                    a1 = base + i * ring + (j + 1) % ring
                    F.append((a0, a1, a1 + ring, a0 + ring))
            Vs.append(V)
            Fs += F
    return np.concatenate(Vs), Fs


# ------------------------------------------------------------------ build
def material(name, base, rough, normal_tex=None):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*base, 1)
    b.inputs['Metallic'].default_value = 1.0
    b.inputs['Roughness'].default_value = rough
    if normal_tex:
        nt = m.node_tree
        t = nt.nodes.new('ShaderNodeTexImage')
        t.image = bpy.data.images.load(normal_tex)
        t.image.colorspace_settings.name = 'Non-Color'
        nm = nt.nodes.new('ShaderNodeNormalMap')
        nm.inputs['Strength'].default_value = 1.6
        nt.links.new(t.outputs['Color'], nm.inputs['Color'])
        nt.links.new(nm.outputs['Normal'], b.inputs['Normal'])
    return m


def texture_normal(path, size=512, seed=4):
    """Fine stippled texture (the belcher's engraved links): a noise height field as a normal map."""
    from PIL import Image
    rng = np.random.default_rng(seed)
    h = ndimage.gaussian_filter(rng.normal(0, 1, (size, size)), 2.2, mode='wrap')
    gy, gx = np.gradient(h)
    n = np.stack([-gx * 14, gy * 14, np.ones_like(h)], -1)
    n /= np.linalg.norm(n, axis=2)[..., None]
    Image.fromarray(((n * 0.5 + 0.5) * 255).astype(np.uint8)).save(path)


def add_mesh(name, V, F, mat, uv=None, N=None):
    me = bpy.data.meshes.new(name)
    me.from_pydata((np.asarray(V) * MM).tolist(), [], [list(f) for f in F])
    me.update()
    me.materials.append(mat)
    if uv is not None:
        lay = me.uv_layers.new(name='UVMap')
        li = np.zeros(len(me.loops), dtype=np.int64)
        me.loops.foreach_get('vertex_index', li)
        lay.data.foreach_set('uv', np.asarray(uv, np.float32)[li].ravel())
    # every face outward (mirrored links and swept strands wind either way); glTF draws one side
    bm = bmesh.new()
    bm.from_mesh(me)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me)
    bm.free()
    me.shade_smooth()
    if N is not None:
        # the fields' own normals: smooth metal instead of the decimated mesh's facets
        Nn = np.asarray(N, np.float64)
        Nn /= np.linalg.norm(Nn, axis=1)[:, None] + 1e-12
        me.normals_split_custom_set_from_vertices([tuple(n) for n in Nn])
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    return ob


def build(spec, out):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    Q, cum, closed, c_px, s = load_path(spec)
    w = spec['width_px'] * s
    p = spec['pitch_px'] * s
    kind = spec['type']
    tex = None
    if kind == 'belcher':
        tex = os.path.join(os.path.dirname(out), 'belcher_n.png')
        texture_normal(tex)
    metal = material('metal', tuple(spec['metal']), spec.get('rough', 0.16), normal_tex=tex)
    clasp_metal = material('clasp', tuple(spec['metal']), 0.12)
    # where the clasp sits along the line
    skip = []
    cl = spec.get('clasp', {'kind': 'none'})
    s_cl = None
    if cl['kind'] != 'none':
        if cl['at'] == 'top':
            i = int(np.argmax(Q[:, 1]))
        else:
            px = np.array([(cl['at'][0] - c_px[0]) * s, -(cl['at'][1] - c_px[1]) * s])
            i = int(np.argmin(np.linalg.norm(Q - px, axis=1)))
        s_cl = cum[i]
        half = cl['len'] * w / 2
        skip.append((s_cl - half - 0.15 * p, s_cl + half + 0.15 * p))

    def skipped(d):
        if not skip:
            return False
        a, b = skip[0]
        if closed:
            L = cum[-1]
            return any(a <= dd <= b for dd in (d, d - L, d + L))
        return a <= d <= b

    # ---- links
    if kind in ('curb', 'cuban'):
        # thick wire, small opening, twisted about 45 deg each way so the links lie flat and
        # overlap, then ground flat on both faces (the curb's diamond cut); the Cuban is thicker,
        # rounder and barely ground
        if kind == 'curb':
            L, r, tw, gr, roll = 1.62 * p, 0.215 * w, 0.80, 0.15 * w, 0.22
        else:
            L, r, tw, gr, roll = 1.75 * p, 0.255 * w, 0.88, 0.21 * w, 0.28
        f = CurbLink(L, w, r, tw, gr)
        half = np.array([L / 2 + 0.3, w / 2 + 0.3, w / 2 + 0.3])
        V0, T0, N0 = mesh_sdf('link', f, half, max(0.05, w / 70), 3400)
        n = int(cum[-1] // p)
        if closed:
            # a loop takes a whole, even number of links (the twist alternates), the pitch
            # nudged to fit, so there is no gap where the line starts
            n = int(round(cum[-1] / p))
            n += n % 2
            p = cum[-1] / n
        Vs, Fs, Ns = [], [], []
        for k in range(n + (0 if closed else 1)):
            d = k * p + (0 if closed else 0.5 * p)
            if d > cum[-1] or skipped(d):
                continue
            pt, tg = frame_at(Q, cum, d)
            loc, nl = V0.copy(), N0.copy()
            if k % 2:
                loc[:, 1] *= -1           # alternate twist, as a curb chain's links do
                nl[:, 1] *= -1
            loc = rot_x(loc, roll if k % 2 else -roll)
            nl = rot_x(nl, roll if k % 2 else -roll)
            Vs.append(to_world(pt, tg, loc))
            Ns.append(to_world_dir(tg, nl))
            Fs.append(T0[:, ::-1] if k % 2 else T0)
        base = 0
        F = []
        for V, T in zip(Vs, Fs):
            F += (T + base).tolist()
            base += len(V)
        add_mesh('chain', np.concatenate(Vs), F, metal, N=np.concatenate(Ns))
    elif kind == 'belcher':
        # chain 32, as its photo shows: fat textured barrel links standing on edge (their
        # textured outside faces the camera), each through a plain polished ring lying flat
        # proportions read off the photo: rings nearly the chain's full width with a big opening,
        # the textured links narrower bands whose ends pass through them
        barrel = Barrel(0.42 * w, 0.22 * w, 0.13 * w, 0.27 * w)
        ring = Ring(0.33 * w, 0.11 * w)
        Vo, To, No = mesh_sdf('barrel', barrel, np.array([0.60 * w, 0.32 * w, 0.40 * w]), max(0.03, w / 80), 3000)
        Vr, Tr, Nr = mesh_sdf('ring', ring, np.array([0.48 * w, 0.48 * w, 0.15 * w]), max(0.03, w / 90), 1400)
        n = int(cum[-1] // p)
        if closed:
            n = int(round(cum[-1] / p))
            p = cum[-1] / n
        LV, LF, LN, LU, RV, RF, RN = [], [], [], [], [], [], []
        for k in range(n + 1):
            d = k * p + 0.5 * p
            if d > cum[-1] or skipped(d):
                continue
            pt, tg = frame_at(Q, cum, d)
            LV.append(to_world(pt, tg, Vo))
            LN.append(to_world_dir(tg, No))
            LF.append(To)
            LU.append(np.column_stack([Vo[:, 0] / w, (Vo[:, 1] + Vo[:, 2]) / w]))
            d2 = d + p / 2
            if d2 < cum[-1] - 0.3 * p and not skipped(d2):
                pt2, tg2 = frame_at(Q, cum, d2)
                RV.append(to_world(pt2, tg2, Vr))
                RN.append(to_world_dir(tg2, Nr))
                RF.append(Tr)

        def cat(Vs, Fs):
            base, F = 0, []
            for V, T in zip(Vs, Fs):
                F += (T + base).tolist()
                base += len(V)
            return np.concatenate(Vs), F

        V, F = cat(LV, LF)
        add_mesh('links', V, F, metal, uv=np.concatenate(LU) * 3.0, N=np.concatenate(LN))
        V, F = cat(RV, RF)
        add_mesh('rings', V, F, clasp_metal, N=np.concatenate(RN))
    elif kind == 'rope':
        V, F = rope(Q, cum, w, p, skip)
        add_mesh('chain', V, F, metal)

    # ---- clasp
    if cl['kind'] != 'none':
        pt, tg = frame_at(Q, cum, s_cl % cum[-1])
        if cl['kind'] == 'box':
            Lc, Wc, Tc = cl['len'] * w, cl['wid'] * w, 0.62 * w
            Vc, Tcl, Nc = mesh_sdf('clasp', BoxClasp(Lc, Wc, Tc, 0.10 * w), np.array([Lc / 2 + 0.2, Wc / 2 + 0.2, Tc / 2 + 0.2]),
                                   max(0.04, w / 70), 3000)
            add_mesh('clasp', to_world(pt, tg, Vc), Tcl.tolist(), clasp_metal, N=to_world_dir(tg, Nc))
        else:
            Lc, Wc = cl['len'] * w, cl['wid'] * w
            Vc, Tcl, _ = mesh_sdf('clasp', Lobster(Lc, Wc, 0.5 * Wc), np.array([Lc / 2 + 0.2, Wc / 2 + 0.2, Wc / 4 + 0.2]),
                                  max(0.03, w / 80), 1500)
            add_mesh('clasp', to_world(pt, tg, Vc), Tcl.tolist(), clasp_metal)
            # the rope's end caps either side
            for sg in (-1, 1):
                d = s_cl + sg * (Lc / 2 + 0.55 * w)
                p2, t2 = frame_at(Q, cum, d % cum[-1])
                cyl = lambda P, w=w: np.maximum(np.hypot(P[:, 1], P[:, 2]) - 0.52 * w, np.abs(P[:, 0]) - 0.45 * w)
                Vk, Tk, _ = mesh_sdf('cap', cyl, np.array([0.5 * w, 0.6 * w, 0.6 * w]), max(0.03, w / 80), 800)
                add_mesh('cap', to_world(p2, t2, Vk), Tk.tolist(), clasp_metal)

    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=True, export_yup=True,
                              export_normals=True, export_texcoords=True, export_materials='EXPORT')
    print('exported', out, os.path.getsize(out))


if __name__ == '__main__':
    a = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:]
    SPEC_PATH = os.path.abspath(a[0])
    build(json.load(open(a[0])), a[1])
