/* Campus engine: data, graph algorithms and the Moksha planner. No DOM code here, so any UI (for example one exported from Google Stitch) can use it. */
/* Campus engine: data, graph algorithms and the Moksha planner. No DOM code here, so any UI (for example one exported from Google Stitch) can use it. */
export const W=655;
export const H=771; /* map space = pixel grid of the NSUT campus illustration */
export const N=`gate|Main Gate|Gate|117|620|Main entrance.
north|North Gate|Gate|73|150|
design|Design Block|Academic|75|60|
jcb|JC Bose Hostel (GH)|Hostel|158|87|Girls hostel.
kav|Kaveri Hostel (GH)|Hostel|390|73|Girls hostel.
ram|Ramanujan Hostel (BH)|Hostel|147|168|Boys hostel.
rmn|Raman Hostel (BH)|Hostel|222|153|Boys hostel.
ary|Aryabhata Hostel (BH)|Hostel|153|212|Boys hostel.
bhs|Bhaskar Hostel (BH)|Hostel|232|197|Boys hostel.
mandir|Mandir|Amenity|412|195|
stat|Stationery|Amenity|342|236|
apj|APJ Complex|Academic|281|245|
stc|Student Center|Amenity|285|293|
smart|Smart Block|Academic|332|283|
mdairy|Mother Dairy|Amenity|228|265|
amul|Amul Ground|Ground|228|317|
park|Parking|Gate|150|345|
work|Workshops|Academic|411|268|
clinic|Clinic|Health|394|325|
ftech|F. Tech Block|Academic|422|365|
moksha|Moksha Ground|Ground|272|380|Open ground used for Moksha.
nescape|NESCAPE|Amenity|247|425|
b6|Block-6|Academic|335|435|
nl1|NESCI Lawns I|Ground|178|437|
adm|Admin|Administration|265|480|
sac|SAC|Amenity|400|462|
gym|Gym|Sports|435|470|
lib|Library|Library|430|490|
nl2|NESCI Lawns II|Ground|183|543|
b4|Block-4|Academic|310|535|
b5|Block-5|Academic|360|535|
cbt|CBT Block|Academic|335|565|
tnp|TNP|Administration|455|597|
tnpp|TNP Park|Ground|395|592|
guest|Guest House|Amenity|333|650|
alak|Alaknanda Hostel (GH)|Hostel|448|657|Girls hostel.
sar|Saraswati Hostel (GH)|Hostel|428|705|Girls hostel.
hydro|Hydroponics Facility|Academic|362|733|
spt|Sports Ground|Sports|527|628|
sp0||J|90|128|
spN||J|96|165|
sp1||J|104|250|
sp2||J|110|382|
sp3||J|127|520|
spG||J|137|620|
sp4||J|143|677|
sp5||J|153|737|
sp6||J|147|767|
tjb||J|150|121|
tv1||J|168|118|
tv2||J|293|113|
tk||J|373|97|
ev1||J|390|110|
ev2||J|394|170|
jm||J|395|217|
v1a||J|176|150|
v1b||J|186|200|
v2a||J|301|170|
e1p||J|150|260|
e1a||J|193|251|
e1b||J|243|240|
e1c||J|309|229|
e1d||J|370|222|
d1a||J|255|275|
p1a||J|163|285|
e2a||J|157|383|
e2b||J|193|376|
e2c||J|217|372|
e2d||J|223|347|
e2e||J|240|332|
e2f||J|262|326|
e2m||J|290|321|
e2g||J|320|318|
e2h||J|377|312|
jw||J|414|321|
na1||J|226|430|
na2||J|235|498|
na3||J|237|553|
na4||J|187|570|
enl||J|190|510|
ae||J|295|487|
circ||J|335|482|
ce||J|335|527|
re||J|382|472|
f1a||J|325|360|
f1b||J|341|391|
f1c||J|360|415|
m||J|378|437|
cv||J|381|352|
c1a||J|404|345|
c1b||J|396|365|
c1c||J|388|395|
er1||J|447|350|
er2||J|460|372|
er3||J|458|400|
er4||J|465|475|
er5||J|474|517|
er6||J|485|605|
er6b||J|491|630|
er7||J|497|680|
er8||J|502|765|
eb1||J|527|517|
eb2||J|545|502|
eb3||J|570|485|
eb4||J|610|480|
gr1||J|206|667|
gr2||J|303|646|
gr3||J|363|636|
gr3b||J|395|627|
gr4||J|440|617|
gl2||J|308|672|
gl3||J|323|680|
gl4||J|367|667|
pl1||J|208|723|
pl2||J|210|758|
off1||J|368|767|
off2||J|433|767|`.split('\n').map(l=>{const[id,n,c,x,y,d]=l.split('|');return{id,n,c,x:+x,y:+y,d:d||''}});
export const NM={};N.forEach(n=>NM[n.id]=n);
export const P=id=>NM[id];
export const COL={Gate:'#64748b',Administration:'#5b3fd9',Academic:'#14a085',Library:'#e8590c',Hostel:'#7c3aed',Amenity:'#f59f00',Health:'#d6336c',Sports:'#2f9e44',Ground:'#0d9488',J:'#94a3b8'};
export const LAWNS=[[272,380,55,35],[178,437,50,48],[183,543,45,22],[228,317,30,20],[525,585,60,45],[243,610,80,35],[353,157,32,40]];
export const E='sp0-spN spN-sp1 sp1-sp2 sp2-sp3 sp3-spG spG-sp4 sp4-sp5 sp5-sp6 design-sp0 north-spN gate-spG sp0-tjb tjb-tv1 tv1-tv2 tv2-tk tk-ev1 ev1-ev2 ev2-jm jcb-tjb tv1-v1a v1a-v1b v1b-e1a tv2-v2a v2a-e1c sp1-e1p e1p-e1a e1a-e1b e1b-e1c e1c-e1d e1d-jm e1b-d1a d1a-e2f e1p-p1a p1a-e2b sp2-e2a e2a-e2b e2b-e2c e2c-e2d e2d-e2e e2e-e2f e2f-e2m e2m-e2g e2g-e2h e2h-jw e2c-na1 na1-na2 na2-na3 na3-na4 sp3-enl enl-na2 ae-circ circ-re b6-circ circ-ce e2g-f1a f1a-f1b f1b-f1c f1c-m m-re e2h-cv cv-f1b cv-c1b jw-c1a c1a-c1b c1b-c1c c1c-m work-jw jw-er1 er1-er2 er2-er3 er3-er4 er4-er5 er5-er6 er6-er6b er6b-er7 er7-er8 er5-eb1 eb1-eb2 eb2-eb3 eb3-eb4 sp4-gr1 gr1-gr2 gr2-gr3 gr3-gr3b gr3b-gr4 gr4-er6 gr2-gl2 gl2-gl3 gl3-gl4 gl4-gr3 gr1-pl1 pl1-pl2 sp5-pl1 sp6-pl2 hydro-off1 sar-off2 kav~tk ram~v1a rmn~v1a ary~v1b bhs~v1b mandir~jm stat~e1d apj~e1c mdairy~e1b stc~e2m smart~e2g amul~e2e park~e2a moksha~e2f nescape~na1 nl1~na1 nl2~na4 adm~na2 adm~ae b4~ce b5~ce cbt~ce sac~re gym~re lib~re clinic~jw ftech~c1b tnp~gr4 tnpp~gr3b guest~gl3 alak~gr4 sar~alak hydro~gl4 spt~er6b'.split(' ').map((s,i)=>{const[,a,k,b]=s.match(/^(\w+)([-~])(\w+)$/);return{i,a,b,acc:1,blk:0,link:k==='~'?1:0,w:Math.round(Math.hypot(P(a).x-P(b).x,P(a).y-P(b).y))}});
export const EM={};E.forEach(e=>{EM[e.a+'|'+e.b]=e;EM[e.b+'|'+e.a]=e});
export const S={tab:'nav',from:'gate',to:null,algo:'dijkstra',acc:false,q:'',route:null,sel:null,ed:null,mst:null,mk:'',day:1,pool:{sec:40,vol:60,tech:12,med:6},lq:'',vb:[0,0,W,H]};

