"""Re-import gmt.glb into an empty Blender scene and report what came back."""
import bpy, os, json, struct
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
glb = os.path.join(HERE, 'gmt.glb')
# raw glTF JSON: asset, extensions, images
with open(glb, 'rb') as f:
    magic, ver, length = struct.unpack('<III', f.read(12))
    clen, ctype = struct.unpack('<II', f.read(8))
    js = json.loads(f.read(clen))
print('glTF version', js['asset'].get('version'), 'generator', js['asset'].get('generator'))
print('extensionsUsed', js.get('extensionsUsed'))
print('images', [(i.get('name'), i.get('mimeType'), 'bufferView' in i) for i in js.get('images', [])])
print('meshes', [m['name'] for m in js['meshes']])
print('nodes with transforms', [(n['name'], n.get('translation'), n.get('rotation'), n.get('scale')) for n in js['nodes'] if any(k in n for k in ('translation','rotation','scale'))])
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=glb)
obs = [o for o in bpy.data.objects if o.type == 'MESH']
mn = np.array([1e9]*3); mx = -mn
tri = 0
for o in obs:
    V = np.array([o.matrix_world @ v.co for v in o.data.vertices])
    mn = np.minimum(mn, V.min(0)); mx = np.maximum(mx, V.max(0))
    o.data.calc_loop_triangles(); tri += len(o.data.loop_triangles)
print('reimported meshes', len(obs), 'triangles', tri)
print('bbox min (m)', mn.round(5), 'max', mx.round(5))
case = bpy.data.objects.get('case')
if case:
    V = np.array([case.matrix_world @ v.co for v in case.data.vertices])
    print('case bbox (mm) x %.2f..%.2f  y %.2f..%.2f  z %.2f..%.2f' % (V[:,0].min()*1e3, V[:,0].max()*1e3, V[:,1].min()*1e3, V[:,1].max()*1e3, V[:,2].min()*1e3, V[:,2].max()*1e3))
print('packed images', [(i.name, i.size[:], i.packed_file is not None) for i in bpy.data.images])
