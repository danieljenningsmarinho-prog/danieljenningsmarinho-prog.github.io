import sys
from kit import *
KEYONLY = lambda L: [L.key]
def s01():   # James White walks with the carpet bag, 1849
    L, lamp = new(101)
    GX, GY = line([(BX0-10, 1080), (380, 1060), (700, 1090), (BX1+10, 1070)])
    sky = [(BX0-10, BY0-10), (BX1+10, BY0-10)] + list(zip(GX[::-1], GY[::-1]))
    field = list(zip(GX, GY)) + [(BX1+10, BY1+10), (BX0-10, BY1+10)]
    L.clear(L.poly(field), chatter=0.5)
    L.hatch(L.poly(field), angle=-8, spacing=11, width=2.6, dash=(10, 50), gap=(6, 30), cut=False, density=lambda x, y: 0.45)
    road = [(380, BY1+10), (700, BY1+10), (560, 1300), (530, 1085), (515, 1085), (470, 1300)]
    L.clear(L.poly(road), chatter=0.2, angle=80)
    L.clear(L.disc(800, 380, 80), chatter=0.2); L.moon(800, 380, 80)
    sky_flow(L, L.poly(sky), 0.22, 800, 380)
    for x in np.arange(BX0+10, BX1, 34.0): L.pine(x, np.interp(x, GX, GY) + 8, np.random.default_rng(int(x)).uniform(50, 120), snow=0.0, halo=2.0, region=L.poly(sky))
    carve_text(L, '1849', 250, 330, 150)
    L.leave(L.rect(760, 1150, 772, 1330)); L.leave(L.rect(700, 1160, 900, 1205))     # signpost
    carve_text(L, 'MIDDLETOWN', 800, 1183, 30, style='sans')
    L.speckle(L.poly(sky), n=200, size=(2, 4), stars=0.02)
    L.stage('nofig')
    figure(L, 540, 1720, 0.85, bag=True)
    L.stage('fig'); finish(L, 's01')
def s02():   # globe with rays of light
    L, lamp = new(102)
    CX, CY, R = 540, 960, 300
    L.clear(L.disc(CX, CY, R), chatter=0.15)
    for k in range(-3, 4): L.rings(CX, CY + k * 0, [R * np.cos(k * 0.38)], width=0, arc=(0, 0))  if False else None
    for k in range(1, 6):   # parallels
        yy = CY - R + k * R / 3
        hw = np.sqrt(max(R*R - (yy - CY)**2, 0))
        L.gouge([(CX - hw + 4, yy), (CX, yy + 10), (CX + hw - 4, yy)], 3, 'v', cut=False)
    for a in np.linspace(-0.8, 0.8, 5):   # meridians
        pts = [(CX + np.sin(a) * R * np.cos(t), CY + R * np.sin(t)) for t in np.linspace(-1.5, 1.5, 30)]
        L.gouge(pts, 3, 'v', cut=False)
    from core import blob_pts
    for (bx, by, rx, ry, sd) in [(CX-110, CY-90, 95, 70, 1), (CX-60, CY+60, 50, 90, 2), (CX+120, CY+90, 85, 60, 3), (CX+90, CY-120, 60, 40, 4)]:
        L.leave(L.poly([tuple(p) for p in blob_pts(bx, by, rx, ry, rough=0.25, n=60, seed=sd)]))
    L.stage('globe')
    rng = np.random.default_rng(2)
    angs = np.linspace(0, 2*np.pi, 36, endpoint=False)
    for i, grp in enumerate(np.array_split(rng.permutation(angs), 3)):
        for a in grp:
            r0, r1 = R + 40, R + 40 + rng.uniform(180, 420)
            L.gouge([(CX + np.cos(a)*r0, CY + np.sin(a)*r0), (CX + np.cos(a)*r1, CY + np.sin(a)*r1)], rng.uniform(5, 11), 'v', cut=True, taper=(0.0, 0.8))
        L.stage(f'rays{i}')
    L.speckle(None, n=300, size=(2, 4), stars=0.03)
    L.stage('end'); finish(L, 's02')