/* ---------- Data structures & algorithms ---------- */
export class MinHeap{constructor(){this.a=[]}get n(){return this.a.length}
push(k,v){const a=this.a;a.push([k,v]);let i=a.length-1;while(i>0){const p=(i-1)>>1;if(a[p][0]<=a[i][0])break;[a[p],a[i]]=[a[i],a[p]];i=p}}
pop(){const a=this.a,t=a[0],l=a.pop();if(a.length){a[0]=l;let i=0;for(;;){let c=2*i+1;if(c>=a.length)break;if(c+1<a.length&&a[c+1][0]<a[c][0])c++;if(a[i][0]<=a[c][0])break;[a[i],a[c]]=[a[c],a[i]];i=c}}return t}}
export function graph(){const g={};N.forEach(n=>g[n.id]=[]);E.forEach(e=>{if(e.blk||(S.acc&&!e.acc))return;g[e.a].push({to:e.b,w:e.w});g[e.b].push({to:e.a,w:e.w})});return g}
export function build(par,t,vis){if(!(t in par))return{path:null,vis};const p=[];for(let c=t;c!==null;c=par[c])p.push(c);return{path:p.reverse(),vis}}
export const ALG={
dijkstra(g,s,t){const d={[s]:0},par={[s]:null},h=new MinHeap(),vis=[],done=new Set();h.push(0,s);
 while(h.n){const[k,u]=h.pop();if(done.has(u))continue;done.add(u);vis.push(u);if(u===t)break;
  for(const{to,w}of g[u])if(d[to]===undefined||k+w<d[to]){d[to]=k+w;par[to]=u;h.push(d[to],to)}}
 return build(par,t,vis)},
bfs(g,s,t){const par={[s]:null},q=[s],vis=[];while(q.length){const u=q.shift();vis.push(u);if(u===t)break;
 for(const{to}of g[u])if(!(to in par)){par[to]=u;q.push(to)}}return build(par,t,vis)},
dfs(g,s,t){const par={},st=[[s,null]],vis=[],seen=new Set();while(st.length){const[u,p]=st.pop();if(seen.has(u))continue;seen.add(u);par[u]=p;vis.push(u);if(u===t)break;
 for(const{to}of g[u])if(!seen.has(to))st.push([to,u])}return build(par,t,vis)}};
