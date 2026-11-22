'use strict';
/* ============ 玩家行動 ============ */
const OKK=m=>({ok:true,msg:m}),NO=m=>({ok:false,msg:m});
const needAP=n=>G.ap>=n?null:NO('本月精力不足（每月三旬，已用盡）。');
const consorts=()=>alivePs().filter(p=>p.role==='consort');
const myKids=()=>alivePs().filter(p=>(p.role==='prince'||p.role==='princess')&&p.fa===G.emp);
const eG=()=>holder('gen');

/* ---------- 自身修養與生活 ---------- */
function actStudy(k){const q=needAP(1);if(q)return q;const e=emp();G.ap--;const v=e.st[k];e.st[k]=cl(v+(100-v)/60+.4+(e.tr.includes('聰慧')?.3:0),0,99);if(k==='mil')e.hp=cl(e.hp+.8);
 return OKK('你潛心鑽研'+STN[k]+'，有所精進（'+rd(v)+' → '+rd(e.st[k])+'）。')}
function actRest(){const q=needAP(1);if(q)return q;G.ap--;const e=emp();e.hp=cl(e.hp+8);if(e.ill&&chance(.2)){e.ill=0}return OKK('你靜心休養，精神煥發（龍體 '+rd(e.hp)+'）。')}
function actHunt(){const q=needAP(1);if(q)return q;if(G.tre<15)return NO('國庫不足以支應狩獵排場。');G.ap--;G.tre-=15;const e=emp();e.st.mil=cl(e.st.mil+.7);e.hp=cl(e.hp+3);
 let m='你率隨從狩獵於苑囿，馳騁盡興。';if(G.mind<45){G.rep=cl(G.rep-.8);m+='（民生艱難之際，朝野頗有微詞。）'}
 if(chance(.04)){e.hp=cl(e.hp-25);e.ill=e.ill||1;m+='不料墜馬受傷！'}
 const o=pick(alivePs().filter(p=>p.role==='general'&&p.alive));if(o){bump(o,e,0);o.op=cl(o.op+2)}return OKK(m)}
function actBanquet(big){const q=needAP(1);if(q)return q;const cost=big?40:10;if(G.tre<cost)return NO('國庫不足。');G.ap--;G.tre-=cost;
 for(const p of alivePs())if((p.role==='official'||p.role==='general'||p.role==='consort')&&chance(big?.7:.3))p.op=cl(p.op+(big?2.5:1));G.rep=cl(G.rep+(big?1.5:.5));
 let m=big?'你在宮中大宴群臣，觥籌交錯，賓主盡歡。':'你設小宴款待近臣。';
 if(big&&G.sit.some(s=>s.k==='disaster'&&s.sev>=2)){G.mind=cl(G.mind-2);m+='（災荒未平而大擺筵席，民間議論紛紛。）'}
 if(chance(big?.07:.02)){G.rep=cl(G.rep-2);m+='酒後有人失儀，傳為笑談。'}return OKK(m)}
function actTour(rid){const q=needAP(2);if(q)return q;G.ap-=2;const r=G.reg[rid],gov=holder('g_'+rid),e=emp();const L=[];
 L.push('你扮作商旅走訪'+r.n+'：人口'+rd(r.pop)+'萬，繁榮'+rd(r.pr)+'，存糧'+rd(r.food)+'，民怨'+rd(r.un)+'。');
 if(gov)L.push(nmt(gov)+'治下，百姓議論：'+(gov.cor>55?'「官府盤剝太重，苦不堪言。」':gov.cor>35?'「州牧尚可，只是衙門收費名目繁多。」':'「州牧清正，百姓安居。」'));
 const roll=R();
 if(roll<.3&&gov&&gov.cor>45){const pl=plotOf('corrupt',gov.id)||addPlot('corrupt',gov);pl.rep=true;G.sit.push({id:G.nid++,k:'case',kind:'corrupt',real:gov.id,sus:[gov.id],ev:70,age:0,t0:G.t,txt:'微服私訪所見：'+nmt(gov)+'盤剝百姓，證據確鑿，待你處置。',plot:pl.id});L.push('你親眼目睹官吏欺壓百姓，掌握了證據。（見「朝政」處置案件）')}
 else if(roll<.5){const c=newClan(pick(SURN),'clean',true);const t=newMan(c.id,22,34,'official',{bias:{pol:22,sch:8},op:90});memo_(t,'discovered',20,'微服中被皇帝賞識。');L.push('你在市井遇見寒門才俊'+nm(t)+'（政務'+rd(t.st.pol)+'），相談甚歡，可召入朝中任用。')}
 else if(roll<.62){const g=mk({g:'F',role:'maiden',sur:pick(SURN),born:G.t-12*ri(16,20),clan:null,fac:'none',motive:'love',tr:[pick(['溫婉','聰慧','風雅','剛烈']),pick(['謹慎','圓滑','孤傲'])]});g.commoner=true;g.st.lit=cl(g.st.lit+15);L.push('你在'+r.n+'偶遇民女'+nm(g)+'，才貌出眾，已記下，可於選秀時帶回宮中。')}
 else if(roll<.7){e.hp=cl(e.hp-25);G.fear=cl(G.fear+2);L.push('途中遭遇刺客！護衛拚死擊退，你受了傷。')}
 else L.push('這一路所見所聞，讓你對民間疾苦多了幾分體會。');
 G.mind=cl(G.mind+1.5);G.rep=cl(G.rep+.5);e.st.sch=cl(e.st.sch+.3);return OKK(L.join('\n'))}
function actReview(){const q=needAP(1);if(q)return q;if(G.tre<10)return NO('國庫不足。');G.ap--;G.tre-=10;G.morale=cl(G.morale+8);G.rep=cl(G.rep+1);const g=eG();if(g)g.op=cl(g.op+3);return OKK('你親臨校場閱兵，三軍山呼萬歲，士氣大振。')}
function actCourt(){const q=needAP(1);if(q)return q;G.ap--;G.held=true;G.rep=cl(G.rep+.4);G.auth=cl(G.auth+1.5);
 const n=chance(.6)?2:1;for(let i=0;i<n;i++)genMemos();const tf=topFac();const L=facLeader(tf);
 return OKK('你御殿聽政，百官奏事。'+(L?'席間'+FAC[tf].n+'領袖'+nmt(L)+'頗為活躍。':'')+'皇權略有鞏固，又添了幾份新奏摺。')}
function actCouncil(){return actCourt()}

/* ---------- 召見與人際 ---------- */
function actReward(p){if(G.tre<20)return NO('國庫不足。');if(G.visited['r'+p.id])return NO('本月已賞賜過。');G.visited['r'+p.id]=1;G.tre-=20;
 const w=p.tr.includes('貪婪')?12:8;memo_(p,'rewarded',w,'蒙皇帝賞賜。');p.fav=cl(p.fav+5);return OKK('你賞賜了'+nmt(p)+'，對方感激涕零。')}
function actPraise(p){if(G.visited['p'+p.id])return NO('本月已勉勵過。');G.visited['p'+p.id]=1;memo_(p,'praised',3,'受皇帝勉勵。');p.fav=cl(p.fav+2);return OKK('你溫言勉勵了'+nmt(p)+'。')}
function actScold(p){memo_(p,'scolded',-6,'被皇帝當面斥責。');p.fav=cl(p.fav-5);p.cor=Math.max(0,p.cor-3);G.fear=cl(G.fear+1);return OKK('你嚴詞斥責了'+nmt(p)+'。')}
function actBefriend(p){const q=needAP(1);if(q)return q;G.ap--;const e=emp();const hard=p.tr.includes('孤傲')?.5:1;memo_(p,'friend',(3+e.st.lit/20)*hard+3,'與皇帝推心置腹，引為知己。');p.fav=cl(p.fav+4);
 return OKK('你與'+nmt(p)+'促膝長談，彼此距離拉近了。')}
function actWatch(p){const q=needAP(1);if(q)return q;G.ap--;p.watch=12;return OKK('你密令人暗中監視'+nmt(p)+'一年。')}
function actCounsel(p){const q=needAP(1);if(q)return q;G.ap--;const L=[];const e=emp();
 L.push(nmt(p)+'奉旨入對。');
 if(p.off&&p.off.startsWith('g_')){const r=G.reg[p.off.slice(2)];const sp=p.cor>45?-15:0;L.push('論及'+r.n+'：「境內大體安寧，存糧約'+rd(r.food)+'，民怨'+rd(Math.max(0,r.un+sp))+'。」'+(p.cor>45?'（言辭閃爍，似有隱瞞。）':''))}
 else if(p.off==='hu')L.push('論及財政：「國庫'+rd(G.tre)+'萬兩，月入約'+rd(G.fin?G.fin.inc:0)+'、月出約'+rd(G.fin?G.fin.exp:0)+'。」');
 else if(p.off==='bing'||p.off==='gen')L.push('論及軍務：「在籍兵員'+rd(G.army)+'萬，士氣'+rd(G.morale)+'。」');
 else L.push('論及朝政，條陳了幾點看法，頗有見地。');
 // 閒談中的八卦
 const cand=alivePs().filter(x=>x.id!==p.id&&(x.role==='official'||x.role==='general'||x.role==='eunuch'||x.role==='consort'));
 let rv=null,bv=-20;for(const x of cand){const v=relOf(p,x);if(v<bv){bv=v;rv=x}}
 if(rv&&chance(.7)){const real=G.plots.find(z=>z.a===rv.id&&z.k!=='regain'&&!z.rep);
  if(real){real.rep=true;emitIntel(real);L.push('他壓低聲音：「臣聽聞'+nmt(rv)+'近來頗不尋常……」（新增一則密報）')}
  else if(!G.plots.some(z=>z.a===p.id&&z.tg===rv.id)){const pl=addPlot('slander',p,rv);pl.rep=true;pl.prog=Math.max(pl.prog,20);emitIntel(pl);L.push('他意味深長地提到'+nmt(rv)+'的種種不是……（新增一則密報，真偽未明）')}}
 e.st.sch=cl(e.st.sch+.15);return OKK(L.join('\n'))}
function actEnvoy(p,rid){const q=needAP(1);if(q)return q;G.ap--;const r=G.reg[rid],gov=holder('g_'+rid);let m=nmt(p)+'奉旨巡視'+r.n+'。';
 if(gov&&gov.id!==p.id&&gov.cor>40){const pr=.35+p.st.sch/200+(1-p.cor/150)*.2;
  if(p.cor>50&&chance(.3))m+='回奏稱一切安好（你隱隱覺得他並未盡言）。';
  else if(chance(pr)){const pl=plotOf('corrupt',gov.id)||addPlot('corrupt',gov);pl.rep=true;G.sit.push({id:G.nid++,k:'case',kind:'corrupt',real:gov.id,sus:[gov.id],ev:65,age:0,t0:G.t,txt:nmt(p)+'巡視'+r.n+'，查得'+nmt(gov)+'貪墨實據。',plot:pl.id});m+='查得'+nmt(gov)+'貪墨實據！（見「朝政」處置案件）'}
  else m+='未發現明顯問題。'}else m+='所見大體尚可。';
 if(r.food<40)m+='另奏報'+r.n+'存糧偏少。';p.op=cl(p.op+3);return OKK(m)}
function actAppoint(oid,pid){const od=offDef(oid),p=P(pid);if(!p||!p.alive)return NO('人選無效。');
 if(G.puppet&&chance(1-G.auth/40))return NO('權臣把持朝局，你的任命被駁回了（皇權過低）。');
 if(od.role&&p.role!==od.role)return NO('資格不符。');const old=holder(oid);if(old&&old.id===p.id)return NO('此人已在任。');
 if(old){memo_(old,'demoted',-12,'被免去'+od.n+'。');bio(old,'被免去'+od.n+'。')}const was=p.off;appointRaw(oid,p);bio(p,'出任'+od.n+'。');memo_(p,'promoted',12,'被任命為'+od.n+'。');p.fav=cl(p.fav+8);
 for(const x of alivePs()){if(x.id!==p.id&&(x.role==='official'||x.role==='general')&&x.fac===p.fac&&x.st[od.s]>p.st[od.s]+10&&!x.off&&chance(.3)){bump(x,p,-8)}}
 if(od.r>=8)chron(nmt(p)+'出任'+od.n+'。',2,[p.id]);else log(nmt(p)+'出任'+od.n+'。');return OKK('任命'+nmt(p)+'為'+od.n+'。')}
function actDismiss(oid){const old=holder(oid);if(!old)return NO('此職空缺。');if(G.puppet&&chance(1-G.auth/40))return NO('權臣阻撓，罷免之議未能通過。');
 memo_(old,'demoted',-14,'被罷免'+offName(oid)+'。');bio(old,'被罷免'+offName(oid)+'。');vacate(old);log('罷免'+nmt(old)+'。');return OKK('已罷免'+nmt(old)+'。')}
function candidatesFor(oid){const od=offDef(oid);const cur=holder(oid);return alivePs().filter(p=>(od.role?p.role===od.role:p.role==='official')&&age(p)>=22&&!p.exile&&(!cur||p.id!==cur.id)).sort((a,b)=>b.st[od.s]-a.st[od.s]).slice(0,14)}

