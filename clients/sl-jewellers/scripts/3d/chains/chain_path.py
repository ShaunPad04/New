"""A chain's centre-line from its cut-out photo.
    python chain_path.py <cutout.webp> <out.json> [--closed]
Skeletonises the alpha mask, walks the longest path through it (or the loop, for a closed
chain), smooths it, and measures the chain's width (twice the distance to the edge along the
line) and its link pitch (the period of the brightness along the line). Writes the path in
pixels with those measurements, and an overlay PNG beside the JSON to check it by eye."""
import json, sys, math
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
from scipy.interpolate import splprep, splev
from skimage.morphology import skeletonize

src, out = sys.argv[1], sys.argv[2]
closed = '--closed' in sys.argv
im = Image.open(src).convert('RGBA')
S = 900 / max(im.size)                        # work at ~900 px
sm = im.resize((round(im.width * S), round(im.height * S)), Image.LANCZOS)
a = np.asarray(sm)
mask = a[..., 3] > 110
mask = ndimage.binary_closing(mask, iterations=4)
mask = ndimage.binary_fill_holes(mask) & ~ndimage.binary_fill_holes(mask) | mask   # keep the loop's hole
# fill the gaps between links so the chain is one solid band
band = ndimage.binary_closing(mask, structure=np.ones((3, 3)), iterations=6)
lab, k = ndimage.label(band)
sizes = ndimage.sum(band, lab, range(1, k + 1))
band = lab == (np.argmax(sizes) + 1)
dist = ndimage.distance_transform_edt(band)
sk = skeletonize(band)
ys, xs = np.nonzero(sk)
pts = set(zip(ys.tolist(), xs.tolist()))
nb = lambda p: [(p[0] + dy, p[1] + dx) for dy in (-1, 0, 1) for dx in (-1, 0, 1) if (dy or dx) and (p[0] + dy, p[1] + dx) in pts]


def bfs(start):
    prev = {start: None}; q = [start]; last = start
    while q:
        nq = []
        for p in q:
            for n in nb(p):
                if n not in prev:
                    prev[n] = p; nq.append(n); last = n
        q = nq
    path = [last]
    while prev[path[-1]] is not None:
        path.append(prev[path[-1]])
    return path


if closed:
    # an oval loop: its skeleton points in order of angle round the middle
    P = np.stack([xs, ys], 1).astype(float)
    c = P.mean(0)
    P = P[np.argsort(np.arctan2(P[:, 1] - c[1], P[:, 0] - c[0]))]
    # thin to one point per degree so the spline isn't fed the band's spurs
    ang = np.degrees(np.arctan2(P[:, 1] - c[1], P[:, 0] - c[0]))
    # radius by angle, smoothed round the loop: the line runs down the middle of the links
    # instead of zig-zagging along them
    bins = np.arange(-180, 180, 1.5)
    rad = np.hypot(P[:, 0] - c[0], P[:, 1] - c[1])
    rb = np.array([np.median(rad[(ang >= d) & (ang < d + 1.5)]) if ((ang >= d) & (ang < d + 1.5)).any() else np.nan
                   for d in bins])
    ok = ~np.isnan(rb)
    rb = np.interp(np.arange(len(bins)), np.nonzero(ok)[0], rb[ok], period=len(bins))
    rb = ndimage.gaussian_filter1d(rb, 5, mode='wrap')
    th = np.radians(bins + 0.75)
    P = np.stack([c[0] + rb * np.cos(th), c[1] + rb * np.sin(th)], 1)
else:
    start = next(iter(pts))
    end1 = bfs(start)[0]
    path = bfs(end1)                           # the longest path through the skeleton
    P = np.array(path, float)[:, ::-1]         # (x, y)
# smooth
step = 1 if closed else 4
Q = P[::step]
tck, u = splprep([Q[:, 0], Q[:, 1]], s=len(Q) * 2.5, per=1 if closed else 0)
uu = np.linspace(0, 1, 600)
x, y = splev(uu, tck)
C = np.stack([x, y], 1)
seg = np.linalg.norm(np.diff(C, axis=0), axis=1)
L = seg.sum()
w = 2 * np.median([dist[int(round(py)), int(round(px))] for px, py in C if 0 <= int(round(py)) < dist.shape[0] and 0 <= int(round(px)) < dist.shape[1]])
# link pitch from the brightness along the line
lum = np.asarray(sm.convert('L')).astype(float)
s_acc = np.r_[0, np.cumsum(seg)]
ss = np.arange(0, L, 0.5)
xi = np.interp(ss, s_acc, C[:, 0]); yi = np.interp(ss, s_acc, C[:, 1])
prof = ndimage.map_coordinates(lum, [yi, xi], order=1)
prof = prof - ndimage.uniform_filter1d(prof, int(4 * w))
ac = np.correlate(prof, prof, 'full')[len(prof) - 1:]
ac /= ac[0]
lo, hi = int(0.3 * w / 0.5), int(3.0 * w / 0.5)
pk = lo + int(np.argmax(ac[lo:hi]))
pitch = pk * 0.5
res = dict(src=src, closed=closed, scale=S, size=[sm.width, sm.height], width_px=round(float(w), 2),
           length_px=round(float(L), 1), pitch_px=round(float(pitch), 2), ac_peak=round(float(ac[pk]), 3),
           path=[[round(float(px), 2), round(float(py), 2)] for px, py in C])
json.dump(res, open(out, 'w'))
ov = sm.convert('RGB'); d = ImageDraw.Draw(ov)
d.line([tuple(p) for p in C], fill=(255, 0, 80), width=2)
for s0 in np.arange(0, L, pitch):
    px, py = np.interp(s0, s_acc, C[:, 0]), np.interp(s0, s_acc, C[:, 1])
    d.ellipse([px - 2, py - 2, px + 2, py + 2], fill=(0, 255, 200))
ov.save(out.replace('.json', '.png'))
print(json.dumps({k: v for k, v in res.items() if k != 'path'}))
