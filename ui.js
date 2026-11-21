'use strict';
/* ============ 介面 ============ */
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const n0=v=>Math.round(v);
const SAVEKEY='emperor_sim_v1';
let TAB='court';const UI={sel:'jing',fl:{role:'all',fac:'all',q:''},all:false,pid:null,last:null,start:{scn:'a',name:'承嗣',focus:'pol'},ask:null};
const ROLEN={emp:'皇帝',official:'官員',general:'將領',eunuch:'宦官',consort:'妃嬪',dowager:'太后太妃',prince:'皇子',princess:'皇女',kin:'宗室',maiden:'閨秀',son:'世家子弟',wife:'命婦'};
const roleLabel=p=>{if(p.role==='consort')return RK[p.rank];if(p.role==='dowager')return p.title||'太妃';if(p.role==='prince'&&p.fa!==G.emp)return'宗室親王';if(p.role==='princess'&&p.fa!==G.emp)return'宗室郡主';return ROLEN[p.role]||p.role};
const facTag=f=>'<span class="fac" style="background:'+FAC[f].c+'">'+FAC[f].n+'</span>';
const bar=(v,c,max)=>'<div class="bar '+(c||'')+'"><i style="width:'+cl(v/(max||100)*100,0,100)+'%"></i></div>';
const lnk=p=>p?'<a data-act="person" data-arg="'+p.id+'">'+esc(nmt(p))+'</a>':'—';
function fuzz(v){const e=emp();return v+(emp()?0:0)+(0)}
function shown(p,v){const e=emp();const n=Math.max(0,38-e.st.sch*.4);return cl(v+p.noise*n,0,100)}
function attLabel(p){const v=shown(p,p.op);return v>=78?'忠心耿耿':v>=62?'恭順可親':v>=45?'尚稱恭順':v>=30?'貌合神離':'心懷怨望'}
function ambLabel(p){const v=shown(p,p.amb);return v>=78?'野心勃勃':v>=58?'頗有心機':v>=35?'安分守己':'淡泊無求'}
function corLabel(p){const v=shown(p,p.cor+10);return v>=60?'疑有貪墨':v>=40?'不甚清廉':'清廉自守'}

/* ---------- 立繪 ---------- */
function portrait(p,w){
 const f=p.ft,a=age(p),st=stage(p),M=p.g==='M',role=p.role;
 const skin=['#f7e0c9','#f1d2b3','#e9c39d','#dcae86','#cb9a72'][f[0]],skD=['#e2bfa0','#d8ae8c','#cc9c76','#bc8c66','#aa7c55'][f[0]];
 const hairC=st===3?'#dcd8d2':st===2&&a>=45?'#4a4644':['#1c1411','#2a1a12','#33221a','#1a1417','#241812'][f[6]%5];
 const bgs={emp:['#6a1c1c','#240808'],consort:['#6a2a48','#26101c'],dowager:['#4e2058','#1c0c22'],official:['#1f3a5e','#0c1626'],general:['#6a2a1a','#241008'],eunuch:['#3a3a44','#14141a'],prince:['#3a2a7a','#120c2a'],princess:['#7a3a60','#2a1220'],kin:['#3a2e5a','#140f26'],maiden:['#7a4a5a','#241216'],son:['#2a5a64','#0c2024'],wife:['#6a3a3a','#241212']};
 const bg=bgs[role]||bgs.official;
 let robe='#2a5d86';
 if(role==='emp')robe='#d4a017';else if(role==='consort')robe={6:'#a3201f',5:'#8e3a7c',4:'#c0577a',3:'#4f7fa8',2:'#4a9b82',1:'#7a8a9a'}[p.rank];else if(role==='dowager')robe='#6a2d5f';
 else if(role==='official'){const o=offDef(p.off);robe=!o?'#2f5e6a':o.r>=9?'#8c1b1b':o.r>=6?'#5a2a7a':o.r>=5?'#a32828':'#2a5d86'}else if(role==='general')robe='#7a1f1f';else if(role==='eunuch')robe='#3b3b44';else if(role==='prince')robe='#3a2a7a';else if(role==='princess')robe='#b04b7a';else if(role==='kin')robe='#4a3a6a';else if(role==='maiden')robe='#d7a1b5';else if(role==='son')robe='#2f5e6a';else if(role==='wife')robe='#9a4a5a';
 if(st===0)robe='#e8c98a';
 const tilt=((f[1]+f[5])%5-2)*2,dx=((f[0]+f[3])%3-1)*1.8;
 const sc=st===0?.9:st===1?.96:1;const fy=st===0?5:0;
 let s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 150" width="'+w+'" height="'+w*1.25+'"><defs><radialGradient id="bg'+p.id+'" cx="50%" cy="30%" r="80%"><stop offset="0" stop-color="'+bg[0]+'"/><stop offset="1" stop-color="'+bg[1]+'"/></radialGradient></defs>';
 s+='<rect width="120" height="150" fill="url(#bg'+p.id+')"/><circle cx="60" cy="62" r="46" fill="#ffffff10"/>';
 // 頭髮後層
 s+='<g transform="rotate('+tilt+' 60 100)">';
 const hs=f[6];
 if(!M||role==='emp'){}
 if(!M){ if(hs===1||hs===4)s+='<path d="M28 52 Q18 100 28 138 L46 138 L42 70Z M92 52 Q102 100 92 138 L74 138 L78 70Z" fill="'+hairC+'"/>';
  if(hs===5)s+='<path d="M86 56 Q104 90 94 132 L84 132 Q90 96 80 70Z" fill="'+hairC+'"/>';
  if(hs===0)s+='<ellipse cx="60" cy="24" rx="14" ry="10" fill="'+hairC+'"/>';if(hs===2)s+='<ellipse cx="36" cy="30" rx="10" ry="9" fill="'+hairC+'"/><ellipse cx="84" cy="30" rx="10" ry="9" fill="'+hairC+'"/>';
  if(hs===3)s+='<ellipse cx="60" cy="16" rx="15" ry="13" fill="'+hairC+'"/>'}
 else{ if(role!=='eunuch'&&role!=='official')s+='<ellipse cx="60" cy="24" rx="8" ry="8" fill="'+hairC+'"/>'}
 if(st===0&&!M)s+='<ellipse cx="34" cy="34" rx="8" ry="8" fill="'+hairC+'"/><ellipse cx="86" cy="34" rx="8" ry="8" fill="'+hairC+'"/>';
 s+='</g>';
 // 身體
 s+='<path d="M8 150 Q12 112 60 106 Q108 112 112 150Z" fill="'+robe+'"/>';
 if(role==='general')s+='<rect x="12" y="112" width="26" height="9" rx="4" fill="#8a8a92"/><rect x="82" y="112" width="26" height="9" rx="4" fill="#8a8a92"/>';
 if(role==='emp'){s+='<circle cx="30" cy="132" r="7" fill="none" stroke="#a31515" stroke-width="2"/><circle cx="90" cy="132" r="7" fill="none" stroke="#a31515" stroke-width="2"/><path d="M36 150 L60 124 L84 150" fill="none" stroke="#a31515" stroke-width="2"/>'}
 s+='<path d="M42 108 L60 134 L78 108" fill="none" stroke="#f3ead6" stroke-width="3"/><rect x="52" y="92" width="16" height="18" fill="'+skD+'"/>';
 // 頭部
 s+='<g transform="rotate('+tilt+' 60 100) translate(60 '+(70+fy)+') scale('+sc+') translate(-60 -70)">';
 const sh=f[1];
 if(sh===0)s+='<ellipse cx="60" cy="68" rx="29" ry="33" fill="'+skin+'"/>';else if(sh===1)s+='<ellipse cx="60" cy="68" rx="26" ry="37" fill="'+skin+'"/>';else if(sh===2)s+='<ellipse cx="60" cy="69" rx="24" ry="40" fill="'+skin+'"/>';
 else if(sh===3)s+='<path d="M31 52 Q31 33 60 32 Q89 33 89 52 L86 78 Q80 102 60 103 Q40 102 34 78Z" fill="'+skin+'"/>';else s+='<path d="M30 52 Q30 32 60 32 Q90 32 90 52 Q88 80 60 106 Q32 80 30 52Z" fill="'+skin+'"/>';
 s+='<ellipse cx="31" cy="70" rx="3.5" ry="6" fill="'+skin+'"/><ellipse cx="89" cy="70" rx="3.5" ry="6" fill="'+skin+'"/>';
 if(!M&&st>=1)s+='<ellipse cx="44" cy="80" rx="7" ry="4" fill="#e08a8a" opacity=".25"/><ellipse cx="76" cy="80" rx="7" ry="4" fill="#e08a8a" opacity=".25"/>';
 // 髮前層
 if(!M){s+='<path d="M30 62 Q28 30 60 29 Q92 30 90 62 Q86 44 60 41 Q34 44 30 62Z" fill="'+hairC+'"/>';if(hs===4)s+='<path d="M60 41 Q44 44 36 66 Q50 54 60 41Z" fill="'+hairC+'"/>'}
 else s+='<path d="M31 56 Q30 32 60 31 Q90 32 89 56 Q85 42 60 40 Q35 42 31 56Z" fill="'+hairC+'"/>';
 // 眉
 const bw=(M?1:0)+[2,1.8,2.2,1.2,3.4][f[3]];const bp=['M-9 3 Q0 -4 9 1','M-9 0 L9 0','M-9 3 L9 -3','M-9 2 Q0 -2 9 2','M-10 2 Q0 -3 10 0'][f[3]];
 s+='<g stroke="'+(st===3?'#8a8680':'#2a1a14')+'" fill="none" stroke-width="'+bw+'" stroke-linecap="round"><path transform="translate(47 57) scale(-1 1)" d="'+bp+'"/><path transform="translate(73 57)" d="'+bp+'"/></g>';
 // 眼
 const ep=['M-8 0 Q0 -6 8 0 Q0 5 -8 0Z','M-7 0 Q0 -6 7 0 Q0 6 -7 0Z','M-8 1 Q0 -3 8 1 Q0 3 -8 1Z','M-8 2 Q0 -5 8 -2 Q0 4 -8 2Z','M-8 -2 Q0 -5 8 2 Q0 5 -8 -2Z','M-9 0 Q0 -8 9 0 Q0 7 -9 0Z'][f[2]];
 const ir=f[2]===2?2.4:3.4;
 s+='<g><path transform="translate(47 67) scale(-1 1)" d="'+ep+'" fill="#fff"/><path transform="translate(73 67)" d="'+ep+'" fill="#fff"/><circle cx="'+(47+dx)+'" cy="67" r="'+ir+'" fill="#2a1a14"/><circle cx="'+(73+dx)+'" cy="67" r="'+ir+'" fill="#2a1a14"/>';
 s+='<path transform="translate(47 67) scale(-1 1)" d="'+ep+'" fill="none" stroke="#2a1a14" stroke-width="'+(M?1.4:1.8)+'"/><path transform="translate(73 67)" d="'+ep+'" fill="none" stroke="#2a1a14" stroke-width="'+(M?1.4:1.8)+'"/></g>';
 if(!M&&st>=1)s+='<path transform="translate(73 67)" d="M8 -1 L11 -4" stroke="#2a1a14" stroke-width="1.2"/><path transform="translate(47 67) scale(-1 1)" d="M8 -1 L11 -4" stroke="#2a1a14" stroke-width="1.2"/>';
 // 鼻口
 const np=['M-1 -6 Q-4 3 0 4 Q3 4 1 2','M0 -6 L-3 4 Q0 6 3 4','M0 -7 Q-2 2 -4 4 M0 -7 Q2 2 4 4','M-2 -2 Q-3 4 0 5 Q3 4 2 -2'][f[4]];
 s+='<path transform="translate(60 76)" d="'+np+'" fill="none" stroke="'+skD+'" stroke-width="1.8" stroke-linecap="round"/>';
 const lc=M?'#9a5a4c':'#b8434a';const mp=['M-6 0 Q0 4 6 0 Q0 1 -6 0Z','M-9 -1 Q0 7 9 -1','M-7 0 L7 0','M-7 1 Q0 3 8 -2','M-8 0 Q0 -4 8 0 Q0 7 -8 0Z'][f[5]];
 s+='<path transform="translate(60 90)" d="'+mp+'" fill="'+([0,4].includes(f[5])?lc:'none')+'" stroke="'+lc+'" stroke-width="1.8" stroke-linecap="round"/>';
 if(f[7]===1)s+='<circle cx="69" cy="87" r="1.2" fill="#3a2418"/>';if(f[7]===2)s+='<circle cx="78" cy="75" r="1.1" fill="#3a2418"/>';if(!M&&f[7]===3&&st>=1&&st<3)s+='<path d="M60 47 l2 3 l-2 3 l-2 -3z" fill="#c8262a"/>';
 if(st===3)s+='<path d="M44 48 Q60 44 76 48 M40 64 l-5 3 M80 64 l5 3 M50 82 Q48 90 52 96 M70 82 Q72 90 68 96" stroke="'+skD+'" stroke-width="1" fill="none"/>';
 if(M&&a>=24){const bc=hairC;const bs=f[7];if(bs===1||bs===3)s+='<path d="M48 83 Q60 78 72 83 Q60 86 48 83Z" fill="'+bc+'"/>';if(bs===2||bs===3)s+='<path d="M50 94 Q60 112 70 94 Q60 98 50 94Z" fill="'+bc+'"/>';if(bs===3)s+='<path d="M34 76 Q36 106 60 112 Q84 106 86 76 Q82 94 60 100 Q38 94 34 76Z" fill="'+bc+'"/>'}
 s+='</g>';
 // 頭飾
 s+='<g transform="rotate('+tilt+' 60 100)">';
 if(role==='emp'){s+='<path d="M42 28 L42 38 Q60 42 78 38 L78 28Z" fill="#1a1a1e"/><rect x="26" y="18" width="68" height="9" rx="2" fill="#15151a" stroke="#d4aa57" stroke-width="1.3"/>';for(let i=0;i<6;i++){s+='<circle cx="31" cy="'+(30+i*3.6)+'" r="1.6" fill="#f0d58b"/><circle cx="89" cy="'+(30+i*3.6)+'" r="1.6" fill="#f0d58b"/>'}}
 else if(role==='consort'||role==='dowager'){const g=role==='dowager'||p.rank>=5;s+='<circle cx="60" cy="'+(hs===3?10:22)+'" r="'+(g?5:3)+'" fill="#f0d58b"/><path d="M44 30 L38 22 M76 30 L82 22" stroke="#f0d58b" stroke-width="2"/><circle cx="38" cy="22" r="3" fill="#e0574d"/><circle cx="82" cy="22" r="3" fill="#6fd0c0"/>';if(g)s+='<path d="M36 38 Q60 26 84 38" fill="none" stroke="#f0d58b" stroke-width="3"/><circle cx="60" cy="31" r="3" fill="#e0574d"/>';if(role==='dowager')s+='<rect x="36" y="22" width="48" height="6" rx="2" fill="#f0d58b"/>'}
 else if(role==='official'){const o=offDef(p.off);const band=o&&o.r>=6?'#c8262a':'#d4aa57';s+='<path d="M36 36 Q60 12 84 36 L84 42 L36 42Z" fill="#17171c"/><rect x="14" y="31" width="26" height="5" rx="2" fill="#17171c"/><rect x="80" y="31" width="26" height="5" rx="2" fill="#17171c"/><rect x="36" y="38" width="48" height="3" fill="'+band+'"/>'}
 else if(role==='general'){s+='<path d="M34 42 Q60 14 86 42 L86 36 Q60 8 34 36Z" fill="#8a8a92"/><rect x="34" y="38" width="52" height="5" fill="#a31515"/><path d="M60 14 L60 2" stroke="#c8262a" stroke-width="4"/>'}
 else if(role==='eunuch')s+='<path d="M38 40 Q60 18 82 40Z" fill="#1a1a20"/><rect x="38" y="38" width="44" height="3" fill="#6b6b73"/>';
 else if(role==='prince'||role==='kin'&&M)s+='<rect x="51" y="14" width="18" height="10" rx="3" fill="#d4aa57"/><rect x="42" y="24" width="36" height="3" fill="#d4aa57"/>';
 else if(role==='princess'||role==='maiden'||role==='wife'){s+='<circle cx="82" cy="40" r="5" fill="#f08aa8"/><circle cx="82" cy="40" r="2" fill="#f0d58b"/><path d="M40 36 L34 28" stroke="#f0d58b" stroke-width="2"/>'}
 else if(role==='son')s+='<path d="M38 36 Q60 20 82 36 L82 40 L38 40Z" fill="#2a3a44"/>';
 if(st===0)s+='<path d="M60 20 L60 12" stroke="#c8262a" stroke-width="3"/>';
 s+='</g></svg>';return s}

/* ---------- 工具 ---------- */
function toast(msg,ok){const d=document.createElement('div');d.className='toast'+(ok===false?' no':'');d.textContent=msg;$('#toasts').appendChild(d);setTimeout(()=>d.remove(),5200)}
function res(r){if(!r)return;UI.last=r;toast(r.msg,r.ok);autosave();render()}
function modal(html){$('#md').innerHTML='<button class="x sm" data-act="close">✕</button>'+html;$('#ov').classList.add('on')}
function closeModal(){$('#ov').classList.remove('on');$('#md').classList.remove('wide');$('#md').innerHTML='';UI.pid=null;UI.ask=null}
function saveG(slot){try{if(slot==='auto'){const o=localStorage.getItem(SAVEKEY+'_auto');if(o){try{const q=JSON.parse(o);if(q&&q.t!==G.t&&(q.t%12===0||!localStorage.getItem(SAVEKEY+'_prev')||G.t-q.t>=1))localStorage.setItem(SAVEKEY+'_prev',o)}catch(e){}}}localStorage.setItem(SAVEKEY+'_'+slot,JSON.stringify(G));return true}catch(e){return false}}
function autosave(){if(G&&!G.over)saveG('auto')}
function loadSlot(slot){try{const t=localStorage.getItem(SAVEKEY+'_'+slot);if(!t)return false;const g=safeParse(t);if(!g)return false;G=g;return true}catch(e){return false}}
function hasSave(slot){try{return !!localStorage.getItem(SAVEKEY+'_'+slot)}catch(e){return false}}

