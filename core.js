'use strict';
/* ============ 皇帝模擬器 · 核心資料與世界生成 ============ */
const VER=1,SCHEMA=3;let G=null;
function R(){G.rs=(G.rs+0x6D2B79F5)|0;let t=G.rs;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}
const ri=(a,b)=>a+Math.floor(R()*(b-a+1));
const rr=(a,b)=>a+R()*(b-a);
const pick=a=>a[Math.floor(R()*a.length)];
const chance=p=>R()<p;
const cl=(v,a=0,b=100)=>v<a?a:v>b?b:v;
const rd=v=>Math.round(v);
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function wpick(arr,fn){let tot=0;const w=arr.map(x=>{const v=Math.max(0,fn(x));tot+=v;return v});if(tot<=0)return null;let r=R()*tot;for(let i=0;i<arr.length;i++){r-=w[i];if(r<=0)return arr[i]}return arr[arr.length-1]}
function cn(n){const d='〇一二三四五六七八九';if(n<10)return d[n];if(n<20)return'十'+(n%10?d[n%10]:'');if(n<100)return d[Math.floor(n/10)]+'十'+(n%10?d[n%10]:'');return String(n)}

const FAC={chan:{n:'權臣黨',c:'#c9a24b'},clean:{n:'清流',c:'#5fa593'},army:{n:'將門',c:'#c75a4d'},kin:{n:'宗室',c:'#9275c4'},eun:{n:'宦官',c:'#8b8b95'},wai:{n:'外戚',c:'#d27aa0'},none:{n:'無黨',c:'#8a8070'}};
const STN={lit:'文藝',mil:'武略',pol:'政務',sch:'權謀',biz:'理財',med:'醫學'};
const TRL=['忠直','貪婪','野心','仁厚','陰險','懦弱','勤勉','好色','多疑','孤傲','圓滑','剛烈','聰慧','嫉妒','溫婉','風雅','好戰','謹慎'];
const RK={6:'皇后',5:'貴妃',4:'妃',3:'嬪',2:'貴人',1:'常在'};
const RKCAP={6:1,5:2,4:4,3:6,2:99,1:99};
const IMPSUR='凌';
const SURN=['沈','謝','陸','顧','崔','盧','鄭','薛','裴','柳','韓','溫','杜','秦','雲','葉','蘇','池','藺','宋','季','祁','晏','莊','江','許','賀','衛','白','夏'];
const GM=['允','景','承','明','彥','安','廷','文','昭','懷','舜','秉','錦','瑾','修','恆','序','珩','禎','鴻','嶽','遠','翊','鈞','嵩','澄','衡','沛','朗','暄'];
const GM2=['之','川','遠','然','鈞','淵','言','卿','恩','成','平','儀','行','知','和','業','瑜','熙','玨','毅','策','槐','舟','岱','崢',''];
const GF1=['婉','靜','清','雲','若','明','知','玉','蘭','雪','秋','紅','綠','瑤','錦','婧','芷','凝','霜','晚','詩','青','韶','攬','彤'];
const GF2=['儀','蘭','容','姝','娘','音','月','華','瑩','心','薇','梅','盈','茵','萱','芸','顏','兒','鳶','歌','晴','瑾','苒','柔','荷'];
const ERAS=['景和','永熙','承平','嘉祐','天佑','元啟','靖安','昭明','建隆','開泰','崇德','延慶','興元','貞觀·新','太初','熙寧·新','弘治·新','乾泰','永昌','祥符·新'];
const OFF=[
 {id:'chan',n:'丞相',r:9,s:'pol'},{id:'hu',n:'戶部尚書',r:6,s:'biz'},{id:'li',n:'吏部尚書',r:6,s:'pol'},
 {id:'bing',n:'兵部尚書',r:6,s:'mil'},{id:'rite',n:'禮部尚書',r:5,s:'lit'},{id:'yu',n:'御史大夫',r:6,s:'sch'},
 {id:'gen',n:'大將軍',r:8,s:'mil',role:'general'},{id:'guard',n:'禁軍統領',r:6,s:'mil',role:'general'},
 {id:'eun',n:'司禮監掌印',r:6,s:'sch',role:'eunuch'},{id:'hist',n:'太史令',r:4,s:'lit'},{id:'med',n:'太醫令',r:3,s:'med'}];
