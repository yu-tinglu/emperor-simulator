/* ---------- 災異與祭祀 / 使節奏報（world.js） ---------- */
const OMEN={
 eclipse:{n:'日有食之',tx:'欽天監急奏：今晨日食，白晝如夜，百官失色。史官援引舊例，謂「陰盛陽衰，主上失德」。',mind:-2},
 comet:{n:'彗星見於東北',tx:'欽天監奏稱，夜來彗星橫空，尾長數丈，坊間已有「改朝換代」的童謠。',mind:-3},
 quake:{n:'京畿地動',tx:'子夜地動，城牆崩塌數處，宮中燈燭盡滅。欽天監稱「地者，臣道也；動，則臣下不安」。',mind:-3},
 drought:{n:'久旱不雨',tx:'入夏以來滴雨未降，河床見底，百姓設壇求雨。欽天監上奏，請皇帝親禱。',mind:-2},
 omen_good:{n:'黃河水清',tx:'地方官奏稱黃河水清三日，並獻上瑞穀、白鹿，群臣山呼萬歲。有人暗示，這不過是為了邀功。',mind:2}};
function omenMonth(){if(G.memo.some(m=>m.k==='sky'||m.k==='emb')||!chance(.05))return;
 const k=chance(.18)?'omen_good':pick(['eclipse','comet','quake','drought']);const o=OMEN[k];const h=holder('hist');
 G.memo.push({id:G.nid++,k:'sky',t:G.t,from:h?h.id:null,txt:o.tx,x:{o:k}})}
function omenOpts(m){const k=m.x.o,o=OMEN[k];const O=[];const hid=()=>{G.omenHid=(G.omenHid||0)+1};
 const scape=()=>{const ms=alivePs().filter(p=>p.off&&p.role==='official').sort((a,b)=>(b.r||0)-(a.r||0));return ms[0]};
 if(k==='omen_good'){
  O.push({l:'受而不誇',h:'民心+1；不予賞賜',fn:()=>{G.mind=cl(G.mind+1);G.rep=cl(G.rep+1);return OKK('你收下祥瑞，淡淡道：「天下太平，才是祥瑞。」')}});
  O.push({l:'大典慶賀',h:'40萬兩；聲望+4，民心+1，皇權+1',fn:()=>{if(G.tre<40)return NO('國庫不足。');G.tre-=40;G.rep=cl(G.rep+4);G.mind=cl(G.mind+1);G.auth=cl(G.auth+1);chron('以祥瑞見，大赦天下，慶賀三日。',2);return OKK('鐘鼓齊鳴，百官稱頌。史官筆下，又添一行吉兆。')}});
  O.push({l:'卻之，並斥獻瑞者',h:'聲望+2；近臣不悅',fn:()=>{G.rep=cl(G.rep+2);G.mind=cl(G.mind+1);for(const p of alivePs())if(p.off&&p.cor>55)p.op=cl(p.op-3);return OKK('你當庭退回瑞物，並申斥邀功之人。殿上一時鴉雀無聲。')}});
  return O}
 O.push({l:'下詔罪己',h:'民心+4，聲望+2；皇權-3',fn:()=>{G.mind=cl(G.mind+4);G.rep=cl(G.rep+2);G.auth=cl(G.auth-3);G.omenHid=Math.max(0,(G.omenHid||0)-1);G.sinT=G.t;chron('因'+o.n+'，下詔罪己，減膳徹樂。',3);return OKK('詔書傳遍四方：「朕德薄，天降警示，罪在朕躬。」百姓讀之，有人垂淚。')}});
 O.push({l:'祭天祈禳',h:'50萬兩；民心+1，並有機會化解',fn:()=>{if(G.tre<50)return NO('國庫不足。');G.tre-=50;G.mind=cl(G.mind+1);let t='你率百官於圜丘祭天，禮成之日，天色並未改變。';if(k==='drought'&&chance(.6)){for(const r of Object.values(G.reg))r.food=cl(r.food+6);G.mind=cl(G.mind+2);t='祭禮方畢，西北雲起，一場及時雨落下。百姓歡呼，說是天子至誠感天。'}else if(chance(.3)){G.mind=cl(G.mind+1);t='祭禮之後，異象漸消，京中議論亦息。'}chron('因'+o.n+'，親祭於天。',2);return OKK(t)}});
 O.push({l:'歸咎大臣',h:'首輔去職；皇權+2，朝臣寒心',fn:()=>{const p=scape();if(!p)return NO('朝中無人可責。');p.op=cl(p.op-18);G.scape={id:p.id,t:G.t};if(typeof vacate==='function')vacate(p);G.auth=cl(G.auth+2);G.rep=cl(G.rep-2);for(const q of alivePs())if(q.off)q.op=cl(q.op-2);chron('因'+o.n+'，罷'+nm(p)+'職，以謝天下。',3,[p.id]);return OKK('你將天象之責，推給了'+nm(p)+'。他叩首謝恩時，沒有抬頭。')}});
 O.push({l:'壓下不報',h:'無事發生；日後或生流言',fn:()=>{hid();G.hidT=G.t;return OKK('你吩咐欽天監「不得外傳」。卷宗被收進了密匣。')}});
 return O}
/* 壓下的災異，日後可能走漏 */
function omenLeak(){if((G.omenHid||0)>0&&chance(.03*G.omenHid)){G.omenHid=0;G.mind=cl(G.mind-3);G.rep=cl(G.rep-3);chron('先前隱匿天象之事走漏，市井流言四起，謂天子諱言天譴。',3)}}
/* ---------- 使節奏報 ---------- */
function envoyMonth(){omenLeak();if(G.memo.some(m=>m.k==='sky'||m.k==='emb')||!chance(.07))return;
 const fs=Object.values(G.foe);const pool=[];
 for(const f of fs){if(f.war)continue;
  if(!f.trade&&f.att>=0)pool.push(['trade',f.k]);
  if(!f.vas&&f.str<62&&f.att>=0)pool.push(['invest',f.k]);
  if(f.att>=18&&myKids().some(p=>p.role==='princess'&&age(p)>=14))pool.push(['marry',f.k]);
  if(f.vas)pool.push(['tribute',f.k]);
  if(f.vas&&fs.some(z=>z!==f&&z.str>f.str+10))pool.push(['aid',f.k]);
  if(!f.ally&&f.att>=5&&fs.some(z=>z!==f&&!z.vas&&z.str>=45))pool.push(['ally',f.k])}
 if(!pool.length)return;const [d,k]=pick(pool);const f=G.foe[k];let txt='';const rn=f.ruler||'其酋長';
 if(d==='trade')txt=f.n+'遣使入京，請開邊市，以皮毛、良馬換我茶絹。'+'使者在殿外候了三日。';
 else if(d==='invest')txt=f.n+'之主'+rn+'遣使稱願受冊封，奉表云：「慕天朝禮樂，願為外藩。」';
 else if(d==='marry')txt=f.n+'之主'+rn+'遣使求婚，願結秦晉之好，並獻上聘禮。';
 else if(d==='tribute')txt=f.n+'依例入貢，貢物中有良馬、美玉。使臣請求加賜，並詢問朝廷是否有所指示。';
 else if(d==='aid')txt=f.n+'遭強鄰侵逼，遣使泣告，請天朝出兵相援，並願加倍納貢。';
 else txt=f.n+'使節密陳：願與天朝結為盟好，共討'+'鄰近強敵，事成之後分其牧地。';
 const h=holder('rite')||holder('hist');G.memo.push({id:G.nid++,k:'emb',t:G.t,from:h?h.id:null,txt,x:{d,f:k}})}
