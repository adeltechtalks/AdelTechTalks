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

/* ---------- scene 1 · hook / update found (real camera, real firmware screen) ---------- */
const Hook: React.FC<{s: any}> = ({s}) => {
  const f = useCurrentFrame();
  const T = 70;
  const zoomA = ip(f, 0, T + 20, 1.0, 1.07, Easing.linear);
  const r = ip(f, T, T + 30, 0, 1300, EIO);
  const zoomB = interpolate(f, [T, T + 40, 180], [1.14, 1.0, 1.04], {...clamp, easing: Easing.linear});
  const pillA = ip(f, 12, 26) * (1 - ip(f, T - 4, T + 8));
  const pillB = ip(f, T + 34, T + 48);
  return <>
    <Card>
      <Photo src={s.media} iw={1932} ih={2576} crop={{x: 0, y: 330, w: 1640, h: 1400}} zoom={zoomA}/>
      <Grad strength={0.5}/>
      <div style={{position: 'absolute', left: 32, top: 32, opacity: pillA}}><Pill tone="glass" size={20} style={{fontFamily: B.font_mono, fontWeight: 500, padding: '6px 12px'}}><span style={{width: 10, height: 10, borderRadius: 5, background: B.mint, boxShadow: `0 0 12px ${B.mint}`}}/>LUNA ULTRA · FIRMWARE</Pill></div>
      <div style={{position: 'absolute', inset: 0, clipPath: `circle(${r}px at 157px 440px)`}}>
        <Photo src={s.media_b} iw={1932} ih={2576} crop={{x: 555, y: 956, w: 900, h: 780}} zoom={zoomB}/>
        <Grad strength={0.45}/>
        <div style={{position: 'absolute', left: 32, bottom: 32, opacity: pillB, transform: `translateY(${(1 - pillB) * 10}px)`}}>
          <Pill tone="glass" size={22} style={{fontFamily: B.font_mono, fontWeight: 500}}><span style={{width: 10, height: 10, borderRadius: 5, background: B.accent, boxShadow: `0 0 12px ${B.accent}`, opacity: 0.55 + 0.45 * Math.abs(Math.sin(f / 7))}}/>UPDATING FIRMWARE</Pill>
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

/* ---------- scene 4 · active zoom tracking (official visual) ---------- */
const Tracking: React.FC<{s: any}> = ({s}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const k = ip(f, 40, 150, 1, 1.35, EIO);
  const zv = interpolate(k, [1, 1.35], [1, 6]); const label = `${zv < 1.05 ? '1' : zv > 5.9 ? '6' : zv.toFixed(1)}×`;
  const crop = {x: 40, y: 540, w: 980, h: 1100}; const box = {x: 648, y: 730, size: 236};   // the official green box, image px
  const s0 = Math.max(CW / crop.w, CH / crop.h); const TY = 200;
  const bx = (box.x - crop.x) * s0 + (CW - crop.w * s0) / 2, by = (box.y - crop.y) * s0 + (CH - crop.h * s0) / 2 + TY; const bs = box.size * s0 * k;
  const lock = spring({frame: f - 10, fps, config: {damping: 15, stiffness: 110}});
  const pulse = 0.5 + 0.5 * Math.sin(f / 9);
  return <>
    <Card>
      <Photo src={s.media} iw={1320} ih={1654} crop={crop} zoom={k} anchor={{x: box.x, y: box.y}} ty={TY}/>
      <Grad strength={0.5}/>
      <div style={{position: 'absolute', left: bx - bs / 2, top: by - bs / 2, width: bs, height: bs, borderRadius: bs * 0.16, boxShadow: `0 0 ${36 + 24 * pulse}px rgba(53,227,123,${0.35 + 0.35 * pulse})`, opacity: lock, transform: `scale(${interpolate(lock, [0, 1], [1.35, 1])})`}}/>
      <div style={{position: 'absolute', left: bx - bs / 2, top: by - bs / 2 - 56, display: 'flex', gap: 10, opacity: lock, direction: 'ltr'}}>
        <Pill tone="mint" size={20} style={{fontFamily: B.font_mono, fontWeight: 500, padding: '6px 12px'}}><span style={{width: 8, height: 8, borderRadius: 4, background: B.mint, opacity: 0.55 + 0.45 * pulse}}/>TRACKING</Pill>
      </div>
      <div style={{position: 'absolute', right: 32, top: 32, opacity: ip(f, 16, 30)}}>
        <Pill tone="glass" size={34} style={{fontFamily: B.font_mono, fontWeight: 500, letterSpacing: 1, boxShadow: `0 0 ${30 * ip(f, 140, 156)}px rgba(37,99,235,${0.9 * ip(f, 140, 156)})`}}>{label}</Pill>
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

/* ---------- scene 6 · pro audio modes (official visual) → CTA on the real camera ---------- */
const Eq: React.FC<{f: number; n?: number; color: string; kind: 'stage' | 'ambient'}> = ({f, n = 9, color, kind}) => (
  <span style={{display: 'inline-flex', alignItems: 'center', gap: 3, height: 22, marginLeft: 4}}>
    {Array.from({length: n}, (_, i) => { const a = kind === 'stage' ? Math.pow(Math.abs(Math.sin(f / 5 + i * 1.1)), 0.7) : 0.45 + 0.4 * Math.sin(f / 8 + i * 0.7); return <span key={i} style={{width: 4, height: Math.max(4, a * 22), borderRadius: 2, background: color}}/>; })}
  </span>
);
const AudioCta: React.FC<{s: any}> = ({s}) => {
  const f = useCurrentFrame();
  const T = 130;
  const crop = {x: 0, y: 520, w: 1320, h: 1030};
  const ax = interpolate(f, [0, 50, 95, 100], [330, 330, 990, 990], {...clamp, easing: EIO});
  const zoom = interpolate(f, [0, 95, 125], [1.5, 1.5, 1.0], {...clamp, easing: EIO});
  const anchor = f < 100 ? {x: ax, y: 1035} : undefined;   // after the pan, settle on the full split
  const wipe = ip(f, T, T + 26, 0, 1, EIO);
  const onLeft = 1 - ip(f, 50, 70), onRight = ip(f, 60, 80);
  return <>
    <Card>
      <Photo src={s.media} iw={1320} ih={1651} crop={crop} zoom={zoom} anchor={anchor}/>
      <Grad strength={0.35}/>
      <div style={{position: 'absolute', left: 32, top: 32, opacity: ip(f, 10, 24) * (f < 100 ? onLeft : 1)}}><Pill tone="blue" size={22} style={{fontFamily: B.font_latin, fontWeight: 700}}>Stage Audio<Eq f={f} color={B.ice} kind="stage"/></Pill></div>
      <div style={{position: 'absolute', right: 32, top: 32, opacity: onRight}}><Pill tone="glass" size={22} style={{fontFamily: B.font_latin, fontWeight: 700}}>Ambient Audio 360<Eq f={f} color={B.ice} kind="ambient"/></Pill></div>
      <div style={{position: 'absolute', inset: 0, clipPath: `inset(${(1 - wipe) * 100}% 0 0 0)`}}>
        <Photo src={s.media_b} iw={1932} ih={2576} crop={{x: 0, y: 250, w: 1932, h: 1450}} zoom={ip(f, T, 210, 1.0, 1.08, Easing.linear)}/>
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
