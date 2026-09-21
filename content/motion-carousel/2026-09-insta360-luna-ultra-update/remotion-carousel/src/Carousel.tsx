import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, Sequence, interpolate, Easing, spring, staticFile, useCurrentFrame, useVideoConfig, delayRender, continueRender} from 'remotion';
import project from './project.json';
import {FONT_CSS} from './fonts.generated';

const P: any = project;
const B = P.brand;
const CW = 936, CH = 800, CX = 72, CY = 340;              // media card geometry
const EO = Easing.out(Easing.cubic), EIO = Easing.inOut(Easing.cubic);
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const ip = (f: number, a: number, b: number, o = 0, p = 1, e = EO) => interpolate(f, [a, b], [o, p], {...clamp, easing: e});

/* ---------- fonts (self-hosted, brand faces) ---------- */
const Fonts: React.FC = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    const css = FONT_CSS.split('__F__').join(staticFile('fonts'));
    let el = document.getElementById('att-fonts') as HTMLStyleElement | null;
    if (!el) { el = document.createElement('style'); el.id = 'att-fonts'; el.textContent = css; document.head.appendChild(el); }
    const faces = ['400 40px "Readex Pro"', '500 40px "Readex Pro"', '700 40px "Readex Pro"', '700 40px "Montserrat"', '800 40px "Montserrat"', '500 40px "JetBrains Mono"'];
    Promise.all(faces.map((f) => (document as any).fonts.load(f, 'أبجد Aa 15×'))).then(() => continueRender(h)).catch(() => continueRender(h));
  }, [h]);
  return null;
};

