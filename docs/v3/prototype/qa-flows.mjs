import { chromium } from '/home/user/AdelTechTalks/site/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
const frag=await fs.readFile('atc-v31-prototype.html','utf8');
const i=frag.indexOf('</style>');
await fs.writeFile('/tmp/w2.html','<!doctype html><html><head><meta charset="utf-8">'+
  frag.slice(0,i+8)+'</head><body>'+frag.slice(i+8)+'</body></html>');
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p=await b.newPage({viewport:{width:1500,height:1000}});
const errs=[];
p.on('console',m=>{if(m.type()==='error'&&!/fonts.googleapis|net::ERR/.test(m.text()))errs.push('C: '+m.text());});
p.on('pageerror',e=>errs.push('P: '+e.message));
await p.goto('file:///tmp/w2.html'); await p.waitForTimeout(400);
const out=[]; const t=async(n,f)=>{try{await f();out.push('PASS '+n);}catch(e){out.push('FAIL '+n+' :: '+e.message);}};

await t('EN home visible, AR hidden',async()=>{
  if(!(await p.locator('#homeEN').isVisible())) throw new Error('EN hidden');
  if(await p.locator('#homeAR').isVisible()) throw new Error('AR visible');
});
await t('spine + 4 act nodes + 3 batons',async()=>{
  const a=await p.locator('#homeEN [data-act]').count(), ba=await p.locator('#homeEN [data-baton]').count();
  if(a!==4) throw new Error('acts='+a); if(ba!==3) throw new Error('batons='+ba);
  if(!(await p.locator('#homeEN [data-spine]').count())) throw new Error('no spine');
});
await t('spine fills on scroll',async()=>{
  await p.evaluate(()=>window.scrollTo(0,2400)); await p.waitForTimeout(500);
  const h=await p.locator('#homeEN [data-spine]').evaluate(n=>n.style.height);
  if(!h||parseFloat(h)<5) throw new Error('spine height='+h);
});
await t('baton activates',async()=>{
  const on=await p.locator('#homeEN [data-baton].on').count();
  if(!on) throw new Error('no baton on');
});
await t('hero CTA jumps to Play act',async()=>{
  await p.evaluate(()=>window.scrollTo(0,0)); await p.waitForTimeout(300);
  await p.locator('#homeEN [data-jump]').click(); await p.waitForTimeout(700);
  const y=await p.locator('#playAnchorEN').evaluate(n=>n.getBoundingClientRect().top);
  if(Math.abs(y)>260) throw new Error('anchor top='+y);
});
await t('arena: start → timer runs',async()=>{
  await p.locator('#arenaHomeEN #start').click(); await p.waitForTimeout(1400);
  const v=await p.locator('#arenaHomeEN .timer b').innerText();
  if(parseInt(v)>=60) throw new Error('timer not ticking: '+v);
});
await t('live hints light as rules are met',async()=>{
  await p.locator('#arenaHomeEN #ta').fill('Rewrite the notes below for a developer who missed the meeting. Output three sections: Decisions, Actions, Open questions. Maximum 12 bullets. If an owner is not named, write "not stated" — do not guess.');
  await p.waitForTimeout(200);
  const met=await p.locator('#arenaHomeEN .hint.met').count();
  if(met<4) throw new Error('met='+met);
});
await t('strong answer scores high with a breakdown',async()=>{
  await p.locator('#arenaHomeEN #go').click(); await p.waitForTimeout(900);
  const s=parseInt(await p.locator('#arenaHomeEN #fig').innerText());
  if(s<80) throw new Error('score='+s);
  const dims=await p.locator('#arenaHomeEN .dim').count();
  if(dims!==5) throw new Error('dims='+dims);
});
await t('XP awarded and badge unlocked, signed out',async()=>{
  await p.waitForTimeout(2200);
  if(!(await p.locator('#arenaHomeEN #badgeSlot .badgerow').count())) throw new Error('no badge');
  const xp=await p.locator('#arenaHomeEN #xpNum').innerText();
  if(!/2[6-9]\d|3\d\d/.test(xp)) throw new Error('xp='+xp);
});
await t('value-preserving conversion appears AFTER the reward',async()=>{
  const c=p.locator('#arenaHomeEN #convert');
  if(await c.isHidden()) throw new Error('convert hidden');
  const t2=await c.locator('.t').innerText();
  if(!/Save your XP and badge/.test(t2)) throw new Error(t2);
  const held=await c.locator('.held .it').count();
  if(held<3) throw new Error('held='+held);
});
await t('Join free carries XP into the member shell',async()=>{
  await p.locator('#arenaHomeEN #join').click(); await p.waitForTimeout(500);
  if(!(await p.locator('#s-member').evaluate(n=>n.classList.contains('live')))) throw new Error('not on member');
  const xp=await p.locator('#dashMount .lvlring b').first().innerText();
  if(parseInt(xp)<260) throw new Error('dash xp='+xp);
  const lv=await p.locator('#dashMount .levelname').first().innerText();
  if(!/Builder/.test(lv)) throw new Error('level='+lv);
});
await t('dashboard: skills, achievements, honest empty states',async()=>{
  if(await p.locator('#dashMount .skill').count()!==4) throw new Error('skills');
  if(await p.locator('#dashMount .bslot').count()!==4) throw new Error('badges');
  if(await p.locator('#dashMount .bslot.on').count()<1) throw new Error('no earned badge');
  const empties=await p.locator('#dashMount .emptystate').count();
  if(empties<2) throw new Error('empties='+empties);
});
await t('prompts: three facts, copy, save',async()=>{
  await p.locator('.navbtn[data-screen="home"]').click(); await p.waitForTimeout(200);
  const cards=await p.locator('#promptsEN .pcard').count();
  if(cards!==3) throw new Error('cards='+cards);
  if(await p.locator('#promptsEN .pcard').first().locator('.pfact').count()!==3) throw new Error('facts');
  await p.locator('#promptsEN [data-toggle]').first().click(); await p.waitForTimeout(350);
  if(!(await p.locator('#promptsEN .pbody.open').count())) throw new Error('body not open');
  await p.locator('#promptsEN [data-save]').first().click(); await p.waitForTimeout(200);
  if(!(await p.locator('#promptsEN .btn.done').count())) throw new Error('not saved');
});
await t("What's New keeps all four slots",async()=>{
  const slots=await p.locator('#wnEN .wnslot dt').allInnerTexts();
  const want=['WHAT CHANGED','WHY IT MATTERS','ADEL','TRY IT'];
  want.forEach(w=>{ if(!slots.some(s=>s.includes(w))) throw new Error('missing '+w+' in '+slots); });
});
await t('motion: 10 interactions, all replayable',async()=>{
  await p.locator('.navbtn[data-screen="motion"]').click(); await p.waitForTimeout(200);
  const n=await p.locator('#motionRows tr').count(); if(n!==10) throw new Error('rows='+n);
  for(const k of ['hero','spine','baton','stagger','ring','count','xp','badge','menu','mobile']){
    await p.locator('[data-mo="'+k+'"]').click(); await p.waitForTimeout(60);
  }
  await p.waitForTimeout(600);
});
await t('publish flow refusals',async()=>{
  await p.locator('.navbtn[data-screen="api"]').click(); await p.waitForTimeout(150);
  for(const [k,rx] of [['notown',/403/],['selfscore',/not_verifiable/],['fields',/refused_fields/],
      ['direct',/row-level security/],['noname',/display_name_required/]]){
    await p.locator('[data-req="'+k+'"]').click(); await p.waitForTimeout(70);
    const tx=await p.locator('#resOut').innerText();
    if(!rx.test(tx)) throw new Error(k+' → '+tx.slice(0,50));
  }
});
await t('nav: no Courses, Playground has a menu',async()=>{
  await p.locator('.navbtn[data-screen="navs"]').click(); await p.waitForTimeout(200);
  const items=await p.locator('#navDemo .links .lk').allInnerTexts();
  if(items.some(i=>/Courses/.test(i))) throw new Error('Courses present');
  await p.locator('#navDemo [data-menu="Playground"]').hover(); await p.waitForTimeout(400);
  if(!(await p.locator('#navDemo .menu.open').count())) throw new Error('menu closed');
});
console.log(out.join('\n'));
console.log(errs.length?('\nERRORS:\n'+errs.join('\n')):'\nNo console/page errors.');
await b.close();
