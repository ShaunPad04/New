"""Geometry helpers for the GMT-Master II build: SDF polygonisation,
lathes with flutes, extruded 2D shapes.  Units are millimetres in the
watch-local frame (x = 3 o'clock, y = 12 o'clock, z = out of the dial)."""
import math
import os
import numpy as np
import bpy
import bmesh
from skimage.measure import marching_cubes
import mapbox_earcut as earcut


# ---------------------------------------------------------------- SDF maths
def smin(a, b, k):
    """polynomial smooth minimum (fillet of size ~k)"""
    if k <= 0:
        return np.minimum(a, b)
    h = np.clip(0.5 + 0.5 * (b - a) / k, 0.0, 1.0)
    return b * (1 - h) + a * h - k * h * (1 - h)


def smax(a, b, k):
    return -smin(-a, -b, k)


def round_isect(a, b, r):
    """intersection of two half-spaces with a round of radius r on the edge"""
    qa = a + r
    qb = b + r
    out = np.sqrt(np.maximum(qa, 0) ** 2 + np.maximum(qb, 0) ** 2)
    ins = np.minimum(np.maximum(qa, qb), 0)
    return out + ins - r


def sdf_polygon(px, py, poly):
    """Exact signed distance to a closed polygon (N,2), negative inside.
    px,py: arrays of any shape."""
    shp = px.shape
    x = px.ravel()[:, None]
    y = py.ravel()[:, None]
    P = np.asarray(poly, dtype=np.float64)
    A = P
    B = np.roll(P, -1, axis=0)
    out_d = np.full(x.shape[0], np.inf)
    inside = np.zeros(x.shape[0], dtype=bool)
    # process in chunks of edges to bound memory
    CH = 256
    for s in range(0, len(A), CH):
        a = A[s:s + CH]
        b = B[s:s + CH]
        ex = (b[:, 0] - a[:, 0])[None, :]
        ey = (b[:, 1] - a[:, 1])[None, :]
        wx = x - a[None, :, 0]
        wy = y - a[None, :, 1]
        l2 = ex * ex + ey * ey + 1e-30
        t = np.clip((wx * ex + wy * ey) / l2, 0, 1)
        dx = wx - ex * t
        dy = wy - ey * t
        d2 = dx * dx + dy * dy
        out_d = np.minimum(out_d, d2.min(axis=1))
        # crossing number
        c1 = (a[None, :, 1] <= y) & (b[None, :, 1] > y)
        c2 = (a[None, :, 1] > y) & (b[None, :, 1] <= y)
        cr = c1 | c2
        xint = a[None, :, 0] + (y - a[None, :, 1]) * ex / np.where(np.abs(ey) < 1e-30, 1e-30, ey)
        inside ^= (np.sum(cr & (x < xint), axis=1) % 2).astype(bool)
    d = np.sqrt(out_d)
    d[inside] *= -1
    return d.reshape(shp)


def rounded_polygon(pts, radii, seg_per_rad=None, deg_step=0.7):
    """Polygon with per-corner fillet radii, returned as dense vertex list (CCW)."""
    P = np.asarray(pts, dtype=np.float64)
    n = len(P)
    out = []
    for i in range(n):
        p0, p1, p2 = P[i - 1], P[i], P[(i + 1) % n]
        r = radii[i]
        v1 = p0 - p1
        v2 = p2 - p1
        l1, l2 = np.linalg.norm(v1), np.linalg.norm(v2)
        v1 /= l1
        v2 /= l2
        ang = math.acos(np.clip(np.dot(v1, v2), -1, 1))
        if r <= 0 or ang < 1e-6:
            out.append(p1)
            continue
        tlen = r / math.tan(ang / 2)
        a = p1 + v1 * tlen
        b = p1 + v2 * tlen
        bis = (v1 + v2)
        bis /= np.linalg.norm(bis)
        c = p1 + bis * (r / math.sin(ang / 2))
        a0 = math.atan2(a[1] - c[1], a[0] - c[0])
        a1 = math.atan2(b[1] - c[1], b[0] - c[0])
        da = a1 - a0
        while da > math.pi:
            da -= 2 * math.pi
        while da < -math.pi:
            da += 2 * math.pi
        steps = max(2, int(abs(math.degrees(da)) / deg_step))
        for k in range(steps + 1):
            t = a0 + da * k / steps
            out.append(c + r * np.array([math.cos(t), math.sin(t)]))
    out = np.array(out)
    # ensure CCW
    area = 0.5 * np.sum(out[:, 0] * np.roll(out[:, 1], -1) - np.roll(out[:, 0], -1) * out[:, 1])
    if area < 0:
        out = out[::-1]
    return out