export const NAMES={dijkstra:'Dijkstra (shortest)',bfs:'BFS (fewest stops)',dfs:'DFS (any path)'};
export function pcost(p){let c=0;for(let i=0;i<p.length-1;i++)c+=EM[p[i]+'|'+p[i+1]].w;return c}
export function compute(algo=S.algo,reps=40){const g=graph();const t0=performance.now();let r;for(let i=0;i<reps;i++)r=ALG[algo](g,S.from,S.to);
 r.ms=(performance.now()-t0)/reps;r.cost=r.path?pcost(r.path):0;return r}
export function mst(kind){const es=E.filter(e=>!e.blk),pick=[];
 if(kind==='kruskal'){const p={};N.forEach(n=>p[n.id]=n.id);const f=x=>p[x]===x?x:p[x]=f(p[x]);
  [...es].sort((a,b)=>a.w-b.w).forEach(e=>{const A=f(e.a),B=f(e.b);if(A!==B){p[A]=B;pick.push(e)}})}
 else{const h=new MinHeap(),inn=new Set();h.push(0,{n:'gate',e:null});
  while(h.n){const{n,e}=h.pop()[1];if(inn.has(n))continue;inn.add(n);if(e)pick.push(e);
   es.forEach(x=>{const o=x.a===n?x.b:x.b===n?x.a:null;if(o&&!inn.has(o))h.push(x.w,{n:o,e:x})})}}
 return pick}
