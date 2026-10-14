"""
Santos de Cartier, large model, ref. WSSA0055 (watch 36) -- procedural Blender build.

Run (the same bpy 5.2 venv as ../rolex):
    python build_santos.py            -> santos.blend + santos.glb

Measured off S&L's studio image of the watch (36-b1707791.cut.2026-10-07-3.webp, 17.14 px/mm)
and sized to Cartier's figures (47.5 x 39.8 mm, 9.38 mm thick):
  case 39.8 wide; the horns run in from the flanks on an S-curve to a 26.6 mm end at
  y = +-23.75 (half-widths 13.3, 14.1, 14.6, 15.3, 16.4, 17.7, 18.8, 19.4, 19.7, 19.9 at
  y = 23.75 ... 10.8); a polished chamfer 2.5 mm wide runs round the top edge, the flat tops of
  the horns are brushed
  bezel ADLC (black), 34.7 mm square, corners r 4.3, opening 27.5 mm, r 2.4; eight slotted
  screws, two to a side, 8.1 mm off the axis and 16.3 out
  crown: seven-sided, set with a green faceted synthetic spinel, between pointed guards on
  the 3 o'clock flank (out to x 22.1); the crown's tip at x 24.0
  dial: santos_tex.py (green sunray, railroad track, applied Eastern Arabic numerals)
  hands: sword hands at 10:09 with the seconds at 36 s, as photographed
  caseback (Cartier's own parts diagram for the 4072 case): a rounded-square steel plate held by
  eight screws, two to a side; a satin centre, a polished border, no window
  strap: black rubber in pads 5.2 mm apart, two steel screws on each, 22 mm at the case
  tapering to 18 then 16.5; a steel folding clasp
Frame as ../rolex/build.py: mm, x to 3 o'clock, y to 12, z out of the dial, origin mid-case;
emitted upright with the dial facing -Y.
"""
import os
import sys
import math
import time
import numpy as np
import bpy
from shapely.geometry import Polygon, Point, box
from shapely.ops import unary_union
from shapely import affinity

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(HERE, '..', 'rolex'))
import gmt_geo as G          # noqa: E402  the SDF kernel shared with the Rolex build
import santos_tex as TX      # noqa: E402

TEX = os.path.join(HERE, 'tex')
os.makedirs(TEX, exist_ok=True)
T0 = time.time()


def log(*a):
    print('[%6.1fs]' % (time.time() - T0), *a, flush=True)


# ------------------------------------------------------------------ frame
ROT = np.array([[1, 0, 0], [0, 0, -1], [0, 1, 0]], dtype=np.float64)
MM = 0.001


def to_world(V):
    return (np.asarray(V) @ ROT.T) * MM


def nrm_world(N):
    return np.asarray(N) @ ROT.T


def smoothstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


# ------------------------------------------------------------------ dimensions
HW, HL = 19.90, 23.75          # case half width, half length (lug to lug)
Z_TOP = 1.40                   # case top under the bezel
Z_BACK = -3.40                 # case bottom (caseback below)
BZ_H, BZ_R = 17.36, 4.30       # bezel half side, corner radius
OP_H, OP_R = 13.75, 2.40       # opening = dial
BZ_TOP = 3.95
CRY_BOT, CRY_TOP = 3.30, 4.45
DIAL_Z = 1.95                  # top of the dial plate
CROWN_Z = -1.30
HORN = [(23.75, 13.30), (22.30, 14.10), (20.85, 14.60), (19.40, 15.30), (18.05, 16.40), (16.60, 17.70),
        (15.15, 18.80), (13.70, 19.40), (12.25, 19.70), (10.80, 19.90)]


# ------------------------------------------------------------------ materials
MATS = {}