/* ---------- 後宮 ---------- */
function actVisit(c){const q=needAP(1);if(q)return q;if(c.lock>0)return NO(nm(c)+'尚在禁足中。');if(G.visited[c.id])return NO('本月已臨幸過。');const e=emp();G.ap--;G.visited[c.id]=1;
 c.fav=cl(c.fav+15);memo_(c,'beloved',c.motive==='love'?5:3,'蒙皇帝臨幸。');
 for(const o of consorts())if(o.id!==c.id&&o.fav<c.fav&&chance(.5)){o.op=cl(o.op-1);bump(o,c,-3)}
 const fert=(age(c)<=30?1:age(c)<=38?.5:.1)*(e.hp/100)*(age(e)<55?1:.4);let m='你夜宿'+nmt(c)+'處。';
 if(!c.preg&&chance(.17*fert)){conceive(c,e);m+='數月後，她似乎有了身孕。'}return OKK(m)}
function actAccompany(c){const q=needAP(1);if(q)return q;if(c.lock>0)return NO(nm(c)+'尚在禁足中。');const e=emp();G.ap--;
 memo_(c,'company',5+e.st.lit/25+(c.motive==='love'?2:0),'與皇帝吟詩作畫，相談甚歡。');c.fav=cl(c.fav+6);
 let m='你與'+nmt(c)+'品茗論詩，閒話家常。';if(c.secret&&chance(.3)){m+='她吐露了心事：'+c.secret;}return OKK(m)}
function actGiftC(c){if(G.tre<15)return NO('國庫不足。');if(G.visited['g'+c.id])return NO('本月已賞賜過。');G.visited['g'+c.id]=1;G.tre-=15;c.fav=cl(c.fav+5);memo_(c,'gift',c.motive==='power'?3:6,'得皇帝賞賜。');return OKK('你賞賜'+nmt(c)+'珠寶綢緞。')}
function countRank(r){return consorts().filter(c=>c.rank===r).length}
function actSetRank(c,r){if(r===c.rank)return NO('位份未變。');if(r>c.rank&&countRank(r)>=RKCAP[r])return NO(RK[r]+'位份已滿。');const up=r>c.rank;c.rank=r;
 if(up){c.fav=cl(c.fav+8);memo_(c,'promoted',10,'晉為'+RK[r]+'。')}else{c.fav=cl(c.fav-10);memo_(c,'demoted',-12,'降為'+RK[r]+'。')}
 if(r>=5||c.rank>=5)refreshClans();
 if(r>=5||up&&r>=4)chron(nmt(c)+(up?'晉':'降')+'為'+RK[r]+'。',r>=5?3:2,[c.id]);else log(nmt(c)+(up?'晉':'降')+'為'+RK[r]+'。');
 if(r===6)e_sp(c);return OKK(nmt(c)+(up?'晉':'降')+'為'+RK[r]+'。')}
function e_sp(c){emp().sp=c.id}
function actPunishC(c,lv){punish(c,lv,'不守宮規');return OKK('已處置'+nm(c)+'。')}
function draftList(){const a=alivePs().filter(p=>p.role==='maiden'&&age(p)>=14&&age(p)<=22&&p.sp==null);return shuffle(a).slice(0,8)}
function actDraft(ids){const q=needAP(2);if(q)return q;if(G.tre<30)return NO('國庫不足（需30萬兩）。');if(!ids.length)return NO('未選任何人。');G.ap-=2;G.tre-=30;G.lastSel=G.t;const e=emp();const L=[];
 for(const id of ids.slice(0,3)){const g=P(id);if(!g||g.role!=='maiden')continue;g.role='consort';g.rank=(g.clan!=null&&G.clans[g.clan].pw>14)?2:1;g.sp=e.id;g.fav=ri(30,50);g.op=cl(g.op+ri(0,12));g.title='';bio(g,'入宮，封'+RK[g.rank]+'。');
  if(g.clan!=null)for(const m of G.clans[g.clan].m){const x=P(m);if(x.alive&&x.role!=='consort')x.op=cl(x.op+3)}L.push(nm(g))}
 chron('選秀入宮：'+L.join('、')+'。',2);return OKK('選入後宮：'+L.join('、')+'。')}

/* ---------- 皇嗣 ---------- */
function actTeach(k){const q=needAP(1);if(q)return q;if(!k.pot||age(k)>=18)return NO('此人已成年，無需教導。');G.ap--;const f=k.focus||'lit';k.st[f]=cl(k.st[f]+1.2);k.pot[f]=cl(k.pot[f]+.4);memo_(k,'taught',5,'蒙父皇親自教導。');return OKK('你親自教導'+nm(k)+'，其'+STN[f]+'有所長進。')}
function actSetTutor(k,t){k.tutor=t.id;t.back=k.id;memo_(t,'tutor',4,'受命為'+nm(k)+'師傅。');return OKK(nmt(t)+'成為'+nm(k)+'的師傅。')}
function actSetFocus(k,s){k.focus=s;return OKK(nm(k)+'今後專修'+STN[s]+'。')}
function actMakeHeir(k){if(k.role!=='prince'||k.fa!==G.emp)return NO('只有皇子可立為太子。');const old=G.heir?P(G.heir):null;
 if(old&&old.alive){old.title='';old.op=cl(old.op-15)}
 const sibs=alivePs().filter(p=>p.role==='prince'&&p.fa===G.emp&&p.id!==k.id);for(const s of sibs){s.op=cl(s.op-(age(s)>age(k)?12:5));s.amb=cl(s.amb+(age(s)>age(k)?6:2))}
 G.heir=k.id;k.title='太子';k.op=cl(k.op+10);for(const o of alivePs())if(o.back===k.id)o.op=cl(o.op+4);if(k.mo!=null&&P(k.mo)&&P(k.mo).alive){memo_(P(k.mo),'heirmom',12,'兒子被立為太子。')}
 chron('立'+nm(k)+'為太子。',3,[k.id]);G.sel=0;return OKK('已冊立'+nm(k)+'為太子。')}
function actDeposeHeir(){const h=G.heir?P(G.heir):null;if(!h)return NO('尚未立儲。');h.title='';h.op=cl(h.op-30);h.amb=cl(h.amb+10);for(const o of alivePs())if(o.back===h.id)o.op=cl(o.op-8);
 if(h.mo!=null&&P(h.mo)&&P(h.mo).alive)memo_(P(h.mo),'heirdepose',-20,'兒子被廢黜太子之位。');chron('廢太子'+nm(h)+'。',3,[h.id]);G.heir=null;G.fd.clean=cl(G.fd.clean+2,0,35);return OKK('已廢黜太子。')}
function actFief(k,rid){const r=G.reg[rid];k.fief=rid;r.au=cl(r.au+12);memo_(k,'fief',10,'受封'+r.n+'。');k.title=r.n+'王';chron(nm(k)+'就藩'+r.n+'。',2,[k.id]);return OKK(nm(k)+'受封於'+r.n+'。')}
function actRecallFief(k){if(!k.fief)return NO('無封地。');G.reg[k.fief].au=cl(G.reg[k.fief].au-8);k.fief=null;memo_(k,'recall',-20,'被削奪封地。');return OKK('已收回封地。')}
function actMarryOff(a,b){if(a.sp!=null||b.sp!=null)return NO('已有婚配。');marry(a,b);memo_(a,'match',6,'蒙皇帝賜婚。');memo_(b,'match',4,'蒙皇帝賜婚。');return OKK('賜婚：'+nm(a)+' 與 '+nm(b)+'。')}
function actHeqin(pr,fk){const f=G.foe[fk];if(pr.role!=='princess'||age(pr)<14)return NO('人選不合適。');
 const mo=pr.mo!=null?P(pr.mo):null;if(mo&&mo.alive)memo_(mo,'heqin',-25,'愛女被遠嫁'+f.n+'和親。');pr.alive=false;pr.dod=G.t;pr.sp=null;bio(pr,'和親遠嫁'+f.n+'。');
 f.att=cl(f.att+40);f.hist=0;if(f.war){const s=G.sit.find(z=>z.id===f.war);if(s)s.done=true;f.war=null}
 chron(nm(pr)+'公主和親'+f.n+'，兩國結好。',3,[pr.id]);return OKK('公主和親'+f.n+'。')}
function punish(p,lv,why){const nS=nmt(p);const w=why||'獲罪';
 if(lv==='death'||lv==='exile')deedAdd('harm',p,lv,w);
 if(lv==='death'){kill(p,(p.role==='consort'||p.role==='prince'||p.role==='princess')?'賜死':'誅',w);return}
 if(lv==='exile'){vacate(p);p.exile=true;p.fac='none';memo_(p,'exiled',-18,'被朝廷流放。');bio(p,'因'+w+'被流放。');chron(nS+'因'+w+'被流放。',2,[p.id]);p.cor=Math.max(0,p.cor-15);lite(p)}
 else if(lv==='demote'){if(p.role==='consort'){p.rank=Math.max(1,p.rank-1);p.fav=cl(p.fav-10)}else vacate(p);memo_(p,'demoted',-12,'因'+w+'被貶。');bio(p,'因'+w+'被貶。');log(nS+'因'+w+'被貶。');lite(p)}
 else if(lv==='lock'){p.lock=4;p.fav=cl(p.fav-15);memo_(p,'locked',-10,'被禁足。');log(nS+'被禁足。')}
 else if(lv==='cold'){p.fav=0;p.lock=12;memo_(p,'cold',-25,'被打入冷宮。');chron(nS+'被打入冷宮。',2,[p.id]);lite(p)}
 else if(lv==='strip'){p.title='庶人';p.fief=null;vacate(p);p.exile=true;memo_(p,'strip',-30,'被削爵為庶人。');chron(nS+'被削爵為庶人。',3,[p.id]);lite(p)}
 else if(lv==='scold'){memo_(p,'scolded',-6,'因'+w+'被申斥。');p.cor=Math.max(0,p.cor-4)}
 for(const pl of G.plots.filter(x=>x.a===p.id&&x.k!=='regain'))removePlot(pl)}
function lite(p){const r=[p.sp,p.mo,p.fa].filter(x=>x!=null);for(const id of r){const x=P(id);if(x&&x.alive&&x.id!==G.emp)memo_(x,'kin_hit',-8,'親人'+nm(p)+'受罰。',p.id)}if(p.clan!=null)for(const id of G.clans[p.clan].m){const x=P(id);if(x&&x.alive&&x.id!==p.id&&chance(.5))x.op=cl(x.op-2)}}

/* ---------- 朝政設定 ---------- */
const TAXN=['極輕','較輕','中等','較重','苛重'],MILN=['縮減','節省','常規','加強','窮兵'],CRTN=['儉樸','節約','適中','豪華','奢靡'],LIFEN={diligent:'勤政',indulge:'享樂',delegate:'放權',tyrant:'專制'};
const LIFED={diligent:'親理政務，聲望緩升，但龍體耗損',indulge:'縱情享樂，耗費錢財，聲望與民心緩降',delegate:'放手交給大臣，權臣趁勢坐大，龍體得養',tyrant:'高壓統治，群臣畏懼，但人心離散'};
function setTax(l){G.tax=l;return OKK('賦稅調為「'+TAXN[l-1]+'」。')}
function setMil(l){G.mil=l;return OKK('軍費調為「'+MILN[l-1]+'」。')}
function setCrt(l){G.crt=l;return OKK('宮廷用度調為「'+CRTN[l-1]+'」。')}
function setLife(k){G.life=k;return OKK('施政風格轉為「'+LIFEN[k]+'」。')}
const INST={spy:{n:'錦衣衛',cost:60,d:'設密探機構：情報靈通、皇權+，但清流側目、宦官得勢'},shi:{n:'市舶司',cost:80,d:'沿海通商：增加稅收與沿海繁榮'},cab:{n:'內閣',cost:100,d:'文官議政：清流壯大、權臣受抑'},acad:{n:'翰林書院',cost:70,d:'增設書院：科舉取士更多更優'}};
function actInst(k){const I=INST[k];if(G.inst[k]){G.inst[k]=false;if(k==='spy'){const h=holder('spy');if(h)vacate(h);delete G.off.spy}return OKK('已裁撤'+I.n+'。')}
 if(G.tre<I.cost)return NO('國庫不足（需'+I.cost+'萬兩）。');G.tre-=I.cost;G.inst[k]=true;
 if(k==='spy'){G.off.spy=null;for(const p of alivePs())if(p.fac==='clean')p.op=cl(p.op-4);G.fd.eun=cl(G.fd.eun+3,0,35)}
 if(k==='cab'){G.fd.clean=cl(G.fd.clean+6,0,35);G.fd.chan=cl(G.fd.chan-5,0,35)}
 chron('設立'+I.n+'。',2);return OKK('已設立'+I.n+'。')}
function actSellOffice(){const q=needAP(1);if(q)return q;G.ap--;G.tre+=80;G.mind=cl(G.mind-2);G.rep=cl(G.rep-3);for(const p of alivePs())if(p.fac==='clean'&&chance(.6))p.op=cl(p.op-3);
 const v=vacantOffs().filter(o=>o.startsWith('g_'));if(v.length){const pool=alivePs().filter(p=>!p.off&&p.role==='official'&&age(p)>=25);const c=pool[0];if(c){appointRaw(v[0],c);c.cor=cl(c.cor+20)}}return OKK('你明碼標價賣官鬻爵，入帳80萬兩，但吏治與清議大受影響。')}
