"""Straighten one strand of a bracelet photo into a strip texture.
    python strip.py <image> <out.png> <half_width_px> x0,y0 x1,y1 ...   (points in image pixels)
A smooth line through the points; at every pixel along it, the line of pixels across it is laid
out as a column, so the strip runs along the strand (u) and across it (v)."""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage
from scipy.interpolate import splprep, splev

src, out, hw = sys.argv[1], sys.argv[2], float(sys.argv[3])
pts = np.array([[float(v) for v in p.split(',')] for p in sys.argv[4:]])
im = Image.open(src).convert('RGBA')
bg = Image.new('RGBA', im.size, (0, 0, 0, 255))
bg.alpha_composite(im)
a = np.asarray(bg.convert('RGB')).astype(np.float32)
tck, _ = splprep([pts[:, 0], pts[:, 1]], s=len(pts) * 4, k=min(3, len(pts) - 1))
uu = np.linspace(0, 1, 4000)
x, y = splev(uu, tck)
C = np.stack([x, y], 1)
seg = np.linalg.norm(np.diff(C, axis=0), axis=1)
cum = np.r_[0, np.cumsum(seg)]
L = int(cum[-1])
s = np.arange(L)
cx, cy = np.interp(s, cum, C[:, 0]), np.interp(s, cum, C[:, 1])
tx, ty = np.gradient(cx), np.gradient(cy)
n = np.hypot(tx, ty)
nx, ny = -ty / n, tx / n
v = np.arange(-hw, hw)
X = cx[None, :] + v[:, None] * nx[None, :]
Y = cy[None, :] + v[:, None] * ny[None, :]
strip = np.stack([ndimage.map_coordinates(a[..., c], [Y, X], order=1, mode='nearest') for c in range(3)], -1)
Image.fromarray(np.clip(strip, 0, 255).astype(np.uint8)).save(out)
print(out, strip.shape)
