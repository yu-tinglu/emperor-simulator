const fs=require('fs');const vm=require('vm');
const code=['core.js','sim.js'].map(f=>fs.readFileSync(f,'utf8')).join('\n')+';this.__x={newGame,endMonth,alivePs,emp,age,nm,dateStr,get G(){return G}}';
const c={console,Math};vm.createContext(c);vm.runInContext(code,c);const X=c.__x;
for(const scn of ['a','b','c']){
 for(let seed=1;seed<=3;seed++){
  X.newGame({scn,seed:seed*977,name:'測試'});let m=0;
  try{while(m<1200&&!X.G.over){X.endMonth();m++}}catch(e){console.log('ERR',scn,seed,m,e.stack.split('\n').slice(0,4).join('|'));continue}
  const G=X.G;console.log(scn,seed,'months',m,'over',G.over&&G.over.type,'emps',G.emps.length,'tre',Math.round(G.tre),'mind',Math.round(G.mind),'auth',Math.round(G.auth),'living',X.alivePs().length,'persons',Object.keys(G.P).length,'sit',G.sit.length,'memo',G.memo.length);
 }}
