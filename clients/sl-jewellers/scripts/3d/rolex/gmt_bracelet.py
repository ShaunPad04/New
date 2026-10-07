"""Oyster bracelet (closed loop, catalogue 'upright' pose), solid end links
and Oysterlock clasp.  Units mm, watch-local frame (see build.py).

The loop lies in the local y-z plane behind the case.  Rigid three-piece
link rows are placed on chords of a smooth closed path so consecutive rows
articulate about their hinge pins exactly like the real bracelet (no
bending of rigid parts).  Taper 20 -> 16 mm from the end links to the clasp.
"""
import math
import numpy as np

PITCH = 8.30          # link pitch (catalogue: outer gaps 240 px apart = 8.3 mm)
GAP = 0.22            # visible gap between consecutive rows
T_LINK = 3.00         # link thickness
STAGGER = 1.00        # centre-link hinge offset along the bracelet (centre dark bands sit ~2 mm past the outer joints)
W0, W1 = 20.0, 16.0   # width at the end link / at the clasp
CEN_FRAC = 0.44       # centre link share of the width (catalogue 8.7/19.8)
VGAP = 0.10           # gap between centre and outer links
P0_Y, P0_Z = 23.90, -1.75     # first hinge (end of the solid end link)
P0_ANG = -28.0                # bracelet leaves the lugs heading down 28 deg
CLASP_L = 35.0                # clasp length between its hinges
N_TOP, N_BOT = 7, 7           # link rows above / below (loop closes on whole links, ~18.5 cm wrist)


# ------------------------------------------------------------------ path
def bezier(P0, P1, P2, P3, n=4000):
    t = np.linspace(0, 1, n)[:, None]
    return ((1 - t) ** 3) * P0 + 3 * ((1 - t) ** 2) * t * P1 + 3 * (1 - t) * t * t * P2 + t ** 3 * P3


def arc(start, ang_deg, end, end_dir, a, b):
    s = np.asarray(start, float)
    e = np.asarray(end, float)
    t0 = np.array([math.cos(math.radians(ang_deg)), math.sin(math.radians(ang_deg))])
    t1 = np.asarray(end_dir, float)
    return bezier(s, s + a * t0, e - b * t1, e)


def chord_walk(poly, step, n):
    """n pivots after the start along a polyline, consecutive pivots exactly
    `step` apart (chord length).  Returns (pivots, leftover) where leftover is
    the remaining arc length from the last pivot to the end of the polyline
    (negative if the polyline ran out)."""
    seg = np.linalg.norm(np.diff(poly, axis=0), axis=1)
    cum = np.concatenate([[0], np.cumsum(seg)])
    piv = [poly[0]]
    cur = poly[0]
    i = 0
    for it in range(n):
        d = np.linalg.norm(poly[i:] - cur, axis=1)
        k = int(np.argmax(d >= step))
        if d[k] < step:
            # ran out: report the missing length (this chord + the ones left)
            short = step - d[-1] + (n - it - 1) * step
            piv.append(poly[-1])
            return np.array(piv), -short
        j = i + k
        a, b = poly[j - 1], poly[j]
        da, db = np.linalg.norm(a - cur), np.linalg.norm(b - cur)
        t = (step - da) / max(db - da, 1e-12)
        cur = a + (b - a) * t
        piv.append(cur)
        i = j - 1
        s_cur = cum[j - 1] + t * seg[j - 1]
    return np.array(piv), cum[-1] - s_cur


def make_paths(zb, yc, a_top=26.0, b_top=17.0, a_bot=34.0, b_bot=17.0):
    top = arc((P0_Y, P0_Z), P0_ANG, (yc + CLASP_L / 2, zb), (-1, 0), a_top, b_top)
    bot = arc((-P0_Y, P0_Z), 180 - P0_ANG, (yc - CLASP_L / 2, zb), (1, 0), a_bot, b_bot)
    return top, bot


def residuals(zb, yc):
    top, bot = make_paths(zb, yc)
    _, lt = chord_walk(top, PITCH, N_TOP)
    _, lb = chord_walk(bot, PITCH, N_BOT)
    return np.array([lt, lb])


def solve_loop(zb=-46.0, yc=-5.0):
    """Newton solve for clasp depth zb and height yc so that both arcs end
    exactly on whole link rows (zero leftover)."""
    x = np.array([zb, yc], float)
    for it in range(40):
        r = residuals(*x)
        if np.abs(r).max() < 1e-4:
            break
        J = np.zeros((2, 2))
        h = 0.05
        for k in range(2):
            dx = np.zeros(2)
            dx[k] = h
            J[:, k] = (residuals(*(x + dx)) - r) / h
        step = np.linalg.lstsq(J, -r, rcond=None)[0]
        step = np.clip(step, -3, 3)
        x = x + step
    return x[0], x[1], float(np.abs(residuals(*x)).max())


