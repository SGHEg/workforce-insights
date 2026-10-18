(function(){/* Talent Acquisition Pulse page (sidebar item under Hospital overview) */
var W=window.__wi;if(!W){return;}
var F=W.f,S=W.S,$=function(id){return document.getElementById(id);};
var T=null,busy=false,CC=['#2f6fd1','#1aa37a','#e0a100','#7a5cc7','#d6409f','#d64545','#0e9aa7','#6b7f74'];
var st=document.createElement('style');
st.textContent='.tpc{width:100%;height:auto}.tpleg{display:flex;gap:12px;flex-wrap:wrap;font-size:12px;color:var(--mut);margin-top:6px}.tpleg i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:5px;vertical-align:middle}.cav{background:var(--soft);border-left:3px solid #e0a100;padding:8px 12px;border-radius:8px;font-size:12px;color:var(--mut);margin:0 0 12px;line-height:1.5}.fnd{margin:0;padding-left:18px;line-height:1.7}.fnd li{margin-bottom:4px}.pill.na{background:var(--soft);color:var(--mut)}.tpn{font-size:11px;color:var(--mut)}.hrpt{display:none}.hrph{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin:18px 0 6px}.hrph h3{margin:0}.hrp .chips{margin-bottom:12px}.hrp .chip b{margin-left:5px;opacity:.7}.hrp td.tr,.hrp th.tr{text-align:right}@media print{body.prx header.top,body.prx aside,body.prx #tl,body.prx .foot,body.prx #app>:not(#hrp),body.prx .tbh,body.prx .chips,body.prx .hrph .dlt{display:none!important}body.prx .wrap{display:block!important}body.prx main{width:100%!important;max-width:none!important;margin:0!important;padding:0!important}body.prx .hrpt{display:block;border-bottom:2px solid #1aa37a;margin-bottom:12px;padding-bottom:6px}body.prx .hrpt b{font-size:16px}body.prx .card{break-inside:avoid;box-shadow:none}}';
document.head.appendChild(st);
function esc(s){return F.esc(s);}
function lab(m){return m&&m.length===7?F.mlabel(m):esc(m||'');}
function mshort(m){return m&&m.length===7?F.mlabel(m).split(' ')[0]:esc(m||'');}
var loading=false;
function b64(s){var x=atob(s),u=new Uint8Array(x.length);for(var i=0;i<x.length;i++){u[i]=x.charCodeAt(i);}return u;}
function dec(env,pw){return crypto.subtle.importKey('raw',new TextEncoder().encode(pw.trim()),'PBKDF2',false,['deriveKey']).then(function(k){return crypto.subtle.deriveKey({name:'PBKDF2',salt:b64(env.salt),iterations:env.iter,hash:'SHA-256'},k,{name:'AES-GCM',length:256},false,['decrypt']);}).then(function(key){return crypto.subtle.decrypt({name:'AES-GCM',iv:b64(env.iv)},key,b64(env.data));}).then(function(buf){return new TextDecoder().decode(buf);});}
function fromRows(){var o={};F.R().forEach(function(r){if(r.Dataset!=='Talent'){return;}var j;try{j=JSON.parse(r.Item);}catch(e){return;}var b=r.Branch||'',m=r.Group;if(!m){return;}(o[b]=o[b]||{})[m]=j;});return o;}
function mergeSn(a,b){Object.keys(b||{}).forEach(function(br){a[br]=a[br]||{};Object.keys(b[br]).forEach(function(m){a[br][m]=b[br][m];});});return a;}
function load(){
  loading=true;var snaps=fromRows();
  return fetch('talent.enc?v='+Date.now(),{cache:'no-store'}).then(function(r){return r.ok?r.json():null;}).catch(function(){return null;}).then(function(env){
    if(!env){return 0;}
    var pw='';try{pw=sessionStorage.getItem('wi_pw')||localStorage.getItem('wi_pw')||'';}catch(x){}
    if(!pw){return 0;}
    return dec(env,pw).then(function(t){var j=JSON.parse(t);if(j&&j.snaps){mergeSn(snaps,j.snaps);}return 0;}).catch(function(){return 0;});
  }).then(function(){var n=0;Object.keys(snaps).forEach(function(b){n+=Object.keys(snaps[b]).length;});T={snaps:snaps,why:n?'':'none'};loading=false;if(S.vw==='tp'){W.render();}});
}
function branch(){var B=Object.keys((T&&T.snaps)||{});if(!B.length){return null;}return (S.br!=='ALL'&&T.snaps[S.br])?S.br:B[0];}
function months(){var b=branch();return b?Object.keys(T.snaps[b]).sort():[];}
/* Interns are not recruitment: Internship Program / Nursing Internship / intern positions are left out of every hire figure on this page and shown apart in the Hires report. */
function isInt(g,pos){return /internship/i.test(g||'')||/intern/i.test(pos||'');}
var ADJ={};
function adj(sn,key){
  if(!sn||!sn.cat||!sn.cat.names){return sn;}
  if(ADJ[key]&&ADJ[key].raw===sn){return ADJ[key].out;}
  var C=sn.cat,ix=[];C.names.forEach(function(n,i){if(/intern/i.test(n)){ix.push(i);}});
  if(!ix.length){return sn;}
  var keep=function(a){return a.filter(function(_,i){return ix.indexOf(i)<0;});},sm=function(a){return a.reduce(function(t,v){return t+(v||0);},0);},rm={},out={};
  Object.keys(sn).forEach(function(k){out[k]=sn[k];});
  var rows=C.rows.map(function(r){var x=0;ix.forEach(function(i){x+=r.v[i]||0;});rm[r.m]=x;return {m:r.m,v:keep(r.v),t:r.t-x};});
  var total=keep(C.total),tt=sm(total);
  out.cat={names:keep(C.names),rows:rows,total:total,pct:total.map(function(v){return tt?v/tt:0;})};
  var M=(sn.monthly||[]).map(function(r){var o={};Object.keys(r).forEach(function(k){o[k]=r[k];});o.h=Math.max(0,(r.h||0)-(rm[r.m]||0));return o;}),run=0;
  M.forEach(function(r,i){run+=r.h;r.cum=run;r.chg=i?r.h-M[i-1].h:null;r.a3=i>=2?(M[i-2].h+M[i-1].h+r.h)/3:null;r.net=r.lv==null?null:r.h-r.lv;});
  out.monthly=M;
  if(sn.kpi){
    var k=Object.assign({},sn.kpi),full=M.filter(function(r){return r.st==='Complete';}),pk=null;
    full.forEach(function(r){if(!pk||r.h>pk.h){pk=r;}});
    k.total=sm(M.map(function(r){return r.h;}));k.avg=full.length?sm(full.map(function(r){return r.h;}))/full.length:null;k.peak=pk?pk.m:null;k.lastFull=full.length?full[full.length-1].h:null;
    var N=(k.notes||[]).slice();
    if(pk){N[2]=pk.h+' hires';}
    if(full.length){var lf=full[full.length-1],pf=full.length>1?full[full.length-2]:null;N[3]=F.mlabel(lf.m)+(pf?'  ('+(lf.h-pf.h>=0?'+':'')+(lf.h-pf.h)+' vs prior month)':'');}
    k.notes=N;out.kpi=k;
  }
  if(sn.topPos){var tp0=sn.topPos.filter(function(o){return !isInt('',o.n);});out.topPos=tp0.map(function(o){return {n:o.n,c:o.c,p:out.kpi&&out.kpi.total?o.c/out.kpi.total:o.p};});}
  out.__internNote=sm(Object.keys(rm).map(function(m){return rm[m];}));
  ADJ[key]={raw:sn,out:out};return out;
}
function snap(m){var b=branch();return b?adj(T.snaps[b][m]||null,b+'|'+m):null;}
function head(t,s){return "<div class='hd'><div><span class='mut'>"+F.mlabel(S.mo)+"</span><h1>"+t+"</h1><p class='mut'>"+s+"</p></div></div>";}
function kk(l,v,s,c){return "<div class='k'><div><span>"+l+"</span><b class='"+(c||'')+"'>"+v+"</b>"+(s?"<small class='dm'>"+s+"</small>":'')+"</div></div>";}
function fv(label,v){
  if(v===''||v==null){return '-';}
  if(typeof v!=='number'){return esc(v);}
  var l=String(label).toLowerCase();
  if(/%|share|rate|pass|retention/.test(l)&&Math.abs(v)<=1.5){return F.pc(v);}
  if(Math.abs(v-Math.round(v))<1e-9){return F.n0(v);}
  return v.toFixed(1);
}
function pill(s){var c=s==='On target'?'ok':(s==='Watch'?'mid':(s==='Off target'?'bad':'na'));return "<span class='pill "+c+"'>"+esc(s||'-')+"</span>";}
function niceMax(v){if(v<=5){return 5;}var p=Math.pow(10,Math.floor(Math.log(v)/Math.LN10)),n=v/p;return (n<=1?1:(n<=2?2:(n<=5?5:10)))*p;}
function hb(L,labf,valf,subf,color){
  var mx=Math.max.apply(null,L.map(valf).concat([1]));
  return "<div class='bars one'>"+L.map(function(o){return "<div class='br'><div class='bl'>"+esc(labf(o))+"</div><div class='bt'><i class='bc' style='width:"+(valf(o)/mx*100)+"%;background:"+(color||'#2f6fd1')+"'></i></div><div class='bv'>"+(subf?subf(o):F.n0(valf(o)))+"</div></div>";}).join('')+"</div>";
}
function barLine(M){
  var w=560,h=230,pl=34,pr=10,pt=22,pb=30,n=M.length;if(!n){return '';}
  var mx=niceMax(Math.max.apply(null,M.map(function(r){return Math.max(r.h||0,r.a3||0);}).concat([1])));
  var bw=(w-pl-pr)/n,Y=function(v){return pt+(h-pt-pb)*(1-v/mx);};
  var s="<svg viewBox='0 0 "+w+" "+h+"' class='tpc'>";
  [0,0.5,1].forEach(function(f){var y=Y(mx*f);s+="<line x1='"+pl+"' x2='"+(w-pr)+"' y1='"+y+"' y2='"+y+"' stroke='var(--line)'/><text x='"+(pl-4)+"' y='"+(y+3)+"' text-anchor='end' class='ax'>"+F.n0(mx*f)+"</text>";});
  var pts=[];
  M.forEach(function(r,i){
    var x=pl+i*bw+bw*0.2,bwid=bw*0.6,v=r.h||0,y=Y(v);
    s+="<rect x='"+x+"' y='"+y+"' width='"+bwid+"' height='"+(Y(0)-y)+"' rx='3' fill='#1aa37a' opacity='"+(r.st==='In progress'?0.45:1)+"'/><text x='"+(x+bwid/2)+"' y='"+(y-4)+"' text-anchor='middle' class='ax' style='font-weight:700'>"+F.n0(v)+"</text><text x='"+(x+bwid/2)+"' y='"+(h-10)+"' text-anchor='middle' class='ax'>"+mshort(r.m)+"</text>";
    if(r.a3!=null){pts.push((x+bwid/2).toFixed(1)+','+Y(r.a3).toFixed(1));}
  });
  if(pts.length>1){s+="<polyline fill='none' stroke='#2f6fd1' stroke-width='2.5' points='"+pts.join(' ')+"'/>";}
  pts.forEach(function(p){var c=p.split(',');s+="<circle cx='"+c[0]+"' cy='"+c[1]+"' r='3' fill='#2f6fd1'/>";});
  return s+"</svg><div class='tpleg'><span><i style='background:#1aa37a'></i>Hires (lighter bar = month in progress)</span><span><i style='background:#2f6fd1'></i>3-month average</span></div>";
}
function stack(C){
  var n=C.rows.length;if(!n){return '';}
  var w=560,h=240,pl=34,pr=10,pt=22,pb=30,mx=niceMax(Math.max.apply(null,C.rows.map(function(r){return r.t;}).concat([1])));
  var bw=(w-pl-pr)/n,Y=function(v){return pt+(h-pt-pb)*(1-v/mx);};
  var s="<svg viewBox='0 0 "+w+" "+h+"' class='tpc'>";
  [0,0.5,1].forEach(function(f){var y=Y(mx*f);s+="<line x1='"+pl+"' x2='"+(w-pr)+"' y1='"+y+"' y2='"+y+"' stroke='var(--line)'/><text x='"+(pl-4)+"' y='"+(y+3)+"' text-anchor='end' class='ax'>"+F.n0(mx*f)+"</text>";});
  C.rows.forEach(function(r,i){
    var x=pl+i*bw+bw*0.2,bwid=bw*0.6,acc=0;
    r.v.forEach(function(v,k){if(!v){return;}var y1=Y(acc+v),y0=Y(acc);s+="<rect x='"+x+"' y='"+y1+"' width='"+bwid+"' height='"+(y0-y1)+"' fill='"+CC[k%CC.length]+"'><title>"+esc(C.names[k])+": "+v+"</title></rect>";if((y0-y1)>=12){s+="<text x='"+(x+bwid/2)+"' y='"+((y0+y1)/2+3)+"' text-anchor='middle' class='ax' style='fill:#fff;font-weight:700'>"+v+"</text>";}acc+=v;});
    s+="<text x='"+(x+bwid/2)+"' y='"+(Y(acc)-4)+"' text-anchor='middle' class='ax' style='font-weight:700'>"+F.n0(r.t)+"</text><text x='"+(x+bwid/2)+"' y='"+(h-10)+"' text-anchor='middle' class='ax'>"+mshort(r.m)+"</text>";
  });
  return s+"</svg><div class='tpleg'>"+C.names.map(function(nm,k){return (C.total[k]||0)?"<span><i style='background:"+CC[k%CC.length]+"'></i>"+esc(nm)+" "+F.n0(C.total[k])+"</span>":'';}).join('')+"</div>";
}
function lines(labels,series,pct){
  var n=labels.length,w=560,h=220,pl=40,pr=12,pt=16,pb=30;if(n<2){return "<p class='mut'>Needs at least two published months.</p>";}
  var all=[];series.forEach(function(s){s.v.forEach(function(v){if(v!=null){all.push(v);}});});
  if(!all.length){return "<p class='mut'>No data yet.</p>";}
  var mx=Math.max.apply(null,all),mn=Math.min.apply(null,all.concat([0]));if(pct){mx=Math.max(mx,0.05);}else{mx=niceMax(mx);}
  var X=function(i){return pl+i*(w-pl-pr)/(n-1);},Y=function(v){return pt+(h-pt-pb)*(1-(v-mn)/((mx-mn)||1));};
  var fm=function(v){return pct?F.pc(v):F.n0(v);};
  var s="<svg viewBox='0 0 "+w+" "+h+"' class='tpc'>";
  [0,0.5,1].forEach(function(f){var v=mn+(mx-mn)*f,y=Y(v);s+="<line x1='"+pl+"' x2='"+(w-pr)+"' y1='"+y+"' y2='"+y+"' stroke='var(--line)'/><text x='"+(pl-4)+"' y='"+(y+3)+"' text-anchor='end' class='ax'>"+fm(v)+"</text>";});
  labels.forEach(function(l,i){s+="<text x='"+X(i)+"' y='"+(h-10)+"' text-anchor='middle' class='ax'>"+mshort(l)+"</text>";});
  series.forEach(function(se){
    var seg=[],segs=[];se.v.forEach(function(v,i){if(v==null){if(seg.length){segs.push(seg);}seg=[];}else{seg.push(X(i).toFixed(1)+','+Y(v).toFixed(1));}});if(seg.length){segs.push(seg);}
    segs.forEach(function(g){if(g.length>1){s+="<polyline fill='none' stroke='"+se.c+"' stroke-width='2.5' points='"+g.join(' ')+"'/>";}});
    se.v.forEach(function(v,i){if(v!=null){s+="<circle cx='"+X(i).toFixed(1)+"' cy='"+Y(v).toFixed(1)+"' r='3.5' fill='"+se.c+"'><title>"+esc(se.n)+" · "+lab(labels[i])+": "+fm(v)+"</title></circle>";s+="<text x='"+X(i).toFixed(1)+"' y='"+(Y(v)-8).toFixed(1)+"' text-anchor='middle' class='ax' style='font-size:9px;font-weight:700;fill:"+se.c+"'>"+fm(v)+"</text>";}});
  });
  return s+"</svg><div class='tpleg'>"+series.map(function(se){return "<span><i style='background:"+se.c+"'></i>"+esc(se.n)+"</span>";}).join('')+"</div>";
}
function evCounts(ms,br){
  var R=F.R(),has={},H={},L={};
  R.forEach(function(r){if(br&&r.Branch!==br){return;}if(r.Dataset==='PosDept'){has[r.Month]=1;}if(r.Dataset==='Hire'||r.Dataset==='Resign'){var q=String(r.Item).split(' @ ');if(isInt(r.Group,(q[1]||'').trim())){return;}}if(r.Dataset==='Hire'){H[r.Month]=(H[r.Month]||0)+1;}if(r.Dataset==='Resign'){L[r.Month]=(L[r.Month]||0)+1;}});
  var mm=ms.filter(function(m){return has[m];});
  return {m:mm,h:mm.map(function(m){return H[m]||0;}),l:mm.map(function(m){return L[m]||0;})};
}
function metric(sn,key){var r=(sn.score||[]).filter(function(x){return x.k.indexOf(key)===0;})[0];return r&&typeof r.a==='number'?r.a:null;}
function losMetric(sn,key){var r=(sn.los||[]).filter(function(x){return x.k.indexOf(key)===0;})[0];return r&&typeof r.v==='number'?r.v:null;}
/* ---- Hires report: built from the Hire / Resign rows already published with each month (no extra data) ---- */
var HX={cat:'all'};
function pmon(m){var y=+m.slice(0,4),k=+m.slice(5,7)-1;if(k<1){y--;k=12;}return y+'-'+('0'+k).slice(-2);}
function hxData(){
  var br=S.br,has={},H={},L={},rows=[],ir=[],il=[];
  F.R().forEach(function(r){
    if(r.Dataset==='PosDept'){has[r.Month]=1;return;}
    if(br!=='ALL'&&r.Branch!==br){return;}
    if(r.Dataset==='Hire'||r.Dataset==='Resign'){var q=String(r.Item).split(' @ ');if(isInt(r.Group,(q[1]||'').trim())){if(r.Month===S.mo){var nk=/nursing/i.test(r.Group||'')?'Nursing Internship':'Internship Program';if(r.Dataset==='Hire'){ir.push({cat:nk,dep:(q[0]||'-').trim(),pos:(q[1]||'-').trim(),sec:(q[2]||'-').trim()});}else{il.push({cat:nk});}}return;}}
    if(r.Dataset==='Hire'){H[r.Month]=(H[r.Month]||0)+1;if(r.Month===S.mo){var p=String(r.Item).split(' @ ');var pn=(p[1]||'-').trim();if(r.Group==='Nursing'&&/^(senior )?staff nurse$/i.test(pn)){pn='Staff Nurse + Senior Staff Nurse';}rows.push({cat:r.Group||'-',dep:(p[0]||'-').trim(),pos:pn,sec:(p[2]||'-').trim()});}}
    else if(r.Dataset==='Resign'){L[r.Month]=(L[r.Month]||0)+1;}
  });
  return {has:has,H:H,L:L,rows:rows,ir:ir,il:il};
}
function cntBy(L,fn){var M={},O=[];L.forEach(function(r){var k=fn(r);if(!M[k]){M[k]={n:k,c:0};O.push(M[k]);}M[k].c++;});return O.sort(function(a,b){return b.c-a.c||(a.n<b.n?-1:1);});}
function cmp(a,b){return a<b?-1:(a>b?1:0);}
function hxInner(){
  var D=hxData(),mo=F.mlabel(S.mo),br=(S.br==='ALL'?'All branches':S.br);
  var t="<div class='hrph'><h3 class='sec'>Hires report · "+mo+"</h3><button class='dlt' data-hx='print'>Print report</button></div><div class='hrpt'><b>Saudi German Hospital Cairo · Hires report · "+mo+"</b><br><span class='mut'>"+esc(br)+" · Position, section, department and category of everyone who joined in the month</span></div>";
  if(!D.has[S.mo]){return t+F.card('Not published yet',"<p class='mut'>Hires for "+mo+" appear after the next publish from the updated workbook (Update data > Choose workbook > Publish).</p>");}
  var n=D.rows.length,pm=pmon(S.mo),pv=D.has[pm]?(D.H[pm]||0):null,yr=S.mo.slice(0,4),all=F.M().filter(function(m){return D.has[m];}),
      upto=all.filter(function(m){return m<=S.mo;}),hs=upto.map(function(m){return D.H[m]||0;}),
      ytd=upto.filter(function(m){return m.slice(0,4)===yr;}).reduce(function(a,m){return a+(D.H[m]||0);},0),lv=D.L[S.mo]||0,net=n-lv;
  var cats=cntBy(D.rows,function(r){return r.cat;});
  if(HX.cat!=='all'&&!cats.some(function(c){return c.n===HX.cat;})){HX.cat='all';}
  var ct={};cats.forEach(function(c){ct[c.n]=c.c;});
  var rows=D.rows.filter(function(r){return HX.cat==='all'||r.cat===HX.cat;}),G={},GO=[];
  rows.forEach(function(r){var k=[r.cat,r.dep,r.sec,r.pos].join('|');if(!G[k]){G[k]={cat:r.cat,dep:r.dep,sec:r.sec,pos:r.pos,c:0};GO.push(G[k]);}G[k].c++;});
  GO.sort(function(a,b){return (ct[b.cat]-ct[a.cat])||cmp(a.cat,b.cat)||(b.c-a.c)||cmp(a.dep,b.dep)||cmp(a.sec,b.sec)||cmp(a.pos,b.pos);});
  var h=t+"<div class='kpis'>"+F.kc('HIRES THIS MONTH',n,pv,'n',hs,pm,'#1aa37a')+kk('YEAR TO DATE',F.n0(ytd),'hires in the published months of '+yr)+kk('LEAVERS',F.n0(lv),'resignations in the month')+kk('NET CHANGE',(net>0?'+':'')+net,'hires minus leavers',net<0?'red':(net>0?'grn':''))+"</div>";
  var chips="<div class='chips'><button class='chip "+(HX.cat==='all'?'on':'')+"' data-hx='cat' data-v='all'>All<b>"+F.n0(n)+"</b></button>"+cats.map(function(c){return "<button class='chip "+(HX.cat===c.n?'on':'')+"' data-hx='cat' data-v='"+esc(c.n)+"'>"+esc(c.n)+"<b>"+F.n0(c.c)+"</b></button>";}).join('')+"</div>";
  var cols=[{h:'Position',f:function(o){return esc(o.pos);}},{h:'Section',f:function(o){return esc(o.sec);}},{h:'Department',f:function(o){return esc(o.dep);}},{h:'Category',f:function(o){return esc(o.cat);}},{h:'Hires',n:1,f:function(o){return "<b>"+F.n0(o.c)+"</b>";}}];
  var tot=GO.reduce(function(a,o){return a+o.c;},0);
  h+=F.card('Who joined in '+mo+' · '+F.n0(tot)+(HX.cat==='all'?'':' ('+esc(HX.cat)+')'),n?chips+F.tbl('hxd',cols,GO,0,null,1)+"<p class='note'>One line per position, section, department and category. Hires are counted by Joining Date from the Master; the latest month may still be in progress. Names and employee IDs are never published.</p>":"<p class='mut'>No joiners are recorded for "+mo+".</p>");
  var top=function(L,k,lim){return cntBy(L,function(r){return r[k];}).slice(0,lim);},sub=function(o){return F.n0(o.c)+' · '+F.pc(n?o.c/n:null);},lab=function(o){return o.n;},val=function(o){return o.c;};
  if(n){
    h+="<div class='g2'>"+F.card('Hires by category',hb(cats,lab,val,sub,'#1aa37a'))+F.card('Hires by department',hb(top(D.rows,'dep',10),lab,val,sub,'#2f6fd1'))+"</div>";
    h+="<div class='g2'>"+F.card('Hires by section',hb(top(D.rows,'sec',10),lab,val,sub,'#7a5cc7'))+F.card('Hires by position',hb(top(D.rows,'pos',10),lab,val,sub,'#e0a100'))+"</div>";
  }
  if(D.ir.length||D.il.length){
    var kinds={};D.ir.forEach(function(r){(kinds[r.cat]=kinds[r.cat]||[0,0])[0]++;});D.il.forEach(function(r){(kinds[r.cat]=kinds[r.cat]||[0,0])[1]++;});
    var ig={},io=[];D.ir.forEach(function(r){var k=[r.cat,r.dep,r.sec,r.pos].join('|');if(!ig[k]){ig[k]={cat:r.cat,dep:r.dep,sec:r.sec,pos:r.pos,c:0};io.push(ig[k]);}ig[k].c++;});
    io.sort(function(a,b){return cmp(a.cat,b.cat)||(b.c-a.c)||cmp(a.dep,b.dep)||cmp(a.pos,b.pos);});
    var icols=[{h:'Position',f:function(o){return esc(o.pos);}},{h:'Section',f:function(o){return esc(o.sec);}},{h:'Department',f:function(o){return esc(o.dep);}},{h:'Programme',f:function(o){return esc(o.cat);}},{h:'Started',n:1,f:function(o){return F.n0(o.c);}}];
    h+="<details style='margin:12px 0;padding:8px 14px;border:1px dashed var(--line);border-radius:12px;color:var(--mut);font-size:12.5px'><summary style='cursor:pointer'>Internship (for information, not counted in the hires above): <b style='color:var(--ink,inherit)'>"+F.n0(D.ir.length)+"</b> started · <b style='color:var(--ink,inherit)'>"+F.n0(D.il.length)+"</b> left"+Object.keys(kinds).sort().map(function(k){return (k===Object.keys(kinds).sort()[0]?' - ':' · ')+esc(k)+' '+kinds[k][0]+' / '+kinds[k][1];}).join('')+"</summary><p class='note'>Interns are not recruitment, so they are left out of every hire and leaver figure on this page. Shown as started / left.</p>"+(io.length?F.tbl('hxi',icols,io,0,null,1):'')+"</details>";
  }
  var run={},TR=all.map(function(m){var y=m.slice(0,4),x=D.H[m]||0;run[y]=(run[y]||0)+x;var p=pmon(m);return {m:m,h:x,chg:D.has[p]?x-(D.H[p]||0):null,cum:run[y],lv:D.L[m]||0};});
  var tc=[{h:'Month',f:function(o){return o.m===S.mo?'<b>'+lab2(o.m)+'</b>':lab2(o.m);}},{h:'Hires',n:1,f:function(o){return F.n0(o.h);}},{h:'Change vs prior month',n:1,f:function(o){return o.chg==null?'-':F.gp(o.chg);}},{h:'Cumulative hires',n:1,f:function(o){return F.n0(o.cum);}},{h:'Leavers',n:1,f:function(o){return F.n0(o.lv);}},{h:'Net',n:1,m:1,f:function(o){return F.gp(o.h-o.lv);}}];
  h+=F.card('Hiring trend by month',(TR.length>1?barLine(TR.map(function(r){return {m:r.m,h:r.h,a3:null,st:''};})):'')+F.tbl('hxt',tc,TR,0,null,1)+"<p class='note'>Months published to this site. Cumulative hires restart every January. Change is against the previous calendar month when it was published; leavers come from that month's Resignation report.</p>");
  return h;
}
function lab2(m){return m&&m.length===7?F.mlabel(m):esc(m||'');}
function rep(){return "<div id='hrp' class='hrp'>"+hxInner()+"</div>";}
document.addEventListener('click',function(e){
  var t=e.target&&e.target.closest?e.target.closest('[data-hx]'):null;if(!t){return;}
  var a=t.getAttribute('data-hx');
  if(a==='print'){document.body.classList.add('prx');setTimeout(function(){window.print();},60);}
  else if(a==='cat'){HX.cat=t.getAttribute('data-v')||'all';var c=document.getElementById('hrp');if(c){c.innerHTML=hxInner();}}
});
window.addEventListener('afterprint',function(){document.body.classList.remove('prx');});
function tp(){
  if(!T){return head('Talent Acquisition Pulse','Loading ...')+rep()+"<div class='card'>Loading ...</div>";}
  var ms=months();
  if(!ms.length){return head('Talent Acquisition Pulse','Hiring, early attrition and quality of hire')+rep()+"<div class='card'><h2>No Talent Acquisition data yet</h2><p>It appears after the next data update from the workbook.</p></div>";}
  var sn=snap(S.mo);
  if(!sn){return head('Talent Acquisition Pulse','Hiring, early attrition and quality of hire')+rep()+"<div class='card'><h2>Nothing published for "+F.mlabel(S.mo)+"</h2><p>Talent Acquisition numbers are available for: "+ms.map(function(m){return "<a class='lk' data-a='mo' data-v='"+m+"'>"+F.mlabel(m)+"</a>";}).join(' · ')+"</p></div>";}
  var pm=ms.filter(function(m){return m<S.mo;}).pop()||null,sp=pm?snap(pm):null,upto=ms.filter(function(m){return m<=S.mo;});
  var ser=function(f){return upto.map(function(m){var v=f(snap(m));return v==null?0:v;});};
  var k=sn.kpi||{},N=k.notes||[];
  var h=head('Talent Acquisition Pulse',"Hires by joining date, early attrition and quality of hire · "+esc(sn.title||'').split('|').slice(1,2).join('').trim()+" · "+F.mlabel(S.mo));
  h+="<div class='kpis'>"+kk('HIRES (YEAR TO DATE)',F.n0(k.total),esc(N[0]||''))
    +kk('AVG HIRES / FULL MONTH',k.avg==null?'-':k.avg.toFixed(1),esc(N[1]||''))
    +kk('PEAK MONTH',k.peak?F.mlabel(k.peak):'-',esc(N[2]||''))
    +kk('LAST FULL MONTH',F.n0(k.lastFull),esc(N[3]||''))
    +kk('LEAVERS REPORTED',F.n0(k.leavers),esc(N[4]||''))
    +kk('HIRED THEN RESIGNED',F.n0(k.gone),esc(N[5]||''))+"</div>";
  if(sn.__internNote){h+="<div class='cav'>Interns (Internship Program) are left out of the hire counts, the month table and the category chart ("+F.n0(sn.__internNote)+" since January). The profile, length-of-service and quality-of-hire sections further down are as reported by the workbook and may still include them.</div>";}
  h+=rep();
  var M=sn.monthly||[];
  h+="<div class='g2'>"+F.card('Monthly hiring (by joining date)',barLine(M))+F.card('Hires by category',stack(sn.cat||{rows:[],names:[],total:[]}))+"</div>";
  var cols=[{h:'Month',f:function(o){return lab(o.m);}},{h:'Hires',n:1,f:function(o){return F.n0(o.h);}},{h:'Change',n:1,f:function(o){return o.chg==null?'-':F.gp(o.chg);}},{h:'Cumulative',n:1,m:1,f:function(o){return F.n0(o.cum);}},{h:'3-mo avg',n:1,m:1,f:function(o){return o.a3==null?'-':o.a3.toFixed(1);}},{h:'Leavers',n:1,f:function(o){return o.lv==null?"<span class='mut'>n/a</span>":F.n0(o.lv);}},{h:'Net',n:1,m:1,f:function(o){return o.net==null?'-':F.gp(o.net);}},{h:'Status',m:1,f:function(o){return esc(o.st);}}];
  h+=F.card('Month by month',F.tbl('tpm',cols,M,0,null,1)+"<p class='note'>Leavers are shown only for months covered by the Resignation report ("+(sn.leaverFrom?'from '+F.mlabel(sn.leaverFrom):'coverage unknown')+"). n/a means leavers for that month were not reported.</p>");
  var C=sn.cat||{rows:[],names:[]};
  if(C.rows.length){var cc=[{h:'Month',f:function(o){return lab(o.m);}}].concat(C.names.map(function(nm,i){return {h:esc(nm),n:1,m:i>3,f:function(o){return F.n0(o.v[i]);}};})).concat([{h:'Total',n:1,f:function(o){return "<b>"+F.n0(o.t)+"</b>";}}]);
    var rowsC=C.rows.slice();rowsC.push({m:'Total',v:C.total,t:k.total});
    h+=F.card('Hires by category and month',F.tbl('tpc',cc,rowsC,0,null,1));}
  h+="<div class='g2'>"+F.card('Top departments by hires',hb(sn.topDept||[],function(o){return o.n;},function(o){return o.c||0;},function(o){return F.n0(o.c)+' · '+F.pc(o.p);},'#1aa37a'))+F.card('Top positions by hires',hb(sn.topPos||[],function(o){return o.n;},function(o){return o.c||0;},function(o){return F.n0(o.c)+' · '+F.pc(o.p);},'#2f6fd1'))+"</div>";
  if((sn.profile||[]).length){h+=F.card('New-hire profile and hiring pipeline',F.tbl('tpp',[{h:'Metric',f:function(o){return esc(o.k);}},{h:'Value',n:1,f:function(o){return "<b>"+fv(o.k,o.v)+"</b>";}},{h:'Note',m:1,f:function(o){return "<span class='tpn'>"+esc(o.n)+"</span>";}}],sn.profile,0,null,1));}
  var q=sn.qoh||{k:[]};
  h+="<h3 class='sec'>Leavers and quality of hire</h3>";
  if(q.caveat){h+="<div class='cav'>"+esc(q.caveat)+"</div>";}
  if(q.k.length){h+="<div class='kpis'>"+q.k.map(function(x){return kk(esc(x.l),typeof x.v==='number'?fv(x.l,x.v):esc(x.v),esc(x.n));}).join('')+"</div>";}
  if((sn.findings||[]).length){h+="<div class='g2'>"+F.card('Key findings',"<ul class='fnd'>"+sn.findings.map(function(x){return "<li>"+esc(x)+"</li>";}).join('')+"</ul>")+F.card('Length of service of leavers',hb(sn.bands||[],function(o){return o.b;},function(o){return o.c;},function(o){return F.n0(o.c)+' · '+F.pc(o.p);},'#d64545'))+"</div>";}
  if((sn.score||[]).length){h+=F.card('Quality of hire scorecard',F.tbl('tps',[{h:'Metric',f:function(o){return esc(o.k);}},{h:'Actual',n:1,f:function(o){return "<b>"+fv(o.k,o.a)+"</b>";}},{h:'Target',n:1,f:function(o){return fv(o.k,o.t);}},{h:'Status',f:function(o){return pill(o.st);}},{h:'Better when',m:1,f:function(o){return esc(o.b);}},{h:'Data confidence',m:1,f:function(o){return esc(o.cf);}}],sn.score,0,null,1)+"<p class='note'>Targets are illustrative and set inside the workbook. Metrics with no data need an input in the workbook.</p>");}
  if((sn.cohorts||[]).length){h+=F.card('Early attrition by hire cohort (month joined)',F.tbl('tph',[{h:'Cohort',f:function(o){return lab(o.m);}},{h:'Hires',n:1,f:function(o){return F.n0(o.h);}},{h:'Left (observed)',n:1,f:function(o){return F.n0(o.l);}},{h:'Left within window',n:1,m:1,f:function(o){return F.n0(o.w);}},{h:'% left in window',n:1,f:function(o){return F.pc(o.pw);}},{h:'Retention to date',n:1,f:function(o){return F.mt(o.r)+F.pc(o.r);}},{h:'Data note',m:1,f:function(o){return "<span class='tpn'>"+esc(o.n)+"</span>";}}],sn.cohorts,0,null,1));}
  if((sn.losCat||[]).length){h+=F.card('Length of service by category',F.tbl('tpl',[{h:'Category',f:function(o){return esc(o.n);}},{h:'Leavers',n:1,f:function(o){return F.n0(o.c);}},{h:'Avg months',n:1,f:function(o){return typeof o.avg==='number'?o.avg.toFixed(1):'-';}},{h:'Early exits',n:1,f:function(o){return typeof o.e==='number'?F.n0(o.e):'-';}},{h:'% early',n:1,f:function(o){return typeof o.p==='number'?F.pc(o.p):'-';}}],sn.losCat,0,null,1));}
  if((sn.earlyDept||[]).length||(sn.earlyPos||[]).length){h+="<div class='g2'>"+F.card('Early exits by department',hb(sn.earlyDept||[],function(o){return o.n;},function(o){return o.c||0;},function(o){return F.n0(o.c)+' · '+F.pc(o.p);},'#d64545'))+F.card('Early exits by position',hb(sn.earlyPos||[],function(o){return o.n;},function(o){return o.c||0;},function(o){return F.n0(o.c)+' · '+F.pc(o.p);},'#d64545'))+"</div>";}
  if(upto.length>1){
    h+="<h3 class='sec'>Trend across published months</h3>";
    var ev=evCounts(upto,branch()),evp=ev.m.length>1?ev.m[ev.m.length-2]:null,cn='';
    if(ev.m.length>1){
      var hs=ev.h,ls=ev.l,net=ev.h.map(function(v,i){return v-ev.l[i];}),n1=ev.m.length-1;
      cn+=F.kc('HIRES IN MONTH',hs[n1],hs[n1-1],'n',hs,evp,'#1aa37a')+F.kc('RESIGNATIONS IN MONTH',ls[n1],ls[n1-1],'n',ls,evp,'#d64545')+F.kc('NET CHANGE',net[n1],net[n1-1],'g',net,evp,'#e0a100');
    }
    var si=upto.map(function(m){return metric(snap(m),'New hires with social insurance');});
    if(si[si.length-1]!=null){var sp2=si.length>1?si[si.length-2]:null;cn+=F.kc('HIRES WITH SOCIAL INSURANCE',si[si.length-1],sp2,'p',si.map(function(x){return x==null?0:x;}),pm,'#7a5cc7');}
    if(cn){h+="<div class='kpis'>"+cn+"</div>";}
    var g="";
    if(ev.m.length>1){g+=F.card('Hires vs resignations by month',lines(ev.m,[{n:'Hires',c:'#1aa37a',v:ev.h},{n:'Resignations',c:'#d64545',v:ev.l}],false)+"<p class='note'>Counted in each month's own workbook: joiners by Joining Date, leavers from the Resignation report.</p>");}
    g+=F.card('Quality of hire as reported in each month',lines(upto,[{n:'Early exits % of leavers',c:'#e0a100',v:upto.map(function(m){return losMetric(snap(m),'% of leavers who exited early');})},{n:'Hires still employed',c:'#2f6fd1',v:upto.map(function(m){return metric(snap(m),'Hires still employed');})},{n:'Hires with social insurance',c:'#7a5cc7',v:upto.map(function(m){return metric(snap(m),'New hires with social insurance');})}],true)+"<p class='note'>Each point is what that month's workbook showed. Early-exit and retention figures depend on how many past leavers were in the Resignation report at the time, so read the direction with care.</p>");
    h+="<div class='g2'>"+g+"</div>";
  }
  return h+"<p class='note'>Counts and percentages only. Names and employee IDs are never published. Source: the Talent Acquisition Pulse sheet in each monthly workbook (hires by Joining Date in the Master, plus joiners who already left; leavers from the Resignation report).</p>";
}
function foot(){return "<div class='foot'>Branch: "+(S.br==='ALL'?'All branches':esc(S.br))+" · Month: "+F.mlabel(S.mo)+" · Aggregated numbers only (no employee-level data).</div>";}
var app=$('app'),sd=$('sd');
function fix(){
  if(busy){return;}busy=true;
  try{
    if(sd&&!sd.querySelector("[data-v='tp']")){var first=sd.querySelector('.si');if(first){var a=document.createElement('a');a.className='si'+(S.vw==='tp'?' on':'');a.setAttribute('data-a','vw');a.setAttribute('data-v','tp');a.innerHTML="<b>Talent Acquisition Pulse</b><small>Hiring · early attrition · quality</small>";first.parentNode.insertBefore(a,first.nextSibling);}}
    if(S.vw==='tp'&&T===null&&!loading){load();}if(S.vw==='tp'&&app){var html;try{html=tp();}catch(e){html="<div class='card'><h2>Talent Acquisition Pulse</h2><p class='mut'>Could not draw this page: "+esc(e.message)+"</p></div>";}app.innerHTML=html+foot();}
  }finally{busy=false;}
  try{mo.takeRecords();}catch(x){}
}
var mo=new MutationObserver(fix);
if(sd){mo.observe(sd,{childList:true});}
if(app){mo.observe(app,{childList:true});}
var rf=$('rf');if(rf){rf.addEventListener('click',function(){T=null;});}
fix();
})();
