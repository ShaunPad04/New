"""Texture generators for the GMT-Master II 126710GRNR build (Pillow + numpy).

All layout numbers are millimetres in the watch's local frame
(x = 3 o'clock, y = 12 o'clock, origin = dial centre), measured from the
Rolex catalogue image m126710grnr-0004 at 28.85 px/mm (bezel plane) -- see
build.py for the measurement notes.
"""
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy.ndimage import gaussian_filter
from shapely.geometry import Polygon, Point, LineString, box
from shapely.ops import unary_union
from shapely import affinity
from variant import V as VAR

FONT = {
    'serif':   '/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf',
    'serif2':  '/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf',
    'sans':    '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf',
    'sansb':   '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf',
    'inter':   '/usr/share/fonts/opentype/inter/Inter-Medium.otf',
    'intersb': '/usr/share/fonts/opentype/inter/Inter-SemiBold.otf',
    'interr':  '/usr/share/fonts/opentype/inter/Inter-Regular.otf',
    'dejavu':  '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
    'dejavub': '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
}


# --------------------------------------------------------------------------
# Rolex coronet as vector geometry (shapely), height 1.0, base at y=0,
# centred on x=0.  Proportions read off the dial coronet in the catalogue
# image (2.08 mm tall, 1.60 mm across the outer balls).
# --------------------------------------------------------------------------
def coronet_geom(h=1.0):
    s = h / 2.08  # model was laid out in mm for a 2.08 mm coronet
    parts = []
    # oval "eye" ring at the base
    ring_o = affinity.scale(Point(0, 0).buffer(1.0, 64), 0.36, 0.165)
    ring_i = affinity.scale(Point(0, 0).buffer(1.0, 64), 0.25, 0.085)
    parts.append(affinity.translate(ring_o.difference(ring_i), 0, 0.17))
    # cup (crown body) sitting on the ring
    cup = Polygon([(-0.30, 0.30), (0.30, 0.30), (0.52, 0.74), (0.30, 0.70),
                   (0.0, 0.72), (-0.30, 0.70), (-0.52, 0.74)])
    parts.append(cup)
    # five tapered prongs with balls
    tips = [(-0.74, 1.73), (-0.39, 1.89), (0.0, 1.96), (0.39, 1.89), (0.74, 1.73)]
    bases = [(-0.44, 0.70), (-0.22, 0.70), (0.0, 0.70), (0.22, 0.70), (0.44, 0.70)]
    for (bx, by), (tx, ty) in zip(bases, tips):
        dx, dy = tx - bx, ty - by
        L = math.hypot(dx, dy)
        nx, ny = -dy / L, dx / L
        wb, wt = 0.065, 0.028
        parts.append(Polygon([(bx + nx * wb, by + ny * wb), (tx + nx * wt, ty + ny * wt),
                              (tx - nx * wt, ty - ny * wt), (bx - nx * wb, by - ny * wb)]))
        parts.append(Point(tx, ty).buffer(0.085, 24))
    g = unary_union(parts)
    g = affinity.translate(g, 0, -0.17 + 0.165)  # base of ring at y=0
    return affinity.scale(g, s, s, origin=(0, 0))


def coronet_triplock(h=1.0):
    """Crown-end marking: coronet with the three Triplock dots under it."""
    g = coronet_geom(h * 0.78)
    g = affinity.translate(g, 0, h * 0.22)
    dots = [Point(x * h * 0.17, h * 0.07).buffer(h * 0.055, 24) for x in (-1, 0, 1)]
    return unary_union([g] + dots)


# --------------------------------------------------------------------------
# helpers
# --------------------------------------------------------------------------
class Canvas:
    """Square texture covering [-R, R]^2 mm, y up."""

    def __init__(self, size, R, mode='RGB', bg=(0, 0, 0)):
        self.size = size
        self.R = R
        self.ppm = size / (2 * R)
        self.img = Image.new(mode, (size, size), bg)

    def px(self, x, y):
        return (self.size * (0.5 + x / (2 * self.R)), self.size * (0.5 - y / (2 * self.R)))

    def mm(self, v):
        return v * self.ppm

    def fill_geom(self, geom, color, ss=4):
        """Rasterise shapely geometry with supersampled antialiasing."""
        if geom.is_empty:
            return
        minx, miny, maxx, maxy = geom.bounds
        x0, y1 = self.px(minx, miny)
        x1, y0 = self.px(maxx, maxy)
        x0, y0 = int(math.floor(x0)) - 2, int(math.floor(y0)) - 2
        x1, y1 = int(math.ceil(x1)) + 2, int(math.ceil(y1)) + 2
        w, h = x1 - x0, y1 - y0
        mask = Image.new('L', (w * ss, h * ss), 0)
        d = ImageDraw.Draw(mask)
        polys = [geom] if geom.geom_type == 'Polygon' else list(geom.geoms)
        for p in polys:
            if p.geom_type != 'Polygon':
                continue
            ext = [((self.px(x, y)[0] - x0) * ss, (self.px(x, y)[1] - y0) * ss) for x, y in p.exterior.coords]
            d.polygon(ext, fill=255)
            for ring in p.interiors:
                pts = [((self.px(x, y)[0] - x0) * ss, (self.px(x, y)[1] - y0) * ss) for x, y in ring.coords]
                d.polygon(pts, fill=0)
        mask = mask.resize((w, h), Image.LANCZOS)
        self.paste_mask(mask, (x0, y0), color)

    def paste_mask(self, mask, xy, color):
        layer = Image.new(self.img.mode, mask.size, color)
        self.img.paste(layer, xy, mask)


