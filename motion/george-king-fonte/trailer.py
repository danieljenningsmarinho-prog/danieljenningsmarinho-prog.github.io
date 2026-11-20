import numpy as np, wave
SR=44100; T=78.4; N=int(SR*T); rng=np.random.default_rng(1849)
hz=lambda m:440*2**((m-69)/12)
L=np.zeros(N); R=np.zeros(N)
def put(at,x,g=1.0,pan=0.0):
    a=int(at*SR)
    if a>=N or a+len(x)<=0: return
    s=max(0,-a); e=min(N,a+len(x))
    L[max(a,0):e]+=g*x[s:s+e-max(a,0)]*np.sqrt(0.5*(1-pan)); R[max(a,0):e]+=g*x[s:s+e-max(a,0)]*np.sqrt(0.5*(1+pan))
def fft_lp(x,fc):
    X=np.fft.rfft(x); f=np.fft.rfftfreq(len(x),1/SR); X*=1/(1+(f/fc)**4); return np.fft.irfft(X,len(x))
def fft_hp(x,fc):
    X=np.fft.rfft(x); f=np.fft.rfftfreq(len(x),1/SR); X*=1/(1+(fc/np.maximum(f,1))**4); return np.fft.irfft(X,len(x))
def saw(f,u,n=12): return sum(np.sin(2*np.pi*f*k*u)/k for k in range(1,n+1) if f*k<9000)
# --- instruments
def piano(m,d=2.5):
    u=np.arange(int(d*SR))/SR; f=hz(m)
    y=sum(np.sin(2*np.pi*f*k*u*(1+0.0004*k*k))*np.exp(-u*(1.2+0.9*k))/k**1.2 for k in range(1,7))
    return y*np.minimum(1,u/0.004)
def strings(ms,d,att=1.2,rel=1.0,bright=1800):
    u=np.arange(int((d+rel)*SR))/SR
    y=sum(saw(hz(m)*(1+dt),u,10) for m in ms for dt in (-0.004,-0.0015,0.0015,0.004))
    env=np.minimum(1,u/att)*np.clip((d+rel-u)/rel,0,1)
    return fft_lp(y*env,bright)/(len(ms)*4)
def braam(m,d=3.0):
    u=np.arange(int(d*SR))/SR
    y=sum(saw(hz(mm)*(1+dt),u,14) for mm in (m,m+12,m+19) for dt in (-0.006,0,0.006))
    env=np.minimum(1,u/0.08)*np.exp(-u/1.6)
    out=np.zeros_like(y); seg=int(0.05*SR)
    for i in range(0,len(y),seg):   # opening filter sweep
        fc=300+2200*np.exp(-((i/SR)-0.5)**2/0.6)
        out[i:i+seg]=fft_lp(y[i:i+seg+256],fc)[:len(y[i:i+seg])]
    return out*env/6
def boom(d=3.0):
    u=np.arange(int(d*SR))/SR; f=38+70*np.exp(-u/0.08)
    y=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-u/0.9)
    nz=fft_lp(rng.standard_normal(len(u)),900)*np.exp(-u/0.12)*0.6
    return (y+nz)*np.minimum(1,u/0.002)
def tom(p=1.0):
    u=np.arange(int(0.6*SR))/SR; f=(70+80*np.exp(-u/0.04))*p
    return (np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-u/0.22)+fft_lp(rng.standard_normal(len(u)),2500)*np.exp(-u/0.03)*0.4)
def tick():
    u=np.arange(int(0.05*SR))/SR; return fft_hp(rng.standard_normal(len(u)),4000)*np.exp(-u/0.008)
def riser(d):
    u=np.arange(int(d*SR))/SR; nz=rng.standard_normal(len(u)); out=np.zeros_like(nz); seg=int(0.05*SR)
    for i in range(0,len(nz),seg):
        fc=300+6000*(i/len(nz))**2; out[i:i+seg]=fft_lp(fft_hp(nz[i:i+seg+128],fc*0.5),fc)[:len(nz[i:i+seg])]
    tone=np.sin(2*np.pi*np.cumsum(200+900*(u/d)**2)/SR)*0.25
    return (out+tone)*(u/d)**2
def reverse_swell(d):
    y=strings([50,57,62,65],d,att=0.01,rel=0.01,bright=3000)[:int(d*SR)][::-1]; return y*np.linspace(0,1,len(y))**3
# --- arrangement (scene starts)
S=[0,10.28,17.34,23.69,29.74,36.61,47.61,53.48,58.68,64.73,69.03,78.4]
bar=2.6
def chords_in(t0,t1,prog):
    t=t0;i=0
    while t<t1-0.3:
        yield t,min(bar,t1-t),prog[i%len(prog)]; t+=bar;i+=1
