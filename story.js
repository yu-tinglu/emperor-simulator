/* ---------- 序章與身世（半文言，嚴肅史書為骨、宮廷劇為肉） ---------- */
function proCast(){const e=emp();const D=alivePs().find(p=>p.role==='dowager')||null;return{e,D,L:facLeader('chan'),C:facLeader('clean'),A:facLeader('army')}}
const nx=(p,d)=>p?nmt(p):(d||'某位大臣');
function proPages(){const{e,D,L,C,A}=proCast();const s=G.scn;
 if(s==='a')return{pages:[
  '先帝崩於夜半。內侍捧遺詔至東宮，跪地不敢抬頭。'+nm(e)+'年十七，未及加冠，只覺那一紙黃絹輕得像一片葉子，捧在手裏，卻重得像一座山。',
  (D?nx(D):'太后')+'執其手，淚尚未乾，話已定了：「哀家只問你一句——往後，誰是你的人？」殿角陰影裏，'+nx(L,'一位權臣')+'垂手而立，袖中似握著什麼，面上只有恭謹。',
  '朝堂之上，有人想扶你，有人想倚你，更有人只等你踏錯一步。史官已經磨好了墨，不急，也不遠。'],
  q:'登基之夜，你最先召見的是——',
  ch:[[nx(D,'太后'),'母子之情，外戚歡喜；權臣心生芥蒂'],[nx(L,'權臣'),'示之以信，權臣安心；太后與外戚寒心'],[nx(C,'太傅'),'敬師重道，清流歸心；權貴側目']]};
 if(s==='b')return{pages:[
  '御極數年，天下無大事。奏摺依時而至，後宮依序請安，史官的筆在你身後輕輕地走，幾乎沒有聲音。',
  '然而平靜是最耐看的幕布。'+nx(L,'權臣')+'的門生已半入六部，'+nx(C,'清流')+'的奏疏字字帶刺；宮中某處，有人正在盤算今年誰得寵、明年誰失勢。你都知道，只是還沒到非知道不可的時候。',
  '今夜無事。你翻開起居注，最末一行寫著：「上於燈下獨坐，良久。」'],
  q:'你想先理清哪一條線？',
  ch:[['前朝','整飭朝綱，皇權漸固；權臣不悅，清流稱善'],['後宮','撫恤六宮，宮闈安定；各妃感念'],['東宮','親督諸子，皇嗣學業長進；太子歸心']]};
 return{pages:[
  '前朝亡於一夜。城破之日，宗廟火起，三百年的簿冊燒成一夜的亮光。'+nm(e)+'自軍中被推上御座，甲冑未解，血跡未乾。',
  '將門諸帥環立階下，口稱萬歲，眼裏卻在計算：這位新君，值不值得他們把刀收回鞘中。庫房空空，米倉見底，北狄的使者已在驛館住了三日。',
  '有人勸你先安軍，有人勸你先安民，更有人壓低了聲音說：先殺一個人，天下就都懂了。'],
  q:'新朝第一道詔書，你要頒給——',
  ch:[['將門','犒賞三軍，軍心大振；國庫更空'],['百姓','輕徭薄賦，民心歸附；軍餉吃緊'],['天下','立威於前，皇權驟升；人心惶惶']]}}
