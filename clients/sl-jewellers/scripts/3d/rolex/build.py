"""
Rolex GMT-Master II ref. 126710GRNR on Oyster bracelet -- procedural build.

Run:   bpyenv/bin/python build.py            (full build, saves gmt.blend + gmt.glb)
       bpyenv/bin/python build.py --head     (head only, for quick iteration)
       GMT_CACHE=./cache ... build.py        (dev only: cache SDF meshes between runs)

Files (all in this folder, all imported/run from here):
  build.py        this script: materials, case, bezel, insert, crystal+Cyclops,
                  dial/rehaut/date, indices, hands, crown, caseback, studio,
                  join + glTF export
  gmt_tex.py      Pillow texture generators (4096 dial, 4096 insert albedo /
                  metal-rough / normal, date disc, brushed-steel normal) and
                  the vector Rolex coronet
  gmt_geo.py      geometry kernel: SDF -> marching cubes -> decimate ->
                  re-project -> analytic (SDF-gradient) normals; polygon SDFs,
                  fillets, extruded 2D shapes, flute cutter
  gmt_bracelet.py Oyster bracelet loop solver, link / end-link / clasp SDFs
  render.py       Cycles preview renders (not part of the export)
  compare.py      side-by-side with the catalogue image
Python deps in the bpy venv: numpy, Pillow, scipy, scikit-image, shapely,
mapbox_earcut.  Everything is deterministic (fixed noise seeds, no RNG in
geometry), so a rebuild reproduces the same GLB.

Everything is modelled in millimetres in a watch-local frame
    x = toward 3 o'clock, y = toward 12 o'clock, z = out of the dial,
    origin = centre of the case at mid-thickness,
and converted at emit time to Blender world space in metres, upright like the
Rolex catalogue "upright" shot: dial facing -Y (front view), 12 o'clock = +Z.
The glTF exporter then turns Blender +Z into glTF +Y.

MEASUREMENTS (catalogue image m126710grnr-0004, 2400x3571; bezel plane
28.85 px/mm, dial centre at pixel (1200,1782); see notes in comments)
  case diameter 40.0 (bezel teeth silhouette r=577 px)    -> R_CASE 20.0
  bezel coin edge: 60 scallops, one centred at 12 (6.0 deg pitch, measured)
  insert: outer r 19.00, inner r 15.50; numerals r 15.94-18.47 (h 2.53, ~2.9 wide)
          odd-hour dots d 1.0 centred r 16.38; triangle 5.55 wide, r 15.90-18.44
          black/grey split exactly through 6 and 18 (horizontal)
          ALL numerals read clockwise with their tops toward the rim (checked
          on a polar unwrap of the catalogue: the lower ones are inverted).
  rehaut r 13.45-14.25 (ROLEX engraving, coronet at 12); dial edge r 13.45
  minute track r 12.55-13.20; ticks at 28,29,31,32 shortened above SWISS/MADE
  hour dots: centre r 10.85, d 2.2; batons (6, 9) r 8.15-12.35 x 1.73;
  12 triangle r 7.87-12.15, 3.47 wide;  date window centre x 9.2
  coronet 5.10-7.18 (y); ROLEX cap 0.94, 6.8 wide at y 4.23; OYSTER PERPETUAL
  DATE cap 0.59, 12.0 wide, y 3.14; GMT-MASTER II (green) cap 0.64, 6.9 wide,
  y -4.26; SUPERLATIVE CHRONOMETER y -5.30 (8.6 wide); OFFICIALLY CERTIFIED
  y -6.10 (6.5 wide); SWISS (coronet) MADE on the edge at 6.
  hands (clockwise from 12): hour 305 deg (tip r 7.72, Mercedes circle d 2.54
  at r 4.9), minute 62 deg (tip r 12.3), seconds 186 deg (tip r 12.5, lume dot
  d 1.5 at r 6.73, round counterweight d 1.04 at r 4.3), GMT 152 deg (triangle
  base r 9.97 -> tip r 12.77, 2.87 wide).
  lugs: inner faces x=+-10.0 (20 mm lug width); flank line x = 21.16-0.35|y|
  (measured slope 0.35); tips at |y| 23.7 (lug-to-lug 47.4 projected, ~48 real)
  crown guards: flat tips at x 22.2 for |y| 3.4-5.7; crown d 6.1, end at x 23.9
  bracelet: lug width 20 -> 16 at the clasp, link pitch 8.3 (outer gaps at
  2705/2945 px), centre link 44 % of width, centre gaps staggered 2.1 mm.
"""
import os
import sys
import math
import time
import numpy as np
import bpy
import bmesh
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import gmt_tex as TX            # noqa: E402
from variant import NAME as VARIANT, V as VAR, mat as vmat   # noqa: E402
import gmt_geo as G             # noqa: E402
from shapely.geometry import Point, Polygon, LineString, box   # noqa: E402
from shapely.ops import unary_union                         # noqa: E402
from shapely import affinity                                # noqa: E402

TEX = os.path.join(HERE, 'tex' if VARIANT == 'grnr' else 'tex_' + VARIANT)
os.makedirs(TEX, exist_ok=True)
T0 = time.time()


def log(*a):
    print('[%6.1fs]' % (time.time() - T0), *a, flush=True)


# ============================================================ world transform
# local (mm, dial +z) -> world (m, upright, dial facing -Y)
ROT = np.array([[1, 0, 0], [0, 0, -1], [0, 1, 0]], dtype=np.float64)
MM = 0.001


def to_world(V):
    return (np.asarray(V) @ ROT.T) * MM


def nrm_world(N):
    return np.asarray(N) @ ROT.T


# ============================================================ scene
def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.unit_settings.system = 'METRIC'
    sc.unit_settings.scale_length = 1.0
    return sc


COLL = {}


def coll(name):
    if name not in COLL:
        c = bpy.data.collections.new(name)
        bpy.context.scene.collection.children.link(c)
        COLL[name] = c
    return COLL[name]


# ============================================================ materials
MATS = {}


def img(path, colorspace='sRGB'):
    im = bpy.data.images.load(path, check_existing=True)
    im.colorspace_settings.name = colorspace
    return im


def principled(name, base=(0.8, 0.8, 0.8), metallic=0.0, rough=0.5, ior=1.5,
               transmission=0.0, emission=None, emission_strength=0.0,
               base_tex=None, orm_tex=None, normal_tex=None, normal_strength=1.0,
               coat=0.0, coat_rough=0.03, spec=0.5):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    out.location = (400, 0)
    b = nt.nodes.new('ShaderNodeBsdfPrincipled')
    b.location = (0, 0)
    nt.links.new(b.outputs['BSDF'], out.inputs['Surface'])
    b.inputs['Base Color'].default_value = (*base, 1.0)
    b.inputs['Metallic'].default_value = metallic
    b.inputs['Roughness'].default_value = rough
    b.inputs['IOR'].default_value = ior
    b.inputs['Transmission Weight'].default_value = transmission
    if 'Specular IOR Level' in b.inputs:
        b.inputs['Specular IOR Level'].default_value = spec
    if coat > 0:
        b.inputs['Coat Weight'].default_value = coat
        b.inputs['Coat Roughness'].default_value = coat_rough
    if emission is not None:
        b.inputs['Emission Color'].default_value = (*emission, 1.0)
        b.inputs['Emission Strength'].default_value = emission_strength
    y = 300
    if base_tex is not None:
        t = nt.nodes.new('ShaderNodeTexImage')
        t.image = img(base_tex, 'sRGB')
        t.location = (-500, y)
        t.interpolation = 'Cubic'
        nt.links.new(t.outputs['Color'], b.inputs['Base Color'])
        y -= 300
    if orm_tex is not None:
        t = nt.nodes.new('ShaderNodeTexImage')
        t.image = img(orm_tex, 'Non-Color')
        t.location = (-700, y)
        sp = nt.nodes.new('ShaderNodeSeparateColor')
        sp.location = (-300, y)
        nt.links.new(t.outputs['Color'], sp.inputs['Color'])
        nt.links.new(sp.outputs['Green'], b.inputs['Roughness'])
        nt.links.new(sp.outputs['Blue'], b.inputs['Metallic'])
        y -= 300
    if normal_tex is not None:
        t = nt.nodes.new('ShaderNodeTexImage')
        t.image = img(normal_tex, 'Non-Color')
        t.location = (-700, y)
        nm = nt.nodes.new('ShaderNodeNormalMap')
        nm.location = (-300, y)
        nm.inputs['Strength'].default_value = normal_strength
        nt.links.new(t.outputs['Color'], nm.inputs['Color'])
        nt.links.new(nm.outputs['Normal'], b.inputs['Normal'])
    MATS[name] = m
    return m


