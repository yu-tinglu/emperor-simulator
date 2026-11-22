'use strict';
/* ============ 世界模擬：每月推進 ============ */
const rg_=id=>G.reg[id];
function weight(p){let w=0;if(p.off){const o=offDef(p.off);w+=o?o.r*3:0}
 if(p.role==='general')w+=p.st.mil/12;if(p.role==='consort'&&p.rank>=5)w+=10;if(p.role==='dowager')w+=p.rank>=5?12:3;
 if((p.role==='prince'||p.role==='kin')&&age(p)>=16)w+=p.fief?10:3;if(p.role==='eunuch')w+=4;if(p.role==='official'&&!p.off)w+=1;return w}
function facOf(p){return p.role==='eunuch'?'eun':(p.role==='prince'||p.role==='kin'||p.role==='princess')?'kin':(p.role==='dowager'||p.role==='consort')?'wai':(p.role==='general'&&p.fac==='none')?'army':p.fac}
function syncPower(){const sums={chan:0,clean:0,army:0,kin:0,eun:0,wai:0,none:0};let tot=0;
 for(const id in G.clans)G.clans[id].pw=0;
 for(const p of alivePs()){if(p.id===G.emp)continue;const w=weight(p);if(!w)continue;const f=facOf(p);sums[f]=(sums[f]||0)+w;tot+=w;if(p.clan!=null)G.clans[p.clan].pw+=w}
 for(const f in G.pow)G.pow[f]=cl(100*sums[f]/(tot+25)+(G.fd[f]||0),0,100)}
function facLeader(f){let b=null,bv=-1;for(const p of alivePs()){if(p.id===G.emp||facOf(p)!==f)continue;const w=weight(p)+p.st.sch/50;if(w>bv){bv=w;b=p}}return b}
function topFac(){let b='chan',v=-1;for(const f of['chan','eun','wai','army','clean']){if(G.pow[f]>v){v=G.pow[f];b=f}}return b}
const apMax=()=>{const e=emp();return(e.hp<30||e.ill)?2:3};
const offName=id=>{const o=offDef(id);return o?o.n:''};

/* ---------- 生活方式 ---------- */
function lifeEffects(){const e=emp(),L=G.life;
 if(L==='diligent'){G.rep=cl(G.rep+.2);e.hp=cl(e.hp-.12)}
 else if(L==='indulge'){G.rep=cl(G.rep-.3);G.mind=cl(G.mind-.12);G.tre-=5;e.hp=cl(e.hp-.18)}
 else if(L==='delegate'){e.hp=cl(e.hp+.1);G.fd.chan+=.2}
 else if(L==='tyrant'){G.fear=cl(G.fear+.7);G.mind=cl(G.mind-.1);for(const p of alivePs())if((p.role==='official'||p.role==='general')&&chance(.1))p.op=cl(p.op-.4)}
 if(L!=='tyrant')G.fear=cl(G.fear-.35);if(e.pill)e.hp=cl(e.hp-.08*e.pill)}

/* ---------- 經濟與地方 ---------- */
function economy(){
 const m=G.t%12+1;const tm=[.6,.8,1,1.25,1.5][G.tax-1];const hb=1+(offq('hu','biz')-50)*.002;
 let inc=0,leak=0,pops=0,unS=0,grain=0;
 const ps=alivePs();const ncon=ps.filter(p=>p.role==='consort').length,nkid=ps.filter(p=>(p.role==='prince'||p.role==='princess')&&age(p)<18).length;
 for(const id in G.reg){const r=G.reg[id];const gov=holder('g_'+id);
  const gq=gov?(gov.st.pol*.6+gov.st.biz*.4-gov.cor*.25):28;
  let fd=-3;if(m===9||m===10)fd+=20*(.6+r.pr/100)*(1-r.un/220)*G.weather*(1+czm('harv'));r.food=cl(r.food+fd);
  const pg=(r.food-38)/100*.0007+(r.pr-50)/100*.0003;r.pop=Math.max(20,r.pop+r.pop*(pg>0?pg*(1+czm('popg')):pg)-(r.rebel?r.pop*.0004:0));
  const prT=58+(gq-50)*.5-(G.burden-30)*.4-(r.un-20)*.2+(G.inst.shi&&r.ter==='coast'?5:0)+(r.proj||0);
  r.pr=cl(r.pr+(prT-r.pr)*.02,10,96);
  const unT=czm('unrest')+(G.zeit&&G.zeit.k==='decline'?4:0)-(G.zeit&&G.zeit.k==='revival'?3:0)+12+(G.burden-30)*.6+Math.max(0,45-r.food)*.9+(gov?gov.cor*.15:8)-(G.mind-50)*.3-r.garr+(gov&&gov.op<30?4:0)+(r.sec?20:0);
  r.un=cl(r.un+(unT-r.un)*.06);
  const auT=10+(50-G.auth)*.5+(gov?(gov.amb-50)*.25:0)+r.garr+(gov&&gov.op<35?8:0)+(r.vas?20:0);
  r.au=cl(r.au+(auT-r.au)*.04);
  if(r.exempt>0&&r.exempt<500)r.exempt--;
  if(r.sec)continue;
  const base=(1+czm('inc'))*r.pop*r.pr/100*.044*tm*hb*(r.exempt>0?0:1)*(G.inst.shi&&r.ter==='coast'?1.08:1)*(r.vas?.3:1);
  const lk=(gov?cl(gov.cor/100*.32,0,.4):.15)*Math.max(.2,1-czm('leak'));inc+=base*(1-lk);leak+=base*lk;pops+=r.pop;unS+=r.un*r.pop;
  if(gov)gov.wealth=(gov.wealth||0)+base*lk;
  if(m===10)grain+=r.pop*r.pr/100*.08*tm*(1+czm('grain'));
  if(r.proj)r.proj=Math.max(0,r.proj-.02)}
 const army=(G.zeit&&G.zeit.k==='martial'?.95:1)*G.army*1.45*[.7,.85,1,1.15,1.3][G.mil-1]*(1-(offq('bing','mil')-50)*.002)*Math.max(.4,1+czm('armycost'));
 const Z=G.zeit?G.zeit.k:'plain';const crt=(10+G.crt*4+ncon*.5+nkid*.25+(G.life==='indulge'?5:0))*(Z==='gilded'?1.15:1);
 const offN=Object.values(G.off).filter(Boolean).length;const sal=(9+offN*.9)*Math.max(.5,1+czm('salc'));
 const inst=(G.inst.spy?4:0)+(G.inst.shi?2:0)+(G.inst.cab?3:0)+(G.inst.acad?3:0);
 const wars=G.sit.filter(s=>s.k==='war'||s.k==='revolt').length;const warC=wars*3*[.7,.85,1,1.15,1.3][G.mil-1];
 let pc=0;for(const pr of G.proj){pc+=pr.cost/pr.dur}
 let exp=(army+crt+sal+inst+warC+pc+czUp())*diffExp();inc*=diffInc();inc+=czm('trade');
 for(const f in G.foe){if(G.foe[f].vas)inc+=3;if(G.foe[f].trade)inc+=4}
 G.fin={inc,exp,leak,army,crt,sal};G.tre+=inc-exp;G.gra=Math.max(0,G.gra*.998+grain);
 if(G.tre<0)G.debt++;else G.debt=0;
 G.burden=cl(G.burden+[-1.2,-.5,0,.9,2][G.tax-1]+czm('burden'));
 if(G.tre>0&&G.army<[30,36,40,48,56][G.mil-1])G.army+=.12;else if(G.army>[30,36,40,48,56][G.mil-1]+4)G.army-=.1;
 const mT=czm('morale')+50+(G.mil-3)*14-(G.debt>0?25:0);G.morale=cl(G.morale+(mT-G.morale)*.05);
 const avgUn=pops?unS/pops:30;G.avgUn=avgUn;
 const mdT=czm('mind')+56-(G.burden-30)*.4-(avgUn-20)*.3+(G.rep-50)*.1+(G.life==='tyrant'?-6:0);G.mind=cl(G.mind+(mdT-G.mind)*.05);
 // 工程
 for(const pr of G.proj.slice()){pr.left--;if(pr.left<=0){G.proj=G.proj.filter(x=>x!==pr);const r=G.reg[pr.reg];
  if(pr.k==='canal'){r.proj=(r.proj||0)+9;r.food=cl(r.food+10);chron(r.n+'水利工程竣工，沃野可期。',2)}
  else if(pr.k==='granary'){G.gra+=180;chron('新建常平倉落成，糧儲大增。',2)}
  else if(pr.k==='road'){r.proj=(r.proj||0)+5;r.au=cl(r.au-8);chron(r.n+'驛道修成，政令暢通。',2)}
  else if(pr.k==='wall'){r.garr+=2;chron(r.n+'邊塞城防修築完成。',2)}
  G.rep=cl(G.rep+1.5)}}
}