function proApply(i){const{e,D,L,C,A}=proCast();const s=G.scn;const g=(p,v,t)=>{if(p&&p.alive)memo_(p,'pro',v,t)};const fd=(k,v)=>{G.fd[k]=cl((G.fd[k]||0)+v,0,35)};let txt='';
 if(s==='a'){
  if(i===0){g(D,20,'登基之夜，皇帝第一個召見的是自己。');g(L,-6,'登基之夜，皇帝先見了太后，未召自己。');fd('wai',4);txt='你先見了母后。'+nx(D,'太后')+'拭淚而去，宮牆之外，'+nx(L,'權臣')+'的燈火亮到天明。'}
  else if(i===1){g(L,15,'登基之夜，皇帝第一個召見了自己。');g(D,-8,'皇帝登基之夜先召權臣，未召太后。');fd('chan',4);G.auth=cl(G.auth-3);txt='你先召了'+nx(L,'權臣')+'。他伏地時，嘴角極輕地動了一下。'}
  else{g(C,18,'登基之夜，皇帝以師禮相召。');g(L,-4,'登基之夜，皇帝先召清流，未召自己。');g(D,-3,'皇帝登基之夜召見外臣。');fd('clean',4);G.rep=cl(G.rep+2);txt='你以師禮召見'+nx(C,'太傅')+'。他拜得很深，也很久。'}}
 else if(s==='b'){
  if(i===0){G.auth=cl(G.auth+4);g(C,8,'皇帝整飭朝綱，其言得用。');g(L,-3,'皇帝著手整飭朝綱。');txt='你連夜批了三道旨意。天亮時，朝中半數人已嗅到風向。'}
  else if(i===1){for(const c of consorts())c.op=cl(c.op+4);txt='你親自撫恤六宮。許多人一夜未眠，卻是因為被記起而不是被冷落。'}
  else{for(const p of alivePs())if(p.role==='prince'&&p.fa===e.id){p.op=cl(p.op+6);for(const k in STN)p.st[k]=cl(p.st[k]+1)}const h=G.heir?P(G.heir):null;if(h)h.op=cl(h.op+10);txt='你把諸子叫到案前，一頁一頁翻他們的功課。燈油添了兩回。'}}
 else{
  if(i===0){G.tre-=60;G.morale=cl(G.morale+10);for(const p of alivePs())if(p.role==='general')p.op=cl(p.op+7);txt='詔書一下，階下甲聲如雷。國庫又空了一截，但將士們看你的眼神變了。'}
  else if(i===1){G.burden=cl(G.burden-5);G.mind=cl(G.mind+8);G.morale=cl(G.morale-3);txt='詔書貼上城門，圍觀者起初不信，後來有人跪下去哭了。'}
  else{G.fear=cl(G.fear+10);G.auth=cl(G.auth+6);G.mind=cl(G.mind-4);for(const p of alivePs())if(p.role==='general')p.op=cl(p.op-4);txt='你選了一個名字，朱筆一勾。次日滿朝皆靜，連風聲都放輕了。'}}
 G.pro={i};bio(e,'登基之夜：'+txt);chron(nm(e)+'登基之夜，'+txt,2);return txt}
function showPro(){UI.proPg=0;proModal()}
function proModal(){const d=proPages();const n=d.pages.length;const pg=UI.proPg;const last=pg>=n;
 modal('<div class="pro"><div class="pro-h">序　'+['一','二','三','問'][Math.min(pg,3)]+'</div>'+(last?'<div class="pro-t">'+esc(d.q)+'</div><div class="pro-c">'+d.ch.map((c,i)=>'<button data-act="proc" data-arg="'+i+'"><b>'+esc(c[0])+'</b><small>'+esc(c[1])+'</small></button>').join('')+'</div>':'<div class="pro-t">'+esc(d.pages[pg])+'</div><div class="opts" style="justify-content:center"><button class="pri" data-act="pron">'+(pg===n-1?'下一問':'繼續')+'</button><button class="sm" data-act="pros">略過序章</button></div>')+'</div>')}