/* ---------- 開場 ---------- */
const FOCUSD={lit:'詩文書畫，清流愛才',mil:'騎射兵法，將門敬重',pol:'吏治民政，理事老練',sch:'洞察人心，識破陰謀',biz:'錢糧賬目，國庫精算',med:'醫藥養生，龍體安康'};
const SCNL={a:'十七歲登基，太后與權臣把持朝政',b:'三十而立，朝堂與後宮皆已成形',c:'新朝初立，國庫空虛、將門功高'};
function startScreen(){document.body.classList.remove('ingame');document.documentElement.style.setProperty('--hero','url('+SPLASH_IMG+')');
 $('#top').style.display='none';ambience();
 if(!UI.splashDone){
  $('#app').innerHTML='<div class="splash" data-act="enter"><img class="sp-bg" alt="" src="'+SPLASH_IMG+'"><div class="sp-glow"></div><div class="sp-fx">'+Array.from({length:26},(_,i)=>'<i style="left:'+(Math.random()*100)+'%;animation-delay:'+(Math.random()*12).toFixed(1)+'s;animation-duration:'+(9+Math.random()*9).toFixed(1)+'s;opacity:'+(.45+Math.random()*.5).toFixed(2)+';transform:scale('+(.7+Math.random()*.9).toFixed(2)+')"></i>').join('')+'</div><div class="sp-shade"></div>'
   +'<div class="sp-title"><div class="sp-sub"><span>登基前夜</span></div><h1>皇帝模擬器</h1><div class="sp-line"><i></i></div><div class="sp-tag">天下為局　一人落子</div></div>'
   +'<div class="sp-cta"><button class="gold" data-act="enter">入　殿</button>'+(hasSave('auto')?'<button data-act="loadauto" class="ghost">繼續上次</button>':'')+'</div></div>';
  document.body.dataset.scn='';return}
 const S=UI.start;document.body.dataset.scn=S.scn;
 $('#app').innerHTML='<div class="start"><h1>擇　一　朝</h1><p class="dim intro">你將執掌的是一個不圍繞你運轉的王朝。朝臣會結黨、妃嬪會爭寵、皇子會奪嫡、邊疆會烽煙；你死後，史書自會評說。</p>'
 +'<div class="scns">'+Object.keys(SCN).map(k=>'<div class="scn '+(S.scn===k?'on':'')+'" data-act="scn" data-arg="'+k+'"><div class="art">'+artScn(k)+'<div class="cap"><b>'+SCN[k].n+'</b><span>'+SCNL[k]+'</span></div></div><div class="small dim body">'+SCN[k].d+'</div></div>').join('')+'</div>'
 +'<div class="card namecard"><div class="row" style="align-items:center"><label>朕名　<input id="nm" value="'+esc(S.name)+'" maxlength="4" size="6"></label></div>'
 +'<details class="cust"><summary>自訂劇本（進階）</summary>'+Object.keys(CUST).map(k=>'<div class="small dim" style="margin:6px 0 2px">'+({tre:'起始國庫',foe:'外邦強弱',fac:'朝堂派系'}[k])+'</div><div class="chips">'+CUST[k].map((n,i)=>'<button class="sm '+(((S.cust||{tre:1,foe:1,fac:1})[k])===i?'on gold':'')+'" data-act="cust" data-arg="'+k+'|'+i+'">'+n+'</button>').join('')+'</div>').join('')+'</details>'+'<div class="small dim" style="margin:8px 0 4px">難度</div><div class="focuses diffs">'+Object.keys(DIFF).map(k=>'<button class="'+((S.diff||'n')===k?'on':'')+'" data-act="diff" data-arg="'+k+'">'+DIFF[k].n+'<small>'+DIFF[k].d+'</small></button>').join('')+'</div>'+'<div class="small dim" style="margin:8px 0 4px">天賦所長（開局該項能力較高）</div><div class="focuses">'+Object.keys(STN).map(k=>'<button class="'+(S.focus===k?'on':'')+'" data-act="focus" data-arg="'+k+'">'+STN[k]+'<small>'+FOCUSD[k]+'</small></button>').join('')+'</div></div>'
 +'<div class="startcta"><button class="gold big" data-act="begin">登　基</button>'+(hasSave('auto')?'<button data-act="loadauto">繼續上次</button>':'')+(hasSave('prev')?'<button data-act="loadprev">還原上月<small>存檔出錯時用</small></button>':'')+'<button data-act="daily">每日一局<small>'+(metaGet().daily&&metaGet().daily[dailyKey()]?'今日已留名：'+metaGet().daily[dailyKey()].y+'年':'同一種子，與人比較')+'</small></button><button data-act="coll">典藏</button></div>'
 +'<p class="small dim" style="margin-top:20px">每月三旬（三份精力）：上朝、批奏摺、召見、教導皇嗣都要花費精力；用完後按「靜觀一月」。但不論你做不做，世界都會自己走。</p></div>'}

/* ---------- 四季氛圍 ---------- */
const SEAS=[['春','sp'],['夏','su'],['秋','au'],['冬','wi']];
function seasonOf(){const m=((G.t%12)+12)%12;return SEAS[Math.floor(m/3)]}
function ambience(){const a=$('#amb');if(!a)return;if(!G){a.innerHTML='';a.className='';document.body.classList.remove('war');return}
 const se=seasonOf()[1];const war=G.sit.some(s=>s.k==='war'||s.k==='revolt');const key=se+(war?'w':'');
 document.body.classList.toggle('war',war);if(UI.ambK===key&&a.firstChild)return;UI.ambK=key;a.className='s-'+se;
 a.innerHTML=Array.from({length:se==='wi'?20:14},()=>'<i style="left:'+(Math.random()*100).toFixed(1)+'%;animation-delay:-'+(Math.random()*14).toFixed(1)+'s;animation-duration:'+(10+Math.random()*10).toFixed(1)+'s;--s:'+(.6+Math.random()*.9).toFixed(2)+'"></i>').join('')}
/* ---------- 頂部與狀態 ---------- */
function topHtml(){const e=emp();
 return '<div class="brand"><svg viewBox="0 0 60 40" width="54" height="36"><path d="M2 22 Q30 6 58 22 L52 22 Q30 12 8 22Z" fill="#C9A24B"/><path d="M10 24h40v3H10zM14 27h32v10H14z" fill="#8d1f17" stroke="#E8D5A0" stroke-width="1"/><path d="M24 37V30h12v7" fill="#160E0A"/></svg><span>皇帝模擬器</span></div><div class="date"><span class="seas">'+seasonOf()[0]+'</span>'+dateStr()+'<small>'+esc(nm(e))+'（'+age(e)+'歲）· '+(LIFEN[G.life]||'勤政')+(G.zeit&&G.zeit.k&&G.zeit.k!=='plain'&&ZN[G.zeit.k]?' · <span class="warnc">'+ZN[G.zeit.k]+'</span>':'')+(G.regent?' · 攝政中':'')+(G.puppet?' · <span class="bad">傀儡</span>':'')+'</small></div>'
 +'<div class="ap">旬 '+[0,1,2].map(i=>'<span class="pip '+(i<G.ap?'on':'')+'"></span>').join('')+(G.ap===0?' 精力用盡':'')+'</div>'
 +topActs()}
function statsHtml(){const f=G.fin||{inc:0,exp:0};const net=f.inc-f.exp;
 const IK={tre:'coin',gra:'sack',mind:'people',auth:'crown',rep:'star',army:'flag',burden:'sys'};const chip=(l,v,b,k)=>'<div class="chip"'+(k?' data-act="why" data-arg="'+k+'" title="點擊查看成因"':'')+'><span class="ci">'+ico(IK[k]||'coin',22)+'</span><div class="cb"><span class="cl">'+l+'</span><b>'+v+'</b>'+(b||'')+'</div></div>';
 return chip('國庫',n0(G.tre)+'萬兩 <small class="'+(net>=0?'good':'bad')+'">'+(net>=0?'+':'')+n0(net)+'/月</small>',null,'tre')
 +chip('糧倉',n0(G.gra),null,'gra')+chip('民心',n0(G.mind),bar(G.mind,G.mind<35?'r':'g'),'mind')+chip('皇權',n0(G.auth),bar(G.auth,G.auth<30?'r':''),'auth')
 +chip('威望',n0(G.rep),bar(G.rep,'b'),'rep')+chip('軍力',n0(G.army)+'萬 <small>軍心'+n0(G.morale)+'</small>',bar(G.morale,G.morale<35?'r':'w'),'army')+chip('賦稅負擔',n0(G.burden),bar(G.burden,G.burden>60?'r':'w'),'burden')}
function digestHtml(){const d=UI.dig;if(!d)return '';return '<div class="card dig"><div class="row sp"><h3>這幾個月回顧（'+dateStr(d.from)+' → '+dateStr(d.to)+'）</h3><button class="sm" data-act="digx">收起</button></div>'+'<div class="dig1">'+(d.d.length?'一句話：'+d.d.slice().sort((x,y)=>Math.abs(y.v)/(y.k==='tre'||y.k==='pop'?50:3)-Math.abs(x.v)/(x.k==='tre'||x.k==='pop'?50:3)).slice(0,3).map(x=>x.n+(x.v>0?'+':'')+Math.round(x.v)).join('、')+(d.why&&d.why.length?'；主因：'+esc(String(typeof d.why[0]==='string'?d.why[0]:(d.why[0].t||d.why[0].txt||''))):'')+'。':'這幾個月，朝局平穩。')+'</div>'
 +(d.d.length?'<div class="row">'+d.d.map(x=>{const good=x.v*x.g>0;return '<span class="delta '+(good?'good':'bad')+'">'+x.n+' '+(x.v>0?'+':'')+Math.round(x.v)+'</span>'}).join('')+'</div>':'<div class="small dim">各項大致持平。</div>')
 +(d.why.length?'<div class="small" style="margin-top:5px"><b class="warnc">為何走低：</b>'+d.why.map(w=>esc(w.t)).join('；')+'</div>':'')
 +(d.lines.length?'<div class="small" style="margin-top:5px">'+d.lines.map(l=>'<div class="'+l.cls+'">· '+esc(l.txt)+'</div>').join('')+'</div>':'')+'</div>'}
function feelText(p){const g=p.mem.filter(m=>m.w<0).sort((a,b)=>a.w-b.w)[0],t=p.mem.filter(m=>m.w>0).sort((a,b)=>b.w-a.w)[0];return '對你「'+attLabel(p)+'」。'+(g?'心中記著：'+g.txt+'。':'')+(t?'也感念：'+t.txt+'。':'')+(!g&&!t?'與你並無特別的恩怨。':'')}
function edictHtml(){return '<div class="card"><h3>自擬詔令</h3><div class="small dim">以自己的話下詔（1旬）。群臣會依字句理解，例如：</div><div class="row" style="margin:5px 0">'+['減輕賦稅','開倉賑濟','整頓吏治','整軍練兵','特開恩科','興修水利','犒賞三軍','祭天祈福','節儉宮用','屯田墾荒','大赦天下'].map(t=>'<a class="sm" data-act="edex" data-arg="'+t+'">'+t+'</a>').join(' ')+'</div><div class="row"><input id="ed" placeholder="朕意欲……" maxlength="30" style="flex:1;min-width:160px"><button class="gold" data-act="edict">頒布詔令</button></div></div>'}

function arcsHtml(){const A=(G.arcs||[]).filter(a=>!a.done);if(!A.length)return '';
 return '<div class="card arcs"><h3>朝中故事</h3>'+A.map(a=>{const p=P(a.pid),q=a.pid2?P(a.pid2):null;const l=a.log[a.log.length-1];return '<div class="arc"><b>'+ARCT[a.k]+'</b>　'+lnk(p)+(q?'、'+lnk(q):'')+(a.wait?' <span class="badge">待你裁決</span>':'')+'<div class="small dim">'+(l?esc(l.txt):'')+'</div></div>'}).join('')+'</div>'}

/* ---------- 朝野人物圖 ---------- */
function hsh(s){let h=7;for(const c of String(s))h=(h*31+c.charCodeAt(0))|0;return Math.abs(h)}
function webData(){const e=emp();
 const dow=alivePs().filter(p=>p.role==='dowager').slice(0,2);
 const cons=consorts().sort((a,b)=>(b.rank-a.rank)||(b.fav-a.fav)).slice(0,7);
 const kids=alivePs().filter(p=>(p.role==='prince'||p.role==='princess')&&p.fa===e.id).sort((a,b)=>a.born-b.born).slice(0,7);
 const roy=[...dow,...cons,...kids];const rid=new Set(roy.map(p=>p.id));
 let off=alivePs().filter(p=>['official','general','eunuch'].includes(p.role)&&!p.exile&&p.id!==e.id&&!rid.has(p.id)).sort((a,b)=>weight(b)-weight(a)).slice(0,16);
 for(const f of ['chan','clean','army','eun','wai']){const L=facLeader(f);if(L&&!rid.has(L.id)&&!off.includes(L)&&L.role!=='consort'&&L.role!=='dowager')off.push(L)}
 const grp={};for(const p of off){const k=facOf(p);(grp[k]=grp[k]||[]).push(p)}
 return{e,roy,grp}}
function medallion(p,x,y,r,ring,gold){const id='cp'+p.id;let s=portrait(p,r*2);
 s=s.replace(/<svg xmlns="[^"]*" viewBox="0 0 120 150" width="[^"]*" height="[^"]*">/,'<svg x="'+(x-r+2)+'" y="'+(y-r+2)+'" width="'+(2*r-4)+'" height="'+(2*r-4)+'" viewBox="20 12 80 80" preserveAspectRatio="xMidYMid slice">');
 return '<clipPath id="'+id+'"><circle cx="'+x+'" cy="'+y+'" r="'+(r-2)+'"/></clipPath><circle cx="'+x+'" cy="'+y+'" r="'+(r+5)+'" fill="#F6F8F6" opacity=".85"/><circle cx="'+x+'" cy="'+y+'" r="'+(r-1)+'" fill="#26343F"/>'+s
  +'<circle cx="'+x+'" cy="'+y+'" r="'+(r-1)+'" fill="none" stroke="'+ring+'" stroke-width="3"/>'+(gold?'<circle cx="'+x+'" cy="'+y+'" r="'+(r+4)+'" fill="none" stroke="#8C6A1F" stroke-width="1"/>':'')}
