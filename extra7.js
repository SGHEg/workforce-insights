(function(){
/* DEPT BREAKDOWN: click a department (in a division page or the top-10 list) to see its positions, sections, people, interns and movement.
   Reads only the published rows (Department, PosDept, Master_Count, Hire, Resign); no names, no employee numbers. */
var W=window.__wi;if(!W||!W.f){return;}
var F=W.f,S=W.S,PANEL=null;
function norm(s){return String(s==null?'':s).replace(/\s+/g,' ').trim().toLowerCase();}
var ALIAS={'gw':['gw','gw1','gw2','gw3','gw4'],'icu & sicu & micu & new icu':['icu','sicu','micu','new icu'],'or & anesthesia':['or','anesthesia']};
function members(d){var n=norm(d);return ALIAS[n]||[n];}
var CAT={'nursing':'Nursing','nursing support':'Nursing','nursing internship':'Nursing','dr':'Doctors','operation':'Operation','allied health':'Allied Health','admin':'Admin','corporate management':'Admin'};
function divOf(c){return CAT[norm(c)]||'';}
function esc(s){return F.esc(s);}
function num(v){return +v||0;}
function css(){if(document.getElementById('dbkcss')){return;}var s=document.createElement('style');s.id='dbkcss';s.textContent=
'.ddrow{cursor:pointer}.ddrow:hover td{background:var(--soft)}.ddrow td:first-child::after{content:" \\203A";color:var(--mut);font-weight:700}'+
'#dbk{position:fixed;inset:0;z-index:9000;background:rgba(10,18,14,.55);display:flex;justify-content:center;align-items:flex-start;overflow:auto;padding:24px 12px}'+
'#dbk .pn{background:var(--bg);color:var(--ink);border:1px solid var(--line);border-radius:14px;width:min(1000px,100%);padding:16px 18px;box-shadow:0 18px 60px rgba(0,0,0,.35)}'+
'#dbk .hh{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:12px}#dbk h1{margin:2px 0 0;font-size:22px}'+
'#dbk .x{border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:9px;padding:6px 12px;cursor:pointer;font-size:13px}'+
'#dbk .tag{display:inline-block;background:var(--soft);border:1px solid var(--line);border-radius:999px;padding:2px 10px;font-size:12px;margin-right:6px}'+
'#dbk .ins2{margin:0 0 12px;padding-left:18px}#dbk .ins2 li{margin:3px 0}'+
'#dbk .sp{display:flex;flex-wrap:wrap;gap:4px 10px;align-items:center;margin:8px 0;font-size:13px}#dbk .sp b{min-width:92px;font-weight:600}#dbk .sb{flex:1 1 120px;height:12px;background:var(--soft);border-radius:6px;overflow:hidden;display:flex}#dbk .sb i{display:block;height:100%}#dbk .sp>span{flex:0 1 auto;white-space:normal}'+
'#dbk .k b span{font-size:inherit;font-weight:inherit}#dbk .neg{color:#d64545}#dbk .pos{color:#1aa37a}#dbk .kpis{grid-template-columns:repeat(auto-fit,minmax(130px,1fr))}#dbk .g2{grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))}'+
'#dbk .mv{display:flex;gap:6px;align-items:flex-end;height:90px;margin:8px 0 2px}#dbk .mv div{flex:1;display:flex;gap:2px;align-items:flex-end;height:100%}#dbk .mv i{flex:1;display:block;min-height:1px;border-radius:3px 3px 0 0}#dbk .ml{display:flex;gap:6px;font-size:11px;color:var(--mut)}#dbk .ml span{flex:1;text-align:center}'+
'.dfade{opacity:.6}@media print{#dbk{display:none!important}}';document.head.appendChild(s);}
function decorate(){css();[].slice.call(document.querySelectorAll('table')).forEach(function(t){var h=t.querySelector('tr');if(!h||(h.children[0].textContent||'').trim()!=='Department'){return;}
 [].slice.call(t.querySelectorAll('tr')).forEach(function(r,i){if(i===0||r.classList.contains('ddrow')||r.children.length<3){return;}r.classList.add('ddrow');r.title='Click for the breakdown';});});}
function bar(parts){var tot=parts.reduce(function(t,p){return t+p[1];},0)||1;return '<div class="sb">'+parts.map(function(p){return '<i style="width:'+(p[1]/tot*100)+'%;background:'+p[2]+'" title="'+esc(p[0])+' '+p[1]+'"></i>';}).join('')+'</div>';}
function csv(rows){var q=function(v){return '"'+String(v==null?'':v).replace(/"/g,'""')+'"';};return '﻿'+rows.map(function(r){return r.map(q).join(',');}).join('\r\n');}
function close(){if(PANEL){PANEL.parentNode.removeChild(PANEL);PANEL=null;document.body.style.overflow='';}}
function open(D,V){var mo=S.mo,br=S.br;if(!mo){return;}
 var dep=F.get('Department',mo,br).filter(function(r){return r.Group===V&&norm(r.Item)===norm(D);})[0];if(!dep){return;}
 var mem=members(D),R=F.R();
 var pd=F.get('PosDept',mo,br).filter(function(r){var p=String(r.Item).split(' @ ');return r.Group===V&&norm(p[1])===norm(D);});
 var mc=R.filter(function(r){if(r.Dataset!=='Master_Count'||r.Month!==mo){return false;}if(br&&br!=='ALL'&&r.Branch!==br){return false;}if(divOf(r.Group)!==V&&r.Group!==V){return false;}var p=String(r.Item).split(' @ ');return mem.indexOf(norm(p[0]))>=0||mem.indexOf(norm(p[1]))>=0;});
 var cnt=0,int=0,ml=0,fm=0,ins=0,nin=0,secs={},poss={};
 mc.forEach(function(r){var p=String(r.Item).split(' @ '),c=num(r.Current),t=num(r.Total);cnt+=c;int+=t;ml+=num(r.Male);fm+=num(r.Female);ins+=num(r.Insured);nin+=num(r.Not_Insured);var s=p[1]||'-';secs[s]=secs[s]||{c:0,t:0};secs[s].c+=c;secs[s].t+=t;var k=norm(p[2]);poss[k]=poss[k]||{n:p[2],c:0};poss[k].c+=c;});
 var rows=pd.map(function(r){var a=num(r.Approved),c=num(r.Current);return {n:String(r.Item).split(' @ ')[0],a:a,c:c,g:c-a,f:a>0?c/a:null,x:0};});
 var have={};rows.forEach(function(r){have[norm(r.n)]=1;});
 Object.keys(poss).forEach(function(k){if(!have[k]&&poss[k].c>0){rows.push({n:poss[k].n,a:0,c:poss[k].c,g:poss[k].c,f:null,x:1});}});
 rows.sort(function(a,b){return a.g-b.g||String(a.n).localeCompare(String(b.n));});
 var below=rows.filter(function(r){return r.a>0&&r.c<r.a;}).length,worst=rows.filter(function(r){return r.g<0;})[0];
 var ye=String(mo).slice(0,4),H=[0,0,0,0,0,0,0,0,0,0,0,0],L=[0,0,0,0,0,0,0,0,0,0,0,0],cl={},nh=0,nl=0;
 var inDep=function(r){var t=String(r.Item).split(' @ ');return divOf(r.Group)===V&&(mem.indexOf(norm(t[0]))>=0||mem.indexOf(norm(t[2]))>=0);};
 R.forEach(function(r){if((r.Dataset!=='Hire'&&r.Dataset!=='Resign')||String(r.Month).slice(0,4)!==ye||r.Month>mo){return;}if(br&&br!=='ALL'&&r.Branch&&r.Branch!==br){return;}if(!inDep(r)){return;}var mi=+String(r.Month).slice(5,7)-1;if(r.Dataset==='Hire'){H[mi]++;nh++;}else{L[mi]++;nl++;var c=norm(String(r.Item).split(' @ ')[3])||'counted';cl[c]=(cl[c]||0)+1;}});
 var mx=Math.max.apply(null,H.concat(L).concat([1])),MN=['J','F','M','A','M','J','J','A','S','O','N','D'],last=+String(mo).slice(5,7);
 var tot=cnt||dep.Current,pct=function(a,b){return b?Math.round(a/b*100)+'%':'-';};
 var ul='<ul class="ins2"><li><b>'+F.n0(dep.Current)+'</b> people against <b>'+F.n0(dep.Approved)+'</b> approved ('+F.pc(dep.Fill)+' filled).</li>'+
  (worst?'<li>Biggest gap: <b>'+esc(worst.n)+'</b> ('+Math.round(worst.g)+'), and <b>'+below+'</b> of '+rows.length+' positions are below approved.</li>':'<li>No position is below approved.</li>')+
  (int?'<li><b>+'+int+' interns/trainees</b> work here and are not counted.</li>':'')+
  (cnt&&Math.round(cnt)!==Math.round(num(dep.Current))?'<li class="mut">The Master lists '+F.n0(cnt)+' people under this name; the difference comes from how the names match the approved list.</li>':'')+'</ul>';
 var kp=function(l,v,c){return '<div class="k"><div><span>'+l+'</span><b>'+v+'</b></div></div>';};
 var kpis='<div class="kpis">'+kp('APPROVED',F.n0(dep.Approved))+kp('CURRENT',F.n0(dep.Current))+kp('NET GAP',F.gp(dep.Gap))+kp('FILL RATE',F.pc(dep.Fill))+(int?'<div class="k dfade"><div><span>INTERNS (NOT COUNTED)</span><b>+'+int+'</b></div></div>':'')+'</div>';
 var tb='<div class="tw"><table><tr><th>Position</th><th class="n">Approved</th><th class="n">Current</th><th class="n">Net gap</th><th class="n">Fill rate</th><th>Status</th></tr>'+rows.map(function(r){return '<tr><td>'+esc(r.n)+'</td><td class="n">'+F.n0(r.a)+'</td><td class="n">'+F.n0(r.c)+'</td><td class="n">'+F.gp(r.g)+'</td><td class="n">'+F.mt(r.f)+F.pc(r.f)+'</td><td>'+(r.x?'<span class="pill mid">Not on approved list</span>':F.stt(r.f))+'</td></tr>';}).join('')+'</table></div>';
 var sk=Object.keys(secs).sort(function(a,b){return secs[b].c-secs[a].c;}),smx=Math.max.apply(null,sk.map(function(k){return secs[k].c;}).concat([1]));
 var secH=sk.length>1?'<div class="card"><h2>Sections inside</h2>'+sk.map(function(k){return '<div class="sp"><b>'+esc(k)+'</b><div class="sb"><i style="width:'+(secs[k].c/smx*100)+'%;background:#2f6fd1"></i></div><span>'+secs[k].c+(secs[k].t?' <span class="mut dfade">+'+secs[k].t+' interns</span>':'')+'</span></div>';}).join('')+'</div>':'';
 var ppl='<div class="card"><h2>People</h2><div class="sp"><b>Gender</b>'+bar([['Male',ml,'#2f6fd1'],['Female',fm,'#d6609b']])+'<span>'+ml+' M · '+fm+' F ('+pct(fm,ml+fm)+' female)</span></div><div class="sp"><b>Insurance</b>'+bar([['Insured',ins,'#1aa37a'],['Not insured',nin,'#c9d1cc']])+'<span>'+pct(ins,ins+nin)+' insured</span></div></div>';
 var mv='<div class="card"><h2>Movement · Jan to '+esc(F.mlabel(mo))+'</h2><p class="mut" style="margin:0 0 4px"><b style="color:#1aa37a">'+nh+'</b> hires · <b style="color:#d64545">'+nl+'</b> leavers · net <b>'+(nh-nl)+'</b>'+(nl?' · '+Object.keys(cl).map(function(k){return cl[k]+' '+esc(k);}).join(', '):'')+'</p><div class="mv">'+H.slice(0,last).map(function(h,i){return '<div><i style="height:'+(h/mx*100)+'%;background:#1aa37a" title="'+h+' hires"></i><i style="height:'+(L[i]/mx*100)+'%;background:#d64545" title="'+L[i]+' leavers"></i></div>';}).join('')+'</div><div class="ml">'+MN.slice(0,last).map(function(m){return '<span>'+m+'</span>';}).join('')+'</div><p class="mut" style="margin:6px 0 0;font-size:12px">Green = hires, red = leavers, per month.</p></div>';
 close();PANEL=document.createElement('div');PANEL.id='dbk';PANEL.setAttribute('role','dialog');
 PANEL.innerHTML='<div class="pn"><div class="hh"><div><span class="tag">'+esc(V)+'</span><span class="tag">'+esc(F.mlabel(mo))+'</span><h1>'+esc(dep.Item)+'</h1></div><div><button class="x" data-dl="1">Download CSV</button> <button class="x" data-x="1">Close ✕</button></div></div>'+ul+kpis+'<div class="g2">'+ppl+mv+'</div>'+secH+'<div class="card"><h2>Positions ('+rows.length+')</h2>'+tb+'</div></div>';
 document.body.appendChild(PANEL);document.body.style.overflow='hidden';
 PANEL.addEventListener('click',function(e){if(e.target===PANEL||(e.target.getAttribute&&e.target.getAttribute('data-x'))){close();}else if(e.target.getAttribute&&e.target.getAttribute('data-dl')){var d=[['Position','Approved','Current','Net gap','Status']].concat(rows.map(function(r){return [r.n,r.a,r.c,r.g,r.x?'Not on approved list':''];}));var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv(d)],{type:'text/csv;charset=utf-8'}));a.download='Breakdown_'+String(dep.Item).replace(/[^A-Za-z0-9]+/g,'_')+'_'+mo+'.csv';document.body.appendChild(a);a.click();document.body.removeChild(a);}});}
document.addEventListener('keydown',function(e){if(e.key==='Escape'){close();}});
document.addEventListener('click',function(e){var r=e.target&&e.target.closest?e.target.closest('tr.ddrow'):null;if(!r||(e.target.closest&&e.target.closest('a,button'))){return;}var t=r.closest('table'),hd=[].slice.call(t.querySelector('tr').children).map(function(x){return (x.textContent||'').trim().replace(/[ ▲▼]+$/,'');}),di=hd.indexOf('Division'),V=di>=0?(r.children[di].textContent||'').trim():S.vw;try{open((r.children[0].textContent||'').replace(/\s*›\s*$/,'').trim(),V);}catch(x){}},true);
var tm=null;function sched(){if(tm){return;}tm=setTimeout(function(){tm=null;try{decorate();}catch(e){}},120);}
try{new MutationObserver(sched).observe(document.body,{childList:true,subtree:true});sched();}catch(e){}
window.WIX=window.WIX||{};window.WIX.deptBreakdown=open;
})();