def build_materials():
    log('textures')
    dial_png = os.path.join(TEX, 'dial.png')
    rehaut_png = os.path.join(TEX, 'rehaut.png') if VAR['dial_style'] == 'datejust' else dial_png
    TX.make_dial_texture(dial_png, 4096, rehaut_path=rehaut_png)
    ins = {k: os.path.join(TEX, 'insert_%s.png' % k) for k in ('albedo', 'orm', 'normal')}
    if VAR['bezel'] == 'insert':
        TX.make_insert_textures(ins, 4096)
    date_png = os.path.join(TEX, 'date.png')
    TX.make_date_texture(date_png, 512, DATE_DISC_W, DATE_DISC_H)
    brushed_png = os.path.join(TEX, 'brushed_normal.png')
    TX.make_brushed_normal(brushed_png, 1024)
    log('materials')
    # 904L steel. glTF metal base colour = F0; 904L reads bright and slightly warm.
    # an all-gold watch: every "steel" part (case, bracelet, clasp, caseback) is the gold
    steel_p = VAR['gold'] if VAR['all_gold'] else (0.80, 0.80, 0.79)
    steel_b = tuple(c * 0.66 for c in VAR['gold']) if VAR['all_gold'] else (0.52, 0.52, 0.51)
    principled('steel_polished', base=steel_p, metallic=1.0, rough=0.075)
    principled('steel_brushed', base=steel_b, metallic=1.0, rough=0.36,
               normal_tex=brushed_png, normal_strength=0.8)
    principled('white_gold', base=(0.86, 0.85, 0.82), metallic=1.0, rough=0.05)
    # applied numerals and baton hands: polished, but with enough sheen to read silver on the dial
    principled('applied', base=(0.88, 0.87, 0.85), metallic=1.0, rough=0.20)
    principled('lume', base=(0.90, 0.92, 0.89), metallic=0.0, rough=0.55,
               emission=(0.75, 0.85, 0.80), emission_strength=0.04)
    principled('dial', base=(0.01, 0.01, 0.01), metallic=0.0, rough=0.12, base_tex=dial_png,
               coat=1.0, coat_rough=0.02)
    principled('rehaut', base=(0.02, 0.02, 0.02), metallic=0.0, rough=0.25, base_tex=rehaut_png)
    if VAR['bezel'] == 'insert':
        principled('ceramic', base=(0.01, 0.01, 0.01), metallic=0.0, rough=0.06,
                   base_tex=ins['albedo'], orm_tex=ins['orm'], normal_tex=ins['normal'], normal_strength=1.0)
    # sapphire, IOR 1.77; Rolex AR-coats the crystal/cyclops, approximated by a
    # reduced specular level (exported as KHR_materials_specular)
    principled('sapphire', base=(1.0, 1.0, 1.0), metallic=0.0, rough=0.0, ior=1.77, transmission=1.0, spec=0.12)
    principled('gmt_green', base=(0.0, 0.20, 0.06), metallic=0.4, rough=0.22)
    principled('date_disc', base=(0.9, 0.9, 0.9), metallic=0.0, rough=0.45, base_tex=date_png)
    principled('black', base=(0.004, 0.004, 0.004), metallic=0.0, rough=0.4)
    if VAR['gold']:
        principled('gold_polished', base=VAR['gold'], metallic=1.0, rough=0.07)
    if VAR['seconds']:
        principled('seconds', base=VAR['seconds'], metallic=0.2, rough=0.25)


# ============================================================ emit
INNER = [1.0]      # x/y scale for the parts inside the bezel (VAR['inner'] while they're built)


def emit(name, V, F, N=None, mats=('steel_polished',), mat_idx=None, uv=None,
         sharp=None, collection='head', M=None):
    """Create a Blender object from local-mm arrays.
    V: (n,3) local mm; F: list/array of faces; N: optional per-vertex normals
    (local) used as custom split normals; uv: per-vertex (n,2)."""
    V = np.asarray(V, dtype=np.float64) * VAR['scale']
    if INNER[0] != 1.0:
        # the Datejust's wider dial: crystal, rehaut, flange and date disc spread across, not up
        V[:, :2] *= INNER[0]
        if N is not None:
            N = np.asarray(N, dtype=np.float64) * np.array([1 / INNER[0], 1 / INNER[0], 1.0])
            N /= np.linalg.norm(N, axis=1)[:, None]
    if M is not None:
        V = V @ M[:3, :3].T + M[:3, 3] * VAR['scale']
        if N is not None:
            Ninv = np.linalg.inv(M[:3, :3]).T
            N = np.asarray(N) @ Ninv.T
            N /= np.linalg.norm(N, axis=1)[:, None]
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
        Nw = nrm_world(N)
        me.shade_smooth()
        me.normals_split_custom_set_from_vertices([tuple(n) for n in Nw])
    elif sharp is not None:
        G.mark_sharp(me, sharp)
    else:
        me.shade_smooth()
    ob = bpy.data.objects.new(name, me)
    coll(collection).objects.link(ob)
    return ob


def mesh_to_arrays(me):
    V = np.zeros(len(me.vertices) * 3)
    me.vertices.foreach_get('co', V)
    F = [tuple(p.vertices) for p in me.polygons]
    return V.reshape(-1, 3), F


# ============================================================ lathe helper
def profile_dense(pts, radii, step=None, deg=12.0):
    """rounded 2D profile (r, z) polyline (open), corners filleted."""
    P = np.asarray(pts, dtype=float)
    out = [P[0]]
    for i in range(1, len(P) - 1):
        p0, p1, p2 = P[i - 1], P[i], P[i + 1]
        r = radii[i] if i < len(radii) else 0
        v1 = p0 - p1
        v2 = p2 - p1
        l1, l2 = np.linalg.norm(v1), np.linalg.norm(v2)
        v1 /= l1
        v2 /= l2
        ang = math.acos(np.clip(np.dot(v1, v2), -1, 1))
        if r <= 0 or ang > math.pi - 1e-3:
            out.append(p1)
            continue
        t = min(r / math.tan(ang / 2), 0.45 * l1, 0.45 * l2)
        r = t * math.tan(ang / 2)
        a = p1 + v1 * t
        b = p1 + v2 * t
        bis = v1 + v2
        bis /= np.linalg.norm(bis)
        c = p1 + bis * (r / math.sin(ang / 2))
        a0 = math.atan2(a[1] - c[1], a[0] - c[0])
        a1 = math.atan2(b[1] - c[1], b[0] - c[0])
        da = a1 - a0
        while da > math.pi:
            da -= 2 * math.pi
        while da < -math.pi:
            da += 2 * math.pi
        n = max(2, int(abs(math.degrees(da)) / deg))
        for k in range(n + 1):
            tt = a0 + da * k / n
            out.append(c + r * np.array([math.cos(tt), math.sin(tt)]))
    out.append(P[-1])
    out = np.array(out)
    if step:
        # subdivide long segments
        res = [out[0]]
        for i in range(1, len(out)):
            L = np.linalg.norm(out[i] - out[i - 1])
            k = max(1, int(math.ceil(L / step)))
            for j in range(1, k + 1):
                res.append(out[i - 1] + (out[i] - out[i - 1]) * j / k)
        out = np.array(res)
    return out


def lathe_arrays(prof, nseg, rfunc=None, theta0=0.0):
    prof = np.asarray(prof, dtype=np.float64)
    m = len(prof)
    th = theta0 + np.arange(nseg) * 2 * math.pi / nseg
    R = np.repeat(prof[:, 0][None, :], nseg, 0)
    Z = np.repeat(prof[:, 1][None, :], nseg, 0)
    TH = np.repeat(th[:, None], m, 1)
    if rfunc is not None:
        R = rfunc(R, TH, Z)
    V = np.stack([R * np.cos(TH), R * np.sin(TH), Z], -1).reshape(-1, 3)
    i = np.arange(nseg)[:, None]
    j = np.arange(m - 1)[None, :]
    i2 = (i + 1) % nseg
    a = i * m + j
    b = i * m + j + 1
    c = i2 * m + j + 1
    d = i2 * m + j
    F = np.stack([a, d, c, b], -1).reshape(-1, 4)
    return V, F, bool((prof[:, 0] < 1e-9).any())


