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
from shapely.geometry import Polygon, Point, LineString
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
DIAL_TEX_R = 14.4      # texture covers +-14.4 mm (dial r 13.45 + rehaut to 14.3)
WHITE = (236, 236, 232)
GREEN = tuple(VAR['gmt_text'])   # the GMT-MASTER II line (green on grnr)


def make_dial_texture(path, size=4096, rehaut_slope=(13.45, 14.25)):
    c = Canvas(size, DIAL_TEX_R, 'RGB', tuple(VAR['dial']))
    if VAR['sunburst']:
        # sunburst: brighter at the centre, falling off to the edge (measured off the catalogue
        # image: about +55% at r 3 mm against the edge)
        n = c.img.size[0]
        yy, xx = np.mgrid[0:n, 0:n]
        r = np.hypot(xx - n / 2, yy - n / 2) / (n / 2) * DIAL_TEX_R
        g = 1.0 + 0.55 * np.exp(-(r / 5.5) ** 2) - 0.06 * np.clip((r - 9) / 4, 0, 1)
        base = np.asarray(VAR['dial'], np.float32)
        c.img = Image.fromarray(np.clip(base[None, None, :] * g[..., None], 0, 255).astype(np.uint8))
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
    img = c.img
    img.save(path)
    return path


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