function actProject(k,rid){const cost={canal:120,granary:70,road:80,wall:90}[k];if(G.tre<cost*.3)return NO('國庫不足。');G.proj.push({k,reg:rid,cost,dur:12,left:12});return OKK('工程已開工。')}
function actRelief(rid){const r=G.reg[rid];if(G.gra<60)return NO('糧倉存糧不足60。');G.gra-=60;r.food=cl(r.food+18);G.mind=cl(G.mind+.5);return OKK('開倉賑濟'+r.n+'，存糧回升。')}
function actExempt(rid){const r=G.reg[rid];r.exempt=12;r.un=cl(r.un-8);G.mind=cl(G.mind+1);return OKK('免除'+r.n+'一年賦稅。')}
function actEditHist(){const q=needAP(1);if(q)return q;if(G.tre<20)return NO('國庫不足。');G.ap--;G.tre-=20;G.editHist=1;G.rep=cl(G.rep-2);for(const p of alivePs())if(p.fac==='clean')p.op=cl(p.op-3);return OKK('你授意史官潤飾本朝實錄。（後世未必買帳）')}
function actRecruit(){const q=needAP(1);if(q)return q;if(G.tre<40)return NO('國庫不足。');G.ap--;G.tre-=40;G.army+=6;G.burden=cl(G.burden+2.5);G.mind=cl(G.mind-.8);return OKK('下詔募兵六萬。民間負擔增加。')}

/* ---------- 外交 ---------- */
function actDiplo(fk,mode){const f=G.foe[fk];
 if(mode==='gift'){if(G.tre<30)return NO('國庫不足。');G.tre-=30;f.att=cl(f.att+12);return OKK('厚賜'+f.n+'使節，關係改善。')}
 if(mode==='trade'){if(f.trade)return NO('已通商。');if(f.att<0)return NO(f.n+'對我國敵意尚深，不願通商。');if(G.tre<20)return NO('國庫不足。');G.tre-=20;f.trade=true;f.att=cl(f.att+5);return OKK('與'+f.n+'開市通商，每月增收。')}
 if(mode==='tribute'){if(f.vas)return NO('已是藩屬。');if(f.str>=50)return NO(f.n+'國勢尚強，不肯稱臣。');f.vas=true;G.rep=cl(G.rep+3);chron(f.n+'稱臣納貢，成為藩屬。',3);return OKK(f.n+'成為藩屬，歲歲朝貢。')}
 if(mode==='declare'){if(f.war)return NO('已在交戰。');const q=needAP(1);if(q)return q;G.ap--;startWar(f);f.att=cl(f.att-25);f.vas=false;return OKK('你下詔討伐'+f.n+'。')}
 if(mode==='peace'){if(!f.war)return NO('並未交戰。');if(G.tre<50)return NO('國庫不足（需50萬兩）。');G.tre-=50;const s=G.sit.find(z=>z.id===f.war);if(s)s.done=true;f.war=null;f.att=cl(f.att+10);G.rep=cl(G.rep-4);return OKK('向'+f.n+'納幣議和，戰事暫息。')}
 if(mode==='spy'){const q=needAP(1);if(q)return q;if(G.tre<25)return NO('國庫不足。');G.ap--;G.tre-=25;const e=emp();if(chance(.5+e.st.sch/200)){f.str=cl(f.str-(4+e.st.sch/12));return OKK('離間之計奏效，'+f.n+'內部生亂，國力受損。')}f.att=cl(f.att-8);return OKK('離間之計敗露，'+f.n+'更加敵視我朝。')}
 return NO('未知外交行動')}

/* ---------- 情報與案件 ---------- */
function actInvestigate(iid,byId){const q=needAP(1);if(q)return q;const it=G.intel.find(x=>x.id===iid);if(!it)return NO('情報已失效。');const pl=G.plots.find(x=>x.id===it.plot);if(!pl){G.intel=G.intel.filter(x=>x!==it);return NO('此事已無從查起。')}
 G.ap--;const inv=P(byId),e=emp();const pr=.35+(inv?inv.st.sch*.004:0)+e.st.sch*.003+(G.inst.spy?.15:0)+pl.prog/400;
 if(inv&&inv.cor>60&&chance(.25)){return OKK(nmt(inv)+'回奏：查無此事。（你隱隱覺得他在敷衍）')}
 if(chance(pr)){const a=P(pl.a),tg=pl.tg!=null?P(pl.tg):null;pl.rep=true;
  const txt={slander:'查明：'+nmt(a)+'散播流言，構陷'+(tg?nmt(tg):'他人')+'。',corrupt:'查實：'+nmt(a)+'貪墨舞弊，贓款纍纍。',poison:'查實：'+nmt(a)+'意圖投毒謀害'+(tg?nmt(tg):'他人')+'。',coup:'查實：'+nmt(a)+'陰謀發動政變。',rebel:'查實：'+nmt(a)+'暗蓄兵甲，圖謀不軌。',secede:'查實：'+nmt(a)+'圖謀割據自立。'}[pl.k];
  G.sit.push({id:G.nid++,k:'case',kind:pl.k,real:a.id,sus:[a.id],ev:85,age:0,t0:G.t,txt,plot:pl.id});G.intel=G.intel.filter(x=>x!==it);return OKK(txt+'（見「朝政」處置案件）')}
 return OKK('追查多日，暫無確切結果。線索尚在。')}
function actDirect(iid,lv){const it=G.intel.find(x=>x.id===iid);if(!it)return NO('情報已失效。');const p=P(it.sus);if(!p||!p.alive)return NO('此人已不在。');const pl=G.plots.find(x=>x.id===it.plot);
 G.intel=G.intel.filter(x=>x!==it);
 if(it.fake){punish(p,lv,'莫須有之罪');if(lv!=='scold'){G.rep=cl(G.rep-4);G.mind=cl(G.mind-1);for(const o of alivePs())if((o.role==='official'||o.role==='general')&&chance(.35))o.op=cl(o.op-3);if(pl)pl.prog=100;return OKK('你輕信讒言處置了'+nmt(p)+'。後來有人說，他恐怕是被冤枉的……')}}
 else{punish(p,lv,pl?({corrupt:'貪墨',poison:'投毒',coup:'謀逆',rebel:'圖謀不軌',secede:'擁地自立'}[pl.k]||'不法'):'不法');if(pl)removePlot(pl);G.rep=cl(G.rep+1);return OKK('你當機立斷處置了'+nmt(p)+'。')}
 return OKK('已處置。')}
function caseInvestigate(sid,byId){const q=needAP(1);if(q)return q;const s=G.sit.find(x=>x.id===sid);if(!s)return NO('案件已結。');G.ap--;const inv=P(byId),e=emp();
 const pr=.4+(inv?inv.st.sch*.004:0)+e.st.sch*.003+(G.inst.spy?.12:0)+s.ev/500;
 if(chance(pr)){s.sus=[s.real];s.ev=100;return OKK('真相大白：'+nmt(P(s.real))+'正是主謀。')}s.ev=Math.min(95,s.ev+12);return OKK('線索增多，但仍有疑點。（證據'+rd(s.ev)+'）')}
function caseAct(sid,xid,lv){const s=G.sit.find(x=>x.id===sid);if(!s)return NO('案件已結。');const x=P(xid);
 if(lv==='pardon'){const a=P(s.real);if(a&&a.alive){memo_(a,'spared',9,'罪行被皇帝寬宥。');const pl=G.plots.find(z=>z.id===s.plot);if(pl)removePlot(pl);for(const pl2 of G.plots.filter(z=>z.a===a.id&&z.k!=='regain'&&z.k!=='corrupt'))removePlot(pl2)}s.done=true;G.fear=cl(G.fear-1);return OKK('你選擇寬宥，令其戴罪立功。（對方恐將感恩，也可能視為軟弱）')}
 const guilty=xid===s.real;const why={slander:'誣陷同僚',corrupt:'貪墨',poison:'投毒',coup:'謀逆',rebel:'謀反',secede:'割據'}[s.kind]||'不法';
 if(guilty&&x)bio(x,'因'+why+'之罪敗露。');punish(x,lv,guilty?why:'疑罪');if(guilty){const pl=G.plots.find(z=>z.id===s.plot);if(pl)removePlot(pl);G.rep=cl(G.rep+2)}
 else{G.rep=cl(G.rep-4);G.mind=cl(G.mind-1);G.fear=cl(G.fear+2);for(const o of alivePs())if((o.role==='official'||o.role==='general'||o.role==='consort')&&chance(.3))o.op=cl(o.op-3)}
 s.done=true;if(s.kind==='slander'&&guilty){const tg=null}
 return OKK(guilty?'真兇伏法，朝野稱快。':'事後看來，被處置者恐怕另有冤情……')}

/* ---------- 奪權 ---------- */
function actRegain(){const q=needAP(1);if(q)return q;let pl=G.plots.find(x=>x.k==='regain');if(!pl){const e=emp();pl=addPlot('regain',e,null,{prog:0})}G.ap--;const e=emp();pl.prog=cl(pl.prog+8+e.st.sch/8,0,130);
 if(chance(.05+offq('yu','sch')*.0006)){const L=facLeader(topFac());if(L){L.op=cl(L.op-12);if(chance(.35)&&!plotOf('coup',L.id))addPlot('coup',L,null,{prog:50});return OKK('密謀奪權進展至'+rd(pl.prog)+'，但似乎走漏了風聲——'+nmt(L)+'已有所警覺！')}}
 return OKK('你暗中聯絡忠臣舊部，奪權大計進展至 '+rd(pl.prog)+'%。')}
function actStrike(){const pl=G.plots.find(x=>x.k==='regain');if(!pl||pl.prog<100)return NO('時機尚未成熟（需100%）。');const q=needAP(2);if(q)return q;G.ap-=2;const tf=topFac();const L=facLeader(tf);const e=emp();const gu=holder('guard');
 removePlot(pl);if(!L)return OKK('無人可制，皇權已重歸你手。');
 const mine=G.auth*.5+e.st.sch*.4+(gu?gu.op*.4:0)+G.rep*.2+30+ri(-15,15);const his=G.pow[tf]*.9+L.st.sch*.3+(L.off==='guard'?30:0)+(L.st.mil>70?10:0);
 if(mine>his){chron('皇帝發動宮變，翦除'+FAC[tf].n+'領袖'+nmt(L)+'，重掌大權！',3,[L.id]);kill(L,'誅','專擅跋扈');G.fd[tf]=0;G.auth=cl(G.auth+25);G.rep=cl(G.rep+8);G.reign.purges++;return OKK('大獲成功！你奪回了朝政大權。')}
 G.auth=cl(G.auth-15);G.rep=cl(G.rep-10);if(chance(.3)){coupSuccess(L,{});return OKK('政變失敗，你被廢黜！')}return OKK('政變失敗，你被軟禁宮中，皇權跌至谷底。')}