/* ---------- 歷史回響：舊日決定，多年後回頭 ---------- */
function deedAdd(k,p,lv,why){if(!p)return;G.deeds=G.deeds||[];G.deeds.push({t:G.t,k,pid:p.id,nm:nm(p),kids:(p.kids||[]).slice(),sp:p.sp,lv:lv||'',why:why||''});if(G.deeds.length>50)G.deeds.shift()}
function echoMonth(){if(!G.deeds||!G.deeds.length||!chance(.035))return;
 const c=G.deeds.filter(d=>!d.echoed&&G.t-d.t>=30&&G.t-d.t<=300);if(!c.length)return;const d=pick(c);d.echoed=true;
 if(d.k==='harm'){const pool=[...(d.kids||[]),d.sp].map(id=>id!=null?P(id):null).filter(r=>r&&r.alive&&!r.exile&&r.id!==G.emp&&age(r)>=18&&['official','general','eunuch','prince','princess','consort','kin'].includes(r.role));
  if(!pool.length)return;const r=pick(pool);const kin=(r.id===d.sp)?'配偶':(r.g==='M'?'之子':'之女');
  memo_(r,'vengeance',-26,d.nm+'因'+(d.why||'獲罪')+(d.lv==='death'?'而死':'被流放')+'，此事至今未忘。');r.amb=cl(r.amb+22);bio(r,'記著'+d.nm+'之事，不曾釋懷。');
  if(chance(.5)&&(r.role==='general'||r.role==='prince'))addPlot('coup',r);
  chron('當年'+(d.lv==='death'?'被誅':'被流放')+'的'+d.nm+'，其'+(r.id===d.sp?'配偶':kin.slice(1))+nmt(r)+'如今'+(r.off?'官居'+offName(r.off):'位列朝班')+'，近來言行漸生怨望。',3,[r.id]);return}
 if(d.k==='favor'){const r=P(d.pid);if(!r||!r.alive||r.exile)return;const hard=G.auth<45||G.sit.some(s=>s.k==='war'||s.k==='crisis'||s.k==='revolt');if(!hard&&chance(.6))return;
  memo_(r,'repay',10,'當年蒙皇帝信任，銘記於心。');G.auth=cl(G.auth+6);G.rep=cl(G.rep+2);const w=G.sit.find(s=>s.k==='war');if(w&&r.role==='general')w.front=cl(w.front+10,-100,100);
  chron('當年蒙你力保的'+nmt(r)+'，在朝局艱難之時挺身而出，為你擋下一場風波。',3,[r.id])}}

/* ---------- 天命目標 ---------- */
const MAND={
 north:{n:'平定北患',d:'使北狄稱臣，或將其國力壓到三十五以下。',init:m=>{m.s=G.foe.di.str},prog:m=>G.foe.di.vas?1:cl((m.s-G.foe.di.str)/Math.max(1,m.s-35),0,1),chk:m=>G.foe.di.vas||G.foe.di.str<35},
 tre:{n:'國庫千萬',d:'讓國庫存銀達到一千萬兩。',prog:m=>cl(G.tre/1000,0,1),chk:m=>G.tre>=1000},
 mind:{n:'萬民歸心',d:'民心維持七十五以上，連續十八個月。',tick:m=>{m.c=G.mind>=75?(m.c||0)+1:Math.max(0,(m.c||0)-2)},prog:m=>cl((m.c||0)/18,0,1),chk:m=>(m.c||0)>=18},
 auth:{n:'皇權在握',d:'皇權維持七十以上，連續十二個月。',tick:m=>{m.c=G.auth>=70?(m.c||0)+1:Math.max(0,(m.c||0)-2)},prog:m=>cl((m.c||0)/12,0,1),chk:m=>(m.c||0)>=12},
 heir:{n:'傳位賢子',d:'立下一位年滿十六、能力平均達五十八的太子。',prog:m=>{const h=G.heir?P(G.heir):null;if(!h||!h.alive||age(h)<16)return h&&h.alive?.15:0;const a=Object.values(h.st).reduce((x,y)=>x+y,0)/6;return cl(a/58,0,1)},chk:m=>{const h=G.heir?P(G.heir):null;return h&&h.alive&&age(h)>=16&&Object.values(h.st).reduce((x,y)=>x+y,0)/6>=58}},
 long:{n:'在位三十年',d:'在位滿三十年，且國祚未絕。',prog:m=>cl((G.t-m.t0)/360,0,1),chk:m=>G.t-m.t0>=360},
 unity:{n:'海內一統',d:'連續三十六個月，沒有割據與民變。',tick:m=>{m.c=G.sit.some(s=>s.k==='revolt'||s.k==='secession')?0:(m.c||0)+1},prog:m=>cl((m.c||0)/36,0,1),chk:m=>(m.c||0)>=36},
 kids:{n:'子嗣興旺',d:'膝下皇子公主存活六人以上。',prog:m=>cl(alivePs().filter(p=>(p.role==='prince'||p.role==='princess')&&p.fa===G.emp).length/6,0,1),chk:m=>alivePs().filter(p=>(p.role==='prince'||p.role==='princess')&&p.fa===G.emp).length>=6},
 sage:{n:'人才濟濟',d:'朝中出現兩位「名臣」。',prog:m=>cl(alivePs().filter(p=>p.tr.includes('名臣')).length/2,0,1),chk:m=>alivePs().filter(p=>p.tr.includes('名臣')).length>=2}};