def principled(name, base=(0.8, 0.8, 0.8), metallic=0.0, rough=0.5, ior=1.5, transmission=0.0,
               base_tex=None, normal_tex=None, normal_strength=1.0, coat=0.0, coat_rough=0.03, spec=0.5, aniso=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    b = nt.nodes.new('ShaderNodeBsdfPrincipled')
    nt.links.new(b.outputs['BSDF'], out.inputs['Surface'])
    b.inputs['Base Color'].default_value = (*base, 1.0)
    b.inputs['Metallic'].default_value = metallic
    b.inputs['Roughness'].default_value = rough
    b.inputs['IOR'].default_value = ior
    b.inputs['Transmission Weight'].default_value = transmission
    b.inputs['Specular IOR Level'].default_value = spec
    if aniso > 0:
        b.inputs['Anisotropic'].default_value = aniso
        tg = nt.nodes.new('ShaderNodeTangent')
        tg.direction_type = 'UV_MAP'
        nt.links.new(tg.outputs['Tangent'], b.inputs['Tangent'])
    if coat > 0:
        b.inputs['Coat Weight'].default_value = coat
        b.inputs['Coat Roughness'].default_value = coat_rough
    if base_tex:
        t = nt.nodes.new('ShaderNodeTexImage')
        t.image = bpy.data.images.load(base_tex, check_existing=True)
        t.image.colorspace_settings.name = 'sRGB'
        t.interpolation = 'Cubic'
        nt.links.new(t.outputs['Color'], b.inputs['Base Color'])
    if normal_tex:
        t = nt.nodes.new('ShaderNodeTexImage')
        t.image = bpy.data.images.load(normal_tex, check_existing=True)
        t.image.colorspace_settings.name = 'Non-Color'
        nm = nt.nodes.new('ShaderNodeNormalMap')
        nm.inputs['Strength'].default_value = normal_strength
        nt.links.new(t.outputs['Color'], nm.inputs['Color'])
        nt.links.new(nm.outputs['Normal'], b.inputs['Normal'])
    MATS[name] = m
    return m


def brushed_normal(path, W=1024):
    """Fine straight graining along u, as a tangent-space normal map."""
    rng = np.random.default_rng(4072)
    rows = rng.normal(0, 1, W).astype(np.float32)
    rows = np.convolve(rows, np.ones(3) / 3, 'same')
    h = np.tile(rows[:, None], (1, W))
    gy = np.gradient(h, axis=0) * 0.35
    n = np.stack([np.zeros_like(gy), -gy, np.ones_like(gy)], -1)
    n /= np.linalg.norm(n, axis=-1, keepdims=True)
    from PIL import Image
    Image.fromarray(((n * 0.5 + 0.5) * 255).astype(np.uint8), 'RGB').save(path)
    return path


def build_materials():
    log('textures')
    dial = TX.make_dial(os.path.join(TEX, 'dial.png'), 4096)
    br = brushed_normal(os.path.join(TEX, 'brushed_normal.png'))
    log('materials')
    # Cartier steel: the same reflectance as the Rolex builds' Oystersteel (about 60 %)
    principled('steel_polished', base=(0.64, 0.635, 0.62), metallic=1.0, rough=0.075)
    principled('steel_brushed', base=(0.58, 0.575, 0.56), metallic=1.0, rough=0.30, normal_tex=br, normal_strength=0.8, aniso=0.7)
    # ADLC: a black diamond-like carbon coat over brushed steel, a dark graphite sheen
    principled('adlc', base=(0.085, 0.085, 0.09), metallic=1.0, rough=0.32, normal_tex=br, normal_strength=0.6, aniso=0.5)
    principled('adlc_polished', base=(0.07, 0.07, 0.075), metallic=1.0, rough=0.10)
    principled('applied', base=(0.88, 0.87, 0.85), metallic=1.0, rough=0.16)
    principled('lume', base=(0.86, 0.88, 0.86), metallic=0.0, rough=0.5)
    principled('dial', base=(0.02, 0.06, 0.04), metallic=0.0, rough=0.16, base_tex=dial, coat=1.0, coat_rough=0.05)
    principled('sapphire', base=(1.0, 1.0, 1.0), metallic=0.0, rough=0.0, ior=1.77, transmission=1.0, spec=0.12)
    # the crown's stone: a faceted green synthetic spinel (opaque stand-in, glossy, high edge reflection)
    principled('spinel', base=(0.02, 0.30, 0.13), metallic=0.0, rough=0.03, ior=1.72, spec=1.0, coat=1.0, coat_rough=0.02)
    principled('rubber', base=(0.020, 0.020, 0.022), metallic=0.0, rough=0.62, spec=0.35)
    principled('black', base=(0.004, 0.004, 0.004), metallic=0.0, rough=0.4)


# ------------------------------------------------------------------ emit
COLL = {}


def coll(name):
    if name not in COLL:
        c = bpy.data.collections.new(name)
        bpy.context.scene.collection.children.link(c)
        COLL[name] = c
    return COLL[name]


def emit(name, V, F, N=None, mats=('steel_polished',), mat_idx=None, uv=None, sharp=None):
    V = np.asarray(V, dtype=np.float64)
    Vw = to_world(V)
    Fa = None
    try:
        Fa = np.asarray(F, dtype=np.int64)
        if Fa.ndim != 2:
            Fa = None
    except Exception:
        Fa = None
    if Fa is not None:
        me = G.mesh_from_arrays(name, Vw, Fa)
    else:
        me = bpy.data.meshes.new(name)
        me.from_pydata(Vw.tolist(), [], [list(f) for f in F])
        me.update()
    if uv is not None:
        uvl = me.uv_layers.new(name='UVMap')
        li = np.zeros(len(me.loops), dtype=np.int64)
        me.loops.foreach_get('vertex_index', li)
        uvl.data.foreach_set('uv', np.asarray(uv, dtype=np.float32)[li].ravel())
    for mn in mats:
        me.materials.append(MATS[mn])
    if mat_idx is not None:
        me.polygons.foreach_set('material_index', np.asarray(mat_idx, dtype=np.int32))
    if N is not None:
        me.shade_smooth()
        me.normals_split_custom_set_from_vertices([tuple(n) for n in nrm_world(N)])
    elif sharp is not None:
        G.mark_sharp(me, sharp)
    else:
        me.shade_smooth()
    ob = bpy.data.objects.new(name, me)
    coll('watch').objects.link(ob)
    return ob


def me_arrays(me):
    V = np.zeros(len(me.vertices) * 3)
    me.vertices.foreach_get('co', V)
    F = [tuple(p.vertices) for p in me.polygons]
    return V.reshape(-1, 3), F


def slab(geom, z0, z1, bevel=0.0, seg=3, spacing=0.05):
    me = G.shape_slab('tmp', geom, z0, z1, bevel=bevel, bevel_seg=seg, spacing=spacing)
    V, F = me_arrays(me)
    bpy.data.meshes.remove(me)
    return V, F


def merge(parts):
    Vs, Fs, off = [], [], 0
    for V, F in parts:
        Vs.append(np.asarray(V))
        Fs.extend([tuple(i + off for i in f) for f in F])
        off += len(V)
    return np.concatenate(Vs, 0), Fs


def rsq(x, y, h, r):
    """signed distance to a rounded square of half side h, corner radius r"""
    qx = np.abs(x) - (h - r)
    qy = np.abs(y) - (h - r)
    return np.sqrt(np.maximum(qx, 0) ** 2 + np.maximum(qy, 0) ** 2) + np.minimum(np.maximum(qx, qy), 0) - r


def rsq_geom(hx, hy, r):
    return box(-hx + r, -hy + r, hx - r, hy - r).buffer(r, quad_segs=24)


# ------------------------------------------------------------------ case
def case_outline():
    """The case seen from above: the flanks, the horns' S-curve and their flat ends."""
    from scipy.interpolate import PchipInterpolator
    ys = np.array([p[0] for p in HORN])[::-1]
    xs = np.array([p[1] for p in HORN])[::-1]
    f = PchipInterpolator(ys, xs)
    yq = np.linspace(HL, HORN[-1][0], 80)
    right = [(f(y), y) for y in yq] + [(HW, 0.0)]
    pts = right + [(x, -y) for x, y in reversed(right[:-1])]
    pts = pts + [(-x, y) for x, y in reversed(pts)]
    poly = Polygon(pts).buffer(0)
    # round the convex corners where the flat ends meet the horns
    return poly.buffer(-0.9, join_style=1).buffer(0.9, join_style=1, quad_segs=16)


class PlanSDF:
    """2D signed distance to a shapely polygon, from a fine raster (Euclidean distance
    transform), sampled bilinearly."""

    def __init__(self, poly, res=0.015, pad=3.0):
        from PIL import Image, ImageDraw
        from scipy import ndimage
        minx, miny, maxx, maxy = poly.bounds
        self.x0, self.y0, self.res = minx - pad, miny - pad, res
        W = int((maxx - minx + 2 * pad) / res) + 1
        H = int((maxy - miny + 2 * pad) / res) + 1
        im = Image.new('L', (W, H), 0)
        dr = ImageDraw.Draw(im)
        polys = [poly] if poly.geom_type == 'Polygon' else list(poly.geoms)
        for p in polys:
            dr.polygon([((x - self.x0) / res, (y - self.y0) / res) for x, y in p.exterior.coords], fill=255)
            for h in p.interiors:
                dr.polygon([((x - self.x0) / res, (y - self.y0) / res) for x, y in h.coords], fill=0)
        m = np.array(im) > 127                     # [row = y, col = x]
        din = ndimage.distance_transform_edt(m) * res
        dout = ndimage.distance_transform_edt(~m) * res
        D = np.where(m, -din + res / 2, dout - res / 2)
        # the raster's stair-steps would show as speckle in the polished flanks' reflections:
        # smooth them out (a 0.04 mm blur) and sample with a cubic spline
        D = ndimage.gaussian_filter(D, 2.5)
        self.D = ndimage.spline_filter(D, order=3).astype(np.float32)

    def __call__(self, x, y):
        from scipy.ndimage import map_coordinates
        c = (np.asarray(x) - self.x0) / self.res
        r = (np.asarray(y) - self.y0) / self.res
        return map_coordinates(self.D, [r.ravel(), c.ravel()], order=3, mode='nearest', prefilter=False).reshape(np.shape(x))


GUARD = [(19.2, 7.40), (20.3, 6.55), (21.75, 5.05), (22.10, 3.70), (21.45, 2.80), (20.30, 2.62),
         (20.30, -2.62), (21.45, -2.80), (22.10, -3.70), (21.75, -5.05), (20.3, -6.55), (19.2, -7.40)]


class CaseSDF:
    def __init__(self):
        self.outline = case_outline()
        self.plan = PlanSDF(self.outline)
        self.guard = G.rounded_polygon(GUARD, [0.0, 0.8, 0.9, 0.7, 0.35, 0.2, 0.2, 0.35, 0.7, 0.9, 0.8, 0.0], deg_step=4.0)

    def zt(self, y):
        return Z_TOP - 1.05 * smoothstep(17.0, HL, np.abs(y)) ** 1.3

    def zb(self, y):
        return Z_BACK + 0.55 * smoothstep(16.0, HL, np.abs(y))

    def o2d(self, x, y):
        """the two plan distances, case and crown guard, packed as one complex number so the
        mesher (gmt_geo.polygonize) evaluates them once per column, not once per voxel"""
        d = self.plan(x, y)
        dg = np.full(np.shape(x), 1e3)
        m = x > 18.0
        if np.any(m):
            dg[m] = G.sdf_polygon(x[m], y[m], self.guard)
        return d + 1j * dg

    def __call__(self, P, o=None):
        x, y, z = P[:, 0], P[:, 1], P[:, 2]
        if o is None:
            o = self.o2d(x, y)
        d, dg = o.real, o.imag
        zt, zb = self.zt(y), self.zb(y)
        cs = 0.62                                   # the polished chamfer: 2.5 mm in, 1.55 mm down
        ch = ((z - zt) + (d + 2.5) * cs) / math.sqrt(1 + cs * cs)
        ftop = G.smax(z - zt, ch, 0.35)
        f = np.maximum(G.round_isect(d, ftop, 0.30), G.round_isect(d, zb - z, 0.90))
        if (dg < 5).any():
            fg = np.maximum(G.round_isect(dg, z - (CROWN_Z + 1.25), 0.35), G.round_isect(dg, (CROWN_Z - 1.45) - z, 0.35))
            f = G.smin(f, fg, 0.55)
        return f


def build_case():
    log('case')
    f = CaseSDF()
    me, V, T, N = G.sdf_mesh('case_tmp', f, (-20.4, -24.3, -3.6), (22.6, 24.3, 1.55), 0.065, 60000, key='santos-case-2')
    bpy.data.meshes.remove(me)
    c, n = G.face_centers_normals(V, T, N)
    outside_bezel = (np.abs(c[:, 0]) > BZ_H - 0.2) | (np.abs(c[:, 1]) > BZ_H - 0.2)
    brushed = (n[:, 2] > 0.93) & outside_bezel & (c[:, 2] > -0.5)
    uv = np.stack([V[:, 0] / 4.0, V[:, 1] / 4.0], -1)
    emit('case', V, T, N=N, mats=('steel_polished', 'steel_brushed'), mat_idx=brushed.astype(np.int32), uv=uv)
    return f


# ------------------------------------------------------------------ bezel
class BezelSDF:
    def __call__(self, P):
        x, y, z = P[:, 0], P[:, 1], P[:, 2]
        do = rsq(x, y, BZ_H, BZ_R)
        di = rsq(x, y, OP_H, OP_R)
        f = G.round_isect(do, z - BZ_TOP, 0.55)
        f = np.maximum(f, Z_TOP - 0.05 - z)
        # the opening: a polished bevel from the crystal up to the top face
        g = -(di - np.maximum(z - 3.30, 0) * 0.55)
        return G.smax(f, g, 0.12)


def build_bezel():
    log('bezel')
    me, V, T, N = G.sdf_mesh('bezel_tmp', BezelSDF(), (-17.6, -17.6, Z_TOP - 0.2), (17.6, 17.6, BZ_TOP + 0.1), 0.05,
                             36000, key='santos-bezel-2')
    bpy.data.meshes.remove(me)
    c, n = G.face_centers_normals(V, T, N)
    di = rsq(c[:, 0], c[:, 1], OP_H, OP_R)
    pol = (di < 0.50) & (c[:, 2] > 3.0)            # the bevel round the crystal is polished
    # brushed straight along each side of the frame
    ax, ay = np.abs(V[:, 0]), np.abs(V[:, 1])
    side = ax > ay
    uv = np.where(side[:, None], np.stack([V[:, 1], V[:, 0]], -1), np.stack([V[:, 0], V[:, 1]], -1)) / 4.0
    emit('bezel', V, T, N=N, mats=('adlc', 'adlc_polished'), mat_idx=pol.astype(np.int32), uv=uv)


# ------------------------------------------------------------------ screws
class ScrewSDF:
    """A slotted screw head, domed, 1.32 mm across, standing 0.30 on its seat (z = 0)."""
    R0, HT = 0.66, 0.30

    def __call__(self, P):
        x, y, z = P[:, 0], P[:, 1], P[:, 2]
        Rs = (self.R0 ** 2 + self.HT ** 2) / (2 * self.HT)
        cap = np.sqrt(x * x + y * y + (z - (self.HT - Rs)) ** 2) - Rs
        f = np.maximum(cap, -0.12 - z)
        slot = np.maximum(np.abs(x) - 0.085, (self.HT - 0.17) - z)
        return G.smax(f, -slot, 0.02)


SCREW = {}


def screw_unit():
    if 'V' not in SCREW:
        me, V, T, N = G.sdf_mesh('screw_tmp', ScrewSDF(), (-0.75, -0.75, -0.15), (0.75, 0.75, 0.36), 0.018, 900,
                                 key='santos-screw-1')
        bpy.data.meshes.remove(me)
        SCREW.update(V=V, T=T, N=N)
    return SCREW['V'], SCREW['T'], SCREW['N']


def frame_from(nz, ref=(0.0, 1.0, 0.0)):
    nz = np.asarray(nz, float)
    nz /= np.linalg.norm(nz)
    rx = np.cross(ref, nz)
    if np.linalg.norm(rx) < 1e-6:
        rx = np.cross((1.0, 0, 0), nz)
    rx /= np.linalg.norm(rx)
    ry = np.cross(nz, rx)
    return np.stack([rx, ry, nz], 1)        # columns


def screws(name, placements, mats=('steel_polished',)):
    """placements: (position, normal, slot angle deg)"""
    V0, T0_, N0 = screw_unit()
    Vs, Ts, Ns, off = [], [], [], 0
    for pos, nz, ang in placements:
        a = math.radians(ang)
        Rz = np.array([[math.cos(a), -math.sin(a), 0], [math.sin(a), math.cos(a), 0], [0, 0, 1]])
        M = frame_from(nz) @ Rz
        Vs.append(V0 @ M.T + np.asarray(pos))
        Ns.append(N0 @ M.T)
        Ts.append(T0_ + off)
        off += len(V0)
    emit(name, np.concatenate(Vs), np.concatenate(Ts), N=np.concatenate(Ns), mats=mats)


SLOTS = [23, 118, 67, 152, 41, 96, 171, 12, 134, 58, 88, 147, 31, 109, 74, 160]


def build_bezel_screws():
    log('bezel screws')
    pts = [(8.1, 16.3), (-8.1, 16.3), (8.1, -16.3), (-8.1, -16.3), (16.3, 8.1), (16.3, -8.1), (-16.3, 8.1), (-16.3, -8.1)]
    bz = BezelSDF()
    pl = []
    for i, (x, y) in enumerate(pts):
        # the top face is flat there; seat the head a hair into it
        pl.append(((x, y, BZ_TOP - 0.03), (0, 0, 1), SLOTS[i]))
    screws('bezel_screws', pl)


# ------------------------------------------------------------------ crystal, dial, indices
def build_crystal():
    log('crystal')
    g = rsq_geom(OP_H + 0.25, OP_H + 0.25, OP_R + 0.2)
    V, F = slab(g, CRY_BOT, CRY_TOP, bevel=0.18, seg=3, spacing=0.12)
    emit('crystal', V, F, mats=('sapphire',))


def build_dial():
    log('dial')
    g = rsq_geom(OP_H, OP_H, OP_R)
    V, F = slab(g, DIAL_Z - 0.25, DIAL_Z, spacing=0.10)
    uv = np.stack([(V[:, 0] + OP_H) / (2 * OP_H), (V[:, 1] + OP_H) / (2 * OP_H)], -1)
    emit('dial', V, F, mats=('dial',), uv=uv, sharp=30.0)


def build_indices():
    log('numerals')
    parts = []
    for h, x, y in TX.NUMERALS:
        g = TX.numeral_geom(h, x, y)
        parts.append(slab(g, DIAL_Z - 0.02, DIAL_Z + 0.24, bevel=0.07, seg=2, spacing=0.03))
    # the date window's polished frame
    dx, dy, dw, dh = TX.DATE
    fr = box(dx - dw / 2 - 0.28, dy - dh / 2 - 0.28, dx + dw / 2 + 0.28, dy + dh / 2 + 0.28).buffer(0.12, join_style=1)
    fr = fr.difference(box(dx - dw / 2, dy - dh / 2, dx + dw / 2, dy + dh / 2))
    parts.append(slab(fr, DIAL_Z - 0.02, DIAL_Z + 0.16, bevel=0.05, seg=2, spacing=0.04))
    V, F = merge(parts)
    emit('indices', V, F, mats=('applied',), sharp=45.0)


# ------------------------------------------------------------------ hands
def sword(L, w, base=0.30, hub=0.0, tail=0.0):
    """A Cartier sword hand pointing up +y, from its hub out to the tip at L."""
    p = Polygon([(-base / 2, -tail), (-w / 2, L * 0.70), (0.0, L), (w / 2, L * 0.70), (base / 2, -tail)])
    if hub:
        p = p.union(Point(0, 0).buffer(hub, quad_segs=24))
    return p


def hand(name, g, z0, z1, deg, lume=None, bevel=0.10):
    """deg: clockwise from 12"""
    parts = [slab(g, z0, z1, bevel=bevel, seg=2, spacing=0.03)]
    V, F = merge(parts)
    a = -math.radians(deg)
    R = np.array([[math.cos(a), -math.sin(a), 0], [math.sin(a), math.cos(a), 0], [0, 0, 1]])
    emit(name, V @ R.T, F, mats=('steel_polished',), sharp=40.0)
    if lume is not None:
        V, F = slab(lume, z1 - 0.04, z1 + 0.02, bevel=0.0, spacing=0.03)
        emit(name + '_lume', V @ R.T, F, mats=('lume',), sharp=40.0)


def build_hands():
    log('hands')
    # hour 304 deg, minute 54 deg, seconds 218 deg (measured off the photograph)
    hg = sword(8.0, 1.50, base=0.55, hub=0.80)
    hand('hand_hour', hg, 2.30, 2.44, 304.0, lume=sword(6.9, 0.78, base=0.24).difference(Point(0, 0).buffer(1.25)))
    mg = sword(11.7, 1.15, base=0.45, hub=0.70)
    hand('hand_minute', mg, 2.52, 2.66, 54.0, lume=sword(10.5, 0.55, base=0.20).difference(Point(0, 0).buffer(1.25)))
    sg = box(-0.08, -2.6, 0.08, 11.9).union(Point(0, 0).buffer(0.45, quad_segs=16))
    hand('hand_second', sg, 2.74, 2.80, 218.0, bevel=0.0)
    V, F = slab(Point(0, 0).buffer(0.42, quad_segs=24), 2.80, 2.92, bevel=0.05, seg=2, spacing=0.03)
    emit('hand_cap', V, F, mats=('steel_polished',), sharp=40.0)


# ------------------------------------------------------------------ crown
def build_crown():
    log('crown')
    n = 7
    R = 2.15
    hept = Polygon([(R * math.cos(2 * math.pi * k / n + math.pi / 2), R * math.sin(2 * math.pi * k / n + math.pi / 2)) for k in range(n)])
    X0, L = 20.25, 2.75
    V, F = slab(hept.buffer(-0.05, join_style=1).buffer(0.05, join_style=1), 0.0, L, bevel=0.30, seg=3, spacing=0.05)
    stem_V, stem_F = slab(Point(0, 0).buffer(0.95, quad_segs=24), -0.75, 0.05, spacing=0.05)
    Vc, Fc = merge([(V, F), (stem_V, stem_F)])
    # crown frame (u, v, w) -> watch: w along +x
    W = np.stack([X0 + Vc[:, 2], Vc[:, 0], CROWN_Z + Vc[:, 1]], -1)
    emit('crown', W, Fc, mats=('steel_polished',), sharp=40.0)
    # the spinel: a faceted dome on the crown's end
    rg, hgt, ns = 1.45, 0.78, 8
    pts = [(0.0, 0.0, hgt)]
    rings = [(0.55, hgt * 0.92), (1.05, hgt * 0.66), (rg, 0.0)]
    for i, (r, z) in enumerate(rings):
        off = (i % 2) * math.pi / ns
        for k in range(ns):
            a = 2 * math.pi * k / ns + off
            pts.append((r * math.cos(a), r * math.sin(a), z))
    P = np.array(pts)
    Fg = []
    for k in range(ns):
        Fg.append((0, 1 + k, 1 + (k + 1) % ns))
    for i in range(len(rings) - 1):
        a0, b0 = 1 + i * ns, 1 + (i + 1) * ns
        for k in range(ns):
            k2 = (k + 1) % ns
            Fg.append((a0 + k, b0 + k, b0 + k2))
            Fg.append((a0 + k, b0 + k2, a0 + k2))
    Wg = np.stack([X0 + L - 0.05 + P[:, 2], P[:, 0], CROWN_Z + P[:, 1]], -1)
    emit('crown_gem', Wg, Fg, mats=('spinel',), sharp=1.0)


# ------------------------------------------------------------------ caseback
class BackSDF:
    def __call__(self, P):
        x, y, z = P[:, 0], P[:, 1], P[:, 2]
        d = rsq(x, y, 16.6, 4.3)
        r2 = (x * x + y * y) / (16.6 ** 2)
        zb = -4.72 - 0.18 * np.clip(1 - r2, 0, 1)
        f = G.round_isect(d, zb - z, 0.55)
        return np.maximum(f, z - (Z_BACK + 0.05))


def build_caseback():
    log('caseback')
    me, V, T, N = G.sdf_mesh('back_tmp', BackSDF(), (-17.0, -17.0, -5.05), (17.0, 17.0, Z_BACK + 0.2), 0.06, 20000, key='santos-back-1')
    bpy.data.meshes.remove(me)
    c, n = G.face_centers_normals(V, T, N)
    satin = (rsq(c[:, 0], c[:, 1], 13.2, 3.0) < 0) & (n[:, 2] < -0.9)
    uv = np.stack([V[:, 0] / 4.0, V[:, 1] / 4.0], -1)
    emit('caseback', V, T, N=N, mats=('steel_polished', 'steel_brushed'), mat_idx=satin.astype(np.int32), uv=uv)
    pts = [(8.8, 14.6), (-8.8, 14.6), (8.8, -14.6), (-8.8, -14.6), (14.9, 7.6), (14.9, -7.6), (-14.9, 7.6), (-14.9, -7.6)]
    pl = []
    for i, (x, y) in enumerate(pts):
        r2 = (x * x + y * y) / (16.6 ** 2)
        z = -4.72 - 0.18 * max(0.0, 1 - r2)
        pl.append(((x, y, z + 0.03), (0, 0, -1), SLOTS[8 + i]))
    screws('caseback_screws', pl)


# ------------------------------------------------------------------ strap
PITCH = 5.20


def bezier(P0, P1, P2, P3, n=3000):
    t = np.linspace(0, 1, n)[:, None]
    return ((1 - t) ** 3) * P0 + 3 * ((1 - t) ** 2) * t * P1 + 3 * (1 - t) * t * t * P2 + t ** 3 * P3


def resample(poly, step):
    seg = np.linalg.norm(np.diff(poly, axis=0), axis=1)
    s = np.concatenate([[0], np.cumsum(seg)])
    q = np.arange(0, s[-1], step)
    return np.stack([np.interp(q, s, poly[:, 0]), np.interp(q, s, poly[:, 1])], -1), s[-1]


ZB = -49.0          # the back of the wrist (local z)
CLASP = 26.0        # the folding clasp's length, centred under the case


def strap_paths():
    """Two arcs in the y-z plane: from each horn round the wrist to an end of the clasp."""
    a0 = math.radians(-14.0)
    top = bezier(np.array([HL - 1.6, -1.05]), np.array([HL - 1.6 + 26 * math.cos(a0), -1.05 + 26 * math.sin(a0)]),
                 np.array([CLASP / 2 + 17.0, ZB]), np.array([CLASP / 2, ZB]))
    bot = top * np.array([-1.0, 1.0])
    return top, bot


def sweep_strap(path, step=0.12):
    """Rubber pads along a path (y, z), the case end first: a rounded-rectangle section whose top
    dips into a groove between pads; returns verts, faces, pad centres (s) and the frame."""
    P, Ltot = resample(path, step)
    nP = len(P)
    T = np.gradient(P, axis=0)
    T /= np.linalg.norm(T, axis=1)[:, None]
    # outward normal: away from the wrist (at the case: +z)
    Nn = np.stack([-T[:, 1], T[:, 0]], -1)
    if Nn[0, 1] < 0:
        Nn = -Nn
    s = np.arange(nP) * step
    w = np.interp(s, [0, 15, Ltot], [22.0, 18.0, 16.5])
    t = np.interp(s, [0, 12, Ltot], [3.30, 2.90, 2.60])
    k_end = int(Ltot // PITCH)
    grooves = np.arange(1, k_end + 1) * PITCH
    dip = np.zeros(nP)
    for g in grooves:
        dip = np.maximum(dip, np.exp(-((s - g) / 0.42) ** 2))
    # section: a rounded rectangle, top corners r 1.0, bottom r 0.7, fixed vertex count
    def section(hw, ht, d):
        top = ht - 0.85 * d
        hw2 = hw - 0.35 * d
        rt, rb = min(1.0, top + ht - 0.1), 0.7
        pts = []
        for k in range(9):                                  # top edge, left to right
            pts.append((-hw2 + rt + (2 * hw2 - 2 * rt) * k / 8, top))
        for k in range(1, 7):                               # top-right corner
            a = math.pi / 2 - (math.pi / 2) * k / 6
            pts.append((hw2 - rt + rt * math.cos(a), top - rt + rt * math.sin(a)))
        for k in range(1, 4):                               # right side
            pts.append((hw2, top - rt - (top - rt + ht - rb) * k / 4))
        for k in range(0, 6):                               # bottom-right corner
            a = 0 - (math.pi / 2) * k / 5
            pts.append((hw2 - rb + rb * math.cos(a), -ht + rb + rb * math.sin(a)))
        for k in range(1, 8):                               # bottom edge, right to left
            pts.append((hw2 - rb - (2 * hw2 - 2 * rb) * k / 8, -ht))
        for k in range(0, 6):                               # bottom-left corner
            a = -math.pi / 2 - (math.pi / 2) * k / 5
            pts.append((-hw2 + rb + rb * math.cos(a), -ht + rb + rb * math.sin(a)))
        for k in range(1, 4):                               # left side
            pts.append((-hw2, -ht + rb + (top - rt + ht - rb) * k / 4))
        for k in range(0, 6):                               # top-left corner
            a = math.pi - (math.pi / 2) * k / 6
            pts.append((-hw2 + rt + rt * math.cos(a), top - rt + rt * math.sin(a)))
        return np.array(pts)
    secs = [section(w[i] / 2, t[i] / 2, dip[i]) for i in range(nP)]
    m = len(secs[0])
    V = np.zeros((nP * m, 3))
    for i in range(nP):
        sx, sn = secs[i][:, 0], secs[i][:, 1]
        V[i * m:(i + 1) * m, 0] = sx
        V[i * m:(i + 1) * m, 1] = P[i, 0] + Nn[i, 0] * sn
        V[i * m:(i + 1) * m, 2] = P[i, 1] + Nn[i, 1] * sn
    F = []
    for i in range(nP - 1):
        a, b = i * m, (i + 1) * m
        for j in range(m):
            j2 = (j + 1) % m
            F.append((a + j, a + j2, b + j2, b + j))
    # end caps (flat)
    for i, flip in ((0, True), (nP - 1, False)):
        base = i * m
        cen = len(V)
        V = np.vstack([V, V[base:base + m].mean(0)])
        for j in range(m):
            j2 = (j + 1) % m
            F.append((base + j2, base + j, cen) if flip else (base + j, base + j2, cen))
    uv = np.zeros((len(V), 2))
    uv[:nP * m, 0] = np.repeat(s / 10.0, m)
    uv[:nP * m, 1] = np.tile(np.linspace(0, 1, m), nP)
    pads = (np.arange(0, k_end) + 0.5) * PITCH
    return V, F, uv, P, Nn, T, s, w, t, pads, Ltot


def build_strap():
    log('strap')
    top, bot = strap_paths()
    parts, uvs, pl = [], [], []
    for path in (top, bot):
        V, F, uv, P, Nn, T, s, w, t, pads, L = sweep_strap(path)
        log('  strap side: %.1f mm, %d pads' % (L, len(pads)))
        parts.append((V, F))
        uvs.append(uv)
        for k, sp in enumerate(pads):
            i = int(np.clip(round(sp / (s[1] - s[0])), 0, len(P) - 1))
            hw = w[i] / 2
            for sx in (-(hw - 3.95), hw - 3.95):
                pos = (sx, P[i, 0] + Nn[i, 0] * t[i] / 2, P[i, 1] + Nn[i, 1] * t[i] / 2)
                pl.append((pos, (0.0, Nn[i, 0], Nn[i, 1]), SLOTS[(k * 2 + (sx > 0)) % len(SLOTS)]))
    V, F = merge(parts)
    emit('strap', V, F, mats=('rubber',), uv=np.concatenate(uvs))
    screws('clasp_screws', pl)
    # the folding clasp across the back of the wrist: brushed, polished edges, as wide as the strap
    # there and bowed a little with the wrist, so it does not read as a flat mirror
    g = rsq_geom(8.3, CLASP / 2 + 1.6, 1.4)
    V, F = slab(g, 0.0, 2.0, bevel=0.45, seg=3, spacing=0.10)
    # slab frame (x across, y along, z up) -> watch: its top is the outer face, facing -z
    Wc = np.stack([V[:, 0], V[:, 1], ZB + 1.0 - V[:, 2] + 0.010 * V[:, 1] ** 2], -1)
    emit('clasp', Wc, F, mats=('steel_brushed',), uv=np.stack([V[:, 1] / 4.0, V[:, 0] / 4.0], -1), sharp=40.0)


# ------------------------------------------------------------------ join, AO, export
JOIN = {
    'hands_hour': ['hand_hour', 'hand_hour_lume'],
    'hands_minute': ['hand_minute', 'hand_minute_lume'],
    'hands_second': ['hand_second', 'hand_cap'],
    'crown': ['crown', 'crown_gem'],
}


def join_objects():
    for target, names in JOIN.items():
        obs = [bpy.data.objects[n] for n in names if n in bpy.data.objects]
        if not obs:
            continue
        act = obs[0]
        if len(obs) > 1:
            with bpy.context.temp_override(active_object=act, object=act, selected_objects=obs, selected_editable_objects=obs):
                bpy.ops.object.join()
        act.name = target
        act.data.name = target


AO_PARTS = ('case', 'bezel', 'crown', 'caseback', 'strap', 'clasp')


def bake_ao():
    scn = bpy.context.scene
    scn.render.engine = 'CYCLES'
    scn.cycles.device = 'CPU'
    scn.cycles.samples = 96
    if scn.world is None:
        scn.world = bpy.data.worlds.new('ao')
    scn.world.light_settings.distance = 0.0015
    for name in AO_PARTS:
        ob = bpy.data.objects.get(name)
        if ob is None:
            continue
        me = ob.data
        ca = me.color_attributes.get('AO') or me.color_attributes.new('AO', 'FLOAT_COLOR', 'POINT')
        me.color_attributes.active_color = ca
        for o in bpy.data.objects:
            o.select_set(False)
        ob.select_set(True)
        bpy.context.view_layer.objects.active = ob
        bpy.ops.object.bake(type='AO', target='VERTEX_COLORS')
        n = len(ca.data)
        c = np.empty(n * 4, np.float32)
        ca.data.foreach_get('color', c)
        c = c.reshape(-1, 4)
        v = 0.40 + 0.60 * np.clip(c[:, 0], 0, 1) ** 1.2
        c[:, 0] = c[:, 1] = c[:, 2] = v
        c[:, 3] = 1.0
        ca.data.foreach_set('color', c.ravel())
        log('ao %s: %d points, mean %.2f' % (name, n, float(v.mean())))
    for o in bpy.data.objects:
        o.select_set(False)


def export_glb(path):
    meshes = [o for o in bpy.data.objects if o.type == 'MESH']
    for o in meshes:
        o.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    bpy.ops.export_scene.gltf(
        filepath=path, export_format='GLB', use_selection=True, export_apply=True, export_yup=True,
        export_texcoords=True, export_normals=True, export_tangents=True,
        export_vertex_color='NAME', export_vertex_color_name='AO', export_all_vertex_colors=False,
        export_materials='EXPORT', export_image_format='AUTO', export_cameras=False, export_lights=False, export_extras=False)
    n = 0
    for o in meshes:
        o.data.calc_loop_triangles()
        n += len(o.data.loop_triangles)
    return n


def main():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    build_materials()
    build_case()
    build_bezel()
    build_bezel_screws()
    build_crystal()
    build_dial()
    build_indices()
    build_hands()
    build_crown()
    build_caseback()
    if '--head' not in sys.argv:
        build_strap()
    join_objects()
    if '--head' not in sys.argv and '--no-ao' not in sys.argv:
        bake_ao()
    out = os.path.join(HERE, 'santos.blend')
    bpy.ops.wm.save_as_mainfile(filepath=out)
    glb = os.path.join(HERE, 'santos.glb')
    ntri = export_glb(glb)
    log('exported %s: %d triangles, %.2f MB' % (glb, ntri, os.path.getsize(glb) / 1e6))
    for o in sorted(bpy.data.objects, key=lambda o: o.name):
        if o.type == 'MESH':
            o.data.calc_loop_triangles()
            log('   %-16s %7d tris' % (o.name, len(o.data.loop_triangles)))


if __name__ == '__main__':
    main()