/* ---------- 情勢選項 ---------- */
function genCands(){return alivePs().filter(p=>p.role==='general'&&age(p)>=22).sort((a,b)=>b.st.mil-a.st.mil).slice(0,8).map(p=>({id:p.id,label:nmt(p),sub:'武略'+rd(p.st.mil)+' 名望'+rd(p.pst||0)+' 忠誠'+rd(p.op)}))}
function dispatch(s,gid,force){const g=gid?P(gid):null;s.gen=gid;s.force=Math.min(force,G.army*.7);return OKK('遣'+(g?nmt(g):'守將')+'率'+rd(s.force)+'萬大軍'+(s.k==='war'?'迎敵':'平叛')+'。')}
function sitOpts(s){const r=s.reg?G.reg[s.reg]:null;const O=[];
 if(s.k==='disaster'){
  O.push({l:'開倉賑濟',h:'耗糧'+40*s.sev+'，大幅減輕災情',fn:()=>{const c=40*s.sev;if(G.gra>=c)G.gra-=c;else if(G.tre>=c)G.tre-=c;else return NO('糧銀皆不足。');s.relief=1;r.food=cl(r.food+10);return OKK('已開倉賑濟'+r.n+'。')}});
  O.push({l:'蠲免賦稅',h:'免該州一年賦稅，減輕災情',fn:()=>{r.exempt=12;s.relief=Math.max(s.relief,.5);r.un=cl(r.un-6);return OKK('已下詔蠲免'+r.n+'賦稅。')}});
  O.push({l:'勸募富戶',h:'得銀'+30*s.sev+'萬，但得罪豪強',fn:()=>{G.tre+=30*s.sev;s.relief=Math.max(s.relief,.3);G.mind=cl(G.mind-1);return OKK('勸募得銀'+30*s.sev+'萬兩。')}});
  O.push({l:'遣欽差督賑',h:'指派一位官員前往，賑濟更有成效（耗1旬）',ask:{title:'選擇欽差',items:alivePs().filter(p=>p.role==='official'&&age(p)>=25&&!p.exile).sort((a,b)=>b.st.pol-a.st.pol).slice(0,10).map(p=>({id:p.id,label:nmt(p),sub:'政務'+rd(p.st.pol)+' 清廉'+rd(100-p.cor)}))},
   fn:id=>{const q=needAP(1);if(q)return q;const p=P(id);if(G.gra<30*s.sev&&G.tre<30*s.sev)return NO('糧銀不足。');G.ap--;if(G.gra>=30*s.sev)G.gra-=30*s.sev;else G.tre-=30*s.sev;s.relief=1;r.food=cl(r.food+6+p.st.pol/10);if(p.cor>55&&chance(.4)){r.food=cl(r.food-6);return OKK(nmt(p)+'督賑，卻似乎中飽私囊，賑濟打了折扣。')}memo_(p,'envoy',4,'受命督賑。');return OKK(nmt(p)+'督賑有方，災民安置妥當。')}})}
 else if(s.k==='revolt'||s.k==='war'){
  const gc=genCands();for(const n of[5,10,20]){if(G.army<n+4)continue;O.push({l:'派兵'+n+'萬'+(s.k==='war'?'迎戰':'平叛'),h:'選擇統帥，統兵'+n+'萬（目前在籍'+rd(G.army)+'萬）',ask:{title:'選擇統帥',items:gc},fn:id=>dispatch(s,id,n)})}
  if(s.k==='war'){const f=G.foe[s.foe];
   O.push({l:'御駕親征',h:'耗2旬；我軍戰力大增，但皇帝有負傷風險',fn:()=>{const q=needAP(2);if(q)return q;if(s.emp)return NO('已在親征。');G.ap-=2;s.emp=true;s.empT=4;return OKK('你披甲出征，三軍振奮！')}});
   O.push({l:'納幣議和',h:'耗50萬兩，立刻停戰（聲望-4）',fn:()=>actDiplo(s.foe,'peace')});
   O.push({l:'公主和親',h:'立刻停戰、關係大幅改善；公主及其母族將怨恨你',ask:{title:'選擇和親公主',items:alivePs().filter(p=>p.role==='princess'&&age(p)>=14&&p.sp==null).map(p=>({id:p.id,label:nmt(p),sub:age(p)+'歲 文藝'+rd(p.st.lit)}))},fn:id=>actHeqin(P(id),s.foe)});
   O.push({l:'遣使離間',h:'耗25萬兩、1旬，削弱敵國',fn:()=>actDiplo(s.foe,'spy')})}
  else{if(!s.prince&&s.leader==null)O.push({l:'招撫義軍',h:'耗40萬兩、免賦一年，叛軍大減；示弱（聲望-3）',fn:()=>{if(G.tre<40)return NO('國庫不足。');G.tre-=40;s.S*=.35;r.un=cl(r.un-18);r.exempt=12;G.rep=cl(G.rep-3);return OKK('招撫奏效，叛軍勢力大減。')}});
   const gov=holder('g_'+r.id);if(gov&&gov.cor>40)O.push({l:'嚴查州牧貪腐',h:'民變或因官逼民反，查辦其州牧',fn:()=>{const pl=plotOf('corrupt',gov.id)||addPlot('corrupt',gov);pl.rep=true;G.sit.push({id:G.nid++,k:'case',kind:'corrupt',real:gov.id,sus:[gov.id],ev:70,age:0,t0:G.t,txt:'民變緣起，州牧'+nmt(gov)+'貪墨嫌疑極大。',plot:pl.id});return OKK('已立案查辦'+nmt(gov)+'。')}})}}
 else if(s.k==='secession'){const g=P(s.gov);
  O.push({l:'出兵討伐',h:'發兵平定割據',fn:()=>{G.sit=G.sit.filter(z=>z!==s);const r2=startRevolt(r,{S:40+(g?g.st.mil/3:10)+r.garr*3,name:'討伐'+nm(g),leader:g?g.id:null,prince:true});r2.sec=true;return OKK('大軍壓境，討伐'+nm(g)+'。')}});
  O.push({l:'招安承認',h:'承認其半獨立地位，該州僅納三成稅，聲望-3',fn:()=>{r.sec=false;r.vas=true;r.au=75;s.done=true;G.rep=cl(G.rep-3);if(g)g.op=cl(g.op+15);return OKK('招安成功，'+r.n+'名義上重歸朝廷。')}})}
 else if(s.k==='crisis'){const f=s.f;const L=facLeader(f);
  O.push({l:'分化打壓',h:'扶持其他派系、削弱其首領威信',fn:()=>{G.fd[f]=cl(G.fd[f]-6,0,35);const low=['chan','clean','army','eun','wai'].filter(x=>x!==f).sort((a,b)=>G.pow[a]-G.pow[b])[0];G.fd[low]=cl(G.fd[low]+4,0,35);if(L)L.op=cl(L.op-5);return OKK('你扶持'+FAC[low].n+'以制衡'+FAC[f].n+'。')}});
  if(L)O.push({l:'罷黜其首領',h:'成功率取決於皇權與威望；失敗將招致報復（首領：'+nmt(L)+'）',fn:()=>{const pr=cl(.25+G.auth/120+(G.rep-50)/300-G.pow[f]/200,.1,.8);
   if(chance(pr)){const o=L.off;punish(L,'exile','專擅跋扈');G.fd[f]=Math.max(0,G.fd[f]-12);G.rep=cl(G.rep+3);G.auth=cl(G.auth+4);s.done=true;return OKK('你成功罷黜'+nmt(L)+'，'+FAC[f].n+'氣焰頓消。')}
   L.op=cl(L.op-25);G.rep=cl(G.rep-3);G.auth=cl(G.auth-4);if(chance(.5)&&!plotOf('coup',L.id))addPlot('coup',L,null,{prog:50});return NO('罷黜失敗！'+nmt(L)+'懷恨在心，朝局動盪。')}});
  if(L)O.push({l:'加官進爵安撫',h:'暫時平息（一年），但其首領更得意',fn:()=>{L.op=cl(L.op+15);G.fd[f]=cl(G.fd[f]+3,0,35);G.cool=G.cool||{};G.cool[f]=G.t+12;s.done=true;return OKK('你加封'+nmt(L)+'，朝局暫穩。')}});
  O.push({l:'暗中布局奪權',h:'每次耗1旬累積進度，滿100%可發動宮變（有風險）',fn:()=>actRegain()});
  const pl=G.plots.find(x=>x.k==='regain');if(pl&&pl.prog>=100)O.push({l:'⚔ 發動宮變',h:'耗2旬，成敗在此一舉',fn:()=>actStrike()})}
 else if(s.k==='case'){const sus=s.sus.map(P).filter(Boolean);
  if(s.sus.length>1||s.ev<100)O.push({l:'徹查',h:'耗1旬，指派一人追查真相（目前證據'+rd(s.ev)+'）',ask:{title:'指派誰追查',items:alivePs().filter(p=>(p.role==='official'||p.role==='eunuch'||p.role==='general')&&age(p)>=25&&p.id!==s.real).sort((a,b)=>b.st.sch-a.st.sch).slice(0,8).map(p=>({id:p.id,label:nmt(p),sub:'權謀'+rd(p.st.sch)+' 清廉'+rd(100-p.cor)}))},fn:id=>caseInvestigate(s.id,id)});
  for(const x of sus){const isC=x.role==='consort',isP=x.role==='prince'||x.role==='princess';const L=isC?[['lock','禁足'],['demote','降位'],['cold','冷宮'],['death','賜死']]:isP?[['lock','禁足'],['strip','削爵'],['death','賜死']]:[['scold','申斥'],['demote','貶黜'],['exile','流放'],['death','處死']];
   for(const[lv,lab]of L)O.push({l:lab+'：'+nmt(x),h:s.ev>=85&&x.id===s.real?'證據確鑿':'證據'+rd(s.ev)+'，慎防冤獄',fn:()=>caseAct(s.id,x.id,lv)})}
  O.push({l:'寬宥主謀',h:'不予追究，令其感恩戴罪（或視為軟弱）',fn:()=>caseAct(s.id,s.real,'pardon')})}
 else if(s.k==='illness'){const e=emp();
  O.push({l:'召太醫會診',h:'提高痊癒機率',fn:()=>{if(chance(.25+offq('med','med')/200)){e.ill=0;return OKK('太醫妙手回春，龍體康復。')}return OKK('太醫開了方子，需靜待藥效。')}});
  O.push({l:'服用金丹',h:'立刻好轉，但長期損耗龍體',fn:()=>{e.hp=cl(e.hp+15);e.pill=(e.pill||0)+1;if(chance(.4))e.ill=0;return OKK('服下金丹，精神頓振。')}})}
 return O}