def s03():   # printing press, 1853
    L, lamp = new(103)
    L.clear(L.rect(BX0, 1500, BX1, BY1), chatter=0.4)
    L.hatch(L.rect(BX0, 1500, BX1, BY1), angle=0, spacing=26, width=3, dash=(200, 600), gap=(5, 20), cut=False, density=lambda x, y: 0.9)
    def box(x0, y0, x1, y1): L.clear(L.rect(x0, y0, x1, y1), chatter=0.1); L.leave(L.rect(x0+12, y0+12, x1-12, y1-12)) if (x1-x0) > 60 and (y1-y0) > 60 else None
    for x in (300, 720): L.clear(L.rect(x, 560, x + 60, 1500), chatter=0.1); L.gouge([(x+30, 600), (x+30, 1460)], 3, 'v', cut=False)
    L.clear(L.rect(260, 500, 820, 600), chatter=0.1)                 # head beam
    L.clear(L.rect(520, 600, 560, 820), chatter=0.05)                 # screw
    for y in range(610, 820, 22): L.gouge([(520, y), (560, y + 10)], 3, 'v', cut=False)
    L.clear(L.rect(400, 820, 680, 900), chatter=0.1)                  # platen
    L.clear(L.rect(240, 1030, 840, 1080), chatter=0.1)               # bed
    L.clear(L.poly([(560, 740), (900, 640), (912, 666), (566, 770)]), chatter=0.05)   # lever
    L.clear(L.disc(910, 652, 22))
    L.clear(L.rect(300, 980, 780, 1030), chatter=0.0)                 # paper on bed
    for k in range(6): L.gouge([(330, 992 + k * 6), (750, 992 + k * 6)], 1.2, 'v', cut=False)
    L.leave(L.rect(330, 1090, 360, 1500)); L.leave(L.rect(720, 1090, 750, 1500))
    carve_text(L, '1853', 540, 300, 150)
    L.stage('press')
    rng = np.random.default_rng(5)
    for i in range(3):
        for j in range(3):
            x, y, a = rng.uniform(150, 930), rng.uniform(1180, 1450), rng.uniform(-0.5, 0.5)
            c, s_ = np.cos(a), np.sin(a); pts = [(x + dx*c - dy*s_, y + dx*s_ + dy*c) for dx, dy in [(-70, -50), (70, -50), (70, 50), (-70, 50)]]
            L.clear(L.poly(pts), chatter=0.0)
            for k in range(5): L.gouge([(x - 50*c - (-30 + k*14)*s_, y - 50*s_ + (-30 + k*14)*c), (x + 50*c - (-30 + k*14)*s_, y + 50*s_ + (-30 + k*14)*c)], 1.2, 'v', cut=False)
        L.stage(f'sheets{i}')
    finish(L, 's03')
def s04():   # George King arrives at the farm
    L, lamp = new(104)
    GX, GY, field = ground_snow(L, 1250, 10)
    sky = [(BX0-10, BY0-10), (BX1+10, BY0-10)] + list(zip(GX[::-1], GY[::-1]))
    L.clear(L.disc(240, 300, 60)); L.moon(240, 300, 60)
    sky_flow(L, L.poly(sky), 0.2, 240, 300)
    for x in np.arange(BX0+10, BX1, 30.0): L.pine(x, np.interp(x, GX, GY) + 8, np.random.default_rng(int(x)+4).uniform(60, 140), snow=0.7, halo=2.0, region=L.poly(sky))
    home = L.cottage(420, 1290, 260, 170, 140, side=240, rise=0.1, windows=[(40, 60, 46, 54), (170, 60, 46, 54)], side_windows=[(60, 56, 46, 54), (150, 56, 46, 54)],
                     door=None, chimney=(0.6, 26, 56), lit=lamp)
    L.smoke(*home['chimney'], rise=220, drift=-200, width=14)
    for x in range(BX0 + 20, BX1, 70):   # fence
        L.leave(L.rect(x, 1420, x + 12, 1500))
    L.leave(L.rect(BX0, 1440, BX1, 1452)); L.leave(L.rect(BX0, 1472, BX1, 1482))
    L.speckle(L.poly(sky), n=250, size=(2, 5), stars=0.02)
    L.stage('dark', blocks=[L.key])
    L.stage('nofig')
    figure(L, 300, 1800, 1.0, bag=False)
    L.stage('fig'); finish(L, 's04')
