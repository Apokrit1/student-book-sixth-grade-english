import numpy as np, subprocess, scipy.signal as ss
SR=44100; DUR=50.0; N=int(SR*DUR)
rng=np.random.default_rng(7)
L=np.zeros(N); R=np.zeros(N)
BEAT=0.5

def add(sig,t,gain=1.0,pan=0.0):
    i=int(t*SR); j=min(N,i+len(sig))
    if i>=N: return
    s=sig[:j-i]*gain
    L[i:j]+=s*np.sqrt((1-pan)/2)*1.414; R[i:j]+=s*np.sqrt((1+pan)/2)*1.414
def tt(d): return np.arange(int(d*SR))/SR
def hz(n): return 440*2**((n-69)/12)
def lp(x,fc): b,a=ss.butter(2,fc/(SR/2),'low'); return ss.lfilter(b,a,x)
def hp(x,fc): b,a=ss.butter(2,fc/(SR/2),'high'); return ss.lfilter(b,a,x)
def bp(x,f1,f2): b,a=ss.butter(2,[f1/(SR/2),f2/(SR/2)],'band'); return ss.lfilter(b,a,x)

def kick(g=1):
    t=tt(.45); f=45+110*np.exp(-t*28); ph=2*np.pi*np.cumsum(f)/SR
    s=np.sin(ph)*np.exp(-t*7); s[:200]+=rng.normal(0,.3,200)*np.linspace(1,0,200)
    return np.tanh(s*1.6)*g
def clap():
    t=tt(.25); n=rng.normal(0,1,len(t)); env=np.exp(-t*22)
    for d in (0.0,.012,.024): env+=np.where(t>=d,np.exp(-(t-d)*120),0)*.6
    return bp(n,900,4000)*env*.5
def hat(d=.05,g=.25):
    t=tt(d); return hp(rng.normal(0,1,len(t)),7000)*np.exp(-t*(60 if d<.1 else 14))*g
def saw(f,t): return 2*((f*t)%1)-1
def pluck(note,d=.35,g=.22):
    t=tt(d); f=hz(note)
    s=(saw(f,t)+.5*saw(f*1.005,t))*np.exp(-t*9)
    return lp(s,2400)*g
def bell(note,d=2.5,g=.25):
    t=tt(d); f=hz(note)
    s=np.sin(2*np.pi*f*t)+.4*np.sin(2*np.pi*f*2.01*t)*np.exp(-t*3)+.2*np.sin(2*np.pi*f*3.98*t)*np.exp(-t*5)
    return s*np.exp(-t*2.2)*g
def pad(notes,d,g=.08):
    t=tt(d); s=np.zeros(len(t))
    for n in notes:
        for det in (-.12,0,.12): s+=saw(hz(n+det),t+rng.random())
    s=lp(s,1400); att=np.minimum(1,t/.6); rel=np.minimum(1,(d-t)/.6)
    return s*att*rel*g/len(notes)
def bassnote(note,d=.24,g=.32):
    t=tt(d); f=hz(note); s=saw(f,t)+np.sin(2*np.pi*f*t)
    return np.tanh(lp(s,420)*1.4)*np.minimum(1,(d-t)/.03)*g
def noise_sweep(d,f0,f1,g=.3,rise=True):
    t=tt(d); n=rng.normal(0,1,len(t)); out=np.zeros(len(t)); blk=1024
    for k in range(0,len(t),blk):
        x=k/len(t); fc=f0*(f1/f0)**x
        seg=n[k:k+blk]; out[k:k+blk]=bp(np.concatenate([np.zeros(256),seg]),max(40,fc*.6),min(20000,fc*1.4))[256:]
    env=(t/d)**2 if rise else np.exp(-t*5)
    return out*env*g
def whoosh(d=.5,g=.35):
    t=tt(d); n=rng.normal(0,1,len(t)); env=np.sin(np.pi*t/d)**2
    return bp(n,500,6000)*env*g
def impact(g=1):
    t=tt(2.5); boom=np.sin(2*np.pi*(38+60*np.exp(-t*10))*t)*np.exp(-t*2.2)
    crash=hp(rng.normal(0,1,len(t)),3000)*np.exp(-t*2.5)*.35
    return (np.tanh(boom*1.8)+crash)*g
def tick(g=.25):
    t=tt(.03); return hp(rng.normal(0,1,len(t)),3000)*np.exp(-t*200)*g + np.sin(2*np.pi*2400*t)*np.exp(-t*300)*g
def swish(g=.18):
    t=tt(.18); n=rng.normal(0,1,len(t)); return bp(n,1500,7000)*np.sin(np.pi*t/.18)*g