/* ---------- 奏摺選項 ---------- */
function memoOpts(m){const O=[];const x=m.x;const f=m.from?P(m.from):null;const bad=(p,v)=>{if(p&&p.alive)p.op=cl(p.op-(v||4))};const good=(p,v)=>{if(p&&p.alive)p.op=cl(p.op+(v||4))};
 const k=m.k;
 if(k==='relief'){const r=G.reg[x.reg];O.push({l:'開倉賑濟',h:'耗糧60，存糧+18',fn:()=>{const q=actRelief(x.reg);if(q.ok)good(f,4);return q}});O.push({l:'蠲免賦稅',h:'免一年賦稅',fn:()=>{const q=actExempt(x.reg);good(f,3);return q}});O.push({l:'駁回',h:'地方官失望，存糧恐繼續惡化',fn:()=>{bad(f,5);return OKK('你駁回了奏請。')}})}
 else if(k==='taxup'){O.push({l:'准：加徵賦稅',h:'賦稅升一級（短期增收、長期傷民）',fn:()=>{if(G.tax>=5)return NO('賦稅已是最高。');G.tax++;good(f,3);return OKK('賦稅調為「'+TAXN[G.tax-1]+'」。')}});
  O.push({l:'緊縮宮廷開支',h:'宮廷用度降一級',fn:()=>{if(G.crt<=1)return NO('已是最節儉。');G.crt--;for(const c of consorts())c.op=cl(c.op-2);return OKK('宮廷用度降為「'+CRTN[G.crt-1]+'」。')}});
  O.push({l:'駁回',h:'財政困局依舊',fn:()=>{bad(f,3);return OKK('你駁回了奏請。')}})}
 else if(k==='impeach'){const t=P(x.tg);O.push({l:'准予徹查',h:x.guilty?'被劾者確有貪腐證據':'被劾者或許無辜',fn:()=>{if(x.guilty){const pl=plotOf('corrupt',x.tg);if(pl){pl.rep=true;G.sit.push({id:G.nid++,k:'case',kind:'corrupt',real:x.tg,sus:[x.tg],ev:75,age:0,t0:G.t,txt:'御史彈劾屬實，'+nmt(t)+'貪墨案查實。',plot:pl.id})}good(f,4);return OKK('徹查屬實，立案處置。（見「朝政」）')}
   good(t,5);bad(f,3);return OKK('徹查後證明'+nmt(t)+'清白，御史略顯尷尬。')}});
  O.push({l:'駁回彈劾',h:'維護被劾者',fn:()=>{good(t,4);bad(f,4);return OKK('你駁回了彈劾。')}});O.push({l:'留中敲打',h:'不查，但暗中警告',fn:()=>{if(t)t.cor=Math.max(0,t.cor-3);return OKK('你將奏摺留中，改日敲打了被劾者。')}})}
 else if(k==='recommend'){const c=P(x.cand),od=offDef(x.off);O.push({l:'准：任命'+nm(c),h:od.n,fn:()=>{if(G.off[x.off])return NO('此職已有人。');const q=actAppoint(x.off,c.id);if(q.ok)good(f,3);return q}});O.push({l:'駁回（可另選他人）',h:'',fn:()=>{bad(f,2);return OKK('你駁回了舉薦。')}})}
 else if(k==='heir'){for(const p of myKids().filter(z=>z.role==='prince'&&age(z)>=1).sort((a,b)=>age(b)-age(a)))O.push({l:'立'+nm(p)+'為太子',h:age(p)+'歲 母：'+(p.mo!=null?nm(P(p.mo)):'—'),fn:()=>{const q=actMakeHeir(p);if(q.ok)good(f,3);return q}});O.push({l:'緩議',h:'再觀察幾年',fn:()=>{bad(f,3);G.fd.clean=cl(G.fd.clean+.5,0,35);return OKK('你以「皇子尚幼」為由，擱置了立儲之議。')}})}
 else if(k==='select'){O.push({l:'准：開選秀女',h:'至「後宮」辦理選秀',fn:()=>{G.selOK=G.t;good(f,3);return OKK('已准開選，請至「後宮」頁面辦理。')}});O.push({l:'駁回',h:'',fn:()=>{bad(f,2);return OKK('你駁回了選秀之議。')}})}
 else if(k==='project'){const r=G.reg[x.reg];O.push({l:'准：興辦',h:'耗銀'+x.cost+'萬兩（分期），完工後長期受益',fn:()=>{const q=actProject(x.k,x.reg);if(q.ok)good(f,4);return q}});O.push({l:'駁回',h:'',fn:()=>{bad(f,3);return OKK('你駁回了工程奏請。')}})}
 else if(k==='merit'){O.push({l:'厚賞',h:'耗50萬兩',fn:()=>{if(G.tre<50)return NO('國庫不足。');G.tre-=50;if(f){f.op=cl(f.op+14);f.pst=Math.max(0,(f.pst||0)-5)}return OKK('厚賞'+nm(f)+'。')}});
  O.push({l:'升任大將軍',h:'授予統兵大權（其野心越大風險越高）',fn:()=>{if(!f)return NO('');return actAppoint('gen',f.id)}});
  O.push({l:'駁回',h:'功臣寒心',fn:()=>{bad(f,12);return OKK('你駁回了請賞。')}})}
 else if(k==='marry'){const a=P(x.a),b=P(x.b);O.push({l:'准：賜婚',h:'結好'+(b.clan!=null?G.clans[b.clan].s+'氏':'')+'一族',fn:()=>{if(a.sp!=null||b.sp!=null)return NO('其中一方已婚配。');const q=actMarryOff(a,b);good(f,6);return q}});O.push({l:'駁回',h:'',fn:()=>{bad(f,3);return OKK('你婉拒了婚事。')}})}
 else if(k==='retire'){const t=P(x.tg);O.push({l:'准其致仕',h:'賜金歸鄉',fn:()=>{const o=t.off;vacate(t);good(t,8);log(nmt(t)+'致仕歸鄉。');return OKK('准其告老還鄉。')}});O.push({l:'挽留',h:'再留任數年',fn:()=>{good(t,5);return OKK('你溫言挽留，老臣感念。')}});O.push({l:'加太傅虛銜',h:'加官安撫，實權不變',fn:()=>{good(t,10);t.fav=cl(t.fav+5);return OKK('加封虛銜以示恩寵。')}})}
 else if(k==='envoy'){const fo=G.foe[x.foe];
  if(x.kind==='trade')O.push({l:'准：開市通商',h:'每月增收',fn:()=>actDiplo(x.foe,'trade')});
  if(x.kind==='tribute')O.push({l:'受降納貢',h:'成為藩屬，聲望+3',fn:()=>{const q=actDiplo(x.foe,'tribute');if(!q.ok){fo.str=Math.min(fo.str,49);return actDiplo(x.foe,'tribute')}return q}});
  if(x.kind==='marry')O.push({l:'准：以公主和親',h:'關係大幅改善',ask:{title:'選擇和親公主',items:alivePs().filter(p=>p.role==='princess'&&age(p)>=14&&p.sp==null).map(p=>({id:p.id,label:nmt(p),sub:age(p)+'歲'}))},fn:id=>actHeqin(P(id),x.foe)});
  O.push({l:'婉拒',h:'對方不悅',fn:()=>{fo.att=cl(fo.att-6);return OKK('你婉拒了使節。')}})}
 else if(k==='festival'){const famine=G.sit.some(s=>s.k==='disaster'&&s.sev>=2);
  O.push({l:'大宴慶典',h:'耗40萬兩，聲望與眾人好感上升'+(famine?'（災荒中恐遭非議）':''),fn:()=>{if(G.tre<40)return NO('國庫不足。');G.tre-=40;for(const p of alivePs())if(['official','general','consort'].includes(p.role)&&chance(.7))p.op=cl(p.op+2);G.rep=cl(G.rep+2);if(famine)G.mind=cl(G.mind-2);return OKK('節慶盛大，君臣同樂。')}});
  O.push({l:'循例從簡',h:'耗12萬兩',fn:()=>{if(G.tre<12)return NO('國庫不足。');G.tre-=12;G.rep=cl(G.rep+.5);return OKK('節慶依例舉行。')}});
  O.push({l:'罷宴節用',h:'不費分文，略失顏面'+(famine?'，民心上升':''),fn:()=>{G.rep=cl(G.rep-1);if(famine)G.mind=cl(G.mind+1.5);return OKK('你下詔今年節慶從簡。')}})}
 else if(k==='seek'){const od=offDef(x.off);O.push({l:'准：任為'+od.n,h:'',fn:()=>{if(G.off[x.off])return NO('此職已有人。');return actAppoint(x.off,f.id)}});O.push({l:'駁回',h:'',fn:()=>{bad(f,5);return OKK('你駁回了自薦。')}})}
 else if(k==='warreq'){const wars=G.sit.filter(s=>s.k==='war'||s.k==='revolt');O.push({l:'准其統兵',h:'皇子領兵，勝則聲望大漲，亦添野心',fn:()=>{if(!wars.length)return NO('戰事已息。');const s=wars[0];dispatch(s,f.id,Math.min(10,G.army*.4));f.pst=(f.pst||0)+2;f.amb=cl(f.amb+4);good(f,10);return OKK(nmt(f)+'奉旨領兵出征。')}});O.push({l:'駁回',h:'',fn:()=>{bad(f,8);return OKK('你駁回了請纓。')}})}
 else if(k==='fiefreq'){O.push({l:'准其就藩',h:'離京遠避，但地方自主傾向上升',ask:{title:'封於何處',items:regItems()},fn:id=>{const q=actFief(f,id);good(f,8);return q}});O.push({l:'留在京中',h:'',fn:()=>{bad(f,4);return OKK('你要他留在京中。')}})}
 else if(k==='omen'){O.push({l:'大肆慶賀',h:'耗30萬兩，威望+3，民間微詞',fn:()=>{if(G.tre<30)return NO('國庫不足。');G.tre-=30;G.rep=cl(G.rep+3);G.mind=cl(G.mind-1);return OKK('你下詔大慶祥瑞。')}});O.push({l:'謙辭罪己',h:'威望+2、民心+1.5，清流稱頌',fn:()=>{G.rep=cl(G.rep+2);G.mind=cl(G.mind+1.5);for(const p of alivePs())if(p.fac==='clean')p.op=cl(p.op+2);return OKK('你自謙德薄，下詔罪己。')}});O.push({l:'平常處之',h:'',fn:()=>OKK('你淡淡一笑，擱置不提。')})}
 else if(k==='complaint'){const g=P(x.gov);O.push({l:'派員查辦',h:'立案追查州牧',fn:()=>{if(!g||!g.alive)return NO('此人已不在。');const pl=plotOf('corrupt',g.id)||addPlot('corrupt',g);pl.rep=true;G.sit.push({id:G.nid++,k:'case',kind:'corrupt',real:g.id,sus:[g.id],ev:70,age:0,t0:G.t,txt:'百姓告狀屬實，州牧'+nmt(g)+'貪墨案立案。',plot:pl.id});return OKK('已立案查辦。')}});
  O.push({l:'申斥州牧',h:'',fn:()=>{if(g){g.cor=Math.max(0,g.cor-6);bad(g,6)}return OKK('你下旨申斥州牧。')}});O.push({l:'撫恤苦主',h:'10萬兩，民心+',fn:()=>{if(G.tre<10)return NO('國庫不足。');G.tre-=10;G.mind=cl(G.mind+.8);return OKK('你撫恤了告狀百姓。')}});O.push({l:'不理',h:'民心下降',fn:()=>{G.mind=cl(G.mind-1.2);return OKK('此事不了了之。')}})}
 else if(k==='dispute'){const A=P(x.a),B=P(x.b);O.push({l:'支持'+nm(A),h:FAC[facOf(A)].n+'得勢',fn:()=>{good(A,8);bad(B,6);G.fd[facOf(A)]=cl(G.fd[facOf(A)]+2,0,35);bump(B,A,-5);return OKK('你支持'+nm(A)+'的主張。')}});
  O.push({l:'支持'+nm(B),h:FAC[facOf(B)].n+'得勢',fn:()=>{good(B,8);bad(A,6);G.fd[facOf(B)]=cl(G.fd[facOf(B)]+2,0,35);bump(A,B,-5);return OKK('你支持'+nm(B)+'的主張。')}});O.push({l:'各打五十大板',h:'兩邊都不討好，但你不偏不倚',fn:()=>{bad(A,3);bad(B,3);G.rep=cl(G.rep+1);return OKK('你各責一頓，爭議暫息。')}})}
 else if(k==='mutiny'){O.push({l:'補發軍餉',h:'耗60萬兩，軍心+15',fn:()=>{if(G.tre<60)return NO('國庫不足。');G.tre-=60;G.morale=cl(G.morale+15);return OKK('欠餉補發，軍心稍定。')}});O.push({l:'好言安撫',h:'軍心+4，後患未除',fn:()=>{G.morale=cl(G.morale+4);return OKK('你遣使撫慰將士。')}});O.push({l:'嚴懲帶頭者',h:'畏懼度+4，軍心-8',fn:()=>{G.fear=cl(G.fear+4);G.morale=cl(G.morale-8);return OKK('你下令嚴懲鬧事者。')}})}
 else if(k==='scholar'){const t=P(x.tg);O.push({l:'重賞並頒行天下',h:'耗30萬兩，威望+2',fn:()=>{if(G.tre<30)return NO('國庫不足。');G.tre-=30;G.rep=cl(G.rep+2);good(t,12);return OKK('你重賞大儒，《經世論》頒行天下。')}});O.push({l:'禮遇而已',h:'',fn:()=>{good(t,4);return OKK('你溫言嘉勉。')}})}
 else if(k==='dowager'){const d=P(m.from),g=P(x.girl);O.push({l:'遵懿旨納為妃',h:'太后與外戚歡喜，後宮添一人',fn:()=>{if(!g||g.role!=='maiden')return NO('此女已不在。');g.role='consort';g.rank=3;g.sp=G.emp;g.fav=ri(30,50);bio(g,'奉太后懿旨入宮，封嬪。');if(d)good(d,10);G.fd.wai=cl(G.fd.wai+1.5,0,35);chron(nm(g)+'入宮，封嬪。',2);return OKK(nm(g)+'入宮為嬪。')}});O.push({l:'婉拒',h:'太后不悅',fn:()=>{if(d)bad(d,10);G.fd.wai=cl(G.fd.wai-1,0,35);return OKK('你婉言謝絕了太后。')}})}
 return O}
function runMemo(mid,i){const m=G.memo.find(x=>x.id===mid);if(!m)return NO('奏摺已不存在。');if(G.mw%3===0&&G.ap<1)return NO('精力不足（每批閱三份奏摺耗一旬）。');
 const o=memoOpts(m)[i];if(!o)return NO('選項無效。');const s0=decSnap();let r;try{r=o.fn()}catch(e){return NO('此事已有變化，無法照此辦理。')}if(r.ok){decRec(m,o,s0);G.memo=G.memo.filter(z=>z!==m);if(G.mw%3===0)G.ap--;G.mw++}return r}
function leaveMemo(mid){G.memo=G.memo.filter(x=>x.id!==mid);return OKK('留中不發。')}

/* ---------- 人物互動選單 ---------- */
function regItems(){return Object.values(G.reg).map(r=>({id:r.id,label:r.n,sub:'民怨'+rd(r.un)+' 存糧'+rd(r.food)}))}
function personActions(p){const O=[];const r=p.role;const a=age(p);
 const offItems=oid=>candidatesFor(oid);
 if(r==='official'||r==='general'||r==='eunuch'){
  O.push({l:'召見垂詢',h:'1旬｜聽取彙報，也可能聽到閒言碎語',fn:()=>actCounsel(p)});
  O.push({l:'勉勵',h:'好感小升',fn:()=>actPraise(p)});O.push({l:'賞賜',h:'20萬兩',fn:()=>actReward(p)});O.push({l:'斥責',h:'好感下降',fn:()=>actScold(p)});
  O.push({l:'推心置腹',h:'1旬｜大幅增進好感',fn:()=>actBefriend(p)});O.push({l:'密令監視',h:'1旬｜一年內其陰謀更易敗露',fn:()=>actWatch(p)});
  O.push({l:'派為欽差巡視',h:'1旬｜可查地方官',ask:{title:'巡視哪裡',items:regItems()},fn:id=>actEnvoy(p,id)});
  O.push({l:'任命官職',h:'',ask:{title:'任命'+nm(p)+'為',items:allOffIds().filter(o=>{const od=offDef(o);return od.role?p.role===od.role:p.role==='official'}).map(o=>({id:o,label:offName(o),sub:holder(o)?'現任：'+nm(holder(o)):'空缺'}))},fn:id=>actAppoint(id,p.id)});
  if(p.off)O.push({l:'罷免',h:'',fn:()=>actDismiss(p.off)});
  O.push({l:'處置：流放',h:'',fn:()=>{punish(p,'exile','獲罪');return OKK('已流放。')}});O.push({l:'處置：處死',h:'',fn:()=>{punish(p,'death','獲罪');return OKK('已處死。')}});
  if(r==='official'&&p.sp==null&&a>=17&&a<=45)O.push({l:'賜婚',h:'',ask:{title:'為'+nm(p)+'選配',items:alivePs().filter(x=>x.role==='maiden'&&age(x)>=15&&x.sp==null).map(x=>({id:x.id,label:nm(x),sub:age(x)+'歲'}))},fn:id=>actMarryOff(p,P(id))})}
 else if(r==='consort'){
  O.push({l:'臨幸',h:'1旬｜增寵、可能有孕',fn:()=>actVisit(p)});O.push({l:'陪伴談心',h:'1旬｜增進情意',fn:()=>actAccompany(p)});O.push({l:'賞賜',h:'15萬兩',fn:()=>actGiftC(p)});
  const nxt=p.rank+1;if(nxt<=6)O.push({l:'晉位→'+RK[nxt],h:countRank(nxt)>=RKCAP[nxt]?'位份已滿':'',fn:()=>actSetRank(p,nxt)});if(p.rank>1)O.push({l:'降位→'+RK[p.rank-1],h:'',fn:()=>actSetRank(p,p.rank-1)});
  O.push({l:'禁足',h:'',fn:()=>actPunishC(p,'lock')});O.push({l:'打入冷宮',h:'',fn:()=>actPunishC(p,'cold')});O.push({l:'賜死',h:'',fn:()=>actPunishC(p,'death')})}
 else if(r==='prince'||r==='princess'){const mine=p.fa===G.emp;
  if(p.pot&&a<18){O.push({l:'親自教導',h:'1旬｜提升專修能力、增進父子情',fn:()=>actTeach(p)});
   O.push({l:'指派師傅',h:'由官員長期教導，其人也將成為擁護者',ask:{title:'選師傅',items:alivePs().filter(x=>x.role==='official'&&age(x)>=28&&!x.exile).sort((a,b)=>Math.max(b.st.lit,b.st.pol)-Math.max(a.st.lit,a.st.pol)).slice(0,10).map(x=>({id:x.id,label:nmt(x),sub:'文'+rd(x.st.lit)+' 政'+rd(x.st.pol)+' 武'+rd(x.st.mil)}))},fn:id=>actSetTutor(p,P(id))});
   O.push({l:'指定專修',h:'',ask:{title:'專修方向',items:Object.keys(STN).map(k=>({id:k,label:STN[k],sub:'現'+rd(p.st[k])}))},fn:id=>actSetFocus(p,id)})}
  if(r==='prince'&&mine&&G.heir!==p.id)O.push({l:'立為太子',h:'',fn:()=>actMakeHeir(p)});if(G.heir===p.id)O.push({l:'廢太子',h:'',fn:()=>actDeposeHeir()});
  if((r==='prince')&&a>=16)O.push({l:p.fief?'收回封地':'賜封地就藩',h:p.fief?'':'離京就藩，易生地方勢力',ask:p.fief?null:{title:'封於何處',items:regItems()},fn:id=>p.fief?actRecallFief(p):actFief(p,id)});
  if(r==='prince'&&p.sp==null&&a>=15)O.push({l:'賜婚',h:'',ask:{title:'選配',items:alivePs().filter(x=>x.role==='maiden'&&age(x)>=14&&x.sp==null).map(x=>({id:x.id,label:nm(x),sub:age(x)+'歲 '+(x.clan!=null?G.clans[x.clan].s+'氏':'民間')}))},fn:id=>actMarryOff(p,P(id))});
  if(r==='princess'&&p.sp==null&&a>=14){O.push({l:'賜婚駙馬',h:'',ask:{title:'選駙馬',items:alivePs().filter(x=>x.role==='official'&&x.g==='M'&&age(x)>=18&&age(x)<=36&&x.sp==null).map(x=>({id:x.id,label:nmt(x),sub:age(x)+'歲 '+FAC[x.fac].n}))},fn:id=>actMarryOff(P(id),p)});
   O.push({l:'和親外邦',h:'',ask:{title:'嫁往何國',items:Object.values(G.foe).map(f=>({id:f.k,label:f.n,sub:'國力'+rd(f.str)+' 態度'+rd(f.att)}))},fn:id=>actHeqin(p,id)})}
  O.push({l:'賞賜',h:'20萬兩',fn:()=>actReward(p)});O.push({l:'責罰',h:'',fn:()=>actScold(p)});
  if(r==='prince'&&mine)O.push({l:'削爵圈禁',h:'',fn:()=>{punish(p,'strip','不軌');return OKK('已削爵圈禁。')}})}
 else if(r==='kin'||r==='dowager'){O.push({l:r==='dowager'?'請安':'召見',h:'1旬',fn:()=>{const q=needAP(1);if(q)return q;G.ap--;memo_(p,'visit',6,'蒙皇帝垂顧。');return OKK('你前往探望'+nmt(p)+'。')}});O.push({l:'賞賜',h:'20萬兩',fn:()=>actReward(p)})}
 else if(r==='maiden'||r==='son'||r==='wife'){O.push({l:'賞賜',h:'20萬兩',fn:()=>actReward(p)})}
 return O}

