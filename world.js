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
 d('nid',1000);d('zeit',{});d('mh',[]);d('pro',null);d('omenHid',0);d('reform',0);d('inst',{});d('proj',[]);d('visited',{});
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