def grad(f, P, eps=1e-3):
    g = np.zeros_like(P)
    for i in range(3):
        d = np.zeros(3)
        d[i] = eps
        g[:, i] = (f(P + d) - f(P - d)) / (2 * eps)
    return g


def polygonize(f, bmin, bmax, h, chunk=24):
    """Marching cubes on SDF f(P[N,3]) over the box; returns verts, faces."""
    bmin = np.asarray(bmin, float) - h * np.array([0.3137, 0.2718, 0.4142])
    bmax = np.asarray(bmax, float) + h
    n = np.ceil((bmax - bmin) / h).astype(int) + 1
    xs = bmin[0] + np.arange(n[0]) * h
    ys = bmin[1] + np.arange(n[1]) * h
    zs = bmin[2] + np.arange(n[2]) * h
    vol = np.empty((n[0], n[1], n[2]), dtype=np.float32)
    X, Y = np.meshgrid(xs, ys, indexing='ij')
    O = f.o2d(X, Y) if hasattr(f, 'o2d') else None
    for k0 in range(0, n[2], chunk):
        k1 = min(n[2], k0 + chunk)
        Z = zs[k0:k1]
        P = np.stack([np.repeat(X[..., None], len(Z), 2),
                      np.repeat(Y[..., None], len(Z), 2),
                      np.broadcast_to(Z, X.shape + (len(Z),))], -1).reshape(-1, 3)
        if O is not None:
            Ok = np.repeat(O[..., None], len(Z), 2).reshape(-1)
            vol[:, :, k0:k1] = f(P, o=Ok).reshape(n[0], n[1], len(Z))
        else:
            vol[:, :, k0:k1] = f(P).reshape(n[0], n[1], len(Z))
    verts, faces, _, _ = marching_cubes(vol, level=0.0, spacing=(h, h, h))
    verts += bmin
    # orient faces outward (SDF increasing outward)
    tri = verts[faces]
    nrm = np.cross(tri[:, 1] - tri[:, 0], tri[:, 2] - tri[:, 0])
    cen = tri.mean(1)
    g = grad(f, cen[:2000], 1e-3)
    if np.sum(np.einsum('ij,ij->i', nrm[:2000], g)) < 0:
        faces = faces[:, ::-1]
    return verts, faces


def project_to_surface(f, V, iters=4):
    V = V.copy()
    for _ in range(iters):
        d = f(V)
        g = grad(f, V)
        gl = np.einsum('ij,ij->i', g, g) + 1e-12
        V -= (d / gl)[:, None] * g
    return V


# ---------------------------------------------------------------- Blender mesh
def mesh_from_arrays(name, V, F, scale=1.0):
    me = bpy.data.meshes.new(name)
    V = np.asarray(V, dtype=np.float64) * scale
    F = np.asarray(F, dtype=np.int64)
    me.vertices.add(len(V))
    me.vertices.foreach_set('co', V.astype(np.float32).ravel())
    if F.ndim == 2:
        nl = F.shape[1]
        me.loops.add(F.size)
        me.loops.foreach_set('vertex_index', F.astype(np.int32).ravel())
        me.polygons.add(len(F))
        me.polygons.foreach_set('loop_start', (np.arange(len(F)) * nl).astype(np.int32))
    me.update(calc_edges=True)
    me.validate(clean_customdata=False)
    return me


def decimate_mesh(me, target_tris):
    nt = sum(len(p.vertices) - 2 for p in me.polygons)
    if nt <= target_tris:
        return me
    obj = bpy.data.objects.new('_tmp_dec', me)
    bpy.context.scene.collection.objects.link(obj)
    mod = obj.modifiers.new('dec', 'DECIMATE')
    mod.decimate_type = 'COLLAPSE'
    mod.ratio = target_tris / nt
    mod.use_collapse_triangulate = True
    dg = bpy.context.evaluated_depsgraph_get()
    me2 = bpy.data.meshes.new_from_object(obj.evaluated_get(dg))
    bpy.data.objects.remove(obj)
    bpy.data.meshes.remove(me)
    return me2


def clean_degenerate(me, dist=1e-5):
    bm = bmesh.new()
    bm.from_mesh(me)
    bmesh.ops.dissolve_degenerate(bm, dist=dist, edges=bm.edges)
    bmesh.ops.triangulate(bm, faces=bm.faces)
    bm.to_mesh(me)
    bm.free()


