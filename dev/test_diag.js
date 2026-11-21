const fs=require('fs');const vm=require('vm');
const code=['core.js','sim.js'].map(f=>fs.readFileSync(f,'utf8')).join('\n')+';this.__x={newGame,endMonth,alivePs,emp,age,nm,dateStr,get G(){return G}}';
const c={console,Math};vm.createContext(c);vm.runInContext(code,c);const X=c.__x;
X.newGame({scn:'b',seed:977,name:'測試'});
for(let m=0;m<=240;m++){const G=X.G;if(G.over)break;
 if(m%24===0){const rs=Object.values(G.reg);console.log('m',m,'tre',Math.round(G.tre),'inc',Math.round(G.fin&&G.fin.inc),'exp',Math.round(G.fin&&G.fin.exp),'leak',Math.round(G.fin&&G.fin.leak),'burden',Math.round(G.burden),'mind',Math.round(G.mind),'auth',Math.round(G.auth),'avgUn',Math.round(G.avgUn||0),'food',Math.round(rs.reduce((a,r)=>a+r.food,0)/8),'pr',Math.round(rs.reduce((a,r)=>a+r.pr,0)/8),'un',Math.round(rs.reduce((a,r)=>a+r.un,0)/8),'au',Math.round(rs.reduce((a,r)=>a+r.au,0)/8),'army',Math.round(G.army),'morale',Math.round(G.morale),'rep',Math.round(G.rep),'att',Math.round(G.att),'pow',JSON.stringify(Object.fromEntries(Object.entries(G.pow).map(([k,v])=>[k,Math.round(v)]))),'sits',G.sit.map(s=>s.k).join(','))}
 X.endMonth()}
