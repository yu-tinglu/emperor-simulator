import asyncio
from playwright.async_api import async_playwright
JS="""
(seedN)=>{
 const errs=[];window.addEventListener('error',e=>errs.push(String(e.message)));
 const clk=e=>e.dispatchEvent(new MouseEvent('click',{bubbles:true}));
 const SKIP=new Set(['restart','load','import','export','save','loadauto','begin','scn','close']);
 let s=seedN;const rnd=()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296};
 console.error=(...a)=>{errs.push('CE '+a.map(x=>x&&x.stack?x.stack.split(String.fromCharCode(10)).slice(0,4).join(' | '):x).join(' '));};
 let months=0,clicks=0;
 for(let i=0;i<3000;i++){
   if(G&&G.over)break;
   const r=rnd();
   if(r<.16){const b=document.querySelector('[data-act=adv][data-arg="1"]');if(b){clk(b);months++}continue}
   if(r<.20){const t=['court','self','gov','map','harem','family','people','hist'][Math.floor(rnd()*8)];const b=document.querySelector('[data-act=tab][data-arg='+t+']');if(b)clk(b);continue}
   const ov=document.querySelector('#ov.on');
   if(ov&&document.querySelector('#md .list')&&rnd()<.8){const its=[...document.querySelectorAll('#md .list .it')];if(its.length){clk(its[Math.floor(rnd()*its.length)]);clicks++;const g=document.querySelector('#md [data-act=dgo]');if(g)clk(g);continue}}
   const els=[...document.querySelectorAll('[data-act]')].filter(e=>!SKIP.has(e.dataset.act));
   if(!els.length)continue;
   clk(els[Math.floor(rnd()*els.length)]);clicks++;
   if(ov&&rnd()<.25){const x=document.querySelector('#md [data-act=close]');if(x)clk(x)}
 }
 return {errs:errs.slice(0,6),t:G?G.t:-1,months,clicks,over:G&&G.over&&G.over.type,emps:G&&G.emps.length};
}
"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
        for scn in 'abc':
            for sd in (1,2):
                pg=await b.new_page(viewport={'width':1100,'height':900})
                perr=[]
                pg.on('pageerror',lambda e: perr.append(str(e)))
                await pg.goto('file:///home/claude/emperor/index.html')
                await pg.click('.splash [data-act=enter]')
                await pg.click(f'[data-act=scn][data-arg={scn}]')
                await pg.click('[data-act=begin]')
                await pg.evaluate("closeModal()")
                try:
                    r=await pg.evaluate(JS,sd*7919)
                except Exception as ex:
                    r='EVALERR '+str(ex)[:300]
                print(scn,sd,r,perr[:3])
                await pg.close()
        await b.close()
asyncio.run(main())
