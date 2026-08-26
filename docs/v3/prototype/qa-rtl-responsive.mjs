import { chromium } from '/home/user/AdelTechTalks/site/node_modules/playwright/index.mjs';
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p=await b.newPage({viewport:{width:1500,height:1000}});
const errs=[];
p.on('pageerror',e=>errs.push('P: '+e.message));
p.on('console',m=>{if(m.type()==='error'&&!/fonts.googleapis|net::ERR/.test(m.text()))errs.push('C: '+m.text());});
await p.goto('file:///tmp/w2.html'); await p.waitForTimeout(400);
const out=[]; const t=async(n,f)=>{try{await f();out.push('PASS '+n);}catch(e){out.push('FAIL '+n+' :: '+e.message);}};

// generic collision detector: no two sibling text blocks may overlap
const overlaps = (sel) => p.evaluate((sel)=>{
  const bad=[];
  document.querySelectorAll(sel).forEach(scope=>{
    const els=[...scope.querySelectorAll('h1,h2,h3,p,dd,dt,span.t,.lead,.sub,.verdict,.aq')]
      .filter(e=>e.offsetParent!==null && e.textContent.trim());
    for(let i=0;i<els.length;i++)for(let j=i+1;j<els.length;j++){
      const a=els[i],c=els[j];
      if(a.contains(c)||c.contains(a)) continue;
      const A=a.getBoundingClientRect(),C=c.getBoundingClientRect();
      if(A.width<2||C.width<2) continue;
      const ox=Math.min(A.right,C.right)-Math.max(A.left,C.left);
      const oy=Math.min(A.bottom,C.bottom)-Math.max(A.top,C.top);
      if(ox>4&&oy>4) bad.push((a.className||a.tagName)+' ∩ '+(c.className||c.tagName)+
        ' ['+Math.round(ox)+'×'+Math.round(oy)+']');
    }
  });
  return bad.slice(0,6);
}, sel);

