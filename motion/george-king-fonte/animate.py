import os, glob, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
sys.path.insert(0, '/root/.claude/skills/claude-drawing/lib')
from core import load_font
W, H, FPS = 1080, 1920, 30
D = 0.4
cuts = [0] + [c + D for c in [9.88, 16.94, 23.29, 29.34, 36.21, 47.21, 53.08, 58.28, 64.33, 68.63]] + [78.4]
PAPER = np.array([238, 231, 212], np.float32)
def stages(s):
    d = {}
    for f in sorted(glob.glob(f'out/{s}/st/*.png')):
        n = os.path.basename(f)[3:-4]; d[n] = np.asarray(Image.open(f).convert('RGB'), np.float32)
    return d
ease = lambda x: 0.5 - 0.5*np.cos(np.pi*np.clip(x, 0, 1))
SC = {
 's01': dict(seq=[('nofig', 0)], fig=dict(t0=0.0, t1=9.5, p0=(0, 80, 1.08), p1=(-10, -230, 0.62)), cam=((1.18, 540, 1000, 0), (1.0, 540, 960, 0))),
 's02': dict(seq=[('globe', 0), ('rays0', 0.7), ('rays1', 1.5), ('rays2', 2.3), ('end', 3.0)], cam=((1.0, 540, 960, 0), (1.14, 540, 960, 4))),
 's03': dict(seq=[('press', 0), ('sheets0', 1.6), ('sheets1', 2.6), ('sheets2', 3.6)], cam=((1.35, 540, 520, 0), (1.04, 540, 1000, 0))),
 's04': dict(seq=[('dark', 0), ('nofig', 1.1)], fig=dict(t0=1.4, t1=3.4, p0=(-330, 0, 1.0), p1=(0, 0, 1.0)), snow=True, flick=True, cam=((1.15, 620, 1000, 0), (1.15, 470, 1050, 0))),
 's05': dict(seq=[('room', 0), ('preach', 0.5), ('papers', 4.75)], cam=((1.0, 540, 960, 0), (1.12, 560, 1250, 0)), punch=4.75),
 's06': dict(seq=[('dark', 0), ('fire', 0.9), ('chair', 2.2)], flick=True, cam=((1.0, 540, 960, 0), (1.22, 540, 1150, 0)), text=('PREGADOR DA LAREIRA', 7.8, 500)),
 's07': dict(seq=[('nofig', 0)], fig=dict(t0=0.3, t1=5.6, p0=(0, 40, 1.05), p1=(-330, -520, 0.5)), snow=True, flick=True, cam=((1.08, 560, 1100, 0), (1.0, 540, 960, 0))),
 's08': dict(seq=[('table', 0)] + [(f'coin{i}', 0.5 + 0.38*i) for i in range(6)] + [('62', 3.0)], flick=True, cam=((1.15, 600, 1250, 0), (1.0, 540, 1100, 0))),
 's09': dict(seq=[('blank', 0), ('book', 0.35), ('rays0', 1.5), ('rays1', 2.3), ('rays2', 3.1)], cam=((1.3, 540, 1000, 0), (1.0, 540, 960, 0))),
 's10': dict(seq=[('earth', 0)] + [(f'home{i}', 0.4 + 0.42*i) for i in range(6)], snow=True, flick=True, cam=((1.0, 520, 1000, 0), (1.08, 560, 1100, -1.5))),
 's11': dict(seq=[('nofig', 0)], fig=dict(t0=0.6, t1=8.6, p0=(0, 0, 1.0), p1=(0, -470, 0.42)), cam=((1.0, 540, 1000, 0), (1.12, 540, 980, 0)), fadeout=0.9),
}
names = list(SC.keys())
def camxf(img, z, cx, cy, rot):
    a = np.deg2rad(rot); c, s = np.cos(a), np.sin(a)
    # out (u,v) -> in = C + R(-a) * ((u-W/2), (v-H/2)) / z
    A = c / z; B = s / z; Dd = -s / z; E = c / z
    C0 = cx - A*W/2 - B*H/2; F0 = cy - Dd*W/2 - E*H/2
    return img.transform((W, H), Image.AFFINE, (A, B, C0, Dd, E, F0), resample=Image.BILINEAR, fillcolor=tuple(int(v) for v in PAPER))
