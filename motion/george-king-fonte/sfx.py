import numpy as np, wave, subprocess
SR=44100; T=78.4; N=int(SR*T); rng=np.random.default_rng(4)
def wr(name,x):
    y=(np.clip(x,-1,1)*32767).astype(np.int16); y=np.stack([y,y],1)
    w=wave.open(name,'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(y.tobytes()); w.close()
def lp(x,a):
    y=np.empty_like(x); s=0.0; arr=not np.isscalar(a)
    for i in range(len(x)): s+=(a[i] if arr else a)*(x[i]-s); y[i]=s
    return y
hz=lambda m:440*2**((m-69)/12); t=np.arange(N)/SR
# --- music: slow 6/8 folk-hymn feel, warm pads + plucked harp-like arpeggios (D major), soft
mus=np.zeros(N); bpm=72; beat=60/bpm; bar=beat*3
prog=[[50,57,62,66],[47,54,59,62],[43,50,55,59],[45,52,57,61]]  # D, Bm, G, A
for b in range(int(T/bar)+1):
    t0=b*bar; ch=prog[b%4]; i0=int(t0*SR); i1=min(N,i0+int((bar+1.5)*SR))
    if i0>=N: break
    u=np.arange(i1-i0)/SR; env=np.minimum(1,u/0.8)*np.exp(-np.maximum(0,u-bar)/0.6)
    mus[i0:i1]+=0.03*env*sum(np.sin(2*np.pi*hz(m)*u)+0.3*np.sin(2*np.pi*hz(m)*2*u) for m in ch)
    mus[i0:i1]+=0.08*np.sin(2*np.pi*hz(ch[0]-12)*u)*np.minimum(1,u/0.05)*np.exp(-u/2.0)
    arp=[ch[0]+12,ch[1]+12,ch[2]+12,ch[3]+12,ch[2]+12,ch[1]+12]
    for k,m in enumerate(arp):
        a=int((t0+k*beat/2)*SR); L=int(0.9*SR); a1=min(N,a+L)
        if a>=N: break
        v=np.arange(a1-a)/SR
        mus[a:a1]+=0.045*(np.sin(2*np.pi*hz(m)*v)+0.4*np.sin(2*np.pi*2*hz(m)*v)+0.15*np.sin(2*np.pi*3*hz(m)*v))*np.exp(-v/0.35)*np.minimum(1,v/0.003)
mus*=np.minimum(1,t/2.0)*np.clip((T-t)/3.0,0,1)
mus/=np.abs(mus).max()*1.05; wr('music.wav',mus)
# --- sfx
fx=np.zeros(N)
def add(at,x,g):
    a=int(at*SR)
    if 0<=a<N: e=min(N,a+len(x)); fx[a:e]+=g*x[:e-a]
def whoosh(d=0.7):
    n=int(d*SR); u=np.arange(n)/SR; nz=rng.standard_normal(n); y=lp(nz,0.02+0.3*np.sin(np.pi*u/d)**2); y=y-lp(y,0.02)
    return y*np.sin(np.pi*u/d)**2/(np.abs(y).max()+1e-9)
def carve():   # gouge scrape for stage reveals
    n=int(0.35*SR); u=np.arange(n)/SR; nz=rng.standard_normal(n); y=nz-lp(nz,0.3)
    return y*np.exp(-u/0.12)*np.minimum(1,u/0.01)*0.6
def coin():
    u=np.arange(int(0.8*SR))/SR
    return sum(np.sin(2*np.pi*f*u)*np.exp(-u/dd) for f,dd in [(2637,0.25),(3951,0.15),(5274,0.1)])*np.minimum(1,u/0.001)/2
def thud():
    u=np.arange(int(0.4*SR))/SR; f=60+60*np.exp(-u/0.03)
    return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-u/0.1)+0.3*(rng.standard_normal(len(u))*np.exp(-u/0.02))
def paper():
    n=int(0.25*SR); u=np.arange(n)/SR; nz=rng.standard_normal(n); y=nz-lp(nz,0.5)
    return y*np.exp(-u/0.06)*0.5
def step():
    n=int(0.18*SR); u=np.arange(n)/SR; nz=rng.standard_normal(n); y=lp(nz,0.25)
    return y*np.exp(-u/0.05)
def chime():
    u=np.arange(int(1.2*SR))/SR; y=np.zeros(len(u))
    for m,d in [(86,0),(93,0.1),(98,0.2)]:
        a=int(d*SR); v=u[:len(u)-a]; y[a:]+=np.sin(2*np.pi*hz(m)*v)*np.exp(-v/0.4)
    return y/2
W=whoosh(); D=0.4
cuts=[9.88,16.94,23.29,29.34,36.21,47.21,53.08,58.28,64.33,68.63]
starts=[0]+[c+D for c in cuts]
for c in starts[1:]: add(c-0.35,W,0.35)
S=dict(zip(['s01','s02','s03','s04','s05','s06','s07','s08','s09','s10','s11'],starts))
for k in (0.7,1.5,2.3): add(S['s02']+k,chime(),0.12)
for k in (1.6,2.6,3.6): add(S['s03']+k,thud(),0.35); add(S['s03']+k+0.1,paper(),0.25)
add(S['s04']+1.1,chime(),0.1)
add(S['s05']+4.75,paper(),0.4); add(S['s05']+4.85,paper(),0.3)
for i in range(6): add(S['s08']+0.5+0.38*i,coin(),0.18)
add(S['s08']+3.0,chime(),0.14)
add(S['s09']+0.35,thud(),0.3)
for i in range(6): add(S['s10']+0.4+0.42*i,chime(),0.06)
# footsteps
for sc,a,b in (('s01',0.0,9.5),('s04',1.4,3.4),('s07',0.3,5.6),('s11',0.6,8.6)):
    tt=a
    while tt<b: add(S[sc]+tt,step(),0.12); tt+=0.5
# fire crackle during s06
for _ in range(120):
    add(S['s06']+0.9+rng.uniform(0,10),paper()[:int(0.04*SR)],rng.uniform(0.05,0.2))
fx/=max(1,np.abs(fx).max()*1.1); wr('sfx.wav',fx)
subprocess.run(['ffmpeg','-loglevel','error','-y','-i','voz.mp3','-af','adelay=400|400,apad=whole_dur=78.4,atrim=0:78.4','-ac','2','-ar','44100','voice.wav'],check=True)
print('ok')
