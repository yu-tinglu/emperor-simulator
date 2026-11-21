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
function qbHtml(nm_){const dm=G.memo.length;return '<div class="qb-sc"><button data-act="court">'+ico('court',18)+'<span>上朝</span></button><button data-act="tab" data-arg="court">'+ico('gov',18)+'<span>批閱奏摺'+(dm?'（'+dm+'）':'')+'</span></button><button data-act="tab" data-arg="gov">'+ico('people',18)+'<span>朝政</span></button><button data-act="tab" data-arg="map">'+ico('map',18)+'<span>疆域</span></button><button data-act="tab" data-arg="harem">'+ico('harem',18)+'<span>後宮</span></button><button data-act="tab" data-arg="family">'+ico('family',18)+'<span>皇族</span></button></div>'
 +'<div class="qb-adv"><button class="adv" data-act="adv" data-arg="1">推進時間 ▶</button><div class="qb-sub"><button data-act="adv" data-arg="3">三月</button><button data-act="adv" data-arg="12">一年</button></div></div>'}
function regState(r){return G.sit.some(s=>s.k==='war'&&s.reg===r.id)?['戰事','r']:G.sit.some(s=>s.k==='revolt'&&s.reg===r.id)||r.rebel?['民變','r']:G.sit.some(s=>s.k==='disaster'&&s.reg===r.id)?['災荒','o']:r.un>65?['民怨','o']:['平穩','g']}
function sideHtml(){
 const lg=G.log.slice(0,4);
 const news='<div class="sd"><div class="sdh">'+ico('hist',18)+'<b>朝廷動態</b><a data-act="tab" data-arg="hist">更多 ›</a></div>'+(lg.length?lg.map(l=>'<div class="nw '+(l.cls||'')+'"><time>'+dateStr(l.t)+'</time>'+esc(l.txt)+'</div>').join(''):'<div class="nw dim">朝野尚無大事。</div>')+'</div>';
 const rg=Object.values(G.reg).map(r=>{const s=regState(r);return '<div class="rg"><i class="'+s[1]+'"></i>'+esc(r.n)+'：<b class="'+s[1]+'">'+s[0]+'</b></div>'}).join('');
 const world='<div class="sd"><div class="sdh">'+ico('map',18)+'<b>天下形勢</b><a data-act="tab" data-arg="map">更多 ›</a></div><div class="wd"><div class="mini" data-act="tab" data-arg="map">'+mapSvg()+'</div><div class="rgs">'+rg+'</div></div></div>';
 const who=[['首輔',holder('chan')],['皇后',consorts().find(c=>c.rank===6)],['太后',alivePs().find(p=>p.role==='dowager')],['太子',G.heir!=null?P(G.heir):null]];
 const ppl='<div class="sd"><div class="sdh">'+ico('web',18)+'<b>人物關係</b><a data-act="tab" data-arg="web">更多 ›</a></div><div class="pps">'+who.map(([l,p])=>p&&p.alive?'<div class="pp" data-act="person" data-arg="'+p.id+'"><div class="pf">'+portrait(p,64)+'</div><span>'+l+'</span></div>':'<div class="pp empty"><div class="pf">'+ico('people',30)+'</div><span>'+l+'（未立）</span></div>').join('')+'</div></div>';
 return news+world+ppl}