def s05():   # empty chairs, failed sermon
    L, lamp = new(105)
    L.clear(L.rect(BX0, 1050, BX1, BY1), chatter=0.4)
    for y in range(1080, BY1, 60): L.gouge([(BX0, y), (BX1, y + 8)], 2.4, 'v', cut=False)
    L.clear(L.rect(620, 300, 900, 760), chatter=0.2)                   # window
    L.leave(L.rect(752, 300, 768, 760)); L.leave(L.rect(620, 522, 900, 538))
    L.clear(L.disc(690, 380, 34)); 
    def chair(x, y, s):
        L.leave(L.rect(x - 44*s, y - 120*s, x + 44*s, y)); L.leave(L.rect(x - 52*s, y, x + 52*s, y + 22*s))
        for k in (-1, 0, 1): L.gouge([(x + k*22*s, y - 110*s), (x + k*22*s, y - 10*s)], 3*s, 'v', cut=True)
        L.leave(L.rect(x - 50*s, y + 22*s, x - 40*s, y + 120*s)); L.leave(L.rect(x + 40*s, y + 22*s, x + 50*s, y + 120*s))
    for (y, s, xs) in [(1130, 0.75, [190, 400, 610, 820]), (1300, 0.95, [160, 420, 680, 930])]:
        for x in xs: chair(x, y, s)
    L.stage('room')
    figure(L, 780, 1880, 1.15, bag=False, hat=False, arm_out=True)
    L.leave(L.poly([(BX0, 1700), (520, 1660), (520, BY1), (BX0, BY1)]))         # lectern
    L.clear(L.rect(120, 1620, 420, 1690), chatter=0.0)                           # open book
    L.stage('preach')
    rng = np.random.default_rng(8)
    for k in range(7):
        x, y, a = rng.uniform(150, 950), rng.uniform(1480, 1640), rng.uniform(-0.8, 0.8)
        c, s_ = np.cos(a), np.sin(a); pts = [(x + dx*c - dy*s_, y + dx*s_ + dy*c) for dx, dy in [(-46, -32), (46, -32), (46, 32), (-46, 32)]]
        L.leave(L.poly(pts)); L.clear(L.poly([(x + dx*0.8*c - dy*0.8*s_, y + dx*0.8*s_ + dy*0.8*c) for dx, dy in [(-46, -32), (46, -32), (46, 32), (-46, 32)]]), chatter=0)
    L.stage('papers'); finish(L, 's05')