const REG0=[
 {id:'jing',n:'京畿',pop:620,pr:70,x:52,y:42,ter:'plain'},{id:'zhong',n:'中原',pop:820,pr:62,x:62,y:55,ter:'plain'},
 {id:'jiang',n:'江南',pop:900,pr:76,x:70,y:72,ter:'coast'},{id:'shu',n:'巴蜀',pop:560,pr:64,x:34,y:68,ter:'mount'},
 {id:'he',n:'河朔',pop:520,pr:52,x:56,y:22,ter:'steppe',foe:'di'},{id:'long',n:'隴右',pop:360,pr:46,x:24,y:40,ter:'steppe',foe:'qiang'},
 {id:'ling',n:'嶺南',pop:430,pr:50,x:52,y:88,ter:'mount',foe:'zhao'},{id:'guan',n:'關中',pop:520,pr:60,x:40,y:50,ter:'plain'}];
const FOE0={di:{n:'北狄',str:70,att:-20,x:56,y:5},qiang:{n:'西羌',str:50,att:0,x:7,y:40},zhao:{n:'南詔',str:42,att:10,x:50,y:97}};
const TERN={plain:'平原',coast:'沿海',mount:'山地',steppe:'邊塞'};
const SCN={
 a:{n:'少年天子',d:'先帝新逝，你年僅十七。太后與權臣把持朝政，皇權旁落，你得在夾縫中站穩腳跟。'},
 b:{n:'守成之君',d:'你三十而立，後宮、子嗣、朝堂皆已成形。天下無大事，但暗流從不缺席。'},
 c:{n:'亂世新君',d:'前朝崩壞，新朝初立。兵強馬壯卻國庫空虛，民心未附，將門功高。'}};

/* ---------- 基本工具 ---------- */
const P=id=>G.P[id];
const age=p=>Math.floor((G.t-p.born)/12);
const alivePs=()=>Object.values(G.P).filter(p=>p.alive);
const emp=()=>G.P[G.emp];
const nm=p=>p?p.sur+p.gn:'—';
const nmt=p=>p?(p.title?p.title+'·':'')+p.sur+p.gn:'—';
function offDef(id){if(!id)return null;const o=OFF.find(x=>x.id===id);if(o)return o;if(id==='spy')return{id:'spy',n:'錦衣衛指揮使',r:5,s:'sch'};
 if(id.startsWith('g_')){const r=G.reg[id.slice(2)];return{id,n:r.n+'州牧',r:5,s:'pol',gov:r.id}}return null}
function allOffIds(){return OFF.map(o=>o.id).concat(Object.keys(G.reg).map(r=>'g_'+r),G.inst.spy?['spy']:[])}
const holder=id=>G.off[id]?G.P[G.off[id]]:null;
function offq(id,stat){const h=holder(id);return h?h.st[stat]:30}
function dateStr(t){t=t==null?G.t:t;let en=G.era.n,y0=G.era.y0;if(G.emps&&G.emps.length){let r=G.emps[0];for(const x of G.emps)if(x.t0<=t)r=x;en=r.era||en;y0=Math.floor(r.t0/12)}const y=Math.floor(t/12)-y0+1;if(y<1)return '先朝'+(1-y)+'年前';return en+(y===1?'元':cn(y))+'年'+(((t%12)+12)%12+1)+'月'}
function stage(p){const a=age(p);return a<12?0:a<18?1:a<50?2:3}
const STG=['孩童','少年','壯年','老年'];
function genGiven(g){return g==='M'?pick(GM)+pick(GM2):pick(GF1)+pick(GF2)}
function genFace(){return[ri(0,4),ri(0,4),ri(0,5),ri(0,4),ri(0,3),ri(0,4),ri(0,5),ri(0,3)]}
function mixFace(a,b){return a.map((v,i)=>chance(.38)?v:(chance(.5)?v:b[i]))}
const BIAS={official:{pol:14,lit:8},general:{mil:24,sch:6},eunuch:{sch:16},consort:{lit:10},maiden:{lit:6}};