function mandProg(){const m=G.mandate;if(!m||m.done)return 0;const d=MAND[m.k];return d?d.prog(m):0}
function mandPool(){const done=new Set((G.mdone||[]).map(x=>x.k));let ks=Object.keys(MAND).filter(k=>!done.has(k));if(G.scn==='c')ks=ks.filter(k=>k!=='long');return ks.sort(()=>Math.random()-.5).slice(0,3)}
function mandSet(k){const m={k,t0:G.t,done:false,c:0};if(MAND[k].init)MAND[k].init(m);G.mandate=m;bio(emp(),'立志：「'+MAND[k].n+'」。');return m}
function mandateMonth(){const m=G.mandate;if(!m||m.done)return;const d=MAND[m.k];if(d.tick)d.tick(m);if(d.chk(m)){m.done=true;(G.mdone=G.mdone||[]).push({k:m.k,t:G.t,emp:G.emp});metaUnlock('m',m.k);G.rep=cl(G.rep+10);G.auth=cl(G.auth+5);G.mind=cl(G.mind+3);bio(emp(),'天命已成：「'+d.n+'」。');chron('天命已成：「'+d.n+'」，史臣記曰，此帝有志有為。',3);ALERTS.push({t:G.t,txt:'「'+d.n+'」之志，今日已成。',mand:d.n})}}

/* ---------- 兩難之議 ---------- */
function dilCtx(d){const war=G.sit.find(s=>s.k==='war'),dis=G.sit.find(s=>s.k==='disaster'&&!s.relief);const L=facLeader('chan'),C=facLeader('clean'),A=facLeader('army');const f=G.fin||{leak:0};
 const gen=alivePs().filter(p=>p.role==='general'&&p.amb>58&&!p.exile).sort((a,b)=>b.amb-a.amb)[0];
 return{war,dis,L,C,A,f,gen}}
function dilPick(){const x=dilCtx();const out=[];
 if(x.war&&x.dis)out.push('war_dis');
 if(G.burden>48&&G.tre<350)out.push('tax_mind');
 if(x.f.leak>7&&G.pow[topFac()]>34)out.push('fac_cor');
 if(x.gen&&G.morale<70)out.push('gen_morale');
 return out.length?out[Math.floor(R()*out.length)]:null}
function dilemmaMonth(){if(G.memo.some(m=>m.k==='dil')||!chance(.09))return;const d=dilPick();if(!d)return;const x=dilCtx();let txt='';
 if(d==='war_dis')txt='兩件事同時壓上案頭。'+G.foe[x.war.foe].n+'犯境，前線急需錢糧；'+G.reg[x.dis.reg].n+'又遭'+x.dis.kind+'，百姓嗷嗷待哺。'+(x.A?nm(x.A)+'力主增兵，':'')+(x.C?nm(x.C)+'則伏地請賑，':'')+'兩人誰也不肯讓半步。';
 else if(d==='tax_mind')txt='戶部奏稱國庫將盡，請維持重稅；然各地民情已近沸點，'+(x.C?nm(x.C)+'上疏直言「民者，水也」。':'清流頻頻進諫。')+'錢與人心，你只能先保一個。';
 else if(d==='fac_cor')txt='御史臺查得貪墨數目驚人，線索卻指向'+FAC[topFac()].n+'的核心人物。追查，則朝局動盪；不查，則國庫長漏。';
 else txt=nm(x.gen)+'連日在營中設宴犒軍，軍心歸附，朝中已有風聲。'+(x.L?nm(x.L)+'暗示此人不可久用。':'')+'重用則恐養虎，疏遠則恐失將。';
 G.memo.push({id:G.nid++,k:'dil',t:G.t,from:(d==='war_dis'?(x.A||x.C):d==='gen_morale'?x.gen:x.C)?(d==='war_dis'?(x.A||x.C):d==='gen_morale'?x.gen:x.C).id:null,txt,x:{d}})}