function webSvg(pw){pw=pw||G.pow;const W=920,C=460;const {e,roy,grp}=webData();const L=UI.webL||(UI.webL={kin:1,rel:1,arc:1});
 const N={};const place=(p,x,y,r,ring,gold,sub)=>{N[p.id]={p,x,y,r,ring,gold,sub}};
 N[e.id]={p:e,x:C,y:C,r:38,ring:'#B3281F',gold:true,sub:'皇帝'};
 const n=roy.length;const two=n>9;
 roy.forEach((p,i)=>{const a=-Math.PI/2+(i+.5)/n*2*Math.PI;const rr=two?(i%2?218:152):168;const sub=p.role==='consort'?RK[p.rank]:p.role==='dowager'?(p.title||'太妃'):p.role==='prince'?(p.id===G.heir?'太子':'皇子'):'公主';
  place(p,C+Math.cos(a)*rr,C+Math.sin(a)*rr,23,p.role==='consort'?'#B8456B':p.role==='dowager'?'#6B4A8C':'#B3281F',true,sub)});
 const keys=Object.keys(grp);const wt=keys.map(k=>Math.max(grp[k].length,2));const tot=wt.reduce((a,b)=>a+b,0);const gap=.09;const avail=2*Math.PI-gap*keys.length;let a0=-Math.PI/2+.4;const clouds=[];
 keys.forEach((k,gi)=>{const span=avail*wt[gi]/tot;const ms=grp[k];const col=FAC[k].c;
  ms.forEach((p,i)=>{const a=a0+(i+.5)/ms.length*span;const rr=372+(i%2?26:-16);place(p,C+Math.cos(a)*rr,C+Math.sin(a)*rr,19,col,false,p.off?offName(p.off):roleLabel(p))});
  clouds.push({k,a:a0+span/2,span,col,m:ms.length});a0+=span+gap});
 let s='<svg viewBox="0 0 '+W+' '+W+'" xmlns="http://www.w3.org/2000/svg" font-family="LXGW WenKai TC,Kaiti TC,STKaiti,serif">';
 s+='<defs><radialGradient id="silk" cx="50%" cy="48%" r="75%"><stop offset="0" stop-color="#FBFCF9"/><stop offset=".7" stop-color="#EDF1EC"/><stop offset="1" stop-color="#DCE4E0"/></radialGradient>'
  +'<filter id="wash" x="-40%" y="-40%" width="180%" height="180%"><feTurbulence type="fractalNoise" baseFrequency=".011" numOctaves="3" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="70" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation="15"/></filter>'
  +'<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="9"/><feColorMatrix values="0 0 0 0 .1 0 0 0 0 .15 0 0 0 0 .2 0 0 0 .06 0"/></filter></defs>';
 s+='<rect width="'+W+'" height="'+W+'" fill="url(#silk)"/><rect width="'+W+'" height="'+W+'" filter="url(#grain)"/>';
 s+='<g fill="none" stroke="#8C6A1F" stroke-opacity=".28"><circle cx="'+C+'" cy="'+C+'" r="195" stroke-dasharray="2 7"/><circle cx="'+C+'" cy="'+C+'" r="372" stroke-dasharray="2 9"/></g>';
 s+='<g filter="url(#wash)">'+clouds.map(c=>{let g='';const cnt=3+Math.min(c.m,4);const sc=.5+(pw[c.k]||20)/45;for(let j=0;j<cnt;j++){const h=hsh(c.k+j);const a=c.a+((h%100)/100-.5)*c.span*.8;const rr=372+((h>>3)%60)-30;const r=(60+(h>>5)%50)*sc;g+='<circle cx="'+(C+Math.cos(a)*rr)+'" cy="'+(C+Math.sin(a)*rr)+'" r="'+r+'" fill="'+c.col+'" opacity=".25"/>'}return g}).join('')+'<circle cx="'+C+'" cy="'+C+'" r="150" fill="#B3281F" opacity=".07"/></g>';
 // 派系題字
 s+=clouds.map(c=>{const x=C+Math.cos(c.a)*300,y=C+Math.sin(c.a)*300;return '<text x="'+x+'" y="'+y+'" text-anchor="middle" dominant-baseline="middle" font-family="Ma Shan Zheng,LXGW WenKai TC,serif" font-size="36" fill="'+c.col+'" fill-opacity=".7" stroke="#F6F8F6" stroke-width="3" paint-order="stroke" stroke-opacity=".7">'+FAC[c.k].n+'</text><text x="'+x+'" y="'+(y+30)+'" text-anchor="middle" font-size="14" fill="#5E6B74" stroke="#F6F8F6" stroke-width="3" paint-order="stroke">勢力 '+Math.round(pw[c.k]||0)+'</text>'}).join('');
 // 連線
 const edges=[];const have=new Set();const ek=(a,b)=>a<b?a+'_'+b:b+'_'+a;
 const addE=(a,b,t,lab)=>{if(!N[a]||!N[b]||a===b)return;const k=ek(a,b)+t;if(have.has(k))return;have.add(k);edges.push({a,b,t,lab})};
 for(const id in N){const p=N[id].p;if(p.fa!=null)addE(p.fa,p.id,'blood');if(p.mo!=null)addE(p.mo,p.id,'blood');if(p.sp!=null)addE(p.id,p.sp,'spouse');if(p.role==='consort')addE(e.id,p.id,'spouse');if(p.tutor!=null)addE(p.tutor,p.id,'tutor')}
 const fam=new Set(edges.map(x=>ek(x.a,x.b)));const ids=Object.keys(N).map(Number);const rl=[];
 for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++){const A=N[ids[i]].p,B=N[ids[j]].p;if(A.id===e.id||B.id===e.id||fam.has(ek(A.id,B.id)))continue;const v=A.rel[B.id]!=null?A.rel[B.id]:B.rel[A.id];if(v==null)continue;if(v<=-38)rl.push({a:A.id,b:B.id,t:'grudge',v:-v});else if(v>=50)rl.push({a:A.id,b:B.id,t:'bond',v})}
 rl.sort((x,y)=>y.v-x.v).slice(0,12).forEach(x=>addE(x.a,x.b,x.t));
 for(const a of (G.arcs||[]).filter(a=>!a.done)){if(a.pid2&&N[a.pid]&&N[a.pid2])addE(a.pid,a.pid2,'arc',ARCT[a.k]);else if(N[a.pid])addE(e.id,a.pid,'arc',ARCT[a.k])}
 const ST={spouse:{c:'#B8456B',w:3.4,l:'kin'},blood:{c:'#B3281F',w:1.7,l:'kin'},tutor:{c:'#2E6B57',w:2,d:'2 6',l:'kin'},grudge:{c:'#1B2630',w:1.9,d:'8 6',l:'rel'},bond:{c:'#2E6B57',w:1.7,l:'rel'},arc:{c:'#8C6A1F',w:2.6,d:'11 6',l:'arc'}};
 let marks='';
 for(const ed of edges){const st=ST[ed.t];if(!L[st.l])continue;const A=N[ed.a],B=N[ed.b];const mx=(A.x+B.x)/2,my=(A.y+B.y)/2;let cx=mx+(C-mx)*.32,cy=my+(C-my)*.32;
  const dx=B.x-A.x,dy=B.y-A.y,len=Math.hypot(dx,dy)||1;const off=((ed.a+ed.b)%2?1:-1)*(A.p.id===e.id||B.p.id===e.id?26:14);cx+=-dy/len*off;cy+=dx/len*off;
  const d='M'+A.x.toFixed(1)+' '+A.y.toFixed(1)+' Q'+cx.toFixed(1)+' '+cy.toFixed(1)+' '+B.x.toFixed(1)+' '+B.y.toFixed(1);
  s+='<path d="'+d+'" fill="none" stroke="'+st.c+'" stroke-width="'+(st.w*3.2)+'" stroke-opacity=".10" stroke-linecap="round"/><path d="'+d+'" fill="none" stroke="'+st.c+'" stroke-width="'+st.w+'" stroke-opacity="'+(ed.t==='bond'?.55:.8)+'" stroke-linecap="round"'+(st.d?' stroke-dasharray="'+st.d+'"':'')+'/>';
  if(ed.t==='spouse'&&A.p.id!==e.id&&B.p.id!==e.id)s+='<path d="'+d+'" fill="none" stroke="#fff" stroke-width=".8" stroke-opacity=".7"/>';
  const px=.25*A.x+.5*cx+.25*B.x,py=.25*A.y+.5*cy+.25*B.y;
  if(ed.t==='grudge'||ed.t==='bond')marks+='<g><circle cx="'+px+'" cy="'+py+'" r="11" fill="'+(ed.t==='grudge'?'#1B2630':'#2E6B57')+'"/><text x="'+px+'" y="'+(py+.5)+'" text-anchor="middle" dominant-baseline="middle" font-size="13" fill="#F6F8F6">'+(ed.t==='grudge'?'怨':'誼')+'</text></g>';
  if(ed.t==='arc')marks+='<g><rect x="'+(px-30)+'" y="'+(py-11)+'" width="60" height="22" rx="2" fill="#F6F0DC" stroke="#8C6A1F"/><text x="'+px+'" y="'+(py+1)+'" text-anchor="middle" dominant-baseline="middle" font-size="12.5" fill="#6b4f12">'+esc(ed.lab)+'</text></g>'}
 s+=marks;
 // 中心花飾
 let pet='';for(let i=0;i<16;i++){pet+='<ellipse cx="'+C+'" cy="'+(C-62)+'" rx="7" ry="17" transform="rotate('+(i*22.5)+' '+C+' '+C+')" fill="#F6F0DC" stroke="#8C6A1F" stroke-width="1"/>'}
 s+='<g opacity=".95">'+pet+'</g>';
 // 人物
 for(const id in N){const o=N[id];const p=o.p;const isE=p.id===e.id;
  s+='<g data-act="person" data-arg="'+p.id+'" style="cursor:pointer">'+medallion(p,o.x,o.y,o.r,o.ring,o.gold)
   +'<text x="'+o.x+'" y="'+(o.y+o.r+(isE?42:17))+'" text-anchor="middle" font-size="'+(isE?17:15)+'" font-weight="700" fill="#1B2630" stroke="#F6F8F6" stroke-width="4" paint-order="stroke" stroke-linejoin="round">'+esc(nm(p))+'</text>'
   +'<text x="'+o.x+'" y="'+(o.y+o.r+(isE?57:32))+'" text-anchor="middle" font-size="11.5" fill="#5E6B74" stroke="#F6F8F6" stroke-width="3" paint-order="stroke" stroke-linejoin="round">'+esc(o.sub||'')+'</text></g>'}
 // 題字與印
 s+='<text x="44" y="70" font-family="Ma Shan Zheng,LXGW WenKai TC,serif" font-size="46" fill="#1B2630" style="writing-mode:vertical-rl;letter-spacing:.12em">朝野圖</text>'
  +'<text x="92" y="74" font-size="13" fill="#5E6B74" style="writing-mode:vertical-rl;letter-spacing:.1em">'+esc(dateStr())+'</text>'
  +'<g transform="rotate(-5 868 868)"><rect x="846" y="822" width="44" height="56" rx="3" fill="#B3281F"/><rect x="850" y="826" width="36" height="48" fill="none" stroke="#F6E9E4" stroke-width="1.2"/><text x="868" y="846" text-anchor="middle" font-family="Ma Shan Zheng,serif" font-size="22" fill="#FBEDE8">御</text><text x="868" y="868" text-anchor="middle" font-family="Ma Shan Zheng,serif" font-size="22" fill="#FBEDE8">覽</text></g>';
 // 邊框
 s+='<rect x="6" y="6" width="'+(W-12)+'" height="'+(W-12)+'" fill="none" stroke="#8C6A1F" stroke-width="1.2"/><rect x="14" y="14" width="'+(W-28)+'" height="'+(W-28)+'" fill="none" stroke="#8C6A1F" stroke-opacity=".45"/>';
 return s+'</svg>'}
function tabWeb(){const L=UI.webL||(UI.webL={kin:1,rel:1,arc:1});
 const tg=(k,t,c)=>'<button class="sm '+(L[k]?'pri':'')+'" data-act="webl" data-arg="'+k+'"><span class="lg" style="background:'+c+'"></span>'+t+'</button>';
 return '<h4 style="margin-top:6px">朝野人物圖</h4><div class="opts" style="margin:0 0 4px">'+tg('kin','血緣・姻親・師生','#B8456B')+tg('rel','恩怨・交情','#1B2630')+tg('arc','朝中故事','#8C6A1F')+'</div>'
  +'<div class="webwrap" id="webg">'+webSvg((webPts()[Math.min(UI.webI==null?99999:UI.webI,webPts().length-1)]||{pow:G.pow}).pow)+'</div>'+timelineHtml()+'<div class="small dim" style="margin-top:6px">點擊任何人物查看詳情。中央為皇帝；內圈是皇室，外圈依派系分區，水墨暈染為各派勢力範圍。紅線為血親，玫紅為夫妻，綠色虛線為師生；「怨」「誼」是人物間強烈的私人關係；金色虛線連著朝中故事的當事人。</div>'}


