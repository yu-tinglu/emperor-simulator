const fs=require('fs'),vm=require('vm');
const files=['core.js','sim.js','act.js','story.js','world.js'];
let src=files.map(f=>fs.readFileSync(f,'utf8')).join('\n');
const ctx={console,Math,Date,JSON,localStorage:{getItem(){return null},setItem(){}}};vm.createContext(ctx);
vm.runInContext(src+`;newGame({scn:'a',name:'x'});for(let i=0;i<30;i++)endMonth();
const s=JSON.stringify(G);const g=JSON.parse(s);['memo','snap','arcs','deeds','chaps','ach','xl','zeit','mh','inst','fd'].forEach(k=>delete g[k]);for(const r of Object.values(g.reg)){delete r.ref;delete r.mil;delete r.loy}for(const f of Object.values(g.foe)){delete f.att}
G=migrate(g);let e=0;try{for(let i=0;i<60;i++)endMonth()}catch(x){e=String(x.stack).slice(0,300)}
globalThis.__r=[e,G.t,G.sc]`,ctx);
console.log(ctx.__r)