/* ---------- 快進 ---------- */
function advance(n){const start=G.emp;let done=0,why='';
 const sit0=new Set(G.sit.map(s=>s.id)),intel0=new Set(G.intel.map(i=>i.id));
 for(let i=0;i<n;i++){endMonth();done++;if(G.over){why='over';break}if(G.emp!==start){why='succ';break}
  if(G.sit.some(s=>!sit0.has(s.id)&&(s.k!=='disaster'||s.sev>=3)&&s.k!=='case')){why='sit';break}
  if(G.intel.some(x=>!intel0.has(x.id))){why='intel';break}
  if(emp().ill){why='ill';break}}
 return{done,why}}

/* ---------- 因果說明 ---------- */
function statWhy(k){const L=[];const add=(s,t)=>L.push({s,t});const f=G.fin||{inc:0,exp:0,leak:0,army:0,crt:0,sal:0};const regs=Object.values(G.reg);
 if(k==='mind'){if(G.burden>45)add(-1,'賦稅負擔已達'+rd(G.burden)+'，民間不堪重負');else if(G.burden<28)add(1,'賦稅輕簡，負擔僅'+rd(G.burden));
  if((G.avgUn||0)>32)add(-1,'各地民怨平均'+rd(G.avgUn)+'，積怨難平');else if((G.avgUn||0)<18)add(1,'各地民情安定');
  const fam=regs.filter(r=>r.food<35);if(fam.length)add(-1,fam.map(r=>r.n).join('、')+'存糧告急');
  if(G.rep>60)add(1,'威望尚高，百姓信服');if(G.rep<40)add(-1,'君威不振');if(G.life==='tyrant')add(-1,'高壓統治使人心離散');if(G.life==='indulge')add(-1,'縱情享樂，民間側目');
  const un=G.sit.filter(s=>s.k==='disaster'&&!s.relief);if(un.length)add(-1,un.map(s=>G.reg[s.reg].n+s.kind).join('、')+'尚未賑濟');if(G.sit.some(s=>s.k==='revolt'))add(-1,'有民變未平');
  if(G.zeit&&G.zeit.k==='decline')add(-1,'末世氣象，人心浮動')}
 else if(k==='auth'){if(G.att<30)add(-1,'許久未上朝，朝臣漸生輕慢（出席'+rd(G.att)+'）');else if(G.att>60)add(1,'勤於上朝，威令通行');
  const tf=topFac();if(G.pow[tf]>40)add(-1,FAC[tf].n+'勢力已達'+rd(G.pow[tf])+'，漸有挾制之勢');else if(G.pow[tf]<28)add(1,'朝中無人獨大');
  if(G.regent)add(-1,'尚在攝政之下');if(G.puppet)add(-1,'皇權已近架空');if(G.inst.spy)add(1,'錦衣衛耳目遍佈');if(G.inst.cab)add(1,'內閣議政分了權臣之勢');
  if(G.rep>60)add(1,'威望為皇權助力');if(G.rep<40)add(-1,'威望不足，政令難行');const gu=holder('guard');if(gu&&gu.op<35)add(-1,'禁軍統領對你心懷不滿');if(G.memo.length>8)add(-1,'奏摺積壓，權臣趁機代批');
  if(G.life==='delegate')add(-1,'放權使權柄外移');if(G.life==='tyrant')add(1,'專制手段令人畏懼')}
 else if(k==='rep'){if(G.life==='diligent')add(1,'勤政使威望緩升');if(G.life==='indulge')add(-1,'享樂使威望緩降');if(G.reign.wins)add(1,'本朝勝仗'+G.reign.wins+'場');if(G.reign.losses)add(-1,'本朝敗仗'+G.reign.losses+'場');
  if(G.reign.exec>5)add(-1,'誅殺過多，清議不滿');if(G.editHist)add(-1,'曲筆潤飾史書，清流不齒')}
 else if(k==='tre'){add(f.inc-f.exp>=0?1:-1,'月入'+rd(f.inc)+'、月出'+rd(f.exp)+'（軍費'+rd(f.army||0)+'、宮廷'+rd(f.crt||0)+'、俸祿'+rd(f.sal||0)+'）');
  if(f.leak>6)add(-1,'官吏貪墨約'+rd(f.leak)+'/月流失');const w=G.sit.filter(s=>s.k==='war'||s.k==='revolt').length;if(w)add(-1,'戰事'+w+'場，軍費吃緊');
  if(G.proj.length)add(-1,'在建工程分期支出');if(G.tax>=4)add(1,'重稅帶來增收，但會積累民間負擔');if(G.debt>0)add(-1,'國庫已虧空，連續'+G.debt+'月欠發俸餉');
  if(G.zeit&&G.zeit.k==='gilded')add(-1,'奢靡之風推高宮廷開支')}
 else if(k==='army'){add(G.mil>=3?1:-1,'軍費「'+MILN[G.mil-1]+'」決定兵員目標與軍心');if(G.debt>0)add(-1,'欠餉使軍心動搖');if(G.sit.some(s=>s.k==='war'||s.k==='revolt'))add(-1,'連年戰事消耗兵員與士氣');else add(1,'無戰事，兵員逐步補充')}
 else if(k==='burden'){add(G.tax>=4?-1:1,'賦稅「'+TAXN[G.tax-1]+'」：'+(G.tax>=4?'每月累積負擔':G.tax<=2?'每月減輕負擔':'負擔大致持平'));if(G.army>45)add(-1,'兵員眾多，攤派加重')}
 else if(k==='gra'){add(1,'每年秋季入倉新糧');add(-1,'賑濟與歲耗會消耗存糧')}
 if(!L.length)add(0,'暫無明顯推動因素，大致平穩。');return L}
function snapStats(){return{tre:G.tre,mind:G.mind,auth:G.auth,rep:G.rep,morale:G.morale,burden:G.burden,gra:G.gra,army:G.army,pop:Object.values(G.reg).reduce((a,r)=>a+r.pop,0),t:G.t}}
function digest(s0){const s1=snapStats();const d=[['國庫','tre',1],['民心','mind',1],['皇權','auth',1],['威望','rep',1],['軍心','morale',1],['賦稅負擔','burden',-1],['人口','pop',1]].map(([n,k,g])=>({n,k,v:s1[k]-s0[k],g})).filter(x=>Math.abs(x.v)>=(x.k==='tre'||x.k==='pop'?5:1));
 const lines=G.log.filter(l=>l.t>=s0.t&&l.cls!=='you').slice(0,40).sort((a,b)=>(b.cls==='big'?2:b.cls==='warn'?1:0)-(a.cls==='big'?2:a.cls==='warn'?1:0)).slice(0,10);
 const worst=d.filter(x=>x.k!=='tre'&&x.k!=='pop'&&x.v*x.g<-2).sort((a,b)=>a.v*a.g-b.v*b.g)[0];
 return{from:s0.t,to:G.t,d,lines,why:worst?statWhy(worst.k).slice(0,3):[]}}

/* ---------- 自擬詔令 ---------- */
function lowReg(key){return Object.values(G.reg).filter(r=>!r.sec).sort((a,b)=>a[key]-b[key])[0]}
const EDICTS=[
 {k:/減稅|輕徭|薄賦|免稅|減賦|減輕賦|輕賦|減免/,fn:()=>{if(G.tax<=1)return NO('賦稅已是最輕。');G.tax--;G.mind=cl(G.mind+1);return OKK('下詔減賦，稅率降為「'+TAXN[G.tax-1]+'」。')}},
 {k:/加稅|增稅|加賦|籌餉|徵餉/,fn:()=>{if(G.tax>=5)return NO('賦稅已是最重。');G.tax++;return OKK('下詔加賦，稅率升為「'+TAXN[G.tax-1]+'」。')}},
 {k:/賑|救災|濟民|開倉/,fn:()=>{const r=lowReg('food');return actRelief(r.id)}},
 {k:/大赦|赦免|赦天下/,fn:()=>{G.mind=cl(G.mind+2);G.rep=cl(G.rep+1);G.fear=cl(G.fear-6);let n=0;for(const p of alivePs())if(p.exile){p.exile=false;p.op=cl(p.op+10);n++}return OKK('大赦天下，'+(n?n+'名流放者得以回京，':'')+'民心稍安。')}},
 {k:/求賢|開科|取士|科舉|恩科/,fn:()=>{if(G.t-(G.lastExam||-99)<18)return NO('不久前才開過科。');if(G.tre<40)return NO('國庫不足。');G.tre-=40;G.lastExam=G.t;exam();return OKK('特開恩科，廣納賢才。')}},
 {k:/整軍|練兵|操練|整飭/,fn:()=>{if(G.tre<15)return NO('國庫不足。');G.tre-=15;G.morale=cl(G.morale+6);return OKK('下詔整飭軍紀、操練士卒，軍心上升。')}},
 {k:/募兵|徵兵|擴軍/,fn:()=>{if(G.tre<40)return NO('國庫不足。');G.tre-=40;G.army+=6;G.burden=cl(G.burden+2.5);G.mind=cl(G.mind-.8);return OKK('下詔募兵六萬。')}},
 {k:/裁軍|裁兵|減兵|罷兵/,fn:()=>{G.army=Math.max(15,G.army-6);G.burden=cl(G.burden-3);G.morale=cl(G.morale-4);for(const p of alivePs())if(p.role==='general')p.op=cl(p.op-3);return OKK('下詔裁減冗兵六萬，將門多有怨言。')}},
 {k:/節儉|禁奢|儉樸|減宮/,fn:()=>{if(G.crt<=1)return NO('宮廷用度已是最儉。');G.crt--;G.rep=cl(G.rep+1);for(const c of consorts())c.op=cl(c.op-1.5);return OKK('下詔宮中節用，後宮略有微詞，朝野稱頌。')}},
 {k:/肅貪|反貪|懲貪|清查|吏治|考課/,fn:()=>{let n=0;for(const p of alivePs())if(p.off&&p.cor>20){p.cor=cl(p.cor-2);if(chance(.4))p.op=cl(p.op-2);n++}
  const pl=G.plots.find(x=>x.k==='corrupt'&&!x.rep&&P(x.a)&&P(x.a).alive);if(pl){pl.rep=true;const t=P(pl.a);G.sit.push({id:G.nid++,k:'case',kind:'corrupt',real:t.id,sus:[t.id],ev:75,age:0,t0:G.t,txt:'整頓吏治之下，'+nmt(t)+'貪墨敗露。',plot:pl.id});return OKK('下詔整頓吏治，百官收斂，並查出一樁貪墨大案。（見「朝堂」）')}
  return OKK('下詔整頓吏治，百官收斂，未查得大案。')}},
 {k:/水利|修河|治河|河工/,fn:()=>{const r=lowReg('pr');return actProject('canal',r.id)}},
 {k:/祭天|祈福|祭祀|封禪/,fn:()=>{if(G.tre<20)return NO('國庫不足。');G.tre-=20;G.rep=cl(G.rep+2);if(G.sit.some(s=>s.k==='disaster'))G.mind=cl(G.mind+1);return OKK('率百官祭天祈福，人心稍定。')}},
 {k:/犒賞|賞軍|賞三軍/,fn:()=>{if(G.tre<50)return NO('國庫不足。');G.tre-=50;G.morale=cl(G.morale+12);return OKK('犒賞三軍，將士歡呼。')}},
 {k:/通商|開海|互市/,fn:()=>{if(G.inst.shi)return NO('已設市舶司。');return actInst('shi')}},
 {k:/屯田|墾荒/,fn:()=>{G.gra+=40;G.burden=cl(G.burden+1);return OKK('下詔屯田墾荒，糧倉略增。')}},
 {k:/選秀/,fn:()=>{G.selOK=G.t;return OKK('下詔選秀，可至「後宮」辦理。')}}];