function mk(o){
 const id=G.nid++;const g=o.g||(chance(.5)?'M':'F');const role=o.role||'official';
 const st={};const b=Object.assign({},BIAS[role],o.bias);
 for(const k in STN)st[k]=cl(ri(20,66)+(b[k]||0),5,98);
 if(o.st)Object.assign(st,o.st);
 let tr=o.tr;if(!tr){tr=[];const n=ri(2,3);while(tr.length<n){const t=pick(TRL);if(!tr.includes(t))tr.push(t)}}
 const sur=o.sur||(o.fa!=null&&G.P[o.fa]?G.P[o.fa].sur:pick(SURN));
 const p={id,g,sur,gn:o.gn||genGiven(g),born:o.born,alive:o.alive!==false,role,clan:o.clan==null?null:o.clan,st,tr,amb:o.amb!=null?o.amb:ri(10,90),op:o.op!=null?o.op:ri(35,70),
  fav:o.fav!=null?o.fav:40,cor:0,hp:ri(70,100),ill:0,fac:o.fac||'none',off:null,sp:o.sp==null?null:o.sp,mo:o.mo==null?null:o.mo,fa:o.fa==null?null:o.fa,kids:[],rank:0,
  mem:[],bio:[],rel:{},ft:o.ft||genFace(),pst:0,preg:0,pf:null,title:o.title||'',fief:null,tutor:null,back:null,watch:0,secret:o.secret||null,focus:null,
  motive:o.motive||pick(['love','power','family','fear']),noise:ri(-100,100)/100,sec:0,exile:false,lock:0,bt:G.t};
 p.cor=tr.includes('貪婪')?ri(25,55):ri(0,25);if(tr.includes('忠直'))p.cor=Math.max(0,p.cor-20);
 const a0=Math.floor((G.t-p.born)/12);
 if(a0<18&&(role==='prince'||role==='princess'||role==='kin'||role==='maiden'&&o.fa!=null||role==='son'&&o.fa!=null)){const F=o.fa!=null?G.P[o.fa]:null,M=o.mo!=null?G.P[o.mo]:null;p.pot={};const par=[F,M].filter(Boolean);for(const k in STN){const base=par.length?par.reduce((s,x)=>s+x.st[k],0)/par.length:p.st[k];p.pot[k]=cl(base*.6+ri(12,48),10,96);p.st[k]=cl(p.pot[k]*(.2+.7*Math.min(1,a0/18)),5,96)}}
 G.P[id]=p;return p}
function bio(p,txt){p.bio.push({t:G.t,txt});if(p.bio.length>45)p.bio.splice(2,1)}
function memo_(p,k,w,txt,about){p.mem.unshift({t:G.t,k,w,txt,a:about==null?null:about});if(p.mem.length>16)p.mem.pop();p.op=cl(p.op+w)}
function grudge(p){let s=0;for(const m of p.mem)if(m.w<0&&G.t-m.t<120)s-=m.w;return s}
function gratitude(p){let s=0;for(const m of p.mem)if(m.w>0&&G.t-m.t<120)s+=m.w;return s}
function log(txt,cls){G.log.unshift({t:G.t,txt,cls:cls||''});if(G.log.length>260)G.log.pop()}
const ALERTS=[];
function chron(txt,imp,ids){G.chr.push({t:G.t,txt,imp:imp||2,ids:ids||[]});log(txt,imp>=3?'big':'');if(imp>=3){ALERTS.push({t:G.t,txt});if(ALERTS.length>30)ALERTS.shift()}}
function relOf(a,b){if(a.rel[b.id]==null){let v=(a.fac===b.fac&&a.fac!=='none')?10:-6;v+=ri(-25,25);if(a.clan!=null&&a.clan===b.clan)v+=30;a.rel[b.id]=v}return a.rel[b.id]}
function bump(a,b,v){a.rel[b.id]=cl(relOf(a,b)+v,-100,100)}

/* ---------- 新遊戲 ---------- */
function newClan(s,f,low){const id=G.cid++;G.clans[id]={id,s,f,f0:f,m:[],pw:0,wai:false,low:!!low};return G.clans[id]}
function newMan(cid,a0,a1,role,ex){const c=G.clans[cid];let a=ri(a0,a1);if(role==='son'&&a>=18)role='official';
 const p=mk(Object.assign({g:'M',sur:c.s,born:G.t-12*a-ri(0,11),role,clan:cid,fac:role==='general'?'army':c.f},ex||{}));c.m.push(p.id);return p}
