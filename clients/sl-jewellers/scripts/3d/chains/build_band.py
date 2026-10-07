"""A link bracelet as a closed band, its faces S&L's own photo, built in Blender (bpy 5.2).

    python build_band.py <spec.json> <out.glb>

spec: {"length_mm": 228, "width_mm": 10, "depth_mm": 4.5, "aspect": 0.8,
       "front_tile": "front_strip.png", "front_crop": [260, 800],   # pixels along the strip
       "back_tile": "back_strip.png", "back_crop": [1150, 1872],
       "tile_span": 1.1,      # the strip's height covers this many band widths (the hinges stick out)
       "metal": [0.97, 0.70, 0.33]}
The band lies as an oval facing the camera (-Y), as the necklaces do; its front carries a
straightened strip of the bracelet's own photographed links (strip.py), tiled round, its back
the studio back image's strip, its edges plain gold. A relief map from each photo gives the
engraving and the hinges some depth as it turns."""
import json
import math
import os
import sys

import bpy
import bmesh  # noqa: E402
import numpy as np
from PIL import Image
from scipy import ndimage

MM = 0.001


def ellipse(a, b, n=1600):
    t = np.linspace(0, 2 * math.pi, n, endpoint=False)
    P = np.stack([a * np.cos(t), b * np.sin(t)], 1)
    seg = np.linalg.norm(np.diff(np.vstack([P, P[:1]]), axis=0), axis=1)
    return P, np.r_[0, np.cumsum(seg)][:-1], seg.sum()


def rrect(hw, hd, r, n_side=6, n_arc=6):
    """Cross-section: across the band (u) and through its depth (v), counter-clockwise."""
    pts = []
    corners = [(hw - r, hd - r, 0), (-hw + r, hd - r, 90), (-hw + r, -hd + r, 180), (hw - r, -hd + r, 270)]
    for cx, cy, a0 in corners:
        for i in range(n_arc + 1):
            a = math.radians(a0 + 90 * i / n_arc)
            pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
        # straight run to the next corner
    return np.array(pts)


def normal_map(img, dst, strength=2.0, sigma=6):
    g = np.asarray(img.convert('L')).astype(np.float32) / 255
    h = ndimage.gaussian_filter(g - ndimage.gaussian_filter(g, sigma), 0.8)
    gy, gx = np.gradient(h)
    n = np.stack([-gx * strength * 10, gy * strength * 10, np.ones_like(h)], -1)
    n /= np.linalg.norm(n, axis=2)[..., None]
    Image.fromarray(((n * 0.5 + 0.5) * 255).astype(np.uint8)).save(dst, quality=92)


def material(name, tex=None, nrm=None, base=(0.97, 0.7, 0.33), metallic=1.0, rough=0.2):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    b = nt.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*base, 1)
    b.inputs['Metallic'].default_value = metallic
    b.inputs['Roughness'].default_value = rough
    if tex:
        t = nt.nodes.new('ShaderNodeTexImage')
        t.image = bpy.data.images.load(tex)
        nt.links.new(t.outputs['Color'], b.inputs['Base Color'])
    if nrm:
        t = nt.nodes.new('ShaderNodeTexImage')
        t.image = bpy.data.images.load(nrm)
        t.image.colorspace_settings.name = 'Non-Color'
        nm = nt.nodes.new('ShaderNodeNormalMap')
        nm.inputs['Strength'].default_value = 0.8
        nt.links.new(t.outputs['Color'], nm.inputs['Color'])
        nt.links.new(nm.outputs['Normal'], b.inputs['Normal'])
    return m