/* ---------- 權力 ---------- */
function powerMonth(){const e=emp();
 G.att=cl(G.att+(G.held?10:-5));
 if(G.att<30){G.fd.chan+=.9;G.fd.eun+=.5;G.fd.wai+=.2}else if(G.att>60){for(const f in G.fd)G.fd[f]=Math.max(0,G.fd[f]-.4)}
 if(G.memo.length>8)G.fd.chan+=.5;
 for(const f in G.fd)G.fd[f]=cl(G.fd[f]*.992,0,35);
 syncPower();
 const top=Math.max(G.pow.chan,G.pow.eun,G.pow.wai,G.pow.army,G.pow.clean);const gu=holder('guard');
 const tgt=czm('auth')+44+(G.rep-50)*.25+(e.st.sch+e.st.pol-90)*.12+(G.att>60?8:G.att<20?-12:0)-.55*Math.max(0,top-28)+(G.inst.spy?5:0)+(G.inst.cab?3:0)+(gu?(gu.op-50)*.15:0)+(G.life==='tyrant'?10:0)+(G.life==='delegate'?-10:0)-(G.regent?22:0);
 G.auth=cl(G.auth+(tgt-G.auth)*.12);G.puppet=G.auth<18;
 if(G.regent){const rp=P(G.regent);if(!rp||!rp.alive||age(e)>=16){if(G.regent){chron(nm(e)+'年滿十六，親政。',3);G.regent=null}}}
}

/* ---------- 人物 ---------- */
function plotOf(k,aid,tid){return G.plots.find(x=>x.k===k&&x.a===aid&&(tid==null||x.tg===tid))}
function addPlot(k,a,tg,ex){const pl=Object.assign({id:G.nid++,k,a:a.id,tg:tg?tg.id:null,prog:0,t0:G.t,rep:false},ex||{});G.plots.push(pl);return pl}
function removePlot(pl){G.plots=G.plots.filter(x=>x!==pl&&x.id!==pl.id);G.intel=G.intel.filter(x=>x.plot!==pl.id)}
function pickRival(p){const pool=shuffle(alivePs().filter(x=>x.id!==p.id&&(x.role==='official'||x.role==='general'||x.role==='eunuch'||(p.role==='prince'&&x.role==='prince')))).slice(0,7);
 let best=null,bv=-24;for(const x of pool){const v=relOf(p,x)-((x.off&&!p.off)?10:0);if(v<bv){bv=v;best=x}}return best}
function supOf(p){let s=0;for(const o of alivePs())if(o.back===p.id)s+=weight(o)+1;if(p.mo!=null&&P(p.mo)&&P(p.mo).clan!=null)s+=G.clans[P(p.mo).clan].pw/2;return s}

function conceive(w,h){w.preg=9;w.pf=h.id}
function bear(w){const f=w.pf!=null?P(w.pf):null;if(!f)return;
 const med=offq('med','med');
 if(chance(.04-(med-40)*.0003)){bio(w,'產下死胎。');if(f.id===G.emp)log(nmt(w)+'產下死胎，宮中哀戚。','warn');if(chance(.05))die(w,'產後血崩而亡');return}
 const g=chance(.5)?'M':'F';const isE=f.id===G.emp;const royal=f.sur===IMPSUR;
 const role=isE?(g==='M'?'prince':'princess'):royal?'kin':(g==='M'?'son':'maiden');
 const k=mk({g,sur:f.sur,role,born:G.t,fa:f.id,mo:w.id,clan:f.clan,fac:royal?'kin':f.fac,ft:mixFace(f.ft,w.ft)});
 f.kids.push(k.id);w.kids.push(k.id);if(w.clan!=null&&f.clan!=null&&!royal){}
 bio(k,'出生，父'+nm(f)+'，母'+nm(w)+'。');bio(w,'誕下'+nm(k)+'。');bio(f,'喜得'+(g==='M'?'子':'女')+nm(k)+'。');
 if(isE){w.fav=cl(w.fav+8);memo_(w,'child',8,'誕下龍嗣。');G.rep=cl(G.rep+.8);chron(nmt(w)+'誕下'+(g==='M'?'皇子':'皇女')+nm(k)+'。',g==='M'?3:2,[k.id,w.id]);
  if(g==='M'&&!G.heir&&G.reign.start!=='a')G.sel=0}
 else if(role==='kin'||royal)log(nm(f)+'喜得'+(g==='M'?'子':'女')+'。');
 if(chance(.02-(med-40)*.0002)&&w.alive)die(w,'產後病亡')}

function marry(m,w){m.sp=w.id;w.sp=m.id;if(w.role==='maiden'){w.role='wife';w.fac=m.fac}
 bio(m,'迎娶'+nm(w)+'。');bio(w,'嫁與'+nm(m)+'。');
 if(m.clan!=null&&w.clan!=null){for(const a of G.clans[m.clan].m)for(const b of G.clans[w.clan].m){const A=P(a),B=P(b);if(A.alive&&B.alive&&chance(.3))bump(A,B,8)}}
 if(m.role==='prince'||w.role==='princess'||m.role==='kin')chron(nmt(m)+'與'+nm(w)+'成婚。',2,[m.id,w.id])}
function marryYear(){
 const mai=alivePs().filter(p=>p.role==='maiden'&&age(p)>=15&&age(p)<=25&&p.sp==null);
 const men=alivePs().filter(p=>p.g==='M'&&p.sp==null&&age(p)>=17&&age(p)<=42&&['official','general','prince','kin'].includes(p.role));
 for(const m of shuffle(men)){if(!chance(.32))continue;const cand=mai.filter(x=>x.sp==null&&x.clan!==m.clan);if(!cand.length)break;
  const w=wpick(cand,x=>20+x.st.lit/5+(x.clan!=null?G.clans[x.clan].pw/2:0));if(w)marry(m,w)}
 for(const w of alivePs().filter(p=>p.role==='princess'&&age(p)>=16&&p.sp==null&&p.fa!==G.emp&&chance(.3))){
  const men2=alivePs().filter(p=>p.g==='M'&&p.sp==null&&age(p)>=18&&age(p)<=34&&(p.role==='official'||p.role==='son'));const m=pick(men2);if(m)marry(m,w)}}

function stageUpdate(p){const a=age(p);
 if(p.pot&&a<18){for(const k in STN){let g=(p.pot[k]-p.st[k])*.005;if(k===(p.focus||'lit')&&a>=5){const tut=p.tutor?P(p.tutor):null;g*=1+(tut&&tut.alive?tut.st[k]/55:.3)}p.st[k]=cl(p.st[k]+Math.max(0,g),0,99)}}
 if(p.role==='son'&&a>=18){p.role='official';p.fac=G.clans[p.clan].f;bio(p,'成年入仕，候補待選。')}
 if(p.role==='prince'&&a>=16&&!p.title){p.title=p.gn+'王';bio(p,'受封'+p.title+'。')}}

function aftermath(p,harsh){const rel=[];if(p.sp!=null)rel.push(p.sp);p.kids.forEach(k=>rel.push(k));if(p.mo!=null)rel.push(p.mo);if(p.fa!=null)rel.push(p.fa);
 for(const id of rel){const x=P(id);if(x&&x.alive&&x.id!==G.emp)memo_(x,'kin_killed',-(harsh?30:20),'親人'+nm(p)+'被朝廷處死。',p.id)}
 if(p.clan!=null)for(const id of G.clans[p.clan].m){const x=P(id);if(x&&x.alive&&x.id!==p.id&&!rel.includes(id))memo_(x,'clan_hit',-7,'同族'+nm(p)+'獲罪。',p.id)}}
function kill(p,cause,why){const was=nmt(p);const o=p.off;die(p,cause);aftermath(p,cause==='賜死');G.reign.exec++;G.fear=cl(G.fear+3);
 chron(was+(o?'（'+offName(o)+'）':'')+(cause==='誅'?'伏誅':'被賜死')+(why?'，罪名：'+why:'')+'。',p.role==='prince'||o?3:2,[p.id])}

function die(p,cause){
 if(!p.alive)return;p.alive=false;p.dod=G.t;p.preg=0;const wasOff=p.off;vacate(p);
 bio(p,cause==='誅'?'被誅。':cause==='賜死'?'被賜死。':cause==='戰死'?'戰死沙場。':'於'+age(p)+'歲'+cause+'。');
 if(p.sp!=null){const s=P(p.sp);if(s&&s.alive&&s.sp===p.id&&s.role!=='consort'&&s.id!==G.emp)s.sp=null}
 for(const pl of G.plots.slice())if(pl.a===p.id||pl.tg===p.id)removePlot(pl);
 if(G.heir===p.id){G.heir=null;if(p.fa===G.emp){chron('太子'+nm(p)+'薨。',3,[p.id]);G.reign.heirsLost++}}
 const notable=p.role==='emp'||(p.role==='consort'&&p.rank>=3)||p.role==='dowager'||wasOff||p.role==='prince'||(p.role==='princess'&&age(p)>=3);
 if(p.id!==G.emp&&notable&&cause!=='誅'&&cause!=='賜死'){const txt=nmt(p)+(wasOff?'（'+offName(wasOff)+'）':'')+cause+'，享年'+age(p)+'。';
  if(p.role==='prince'||wasOff==='chan'||wasOff==='gen'||p.role==='dowager'||(p.role==='consort'&&p.rank>=5))chron(txt,3,[p.id]);else log(txt)}
 const rl=Object.keys(p.rel);p.rel={};if(p.role!=='emp')p.mem=[];
 for(const id of p.kids){const k=P(id);if(k&&k.alive&&k.role!=='emp')k.sec=0}
 refreshClans();
 if(p.id===G.emp)succeed(cause)}

function stat1(x){return x}
function gossip(txt){const p=.4+offq('yu','sch')*.004+(G.inst.spy?.3:0);if(chance(p))log('【傳聞】'+txt)}
const GOALN={rise:'謀求高位',wealth:'斂財置產',loyal:'一心報國',faction:'經營門戶',family:'光大門楣',empress:'覬覦後位',child:'盼得子嗣',favor:'爭取聖寵',throne:'覬覦儲位',glory:'渴望戰功',safe:'但求自保',peace:'安度餘生'};
function assignGoal(p){const r=p.role,t=p.tr;
 if(r==='official'||r==='general'||r==='eunuch')return t.includes('貪婪')?'wealth':t.includes('野心')?'rise':t.includes('忠直')?'loyal':t.includes('圓滑')?'faction':pick(['rise','family','loyal','faction']);
 if(r==='consort')return(t.includes('野心')||p.amb>70)?'empress':p.kids.length?'child':pick(['favor','child','family']);
 if(r==='prince')return p.amb>65?'throne':pick(['glory','safe']);return'peace'}