function envoyOpts(m){const d=m.x.d,f=G.foe[m.x.f];const O=[];if(!f)return O;
 if(d==='trade'){O.push({l:'准其互市',h:'開通商路，每月歲入增加',fn:()=>{if(f.trade)return OKK('已通商。');f.trade=true;f.att=cl(f.att+5);chron('開邊市於'+f.n+'。',2);return OKK('邊市開張，駝鈴與車輪聲漸漸熱鬧起來。')}});
  O.push({l:'婉拒',h:'態度-3',fn:()=>{f.att=cl(f.att-3);return OKK('你婉拒了使節。')}})}
 else if(d==='invest'){O.push({l:'遣使冊封',h:'成為藩屬；聲望+3，耗20萬兩',fn:()=>{if(G.tre<20)return NO('國庫不足。');if(f.vas)return OKK('已是藩屬。');G.tre-=20;f.vas=true;f.att=cl(f.att+10);G.rep=cl(G.rep+3);chron('冊封'+f.n+'之主'+(f.ruler||'')+'，納為藩屬。',3);return OKK('一道金印，一道詔書，天朝的版圖外多了一圈名分。')}});
  O.push({l:'不予理會',h:'態度-4',fn:()=>{f.att=cl(f.att-4);return OKK('使者空手而返。')}})}
 else if(d==='marry'){const pr=myKids().find(p=>p.role==='princess'&&age(p)>=14);
  O.push({l:'許嫁公主',h:pr?'公主'+nm(pr)+'遠嫁；態度大增，聲望+2':'',fn:()=>{if(!pr||!pr.alive)return NO('無合適公主。');const r=actHeqin(pr,f.k);if(r.ok){G.rep=cl(G.rep+2);f.att=cl(f.att+10)}return r}});
  O.push({l:'婉辭',h:'態度-8',fn:()=>{f.att=cl(f.att-8);return OKK('你以「公主年幼」為由婉辭。使者面有慍色。')}})}
 else if(d==='tribute'){O.push({l:'厚賜答之',h:'30萬兩；態度+8',fn:()=>{if(G.tre<30)return NO('國庫不足。');G.tre-=30;f.att=cl(f.att+8);G.tre+=24;return OKK('你厚賜回禮。禮輕情意重，皆大歡喜。')}});
  O.push({l:'照例收下',h:'國庫+25萬兩',fn:()=>{G.tre+=25;return OKK('貢物入庫，使臣叩謝而去。')}})}
 else if(d==='aid'){O.push({l:'出兵相援',h:'耗糧40，軍心-2；其更歸附',fn:()=>{if(G.gra<40)return NO('糧倉不足。');G.gra-=40;f.att=cl(f.att+12);f.str=cl(f.str+4);G.morale=cl(G.morale-2);G.rep=cl(G.rep+2);return OKK('天兵一至，強鄰退去。藩屬感激涕零。')}});
  O.push({l:'置之不理',h:'藩屬寒心，或叛離',fn:()=>{f.att=cl(f.att-14);if(chance(.35)){f.vas=false;chron(f.n+'見朝廷不救，轉而背離。',2)}return OKK('你說，家事自理。使者走時背影很慢。')}})}
 else{O.push({l:'結盟夾擊',h:'60萬兩；強鄰國力大損；盟約持續',fn:()=>{if(G.tre<60)return NO('國庫不足。');const t=Object.values(G.foe).filter(z=>z!==f&&!z.vas).sort((a,b)=>b.str-a.str)[0];if(!t)return NO('無可共擊之敵。');G.tre-=60;f.ally=G.t;t.str=cl(t.str-12);t.att=cl(t.att-10);f.att=cl(f.att+10);f.str=cl(f.str+3);G.rep=cl(G.rep+1);chron('與'+f.n+'結盟，共擊'+t.n+'，其國力大損。',3);return OKK('兩路並進，'+t.n+'措手不及。盟友笑著舉杯，眼中卻在算戰利品。')}});
  O.push({l:'謝絕',h:'態度-4',fn:()=>{f.att=cl(f.att-4);return OKK('你謝絕了盟約。')}})}
 return O}
/* 盟約月度：維持、變數 */
function allyMonth(){for(const f of Object.values(G.foe)){if(!f.ally)continue;if(f.war){f.ally=null;continue}
 if(G.t-f.ally>36){f.ally=null;chron('與'+f.n+'的盟約期滿。',2);continue}
 f.att=cl(f.att+.4);if(f.att<-10&&chance(.05)){f.ally=null;chron(f.n+'背盟，與我反目。',3)}}}
const __mo3=memoOpts;memoOpts=function(m){return m.k==='sky'?omenOpts(m):m.k==='emb'?envoyOpts(m):__mo3(m)};

/* ---------- 科舉取士之議 ---------- */
function examYear(){const old=G.memo.find(m=>m.k==='xpol');if(old){G.memo=G.memo.filter(z=>z!==old);exam('poor');return}
 const h=holder('rite')||holder('hist');G.memo.push({id:G.nid++,k:'xpol',t:G.t,from:h?h.id:null,txt:'三年大比之期又至。禮部請旨：此科取士，當以何者為重？門閥子弟熟於政務，寒門士子感恩圖報，實學之士則可資錢糧水利。'+((G.xl||[]).length?'上科取士之法為「'+({gate:'重門第',poor:'取寒門',real:'重實學'}[G.xl[G.xl.length-1].pol])+'」。':''),x:{}})}
function xpolOpts(m){const run=p=>()=>{exam(p);echoExam();return OKK('詔下，天下士子聞風而動。放榜之日，長安紙貴。')};
 return[{l:'重門第',h:'政務純熟，貪腐與野心較高；權臣黨壯大，清流不滿',fn:run('gate')},{l:'取寒門',h:'清流壯大；新進士貪腐少，感恩圖報；權臣黨不悅',fn:run('poor')},{l:'重實學',h:'精於錢糧水利；年年增歲入；士林微詞',fn:run('real')}]}
const __mo4=memoOpts;memoOpts=function(m){return m.k==='xpol'?xpolOpts(m):__mo4(m)};

/* ---------- 邊將軍權 ---------- */
const ADJ=[['jing','zhong'],['jing','guan'],['jing','he'],['zhong','jiang'],['guan','long'],['guan','shu'],['shu','ling'],['jiang','ling'],['zhong','guan']];
function borderMonth(){for(const r of Object.values(G.reg)){if(!r.foe)continue;if(r.mil==null){r.mil=18;r.loy=72}
 const war=G.sit.some(s=>s.k==='war'&&s.reg===r.id),gov=holder('g_'+r.id);
 r.mil=cl(r.mil+(war?1.1:.12)-(G.tre<20?.5:0));
 r.loy=cl(r.loy+(G.tre<30?-.8:.05)-(gov?Math.max(0,gov.amb-55)*.012:0)-(G.auth<30?.3:0));
 if(r.mil>52&&r.loy<42&&!r.sec&&!G.memo.some(m=>m.k==='bj'&&m.x.r===r.id)&&chance(.05))
  G.memo.push({id:G.nid++,k:'bj',t:G.t,from:gov?gov.id:null,txt:r.n+'邊軍近來只認帥府號令，餉銀、軍械皆自行調度。'+(gov?nm(gov)+'奏稱「邊情緊急，不可拘泥常例」。':'')+'朝中有人說，此人已有不臣之心。',x:{r:r.id}});
 if(r.mil>62&&r.loy<18&&!r.sec&&!G.sit.some(s=>s.k==='revolt'&&s.reg===r.id)&&chance(.02)){startRevolt(r,{S:30+r.mil/2,name:r.n+'邊帥之亂',leader:gov?gov.id:null});r.loy=40;chron(r.n+'邊帥擁兵自立，傳檄天下！',3,gov?[gov.id]:[])}}}
function bjOpts(m){const r=G.reg[m.x.r];const gov=holder('g_'+r.id);const g=(v)=>{if(gov&&gov.alive)gov.op=cl(gov.op+v)};
 return[{l:'厚賞安撫',h:'60萬兩；忠誠+20',fn:()=>{if(G.tre<60)return NO('國庫不足。');G.tre-=60;r.loy=cl(r.loy+20);g(10);return OKK('賞賜與慰問的詔書一同送到邊關。')}},
 {l:'削其兵權',h:'私兵-18，忠誠-8，皇權+2',fn:()=>{r.mil=cl(r.mil-18);r.loy=cl(r.loy-8);r.cutT=G.t;r.cutEcho=0;G.auth=cl(G.auth+2);g(-8);return OKK('你把一半的兵調去別處。邊帥接旨時，臉色沒有變。')}},
 {l:'調入京師',h:'換人鎮守；私兵-25',fn:()=>{if(gov){vacate(gov);gov.op=cl(gov.op-12)}r.mil=cl(r.mil-25);r.loy=55;return OKK('一道「入朝述職」的詔書，把他調離了營帳。')}},
 {l:'不予理會',h:'忠誠-8',fn:()=>{r.loy=cl(r.loy-8);return OKK('你把奏摺壓下，期待事情自己平息。')}}]}
function actBorder(rid,mode){const r=G.reg[rid];if(!r||!r.foe)return NO('此處無邊軍。');if(r.mil==null){r.mil=18;r.loy=72}
 if(mode==='reward'){if(G.tre<30)return NO('國庫不足。');G.tre-=30;r.loy=cl(r.loy+10);G.morale=cl(G.morale+2);return OKK('犒賞邊軍，將士歡聲雷動。')}
 if(mode==='cut'){if(r.mil<12)return NO('邊軍已無可再減。');r.mil=cl(r.mil-12);r.loy=cl(r.loy-5);G.tre+=12;return OKK('裁撤部分邊軍，節省糧餉，邊帥面有不豫。')}
 return NO('')}
