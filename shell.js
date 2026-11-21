/* ---------- 朝堂改版外框：圖示、導覽、右側動態 ---------- */
const IC={
 court:'<path d="M3 9l9-5 9 5M5 9v9M9 9v9M15 9v9M19 9v9M3 20h18"/>',
 self:'<circle cx="12" cy="8" r="3.5"/><path d="M5 20c1-4 4-6 7-6s6 2 7 6"/>',
 gov:'<path d="M6 3h11a2 2 0 012 2v14H8a2 2 0 01-2-2zM6 17a2 2 0 012-2h11M10 8h6M10 11h6"/>',
 map:'<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14"/>',
 harem:'<path d="M12 20c-5-1-8-4-8-8 3 0 6 1 8 4 2-3 5-4 8-4 0 4-3 7-8 8zM12 16c-1-4-1-7 0-10 1 3 1 6 0 10z"/>',
 family:'<circle cx="8" cy="9" r="2.6"/><circle cx="16" cy="9" r="2.6"/><path d="M3 19c.6-3 2.5-5 5-5s4.4 2 5 5M11 19c.6-3 2.5-5 5-5s4.4 2 5 5"/>',
 people:'<circle cx="12" cy="8" r="3.2"/><path d="M6 20v-2a6 6 0 0112 0v2zM9 4l3-2 3 2"/>',
 web:'<circle cx="6" cy="7" r="2.4"/><circle cx="18" cy="7" r="2.4"/><circle cx="12" cy="18" r="2.4"/><path d="M8 8l3 8M16 8l-3 8M8.4 7h7.2"/>',
 hist:'<path d="M12 6c-2-2-5-2-8-1v13c3-1 6-1 8 1 2-2 5-2 8-1V5c-3-1-6-1-8 1zM12 6v13"/>',
 sys:'<path d="M4 8h16v11H4zM3 5h18v3H3zM10 12h4"/>',
 coin:'<circle cx="12" cy="12" r="8"/><rect x="9.5" y="9.5" width="5" height="5"/>',
 sack:'<path d="M9 4h6l-1 3c4 2 5 6 4 11-1 2-3 3-6 3s-5-1-6-3c-1-5 0-9 4-11zM10 12h4"/>',
 crown:'<path d="M4 17l-1-9 5 4 4-7 4 7 5-4-1 9zM4 20h16"/>',
 star:'<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>',
 flag:'<path d="M6 21V4M6 5h11l-2 3.5 2 3.5H6"/>',
 save:'<path d="M5 4h11l3 3v13H5zM8 4v5h7V4M8 20v-6h8v6"/>',
 load:'<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',
 gear:'<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>',
 trophy:'<path d="M8 4h8v5a4 4 0 01-8 0zM8 6H5v2a3 3 0 003 3M16 6h3v2a3 3 0 01-3 3M12 13v4M8 20h8M10 17h4"/>',
 exit:'<path d="M10 4H5v16h5M14 8l4 4-4 4M18 12H9"/>'};
function ico(k,s){return '<svg class="ico" viewBox="0 0 24 24" width="'+(s||20)+'" height="'+(s||20)+'" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'+(IC[k]||'')+'</svg>'}
function navHtml(dots){return TABS.map(([k,n])=>'<button class="'+(TAB===k?'on':'')+'" data-act="tab" data-arg="'+k+'">'+ico(k,20)+'<span>'+n+'</span>'+(dots[k]?'<span class="dot"'+(k==='sys'?' data-sys="1"':'')+'>'+dots[k]+'</span>':'')+'</button>').join('')}
function topActs(){return '<div class="acts">'+[['save','存檔','qsave',''],['load','讀檔','tab','sys'],['gear','設定','tab','sys'],['trophy','典藏','coll',''],['exit','離開','exit','']].map(([i,n,a,g])=>'<button data-act="'+a+'"'+(g?' data-arg="'+g+'"':'')+' title="'+n+'">'+ico(i,22)+'<span>'+n+'</span></button>').join('')+'</div>'}
function qbHtml(){return '<div class="qb-adv"><div class="qb-sub"><button data-act="adv" data-arg="3">三月</button><button data-act="adv" data-arg="12">一年</button></div><button class="adv" data-act="adv" data-arg="1"><span>推進時間</span><i>▶</i></button></div>'}
function regState(r){return G.sit.some(s=>s.k==='war'&&s.reg===r.id)?['戰事','r']:G.sit.some(s=>s.k==='revolt'&&s.reg===r.id)||r.rebel?['民變','r']:G.sit.some(s=>s.k==='disaster'&&s.reg===r.id)?['災荒','o']:r.un>65?['民怨','o']:['平穩','g']}
function sdBox(icon,title,more,body){return '<section class="sd"><header class="sdh">'+ico(icon,18)+'<b>'+title+'</b>'+(more?'<a data-act="tab" data-arg="'+more+'">更多 ›</a>':'')+'</header><div class="sdb">'+body+'</div></section>'}
function newsBody(n){const lg=G.log.slice(0,n);return lg.length?lg.map(l=>'<div class="nw '+(l.cls||'')+'"><time>'+dateStr(l.t)+'</time>'+esc(l.txt)+'</div>').join(''):'<div class="nw dim">朝野尚無大事。</div>'}
function dutyBody(){const nS=G.sit.length,nM=G.memo.length,nI=G.intel.length;const it=(d,t)=>'<div class="gi '+(d?'done':'')+'"><i></i>'+t+'</div>';
 const tip=nS?'先處理急報——它們不會等你。':nM?'奏摺不批會積壓，積壓過多，權臣會趁機代批。':G.ap>0?'還有精力：可以上朝、修養，或召見大臣。':'精力已用盡，可以推進時間了。';
 return it(!nS,'處理急報（'+nS+'）')+it(!nM,'批閱奏摺（'+nM+'）')+(nI?it(false,'查看密報（'+nI+'）'):'')+it(G.ap===0,'用完精力（尚餘'+G.ap+'旬）')+'<div class="tip"><b>提示</b>'+tip+'</div>'}