function actEdict(txt){txt=(txt||'').trim();if(txt.length<2)return NO('請寫下詔令內容。');const q=needAP(1);if(q)return q;
 const hits=EDICTS.filter(e=>e.k.test(txt));if(!hits.length)return NO('群臣不解聖意，不知如何奉行。（可試：減輕賦稅、開倉賑濟、整頓吏治、整軍、大赦、特開恩科、興修水利、節儉、犒賞三軍、祭天祈福、屯田、通商）');
 const outs=[];let any=false;for(const h of hits.slice(0,2)){const r=h.fn();outs.push(r.msg);if(r.ok)any=true}
 if(any){G.ap--;chron('皇帝下詔：「'+txt.slice(0,30)+'」。',2)}return any?OKK(outs.join('\n')):NO(outs.join('\n'))}

/* ---------- 廷議 ---------- */
function minister(pref,used){let pool=alivePs().filter(p=>p.id!==G.emp&&!used.has(p.id)&&!p.exile&&age(p)>=22&&(p.off||p.role==='official'||p.role==='general'||p.role==='eunuch'));
 let c=pool.filter(p=>pref.includes(facOf(p)));if(!c.length)c=pool;c.sort((a,b)=>weight(b)-weight(a));const p=pick(c.slice(0,3));if(p)used.add(p.id);return p||null}
function debateTopic(){const T=[];const f=G.fin||{inc:0,exp:0,leak:0};const lowF=lowReg('food'),lowP=lowReg('pr');
 const war=G.sit.find(s=>s.k==='war'),dis=G.sit.find(s=>s.k==='disaster'&&!s.relief);const tf=topFac(),L=facLeader(tf);
 T.push({k:'fin',w:G.tre<400||f.exp>f.inc?4:1,title:'國庫入不敷出',ctx:'本月入'+Math.round(f.inc)+'萬、出'+Math.round(f.exp)+'萬，國庫尚存'+Math.round(G.tre)+'萬。戶部請旨如何開源節流。',opts:[
  {pref:['chan','army'],l:'加稅籌餉',h:'賦稅升一級，民心有損',say:'國用不足，唯有加賦。臣願督辦，旬月可見成效。',fn:()=>{if(G.tax>=5)return NO('賦稅已是最重。');G.tax++;return OKK('下旨加賦，稅率升為「'+TAXN[G.tax-1]+'」。')}},
  {pref:['clean'],l:'節流裁用',h:'宮廷用度降一級，後宮微詞',say:'開源易傷民，節流先自宮中始。陛下躬行儉約，天下自服。',fn:()=>{if(G.crt<=1)return NO('宮廷用度已是最儉。');G.crt--;G.rep=cl(G.rep+1);for(const c of consorts())c.op=cl(c.op-1.5);return OKK('宮中節用，朝野稱頌，後宮略有怨言。')}},
  {pref:['eun','wai'],l:'賣官鬻爵',h:'+80萬兩，吏治受損',say:'不加賦、不裁用，只需開捐納之路，數月可得鉅款。',fn:()=>{G.tre+=80;for(const p of alivePs())if(p.off&&chance(.25))p.cor=cl(p.cor+3);G.rep=cl(G.rep-2);return OKK('開捐納之路，得銀80萬兩。')}}]});
 if(war)T.push({k:'war',w:5,title:'邊事告急',ctx:G.foe[war.foe].n+'犯境，戰事已延'+war.age+'月，前線'+(war.front>10?'略佔上風':war.front<-10?'處於下風':'僵持不下')+'。',opts:[
  {pref:['army'],l:'增兵決戰',h:'60萬兩，前線大幅上升',say:'賊勢已衰，正宜增兵一舉殲之，遲則生變！',fn:()=>{if(G.tre<60)return NO('國庫不足。');G.tre-=60;war.front=cl(war.front+14,-100,100);G.burden=cl(G.burden+1.5);return OKK('增兵前線，士氣為之一振。')}},
  {pref:['clean','eun'],l:'納幣議和',h:'50萬兩，立刻停戰',say:'兵者凶器，連年征戰民不堪命。不如納幣求和，休養生息。',fn:()=>actDiplo(war.foe,'peace')},
  {pref:['kin','chan'],l:'堅守不戰',h:'不花錢，前線略穩',say:'據險固守，待其師老自退，不必輕啟戰端。',fn:()=>{war.front=cl(war.front+3,-100,100);return OKK('下令各鎮堅守，不輕出戰。')}}]});
 if(dis)T.push({k:'dis',w:5,title:G.reg[dis.reg].n+dis.kind,ctx:G.reg[dis.reg].n+'遭'+dis.kind+'，存糧'+Math.round(G.reg[dis.reg].food)+'，民情洶洶，戶部請旨。',opts:[
  {pref:['clean'],l:'開倉賑濟',h:'耗糧60，存糧回升',say:'民為邦本，倉廩正為此日而設，請速開倉！',fn:()=>actRelief(dis.reg)},
  {pref:['chan','eun'],l:'蠲免賦稅',h:'免該地一年賦稅',say:'賑濟耗糧，不如免其賦稅，使民自行謀生。',fn:()=>actExempt(dis.reg)},
  {pref:['army','wai'],l:'靜觀其變',h:'不耗錢糧，民心下降',say:'災情未必如奏報之重，不宜輕動倉儲。',fn:()=>{G.mind=cl(G.mind-2);G.reg[dis.reg].un=cl(G.reg[dis.reg].un+4);return OKK('朝廷未動，災區怨聲漸起。')}}]});
 if(L&&G.pow[tf]>36)T.push({k:'fac',w:4,title:FAC[tf].n+'勢盛',ctx:'「'+FAC[tf].n+'」勢力達'+Math.round(G.pow[tf])+'，領袖'+nmt(L)+'席間言辭漸顯強勢。',opts:[
  {pref:['clean','kin'],l:'申斥抑制',h:'領袖怨恨，皇權上升',say:'權柄不可旁落，宜明正其過，以儆效尤。',fn:()=>{L.op=cl(L.op-8);G.fear=cl(G.fear+4);G.auth=cl(G.auth+2.5);return OKK('當廷申斥'+nmt(L)+'，群臣悚然。')}},
  {pref:[tf],l:'加恩籠絡',h:'領袖歸心，皇權略降',say:'陛下待臣以厚，臣等自當肝腦塗地。',fn:()=>{L.op=cl(L.op+8);G.auth=cl(G.auth-1.5);return OKK('加恩'+nmt(L)+'，其黨欣然。')}}]});
 if(f.leak>7)T.push({k:'cor',w:3,title:'吏治敗壞',ctx:'各地貪墨每月約'+Math.round(f.leak)+'萬兩，御史屢有彈章。',opts:[
  {pref:['clean'],l:'嚴查整頓',h:'官員收斂，被查者怨恨',say:'蠹蟲不除，國庫終為所蛀。請明詔嚴查。',fn:()=>{for(const p of alivePs())if(p.off&&p.cor>40){p.cor=cl(p.cor-4);p.op=cl(p.op-3)}return OKK('嚴詔整頓吏治，貪官收斂。')}},
  {pref:['chan','wai'],l:'寬以待下',h:'官員感念，貪風略長',say:'水至清則無魚，宜稍寬之，以安人心。',fn:()=>{for(const p of alivePs())if(p.off){p.op=cl(p.op+1.5);if(chance(.3))p.cor=cl(p.cor+2)}return OKK('朝廷寬仁，百官感念。')}}]});
 T.push({k:'gen',w:2,title:'朝廷大計',ctx:'無緊急軍情，群臣議論今年施政方向。',opts:[
  {pref:['clean'],l:'特開恩科',h:'40萬兩，網羅人才',say:'國家求治，首在得人。請開恩科，廣納寒門英才。',fn:()=>{if(G.t-(G.lastExam||-99)<18)return NO('不久前才開過科。');if(G.tre<40)return NO('國庫不足。');G.tre-=40;G.lastExam=G.t;exam();return OKK('特開恩科。')}},
  {pref:['army'],l:'整軍經武',h:'15萬兩，軍心+6',say:'武備不可一日弛。請整飭軍紀、操練士卒。',fn:()=>{if(G.tre<15)return NO('國庫不足。');G.tre-=15;G.morale=cl(G.morale+6);return OKK('整軍經武，軍心上升。')}},
  {pref:['eun','wai','chan'],l:'休養生息',h:'負擔-3，民心+1',say:'連年多事，民力已疲，宜與民休息。',fn:()=>{G.burden=cl(G.burden-3);G.mind=cl(G.mind+1);return OKK('下詔與民休息。')}}]});
 let tot=T.reduce((a,t)=>a+(t.k===G.lastDebK?t.w*.2:t.w),0),x=R()*tot,top=T[0];for(const t of T){x-=(t.k===G.lastDebK?t.w*.2:t.w);if(x<=0){top=t;break}}
 const used=new Set();const opts=[];for(const o of top.opts){const p=minister(o.pref,used);if(p)opts.push(Object.assign({},o,{who:p.id}))}
 if(opts.length<2)return null;G.lastDebK=top.k;return{k:top.k,title:top.title,ctx:top.ctx,opts}}
function resolveDebate(d,i){const o=d.opts[i];const r=o.fn();if(!r.ok)return r;const w=P(o.who);if(w&&w.alive){w.op=cl(w.op+5);bio(w,'廷議中所奏「'+o.l+'」獲准。')}
 d.opts.forEach((z,j)=>{if(j!==i){const p=P(z.who);if(p&&p.alive)p.op=cl(p.op-3)}});chron('廷議'+d.title+'，從'+(w?nmt(w):'')+'議「'+o.l+'」。',2);return OKK('廷議裁決：'+o.l+'。'+r.msg)}
function deferDebate(d){for(const z of d.opts){const p=P(z.who);if(p&&p.alive)p.op=cl(p.op-1)}G.auth=cl(G.auth-.5);return OKK('你擱置了廷議，群臣各懷心思退下。')}

/* ---------- 人物故事線 ---------- */
const ARCT={ambition:'權臣之野',general:'功高震主',rivalry:'後宮暗流',scholar:'寒門賢臣'};
function arcOf(id){return(G.arcs||[]).find(a=>a.id===id)}
function arcLog(a,txt,imp){a.log.push({t:G.t,txt});if(imp)chron(txt,imp,[a.pid]);else log(txt);const p=P(a.pid);if(p)bio(p,txt)}
function arcMemo(a,w,txt){const m={id:G.nid++,k:'arc',t:G.t,from:a.pid,txt,x:{arc:a.id}};G.memo.push(m);a.wait=true;a.mid=m.id;a.w=w}
function arcEnd(a,txt,imp){a.done=true;a.wait=false;a.tend=G.t;if(txt)arcLog(a,txt,imp||2)}
function startArc(){if(!G.arcs)G.arcs=[];const act=G.arcs.filter(a=>!a.done);if(act.length>=3)return;
 const used=new Set();act.forEach(a=>{used.add(a.pid);if(a.pid2)used.add(a.pid2)});
 const k=pick(['ambition','general','rivalry','scholar'].filter(k=>!act.some(a=>a.k===k)));let o=null;
 if(k==='ambition'){const p=facLeader('chan');if(p&&!p.exile&&age(p)<70&&!used.has(p.id))o={pid:p.id}}
 else if(k==='general'){const c=alivePs().filter(p=>p.role==='general'&&p.st.mil>=55&&!p.exile&&!used.has(p.id));if(c.length)o={pid:pick(c).id}}
 else if(k==='rivalry'){const cs=consorts().filter(p=>p.fav>12&&!used.has(p.id));if(cs.length>=2){shuffle(cs);o={pid:cs[0].id,pid2:cs[1].id}}}
 else if(k==='scholar'){const c=alivePs().filter(p=>p.role==='official'&&p.st.pol>=58&&age(p)<45&&!p.exile&&!used.has(p.id)&&!(p.off&&(offDef(p.off)||{r:0}).r>=4));if(c.length)o={pid:pick(c).id}}
 if(!o)return;const a=Object.assign({id:G.nid++,k,st:0,cd:0,wait:false,mid:null,w:null,done:false,t0:G.t,n:0,log:[]},o);G.arcs.push(a);arcAdvance(a)}