/* ---------- 地方經濟：糧價與流民 ---------- */
function pxOf(r){return Math.round(3600/Math.max(20,r.food))}
function localMonth(){for(const r of Object.values(G.reg)){r.un=cl(r.un+DF().un);r.ref=Math.max(0,(r.ref||0)*.96);if(r.food<30&&r.un>40&&r.pop>20){const nb=ADJ.filter(e=>e.includes(r.id)).map(e=>G.reg[e[0]===r.id?e[1]:e[0]]).sort((a,b)=>b.food-a.food)[0];if(nb&&nb.food>45){const n=r.pop*.004;r.pop-=n;nb.pop+=n;nb.un=cl(nb.un+.5);r.ref=(r.ref||0)+n;if(chance(.12))chron(r.n+'饑民流徙，湧入'+nb.n+'。',2)}}}}
function actPing(rid){const r=G.reg[rid];if(G.gra<40)return NO('糧倉不足。');G.gra-=40;r.food=cl(r.food+7);r.un=cl(r.un-3);return OKK('開常平倉平糶於'+r.n+'，糧價應聲而落。')}
function actJia(rid){const r=G.reg[rid];if(r.un>70)return NO('民怨已深，不可再加派。');G.tre+=45;r.un=cl(r.un+8);G.mind=cl(G.mind-1);return OKK('向'+r.n+'加派一年錢糧，國庫略有補益，街談巷議卻多了起來。')}
/* ---------- 傳承局 ---------- */
function legacyApply(L){if(!L)return;G.leg=L;chron('前朝「'+L.era+'」'+({fall:'傾覆',usurp:'易代',extinct:'絕嗣'}[L.type]||'已逝')+'，天下人心浮動。',3);
 if(L.type==='fall'){G.rep=cl(G.rep-4);G.mind=cl(G.mind-3)}else if(L.type==='extinct'){G.rep=cl(G.rep+8)}else{G.rep=cl(G.rep-10);G.auth=cl(G.auth+8)}
 const c=newClan(pick(SURN),'clean',true);const p=newMan(c.id,48,62,'official',{bias:{pol:22,lit:20},op:88});c.m.push(p.id);bio(p,'前朝遺臣，歷事兩朝，為新君所用。');p.title='前朝遺老';memo_(p,'exam',10,'新君肯用前朝舊臣，不計前嫌。')}
const __mo5=memoOpts;memoOpts=function(m){return m.k==='bj'?bjOpts(m):__mo5(m)};

/* ---------- 存檔相容：補欄位 ---------- */
function migrate(g){if(!g||!g.P)return null;const d=(k,v)=>{if(g[k]==null)g[k]=v};
 ['memo','chr','snap','arcs','deeds','chaps','mdone','ach','xl','sit','plots','intel','log','emps'].forEach(k=>d(k,[]));
 d('nid',1000);if(!g.zeit||!g.zeit.k)g.zeit={k:'plain',t:g.t||0};if(!g.life)g.life='diligent';d('mh',[]);d('pro',null);d('omenHid',0);d('reform',0);d('inst',{});d('proj',[]);d('visited',{});
 d('fd',{});['chan','clean','army','kin','eun','wai'].forEach(k=>{if(g.fd[k]==null)g.fd[k]=0});
 for(const r of Object.values(g.reg||{})){if(r.ref==null)r.ref=0;if(r.foe&&r.mil==null){r.mil=18;r.loy=72}}
 for(const f of Object.values(g.foe||{})){if(f.att==null)f.att=0;if(f.str==null)f.str=50}
 if(g.diff==null)g.diff='n';g.sc=SCHEMA;return g}
function safeParse(t){try{return migrate(JSON.parse(t))}catch(e){return null}}

/* ---------- 難度 ---------- */
const DIFF={e:{n:'史書',d:'寬鬆：歲入較豐，民變較少',inc:1.1,exp:.92,un:-.08,tre:400,infl:.6},n:{n:'承平',d:'標準',inc:1,exp:1,un:0,tre:0,infl:1},h:{n:'亂世',d:'嚴苛：歲入偏少，開支與民怨俱增',inc:.97,exp:1.04,un:.03,tre:-150,infl:1.15}};
function DF(){return DIFF[G.diff||'n']||DIFF.n}
function diffInc(){return DF().inc}
function diffExp(){const yrs=(G.t-720)/12;return DF().exp*(1+Math.min(.9,Math.max(0,yrs-25)*.008)*DF().infl)}
function diffApply(){G.tre+=DF().tre}

/* ---------- 事件庫（含重複降權） ---------- */
const EVT=[
 ['monk','有高僧自南方來，請朝廷准其於京郊建寺講經，並稱可為國祈福。',[['准建寺院','耗30萬；民心+2，皇權-1',{tre:-30,mind:2,auth:-1},'寺成之日，香火極盛。'],['婉拒','聲望+1',{rep:1},'你說，佛法不在寺宇之大。']]],
 ['fish','江南漁民因官府加稅，聚眾到州衙請願，場面一度失控。',[['減免漁稅','國庫-20；民心+3',{tre:-20,mind:3},'稅減之後，漁船又出了海。'],['派兵彈壓','民心-4；皇權+2',{mind:-4,auth:2},'人群散去，街上留下許多破碎的網具。']]],
 ['horse','西域商隊獻上寶馬十匹，其中一匹通體如雪，使者說此馬「日行千里」。',[['納入御廄','軍心+2',{morale:2},'雪馬立在廄中，毛色映著晨光。'],['賜予邊將','軍心+3，皇權-1',{morale:3,auth:-1},'邊將得馬，在營中大擺酒宴。'],['折價購入戰馬','耗40萬；軍心+4',{tre:-40,morale:4},'你要的是一營戰馬，而不是一匹名駒。']]],
 ['flood','黃河上游連日暴雨，下游堤壩告急，沿岸百姓已連夜遷徙。',[['調糧賑濟','耗糧80；民心+4',{gra:-80,mind:4},'糧船沿河而下，災民得以活命。'],['發帑加固堤壩','耗90萬；日後水患減輕',{tre:-90,mind:1},'堤壩加高三尺，工匠連夜趕工。'],['聽任自救','民心-5',{mind:-5},'奏報中寫著：「死者數百。」']]],
 ['poet','翰林院一位年輕學士寫下諷刺時政的詩，傳遍京城，有人建議治他的罪。',[['一笑置之','聲望+3，皇權-1',{rep:3,auth:-1},'你說，詩寫得不錯。於是這首詩傳得更遠了。'],['嚴懲不貸','皇權+2；聲望-4',{auth:2,rep:-4},'學士被貶出京，詩卻沒有因此消失。'],['召入宮中','聲望+2',{rep:2},'你在偏殿與他談了一夜。']]],
 ['salt','鹽商聯名上書，願每年多繳鹽稅，換取專營之權。',[['准其所請','歲入+，民心-2',{tre:80,mind:-2},'鹽價悄悄漲了。'],['駁回','民心+1',{mind:1},'你說，鹽是百姓的鹽。']]],
 ['ghost','宮中傳言，後苑夜間有哭聲，宮人不敢夜行。欽天監說是前朝冤魂。',[['請僧道作法','耗20萬',{tre:-20},'法事做了七日，哭聲再也沒有人聽見。'],['親往查看','皇權+1，聲望+1',{auth:1,rep:1},'你在後苑站了一夜。原來是一隻受傷的夜梟。']]],
 ['gen','一位老將軍乞骸骨，奏稱「臣年老，不堪驅馳」。朝中有人說他仍可一用。',[['厚賜榮養','耗30萬；軍心+3',{tre:-30,morale:3},'老將軍叩首，白髮在殿上閃了一下。'],['挽留繼任軍職','軍心+1；皇權-1',{morale:1,auth:-1},'他說，臣遵旨。']]],
 ['plague','京郊一村突發時疫，數十人病倒，里正隱瞞三日方報。',[['設醫館隔離','耗40萬；民心+3',{tre:-40,mind:3},'醫官入村，疫情很快得到控制。'],['封村不出','民心-3',{mind:-3},'封條貼上，村里的哭聲被隔在牆內。']]],
 ['tribe','塞外一小部落舉族內附，請求遷入邊州耕種。',[['允其內附','人口+，邊防略緊',{mind:1,gra:-30},'他們帶來了羊群與疲憊的孩子。'],['拒之門外','聲望-1',{rep:-1},'他們又向北走去。']]],
 ['calc','戶部呈上「均田之策」，主張清丈田畝，限制豪強兼併。大臣反對聲甚眾。',[['推行均田','民心+4；權貴不滿，皇權-3',{mind:4,auth:-3},'測量田畝的隊伍出了京城。'],['暫緩','皇權+1',{auth:1},'奏摺被收入錦匣。']]],
 ['tea','南方茶農奏請免除茶稅三年，稱茶價低迷、無以為生。',[['准免三年','國庫-30；民心+3',{tre:-30,mind:3},'茶園重新有了採茶人。'],['減半徵收','國庫-10；民心+1',{tre:-10,mind:1},'折中之法，兩邊都不算滿意。']]],
 ['snow','北方大雪，邊軍糧道被斷，將士衣單。',[['加撥冬衣','耗30萬；軍心+4',{tre:-30,morale:4},'冬衣隨雪橇送到了關上。'],['令其自籌','軍心-4',{morale:-4},'營中燃起的篝火格外稀疏。']]],
 ['prince','皇子在學堂答問，言語驚人，太傅稱其「識見遠過同齡」。',[['親授課業','聲望+1',{rep:1},'你把他留在書房，問了一個多時辰。'],['賞賜筆墨','耗5萬',{tre:-5},'他謝恩時，眼睛亮亮的。']]],
 ['bridge','京城東門外石橋年久失修，昨夜塌了半邊，所幸無人傷亡。',[['重修並立碑','耗50萬；民心+2',{tre:-50,mind:2},'新橋落成，碑上刻著你的年號。'],['簡單修補','耗10萬',{tre:-10},'橋面鋪了新板。']]],
 ['exile','一位被貶多年的老臣上書，自陳無罪，請求赦還。',[['赦還','聲望+2',{rep:2},'他回到京城時，鬢髮已白。'],['留置不問','皇權+1',{auth:1},'奏摺沒有回音。']]],
 ['mirror','太史獻上西洋所傳「千里鏡」，可觀星象，亦可望遠。',[['建觀星臺','耗40萬；日後災異可預警',{tre:-40,rep:2},'臺成之夜，京城百姓仰頭看星。'],['收入內庫','無',{},'鏡子被收進了錦盒。']]],
 ['monks','兩座寺廟為田界爭訟，各聚信眾數百，險些械鬥。',[['親自斷案','聲望+2',{rep:2},'你把兩位住持請到殿上，各退三十畝。'],['交由地方官','皇權-1',{auth:-1},'地方官判了，兩邊都不服。']]],
 ['wed','京中望族嫁女，請皇帝賜婚書與禮物，以增門楣。',[['欣然賜之','耗5萬；士族好感',{tre:-5,rep:1},'賜婚的禮盒擺滿了半條街。'],['不涉私事','皇權+1',{auth:1},'你說，姻緣各有緣。']]],
 ['rain','久旱之後，一場大雨降下，農民在田埂上歡呼。',[['免當年賦稅一成','國庫-25；民心+3',{tre:-25,mind:3},'雨水與詔書一同落在田裡。'],['照常徵收','無',{},'雨還在下。']]]];