if __name__ == '__main__':
    zb, yc, err = solve_loop()
    print('zb %.3f yc %.3f err %.5f' % (zb, yc, err))
    top, bot = make_paths(zb, yc)
    print('top max y %.2f  bot min y %.2f  min z %.2f' % (top[:, 0].max(), bot[:, 0].min(), min(top[:, 1].min(), bot[:, 1].min())))


# ------------------------------------------------------------------ SDFs
def _rr2(u, v, hu, hv, r):
    """2D rounded rectangle SDF"""
    qx = np.abs(u) - hu + r
    qy = np.abs(v) - hv + r
    return np.sqrt(np.maximum(qx, 0) ** 2 + np.maximum(qy, 0) ** 2) + np.minimum(np.maximum(qx, qy), 0) - r


def _rbox4(v, w, hv, hh, r_pp, r_pm, r_mp, r_mm):
    """2D rounded box with a radius per corner (v>0/w>0 quadrants)."""
    r = np.where(v > 0, np.where(w > 0, r_pp, r_pm), np.where(w > 0, r_mp, r_mm))
    qx = np.abs(v) - hv + r
    qy = np.abs(w) - hh + r
    return np.sqrt(np.maximum(qx, 0) ** 2 + np.maximum(qy, 0) ** 2) + np.minimum(np.maximum(qx, qy), 0) - r


HINGE_G = 0.08        # clearance between a knuckle and the next link's socket


def hinge_ends(u, w, p, rho, g=HINGE_G):
    """Along-bracelet profile of a link spanning pins at u=-p/2 (socket) and
    u=+p/2 (knuckle).  Knuckle = cylinder of radius rho around pin B; the
    socket is a cylinder of radius rho+g around pin A, so consecutive rows
    roll on each other like the real hinge and only a hairline shows."""
    dB = np.minimum(u - p / 2, np.sqrt((u - p / 2) ** 2 + w * w) - rho)
    dA = np.maximum(-(u + p / 2), (rho + g) - np.sqrt((u + p / 2) ** 2 + w * w))
    return np.maximum(dB, dA)


class OuterTileSDF:
    """Outer (satin) link piece.  u along the bracelet (pins at +-p/2),
    v across (v>0 = bracelet edge), w outward."""

    def __init__(self, p, hw, rho=T_LINK / 2):
        self.p, self.hw, self.rho = p, hw, rho

    def __call__(self, P, G):
        u, v, w = P[:, 0], P[:, 1], P[:, 2]
        crown = 0.10 * (v / self.hw) ** 2 * (0.5 + 0.5 * np.tanh(w / 0.4))
        cs = _rbox4(v, w + crown, self.hw, self.rho, 1.05, 0.85, 0.28, 0.25)
        return G.smax(cs, hinge_ends(u, w, self.p, self.rho), 0.10)


class CentreTileSDF:
    """Centre (polished) link piece, domed across."""

    def __init__(self, p, hw, rho=T_LINK / 2 - 0.05):
        self.p, self.hw, self.rho = p, hw, rho

    def __call__(self, P, G):
        u, v, w = P[:, 0], P[:, 1], P[:, 2]
        crown = 0.16 * (v / self.hw) ** 2 * (0.5 + 0.5 * np.tanh(w / 0.4))
        cs = _rbox4(v, w + crown, self.hw, self.rho, 0.45, 0.35, 0.45, 0.35)
        return G.smax(cs, hinge_ends(u, w, self.p, self.rho), 0.10)


