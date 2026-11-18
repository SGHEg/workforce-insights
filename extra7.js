(function(){
/* DEPT BREAKDOWN: click a department (in a division page or the top-10 list) to see its positions, sections, people, interns and movement.
   Reads only the published rows (Department, PosDept, Master_Count, Hire, Resign); no names or employee numbers are published.
   NAMES LIST: 'Download names' reads the Master sheet of the workbook the user picks ON THIS COMPUTER (never uploaded); latest month only. */
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
'#dbk .sp{width:auto;height:auto;display:flex;flex-wrap:wrap;gap:4px 10px;align-items:center;margin:8px 0;font-size:13px}#dbk .sp b{min-width:92px;font-weight:600}#dbk .sb{flex:1 1 120px;height:12px;background:var(--soft);border-radius:6px;overflow:hidden;display:flex}#dbk .sb i{display:block;height:100%}#dbk .sp>span{flex:0 1 auto;white-space:normal}'+
'#dbk .k b span{font-size:inherit;font-weight:inherit}#dbk .neg{color:#d64545}#dbk .pos{color:#1aa37a}#dbk .kpis{grid-template-columns:repeat(auto-fit,minmax(130px,1fr))}#dbk .g2{grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))}'+
'#dbk .mv{display:flex;gap:6px;align-items:flex-end;height:90px;margin:8px 0 2px}#dbk .mv div{flex:1;display:flex;gap:2px;align-items:flex-end;height:100%}#dbk .mv i{flex:1;display:block;min-height:1px;border-radius:3px 3px 0 0}#dbk .ml{display:flex;gap:6px;font-size:11px;color:var(--mut)}#dbk .ml span{flex:1;text-align:center}'+
'#dbk .x.pri{background:#1aa37a;border-color:#1aa37a;color:#fff;font-weight:600}#dbk .hb{display:flex;flex-wrap:wrap;gap:6px;justify-content:flex-end}'+
'#dbk .nt{display:none;align-items:flex-start;gap:10px;margin:0 0 12px;padding:10px 14px;border-radius:10px;border:1px solid var(--line);border-left:4px solid #2f6fd1;background:var(--card);font-size:13px}#dbk .nt.on{display:flex}#dbk .nt.w{border-left-color:#e0a100}#dbk .nt.e{border-left-color:#d64545}#dbk .nt.ok{border-left-color:#1aa37a}#dbk .nt .ic{font-size:18px;line-height:1}#dbk .nt b{display:block;margin-bottom:2px}#dbk .nt .x{margin-top:8px}'+
'.dfade{opacity:.6}@media print{#dbk{display:none!important}}';document.head.appendChild(s);}
function decorate(){css();[].slice.call(document.querySelectorAll('table')).forEach(function(t){var h=t.querySelector('tr');if(!h||(h.children[0].textContent||'').trim()!=='Department'){return;}
 [].slice.call(t.querySelectorAll('tr')).forEach(function(r,i){if(i===0||r.classList.contains('ddrow')||r.children.length<3){return;}r.classList.add('ddrow');r.title='Click for the breakdown';});});}
function bar(parts){var tot=parts.reduce(function(t,p){return t+p[1];},0)||1;return '<div class="sb">'+parts.map(function(p){return '<i style="width:'+(p[1]/tot*100)+'%;background:'+p[2]+'" title="'+esc(p[0])+' '+p[1]+'"></i>';}).join('')+'</div>';}
function csv(rows){var q=function(v){return '"'+String(v==null?'':v).replace(/"/g,'""')+'"';};return '﻿'+rows.map(function(r){return r.map(q).join(',');}).join('\r\n');}
/* ---- names list from the workbook on this computer (never uploaded) ---- */
var ROS=null;
function rd16(d,o){return d[o]|(d[o+1]<<8);}function rd32(d,o){return (d[o]|(d[o+1]<<8)|(d[o+2]<<16)|(d[o+3]<<24))>>>0;}
function unzip(buf){var d=new Uint8Array(buf),e=-1;for(var i=d.length-22;i>=Math.max(0,d.length-70000);i--){if(rd32(d,i)===0x06054b50){e=i;break;}}if(e<0){throw new Error('This file is not an Excel workbook.');}
 var n=rd16(d,e+10),o=rd32(d,e+16),F2={};for(var k=0;k<n;k++){if(rd32(d,o)!==0x02014b50){break;}var nl=rd16(d,o+28),xl=rd16(d,o+30),cl=rd16(d,o+32),nm=new TextDecoder().decode(d.subarray(o+46,o+46+nl));F2[nm]={m:rd16(d,o+10),cs:rd32(d,o+20),lo:rd32(d,o+42)};o+=46+nl+xl+cl;}return {d:d,F:F2};}
async function inf(b){var ds=new DecompressionStream('deflate-raw'),w=ds.writable.getWriter();w.write(b);w.close();return new Uint8Array(await new Response(ds.readable).arrayBuffer());}
async function ent(z,nm){var f=z.F[nm];if(!f){return null;}var d=z.d,s=f.lo+30+rd16(d,f.lo+26)+rd16(d,f.lo+28),raw=d.subarray(s,s+f.cs);return new TextDecoder().decode(f.m===0?raw:await inf(raw));}
function ux(t){return String(t).replace(/&#x([0-9a-f]+);/gi,function(m,h){return String.fromCharCode(parseInt(h,16));}).replace(/&#(\d+);/g,function(m,n){return String.fromCharCode(+n);}).replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&amp;/g,'&');}
function at(s,n){var m=new RegExp('(?:^|\\s)'+n.replace(':','\\:')+'="([^"]*)"').exec(s);return m?m[1]:null;}
function ci(L){var n=0;for(var i=0;i<L.length;i++){n=n*26+(L.charCodeAt(i)-64);}return n-1;}
async function readMaster(buf){var z=unzip(buf),wb=await ent(z,'xl/workbook.xml'),rl=await ent(z,'xl/_rels/workbook.xml.rels');if(!wb||!rl){throw new Error('This file is not an Excel workbook.');}
 var rid=null,m,re=/<sheet\s([^>]*?)\/>/g;while((m=re.exec(wb))){if(ux(at(m[1],'name')||'').trim()==='Master'){rid=at(m[1],'r:id');}}if(!rid){throw new Error('The sheet "Master" was not found in this workbook.');}
 var tg=null,r3=/<Relationship\s([^>]*?)\/>/g;while((m=r3.exec(rl))){if(at(m[1],'Id')===rid){tg=at(m[1],'Target');}}if(!tg){throw new Error('The sheet "Master" could not be opened.');}tg=tg.charAt(0)==='/'?tg.slice(1):'xl/'+tg.replace(/^\.\//,'');
 var ssx=await ent(z,'xl/sharedStrings.xml'),SS=[];if(ssx){var r1=/<si>([\s\S]*?)<\/si>/g;while((m=r1.exec(ssx))){var t='',r2=/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g,k,b=m[1].replace(/<rPh[\s\S]*?<\/rPh>/g,'');while((k=r2.exec(b))){t+=k[1];}SS.push(ux(t));}}
 var sx=await ent(z,tg),G={},rc=/<c\s([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g;if(!sx){throw new Error('The sheet "Master" could not be opened.');}
 while((m=rc.exec(sx))){var ref=at(m[1],'r');if(!ref||!m[2]){continue;}var p=/^([A-Z]+)(\d+)$/.exec(ref);if(!p){continue;}var ty=at(m[1],'t'),v=/<v>([\s\S]*?)<\/v>/.exec(m[2]),val;
  if(ty==='s'){val=v?SS[+v[1]]:'';}else if(ty==='inlineStr'){var it=/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/.exec(m[2]);val=it?ux(it[1]):'';}else if(ty==='str'||ty==='e'){val=v?ux(v[1]):'';}else{val=v?+v[1]:'';}
  var r=+p[2];(G[r]=G[r]||{})[ci(p[1])]=val;}
 var hr=0,H={};for(var q=1;q<=15&&!hr;q++){var row=G[q]||{},idx={};Object.keys(row).forEach(function(c){idx[String(row[c]).trim().toLowerCase()]=+c;});if(idx['id']!=null&&idx['name']!=null&&idx['department']!=null){hr=q;H=idx;}}
 if(!hr){throw new Error('The Master sheet has no ID / Name / Department header.');}
 var want=['id','name','position','section','department','category','nationality','joining date'],miss=want.filter(function(w){return H[w]==null;});if(miss.length){throw new Error('The Master sheet is missing: '+miss.join(', ')+'.');}
 var last=0;Object.keys(G).forEach(function(k){if(+k>last){last=+k;}});var out=[];
 for(var r4=hr+1;r4<=last;r4++){var w=G[r4];if(!w){continue;}var g=function(n){var v=w[H[n]];return v==null?'':v;};if(String(g('id')).trim()===''&&String(g('name')).trim()===''){continue;}out.push(want.map(g));}
 return out;}
function dt(v){if(typeof v==='number'&&v>20000&&v<80000){return new Date(Math.round((v-25569)*86400000)).toISOString().slice(0,10);}return String(v==null?'':v).trim();}
function isIntern(p){return /^[39]/.test(String(p[0]).trim())||/intern/i.test(String(p[5]))||/\bintern(s|ship)?\b/i.test(String(p[2]));}
function latestMonth(){var mx='';F.R().forEach(function(r){if(r.Dataset==='Department'&&r.Month>mx){mx=r.Month;}});return mx;}
function note(kind,ic,title,body,btn){var n=PANEL&&PANEL.querySelector('.nt');if(!n){return;}n.className='nt on '+kind;n.innerHTML='<span class="ic">'+ic+'</span><div><b>'+esc(title)+'</b>'+body+(btn?'<div>'+btn+'</div>':'')+'</div>';if(n.scrollIntoView){n.scrollIntoView({block:'nearest'});}}
/* division as in MC_Calc: from the Category; an intern with no division takes the division of the first counted person in the same department */
function divs(ros){if(ros.dv){return ros.dv;}var byDep={};ros.forEach(function(p){var d=divOf(p[5]);if(d&&!isIntern(p)){var k=norm(p[4]);if(!(k in byDep)){byDep[k]=d;}}});ros.dv=ros.map(function(p){return divOf(p[5])||(isIntern(p)?(byDep[norm(p[4])]||''):'');});return ros.dv;}
function namesFor(ros,D,V){var mem=members(D),dv=divs(ros);return ros.filter(function(p,i){return dv[i]===V&&(mem.indexOf(norm(p[4]))>=0||mem.indexOf(norm(p[3]))>=0);});}
function namesGo(ctx){var mo=S.mo,ppl=namesFor(ROS.rows,ctx.D,ctx.V),cnt=ppl.filter(function(p){return !isIntern(p);}).length,it=ppl.length-cnt;
  if(!ppl.length){note('e','⚠️','Nobody found under this department','<div>The Master sheet in '+esc(ROS.name)+' has no one with this department or section name.</div>');return;}
  ppl.sort(function(a,b){return isIntern(a)-isIntern(b)||String(a[2]).localeCompare(String(b[2]))||String(a[1]).localeCompare(String(b[1]));});
  var d=[['ID','Name','Position','Section','Department','Category','Nationality','Joining Date','Counted']].concat(ppl.map(function(p){return [p[0],p[1],p[2],p[3],p[4],p[5],p[6],dt(p[7]),isIntern(p)?'No (intern/trainee)':'Yes'];}));
  var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv(d)],{type:'text/csv;charset=utf-8'}));a.download='Names_'+String(ctx.item).replace(/[^A-Za-z0-9]+/g,'_')+'_'+mo+'.csv';document.body.appendChild(a);a.click();document.body.removeChild(a);
  var same=Math.round(cnt)===Math.round(num(ctx.cur));
  note('ok','✅','Downloaded '+cnt+' people'+(it?' + '+it+' interns/trainees':''),'<div>From '+esc(ROS.name)+', read on this computer only; nothing was uploaded.'+(same?'':' The page shows '+F.n0(ctx.cur)+' for this department; the difference comes from how the names match the approved list.')+'</div>');}
function dlNames(ctx){var mo=S.mo,lt=latestMonth();
 if(mo!==lt){note('w','🔒','Names are available for the latest month only ('+F.mlabel(lt)+')','<div>You are looking at '+esc(F.mlabel(mo))+'. The names list always comes from the newest workbook, so older months cannot be downloaded with names.</div>','<button class="x pri" data-go="1">Open '+esc(F.mlabel(lt))+'</button>');return;}
 if(ROS&&ROS.month===mo){namesGo(ctx);return;}
 [].slice.call(document.querySelectorAll('input.dbkf')).forEach(function(x){x.parentNode.removeChild(x);});
 var inp=document.createElement('input');inp.type='file';inp.className='dbkf';inp.accept='.xlsm,.xlsx';inp.style.display='none';document.body.appendChild(inp);
 inp.addEventListener('change',function(){var f=inp.files&&inp.files[0];if(inp.parentNode){inp.parentNode.removeChild(inp);}if(f){useFile(f,ctx);}});
 note('','📂','Choose the workbook for '+F.mlabel(mo),'<div>Pick HR_Workforce_Master_'+mo+'.xlsm, <b style="display:inline">or drag the file and drop it on this window</b>. Names are read on this computer only and are never uploaded. You choose it once; the other departments then download straight away until the page is reloaded.</div>');
 inp.click();}
function useFile(f,ctx){var mo=S.mo;if(mo!==latestMonth()){dlNames(ctx);return;}var fm=/(\d{4})-(\d{2})/.exec(f.name),fmo=fm?fm[1]+'-'+fm[2]:'';
  if(fmo!==mo){note('e','📅','This workbook is for '+(fmo?esc(F.mlabel(fmo)):'an unknown month'),'<div>You picked '+esc(f.name)+'. Choose HR_Workforce_Master_'+mo+'.xlsm (the month on the screen).</div>','<button class="x pri" data-dn="1">Choose again</button>');return;}
  note('','⏳','Reading the Master sheet…','<div>'+esc(f.name)+' is read on this computer only.</div>');
  f.arrayBuffer().then(readMaster).then(function(rows){ROS={month:mo,name:f.name,rows:rows};namesGo(ctx);}).catch(function(e){note('e','⚠️','Could not read the names','<div>'+esc(e&&e.message||e)+' If the file is open in Excel, save it and try again.</div>','<button class="x pri" data-dn="1">Choose again</button>');});}
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
 PANEL.innerHTML='<div class="pn"><div class="hh"><div><span class="tag">'+esc(V)+'</span><span class="tag">'+esc(F.mlabel(mo))+'</span><h1>'+esc(dep.Item)+'</h1></div><div class="hb"><button class="x pri" data-dn="1" title="ID, Name, Position, Section, Department, Category, Nationality, Joining Date">Download names</button><button class="x" data-dl="1">Positions CSV</button><button class="x" data-x="1">Close ✕</button></div></div><div class="nt"></div>'+ul+kpis+'<div class="g2">'+ppl+mv+'</div>'+secH+'<div class="card"><h2>Positions ('+rows.length+')</h2>'+tb+'</div></div>';
 document.body.appendChild(PANEL);document.body.style.overflow='hidden';
 var ctx={D:D,V:V,item:dep.Item,cur:dep.Current};
 PANEL.addEventListener('dragover',function(e){e.preventDefault();});
 PANEL.addEventListener('drop',function(e){e.preventDefault();var f=e.dataTransfer&&e.dataTransfer.files&&e.dataTransfer.files[0];if(f){useFile(f,ctx);}});
 PANEL.addEventListener('click',function(e){var ga=function(n){return e.target.getAttribute?e.target.getAttribute(n):null;};
  if(ga('data-dn')){dlNames(ctx);return;}
  if(ga('data-go')){var lt=latestMonth();try{var sel=[].slice.call(document.querySelectorAll('select')).filter(function(x){return [].some.call(x.options,function(o){return o.value===lt;});})[0];if(sel){sel.value=lt;sel.dispatchEvent(new Event('change',{bubbles:true}));}else{S.mo=lt;W.render();}}catch(x){}setTimeout(function(){open(D,V);},200);return;}
  if(e.target===PANEL||(e.target.getAttribute&&e.target.getAttribute('data-x'))){close();}else if(e.target.getAttribute&&e.target.getAttribute('data-dl')){var d=[['Position','Approved','Current','Net gap','Status']].concat(rows.map(function(r){return [r.n,r.a,r.c,r.g,r.x?'Not on approved list':''];}));var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv(d)],{type:'text/csv;charset=utf-8'}));a.download='Breakdown_'+String(dep.Item).replace(/[^A-Za-z0-9]+/g,'_')+'_'+mo+'.csv';document.body.appendChild(a);a.click();document.body.removeChild(a);}});}
document.addEventListener('keydown',function(e){if(e.key==='Escape'){close();}});
document.addEventListener('click',function(e){var r=e.target&&e.target.closest?e.target.closest('tr.ddrow'):null;if(!r||(e.target.closest&&e.target.closest('a,button'))){return;}var t=r.closest('table'),hd=[].slice.call(t.querySelector('tr').children).map(function(x){return (x.textContent||'').trim().replace(/[ ▲▼]+$/,'');}),di=hd.indexOf('Division'),V=di>=0?(r.children[di].textContent||'').trim():S.vw;try{open((r.children[0].textContent||'').replace(/\s*›\s*$/,'').trim(),V);}catch(x){}},true);
var tm=null;function sched(){if(tm){return;}tm=setTimeout(function(){tm=null;try{decorate();}catch(e){}},120);}
try{new MutationObserver(sched).observe(document.body,{childList:true,subtree:true});sched();}catch(e){}
window.WIX=window.WIX||{};window.WIX.deptBreakdown=open;
})();