function newGirl(cid,a0,a1,role,ex){const c=G.clans[cid];const p=mk(Object.assign({g:'F',sur:c.s,born:G.t-12*ri(a0,a1)-ri(0,11),role:role||'maiden',clan:cid,fac:c.f},ex||{}));c.m.push(p.id);return p}
function appointRaw(oid,p){const old=holder(oid);if(old)old.off=null;if(p.off)G.off[p.off]=null;G.off[oid]=p.id;p.off=oid}
function vacate(p){if(p.off){G.off[p.off]=null;p.off=null}}
function refreshClans(){
 const waiClans=new Set();
 for(const p of alivePs()){if(p.role==='consort'&&p.rank>=5&&p.clan!=null)waiClans.add(p.clan);if(p.role==='dowager'&&p.clan!=null&&p.rank>=5)waiClans.add(p.clan)}
 for(const id in G.clans){const c=G.clans[id];c.wai=waiClans.has(c.id);const nf=c.wai?'wai':c.f0;if(nf!==c.f){c.f=nf;for(const mid of c.m){const m=G.P[mid];if(m.alive&&(m.role==='official'||m.role==='son'||m.role==='maiden'||m.role==='wife'))m.fac=nf}}}}

function newGame(o){
 const seed=(o.seed!=null?o.seed:Math.floor(Math.random()*2147483647))|0;
 G={v:VER,rs:seed,nid:1,t:720,P:{},clans:{},cid:1,reg:{},foe:{},off:{},fd:{chan:0,clean:0,army:0,kin:0,eun:0,wai:0},
  tre:800,gra:500,tax:3,mil:3,crt:3,army:40,morale:60,mind:62,rep:50,auth:48,att:50,fear:20,burden:30,debt:0,weather:1,
  life:'diligent',ap:3,held:false,mw:0,visited:{},sit:[],memo:[],plots:[],intel:[],log:[],chr:[],emps:[],inst:{},proj:[],heir:null,emp:null,regent:null,over:null,scn:o.scn||'a',puppet:false,editHist:0,usurpWatch:0,
  pow:{chan:0,clean:0,army:0,kin:0,eun:0,wai:0,none:0},nxEx:0,sel:0};
 REG0.forEach(r=>{G.reg[r.id]=Object.assign({food:ri(60,78),un:ri(8,18),au:ri(6,14),garr:ri(2,5),rebel:0,exempt:0,sec:false,dis:null},r)});
 for(const k in FOE0){G.foe[k]=Object.assign({k,vas:false,trade:false,war:null,hist:0},FOE0[k]);G.foe[k].ruler=pick(GM)+pick(GM2)+(k==='di'?'可汗':'王')}
 for(const r of OFF)G.off[r.id]=null;for(const k in G.reg)G.off['g_'+k]=null;
 // 世家
 const surs=shuffle(SURN.filter(s=>s!==IMPSUR)).slice(0,10);const facs=shuffle(['chan','chan','chan','clean','clean','clean','army','army','wai','wai']);
 surs.forEach((s,i)=>{const c=newClan(s,facs[i]);const gen=c.f==='army';
  newMan(c.id,46,64,gen?'general':'official');newMan(c.id,26,44,'official');newMan(c.id,26,44,gen?'general':'official');
  newMan(c.id,6,24,'son');newMan(c.id,6,24,'son');for(let k=0;k<3;k++)newGirl(c.id,8,22)});
 for(let i=0;i<4;i++){const c=newClan(pick(SURN),'clean',true);newMan(c.id,24,40,'official')}
 for(let i=0;i<4;i++)mk({g:'M',role:'eunuch',born:G.t-12*ri(28,56),fac:'eun',amb:ri(20,95)});
 // 皇室
 const impC=null;const S=o.scn||'a';
 const eAge=S==='a'?17:S==='b'?30:36;
 const fa=mk({g:'M',sur:IMPSUR,role:'kin',born:G.t-12*(eAge+ri(22,28)),alive:false,title:'先帝',fac:'kin'});
 const waiC=Object.values(G.clans).filter(c=>c.f==='wai');const moC=pick(waiC);
 const mo=newGirl(moC.id,0,0,'dowager',{born:G.t-12*(eAge+ri(18,24)),rank:5});mo.title='太后';mo.fac='wai';mo.sp=fa.id;mo.rank=5;
 const e=mk({g:'M',sur:IMPSUR,gn:o.name||'承嗣',role:'emp',born:G.t-12*eAge-ri(0,11),fa:fa.id,mo:mo.id,fac:'kin',op:50,amb:60,tr:(o.tr||[pick(['勤勉','仁厚','剛烈','聰慧','風雅','多疑']),pick(['謹慎','野心','圓滑','孤傲','好戰'])])});
 const base={a:42,b:50,c:48}[S];for(const k in STN)e.st[k]=cl(base+ri(-8,10),20,80);
 const fk=o.focus||'pol';e.st[fk]=cl(e.st[fk]+16,0,90);e.title='';
 G.emp=e.id;fa.kids.push(e.id);mo.kids.push(e.id);
 const sibs=S==='a'?3:2;
 for(let i=0;i<sibs;i++){const g=i===1?'F':'M';const c=mk({g,sur:IMPSUR,role:g==='M'?'prince':'princess',born:G.t-12*Math.max(1,eAge-ri(-6,5))-ri(0,11),fa:fa.id,mo:mo.id,fac:'kin',ft:mixFace(e.ft,genFace())});fa.kids.push(c.id);mo.kids.push(c.id);if(g==='M'&&age(c)>=16){c.title=c.gn+'王'}}
 for(let i=0;i<2;i++)mk({g:'M',sur:IMPSUR,role:'kin',born:G.t-12*ri(44,60),fac:'kin',title:'親王'});
 // 官職
 const offs=OFF.slice();
 for(const od of offs){const pool=alivePs().filter(p=>!p.off&&(od.role?p.role===od.role:p.role==='official')&&age(p)>=25);
  const h=pool.sort((a,b)=>(b.st[od.s]+ri(0,22))-(a.st[od.s]+ri(0,22)))[0];if(h)appointRaw(od.id,h)}
 for(const k in G.reg){const pool=alivePs().filter(p=>!p.off&&p.role==='official'&&age(p)>=25);const h=pool.sort((a,b)=>(b.st.pol+ri(0,25))-(a.st.pol+ri(0,25)))[0];if(h)appointRaw('g_'+k,h)}
 // 後宮
 const nc=S==='a'?0:S==='b'?5:2;const cs=shuffle(Object.values(G.clans).filter(c=>!c.low));
 for(let i=0;i<nc;i++){const c=cs[i%cs.length];const rk=i===0&&S==='b'?6:i===1?5:ri(2,4);const g=newGirl(c.id,17,26,'consort');g.rank=rk;g.fav=ri(30,75);g.op=ri(40,75);
  g.sp=e.id;if(rk===6)e.sp=g.id}
 if(S==='b'){const wf=alivePs().filter(p=>p.role==='consort');for(const w of wf.slice(0,3)){const k=mk({g:chance(.5)?'M':'F',sur:IMPSUR,role:'prince',born:G.t-12*ri(1,6),fa:e.id,mo:w.id,fac:'kin',ft:mixFace(e.ft,w.ft)});if(k.g==='F')k.role='princess';e.kids.push(k.id);w.kids.push(k.id)}
  const pr=alivePs().filter(p=>p.role==='prince'&&p.fa===e.id);if(pr.length)G.heir=pr[0].id}
 // 場景參數
 if(S==='a'){G.auth=30;G.tre=620;G.army=38;G.fd.wai=14;G.fd.chan=14;G.rep=38;G.mind=58;G.regent=null}
 if(S==='b'){G.auth=54;G.tre=950;G.rep=55;G.mind=66}
 if(S==='c'){G.auth=58;G.tre=520;G.gra=340;G.army=50;G.morale=72;G.burden=36;G.mind=56;G.rep=60;G.fd.army=16;G.foe.di.str=70;G.foe.di.att=-30;G.crt=2;
  for(const k of ['he','zhong','guan'])G.reg[k].un+=9}
 G.era={n:pick(ERAS),y0:Math.floor(G.t/12)};
 G.reign={t0:G.t,m0:G.mind,wins:0,losses:0,exec:0,famine:0,revolt:0,authSum:0,mindSum:0,n:0,purges:0,heirsLost:0,founder:S==='c',start:S};
 refreshClans();syncPower();
 G.emps.push({pid:e.id,t0:G.t,era:G.era.n,t1:null});
 bio(e,'即位為帝，年號'+G.era.n+'。');
 chron((S==='c'?'新朝肇建，':'')+nm(e)+'即位，改元'+G.era.n+'。',3,[e.id]);
 for(let k=0;k<2;k++)genMemos();
 previewFin();snapRec();chapterStart(false);G.diff=o.diff||'n';if(typeof diffApply==='function')diffApply();if(o.cust&&typeof custApply==='function')custApply(o.cust);if(o.legacy&&typeof legacyApply==='function')legacyApply(o.legacy);
 return G}