/* ---------- 勢力消長 ---------- */
const FACORD=['chan','army','wai','eun','kin','clean'];
function webPts(){const S=(G.snap||[]).slice();const last=S[S.length-1];if(!last||last.t!==G.t)S.push({t:G.t,pow:Object.assign({},G.pow),auth:Math.round(G.auth),mind:Math.round(G.mind),rep:Math.round(G.rep),tre:Math.round(G.tre),en:nm(emp()),era:G.era.n,live:1});return S}
function streamSvg(idx){const S=webPts();const W=920,H=250,L=34,R=58;const n=S.length;if(n<2)return '';
 const X=i=>L+(W-L-R)*i/(n-1);const T=S.map(p=>FACORD.reduce((a,k)=>a+(p.pow[k]||0),0));const mx=Math.max(...T)||1;const sc=(H-70)/mx;
 const low=FACORD.map(()=>[]),up=FACORD.map(()=>[]);
 S.forEach((p,i)=>{let y=H/2+8-T[i]*sc/2;FACORD.forEach((k,j)=>{low[j][i]=y;y+=(p.pow[k]||0)*sc;up[j][i]=y})});
 const sm=(arr)=>{let d='';for(let i=0;i<n;i++){if(i===0)d+='M'+X(0)+' '+arr[0].toFixed(1);else{const dx=(X(i)-X(i-1))/2;d+=' C'+(X(i-1)+dx).toFixed(1)+' '+arr[i-1].toFixed(1)+' '+(X(i)-dx).toFixed(1)+' '+arr[i].toFixed(1)+' '+X(i).toFixed(1)+' '+arr[i].toFixed(1)}}return d};
 const rev=(arr)=>{let d='';for(let i=n-1;i>=0;i--){if(i===n-1)d+=' L'+X(i)+' '+arr[i].toFixed(1);else{const dx=(X(i+1)-X(i))/2;d+=' C'+(X(i+1)-dx).toFixed(1)+' '+arr[i+1].toFixed(1)+' '+(X(i)+dx).toFixed(1)+' '+arr[i].toFixed(1)+' '+X(i).toFixed(1)+' '+arr[i].toFixed(1)}}return d};
 let s='<svg viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg" font-family="LXGW WenKai TC,Kaiti TC,STKaiti,serif"><defs><filter id="ink" x="-5%" y="-10%" width="110%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".012 .03" numOctaves="2" seed="2" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G"/><feGaussianBlur stdDeviation=".8"/></filter><linearGradient id="sg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#FBFCF9"/><stop offset="1" stop-color="#E3EAE6"/></linearGradient></defs><rect width="'+W+'" height="'+H+'" fill="url(#sg)"/>';
 s+='<g filter="url(#ink)">'+FACORD.map((k,j)=>'<path d="'+sm(low[j])+rev(up[j]).replace(/^/,'')+' Z" fill="'+FAC[k].c+'" fill-opacity=".72" stroke="#F6F8F6" stroke-width="1.2"/>').join('').replace(/ Z"/g,'Z"')+'</g>';
 // 換代標記
 S.forEach((p,i)=>{if(i>0&&p.en!==S[i-1].en){const x=X(i);s+='<line x1="'+x+'" x2="'+x+'" y1="26" y2="'+(H-14)+'" stroke="#8C6A1F" stroke-dasharray="3 4"/><rect x="'+(x-15)+'" y="6" width="30" height="20" rx="2" fill="#B3281F"/><text x="'+x+'" y="17" text-anchor="middle" dominant-baseline="middle" font-size="11" fill="#FBEDE8">'+esc(p.era.slice(0,2))+'</text>'}});
 // 年份刻度
 const step=Math.max(1,Math.ceil(n/9));S.forEach((p,i)=>{if(i%step===0||(i===n-1&&(n-1)%step>=step/2))s+='<text x="'+X(i)+'" y="'+(H-3)+'" text-anchor="middle" font-size="11" fill="#5E6B74">'+(p.live?'今':'第'+Math.max(1,Math.round((p.t-S[0].t)/12))+'年')+'</text>'});
 // 派系題字（末端）
 const ly=FACORD.map((k,j)=>({k,y:(low[j][n-1]+up[j][n-1])/2})).sort((a,b)=>a.y-b.y);for(let q=1;q<ly.length;q++)if(ly[q].y-ly[q-1].y<16)ly[q].y=ly[q-1].y+16;
 ly.forEach(({k,y})=>{s+='<text x="'+(W-R+6)+'" y="'+y+'" font-size="13" dominant-baseline="middle" fill="'+FAC[k].c+'" font-weight="700" stroke="#F6F8F6" stroke-width="3" paint-order="stroke">'+FAC[k].n.slice(0,2)+'</text>'});
 if(idx>=0){const cx=X(idx);s+='<line x1="'+cx+'" x2="'+cx+'" y1="30" y2="'+(H-16)+'" stroke="#B3281F" stroke-width="2"/><circle cx="'+cx+'" cy="30" r="5" fill="#B3281F"/>'}
 return s+'</svg>'}
function webReadout(idx){const S=webPts();const p=S[Math.min(idx,S.length-1)];if(!p)return '';const evs=G.chr.filter(c=>c.imp>=3&&c.t<=p.t&&c.t>p.t-12).slice(-4);
 const ord=FACORD.slice().sort((a,b)=>(p.pow[b]||0)-(p.pow[a]||0));
 return '<div class="row sp"><b class="gold">'+(p.live?'現在':'第'+Math.max(1,Math.floor((p.t-S[0].t)/12)+1)+'年')+'</b><span class="small dim">'+esc(p.en)+'・'+esc(p.era)+'</span></div>'
  +'<div class="small" style="margin:4px 0">皇權 <b>'+p.auth+'</b>　民心 <b>'+p.mind+'</b>　威望 <b>'+p.rep+'</b>　國庫 <b>'+p.tre+'</b></div>'
  +'<div class="row" style="gap:4px 6px">'+ord.map(k=>'<span class="fac" style="background:'+FAC[k].c+'">'+FAC[k].n+' '+Math.round(p.pow[k]||0)+'</span>').join('')+'</div>'
  +(evs.length?'<div class="small" style="margin-top:6px">'+evs.map(c=>'<div>· '+esc(c.txt)+'</div>').join('')+'</div>':'')}
function webUpdate(i){const S=webPts();i=Math.max(0,Math.min(S.length-1,+i));UI.webI=i;const g=$('#webg'),r=$('#webr'),st=$('#webs');if(!g)return;g.innerHTML=webSvg(S[i].pow);st.innerHTML=streamSvg(i);r.innerHTML=webReadout(i);const sl=$('#wsl');if(sl)sl.value=i}
function timelineHtml(){const S=webPts();if(S.length<2)return '<div class="card dim">至少經歷一年，才能回看勢力消長。</div>';const n=S.length;const i=UI.webI==null?n-1:Math.min(UI.webI,n-1);
 return '<div class="card"><div class="row sp"><h3>勢力消長</h3><button class="sm" data-act="webplay" id="wpb">'+(UI.webTimer?'■ 暫停':'▶ 回放')+'</button></div><div class="small dim">拖動下方滑桿，上面的人物圖會回到當年的勢力格局。紅色小印標出換代。</div>'
  +'<div class="stream" id="webs">'+streamSvg(i)+'</div><input type="range" id="wsl" min="0" max="'+(n-1)+'" value="'+i+'" step="1" style="width:100%"><div id="webr" style="margin-top:6px">'+webReadout(i)+'</div></div>'}


/* ---------- 人物一生時間軸 ---------- */
function evClass(t){if(/流放|禁足|賜死|冷宮|處死|誅|被廢|貶|罷|下獄|削爵|被殺|毒/.test(t))return['bad','#B3281F'];if(/婚|納|冊|嫁|選入|生下|誕|孕|晉|賜婚/.test(t))return['love','#B8456B'];if(/任|拜|升|遷|擢|出任|授|封|為官|及第|中舉|科/.test(t))return['off','#243F73'];if(/戰|征|平定|捷|敗|叛|兵|軍/.test(t))return['war','#A9650E'];return['misc','#5E6B74']}
function lifeTimeline(p){const born=p.born,end=p.alive?G.t:(p.dod!=null?p.dod:G.t);const span=Math.max(end-born,36);
 const W=900,H=230,L=40,R=40,Y=112;const X=t=>L+(W-L-R)*Math.max(0,Math.min(1,(t-born)/span));
 const ev=[{t:born,txt:'生於'+dateStr(born)+'。',cls:'misc',c:'#5E6B74',k:'生'}];
 for(const b of p.bio)ev.push(Object.assign({t:b.t,txt:b.txt,k:'事'},(c=>({cls:c[0],c:c[1]}))(evClass(b.txt))));
 if(!p.alive&&p.dod!=null)ev.push({t:p.dod,txt:'卒於'+dateStr(p.dod)+'，享年'+Math.floor((p.dod-born)/12)+'歲。',cls:'bad',c:'#1B2630',k:'終'});
 ev.sort((a,b)=>a.t-b.t);const mem=p.mem.slice().sort((a,b)=>a.t-b.t);
 UI.ltEv=ev.map(e=>({d:'時年'+Math.floor((e.t-born)/12)+'歲・'+dateStr(e.t),t:e.txt}));const base=ev.length;mem.forEach(m=>UI.ltEv.push({d:'時年'+Math.floor((m.t-born)/12)+'歲・'+dateStr(m.t),t:(m.w>=0?'感念：':'記恨：')+m.txt}));
 let s='<svg viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg" font-family="LXGW WenKai TC,Kaiti TC,STKaiti,serif"><defs><filter id="lw" x="-5%" y="-30%" width="110%" height="160%"><feGaussianBlur stdDeviation="9"/></filter><linearGradient id="lbg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#FBFCF9"/><stop offset="1" stop-color="#E9EEEA"/></linearGradient></defs><rect width="'+W+'" height="'+H+'" fill="url(#lbg)"/>';
 // 人生分段暈染
 const bands=[[0,12,'#6FA58A','孩童'],[12,18,'#7FA7D0','少年'],[18,50,'#D4AA57','壯年'],[50,120,'#9AA3A8','老年']];
 s+='<g filter="url(#lw)">'+bands.map(b=>{const x0=X(born+b[0]*12),x1=X(born+b[1]*12);return x1>x0?'<rect x="'+x0+'" y="30" width="'+(x1-x0)+'" height="'+(H-60)+'" fill="'+b[2]+'" opacity=".26"/>':''}).join('')+'</g>';
 s+=bands.map(b=>{const x0=X(born+b[0]*12),x1=X(born+b[1]*12);return x1-x0>34?'<text x="'+((x0+x1)/2)+'" y="24" text-anchor="middle" font-family="Ma Shan Zheng,serif" font-size="17" fill="#5E6B74" fill-opacity=".8">'+b[3]+'</text>':''}).join('');
 // 年歲刻度
 const maxA=Math.floor(span/12);for(let a=0;a<=maxA;a+=(maxA>60?20:10)){const x=X(born+a*12);s+='<line x1="'+x+'" x2="'+x+'" y1="'+(Y-5)+'" y2="'+(Y+5)+'" stroke="#1B2630" stroke-width="1.4"/><text x="'+x+'" y="'+(H-8)+'" text-anchor="middle" font-size="12" fill="#5E6B74">'+(a===0?'生':a+'歲')+'</text>'}
 // 主線（飛白筆觸）
 s+='<path d="M'+L+' '+Y+' Q'+(W/2)+' '+(Y-5)+' '+(W-R)+' '+Y+'" stroke="#1B2630" stroke-width="5" stroke-linecap="round" fill="none" opacity=".88"/><path d="M'+L+' '+(Y+1.5)+' Q'+(W/2)+' '+(Y-3)+' '+(W-R)+' '+(Y+1.5)+'" stroke="#F6F8F6" stroke-width="1" stroke-dasharray="9 23" fill="none" opacity=".55"/>';
 // 下：恩怨
 mem.forEach((m,i)=>{const x=X(m.t);const h=10+Math.min(46,Math.abs(m.w)*2.2);const col=m.w>=0?'#2E6B57':'#B3281F';s+='<g data-act="lt" data-arg="'+(base+i)+'" style="cursor:pointer"><path d="M'+x+' '+(Y+6)+' Q'+(x+3)+' '+(Y+6+h/2)+' '+x+' '+(Y+6+h)+'" stroke="'+col+'" stroke-width="3.4" stroke-linecap="round" fill="none" opacity=".8"/><circle cx="'+x+'" cy="'+(Y+6+h+3)+'" r="4.2" fill="'+col+'"/><rect x="'+(x-9)+'" y="'+(Y+4)+'" width="18" height="'+(h+18)+'" fill="transparent"/></g>'});
 // 上：事件
 const lv=[40,62,84];let lastX=-99,lvI=0;
 ev.forEach((e,i)=>{const x=X(e.t);lvI=(x-lastX<26)?(lvI+1)%3:0;lastX=x;const y=Y-lv[lvI];s+='<g data-act="lt" data-arg="'+i+'" style="cursor:pointer"><line x1="'+x+'" x2="'+x+'" y1="'+(Y-5)+'" y2="'+(y+6)+'" stroke="'+e.c+'" stroke-width="1.2" stroke-opacity=".7"/><circle cx="'+x+'" cy="'+y+'" r="8" fill="#F6F8F6" stroke="'+e.c+'" stroke-width="2.2"/><circle cx="'+x+'" cy="'+y+'" r="3.4" fill="'+e.c+'"/><circle cx="'+x+'" cy="'+y+'" r="14" fill="transparent"/></g>'});
 if(p.alive)s+='<circle cx="'+X(end)+'" cy="'+Y+'" r="7" fill="#B3281F" stroke="#F6F8F6" stroke-width="2"/><text x="'+X(end)+'" y="'+(Y+24)+'" text-anchor="middle" font-size="12" fill="#B3281F">今</text>';
 s+='<text x="'+(W-R)+'" y="'+(H-26)+'" text-anchor="end" font-size="11" fill="#5E6B74">上為事，下為情（綠：感念　紅：記恨）</text>';
 s+='<rect x="3" y="3" width="'+(W-6)+'" height="'+(H-6)+'" fill="none" stroke="#8C6A1F" stroke-opacity=".5"/>';
 const first=UI.ltEv[Math.max(0,ev.length-1)];
 return '<h4>一生時間軸</h4><div class="lifewrap">'+s+'</svg></div><div class="ltxt small" id="ltxt"><b>'+esc(first.d)+'</b>　'+esc(first.t)+'</div>'}


/* ---------- 備份 ---------- */
function b64e(u8){let s='';for(let i=0;i<u8.length;i+=0x8000)s+=String.fromCharCode.apply(null,u8.subarray(i,i+0x8000));return btoa(s)}
function b64d(b){const s=atob(b);const u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u}
async function packSave(){const enc=new TextEncoder().encode(JSON.stringify(G));if(window.CompressionStream){const st=new Blob([enc]).stream().pipeThrough(new CompressionStream('gzip'));return 'EMP1:'+b64e(new Uint8Array(await new Response(st).arrayBuffer()))}return 'EMP0:'+b64e(enc)}
async function unpackSave(txt){txt=(txt||'').trim();let json;if(txt.startsWith('EMP1:')){const st=new Blob([b64d(txt.slice(5))]).stream().pipeThrough(new DecompressionStream('gzip'));json=await new Response(st).text()}else if(txt.startsWith('EMP0:'))json=new TextDecoder().decode(b64d(txt.slice(5)));else json=txt;const g=migrate(JSON.parse(json));if(!g)throw new Error('bad');return g}
async function copyText(t){try{await navigator.clipboard.writeText(t);return true}catch(e){const ta=$('#exp');if(!ta)return false;ta.value=t;ta.focus();ta.select();try{return document.execCommand('copy')}catch(e2){return false}}}
function backupDue(){if(!G||G.over)return false;return G.bk==null?(G.t-G.emps[0].t0>=60):(G.t-G.bk>=120)}
function bkText(){if(G.bk==null)return '<span class="bad">尚未備份過</span>';const y=Math.floor((G.t-G.bk)/12);return y<1?'<span class="good">近期已備份</span>':'<span class="'+(y>=10?'bad':'warnc')+'">'+y+'年前備份</span>'}
function markBackup(){G.bk=G.t;autosave();const s=$('#bkst');if(s)s.innerHTML=bkText();const d=document.querySelector('.tabs .dot[data-sys]');if(d)d.remove()}
async function applyImport(txt){try{const g=await unpackSave(txt);G=g;UI.overShown=false;UI.empId=G.emp;ALERTS.length=0;toast('匯入成功。');render()}catch(e){toast('存檔碼或檔案無效，請確認完整複製。',false)}}


/* ---------- 本朝回顧 ---------- */
function sPath(xs,ys){let d='M'+xs[0].toFixed(1)+' '+ys[0].toFixed(1);for(let i=1;i<xs.length;i++){const dx=(xs[i]-xs[i-1])/2;d+=' C'+(xs[i-1]+dx).toFixed(1)+' '+ys[i-1].toFixed(1)+' '+(xs[i]-dx).toFixed(1)+' '+ys[i].toFixed(1)+' '+xs[i].toFixed(1)+' '+ys[i].toFixed(1)}return d}
function lineSvg(){const S=webPts();const n=S.length;if(n<2)return '';const W=920,H=230,L=40,R=64;const X=i=>L+(W-L-R)*i/(n-1),Y=v=>H-34-Math.max(0,Math.min(100,v))/100*(H-70);
 const ser=[['auth','皇權','#243F73'],['mind','民心','#2E6B57'],['rep','威望','#8C6A1F']];const xs=S.map((_,i)=>X(i));
 let s='<svg viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg" font-family="LXGW WenKai TC,Kaiti TC,STKaiti,serif"><rect width="'+W+'" height="'+H+'" fill="#FBFCF9"/>';
 [25,50,75].forEach(v=>{s+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+Y(v)+'" y2="'+Y(v)+'" stroke="#B7C3C1" stroke-dasharray="2 6"/><text x="'+(L-8)+'" y="'+(Y(v)+4)+'" text-anchor="end" font-size="11" fill="#5E6B74">'+v+'</text>'});
 S.forEach((p,i)=>{if(i>0&&p.en!==S[i-1].en){s+='<line x1="'+xs[i]+'" x2="'+xs[i]+'" y1="24" y2="'+(H-22)+'" stroke="#B3281F" stroke-dasharray="3 4" stroke-opacity=".7"/><rect x="'+(xs[i]-15)+'" y="4" width="30" height="19" rx="2" fill="#B3281F"/><text x="'+xs[i]+'" y="14" text-anchor="middle" dominant-baseline="middle" font-size="11" fill="#FBEDE8">'+esc(p.era.slice(0,2))+'</text>'}});
 ser.forEach(([k,nmx,c])=>{const ys=S.map(p=>Y(p[k]));const d=sPath(xs,ys);s+='<path d="'+d+'" fill="none" stroke="'+c+'" stroke-width="9" stroke-opacity=".12" stroke-linecap="round" stroke-linejoin="round"/><path d="'+d+'" fill="none" stroke="'+c+'" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><text x="'+(W-R+8)+'" y="'+(ys[n-1]+4)+'" font-size="13" font-weight="700" fill="'+c+'">'+nmx+'</text>'});
 const step=Math.max(1,Math.ceil(n/9));S.forEach((p,i)=>{if(i%step===0)s+='<text x="'+xs[i]+'" y="'+(H-8)+'" text-anchor="middle" font-size="11" fill="#5E6B74">第'+(Math.round((p.t-S[0].t)/12)+1)+'年</text>'});
 return s+'<rect x="2" y="2" width="'+(W-4)+'" height="'+(H-4)+'" fill="none" stroke="#8C6A1F" stroke-opacity=".5"/></svg>'}
function recapHtml(){const E=G.emps;const first=E[0];const yrs=Math.round(((G.over?(E[E.length-1].t1==null?G.t:E[E.length-1].t1):G.t)-first.t0)/12);
 const ks=x=>x.v?x.v.key:null;const best=E.find(x=>['sage','warrior','revive'].includes(ks(x)));const worst=E.find(x=>['tyrant','fool','puppet','fall'].includes(ks(x)));
 let epi='本朝歷'+E.length+'帝，凡'+yrs+'年。';
 if(best)epi+='其盛在'+nm(P(best.pid))+'之世，史稱「'+best.v.label+'」；';
 if(worst)epi+=(best?'':'')+'其衰始於'+nm(P(worst.pid))+'，史稱「'+worst.v.label+'」。';
 else if(!best)epi+='諸帝守成而已，無大功過。';
 epi+=G.over?G.over.txt.replace(/[。.]+$/,'')+'。':'國祚猶在，後人且看。';
 const L=G.chr.filter(c=>c.imp>=3);const pick_=L.length>18?L.filter((_,i)=>i%Math.ceil(L.length/18)===0):L;
 return '<div class="recap"><h2 class="rh">'+(G.over?'一朝興衰錄':'本朝回顧')+'</h2><div class="rs small dim">'+esc(E.map(x=>x.era).join('、'))+'　·　歷時'+yrs+'年</div>'
  +'<p class="epi">'+esc(epi)+'</p>'
  +'<h4>勢力消長</h4><div class="stream">'+(streamSvg(-1)||'<div class="small dim" style="padding:12px">歷時太短，尚無曲線。</div>')+'</div>'
  +'<h4>國勢起伏</h4><div class="stream">'+(lineSvg()||'<div class="small dim" style="padding:12px">歷時太短，尚無曲線。</div>')+'</div>'
  +'<h4>歷代帝王</h4><div class="grid2">'+E.map(x=>{const p=P(x.pid);const v=x.v;const y=Math.round(((x.t1==null?G.t:x.t1)-x.t0)/12);const off=v&&v.official&&v.official!==v.key&&TEMPLE[v.official]?'<div class="small warnc">官修史書稱其「'+TEMPLE[v.official][0]+'」，與實情不同。</div>':'';
   return '<div class="card" style="display:flex;gap:10px"><div class="port" style="width:64px;margin:0;flex:none">'+portrait(p,54)+'</div><div><b>'+esc(nm(p))+'</b> <span class="small dim">'+esc(x.era)+'・在位'+y+'年</span><div>'+(v?'「'+esc(v.label)+'」・'+esc(v.temple):(G.over?'末代之君':'尚在位'))+'</div>'+off+'<div class="small dim">'+esc(x.cause||'')+'</div></div></div>'}).join('')+'</div>'
  +'<h4>章回</h4><div class="card">'+E.map(x=>{const cs=(G.chaps||[]).filter(c=>c.emp===x.pid);return cs.length?'<div class="row" style="align-items:baseline"><b>'+esc(nm(P(x.pid)))+'</b><span class="small">'+cs.map(c=>'第'+cn(c.n)+'章 '+esc(c.title)).join(' → ')+'</span></div>':''}).join('')+'</div>'
  +'<h4>大事記</h4><div class="feed" style="max-height:none">'+pick_.map(c=>'<div class="big"><time>'+esc(dateStr(c.t))+'</time>'+esc(c.txt)+'</div>').join('')+'</div>'
  +'<div class="opts" style="margin-top:12px;justify-content:center"><button class="pri" data-act="close">合上史冊</button>'+(G.over?'<button data-act="restart">重新登基</button>':'')+'</div></div>'}
function collHtml(){const M=metaGet();const card=(got,seal,name,sub)=>'<div class="coll '+(got?'got':'')+'"><div class="cs">'+(got?esc(seal):'？')+'</div><b>'+(got?esc(name):'未得')+'</b><small>'+esc(sub)+'</small></div>';
 return '<div class="recap"><h2 class="rh">典　藏</h2><div class="rs small dim">已登基 '+M.games+' 次　·　收藏跨局保存在本機</div>'
  +'<h4>史稱廟號</h4><div class="colls">'+Object.keys(TEMPLE).map(k=>card(M.v[k],TEMPLE[k][0].slice(0,2),TEMPLE[k][0],M.v[k]?TEMPLE[k][1]+'　×'+M.v[k].n:'某位皇帝的蓋棺論定')).join('')+'</div>'
  +'<h4>王朝結局</h4><div class="colls">'+Object.keys(ENDN).map(k=>card(M.e[k],ENDN[k].slice(0,2),ENDN[k],M.e[k]?'×'+M.e[k].n:'一種收場')).join('')+'</div>'
  +'<h4>天命志向</h4><div class="colls">'+Object.keys(MAND).map(k=>card(M.m[k],MAND[k].n.slice(0,2),MAND[k].n,M.m[k]?'×'+M.m[k].n:MAND[k].d)).join('')+'</div>'
  +'<h4>成就</h4><div class="colls">'+Object.keys(ACH).map(k=>card(M.a[k],ACH[k].n.slice(0,2),ACH[k].n,ACH[k].d)).join('')+'</div>'
  +'<div class="opts" style="margin-top:12px;justify-content:center"><button class="pri" data-act="close">合上</button></div></div>'}
function openColl(){modal(collHtml());$('#md').classList.add('wide')}
function openRecap(){modal(recapHtml());$('#md').classList.add('wide')}

/* ---------- 廷議 ---------- */
function openDebate(){const d=UI.deb;if(!d)return;const e=emp();
 modal('<h3>廷議：'+esc(d.title)+'</h3><div class="small" style="margin-bottom:6px">'+esc(d.ctx)+'</div>'+d.opts.map((o,i)=>{const p=P(o.who);const tip=(e.st.sch>=55&&p.cor>55)?'<div class="small warnc">你覺得他言語間別有所圖。</div>':'';
  return '<div class="card deb"><div class="row" style="flex-wrap:nowrap;align-items:flex-start"><div class="port" style="width:62px;margin:0">'+portrait(p,52)+'</div><div style="flex:1"><div><b>'+esc(nmt(p))+'</b> '+(facOf(p)!=='none'?facTag(facOf(p)):'')+'<span class="small dim"> '+(p.off?offName(p.off):roleLabel(p))+'　對你：'+attLabel(p)+'</span></div><div class="say">「'+esc(o.say)+'」</div>'+tip+'</div></div><div class="opts"><button class="sm pri" data-act="deb" data-arg="'+i+'">從其議：'+esc(o.l)+'<small>'+esc(o.h)+'</small></button></div></div>'}).join('')
  +'<div class="opts"><button data-act="deb" data-arg="x">擱置，改日再議<small>各方略有不滿，皇權微降</small></button></div>')}
/* ---------- 詔書／戰報 ---------- */
function alertKind(t){if(/遭|災|饑|餓殍|旱|蝗/.test(t))return{h:'災　報',c:'dis'};if(/烽火|失守|大掠|民變|叛|割據|犯/.test(t))return{h:'軍　情',c:'war'};if(/平定|大捷|擊退|勝/.test(t))return{h:'捷　報',c:'win'};if(/攝政|親政|年滿|即位/.test(t))return{h:'詔　書',c:'edict'};return{h:'朝　報',c:'edict'}}
function showAlert(){if(!ALERTS.length||G.over)return false;sfx('bell');let note='';if(ALERTS.length>4){note='（另有'+(ALERTS.length-4)+'則較早的消息，已記入「近事」與史書。）';ALERTS.splice(0,ALERTS.length-4)}
 const a=ALERTS.shift();if(a.chap){const c=a.chap;modal('<div class="decree edict chapter"><div class="dd">'+esc(c.emp)+'　第'+cn(c.n)+'章</div><div class="dh big">'+esc(c.title)+'</div><div class="dt">'+esc(a.txt)+'</div>'+(c.prev?'<div class="small dim">上一章「'+esc(c.prev)+'」，歷'+c.yrs+'年。</div>':'')+'<div class="opts" style="justify-content:center"><button class="pri" data-act="close">'+(ALERTS.length?'繼續（尚有'+ALERTS.length+'則）':'翻過此頁')+'</button></div></div>');return true}
 if(a.mand){modal('<div class="decree win"><div class="dh">天命已成</div><div class="dd">'+esc(dateStr(a.t))+'</div><div class="dt">'+esc(a.txt)+'</div><div class="small dim">威望＋10、皇權＋5、民心＋3。</div><div class="opts" style="justify-content:center"><button class="pri" data-act="close">'+(ALERTS.length?'知道了（尚有'+ALERTS.length+'則）':'知道了')+'</button><button data-act="mandpick">另立新志</button></div></div>');return true}
 const k=alertKind(a.txt);
 modal('<div class="decree '+k.c+'"><div class="dh">'+k.h+'</div><div class="dd">'+dateStr(a.t)+'</div><div class="dt">'+esc(a.txt)+'</div>'+(note?'<div class="small dim">'+note+'</div>':'')+'<div class="opts" style="justify-content:center"><button class="pri" data-act="close">'+(ALERTS.length?'知道了（尚有'+ALERTS.length+'則）':'知道了')+'</button></div></div>');return true}
function mandHtml(){const m=G.mandate;if(!m||m.done)return '<div class="card mand"><div class="row sp"><h3>天命</h3><button class="sm gold" data-act="mandpick">立志</button></div><div class="small dim">'+(G.mdone&&G.mdone.length?'上一個志向已成。再立一志，給這一朝一個方向。':'為這一朝立下一個志向，達成時會被史官鄭重記上一筆。')+'</div></div>';
 const d=MAND[m.k];const p=mandProg();return '<div class="card mand"><div class="row sp"><h3>天命：'+d.n+'</h3><span class="small dim">'+Math.round(p*100)+'%</span></div><div class="small">'+d.d+'</div><div class="bar" style="margin-top:6px"><i style="width:'+Math.round(p*100)+'%"></i></div></div>'}
function mandModal(){const ks=UI.mpool=mandPool();modal('<h3>立下天命</h3><div class="small dim" style="margin-bottom:6px">選一個志向。完成時威望、皇權、民心皆有所得，並記入史書。</div>'+ks.map(k=>'<div class="card deb"><b>'+MAND[k].n+'</b><div class="small">'+MAND[k].d+'</div><div class="opts"><button class="sm pri" data-act="mandset" data-arg="'+k+'">立此志</button></div></div>').join('')+'<div class="opts"><button class="sm" data-act="close">暫不立志</button></div>')}
function guideHtml(){if(UI.noGuide||!G||G.over)return '';const e=emp();if(G.t-(G.emps[G.emps.length-1].t0||0)>=24)return '';
 const nS=G.sit.length,nM=G.memo.length,nI=G.intel.length;const it=(d,t)=>'<div class="gi '+(d?'done':'')+'">'+(d?'✔':'○')+' '+t+'</div>';
 const tip=nS?'先處理急報——它們不會等你。':nM?'奏摺不批會積壓，積壓過多，權臣會趁機代批。':G.ap>0?'還有精力：可以上朝、修養，或召見大臣、後宮與皇子。':'精力已用盡，按「靜觀一月」讓時間前進。';
 return '<div class="card guide"><div class="row sp"><h3>本月要務</h3><button class="sm" data-act="guidex">不再提示</button></div>'+it(!nS,'處理急報（'+nS+'）')+it(!nM,'批閱奏摺（'+nM+'）')+(nI?it(false,'查看密報（'+nI+'）'):'')+it(G.ap===0,'用完精力（尚餘'+G.ap+'旬）')+'<div class="small" style="margin-top:6px"><b class="warnc">提示：</b>'+tip+'</div></div>'}
/* ---------- 情勢卡 ---------- */
function sitCard(s){const r=s.reg?G.reg[s.reg]:null;let t='',b='',cls='alert';const O=sitOpts(s);
 if(s.k==='disaster'){t=r.n+'·'+s.kind+'（'+['','輕','重','極重'][s.sev]+'）';b='存糧 '+n0(r.food)+'　民怨 '+n0(r.un)+'　已持續'+s.age+'/'+s.dur+'月　'+(s.relief?'<span class="good">已施賑</span>':'<span class="bad">尚未賑濟</span>')}
 else if(s.k==='revolt'){t=r.n+'·'+s.name;cls='crit';b='叛軍勢力 '+n0(s.S)+'　我軍'+(s.force?n0(s.force)+'萬':'守軍')+'　統帥：'+(s.gen&&P(s.gen)?nmt(P(s.gen)):'地方守將')+'<div class="front"><i style="left:'+(50+s.front/2)+'%"></i></div><div class="small dim">←叛軍佔優　　官軍佔優→</div>'}
 else if(s.k==='war'){const f=G.foe[s.foe];t=f.n+'犯'+r.n+'邊境';cls='crit';b='敵軍約'+n0(s.E)+'萬　我軍'+(s.force?n0(s.force)+'萬':'守軍')+'　統帥：'+(s.gen&&P(s.gen)?nmt(P(s.gen)):defaultGen()?nmt(defaultGen())+'（默認）':'無')+(s.emp?' <span class="badge">御駕親征</span>':'')+'<div class="front"><i style="left:'+(50+s.front/2)+'%"></i></div><div class="small dim">←敵佔優　　我佔優→　已交戰'+s.age+'月</div>'}
 else if(s.k==='secession'){t=r.n+'割據';cls='crit';b='州牧'+lnk(P(s.gov))+'擁地自立，該州不再繳納賦稅。'}
 else if(s.k==='crisis'){t=FAC[s.f].n+'坐大';b='其勢力 '+n0(G.pow[s.f])+'，領袖：'+lnk(facLeader(s.f))+'。再不處置，皇權將被架空。'}
 else if(s.k==='case'){t='案件待斷';cls='alert';b=esc(s.txt)+'<br><span class="small dim">證據 '+n0(s.ev)+'｜嫌疑：'+s.sus.map(id=>lnk(P(id))).join('、')+'</span>'}
 else if(s.k==='illness'){t='龍體欠安';cls='alert';b='你染病在身（龍體'+n0(emp().hp)+'）。'}
 return '<div class="card '+cls+'"><h3>'+t+'</h3><div>'+b+'</div><div class="opts">'+O.map((o,i)=>'<button class="sm" data-act="sit" data-arg="'+s.id+'|'+i+'" title="'+esc(o.h||'')+'">'+esc(o.l)+(o.h?'<small>'+esc(o.h)+'</small>':'')+'</button>').join('')+'</div></div>'}
function memoTier(m){if(['warreq','bj','sky','dil','arc'].includes(m.k)||G.t-m.t>=3)return 0;if(/賀|慶典|宴|祭祀|規格|壽|節|獻瑞/.test(m.txt))return 2;return 1}
const TIERN=['急','常','閒'];
function memoCard(m,ix){const O=memoOpts(m);const f=m.from?P(m.from):null;const tr=memoTier(m);const many=G.memo.length>3;const open=!many||ix===0||(UI.mopen&&UI.mopen[m.id]);
 const bd=(m.k==='dil'?'<b class="badge">兩難</b> ':m.k==='sky'?'<b class="badge">'+(OMEN[m.x.o].n)+'</b> ':m.k==='emb'?'<b class="badge">使節</b> ':m.k==='xpol'?'<b class="badge">科舉</b> ':m.k==='bj'?'<b class="badge">邊將</b> ':m.k==='evt'?'<b class="badge">雜事</b> ':m.k==='echo'?'<b class="badge">舊事重提</b> ':'');
 if(!open)return '<div class="card memo t'+tr+' shut" data-act="mopen" data-arg="'+m.id+'"><div class="small dim"><b class="tier t'+tr+'">'+TIERN[tr]+'</b> '+bd+(f?esc(nmt(f)):'')+' · '+(G.t-m.t)+'月前呈上<span class="more">展開 ▾</span></div><div class="sum">'+esc(m.txt.length>40?m.txt.slice(0,40)+'…':m.txt)+'</div></div>';
 return '<div class="card memo t'+tr+(m.k==='dil'?' dil':'')+'"><div class="small dim"><b class="tier t'+tr+'">'+TIERN[tr]+'</b> '+(m.k==='dil'?'<b class="badge">兩難</b> ':m.k==='sky'?'<b class="badge">'+(OMEN[m.x.o].n)+'</b> ':m.k==='emb'?'<b class="badge">使節</b> ':m.k==='xpol'?'<b class="badge">科舉</b> ':m.k==='bj'?'<b class="badge">邊將</b> ':m.k==='evt'?'<b class="badge">雜事</b> ':m.k==='echo'?'<b class="badge">舊事重提</b> ':'')+(f?esc(nmt(f)):'')+' · '+(G.t-m.t)+'月前呈上</div><div>'+esc(m.txt)+'</div><div class="opts">'+O.map((o,i)=>'<button class="sm" data-act="memo" data-arg="'+m.id+'|'+i+'">'+esc(o.l)+(o.h?'<small>'+esc(o.h)+'</small>':'')+'</button>').join('')+'<button class="sm" data-act="leave" data-arg="'+m.id+'">留中</button></div></div>'}
function intelCard(it){const sus=P(it.sus);
 return '<div class="card alert"><div class="small dim">密報 · '+dateStr(it.t)+'</div><div>'+esc(it.txt)+'</div><div class="opts"><button class="sm" data-act="inv" data-arg="'+it.id+'">徹查<small>1旬</small></button>'
 +(sus&&sus.alive?(sus.role==='consort'?[['lock','禁足'],['death','賜死']]:sus.role==='prince'?[['lock','禁足'],['death','賜死']]:[['scold','申斥'],['exile','流放'],['death','處死']]).map(([lv,lb])=>'<button class="sm warn" data-act="direct" data-arg="'+it.id+'|'+lv+'">直接'+lb+'</button>').join(''):'')
 +'<button class="sm" data-act="dropi" data-arg="'+it.id+'">不予理會</button></div></div>'}

/* ---------- 分頁 ---------- */
function fw(k,t,b,d){if(!b)return'';const o=UI.fold&&UI.fold[k]!=null?UI.fold[k]:d;return '<div class="fold"><button class="foldh" data-act="fold" data-arg="'+k+'">'+(o?'▾':'▸')+' '+t+'</button>'+(o?b:'')+'</div>'}
function tabCourt(){let h='';const nIdle=G.memo.filter(m=>memoTier(m)===2).length;
 if(UI.last)h+='<div class="card '+(UI.last.ok?'good':'alert')+'"><div class="small dim">最近一次行動</div>'+esc(UI.last.msg).replace(/\n/g,'<br>')+'</div>';
 h+=guideHtml()+fw('mand','天命志向',mandHtml(),!G.mandate)+digestHtml()+fw('arcs','人物故事線',arcsHtml(),false);const urgent=G.sit.filter(s=>s.k!=='case');const cases=G.sit.filter(s=>s.k==='case');
 if(urgent.length||cases.length){h+='<h4>急報與要務</h4>'+urgent.map(sitCard).join('')+cases.map(sitCard).join('')}
 h+='<div class="row sp"><h4 style="flex:1">奏摺（'+G.memo.length+'）</h4><span class="small dim">每批閱三份耗一旬 · 今已批 '+G.mw+' 份'+(nIdle>=2?' <button class="sm" data-act="idleall">閒事'+nIdle+'件一併留中</button>':'')+(G.memo.length>8?' <span class="bad">積壓過多，權臣趁機代批</span>':'')+'</span></div>';
 const ms=G.memo.slice().sort((a,b)=>memoTier(a)-memoTier(b)||a.t-b.t);const PS=3,np=Math.max(1,Math.ceil(ms.length/PS));UI.mi=Math.min(Math.max(UI.mi||0,0),np-1);
 h+=ms.length?ms.slice(UI.mi*PS,UI.mi*PS+PS).map((m,i)=>memoCard(m,i)).join('')+(np>1?'<div class="row sp pager"><button class="sm" data-act="mpage" data-arg="-1"'+(UI.mi<=0?' disabled':'')+'>◀ 上一頁</button><span class="small dim">第 '+(UI.mi+1)+' / '+np+' 頁</span><button class="sm" data-act="mpage" data-arg="1"'+(UI.mi>=np-1?' disabled':'')+'>下一頁 ▶</button></div>':''):'<div class="card dim">案頭暫無奏摺。</div>';
 if(G.intel.length)h+='<h4>密報（'+G.intel.length+'）</h4>'+G.intel.slice(0,6).map(intelCard).join('');
 h+=fw('feed','近事（最近四十條）','<div class="card feed">'+G.log.slice(0,40).map(l=>'<div class="'+l.cls+'"><time>'+dateStr(l.t)+'</time>'+esc(l.txt)+'</div>').join('')+'</div>',false);return h}
function tabSelf(){const e=emp();
 let h='<div class="card"><div class="pm-top"><div class="port">'+portrait(e,150)+'</div><div class="pm-info"><h2>'+esc(nm(e))+' <small class="dim">'+age(e)+'歲 · '+G.era.n+'年號</small></h2><div class="small dim">龍體 '+n0(e.hp)+(e.ill?' <span class="bad">（染病）</span>':'')+'</div>'+bar(e.hp,e.hp<35?'r':'g')
 +'<div class="stg">'+Object.keys(STN).map(k=>'<div>'+STN[k]+' <b class="gold">'+n0(e.st[k])+'</b>'+bar(e.st[k],'')+'</div>').join('')+'</div>'+e.tr.map(t=>'<span class="tag">'+t+'</span>').join('')
 +'<div class="small dim" style="margin-top:6px">時代：<b class="warnc">'+(ZN[(G.zeit||{k:'plain'}).k]||'平世')+'</b>　朝會出席：'+n0(G.att)+'　畏懼度：'+n0(G.fear)+'　權謀影響你看穿人心的能力。</div></div></div></div>';
 h+='<h4>施政風格</h4><div class="grid2">'+Object.keys(LIFEN).map(k=>'<div class="card" style="'+(G.life===k?'border-color:var(--gold)':'')+'"><div class="row sp"><b>'+LIFEN[k]+'</b><button class="sm '+(G.life===k?'gold':'')+'" data-act="life" data-arg="'+k+'">'+(G.life===k?'當前':'採用')+'</button></div><div class="small dim">'+LIFED[k]+'</div></div>').join('')+'</div>';
 h+='<h4>朝務</h4><div class="opts"><button data-act="court">上朝聽政<small>1旬 · 鞏固皇權、增添奏摺</small></button><button data-act="recruit">下詔募兵<small>1旬 · 40萬兩 +6萬兵</small></button><button data-act="review">校場閱兵<small>1旬 · 10萬兩 士氣↑</small></button><button data-act="edit">潤飾實錄<small>1旬 · 影響後世評價</small></button><button data-act="sell">賣官鬻爵<small>1旬 · +80萬兩，吏治受損</small></button></div>';
 h+='<h4>修養（各耗1旬）</h4><div class="opts">'+Object.keys(STN).map(k=>'<button data-act="study" data-arg="'+k+'">'+({lit:'讀書習藝',mil:'練武騎射',pol:'研習政務',sch:'研讀權謀',biz:'鑽研理財',med:'研習醫術'}[k])+'<small>'+STN[k]+' '+n0(e.st[k])+'</small></button>').join('')+'</div>';
 h+='<h4>起居</h4><div class="opts"><button data-act="rest">靜養休息<small>1旬 · 龍體+8</small></button><button data-act="hunt">秋狩出獵<small>1旬 · 15萬兩</small></button><button data-act="banq" data-arg="0">設小宴<small>1旬 · 10萬兩</small></button><button data-act="banq" data-arg="1">大宴群臣<small>1旬 · 40萬兩</small></button><button data-act="tour">微服私訪<small>2旬 · 體察民情、尋訪人才</small></button></div>';
 return h}
function tabGov(){
 const seg=(key,names,cur,act)=>'<div class="seg">'+names.map((n,i)=>'<button class="'+(cur===i+1?'on':'')+'" data-act="'+act+'" data-arg="'+(i+1)+'">'+n+'</button>').join('')+'</div>';
 const f=G.fin||{inc:0,exp:0,leak:0,army:0,crt:0,sal:0};
 let h=heroHtml('朝　政','綜理百務・治國安邦')+edictScroll()+'<div class="card"><h3>財政</h3><div class="small">月入 <b class="good">'+n0(f.inc)+'</b> ／月出 <b class="bad">'+n0(f.exp)+'</b>（軍費'+n0(f.army||0)+'、宮廷'+n0(f.crt||0)+'、俸祿'+n0(f.sal||0)+'）；官吏貪墨約 <b class="warnc">'+n0(f.leak||0)+'</b>/月。</div></div>';
 h+='<div class="grid3"><div class="card"><b>賦稅</b><div class="small dim">重稅增收但積累民間負擔，傷及長遠</div>'+seg('tax',TAXN,G.tax,'tax')+'</div><div class="card"><b>軍費</b><div class="small dim">影響兵員規模與軍心</div>'+seg('mil',MILN,G.mil,'mil')+'</div><div class="card"><b>宮廷用度</b><div class="small dim">影響後宮情緒與花費</div>'+seg('crt',CRTN,G.crt,'crt')+'</div></div>';
 h+='<h4>派系格局</h4><div class="card">'+['chan','clean','army','wai','eun','kin'].map(k=>{const L=facLeader(k);return '<div class="row" style="margin:3px 0"><span style="width:64px">'+facTag(k)+'</span><div style="flex:1;min-width:120px">'+bar(G.pow[k],G.pow[k]>46?'r':'')+'</div><span style="width:34px;text-align:right">'+n0(G.pow[k])+'</span><span class="small dim" style="width:150px">'+(L?lnk(L):'—')+'</span></div>'}).join('')+'<div class="small dim">任一派系超過46，便可能挾持朝局。</div></div>';
 h+='<h4>機構</h4><div class="opts">'+Object.keys(INST).map(k=>'<button class="'+(G.inst[k]?'gold':'')+'" data-act="inst" data-arg="'+k+'">'+(G.inst[k]?'✔ ':'')+INST[k].n+'<small>'+(G.inst[k]?'點擊裁撤':INST[k].cost+'萬兩 · '+INST[k].d)+'</small></button>').join('')+'</div>';
 h+='<h4>官職任免</h4><div class="card"><table>'+allOffIds().map(o=>{const od=offDef(o),hd=holder(o);return '<tr><td>'+od.n+'</td><td>'+(hd?lnk(hd)+' <span class="small dim">'+STN[od.s]+n0(hd.st[od.s])+' '+facTag(hd.fac)+'</span>':'<span class="warnc">空缺</span>')+'</td><td style="white-space:nowrap"><button class="sm" data-act="appt" data-arg="'+o+'">任命</button>'+(hd?' <button class="sm warn" data-act="dism" data-arg="'+o+'">罷免</button>':'')+'</td></tr>'}).join('')+'</table></div>';
 if(G.proj.length)h+='<h4>在建工程</h4><div class="card">'+G.proj.map(p=>G.reg[p.reg].n+'·'+({canal:'水利',granary:'常平倉',road:'驛道',wall:'城防'}[p.k])+'（剩'+p.left+'月）').join('<br>')+'</div>';
 return h}
const MAPM={un:['民心','民怨高者色紅'],food:['糧儲','存糧少者色紅'],pr:['繁榮','繁榮度高者色深'],au:['自主','自主傾向高者色紅']};
function mapVal(r){const m=UI.mapMode||'un';return m==='un'?100-r.un:m==='food'?r.food:m==='pr'?r.pr:100-r.au}
function mapCol(r){if(r.sec)return'#8d8a86';const v=Math.max(0,Math.min(100,mapVal(r)));if((UI.mapMode||'un')==='pr')return'hsl(38,'+(30+v*.3)+'%,'+(70-v*.32)+'%)';return'hsl('+Math.round(v*1.15)+',42%,'+Math.round(56-(v>50?(v-50)*.14:0))+'%)'}
function blobPath(cx,cy,rad,seed){const n=9;const pts=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2,k=.78+.34*Math.abs(Math.sin(seed*7.1+i*2.3));pts.push([cx+Math.cos(a)*rad*k*1.12,cy+Math.sin(a)*rad*k*.9])}
 let d='M'+((pts[0][0]+pts[n-1][0])/2).toFixed(1)+' '+((pts[0][1]+pts[n-1][1])/2).toFixed(1);for(let i=0;i<n;i++){const p=pts[i],q=pts[(i+1)%n];d+=' Q'+p[0].toFixed(1)+' '+p[1].toFixed(1)+' '+((p[0]+q[0])/2).toFixed(1)+' '+((p[1]+q[1])/2).toFixed(1)}return d+'Z'}