function evtMonth(){if(G.memo.length>=6||!chance(.1))return;G.evs=G.evs||{};
 const pool=EVT.map(e=>[e,Math.pow(.2,G.evs[e[0]]||0)]);const sum=pool.reduce((a,b)=>a+b[1],0);let x=R()*sum;let pk=pool[0][0];for(const [e,w] of pool){x-=w;if(x<=0){pk=e;break}}
 G.evs[pk[0]]=(G.evs[pk[0]]||0)+1;const h=holder('hist')||holder('rite');G.memo.push({id:G.nid++,k:'evt',t:G.t,from:h?h.id:null,txt:pk[1],x:{e:pk[0]}})}
function evtOpts(m){const e=EVT.find(z=>z[0]===m.x.e);if(!e)return[];return e[2].map(o=>({l:o[0],h:o[1],fn:()=>{const f=o[2];for(const k in f){if(k==='tre')G.tre+=f[k];else if(k==='gra')G.gra=Math.max(0,G.gra+f[k]);else G[k]=cl(G[k]+f[k])}return OKK(o[3])}}))}
const __mo6=memoOpts;memoOpts=function(m){return m.k==='evt'?evtOpts(m):__mo6(m)};
/* ---------- 人物成長 ---------- */
function growthYear(){for(const p of alivePs()){if(p.role!=='official'||p.id===G.emp)continue;const a=age(p);
 if(!p.g1&&a>=25&&a<=40&&facOf(p)==='clean'&&p.st.pol>60&&chance(.08)){p.g1='rise';p.st.pol=cl(p.st.pol+6);p.amb=cl((p.amb||50)+8);bio(p,'出身寒微，屢經擢拔，終露頭角。');if(chance(.5))chron(nm(p)+'以寒門之身，漸為朝野所重。',2,[p.id])}
 else if(!p.g1&&a<32&&p.st.pol+p.st.lit>140&&chance(.08)){p.g1='proud';p.amb=cl((p.amb||50)+15);p.cor=cl((p.cor||40)+8);bio(p,'少年得志，銳氣逼人。')}
 else if(p.g1==='proud'&&a>=34&&chance(.07)){p.g1='fallen';p.op=cl(p.op-15);p.st.pol=cl(p.st.pol-8);bio(p,'驕縱失儀，為御史所劾，一時失勢。');chron(nm(p)+'因驕縱失儀，遭言官彈劾。',2,[p.id])}
 if(!p.g2&&a>=60&&p.st.pol>=65&&chance(.15)){p.g2='elder';p.op=cl(p.op+10);p.st.pol=cl(p.st.pol+4);bio(p,'歷事數朝，漸成朝中耆宿。');chron(nm(p)+'歷事數朝，成朝野耆宿。',2,[p.id])}}}
/* ---------- 自訂劇本 ---------- */
const CUST={tre:['貧','平','富'],foe:['弱','平','強'],fac:['清流多','平','權臣多']};
function custApply(c){if(!c)return;G.cust=c;G.tre+=[-350,0,500][c.tre];for(const f of Object.values(G.foe))f.str=cl(f.str+[-14,0,14][c.foe]);
 if(c.fac===0){G.fd.clean=cl(G.fd.clean+8,0,35)}else if(c.fac===2){G.fd.chan=cl(G.fd.chan+8,0,35)}}

/* ---------- 選擇的回響 ---------- */
function echoExam(){if(G.hidT&&G.t-G.hidT<72){G.hidT=null;G.rep=cl(G.rep-1);chron('殿試策問，有舉子直言昔年天象之事，座中皆驚，主考官不敢作聲。',3)}}
function echoMonth2(){
 if(G.sinT&&G.mind<42&&G.t-G.sinT<120&&chance(.1)){G.sinT=null;G.mind=cl(G.mind+2);chron('民間猶記皇帝昔年下詔罪己，怨言稍息。',2)}
 if(G.hidT&&G.t-G.hidT>=72)G.hidT=null;
 for(const r of Object.values(G.reg)){if(!r.cutT||r.cutEcho)continue;if(G.t-r.cutT>72){r.cutT=null;continue}
  if(G.sit.some(s=>s.k==='war'&&s.reg===r.id)&&r.mil<25){r.cutEcho=1;G.morale=cl(G.morale-2);chron('史官記曰：'+r.n+'之兵，自前削其權，邊備已非舊觀。',3)}}
 const sc=G.scape;if(sc&&G.t-sc.t>=36&&!G.memo.some(m=>m.k==='echo')){const p=P(sc.id);if(!p||!p.alive){G.scape=null;return}
  G.memo.push({id:G.nid++,k:'echo',t:G.t,from:p.id,txt:'數年前因天象被罷黜的'+nm(p)+'，其門生聯名上書，為他鳴冤，言辭懇切，並稱「天象與臣無涉」。',x:{id:p.id}});G.scape=null}}
function echoOpts(m){const p=P(m.x.id);return[{l:'為其平反',h:'聲望+3，民心+1；皇權-1',fn:()=>{G.rep=cl(G.rep+3);G.mind=cl(G.mind+1);G.auth=cl(G.auth-1);if(p)p.op=cl(p.op+25);chron('追雪'+nm(p)+'前冤，官復原品。',2,[p.id]);return OKK('平反詔書到時，他已鬚髮皆白，伏地久久不能起身。')}},{l:'駁回',h:'聲望-1',fn:()=>{G.rep=cl(G.rep-1);if(p)p.op=cl(p.op-8);return OKK('你說，既往之事，不必再議。')}}]}
const __mo7=memoOpts;memoOpts=function(m){return m.k==='echo'?echoOpts(m):__mo7(m)};

/* ======================================================================
   國策樹：六條線、三十五項。推行需耗時耗銀；有前置、排他、派系反彈與協同。
   G.cz = { d:{id:完成月}, a:[{id,left,dur,mult,pause}] }（舊存檔缺此欄位，惰性建立）
   ====================================================================== */
