import sys, os
sys.path.insert(0, '/root/.claude/skills/claude-drawing/lib')
import numpy as np
from linocut import Linocut
from core import spline, text_mask, load_font
BX0, BY0, BX1, BY1 = 28, 28, 1052, 1892
W, H = 1080, 1920
def new(seed):
    L = Linocut(W, H, block=(BX0, BY0, BX1, BY1), seed=seed)
    lamp = L.colour_block('#e8a33a', offset=(4, -3))
    return L, lamp
def line(ctrl):
    P = spline(ctrl, 16); xs = np.arange(BX0 - 10, BX1 + 11, 4, dtype=np.float32)
    return xs, np.interp(xs, P[:, 0], P[:, 1]).astype(np.float32)
def figure(L, cx, base, s=1.0, bag=True, hat=True, bow=0.0, arm_out=False):
    """tall slim person seen from behind, black, standing on cleared ground"""
    F = lambda pts: [(cx + x * s, base + y * s) for x, y in pts]
    L.leave(F([(-62, -430), (62, -430), (80, -330), (92, -60), (48, -50), (38, 0), (-38, 0), (-48, -50), (-92, -60), (-80, -330)]))
    L.leave(F([(-18, -455), (18, -455), (16, -425), (-16, -425)]))
    L.leave(L.disc(cx + bow * 10 * s, base - (482 - bow * 18) * s, 42 * s))
    if hat:
        L.leave(F([(-86 + bow*10, -522 + bow*18), (86 + bow*10, -522 + bow*18), (82 + bow*10, -505 + bow*18), (-82 + bow*10, -505 + bow*18)]))
        L.leave(F([(-46 + bow*10, -588 + bow*18), (46 + bow*10, -588 + bow*18), (48 + bow*10, -518 + bow*18), (-48 + bow*10, -518 + bow*18)]))
    L.leave(F([(-38, 0), (-12, 0), (-14, 60), (-40, 60)])); L.leave(F([(12, 0), (38, 0), (38, 54), (14, 54)]))
    if bag:
        L.leave(F([(66, -280), (166, -280), (172, -160), (72, -160)]))
        L.gouge(F([(-46, -425), (56, -330), (116, -282)]), 5 * s, 'v', cut=True)
        L.gouge(F([(76, -262), (162, -262)]), 3 * s, 'v', cut=True); L.gouge(F([(116, -262), (118, -230)]), 4 * s, 'v', cut=True)
    if arm_out:
        L.leave(F([(70, -400), (90, -410), (190, -330), (178, -310)]))
    for k in range(5): L.gouge(F([(-54 + k * 26, -400), (-60 + k * 28, -80)]), 2.2 * s, 'v', cut=True)
def carve_text(L, text, x, y, size, anchor='mm', cut=True, style='serif'):
    f = load_font(style, size)
    m = text_mask(H, W, text, f, (x, y), anchor)
    (L.clear(m, chatter=0.1) if cut else L.leave(m))
def ground_snow(L, y0=1500, amp=12):
    GX, GY = line([(BX0-10, y0), (400, y0 - amp), (700, y0 + amp), (BX1+10, y0)])
    field = list(zip(GX, GY)) + [(BX1+10, BY1+10), (BX0-10, BY1+10)]
    L.clear(L.poly(field), chatter=0.5, angle=-6)
    L.hatch(L.poly(field), angle=-2, spacing=13, width=3.0, dash=(40, 240), gap=(10, 90), cut=False,
            bend=lambda x, y: 14*np.sin(x/150 + y/41), density=lambda x, y: float(np.clip(0.12 + 0.5*max(0.0, (y-y0)/(BY1-y0))**1.6, 0.05, 0.8)))
    return GX, GY, field
def sky_flow(L, region, dens=0.25, cx=None, cy=None):
    md = (lambda x, y: np.hypot(x - cx, y - cy)) if cx is not None else (lambda x, y: 999)
    L.flow(region, lambda x, y: 171 + 5*np.sin(x/230 + y/95), n=240, length=(40, 260), width=(1.6, 4.5), step=3.0,
           density=lambda x, y: dens*float(np.clip((md(x, y) - 200)/60, 0, 1)))
def finish(L, name):
    os.makedirs(f'out/{name}', exist_ok=True)
    L.save(f'out/{name}/final.png', stages_dir=f'out/{name}/st')