function mtn(x,y,k){return '<path d="M'+(x-k)+' '+y+' L'+x+' '+(y-k*1.1)+' L'+(x+k)+' '+y+'" fill="none" stroke="#6b5a45" stroke-width=".4" stroke-linecap="round" stroke-linejoin="round" opacity=".75"/><path d="M'+x+' '+(y-k*1.1)+' L'+(x+k*.3)+' '+(y-k*.3)+'" stroke="#6b5a45" stroke-width=".25" opacity=".5"/>'}
function mapSvg(){const E=[['jing','zhong'],['jing','guan'],['jing','he'],['zhong','jiang'],['guan','long'],['guan','shu'],['shu','ling'],['jiang','ling'],['zhong','guan']];
 let s='<svg viewBox="0 -2 100 114"><defs><filter id="paper"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .36  0 0 0 0 .22  0 0 0 .13 0"/></filter><filter id="ink"><feTurbulence type="fractalNoise" baseFrequency=".07" numOctaves="2" seed="9" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.4"/></filter><radialGradient id="vig" cx="50%" cy="50%" r="75%"><stop offset="70%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#5a4328" stop-opacity=".35"/></radialGradient></defs>'
 +'<rect width="100" height="116" y="-4" fill="#EADFC4"/><rect width="100" height="116" y="-4" filter="url(#paper)"/>'
 +'<path d="M-2 30 C12 24 20 32 32 27 S52 30 64 24 S88 30 102 26" fill="none" stroke="#8fb0b8" stroke-width="1.1" opacity=".55" filter="url(#ink)"/>'
 +'<path d="M-2 66 C14 62 26 70 40 64 S66 68 78 62 S92 66 102 60" fill="none" stroke="#8fb0b8" stroke-width="1.4" opacity=".55" filter="url(#ink)"/>'
 +'<path d="M72 84 C80 86 90 80 102 84 L102 112 L60 112 C64 96 68 90 72 84Z" fill="#9dbfc6" opacity=".35"/><text x="86" y="100" font-size="3" fill="#5f8a94" text-anchor="middle" opacity=".8" font-family="var(--brush)">東　海</text>'
 +mtn(36,60,3)+mtn(41,58,2.4)+mtn(30,63,2.6)+mtn(44,62,2.2)+mtn(46,14,2.6)+mtn(52,12,2)+mtn(40,17,2.2)+mtn(18,52,2.4)+mtn(14,56,2)+mtn(48,80,2.4)+mtn(54,83,2)
 +'<text x="4" y="14" font-size="3.4" fill="#7a6650" font-family="var(--brush)" opacity=".7">大　荒</text><text x="46" y="31" font-size="2.4" fill="#5f8a94" opacity=".8" font-family="var(--brush)">黃河</text><text x="46" y="74" font-size="2.4" fill="#5f8a94" opacity=".8" font-family="var(--brush)">長江</text>';
 for(const[a,b]of E){const A=G.reg[a],B=G.reg[b];s+='<line x1="'+A.x+'" y1="'+A.y+'" x2="'+B.x+'" y2="'+B.y+'" stroke="#7b6446" stroke-width=".35" stroke-dasharray="1.2 1.2" opacity=".7"/>'}
 for(const f of Object.values(G.foe)){const rgn=Object.values(G.reg).find(r=>r.foe===f.k);const war=!!f.war;
  s+='<line x1="'+f.x+'" y1="'+f.y+'" x2="'+rgn.x+'" y2="'+rgn.y+'" stroke="'+(war?'#b3342d':f.ally?'#4f8a64':'#7b6446')+'" stroke-width="'+(war?.8:.4)+'" '+(war?'stroke-dasharray="2 1"':'stroke-dasharray=".8 1.2"')+'/>';
  s+='<g transform="translate('+f.x+' '+f.y+')"><path d="M0 -4.6 L4.2 3 L-4.2 3Z" fill="'+(f.vas?'#5f9a76':war?'#b3342d':'#8a7a62')+'" stroke="#4a3722" stroke-width=".35" stroke-linejoin="round" opacity=".92"/><path d="M0 -4.6 L0 -7.4 L3 -6.4 L0 -5.4" fill="#9B2D20"/><text y="8.6" text-anchor="middle" font-size="3.4" fill="#3b2c1c" font-family="var(--brush)">'+f.n+(f.vas?'（藩）':f.ally?'（盟）':'')+'</text><text y="12" text-anchor="middle" font-size="2.3" fill="#7a6a58">國力'+n0(f.str)+'</text></g>'}
 let sd=1;for(const r of Object.values(G.reg)){sd++;const rad=7+Math.sqrt(r.pop)/4.2;const sel=UI.sel===r.id;
  s+='<g data-act="reg" data-arg="'+r.id+'" style="cursor:pointer"><path d="'+blobPath(r.x,r.y,rad,sd)+'" fill="'+mapCol(r)+'" fill-opacity=".62" stroke="'+(sel?'#9B2D20':'#5a4328')+'" stroke-width="'+(sel?1.1:.45)+'" filter="url(#ink)"/>'
  +(r.rebel?'<path d="'+blobPath(r.x,r.y,rad+1.6,sd)+'" fill="none" stroke="#b3342d" stroke-width=".6" stroke-dasharray="1 1"/>':'')
  +(G.sit.some(z=>z.k==='disaster'&&z.reg===r.id)?'<text x="'+(r.x+rad*.7)+'" y="'+(r.y-rad*.6)+'" font-size="3.6" fill="#b3342d" font-family="var(--brush)">災</text>':'')
  +(G.sit.some(z=>z.k==='war'&&z.reg===r.id)?'<text x="'+(r.x-rad*.9)+'" y="'+(r.y-rad*.6)+'" font-size="3.6" fill="#b3342d" font-family="var(--brush)">戰</text>':'')
  +'<text x="'+r.x+'" y="'+(r.y+1.4)+'" text-anchor="middle" font-size="4.2" fill="#2b1d10" font-family="var(--brush)" style="pointer-events:none" paint-order="stroke" stroke="#EADFC4" stroke-width=".6">'+r.n+'</text>'
  +(r.id==='jing'?'<rect x="'+(r.x-1.5)+'" y="'+(r.y-rad+.2)+'" width="3" height="3" fill="#9B2D20" transform="rotate(-6 '+r.x+' '+(r.y-rad+1.7)+')"/><text x="'+r.x+'" y="'+(r.y-rad+2.5)+'" font-size="2" fill="#F4EFE0" text-anchor="middle" style="pointer-events:none">都</text>':'')+'</g>'}
 s+='<rect width="100" height="116" y="-4" fill="url(#vig)" style="pointer-events:none"/>';
 return s+'</svg>'}