const CZL={ag:{n:'農政',c:'#5E8B4A'},ml:{n:'兵制',c:'#A0402F'},fn:{n:'財政',c:'#B8892E'},ad:{n:'吏治',c:'#3E6A8F'},cu:{n:'文教',c:'#7B5A8F'},dp:{n:'外務',c:'#2F8283'}};
const CZF={chan:'權臣',clean:'清流',army:'將門',wai:'外戚',eun:'宦官',kin:'宗室'};
const CZR={chan:'侵奪世家田產，動搖朝廷根本',clean:'與民爭利，有違聖人之教',army:'削奪將門權責，恐寒邊將之心',wai:'奪外戚職任，有失親親之誼',eun:'奪內廷之權，不合祖制',kin:'侵宗室之利，傷骨肉之恩'};
const CZ={
 ag1:{l:'ag',t:1,n:'興修水利',d:'疏浚河渠、修築陂塘，旱澇之年也能保住收成。',cost:60,dur:8,mods:{harv:.04,relief:.12},ev:{food:5}},
 ag2:{l:'ag',t:1,n:'輪作良種',d:'推廣輪作與選種之法，同一塊地多收幾成。',cost:90,dur:10,pre:['ag1'],mods:{harv:.05,popg:.12}},
 ag3a:{l:'ag',t:2,n:'均田限田',d:'限制兼併，使無地之民有田可耕。得民心，但世家大族切齒。',cost:150,dur:20,pre:['ag2'],ex:['ag3b'],need:4,mods:{unrest:-3,mind:1,harv:.03,inc:-.02},rx:{fac:'chan',op:-10},ev:{fd:{chan:-4}}},
 ag3b:{l:'ag',t:2,n:'招商墾荒',d:'招徠流民與商人開墾荒地，增產快，但流民聚散難免生事。',cost:120,dur:14,pre:['ag2'],ex:['ag3a'],need:4,mods:{harv:.04,inc:.03,popg:.18,unrest:1.5},ev:{fd:{chan:2}}},
 ag4:{l:'ag',t:3,n:'常平倉制',d:'豐年平價收糧、荒年減價出糶，以倉廩平抑糧價。',cost:150,dur:16,anyp:['ag3a','ag3b'],need:8,mods:{relief:.3,grain:.25,mind:1},ev:{gra:150}},
 ag5:{l:'ag',t:4,n:'海外糧種',d:'經海商引入耐旱高產的新作物，可養活更多人口。',cost:220,dur:24,pre:['ag4','dp2'],need:14,mods:{harv:.09,popg:.25}},
 ml1:{l:'ml',t:1,n:'整飭軍紀',d:'清查軍籍、嚴明賞罰，剔除空額與老弱。',cost:50,dur:6,mods:{morale:3,armycost:-.03},ev:{fd:{army:-1}}},
 ml2:{l:'ml',t:1,n:'屯田養兵',d:'令軍士且耕且戍，邊軍糧餉可自給一部分。',cost:100,dur:12,pre:['ml1'],mods:{armycost:-.08,grain:.08}},
 ml3a:{l:'ml',t:2,n:'府兵制',d:'兵農合一，平時務農、戰時徵調，省餉而得兵，但將門權勢漸大。',cost:150,dur:18,pre:['ml2'],ex:['ml3b'],need:5,mods:{armycost:-.12,morale:2,unrest:-1},rx:{fac:'army',op:-5},ev:{fd:{army:3}}},
 ml3b:{l:'ml',t:2,n:'募兵制',d:'以餉養兵，兵為職業，戰力強而費用高，民間徭役反減。',cost:170,dur:14,pre:['ml2'],ex:['ml3a'],need:5,mods:{war:.10,morale:4,armycost:.10,burden:-.05}},
 ml4:{l:'ml',t:3,n:'將門考成',d:'設武學、行考課，使將領升遷不再全憑門第與私恩。',cost:130,dur:14,anyp:['ml3a','ml3b'],need:9,mods:{war:.06,morale:2,auth:2},rx:{fac:'army',op:-8},ev:{fd:{army:-4}}},
 ml5:{l:'ml',t:4,n:'火器營',d:'設專營鑄造並操練火器，野戰攻城皆添新利。',cost:260,dur:24,pre:['ml4','cu3'],need:15,mods:{war:.16,armycost:.07,auth:1}},
 fn1:{l:'fn',t:1,n:'度支清查',d:'清點各州倉庫與稅卡，堵住最明顯的漏洞。',cost:50,dur:6,mods:{leak:.12},rx:{fac:'chan',op:-3}},
 fn2:{l:'fn',t:1,n:'驛傳與度量衡',d:'統一斗斛尺度、整頓驛傳，商貨流通，稅收也好算。',cost:80,dur:10,pre:['fn1'],mods:{inc:.02,trade:.6}},
 fn3a:{l:'fn',t:2,n:'清丈田畝',d:'重新丈量天下田土，查出隱匿之產。得利最大，也得罪最深。',cost:160,dur:18,pre:['fn2'],ex:['fn3b'],need:5,mods:{leak:.15,inc:.03,unrest:1},rx:{fac:'chan',op:-12},ev:{fd:{chan:-5}}},
 fn3b:{l:'fn',t:2,n:'鹽鐵官營',d:'鹽、鐵、茶收歸官營，歲入穩增，但與商民爭利，士林有怨。',cost:150,dur:14,pre:['fn2'],ex:['fn3a'],need:5,mods:{inc:.05,mind:-1,leak:-.04},rx:{fac:'clean',op:-8}},
 fn4:{l:'fn',t:3,n:'一條鞭法',d:'田賦徭役併為一條，折銀徵收，簡便而難以作弊。',cost:200,dur:24,anyp:['fn3a','fn3b'],need:9,mods:{inc:.04,burden:-.05,leak:.08},rx:{fac:'chan',op:-6}},
 fn5:{l:'fn',t:4,n:'錢法票號',d:'整齊錢法，許民間票號匯兌，銀錢往來暢通。',t:4,cost:240,dur:24,pre:['fn4','dp2'],need:16,mods:{trade:1.5,inc:.02}},
 ad1:{l:'ad',t:1,n:'考課之法',d:'定期考核官員政績，劣者降黜，貪者留案。',cost:40,dur:6,mods:{cor:.08},rx:{fac:'chan',op:-2}},
 ad2:{l:'ad',t:1,n:'御史巡按',d:'派御史分巡各道，風聞可奏，使地方官有所忌憚。',cost:80,dur:10,pre:['ad1'],mods:{leak:.08,cor:.05,auth:1},ev:{fd:{clean:2}}},
 ad3a:{l:'ad',t:2,n:'高薪養廉',d:'加俸以養其廉，使官員無須靠陋規過日子。花錢多，但根子治得深。',cost:130,dur:14,pre:['ad2'],ex:['ad3b'],need:5,mods:{cor:.14,salc:.14,mind:.5}},
 ad3b:{l:'ad',t:2,n:'嚴刑峻法',d:'重典懲貪，一人犯法株連數人。皇權立見其威，朝野人人自危。',cost:90,dur:10,pre:['ad2'],ex:['ad3a'],need:5,mods:{cor:.12,auth:3,mind:-1.5},rx:{fac:'clean',op:-7}},
 ad4:{l:'ad',t:3,n:'科舉擴額',d:'增設科目與名額，寒門子弟多一條出路。',cost:110,dur:12,pre:['ad2','cu1'],need:9,mods:{exam:2,auth:1},ev:{fd:{clean:2,chan:-2}}},
 ad5:{l:'ad',t:4,n:'軍機處',d:'設機要班子直承聖意，政令繞過三省，皇權牢牢握在手中。',cost:200,dur:20,pre:['ad4'],anyp:['ad3a','ad3b'],need:15,mods:{auth:5,leak:.05},rx:{fac:'wai',op:-6},ev:{fd:{wai:-3}}},
 cu1:{l:'cu',t:1,n:'興辦官學',d:'州縣設學，教化鄉里，也為朝廷儲才。',cost:60,dur:8,mods:{exam:1,mind:.5}},
 cu2:{l:'cu',t:2,n:'修史禮制',d:'修前朝史、定本朝禮，使正統有據、威望日隆。',cost:70,dur:10,pre:['cu1'],mods:{rep:.08,mind:.5}},
 cu3:{l:'cu',t:2,n:'印刷藏書',d:'設官刻書坊與藏書樓，典籍流布，士人易得書。',cost:110,dur:12,pre:['cu1'],need:4,mods:{exam:1,mind:1}},
 cu4:{l:'cu',t:3,n:'醫藥防疫',d:'設惠民藥局、行防疫之法，疫病不再動輒殺人過萬。',cost:130,dur:14,anyp:['cu2','cu3'],need:8,mods:{popg:.10,relief:.10}},
 cu5:{l:'cu',t:4,n:'格物工藝',d:'官府招攬工匠、鼓勵發明，農具、兵器、紡織俱有改進。',cost:250,dur:24,pre:['cu3','fn2'],need:14,mods:{inc:.04,war:.05,harv:.03}},
 dp1:{l:'dp',t:1,n:'四夷通譯',d:'設通事館培養譯人，邊事不再憑傳聞猜測。',cost:50,dur:6,ev:{att:5}},
 dp2:{l:'dp',t:1,n:'互市貿易',d:'於邊境開設互市，以茶絹易馬，邊民得利而少寇掠。',cost:90,dur:10,pre:['dp1'],mods:{trade:1.2},ev:{att:4}},
 dp3a:{l:'dp',t:2,n:'和親羈縻',d:'以聯姻與賞賜安撫諸部，花錢買平安，也折些顏面。',cost:100,dur:12,pre:['dp2'],ex:['dp3b'],need:5,mods:{raid:.3,mind:.5},rx:{fac:'army',op:-4},ev:{att:12}},
 dp3b:{l:'dp',t:2,n:'揚威邊防',d:'沿邊築堡增戍，屢以兵威示人，異族不敢輕犯，但彼此關係轉冷。',cost:140,dur:14,pre:['dp2'],ex:['dp3a'],need:5,mods:{war:.08,raid:.15,armycost:.04},ev:{att:-6}},
 dp4:{l:'dp',t:3,n:'海運通商',d:'開海路、通番舶，沿海商貿大興，歲入添一大宗。',cost:220,dur:24,pre:['dp2'],need:9,req:{f:()=>G.inst&&G.inst.shi,t:'須先設市舶司'},mods:{trade:2,inc:.02}},
 dp5:{l:'dp',t:4,n:'宗藩朝貢',d:'遠近諸邦奉正朔、遣使納貢，天朝體系大成。',cost:260,dur:24,pre:['dp4'],anyp:['dp3a','dp3b'],need:16,mods:{trade:1,raid:.2,war:.04},ev:{rep:4,att:8}}};