def text_mask(text, font_path, cap_px, stretch=1.0, tracking=0.0):
    """Render text to an L mask whose cap height is cap_px pixels.
    stretch scales horizontally, tracking adds space between glyphs (in cap heights)."""
    big = 400
    f = ImageFont.truetype(font_path, big)
    # cap height of the font at this size
    bb = f.getbbox('H')
    cap = bb[3] - bb[1]
    top = bb[1]
    # draw glyph by glyph to apply tracking
    widths = [f.getlength(ch) for ch in text]
    total = sum(widths) + tracking * cap * (len(text) - 1)
    W = int(total + big)
    H = int(big * 1.6)
    m = Image.new('L', (W, H), 0)
    d = ImageDraw.Draw(m)
    x = big * 0.5
    for ch, w in zip(text, widths):
        d.text((x, big * 0.3 - top), ch, font=f, fill=255)
        x += w + tracking * cap
    bbox = m.getbbox()
    if bbox is None:
        return Image.new('L', (1, 1), 0)
    # crop vertically to the cap band (keep descender-free caps aligned)
    y0 = int(big * 0.3)
    y1 = int(big * 0.3 + cap)
    m = m.crop((bbox[0], min(y0, bbox[1]), bbox[2], max(y1, bbox[3])))
    scale = cap_px / cap
    nw = max(1, int(round(m.size[0] * scale * stretch)))
    nh = max(1, int(round(m.size[1] * scale)))
    return m.resize((nw, nh), Image.LANCZOS)


def paste_text(canvas, text, font, cap_mm, cx, cy, color, width_mm=None, stretch=1.0,
               tracking=0.0, angle_deg=0.0):
    """Paste text centred at (cx,cy) mm. If width_mm is given, stretch to it."""
    cap_px = canvas.mm(cap_mm)
    m = text_mask(text, font, cap_px, stretch, tracking)
    if width_mm is not None:
        m = m.resize((max(1, int(round(canvas.mm(width_mm)))), m.size[1]), Image.LANCZOS)
    if angle_deg:
        m = m.rotate(angle_deg, resample=Image.BICUBIC, expand=True)
    px, py = canvas.px(cx, cy)
    canvas.paste_mask(m, (int(round(px - m.size[0] / 2)), int(round(py - m.size[1] / 2))), color)


def glyph_on_arc(canvas, text, font, cap_mm, r_mm, theta_c_deg, color, stretch=1.0,
                 tracking=0.08, outward=True, clockwise=True, gap_deg=None):
    """Lay glyphs along a circle. theta measured clockwise from 12 o'clock.
    outward=True: glyph tops point away from the centre (reading clockwise).
    outward=False: tops point to the centre (reading counter-clockwise / 'smile')."""
    f = ImageFont.truetype(font, 400)
    bb = f.getbbox('H')
    cap400 = bb[3] - bb[1]
    k = cap_mm / cap400  # mm per font unit at this size
    adv = [f.getlength(ch) * k * stretch for ch in text]
    trk = tracking * cap_mm
    total = sum(adv) + trk * (len(text) - 1)
    ang_total = math.degrees(total / r_mm)
    # running position
    s = -total / 2
    for ch, a in zip(text, adv):
        mid = s + a / 2
        s += a + trk
        if ch == ' ':
            continue
        dth = math.degrees(mid / r_mm)
        th = theta_c_deg + (dth if outward else -dth)
        m = text_mask(ch, font, canvas.mm(cap_mm), stretch)
        rot = -th if outward else 180 - th
        m = m.rotate(rot, resample=Image.BICUBIC, expand=True)
        t = math.radians(th)
        x, y = r_mm * math.sin(t), r_mm * math.cos(t)
        px, py = canvas.px(x, y)
        canvas.paste_mask(m, (int(round(px - m.size[0] / 2)), int(round(py - m.size[1] / 2))), color)
    return ang_total


def place_geom(g, cx, cy, angle_deg=0.0):
    g = affinity.rotate(g, angle_deg, origin=(0, 0))
    return affinity.translate(g, cx, cy)


# --------------------------------------------------------------------------
# DIAL  (+ rehaut ring, same planar mapping)
# --------------------------------------------------------------------------
# +-14.4 mm (dial r 13.45 + rehaut to 14.3); a Datejust's dial is wider, the 36 mm's widest
DIAL_TEX_R = max(15.0, VAR['rings']['dial'] + 0.2) if VAR['rings'] else 14.4
REHAUT_TEX_R = 15.8    # a Datejust's rehaut has its own texture, out to its top edge
WHITE = (236, 236, 232)
GREEN = tuple(VAR['gmt_text'])   # the GMT-MASTER II line (green on grnr)