function goalAct(p){if(!p.goal)p.goal=assignGoal(p);const g=p.goal,a=age(p);
 if(g==='rise'&&p.role==='official'&&a>=22){const hi=alivePs().filter(x=>x.off&&x.id!==p.id&&weight(x)>=12);const t=hi.length?pick(hi):null;if(t){bump(p,t,2);bump(t,p,1)}
  if(!p.off&&chance(.05)&&!G.memo.some(m=>m.k==='seek'&&m.from===p.id)){const v=vacantOffs().filter(o=>{const od=offDef(o);return od&&!od.role});if(v.length){const o=pick(v);G.memo.push({id:G.nid++,k:'seek',t:G.t,from:p.id,txt:nmt(p)+'託人遞上自薦書，希望出任'+offName(o)+'。',x:{off:o}})}}}
 else if(g==='wealth'&&p.off&&p.cor<65&&chance(.1))p.cor=cl(p.cor+.6);
 else if(g==='faction'&&chance(.15)){const o=pick(alivePs().filter(x=>x.role==='official'&&x.fac!==p.fac&&x.id!==p.id));if(o){if(relOf(o,p)>-10&&chance(.4)){o.fac=p.fac;gossip(nmt(o)+'近來與'+nmt(p)+'走得很近，似已投入'+FAC[p.fac].n+'門下。')}else bump(o,p,2)}}
 else if(g==='family'&&p.clan!=null&&chance(.05)){for(const id of G.clans[p.clan].m){const x=P(id);if(x.alive&&chance(.1))x.op=cl(x.op+1)}}
 else if(g==='loyal')p.op=cl(p.op+.15);
 else if(g==='empress'&&p.role==='consort'){const top=alivePs().filter(x=>x.role==='consort'&&x.rank>p.rank).sort((x,y)=>y.rank-x.rank)[0];if(top&&chance(.04)&&!G.plots.some(z=>z.a===p.id&&z.tg===top.id))addPlot('slander',p,top,{why:'爭位'})}
 else if(g==='child'&&p.role==='consort'&&!p.preg&&p.fav>40&&chance(.03))gossip(nmt(p)+'日日禮佛求子，香火不斷。');
 else if(g==='throne'&&p.role==='prince'&&a>=14&&chance(.1)){const o=pick(alivePs().filter(x=>x.role==='official'&&x.off));if(o){bump(o,p,3);gossip(nmt(p)+'近日頻繁宴請朝臣。')}}
 else if(g==='glory'&&p.role==='prince'&&a>=18&&G.sit.some(s=>s.k==='war')&&chance(.05)&&!G.memo.some(m=>m.k==='warreq'&&m.from===p.id))G.memo.push({id:G.nid++,k:'warreq',t:G.t,from:p.id,txt:nmt(p)+'上書請纓，願率軍出征禦敵。',x:{}});
 else if(g==='safe'&&p.role==='prince'&&a>=18&&!p.fief&&chance(.03)&&!G.memo.some(m=>m.k==='fiefreq'&&m.from===p.id))G.memo.push({id:G.nid++,k:'fiefreq',t:G.t,from:p.id,txt:nmt(p)+'上表，願離京就藩，遠離是非。',x:{}})}
function npcAct(p){const a=age(p);const R_=p.role;if(['official','general','eunuch','consort','prince','kin'].includes(R_)&&a>=14)goalAct(p);
 if(R_==='official'||R_==='general'||R_==='eunuch'){if(a<20)return;
  if(G.debt>0)p.op=cl(p.op-.6);
  if(p.off&&p.cor>32&&!plotOf('corrupt',p.id)&&chance(.035+p.cor/1800))addPlot('corrupt',p);
  if(chance(.035*(p.tr.includes('陰險')?2:1)*(p.tr.includes('嫉妒')||p.tr.includes('野心')?1.4:1)*(1-G.fear/180))){const t=pickRival(p);if(t&&!plotOf('slander',p.id,t.id))addPlot('slander',p,t)}
  if(chance(.25)){const o=pick(alivePs().filter(x=>x.id!==p.id&&(x.role==='official'||x.role==='general'||x.role==='eunuch')));if(o)bump(p,o,ri(1,4))}
  if(p.amb>76&&(p.op<34||G.auth<28)&&(p.off==='gen'||p.off==='guard'||p.off==='chan'||(p.role==='general'&&p.st.mil>70))&&!plotOf('coup',p.id)&&chance((.012+(G.auth<25?.02:0))*(1-G.fear/220)))addPlot('coup',p);
  if(p.off&&p.off.startsWith('g_')){const r=G.reg[p.off.slice(2)];if(r.au>60&&p.amb>60&&!plotOf('secede',p.id)&&chance(.05))addPlot('secede',p)}
  if(grudge(p)>45&&p.amb>50&&chance(.01)){const t=pickRival(p);if(t&&!plotOf('slander',p.id,t.id))addPlot('slander',p,t,{revenge:true})}
  if(!p.back||!P(p.back)||!P(p.back).alive){const ps=alivePs().filter(x=>x.role==='prince'&&x.fa===G.emp&&age(x)>=3);
   if(ps.length&&chance(.2)){const t=wpick(ps,x=>10+(x.id===G.heir?30:0)+x.st.pol/4+(x.mo!=null&&P(x.mo).clan===p.clan?50:0));if(t)p.back=t.id}}
  if(p.fac==='none'&&chance(.1))p.fac=pick(['chan','clean']);
  return}
 if(R_==='consort'){p.fav=cl(p.fav-.6);if(p.fav<18&&p.op>20)p.op=cl(p.op-1.2);
  const rivals=alivePs().filter(x=>x.role==='consort'&&x.id!==p.id&&x.fav>p.fav+12);
  if(rivals.length&&chance(.045*(p.tr.includes('嫉妒')?2:1)*(p.tr.includes('陰險')?1.5:1)*(p.tr.includes('溫婉')?.4:1)*(1-G.fear/200))){
   const t=wpick(rivals,x=>x.fav+(x.kids.length?20:0));if(t&&!G.plots.some(z=>z.a===p.id&&z.tg===t.id))addPlot(chance(.18)&&(p.tr.includes('陰險')||p.amb>70)?'poison':'slander',p,t)}
  const heir=G.heir?P(G.heir):null;
  if(heir&&heir.alive&&heir.mo!==p.id&&p.kids.some(k=>P(k).alive&&P(k).role==='prince')&&p.amb>65&&chance(.012)&&!plotOf('poison',p.id,heir.id))addPlot('poison',p,heir,{why:'奪嫡'});
  if(p.op<22&&p.fav<15&&chance(.01))p.hp=cl(p.hp-10);return}
 if(R_==='prince'){if(a<14)return;const heir=G.heir?P(G.heir):null;
  if(p.id!==G.heir){
   if(chance(.3)&&p.amb>45){const o=pick(alivePs().filter(x=>x.role==='official'&&x.off));if(o){bump(o,p,ri(2,5));if(chance(.2))o.back=p.id}}
   if(heir&&heir.alive&&p.fa===G.emp&&p.amb>60&&grudge(p)+(heir?10:0)>15&&chance(.014*(1-G.fear/220))&&!plotOf('slander',p.id,heir.id))addPlot(chance(.15)&&p.amb>80?'poison':'slander',p,heir,{why:'奪嫡'});
   if(p.amb>78&&G.auth<40&&p.st.mil+p.st.sch>90&&chance(.008)&&!plotOf('coup',p.id))addPlot('coup',p,null,{prince:true});
   if(p.fief&&p.amb>68&&G.reg[p.fief].au>50&&G.auth<48&&chance(.02)&&!plotOf('rebel',p.id))addPlot('rebel',p);
  }else if(p.amb>75&&age(emp())>52&&chance(.006)&&!plotOf('coup',p.id))addPlot('coup',p,null,{prince:true,heir:true});
  return}
 if(R_==='kin'&&p.g==='M'&&a>=18){if(p.fief&&p.amb>68&&G.reg[p.fief].au>50&&G.auth<48&&chance(.02)&&!plotOf('rebel',p.id))addPlot('rebel',p)}
 if(R_==='dowager'&&G.auth<45&&p.rank>=5)G.fd.wai=cl(G.fd.wai+.05,0,35)}