/* ---------- shared chrome ---------- */
const AMark: React.FC<{size: number; color: string}> = ({size, color}) => (
  <svg viewBox="0 0 220.64 180" width={size * 1.2258} height={size} style={{display: 'block'}}>
    <path d="M 139.96 0.1 L 98.09 0 L 0 179.9 L 40.87 180 L 118.57 37.49 L 161.89 121.04 L 101.29 120.89 L 69.49 179.21 L 108.07 179.31 L 121.08 155.45 L 220.64 155.69 Z" fill={color}/>
  </svg>
);
const Heart: React.FC<{size: number}> = ({size}) => (
  <svg viewBox="0 0 24 24" width={size} height={size} style={{display: 'block'}}><path fill={B.accent} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
);
const Reveal: React.FC<{from: number; dur?: number; dy?: number; children: React.ReactNode; style?: React.CSSProperties; out?: number}> = ({from, dur = 16, dy = 26, children, style, out}) => {
  const f = useCurrentFrame();
  let o = ip(f, from, from + dur), y = (1 - o) * dy;
  if (out !== undefined) { const oo = ip(f, out, out + 12); o *= 1 - oo; y -= oo * 18; }
  return <div style={{opacity: o, transform: `translateY(${y}px)`, ...style}}>{children}</div>;
};
const Index: React.FC<{n: number}> = ({n}) => (
  <Reveal from={4} dy={0} style={{position: 'absolute', left: 72, top: 282, fontFamily: B.font_mono, fontWeight: 500, fontSize: 26, color: B.muted, letterSpacing: 1}}>
    {String(n).padStart(2, '0')} / {String(P.slides.length).padStart(2, '0')}
  </Reveal>
);
const Pill: React.FC<{children: React.ReactNode; style?: React.CSSProperties; tone?: 'blue' | 'glass' | 'mint' | 'white'; size?: number}> = ({children, style, tone = 'blue', size = 24}) => {
  const bg = tone === 'blue' ? 'rgba(37,99,235,.22)' : tone === 'mint' ? 'rgba(45,212,168,.16)' : tone === 'white' ? 'rgba(255,255,255,.92)' : 'rgba(14,16,19,.55)';
  const bd = tone === 'blue' ? 'rgba(96,150,255,.55)' : tone === 'mint' ? 'rgba(45,212,168,.55)' : tone === 'white' ? 'rgba(255,255,255,.9)' : 'rgba(255,255,255,.18)';
  const fg = tone === 'white' ? B.bg : tone === 'mint' ? B.mint : B.ice;
  return <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, padding: `${size * 0.42}px ${size * 0.8}px`, borderRadius: 999, background: bg, border: `1.5px solid ${bd}`, color: fg, fontSize: size, lineHeight: 1.2, fontFamily: B.font_ar, fontWeight: 500, backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', whiteSpace: 'nowrap', ...style}}>{children}</div>;
};
const Eyebrow: React.FC<{text: string; latin?: boolean}> = ({text, latin}) => (
  <Reveal from={6} dy={-14} style={{position: 'absolute', right: 72, top: 270}}>
    <Pill tone={latin ? 'glass' : 'blue'} style={{fontFamily: latin ? B.font_latin : B.font_ar, fontWeight: latin ? 700 : 500, letterSpacing: latin ? 0.5 : 0, direction: 'rtl'}}>
      {!latin && <span style={{width: 10, height: 10, borderRadius: 5, background: B.mint, boxShadow: `0 0 12px ${B.mint}`}}/>}{text}
    </Pill>
  </Reveal>
);
const Signature: React.FC = () => (
  <Reveal from={10} dy={0} style={{position: 'absolute', left: 72, top: 1436, display: 'flex', alignItems: 'center', gap: 14, direction: 'ltr'}}>
    <AMark size={32} color="#FFFFFF"/><span style={{fontFamily: B.font_ar, fontWeight: 500, fontSize: 26, color: B.muted}}>{B.handle}</span>
  </Reveal>
);
const isLatin = (s: string) => /^[A-Za-z0-9]/.test(s.trim());
const hasArabic = (s: string) => /[\u0600-\u06FF]/.test(s);
const TextBlock: React.FC<{headline: string; sub?: string; from?: number; out?: number}> = ({headline, sub, from = 10, out}) => {
  const latin = isLatin(headline);
  return <div style={{position: 'absolute', left: 72, width: 756, bottom: 1920 - 1406, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end', textAlign: 'right'}}>
    <Reveal from={from} out={out} style={{direction: hasArabic(headline) ? 'rtl' : 'ltr', fontFamily: latin ? B.font_latin : B.font_ar, fontWeight: latin ? 800 : 700, fontSize: latin ? 60 : (headline.length > 20 ? 54 : 64), lineHeight: 1.22, color: B.ink, letterSpacing: latin ? -0.5 : 0}}>{headline}</Reveal>
    {sub && <Reveal from={from + 8} out={out !== undefined ? out + 3 : undefined} style={{direction: 'rtl', marginTop: 14, fontFamily: B.font_ar, fontWeight: 400, fontSize: 34, lineHeight: 1.5, color: B.ice, opacity: 0.92}}>{sub}</Reveal>}
  </div>;
};
const Card: React.FC<{children: React.ReactNode; bg?: string}> = ({children, bg}) => {
  const f = useCurrentFrame(); const o = ip(f, 0, 14); const s = ip(f, 0, 22, 0.965, 1);
  return <div style={{position: 'absolute', left: CX, top: CY, width: CW, height: CH, borderRadius: 32, overflow: 'hidden', background: bg || B.raised, border: '1px solid rgba(255,255,255,.08)', boxShadow: '0 30px 80px rgba(0,0,0,.55)', opacity: o, transform: `scale(${s})`}}>{children}</div>;
};
/* cover-fit photo with an editable crop region, extra zoom and a pinned anchor point */
type Crop = {x: number; y: number; w: number; h: number};
const Photo: React.FC<{src: string; iw: number; ih: number; crop: Crop; zoom?: number; anchor?: {x: number; y: number}; tx?: number; ty?: number; style?: React.CSSProperties}> = ({src, iw, ih, crop, zoom = 1, anchor, tx = 0, ty = 0, style}) => {
  const s0 = Math.max(CW / crop.w, CH / crop.h); const s = s0 * zoom;
  const ax = anchor ? anchor.x : crop.x + crop.w / 2, ay = anchor ? anchor.y : crop.y + crop.h / 2;   // image point kept fixed
  const px = anchor ? (ax - crop.x) * s0 + (CW - crop.w * s0) / 2 : CW / 2, py = anchor ? (ay - crop.y) * s0 + (CH - crop.h * s0) / 2 : CH / 2; // its card position at zoom 1
  const left = px - ax * s + tx, top = py - ay * s + ty;
  return <Img src={staticFile(src)} style={{position: 'absolute', left, top, width: iw * s, height: ih * s, ...style}}/>;
};
const Grad: React.FC<{strength?: number}> = ({strength = 0.7}) => <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(14,16,19,0) 55%, rgba(14,16,19,${strength}) 100%)`}}/>;

/* ---------- scene 1 · hook / update found ---------- */
const Hook: React.FC<{s: any}> = ({s}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const zoom = ip(f, 0, 180, 1.0, 1.1, Easing.linear);
  const cardIn = spring({frame: f - 34, fps, config: {damping: 18, stiffness: 120}});
  const prog = ip(f, 52, 124, 0, 1, EIO); const done = f > 128;
  const dotIn = spring({frame: f - 128, fps, config: {damping: 12, stiffness: 200}});
  return <>
    <Card>
      <Photo src={s.media} iw={1320} ih={1679} crop={{x: 250, y: 620, w: 820, h: 620}} zoom={zoom}/>
      <Grad strength={0.55}/>
      <div style={{position: 'absolute', left: 32, bottom: 32, width: 560, padding: '22px 26px', borderRadius: 22, background: 'rgba(14,16,19,.62)', border: '1px solid rgba(255,255,255,.16)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', opacity: cardIn, transform: `translateY(${(1 - cardIn) * 40}px)`, direction: 'ltr'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={{width: 48, height: 48, borderRadius: 24, background: done ? B.mint : B.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'none'}}>
            {done ? <svg viewBox="0 0 24 24" width={26} height={26} style={{transform: `scale(${dotIn})`}}><path d="M5 12.5l4.2 4.2L19 7.5" fill="none" stroke={B.bg} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : <svg viewBox="0 0 24 24" width={26} height={26}><path d="M12 4v12M6 10l6 6 6-6" fill="none" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
          <div>
            <div style={{fontFamily: B.font_latin, fontWeight: 700, fontSize: 26, color: '#fff'}}>{done ? 'Update installed' : 'Update available'}</div>
            <div style={{fontFamily: B.font_ar, fontWeight: 400, fontSize: 21, color: B.muted, marginTop: 2}}>Insta360 Luna Ultra · Firmware</div>
          </div>
        </div>
        <div style={{marginTop: 18, height: 8, borderRadius: 4, background: 'rgba(255,255,255,.12)', overflow: 'hidden'}}>
          <div style={{width: `${prog * 100}%`, height: '100%', background: done ? B.mint : B.accent, borderRadius: 4}}/>
        </div>
      </div>
    </Card>
    <Eyebrow text={s.eyebrow} latin/>
    <TextBlock headline={s.headline} sub={s.sub} from={14}/>
  </>;
};

/* ---------- scene 2 · 15× zoom ---------- */
const Zoom: React.FC<{s: any}> = ({s}) => {
  const f = useCurrentFrame();
  const t = ip(f, 34, 118, 0, 1, EIO);
  const zoom = interpolate(t, [0, 1], [1.55, 1.12]);
  const ax = interpolate(t, [0, 1], [330, 990]);          // pan from the 1× half to the 15× half
  const v = interpolate(t, [0, 1], [1, 15]);
  const label = t < 0.03 ? '1×' : `${Math.round(v)}×`;
  const glow = ip(f, 112, 126);
  return <>
    <Card>
      <Photo src={s.media} iw={1320} ih={1675} crop={{x: 0, y: 545, w: 1320, h: 1130}} zoom={zoom} anchor={{x: ax, y: 545 + 565}}/>
      <Grad strength={0.5}/>
      <div style={{position: 'absolute', left: 32, top: 32}}>
        <Pill tone="glass" size={30} style={{fontFamily: B.font_mono, fontWeight: 500, letterSpacing: 1, boxShadow: glow ? `0 0 ${34 * glow}px rgba(37,99,235,${0.9 * glow})` : 'none', borderColor: glow ? `rgba(96,150,255,${0.3 + 0.6 * glow})` : undefined}}>{label}</Pill>
      </div>
      <div style={{position: 'absolute', right: 32, top: 40, opacity: ip(f, 20, 34) * (1 - ip(f, 100, 112))}}><Pill tone="glass" size={22}>HighRes Zoom</Pill></div>
    </Card>
    <Eyebrow text={B.update_tag}/>
    <TextBlock headline={s.headline} sub={s.sub}/>
  </>;
};

/* ---------- scene 3 · stage mode → AI stage footage ---------- */
const Stage: React.FC<{s: any}> = ({s}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const T = 84; // transition frame
  const zoomA = ip(f, 0, T + 30, 1.0, 1.08, Easing.linear);
  const zoomB = ip(f, T, 210, 1.0, 1.1, Easing.linear);
  const r = ip(f, T, T + 34, 0, 1300, EIO);
  const pulse = (k: number) => { const q = ((f - 18 - k * 26) % 70) / 70; return f < T && q >= 0 && q < 1 ? q : -1; };
  const cx = 468, cy = 296;
  return <>
    <Card>
      <Photo src={s.media} iw={1320} ih={1665} crop={{x: 0, y: 600, w: 1320, h: 1065}} zoom={zoomA}/>
      <Grad strength={0.45}/>
      {[0, 1].map((k) => { const q = pulse(k); return q < 0 ? null : <div key={k} style={{position: 'absolute', left: cx - 118, top: cy - 118, width: 236, height: 236, borderRadius: 118, border: `3px solid ${B.ice}`, opacity: (1 - q) * 0.8, transform: `scale(${1 + q * 0.45})`}}/>; })}
      <div style={{position: 'absolute', left: cx - 160, top: cy - 200, width: 320, display: 'flex', justifyContent: 'center', opacity: ip(f, 22, 36) * (1 - ip(f, T - 6, T + 6)), transform: `translateY(${(1 - ip(f, 22, 36)) * 12}px)`}}>
        <Pill tone="white" size={24} style={{fontFamily: B.font_latin, fontWeight: 700}}>Stage Mode</Pill>
      </div>
      <div style={{position: 'absolute', inset: 0, clipPath: `circle(${r}px at ${cx}px ${cy}px)`}}>
        <Photo src={s.media_b} iw={1320} ih={1651} crop={{x: 0, y: 130, w: 1320, h: 880}} zoom={zoomB}/>
        <Grad strength={0.5}/>
        <div style={{position: 'absolute', left: 32, top: 32, opacity: ip(f, T + 30, T + 44)}}><Pill tone="mint" size={22}><span style={{width: 10, height: 10, borderRadius: 5, background: B.mint, boxShadow: `0 0 12px ${B.mint}`}}/>AI-Enhanced</Pill></div>
      </div>
    </Card>
    <Eyebrow text={B.update_tag}/>
    {f < T + 8 && <TextBlock headline={s.headline} sub={s.sub} out={T - 8}/>}
    {f >= T + 8 && <TextBlock headline={s.headline_b} sub={s.sub_b} from={T + 10}/>}
  </>;
};

/* ---------- scene 4 · active zoom tracking ---------- */
const Tracking: React.FC<{s: any}> = ({s}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const k = ip(f, 42, 150, 1, 1.5, EIO);                     // visual zoom
  const lock = spring({frame: f - 12, fps, config: {damping: 16, stiffness: 110}});
  const bw = 220 * k, bh = 400 * k; const bx = 468, by = 360;
  const boxScale = interpolate(lock, [0, 1], [1.7, 1]);
  const zv = interpolate(k, [1, 1.5], [1, 6]); const label = `${zv < 1.05 ? '1' : zv > 5.9 ? '6' : zv.toFixed(1)}×`;
  const corner = (rot: number, x: number, y: number) => <div key={rot} style={{position: 'absolute', left: x, top: y, width: 34, height: 34, borderLeft: `4px solid ${B.mint}`, borderTop: `4px solid ${B.mint}`, borderRadius: '6px 0 0 0', transform: `rotate(${rot}deg)`, transformOrigin: '50% 50%'}}/>;
  return <>
    <Card>
      <Photo src={s.media} iw={1320} ih={1651} crop={{x: 0, y: 130, w: 1320, h: 880}} zoom={k} anchor={{x: 660, y: 430}}/>
      <Grad strength={0.5}/>
      <div style={{position: 'absolute', left: bx - bw / 2, top: by - bh / 2, width: bw, height: bh, opacity: lock, transform: `scale(${boxScale})`, filter: `drop-shadow(0 0 10px rgba(45,212,168,.55))`}}>
        {corner(0, -2, -2)}{corner(90, bw - 32, -2)}{corner(180, bw - 32, bh - 32)}{corner(270, -2, bh - 32)}
        <div style={{position: 'absolute', left: bw / 2 - 5, top: bh / 2 - 5, width: 10, height: 10, borderRadius: 5, background: B.mint, opacity: 0.9}}/>
        <div style={{position: 'absolute', left: 0, top: -54, display: 'flex', gap: 10, alignItems: 'center', direction: 'ltr'}}>
          <Pill tone="mint" size={20} style={{fontFamily: B.font_mono, fontWeight: 500, padding: '6px 12px'}}><span style={{width: 8, height: 8, borderRadius: 4, background: B.mint, opacity: 0.55 + 0.45 * Math.abs(Math.sin(f / 6))}}/>TRACKING</Pill>
          <Pill tone="glass" size={20} style={{fontFamily: B.font_mono, fontWeight: 500, padding: '6px 12px'}}>{label}</Pill>
        </div>
      </div>
    </Card>
    <Eyebrow text={B.update_tag}/>
    <TextBlock headline={s.headline} sub={s.sub}/>
  </>;
};

/* ---------- scene 5 · live frame snapshots ---------- */
const Snapshot: React.FC<{s: any}> = ({s}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const zoom = ip(f, 0, 180, 1.0, 1.06, Easing.linear);
  const CY0 = 125; const s0 = Math.max(CW / 1320, CH / (1000 - CY0)); const offX = (CW - 1320 * s0) / 2;
  const inset = {x: 760 * s0 + offX, y: (130 - CY0) * s0, w: 455 * s0, h: 255 * s0};        // official inset region in card coords
  const flash = ip(f, 44, 46) * (1 - ip(f, 46, 60));
  const frameIn = ip(f, 40, 52);
  const lift = spring({frame: f - 58, fps, config: {damping: 15, stiffness: 90}});
  const sc = 1 + 0.16 * lift, dy = -26 * lift, dx = -18 * lift;
  return <>
    <Card>
      <Photo src={s.media} iw={1320} ih={1640} crop={{x: 0, y: CY0, w: 1320, h: 1000 - CY0}} zoom={zoom}/>
      <Grad strength={0.55}/>
      <div style={{position: 'absolute', left: 32, top: 32, display: 'flex', alignItems: 'center', gap: 10, opacity: ip(f, 10, 22)}}>
        <Pill tone="glass" size={20} style={{fontFamily: B.font_mono, fontWeight: 500, padding: '6px 12px'}}><span style={{width: 10, height: 10, borderRadius: 5, background: '#FF3B30', opacity: f % 30 < 18 ? 1 : 0.25}}/>REC 00:03</Pill>
      </div>
      {/* captured frame: a copy of the live preview lifts off as a photo card */}
      <div style={{position: 'absolute', left: inset.x, top: inset.y, width: inset.w, height: inset.h, borderRadius: 16, overflow: 'hidden', border: `3px solid rgba(255,255,255,${0.35 + 0.65 * frameIn})`, boxShadow: `0 ${20 * lift}px ${50 * lift}px rgba(0,0,0,${0.6 * lift})`, opacity: frameIn, transform: `translate(${dx}px,${dy}px) scale(${sc})`, transformOrigin: '50% 50%'}}>
        <Img src={staticFile(s.media)} style={{position: 'absolute', left: -inset.x + offX, top: -inset.y - CY0 * s0, width: 1320 * s0, height: 1640 * s0}}/>
        <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: flash}}/>
      </div>
      <div style={{position: 'absolute', left: inset.x + inset.w / 2 - 90, top: inset.y + inset.h + 22, opacity: ip(f, 70, 84), transform: `translateY(${(1 - ip(f, 70, 84)) * 10}px)`}}>
        <Pill tone="white" size={22} style={{fontFamily: B.font_latin, fontWeight: 700}}>Photo saved</Pill>
      </div>
      <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: flash * 0.5, pointerEvents: 'none'}}/>
    </Card>
    <Eyebrow text={B.update_tag}/>
    <TextBlock headline={s.headline} sub={s.sub}/>
  </>;
};

/* ---------- scene 6 · pro audio modes → CTA ---------- */
const Wave: React.FC<{n: number; f: number; kind: 'stage' | 'ambient'; color: string; h: number}> = ({n, f, kind, color, h}) => {
  const bars = Array.from({length: n}, (_, i) => {
    const c = Math.abs(i - (n - 1) / 2) / ((n - 1) / 2);
    const a = kind === 'stage' ? Math.pow(Math.abs(Math.sin(f / 5.5 + i * 0.9)), 0.7) * (1 - c * 0.75) : (0.45 + 0.35 * Math.sin(f / 9 + i * 0.5) * Math.cos(f / 23 + i * 0.2)) * (1 - c * 0.3);
    return Math.max(0.08, a);
  });
  return <div style={{display: 'flex', alignItems: 'center', gap: 6, height: h}}>{bars.map((a, i) => <div key={i} style={{width: 8, height: Math.max(6, a * h), borderRadius: 4, background: color, opacity: 0.5 + 0.5 * a}}/>)}</div>;
};
const AudioCta: React.FC<{s: any}> = ({s}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const T = 104;
  const wipe = ip(f, T, T + 26, 0, 1, EIO);
  const panel = (title: string, sub: string, kind: 'stage' | 'ambient', i: number) => {
    const inn = spring({frame: f - 10 - i * 8, fps, config: {damping: 16, stiffness: 100}});
    return <div style={{position: 'absolute', left: 32 + i * 452, top: 32, width: 420, height: 736, borderRadius: 24, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.1)', padding: 28, boxSizing: 'border-box', opacity: inn, transform: `translateY(${(1 - inn) * 30}px)`, direction: 'ltr'}}>
      <div style={{fontFamily: B.font_mono, fontSize: 20, color: B.muted, letterSpacing: 1.5}}>MODE 0{i + 1}</div>
      <div style={{fontFamily: B.font_latin, fontWeight: 700, fontSize: 30, color: '#fff', marginTop: 10, lineHeight: 1.15}}>{title}</div>
      <div style={{fontFamily: B.font_ar, fontSize: 22, color: B.muted, marginTop: 8, direction: 'rtl', textAlign: 'left'}}>{sub}</div>
      <div style={{position: 'absolute', left: 28, right: 28, bottom: 40}}><Wave n={26} f={f} kind={kind} color={i === 0 ? B.accent : B.ice} h={300}/></div>
    </div>;
  };
  return <>
    <Card>
      <div style={{position: 'absolute', inset: 0, background: `radial-gradient(70% 60% at 30% 20%, rgba(37,99,235,.22), transparent 70%), ${B.raised}`}}/>
      {panel(s.mode_a, 'للمسرح والحفلات', 'stage', 0)}
      {panel(s.mode_b, 'صوت محيطي 360°', 'ambient', 1)}
      <div style={{position: 'absolute', inset: 0, clipPath: `inset(${(1 - wipe) * 100}% 0 0 0 round 0px)`}}>
        <Photo src={s.media} iw={1320} ih={1679} crop={{x: 250, y: 620, w: 820, h: 620}} zoom={ip(f, T, 210, 1.04, 1.12, Easing.linear)}/>
        <Grad strength={0.7}/>
        <div style={{position: 'absolute', left: 32, bottom: 32, display: 'flex', alignItems: 'center', gap: 12, direction: 'ltr', opacity: ip(f, T + 30, T + 44)}}>
          <span style={{fontFamily: B.font_latin, fontWeight: 800, fontSize: 40, color: '#fff', letterSpacing: -1}}>I</span><Heart size={38}/><span style={{fontFamily: B.font_latin, fontWeight: 800, fontSize: 40, color: '#fff', letterSpacing: -1}}>Tech</span>
        </div>
        <div style={{position: 'absolute', right: 32, top: 32, opacity: ip(f, T + 24, T + 38)}}><Pill tone="glass" size={22} style={{fontFamily: B.font_latin, fontWeight: 700}}>Insta360 Luna Ultra</Pill></div>
      </div>
    </Card>
    {f < T + 6 ? <Eyebrow text={B.update_tag}/> : <Eyebrow text="AdelTechTalks" latin/>}
    {f < T + 6 && <TextBlock headline={s.headline} sub={s.sub} out={T - 10}/>}
    {f >= T + 6 && <TextBlock headline={s.headline_b} sub={s.sub_b} from={T + 8}/>}
  </>;
};

const SCENES: Record<string, React.FC<{s: any}>> = {hook: Hook, zoom: Zoom, stage: Stage, tracking: Tracking, snapshot: Snapshot, audio_cta: AudioCta};

export const SlideCard: React.FC<{slideIndex: number}> = ({slideIndex}) => {
  const s = P.slides[slideIndex]; const Scene = SCENES[s.scene] || Hook;
  return <AbsoluteFill style={{background: B.bg, overflow: 'hidden', color: B.ink}}>
    <Fonts/>
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(60% 40% at 50% 28%, rgba(37,99,235,.10), transparent 70%)'}}/>
    <Scene s={s}/>
    <Index n={slideIndex + 1}/>
    <Signature/>
  </AbsoluteFill>;
};

export const Carousel: React.FC = () => {
  const fps = P.target.fps; let start = 0;
  return <AbsoluteFill>{P.slides.map((s: any, i: number) => { const d = Math.round((s.duration || 5) * fps); const node = <Sequence key={s.id} from={start} durationInFrames={d}><SlideCard slideIndex={i}/></Sequence>; start += d; return node; })}</AbsoluteFill>;
};