for(const k in CZ){if(!CZ[k].t)CZ[k].t=1}
const CZSYN=[
 {a:['ag2','fn2'],n:'農商相濟',d:'田有餘糧、市有流通，稅基自然厚實。',mods:{inc:.02,popg:.05}},
 {a:['ml2','ag4'],n:'兵農相資',d:'屯田與常平倉互為犄角，軍糧不必全靠國庫。',mods:{armycost:-.04,grain:.10}},
 {a:['fn4','ad4'],n:'法清政平',d:'稅制簡明、官員清正，徵收之間少了許多暗耗。',mods:{leak:.08,mind:1}},
 {a:['ml4','ad5'],n:'文武相制',d:'軍權有考成、政務有樞要，二者互相牽制又彼此配合。',mods:{auth:3,war:.04}},
 {a:['cu3','cu5'],n:'學以致用',d:'書刊流布與工藝精進相互促進。',mods:{exam:1,inc:.02}},
 {a:['dp4','fn5'],n:'通貨四海',d:'海舶往來與票號匯兌相接，貿易之利倍增。',mods:{trade:1.2}},
 {a:['ag4','cu4'],n:'倉廩實而知禮',d:'有糧、有醫、有學，百姓安居樂業。',mods:{mind:1.5,popg:.08}}];
const CZMOD={harv:['秋收',1,'p'],grain:['田賦糧',1,'p'],inc:['稅收',1,'p'],leak:['貪墨流失減少',1,'p'],popg:['人口增長',1,'p'],unrest:['民怨',-1,'n'],burden:['每月負擔',-1,'n'],mind:['民心',1,'n'],morale:['軍心',1,'n'],armycost:['軍費',-1,'p'],salc:['官俸支出',-1,'p'],trade:['貿易歲入（每月）',1,'w'],war:['戰力',1,'p'],cor:['官員貪腐（每月下降）',1,'n'],auth:['皇權',1,'n'],exam:['科舉取士',1,'r'],relief:['抗災減損',1,'p'],rep:['威望（每月）',1,'n'],raid:['邊患風險降低',1,'p']};
function czInit(){if(!G.cz||!G.cz.d)G.cz={d:{},a:[]};if(!G.cz.a)G.cz.a=[];return G.cz}
function czDone(id){return !!(G&&G.cz&&G.cz.d&&G.cz.d[id]!=null)}
function czAct(id){return G&&G.cz&&G.cz.a?G.cz.a.find(x=>x.id===id):null}
function czSynOn(s){return s.a.every(czDone)}
function czm(k){const c=G&&G.cz;if(!c||!c.d)return 0;let v=0;for(const id in c.d){const o=CZ[id];if(o&&o.mods&&o.mods[k])v+=o.mods[k]}for(const s of CZSYN){if(s.mods[k]&&czSynOn(s))v+=s.mods[k]}return v}
function czCount(){return G&&G.cz&&G.cz.d?Object.keys(G.cz.d).length:0}
function czSlots(){return 2+(G.inst&&G.inst.cab?1:0)}
function czUp(){const c=G&&G.cz;if(!c||!c.a)return 0;let s=0;for(const a of c.a){if(a.pause>0)continue;const o=CZ[a.id];if(o)s+=o.cost*(a.mult||1)/o.dur}for(const id in (c.d||{})){const o=CZ[id];if(o)s+=o.cost*.005}return s}
function czCan(id){const o=CZ[id];const why=[];if(!o)return{ok:false,why:['無此國策']};czInit();
 if(czDone(id))return{ok:false,why:['已推行'],done:1};if(czAct(id))return{ok:false,why:['推行中'],act:1};
 for(const p of o.pre||[])if(!czDone(p))why.push('須先推行「'+CZ[p].n+'」');
 if(o.anyp&&!o.anyp.some(czDone))why.push('須先推行「'+o.anyp.map(x=>CZ[x].n).join('」或「')+'」');
 for(const x of o.ex||[])if(czDone(x)||czAct(x))why.push('與「'+CZ[x].n+'」不可並行');
 if(o.need&&czCount()<o.need)why.push('須已推行國策'+o.need+'項（現'+czCount()+'項）');
 if(o.req&&!o.req.f())why.push(o.req.t);
 const ex=why.some(w=>w.indexOf('不可並行')>=0);
 return{ok:!why.length,why,ex}}
function czApply(ev){if(!ev)return;if(ev.fd)for(const f in ev.fd)G.fd[f]=cl((G.fd[f]||0)+ev.fd[f],0,35);
 if(ev.food)for(const r of Object.values(G.reg))r.food=cl(r.food+ev.food);if(ev.gra)G.gra+=ev.gra;if(ev.rep)G.rep=cl(G.rep+ev.rep);if(ev.mind)G.mind=cl(G.mind+ev.mind);
 if(ev.att)for(const f of Object.values(G.foe))f.att=cl(f.att+ev.att,-100,100)}
function czMood(fac,v){for(const p of alivePs()){if(p.id===G.emp)continue;if(facOf(p)===fac)p.op=cl(p.op+v)}}
function czStart(id){const o=CZ[id];const c=czCan(id);if(!c.ok)return NO(c.why[0]);czInit();
 if(G.cz.a.length>=czSlots())return NO('同時只能推行'+czSlots()+'項國策。');
 const first=o.cost/o.dur;if(G.tre<Math.max(first*2,o.cost*.2))return NO('國庫不足（至少需'+Math.ceil(Math.max(first*2,o.cost*.2))+'萬兩方可開辦）。');
 G.cz.a.push({id,left:o.dur,dur:o.dur,mult:1,pause:0,t0:G.t});
 if(o.rx){czMood(o.rx.fac,o.rx.op)}
 chron('詔行國策「'+o.n+'」，預計'+o.dur+'月告成。',2);
 return OKK('已開辦「'+o.n+'」，每月耗銀約'+Math.round(first*10)/10+'萬兩。')}
function czCancel(id){czInit();const a=czAct(id);if(!a)return NO('此策並未推行。');G.cz.a=G.cz.a.filter(x=>x!==a);G.memo=G.memo.filter(m=>!(m.k==='cz'&&m.x&&m.x.id===id));chron('國策「'+CZ[id].n+'」中途罷止，已耗之銀付諸流水。',2);return OKK('已中止「'+CZ[id].n+'」。（已耗國庫不退）')}
function czMonth(){const c=G&&G.cz;if(c&&c.a&&c.a.length){const mc=czm('rep');
 for(const a of c.a.slice()){if(a.pause>0){a.pause--;continue}if(G.debt>0)continue;a.left--;const o=CZ[a.id];
  if(a.left<=0){c.a=c.a.filter(x=>x!==a);c.d[a.id]=G.t;czApply(o.ev);G.memo=G.memo.filter(m=>!(m.k==='cz'&&m.x&&m.x.id===a.id));
   chron('國策「'+o.n+'」告成。'+(o.t>=3?'史臣記曰：此乃經國大計。':''),o.t>=3?3:2);
   for(const s of CZSYN){if(s.a.includes(a.id)&&czSynOn(s))chron('國策相濟：「'+s.n+'」——'+s.d,3)}}
  else if(o.rx&&G.t-a.t0>=2&&chance(.045)&&!G.memo.some(m=>m.k==='cz')){const L=facLeader(o.rx.fac);const who=L?nmt(L):CZF[o.rx.fac];
   G.memo.push({id:G.nid++,k:'cz',t:G.t,from:L?L.id:null,txt:who+'聯名上書，反對推行「'+o.n+'」，稱此舉'+CZR[o.rx.fac]+'，請陛下三思。',x:{id:a.id,fac:o.rx.fac}})}}}
 if(czm('rep'))G.rep=cl(G.rep+czm('rep'))}