def build(spec, out):
    here = os.path.dirname(SPEC)
    rel = lambda p: p if os.path.isabs(p) else os.path.join(here, p)
    bpy.ops.wm.read_factory_settings(use_empty=True)
    tmp = os.path.join(os.path.dirname(out), 'tex_band')
    os.makedirs(tmp, exist_ok=True)
    W, D = spec['width_mm'], spec['depth_mm']
    # tiles: crop, save as JPEG, relief maps
    tiles = {}
    for side in ('front', 'back'):
        im = Image.open(rel(spec[side + '_tile'])).convert('RGB')
        a, b = spec[side + '_crop']
        im = im.crop((a, 0, b, im.height))
        jpg = os.path.join(tmp, side + '.jpg')
        im.save(jpg, quality=90)
        nrm = os.path.join(tmp, side + '_n.jpg')
        normal_map(im, nrm)
        span = spec.get(side + '_span', spec.get('tile_span', 1.1)) * W   # mm the strip's height covers
        tiles[side] = (jpg, nrm, im.width * span / im.height)   # tile length in mm along the band
    # the oval: semi-axes from the length and aspect (Ramanujan's perimeter, solved for scale)
    k = spec.get('aspect', 0.8)
    L = spec['length_mm']
    per = lambda a, b: math.pi * (3 * (a + b) - math.sqrt((3 * a + b) * (a + 3 * b)))
    bsemi = L / per(k, 1.0)
    P, s, total = ellipse(k * bsemi, bsemi)
    # whole tiles round the loop, each stretched a touch to close the ring
    for side in tiles:
        jpg, nrm, tl = tiles[side]
        n = max(1, round(total / tl))
        tiles[side] = (jpg, nrm, total / n)
    T = np.gradient(np.vstack([P[-1:], P, P[:1]]), axis=0)[1:-1]
    T /= np.linalg.norm(T, axis=1)[:, None]
    Nn = np.stack([T[:, 1], -T[:, 0]], 1)                 # outward in the plane
    sec = rrect(W / 2, D / 2, min(1.2, D / 2 - 0.05))
    m = len(sec)
    V, F, UV = [], [], []
    nP = len(P)
    # one ring more than the points: the last repeats the first at the full length, so the
    # textures run on round the seam instead of squeezing back to the start in one face
    for i in range(nP + 1):
        k = i % nP
        for u, v in sec:
            x, z = P[k] + u * Nn[k]
            V.append((x, -v, z))                            # v>0 toward the camera (-Y)
            UV.append((s[k] if i < nP else total, u))
    V = np.array(V)
    UV = np.array(UV)
    for i in range(nP):
        j = i + 1
        for q in range(m):
            q2 = (q + 1) % m
            F.append((i * m + q, i * m + q2, j * m + q2, j * m + q))
    me = bpy.data.meshes.new('band')
    me.from_pydata((V * MM).tolist(), [], F)
    me.update()
    bm = bmesh.new()
    bm.from_mesh(me)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me)
    bm.free()
    mf = material('front', tiles['front'][0], tiles['front'][1], metallic=0.55, rough=0.35)
    mb = material('back', tiles['back'][0], tiles['back'][1], metallic=0.55, rough=0.3)
    ms = material('edge', base=tuple(spec['metal']), rough=0.18)
    for mt in (mf, mb, ms):
        me.materials.append(mt)
    lay = me.uv_layers.new(name='UVMap')
    for poly in me.polygons:
        ny = poly.normal.y
        mi = 0 if ny < -0.6 else (1 if ny > 0.6 else 2)
        poly.material_index = mi
        for li in poly.loop_indices:
            vi = me.loops[li].vertex_index
            ss, uu = UV[vi]
            if mi == 0:
                tl = tiles['front'][2]
                lay.data[li].uv = (ss / tl, 0.5 + uu / (spec.get('front_span', spec.get('tile_span', 1.1)) * W))
            elif mi == 1:
                tl = tiles['back'][2]
                lay.data[li].uv = (-ss / tl, 0.5 + uu / (spec.get('back_span', spec.get('tile_span', 1.1)) * W))
            else:
                lay.data[li].uv = (ss / 10, 0)
    me.shade_smooth()
    ob = bpy.data.objects.new('bracelet', me)
    bpy.context.scene.collection.objects.link(ob)
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=True, export_yup=True,
                              export_normals=True, export_texcoords=True, export_materials='EXPORT')
    print('exported', out, os.path.getsize(out))


if __name__ == '__main__':
    a = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:]
    SPEC = os.path.abspath(a[0])
    build(json.load(open(a[0])), a[1])
