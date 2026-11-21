/* ---------- 插畫（原創剪影，純 SVG） ---------- */
function roof(cx,y,w,h,col){ // 重簷歇山剪影：中心x、屋脊y、寬、高
 const l=cx-w/2,r=cx+w/2,e=w*.09;
 return '<path d="M'+(l-e)+' '+(y+h)+' C'+(l+w*.08)+' '+(y+h)+' '+(l+w*.12)+' '+(y+h*.7)+' '+(l+w*.2)+' '+(y+h*.35)+' L'+(cx-w*.07)+' '+y+' L'+(cx+w*.07)+' '+y+' L'+(r-w*.2)+' '+(y+h*.35)+' C'+(r-w*.12)+' '+(y+h*.7)+' '+(r-w*.08)+' '+(y+h)+' '+(r+e)+' '+(y+h)+' C'+(r-w*.1)+' '+(y+h+h*.14)+' '+(r-w*.2)+' '+(y+h*.8)+' '+(r-w*.26)+' '+(y+h*.62)+' L'+(l+w*.26)+' '+(y+h*.62)+' C'+(l+w*.2)+' '+(y+h*.8)+' '+(l+w*.1)+' '+(y+h+h*.14)+' '+(l-e)+' '+(y+h)+' Z" fill="'+col+'"/>'+
 '<path d="M'+(cx-w*.07)+' '+y+' L'+cx+' '+(y-h*.28)+' L'+(cx+w*.07)+' '+y+' Z" fill="'+col+'"/>'}
function hall(cx,base,w,col,glow){ // 殿身：台基＋柱廊＋雙重屋頂
 let s='<rect x="'+(cx-w*.62)+'" y="'+base+'" width="'+(w*1.24)+'" height="14" fill="'+col+'"/><rect x="'+(cx-w*.56)+'" y="'+(base-8)+'" width="'+(w*1.12)+'" height="9" fill="'+col+'"/>';
 s+='<rect x="'+(cx-w*.46)+'" y="'+(base-w*.3)+'" width="'+(w*.92)+'" height="'+(w*.3-8)+'" fill="'+col+'"/>';
 for(let i=0;i<5;i++){const x=cx-w*.4+i*w*.2;s+='<rect x="'+(x)+'" y="'+(base-w*.27)+'" width="'+(w*.12)+'" height="'+(w*.22)+'" fill="'+glow+'" opacity=".78" class="win"/>'}
 s+=roof(cx,base-w*.5,w*1.05,w*.2,col)+roof(cx,base-w*.72,w*.72,w*.16,col);return s}
