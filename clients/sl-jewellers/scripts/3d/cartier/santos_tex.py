"""Dial texture and applied-numeral outlines for the Santos de Cartier WSSA0055 (build_santos.py).

Everything is measured off S&L's studio image of watch 36 (public/images/pieces/watches/
36-b1707791.cut.2026-10-07-3.webp, 17.14 px/mm, dial centre at pixel 412,712): a green sunray
dial 27.5 mm square, a square railroad minute track (outer edge 8.5 mm from the centre, 0.65 mm
wide, the five-minute marks as bold bars), CARTIER under 12, AUTOMATIC above 6, the date at 6
in a framed window with SWISS and MADE either side, and Eastern Arabic numerals as applied
silver set on a square 11.3 mm out. Units are millimetres, x to 3 o'clock, y to 12.
"""
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from shapely.geometry import Polygon
from shapely.ops import unary_union
from shapely import affinity

DIAL_H = 13.75          # half the dial's side
DIAL_R = 2.40           # its corner radius
TRACK_OUT, TRACK_IN = 8.50, 7.85
DATE = (0.0, -11.25, 2.55, 3.30)     # centre x, y, width, height of the date window
SANS = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
SANS_B = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
SERIF_B = '/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf'

AR = {1: '١', 2: '٢', 3: '٣', 4: '٤', 5: '٥', 6: '٦', 7: '٧',
      8: '٨', 9: '٩', 0: '٠'}
# applied numerals: (hour, centre x, centre y), as set on the dial (6 is the date)
NUMERALS = [(12, 0.25, 11.25), (1, 6.25, 11.25), (11, -6.3, 11.25), (2, 11.4, 6.1), (3, 11.4, 0.0),
            (4, 11.4, -6.1), (5, 5.7, -11.25), (7, -5.7, -11.25), (8, -11.4, -6.1), (9, -11.4, 0.0),
            (10, -11.4, 6.1)]
NUM_H = 3.55            # numeral height
NUM_SQUEEZE = 0.84      # Cartier's numerals are narrower than the font's


def ar(n):
    return ''.join(AR[int(c)] for c in str(n))


def _round_rect_mask(W, half_px, r_px, c):
    m = Image.new('L', (W, W), 0)
    ImageDraw.Draw(m).rounded_rectangle((c - half_px, c - half_px, c + half_px, c + half_px), r_px, fill=255)
    return m


def make_dial(path, W=4096):
    """Albedo for the dial plate; UV (0,0)-(1,1) spans -DIAL_H..DIAL_H."""
    s = W / (2 * DIAL_H)                # px per mm
    c = W / 2
    yy, xx = np.mgrid[0:W, 0:W].astype(np.float32)
    X = (xx - c) / s
    Y = (c - yy) / s
    R = np.sqrt(X * X + Y * Y)
    TH = np.arctan2(Y, X)
    # sunray: fine radial streaks plus the broad lighter sectors a brushed sunburst throws
    rng = np.random.default_rng(36)
    n = 1440
    streak = rng.normal(0, 1, n).astype(np.float32)
    streak = np.convolve(np.tile(streak, 3), np.ones(3) / 3, 'same')[n:2 * n]
    idx = ((TH + math.pi) / (2 * math.pi) * n).astype(np.int32) % n
    fine = streak[idx] * 0.05
    broad = 0.16 * np.cos(2 * (TH - 0.55)) + 0.08 * np.cos(4 * (TH + 0.3))
    vign = 1.0 - 0.32 * np.clip((np.maximum(np.abs(X), np.abs(Y)) - 6.0) / 7.75, 0, 1) ** 1.6
    centre = 0.92 + 0.10 * np.exp(-(R / 5.0) ** 2)
    k = np.clip((1.0 + broad + fine) * vign * centre, 0.45, 1.6)
    base = np.array([18, 60, 39], np.float32)      # sRGB; the coat adds the reflections on top
    img = np.clip(base[None, None, :] * k[..., None], 0, 255).astype(np.uint8)
    im = Image.fromarray(img, 'RGB')
    d = ImageDraw.Draw(im)
    W2 = lambda mm: max(1, int(round(mm * s)))       # noqa: E731
    P = lambda x, y: (c + x * s, c - y * s)           # noqa: E731
    silver = (226, 230, 228)
    # railroad minute track: two hairlines, a tick each minute, a bold bar every five
    for h, w in ((TRACK_OUT, 0.075), (TRACK_IN, 0.075)):
        d.rounded_rectangle((*P(-h, h), *P(h, -h)), radius=0.55 * s, outline=silver, width=W2(w))
    for m in range(60):
        a = math.radians(90 - m * 6)
        dx, dy = math.cos(a), math.sin(a)
        t_in = TRACK_IN / max(abs(dx), abs(dy))
        t_out = TRACK_OUT / max(abs(dx), abs(dy))
        if m % 5 == 0:
            # five-minute bar: a short block filling the track
            ux, uy = -dy, dx
            hw = 0.19
            q = [P(dx * t_in + ux * hw, dy * t_in + uy * hw), P(dx * t_out + ux * hw, dy * t_out + uy * hw),
                 P(dx * t_out - ux * hw, dy * t_out - uy * hw), P(dx * t_in - ux * hw, dy * t_in - uy * hw)]
            d.polygon(q, fill=silver)
        else:
            d.line((*P(dx * t_in, dy * t_in), *P(dx * t_out, dy * t_out)), fill=silver, width=W2(0.095))

    def text(t, font, cap_mm, x, y, spacing=0.0, fill=silver):
        f = ImageFont.truetype(font, int(cap_mm * s / 0.72))
        widths = [d.textlength(ch, font=f) for ch in t]
        total = sum(widths) + spacing * s * (len(t) - 1)
        cx0, cy0 = P(x, y)
        cur = cx0 - total / 2
        for ch, wch in zip(t, widths):
            d.text((cur, cy0), ch, font=f, fill=fill, anchor='lm')
            cur += wch + spacing * s

    text('CARTIER', SERIF_B, 0.92, 0.0, 5.30, spacing=0.12)
    text('AUTOMATIC', SANS, 0.55, 0.0, -5.60, spacing=0.12)
    text('SWISS', SANS, 0.30, -2.95, -13.05, spacing=0.06)
    text('MADE', SANS, 0.30, 3.00, -13.05, spacing=0.06)
    # the date: the disc seen through its window (the frame is geometry)
    dx_, dy_, dw, dh = DATE
    d.rectangle((*P(dx_ - dw / 2, dy_ + dh / 2), *P(dx_ + dw / 2, dy_ - dh / 2)), fill=(16, 40, 27))
    f = ImageFont.truetype(SANS_B, int(1.35 * s / 0.72))
    x0 = P(dx_, dy_)[0]
    # LTR, as on the dial: 1 then 8
    g1, g8 = AR[1], AR[8]
    w1, w8 = d.textlength(g1, font=f), d.textlength(g8, font=f)
    gap = 0.18 * s
    tot = w1 + w8 + gap
    yc = P(dx_, dy_)[1]
    d.text((x0 - tot / 2, yc), g1, font=f, fill=(238, 240, 238), anchor='lm')
    d.text((x0 - tot / 2 + w1 + gap, yc), g8, font=f, fill=(238, 240, 238), anchor='lm')
    # the dial's own edge darkens into the rehaut
    m = _round_rect_mask(W, DIAL_H * s - 2, DIAL_R * s, c)
    edge = m.filter(ImageFilter.GaussianBlur(0.35 * s))
    dark = Image.new('RGB', (W, W), (6, 18, 12))
    im = Image.composite(im, dark, edge)
    im.save(path, optimize=True)
    return path