def mesh_arrays(me):
    V = np.zeros(len(me.vertices) * 3)
    me.vertices.foreach_get('co', V)
    V = V.reshape(-1, 3)
    me.calc_loop_triangles()
    T = np.zeros(len(me.loop_triangles) * 3, dtype=np.int64)
    me.loop_triangles.foreach_get('vertices', T)
    return V, T.reshape(-1, 3)


CACHE_DIR = os.environ.get('GMT_CACHE')


def sdf_mesh(name, f, bmin, bmax, h, target_tris, project=True, key=''):
    """SDF -> marching cubes -> decimate -> re-project -> smooth custom normals.
    If $GMT_CACHE is set (development only) results are cached by a hash of
    the SDF class source, the parameters and `key`."""
    import time
    t0 = time.time()
    cache = None
    if CACHE_DIR:
        import hashlib, inspect
        try:
            src = inspect.getsource(f.__class__)
        except Exception:
            src = ''
        hs = hashlib.sha1((src + repr((name, tuple(bmin), tuple(bmax), h, target_tris, project, key))).encode()).hexdigest()[:16]
        os.makedirs(CACHE_DIR, exist_ok=True)
        cache = os.path.join(CACHE_DIR, '%s_%s.npz' % (name, hs))
        if os.path.exists(cache):
            z = np.load(cache)
            V, T, N = z['V'], z['T'], z['N']
            me2 = mesh_from_arrays(name, V, T)
            set_smooth_normals(me2, N)
            return me2, V, T, N
    V, F = polygonize(f, bmin, bmax, h)
    t1 = time.time()
    me = mesh_from_arrays(name, V, F)
    me = decimate_mesh(me, target_tris)
    clean_degenerate(me)
    V, T = mesh_arrays(me)
    t2 = time.time()
    if project:
        V = project_to_surface(f, V)
    me2 = mesh_from_arrays(name, V, T)
    bpy.data.meshes.remove(me)
    N = grad(f, V)
    N /= np.linalg.norm(N, axis=1)[:, None] + 1e-12
    set_smooth_normals(me2, N)
    print('  sdf_mesh %s: mc %.1fs, decimate %.1fs, project %.1fs' % (name, t1 - t0, t2 - t1, time.time() - t2), flush=True)
    if cache:
        np.savez(cache, V=V, T=T, N=N)
    return me2, V, T, N


def set_smooth_normals(me, N):
    me.shade_smooth()
    me.normals_split_custom_set_from_vertices([tuple(n) for n in N])


def face_centers_normals(V, T, N):
    c = V[T].mean(1)
    n = N[T].mean(1)
    n /= np.linalg.norm(n, axis=1)[:, None] + 1e-12
    return c, n


def flute_cut(n, R_ax, rf, z_lo=None, z_hi=None, ramp=0.25, k=0.04, phase=0.0):
    """r -> soft-min(r, flute surface) for n cylindrical flutes (axis // z at
    radius R_ax, radius rf), blended with k; optional z window with a ramp."""
    pitch = 2 * math.pi / n

    def f(R, TH, Z):
        ph = np.mod(TH - phase + pitch / 2, pitch) - pitch / 2
        s = R_ax * np.sin(ph)
        inside = rf * rf - s * s
        rmax = np.where(inside > 0, R_ax * np.cos(ph) - np.sqrt(np.maximum(inside, 0)), R + 10.0)
        Rc = smin(R, rmax, k)
        w = np.ones_like(R)
        if z_lo is not None:
            w = np.clip((Z - z_lo) / ramp, 0, 1)
        if z_hi is not None:
            w = np.minimum(w, np.clip((z_hi - Z) / ramp, 0, 1))
        w = w * w * (3 - 2 * w)
        return R - (R - Rc) * w
    return f


def mark_sharp(me, deg=35.0):
    """Smooth-shade everything, but split normals across edges sharper than deg."""
    bm = bmesh.new()
    bm.from_mesh(me)
    bm.normal_update()
    lim = math.radians(deg)
    for f in bm.faces:
        f.smooth = True
    for e in bm.edges:
        if len(e.link_faces) == 2:
            a = e.link_faces[0].normal.angle(e.link_faces[1].normal, 0.0)
            e.smooth = a < lim
        else:
            e.smooth = False
    bm.to_mesh(me)
    bm.free()
    return me