def s06():   # the fireplace: fireside preacher
    L, lamp = new(106)
    L.clear(L.rect(BX0, 1500, BX1, BY1), chatter=0.4)
    L.hatch(L.rect(BX0, 1500, BX1, BY1), angle=0, spacing=18, width=2.6, dash=(60, 200), gap=(6, 30), cut=False, density=lambda x, y: 0.6)
    L.clear(L.rect(200, 720, 880, 1500), chatter=0.2)                  # stone chimney breast
    for y in range(740, 1500, 60):
        for x in range(200 + (y // 60 % 2) * 60, 880, 120): L.gouge([(x, y), (x + 110, y)], 2.4, 'v', cut=False); L.gouge([(x, y), (x, y + 58)], 2.4, 'v', cut=False)
    L.leave(L.poly([(330, 1500), (330, 1160), (360, 1080), (540, 1040), (720, 1080), (750, 1160), (750, 1500)]))   # firebox
    L.leave(L.rect(150, 690, 930, 740))                                 # mantel
    for i, x in enumerate(range(260, 520, 34)): L.leave(L.rect(x, 600 + (i % 3) * 8, x + 28, 690)); L.gouge([(x + 14, 610 + (i%3)*8), (x + 14, 680)], 2, 'v', cut=True)
    L.clear(L.rect(640, 560, 760, 690), chatter=0.1); L.leave(L.rect(690, 470, 708, 560))   # clock-ish frame / candle
    L.stage('dark', blocks=[L.key])
    flame = [(420, 1500), (440, 1300), (500, 1180), (520, 1260), (560, 1130), (600, 1270), (640, 1200), (680, 1340), (660, 1500)]
    L.clear(L.poly(flame), on=None, chatter=0.0)
    lamp.a  # noqa
    L.leave(L.poly(flame), on=lamp)
    for k in range(9): L.gouge([(450 + k*25, 1490), (470 + k*22, 1260 + (k%3)*40)], 3, 'v', cut=False)
    L.leave(L.disc(700, 455, 16), on=lamp)
    L.stage('fire')
    # rocking chair silhouette, left
    L.leave(L.poly([(60, 1200), (90, 1200), (140, 1560), (110, 1560)])); L.leave(L.rect(60, 1380, 230, 1410))
    L.gouge([(40, 1600), (140, 1650), (260, 1600)], 10, 'v', cut=False)
    L.stage('chair'); finish(L, 's06')
def s07():   # Monday: leaves with the satchel, toward the homes
    L, lamp = new(107)
    GX, GY, field = ground_snow(L, 1150, 10)
    sky = [(BX0-10, BY0-10), (BX1+10, BY0-10)] + list(zip(GX[::-1], GY[::-1]))
    L.clear(L.disc(800, 320, 70)); L.moon(800, 320, 70)
    sky_flow(L, L.poly(sky), 0.22, 800, 320)
    for x in np.arange(BX0+10, BX1, 30.0): L.pine(x, np.interp(x, GX, GY) + 8, np.random.default_rng(int(x)+7).uniform(60, 130), snow=0.7, halo=2.0, region=L.poly(sky))
    h1 = L.cottage(160, 1180, 180, 120, 100, side=150, rise=0.1, windows=[(110, 40, 36, 40)], side_windows=[(50, 40, 36, 40)], door=(30, 50, 80, True), chimney=(0.6, 20, 44), lit=lamp)
    h2 = L.cottage(640, 1170, 140, 96, 80, side=110, rise=0.1, windows=[(40, 34, 30, 34)], side_windows=[(40, 30, 30, 34)], chimney=(0.5, 16, 36), lit=lamp)
    L.smoke(*h1['chimney'], rise=200, drift=-160, width=12); L.smoke(*h2['chimney'], rise=140, drift=-150, width=10)
    path = [(620, BY1), (560, 1600), (420, 1350), (250, 1200)]
    L.footprints(path, step=26, size=7, side=6, start=0.1, stop=0.95)
    L.speckle(L.poly(sky), n=260, size=(2, 5), stars=0.02)
    L.stage('nofig')
    figure(L, 640, 1820, 1.0, bag=True)
    L.stage('fig'); finish(L, 's07')
def s08():   # 62 cents on the table
    L, lamp = new(108)
    for y in range(80, BY1, 44): L.gouge([(BX0, y + 10*np.sin(y)), (BX1, y + 6)], 2.2, 'v', cut=True)   # table grain
    L.leave(L.rect(180, 1100, 360, 1150)); L.leave(L.disc(270, 1080, 70))           # candle holder
    L.clear(L.rect(240, 760, 300, 1060), chatter=0.05); L.leave(L.poly([(270, 650), (300, 720), (270, 760), (240, 720)]), on=lamp)
    L.clear(L.poly([(270, 650), (300, 720), (270, 760), (240, 720)]), chatter=0.0)
    L.leave(L.poly([(270, 650), (300, 720), (270, 760), (240, 720)]), on=lamp)
    L.clear(L.poly([(560, 300), (980, 360), (940, 820), (520, 760)]), chatter=0.2)  # satchel flap open (light)
    L.gouge([(560, 320), (520, 760)], 4, 'v', cut=False); L.gouge([(980, 360), (940, 820)], 4, 'v', cut=False)
    for k in range(6): L.gouge([(600, 420 + k*60), (930, 470 + k*60)], 2, 'v', cut=False)
    L.stage('table')
    rng = np.random.default_rng(62)
    pos = [(470, 1300), (600, 1360), (720, 1290), (540, 1480), (690, 1500), (830, 1420)]
    for i, (x, y) in enumerate(pos):
        r = rng.uniform(44, 64)
        L.clear(L.disc(x, y, r), chatter=0.0); L.rings(x, y, [r * 0.72], width=3, arc=(1.2, 2.4), gap=(0.1, 0.3), cut=False)
        L.stage(f'coin{i}')
    carve_text(L, '62¢', 640, 1720, 170, cut=True)
    L.stage('62'); finish(L, 's08')
def s09():   # the book
    L, lamp = new(109)
    CX, CY = 540, 1000
    rng = np.random.default_rng(9)
    L.stage('blank', blocks=[L.key])
    cover = [(250, 560), (830, 560), (850, 1440), (230, 1440)]
    L.clear(L.poly([(p[0] + (-24 if p[0] < 540 else 24), p[1] + (-24 if p[1] < 1000 else 24)) for p in cover]), chatter=0.1)
    L.leave(L.poly(cover))
    L.clear(L.rect(300, 620, 780, 1380), chatter=0.0); L.leave(L.rect(316, 636, 764, 1364))
    carve_text(L, 'DANIEL', 540, 820, 88); carve_text(L, 'E', 540, 915, 56); carve_text(L, 'APOCALIPSE', 540, 1005, 56)
    L.gouge([(380, 1100), (700, 1100)], 4, 'v', cut=True)
    carve_text(L, 'URIAH SMITH', 540, 1240, 46, style='sans')
    L.stage('book')
    for i in range(3):
        for a in rng.uniform(0, 2*np.pi, 14):
            r0 = 560 if abs(np.sin(a)) > 0.6 else 420
            L.gouge([(CX + np.cos(a)*r0, CY + np.sin(a)*r0*1.25), (CX + np.cos(a)*(r0 + rng.uniform(120, 300)), CY + np.sin(a)*(r0 + rng.uniform(120, 300))*1.25)], rng.uniform(4, 9), 'v', cut=True, taper=(0.0, 0.8))
        L.stage(f'rays{i}')
    finish(L, 's09')
def s10():   # around the world: homes lighting up on the curve of the earth
    L, lamp = new(110)
    PCX, PCY, PR = 540, 2900, 1650
    L.clear(L.disc(PCX, PCY, PR), chatter=0.4)
    L.hatch(L.disc(PCX, PCY, PR), angle=0, spacing=14, width=2.6, dash=(30, 120), gap=(8, 60), cut=False,
            bend=lambda x, y: -0.0, density=lambda x, y: 0.3)
    L.speckle(None, n=500, size=(2, 5), stars=0.04)
    L.stage('earth')
    angs = [-0.42, -0.25, -0.08, 0.1, 0.27, 0.43]
    for i, a in enumerate(angs):
        x = PCX + np.sin(a) * PR; y = PCY - np.cos(a) * PR
        L.cottage(x - 60, y + 6, 110, 70, 60, side=0, rise=0.0, windows=[(36, 24, 28, 30)], chimney=None, lit=lamp)
        L.stage(f'home{i}')
    finish(L, 's10')
def s11():   # final: dawn road, walks on
    L, lamp = new(111)
    GX, GY = line([(BX0-10, 1000), (400, 990), (700, 1006), (BX1+10, 996)])
    field = list(zip(GX, GY)) + [(BX1+10, BY1+10), (BX0-10, BY1+10)]
    L.clear(L.poly(field), chatter=0.5)
    L.hatch(L.poly(field), angle=-6, spacing=12, width=2.6, dash=(10, 60), gap=(6, 30), cut=False, density=lambda x, y: float(np.clip(0.2 + (y-1000)/2000, 0, 0.7)))
    L.clear(L.poly([(330, BY1+10), (750, BY1+10), (548, 1000), (532, 1000)]), chatter=0.2, angle=85)
    L.clear(L.disc(540, 1000, 120), chatter=0.0)          # rising sun half
    L.leave(L.poly(field)) if False else None
    rng = np.random.default_rng(11)
    for a in np.linspace(-np.pi + 0.15, -0.15, 22):
        r1 = rng.uniform(500, 1100)
        L.gouge([(540 + np.cos(a)*150, 1000 + np.sin(a)*150), (540 + np.cos(a)*r1, 1000 + np.sin(a)*r1)], rng.uniform(8, 18), 'v', cut=True, taper=(0.0, 0.85))
    L.leave(L.poly(field))  if False else None
    L.clear(L.poly([(330, BY1+10), (750, BY1+10), (548, 1000), (532, 1000)]), chatter=0.2, angle=85)
    L.stage('nofig')
    figure(L, 540, 1760, 0.95, bag=True)
    L.stage('fig'); finish(L, 's11')
globals()[sys.argv[1]]()
print('done', sys.argv[1])