def lathe_obj(name, prof, nseg, mats, rfunc=None, uvR=None, sharp=40.0, M=None,
              collection='head', mat_idx_fn=None, theta0=0.0):
    V, F, has_axis = lathe_arrays(prof, nseg, rfunc, theta0)
    uv = None
    if uvR is not None:
        uv = np.stack([0.5 + V[:, 0] / (2 * uvR), 0.5 + V[:, 1] / (2 * uvR)], -1)
    mi = None
    if mat_idx_fn is not None:
        mi = mat_idx_fn(V, F)
    ob = emit(name, V, F, mats=mats, mat_idx=mi, uv=uv, sharp=None, collection=collection, M=M)
    me = ob.data
    if has_axis:
        bm = bmesh.new()
        bm.from_mesh(me)
        bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-7)
        bm.to_mesh(me)
        bm.free()
    G.mark_sharp(me, sharp)
    return ob


# ============================================================ CASE (SDF)
R_CASE = 20.0
Z_TOP = 1.80          # case top / bezel seat
Z_BACK = -4.00        # case back face
LUG_IN = 10.05        # lug inner faces (20.0 mm lug width + clearance)
LUG_TIP = 23.70       # lug tip |y|
LUG_C = 21.16         # lug flank line x = LUG_C - 0.35|y| (measured slope 0.35)
LUG_SLOPE = 0.35
CROWN_Z = -1.10       # crown axis height (middle of the flank)
CROWN_R = 3.05


def lug_drop(ay):
    # lug tops fall away continuously from under the bezel (C1, zero
    # curvature at the start) to 2.0 mm lower at the lug tip
    d = np.maximum(0.0, ay - 15.0)
    return 2.0 * np.power(d / (LUG_TIP - 15.0), 2.2)


def lug_rise(ay):
    e = np.maximum(0.0, ay - 18.5)
    return 0.70 * np.power(e / 5.2, 1.5)


def smoothstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


class CaseSDF:
    def __init__(self):
        x_tip = LUG_C - LUG_SLOPE * LUG_TIP
        y_t = 6.60
        x_t = LUG_C - LUG_SLOPE * y_t
        self.lug = G.rounded_polygon([(LUG_IN, y_t - 0.4), (x_t, y_t - 0.4 + 0.0), (x_tip, LUG_TIP), (LUG_IN, LUG_TIP)],
                                     [0.0, 0.0, 0.9, 0.35], deg_step=0.6)
        self.guard = G.rounded_polygon([(17.0, 3.40), (22.20, 3.40), (22.20, 5.70), (17.6, 9.40)],
                                       [0.0, 0.45, 1.1, 0.0], deg_step=0.6)

    def o2d(self, x, y):
        ax, ay = np.abs(x), np.abs(y)
        dc = np.sqrt(x * x + y * y) - R_CASE
        dl = G.sdf_polygon(ax, ay, self.lug)
        d = G.smin(dc, dl, 0.9)
        m = x > 14.0
        if VAR['guards'] and m.any():
            dg = np.full(x.shape, 1e3)
            dg[m] = G.sdf_polygon(x[m], ay[m], self.guard)
            d = G.smin(d, dg, 1.0)
        return d

    def heights(self, x, y):
        ay = np.abs(y)
        g = smoothstep(19.4, 22.2, x) * (1 - smoothstep(9.0, 10.5, ay)) * (1.0 if VAR['guards'] else 0.0)
        zt = Z_TOP - lug_drop(ay) - 1.15 * g
        zb = Z_BACK + lug_rise(ay) + 0.85 * g
        return zt, zb

    def __call__(self, P, o=None):
        x, y, z = P[:, 0], P[:, 1], P[:, 2]
        if o is None:
            o = self.o2d(x, y)
        taper = 0.25 * np.clip((Z_TOP - z) / (Z_TOP - Z_BACK), 0, 1.2) ** 2
        d2 = o + taper
        zt, zb = self.heights(x, y)
        dt = G.round_isect(d2, z - zt, 0.38)
        db = G.round_isect(d2, zb - z, 0.95)
        d = np.maximum(dt, db)
        # movement cavity (hidden under bezel / caseback)
        r = np.sqrt(x * x + y * y)
        d = np.maximum(d, 16.30 - r)
        return d


def build_case():
    log('case: polygonize')
    f = CaseSDF()
    import inspect
    key = inspect.getsource(lug_drop) + inspect.getsource(lug_rise) + repr(
        (R_CASE, Z_TOP, Z_BACK, LUG_IN, LUG_TIP, LUG_C, LUG_SLOPE, VAR['guards']))
    me, V, T, N = G.sdf_mesh('case_tmp', f, (-20.6, -24.3, -4.2), (22.5, 24.3, 2.05), 0.07, 48000, key=key)
    bpy.data.meshes.remove(me)
    log('case: %d tris' % len(T))
    c, n = G.face_centers_normals(V, T, N)
    r = np.sqrt(c[:, 0] ** 2 + c[:, 1] ** 2)
    brushed = ((n[:, 2] > 0.90) & (c[:, 2] > -1.0) & (r > 19.6)) | ((n[:, 2] < -0.90) & (c[:, 2] < -3.0))
    mi = brushed.astype(np.int32)
    uv = np.stack([V[:, 0] / 4.0, V[:, 1] / 4.0], -1)    # brushing runs along y (12-6)
    emit('case', V, T, N=N, mats=('steel_polished', 'steel_brushed'), mat_idx=mi, uv=uv)


# ============================================================ BEZEL + INSERT
BZ_R = 20.05
INS_TOP_OUT = 4.50
INS_TOP_IN = 4.62


FL_IN, FL_TOP = 16.25, 4.78       # fluted bezel: inner wall radius, top of the cone


def build_fluted_bezel():
    """A Datejust's fluted bezel: a steep cone from the case edge up to the crystal, cut into 60
    sharp V flutes (counted round the reference) that run the full slope, deepest at the outer
    edge so the silhouette is scalloped, and dying out on the narrow polished top."""
    log('bezel (fluted)')
    prof = profile_dense([
        (FL_IN, 1.80), (19.90, 1.80), (BZ_R, 1.95), (BZ_R, 2.25), (16.80, FL_TOP - 0.04),
        (16.45, FL_TOP), (FL_IN, FL_TOP - 0.22), (FL_IN, 1.85)],
        [0, 0.12, 0.10, 0.10, 0.08, 0.06, 0.04, 0], deg=15.0)
    prof = densify_band(prof, 0.10, lambda p: p[0] > 16.5 and p[1] > 1.9)
    n = 60

    def cut(R, TH, Z):
        frac = np.mod(TH * n / (2 * math.pi) + 0.5, 1.0)
        groove = 1 - np.abs(2 * frac - 1)                      # 0 on a ridge, 1 in a groove
        t = np.clip((Z - 2.25) / (FL_TOP - 2.25), 0, 1)
        depth = 0.52 * (1 - 0.45 * t)
        w = smoothstep(1.90, 2.05, Z) * (1 - smoothstep(FL_TOP - 0.10, FL_TOP - 0.01, Z)) * (R > 16.55)
        return R - depth * w * groove
    lathe_obj('bezel', prof, n * 10, (vmat('bezel', 'white_gold'),), rfunc=cut, sharp=28.0,
              theta0=math.pi / 2)