function lantern(x,y,r,id){return '<g class="lant"><line x1="'+x+'" y1="'+(y-r*2.2)+'" x2="'+x+'" y2="'+(y-r)+'" stroke="#2a1a14" stroke-width="1.5"/><circle cx="'+x+'" cy="'+y+'" r="'+(r*3.2)+'" fill="url(#'+id+')"/><ellipse cx="'+x+'" cy="'+y+'" rx="'+(r*.82)+'" ry="'+r+'" fill="#C7352B"/><rect x="'+(x-r*.35)+'" y="'+(y+r*.9)+'" width="'+(r*.7)+'" height="'+(r*.5)+'" fill="#C9A24B"/></g>'}
function splashSvg(){
 let s='<svg class="sp-art" viewBox="0 0 800 640" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg"><defs>'
 +'<linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0A1424"/><stop offset=".45" stop-color="#1E2D49"/><stop offset=".72" stop-color="#6B3A3C"/><stop offset="1" stop-color="#C98A55"/></linearGradient>'
 +'<radialGradient id="mn"><stop offset="0" stop-color="#FFF6DC"/><stop offset=".25" stop-color="#F4E3B5" stop-opacity=".9"/><stop offset="1" stop-color="#F4E3B5" stop-opacity="0"/></radialGradient>'
 +'<radialGradient id="lg"><stop offset="0" stop-color="#FFB45A" stop-opacity=".9"/><stop offset="1" stop-color="#FFB45A" stop-opacity="0"/></radialGradient>'
 +'<linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#150E14"/><stop offset="1" stop-color="#07070C"/></linearGradient>'
 +'<filter id="mist"><feGaussianBlur stdDeviation="14"/></filter></defs>';
 s+='<rect width="800" height="640" fill="url(#sk)"/><circle cx="520" cy="150" r="130" fill="url(#mn)"/><circle cx="520" cy="150" r="38" fill="#FFF4D2"/>';
 s+='<g fill="#F4E8C8" class="stars">'+[[90,60],[180,110],[260,40],[330,95],[430,50],[480,120],[700,70],[740,150],[40,150],[640,40],[380,160]].map((p,i)=>'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+(1+i%2*.7)+'" style="animation-delay:'+(i*.5)+'s"/>').join('')+'</g>';
 s+='<path d="M0 360 C80 320 150 340 230 300 C300 268 360 300 430 320 C520 345 600 290 680 310 C730 322 770 340 800 330 L800 640 L0 640 Z" fill="#3A3550" opacity=".75"/><path d="M0 400 C90 370 170 395 260 360 C360 322 420 385 520 372 C620 360 700 380 800 365 L800 640 L0 640 Z" fill="#2A2A40" opacity=".9"/>';
 s+='<g filter="url(#mist)" opacity=".55"><ellipse cx="200" cy="430" rx="230" ry="20" fill="#E9C9A0"/><ellipse cx="620" cy="445" rx="250" ry="18" fill="#E9C9A0"/></g>';
 s+='<g opacity=".92">'+hall(150,470,130,'#120C14','#FFC46B')+hall(650,470,130,'#120C14','#FFC46B')+'</g>';
 s+='<g>'+hall(400,500,240,'#0B070E','#FFC46B')+'</g>';
 s+='<path d="M120 520 L680 520 L720 640 L80 640 Z" fill="url(#gr)"/><path d="M340 514 L460 514 L500 640 L300 640 Z" fill="#0E0A12"/>';
 for(let i=0;i<9;i++){const y=522+i*13;s+='<rect x="'+(338-i*4)+'" y="'+y+'" width="'+(124+i*8)+'" height="3" fill="#1C1420" opacity=".8"/>'}
 s+=lantern(300,528,7,'lg')+lantern(500,528,7,'lg')+lantern(230,545,6,'lg')+lantern(570,545,6,'lg');
 s+='<g fill="#0A0710"><path d="M40 640 L40 520 C34 500 52 486 46 470 C60 486 72 500 66 520 L66 640 Z"/><path d="M730 640 L730 540 C724 520 742 506 736 490 C750 506 762 520 756 540 L756 640 Z"/></g>';
 s+='<g class="birds" stroke="#0A0710" fill="none" stroke-width="2" stroke-linecap="round"><path d="M120 190 q8 -9 16 0 q8 -9 16 0"/><path d="M170 220 q6 -7 12 0 q6 -7 12 0"/><path d="M95 240 q5 -6 10 0 q5 -6 10 0"/></g>';
 return s+'</svg>'}

function artScn(k){
 const base='<svg viewBox="0 0 360 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs>';
 if(k==='a'){ // 少年天子：空曠大殿，王座前一個小小的人影，兩側肅立
  return base+'<linearGradient id="aa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2B1A33"/><stop offset=".6" stop-color="#6B2F3C"/><stop offset="1" stop-color="#D49A5C"/></linearGradient><radialGradient id="ab"><stop offset="0" stop-color="#FFD58A" stop-opacity=".85"/><stop offset="1" stop-color="#FFD58A" stop-opacity="0"/></radialGradient></defs><rect width="360" height="200" fill="url(#aa)"/><circle cx="180" cy="86" r="90" fill="url(#ab)"/>'
  +'<g fill="#1A0F1F">'+[40,90,270,320].map(x=>'<rect x="'+(x-9)+'" y="20" width="18" height="170"/><rect x="'+(x-13)+'" y="16" width="26" height="8"/>').join('')+'</g>'
  +'<path d="M120 190 L120 100 C120 70 140 52 180 50 C220 52 240 70 240 100 L240 190 Z" fill="#12091A"/><path d="M140 104 C140 84 154 70 180 68 C206 70 220 84 220 104 L220 120 L140 120 Z" fill="#2A1A2E"/><rect x="132" y="118" width="96" height="10" fill="#C9A24B" opacity=".75"/><rect x="126" y="190" width="108" height="6" fill="#0A0610"/>'
  +'<g fill="#0A0610"><circle cx="180" cy="143" r="7"/><path d="M168 190 L172 152 C176 146 184 146 188 152 L192 190 Z"/><path d="M168 138 L180 128 L192 138 Z"/></g>'
  +'<g fill="#0A0610"><circle cx="62" cy="150" r="7"/><path d="M48 190 L52 162 C56 154 68 154 72 162 L76 190 Z"/><path d="M52 140 Q62 126 72 140 L72 144 L52 144Z"/></g>'
  +'<g fill="#0A0610"><circle cx="300" cy="152" r="7"/><path d="M286 190 L290 164 C294 156 306 156 310 164 L314 190 Z"/><rect x="316" y="150" width="3" height="30"/></g>'
  +'<path d="M0 190 L360 190 L360 200 L0 200Z" fill="#0A0610"/><path d="M180 190 L120 200 L240 200Z" fill="#12091A"/></svg>'}
 if(k==='b'){ // 守成之君：燈下的案牘，窗外一輪月
  return base+'<linearGradient id="ba" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#20263A"/><stop offset="1" stop-color="#4A3426"/></linearGradient><radialGradient id="bb"><stop offset="0" stop-color="#FFC66B" stop-opacity=".95"/><stop offset="1" stop-color="#FFC66B" stop-opacity="0"/></radialGradient></defs><rect width="360" height="200" fill="url(#ba)"/>'
  +'<rect x="230" y="24" width="96" height="104" fill="#0E1626" stroke="#1A0F0A" stroke-width="6"/><circle cx="286" cy="62" r="22" fill="#F4E8C8"/><path d="M230 128 L326 128 L326 108 C300 96 270 112 230 100Z" fill="#101B2E"/><line x1="278" y1="24" x2="278" y2="128" stroke="#1A0F0A" stroke-width="4"/><line x1="230" y1="76" x2="326" y2="76" stroke="#1A0F0A" stroke-width="4"/>'
  +'<circle cx="120" cy="116" r="90" fill="url(#bb)"/>'
  +'<path d="M0 200 L0 150 C80 140 200 140 360 150 L360 200Z" fill="#2A1A12"/><rect x="0" y="146" width="360" height="12" fill="#3B2619"/>'
  +'<g fill="#C9B38A" stroke="#6B5530" stroke-width="1.2"><rect x="30" y="118" width="64" height="12"/><rect x="36" y="106" width="52" height="12"/><rect x="44" y="94" width="40" height="12"/></g><g fill="#B3281F"><rect x="52" y="97" width="8" height="6"/><rect x="40" y="109" width="8" height="6"/></g>'
  +'<g><rect x="150" y="132" width="10" height="14" fill="#2A1A12"/><path d="M155 132 C148 122 152 114 155 106 C158 114 162 122 155 132Z" fill="#FFD27A"/></g>'
  +'<g fill="#0A0610"><circle cx="196" cy="108" r="9"/><path d="M178 160 L184 122 C190 114 204 114 210 122 L216 160 Z"/><path d="M186 100 Q196 88 206 100 L206 104 L186 104Z"/></g>'
  +'<g fill="#E8DDBF" opacity=".95"><path d="M168 146 L226 146 L222 138 L172 138Z"/></g><line x1="160" y1="146" x2="226" y2="146" stroke="#6B5530" stroke-width="1"/></svg>'}
 return base+'<linearGradient id="ca" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1B1114"/><stop offset=".55" stop-color="#6A1E1C"/><stop offset="1" stop-color="#E07A3C"/></linearGradient><radialGradient id="cb"><stop offset="0" stop-color="#FF9A3C" stop-opacity=".9"/><stop offset="1" stop-color="#FF9A3C" stop-opacity="0"/></radialGradient><filter id="cf"><feGaussianBlur stdDeviation="5"/></filter></defs><rect width="360" height="200" fill="url(#ca)"/>'
  +'<circle cx="60" cy="150" r="80" fill="url(#cb)"/><circle cx="310" cy="160" r="70" fill="url(#cb)"/>'
  +'<g filter="url(#cf)" fill="#2A1514" opacity=".8"><ellipse cx="60" cy="90" rx="14" ry="60"/><ellipse cx="86" cy="70" rx="10" ry="50"/><ellipse cx="312" cy="96" rx="13" ry="56"/></g>'
  +'<path d="M0 200 L0 138 L24 138 L24 126 L46 126 L46 138 L70 138 L70 126 L92 126 L92 138 L116 138 L116 126 L138 126 L138 138 L162 138 L162 126 L184 126 L184 138 L208 138 L208 126 L230 126 L230 138 L254 138 L254 126 L276 126 L276 138 L300 138 L300 126 L322 126 L322 138 L360 138 L360 200Z" fill="#0F0809"/>'
  +'<g stroke="#0F0809" stroke-width="2"><line x1="40" y1="126" x2="40" y2="70"/><line x1="200" y1="126" x2="200" y2="64"/><line x1="296" y1="126" x2="296" y2="76"/></g><g fill="#B3281F"><path d="M40 70 L74 80 L40 92Z"/><path d="M200 64 L236 74 L200 86Z"/><path d="M296 76 L328 86 L296 98Z"/></g>'
  +'<g fill="#0A0606"><circle cx="130" cy="96" r="8"/><path d="M114 138 L120 108 C124 100 136 100 140 108 L146 138Z"/><path d="M122 88 L130 78 L138 88Z"/><rect x="150" y="62" width="2.6" height="62"/><path d="M146 66 L156 66 L151 56Z"/></g>'
  +'<path d="M0 200 L360 200 L360 184 L0 184Z" fill="#0A0606"/></svg>'}