function peopleMonth(){
 for(const p of alivePs()){if(!p.alive)continue;const a=age(p);
  if(p.lock>0)p.lock--;if(p.off&&typeof p.cor==='number'&&p.cor>0&&G.cz)p.cor=Math.max(0,p.cor-czm('cor'));if(p.watch>0)p.watch--;
  if(p.ill>0){p.ill++;const rec=.22+(offq('med','med')-40)*.002;
   if(chance(rec)){p.ill=0;p.hp=cl(p.hp-5);if(p.id===G.emp)log('龍體漸癒。','good')}
   else if(chance(.035+(a>55?.03:0)-(p.hp>60?.015:0))){die(p,'病逝');continue}}
  else if(chance(.004+(a>50?(a-50)*.0003:0)+(p.hp<35?.01:0))){p.ill=1;p.hp=cl(p.hp-12);
   if(p.id===G.emp){log('龍體違和，臥病不起。','warn');G.sit.push({id:G.nid++,k:'illness',pid:p.id,age:0,t0:G.t})}
   else if(['consort','prince','princess','dowager'].includes(p.role))log(nmt(p)+'染病。','warn')}
  if(G.zeit){if(G.zeit.k==='gilded'&&p.off&&chance(.04))p.cor=cl(p.cor+1);else if(G.zeit.k==='decline'&&p.id!==G.emp&&chance(.05))p.op=cl(p.op-.6)}
  p.hp=cl(p.hp+(a<40?.05:a<60?-.03:-.12)+(p.ill?-1:.03));
  const dm=a<5?.0018:a<50?.0002:.0002+Math.pow(a-50,2)*.00002;
  if(chance(dm*(p.hp<30?3:1))){die(p,a>=60?'壽終':'暴斃');continue}
  if(p.preg>0){p.preg--;if(p.preg===0)bear(p)}
  else if(p.g==='F'&&p.sp!=null&&a>=15&&a<=40&&p.role!=='consort'&&p.role!=='dowager'&&P(p.sp)&&P(p.sp).alive&&p.kids.length<5&&Object.keys(G.P).length<420&&chance(.007))conceive(p,P(p.sp));
  if(p.id!==G.emp&&a>=14&&chance(.3))npcAct(p);
  stageUpdate(p)}}

/* ---------- 陰謀與情報 ---------- */
function emitIntel(pl){const a=P(pl.a),tg=pl.tg!=null?P(pl.tg):null;let txt,sus;const fake=pl.k==='slander';
 if(fake){sus=tg.id;txt='有人密奏：'+nmt(tg)+pick(['私下結黨，言語悖逆','與外臣往來過密，似有異志','暗中怨望，口出不遜','行事僭越，疑有隱情'])+'。'}
 else{sus=a.id;txt={corrupt:()=>'風聞'+nmt(a)+(a.off?'（'+offName(a.off)+'）':'')+'貪墨成性，所轄錢糧多有虧空。',poison:()=>'宮人私語：'+nmt(a)+'近來行跡可疑，曾私下接觸藥材。',
  coup:()=>'密探回報：'+nmt(a)+'暗中聯絡舊部，夜間頻繁集會。',rebel:()=>'封地傳來消息：'+nmt(a)+'私募士卒、囤積兵甲。',secede:()=>nmt(a)+'在地方自行徵稅用人，似有自立之心。'}[pl.k]()}
 G.intel.unshift({id:G.nid++,t:G.t,plot:pl.id,sus,txt,fake});if(G.intel.length>30)G.intel.pop();log('【密報】'+txt,'warn')}
function plotsMonth(){const yu=offq('yu','sch');
 for(const pl of G.plots.slice()){const a=P(pl.a);if(!a||!a.alive){removePlot(pl);continue}
  const tg=pl.tg!=null?P(pl.tg):null;if(pl.tg!=null&&(!tg||!tg.alive)){removePlot(pl);continue}
  let leak=.03+yu*.0007+(G.inst.spy?.07:0)+(a.watch>0?.15:0)+(pl.prog/100)*.05;
  switch(pl.k){
   case'corrupt':a.cor=cl(a.cor+.4,0,95);pl.prog=a.cor;break;
   case'slander':pl.prog+=12+a.st.sch/9;break;
   case'poison':pl.prog+=7+a.st.sch/11;break;
   case'coup':{let r=2.5+a.amb/40;if(G.auth>55)r-=3;if(G.fear>60)r-=1;pl.prog=cl(pl.prog+r,0,130);break}
   case'rebel':{if(!a.fief){removePlot(pl);continue}pl.prog=cl(pl.prog+2+a.amb/40-(G.auth>50?3:0),0,130);break}
   case'secede':{const rg=a.off&&a.off.startsWith('g_')?G.reg[a.off.slice(2)]:null;if(!rg){removePlot(pl);continue}pl.prog=cl(pl.prog+(rg.au-45)/4,0,130);break}
   case'regain':leak=.03+yu*.0004;break}
  if(!pl.rep&&pl.k!=='regain'&&chance(leak)){pl.rep=true;emitIntel(pl)}
  if(pl.prog>=100&&pl.k!=='corrupt'&&pl.k!=='regain')execPlot(pl)}}
function execPlot(pl){const a=P(pl.a),tg=pl.tg!=null?P(pl.tg):null;removePlot(pl);
 switch(pl.k){
  case'slander':tg.fav=cl(tg.fav-22);a.fav=cl(a.fav+5);memo_(tg,'slandered',-8,'遭'+nm(a)+'構陷，聖眷衰減。',a.id);bump(tg,a,-35);
   if(tg.role==='prince'&&tg.id===G.heir)tg.op=cl(tg.op-8);log(nmt(tg)+'近來似乎失了聖眷，宮中傳言紛紛。');break;
  case'poison':{tg.hp=cl(tg.hp-ri(25,50));bump(tg,a,-50);
   if(chance(.35+(tg.hp<35?.3:0))){const tgName=nmt(tg);die(tg,'中毒暴斃');chron(tgName+'暴斃，疑為人所害。',3,[tg.id]);
    const sus=[a.id];for(const c of shuffle(alivePs().filter(x=>x.role==='consort'&&x.id!==a.id&&x.id!==tg.id)).slice(0,2))sus.push(c.id);
    G.sit.push({id:G.nid++,k:'case',kind:'poison',real:a.id,sus:shuffle(sus),ev:20,age:0,t0:G.t,txt:tgName+'暴斃，死因可疑，需追查真兇。',victim:tg.id})}
   else{tg.ill=tg.ill||1;log(nmt(tg)+'忽然重病，太醫束手。','warn')}break}
  case'coup':doCoup(a,pl);break;
  case'rebel':{const r=G.reg[a.fief];startRevolt(r,{leader:a.id,name:nmt(a)+'之亂',S:35+a.st.mil/3+r.garr*3,prince:true});chron(nmt(a)+'在封地舉兵反叛！',3,[a.id]);break}
  case'secede':{const r=G.reg[a.off.slice(2)];r.sec=true;r.au=100;G.sit.push({id:G.nid++,k:'secession',reg:r.id,gov:a.id,age:0,t0:G.t});chron(r.n+'州牧'+nm(a)+'擁地自立，割據一方！',3,[a.id]);break}}}
function doCoup(a,pl){const guard=holder('guard');
 const atk=a.st.mil*.6+a.st.sch*.4+((a.off==='gen'||a.role==='general')?20:0)+(pl.prince?G.pow.army*.4:0)+G.pow[facOf(a)]*.6+(a.off==='guard'?40:0)+ri(-18,18);
 const def=G.auth*.9+(guard&&guard.id!==a.id?guard.op*.5+guard.st.mil*.3:15)+(G.fear>50?10:0)+G.rep*.2;
 if(atk<=def){chron(nmt(a)+'謀逆事敗，被誅。',3,[a.id]);G.reign.purges++;kill(a,'誅','謀逆');G.rep=cl(G.rep+4);return}
 chron(nmt(a)+'發動宮廷政變，控制了皇宮！',3,[a.id]);coupSuccess(a,pl)}
function coupSuccess(a,pl){const e=emp();
 if(a.role==='prince'||a.role==='kin'||pl&&pl.prince){G.force=a.id;G.coupBy=a.id;chron(nmt(e)+'被迫遜位，'+nmt(a)+'登基。',3,[e.id,a.id]);die(e,'被廢，崩於幽禁');return}
 const cand=alivePs().filter(p=>p.sur===IMPSUR&&p.g==='M'&&p.id!==e.id&&p.role!=='emp'&&p.title!=='先帝'&&(p.role==='prince'||p.role==='kin')&&age(p)<30);
 if((!cand.length||G.auth<10&&chance(.4))&&chance(.7)){G.over={type:'usurp',txt:nmt(a)+'廢帝自立，改朝換代。'};chron(G.over.txt,3);e.alive=false;e.dod=G.t;bio(e,'被廢而終。');return}
 const pup=cand.length?pick(cand):null;if(!pup){G.over={type:'usurp',txt:nmt(a)+'廢帝自立，改朝換代。'};chron(G.over.txt,3);e.alive=false;return}
 G.force=pup.id;G.coupBy=a.id;chron(nmt(a)+'廢黜'+nmt(e)+'，另立'+nm(pup)+'為帝，自為攝政。',3,[e.id,a.id]);die(e,'被廢，崩於幽禁')}

/* ---------- 外交與戰爭 ---------- */
function startWar(f){const rg=Object.values(G.reg).find(r=>r.foe===f.k);if(!rg)return;
 const s={id:G.nid++,k:'war',foe:f.k,reg:rg.id,E:f.str*.25,force:0,gen:null,front:0,age:0,t0:G.t};G.sit.push(s);f.war=s.id;chron(f.n+'犯'+rg.n+'邊境，烽火驟起！',3)}