class EndLinkSDF:
    """Solid end link (top, y>0) fitted between the lugs against the case;
    knuckles at P0 (outer parts) and at the staggered centre pin."""

    def __init__(self, B, c0):
        self.B = B
        self.hw_c = CEN_FRAC * W0 / 2
        self.c0 = c0                       # centre-row first pin (y, z)

    def ztop(self, y):
        yt = 23.7
        k = float(self.B.lug_drop(np.array(yt)) - self.B.lug_drop(np.array(yt - 0.01))) / 0.01   # drop slope at the tip
        z = self.B.Z_TOP - self.B.lug_drop(np.minimum(np.abs(y), yt)) - 0.08
        return z - k * np.maximum(np.abs(y) - yt, 0)

    def __call__(self, P, G):
        x, y, z = P[:, 0], P[:, 1], P[:, 2]
        ax = np.abs(x)
        r = np.sqrt(x * x + y * y)
        plan = G.smax(ax - 9.97, 20.05 - r, 0.15)
        zt = self.ztop(y) + np.where(ax < self.hw_c, 0.05, 0.0)
        top = G.round_isect(ax - 9.97, z - zt, 0.55)
        base = np.maximum(np.maximum(plan, top), (P0_Z - T_LINK / 2) - z)
        # outer parts end in a knuckle around P0
        ko = np.minimum(y - P0_Y, np.sqrt((y - P0_Y) ** 2 + (z - P0_Z) ** 2) - T_LINK / 2)
        do = np.maximum(base, ko)
        # centre tongue reaches the staggered pin
        yc, zc = self.c0
        rc = T_LINK / 2 - 0.05
        kc = np.minimum(y - yc, np.sqrt((y - yc) ** 2 + (z - zc) ** 2) - rc)
        dc = np.maximum(np.maximum(base, kc), ax - self.hw_c)
        d = np.minimum(do, dc)
        # grooves between the centre part and the outer parts
        gr = np.sqrt((ax - (self.hw_c + 0.05)) ** 2 + (z - zt - 0.02) ** 2) - 0.10
        d = G.smax(d, -gr, 0.03)
        return d


class ClaspSDF:
    """Oysterlock folding clasp cover; u along the bracelet (toward 12 o'clock
    side at +u), v across, w outward (away from the wrist)."""

    def __init__(self, L, hw=8.2):
        self.L, self.hw = L, hw
        self.u_lever = L / 2 - 8.5     # safety catch occupies the +u end

    def __call__(self, P, G):
        u, v, w = P[:, 0], P[:, 1], P[:, 2]
        d2 = _rr2(u, v, self.L / 2, self.hw, 0.9)
        lever = u > self.u_lever
        wt = 2.35 - 0.22 * (v / self.hw) ** 2 + np.where(lever, 0.18, 0.0)
        dt = G.round_isect(d2, w - wt, 0.75)
        db = G.round_isect(d2, -1.65 - w, 0.70)
        d = np.maximum(dt, db)
        # parting line of the safety catch (across the cover)
        g1 = np.sqrt((u - self.u_lever) ** 2 + np.maximum(w - (wt - 0.35), 0) ** 2) - 0.09
        d = G.smax(d, -g1, 0.03)
        # side seam between cover and blade (along both sides)
        g2 = np.sqrt((np.abs(v) - self.hw) ** 2 + (w - 0.55) ** 2) - 0.10
        d = G.smax(d, -g2, 0.03)
        # hinge sockets for the last links' knuckles at both pins
        for pu in (CLASP_L / 2, -CLASP_L / 2):
            d = np.maximum(d, (T_LINK / 2 + HINGE_G) - np.sqrt((u - pu) ** 2 + w * w))
        # fingernail lift notch at the lever end
        g3 = np.sqrt((u - self.L / 2) ** 2 + (w - 0.9) ** 2 * 4 + (v / 3.5) ** 2) - 0.55
        d = G.smax(d, -g3, 0.08)
        return d


# ------------------------------------------------------------------ build
_SRC_KEY = None


def _src_key():
    global _SRC_KEY
    if _SRC_KEY is None:
        import hashlib
        _SRC_KEY = hashlib.sha1(open(__file__, 'rb').read()).hexdigest()
    return _SRC_KEY


def _poly(B, name, f, half, h, target):
    G = B.G
    g = lambda P: f(P, G)
    me, V, T, N = G.sdf_mesh(name, g, tuple(-np.asarray(half)), tuple(half), h, target, key=_src_key())
    import bpy
    bpy.data.meshes.remove(me)
    return V, T, N


def arc_cum(poly):
    seg = np.linalg.norm(np.diff(poly, axis=0), axis=1)
    return np.concatenate([[0], np.cumsum(seg)])


def point_at(poly, cum, s):
    s = np.clip(s, 0, cum[-1])
    j = int(np.searchsorted(cum, s))
    j = min(max(j, 1), len(poly) - 1)
    t = (s - cum[j - 1]) / max(cum[j] - cum[j - 1], 1e-12)
    return poly[j - 1] + (poly[j] - poly[j - 1]) * t