const __mo9=memoOpts;memoOpts=function(m){if(m.k!=='cz')return __mo9(m);const a=czAct(m.x.id),o=CZ[m.x.id],fac=m.x.fac,fn=CZF[fac];if(!a||!o)return[{l:'知道了',h:'此策已不在推行中',fn:()=>OKK('此事已了。')}];
 return[{l:'堅持推行',h:'皇權-2，'+fn+'態度-6，工期不變',fn:()=>{G.auth=cl(G.auth-2);czMood(fac,-6);return OKK('你不為所動，下旨照辦。'+fn+'退下時面色難看。')}},
  {l:'折中讓步',h:'工期+4個月、加撥一成經費，'+fn+'態度-2',fn:()=>{if(G.tre<o.cost*.1)return NO('國庫不足以加撥。');G.tre-=Math.round(o.cost*.1);a.left+=4;a.dur+=4;czMood(fac,-2);return OKK('你酌情修改條款，'+fn+'的怨氣稍平。')}},
  {l:'暫緩一年',h:'國策停擺12個月，'+fn+'態度+4',fn:()=>{a.pause=12;czMood(fac,4);return OKK('你下旨暫緩推行，'+fn+'如釋重負。')}}]};

/* ===== 批示建議 ===== */
function memoSuggest(m){const O=memoOpts(m);if(!O.length)return -1;const poor=G.tre<250;let best=0,bs=-1e9;
 O.forEach((o,i)=>{let s=0;const l=String(o.l),h=String(o.h||'');if(o.ask)s-=100;
  if(/准|賑|開倉|賞|納|允|任|升|嘉|重用|從輕|徹查/.test(l))s+=1;
  if(/駁|拒|斥|罷|削|處死|流放|賜死|留中|不予|留在京/.test(l))s-=1;
  const mm=h.match(/(\d+)萬兩/);if(mm){const c=+mm[1];if(poor&&c>=30)s-=3;else if(c>G.tre*.3)s-=2}
  if(/耗糧/.test(h)&&G.gra<250)s-=2;if(/傷民|惡化|失望|下降|後患/.test(h))s-=.5;
  if(m.k==='taxup'){if(/^准/.test(l))s+=(G.tre<400||G.debt>0?3:0)-(G.mind<50||G.tax>=4?3:0)}
  if(m.k==='warreq'){if(/^准/.test(l))s+=(G.army<45||G.tre<400?-3:1)}
  if(m.k==='fiefreq'){if(/^准/.test(l))s-=2}
  if(m.k==='festival'||m.k==='project'){if(poor&&!/駁|婉|拒/.test(l))s-=3}
  if(m.k==='impeach'&&/徹查/.test(l))s+=1.5;
  if(m.k==='relief'&&/蠲免/.test(l))s-=(G.tre<500?2:.5);
  if(s>bs+1e-9){bs=s;best=i}});return best}
function batchMemo(list){let done=0,left=0,msg='';for(const [id,i] of list){const m=G.memo.find(x=>x.id===id);if(!m)continue;
  if(i<0){leaveMemo(id);done++;continue}
  const oo=memoOpts(m)[i];if(!oo||oo.ask){left++;continue}
  const r=runMemo(id,i);if(r.ok)done++;else{left++;if(/精力/.test(r.msg)){msg='精力用盡，餘下奏摺留待下旬。';break}}}
 return{done,left,msg}}

/* ===== 伏筆：決定的遲來後果 ===== */
const SEEDR={taxup:/^准/,relief:/^駁回/,impeach:/從輕|^駁回|^不予/,fiefreq:/^准其就藩/,warreq:/^准其統兵/,recommend:/^准/};
function seedHook(m,o){const R=SEEDR[m.k];if(!R||!o||!R.test(String(o.l)))return;const x=m.x||{};G.sd=G.sd||[];const add=(d,why,e)=>{G.sd.push(Object.assign({t:G.t+d,t0:G.t,why},e));if(G.sd.length>30)G.sd.shift()};
 if(m.k==='taxup')add(ri(20,36),'准加賦稅',{k:'tax'});
 else if(m.k==='relief'&&x.reg)add(ri(14,26),'駁回賑災之請',{k:'famine',reg:x.reg});
 else if(m.k==='impeach'&&x.guilty&&x.tg!=null)add(ri(18,36),'輕縱貪腐之臣',{k:'scandal',p:x.tg});
 else if(m.k==='fiefreq'&&m.from!=null)add(ri(24,48),'准其就藩',{k:'fief',p:m.from});
 else if(m.k==='warreq'&&m.from!=null)add(ri(18,40),'准其統兵',{k:'warfame',p:m.from});
 else if(m.k==='recommend'&&x.cand!=null)add(ri(20,40),'准其任命',{k:'protege',p:x.cand})}
{const __dr=decRec;decRec=function(m,o,s0){__dr(m,o,s0);try{seedHook(m,o)}catch(e){}}}
function seedFire(s){const y=Math.max(1,Math.round((G.t-s.t0)/12));const tail='（此乃'+y+'年前你'+s.why+'之果）';const p=s.p!=null?P(s.p):null;
 if(s.k==='tax'){const rs=Object.values(G.reg);const r=rs.slice().sort((a,b)=>b.un-a.un)[0];if(!r)return;r.un=cl(r.un+14);r.food=cl(r.food-6);G.mind=cl(G.mind-2);chron(r.n+'民怨沸騰，流民漸多。'+tail,3,[])}
 else if(s.k==='famine'){const r=G.reg[s.reg];if(!r)return;r.un=cl(r.un+16);r.food=cl(r.food-12);G.mind=cl(G.mind-1);chron(r.n+'饑民四起，當初賑濟被駁，如今禍患已成。'+tail,3,[])}
 else if(s.k==='scandal'){if(!p||!p.alive)return;p.cor=cl(p.cor+25);G.mind=cl(G.mind-1.5);chron(nmt(p)+'貪墨事發，數額遠逾當年所劾。'+tail,3,[p.id])}
 else if(s.k==='fief'){if(!p||!p.alive)return;p.amb=cl(p.amb+12);G.pow.kin=(G.pow.kin||0)+3;chron(nmt(p)+'就藩多年，封地坐大，漸有尾大不掉之勢。'+tail,3,[p.id])}
 else if(s.k==='warfame'){if(!p||!p.alive)return;p.amb=cl(p.amb+10);p.op=cl(p.op-4);chron(nmt(p)+'統兵有功，威望日隆，朝中已有「功高難賞」之議。'+tail,3,[p.id])}
 else if(s.k==='protege'){if(!p||!p.alive)return;if(chance(.4)){p.cor=cl(p.cor+20);G.mind=cl(G.mind-1);chron(nmt(p)+'所任非人，其人營私舞弊，被御史揭發。'+tail,3,[p.id])}else{p.st.pol=Math.min(100,p.st.pol+6);G.rep=cl(G.rep+1);chron(nmt(p)+'政績斐然，士林稱你知人善任。'+tail,3,[p.id])}}}
function seedMonth(){const L=G.sd;if(!L||!L.length)return;const due=L.filter(s=>s.t<=G.t);if(!due.length)return;G.sd=L.filter(s=>s.t>G.t);for(const s of due){try{seedFire(s)}catch(e){}}}
{const __mo2=memoOpts;memoOpts=function(m){const O=__mo2(m);const R=SEEDR[m.k];if(R&&!(m.k==='impeach'&&!(m.x&&m.x.guilty)))for(const o of O)if(R.test(String(o.l)))o.h=(o.h?o.h+'｜':'')+'恐留後患';return O}}

