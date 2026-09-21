import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import project from './project.json';

type Slide = {
  id:string; duration:number; media?:string; media_type?:'image'|'video'; motion?:string;
  eyebrow?:string; headline?:string; body?:string; rtl?:boolean; bg?:string;
};
const P:any = project;
const B = P.brand || {};

const Media:React.FC<{s:Slide}> = ({s}) => {
  const f=useCurrentFrame(); const {durationInFrames}=useVideoConfig();
  const p=durationInFrames<=1?0:f/(durationInFrames-1);
  let scale=1, x=0, y=0;
  switch(s.motion){
    case 'hero_push': scale=interpolate(p,[0,1],[1.02,1.10]); break;
    case 'macro_drift': scale=1.08; x=interpolate(p,[0,1],[-18,18]); y=interpolate(p,[0,1],[12,-12]); break;
    case 'parallax_left': scale=1.06; x=interpolate(p,[0,1],[22,-22]); break;
    case 'parallax_right': scale=1.06; x=interpolate(p,[0,1],[-22,22]); break;
    case 'feature_reveal': scale=interpolate(p,[0,.35,1],[1.08,1.0,1.02]); break;
    default: scale=1.02;
  }
  const style:React.CSSProperties={width:'100%',height:'100%',objectFit:'cover',transform:`translate(${x}px,${y}px) scale(${scale})`};
  if(!s.media) return <AbsoluteFill style={{background:s.bg||B.bg||'#0B1220'}}/>;
  return s.media_type==='image' ? <Img src={staticFile(s.media)} style={style}/> : <OffthreadVideo src={staticFile(s.media)} muted style={style}/>;
};

export const SlideCard:React.FC<{slideIndex:number}> = ({slideIndex}) => {
  const s:Slide=P.slides[slideIndex]; const f=useCurrentFrame(); const {fps}=useVideoConfig();
  const enter=interpolate(f,[0,Math.round(.45*fps)],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const lift=interpolate(enter,[0,1],[28,0]);
  const dir=s.rtl?'rtl':'ltr'; const align=s.rtl?'right':'left';
  const font=s.rtl?(B.font_ar||'Arial'):(B.font_en||'Arial');
  return <AbsoluteFill style={{background:s.bg||B.bg||'#0B1220',overflow:'hidden',fontFamily:font}}>
    <Media s={s}/>
    <AbsoluteFill style={{background:'linear-gradient(180deg,rgba(3,7,18,.08) 0%,rgba(3,7,18,.18) 45%,rgba(3,7,18,.78) 100%)'}}/>
    <div style={{position:'absolute',left:64,right:64,bottom:92,direction:dir,textAlign:align,opacity:enter,transform:`translateY(${lift}px)`}}>
      {s.eyebrow && <div style={{fontSize:24,fontWeight:800,letterSpacing:s.rtl?0:1.6,color:B.accent||'#2563EB',marginBottom:16}}>{s.eyebrow}</div>}
      {s.headline && <div style={{fontSize:70,lineHeight:1.05,fontWeight:900,color:B.ink||'#F8FAFC',maxWidth:900,marginLeft:s.rtl?'auto':0}}>{s.headline}</div>}
      {s.body && <div style={{fontSize:32,lineHeight:1.35,fontWeight:600,color:B.ink||'#F8FAFC',opacity:.9,maxWidth:860,marginTop:18,marginLeft:s.rtl?'auto':0}}>{s.body}</div>}
    </div>
    {B.signature && <Img src={staticFile(B.signature)} style={{position:'absolute',left:52,bottom:32,width:150,opacity:.78}}/>}
  </AbsoluteFill>
};

export const Carousel:React.FC = () => {
  const fps=P.target?.fps||30; let start=0;
  return <AbsoluteFill>{P.slides.map((s:Slide,i:number)=>{const d=Math.round((s.duration||5)*fps); const node=<Sequence key={s.id||i} from={start} durationInFrames={d}><SlideCard slideIndex={i}/></Sequence>; start+=d; return node;})}</AbsoluteFill>;
};
