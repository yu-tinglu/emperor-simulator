const fs=require('fs');const vm=require('vm');
const code=['core.js','sim.js','act.js','story.js','world.js'].map(f=>fs.readFileSync(f,'utf8')).join('\n')+';this.__x={newGame,endMonth,alivePs,emp,age,nm,dateStr,advance,actCourt,actVisit,actStudy,actRest,actDraft,draftList,sitOpts,memoOpts,runMemo,personActions,consorts,myKids,actInvestigate,candidatesFor,actAppoint,actRegain,actStrike,actRecruit,setTax,setMil,topFac,facLeader,holder,offDef,allOffIds,actDiplo,actBanquet,actTour,get G(){return G},R:()=>R()}';
const c={console,Math};vm.createContext(c);vm.runInContext(code,c);const X=c.__x;
let errs=0;const stats={};
function safe(f,tag){try{return f()}catch(e){errs++;if(errs<8)console.log('ERR',tag,e.stack.split('\n').slice(0,3).join('|'))}}
function botMonth(mode){const G=X.G;
 safe(()=>{X.actCourt()},'court');
 // memos
 for(let k=0;k<6;k++){const m=G.memo[0];if(!m)break;const opts=X.memoOpts(m);if(!opts.length){G.memo.shift();continue}
  // choose option: first, or if has ask pick first item
  const pref={taxup:1,omen:1,festival:1,dispute:2}[m.k];let order=opts.map((_,i)=>i);if(pref!=null&&pref<opts.length){order=[pref].concat(order.filter(x=>x!==pref))}let done=false;for(const i of order){if(done)break;const o=opts[i];if(o.ask){const it=o.ask.items[0];if(!it)continue;const r=safe(()=>o.fn(it.id),'memo-ask '+m.k);if(r&&r.ok){G.memo=G.memo.filter(z=>z!==m);done=true}}else{const r=safe(()=>X.runMemo(m.id,i),'memo '+m.k);if(r&&r.ok)done=true;}}
  if(!done)G.memo.shift()}
 // sits
 for(const s of G.sit.slice()){const opts=safe(()=>X.sitOpts(s),'sitopts '+s.k)||[];for(const o of opts){if(s.k==='war'||s.k==='revolt'){if(!/派兵/.test(o.l))continue}
   if(s.k==='crisis'&&!/分化/.test(o.l))continue;if(s.k==='case'&&!/徹查|處死|流放|賜死/.test(o.l))continue;if(s.k==='illness'&&!/太醫/.test(o.l))continue;
   if(s.k==='disaster'&&!/開倉/.test(o.l))continue;
   safe(()=>o.ask?o.fn(o.ask.items[0]&&o.ask.items[0].id):o.fn(),'sit '+s.k);break}}
 // intel
 for(const it of G.intel.slice(0,2)){safe(()=>X.actInvestigate(it.id,(X.holder('yu')||X.alivePs().find(p=>p.role==='official')).id),'intel')}
 // harem
 if(G.t%2===0){const cs=X.consorts().sort((a,b)=>b.fav-a.fav);if(cs[0])safe(()=>X.actVisit(cs[0]),'visit')}
 if(G.t%7===0&&X.consorts().length<4){safe(()=>X.actDraft(X.draftList().slice(0,2).map(p=>p.id)),'draft')}
 // heir
 if(!G.heir){const pr=X.myKids().filter(p=>p.role==='prince'&&X.age(p)>=1)[0];if(pr)safe(()=>X.personActions(pr).find(o=>/立為太子/.test(o.l)).fn(),'heir')}
 // vacancies
 for(const o of X.allOffIds()){if(!G.off[o]){const c=X.candidatesFor(o)[0];if(c)safe(()=>X.actAppoint(o,c.id),'appoint')}}
 // test every person action occasionally
 if(G.t%24===0){for(const p of X.alivePs().filter(p=>p.id!==G.emp).slice(0,6)){safe(()=>{for(const a of X.personActions(p)){if(/處死|賜死|流放|削爵|廢太子|冷宮/.test(a.l))continue;if(a.ask)a.ask.items.slice(0,1).forEach(it=>a.fn(it.id));else a.fn()}},'person '+p.role)}}
 if(mode==='tax'&&G.tre<100)X.setTax(4);if(G.tre>1500)X.setTax(2);
 if(G.tre>1000&&G.army<45)safe(()=>X.actRecruit(),'recruit');
 safe(()=>X.actStudy(['pol','sch','mil','lit'][G.t%4]),'study');
}
for(const scn of (process.env.SC||"abc").split("")){for(let seed=1;seed<=(+process.env.NS||4);seed++){
 X.newGame({scn,seed:seed*1237,name:'測試',diff:process.env.DIFFV||'n'});let m=0;
 while(m<1000&&!X.G.over){botMonth('tax');safe(()=>X.endMonth(),'endMonth');m++}
 const G=X.G;console.log(scn,seed,'months',m,'over',G.over&&G.over.type,G.over&&G.over.txt,'| emps',G.emps.length,'tre',Math.round(G.tre),'mind',Math.round(G.mind),'auth',Math.round(G.auth),'army',Math.round(G.army),'living',X.alivePs().length,'persons',Object.keys(G.P).length,'chron',G.chr.length)}}
console.log('errors',errs);