function tabMap(){const r=G.reg[UI.sel]||G.reg.jing;const gov=holder('g_'+r.id);
 let h='<div class="opts mapmodes">'+Object.keys(MAPM).map(k=>'<button class="sm '+((UI.mapMode||'un')===k?'gold':'')+'" data-act="mapmode" data-arg="'+k+'">'+MAPM[k][0]+'</button>').join('')+'</div><div class="mapwrap">'+mapSvg()+'</div><div class="small dim" style="margin:4px 2px">圖例（'+MAPM[UI.mapMode||'un'][0]+'）：'+MAPM[UI.mapMode||'un'][1]+'；虛線紅圈＝民變；「災」「戰」為該州現況；點州名查看與施政。</div>';
 h+='<div class="card"><div class="row sp"><h3>'+r.n+' <small class="dim">'+TERN[r.ter]+(r.sec?' · <span class="bad">割據</span>':'')+(r.vas?' · 半獨立':'')+'</small></h3><span class="small">州牧：'+(gov?lnk(gov):'<span class="warnc">空缺</span>')+'</span></div>'
 +'<div class="grid3 small"><div>人口 <b>'+n0(r.pop)+'</b>萬</div><div>繁榮 <b>'+n0(r.pr)+'</b>'+bar(r.pr,'g')+'</div><div>存糧 <b>'+n0(r.food)+'</b>'+bar(r.food,r.food<35?'r':'w')+'</div><div>民怨 <b>'+n0(r.un)+'</b>'+bar(r.un,'r')+'</div><div>自主傾向 <b>'+n0(r.au)+'</b>'+bar(r.au,r.au>60?'r':'b')+'</div><div>駐軍 <b>'+n0(r.garr)+'</b>萬</div></div>'
 +'<div class="small" style="margin-top:4px">糧價 <b>'+pxOf(r)+'</b>錢/斗'+(r.ref>1?' · 流民約 <b>'+n0(r.ref*10)+'</b>千':'')+(r.foe&&r.mil!=null?' · 邊軍私兵 <b>'+n0(r.mil)+'</b>　忠誠 <b class="'+(r.loy<40?'bad':'')+'">'+n0(r.loy)+'</b>':'')+'</div><div class="opts"><button class="sm" data-act="ping" data-arg="'+r.id+'">平糶<small>耗糧40</small></button><button class="sm" data-act="jia" data-arg="'+r.id+'">加派<small>+45萬 民怨↑</small></button>'+(r.foe?'<button class="sm" data-act="bdr" data-arg="'+r.id+'|reward">犒軍<small>30萬</small></button><button class="sm" data-act="bdr" data-arg="'+r.id+'|cut">裁軍<small>私兵↓</small></button>':'')+'</div><div class="opts"><button class="sm" data-act="tour1" data-arg="'+r.id+'">微服私訪<small>2旬</small></button><button class="sm" data-act="relief" data-arg="'+r.id+'">開倉賑濟<small>耗糧60</small></button><button class="sm" data-act="exempt" data-arg="'+r.id+'">蠲免賦稅<small>一年</small></button>'
 +['canal','granary','road'].concat(r.foe?['wall']:[]).map(k=>'<button class="sm" data-act="proj" data-arg="'+k+'|'+r.id+'">'+({canal:'興修水利',granary:'建常平倉',road:'修驛道',wall:'修城防'}[k])+'<small>'+({canal:120,granary:70,road:80,wall:90}[k])+'萬</small></button>').join('')+'</div></div>';
 h+='<h4>四鄰邦交</h4>'+Object.values(G.foe).map(f=>'<div class="card"><div class="row sp"><b>'+f.n+(f.ruler?' <span class="small dim">'+esc(f.ruler)+'在位</span>':'')+'</b><span class="small">國力 '+n0(f.str)+' · 態度 '+n0(f.att)+(f.vas?' · <span class="good">藩屬</span>':'')+(f.trade?' · 通商':'')+(f.war?' · <span class="bad">交戰中</span>':'')+'</span></div>'
  +'<div class="opts"><button class="sm" data-act="dip" data-arg="'+f.k+'|gift">厚賜<small>30萬</small></button><button class="sm" data-act="dip" data-arg="'+f.k+'|trade">通商<small>20萬</small></button><button class="sm" data-act="dip" data-arg="'+f.k+'|tribute">收為藩屬<small>需其國力<50</small></button><button class="sm" data-act="dip" data-arg="'+f.k+'|spy">離間<small>1旬</small></button>'+(f.war?'<button class="sm" data-act="dip" data-arg="'+f.k+'|peace">議和<small>50萬</small></button>':'<button class="sm warn" data-act="dip" data-arg="'+f.k+'|declare">宣戰<small>1旬</small></button>')+'</div></div>').join('');
 return h}
function tabHarem(){const cs=consorts().sort((a,b)=>b.rank-a.rank||b.fav-a.fav);
 let h='<div class="row sp"><h3>後宮（'+cs.length+'）</h3><button class="gold" data-act="draft">選秀入宮<small> 2旬 · 30萬兩'+(G.selOK&&G.t-G.selOK<12?' · 已獲准':'')+'</small></button></div>';
 h+='<div class="card"><table><tr><th>位份</th><th>妃嬪</th><th>聖寵</th><th>情意</th><th>家族</th><th></th></tr>'+(cs.length?cs.map(c=>'<tr class="click" data-act="person" data-arg="'+c.id+'"><td>'+RK[c.rank]+'</td><td>'+esc(nm(c))+' <span class="small dim">'+age(c)+'歲</span>'+(c.preg?'<span class="badge">有孕</span>':'')+(c.ill?'<span class="badge">病</span>':'')+(c.lock>0?'<span class="badge">禁足</span>':'')+(c.kids.length?'<span class="badge">子女'+c.kids.filter(k=>P(k).alive).length+'</span>':'')+'</td><td style="min-width:70px">'+n0(c.fav)+bar(c.fav,'')+'</td><td class="small">'+attLabel(c)+'</td><td class="small">'+(c.clan!=null?G.clans[c.clan].s+'氏'+(G.clans[c.clan].wai?'（外戚）':''):'民間')+'</td><td class="dim small">›</td></tr>').join(''):'<tr><td colspan="6" class="dim">後宮空虛，請先選秀。</td></tr>')+'</table></div>';
 const dw=alivePs().filter(p=>p.role==='dowager');if(dw.length)h+='<h4>太后與太妃</h4><div class="card">'+dw.map(p=>lnk(p)+' <span class="small dim">'+age(p)+'歲 · '+attLabel(p)+'</span>').join('<br>')+'</div>';
 h+='<div class="small dim">點擊妃嬪查看立繪與互動。妃嬪的「情意」是你的觀察，未必是她的真心——權謀越高，看得越準。</div>';return h}
function famTree(p,d){if(d>3)return'';let h='<div style="margin-left:'+d*14+'px">'+(d?'└ ':'')+lnk(p)+' <span class="small dim">'+roleLabel(p)+' '+(p.alive?age(p)+'歲':'已故')+'</span></div>';
 const sp=p.sp!=null?P(p.sp):null;
 for(const k of p.kids){const c=P(k);if(c)h+=famTree(c,d+1)}return h}
function tabFamily(){const e=emp();const kids=myKids().sort((a,b)=>age(b)-age(a));const heir=G.heir?P(G.heir):null;
 let h='<div class="card"><h3>儲位</h3>'+(heir?lnk(heir)+' <span class="small dim">'+age(heir)+'歲 · 擁護者'+n0(supOf(heir))+'</span>':'<span class="warnc">國本未立。</span> <span class="small dim">儲位空懸，皇子們都在觀望與爭取。</span>')+'</div>';
 h+='<h4>皇子皇女（'+kids.length+'）</h4><div class="card"><table><tr><th>名</th><th>齡</th><th>階段</th><th>生母</th><th>專修／師傅</th><th>擁護</th></tr>'+(kids.length?kids.map(k=>'<tr class="click" data-act="person" data-arg="'+k.id+'"><td>'+esc(nmt(k))+(k.id===G.heir?'<span class="badge">太子</span>':'')+'</td><td>'+age(k)+'</td><td>'+STG[stage(k)]+'</td><td class="small">'+(k.mo!=null?esc(nm(P(k.mo))):'—')+'</td><td class="small">'+(k.pot?STN[k.focus||'lit']+(k.tutor&&P(k.tutor)?'／'+esc(nm(P(k.tutor))):''):'—')+'</td><td class="small">'+(k.role==='prince'?n0(supOf(k)):'—')+'</td></tr>').join(''):'<tr><td colspan="6" class="dim">尚無子嗣。</td></tr>')+'</table></div>';
 const kin=alivePs().filter(p=>(p.role==='prince'||p.role==='kin'||p.role==='princess')&&p.fa!==G.emp&&p.id!==G.emp&&p.title!=='先帝'&&age(p)>=14).sort((a,b)=>weight(b)-weight(a)).slice(0,14);
 h+='<h4>宗室</h4><div class="card"><table>'+kin.map(p=>'<tr class="click" data-act="person" data-arg="'+p.id+'"><td>'+esc(nmt(p))+'</td><td>'+age(p)+'歲</td><td class="small">'+roleLabel(p)+(p.fief?' · 封地'+G.reg[p.fief].n:'')+'</td><td class="small">'+attLabel(p)+'</td></tr>').join('')+'</table></div>';
 const root=e.fa!=null&&P(e.fa)?P(e.fa):e;h+='<h4>族譜</h4><div class="card small">'+famTree(root,0)+'</div>';return h}
function tabPeople(){const F=UI.fl;let ps=alivePs().filter(p=>p.id!==G.emp&&p.title!=='先帝');
 if(F.role!=='all')ps=ps.filter(p=>p.role===F.role);if(F.fac!=='all')ps=ps.filter(p=>facOf(p)===F.fac);if(F.q)ps=ps.filter(p=>nm(p).includes(F.q));
 ps.sort((a,b)=>weight(b)-weight(a)||b.st.pol-a.st.pol);const tot=ps.length;ps=ps.slice(0,70);
 let h='<div class="row"><select id="fr"><option value="all">全部身分</option>'+['official','general','eunuch','consort','dowager','prince','princess','kin','maiden','son','wife'].map(r=>'<option value="'+r+'"'+(F.role===r?' selected':'')+'>'+ROLEN[r]+'</option>').join('')+'</select><select id="ff"><option value="all">全部派系</option>'+Object.keys(FAC).filter(k=>k!=='none').map(k=>'<option value="'+k+'"'+(F.fac===k?' selected':'')+'>'+FAC[k].n+'</option>').join('')+'</select><input id="fq" placeholder="搜尋姓名" value="'+esc(F.q)+'" size="8"><span class="small dim">共 '+tot+' 人</span></div>';
 h+='<div class="card"><table><tr><th>姓名</th><th>身分／官職</th><th>齡</th><th>派系</th><th>態度</th><th>野心</th></tr>'+ps.map(p=>'<tr class="click" data-act="person" data-arg="'+p.id+'"><td>'+esc(nmt(p))+'</td><td class="small">'+roleLabel(p)+(p.off?' · '+offName(p.off):'')+(p.exile?' · 流放':'')+'</td><td>'+age(p)+'</td><td>'+(facOf(p)!=='none'?facTag(facOf(p)):'')+'</td><td class="small">'+attLabel(p)+'</td><td class="small">'+ambLabel(p)+'</td></tr>').join('')+'</table></div>';return h}
function tabHist(){let h='<div class="row sp"><h3>歷代帝王</h3><span><button class="sm" data-act="coll">典藏</button> <button class="sm gold" data-act="recap">本朝回顧</button></span></div><div class="card"><table><tr><th>帝</th><th>年號</th><th>在位</th><th>廟號</th><th>評價</th></tr>'+G.emps.map(x=>{const p=P(x.pid);const v=x.v;const yrs=Math.round(((x.t1==null?G.t:x.t1)-x.t0)/12);
  return '<tr class="click" data-act="person" data-arg="'+p.id+'"><td>'+esc(nm(p))+'</td><td>'+x.era+'</td><td>'+yrs+'年</td><td>'+(v?v.temple:'在位')+'</td><td class="small">'+(v?'<b>'+v.label+'</b>'+(v.official!==v.key?'<br><span class="warnc">官修史書：'+TEMPLE[v.official][0]+(v.edited?'（曲筆）':v.hostile?'（史官懷怨）':'')+'</span>':'')+(v.revised?'<br><span class="good">後世翻案</span>':'')+'<br><span class="dim">民心'+v.mm+' 皇權'+v.am+' 勝'+v.wins+'負'+v.losses+' 誅'+v.exec+'</span>':'<span class="dim">待後世評說</span>')+'</td></tr>'}).join('')+'</table></div>';
 h+='<h3>歷代本紀</h3>'+G.emps.map(x=>{const b=benji(x);return '<details class="card"><summary>'+esc(b.head)+'</summary><button class="sm gold" data-act="bjread" data-arg="'+G.emps.indexOf(x)+'">以史筆讀之</button>'+(b.events.length?b.events.slice(-60).map(e=>'<div class="small"><span class="dim">'+e.y+'</span> '+esc(e.txt)+'</div>').join(''):'<div class="dim small">暫無大事可記。</div>')+'</details>'}).join('')+'<div class="row sp"><h3>王朝編年史</h3><label class="small"><input type="checkbox" id="ca" '+(UI.all?'checked':'')+'> 含次要記事</label></div><div class="card feed" style="max-height:none">';
 const list=G.chr.filter(c=>UI.all||c.imp>=3||c.imp===2).slice().reverse().slice(0,UI.all?400:220);let last='';
 for(const c of list){const y=dateStr(c.t).replace(/\d+月$/,'');if(y!==last){h+='<h4>'+y+'</h4>';last=y}h+='<div class="'+(c.imp>=3?'big':'')+'"><time>'+(c.t%12+1)+'月</time>'+esc(c.txt)+'</div>'}
 return h+'</div>'}
