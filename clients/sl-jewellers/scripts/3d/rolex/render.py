"""Preview renders for the GMT build.  Usage:
   bpyenv/bin/python render.py <file.blend> <view>[,<view>...] [res] [samples] [outdir]
views: front, 34, side9, side3, back, top, head34, headfront, crown, macro_dial
Camera distances are in metres (world is upright: dial faces -Y, 12 o'clock +Z).
"""
import sys
import os
import math
import bpy
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))


def cam(name, loc, target, lens, shift=(0, 0), ortho=None, sensor=36.0):
    c = bpy.data.cameras.new(name)
    c.lens = lens
    c.sensor_width = sensor
    c.sensor_fit = 'AUTO'
    c.clip_start = 0.002
    c.clip_end = 20
    c.shift_x, c.shift_y = shift
    if ortho:
        c.type = 'ORTHO'
        c.ortho_scale = ortho
    o = bpy.data.objects.new(name, c)
    bpy.context.scene.collection.objects.link(o)
    o.location = loc
    d = Vector(target) - Vector(loc)
    o.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    return o


def sph(dist, az, el, target=(0, 0, 0)):
    """camera position: az measured from -Y (front) toward +X, el up."""
    a, e = math.radians(az), math.radians(el)
    x = dist * math.cos(e) * math.sin(a)
    y = -dist * math.cos(e) * math.cos(a)
    z = dist * math.sin(e)
    return (target[0] + x, target[1] + y, target[2] + z)


VIEWS = {
    # name: (location, target, lens, (resx, resy) aspect, hide_bracelet)
    'front': dict(loc=sph(0.62, 0, 0), tgt=(0, 0, -0.003), lens=220, aspect=(1.0, 1.0)),
    # catalogue upright: ~0.30 m camera, looking slightly up (camera below)
    '34': dict(loc=sph(0.34, 0, -8.5, (0, 0, 0.0)), tgt=(0, 0, 0.0), lens=99, aspect=(2400, 3571)),
    'side9': dict(loc=sph(0.55, -90, 0, (0, 0.024, -0.004)), tgt=(0, 0.024, -0.004), lens=150, aspect=(1.0, 1.0)),
    'side3': dict(loc=sph(0.55, 90, 0, (0, 0.024, -0.004)), tgt=(0, 0.024, -0.004), lens=150, aspect=(1.0, 1.0)),
    'back': dict(loc=sph(0.40, 180, 0), tgt=(0, 0, 0), lens=200, aspect=(1.0, 1.0), hide='loop', flag=False),
    'back34': dict(loc=sph(0.36, 140, 28, (0, 0.01, 0)), tgt=(0, 0.012, -0.003), lens=110, aspect=(1.0, 1.0), flag=False),
    'top': dict(loc=sph(0.42, 0, 89.9, (0, 0.020, 0)), tgt=(0, 0.020, 0), lens=130, aspect=(1.0, 1.0)),
    'head34': dict(loc=sph(0.30, -28, 22), tgt=(0, 0, 0), lens=120, aspect=(1.0, 1.0)),
    'headfront': dict(loc=sph(0.40, 0, 0), tgt=(0, 0, 0), lens=200, aspect=(1.0, 1.0), hide='loop'),
    'crown': dict(loc=sph(0.30, 62, 18, (0.02, 0, 0)), tgt=(0.021, 0, 0.0), lens=150, aspect=(1.0, 1.0)),
    'lug': dict(loc=sph(0.22, -35, 30, (-0.008, 0, 0.02)), tgt=(-0.008, 0, 0.02), lens=150, aspect=(1.0, 1.0)),
    'backstraight': dict(loc=sph(0.40, 180, 0), tgt=(0, 0, 0), lens=200, aspect=(1.0, 1.0), hide='loop', flag=False),
    'bezel12': dict(loc=sph(0.30, 0, -8.5, (0, 0, 0.0185)), tgt=(0, 0, 0.0185), lens=520, aspect=(1.0, 1.0)),
    'bezel9': dict(loc=sph(0.30, 0, -8.5, (-0.0175, 0, 0.0)), tgt=(-0.0175, 0, 0.0), lens=520, aspect=(1.0, 1.0)),
    'crownfront': dict(loc=sph(0.30, 0, -8.5, (0.021, 0, -0.001)), tgt=(0.021, 0, -0.001), lens=420, aspect=(1.0, 1.0)),
    'date': dict(loc=sph(0.30, 0, -8.5, (0.0092, 0, 0.0)), tgt=(0.0092, 0, 0.0), lens=600, aspect=(1.0, 1.0)),
    'macro_dial': dict(loc=sph(0.30, -15, 12), tgt=(0.002, 0, 0), lens=180, aspect=(1.0, 1.0)),
}


def main():
    a = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:]
    blend = a[0]
    views = a[1].split(',')
    res = int(a[2]) if len(a) > 2 else 1000
    samples = int(a[3]) if len(a) > 3 else 48
    outdir = os.path.abspath(a[4]) if len(a) > 4 else os.path.join(HERE, 'prev')
    os.makedirs(outdir, exist_ok=True)
    bpy.ops.wm.open_mainfile(filepath=blend)
    sc = bpy.context.scene
    sc.cycles.samples = samples
    sc.cycles.device = 'CPU'
    try:
        sc.cycles.use_denoising = True
        sc.cycles.denoiser = 'OPENIMAGEDENOISE'
    except Exception:
        pass
    sc.render.threads_mode = 'AUTO'
    for v in views:
        spec = VIEWS[v]
        ax, ay = spec['aspect']
        if ax >= ay:
            sc.render.resolution_x = res
            sc.render.resolution_y = int(round(res * ay / ax))
        else:
            sc.render.resolution_x = res
            sc.render.resolution_y = int(round(res * ay / ax))
        sc.render.resolution_percentage = 100
        c = cam('cam_' + v, spec['loc'], spec['tgt'], spec['lens'])
        sc.camera = c
        # aim the world's black lens-flag at the direction the (dial-facing)
        # crystal mirrors toward this camera
        d = (Vector(spec['tgt']) - Vector(spec['loc'])).normalized()
        n = Vector((0, -1, 0))
        r = d - 2 * d.dot(n) * n
        wn = sc.world.node_tree.nodes.get('hole_dot')
        if wn is not None:
            wn.inputs[1].default_value = tuple(r)
        mr = sc.world.node_tree.nodes.get('hole_mr')
        if mr is not None:
            mr.inputs['To Max'].default_value = 0.02 if spec.get('flag', True) else 1.0
        hidden = []
        if spec.get('hide') == 'loop':
            for o in bpy.data.objects:
                if o.name.startswith('bracelet') or o.name.startswith('clasp'):
                    if not o.hide_render:
                        o.hide_render = True
                        hidden.append(o)
        sc.render.filepath = os.path.join(outdir, 'r_%s.png' % v)
        bpy.ops.render.render(write_still=True)
        for o in hidden:
            o.hide_render = False
        print('rendered', sc.render.filepath, flush=True)


if __name__ == '__main__':
    main()