function startRevolt(r,o){const s={id:G.nid++,k:'revolt',reg:r.id,S:o.S,name:o.name,leader:o.leader||null,prince:!!o.prince,force:0,gen:null,front:0,age:0,t0:G.t};G.sit.push(s);r.rebel=(r.rebel||0)+1;G.reign.revolt++;return s}
function foreignMonth(){
 for(const k in G.foe){const f=G.foe[k];
  f.str=cl(f.str+rr(-1.2,1.3)+(f.str<40?.3:0)-(f.str>85?.8:0),15,100);f.att=cl(f.att+(f.att>0?-.3:.3));
  if(f.vas&&f.str>70&&chance(.01)){f.vas=false;chron(f.n+'不再朝貢，叛離藩屬。',2)}
  if(!f.ruler)f.ruler=pick(GM)+pick(GM2)+(k==='di'?'可汗':'王');
  if(chance(.0035)){const old=f.ruler;f.ruler=pick(GM)+pick(GM2)+(k==='di'?'可汗':'王');f.str=cl(f.str-9);chron(f.n+old+'病逝，諸子爭位，新主'+f.ruler+'即位，國力受損。',2)}
  else if(f.str<60&&chance(.0025)){f.str=cl(f.str-14);f.att=cl(f.att+10);chron(f.n+'內亂，諸部相攻，國力大損。',2)}
  else if(f.str<75&&chance(.0025)){f.str=cl(f.str+12);f.att=cl(f.att-12);chron(f.n+'出現雄主，統一諸部，聲勢復振。',3)}
  const rg=Object.values(G.reg).find(r=>r.foe===k);if(!f.war&&rg){
   const garr=rg.garr+G.army*.15;const risk=((f.str-garr*3)*.0012+(-f.att)*.0006)*.6+(G.auth<30?.006:0)+(G.army<25?.008:0);
   if(!f.vas&&chance(Math.max(0,risk)*Math.max(.3,1-czm('raid'))))startWar(f)}}}
function defaultGen(){return holder('gen')||alivePs().filter(p=>p.role==='general'&&age(p)>=22).sort((a,b)=>b.st.mil-a.st.mil)[0]||null}
function fightMonth(s,r){const gen=s.gen&&P(s.gen)&&P(s.gen).alive?P(s.gen):(s.k==='revolt'?holder('g_'+r.id):defaultGen());const gm=gen?gen.st.mil:36;
 let F=s.force||(r.garr+G.army*.2);F=Math.min(F,Math.max(2,G.army));if(s.emp)F*=1.2;
 const far=['he','long','ling'].includes(r.id)&&s.k==='war';let sup=(G.tre>-50&&r.food>20&&G.debt<3)?1:.75;
 if(far&&s.age>5&&(r.proj||0)<4){sup*=.88;if(!s.supLog){s.supLog=1;log('糧道漫長，前線補給吃緊。（修築驛道可緩解）','warn')}}
 const our=F*(1+czm('war'))*(G.morale/60)*(.6+gm/90)*sup*({plain:1,coast:1,mount:1.2,steppe:.92}[r.ter]||1)*(s.emp?1.25:1);
 const E=s.k==='war'?s.E:s.S*.12;const en=E*(s.k==='revolt'?.85:1);const diff=(our-en)/(our+en+.1);
 s.front=cl(s.front+diff*28+rr(-7,7),-100,100);const lr=en/(our+en+.1);
 if(chance(.3)){const nn=s.k==='war'?G.foe[s.foe].n:s.name;if(diff>.25)log('官軍在'+r.n+'連戰告捷，'+(gen?nm(gen)+'指揮得當，':'')+'斬獲頗眾。');else if(diff<-.25)log(r.n+'戰局不利，'+nn+'攻勢兇猛，官軍後撤整補。','warn')}
 G.army=Math.max(3,G.army-F*.035*lr*(s.k==='revolt'?1:1.3));
 if(s.k==='war')s.E=Math.max(2,s.E-s.E*.06*(1-lr)*1.6);else s.S=Math.max(0,s.S-(diff>0?diff*8:0)+(diff<0?-diff*3:0));
 r.un=cl(r.un+.4);r.pr=cl(r.pr-.25);r.pop-=r.pop*.0009;if(gen)gen.pst=(gen.pst||0)+(diff>0?1:-.3);G.morale=cl(G.morale+(diff>0?.6:-1));
 if(s.emp){s.empT=(s.empT==null?4:s.empT)-1;if(chance(.02)){const e=emp();e.hp=cl(e.hp-30);e.ill=e.ill||1;log('皇帝在陣前負傷！','warn')}if(s.empT<=0)s.emp=false}return gen}
function sitMonth(){
 for(const s of G.sit.slice()){s.age++;const r=s.reg?G.reg[s.reg]:null;
  if(s.k==='disaster'){r.food=cl(r.food-4.5*s.sev*(1-s.relief*.6));r.un=cl(r.un+.8*s.sev);r.pop-=r.pop*.0012*s.sev*(1-s.relief*.5);
   if(s.age>=s.dur){s.done=true;if(s.relief===0&&s.sev>=2){G.reign.famine++;G.mind=cl(G.mind-3);chron(r.n+'遭'+s.kind+'，朝廷未加賑濟，餓殍載道。',3)}
    else if(s.relief>0){G.mind=cl(G.mind+2);log(r.n+'的'+s.kind+'已平息，賑濟有方，民心稍安。','good')}else log(r.n+'的'+s.kind+'已過。')}}
  else if(s.k==='war'||s.k==='revolt'){const gen=fightMonth(s,r);const f=s.k==='war'?G.foe[s.foe]:null;
   if(s.k==='war'){
    if(s.front>=70){s.done=true;f.war=null;f.str=cl(f.str-10);f.att=cl(f.att+5);G.reign.wins++;G.rep=cl(G.rep+4);G.mind=cl(G.mind+2);if(gen)gen.pst+=8;chron('大破'+f.n+'於'+r.n+'，邊患暫平。',3,gen?[gen.id]:[]);if(gen)bio(gen,'統兵大破'+f.n+'於'+r.n+'。');
     if(gen&&gen.id!==G.emp&&chance(.6))G.memo.push({id:G.nid++,k:'merit',t:G.t,from:gen.id,txt:nm(gen)+'奏報大捷，請論功行賞。',x:{}})}
    else if(s.front<=-70){s.done=true;f.war=null;f.str=cl(f.str+4);f.att=cl(f.att-8);f.hist++;r.pr=cl(r.pr-10);r.pop*=.97;r.food=cl(r.food-15);G.reign.losses++;G.rep=cl(G.rep-6);G.mind=cl(G.mind-3);G.morale=cl(G.morale-10);if(gen)gen.op=cl(gen.op-8);chron(r.n+'邊鎮失守，'+f.n+'大掠而去。',3)}
    else if(s.age>14){s.done=true;f.war=null;f.att=cl(f.att+10);log(f.n+'與我軍久戰無功，各自罷兵。')}}
   else{
    s.S=cl(s.S+(r.un-55)*.06+.3,0,140);
    if(s.S<=4||s.front>=75){s.done=true;r.rebel=Math.max(0,(r.rebel||1)-1);G.reign.wins++;G.rep=cl(G.rep+3);if(gen){gen.pst+=6;bio(gen,'平定'+r.n+s.name+'。')}chron('平定'+r.n+s.name+'。',3);if(s.sec){r.sec=false;r.au=45;r.vas=false}if(s.leader&&P(s.leader)&&P(s.leader).alive){kill(P(s.leader),'誅','謀反')}
     r.un=cl(r.un-15)}
    else if(s.front<=-70){s.S+=14;s.front=-25;for(const o of Object.values(G.reg))if(o!==r&&chance(.4))o.un=cl(o.un+5);log(s.name+'聲勢更盛，官軍失利。','warn')}}}
  else if(s.k==='secession'){r.sec=true;r.au=100;if(!P(s.gov)||!P(s.gov).alive){s.done=true;r.sec=false;r.au=40;G.reg[s.reg].vas=false;log(r.n+'割據者已亡，局勢重歸朝廷。')}}
  else if(s.k==='crisis'){G.fd[s.f]=cl(G.fd[s.f]+.4,0,35);if(G.pow[s.f]<35||s.age>36)s.done=true}
  else if(s.k==='case'){if(s.age>9)s.done=true}
  else if(s.k==='illness'){const p=P(s.pid);if(!p.alive||!p.ill)s.done=true}}
 G.sit=G.sit.filter(s=>!s.done)}
function spawnEvents(){
 if(chance(.06)){const r=pick(Object.values(G.reg));if(!G.sit.some(s=>s.k==='disaster'&&s.reg===r.id)){
  const kinds={plain:['旱災','水患','蝗災'],coast:['海溢','水患','風災'],mount:['山洪','瘟疫','地動'],steppe:['雪災','旱災','瘟疫']}[r.ter];const sev=wpick([1,2,3],x=>[0,5,3,1.2][x]);
  const kind=pick(kinds);G.sit.push({id:G.nid++,k:'disaster',reg:r.id,kind,sev,dur:ri(3,6),age:0,relief:0,t0:G.t});log(r.n+'發生'+kind+'，災情'+['','輕微','嚴重','極為嚴重'][sev]+'。','warn')}}
 for(const r of Object.values(G.reg)){if(r.un>78&&!G.sit.some(s=>s.k==='revolt'&&s.reg===r.id)&&!r.sec&&chance(.1)){startRevolt(r,{S:25+(r.un-70)*1.5,name:pick(['白蓮','赤眉','黃巾','青巾','紅襖'])+'之亂'});chron(r.n+'爆發民變，'+G.sit[G.sit.length-1].name+'聲勢漸起。',3)}}
 for(const f of['chan','eun','wai','army','clean'])if(G.pow[f]>46&&!((G.cool||{})[f]>G.t)&&!G.sit.some(s=>s.k==='crisis'&&s.f===f)&&chance(.25)){G.sit.push({id:G.nid++,k:'crisis',f,age:0,t0:G.t});log('朝中'+FAC[f].n+'勢力坐大，隱隱有凌駕君上之勢。','warn')}}