function dilOpts(m){const d=m.x.d;const x=dilCtx();const g=(p,v)=>{if(p&&p.alive)p.op=cl(p.op+v)};const O=[];
 if(d==='war_dis'){const w=x.war,s=x.dis;
  O.push({l:'先保前線',h:'60萬兩，戰局+12；災區民怨上升',fn:()=>{if(!w||!s)return OKK('局勢已變。');if(G.tre<60)return NO('國庫不足。');G.tre-=60;w.front=cl(w.front+12,-100,100);G.reg[s.reg].un=cl(G.reg[s.reg].un+10);G.mind=cl(G.mind-2);g(x.A,6);g(x.C,-6);return OKK('你把錢糧撥往邊關。賑災的折子，被壓在了最下面。')}});
  O.push({l:'先救災民',h:'耗糧60，災區回穩；前線吃緊',fn:()=>{if(!w||!s)return OKK('局勢已變。');if(G.gra<60)return NO('糧倉不足。');G.gra-=60;G.reg[s.reg].food=cl(G.reg[s.reg].food+18);s.relief=true;G.mind=cl(G.mind+1);w.front=cl(w.front-7,-100,100);g(x.C,6);g(x.A,-6);return OKK('糧車向南而行。邊關的將士，等到的是一封解釋的詔書。')}});
  O.push({l:'勉力兩全',h:'160萬兩加糧60；皇權-2，且國庫見底',fn:()=>{if(!w||!s)return OKK('局勢已變。');if(G.tre<160||G.gra<60)return NO('錢糧不足以兩全。');G.tre-=160;G.gra-=60;w.front=cl(w.front+8,-100,100);G.reg[s.reg].food=cl(G.reg[s.reg].food+18);s.relief=true;G.auth=cl(G.auth-2);return OKK('你咬牙兩頭都管。國庫的賬面，薄得像一層紙。')}})}
 else if(d==='tax_mind'){
  O.push({l:'減稅安民',h:'賦稅降一級，民心+3；國庫更緊',fn:()=>{if(G.tax<=1)return NO('賦稅已是最輕。');G.tax--;G.mind=cl(G.mind+3);g(x.C,6);return OKK('稅率降為「'+TAXN[G.tax-1]+'」。戶部尚書的臉色很不好看。')}});
  O.push({l:'維持重稅',h:'國庫得保；民心-3，負擔+2',fn:()=>{G.mind=cl(G.mind-3);G.burden=cl(G.burden+2);g(x.C,-5);return OKK('你駁回了減稅之請。百姓沒有說什麼，只是沉默得更久了。')}});
  O.push({l:'抄沒貪官補虧空',h:'+90萬兩；得罪權貴',fn:()=>{G.tre+=90;for(const p of alivePs())if(p.off&&p.cor>50)p.op=cl(p.op-6);G.rep=cl(G.rep-1);return OKK('你下令抄了幾家，補上缺口，也換來一屋子的冷眼。')}})}
 else if(d==='fac_cor'){const tf=topFac();
  O.push({l:'一查到底',h:'貪墨下降；該派怨恨，皇權-3',fn:()=>{for(const p of alivePs())if(p.off&&facOf(p)===tf){p.op=cl(p.op-8);p.cor=cl(p.cor-6)}G.auth=cl(G.auth-3);G.rep=cl(G.rep+2);return OKK('詔令一出，'+FAC[tf].n+'的燈火徹夜未熄。')}});
  O.push({l:'暫且壓下',h:'朝局平穩；貪風更盛',fn:()=>{for(const p of alivePs())if(p.off&&facOf(p)===tf){p.op=cl(p.op+4);p.cor=cl(p.cor+4)}G.rep=cl(G.rep-1);return OKK('卷宗被收進了匣子。匣子上了鎖，鑰匙不在你手裏。')}})}
 else{const gen=x.gen;
  O.push({l:'重賞以結其心',h:'將軍歸心，軍心+6；野心更盛',fn:()=>{if(!gen||!gen.alive)return OKK('局勢已變。');if(G.tre<30)return NO('國庫不足。');G.tre-=30;g(gen,12);gen.amb=cl(gen.amb+6);G.morale=cl(G.morale+6);return OKK('厚賞送到營中，將軍當著眾人跪謝，眼神卻很平靜。')}});
  O.push({l:'調離營中',h:'將軍怨恨；軍心-4，皇權+2',fn:()=>{if(!gen||!gen.alive)return OKK('局勢已變。');vacate(gen);g(gen,-14);G.morale=cl(G.morale-4);G.auth=cl(G.auth+2);return OKK('一紙調令，將軍交印時沒有說話。')}})}
 return O}