def build_bezel():
    if VAR['bezel'] == 'fluted':
        return build_fluted_bezel()
    log('bezel')
    # outer (fluted) part.  Cross-section walked with the metal on the left.
    prof_o = profile_dense([
        (18.40, 1.80), (19.85, 1.80), (BZ_R, 2.00), (BZ_R, 3.55),
        (19.27, 4.47), (19.06, 4.52), (19.02, 4.40), (18.40, 4.40)],
        [0, 0.15, 0.12, 0.10, 0.10, 0.03, 0.03, 0], deg=15.0)
    prof_o = densify_band(prof_o, 0.16, lambda p: p[0] > 19.0 and p[1] > 2.1)
    nt = VAR['bezel_teeth']
    cut = G.flute_cut(nt, 20.17, 0.90 * 60 / nt * 1.35 if nt != 60 else 0.90, z_lo=2.30, ramp=0.40, k=0.05,
                      phase=math.pi / 2)
    lathe_obj('bezel', prof_o, nt * (8 if nt == 60 else 5), (vmat('bezel', 'steel_polished'),), rfunc=cut, sharp=50.0)
    # inner lip (no flutes, lower angular resolution)
    prof_i = profile_dense([
        (15.60, 4.40), (15.52, 4.40), (15.50, 4.645), (15.30, 4.645), (15.28, 4.20), (15.60, 1.80)],
        [0, 0, 0.04, 0.05, 0, 0], deg=15.0)
    lathe_obj('bezel_lip', prof_i, 240, (vmat('bezel', 'steel_polished'),), sharp=50.0)
    # Cerachrom insert, slightly conical top, planar UV
    R = TX.INSERT_TEX_R
    prof = profile_dense([
        (15.50, 4.40), (19.00, 4.40), (19.00, INS_TOP_OUT - 0.02), (18.98, INS_TOP_OUT),
        (17.25, (INS_TOP_OUT + INS_TOP_IN) / 2), (15.52, INS_TOP_IN), (15.50, INS_TOP_IN - 0.03), (15.50, 4.40)],
        [0, 0, 0.02, 0, 0, 0, 0.02, 0], deg=20.0)
    lathe_obj('insert', prof, 360, ('ceramic',), uvR=R, sharp=40.0)


def densify_band(prof, step, pred):
    out = [prof[0]]
    for i in range(1, len(prof)):
        a, b = prof[i - 1], prof[i]
        L = np.linalg.norm(b - a)
        if pred(a) or pred(b):
            k = max(1, int(math.ceil(L / step)))
        else:
            k = 1
        for j in range(1, k + 1):
            out.append(a + (b - a) * j / k)
    return np.array(out)


# ============================================================ CRYSTAL (SDF)
CRY_Z0, CRY_Z1, CRY_R = 4.45, 6.00, 15.25
DATE_X = 9.20


def sdf_round_rect(x, y, hx, hy, r):
    qx = np.abs(x) - hx + r
    qy = np.abs(y) - hy + r
    return np.sqrt(np.maximum(qx, 0) ** 2 + np.maximum(qy, 0) ** 2) + np.minimum(np.maximum(qx, qy), 0) - r


CYC_HX, CYC_HY, CYC_RCORNER = 3.50, 3.00, 2.0     # cyclops footprint 7.0 x 6.0 mm
CYC_TOP, CYC_R = 1.55, 5.2                          # dome height above crystal, apex radius (~2x)


def cyclops_height(x, y):
    """Cyclops height above the crystal top (height field, C1).
    Spherical dome (apex radius CYC_R -> ~1.7x magnification of the date),
    rounded-rectangle footprint, steep wall with a fillet at the base and a
    rounded top edge."""
    cx = x - DATE_X
    d = -sdf_round_rect(cx, y, CYC_HX, CYC_HY, CYC_RCORNER)     # inset distance
    d = np.maximum(d, 0.0)
    wall = np.where(d < 0.12, 6.0 * d * d / 0.24, 6.0 * (d - 0.06))
    dome = CYC_TOP - (cx * cx + y * y) / (2 * CYC_R)
    return G.smin(dome, wall, 0.12)


def build_crystal():
    """Sapphire crystal + Cyclops as ONE closed manifold, built from structured
    parts (lathe rim/side/bottom, flat top annulus, ring-grid cyclops) so no
    long tilted triangles disturb the refraction."""
    log('crystal')
    INNER[0] = VAR['inner']
    ncirc = 288
    prof = profile_dense([(0.0, CRY_Z0), (CRY_R, CRY_Z0), (CRY_R, CRY_Z1), (14.60, CRY_Z1)],
                         [0, 0.08, 0.55, 0], deg=9.0)
    # lathe
    m = len(prof)
    th = np.arange(ncirc) * 2 * math.pi / ncirc
    # profile normals (material on the left -> outward normal = (dz, -dr))
    tng = np.gradient(prof, axis=0)
    pn = np.stack([tng[:, 1], -tng[:, 0]], -1)
    pn /= np.linalg.norm(pn, axis=1)[:, None]
    pn[0] = (0, -1)
    pn[-1] = (0, 1)
    V, N, F = [], [], []
    # axis vertex (single)
    V.append((0, 0, CRY_Z0)); N.append((0, 0, -1))
    idx = np.zeros((ncirc, m), dtype=np.int64)
    for i, t in enumerate(th):
        c, s_ = math.cos(t), math.sin(t)
        for j in range(1, m):
            idx[i, j] = len(V)
            V.append((prof[j, 0] * c, prof[j, 0] * s_, prof[j, 1]))
            N.append((pn[j, 0] * c, pn[j, 0] * s_, pn[j, 1]))
        idx[i, 0] = 0
    for i in range(ncirc):
        i2 = (i + 1) % ncirc
        F.append((0, idx[i2, 1], idx[i, 1]))  # bottom fan (faces -z)
        for j in range(1, m - 1):
            F.append((idx[i, j], idx[i2, j], idx[i2, j + 1], idx[i, j + 1]))
    outer_ring = idx[:, m - 1]          # r = 14.60 on the top face
    # cyclops ring grid (scaled copies of the footprint outline)
    nf = 144
    tt = np.linspace(0, 1, nf, endpoint=False)
    fp = G.rounded_polygon([(-CYC_HX, -CYC_HY), (CYC_HX, -CYC_HY), (CYC_HX, CYC_HY), (-CYC_HX, CYC_HY)],
                           [CYC_RCORNER] * 4, deg_step=1.0)
    from shapely.geometry import LinearRing
    lr = LinearRing(fp)
    base = np.array([lr.interpolate(lr.length * t).coords[0] for t in tt])
    base[:, 0] += DATE_X
    scales = np.concatenate([[1.0], 1.0 - np.geomspace(0.002, 0.97, 26)])
    rings = []
    for k, sc_ in enumerate(scales):
        P = np.stack([DATE_X + (base[:, 0] - DATE_X) * sc_, base[:, 1] * sc_], -1)
        h = cyclops_height(P[:, 0], P[:, 1]) if k > 0 else np.zeros(nf)
        z = CRY_Z1 + h
        e = 1e-4
        gx = (cyclops_height(P[:, 0] + e, P[:, 1]) - cyclops_height(P[:, 0] - e, P[:, 1])) / (2 * e)
        gy = (cyclops_height(P[:, 0], P[:, 1] + e) - cyclops_height(P[:, 0], P[:, 1] - e)) / (2 * e)
        if k == 0:
            gx[:] = 0
            gy[:] = 0
        nn = np.stack([-gx, -gy, np.ones(nf)], -1)
        nn /= np.linalg.norm(nn, axis=1)[:, None]
        ri = []
        for q in range(nf):
            ri.append(len(V))
            V.append((P[q, 0], P[q, 1], z[q]))
            N.append(tuple(nn[q]))
        rings.append(ri)
    for k in range(len(rings) - 1):
        a, b = rings[k], rings[k + 1]
        for q in range(nf):
            q2 = (q + 1) % nf
            F.append((a[q], a[q2], b[q2], b[q]))
    apex = len(V)
    V.append((DATE_X, 0.0, CRY_Z1 + cyclops_height(np.array([DATE_X]), np.array([0.0]))[0]))
    N.append((0, 0, 1))
    last = rings[-1]
    for q in range(nf):
        F.append((last[q], last[(q + 1) % nf], apex))
    # flat annulus between r=14.6 circle and the cyclops footprint (earcut)
    import mapbox_earcut as earcut
    Varr = np.array(V)
    outer = Varr[outer_ring][:, :2]
    hole = Varr[rings[0]][:, :2]
    def area(p):
        return 0.5 * np.sum(p[:, 0] * np.roll(p[:, 1], -1) - np.roll(p[:, 0], -1) * p[:, 1])
    o_idx = list(outer_ring)
    h_idx = list(rings[0])
    if area(outer) < 0:
        o_idx = o_idx[::-1]
    if area(hole) > 0:
        h_idx = h_idx[::-1]
    flat = np.concatenate([Varr[o_idx][:, :2], Varr[h_idx][:, :2]])
    ends = np.array([len(o_idx), len(o_idx) + len(h_idx)], dtype=np.uint32)
    tri = earcut.triangulate_float64(flat, ends).reshape(-1, 3)
    all_idx = np.array(o_idx + h_idx)
    for t in tri:
        a, b, c = all_idx[t]
        # ensure +z facing
        pa, pb, pc = Varr[a], Varr[b], Varr[c]
        if np.cross(pb - pa, pc - pa)[2] < 0:
            b, c = c, b
        F.append((a, b, c))
    emit('crystal', np.array(V), F, N=np.array(N), mats=('sapphire',))
    INNER[0] = 1.0