def _glyph(ch, px=900):
    """Outline of one digit as a shapely geometry in pixel space, y down."""
    f = ImageFont.truetype(SANS, px)
    pad = px // 2
    im = Image.new('L', (int(f.getlength(ch) + 2 * pad), int(px * 1.9)), 0)
    ImageDraw.Draw(im).text((pad, px * 0.95), ch, font=f, fill=255, anchor='lm')
    a = np.array(im) > 127
    from skimage.measure import find_contours
    cs = find_contours(a.astype(np.float32), 0.5)
    polys = [Polygon(np.c_[cc[:, 1], cc[:, 0]]).buffer(0) for cc in cs if len(cc) > 8]
    polys = [p for p in polys if p.area > 20]
    # even-odd: a contour inside an odd number of others is a hole
    out = []
    for i, p in enumerate(polys):
        depth = sum(1 for j, q in enumerate(polys) if j != i and q.contains(p.representative_point()) and q.area > p.area)
        out.append((p, depth))
    solid = unary_union([p for p, dpt in out if dpt % 2 == 0])
    holes = [p for p, dpt in out if dpt % 2 == 1]
    return solid.difference(unary_union(holes)) if holes else solid


INK_GAP = 1.25          # between the digits of 10, 11 and 12, as set on the dial


def numeral_geom(hour, cx, cy):
    """Applied numeral outline in dial mm, centred on (cx, cy), NUM_H tall; the digits of a
    two-digit hour set left to right, INK_GAP apart."""
    gs = [_glyph(c) for c in ar(hour)]
    # one scale for every digit: the font's digit height
    ref = _glyph(AR[1]).bounds
    k = NUM_H / (ref[3] - ref[1])
    placed, x = [], 0.0
    for g in gs:
        minx, miny, maxx, maxy = g.bounds
        g = affinity.translate(g, -minx, -(ref[1] + ref[3]) / 2)
        g = affinity.scale(g, k * NUM_SQUEEZE, -k, origin=(0, 0))      # y up
        placed.append(affinity.translate(g, x, 0))
        x += (maxx - minx) * k * NUM_SQUEEZE + INK_GAP
    g = unary_union(placed)
    minx, miny, maxx, maxy = g.bounds
    g = affinity.translate(g, -(minx + maxx) / 2, 0)
    # Cartier's strokes are finer than the font's: thin them by 0.06 mm a side
    g = g.simplify(0.012).buffer(-0.06, join_style=1).buffer(0.0)
    return affinity.translate(g, cx, cy)