font = load_font('serif', 50)
proc = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                         '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17', '-preset', 'medium', '-movflags', '+faststart', 'george.mp4'], stdin=subprocess.PIPE)
rng = np.random.default_rng(7)
flakes = rng.random((260, 4))
for si, s in enumerate(names):
    cfg = SC[s]; st = stages(s); t0s, t1s = cuts[si], cuts[si+1]; dur = t1s - t0s
    lampmask = None
    last = st[cfg['seq'][-1][0]]
    o = last.astype(np.float32)
    lamp = (o[..., 0] > 180) & (o[..., 1] > 110) & (o[..., 1] < 190) & (o[..., 2] < 120)
    lampmask = np.asarray(Image.fromarray((lamp*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3)), np.float32)/255
    figL = None
    if 'fig' in cfg:
        a, b = st['nofig'], st['fig']
        m = (np.abs(a - b).max(-1) > 30).astype(np.uint8) * 255
        m = Image.fromarray(m).filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(1))
        ys, xs = np.nonzero(np.asarray(m) > 20); foot = (xs.mean(), ys.max())
        figL = (Image.fromarray(b.astype(np.uint8)), m, foot)
    nfr = int(round(dur * FPS))
    for k in range(nfr):
        t = k / FPS
        # stage crossfade
        img = None
        for (n, ts) in cfg['seq']:
            if t < ts: break
            a = min(1.0, (t - ts) / 0.3) if ts > 0 else 1.0
            img = st[n] if img is None else img * (1 - a) + st[n] * a
        img = img.copy()
        if cfg.get('flick') and lampmask is not None:
            f = 1 + 0.10*np.sin(t*17 + 1.3) + 0.06*np.sin(t*29) + 0.05*rng.standard_normal()
            img = img * (1 + (f - 1) * lampmask[..., None] * 0.9)
        frame = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
        if figL is not None:
            fc = cfg['fig']; u = ease((t - fc['t0']) / (fc['t1'] - fc['t0']))
            p = [fc['p0'][i] + (fc['p1'][i] - fc['p0'][i]) * u for i in range(3)]
            moving = 0 < (t - fc['t0']) < (fc['t1'] - fc['t0'])
            bob = 5 * abs(np.sin((t - fc['t0']) * 6)) if moving else 0
            if p[0] != 0 or p[1] != 0 or p[2] != 1 or True:
                base = Image.fromarray(np.clip(img if True else st['nofig'], 0, 255).astype(np.uint8))
                if figL is not None:
                    # remove figure from current image by using nofig pixels under mask
                    nof = np.asarray(Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)), np.float32)
                    mm = np.asarray(figL[1], np.float32)[..., None] / 255
                    clean = nof * (1 - mm) + st['nofig'] * mm
                    if cfg.get('flick'): clean = clean * (1 + (f - 1) * lampmask[..., None] * 0.9) * (mm) + clean * (1 - mm) if False else clean
                    base = Image.fromarray(np.clip(clean, 0, 255).astype(np.uint8))
                fx, fy = figL[2]; sc = p[2]
                fimg = figL[0].resize((int(W*sc), int(H*sc)), Image.BILINEAR); fm = figL[1].resize((int(W*sc), int(H*sc)), Image.BILINEAR)
                ox = int(fx + p[0] - fx*sc); oy = int(fy + p[1] - bob - fy*sc)
                base.paste(fimg, (ox, oy), fm)
                frame = base if (t >= fc['t0'] - 0.0 or True) else frame
        if 'text' in cfg:
            txt, tt, ty = cfg['text']
            if t >= tt:
                a = min(1, (t - tt) / 0.5)
                d = ImageDraw.Draw(frame); tw = d.textlength(txt, font=font)
                lay = Image.new('L', (W, H), 0); ImageDraw.Draw(lay).text(((W - tw)/2, ty), txt, font=font, fill=int(255*a))
                frame.paste(Image.new('RGB', (W, H), (238, 231, 212)), (0, 0), lay)
        if cfg.get('snow'):
            d = ImageDraw.Draw(frame)
            for (x0, y0, sp, sz) in flakes:
                x = (x0*W + 40*np.sin(t*0.8 + y0*20)) % W; y = (y0*H + t*(60 + 90*sp)) % H; r = 2 + 3*sz
                d.ellipse([x - r, y - r, x + r, y + r], fill=(238, 231, 212))
        u = ease(t / dur); (z0, x0, y0, r0), (z1, x1, y1, r1) = cfg['cam']
        z = z0 + (z1 - z0)*u; cx = x0 + (x1 - x0)*u; cy = y0 + (y1 - y0)*u; rot = r0 + (r1 - r0)*u
        if 'punch' in cfg and 0 <= t - cfg['punch'] < 0.5:
            z *= 1 + 0.06*np.sin(np.pi * (t - cfg['punch']) / 0.5)
        # hand-printed boil: tiny shift changing every 4 frames
        j = (k // 4) % 4; cx += [0, 1, -1, 0][j]; cy += [0, -1, 1, 1][j]
        frame = camxf(frame, z, cx, cy, rot)
        arr = np.asarray(frame, np.float32)
        if t < 0.25 and si > 0: pass
        if cfg.get('fadeout') and t > dur - cfg['fadeout']:
            a = (t - (dur - cfg['fadeout'])) / cfg['fadeout']; arr = arr * (1 - a) + PAPER * a
        proc.stdin.write(np.clip(arr, 0, 255).astype(np.uint8).tobytes())
    print(s, nfr, flush=True)
proc.stdin.close(); proc.wait()