# ============================================================ DIAL, REHAUT, DATE
DIAL_Z = 2.80
DIAL_R = 13.55
DATE_W, DATE_H = 2.30, 1.50      # aperture; seen ~2.1x through the Cyclops (catalogue 4.85 x 3.1 mm)
DATE_DISC_W, DATE_DISC_H = 4.0, 3.0
DATE_Z = 2.38


def slab_arrays(geom, z0, z1, bevel=0.0, seg=3, spacing=0.09):
    me = G.shape_slab('_tmp', geom, z0, z1, bevel, seg, spacing=spacing)
    V, F = mesh_to_arrays(me)
    bpy.data.meshes.remove(me)
    return V, F


def build_dial():
    log('dial')
    R = TX.DIAL_TEX_R
    s = VAR['inner']
    # the dial itself is laid out in the finished watch's frame; it reaches the scaled rehaut
    ap = sdf_box_poly(DATE_X * s, 0.0, DATE_W * s, DATE_H * s, 0.22)
    g = Point(0, 0).buffer(DIAL_R if s == 1.0 else 13.42 * s, 256).difference(ap)
    V, F = slab_arrays(g, DIAL_Z - 0.35, DIAL_Z, 0.0)
    uv = np.stack([0.5 + V[:, 0] / (2 * R), 0.5 + V[:, 1] / (2 * R)], -1)
    emit('dial', V, F, mats=('dial',), uv=uv, sharp=30.0)
    INNER[0] = s
    # date disc (flat, under the aperture)
    w, h = DATE_DISC_W, DATE_DISC_H
    V = np.array([[DATE_X - w / 2, -h / 2, DATE_Z], [DATE_X + w / 2, -h / 2, DATE_Z],
                  [DATE_X + w / 2, h / 2, DATE_Z], [DATE_X - w / 2, h / 2, DATE_Z]])
    uv = np.array([[0, 0], [1, 0], [1, 1], [0, 1]], float)
    emit('date_disc', V, [(0, 1, 2, 3)], mats=('date_disc',), uv=uv, sharp=30.0)
    # rehaut: engraved cone (dial texture, planar UV) + polished flange ring
    prof = profile_dense([(13.40, DIAL_Z - 0.05), (13.42, DIAL_Z), (14.25, 3.62), (14.40, 3.62)],
                         [0, 0, 0.04, 0], deg=20.0)
    lathe_obj('rehaut', prof, 360, ('rehaut',), uvR=R, sharp=40.0)
    prof = profile_dense([(14.40, 3.62), (15.30, 3.62), (15.30, 4.47)], [0, 0.05, 0], deg=20.0)
    lathe_obj('flange', prof, 360, ('steel_polished',), sharp=40.0)
    INNER[0] = 1.0


def sdf_box_poly(cx, cy, w, h, r):
    b = box(cx - w / 2 + r, cy - h / 2 + r, cx + w / 2 - r, cy + h / 2 - r)
    return b.buffer(r, quad_segs=12)


# ============================================================ INDICES
IDX_H = 0.38


def polar(r, deg):
    t = math.radians(deg)
    return r * math.sin(t), r * math.cos(t)