/* ===== 朝會 ===== */
const HUI={
 tax:{t:'賦稅之議',d:'國用吃緊，朝臣對加徵賦稅與節流開支各執一詞。',need:()=>G.tre<1500,
  A:{n:'加徵賦稅',f:['chan','army'],say:'臣以為當增賦以充國用，否則邊餉難繼。',h:'賦稅升一級，國庫+40，民心-1',ok:()=>{if(G.tax<5)G.tax++;G.tre+=40;G.mind=cl(G.mind-1)}},
  B:{n:'節流開支',f:['clean','wai'],say:'臣請削減浮費，與民休息，不可竭澤而漁。',h:'省銀70，民心+1，聲望+0.5',ok:()=>{G.tre+=70;G.mind=cl(G.mind+1);G.rep=cl(G.rep+.5)}}},
 army:{t:'軍備之議',d:'邊報頻傳，朝堂上為擴軍還是休兵爭論不休。',need:()=>true,
  A:{n:'擴編軍隊',f:['army','eun'],say:'邊患未平，臣請增兵固防。',h:'軍力+3，國庫-70',ok:()=>{G.army=Math.min(200,G.army+3);G.tre-=70}},
  B:{n:'裁軍息民',f:['clean','chan'],say:'養兵耗費太巨，請裁冗兵以紓民力。',h:'軍力-2，國庫+50，賦稅負擔-2',ok:()=>{G.army=Math.max(10,G.army-2);G.tre+=50;G.burden=cl(G.burden-2)}}},
 govern:{t:'吏治之議',d:'御史屢奏官場積弊，朝臣對整肅與寬仁意見相左。',need:()=>true,
  A:{n:'整肅吏治',f:['clean','wai'],say:'吏治不清，天下難安，臣請嚴查貪墨。',h:'官員貪腐下降，皇權+1，部分權臣不悅',ok:()=>{for(const p of alivePs())if(p.off&&p.cor>0)p.cor=cl(p.cor-8);G.auth=cl(G.auth+1)}},
  B:{n:'寬仁為本',f:['chan','eun'],say:'水至清則無魚，官場穩定要緊，不宜大動干戈。',h:'民心+1，官員貪腐小增',ok:()=>{G.mind=cl(G.mind+1);for(const p of alivePs())if(p.off)p.cor=cl(p.cor+2)}}},
 relief:{t:'賑濟之議',d:'各地奏報災情，朝臣對賑濟的規模爭論不下。',need:()=>Object.values(G.reg).some(r=>r.un>32||r.food<48),
  A:{n:'大規模賑濟',f:['clean','wai'],say:'民為邦本，請速開倉賑濟。',h:'各地存糧+8，國庫-60',ok:()=>{for(const r of Object.values(G.reg))r.food=cl(r.food+8);G.tre-=60}},
  B:{n:'量力而行',f:['chan','army'],say:'國庫有限，賑濟當擇要而行，不可耗盡府庫。',h:'國庫不變，部分地方民怨+3',ok:()=>{for(const r of Object.values(G.reg))if(r.food<55)r.un=cl(r.un+3)}}},
 frontier:{t:'邊事之議',d:'使節與邊報並至，朝堂上主戰與主和兩派爭執不休。',need:()=>true,
  A:{n:'主戰',f:['army','eun'],say:'外邦輕我，當以兵威示之。',h:'軍心+4，民心-1，威懾+2',ok:()=>{G.morale=cl(G.morale+4);G.mind=cl(G.mind-1);G.fear=cl(G.fear+2)}},
  B:{n:'主和',f:['clean','chan'],say:'兵凶戰危，不如以歲幣換邊境安寧。',h:'國庫-40，民心+1，聲望-1',ok:()=>{G.tre-=40;G.mind=cl(G.mind+1);G.rep=cl(G.rep-1)}}}};
function huiAvail(){return !G.hz&&G.t-(G.huiT==null?-99:G.huiT)>=3}
function huiSpeaker(f){const L=alivePs().filter(p=>(p.role==='official'||p.role==='general'||p.role==='eunuch')&&facOf(p)===f);return L.length?L.slice().sort((a,b)=>weight(b)-weight(a))[0]:null}
function huiPow(fs){return fs.reduce((s,f)=>s+(G.pow[f]||0),0)}
function huiOpen(){if(G.hz)return OKK('朝會正在進行。');if(!huiAvail())return NO('朝會三個月至多召開一次。');const q=needAP(1);if(q)return q;
 const ks=Object.keys(HUI).filter(k=>HUI[k].need());const k=pick(ks);const T=HUI[k];G.ap--;G.huiT=G.t;
 G.hz={k,A:T.A.f.map(f=>{const p=huiSpeaker(f);return{f,p:p?p.id:null}}),B:T.B.f.map(f=>{const p=huiSpeaker(f);return{f,p:p?p.id:null}})};return OKK('百官入朝。')}
function huiOps(side){const T=HUI[G.hz.k][side];return T}
function huiAdj(fs,d){for(const p of alivePs())if((p.role==='official'||p.role==='general'||p.role==='eunuch')&&fs.includes(facOf(p)))p.op=cl(p.op+d)}
function huiPick(c){const z=G.hz;if(!z)return NO('沒有進行中的朝會。');const T=HUI[z.k];G.hz=null;
 if(c==='D'){G.auth=cl(G.auth-1);chron('朝會無果而散，'+T.t+'懸而未決。',2);return OKK('散朝。議而不決，皇權微損。')}
 if(c==='P'){if(G.auth<40){G.auth=cl(G.auth-3);huiAdj(T.A.f.concat(T.B.f),-2);chron('你欲強壓'+T.t+'，群臣不服，場面尷尬。',3);return NO('皇權不足，壓制不成，反失威信。')}
  G.auth=cl(G.auth+2);huiAdj(T.A.f.concat(T.B.f),-3);chron('朝會上你一言作罷'+T.t+'，群臣噤聲。',2);return OKK('你壓下爭議，此議作罷。群臣心有不平。')}
 const S=T[c],O=T[c==='A'?'B':'A'];const win=huiPow(S.f)+G.auth*.5+ri(-10,10)>huiPow(O.f);
 if(win){S.ok();huiAdj(S.f,4);huiAdj(O.f,-3);chron('朝會議'+T.t+'，從「'+S.n+'」。',2);return OKK('你採納「'+S.n+'」。'+S.h+'。')}
 G.auth=cl(G.auth-2);huiAdj(S.f,2);huiAdj(O.f,-4);chron('朝會議'+T.t+'，你主張「'+S.n+'」，反對者勢大，陽奉陰違。',3);return NO('反對的一派勢力太大，此議擱淺，皇權受損。')}

/* ===== 開局變局與傳承稟賦、擴充成就 ===== */
const VARI={late:{n:'盛世晚期',d:'府庫豐盈、民心安定，但官場腐化、積弊已深。',ap:()=>{G.tre+=1500;G.mind=cl(G.mind+10);G.auth=cl(G.auth+8);G.burden=cl(G.burden+12);for(const p of alivePs())if(p.off)p.cor=cl(p.cor+18);chron('盛世之下，暗藏積弊：官場腐化已深。',2)}},
 regent:{n:'權臣當道',d:'皇權旁落，權臣黨羽遍佈朝堂。',ap:()=>{G.auth=cl(G.auth-18);G.fd.chan=(G.fd.chan||0)+15;chron('權臣一手遮天，你的詔令出不了宮門。',2)}},
 border:{n:'烽火邊關',d:'邊軍強而軍心不穩，國庫不足，外邦虎視眈眈。',ap:()=>{G.army=Math.min(200,G.army+15);G.morale=cl(G.morale-12);G.tre-=250;for(const f of Object.values(G.foe))f.str=cl(f.str+10);chron('邊關烽火連天，軍心浮動。',2)}}};
function variantApply(k){const v=VARI[k];if(!v)return;G.vari=k;v.ap()}
const PERKS={inh:{n:'先帝遺澤',d:'國庫+300',need:0,ap:()=>{G.tre+=300}},ben:{n:'寬厚之名',d:'民心+6',need:2,ap:()=>{G.mind=cl(G.mind+6)}},maj:{n:'威儀天成',d:'皇權+6',need:4,ap:()=>{G.auth=cl(G.auth+6)}},
 ele:{n:'精銳之師',d:'軍力+4，軍心+8',need:6,ap:()=>{G.army=Math.min(200,G.army+4);G.morale=cl(G.morale+8)}},wis:{n:'舊臣輔弼',d:'官員好感+6',need:8,ap:()=>{for(const p of alivePs())if(p.off)p.op=cl(p.op+6)}},
 fam:{n:'名聲在外',d:'聲望+8，民心+3',need:11,ap:()=>{G.rep=cl(G.rep+8);G.mind=cl(G.mind+3)}}};
function perkApply(k){const v=PERKS[k];if(!v)return;G.perk=k;v.ap();chron('傳承稟賦：「'+v.n+'」。',2)}
function trackMonth(){G.lt=(G.tax<=2)?(G.lt||0)+1:0;const war=G.sit.some(s=>s.k==='war'||s.k==='revolt');G.pc=war?0:(G.pc||0)+1}
Object.assign(ACH,{
 lowtax:{n:'輕徭薄賦',d:'連續十年賦稅維持在輕稅以下。',chk:()=>(G.lt||0)>=120},
 peace:{n:'天下無事',d:'連續十年沒有戰事或民變。',chk:()=>(G.pc||0)>=120},
 beloved:{n:'萬民擁戴',d:'民心達到九十以上。',chk:()=>G.mind>=90},
 strong:{n:'乾綱獨斷',d:'皇權達到九十五以上。',chk:()=>G.auth>=95},
 famous:{n:'威震四海',d:'聲望達到九十以上。',chk:()=>G.rep>=90},
 host:{n:'勤於朝會',d:'一朝之內召開十次朝會。',chk:()=>(G.huiN||0)>=10},
 rule50:{n:'五十載春秋',d:'一位皇帝在位滿五十年。',chk:()=>G.t-G.emps[G.emps.length-1].t0>=600},
 army120:{n:'百萬雄師',d:'軍力超過一百二十萬。',chk:()=>G.army>=120}});
{const __ho=huiOpen;huiOpen=function(){const r=__ho();if(r.ok&&G.hz)G.huiN=(G.huiN||0)+1;return r}}