/* ---------- Moksha fest planner: venue allocation + staff allocation ---------- */
export const VEN=[{n:'Main Auditorium',cap:800,node:'adm'},{n:'SAC',cap:300,node:'sac'},{n:'Student Center',cap:200,node:'stc'},{n:'Amul Ground',cap:400,node:'amul'},{n:'NESCI Lawns II',cap:500,node:'nl2'},{n:'NESCI Lawns I',cap:800,node:'nl1'},{n:'Sports Ground',cap:2500,node:'spt'},{n:'Moksha Ground',cap:3000,node:'moksha'}];
export const EV=[{n:'Celebrity Pro Night',a:2500,d:3,s:18,h:3},{n:'Battle of Bands',a:900,d:1,s:17,h:3},{n:'Dance Competition',a:700,d:2,s:15,h:3},{n:'Fashion Show',a:500,d:2,s:18,h:2},{n:'Stand-up Comedy',a:400,d:1,s:14,h:2},{n:'Nukkad Natak',a:250,d:2,s:11,h:2},{n:'Dramatics',a:200,d:1,s:11,h:2},{n:'Quiz Finals',a:120,d:1,s:12,h:2},{n:'Poetry Slam',a:90,d:3,s:11,h:2},{n:'Open Mic',a:150,d:2,s:12,h:2}];
export const ROLES={sec:'Security',vol:'Volunteers',tech:'Tech crew',med:'Medical'};
export const scale=a=>a>=1500?'Mega':a>=500?'Large':a>=150?'Medium':'Small';
export const need=e=>({sec:Math.ceil(e.a/(e.a>=1500?30:50)),vol:Math.ceil(e.a/40),tech:1+Math.ceil(e.a/500),med:e.a>=1500?4:e.a>=500?2:e.a>=150?1:0});
export const gd=id=>{const r=ALG.dijkstra(graph(),'gate',id);return r.path?pcost(r.path):null};
export function plan(){const bz={},rem={},vs=[...VEN].sort((a,b)=>a.cap-b.cap),k=(d,h)=>d+'-'+h;
 return [...EV].sort((a,b)=>b.a-a.a).map(e=>{
  /* best fit: smallest free venue whose capacity covers the crowd */
  const v=vs.find(v=>v.cap>=e.a&&!(bz[v.n]||[]).some(x=>x.d===e.d&&e.s<x.s+x.h&&x.s<e.s+e.h));
  const n=need(e),got={};
  if(v){(bz[v.n]=bz[v.n]||[]).push(e);
   for(const r in n){let m=n[r];for(let t=e.s;t<e.s+e.h;t++)m=Math.min(m,(rem[k(e.d,t)]=rem[k(e.d,t)]||{...S.pool})[r]);
    got[r]=m;for(let t=e.s;t<e.s+e.h;t++)rem[k(e.d,t)][r]-=m}}
  return{e,v,n,got}})}
export const BOOKS=[['Introduction to Algorithms','Cormen','algorithms graphs dp'],['Data Structures in C','Tanenbaum','stacks trees hashing'],['Computer Organization','Hamacher','pipeline architecture'],['Operating System Concepts','Silberschatz','processes memory'],['Database System Concepts','Korth','sql indexing'],['Computer Networks','Forouzan','routing tcp'],['Engineering Mathematics','Kreyszig','calculus matrices'],['Organic Chemistry','Morrison','reactions'],['Principles of Economics','Mankiw','markets'],['Wings of Fire','Kalam','biography india'],['Clean Code','Martin','software design'],['Artificial Intelligence','Russell','search learning']]
 .map((b,i)=>({id:'BK'+(100+i),t:b[0],a:b[1],k:b[2],av:i%4!==3}));
export const IDX=new Map();BOOKS.forEach(b=>(b.t+' '+b.a+' '+b.k).toLowerCase().split(/\W+/).filter(Boolean).forEach(w=>{if(!IDX.has(w))IDX.set(w,new Set());IDX.get(w).add(b.id)}));
export function lsearch(q){const ts=q.toLowerCase().split(/\W+/).filter(Boolean);if(!ts.length)return BOOKS;let r=null;
 ts.forEach(t=>{const m=new Set();IDX.forEach((s,w)=>{if(w.startsWith(t))s.forEach(x=>m.add(x))});r=r?new Set([...r].filter(x=>m.has(x))):m});return BOOKS.filter(b=>r.has(b.id))}