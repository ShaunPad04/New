"""Straighten a bar's photo into a flat texture for its 3D face.
usage: python rectify.py <cutout.png|webp> <out_prefix> [n_bars]
Finds each bar in the alpha mask (connected components, largest n), turns it upright by its
principal axis, crops to the bar and bleeds the colour out past the edge (no dark fringe when
the texture is sampled at the rounded corners). Writes <out_prefix>_<i>.png and prints sizes."""
import sys, json
import numpy as np
from PIL import Image
from scipy import ndimage

src, out = sys.argv[1], sys.argv[2]
n = int(sys.argv[3]) if len(sys.argv) > 3 else 1
im = Image.open(src).convert('RGBA')
a = np.asarray(im)
mask = a[..., 3] > 128
lab, k = ndimage.label(mask)
sizes = ndimage.sum(mask, lab, range(1, k + 1))
order = np.argsort(sizes)[::-1][:n]
res = []
# left to right
comps = sorted([o + 1 for o in order], key=lambda c: np.argwhere(lab == c)[:, 1].mean())
for i, c in enumerate(comps):
    ys, xs = np.nonzero(lab == c)
    cx, cy = xs.mean(), ys.mean()
    cov = np.cov(np.stack([xs - cx, ys - cy]))
    w, v = np.linalg.eigh(cov)
    major = v[:, np.argmax(w)]           # long axis
    ang = np.degrees(np.arctan2(major[0], major[1]))   # angle from vertical
    if ang > 90: ang -= 180
    if ang < -90: ang += 180
    # crop generously around the component, rotate so the long axis is vertical
    y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
    pad = 40
    sub = im.crop((max(0, x0 - pad), max(0, y0 - pad), min(im.width, x1 + pad), min(im.height, y1 + pad)))
    sl = (lab[max(0, y0 - pad):min(im.height, y1 + pad), max(0, x0 - pad):min(im.width, x1 + pad)] == c)
    rgba = np.asarray(sub).copy(); rgba[..., 3] = np.where(sl, rgba[..., 3], 0)
    sub = Image.fromarray(rgba).rotate(-ang, resample=Image.BICUBIC, expand=True)
    bb = Image.fromarray((np.asarray(sub)[..., 3] > 128).astype(np.uint8) * 255).getbbox()
    sub = sub.crop(bb)
    # bleed colour into transparent pixels (push-pull) so edges sample cleanly
    arr = np.asarray(sub).astype(np.float32)
    al = arr[..., 3:] / 255.0
    rgb = arr[..., :3] * al
    wsum = al.copy()
    for s in (2, 4, 8, 16, 32):
        rgb_b = ndimage.gaussian_filter(rgb, (s, s, 0)); w_b = ndimage.gaussian_filter(wsum, (s, s, 0))
        fill = rgb_b / np.maximum(w_b, 1e-4)
        need = (wsum < 0.99)
        rgb = np.where(need, fill * np.maximum(wsum, 0) + 0, rgb)
        rgb = np.where(need, fill, arr[..., :3] * al + fill * (1 - al))
        wsum = np.maximum(wsum, (w_b > 1e-3).astype(np.float32))
    outimg = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8), 'RGB')
    p = f'{out}_{i}.png'
    outimg.save(p)
    Image.fromarray(np.asarray(sub)[..., 3]).save(f'{out}_{i}_alpha.png')
    res.append(dict(path=p, w=outimg.width, h=outimg.height, angle=round(float(ang), 2), aspect=round(outimg.width / outimg.height, 4)))
print(json.dumps(res))