/* ---------- 奏摺 ---------- */
function vacantOffs(){return allOffIds().filter(o=>!G.off[o])}
function addMemo(k){const id=G.nid++;const m={id,k,t:G.t,from:null,txt:'',x:{}};const rs=Object.values(G.reg);
 if(k==='relief'){const c=rs.filter(r=>r.food<38&&!r.sec&&!G.memo.some(z=>z.k==='relief'&&z.x.reg===r.id));if(!c.length)return null;const r=pick(c);const g=holder('g_'+r.id);m.x.reg=r.id;m.from=g?g.id:null;m.txt=r.n+'糧儲告急（存糧指數'+rd(r.food)+'），'+(g?nmt(g):'地方官')+'奏請開倉賑濟。'}
 else if(k==='taxup'){const h=holder('hu');if(!h)return null;m.from=h.id;m.txt='戶部尚書'+nm(h)+'奏：國庫僅餘'+rd(G.tre)+'萬兩，入不敷出，請加徵賦稅或另謀開源。'}
 else if(k==='impeach'){const y=holder('yu');const c=alivePs().filter(p=>p.off&&p.id!==(y&&y.id)&&p.role!=='eunuch'||false);if(!y||!c.length)return null;const x=wpick(c,z=>5+z.cor+(relOf(y,z)<-15?25:0));if(!x)return null;
  m.from=y.id;m.x.tg=x.id;m.x.guilty=!!plotOf('corrupt',x.id);m.txt='御史大夫'+nm(y)+'彈劾'+nmt(x)+'（'+offName(x.off)+'）'+pick(['貪墨舞弊','結黨營私','怠慢政務','縱容親族'])+'，請旨嚴查。'}
 else if(k==='recommend'){const v=vacantOffs();if(!v.length)return null;const o=pick(v);const od=offDef(o);const li=holder('li');
  const pool=alivePs().filter(p=>!p.off&&(od.role?p.role===od.role:p.role==='official')&&age(p)>=25);if(!pool.length)return null;const c=wpick(pool,p=>p.st[od.s]+(p.fac===topFac()?15:0)+ri(0,20));
  m.from=li?li.id:null;m.x={off:o,cand:c.id};m.txt=(li?'吏部尚書'+nm(li):'吏部')+'奏：'+od.n+'一職出缺，舉薦'+nmt(c)+'（'+FAC[c.fac].n+'，'+STN[od.s]+rd(c.st[od.s])+'）補任。'}
 else if(k==='heir'){const ps=alivePs().filter(p=>p.role==='prince'&&p.fa===G.emp&&age(p)>=1);if(G.heir||!ps.length)return null;const rt=holder('rite');m.from=rt?rt.id:null;m.txt='禮部奏：國本未立，人心浮動，請儲位早定。'}
 else if(k==='select'){const rt=holder('rite');m.from=rt?rt.id:null;m.txt='禮部奏：後宮空虛，請依例開選秀女，以廣皇嗣、安人心。'}
 else if(k==='project'){const kind=pick(['canal','canal','granary','road','wall']);const r=pick(rs.filter(x=>!x.sec));const hu=holder('hu');
  const cost={canal:120,granary:70,road:80,wall:90}[kind];const nmk={canal:'興修水利',granary:'增建常平倉',road:'修築驛道',wall:'加固邊塞城防'}[kind];
  if(kind==='wall'&&!r.foe)return null;m.from=hu?hu.id:null;m.x={k:kind,reg:r.id,cost,dur:12};m.txt=(hu?nm(hu):'工部')+'奏請於'+r.n+nmk+'，預計耗銀'+cost+'萬兩、歷時一年。'}
 else if(k==='merit'){const g=alivePs().filter(p=>p.role==='general'&&(p.pst||0)>=6&&age(p)>=22);if(!g.length)return null;const x=pick(g);m.from=x.id;m.txt=nmt(x)+'自陳戰功赫赫，請朝廷論功行賞。'}
 else if(k==='marry'){const c=alivePs().filter(p=>p.role==='prince'&&age(p)>=15&&age(p)<=30&&p.sp==null);const mai=alivePs().filter(p=>p.role==='maiden'&&age(p)>=15&&age(p)<=24&&p.sp==null);if(!c.length||!mai.length)return null;
  const pr=pick(c);const w=wpick(mai,x=>10+(x.clan!=null?G.clans[x.clan].pw:0));const f=w.fa!=null?P(w.fa):null;m.from=f&&f.alive?f.id:null;m.x={a:pr.id,b:w.id};m.txt=(f&&f.alive?nmt(f):w.sur+'氏')+'上表，願以愛女'+nm(w)+'配與'+nmt(pr)+'，結兩姓之好。'}
 else if(k==='retire'){const c=alivePs().filter(p=>p.off&&age(p)>=64&&p.role!=='eunuch');if(!c.length)return null;const x=pick(c);m.from=x.id;m.x.tg=x.id;m.txt=nmt(x)+'（'+offName(x.off)+'）年'+age(x)+'，上表乞骸骨。'}
 else if(k==='envoy'){const fs=Object.values(G.foe);const f=pick(fs);if(f.war)return null;
  const kind=f.vas?null:(f.att>15?'trade':(f.str<48&&f.att<10)?'tribute':f.str>62?'marry':'trade');if(!kind||(kind==='trade'&&f.trade))return null;m.x={foe:f.k,kind};
  m.txt=f.n+'使節入朝，'+{trade:'請求開市通商',tribute:'願稱臣納貢，乞求冊封',marry:'請求和親，結為姻好'}[kind]+'。'}
 else if(k==='festival'){m.x={m:G.t%12+1};m.txt={1:'元日將至，禮部請問今歲朝賀慶典規格。',8:'中秋佳節在即，宮中請旨如何設宴。',11:'冬至將近，禮部請問祭天與宴賞之儀。'}[G.t%12+1]||'節慶將近，請旨設宴。'}
 else if(k==='omen'){const r=pick(rs);m.txt=r.n+'奏報出現'+pick(['麒麟','嘉禾','甘露','白鹿','五色祥雲'])+'，群臣紛紛上表請賀。'}
 else if(k==='complaint'){const c=rs.filter(r=>{const g=holder('g_'+r.id);return g&&g.cor>45&&!r.sec});if(!c.length)return null;const r=pick(c);const g=holder('g_'+r.id);m.x={reg:r.id,gov:g.id};m.txt=r.n+'百姓遠赴京城告御狀，狀告州牧'+nmt(g)+'橫徵暴斂。'}
 else if(k==='dispute'){const fs=shuffle(['chan','clean','army','wai','eun']);const A=facLeader(fs[0]),B=facLeader(fs[1]);if(!A||!B||A.id===B.id)return null;const topic=pick(['鹽鐵專賣之利','科舉取士之制','邊疆用兵方略','宮廷用度之議','官員考課之法']);m.x={a:A.id,b:B.id,topic};m.txt=nmt(A)+'（'+FAC[A.fac==='none'?fs[0]:facOf(A)].n+'）與'+nmt(B)+'（'+FAC[facOf(B)].n+'）在朝堂上為'+topic+'爭執不下，請聖裁。'}
 else if(k==='mutiny'){m.txt='軍餉久欠，邊軍與京營怨聲載道，兵部奏請速決。'}
 else if(k==='scholar'){const c=alivePs().filter(p=>p.role==='official'&&p.st.lit>70);if(!c.length)return null;const x=pick(c);m.from=x.id;m.x.tg=x.id;m.txt='大儒'+nmt(x)+'獻上畢生所著《經世論》，朝野稱頌，請皇帝御覽。'}
 else if(k==='dowager'){const d=alivePs().filter(p=>p.role==='dowager'&&p.rank>=5&&p.clan!=null);if(!d.length)return null;const x=pick(d);const mai=alivePs().filter(p=>p.role==='maiden'&&p.clan===x.clan&&age(p)>=14&&p.sp==null);if(!mai.length)return null;m.from=x.id;m.x={girl:mai[0].id};m.txt=nmt(x)+'懿旨：母家'+nm(mai[0])+'賢淑可嘉，欲召入宮中為妃，以親上加親。'}
 else return null;
 G.memo.push(m);return m}
function genMemos(){const n=(chance(.8)?1:0)+(chance(.45)?1:0);
 for(let i=0;i<n;i++){const o=[];
  if(Object.values(G.reg).some(r=>r.food<38&&!r.sec))o.push(['relief',4]);
  if(G.tre<200)o.push(['taxup',3]);
  o.push(['impeach',2],['recommend',vacantOffs().length?4:0],['project',1.2],['merit',1],['marry',1],['retire',1],['envoy',1.2],['omen',.8],['dispute',1.3],['scholar',.7],['complaint',1.2],['dowager',.7]);
  if(G.debt>0||G.morale<32)o.push(['mutiny',3]);
  if(!G.heir&&alivePs().some(p=>p.role==='prince'&&p.fa===G.emp&&age(p)>=2))o.push(['heir',3]);
  if(alivePs().filter(p=>p.role==='consort').length<7&&G.t-(G.lastSel||-99)>30)o.push(['select',1.5]);
  const k=wpick(o,x=>x[1]);if(k)addMemo(k[0])}
 const m=G.t%12+1;if((m===1||m===8||m===11)&&!G.memo.some(z=>z.k==='festival'))addMemo('festival')}
function memoMonth(){
 for(const m of G.memo.slice()){if(G.t-m.t>=6){G.memo=G.memo.filter(z=>z!==m);const f=m.from?P(m.from):null;if(f&&f.alive)f.op=cl(f.op-2);
  if(m.k==='relief'&&G.reg[m.x.reg]&&chance(.5)){G.reg[m.x.reg].food=cl(G.reg[m.x.reg].food-8);log('奏摺久未批覆，'+G.reg[m.x.reg].n+'存糧更趨窘迫。','warn')}
  if(m.k==='recommend'){}
  G.fd.chan=cl(G.fd.chan+.4,0,35)}}
 genMemos()}