const __mo2=memoOpts;memoOpts=function(m){return m.k==='dil'?dilOpts(m):__mo2(m)};

/* ---------- 成就與典藏（跨局保存） ---------- */
let META=null;
const ENDN={fall:'義軍破京',usurp:'改朝換代',extinct:'國祚斷絕'};
const ACH={
 long30:{n:'在位三十載',d:'一位皇帝在位滿三十年。',chk:()=>G.t-G.emps[G.emps.length-1].t0>=360},
 dyn100:{n:'百年社稷',d:'王朝延續滿一百年。',chk:()=>G.t-G.emps[0].t0>=1200},
 three:{n:'傳至三代',d:'本朝歷三位皇帝。',chk:()=>G.emps.length>=3},
 minister:{n:'名臣出世',d:'朝中出現一位「名臣」。',chk:()=>alivePs().some(p=>(p.tr||[]).includes('名臣')||p.title==='名臣')},
 kids8:{n:'子孫滿堂',d:'膝下皇子公主存活八人以上。',chk:()=>myKids().length>=8},
 rich:{n:'府庫充盈',d:'國庫存銀超過兩千萬兩。',chk:()=>G.tre>=2000},
 mercy:{n:'仁君',d:'在位二十年，未誅殺一人。',chk:()=>G.reign.exec===0&&G.t-G.reign.t0>=240},
 saved:{n:'力挽狂瀾',d:'皇權跌破二十五後，又回到六十以上。',chk:()=>{if(G.auth<25)G.lowAuth=1;return G.lowAuth&&G.auth>=60}}};
function metaGet(){if(META)return META;try{META=JSON.parse(localStorage.getItem('emperor_meta_v1')||'null')}catch(e){META=null}if(!META)META={v:{},e:{},m:{},a:{},games:0};return META}
function metaSave(){try{localStorage.setItem('emperor_meta_v1',JSON.stringify(META))}catch(e){}}
function metaName(c,k){return c==='v'?(TEMPLE[k]?TEMPLE[k][0]:k):c==='e'?ENDN[k]:c==='m'?MAND[k].n:ACH[k].n}
function metaUnlock(c,k){const M=metaGet();const o=M[c];if(!o)return;if(o[k])o[k].n++;else{o[k]={n:1,t:Date.now()};if(typeof toast==='function')toast('典藏新增：「'+metaName(c,k)+'」')}metaSave()}
function achCheck(){G.ach=G.ach||[];for(const k in ACH){if(G.ach.includes(k))continue;let ok=false;try{ok=ACH[k].chk()}catch(e){}if(ok){G.ach.push(k);metaUnlock('a',k);chron('〔成就〕'+ACH[k].n+'。',2)}}}
function metaEnd(){if(G.over&&!G.overMeta){G.overMeta=1;metaUnlock('e',G.over.type);const r=G.emps[G.emps.length-1];if(r&&r.v)metaUnlock('v',r.v.key);if(G.daily){const M=metaGet();M.daily=M.daily||{};const y=Math.round((G.t-G.emps[0].t0)/12);if(!M.daily[G.daily]||M.daily[G.daily].y<y){M.daily[G.daily]={y,v:r&&r.v?r.v.label:'',e:G.over.type};metaSave()}}}}