def proj_s(poly, cum, p):
    d = np.linalg.norm(poly - p, axis=1)
    return cum[int(np.argmin(d))]


def frame_matrix(a, b, centre, sv=1.0, v_off=0.0, flipv=False):
    """tile-local (u,v,w) -> watch-local for a tile spanning hinge a->b
    (2D points in the y-z plane)."""
    a3 = np.array([0.0, a[0], a[1]])
    b3 = np.array([0.0, b[0], b[1]])
    u = b3 - a3
    u /= np.linalg.norm(u)
    mid = (a3 + b3) / 2
    w = np.array([0.0, -u[2], u[1]])
    c3 = np.array([0.0, centre[0], centre[1]])
    if np.dot(w, mid - c3) < 0:
        w = -w
    v = np.cross(w, u)
    M = np.eye(4)
    M[:3, 0] = u
    M[:3, 1] = v * sv
    M[:3, 2] = w
    M[:3, 3] = mid + v * v_off
    return M


def apply_M(M, V, N):
    Vw = V @ M[:3, :3].T + M[:3, 3]
    Ninv = np.linalg.inv(M[:3, :3]).T
    Nw = N @ Ninv.T
    Nw /= np.linalg.norm(Nw, axis=1)[:, None]
    return Vw, Nw


# Rolesor: polished gold centre links (material 2); Oystersteel: polished steel (0)
from variant import V as _VAR   # noqa: E402
CENTRE_MI = 2 if 'centre_links' in _VAR['gold_parts'] else 0


