/* ---------- 場景層：原創繪製的宮殿內景（SVG，僅作背景，不含文字） ---------- */
function sceneSvg(){
 const pil=(x,w,b)=>'<g'+(b?' filter="url(#bl'+b+')"':'')+'><rect x="'+x+'" y="-30" width="'+w+'" height="800" fill="url(#pil)"/><rect x="'+x+'" y="60" width="'+w+'" height="9" fill="#d2ae62" opacity=".5"/><rect x="'+x+'" y="96" width="'+w+'" height="3" fill="#d2ae62" opacity=".3"/><rect x="'+(x-w*.14)+'" y="712" width="'+(w*1.28)+'" height="46" rx="4" fill="url(#base)"/></g>';
 const off=(x,y,s)=>'<g transform="translate('+x+' '+y+') scale('+s+')"><path d="M-30 70 Q-32 14 0 4 Q32 14 30 70Z" fill="#0d1526"/><path d="M-30 70 Q-32 14 0 4 Q32 14 30 70" fill="none" stroke="#e08a44" stroke-opacity=".28" stroke-width="2"/><rect x="-9" y="26" width="18" height="16" rx="2" fill="#b8892f" opacity=".7"/><circle cx="0" cy="-4" r="11" fill="#120e0c"/><path d="M-12 -12 Q0 -26 12 -12Z" fill="#0a0a0a"/><path d="M-30 -14 H-12 M12 -14 H30" stroke="#0a0a0a" stroke-width="5" stroke-linecap="round"/></g>';
 let o='';
 const rowsL=[[300,742,1],[205,770,1.08],[380,812,1.22],[140,846,1.3],[470,872,1.38]];
 const rowsR=rowsL.map(r=>[1600-r[0],r[1],r[2]]);
 [...rowsL,...rowsR].forEach(r=>{o+=off(r[0],r[1],r[2]*.9)});
 const win=x=>'<g><rect x="'+x+'" y="150" width="330" height="400" fill="#f0b25a" opacity=".55"/><rect x="'+x+'" y="150" width="330" height="400" fill="url(#lat)"/><rect x="'+x+'" y="150" width="330" height="400" fill="none" stroke="#5a140e" stroke-width="10"/></g>';
 const lantern=(x,y,k)=>'<g transform="translate('+x+' '+y+') scale('+k+')"><path d="M0 -140V-6" stroke="#d2ae62" stroke-width="3"/><circle r="120" fill="url(#glow)" opacity=".7"/><ellipse cx="0" cy="38" rx="34" ry="46" fill="#b3281f"/><ellipse cx="0" cy="38" rx="34" ry="46" fill="url(#lan)"/><rect x="-18" y="-12" width="36" height="9" rx="2" fill="#d2ae62"/><rect x="-14" y="82" width="28" height="7" rx="2" fill="#d2ae62"/><path d="M0 89v42M-6 89v30M6 89v30" stroke="#e8c26a" stroke-width="2"/></g>';
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>'
 +'<linearGradient id="pil" x1="0" x2="1"><stop offset="0" stop-color="#200503"/><stop offset=".3" stop-color="#7d1912"/><stop offset=".52" stop-color="#b33a2a"/><stop offset=".78" stop-color="#5e130d"/><stop offset="1" stop-color="#1c0402"/></linearGradient>'
 +'<linearGradient id="base" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#4a2a14"/><stop offset="1" stop-color="#150a05"/></linearGradient>'
 +'<linearGradient id="wall" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#2a0c08"/><stop offset=".55" stop-color="#4a150d"/><stop offset="1" stop-color="#14090a"/></linearGradient>'
 +'<linearGradient id="floor" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#2b120c"/><stop offset="1" stop-color="#0c0605"/></linearGradient>'
 +'<linearGradient id="scr" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#5a3a14"/><stop offset=".5" stop-color="#b98a3a"/><stop offset="1" stop-color="#3a220c"/></linearGradient>'
 +'<linearGradient id="car" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#8a1c14"/><stop offset="1" stop-color="#4a0d09"/></linearGradient>'
 +'<linearGradient id="beam" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ffd890" stop-opacity=".42"/><stop offset="1" stop-color="#ffd890" stop-opacity="0"/></linearGradient>'
 +'<radialGradient id="glow"><stop offset="0" stop-color="#ffcf6a" stop-opacity=".9"/><stop offset="1" stop-color="#ffcf6a" stop-opacity="0"/></radialGradient>'
 +'<radialGradient id="lan" cx=".5" cy=".4"><stop offset="0" stop-color="#ffb35a" stop-opacity=".95"/><stop offset="1" stop-color="#b3281f" stop-opacity="0"/></radialGradient>'
 +'<radialGradient id="vg" cx=".5" cy=".42" r=".75"><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".78"/></radialGradient>'
 +'<pattern id="lat" width="34" height="34" patternUnits="userSpaceOnUse"><path d="M0 0H34M0 0V34" stroke="#4a140c" stroke-width="5" fill="none"/><path d="M17 0L34 17L17 34L0 17Z" stroke="#4a140c" stroke-width="2" fill="none" opacity=".7"/></pattern>'
 +'<filter id="bl3"><feGaussianBlur stdDeviation="3"/></filter><filter id="bl8"><feGaussianBlur stdDeviation="8"/></filter><filter id="bl1"><feGaussianBlur stdDeviation="1.2"/></filter>'
 +'</defs>'
 +'<rect width="1600" height="900" fill="url(#wall)"/><rect y="700" width="1600" height="200" fill="url(#floor)"/>'
 +'<g filter="url(#bl1)">'+win(160)+win(1110)+'</g>'
 +'<polygon points="160,150 490,150 700,760 330,760" fill="url(#beam)" opacity=".7"/><polygon points="1110,150 1440,150 1270,760 900,760" fill="url(#beam)" opacity=".7"/>'
 +'<g filter="url(#bl1)"><ellipse cx="800" cy="360" rx="330" ry="300" fill="url(#glow)" opacity=".7"/><rect x="650" y="150" width="300" height="440" rx="6" fill="url(#scr)"/><rect x="662" y="162" width="276" height="416" rx="4" fill="none" stroke="#f0cf84" stroke-opacity=".55" stroke-width="3"/><circle cx="800" cy="330" r="92" fill="none" stroke="#f0cf84" stroke-opacity=".7" stroke-width="5"/><circle cx="800" cy="330" r="60" fill="none" stroke="#f0cf84" stroke-opacity=".5" stroke-width="3"/><path d="M730 330Q800 250 870 330Q800 410 730 330Z" fill="#f0cf84" fill-opacity=".4"/>'
 +'<path d="M730 600h140v-60h-20v-30h-100v30h-20z" fill="#2a1408"/><path d="M700 590H900L930 640H670Z" fill="#6a1e14"/><path d="M670 640H930L960 690H640Z" fill="#541710"/><path d="M640 690H960L1000 740H600Z" fill="#3e110c"/></g>'
 +'<polygon points="700,900 900,900 825,690 775,690" fill="url(#car)"/><polygon points="730,900 748,900 790,690 782,690" fill="#d2ae62" opacity=".35"/><polygon points="852,900 870,900 818,690 810,690" fill="#d2ae62" opacity=".35"/>'
 +'<g filter="url(#bl1)">'+pil(70,72)+pil(460,66)+pil(1074,66)+pil(1458,72)+'</g>'
 +lantern(250,40,1)+lantern(1350,40,1)+lantern(800,10,.8)
 +'<g filter="url(#bl1)">'+o+'</g>'
 +pil(-60,130,8)+pil(1530,130,8)
 +'<rect width="1600" height="900" fill="url(#vg)"/></svg>'}