function tabSys(){return settingsHtml()+'<div class="card"><h3>輔助</h3><button data-act="guideon">重新顯示「本月要務」</button></div>'+'<div class="card"><h3>存檔</h3><div class="opts"><button data-act="save" data-arg="1">存入檔位一'+(hasSave(1)?'（有）':'')+'</button><button data-act="save" data-arg="2">存入檔位二'+(hasSave(2)?'（有）':'')+'</button><button data-act="load" data-arg="1">讀取檔位一</button><button data-act="load" data-arg="2">讀取檔位二</button><button data-act="load" data-arg="auto">讀取自動存檔</button></div><div class="small dim">每次行動後自動存檔。存檔存在本機瀏覽器；換裝置請用下方匯出／匯入。</div></div>'
 +(hasSave('prev')?'<div class="card"><h3>還原上月</h3><div class="small">每個月會自動留一份上個月的存檔。若此局出了狀況，可退回一個月。</div><div class="opts"><button class="warn" data-act="loadprev">退回上一個月</button></div></div>':'')+'<div class="card"><h3>備份到瀏覽器之外</h3><div class="small">狀態：<span id="bkst">'+bkText()+'</span>。存檔只存在這個瀏覽器；清除瀏覽資料或換裝置就會消失。建議每隔幾年備份一次。</div><div class="opts"><button class="pri" data-act="copycode">複製存檔碼<small>貼到備忘錄或傳給自己</small></button><button data-act="dlsave">下載存檔檔案<small>.txt 檔</small></button>'+(navigator.share?'<button data-act="sharesave">傳給自己<small>用系統分享</small></button>':'')+'</div></div><div class="card"><h3>還原存檔</h3><textarea id="exp" placeholder="把存檔碼貼在這裡（EMP1: 開頭）"></textarea><div class="opts"><button data-act="import">匯入貼上的存檔碼</button><label class="filebtn">從檔案匯入<input type="file" id="imf" accept=".txt,.json,text/plain,application/json" hidden></label></div></div>'
 +'<div class="card"><h3>重新開始</h3><button class="warn" data-act="restart">放棄此局，重新登基</button></div>'}

const TABS=[['court','朝堂'],['self','起居'],['gov','朝政'],['map','疆域'],['harem','後宮'],['family','皇族'],['people','人物'],['web','關係'],['hist','史書'],['sys','存檔']];
function render(){if(!G){startScreen();return}
 document.body.dataset.scn='';ambience();
 $('#top').style.display='';$('#top').innerHTML=topHtml();
 const dots={court:G.memo.length+G.sit.length+G.intel.length,sys:backupDue()?'!':0};
 const fn={court:tabCourt,self:tabSelf,gov:tabGov,map:tabMap,harem:tabHarem,family:tabFamily,people:tabPeople,web:tabWeb,hist:tabHist,sys:tabSys}[TAB];
 const y=window.scrollY;
 document.body.classList.add('ingame');if(!$('#scene')){const sc=document.createElement('div');sc.id='scene';sc.innerHTML=sceneSvg();document.body.prepend(sc)}
 $('#app').innerHTML='<div id="stats">'+statsHtml()+'</div><div id="shell"><div class="tabs">'+navHtml(dots)+'</div><div id="pane">'+fn()+'</div>'+(TAB==='court'||TAB==='gov'?'<aside id="side">'+sideHtml(TAB)+'</aside>':'')+'</div><div id="qb">'+qbHtml()+'</div>';
 window.scrollTo(0,y);
 if(TAB==='web'){const w=$('.webwrap');if(w&&!UI.webScrolled){w.scrollLeft=(w.scrollWidth-w.clientWidth)/2;UI.webScrolled=1}}
 if(UI.empId==null)UI.empId=G.emp;
 if(G.over){if(!UI.overShown){UI.overShown=true;endModal()}}
 else if(UI.empId!==G.emp){UI.empId=G.emp;succModal()}
 else if(ALERTS.length&&!$('#ov').classList.contains('on')){showAlert()}
 else if(!$('#ov').classList.contains('on')&&!metaGet().tut&&G.t-G.emps[0].t0>=1&&!G.over){tutModal(0)}
 else if(UI.pid!=null&&$('#ov').classList.contains('on'))personModal(P(UI.pid),true)}

/* ---------- 人物視窗 ---------- */
function personModal(p,keep){if(!p)return;UI.pid=p.id;const e=emp();const acts=p.id===G.emp||!p.alive?[]:personActions(p);
 const rel=(l,id)=>id!=null&&P(id)?l+'：'+lnk(P(id))+'　':'';
 let h='<div class="pm-top"><div class="port">'+portrait(p,150)+'</div><div class="pm-info"><h2>'+esc(nmt(p))+(p.alive?'':' <small class="dim">（已故）</small>')+'</h2>'
 +'<div class="small dim">'+roleLabel(p)+(p.off?' · '+offName(p.off):'')+' · '+age(p)+'歲（'+STG[stage(p)]+'）'+(p.clan!=null?' · '+G.clans[p.clan].s+'氏':'')+' '+(facOf(p)!=='none'?facTag(facOf(p)):'')+'</div>'
 +(p.alive?'<div class="small">健康 '+n0(p.hp)+(p.ill?' <span class="bad">染病</span>':'')+(p.preg?' <span class="badge">有孕</span>':'')+(p.lock>0?' <span class="badge">禁足</span>':'')+(p.exile?' <span class="badge">流放</span>':'')+'</div>':'')
 +'<div class="stg">'+Object.keys(STN).map(k=>'<div>'+STN[k]+' <b class="gold">'+n0(p.st[k])+'</b></div>').join('')+'</div>'+p.tr.map(t=>'<span class="tag">'+t+'</span>').join('')
 +(p.alive&&p.id!==G.emp?'<div class="small" style="margin-top:6px">對你：<b>'+attLabel(p)+'</b>　野心：<b>'+ambLabel(p)+'</b>'+(p.off||p.role==='official'||p.role==='general'?'　操守：<b>'+corLabel(p)+'</b>':'')+(p.role==='consort'?'　聖寵：<b>'+n0(p.fav)+'</b>':'')+((p.watch>0||emp().st.sch>=60)&&p.goal?'　志向：<b>'+GOALN[p.goal]+'</b>':'')+'</div>':'')
 +(p.watch>0?(()=>{const pl=G.plots.filter(x=>x.a===p.id&&x.k!=='regain');return '<div class="small warnc">密探回報：'+(pl.length?pl.map(x=>({corrupt:'正在貪墨',slander:'正暗中構陷'+(x.tg!=null?nm(P(x.tg)):'他人'),poison:'似有毒害之意',coup:'暗中串聯兵將',rebel:'私蓄兵甲',secede:'圖謀割據'}[x.k])).join('；'):'暫無異動')+'</div>'})():'')
 +'<div class="small" style="margin-top:6px">'+rel('父',p.fa)+rel('母',p.mo)+rel('配偶',p.sp)+(p.kids.length?'子女：'+p.kids.map(k=>lnk(P(k))).join('、'):'')+'</div></div></div>';
 if(acts.length)h+='<h4>可做之事</h4><div class="opts">'+acts.map((a,i)=>'<button class="sm" data-act="pact" data-arg="'+i+'">'+esc(a.l)+(a.h?'<small>'+esc(a.h)+'</small>':'')+'</button>').join('')+'</div>';
 const myarcs=(G.arcs||[]).filter(a=>a.pid===p.id||a.pid2===p.id);
 if(myarcs.length)h+='<h4>故事線</h4>'+myarcs.map(a=>'<div class="mem"><b>'+ARCT[a.k]+'</b>'+(a.done?' <span class="dim">（已了結）</span>':'')+a.log.map(l=>'<div><span class="dim">'+dateStr(l.t)+'</span> '+esc(l.txt)+'</div>').join('')+'</div>').join('');
 if(p.alive&&p.id!==G.emp)h+='<h4>其心意</h4><div class="small" style="line-height:1.7">'+esc(feelText(p))+'</div>';
 if(p.mem.length)h+='<h4>其所記憶</h4>'+p.mem.slice(0,8).map(m=>'<div class="mem"><span class="dim">'+dateStr(m.t)+'</span> <span class="w '+(m.w>=0?'good':'bad')+'">'+(m.w>=0?'＋':'－')+'</span> '+esc(m.txt)+'</div>').join('');
 h+=lifeTimeline(p);
 h+='<h4>傳記</h4><div class="small" style="line-height:1.8">'+esc(lifeStory(p))+'</div>';
 h+='<h4>生平記事</h4>'+(p.bio.length?p.bio.slice().reverse().slice(0,14).map(b=>'<div class="mem"><span class="dim">'+dateStr(b.t)+'</span> '+esc(b.txt)+'</div>').join(''):'<div class="dim small">尚無記載。</div>');
 modal(h)}
function askModal(o,fn){UI.ask=fn;modal('<h3>'+esc(o.title)+'</h3><div class="list">'+(o.items.length?o.items.map(it=>'<div class="it" data-act="askpick" data-arg="'+esc(it.id)+'">'+esc(it.label)+(it.sub?'<small>'+esc(it.sub)+'</small>':'')+'</div>').join(''):'<div class="dim">（沒有合適人選）</div>')+'</div>')}
function cardSvg(){const E=G.emps,last=E[E.length-1],v=last.v||{label:'—',temple:''};const yrs=Math.round((G.t-E[0].t0)/12);const F="'LXGW WenKai TC','Noto Serif TC','Songti TC',serif";
 const endT={fall:'義軍破京，社稷傾覆',usurp:'權臣篡位，改朝換代',extinct:'宗室凋零，國祚斷絕'}[G.over?G.over.type:'fall']||'';
 const rows=E.slice(-7).map((x,i)=>{const p=P(x.pid),y=560+i*62,yy=Math.round(((x.t1==null?G.t:x.t1)-x.t0)/12);return '<text x="120" y="'+y+'" font-size="30" fill="#2B2A26">'+esc(nm(p))+'</text><text x="330" y="'+y+'" font-size="24" fill="#6B6A63">'+esc(x.era||'')+'　在位'+yy+'年</text><text x="680" y="'+y+'" font-size="26" fill="#9B2D20" text-anchor="end">'+esc(x.v?x.v.label:'在位')+'</text><line x1="110" y1="'+(y+20)+'" x2="690" y2="'+(y+20)+'" stroke="#D8D2C0"/>'}).join('');
 const es=esc(G.era.n).split('');const vt=(x,t,sz,fill)=>t.split('').map((c,i)=>'<text x="'+x+'" y="'+(130+i*(sz+10))+'" font-size="'+sz+'" fill="'+fill+'" text-anchor="middle">'+c+'</text>').join('');
 return '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1100" viewBox="0 0 800 1100" font-family="'+F+'"><rect width="800" height="1100" fill="#F4EFE0"/><rect x="30" y="30" width="740" height="1040" fill="none" stroke="#B8924A" stroke-width="3"/><rect x="42" y="42" width="716" height="1016" fill="none" stroke="#B8924A" stroke-width="1"/>'
 +vt(704,'本紀',40,'#9B2D20')+'<text x="400" y="150" font-size="70" fill="#2B2A26" text-anchor="middle" letter-spacing="14">'+esc(G.era.n)+'</text><text x="400" y="215" font-size="26" fill="#6B6A63" text-anchor="middle">歷 '+E.length+' 帝　·　凡 '+yrs+' 年</text>'
 +'<line x1="120" y1="260" x2="680" y2="260" stroke="#B8924A"/><text x="400" y="340" font-size="34" fill="#2B2A26" text-anchor="middle">末代之君　'+esc(nm(P(last.pid)))+'</text><text x="400" y="400" font-size="26" fill="#6B6A63" text-anchor="middle">'+esc(endT)+'</text>'
 +'<g transform="translate(400 470) rotate(-4)"><rect x="-70" y="-50" width="140" height="100" rx="6" fill="#9B2D20"/><rect x="-64" y="-44" width="128" height="88" rx="4" fill="none" stroke="#F4EFE0" stroke-opacity=".6"/><text y="-2" font-size="36" fill="#F4EFE0" text-anchor="middle">史稱</text><text y="32" font-size="'+(v.label.length>3?24:32)+'" fill="#F4EFE0" text-anchor="middle">'+esc(v.label)+'</text></g>'
 +rows+'<text x="400" y="1030" font-size="22" fill="#9A9684" text-anchor="middle">皇帝模擬器　·　一部由你寫下的史書</text></svg>'}
function cardPng(){return new Promise((res,rej)=>{const s=cardSvg();const img=new Image();img.onload=()=>{try{const c=document.createElement('canvas');c.width=1200;c.height=1650;const x=c.getContext('2d');x.drawImage(img,0,0,1200,1650);c.toBlob(b=>b?res(b):rej(new Error('blob')),'image/png')}catch(e){rej(e)}};img.onerror=rej;img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s)})}
function openCard(){modal('<div class="recap"><h2 class="rh">史書書頁</h2><div class="cardbox">'+cardSvg().replace('width="800" height="1100"','style="width:100%;height:auto"')+'</div><div class="opts" style="margin-top:12px;justify-content:center"><button class="pri" data-act="cardsave">儲存圖片</button><button data-act="cardshare">分享</button><button data-act="close">合上</button></div><div class="small dim" style="text-align:center;margin-top:6px">若無法儲存，可直接截圖，或長按圖片。</div></div>')}
const TUT=[['先批奏摺','「奏摺」是臣下呈上的事務。每批閱三份耗一旬，你每月有三旬可用。急事（紅色「急」）先看，閒事可以一併留中。'],['結束這個月','做完想做的事，按底部「靜觀一月」。國庫、民心、皇權都會結算，下方的「這幾個月回顧」會用一句話告訴你變化的原因。'],['看顧四方','上方四項是命脈：國庫、糧倉、民心、皇權。任何一項見底，都會出事。點數字可以查看原因。'],['立下志向','在「天命」立一個志向，達成時會被史官鄭重記上一筆。你的一生，會被寫成本紀。']];
function tutModal(i){const t=TUT[i];modal('<h2>'+t[0]+'</h2><p>'+t[1]+'</p><div class="small dim">第 '+(i+1)+' / '+TUT.length+' 則</div><div class="opts">'+(i<TUT.length-1?'<button class="pri" data-act="tut" data-arg="'+(i+1)+'">下一則</button>':'<button class="pri" data-act="tut" data-arg="done">明白了</button>')+'<button data-act="tut" data-arg="done">不再提示</button></div>')}