function vacancyMonth(){G.vac=G.vac||{};
 for(const o of allOffIds()){if(G.off[o]){G.vac[o]=0;continue}G.vac[o]=(G.vac[o]||0)+1;
  if(G.vac[o]>=(G.auth<45?3:7)){const od=offDef(o);const tf=topFac();const pool=alivePs().filter(p=>!p.off&&(od.role?p.role===od.role:p.role==='official')&&age(p)>=25&&!p.exile);
   if(!pool.length)continue;const c=wpick(pool,p=>p.st[od.s]+(p.fac===tf?30:0)+ri(0,15));if(!c)continue;appointRaw(o,c);G.vac[o]=0;mem_gain(c);
   log(od.n+'久懸未決，'+FAC[tf].n+'推舉'+nmt(c)+'署理。')}}}
function mem_gain(c){c.op=cl(c.op+3)}

/* ---------- 年度 ---------- */
function exam(pol){pol=pol||'poor';const n=3+(G.inst.acad?3:0)+(G.inst.cab?1:0)+Math.round(czm('exam'));let best=null;const PB={gate:{pol:6,lit:6},poor:{pol:10,lit:12},real:{pol:16,lit:2}}[pol];
 for(let i=0;i<n;i++){const c=newClan(pick(SURN),pol==='gate'?'chan':'clean',pol!=='gate');const p=newMan(c.id,21,32,'official',{bias:{pol:PB.pol+(G.inst.acad?10:0),lit:PB.lit},op:ri(58,78)});if(pol==='gate'){p.cor=cl((p.cor||40)+14);p.amb=cl((p.amb||50)+8)}else if(pol==='poor'){p.cor=cl((p.cor||40)-10)}else{p.st.sch=cl(p.st.sch+6)}p.disc=emp().id;c.m.push(p.id);
  memo_(p,'exam',8,'蒙皇恩取士，感念知遇。');bio(p,'登進士第，授候補。');if(!best||p.st.lit+p.st.pol>best.st.lit+best.st.pol)best=p}
 chron('開科取士（'+({gate:'重門第',poor:'取寒門',real:'重實學'}[pol])+'），錄進士'+n+'人，狀元'+nm(best)+'。',2,[best.id]);G.xl=G.xl||[];G.xl.push({t:G.t,pol,n});if(pol==='gate'){G.fd.chan=cl(G.fd.chan+3,0,35);G.mind=cl(G.mind-1);for(const p of alivePs())if(p.off&&facOf(p)==='clean')p.op=cl(p.op-2)}else if(pol==='poor'){G.fd.clean=cl(G.fd.clean+3,0,35);G.mind=cl(G.mind+1);for(const p of alivePs())if(p.off&&facOf(p)==='chan')p.op=cl(p.op-3)}else{G.reform=(G.reform||0)+1;G.tre+=30*G.reform>150?150:30*G.reform;for(const p of alivePs())if(p.off&&p.role==='official'&&p.st.lit>70)p.op=cl(p.op-1)}}
const ZN={plain:'平世',gilded:'盛世驕奢',decline:'末世衰微',martial:'尚武之世',revival:'中興'};
function eraTrait(){G.mh=G.mh||[];G.mh.push(G.mind);if(G.mh.length>12)G.mh.shift();const avg=G.mh.reduce((a,b)=>a+b,0)/G.mh.length;const z=G.zeit?G.zeit.k:'plain';let nz='plain';
 if(G.mh.length>=8&&avg>=70&&G.tre>400)nz='gilded';else if(G.mh.length>=4&&(avg<38||G.debt>6))nz='decline';else if(G.reign.wins>=3&&G.reign.wins>G.reign.losses)nz='martial';else if(z==='decline'&&G.mind>=58)nz='revival';
 if(nz!==z){G.zeit={k:nz,t:G.t};chron({gilded:'天下承平日久，朝野漸尚奢靡，盛世之下暗藏隱憂。',decline:'國勢日蹙，綱紀廢弛，朝野瀰漫末世氣象。',martial:'連年用武，尚武之風盛行於朝野。',revival:'休養生息，國勢漸復，有中興之象。',plain:'時勢轉平，天下復歸常態。'}[nz],3)}}
function snapRec(){if(!G.snap)G.snap=[];const e=emp();G.snap.push({t:G.t,pow:Object.assign({},G.pow),auth:Math.round(G.auth),mind:Math.round(G.mind),rep:Math.round(G.rep),tre:Math.round(G.tre),en:nm(e),era:G.era.n});if(G.snap.length>240)G.snap.shift()}
const CHAPT={'初登大寶':'新君甫立，朝野皆在觀望，一言一行都將被記下。','邊烽四起':'烽火自邊境燃起，朝堂之上，主戰與主和之聲不絕。','烽火遍地':'民變與兵禍並起，天下已有不安之象。','盛世煙花':'倉廩充實，歌舞昇平，只是無人記得太平從何而來。','日薄西山':'綱紀漸弛，人心浮動，朝野都隱隱覺得，一個時代正在落幕。','中興氣象':'積弊漸去，國勢回升，老臣們開始小心翼翼地說出「有望」二字。','權柄之爭':'朝中有人坐大，殿上的目光，比言語更鋒利。','暮年':'燭火漸短，皇帝開始回頭看自己走過的路，也開始被人回頭看。','守成歲月':'無大功，亦無大過。史官的筆在這幾年裏落得很輕。','簾下之君':'政令出自他人之手，皇帝只是殿上的一個名字。'};
function chapterTitle(){const e=emp();const war=G.sit.some(s=>s.k==='war'),rev=G.sit.some(s=>s.k==='revolt');const z=G.zeit&&G.zeit.k;
 if(G.puppet)return '簾下之君';if(war&&rev)return '烽火遍地';if(war)return '邊烽四起';if(rev)return '烽火遍地';if(G.sit.some(s=>s.k==='crisis'))return '權柄之爭';
 if(z==='gilded')return '盛世煙花';if(z==='decline')return '日薄西山';if(z==='revival')return '中興氣象';if(age(e)>=52)return '暮年';return '守成歲月'}
function chapterStart(alert){const e=emp();G.chaps=G.chaps||[];G.chap={t:G.t,title:'初登大寶',n:1};G.chaps.push({t:G.t,emp:e.id,n:1,title:'初登大寶'});if(alert)ALERTS.push({t:G.t,txt:CHAPT['初登大寶'],chap:{n:1,title:'初登大寶',emp:nm(e)}})}
function chapterCheck(){if(!G.chap)return;if((G.t-G.chap.t)/12<3)return;const t=chapterTitle();if(t===G.chap.title)return;const e=emp();const prev=G.chap;const n=prev.n+1;
 G.chap={t:G.t,title:t,n};G.chaps.push({t:G.t,emp:e.id,n,title:t});chron('〔第'+cn(n)+'章〕'+t+'。',2);ALERTS.push({t:G.t,txt:CHAPT[t]||'',chap:{n,title:t,emp:nm(e),prev:prev.title,yrs:Math.round((G.t-prev.t)/12)}})}
function yearEnd(){G.weather=rr(.72,1.15);if(G.weather<1)G.weather=1-(1-G.weather)*(1-Math.min(.6,czm('relief')));eraTrait();snapRec();chapterCheck();achCheck();marryYear();growthYear();if((G.t/12)%3===0)examYear();refreshClans();
 for(const p of alivePs()){if(p.id===G.emp)continue;p.op=cl(p.op+(50-p.op)*.04);for(const k of Object.keys(p.rel)){const o=P(k);if(!o||!o.alive)delete p.rel[k]}}
 G.lastYear={tre:G.tre,mind:G.mind,pop:Object.values(G.reg).reduce((a,r)=>a+r.pop,0)}}

/* ---------- 終局與繼位 ---------- */
function fall(why){G.over={type:'fall',txt:why};chron('王朝覆滅：'+why+'。',3);const e=emp();e.alive=false;e.dod=G.t;
 const v=judgeReign(e,true);G.emps[G.emps.length-1].v=v;G.emps[G.emps.length-1].t1=G.t;G.emps[G.emps.length-1].cause='亡國';if(v.asp){chron('史官論其志：'+v.asp.txt,3);G.asp=null}}
function checkEnd(){if(G.over)return;
 const revs=G.sit.filter(s=>s.k==='revolt');
 if(revs.some(s=>s.S>=100||(s.S>=62&&s.reg==='jing'))||revs.reduce((a,s)=>a+s.S,0)>=270)return fall('義軍攻破京師，皇帝出奔');
 if(Object.values(G.reg).filter(r=>r.sec).length>=4)return fall('諸州相繼自立，天下分崩離析');
 if(G.debt>30&&G.mind<10)return fall('國庫枯竭、軍民離心，朝廷土崩瓦解')}