/* ---------- 七：決策回顧（政策決定，數年後由史官對照同期國勢） ---------- */
function decSnap(){return{mind:G.mind,tre:G.tre,auth:G.auth,rep:G.rep}}
function decRec(m,o,s0){if(!m||m.k==='echo'||!o)return;G.dec=G.dec||[];let t=String(m.txt||'').replace(/[。！!]+$/,'');if(t.length>34)t=t.slice(0,34)+'…';
 G.dec.push({t:G.t,k:m.k,txt:t,l:o.l,s:s0||decSnap()});if(G.dec.length>60)G.dec.shift()}
function decMonth(){const L=G.dec;if(!L||!L.length)return;if(G.decT!=null&&G.t-G.decT<14)return;if(!chance(.05))return;
 const sc=d=>{const a=G.mind-d.s.mind,b=G.auth-d.s.auth,c=G.rep-d.s.rep,e=(G.tre-d.s.tre)/80;return{a,b,c,e,s:a*1.5+b*.5+c*.5+e}};
 const c=L.filter(d=>!d.rv&&G.t-d.t>=30&&G.t-d.t<=130);if(!c.length)return;
 let best=null,bs=0;for(const d of c){const v=sc(d);const m=Math.abs(v.a)*2+Math.abs(v.b)+Math.abs(v.c)+Math.abs(v.e);if(m>bs){bs=m;best=d}}
 if(!best||bs<8)return;best.rv=1;G.decT=G.t;const v=sc(best);const yrs=Math.max(2,Math.round((G.t-best.t)/12));
 const ch=[];const R=Math.round;if(Math.abs(v.a)>=3)ch.push('民心'+R(best.s.mind)+'→'+R(G.mind));if(Math.abs(v.b)>=3)ch.push('皇權'+R(best.s.auth)+'→'+R(G.auth));if(Math.abs(v.e*80)>=50)ch.push('國庫'+R(best.s.tre)+'→'+R(G.tre)+'萬兩');if(Math.abs(v.c)>=3)ch.push('威望'+R(best.s.rep)+'→'+R(G.rep));
 const j=v.s>=6?'同期國運漸升，史家以為此議有功。':v.s<=-6?'同期國勢轉衰，後人論及此事，多有遺憾。':'得失參半，史家未有定論。';
 chron('史官回顧：'+dateStr(best.t)+'，'+best.txt+'。你當時選擇「'+best.l+'」。其後'+yrs+'年，'+(ch.join('，')||'各項大致持平')+'。'+j+'（同期變化未必全因此事）',3)}

/* ---------- 八：外戚連動（奏摺牽涉太后、皇后家族） ---------- */
function waiSide(p){if(!p||p.clan==null)return null;const e=emp();const q=e&&e.sp!=null?P(e.sp):null;
 if(q&&q.alive&&q.role==='consort'&&q.rank>=6&&q.clan===p.clan&&q.id!==p.id)return{side:'皇后',q};
 const d=alivePs().find(z=>z.role==='dowager'&&String(z.title).indexOf('太后')>=0);if(d&&d.clan===p.clan&&d.id!==p.id)return{side:'太后',q:d};return null}