# ---------------------------------------------------------------- 2D extrusions
def shape_slab(name, geom, z0, z1, bevel=0.0, bevel_seg=3, uv_scale=None, spacing=0.06):
    """Extrude a shapely (multi)polygon from z0 to z1 with a rounded top edge
    of radius `bevel` (made by insetting the outline).  Bottom left flat."""
    polys = [geom] if geom.geom_type == 'Polygon' else list(geom.geoms)
    allV = []
    allF = []
    off = 0
    for poly in polys:
        if poly.is_empty or poly.area < 1e-8:
            continue
        # rings of insets for the bevel profile
        levels = []
        if bevel > 0:
            for k in range(bevel_seg + 1):
                a = (math.pi / 2) * k / bevel_seg
                inset = bevel * (1 - math.cos(a))
                z = z1 - bevel + bevel * math.sin(a)
                levels.append((inset, z))
        else:
            levels = [(0.0, z1)]
        # build per-level polygons by buffering (topology must be stable)
        lvl_polys = []
        ok = True
        for inset, z in levels:
            p = poly.buffer(-inset, join_style=1, quad_segs=8) if inset > 1e-9 else poly
            if p.is_empty or p.geom_type != 'Polygon' or len(p.interiors) != len(poly.interiors):
                ok = False
                break
            lvl_polys.append((p, z))
        if not ok:
            lvl_polys = [(poly, z1)]
        # resample each ring of each level to the same count (by arc length)
        base = lvl_polys[0][0]
        rings0 = [base.exterior] + list(base.interiors)
        counts = [max(16, int(r.length / spacing)) for r in rings0]
        counts = [min(c, 400) for c in counts]

        def resample(ring, nn, ref_start=None):
            ln = ring.length
            pts = np.array([ring.interpolate(ln * i / nn).coords[0] for i in range(nn)])
            if ref_start is not None:
                j = np.argmin(np.sum((pts - ref_start) ** 2, 1))
                pts = np.roll(pts, -j, 0)
            return pts

        level_rings = []
        for li_, (p, z) in enumerate(lvl_polys):
            rings = [p.exterior] + list(p.interiors)
            rr = []
            for ri, ring in enumerate(rings):
                pts = resample(ring, counts[ri], None if li_ == 0 else level_rings[0][ri][0])
                # orientation: exterior CCW, interiors CW
                ar = 0.5 * np.sum(pts[:, 0] * np.roll(pts[:, 1], -1) - np.roll(pts[:, 0], -1) * pts[:, 1])
                want_ccw = (ri == 0)
                if (ar > 0) != want_ccw:
                    pts = pts[::-1]
                    pts = np.roll(pts, 1, 0)
                rr.append(pts)
            level_rings.append(rr)
        # re-align starts after orientation fixing
        for li_ in range(1, len(level_rings)):
            for ri in range(len(level_rings[li_])):
                ref = level_rings[0][ri][0]
                pts = level_rings[li_][ri]
                j = np.argmin(np.sum((pts - ref) ** 2, 1))
                level_rings[li_][ri] = np.roll(pts, -j, 0)
        V = []
        F = []
        # bottom ring at z0 (outer outline)
        ring_idx = []  # [level][ring] -> start index
        zs = [z0] + [z for _, z in lvl_polys]
        rings_per_level = [level_rings[0]] + level_rings
        for L, rr in enumerate(rings_per_level):
            starts = []
            for pts in rr:
                starts.append(len(V))
                for q in pts:
                    V.append((q[0], q[1], zs[L]))
            ring_idx.append(starts)
        # side quads between consecutive levels
        for L in range(len(rings_per_level) - 1):
            for ri, pts in enumerate(rings_per_level[L]):
                nn = len(pts)
                a0 = ring_idx[L][ri]
                b0 = ring_idx[L + 1][ri]
                for i in range(nn):
                    i2 = (i + 1) % nn
                    F.append((a0 + i, a0 + i2, b0 + i2, b0 + i))
        # caps: top (last level) and bottom (level 0) via earcut
        def cap(level, top):
            rr = rings_per_level[level]
            flat = np.concatenate(rr, 0)
            ends = np.cumsum([len(p) for p in rr]).astype(np.uint32)
            tri = earcut.triangulate_float64(flat, ends).reshape(-1, 3)
            base_i = ring_idx[level][0]
            for t in tri:
                if top:
                    F.append((base_i + t[0], base_i + t[1], base_i + t[2]))
                else:
                    F.append((base_i + t[0], base_i + t[2], base_i + t[1]))
        cap(len(rings_per_level) - 1, True)
        cap(0, False)
        V = np.array(V)
        allV.append(V)
        allF.extend([tuple(i + off for i in f) for f in F])
        off += len(V)
    V = np.concatenate(allV, 0)
    me = bpy.data.meshes.new(name)
    me.from_pydata(V.tolist(), [], allF)
    me.update()
    return me