const TEMPLE={sage:['明君','仁宗'],warrior:['雄主','武宗'],revive:['中興之主','中宗'],tyrant:['暴君','厲帝'],fool:['昏君','幽帝'],puppet:['傀儡之君','哀帝'],normal:['守成之君','憲宗'],fall:['亡國之君','末帝']};
const KEYORD=['tyrant','fool','puppet','fall','normal','revive','warrior','sage'];
function judgeReign(e,fell){const r=G.reign;const n=Math.max(1,r.n);const am=r.authSum/n,mm=r.mindSum/n;const yrs=Math.round((G.t-r.t0)/12);let key='normal';
 if(fell)key='fall';else if(am<26&&yrs>2)key='puppet';else if((r.exec>=7&&G.fear>55)||r.purges>=5&&mm<50)key='tyrant';else if(mm<40&&G.rep<40)key='fool';
 else if(mm>=66&&G.tre>250&&am>=42)key='sage';else if(r.wins>=3&&r.wins>=r.losses*2)key='warrior';else if(r.m0<48&&mm>=57)key='revive';
 let temple=r.founder&&!fell?'太祖':TEMPLE[key][1];const cnt=G.emps.filter(x=>x.v&&x.v.temple===temple).length;
 const asp=aspEval(e,fell,key,mm,am,yrs);
 return{key,asp,label:TEMPLE[key][0],temple:temple+(cnt?'（'+cn(cnt+1)+'）':''),official:key,edited:false,yrs,mm:rd(mm),am:rd(am),wins:r.wins,losses:r.losses,exec:r.exec,famine:r.famine}}
function succeed(cause){const old=emp();const rec=G.emps[G.emps.length-1];rec.t1=G.t;rec.cause=cause;
 const v=judgeReign(old,false);const ht=holder('hist');
 if(G.editHist>0){const i=KEYORD.indexOf(v.key);v.official=KEYORD[Math.min(KEYORD.length-1,i+2)];v.edited=true;G.editHist=0}
 else if(ht&&ht.op<25){const i=KEYORD.indexOf(v.key);v.official=KEYORD[Math.max(0,i-1)];v.hostile=true}
 rec.v=v;metaUnlock('v',v.key);old.title=v.temple;old.role='kin';
 for(const x of G.emps){if(x!==rec&&x.v&&x.v.edited&&!x.v.revised&&chance(.35)){x.v.revised=true;x.v.official=x.v.key;chron('史官重修實錄，為'+nm(P(x.pid))+'翻案，史書更正。',2)}}
 chron(nm(old)+cause+'，上廟號「'+v.temple+'」，史稱'+v.label+(v.official!==v.key?'（官修史書則作「'+TEMPLE[v.official][0]+'」）':'')+'。',3,[old.id]);
 if(v.asp)chron('史官論其志：'+v.asp.txt,3,[old.id]);G.asp=null;
 let nxt=null;
 if(G.force&&P(G.force)&&P(G.force).alive)nxt=P(G.force);
 else if(G.heir&&P(G.heir)&&P(G.heir).alive)nxt=P(G.heir);
 else{const ps=alivePs().filter(p=>(p.role==='prince'||p.role==='kin')&&p.g==='M'&&p.sur===IMPSUR&&p.id!==old.id&&p.title!=='先帝'&&age(p)<75);
  const sons=ps.filter(p=>p.fa===old.id);const pool=sons.length?sons:ps;nxt=wpick(pool,x=>8+supOf(x)+(sons.length?age(x)/3:age(x)/6));}
 const forced=!!G.force;const coupBy=G.coupBy;G.force=null;G.coupBy=null;
 if(!nxt){G.over={type:'extinct',txt:'皇室血脈斷絕，無人繼承大統，天下大亂。'};chron(G.over.txt,3);return}
 // 轉換身分
 const oldMo=nxt.mo!=null?P(nxt.mo):null;
 for(const c of alivePs()){if(c.role==='consort'&&c.sp===old.id){c.role='dowager';c.title=c.rank>=6?'皇太后':'太妃';c.sp=old.id;}}
 if(oldMo&&oldMo.alive){oldMo.role='dowager';oldMo.title='太后';oldMo.rank=5;oldMo.fac='wai'}
 nxt.role='emp';nxt.title='';G.emp=nxt.id;vacate(nxt);nxt.fav=50;
 if(nxt.sp!=null){const w=P(nxt.sp);if(w&&w.alive&&(w.role==='wife'||w.role==='maiden')){w.role='consort';w.rank=6;w.fav=60;w.title='';bio(w,'冊為皇后。');chron(nm(w)+'冊為皇后。',2,[w.id])}else nxt.sp=null}
 for(const kid of nxt.kids){const k=P(kid);if(k&&k.alive){k.role=k.g==='M'?'prince':'princess';k.fac='kin'}}
 for(const o of alivePs()){if(o.id===nxt.id)continue;const supp=o.back===nxt.id;
  if(['official','general','eunuch','consort','dowager','prince','princess','kin'].includes(o.role)){o.op=cl(o.op*.35+45*.65+(supp?18:0)+(oldMo&&o.clan!=null&&o.clan===oldMo.clan?10:0)+ri(-12,12));if(supp)o.fav=cl(o.fav+15)}
  o.back=null}
 G.heir=null;G.regent=null;
 for(const f in G.fd)G.fd[f]*=.6;
 if(age(nxt)<16){G.regent=oldMo&&oldMo.alive?oldMo.id:(holder('chan')?holder('chan').id:null);G.auth=Math.min(G.auth,26);G.fd[(oldMo&&oldMo.alive)?'wai':'chan']+=18;chron(nm(nxt)+'年幼，由'+(G.regent?nmt(P(G.regent)):'重臣')+'攝政。',3)}
 if(coupBy&&P(coupBy)&&P(coupBy).role!=='prince'&&P(coupBy).role!=='kin'){G.regent=coupBy;G.fd[facOf(P(coupBy))]+=22;G.auth=Math.min(G.auth,14)}
 G.era={n:pick(ERAS),y0:Math.floor(G.t/12)};G.life='diligent';G.ap=apMax();G.mw=0;G.held=false;G.fear=G.fear*.5;G.rep=cl(46+nxt.st.sch/10+ri(-4,4));
 G.reign={t0:G.t,m0:G.mind,wins:0,losses:0,exec:0,famine:0,revolt:0,authSum:0,mindSum:0,n:0,purges:0,heirsLost:0,founder:false,start:'x'};
 G.emps.push({pid:nxt.id,t0:G.t,era:G.era.n,t1:null});G.emp=nxt.id;chapterStart(true);G.mandate=null;
 bio(nxt,(forced?'發動政變，':'')+'登基為帝，年號'+G.era.n+'。');
 chron(nmt(nxt)+(forced?'奪位登基':'繼位')+'，改元'+G.era.n+'。',3,[nxt.id]);
 refreshClans();syncPower();G.p_last=null}

function previewFin(){const keep=JSON.stringify({reg:G.reg,tre:G.tre,gra:G.gra,burden:G.burden,morale:G.morale,mind:G.mind,debt:G.debt,army:G.army,proj:G.proj,P:Object.fromEntries(Object.values(G.P).map(p=>[p.id,p.wealth||0]))});
 economy();const fin=G.fin;const k=JSON.parse(keep);G.reg=k.reg;G.tre=k.tre;G.gra=k.gra;G.burden=k.burden;G.morale=k.morale;G.mind=k.mind;G.debt=k.debt;G.army=k.army;G.proj=k.proj;for(const id in k.P)G.P[id].wealth=k.P[id];G.fin=fin}
/* ---------- 月度推進 ---------- */
function endMonth(){if(G.over)return;
 lifeEffects();economy();peopleMonth();if(G.over)return;plotsMonth();foreignMonth();sitMonth();spawnEvents();memoMonth();arcsMonth();echoMonth();mandateMonth();decMonth();czMonth();dilemmaMonth();omenMonth();envoyMonth();allyMonth();borderMonth();localMonth();evtMonth();echoMonth2();powerMonth();vacancyMonth();
 G.reign.authSum+=G.auth;G.reign.mindSum+=G.mind;G.reign.n++;
 G.t++;G.ap=apMax();G.held=false;G.visited={};G.mw=0;
 if(G.t%12===0)yearEnd();
 checkEnd();metaEnd()}

/* ---------- 傳記與本紀 ---------- */
function lifeStory(p){const a=age(p);const best=Object.keys(STN).sort((x,y)=>p.st[y]-p.st[x])[0];
 let t=nmt(p)+'，'+(p.clan!=null?G.clans[p.clan].s+'氏子弟':(p.sur===IMPSUR?'皇室宗親':'出身寒微'))+'，生於'+dateStr(p.born)+'。性'+p.tr.join('、')+'，尤擅'+STN[best]+'（'+rd(p.st[best])+'）。';
 if(p.goal)t+='平生志在「'+GOALN[p.goal]+'」。';
 const n=p.bio.length;if(n>2)t+='一生共歷'+n+'事。';
 if(!p.alive){const last=p.bio[p.bio.length-1];t+='終於'+dateStr(p.dod!=null?p.dod:G.t)+(last?'，'+last.txt.replace(/。$/,''):'')+'。'}
 const g=grudge(p),r=gratitude(p);
 t+=' 史臣曰：'+(p.cor>60?'其人才有餘而操守不足':p.cor<20?'其人持身清正':'其人毀譽參半')+(p.amb>75?'，而野心外露，朝野側目':p.amb<30?'，淡泊自守':'')+(g>40?'；然積怨甚深，恐為後患':r>40?'；受恩深重，每思報效':'')+'。';
 return t}
function benji(x){const e=P(x.pid);const t1=x.t1==null?G.t:x.t1;const L=G.chr.filter(c=>c.t>=x.t0&&c.t<=t1&&c.imp>=3);
 return{head:nm(e)+'，'+x.era+'年間在位'+Math.round((t1-x.t0)/12)+'年。'+(x.v?'上廟號「'+x.v.temple+'」。':''),events:L.map(c=>({y:dateStr(c.t),txt:c.txt}))}}
