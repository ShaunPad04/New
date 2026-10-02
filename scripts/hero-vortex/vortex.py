"""
Black Line hero loop: a vortex of dotted rings with real depth of field,
our own render in the spirit of Neiden's hero film (nothing of theirs used).

Run: blender -b -P vortex.py -- <out_dir> <mode>   (mode: still | anim)

The rings form a full torus; the whole torus turns about its own axis by
exactly K ring-spacings over the loop, so frame N+1 == frame 1 (seamless).
"""
import bpy, bmesh, math, random, sys

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
OUT = argv[0] if argv else "//"
MODE = argv[1] if len(argv) > 1 else "still"
RES_X = int(argv[2]) if len(argv) > 2 else 1920
RES_Y = int(argv[3]) if len(argv) > 3 else 1080

FPS = 24
SECONDS = 10
FRAMES = FPS * SECONDS
RINGS = 96            # rings around the torus
DOTS = 480            # dots per ring; K/RINGS*TWIST*DOTS must be whole (3/96*5*480 = 75) or the loop seam jumps
MAJOR = 5.0           # torus major radius
MINOR = 2.3           # ring radius
TWIST = 5.0           # full phase turns of the dots around the torus (slinky twist)
K = 3                 # ring-spacings travelled per loop

random.seed(7)
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

# ---------- render ----------
for eng in ("BLENDER_EEVEE", "BLENDER_EEVEE_NEXT"):
    try:
        scene.render.engine = eng
        break
    except TypeError:
        pass
scene.render.resolution_x = RES_X
scene.render.resolution_y = RES_Y
scene.render.fps = FPS
scene.frame_start = 1
scene.frame_end = FRAMES
scene.view_settings.view_transform = "Standard"
scene.view_settings.look = "None"
scene.view_settings.exposure = -1.45
for attr, val in (("taa_render_samples", 64), ("use_bokeh_jittered", True), ("bokeh_max_size", 400.0), ("bokeh_overblur", 12.0)):
    try:
        setattr(scene.eevee, attr, val)
    except (AttributeError, TypeError):
        print("eevee: no", attr)
world = bpy.data.worlds.new("W")
world.use_nodes = True
world.node_tree.nodes["Background"].inputs[0].default_value = (0, 0, 0, 1)
scene.world = world


def emissive(name, strength):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    e = nt.nodes.new("ShaderNodeEmission")
    e.inputs["Color"].default_value = (1, 1, 1, 1)
    e.inputs["Strength"].default_value = strength
    o = nt.nodes.new("ShaderNodeOutputMaterial")
    nt.links.new(e.outputs[0], o.inputs[0])
    return m


def point_object(name, verts, radius, material):
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], [])
    obj = bpy.data.objects.new(name, mesh)
    scene.collection.objects.link(obj)
    mod = obj.modifiers.new("dots", "NODES")
    tree = bpy.data.node_groups.new(name + "_gn", "GeometryNodeTree")
    tree.interface.new_socket("Geometry", in_out="INPUT", socket_type="NodeSocketGeometry")
    tree.interface.new_socket("Geometry", in_out="OUTPUT", socket_type="NodeSocketGeometry")
    gi = tree.nodes.new("NodeGroupInput")
    go = tree.nodes.new("NodeGroupOutput")
    ico = tree.nodes.new("GeometryNodeMeshIcoSphere")
    ico.inputs["Radius"].default_value = radius
    ico.inputs["Subdivisions"].default_value = 1
    sm = tree.nodes.new("GeometryNodeSetMaterial")
    sm.inputs["Material"].default_value = material
    inst = tree.nodes.new("GeometryNodeInstanceOnPoints")
    tree.links.new(ico.outputs["Mesh"], sm.inputs["Geometry"])
    tree.links.new(gi.outputs[0], inst.inputs["Points"])
    tree.links.new(sm.outputs[0], inst.inputs["Instance"])
    tree.links.new(inst.outputs[0], go.inputs[0])
    mod.node_group = tree
    return obj


# ---------- the vortex ----------
verts = []
for i in range(RINGS):
    u = i / RINGS * math.tau
    cu, su = math.cos(u), math.sin(u)
    for j in range(DOTS):
        v = j / DOTS * math.tau + u * TWIST
        r = MAJOR + MINOR * math.cos(v)
        verts.append((r * cu, r * su, MINOR * math.sin(v)))
vortex = point_object("vortex", verts, 0.0055, emissive("dot", 2.2))

# One loop = K ring-spacings about the torus axis, set per frame by a handler
# (exactly linear), so frame FRAMES+1 would equal frame 1: a seamless loop.
vortex.rotation_mode = "ZXY"   # Z (the torus's own axis) applied first
TILT = (0.32, 0.18)


def spin(scn, *_):
    z = (scn.frame_current - 1) / FRAMES * K * math.tau / RINGS
    vortex.rotation_euler = (TILT[0], TILT[1], z)


bpy.app.handlers.frame_change_pre.append(spin)

# ---------- dust ----------
dust = [(random.uniform(-9, 9), random.uniform(-9, 9), random.uniform(-4, 4)) for _ in range(700)]
dust_obj = point_object("dust", dust, 0.008, emissive("dust", 0.9))
# Each mote traces its own small closed circle once per loop, so it drifts
# and still lands back where it began (parenting it to the spin did not).
dust_phase = [(random.uniform(0.15, 0.5), random.uniform(0, math.tau)) for _ in dust]


def drift(scn, *_):
    a = (scn.frame_current - 1) / FRAMES * math.tau
    for v, (x, y, z), (r, ph) in zip(dust_obj.data.vertices, dust, dust_phase):
        v.co = (x + r * math.cos(a + ph), y + r * math.sin(a + ph), z + 0.5 * r * math.sin(2 * a + ph))
    dust_obj.data.update()


bpy.app.handlers.frame_change_pre.append(drift)

# ---------- camera ----------
cam_data = bpy.data.cameras.new("cam")
cam_data.lens = 26
cam_data.dof.use_dof = True
cam_data.dof.aperture_fstop = 0.12
cam = bpy.data.objects.new("cam", cam_data)
scene.collection.objects.link(cam)
scene.camera = cam
# Inside the ring of the torus, near one side, looking along the tube so it
# sweeps across the frame with the dark hole in the middle.
cam.location = (MAJOR + 0.2, -2.6, 0.55)
target = bpy.data.objects.new("target", None)
target.location = (MAJOR * 0.55, 2.4, 0.15)
scene.collection.objects.link(target)
track = cam.constraints.new("TRACK_TO")
track.target = target
track.track_axis = "TRACK_NEGATIVE_Z"
track.up_axis = "UP_Y"

focus = bpy.data.objects.new("focus", None)
focus.location = (MAJOR * 0.3, 4.2, 0.6)
scene.collection.objects.link(focus)
cam_data.dof.focus_object = focus

scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGB"
if MODE == "still":
    scene.frame_set(1)
    scene.render.filepath = OUT + "/still.png"
    bpy.ops.render.render(write_still=True)
else:
    scene.render.filepath = OUT + "/f_"
    bpy.ops.render.render(animation=True)