function arcAdvance(a){const p=P(a.pid),q=a.pid2?P(a.pid2):null;const N=nmt(p);
 if(a.k==='ambition'){
  if(a.st===0){arcLog(a,N+'廣收門生故吏，朝中大半官員出自其門。');p.amb=cl(p.amb+8);a.st=1;a.cd=ri(5,8)}
  else if(a.st===1)arcMemo(a,'a1',N+'率群臣上表，請加「'+pick(['九錫','太師尊號','總領百官之權'])+'」，言辭懇切，群臣附議。');
  else if(a.st===2){if(a.n>=3){arcLog(a,N+'見皇帝一再隱忍，終於決定先下手為強。',3);addPlot('coup',p);arcEnd(a)}else arcMemo(a,'a2',N+'權傾朝野，奏事不避御前，朝中已有「只知某公、不知陛下」之語。')}}
 else if(a.k==='general'){
  if(a.st===0){arcLog(a,N+'屢立戰功，軍中威望日隆。');p.amb=cl(p.amb+4);a.st=1;a.cd=ri(5,8)}
  else if(a.st===1)arcMemo(a,'g1',N+'上疏表功，言「願為陛下鎮守一方」，並請賜爵封侯、增領兵權。');
  else if(a.st===2)arcMemo(a,'g2','有御史密奏：'+N+'擁兵自重，部曲只識其名、不識朝廷。')}
 else if(a.k==='rivalry'){
  if(a.st===0){arcLog(a,nm(p)+'與'+nm(q)+'爭寵，宮中暗流湧動。');a.st=1;a.cd=ri(4,7)}
  else if(a.st===1){const c=R()<.5?p:q,v=c===p?q:p;a.cul=c.id;a.vic=v.id;arcMemo(a,'r1','內侍密報：'+nm(c)+'暗中在'+nm(v)+'的飲食中動了手腳，真假難辨。')}
  else if(a.st===2){const v=P(a.vic),c=P(a.cul);if(!v||!c||!v.alive||!c.alive){arcEnd(a);return}v.hp=cl(v.hp-15);v.ill=true;arcMemo(a,'r2',nm(v)+'忽染重病，太醫私下說恐非尋常病症，宮中人心惶惶。')}}
 else if(a.k==='scholar'){
  if(a.st===0){arcLog(a,'寒門出身的'+N+'接連上書，指陳時弊，名動京師。');a.st=1;a.cd=ri(4,7)}
  else if(a.st===1)arcMemo(a,'s1','權貴聯名彈劾'+N+'「妄議朝政、狂悖無禮」，請予罷黜。');
  else if(a.st===2)arcMemo(a,'s2',N+'在任上政績卓著，吏民稱頌，請旨嘉獎擢用。')}}
function arcPick(a,key){const p=P(a.pid),q=a.pid2?P(a.pid2):null;const N=p?nmt(p):'';const sch=emp().st.sch;a.wait=false;const g=(x,v)=>{if(x&&x.alive)x.op=cl(x.op+v)};
 if(key==='stall'){g(p,-5);
  if(a.w==='a1'){a.sn=(a.sn||0)+1;if(a.sn>=2){arcLog(a,N+'的請求始終石沉大海，心中已生怨望。',2);p.amb=cl(p.amb+10);if(chance(.5)){addPlot('coup',p);log(N+'似在暗中串聯。','warn')}arcEnd(a)}else{arcLog(a,N+'的請求遲遲未獲答覆，頗為不快。');a.st=1;a.cd=10}}
  else if(a.w==='a2'){a.n++;arcLog(a,N+'見皇帝不置一詞，愈發肆無忌憚。');a.st=2;a.cd=8}
  else if(a.w==='r1'){a.st=2;a.cd=4}
  else if(a.w==='r2'){const v=P(a.vic);g(v,-12);arcEnd(a,'宮中之事不了了之，'+(v?nm(v):'')+'怨恨在心。')}
  else arcEnd(a,N+'的事被擱置，漸漸無人再提。');return OKK('此事被擱置。')}
 if(a.w==='a1'){
  if(key==='grant'){g(p,15);G.auth=cl(G.auth-6);G.fd.chan=cl(G.fd.chan+3,0,35);arcLog(a,'皇帝加封'+N+'，其勢愈盛。',3);a.st=2;a.cd=ri(8,12);return OKK('你准其所請，'+N+'謝恩而退，朝中風向為之一變。')}
  if(key==='gift'){if(G.tre<20)return NO('國庫不足。');G.tre-=20;g(p,-3);arcLog(a,'皇帝婉拒'+N+'之請，賜金帛撫慰。');a.st=1;a.cd=ri(14,20);return OKK('你婉言謝絕，另賜金帛。他暫時按下了心思。')}
  if(key==='deny'){g(p,-14);p.amb=cl(p.amb+14);G.fear=cl(G.fear+3);arcLog(a,'皇帝當庭駁回'+N+'之請，其面色陰沉而退。',2);if(p.amb>70&&chance(.6)){addPlot('coup',p);log(N+'懷恨在心，似在暗中串聯。','warn')}arcEnd(a);return OKK('你當庭駁回，滿朝肅然。')}}
 if(a.w==='a2'){
  if(key==='purge'){const ok=chance(cl(.3+sch/200+G.auth/300,.2,.8)/1);if(ok){punish(p,'exile','專權跋扈');G.auth=cl(G.auth+10);arcEnd(a,N+'伏法，朝野稱快。',3);return OKK('你布局已久，一舉拿下'+N+'及其黨羽，皇權大振！')}
   g(p,-25);p.amb=cl(p.amb+20);G.auth=cl(G.auth-8);if(chance(.5))addPlot('coup',p);arcEnd(a,N+'反噬，皇帝削權不成，威信受損。',3);return OKK('削權失敗，'+N+'已有防備，反咬一口。')}
  if(key==='bear'){G.auth=cl(G.auth-3);a.n++;arcLog(a,'皇帝對'+N+'的跋扈隱忍不發。');a.st=2;a.cd=ri(10,14);return OKK('你選擇隱忍，等待時機。（再三隱忍，他終會動手。）')}}
 if(a.w==='g1'){
  if(key==='ennoble'){deedAdd('favor',p);g(p,12);p.amb=cl(p.amb+6);G.rep=cl(G.rep+1);arcLog(a,'皇帝封'+N+'為侯，增其兵權。');a.st=2;a.cd=ri(8,12);return OKK('你封侯增兵，'+N+'感恩戴德。')}
  if(key==='gold'){if(G.tre<30)return NO('國庫不足。');G.tre-=30;g(p,4);arcEnd(a,'皇帝厚賞'+N+'，未增其權。');return OKK('厚賞金帛，兵權不動。')}
  if(key==='recall'){g(p,-15);G.auth=cl(G.auth+3);G.morale=cl(G.morale-3);p.amb=cl(p.amb+(p.amb>55?10:2));arcEnd(a,'皇帝召回'+N+'，解其兵權。');return OKK('你召回京師，解了兵權。軍中不免議論。')}}
 if(a.w==='g2'){
  if(key==='trust'){g(p,8);G.rep=cl(G.rep+1);if(p.amb>65&&chance(.25)){addPlot('coup',p);log(N+'似乎另有想法……','warn')}arcEnd(a,'皇帝公開嘉勉'+N+'，以示不疑。');return OKK('你當眾嘉勉，不疑其忠。')}
  if(key==='transfer'){g(p,-10);vacate(p);G.morale=cl(G.morale-2);arcEnd(a,'皇帝將'+N+'調離軍職。');return OKK('你調其離開軍職，另賜閒銜。')}}
 if(a.w==='r1'){const c=P(a.cul),v=P(a.vic);if(!c||!v||!c.alive||!v.alive){arcEnd(a);return OKK('此事已過。')}
  if(key==='probe'){if(chance(cl(.45+sch/150,.3,.9))){punish(c,'lock','暗害妃嬪');g(v,8);arcEnd(a,'查明'+nm(c)+'暗害'+nm(v)+'屬實，皇帝將其禁足。',2);return OKK('你明察秋毫，查出真相。')}
   g(v,-10);v.fav=cl(v.fav-10);c.fav=cl(c.fav+5);arcEnd(a,'皇帝徹查無果，誤以為'+nm(v)+'誣告，雙方皆有怨言。');return OKK('查來查去不得要領，反傷了'+nm(v)+'的心。')}
  if(key==='appease'){if(G.tre<20)return NO('國庫不足。');G.tre-=20;g(c,3);g(v,3);a.st=2;a.cd=ri(5,8);arcLog(a,'皇帝對二妃各有賞賜，欲平息風波。');return OKK('兩邊各賜賞賜，希望息事寧人。')}
  if(key==='ignore'){a.st=2;a.cd=4;return OKK('你只當沒聽見。')}}
 if(a.w==='r2'){const c=P(a.cul),v=P(a.vic);
  if(key==='purge'){if(c&&c.alive)punish(c,'cold','毒害妃嬪');g(v,5);arcEnd(a,'皇帝將'+(c?nm(c):'')+'打入冷宮，以儆後宮。',2);return OKK('你下旨重懲，後宮肅然。')}
  if(key==='cover'){g(v,-12);arcEnd(a,'宮禁森嚴，此事被壓下，'+(v?nm(v):'')+'怨恨在心。');return OKK('你壓下此事，以免醜聞外傳。')}}
 if(a.w==='s1'){
  if(key==='defend'){deedAdd('favor',p);g(p,15);g(facLeader('chan'),-6);G.auth=cl(G.auth-1);arcLog(a,'皇帝力保'+N+'，權貴為之側目。');a.st=2;a.cd=ri(10,14);return OKK('你力保此人，權貴們頗為不滿。')}
  if(key==='sack'){g(p,-20);vacate(p);G.rep=cl(G.rep-1);arcEnd(a,'皇帝順勢貶謫'+N+'，清流寒心。');return OKK('你順勢貶謫，清流為之寒心。')}
  if(key==='hold'){g(p,-4);arcEnd(a,'皇帝對彈章留中不發，'+N+'事不了了之。');return OKK('你留中不發，此事漸漸平息。')}}
 if(a.w==='s2'){
  if(key==='promote'){deedAdd('favor',p);const v=vacantOffs().filter(o=>{const od=offDef(o);return od&&!od.role});let msg='';if(v.length){const r=actAppoint(v[0],p.id);msg=r.msg}else{p.st.pol=cl(p.st.pol+3);msg='暫無空缺，賜以厚祿。'}
   g(p,10);G.rep=cl(G.rep+2);if(!p.tr.includes('名臣'))p.tr.push('名臣');arcEnd(a,N+'終成一代名臣。',3);return OKK(msg+' '+N+'感激知遇。')}
  if(key==='reward'){if(G.tre<20)return NO('國庫不足。');G.tre-=20;g(p,8);if(!p.tr.includes('名臣'))p.tr.push('名臣');arcEnd(a,N+'受厚賞，清名遠播。');return OKK('你厚加賞賜。')}}
 return NO('選項無效。')}
function arcOpts(m){const a=arcOf(m.x.arc);if(!a||a.done||!a.wait||a.mid!==m.id)return[{l:'此事已過',h:'',fn:()=>OKK('此事已有定論。')}];
 const o=(l,h,k)=>({l,h,fn:()=>arcPick(a,k)});
 return({a1:[o('准其所請','其勢大盛，皇權-6','grant'),o('婉拒並賜金帛','20萬兩，暫緩其心','gift'),o('當庭駁回','怨恨，可能生變','deny')],
  a2:[o('設局削其黨羽','成敗取決於權謀與皇權','purge'),o('暫且隱忍','皇權-3，三次後他必動手','bear')],
  g1:[o('封侯並增兵權','感恩，但野心漸長','ennoble'),o('厚賞但不增權','30萬兩','gold'),o('召回京師解兵權','皇權+3，軍心-3','recall')],
  g2:[o('公開嘉勉以示不疑','可能養虎為患','trust'),o('調離軍職','怨恨，軍心-2','transfer')],
  r1:[o('嚴查','成功取決於權謀','probe'),o('各賜賞賜平息','20萬兩','appease'),o('不聞不問','','ignore')],
  r2:[o('重懲施害者','打入冷宮','purge'),o('壓下此事','受害者怨恨','cover')],
  s1:[o('力保','好感大增，權貴不滿','defend'),o('順勢貶謫','清流寒心','sack'),o('留中不發','','hold')],
  s2:[o('擢升重用','有空缺則任官','promote'),o('厚賞','20萬兩','reward')]}[a.w])||[]}
const __mo=memoOpts;memoOpts=function(m){return m.k==='arc'?arcOpts(m):__mo(m)};
function arcsMonth(){if(!G.arcs)G.arcs=[];
 for(const a of G.arcs){if(a.done)continue;const p=P(a.pid);const q=a.pid2?P(a.pid2):null;
  if(!p||!p.alive||(a.k!=='scholar'&&p.exile)||(a.pid2&&(!q||!q.alive||q.role!=='consort'||p.role!=='consort'))){a.done=true;a.tend=G.t;G.memo=G.memo.filter(m=>m.id!==a.mid);continue}
  if(a.wait){if(!G.memo.some(m=>m.id===a.mid))arcPick(a,'stall');continue}
  if(--a.cd<=0)arcAdvance(a)}
 const dn=G.arcs.filter(a=>a.done);if(dn.length>10)G.arcs=G.arcs.filter(a=>!a.done||dn.slice(-10).includes(a));
 if(chance(.07))startArc()}