function memoWai(m){if(!m||!m.x)return null;let p=null;if(m.k==='impeach')p=P(m.x.tg);else if(m.k==='recommend')p=P(m.x.cand);else return null;if(!p||!p.alive)return null;const w=waiSide(p);return w?{side:w.side,q:w.q,p}:null}
const __mo8=memoOpts;memoOpts=function(m){const O=__mo8(m);const w=memoWai(m);if(!w)return O;const{side,q,p}=w;const mood=(v)=>{q.op=cl(q.op+v);if(q.role==='consort')q.fav=cl(q.fav+v)};const wai=v=>{G.fd.wai=cl((G.fd.wai||0)+v,0,35)};
 if(m.k==='impeach'){for(const o of O){if(String(o.l).indexOf('准予徹查')===0){const f0=o.fn;o.h=(o.h?o.h+'；':'')+'涉'+side+'族，'+side+'將不悅';o.fn=()=>{const r=f0();if(r.ok){mood(-8);wai(-1)}return r}}}
  const f=m.from?P(m.from):null;O.push({l:'看在'+side+'面上，從輕處置',h:side+'歡喜、外戚勢力+2；御史失望，皇權-1',fn:()=>{mood(8);wai(2);p.op=cl(p.op+6);if(f)f.op=cl(f.op-5);G.auth=cl(G.auth-1);return OKK('你顧念'+side+'顏面，命有司從輕發落，御史退下時臉色難看。')}})}
 else if(m.k==='recommend'){for(const o of O){if(String(o.l).indexOf('准')===0){const f0=o.fn;o.h=(o.h?o.h+'；':'')+'后族出身，外戚勢力+2';o.fn=()=>{const r=f0();if(r.ok){mood(4);wai(2)}return r}}
  else if(String(o.l).indexOf('駁回')===0){const f0=o.fn;o.h=(o.h?o.h+'；':'')+'恐拂'+side+'之意';o.fn=()=>{const r=f0();if(r.ok)mood(-4);return r}}}}
 return O};

/* ---------- 九：開局志向與史官評語 ---------- */
const ASP={restore:{n:'中興',d:'重振國勢：民心與皇權雙高，或名列盛世、中興、武功',ok:'「志在中興，果以中興名世，史臣不虛美也。」',bad:'「志在中興，然國勢未振，終成空言。」',fall:'「志在中興，卒至亡國，志大而才疏。」'},
 keep:{n:'守成',d:'平穩傳承：在位十二年以上，少民變饑荒，不為暴君庸主',ok:'「守成之君，不求赫赫之功而祖業無損，亦難能也。」',bad:'「志在守成，而變亂屢起，守成之志未能償。」',fall:'「志在守成，而社稷傾覆，守成者反失其所守。」'},
 joy:{n:'享樂',d:'逍遙一世：在位十年以上，子嗣四人以上，國事未壞',ok:'「帝享太平之福，子孫滿堂，天下亦未見大亂，可謂有福。」',bad:'「帝志在安樂，而國事日非，樂不長久。」',fall:'「帝志在安樂，終致亡國，歡娛之地即傾覆之地。」'}};
function aspEval(e,fell,key,mm,am,yrs){const k=G.asp;if(!k||!ASP[k])return null;const r=G.reign;let ok=false;
 if(k==='restore')ok=!fell&&(['sage','revive','warrior'].indexOf(key)>=0||(mm>=62&&am>=45));
 else if(k==='keep')ok=!fell&&yrs>=12&&r.revolt<=1&&r.famine<=1&&['tyrant','fool','puppet'].indexOf(key)<0;
 else if(k==='joy')ok=!fell&&yrs>=10&&((e&&e.kids)||[]).length>=4&&mm>=45&&key!=='puppet';
 return{k,n:ASP[k].n,ok,txt:ASP[k][ok?'ok':fell?'fall':'bad']}}
function aspHtml(){const k=G.asp;if(k&&ASP[k]){const a=ASP[k];return '<div class="card mand"><div class="row sp"><h3>志向：'+a.n+'</h3><span class="small dim">史官將據此論你</span></div><div class="small">'+a.d+'</div></div>'}
 return '<div class="card mand"><div class="row sp"><h3>志向</h3></div><div class="small dim">未立。立下之後，史官將以此論這一朝；每朝僅能立一次。</div><div class="opts">'+Object.keys(ASP).map(x=>'<button class="sm" data-act="aspset" data-arg="'+x+'">'+ASP[x].n+'<small>'+ASP[x].d.split('：')[0]+'</small></button>').join('')+'</div></div>'}