# chords: Am F C G  (MIDI)
CH=[(57,[69,72,76,81],45),(53,[65,69,72,77],41),(48,[64,67,72,76],48),(55,[67,71,74,79],43)]
def chord_at(t): return CH[int(t//2)%4]

# --- 0-4 intro ---
for b in range(8): add(tick(.22 if b%2==0 else .14),b*BEAT,pan=.2)
add(bell(69,3),0,.5); add(bell(76,3),0,.3); add(bell(72,3),0.02,.3)
add(pad([57,60,64],4.2,.1),0)
add(bell(64,3),2.0,.45); add(bell(69,3),2.0,.35); add(impact(.25),2.05)
# --- 4-8 pages ---
for b in range(8): add(kick(.55),4+b*BEAT)
for i in range(11): add(swish(),4+0.25*i,pan=(rng.random()-.5))
for s in range(0,4):
    t0=4+s; root,arp,bs=chord_at(t0-4)
    add(pad([n-12 for n in arp[:3]],1.05,.09),t0)
    add(bassnote(bs,.9,.22),t0)
    add(pluck(arp[3],.6,.2),t0,pan=-.2)
# --- 8-10 breath ---
add(pad([57,60,64],2.2,.08),8)
add(kick(.7),8); add(kick(.45),8.25); add(kick(.7),9); add(kick(.45),9.25)
add(bell(81,2),9,.2)
# --- 10-12 riser + snare roll ---
add(noise_sweep(2,300,9000,.45),10)
t=tt(2); add(np.sin(2*np.pi*np.cumsum(110*2**(2*t/2))/SR)*(t/2)**2*.18,10)
k=10.0
while k<11.85:
    step=.25 if k<10.5 else (.125 if k<11.25 else .0625)
    add(clap()*(.3+.5*(k-10)/2),k); k+=step
# --- groove helper ---
def groove(a,b,full=True,duck=None):
    t=a
    while t<b-1e-6:
        beat=int(round((t-a)/BEAT))
        add(kick(.9),t)
        if beat%2==1: add(clap(),t,.9)
        add(hat(.15,.12),t+BEAT/2,pan=.3)
        for q in (0,.125,.25,.375): add(hat(.03,.06),t+q,pan=-.3)
        root,arp,bs=chord_at(t)
        add(bassnote(bs,.2,.3),t+.25); add(bassnote(bs+12 if beat%4==3 else bs,.2,.24),t+.125*3)
        if full:
            for q in range(4): add(pluck(arp[(beat*4+q)%4]+12*(q==3 and beat%2),.3,.13),t+q*.125,pan=(-.35 if q%2 else .35))
        if beat%4==0: add(pad([n-12 for n in arp[:3]],2.05,.07),t)
        t+=BEAT
# --- 12 drop ---
add(impact(1.0),12)
groove(12,28)
# words 28-34: groove w/out plucks (voices on top)
groove(28,34,full=False)
for i in range(8): add(swish(.14),32+i*.25)
add(whoosh(.5,.3),27.75); add(whoosh(.5,.3),33.75)
groove(34,36)
# --- 36-40 breakdown ---
add(whoosh(.6,.3),35.7)
add(pad([57,60,64,69],4.1,.11),36)
for i,t0 in enumerate((36,37,38)): add(impact(.45),t0); add(bell(69+[0,3,7][i],1.5),t0,.25)
add(bell(76,3),39,.35); add(bell(72,3),39,.25); add(bell(69,3),39,.3)
for q in range(8): add(pluck([69,72,76,81][q%4],.3,.08),39+q*.125)
add(noise_sweep(1,500,9000,.3),39)
# --- 40-44 ---
add(impact(.7),40)
groove(40,44)
add(whoosh(.5,.3),43.75)
# --- 44 end ---
add(impact(1.0),44)
add(pad([57,60,64,69],6,.12),44)
add(bell(69,5),44,.45); add(bell(76,5),44,.3); add(bell(72,5),44.01,.3); add(bell(81,5),44.5,.2)
add(bassnote(45,3,.25),44)
for b in range(4): add(tick(.12),46+b*BEAT)

music=np.stack([L,R],1)
# reverb
ir_t=tt(1.8); ir=rng.normal(0,1,(len(ir_t),2))*np.exp(-ir_t*3.2)[:,None]; ir[:,0]=lp(ir[:,0],5000); ir[:,1]=lp(ir[:,1],5000)
wet=np.stack([ss.fftconvolve(music[:,c],ir[:,c])[:N] for c in range(2)],1)
music=music+wet*0.035

# voices
def load(path,start=None,dur=None,trim=True):
    cmd=['ffmpeg','-v','error']+(['-ss',str(start)] if start is not None else [])+['-i',path]+(['-t',str(dur)] if dur else [])
    af='silenceremove=start_periods=1:start_threshold=-40dB' if trim else 'anull'
    cmd+=['-af',af,'-ac','1','-ar',str(SR),'-f','f32le','-']
    return np.frombuffer(subprocess.run(cmd,capture_output=True).stdout,dtype=np.float32).astype(float)
A='/home/claude/site/unit1/assets/'
voice=np.zeros(N); duck=np.ones(N)
def vadd(sig,t,g=1.0):
    i=int(t*SR); j=min(N,i+len(sig)); voice[i:j]+=sig[:j-i]*g
    a=max(0,i-int(.08*SR)); duck[a:j+int(.15*SR)]=np.minimum(duck[a:j+int(.15*SR)],.38)
vadd(load(A+'audio_v2/stories/ukraine_full_story.mp3',0,3.62),14.35,1.0)
vadd(load(A+'audio_v2/grammar/school_lab_overview.mp3',0.15,2.1),18.1,1.0)
for i,(n,t0) in enumerate([('06',28.02),('26',29.02),('13',30.02),('09',31.02)]):
    vadd(load(A+f'audio_neural/words/{n}_word.mp3'),t0,1.1)
duck=ss.lfilter([1-0.9993],[1,-0.9993],duck)  # smooth
voice=voice/ (np.abs(voice).max()+1e-9)*0.85
out=music*duck[:,None]*1.0
out=out/np.abs(out).max()*0.7 + voice[:,None]*0.95
# fade end
f=np.ones(N); fi=int(48.6*SR); f[fi:]=np.linspace(1,0,N-fi); out*=f[:,None]
out=np.tanh(out*1.1)/np.tanh(1.1)
out=out/np.abs(out).max()*0.93
import wave
pcm=(out*32767).astype(np.int16)
with wave.open('/home/claude/work/soundtrack.wav','wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok')