await t('switch to Arabic: AR composition shown, EN hidden',async()=>{
  await p.locator('.seg[data-set="lang"] button[data-v="ar"]').click(); await p.waitForTimeout(400);
  if(!(await p.locator('#homeAR').isVisible())) throw new Error('AR hidden');
  if(await p.locator('#homeEN').isVisible()) throw new Error('EN still visible');
  if(await p.locator('#homeAR').getAttribute('dir')!=='rtl') throw new Error('not rtl');
});
await t('AR hero: line-height ≥1.3, tracking normal, size ≥24px',async()=>{
  const m=await p.locator('#homeAR .hero h1').evaluate(n=>{const c=getComputedStyle(n);
    return {fs:parseFloat(c.fontSize),lh:parseFloat(c.lineHeight),ls:c.letterSpacing};});
  if(m.fs<24) throw new Error('font-size '+m.fs);
  if(m.lh/m.fs<1.3) throw new Error('line-height ratio '+(m.lh/m.fs).toFixed(2));
  if(m.ls!=='normal') throw new Error('letter-spacing '+m.ls);
});
await t('AR section headings: line-height ≥1.3, tracking normal',async()=>{
  const bad=await p.locator('#homeAR .sec h2').evaluateAll(ns=>ns.map(n=>{
    const c=getComputedStyle(n);
    return {ls:c.letterSpacing,r:parseFloat(c.lineHeight)/parseFloat(c.fontSize)};
  }).filter(x=>x.ls!=='normal'||x.r<1.3));
  if(bad.length) throw new Error(JSON.stringify(bad));
});
await t('no overlapping text anywhere in the AR homepage',async()=>{
  await p.evaluate(()=>window.scrollTo(0,0)); await p.waitForTimeout(200);
  const bad=await overlaps('#homeAR');
  if(bad.length) throw new Error(bad.join(' | '));
});
await t('every embedded Latin run is isolated',async()=>{
  const bad=await p.locator('#homeAR .ltr').evaluateAll(ns=>ns.map(n=>{
    const c=getComputedStyle(n);
    return {t:n.textContent.slice(0,14),d:c.direction,u:c.unicodeBidi};
  }).filter(x=>x.d!=='ltr'||!/isolate/.test(x.u)));
  if(bad.length) throw new Error(JSON.stringify(bad));
  const n=await p.locator('#homeAR .ltr').count();
  if(n<8) throw new Error('only '+n+' isolated runs — expected the Latin terms to be wrapped');
});
await t('the lockup stays LTR and is not re-typeset',async()=>{
  const m=await p.locator('#homeAR .lovetech').evaluate(n=>{const c=getComputedStyle(n);
    return {d:c.direction,u:c.unicodeBidi,f:c.fontFamily};});
  if(m.d!=='ltr'||!/isolate/.test(m.u)) throw new Error(JSON.stringify(m));
  if(!/Montserrat/.test(m.f)) throw new Error('font '+m.f);
});
await t('English source panel keeps dir=ltr inside the RTL page',async()=>{
  const d=await p.locator('#homeAR .source').first().evaluate(n=>getComputedStyle(n).direction);
  if(d!=='ltr') throw new Error('source dir='+d);
  const ta=await p.locator('#homeAR .arena textarea').evaluate(n=>getComputedStyle(n).direction);
  if(ta!=='ltr') throw new Error('textarea dir='+ta);
  if(!(await p.locator('#homeAR .srcnote').count())) throw new Error('no explanatory note');
});
await t('Arena is independently playable in RTL',async()=>{
  await p.locator('#homeAR [data-jump]').click(); await p.waitForTimeout(600);
  await p.locator('#arenaHomeAR #start').click(); await p.waitForTimeout(300);
  await p.locator('#arenaHomeAR #ta').fill('Rewrite the notes below for a developer who missed the meeting. Output three sections: Decisions, Actions, Open questions. Maximum 12 bullets. If an owner is not named write "not stated" — do not guess.');
  await p.waitForTimeout(150);
  await p.locator('#arenaHomeAR #go').click(); await p.waitForTimeout(900);
  const s=parseInt(await p.locator('#arenaHomeAR #fig').innerText());
  if(s<80) throw new Error('AR score='+s);
  if(await p.locator('#arenaHomeAR .dim').count()!==5) throw new Error('dims');
  const bad=await overlaps('#arenaHomeAR');
  if(bad.length) throw new Error('overlap: '+bad.join(' | '));
});
await t('AR numerals stay Western in mono figures',async()=>{
  const s=await p.locator('#arenaHomeAR #fig').innerText();
  if(/[٠-٩]/.test(s)) throw new Error('Arabic-Indic digits in score: '+s);
});
await t('navigation is independently correct in RTL',async()=>{
  await p.locator('.navbtn[data-screen="navs"]').click(); await p.waitForTimeout(300);
  const r=await p.locator('#navDemo').evaluate(n=>getComputedStyle(n).direction);
  if(r!=='rtl') throw new Error('nav dir='+r);
  const box=await p.locator('#navDemo .wordmark').boundingBox();
  const bar=await p.locator('#navDemo .row').boundingBox();
  if(box.x < bar.x+bar.width/2) throw new Error('logo not on the right in RTL');
  const latin=await p.locator('#navDemo .links .ltr').count();
  if(latin<2) throw new Error('frozen Latin nav terms not isolated: '+latin);
  await p.locator('#navDemo [data-menu="Playground"]').hover(); await p.waitForTimeout(400);
  if(!(await p.locator('#navDemo .menu.open').count())) throw new Error('menu did not open in RTL');
});
await t('mobile RTL: no overflow, no overlap, accordion works',async()=>{
  await p.locator('.seg[data-set="vp"] button[data-v="mobile"]').click(); await p.waitForTimeout(400);
  await p.locator('#navDemo #burger').click(); await p.waitForTimeout(200);
  await p.locator('#navDemo [data-acc="Learn"]').click(); await p.waitForTimeout(200);
  if(await p.locator('#navDemo [data-panel="Learn"]').isHidden()) throw new Error('accordion panel hidden');
  await p.locator('.navbtn[data-screen="home"]').click(); await p.waitForTimeout(400);
  const bad=await overlaps('#homeAR');
  if(bad.length) throw new Error('overlap: '+bad.join(' | '));
  const over=await p.evaluate(()=>{const f=document.querySelector('#homeAR');
    return f.scrollWidth-f.clientWidth;});
  if(over>2) throw new Error('AR mobile overflow '+over+'px');
});
await t('mobile EN: no overflow, no overlap',async()=>{
  await p.locator('.seg[data-set="lang"] button[data-v="en"]').click(); await p.waitForTimeout(400);
  const bad=await overlaps('#homeEN');
  if(bad.length) throw new Error('overlap: '+bad.join(' | '));
  const over=await p.evaluate(()=>{const f=document.querySelector('#homeEN');
    return f.scrollWidth-f.clientWidth;});
  if(over>2) throw new Error('EN mobile overflow '+over+'px');
});
await t('desktop EN: no overlap',async()=>{
  await p.locator('.seg[data-set="vp"] button[data-v="desktop"]').click(); await p.waitForTimeout(400);
  const bad=await overlaps('#homeEN');
  if(bad.length) throw new Error('overlap: '+bad.join(' | '));
});
await t('page body never scrolls sideways (1500 / 1100 / 420)',async()=>{
  for(const w of [1500,1100,420]){
    await p.setViewportSize({width:w,height:900}); await p.waitForTimeout(300);
    const o=await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    if(o>2) throw new Error('overflow '+o+'px at '+w);
  }
  await p.setViewportSize({width:1500,height:1000});
});
await t('reduced motion: batons and XP land at their final state',async()=>{
  await p.locator('.seg[data-set="motion"] button[data-v="reduced"]').click(); await p.waitForTimeout(300);
  const bad=await p.locator('#homeEN [data-baton] p').evaluateAll(ns=>ns.map(n=>{
    const c=getComputedStyle(n); return {o:c.opacity,t:c.transform};
  }).filter(x=>parseFloat(x.o)<1||(x.t!=='none'&&x.t!=='matrix(1, 0, 0, 1, 0, 0)')));
  if(bad.length) throw new Error(JSON.stringify(bad));
  await p.locator('.seg[data-set="motion"] button[data-v="full"]').click();
});
console.log(out.join('\n'));
console.log(errs.length?('\nERRORS:\n'+errs.join('\n')):'\nNo console/page errors.');
await b.close();
