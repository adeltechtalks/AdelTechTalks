import React from 'react';
import {Composition} from 'remotion';
import {Carousel, SlideCard} from './Carousel';
import project from './project.json';
const P:any=project; const fps=P.target.fps; const width=P.target.width; const height=P.target.height;
export const Root:React.FC=()=>{
  const total=P.slides.reduce((n:number,s:any)=>n+Math.round((s.duration||5)*fps),0);
  return <>
    <Composition id="Carousel" component={Carousel} durationInFrames={total} fps={fps} width={width} height={height}/>
    {P.slides.map((s:any,i:number)=><Composition key={s.id} id={`Slide${String(i+1).padStart(2,'0')}`} component={SlideCard} defaultProps={{slideIndex:i}} durationInFrames={Math.round((s.duration||5)*fps)} fps={fps} width={width} height={height}/>)}
  </>;
};