def build_bracelet(B):
    G = B.G
    B.log('bracelet: solving loop')
    zb, yc, err = solve_loop()
    B.log('bracelet: clasp centre y %.2f z %.2f (closure err %.1e mm)' % (yc, zb, err))
    top, bot = make_paths(zb, yc)
    centre = np.array([yc, (P0_Z + zb) / 2])
    hw_c0 = CEN_FRAC * W0 / 2
    hw_o0 = (W0 / 2 - hw_c0 - VGAP) / 2
    rho = T_LINK / 2
    B.log('bracelet: tiles')
    Vo, To, No = _poly(B, 'tile_o', OuterTileSDF(PITCH, hw_o0), (PITCH / 2 + rho + 0.1, hw_o0 + 0.1, rho + 0.1), 0.04, 820)
    Vc, Tc, Nc = _poly(B, 'tile_c', CentreTileSDF(PITCH, hw_c0), (PITCH / 2 + rho + 0.1, hw_c0 + 0.1, rho + 0.1), 0.04, 950)
    Ls = PITCH - STAGGER
    Vcs, Tcs, Ncs = _poly(B, 'tile_cs', CentreTileSDF(Ls, hw_c0), (Ls / 2 + rho + 0.1, hw_c0 + 0.1, rho + 0.1), 0.04, 900)
    # classification + uv in tile space
    mo = (No[To].mean(1)[:, 2] > 0.88).astype(np.int32)       # brushed tops
    uvo = np.stack([Vo[:, 1] / 4.0, Vo[:, 0] / 4.0], -1)
    allV, allT, allN, allM, allUV = [], [], [], [], []
    off = [0]

    def add(V, T, N, mi, uv):
        allV.append(V)
        allT.append(T + off[0])
        allN.append(N)
        allM.append(mi)
        allUV.append(uv)
        off[0] += len(V)

    rows = 0
    for path, n in ((top, N_TOP), (bot, N_BOT)):
        cum = arc_cum(path)
        S = cum[-1]
        piv, _ = chord_walk(path, PITCH, n)
        s_piv = [proj_s(path, cum, p) for p in piv]
        for k in range(n):
            a, b = piv[k], piv[k + 1]
            smid = 0.5 * (s_piv[k] + s_piv[k + 1])
            W = W0 + (W1 - W0) * smid / S
            hw_c = CEN_FRAC * W / 2
            hw_o = (W / 2 - hw_c - VGAP) / 2
            for side in (-1, 1):
                M = frame_matrix(a, b, centre, sv=hw_o / hw_o0, v_off=side * (hw_c + VGAP + hw_o))
                if side > 0:
                    V, N = apply_M(M, Vo, No)
                    add(V, To, N, mo, uvo.copy())
                else:   # mirrored piece so its rounded edge faces outward
                    sm = np.array([1, -1, 1.0])
                    V, N = apply_M(M, Vo * sm, No * sm)
                    add(V, To[:, ::-1], N, mo, uvo * np.array([-1, 1.0]))
            # centre tile, staggered along the path
            ca = point_at(path, cum, s_piv[k] + STAGGER)
            if k < n - 1:
                cb = point_at(path, cum, s_piv[k + 1] + STAGGER)
                Vt, Tt, Nt = Vc, Tc, Nc
            else:
                cb = path[-1]
                Vt, Tt, Nt = Vcs, Tcs, Ncs
            M = frame_matrix(ca, cb, centre, sv=hw_c / hw_c0)
            V, N = apply_M(M, Vt, Nt)
            add(V, Tt, N, np.full(len(Tt), CENTRE_MI, np.int32), np.zeros((len(Vt), 2)))
            rows += 1
    B.log('bracelet: %d rows' % rows)
    # solid end links (top built, bottom mirrored)
    B.log('bracelet: end links')
    cum_t = arc_cum(top)
    c0 = point_at(top, cum_t, STAGGER)
    el = EndLinkSDF(B, (c0[0], c0[1]))
    gfun = lambda P: el(P, G)
    me, Ve, Te, Ne = G.sdf_mesh('endlink', gfun, (-10.1, 16.0, -4.2), (10.1, c0[0] + T_LINK / 2 + 0.2, 2.0), 0.045, 5500,
                                key=_src_key())
    import bpy
    bpy.data.meshes.remove(me)
    c, nrm = G.face_centers_normals(Ve, Te, Ne)
    me_i = ((np.abs(c[:, 0]) > el.hw_c + 0.18) & (nrm[:, 2] > 0.70)).astype(np.int32)
    uve = np.stack([Ve[:, 0] / 4.0, Ve[:, 1] / 4.0], -1)
    add(Ve, Te, Ne, me_i, uve)
    Vm = Ve * np.array([1, -1, 1])
    Nm = Ne * np.array([1, -1, 1])
    add(Vm, Te[:, ::-1], Nm, me_i, uve * np.array([1, -1]))
    V = np.concatenate(allV)
    T = np.concatenate(allT)
    N = np.concatenate(allN)
    MI = np.concatenate(allM)
    UV = np.concatenate(allUV)
    B.emit('bracelet', V, T, N=N, mats=('steel_polished', 'steel_brushed') + (('gold_polished',) if CENTRE_MI == 2 else ()), mat_idx=MI, uv=UV,
           collection='bracelet')
    B.log('bracelet: %d tris' % len(T))
    # ---------------- clasp
    B.log('clasp')
    Lc = CLASP_L
    cl = ClaspSDF(Lc)
    me, Vk, Tk, Nk = G.sdf_mesh('clasp', lambda P: cl(P, G), (-Lc / 2 - 0.1, -8.3, -1.8), (Lc / 2 + 0.1, 8.3, 2.7),
                                0.045, 9000, key=_src_key())
    bpy.data.meshes.remove(me)
    mk = (Nk[Tk].mean(1)[:, 2] > 0.90).astype(np.int32)
    uvk = np.stack([Vk[:, 1] / 4.0, Vk[:, 0] / 4.0], -1)
    # clasp frame: u along +y (lever toward the 12 o'clock arc), w = -z (outward)
    Mk = np.eye(4)
    Mk[:3, 0] = (0, 1, 0)
    Mk[:3, 2] = (0, 0, -1)
    Mk[:3, 1] = np.cross(Mk[:3, 2], Mk[:3, 0])
    Mk[:3, 3] = (0, yc, zb)
    Vk2, Nk2 = apply_M(Mk, Vk, Nk)
    B.emit('clasp', Vk2, Tk, N=Nk2, mats=('steel_polished', 'steel_brushed'), mat_idx=mk, uv=uvk,
           collection='bracelet')
    # coronet relief on the cover, top toward the safety catch
    import gmt_tex as TX
    from shapely import affinity
    g = TX.coronet_geom(4.6)
    g = affinity.translate(g, 0, -2.3)
    Vc_, Fc_ = B.slab_arrays(g, 2.18, 2.47, bevel=0.07, seg=2, spacing=0.04)
    R = np.array([[0, 1, 0], [-1, 0, 0], [0, 0, 1]], float)     # (x_c,y_c,z_c) -> (u,v,w)
    Vc_ = Vc_ @ R.T + np.array([cl.u_lever - 4.6, 0, 0])
    Vc_ = Vc_ @ Mk[:3, :3].T + Mk[:3, 3]
    B.emit('clasp_coronet', Vc_, Fc_, mats=('steel_polished',), sharp=50.0, collection='bracelet')
    return dict(zb=zb, yc=yc)