Dm=[50,57,62,65];Bb=[46,53,58,62];F=[41,53,57,60];C=[48,55,60,64];Gm=[43,55,58,62];A=[45,52,57,61]
D=[50,57,62,66];G=[43,55,59,62];Bm=[47,54,59,62];Am=[45,52,57,60]
# A: 0-23.69 mystery: drone + sparse piano ostinato
put(0,strings([38,45],23.7,att=4,rel=2,bright=600),0.5)
for t,d,ch in chords_in(0.0,23.69,[Dm,Bb,F,C]):
    put(t,strings(ch,d,att=1.5,rel=1.2,bright=1200),0.22,-0.3)
    for k,m in enumerate([ch[1]+12,ch[2]+12,ch[3]+12,ch[2]+12]):
        put(t+k*bar/4,piano(m,2.0),0.16,0.3)
put(10.28-0.05,boom(),0.35); put(17.34-0.05,boom(),0.4)
# B: 23.69-36.61 tension: ticking + low strings ostinato + rising cellos, cut at "fracasso"
for t,d,ch in chords_in(23.69,34.4,[Dm,Bb,Gm,A]):
    put(t,strings(ch,d,att=0.8,rel=0.6,bright=1600),0.28)
    for k in range(8): put(t+k*bar/8,strings([ch[0]-12],0.18,att=0.01,rel=0.05,bright=900),0.35)
tt=23.69
while tt<34.4: put(tt,tick(),0.18); tt+=0.325
put(23.69-0.05,braam(38,3.5),0.5)
put(32.4,riser(2.0),0.25)
put(34.45,boom(),0.6); put(34.45,braam(38,2.5),0.45)
# C: 36.61-47.61 warm hope: piano melody + soft strings in F
for t,d,ch in chords_in(36.61,47.4,[F,C,Dm,Bb]):
    put(t,strings(ch,d,att=1.8,rel=1.4,bright=1100),0.2)
    mel=[ch[3]+12,ch[2]+12,ch[1]+12,ch[2]+12,ch[3]+12,ch[3]+14]
    for k,m in enumerate(mel[:4]): put(t+k*bar/4,piano(m,2.4),0.2,0.2)
put(46.1,reverse_swell(1.5),0.4)
# D: 47.61-64.73 build: toms + string ostinato, braams each scene, riser to climax
for t,d,ch in chords_in(47.61,64.6,[Dm,Bb,F,C]):
    put(t,strings(ch,d,att=0.5,rel=0.5,bright=2200),0.3)
    for k in range(8): put(t+k*bar/8,strings([ch[1]+12],0.16,att=0.005,rel=0.05,bright=2600),0.22,(-1)**k*0.4)
tt=47.61;n=0
while tt<64.5:
    dens=(tt-47.61)/17
    put(tt,tom(1.0),0.32+0.2*dens,-0.2)
    if dens>0.35: put(tt+0.325,tom(1.25),0.22+0.2*dens,0.2)
    if dens>0.7: put(tt+0.1625,tom(1.5),0.18,0); put(tt+0.4875,tom(1.5),0.18,0)
    tt+=0.65
for s in (47.61,53.48,58.68): put(s-0.05,braam(38,3.0),0.45); put(s-0.05,boom(),0.45)
put(61.2,riser(3.5),0.4); put(63.2,reverse_swell(1.5),0.5)
# E: 64.73-74 climax in D major: full strings, big hits, toms
for t,d,ch in chords_in(64.73,74.0,[D,G,Bm,A]):
    put(t,strings(ch+[ch[0]+12,ch[2]+12],d,att=0.15,rel=0.9,bright=3400),0.45)
    put(t,strings([ch[0]-12,ch[0]-24],d,att=0.1,rel=0.8,bright=500),0.4)
    put(t,piano(ch[3]+12,2.4),0.25); put(t+bar/2,piano(ch[2]+24,2.0),0.2)
    for k in range(4): put(t+k*bar/4,tom(1.0),0.35)
put(64.73-0.05,boom(4),0.7); put(64.73-0.05,braam(38,4.0),0.55); put(69.03-0.05,boom(4),0.6)
# outro 74-78.4: resolve on D, piano and long decay
put(74.0,strings(D+[74],3.8,att=0.6,rel=0.6,bright=1500),0.35)
for k,m in enumerate([74,69,66,62]): put(74.0+k*0.65,piano(m,3.0),0.22)
put(76.6,boom(1.8),0.3)
# --- reverb (stereo FFT convolution)
ir_len=int(2.4*SR); u=np.arange(ir_len)/SR
def ir(seed): r=np.random.default_rng(seed).standard_normal(ir_len)*np.exp(-u/0.55); r[0]=0; return fft_lp(r,5000)/np.sqrt(ir_len)*3
def conv(x,h):
    n=1<<int(np.ceil(np.log2(len(x)+len(h)))); return np.fft.irfft(np.fft.rfft(x,n)*np.fft.rfft(h,n),n)[:len(x)]
Lw=L+0.35*conv(L,ir(1)); Rw=R+0.35*conv(R,ir(2))
fade=np.clip((T-np.arange(N)/SR)/1.2,0,1); fin=np.minimum(1,np.arange(N)/SR/1.0)
Lw*=fade*fin; Rw*=fade*fin
pk=max(np.abs(Lw).max(),np.abs(Rw).max())*1.05; Lw/=pk; Rw/=pk
y=(np.stack([Lw,Rw],1)*32767).astype(np.int16)
w=wave.open('trailer.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(y.tobytes()); w.close()
print('ok')
