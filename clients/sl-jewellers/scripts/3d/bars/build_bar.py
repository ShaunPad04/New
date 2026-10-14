"""Cast silver bars for the product page's 3D view, built in Blender (bpy 5.2).

    python build_bar.py <spec.json> <out.glb>

spec: {"bars": [{"L": 107, "W": 46.8, "T": 10, "x": 0, "z": 0,
                 "front": "front.png", "back": "back.png"}],
       "draft": 1.2, "corner": 5.0, "fillet_front": 2.2, "fillet_back": 1.6,
       "sleeve": false}
L along Blender Z (upright), W along X, T along Y; the stamped face looks at -Y (the camera,
as the watches' dials do) and the mould-bottom face at +Y. "front" and "back" are straightened
photos of each face (rectify.py), mapped straight on: what the camera saw from the front and
from behind. The sides are cast silver, the mould-bottom face a little smaller than the top
(the draft of the mould), every edge rounded, the surfaces faintly uneven, as cast bars are.
Units are millimetres in the build, metres in the file.
"""
import json
import math
import os
import sys

import bpy
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

MM = 0.001


# ------------------------------------------------------------------ outline
def rounded_rect(hx, hz, r, n_long=48, n_short=20, n_arc=14):
    """Points (x, z) of a rounded rectangle, counter-clockwise from the middle of the right side.
    Always the same number of points in the same places, so rings of different sizes line up."""
    r = max(0.05, min(r, hx - 0.01, hz - 0.01))
    pts = []

    def seg(a, b, n):
        for i in range(n):
            t = i / n
            pts.append((a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t))

    def arc(cx, cz, a0, n):
        for i in range(n):
            a = math.radians(a0 + 90 * i / n)
            pts.append((cx + r * math.cos(a), cz + r * math.sin(a)))

    seg((hx, 0), (hx, hz - r), n_long // 2)
    arc(hx - r, hz - r, 0, n_arc)
    seg((hx - r, hz), (-hx + r, hz), n_short)
    arc(-hx + r, hz - r, 90, n_arc)
    seg((-hx, hz - r), (-hx, -hz + r), n_long)
    arc(-hx + r, -hz + r, 180, n_arc)
    seg((-hx + r, -hz), (hx - r, -hz), n_short)
    arc(hx - r, -hz + r, 270, n_arc)
    seg((hx, -hz + r), (hx, 0), n_long // 2)
    return np.array(pts)


def bar_rings(L, W, T, draft, corner, ff, fb, n_cap=22, n_fil=10, n_side=8):
    """Rings of (x, y, z) from the centre of the stamped face round to the centre of the back.
    Returns rings (list of (n,3)) and a per-ring tag: 'front', 'side' or 'back'."""
    hx, hz = W / 2, L / 2
    rings, tags = [], []
    y0, y1 = -T / 2, T / 2

    def wall(y):
        # the side wall's outline at depth y: full size at the stamped face, inset by the draft
        # at the back
        t = (y - y0) / (y1 - y0)
        return hx - draft * t, hz - draft * t, corner - draft * t * 0.5

    # stamped face: concentric rings scaled about the centre
    fx, fz, fr = wall(y0)
    inner = rounded_rect(fx - ff, fz - ff, max(0.3, fr - ff))
    for i in range(n_cap):
        s = (i + 1) / n_cap
        P = inner * s
        rings.append(np.column_stack([P[:, 0], np.full(len(P), y0), P[:, 1]]))
        tags.append('front')
    # front fillet
    for i in range(1, n_fil + 1):
        a = math.pi / 2 * i / n_fil
        y = y0 + ff * (1 - math.cos(a))
        wx, wz, wr = wall(y)
        inset = ff * (1 - math.sin(a))
        P = rounded_rect(wx - inset, wz - inset, max(0.3, wr - inset))
        rings.append(np.column_stack([P[:, 0], np.full(len(P), y), P[:, 1]]))
        tags.append('front' if a < math.radians(55) else 'side')
    # tapered side
    for i in range(1, n_side):
        y = (y0 + ff) + (y1 - fb - (y0 + ff)) * i / n_side
        wx, wz, wr = wall(y)
        P = rounded_rect(wx, wz, wr)
        rings.append(np.column_stack([P[:, 0], np.full(len(P), y), P[:, 1]]))
        tags.append('side')
    # back fillet
    for i in range(0, n_fil + 1):
        a = math.pi / 2 * i / n_fil
        y = (y1 - fb) + fb * math.sin(a)
        wx, wz, wr = wall(y)
        inset = fb * (1 - math.cos(a))
        P = rounded_rect(wx - inset, wz - inset, max(0.3, wr - inset))
        rings.append(np.column_stack([P[:, 0], np.full(len(P), y), P[:, 1]]))
        tags.append('back' if a > math.radians(35) else 'side')
    # mould-bottom face
    bx, bz, br = wall(y1)
    inner_b = rounded_rect(bx - fb, bz - fb, max(0.3, br - fb))
    for i in range(n_cap - 1, 0, -1):
        s = i / n_cap
        P = inner_b * s
        rings.append(np.column_stack([P[:, 0], np.full(len(P), y1), P[:, 1]]))
        tags.append('back')
    return rings, tags


def uneven(V, L, W, T, seed, amp_face=0.10, amp_side=0.06):
    """Faint cast unevenness: a smooth noise field pushed along each point's outward direction,
    a little more on the faces than the sides, plus the slight dome of the poured face."""
    rng = np.random.default_rng(seed)
    g = rng.normal(0, 1, (24, 24, 8))
    g = ndimage.gaussian_filter(g, 2.2)
    g /= np.abs(g).max()
    ix = (V[:, 0] / W + 0.5) * 23
    iz = (V[:, 2] / L + 0.5) * 23
    iy = (V[:, 1] / T + 0.5) * 7
    n = ndimage.map_coordinates(g, [ix, iz, iy], order=1, mode='nearest')
    face = np.abs(V[:, 1]) > T / 2 - 0.01
    out = V.copy()
    # faces move along y, sides outward in the plane
    out[face, 1] += np.sign(V[face, 1]) * amp_face * n[face]
    r = np.hypot(V[:, 0] / W, V[:, 2] / L) + 1e-9
    side = ~face
    out[side, 0] += amp_side * n[side] * (V[side, 0] / W) / r[side]
    out[side, 2] += amp_side * n[side] * (V[side, 2] / L) / r[side]
    # the poured (stamped) face domes a touch in the middle
    d = 1 - np.clip((V[:, 0] / (W / 2)) ** 2 + (V[:, 2] / (L / 2)) ** 2, 0, 1)
    out[face & (V[:, 1] < 0), 1] -= 0.18 * d[face & (V[:, 1] < 0)]
    return out


def loft(rings):
    """Quads between consecutive rings, triangle fans to close each end."""
    n = len(rings[0])
    V = [np.zeros((1, 3)) + rings[0].mean(0)]
    V[0][0, 1] = rings[0][0, 1]
    V += rings
    V.append(np.zeros((1, 3)) + rings[-1].mean(0))
    V[-1][0, 1] = rings[-1][0, 1]
    V = np.concatenate(V)
    F = []
    c0 = 0
    for i in range(n):  # front fan
        F.append((c0, 1 + (i + 1) % n, 1 + i))
    for k in range(len(rings) - 1):
        a = 1 + k * n
        b = 1 + (k + 1) * n
        for i in range(n):
            j = (i + 1) % n
            F.append((a + i, a + j, b + j, b + i))
    c1 = len(V) - 1
    last = 1 + (len(rings) - 1) * n
    for i in range(n):
        F.append((c1, last + i, last + (i + 1) % n))
    # the rings run counter-clockwise seen from the stamped face; reverse every face so the
    # normals point out of the bar
    return V, [tuple(reversed(f)) for f in F]


# ------------------------------------------------------------------ textures
def normal_from_photo(src, dst, strength=2.2, sigma=7):
    """A gentle relief from the photo: stamped letters and pits are darker than the face around
    them, so the high-passed luminance stands in for a height field."""
    im = np.asarray(Image.open(src).convert('L')).astype(np.float32) / 255.0
    hp = im - ndimage.gaussian_filter(im, sigma)
    h = ndimage.gaussian_filter(hp, 0.8)
    gy, gx = np.gradient(h)
    nx, ny, nz = -gx * strength * 10, gy * strength * 10, np.ones_like(h)
    l = np.sqrt(nx * nx + ny * ny + nz * nz)
    rgb = np.stack([nx / l, ny / l, nz / l], -1) * 0.5 + 0.5
    Image.fromarray((rgb * 255 + 0.5).astype(np.uint8)).save(dst, quality=92)


def side_texture(photos, dst, size=1024, seed=5):
    """Cast silver for the sides: the faces' own mean colour, fine mottling and the faint
    horizontal flow lines a poured edge carries."""
    cols = []
    for p in photos:
        a = np.asarray(neutral(p)).reshape(-1, 3).astype(np.float32)
        cols.append(np.median(a, 0))
    base = np.mean(cols, 0)
    rng = np.random.default_rng(seed)
    n1 = ndimage.gaussian_filter(rng.normal(0, 1, (size, size)), 6)
    n2 = ndimage.gaussian_filter(rng.normal(0, 1, (size, size)), (1.0, 18))
    n = n1 / np.abs(n1).max() * 0.10 + n2 / np.abs(n2).max() * 0.06
    img = np.clip(base[None, None, :] * (1 + n[..., None]), 0, 255).astype(np.uint8)
    Image.fromarray(img).save(dst, quality=90)


def neutral(src, cool=1.015):
    """Silver is colourless: take the shop photo's warm cast out (each channel scaled to the
    same mean, brightness kept), with the faintest cool lean of polished silver."""
    a = np.asarray(Image.open(src).convert('RGB')).astype(np.float32)
    m = a.reshape(-1, 3).mean(0)
    g = m.mean() / m
    g[2] *= cool
    return Image.fromarray(np.clip(a * g, 0, 255).astype(np.uint8))


# ------------------------------------------------------------------ blender
def material(name, base_tex=None, normal_tex=None, base=(0.8, 0.8, 0.8), metallic=0.85, rough=0.36,
             normal_strength=1.0, alpha=None):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    b = nt.nodes['Principled BSDF']
    b.inputs['Metallic'].default_value = metallic
    b.inputs['Roughness'].default_value = rough
    b.inputs['Base Color'].default_value = (*base, 1)
    if base_tex:
        t = nt.nodes.new('ShaderNodeTexImage')
        t.image = bpy.data.images.load(base_tex)
        nt.links.new(t.outputs['Color'], b.inputs['Base Color'])
    if normal_tex:
        t = nt.nodes.new('ShaderNodeTexImage')
        t.image = bpy.data.images.load(normal_tex)
        t.image.colorspace_settings.name = 'Non-Color'
        nm = nt.nodes.new('ShaderNodeNormalMap')
        nm.inputs['Strength'].default_value = normal_strength
        nt.links.new(t.outputs['Color'], nm.inputs['Color'])
        nt.links.new(nm.outputs['Normal'], b.inputs['Normal'])
    if alpha is not None:
        b.inputs['Transmission Weight'].default_value = 1.0
        b.inputs['IOR'].default_value = 1.49
        b.inputs['Roughness'].default_value = 0.08
        b.inputs['Metallic'].default_value = 0.0
    return m


def build(spec, out):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    tmp = os.path.join(os.path.dirname(out), 'tex_' + os.path.splitext(os.path.basename(out))[0])
    os.makedirs(tmp, exist_ok=True)
    photos = []
    for b in spec['bars']:
        photos += [b['front'], b['back']]
    side_png = os.path.join(tmp, 'side.jpg')
    side_texture(photos, side_png)
    m_side = material('cast_side', base_tex=side_png, metallic=0.85, rough=0.42)
    sleeve = material('sleeve', alpha=0.1) if spec.get('sleeve') else None
    for k, b in enumerate(spec['bars']):
        L, W, T = b['L'], b['W'], b['T']
        rings, tags = bar_rings(L, W, T, spec.get('draft', 1.2), spec.get('corner', 5.0),
                                spec.get('fillet_front', 2.2), spec.get('fillet_back', 1.6))
        V, F = loft(rings)
        V = uneven(V, L, W, T, seed=11 + k)
        # textures: the photo as colour, its relief as a normal map, copied as JPEG
        mats = []
        for side in ('front', 'back'):
            src = b[side]
            jpg = os.path.join(tmp, '%d_%s.jpg' % (k, side))
            neutral(src).save(jpg, quality=90)
            nrm = os.path.join(tmp, '%d_%s_n.jpg' % (k, side))
            normal_from_photo(src, nrm)
            mats.append(material('bar%d_%s' % (k, side), base_tex=jpg, normal_tex=nrm,
                                 metallic=spec.get('metallic', 0.55), rough=spec.get('rough', 0.42),
                                 normal_strength=0.6))
        me = bpy.data.meshes.new('bar%d' % k)
        Vw = V.copy()
        Vw[:, 0] += b.get('x', 0)
        Vw[:, 2] += b.get('z', 0)
        me.from_pydata((Vw * MM).tolist(), [], [list(f) for f in F])
        me.update()
        for m in (mats[0], mats[1], m_side):
            me.materials.append(m)
        # material per face by which way it looks; UVs planar for the faces, wrapped for sides
        me.calc_loop_triangles()
        uv = me.uv_layers.new(name='UVMap')
        hx, hz = W / 2, L / 2
        per = None
        n = len(rings[0])
        # arc-length coordinate round the ring for the side texture
        ring0 = rings[len(rings) // 2]
        seglen = np.r_[0, np.cumsum(np.linalg.norm(np.diff(np.vstack([ring0, ring0[:1]]), axis=0), axis=1))]
        per = seglen[-1]
        for poly in me.polygons:
            nrm = poly.normal
            if nrm.y < -0.45:
                mi = 0
            elif nrm.y > 0.45:
                mi = 1
            else:
                mi = 2
            poly.material_index = mi
            for li in poly.loop_indices:
                vi = me.loops[li].vertex_index
                x, y, z = V[vi]
                if mi == 0:
                    uv.data[li].uv = ((x + hx) / (2 * hx), (z + hz) / (2 * hz))
                elif mi == 1:
                    uv.data[li].uv = ((hx - x) / (2 * hx), (z + hz) / (2 * hz))
                else:
                    ri = max(0, (vi - 1)) % n
                    uv.data[li].uv = (seglen[ri] / per * (per / 40.0), (y + T / 2) / T)
        me.shade_smooth()
        ob = bpy.data.objects.new('bar%d' % k, me)
        bpy.context.scene.collection.objects.link(ob)
        if sleeve is not None:
            # a clear sleeve, a little bigger than the bar all round
            s_rings, _ = bar_rings(L + 1.6, W + 1.2, T + 0.9, 0.0, spec.get('corner', 5.0) + 0.6, 0.9, 0.9,
                                   n_cap=6, n_fil=6, n_side=3)
            Vs, Fs = loft(s_rings)
            Vs[:, 0] += b.get('x', 0)
            Vs[:, 2] += b.get('z', 0)
            ms = bpy.data.meshes.new('sleeve%d' % k)
            ms.from_pydata((Vs * MM).tolist(), [], [list(f) for f in Fs])
            ms.update()
            ms.materials.append(sleeve)
            ms.shade_smooth()
            o2 = bpy.data.objects.new('sleeve%d' % k, ms)
            bpy.context.scene.collection.objects.link(o2)
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=True, export_yup=True,
                              export_texcoords=True, export_normals=True, export_materials='EXPORT',
                              export_image_format='AUTO')
    print('exported', out, os.path.getsize(out))


if __name__ == '__main__':
    a = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:]
    build(json.load(open(a[0])), a[1])