def make_dial_texture(path, size=4096, rehaut_slope=(13.45, 14.25), rehaut_path=None):
    if VAR['dial_style'] == 'pave':
        return make_pave_dial(path, rehaut_path, size)
    if VAR['dial_style'] in ('datejust', 'datejust41', 'datejust36', 'dj_gem'):
        return make_datejust_dial(path, rehaut_path, size)
    c = Canvas(size, DIAL_TEX_R, 'RGB', tuple(VAR['dial']))
    if VAR['sunburst']:
        sunburst(c)
    # --- minute track: 60 ticks r 12.55-13.20, 5-minute ticks heavier ---
    for i in range(60):
        th = i * 6.0
        if i == 30:
            continue  # coronet of SWISS MADE sits here
        r0, r1, w = 12.55, 13.20, 0.085
        if i % 5 == 0:
            w = 0.13
        if i in (28, 29, 31, 32):
            r1 = 12.74  # shortened above SWISS / MADE
        t = math.radians(th)
        ux, uy = math.sin(t), math.cos(t)
        g = LineString([(r0 * ux, r0 * uy), (r1 * ux, r1 * uy)]).buffer(w / 2, cap_style=2)
        c.fill_geom(g, WHITE)
    # --- coronet logo (2.08 mm, base at y=5.10) ---
    c.fill_geom(place_geom(coronet_geom(2.08), 0, 5.10), WHITE)
    # --- ROLEX: wide serif, cap 0.94 mm, 6.8 mm wide, centred y=4.23 ---
    paste_text(c, 'ROLEX', FONT['serif'], 0.94, 0, 4.23, WHITE, width_mm=6.8, tracking=0.16)
    # --- OYSTER PERPETUAL DATE: cap 0.59, width 12.0, y=3.14 ---
    paste_text(c, 'OYSTER PERPETUAL DATE', FONT['inter'], 0.57, 0, 3.14, WHITE, width_mm=11.9, tracking=0.10)
    if VAR['model'] == 'ym':
        # Yacht-Master 40: YACHT-MASTER in blue where the GMT's line sits, then the certificate
        paste_text(c, 'YACHT-MASTER', FONT['inter'], 0.66, 0, -4.26, GREEN, width_mm=7.6, tracking=0.12)
        paste_text(c, 'SUPERLATIVE CHRONOMETER', FONT['inter'], 0.55, 0, -5.30, WHITE, width_mm=8.6, tracking=0.05)
        paste_text(c, 'OFFICIALLY CERTIFIED', FONT['inter'], 0.55, 0, -6.10, WHITE, width_mm=6.5, tracking=0.05)
    elif VAR['model'] == 'sub':
        # Submariner Date 41 (measured off m126610lv-0002 in the GMT frame): SUBMARINER cap 0.73,
        # 7.49 wide at y -3.97; 1000ft = 300m 6.90 wide at -5.04; SUPERLATIVE CHRONOMETER 9.39
        # wide at -6.02; OFFICIALLY CERTIFIED at -6.85
        paste_text(c, 'SUBMARINER', FONT['inter'], 0.70, 0, -3.97, WHITE, width_mm=7.4, tracking=0.10)
        paste_text(c, '1000ft = 300m', FONT['interr'], 0.56, 0, -5.04, WHITE, width_mm=6.8, tracking=0.04)
        paste_text(c, 'SUPERLATIVE CHRONOMETER', FONT['inter'], 0.55, 0, -6.02, WHITE, width_mm=9.2, tracking=0.05)
        paste_text(c, 'OFFICIALLY CERTIFIED', FONT['inter'], 0.55, 0, -6.85, WHITE, width_mm=7.0, tracking=0.05)
    else:
        # --- GMT-MASTER II in green: cap 0.64, width 6.93, y=-4.26 ---
        paste_text(c, 'GMT-MASTER II', FONT['inter'], 0.64, 0, -4.26, GREEN, width_mm=6.9, tracking=0.12)
        # --- SUPERLATIVE CHRONOMETER / OFFICIALLY CERTIFIED (condensed) ---
        paste_text(c, 'SUPERLATIVE CHRONOMETER', FONT['inter'], 0.55, 0, -5.30, WHITE, width_mm=8.6, tracking=0.05)
        paste_text(c, 'OFFICIALLY CERTIFIED', FONT['inter'], 0.55, 0, -6.10, WHITE, width_mm=6.5, tracking=0.05)
    # --- SWISS (coronet) MADE along the bottom edge, tops toward centre ---
    glyph_on_arc(c, 'SWISS', FONT['inter'], 0.42, 12.98, 180 + 7.3, WHITE, stretch=1.15, tracking=0.12, outward=False)
    glyph_on_arc(c, 'MADE', FONT['inter'], 0.42, 12.98, 180 - 7.3, WHITE, stretch=1.15, tracking=0.12, outward=False)
    c.fill_geom(place_geom(coronet_geom(0.66), 0, -13.30, 0), WHITE)
    draw_rehaut(c, rehaut_slope)
    img = c.img
    img.save(path)
    return path