ROMAN = ['', 'I', 'II', '', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI']


def build_roman_indices():
    """Applied white gold Roman numerals, tops toward the rim (the VI reads upside down), centred
    on r 12.15 and 2.65 tall, and a large applied coronet at 12 (r 10.6-13.3, 2.65 across), all as
    measured off dj22.jpg. Polished, with a bevel that catches the light as the watch turns."""
    log('indices (roman)')
    Vs, Fs, off = [], [], 0
    shapes = []
    for hr, txt in enumerate(ROMAN):
        if not txt:
            continue
        g = affinity.translate(TX.roman_geom(txt), 0, 12.15)
        shapes.append(affinity.rotate(g, -hr * 30.0, origin=(0, 0)))
    cor = affinity.scale(TX.coronet_geom(2.62).buffer(0.04, quad_segs=6), 1.27, 1.0, origin=(0, 0))
    shapes.append(affinity.translate(cor, 0, 10.6))
    for g in shapes:
        V, F = slab_arrays(g, DIAL_Z - 0.02, DIAL_Z + 0.34, bevel=0.07, seg=2, spacing=0.06)
        Vs.append(V)
        Fs += [tuple(i + off for i in f) for f in F]
        off += len(V)
    emit('indices', np.concatenate(Vs), Fs, mats=(vmat('indices', 'applied'),), sharp=50.0)


def build_indices():
    if VAR['numerals'] == 'roman':
        return build_roman_indices()
    log('indices')
    frames = []
    lumes = []
    for hr in range(12):
        deg = hr * 30.0
        if hr == 3:
            continue          # date
        if hr in (6, 9):
            # baton: r 8.15..12.35, width 1.73
            L0, L1, w = 8.15, 12.35, 1.73
            g = sdf_box_poly(0, (L0 + L1) / 2, w, L1 - L0, 0.12)
            gl = sdf_box_poly(0, (L0 + L1) / 2, w - 0.32, L1 - L0 - 0.32, 0.06)
            frames.append(affinity.rotate(g, -deg, origin=(0, 0)))
            lumes.append(affinity.rotate(gl, -deg, origin=(0, 0)))
        elif hr == 0:
            top, tip, hw = 12.15, 7.87, 1.735
            g = Polygon([(-hw, top), (hw, top), (0, tip)])
            gf = g.buffer(-0.12, join_style=1).buffer(0.12, quad_segs=10)
            gl = g.buffer(-0.22, join_style=2).buffer(0.04, quad_segs=6)
            frames.append(gf)
            lumes.append(gl)
        else:
            x, y = polar(10.85, deg)
            frames.append(Point(x, y).buffer(1.10, 64))
            lumes.append(Point(x, y).buffer(0.94, 64))
    Vs, Fs, off = [], [], 0
    for g, gl in zip(frames, lumes):
        ring = g.difference(gl.buffer(-0.02))     # white-gold cup around the lume
        V, F = slab_arrays(ring, DIAL_Z - 0.02, DIAL_Z + IDX_H, bevel=0.06, seg=2, spacing=0.11)
        Vs.append(V)
        Fs += [tuple(i + off for i in f) for f in F]
        off += len(V)
    emit('indices', np.concatenate(Vs), Fs, mats=(vmat('indices', 'white_gold'),), sharp=50.0)
    Vs, Fs, off = [], [], 0
    for g in lumes:
        V, F = slab_arrays(g, DIAL_Z - 0.01, DIAL_Z + IDX_H - 0.03, bevel=0.035, seg=2, spacing=0.11)
        Vs.append(V)
        Fs += [tuple(i + off for i in f) for f in F]
        off += len(V)
    emit('indices_lume', np.concatenate(Vs), Fs, mats=('lume',), sharp=50.0)


# ============================================================ HANDS
HAND_ANG = {'hour': 305.0, 'minute': 62.0, 'second': 186.0, 'gmt': 152.0}
HAND_Z = {'gmt': 3.27, 'hour': 3.48, 'minute': 3.72, 'second': 3.98}
HAND_T = 0.10


def rot_geom(g, deg):
    return affinity.rotate(g, -deg, origin=(0, 0))


def baton_shapes():
    """Datejust baton hands (dj22.jpg): hour 1.0 wide to r 8.45 with a short tail, minute 0.84
    wide to r 11.2, seconds a needle to r 12.6 with a long counterweighted tail. No lume."""
    H = {}
    H['hour'] = (unary_union([Polygon([(-0.50, -2.5), (0.50, -2.5), (0.50, 8.0), (0.0, 8.45), (-0.50, 8.0)]),
                              Point(0, 0).buffer(0.95, 48)]), None)
    H['minute'] = (unary_union([Polygon([(-0.42, -1.6), (0.42, -1.6), (0.42, 10.8), (0.0, 11.2), (-0.42, 10.8)]),
                                Point(0, 0).buffer(0.80, 48)]), None)
    needle = Polygon([(0.09, 0.0), (0.045, 12.6), (-0.045, 12.6), (-0.09, 0.0)])
    tail = sdf_box_poly(0, -2.9, 0.34, 3.4, 0.08)
    H['second'] = (unary_union([needle, tail, sdf_box_poly(0, -0.6, 0.16, 1.2, 0.02),
                                Point(0, 0).buffer(0.45, 48)]), None)
    return H


def hand_shapes():
    """2D outlines in the hand frame (pointing +y).  Returns dict name ->
    (frame_geom, lume_geom or None, extra)"""
    if VAR['hands'] == 'baton':
        return baton_shapes()
    H = {}
    # ---- hour: Mercedes
    hub = Point(0, 0).buffer(0.95, 48)
    shaft = sdf_box_poly(0, 2.05, 0.92, 4.4, 0.05)
    cy = 4.90
    circ = Point(0, cy).buffer(1.27, 96)
    tip = Polygon([(-0.55, 5.85), (0.55, 5.85), (0.0, 7.72)])
    frame = unary_union([hub, shaft, circ, tip]).buffer(0.0)
    lum_sh = sdf_box_poly(0, 2.35, 0.50, 2.45, 0.05)
    disc = Point(0, cy).buffer(1.07, 96)
    spokes = []
    for a in (180.0, 60.0, -60.0):
        t = math.radians(a)
        spokes.append(LineString([(0, cy), (1.3 * math.sin(t), cy + 1.3 * math.cos(t))]).buffer(0.085, cap_style=2))
    spokes.append(Point(0, cy).buffer(0.16, 32))
    lum_c = disc.difference(unary_union(spokes))
    lum_tip = Polygon([(-0.40, 6.18), (0.40, 6.18), (0.0, 7.40)]).buffer(-0.02)
    lum_tip = lum_tip.difference(Point(0, cy).buffer(1.27 + 0.10, 96))
    H['hour'] = (frame, unary_union([lum_sh, lum_c, lum_tip]))
    # ---- minute: sword
    pts = [(0.36, 0.6), (0.46, 2.0), (0.50, 9.4), (0.0, 12.30), (-0.50, 9.4), (-0.46, 2.0), (-0.36, 0.6)]
    blade = Polygon(pts)
    frame = unary_union([blade, Point(0, 0).buffer(0.85, 48)])
    lum = Polygon([(0.27, 1.95), (0.29, 9.2), (0.0, 9.75), (-0.29, 9.2), (-0.27, 1.95)])
    H['minute'] = (frame, lum)
    # ---- seconds: needle + lume dot + round counterweight
    needle = Polygon([(0.085, -4.3), (0.085, 0.0), (0.04, 12.50), (-0.04, 12.50), (-0.085, 0.0), (-0.085, -4.3)])
    dot = Point(0, 6.73).buffer(0.75, 64)
    cw = Point(0, -4.30).buffer(0.52, 48)
    hub = Point(0, 0).buffer(0.50, 48)
    frame = unary_union([needle, dot, cw, hub])
    lum = Point(0, 6.73).buffer(0.60, 64)
    H['second'] = (frame, lum)
    # ---- GMT: green shaft + white-gold triangle with lume
    shaft = sdf_box_poly(0, 4.6, 0.34, 10.6, 0.03)
    hubg = Point(0, 0).buffer(0.75, 48)
    tri = Polygon([(-1.435, 9.97), (1.435, 9.97), (0.0, 12.77)])
    tri_f = tri.buffer(-0.06, join_style=1).buffer(0.06, quad_segs=6)
    tri_l = tri.buffer(-0.22, join_style=2)
    H['gmt'] = (unary_union([shaft, hubg]).difference(tri_f.buffer(0.0)), tri_l, tri_f)
    return H


def build_hands():
    log('hands')
    H = hand_shapes()
    ang = dict(HAND_ANG, **({'hour': 304.5, 'minute': 57.0, 'second': 212.0} if VAR['hands'] == 'baton' else {}))
    for name in (('gmt',) if VAR['gmt_hand'] else ()) + ('hour', 'minute', 'second'):
        deg = ang[name]
        z0 = HAND_Z[name]
        t = HAND_T if name != 'second' else 0.07
        sh = H[name]
        frame = rot_geom(sh[0], deg)
        V, F = slab_arrays(frame, z0, z0 + t, bevel=0.035 if name != 'second' else 0.02, seg=2, spacing=0.065)
        mat = vmat('gmt_hand', 'gmt_green') if name == 'gmt' else vmat('hands', 'applied' if VAR['hands'] == 'baton' else 'white_gold')
        if name == 'second' and VAR['seconds']:
            mat = 'seconds'
        emit('hand_%s' % name, V, F, mats=(mat,), sharp=50.0)
        if name == 'gmt':
            trif = rot_geom(sh[2], deg)
            V, F = slab_arrays(trif, z0, z0 + t, bevel=0.035, seg=2, spacing=0.05)
            emit('hand_gmt_tip', V, F, mats=(vmat('hands', 'white_gold'),), sharp=50.0)
        if sh[1] is not None:
            lum = rot_geom(sh[1], deg)
            V, F = slab_arrays(lum, z0 + t - 0.03, z0 + t + 0.012, bevel=0.015, seg=2, spacing=0.065)
            emit('hand_%s_lume' % name, V, F, mats=('lume',), sharp=50.0)
    # cannon pinions / hubs and seconds cap
    lathe_obj('hand_hub_hour', profile_dense([(0.0, 3.30), (0.62, 3.30), (0.62, 3.62), (0.0, 3.62)], [0, 0.03, 0.03, 0]),
              64, (vmat('hands', 'white_gold'),), sharp=50.0)
    lathe_obj('hand_hub_minute', profile_dense([(0.0, 3.60), (0.42, 3.60), (0.42, 3.86), (0.0, 3.86)], [0, 0.03, 0.03, 0]),
              64, (vmat('hands', 'white_gold'),), sharp=50.0)
    lathe_obj('hand_cap', profile_dense([(0.0, 3.95), (0.36, 3.95), (0.36, 4.08), (0.25, 4.17), (0.0, 4.19)],
                                        [0, 0.02, 0.06, 0.08, 0]), 64, (vmat('hands', 'white_gold'),), sharp=50.0)


# ============================================================ CROWN
CROWN_X0 = 19.60          # crown origin on the 3 o'clock axis (case flank at 20.0)
CROWN_FLUTES = 18


def crown_matrix():
    """lathe frame (axis +z) -> local: axis along +x at y=0, z=CROWN_Z."""
    M = np.eye(4)
    # z_c -> +x ; x_c -> +y ; y_c -> +z
    M[:3, :3] = np.array([[0, 0, 1], [1, 0, 0], [0, 1, 0]], float)
    M[:3, 3] = (CROWN_X0, 0.0, CROWN_Z)
    return M


def lathe_radial_disp(name, prof, nseg, disp, mats, M=None, sharp=50.0):
    """Lathe whose radius is pushed in by disp[nseg, len(prof)] (flutes)."""
    prof = np.asarray(prof, float)
    m = len(prof)
    th = np.arange(nseg) * 2 * math.pi / nseg
    R = prof[None, :, 0] - disp
    Z = np.repeat(prof[None, :, 1], nseg, 0)
    TH = np.repeat(th[:, None], m, 1)
    V = np.stack([R * np.cos(TH), R * np.sin(TH), Z], -1).reshape(-1, 3)
    i = np.arange(nseg)[:, None]
    j = np.arange(m - 1)[None, :]
    i2 = (i + 1) % nseg
    F = np.stack([i * m + j, i2 * m + j, i2 * m + j + 1, i * m + j + 1], -1).reshape(-1, 4)
    ob = emit(name, V, F, mats=mats, M=M)
    me = ob.data
    if (prof[:, 0] < 1e-9).any():
        bm = bmesh.new()
        bm.from_mesh(me)
        bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-7)
        bm.to_mesh(me)
        bm.free()
    G.mark_sharp(me, sharp)
    return ob