/* ---------- 設定：聲音與閱讀 ---------- */
let AC=null;
function setg(){const M=metaGet();M.set=M.set||{fs:16,hc:0,rm:0,snd:1};return M.set}
function applySettings(){const s=setg();document.documentElement.style.fontSize=s.fs+'px';document.body.classList.toggle('hc',!!s.hc);document.body.classList.toggle('rm',!!s.rm)}
function sfx(k){try{const s=setg();if(!s.snd)return;AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();const t=AC.currentTime,g=AC.createGain();g.connect(AC.destination);
 if(k==='stamp'){const o=AC.createOscillator();o.type='sine';o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(48,t+.18);g.gain.setValueAtTime(.32,t);g.gain.exponentialRampToValueAtTime(.001,t+.25);o.connect(g);o.start(t);o.stop(t+.27)}
 else if(k==='bell'){[523,785,1047].forEach((f,i)=>{const o=AC.createOscillator(),gg=AC.createGain();o.type='sine';o.frequency.value=f;gg.gain.setValueAtTime(.09/(i+1),t);gg.gain.exponentialRampToValueAtTime(.0005,t+1.4);o.connect(gg);gg.connect(AC.destination);o.start(t);o.stop(t+1.5)})}
 else{const n=AC.createBufferSource(),b=AC.createBuffer(1,AC.sampleRate*.18,AC.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*(1-i/d.length);n.buffer=b;const fl=AC.createBiquadFilter();fl.type='bandpass';fl.frequency.value=2200;g.gain.value=.05;n.connect(fl);fl.connect(g);n.start(t)}}catch(e){}}
function settingsHtml(){const s=setg();return '<div class="card"><h3>閱讀與聲音</h3><div class="opts"><button class="sm '+(s.snd?'gold':'')+'" data-act="set" data-arg="snd">音效：'+(s.snd?'開':'關')+'</button><button class="sm '+(s.hc?'gold':'')+'" data-act="set" data-arg="hc">高對比：'+(s.hc?'開':'關')+'</button><button class="sm '+(s.rm?'gold':'')+'" data-act="set" data-arg="rm">減少動畫：'+(s.rm?'開':'關')+'</button></div><div class="opts" style="margin-top:6px"><span class="small dim" style="align-self:center">字級</span>'+[[15,'小'],[16,'中'],[18,'大'],[20,'特大']].map(([v,n])=>'<button class="sm '+(s.fs===v?'gold':'')+'" data-act="set" data-arg="fs|'+v+'">'+n+'</button>').join('')+'</div></div>'}
function zhupi(l){sfx('stamp');const t=/駁|拒|婉|不|斥|罷|削|謝|退/.test(l)&&!/不再/.test(l)?'駁':/留/.test(l)?'留':'准';const d=document.createElement('div');d.className='zp';d.innerHTML='<b class="'+(t==='駁'?'bk':'')+'">'+t+'</b>';document.body.appendChild(d);setTimeout(()=>d.remove(),900)}
const BZ={sage:'在位之日，朝野清明，民有餘糧，可謂得其人矣。',warrior:'威加四夷，開疆拓土，雖勞民力，而國威遠播。',revive:'承衰敝之後，能撥亂反正，社稷賴以不墜。',tyrant:'刑罰苛酷，誅戮無度，天下側目，不敢發言。',fool:'政出多門，賞罰失當，終使人心離散。',puppet:'大權旁落，徒擁虛名，朝堂之上，不知有君。',normal:'無大功，亦無大過，守成而已。',fall:'運祚不終，社稷傾覆，非獨天命，抑亦人事也。'};
function bjProse(i){const x=G.emps[i],p=P(x.pid),end=x.t1==null?G.t:x.t1;const ev=G.chr.filter(c=>c.imp>=3&&c.t>=x.t0&&c.t<=end);const st=Math.max(1,Math.ceil(ev.length/10));const pk=ev.filter((_,k)=>k%st===0).slice(0,10);const v=x.v;const yrs=Math.round((end-x.t0)/12);
 let h='<p>帝諱'+esc(nm(p))+'，'+(i===0&&G.scn==='c'?'起於草莽，':'')+dateStr(x.t0).replace(/\d+月$/,'')+'即位，建元「'+esc(x.era)+'」。</p>';
 h+=pk.map(c=>'<p><b>'+dateStr(c.t)+'</b>，'+esc(c.txt)+'</p>').join('')||'<p>在位間，海內無大事。</p>';
 h+='<p>在位凡'+yrs+'年，'+(x.t1==null?'今猶在位。':esc((x.cause||'崩')+'。'))+'</p>';
 if(v)h+='<p class="bz">贊曰：'+(BZ[v.key]||'')+'謚曰「'+esc(v.temple)+'」。</p>';return h}
function bjModal(i){modal('<div class="recap"><h2 class="rh">'+esc(G.emps[i].era)+'本紀</h2><div class="bj">'+bjProse(i)+'</div><div class="opts" style="margin-top:12px;justify-content:center"><button class="pri" data-act="close">合卷</button></div></div>');$('#md').classList.add('wide')}
function legModal(){const L=G.over?G.over.type:'fall';modal('<h2>承前朝而起</h2><p>前朝「'+esc(G.era.n)+'」已成歷史。你可以選擇下一局的身份：</p><div class="opts"><button class="pri" data-act="legpick" data-arg="a">旁支入繼<small>承其遺澤，聲望+8；天下仍在</small></button><button data-act="legpick" data-arg="c">起於草莽<small>開國之君；有前朝遺老輔佐</small></button></div><div class="opts" style="margin-top:8px"><button data-act="close">返回</button></div>')}
function legacyBegin(sc){const type=G.over?G.over.type:'fall';const L={era:G.era.n,type:sc==='a'?'extinct':type==='extinct'?'fall':type};beginGame({scn:sc,legacy:L})}
function beginGame(o){o=o||{};const nmv=(($('#nm')||{}).value||'承嗣').trim().slice(0,4)||'承嗣';{const M=metaGet();M.games++;metaSave()}
 const a={scn:o.scn||UI.start.scn,name:nmv,focus:UI.start.focus||'pol',diff:o.daily?'n':(UI.start.diff||'n')};if(o.daily){const k=dailyKey();a.seed=dailySeed(k);a.scn='a'}if(o.legacy)a.legacy=o.legacy;if(!o.daily&&UI.start.cust)a.cust=UI.start.cust;
 newGame(a);if(o.daily){G.daily=dailyKey()}UI.last=null;UI.overShown=false;UI.empId=G.emp;TAB='court';ALERTS.length=0;saveG('auto');render();showPro()}
function dailyKey(){const d=new Date();return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate()}
function dailySeed(k){let h=k*2654435761%2147483647;return h|0}
function endModal(){const e=emp();const last=G.emps[G.emps.length-1];const v=last&&last.v;
 modal('<h2>'+({fall:'王朝覆滅',usurp:'改朝換代',extinct:'國祚斷絕'}[G.over.type]||'終局')+'</h2><p>'+esc(G.over.txt)+'</p>'+(v?'<p>末代之君 <b>'+esc(nm(e))+'</b>，史稱「'+v.label+'」。</p>':'')
 +'<p class="dim small">本朝歷時'+Math.round((G.t-G.emps[0].t0)/12)+'年，歷'+G.emps.length+'帝。你可以前往「史書」回顧這段歷史，或重新登基。</p><div class="opts"><button class="pri" data-act="recap">本朝回顧</button><button data-act="card">史書書頁</button><button data-act="leg">承前朝而起</button><button data-act="coll">典藏</button><button data-act="restart">重新登基</button><button data-act="close">回顧史書</button></div>')}
function succModal(){const e=emp();const prev=G.emps[G.emps.length-2];const v=prev&&prev.v;
 modal('<h2>新帝登基</h2><p>'+(prev?'<b>'+esc(nm(P(prev.pid)))+'</b>'+esc(prev.cause||'')+(v?'，廟號「'+v.temple+'」，史稱'+v.label:'')+'。':'')+'</p><p><b>'+esc(nmt(e))+'</b>（'+age(e)+'歲）繼承大統，年號「'+G.era.n+'」。從此，你就是這位皇帝。</p>'
 +'<div class="port" style="margin:auto">'+portrait(e,150)+'</div><p class="small dim">前朝的政策、婚姻、戰爭、恩怨與史書評價，都將由你繼承。</p><div class="opts"><button class="pri" data-act="close">接掌天下</button><button data-act="tosave">先去存檔備份</button></div>')}

/* ---------- 事件處理 ---------- */
const ACT={
 guidex(){UI.noGuide=true;try{localStorage.setItem('emperor_guide_off','1')}catch(e){}render()},guideon(){UI.noGuide=false;try{localStorage.removeItem('emperor_guide_off')}catch(e){}toast('已重新顯示「本月要務」。');render()},
 webl(k){const L=UI.webL||(UI.webL={kin:1,rel:1,arc:1});L[k]=L[k]?0:1;render()},
 webplay(){if(UI.webTimer){clearInterval(UI.webTimer);UI.webTimer=null;const b=$('#wpb');if(b)b.textContent='▶ 回放';return}const S=webPts();if(S.length<2)return;let i=0;webUpdate(0);const b=$('#wpb');if(b)b.textContent='■ 暫停';UI.webTimer=setInterval(()=>{i++;if(i>=webPts().length||!$('#wsl')){clearInterval(UI.webTimer);UI.webTimer=null;const b2=$('#wpb');if(b2)b2.textContent='▶ 回放';return}webUpdate(i)},650)},
 lt(a){const e=(UI.ltEv||[])[+a];const t=$('#ltxt');if(e&&t)t.innerHTML='<b>'+esc(e.d)+'</b>　'+esc(e.t)},
 recap(){openRecap()},coll(){openColl()},
 mandpick(){mandModal()},mandset(k){mandSet(k);closeModal();autosave();render();toast('已立志：「'+MAND[k].n+'」。')},
 tab(a){if(UI.webTimer&&a!=='web'){clearInterval(UI.webTimer);UI.webTimer=null}TAB=a;render();window.scrollTo(0,0)},
 why(k){const N={tre:'國庫',gra:'糧倉',mind:'民心',auth:'皇權',rep:'威望',army:'軍力與軍心',burden:'賦稅負擔'}[k]||k;modal('<h3>'+N+'：為何如此</h3>'+statWhy(k).map(w=>'<div class="why '+(w.s>0?'good':w.s<0?'bad':'dim')+'">'+(w.s>0?'▲ ':w.s<0?'▼ ':'・ ')+esc(w.t)+'</div>').join('')+'<div class="opts"><button data-act="close">明白了</button></div>')},
 digx(){UI.dig=null;render()},mpage(a){UI.mi=(UI.mi||0)+(+a);render()},
 edex(a){const i=$('#ed');if(i){i.value=a;i.focus()}},edict(){const i=$('#ed');res(actEdict(i?i.value:''))},
 tosave(){closeModal();TAB='sys';render();window.scrollTo(0,0)},close(){closeModal();render()},
 scn(a){UI.start.scn=a;UI.start.name=($('#nm')||{}).value||UI.start.name;startScreen()},
 cust(a){const[k,i]=a.split('|');UI.start.cust=Object.assign({tre:1,foe:1,fac:1},UI.start.cust||{});UI.start.cust[k]=+i;UI.start.name=($('#nm')||{}).value||UI.start.name;startScreen();const d=document.querySelector('details.cust');if(d)d.open=true},diff(a){UI.start.diff=a;UI.start.name=($('#nm')||{}).value||UI.start.name;startScreen()},focus(a){UI.start.focus=a;UI.start.name=($('#nm')||{}).value||UI.start.name;startScreen()},enter(){UI.splashDone=true;startScreen()},
 begin(){beginGame()},
 pron(){UI.proPg++;proModal()},pros(){closeModal();render()},
 proc(a){const t=proApply(+a);closeModal();saveG('auto');render();toast(t);setTimeout(mandModal,350)},
 loadprev(){if(loadSlot('prev')){ALERTS.length=0;TAB='court';UI.overShown=false;UI.empId=G.emp;toast('已還原至上一個月的存檔。');render()}else toast('沒有可還原的存檔。',false)},loadauto(){if(loadSlot('auto')){ALERTS.length=0;TAB='court';UI.overShown=false;UI.empId=G.emp;render()}},
 adv(a){sfx('page');const n=+a;const before=G.emp;const s0=snapStats();const y0=Math.floor((G.t-G.emps[0].t0)/120);const r=advance(n);if(G.t>s0.t){UI.dig=digest(s0);UI.mi=0}autosave();let m='';
  if(r.why==='over')m='王朝已走到盡頭。';else if(r.why==='succ'){m='新帝即位。'}else if(r.why==='sit')m='出現緊急情勢，已暫停（歷時'+r.done+'個月）。';else if(r.why==='intel')m='收到一則密報，已暫停。';else if(r.why==='ill')m='龍體違和，已暫停。';else m=n>1?'過了'+n+'個月。':'一個月過去了。';
  const y1=Math.floor((G.t-G.emps[0].t0)/120);if(y1>y0&&backupDue()){m+='\n（已歷'+y1*10+'年，建議到「存檔」分頁複製存檔碼備份。）'}UI.last={ok:true,msg:m};toast(m);render()},
 court(){const r=actCourt();if(r.ok&&G.dbt!==G.t){const d=debateTopic();if(d){G.dbt=G.t;UI.deb=d;res(r);openDebate();return}}res(r)},
 deb(a){const d=UI.deb;if(!d)return;if(a==='x'){UI.deb=null;closeModal();res(deferDebate(d));return}const r=resolveDebate(d,+a);if(!r.ok){toast(r.msg,false);return}UI.deb=null;closeModal();res(r)},study(a){res(actStudy(a))},rest(){res(actRest())},hunt(){res(actHunt())},banq(a){res(actBanquet(a==='1'))},review(){res(actReview())},recruit(){res(actRecruit())},sell(){res(actSellOffice())},edit(){res(actEditHist())},
 tour(){askModal({title:'微服前往何處',items:regItems()},id=>{closeModal();res(actTour(id))})},tour1(a){res(actTour(a))},
 life(a){res(setLife(a))},tax(a){res(setTax(+a))},mil(a){res(setMil(+a))},crt(a){res(setCrt(+a))},inst(a){res(actInst(a))},
 reg(a){UI.sel=a;render()},relief(a){res(actRelief(a))},exempt(a){res(actExempt(a))},proj(a){const[k,r]=a.split('|');res(actProject(k,r))},dip(a){const[f,m]=a.split('|');res(actDiplo(f,m))},
 appt(a){askModal({title:'任命：'+offName(a),items:candidatesFor(a).map(p=>({id:p.id,label:nmt(p),sub:STN[offDef(a).s]+n0(p.st[offDef(a).s])+'　'+FAC[p.fac].n+'　態度：'+attLabel(p)+(p.off?'　現任'+offName(p.off):'')}))},id=>{closeModal();res(actAppoint(a,+id))})},
 dism(a){res(actDismiss(a))},
 memo(a){const[i,j]=a.split('|').map(Number);const m=G.memo.find(x=>x.id===i);if(!m)return;const o=memoOpts(m)[j];
  if(o.ask)askModal(o.ask,id=>{closeModal();const r=(G.mw%3===0&&G.ap<1)?NO('精力不足。'):o.fn(isNaN(+id)?id:+id);if(r.ok){G.memo=G.memo.filter(z=>z!==m);if(G.mw%3===0)G.ap--;G.mw++}res(r)});else{const r0=runMemo(i,j);if(r0&&r0.ok)zhupi(o.l);res(r0)}},
 tut(a){if(a==='done'){const M=metaGet();M.tut=1;metaSave();closeModal()}else tutModal(+a)},fold(a){UI.fold=UI.fold||{};const o=UI.fold[a]!=null?UI.fold[a]:(a==='mand'?!G.mandate:false);UI.fold[a]=!o;render()},set(a){const s=setg();const[k,v]=a.split('|');if(k==='fs')s.fs=+v;else s[k]=s[k]?0:1;metaSave();applySettings();if(k==='snd'&&s.snd)sfx('bell');render()},qsave(){saveG('auto');toast('已存檔。')},exit(){saveG('auto');G=null;closeModal();document.body.classList.remove('ingame');startScreen()},mopen(a){UI.mopen=UI.mopen||{};UI.mopen[a]=true;render()},idleall(){G.memo=G.memo.filter(m=>memoTier(m)!==2);toast('已將閒事一併留中。');autosave();render()},leave(a){zhupi('留中');res(leaveMemo(+a))},ping(a){res(actPing(a))},jia(a){res(actJia(a))},bdr(a){const[r,m]=a.split('|');res(actBorder(r,m))},bjread(a){bjModal(+a)},daily(){beginGame({daily:true})},legpick(a){legacyBegin(a)},leg(){legModal()},
 sit(a){const[i,j]=a.split('|').map(Number);const s=G.sit.find(x=>x.id===i);if(!s)return;const o=sitOpts(s)[j];if(!o)return;
  if(o.ask)askModal(o.ask,id=>{closeModal();res(o.fn(isNaN(+id)?id:+id))});else res(o.fn())},
 inv(a){askModal({title:'指派何人追查',items:alivePs().filter(p=>(p.role==='official'||p.role==='eunuch'||p.role==='general')&&age(p)>=25).sort((x,y)=>y.st.sch-x.st.sch).slice(0,8).map(p=>({id:p.id,label:nmt(p),sub:'權謀'+n0(p.st.sch)+'　操守：'+corLabel(p)}))},id=>{closeModal();res(actInvestigate(+a,+id))})},
 direct(a){const[i,lv]=a.split('|');res(actDirect(+i,lv))},dropi(a){G.intel=G.intel.filter(x=>x.id!==+a);render()},
 person(a){personModal(P(+a))},
 pact(a){const p=UI.pid!=null?P(UI.pid):null;if(!p)return;const o=personActions(p)[+a];if(!o)return;if(o.ask)askModal(o.ask,id=>{const r=o.fn(isNaN(+id)?id:+id);UI.last=r;toast(r.msg,r.ok);autosave();render();personModal(p)});else{const r=o.fn();UI.last=r;toast(r.msg,r.ok);autosave();render();if(p.alive)personModal(p);else closeModal()}},
 askpick(a){const f=UI.ask;if(f){UI.ask=null;f(a)}},
 draft(){const c=draftList();window.__dr=new Set();modal('<h3>選秀入宮</h3><div class="small dim">最多選三人。耗2旬、30萬兩。名門之女入宮即封貴人，並帶來其家族的情分與野心；民間女子無家族牽絆。</div><div class="list">'+c.map(p=>'<div class="it" data-act="dpick" data-arg="'+p.id+'" id="dp'+p.id+'"><b>'+esc(nm(p))+'</b> <span class="small dim">'+age(p)+'歲　'+(p.clan!=null?G.clans[p.clan].s+'氏'+(G.clans[p.clan].wai?'（外戚）':'')+'・'+FAC[G.clans[p.clan].f].n:'民間女子')+'</span><small>文藝'+n0(p.st.lit)+'　'+p.tr.join('、')+'</small></div>').join('')+'</div><div class="opts"><button class="gold" data-act="dgo">入選</button></div>')},
 dpick(a){const s=window.__dr;const el=document.getElementById('dp'+a);if(s.has(a)){s.delete(a);el.style.borderColor=''}else if(s.size<3){s.add(a);el.style.borderColor='var(--gold)'}},
 dgo(){const ids=[...window.__dr].map(Number);closeModal();res(actDraft(ids))},
 save(a){toast(saveG(a)?'已存入檔位'+a+'。':'存檔失敗（瀏覽器可能禁用了儲存）。')},
 load(a){if(loadSlot(a)){ALERTS.length=0;UI.last=null;UI.overShown=false;UI.empId=G.emp;toast('已讀取。');render()}else toast('該檔位沒有存檔。',false)},
 copycode(){packSave().then(async c=>{const ok=await copyText(c);markBackup();toast(ok?'存檔碼已複製（約'+Math.max(1,Math.round(c.length/1024))+' KB）。':'無法自動複製，已放進下方文字框，請手動全選複製。',ok)}).catch(()=>toast('產生存檔碼失敗。',false))},
 dlsave(){packSave().then(async c=>{const fn='emperor-save-'+(G.era?G.era.n:'')+'.txt';let dl=null;try{dl=window.claude&&claude.use?await claude.use('downloads'):null}catch(e){dl=null}
  if(dl){try{await dl.save({filename:fn,data:c});markBackup();toast('已下載存檔檔案。')}catch(e){toast('已取消下載。若無法下載，請改用「複製存檔碼」。',false)}return}
  const b=new Blob([c],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=fn;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);markBackup();toast('已下載存檔檔案。')}).catch(()=>toast('下載失敗，請改用「複製存檔碼」。',false))},
 sharesave(){packSave().then(async c=>{try{const f=new File([c],'emperor-save.txt',{type:'text/plain'});if(navigator.canShare&&navigator.canShare({files:[f]}))await navigator.share({files:[f],title:'皇帝模擬器存檔'});else await navigator.share({title:'皇帝模擬器存檔',text:c});markBackup()}catch(e){if(e&&e.name!=='AbortError')toast('無法開啟分享，請改用「複製存檔碼」。',false)}})},
 import(){const t=$('#exp');applyImport(t?t.value:'')},
 restart(){G=null;UI.overShown=false;UI.empId=null;UI.last=null;closeModal();startScreen()}
};
document.addEventListener('click',ev=>{const el=ev.target.closest('[data-act]');if(!el)return;const f=ACT[el.dataset.act];if(f){ev.preventDefault();try{f(el.dataset.arg,el)}catch(e){console.error(e);toast('發生錯誤：'+e.message,false)}}});
document.addEventListener('change',ev=>{const t=ev.target;if(t.id==='imf'){const f=t.files&&t.files[0];if(f){const r=new FileReader();r.onload=()=>applyImport(String(r.result));r.readAsText(f)}return}if(t.id==='fr'){UI.fl.role=t.value;render()}else if(t.id==='ff'){UI.fl.fac=t.value;render()}else if(t.id==='ca'){UI.all=t.checked;render()}});
document.addEventListener('input',ev=>{if(ev.target.id==='wsl'){webUpdate(ev.target.value);return}if(ev.target.id==='fq'){UI.fl.q=ev.target.value;clearTimeout(window.__fq);window.__fq=setTimeout(()=>{render();const q=$('#fq');if(q){q.focus();q.setSelectionRange(q.value.length,q.value.length)}},250)}});
$('#ov').addEventListener('click',ev=>{if(ev.target.id==='ov'){closeModal();render()}});
render();

applySettings();
(function(){let sx=0,sy=0,ok=false;const ap=document.getElementById('app');if(!ap)return;
 ap.addEventListener('touchstart',e=>{const t=e.touches[0];sx=t.clientX;sy=t.clientY;ok=!e.target.closest('.mapwrap,.webwrap,table,.tl,svg,input,textarea')&&!document.getElementById('ov').classList.contains('on')},{passive:true});
 ap.addEventListener('touchend',e=>{if(!ok||!G||typeof TABS==='undefined')return;const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;if(Math.abs(dx)<80||Math.abs(dy)>45)return;const i=TABS.findIndex(x=>x[0]===TAB);const j=Math.max(0,Math.min(TABS.length-1,i+(dx<0?1:-1)));if(j!==i){TAB=TABS[j][0];render();window.scrollTo(0,0)}},{passive:true})})();