def draw_rehaut(c, rehaut_slope=(13.45, 14.25)):
    """The rehaut's ROLEX engraving and serial, in the rehaut's own (unscaled) frame."""
    # --- rehaut (conical inner bezel ring) engraving, drawn as seen from the
    # front: letter height 0.62 mm on the slope -> 0.62*cos(45.7deg)=0.43 radially.
    r_mid = (rehaut_slope[0] + rehaut_slope[1]) / 2
    REHAUT = tuple(VAR['rehaut'])
    # 0.62 mm letters on a 45.7 deg cone, seen from the front: radial size x0.70
    RH_CAP = 0.62 * 0.70
    RH_STRETCH = 1.25 / 0.70
    RH_TRACK = 0.30 / 0.70
    # coronet at 12
    rc = coronet_geom(0.66)
    rc = affinity.scale(rc, 1.0, 0.70, origin=(0, 0))
    c.fill_geom(place_geom(rc, 0, r_mid - 0.23), REHAUT)
    # ROLEX words: clockwise from just after 12 to just before 6, and
    # from just after 6 to just before 12; serial-style marks at 6.
    def rehaut_text(txt, th):
        return glyph_on_arc(c, txt, FONT['serif'], RH_CAP, r_mid, th, REHAUT, stretch=RH_STRETCH,
                            tracking=RH_TRACK, outward=True)
    # measure one word
    # angular width of a word ~ computed by glyph_on_arc's return; do it analytically
    f = ImageFont.truetype(FONT['serif'], 400)
    bb = f.getbbox('H'); cap400 = bb[3] - bb[1]
    k = RH_CAP / cap400
    wlen = sum(f.getlength(ch) * k * RH_STRETCH for ch in 'ROLEX') + RH_TRACK * RH_CAP * 4
    wdeg = math.degrees(wlen / r_mid)
    gap = 2.2  # degrees between words
    # right half 6deg..156deg, left half 204deg..354deg
    for start, end in ((5.0, 160.0), (200.0, 355.0)):
        n = int((end - start + gap) // (wdeg + gap))
        span = n * wdeg + (n - 1) * gap
        s0 = start + ((end - start) - span) / 2
        for i in range(n):
            rehaut_text('ROLEX', s0 + wdeg / 2 + i * (wdeg + gap))
    # serial-style engraving at 6 o'clock (reads with tops toward the centre)
    glyph_on_arc(c, '7F2K9J41', FONT['dejavu'], 0.36, r_mid, 180, REHAUT, stretch=1.0, tracking=0.25, outward=False)


def sunburst(c, lift=0.55):
    """Sunburst: brighter at the centre, falling off to the edge (measured off the catalogue
    image: about +55% at r 3 mm against the edge; a pale Datejust dial takes far less)."""
    n = c.img.size[0]
    yy, xx = np.mgrid[0:n, 0:n]
    r = np.hypot(xx - n / 2, yy - n / 2) / (n / 2) * c.R
    g = 1.0 + lift * np.exp(-(r / 5.5) ** 2) - 0.06 * np.clip((r - 9) / 4, 0, 1)
    if lift < 0.3:
        # fine radial brushing: noise in angle only, so it streaks out from the centre
        th = np.arctan2(yy - n / 2, xx - n / 2)
        rng = np.random.default_rng(11)
        k = rng.normal(0, 1, 4096)
        idx = ((th + np.pi) / (2 * np.pi) * 4096).astype(int) % 4096
        g = g * (1 + 0.035 * gaussian_filter(k, 1.2)[idx])
    base = np.asarray(VAR['dial'], np.float32)
    c.img = Image.fromarray(np.clip(base[None, None, :] * g[..., None], 0, 255).astype(np.uint8))


def make_datejust_dial(path, rehaut_path, size=4096):
    """A Datejust dial in the finished watch's frame (no inner scale).
    'datejust' (Datejust II 116334, dj22.jpg): railway minute track at r 13.95-14.30, ROLEX /
        OYSTER PERPETUAL / DATEJUST above the centre, the certificate below, SWISS and MADE either
        side of the VI.
    'datejust41' (126333, Rolex m126333-0020): minute ticks at r 13.40-13.95, the 5-minute numbers
        outside them at r 14.25 with their tops to the rim, SWISS (coronet) MADE in place of the 30.
    The rehaut goes to its own texture, drawn at its own radii."""
    rg = VAR['rings']
    c = Canvas(size, DIAL_TEX_R, 'RGB', tuple(VAR['dial']))
    if VAR['sunburst']:
        sunburst(c, 0.14)
    ink = tuple(VAR['text_color'] or WHITE)
    if VAR['dial_style'] == 'dj_gem':
        # watch 47 (S&L's photo): a minute ring r 14.30-15.70 with a tick every minute and a small
        # printed Roman numeral at each hour, tops to the rim; SWISS (coronet) MADE inside it at 6
        for r in (14.30, 15.70):
            c.fill_geom(Point(0, 0).buffer(r + 0.03, 720).difference(Point(0, 0).buffer(r - 0.03, 720)), ink)
        for i in range(60):
            if i % 5 == 0:
                continue
            t = math.radians(i * 6.0)
            ux, uy = math.sin(t), math.cos(t)
            c.fill_geom(LineString([(15.30 * ux, 15.30 * uy), (15.70 * ux, 15.70 * uy)]).buffer(0.035, cap_style=2), ink)
        nums = ['XII', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI']
        for h, txt in enumerate(nums):
            glyph_on_arc(c, txt, FONT['serif2'], 0.62, 14.98, h * 30.0, ink, stretch=1.0, tracking=0.02, outward=True)
        paste_text(c, 'ROLEX', FONT['serif'], 0.82, 0, 6.88, ink, width_mm=5.7, tracking=0.16)
        paste_text(c, 'OYSTER PERPETUAL', FONT['intersb'], 0.62, 0, 5.69, ink, width_mm=9.9, tracking=0.06)
        paste_text(c, 'DATEJUST', FONT['intersb'], 0.66, 0, 4.65, ink, width_mm=6.36, tracking=0.12)
        paste_text(c, 'SUPERLATIVE CHRONOMETER', FONT['inter'], 0.48, 0, -5.88, ink, width_mm=8.93, tracking=0.04)
        paste_text(c, 'OFFICIALLY CERTIFIED', FONT['inter'], 0.48, 0, -6.81, ink, width_mm=6.74, tracking=0.04)
        glyph_on_arc(c, 'SWISS', FONT['inter'], 0.34, 13.45, 180 + 11.0, ink, stretch=1.1, tracking=0.12, outward=False)
        glyph_on_arc(c, 'MADE', FONT['inter'], 0.34, 13.45, 180 - 11.0, ink, stretch=1.1, tracking=0.12, outward=False)
        c.fill_geom(place_geom(coronet_geom(0.50), 0, -14.15, 0), ink)
    elif VAR['dial_style'] == 'datejust36':
        # 16233 (Bob's Watches photo): railway track r 15.10-15.80, lume dots on it at the hours,
        # T SWISS / MADE T inside it either side of the VI
        for r in (15.10, 15.80):
            c.fill_geom(Point(0, 0).buffer(r + 0.03, 720).difference(Point(0, 0).buffer(r - 0.03, 720)), ink)
        for i in range(60):
            t = math.radians(i * 6.0)
            ux, uy = math.sin(t), math.cos(t)
            c.fill_geom(LineString([(15.10 * ux, 15.10 * uy), (15.80 * ux, 15.80 * uy)]).buffer(0.035, cap_style=2), ink)
        for i in range(12):
            t = math.radians(i * 30.0)
            p = (15.45 * math.sin(t), 15.45 * math.cos(t))
            c.fill_geom(Point(*p).buffer(0.25, 32), ink)
            c.fill_geom(Point(*p).buffer(0.20, 32), (236, 234, 222))
        paste_text(c, 'ROLEX', FONT['serif'], 0.90, 0, 7.50, ink, width_mm=6.27, tracking=0.16)
        paste_text(c, 'OYSTER PERPETUAL', FONT['inter'], 0.62, 0, 6.22, ink, width_mm=10.3, tracking=0.08)
        paste_text(c, 'DATEJUST', FONT['inter'], 0.75, 0, 5.04, ink, width_mm=8.2, tracking=0.14)
        paste_text(c, 'SUPERLATIVE CHRONOMETER', FONT['inter'], 0.50, 0, -7.28, ink, width_mm=10.0, tracking=0.05)
        paste_text(c, 'OFFICIALLY CERTIFIED', FONT['inter'], 0.50, 0, -8.24, ink, width_mm=7.7, tracking=0.05)
        glyph_on_arc(c, 'T SWISS', FONT['inter'], 0.36, 14.75, 180 + 13.0, ink, stretch=1.1, tracking=0.12, outward=False)
        glyph_on_arc(c, 'MADE T', FONT['inter'], 0.36, 14.75, 180 - 13.0, ink, stretch=1.1, tracking=0.12, outward=False)
    elif VAR['dial_style'] == 'datejust41':
        for i in range(60):
            t = math.radians(i * 6.0)
            ux, uy = math.sin(t), math.cos(t)
            w = 0.10 if i % 5 == 0 else 0.07
            c.fill_geom(LineString([(13.40 * ux, 13.40 * uy), (13.95 * ux, 13.95 * uy)]).buffer(w / 2, cap_style=2), ink)
        for m in range(5, 61, 5):
            if m == 30:
                continue
            glyph_on_arc(c, str(m), FONT['inter'], 0.46, 14.25, (m % 60) * 6.0, ink, stretch=1.0, tracking=0.06,
                         outward=True)
        glyph_on_arc(c, 'SWISS', FONT['inter'], 0.34, 14.25, 180 + 4.3, ink, stretch=1.1, tracking=0.12, outward=False)
        glyph_on_arc(c, 'MADE', FONT['inter'], 0.34, 14.25, 180 - 4.3, ink, stretch=1.1, tracking=0.12, outward=False)
        c.fill_geom(place_geom(coronet_geom(0.52), 0, -14.52, 0), ink)
        paste_text(c, 'ROLEX', FONT['serif'], 0.85, 0, 6.45, ink, width_mm=5.55, tracking=0.16)
        paste_text(c, 'OYSTER PERPETUAL', FONT['intersb'], 0.60, 0, 5.40, ink, width_mm=10.1, tracking=0.06)
        paste_text(c, 'DATEJUST', FONT['intersb'], 0.62, 0, 4.44, ink, width_mm=6.66, tracking=0.12)
        paste_text(c, 'SUPERLATIVE CHRONOMETER', FONT['inter'], 0.50, 0, -5.97, ink, width_mm=8.65, tracking=0.04)
        paste_text(c, 'OFFICIALLY CERTIFIED', FONT['inter'], 0.50, 0, -6.72, ink, width_mm=6.72, tracking=0.04)
    else:
        for r in (13.95, 14.30):
            c.fill_geom(Point(0, 0).buffer(r + 0.03, 720).difference(Point(0, 0).buffer(r - 0.03, 720)), ink)
        for i in range(60):
            t = math.radians(i * 6.0)
            ux, uy = math.sin(t), math.cos(t)
            w = 0.11 if i % 5 == 0 else 0.07
            c.fill_geom(LineString([(13.95 * ux, 13.95 * uy), (14.30 * ux, 14.30 * uy)]).buffer(w / 2, cap_style=2), ink)
        paste_text(c, 'ROLEX', FONT['serif'], 0.78, 0, 6.44, ink, width_mm=5.1, tracking=0.16)
        paste_text(c, 'OYSTER PERPETUAL', FONT['inter'], 0.58, 0, 5.44, ink, width_mm=8.45, tracking=0.10)
        paste_text(c, 'DATEJUST', FONT['inter'], 0.66, 0, 4.50, ink, width_mm=5.72, tracking=0.14)
        paste_text(c, 'SUPERLATIVE CHRONOMETER', FONT['inter'], 0.46, 0, -5.62, ink, width_mm=8.96, tracking=0.05)
        paste_text(c, 'OFFICIALLY CERTIFIED', FONT['inter'], 0.46, 0, -6.37, ink, width_mm=6.78, tracking=0.05)
        glyph_on_arc(c, 'SWISS', FONT['inter'], 0.36, 13.20, 180 + 12.6, ink, stretch=1.15, tracking=0.12, outward=False)
        glyph_on_arc(c, 'MADE', FONT['inter'], 0.36, 13.20, 180 - 12.6, ink, stretch=1.15, tracking=0.12, outward=False)
    c.img.save(path)
    ground = tuple(VAR.get('rehaut_ground') or tuple(int(v * 0.80) for v in VAR['dial']))
    rc = Canvas(size, REHAUT_TEX_R, 'RGB', ground)
    if not (rg.get('rh_mat') or rg.get('rh_plain')):          # a plain ring needs no engraving
        draw_rehaut(rc, (rg['dial'], rg['rh']))
    rc.img.save(rehaut_path)
    return path


def make_pave_dial(path, rehaut_path, size=4096):
    """A pavé dial: round brilliants 0.54 mm across on a 0.62 mm hex grid out to the dial edge,
    each drawn as eight facets (bright and dark alternately, its brightness and turn random) round
    a table, in white gold. Writes the albedo to `path` and `_orm` / `_normal` maps beside it; the
    normal map tilts each facet 30 degrees so the stones glint as the watch turns."""
    rg = VAR['rings']
    R = DIAL_TEX_R
    ppm = size / (2 * R)
    a = 0.62
    rs = 0.27
    rng = np.random.default_rng(5)
    LUT = rng.random((4, 512, 512)).astype(np.float32)      # per-stone brightness, turn, sparkle
    alb = np.zeros((size, size, 3), np.uint8)
    orm = np.zeros((size, size, 3), np.uint8)
    nrm = np.zeros((size, size, 3), np.uint8)
    tilt = math.radians(30)
    for r0 in range(0, size, 256):
        rows = np.arange(r0, min(size, r0 + 256))
        Y = (R - (rows + 0.5) / ppm)[:, None] * np.ones((1, size), np.float32)
        X = ((np.arange(size) + 0.5) / ppm - R)[None, :] * np.ones((len(rows), 1), np.float32)
        v = Y / (a * math.sqrt(3) / 2)
        u = X / a - v / 2
        best = None
        for du in (0, 1):
            for dv in (0, 1):
                iu = np.floor(u) + du
                iv = np.floor(v) + dv
                cx = (iu + iv / 2) * a
                cy = iv * a * math.sqrt(3) / 2
                d = np.hypot(X - cx, Y - cy)
                if best is None:
                    best = [d, iu, iv, cx, cy]
                else:
                    m = d < best[0]
                    for k, val in enumerate((d, iu, iv, cx, cy)):
                        best[k] = np.where(m, val, best[k])
        d, iu, iv, cx, cy = best
        hi = (iu.astype(np.int64) % 512, iv.astype(np.int64) % 512)
        bright = 0.72 + 0.28 * LUT[0][hi]
        turn = LUT[1][hi] * 2 * math.pi
        spark = LUT[2][hi]
        phi = np.arctan2(Y - cy, X - cx)
        w = np.floor(((phi - turn) % (2 * math.pi)) / (2 * math.pi) * 8).astype(np.int64)
        phim = turn + (w + 0.5) * (2 * math.pi / 8)
        rr = d / rs
        stone = (rr < 1.0) & (np.hypot(cx, cy) < rg['dial'] - 0.25)
        table = rr < 0.42
        val = np.where(w % 2 == 0, bright, bright * 0.38)
        val = np.where(table, 0.55 + 0.35 * LUT[3][hi], val)
        val = np.where(spark > 0.90, np.minimum(1.0, val * 1.5), val)    # a few stones catch the light
        val = np.where(rr > 0.88, val * 0.5, val)
        g = np.where(stone, val * 255, 150).astype(np.uint8)
        alb[rows] = np.stack([g, g, np.clip(g.astype(np.int32) + 3, 0, 255).astype(np.uint8)], -1)
        orm[rows, :, 0] = 255
        orm[rows, :, 1] = np.where(stone, 15, 64)
        orm[rows, :, 2] = np.where(stone, 0, 255)
        tl = np.where(stone & ~table, math.sin(tilt), 0.0)
        nx, ny = tl * np.cos(phim), tl * np.sin(phim)
        nz = np.sqrt(np.clip(1 - nx * nx - ny * ny, 0, 1))
        nrm[rows] = (np.stack([nx, ny, nz], -1) * 127.5 + 127.5).astype(np.uint8)
    Image.fromarray(alb).save(path)
    Image.fromarray(orm).save(path.replace('.png', '_orm.png'))
    Image.fromarray(nrm).save(path.replace('.png', '_normal.png'))
    ground = tuple(VAR.get('rehaut_ground') or (190, 190, 190))
    rc = Canvas(size, REHAUT_TEX_R, 'RGB', ground)
    draw_rehaut(rc, (rg['dial'], rg['rh']))
    rc.img.save(rehaut_path)
    return path


DAY_TEX_R = 13.5


def make_day_texture(path, size=2048):
    """The day disc as it shows through the window at 12: white, the day in bold capitals along
    the arc (cap 1.15 mm, centred on r 11.55)."""
    c = Canvas(size, DAY_TEX_R, 'RGB', (240, 240, 236))
    glyph_on_arc(c, VAR['day'], FONT['dejavub'], 1.12, 11.55, 0.0, (14, 14, 14), stretch=1.18, tracking=0.10,
                 outward=True)
    c.img.save(path)
    return path


PLAQUE_TEX_R = 15.2


def make_plaque_texture(path, size=2048):
    """The two white gold plaques on a pavé dial: ROLEX above the centre, DAY-DATE below, black
    lettering inside a fine dark border."""
    c = Canvas(size, PLAQUE_TEX_R, 'RGB', (214, 214, 216))
    for y, h in ((5.32, 1.40), (-5.57, 1.33)):
        c.fill_geom(box(-3.15 + 0.12, y - h / 2 + 0.12, 3.15 - 0.12, y + h / 2 - 0.12).exterior.buffer(0.03), (90, 90, 92))
    paste_text(c, 'ROLEX', FONT['serif'], 0.78, 0, 5.32, (12, 12, 12), width_mm=4.6, tracking=0.16)
    paste_text(c, 'DAY-DATE', FONT['intersb'], 0.62, 0, -5.57, (12, 12, 12), width_mm=4.9, tracking=0.08)
    c.img.save(path)
    return path


def roman_geom(text, h=2.65, wscale=None):
    """Applied Roman numerals as Rolex sets them: thick and thin strokes, flat bracketed serifs,
    and the serifs of neighbouring I's joined into one bar top and bottom. Measured off the VI on
    dj22.jpg: cap 2.65, the I 1.36 across its serifs on a 0.60 stem, the V 2.30 across, 0.26
    between letters, I's on a 0.92 pitch. Centred on (0, 0), tops toward +y."""
    from shapely.geometry import box
    k = h / 2.65 if wscale is None else wscale     # across: the 116334's proportions, or narrower
    sh = 0.20 * h / 2.65       # serif bar height

    def letter(ch):
        if ch == 'I':
            return unary_union([box(-0.30, 0, 0.30, h), box(-0.68, h - sh, 0.68, h), box(-0.68, 0, 0.68, sh)])
        if ch == 'V':
            thick = Polygon([(-0.97, h - sh), (-0.37, h - sh), (0.28, 0), (-0.10, 0)])
            thin = Polygon([(0.66, h - sh), (0.88, h - sh), (0.28, 0), (0.12, 0)])
            return unary_union([thick, thin, box(-1.15, h - sh, -0.19, h), box(0.48, h - sh, 1.10, h),
                                box(-0.10, 0, 0.28, 0.05)])
        if ch == 'X':
            thick = Polygon([(-0.95, h), (-0.37, h), (0.95, 0), (0.37, 0)])
            thin = Polygon([(0.58, h), (0.80, h), (-0.58, 0), (-0.80, 0)])
            return unary_union([thick, thin, box(-1.15, h - sh, -0.17, h), box(0.42, h - sh, 0.98, h),
                                box(-0.98, 0, -0.42, sh), box(0.17, 0, 1.15, sh)])
        raise ValueError(ch)
    parts, x, prev = [], 0.0, None
    for ch in text:
        g = letter(ch)
        g = affinity.scale(g, k, 1.0, origin=(0, 0)) if k != 1 else g
        minx, _, maxx, _ = g.bounds
        if prev is None:
            dx = -minx
        elif prev == 'I' and ch == 'I':
            dx = prev_c + 0.92 * k      # stems on a fixed pitch, serifs overlapping into one bar
        else:
            dx = x + 0.26 * k - minx
        g = affinity.translate(g, dx, 0)
        parts.append(g)
        prev, prev_c = ch, dx
        x = g.bounds[2]
    g = unary_union(parts)
    # bracket the serifs: round every inside corner a little
    g = g.buffer(0.07, join_style=1, quad_segs=6).buffer(-0.07, join_style=1, quad_segs=6)
    minx, miny, maxx, maxy = g.bounds
    return affinity.translate(g, -(minx + maxx) / 2, -(miny + maxy) / 2)


# --------------------------------------------------------------------------
# BEZEL INSERT  (albedo, metal/rough ORM, normal)
# --------------------------------------------------------------------------
INSERT_TEX_R = 19.1
INS_R0, INS_R1 = 15.50, 19.00   # insert visible radii (mm)


def insert_numeral_geoms():
    """Return shapely geometry of all platinum engravings (numerals, dots, triangle)."""
    items = []
    # numerals 2..22 every 30 deg; all read clockwise with tops outward
    r_c = 17.20      # numeral centre radius
    h = 2.53         # numeral height (radial)
    for k in range(1, 12):
        n = 2 * k
        items.append(('num', str(n), k * 30.0, r_c, h))
    # odd-hour dots, 1.0 mm diameter centred r=16.38
    for k in range(12):
        items.append(('dot', None, 15.0 + k * 30.0, 16.38, 1.0))
    return items


def triangle_geom():
    # inverted triangle at 24: top edge r=18.44, width 5.55, tip r=15.90
    top = 18.44
    tip = 15.90
    hw = 2.77
    g = Polygon([(-hw, top), (hw, top), (0, tip)])
    g = g.buffer(-0.22, join_style=1).buffer(0.22, join_style=1, quad_segs=16)
    return g


def sub60_engravings(mask, bold=False):
    """The Submariner's 60-minute insert, measured off m126613ln-0002 in the GMT frame:
    minute ticks every 6 deg for the first quarter (r 15.95-17.07), a longer line at 5
    (to 18.58), batons at 15/25/35/45/55 (r 15.98-18.58, 0.98 wide), numerals 10-50 (r 16.0-18.6;
    10 and 50 read with their tops outward, 20, 30 and 40 upright from the 6 o'clock side) and
    the triangle at 0 holding a round luminous pip. Returns the pip as its own mask."""
    for m in range(1, 15):
        if m == 10:
            continue
        t = math.radians(m * 6.0)
        ux, uy = math.sin(t), math.cos(t)
        r0, r1, w = (15.95, 18.58, 0.30) if m == 5 else (15.95, 17.07, 0.17)
        mask.fill_geom(LineString([(r0 * ux, r0 * uy), (r1 * ux, r1 * uy)]).buffer(w / 2, cap_style=2), 255)
    for m in (15, 25, 35, 45, 55):
        t = math.radians(m * 6.0)
        ux, uy = math.sin(t), math.cos(t)
        g = LineString([(15.98 * ux, 15.98 * uy), (18.58 * ux, 18.58 * uy)]).buffer(0.49, cap_style=2)
        mask.fill_geom(g.buffer(-0.08).buffer(0.08), 255)
    for n, th in ((10, 60.0), (20, 120.0), (30, 180.0), (40, 240.0), (50, 300.0)):
        if bold:   # the Yacht-Master's big raised numerals
            glyph_on_arc(mask, str(n), FONT['intersb'], 2.85, 17.30, th, 255, stretch=1.18, tracking=0.14,
                         outward=th in (60.0, 300.0))
        else:
            glyph_on_arc(mask, str(n), FONT['inter'], 2.50, 17.30, th, 255, stretch=1.08, tracking=0.16,
                         outward=th in (60.0, 300.0))
    tri = Polygon([(-2.15, 18.62), (2.15, 18.62), (0, 15.88)])
    tri = tri.buffer(-0.20, join_style=1).buffer(0.20, join_style=1, quad_segs=16)
    mask.fill_geom(tri, 255)
    pip = Canvas(mask.img.size[0], mask.R, 'L', 0)
    pip.fill_geom(Point(0, 17.55).buffer(0.68, 48), 255)
    return pip


def make_insert_textures(paths, size=4096):
    """paths: dict with keys albedo, orm, normal."""
    R = INSERT_TEX_R
    alb = Canvas(size, R, 'RGB', (8, 8, 9))
    # black top half, grey bottom half (split along the 6-18 line)
    BLACK = tuple(VAR['insert_top'])
    GREY = tuple(VAR['insert_bottom'])
    d = ImageDraw.Draw(alb.img)
    d.rectangle([0, 0, size, size // 2], fill=BLACK)
    d.rectangle([0, size // 2, size, size], fill=GREY)
    # mask of all engravings (L)
    mask = Canvas(size, R, 'L', 0)
    pip = None
    if VAR['insert_style'] == 'sub60':
        pip = sub60_engravings(mask)
    elif VAR['insert_style'] == 'ym60':
        sub60_engravings(mask, bold=True)    # the platinum bezel has no luminous pip
    for kind, txt, th, r, h in (insert_numeral_geoms() if VAR['insert_style'] == 'gmt24' else ()):
        if kind == 'num':
            # glyphs laid individually so the pair hugs the circle
            glyph_on_arc(mask, txt, FONT['intersb'], h, r, th, 255, stretch=1.38, tracking=0.12,
                         outward=True)
        else:
            t = math.radians(th)
            mask.fill_geom(Point(r * math.sin(t), r * math.cos(t)).buffer(h / 2, 48), 255)
    if VAR['insert_style'] == 'gmt24':
        mask.fill_geom(triangle_geom(), 255)
    m = mask.img
    # platinum fill colour with fine frosted grain
    rng = np.random.default_rng(7)
    grain = (rng.normal(0, 1, (size, size)) * 9).astype(np.float32)
    grain = gaussian_filter(grain, 0.8)
    eng = VAR['engrave'] or (205, 205, 205)
    plat_img = Image.merge('RGB', [Image.fromarray(np.clip(c + grain, 0, 255).astype(np.uint8)) for c in eng])
    alb.img.paste(plat_img, (0, 0), m)
    pf = None
    if pip is not None:
        # the luminous pip in the triangle at 0: white lume, not metal
        alb.img.paste(Image.new('RGB', alb.img.size, (226, 230, 224)), (0, 0), pip.img)
        pf = np.asarray(pip.img).astype(np.float32) / 255.0
    alb.img.save(paths['albedo'])
    # ORM: R=occlusion(1), G=roughness, B=metallic
    mf = np.asarray(m).astype(np.float32) / 255.0
    if pf is not None:
        mf = np.clip(mf - pf, 0, 1)
    rough = 0.06 * (1 - mf) + 0.38 * mf
    metal = mf
    if VAR['insert_style'] == 'ym60':
        # solid platinum: a sand-blasted ground, the raised numerals and markers polished
        rough = 0.44 * (1 - mf) + 0.20 * mf
        metal = np.ones_like(mf)
    orm = np.stack([np.ones_like(mf), rough, metal], -1)
    Image.fromarray((orm * 255 + 0.5).astype(np.uint8)).save(paths['orm'])
    # normal map: engraved numerals filled flush, with a soft bevel at the edge
    # (height field = blurred mask: rim slopes into the engraving)
    hgt = gaussian_filter(np.asarray(m).astype(np.float32) / 255.0, size / 4096 * 5.0)
    hgt = hgt + (grain / 255.0) * 0.06 * mf
    gy, gx = np.gradient(hgt)
    strength = 5.0
    nx = -gx * strength
    ny = gy * strength      # image y down -> tangent y up
    nz = np.ones_like(nx)
    l = np.sqrt(nx * nx + ny * ny + nz * nz)
    nrm = np.stack([nx / l, ny / l, nz / l], -1)
    Image.fromarray(((nrm * 0.5 + 0.5) * 255 + 0.5).astype(np.uint8)).save(paths['normal'])
    return paths


# --------------------------------------------------------------------------
# DATE DISC
# --------------------------------------------------------------------------
def make_date_texture(path, size=512, w_mm=4.0, h_mm=3.0):
    img = Image.new('RGB', (size, int(size * h_mm / w_mm)), (238, 238, 234))
    ppm = size / w_mm
    m = text_mask('28', FONT['sans'], ppm * 0.95, stretch=1.0, tracking=0.02)   # ~2.0 mm through the Cyclops
    layer = Image.new('RGB', m.size, (12, 12, 12))
    img.paste(layer, (int(size / 2 - m.size[0] / 2), int(img.size[1] / 2 - m.size[1] / 2)), m)
    img.save(path)
    return path


# --------------------------------------------------------------------------
# BRUSHED (satin) NORMAL MAP -- fine directional streaks along +V
# --------------------------------------------------------------------------
def make_brushed_normal(path, size=1024, seed=3):
    rng = np.random.default_rng(seed)
    # height field: noise stretched strongly along v (image y)
    n = rng.normal(0, 1, (size, size)).astype(np.float32)
    img = Image.fromarray(n)
    # anisotropic blur: blur along y only (box via resize trick)
    a = np.asarray(img)
    k = 64
    cs = np.cumsum(np.concatenate([a, a[:k]], 0), 0)
    a = (cs[k:] - cs[:-k]) / k
    a = a[:size]
    # a little cross-blur
    a = (a + np.roll(a, 1, 1) * 0.5 + np.roll(a, -1, 1) * 0.5) / 2.0
    a = (a - a.mean()) / (a.std() + 1e-6)
    gx = (np.roll(a, -1, 1) - np.roll(a, 1, 1)) * 0.5
    gy = (np.roll(a, -1, 0) - np.roll(a, 1, 0)) * 0.5
    s = 0.10
    nx, ny, nz = -gx * s, gy * s, np.ones_like(a)
    l = np.sqrt(nx * nx + ny * ny + nz * nz)
    nrm = np.stack([nx / l, ny / l, nz / l], -1)
    Image.fromarray(((nrm * 0.5 + 0.5) * 255 + 0.5).astype(np.uint8)).save(path)
    return path


if __name__ == '__main__':
    import sys, os
    out = sys.argv[1] if len(sys.argv) > 1 else 'tex'
    os.makedirs(out, exist_ok=True)
    make_dial_texture(os.path.join(out, 'dial.png'))
    make_insert_textures({'albedo': os.path.join(out, 'insert_albedo.png'),
                          'orm': os.path.join(out, 'insert_orm.png'),
                          'normal': os.path.join(out, 'insert_normal.png')})
    make_date_texture(os.path.join(out, 'date.png'))
    make_brushed_normal(os.path.join(out, 'brushed_n.png'))