def build_crown():
    """Triplock crown: tube, deeply fluted body (18 flutes, as counted on the
    catalogue image), chamfered end with the coronet + three Triplock dots."""
    log('crown')
    prof = profile_dense([
        (0.0, 0.0), (1.70, 0.0), (1.70, 0.55), (2.60, 0.55), (CROWN_R, 0.85), (CROWN_R, 3.85),
        (2.80, 4.15), (1.40, 4.28), (0.0, 4.32)],
        [0, 0, 0.05, 0.10, 0.10, 0.10, 0.10, 0.30, 0], deg=12.0)
    prof = densify_band(prof, 0.30, lambda p: p[0] > 2.9)
    nseg = CROWN_FLUTES * 8
    th = np.arange(nseg) * 2 * math.pi / nseg
    pitch = 2 * math.pi / CROWN_FLUTES
    ph = np.abs(np.mod(th + pitch / 2, pitch) - pitch / 2) / (pitch * 0.36)
    groove = np.clip(1 - ph, 0, 1) ** 0.75          # V-groove, rounded bottom, flat lands
    wz = smoothstep(0.80, 1.15, prof[:, 1]) * (1 - smoothstep(3.70, 4.05, prof[:, 1]))
    wr = smoothstep(2.70, 3.0, prof[:, 0])
    disp = 0.42 * groove[:, None] * (wz * wr)[None, :]
    M = crown_matrix()
    lathe_radial_disp('crown', prof, nseg, disp, (vmat('crown', 'steel_polished'),), M=M, sharp=50.0)
    # coronet + Triplock dots in relief on the end
    if VAR['crown_mark'] == 'twinlock':
        g = affinity.translate(TX.coronet_geom(2.3 * 0.78), 0, 2.3 * 0.12)   # Twinlock: the coronet alone
    else:
        g = TX.coronet_triplock(2.3)
    g = affinity.translate(g, 0, -1.15)
    g = affinity.rotate(g, -90, origin=(0, 0))   # coronet up -> +x_c (= 12 o'clock)
    V, F = slab_arrays(g, 4.20, 4.42, bevel=0.04, seg=2, spacing=0.025)
    emit('crown_coronet', V, F, mats=(vmat('crown', 'steel_polished'),), sharp=50.0, M=M)


# ============================================================ CASEBACK
CB_FLUTES = 90


def build_caseback():
    """Plain Rolex Oyster caseback: polished, slightly domed centre and a
    fluted (serrated) chamfer ring for the case-opening die, screwed into
    the middle case (no engraving, nothing shows through)."""
    log('caseback')
    # dome: sag 0.62 over r 14.5 -> sphere R ~170 mm
    r_d = 14.50
    sag = 0.62
    Rs = (r_d ** 2 + sag ** 2) / (2 * sag)
    rs = np.linspace(0, r_d, 12)
    dome = [(r, -6.0 + (Rs - math.sqrt(Rs * Rs - r * r))) for r in rs]
    lathe_obj('caseback', dome + [(r_d + 0.05, dome[-1][1] + 0.015)], 120, ('steel_polished',), sharp=40.0)
    # fluted ring: narrow polished land, then the serrated chamfer, then the wall
    z0 = dome[-1][1]
    pts = [(r_d - 0.02, z0 - 0.005), (14.70, z0 + 0.03), (16.25, -4.55), (16.25, -3.70), (15.6, -3.70)]
    prof = profile_dense(pts, [0, 0.06, 0.12, 0.0, 0], deg=15.0)
    prof = densify_band(prof, 0.20, lambda p: p[0] > 14.6 and p[1] < -3.9)
    # chamfer outward normal (r,z) for the groove displacement
    dr, dz = 16.25 - 14.70, -4.55 - (z0 + 0.03)
    L = math.hypot(dr, dz)
    n_r, n_z = dz / L, -dr / L          # outward (material on the left)
    nseg = CB_FLUTES * 5
    m = len(prof)
    th = np.arange(nseg) * 2 * math.pi / nseg
    pitch = 2 * math.pi / CB_FLUTES
    ph = (np.mod(th + pitch / 2, pitch) - pitch / 2) / (pitch * 0.40)
    groove = np.sqrt(np.clip(1 - ph * ph, 0, 1))          # rounded groove, 80 % of the pitch
    # weight along the profile: grooves run the length of the chamfer and
    # fade out on the land and on the wall
    w_prof = np.zeros(m)
    for j, (r, z) in enumerate(prof):
        a = smoothstep(14.75, 15.05, r)
        b = 1 - smoothstep(-4.62, -4.25, z)
        w_prof[j] = a * b
    D = 0.26
    disp = D * groove[:, None] * w_prof[None, :]
    R = prof[None, :, 0] - disp * n_r
    Z = prof[None, :, 1] - disp * n_z
    TH = np.repeat(th[:, None], m, 1)
    V = np.stack([R * np.cos(TH), R * np.sin(TH), Z], -1).reshape(-1, 3)
    i = np.arange(nseg)[:, None]
    j = np.arange(m - 1)[None, :]
    i2 = (i + 1) % nseg
    F = np.stack([i * m + j, i2 * m + j, i2 * m + j + 1, i * m + j + 1], -1).reshape(-1, 4)
    ob = emit('caseback_ring', V, F, mats=('steel_polished',))
    G.mark_sharp(ob.data, 60.0)


# ============================================================ preview rig
def build_studio():
    """Studio for previews only (not exported): HDR-like world + area lights."""
    sc = bpy.context.scene
    world = bpy.data.worlds.new('studio')
    sc.world = world
    world.use_nodes = True
    nt = world.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    out = nt.nodes.new('ShaderNodeOutputWorld')
    env_img = make_studio_hdr(os.path.join(TEX, 'studio_env.exr'))
    tc = nt.nodes.new('ShaderNodeTexCoord')
    envt = nt.nodes.new('ShaderNodeTexEnvironment')
    envt.image = env_img
    nt.links.new(tc.outputs['Generated'], envt.inputs['Vector'])
    # black flag around the direction the crystal mirrors toward the camera
    dot = nt.nodes.new('ShaderNodeVectorMath')
    dot.name = 'hole_dot'
    dot.operation = 'DOT_PRODUCT'
    nt.links.new(tc.outputs['Generated'], dot.inputs[0])
    dot.inputs[1].default_value = (0.0, -1.0, 0.0)
    mr = nt.nodes.new('ShaderNodeMapRange')
    mr.name = 'hole_mr'
    mr.interpolation_type = 'SMOOTHSTEP'
    mr.clamp = True
    nt.links.new(dot.outputs['Value'], mr.inputs['Value'])
    mr.inputs['From Min'].default_value = math.cos(math.radians(20.0))
    mr.inputs['From Max'].default_value = math.cos(math.radians(8.0))
    mr.inputs['To Min'].default_value = 1.0
    mr.inputs['To Max'].default_value = 0.02
    mul = nt.nodes.new('ShaderNodeMix')
    mul.data_type = 'RGBA'
    mul.blend_type = 'MULTIPLY'
    mul.inputs['Factor'].default_value = 1.0
    nt.links.new(envt.outputs['Color'], mul.inputs['A'])
    nt.links.new(mr.outputs['Result'], mul.inputs['B'])
    bg_env = nt.nodes.new('ShaderNodeBackground')
    nt.links.new(mul.outputs['Result'], bg_env.inputs['Color'])
    bg_env.inputs['Strength'].default_value = 1.0
    bg_cam = nt.nodes.new('ShaderNodeBackground')
    bg_cam.inputs['Color'].default_value = (0.012, 0.012, 0.013, 1)
    lp = nt.nodes.new('ShaderNodeLightPath')
    mix = nt.nodes.new('ShaderNodeMixShader')
    nt.links.new(lp.outputs['Is Camera Ray'], mix.inputs['Fac'])
    nt.links.new(bg_env.outputs['Background'], mix.inputs[1])
    nt.links.new(bg_cam.outputs['Background'], mix.inputs[2])
    nt.links.new(mix.outputs['Shader'], out.inputs['Surface'])
    # area lights (metres; watch ~0.1 m tall)
    def area(name, loc, size, energy, color=(1, 1, 1), sx=None):
        L = bpy.data.lights.new(name, 'AREA')
        L.energy = energy
        L.color = color
        if sx:
            L.shape = 'RECTANGLE'
            L.size = sx[0]
            L.size_y = sx[1]
        else:
            L.size = size
        o = bpy.data.objects.new(name, L)
        coll('studio').objects.link(o)
        o.location = loc
        d = -Vector(loc)
        o.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
        return o
    area('key', (-0.22, -0.30, 0.30), 0.35, 14.0, sx=(0.45, 0.30))
    area('fill', (0.32, -0.22, 0.05), 0.30, 3.5)
    area('rim_l', (-0.28, 0.20, 0.12), 0.06, 5.0, sx=(0.03, 0.40))
    area('rim_r', (0.28, 0.22, 0.10), 0.06, 5.0, sx=(0.03, 0.40))
    area('top', (0.0, 0.05, 0.40), 0.30, 4.0)