function sideHtml(kind){
 if(kind==='gov')return sdBox('gov','本月朝政要務','court',dutyBody())+sdBox('hist','朝廷動態','hist',newsBody(6));
 const rg=Object.values(G.reg).map(r=>{const s=regState(r);return '<div class="rg"><i class="'+s[1]+'"></i>'+esc(r.n)+'：<b class="'+s[1]+'">'+s[0]+'</b></div>'}).join('');
 const world='<div class="wd"><div class="mini" data-act="tab" data-arg="map">'+mapSvg()+'</div><div class="rgs">'+rg+'</div></div>';
 const who=[['首輔',holder('chan')],['皇后',consorts().find(c=>c.rank===6)],['太后',alivePs().find(p=>p.role==='dowager')],['太子',G.heir!=null?P(G.heir):null]];
 const ppl='<div class="pps">'+who.map(([l,p])=>p&&p.alive?'<div class="pp" data-act="person" data-arg="'+p.id+'"><div class="pf">'+portrait(p,64)+'</div><span>'+l+'</span></div>':'<div class="pp empty"><div class="pf">'+ico('people',30)+'</div><span>'+l+'（未立）</span></div>').join('')+'</div>';
 return sdBox('hist','朝廷動態','hist',newsBody(4))+sdBox('map','天下形勢','map',world)+sdBox('web','人物關係','web',ppl)}
function heroHtml(t,s){return '<div class="hero"><h1>'+t+'</h1><p>'+s+'</p></div>'}
const PROPS='<svg class="props" viewBox="0 0 520 120" aria-hidden="true"><defs><linearGradient id="jd" x1="0" x2="1"><stop offset="0" stop-color="#3f7a5c"/><stop offset=".5" stop-color="#9fd2b0"/><stop offset="1" stop-color="#2c5a43"/></linearGradient><linearGradient id="pt" x1="0" x2="1"><stop offset="0" stop-color="#1a0e0a"/><stop offset=".5" stop-color="#5a3320"/><stop offset="1" stop-color="#150a07"/></linearGradient></defs>'
 +'<g transform="translate(18 20)"><rect x="6" y="38" width="46" height="58" rx="6" fill="url(#pt)"/><rect x="6" y="38" width="46" height="8" rx="3" fill="#d2ae62" opacity=".6"/><path d="M16 38L10 2M26 38L24 -6M36 38L40 -2M46 38L54 6" stroke="#2a1a10" stroke-width="3" stroke-linecap="round"/><path d="M10 2l-2-8M24-6l0-8M40-2l3-8M54 6l5-7" stroke="#c9b48a" stroke-width="2.4" stroke-linecap="round"/></g>'
 +'<g transform="translate(78 62)"><rect x="0" y="22" width="88" height="14" rx="3" fill="#7a2a1c"/><rect x="6" y="8" width="76" height="14" rx="3" fill="#a8863e"/><rect x="10" y="-4" width="68" height="12" rx="3" fill="#2c4a6e"/><rect x="0" y="22" width="88" height="3" fill="#d2ae62" opacity=".5"/></g>'
 +'<g transform="translate(410 6)"><rect x="0" y="70" width="84" height="26" rx="5" fill="url(#jd)"/><rect x="10" y="48" width="64" height="26" rx="6" fill="url(#jd)"/><path d="M18 50c0-22 14-30 24-30s24 8 24 30z" fill="url(#jd)"/><circle cx="42" cy="24" r="9" fill="#cfe9d6"/><path d="M26 44q16-12 32 0" stroke="#2c5a43" stroke-width="3" fill="none"/></g></svg>'
function edictScroll(){const chips=['減輕賦稅','開倉賑濟','整頓吏治','整軍練兵','特開恩科','興修水利','犒賞三軍','祭天祈福','節儉宮用','屯田墾荒','大赦天下'];
 return '<section class="desk">'+PROPS+'<div class="scroll"><i class="rod top"></i><div class="sheet"><div class="sh-h"><span class="sh-t">自擬詔令</span><span class="sh-s">以自己的話下詔，費一旬；群臣依字句理解</span></div><div class="chips">'+chips.map(t=>'<a data-act="edex" data-arg="'+t+'">'+t+'</a>').join('')+'</div><div class="sh-f"><input id="ed" placeholder="朕意欲……" maxlength="30" autocomplete="off"><button class="seal" data-act="edict">頒布詔令</button></div></div><i class="rod bot"></i></div></section>'}