def make_studio_hdr(path, W=2048, H=1024):
    """Equirectangular studio environment: dark floor, grey walls, big soft
    boxes upper-left (key), right (fill), strips behind (rims)."""
    u = (np.arange(W) + 0.5) / W
    v = (np.arange(H) + 0.5) / H
    U, Vv = np.meshgrid(u, v)
    # Blender equirect: u=0.5 faces -Y? phi = (u-0.5)*2pi measured from +X... use direction
    phi = np.pi - 2 * np.pi * U             # Cycles equirect: u=0.5 -> +X, u=0.25 -> +Y
    th = (Vv - 0.5) * np.pi                 # latitude (v=0 bottom in Blender images)
    dx = np.cos(th) * np.cos(phi)
    dy = np.cos(th) * np.sin(phi)
    dz = np.sin(th)
    D = np.stack([dx, dy, dz], -1)
    col = np.zeros((H, W, 3), np.float32)
    # base gradient: dark floor, mid-grey horizon, lighter ceiling
    g = np.clip(0.5 + 0.5 * dz, 0, 1)
    base = 0.02 + 0.10 * g ** 1.5
    col += base[..., None]

    def softbox(center, w_deg, h_deg, inten, feather=0.25):
        c = np.asarray(center, float)
        c /= np.linalg.norm(c)
        # local frame
        up = np.array([0, 0, 1.0])
        if abs(c @ up) > 0.95:
            up = np.array([0, 1.0, 0])
        xa = np.cross(up, c)
        xa /= np.linalg.norm(xa)
        ya = np.cross(c, xa)
        cosang = D @ c
        px = np.degrees(np.arctan2(D @ xa, cosang))
        py = np.degrees(np.arctan2(D @ ya, cosang))
        mx = np.clip((w_deg / 2 - np.abs(px)) / (w_deg * feather) + 0.5, 0, 1)
        my = np.clip((h_deg / 2 - np.abs(py)) / (h_deg * feather) + 0.5, 0, 1)
        m = mx * my * (cosang > 0)
        return m[..., None] * np.asarray(inten, np.float32)
    # directions in Blender world (camera at -Y looking +Y)
    # keep the cone around the camera axis (-Y) black so the crystal, dial and
    # ceramic read dark the way they do in Rolex photography
    col += softbox((-0.75, -0.35, 0.75), 60, 50, (7.0, 7.0, 7.0))      # key upper-left
    col += softbox((0.95, -0.25, 0.25), 35, 70, (2.2, 2.2, 2.25))      # fill right
    col += softbox((-0.95, -0.15, -0.1), 30, 60, (1.6, 1.6, 1.6))      # left side card
    col += softbox((-0.85, 0.55, 0.25), 10, 80, (6.0, 6.0, 6.0), 0.15) # rim left-back strip
    col += softbox((0.85, 0.6, 0.25), 10, 80, (6.0, 6.0, 6.0), 0.15)   # rim right-back strip
    col += softbox((0.0, 0.2, 1.0), 70, 40, (3.0, 3.0, 3.0))           # overhead
    col += softbox((0.0, 0.9, -0.4), 80, 30, (0.8, 0.8, 0.8), 0.3)     # low back bounce
    # big white card in front of the watch (catalogue look) ...
    col += softbox((0.0, -1.0, -0.35), 150, 110, (1.1, 1.1, 1.1), 0.35)
    col += softbox((0.0, -0.45, -1.0), 120, 80, (1.6, 1.6, 1.6), 0.4)    # floor bounce for the lower bracelet
    # (the black 'lens hole' that keeps the crystal and dial deep black is a
    # world-shader mask aimed per camera by render.py, see build_studio)
    im = bpy.data.images.new('studio_env', W, H, alpha=False, float_buffer=True)
    rgba = np.concatenate([col, np.ones((H, W, 1), np.float32)], -1)
    im.pixels.foreach_set(rgba.ravel())
    im.filepath_raw = path
    im.file_format = 'OPEN_EXR'
    im.save()
    return im


def setup_render(res=1200, samples=48):
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    sc.cycles.device = 'CPU'
    sc.cycles.samples = samples
    sc.cycles.use_denoising = True
    sc.cycles.max_bounces = 16
    sc.cycles.glossy_bounces = 8
    sc.cycles.transmission_bounces = 16
    sc.cycles.transparent_max_bounces = 8
    sc.cycles.caustics_reflective = False
    sc.cycles.caustics_refractive = True
    sc.cycles.blur_glossy = 0.5
    sc.render.resolution_x = res
    sc.render.resolution_y = res
    sc.render.film_transparent = False
    sc.view_settings.view_transform = 'AgX'
    sc.view_settings.look = 'AgX - Punchy' if 'AgX - Punchy' in [i.identifier for i in sc.view_settings.bl_rna.properties['look'].enum_items] else 'None'


def add_camera(name, loc, target=(0, 0, 0), lens=100.0, ortho=None):
    cam = bpy.data.cameras.new(name)
    cam.lens = lens
    cam.clip_start = 0.005
    cam.clip_end = 10
    if ortho:
        cam.type = 'ORTHO'
        cam.ortho_scale = ortho
    o = bpy.data.objects.new(name, cam)
    coll('studio').objects.link(o)
    o.location = loc
    d = Vector(target) - Vector(loc)
    o.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    return o


# ============================================================ finalize / export
JOIN = {
    'bezel': ['bezel', 'bezel_lip'],
    'caseback': ['caseback', 'caseback_ring'],
    'crown': ['crown', 'crown_coronet'],
    'rehaut': ['rehaut', 'flange'],
    'indices': ['indices', 'indices_lume'],
    'hands_gmt': ['hand_gmt', 'hand_gmt_tip', 'hand_gmt_lume'],
    'hands_hour': ['hand_hour', 'hand_hour_lume', 'hand_hub_hour'],
    'hands_minute': ['hand_minute', 'hand_minute_lume', 'hand_hub_minute'],
    'hands_second': ['hand_second', 'hand_second_lume', 'hand_cap'],
    'clasp': ['clasp', 'clasp_coronet'],
}


def join_objects():
    for target, names in JOIN.items():
        obs = [bpy.data.objects[n] for n in names if n in bpy.data.objects]
        if not obs:
            continue
        act = obs[0]
        if len(obs) > 1:
            with bpy.context.temp_override(active_object=act, object=act, selected_objects=obs,
                                           selected_editable_objects=obs):
                bpy.ops.object.join()
        act.name = target
        act.data.name = target


def tri_count(objs):
    n = 0
    for o in objs:
        me = o.data
        me.calc_loop_triangles()
        n += len(me.loop_triangles)
    return n


def export_glb(path):
    meshes = [o for o in bpy.data.objects if o.type == 'MESH']
    for o in bpy.data.objects:
        o.select_set(False)
    for o in meshes:
        o.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    bpy.ops.export_scene.gltf(
        filepath=path, export_format='GLB', use_selection=True, export_apply=True,
        export_yup=True, export_texcoords=True, export_normals=True, export_tangents=False,
        export_materials='EXPORT', export_image_format='AUTO', export_cameras=False,
        export_lights=False, export_extras=False)
    for o in meshes:
        o.select_set(False)
    return tri_count(meshes)


# ============================================================ main
def main():
    args = sys.argv[1:]
    head_only = '--head' in args
    reset_scene()
    build_materials()
    build_case()
    build_bezel()
    build_crystal()
    build_dial()
    build_indices()
    build_hands()
    build_crown()
    build_caseback()
    if not head_only:
        import gmt_bracelet as BR
        BR.build_bracelet(sys.modules[__name__])
    join_objects()
    build_studio()
    setup_render()
    stem = 'gmt' if VARIANT == 'grnr' else VARIANT
    out = os.path.join(HERE, stem + ('_head.blend' if head_only else '.blend'))
    bpy.ops.wm.save_as_mainfile(filepath=out)
    log('saved', out)
    if not head_only:
        glb = os.path.join(HERE, stem + '.glb')
        ntri = export_glb(glb)
        log('exported %s: %d triangles, %.2f MB' % (glb, ntri, os.path.getsize(glb) / 1e6))
        for o in sorted(bpy.data.objects, key=lambda o: o.name):
            if o.type == 'MESH':
                log('   %-14s %7d tris' % (o.name, tri_count([o])))


if __name__ == '__main__':
    main()
