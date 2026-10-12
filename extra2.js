(function(){/* Talent Acquisition: saves the month's Talent numbers (counts only, locked with the dashboard password) right after a normal Update data publish. */
var Q=String.fromCharCode(34),AP=String.fromCharCode(39);
function rd16(d,o){return d[o]|(d[o+1]<<8);}function rd32(d,o){return (d[o]|(d[o+1]<<8)|(d[o+2]<<16)|(d[o+3]<<24))>>>0;}async function inflate(b){var ds=new DecompressionStream('deflate-raw'),w=ds.writable.getWriter();w.write(b);w.close();return new Uint8Array(await new Response(ds.readable).arrayBuffer());}function unzip(buf){var d=new Uint8Array(buf),e=-1,i;for(i=d.length-22;i>=Math.max(0,d.length-70000);i--){if(rd32(d,i)===0x06054b50){e=i;break;}}if(e<0){throw new Error('This is not an Excel (.xlsx) file.');}var n=rd16(d,e+10),p=rd32(d,e+16),F={};for(i=0;i<n;i++){var nl=rd16(d,p+28),xl=rd16(d,p+30),cl=rd16(d,p+32);F[new TextDecoder().decode(d.subarray(p+46,p+46+nl))]={m:rd16(d,p+10),cs:rd32(d,p+20),lo:rd32(d,p+42)};p+=46+nl+xl+cl;}return {d:d,F:F};}async function ent(z,name){var f=z.F[name];if(!f){return null;}var d=z.d,s=f.lo+30+rd16(d,f.lo+26)+rd16(d,f.lo+28),raw=d.subarray(s,s+f.cs);return new TextDecoder().decode(f.m===0?raw:await inflate(raw));}function ux(s){return s.replace(/&#(\d+);/g,function(a,b){return String.fromCharCode(+b);}).replace(/&#x([0-9a-f]+);/gi,function(a,b){return String.fromCharCode(parseInt(b,16));}).replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,Q).replace(/&apos;/g,AP).replace(/&amp;/g,'&');}function sst(x){var o=[],re=/<si>([\s\S]*?)<\/si>/g,m;while((m=re.exec(x))){var t='',r2=/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g,k,body=m[1].replace(/<rPh[\s\S]*?<\/rPh>/g,'');while((k=r2.exec(body))){t+=k[1];}o.push(ux(t));}return o;}function ci(a){var n=0;for(var i=0;i<a.length;i++){n=n*26+a.charCodeAt(i)-64;}return n-1;}function attr(s,k){var m=new RegExp('(?:^|\\s)'+k+'=\\x22([^\\x22]*)\\x22').exec(s);return m?m[1]:null;}function sheet(x,S){var G={},re=/<c\s([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g,m;while((m=re.exec(x))){var at=m[1],ref=/r=\x22([A-Z]+)(\d+)\x22/.exec(at);if(!ref){continue;}var ty=attr(at,'t'),b=m[2]||'',v=null,vm=/<v>([\s\S]*?)<\/v>/.exec(b);if(ty==='inlineStr'){var tm=/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/.exec(b);v=tm?ux(tm[1]):'';}else if(vm){v=ty==='s'?(S[+vm[1]]||''):((ty==='str'||ty==='e')?ux(vm[1]):(ty==='b'?vm[1]:parseFloat(vm[1])));}if(v===null){continue;}var r=+ref[2];(G[r]=G[r]||{})[ci(ref[1])]=v;}return G;}
function mon(v){if(typeof v!=='number'||v<20000){return null;}var d=new Date(Math.round((v-25569)*86400000));return d.getUTCFullYear()+'-'+('0'+(d.getUTCMonth()+1)).slice(-2);}
function parseTalent(G){
  var g=function(r,c){var v=(G[r]||{})[c];return v==null?'':v;};
  var rows=Object.keys(G).map(Number).sort(function(a,b){return a-b;}),last=rows[rows.length-1]||0;
  var tx=function(r,c){return String(g(r,c)).trim();};
  var nm=function(v){return typeof v==='number'?v:null;};
  var find=function(p,from){for(var r=from||1;r<=last;r++){if(tx(r,1).indexOf(p)===0){return r;}}return 0;};
  var blank=function(r){return tx(r,1)==='';};
  var o={v:1};
  o.title=tx(3,1);o.from=mon(g(5,2));o.through=mon(g(6,2));o.leaverFrom=mon(g(7,2));
  var h=find('TOTAL HIRES');
  if(!h){return null;}
  o.kpi={total:nm(g(h+1,1)),avg:nm(g(h+1,2)),peak:mon(g(h+1,3)),lastFull:nm(g(h+1,4)),leavers:nm(g(h+1,5)),gone:nm(g(h+1,6)),
    notes:[tx(h+2,1),tx(h+2,2),tx(h+2,3),tx(h+2,4),tx(h+2,5),tx(h+2,6)]};
  var s=find('1. Monthly hiring');o.monthly=[];
  if(s){for(var r=s+2;r<=last&&typeof g(r,1)==='number';r++){if(g(r,2)===''){continue;}o.monthly.push({m:mon(g(r,1)),h:nm(g(r,2)),chg:nm(g(r,3)),cum:nm(g(r,4)),lv:nm(g(r,5)),net:nm(g(r,6)),a3:nm(g(r,7)),st:tx(r,8)});}}
  s=find('2. Hires by category');o.cat={names:[],rows:[],total:[],pct:[]};
  if(s){var cn=[];for(var c=2;c<=9;c++){cn.push(tx(s+1,c));}o.cat.names=cn;
    for(var r2=s+2;r2<=last&&typeof g(r2,1)==='number';r2++){if(g(r2,10)===''){continue;}var v=[];for(var c2=2;c2<=9;c2++){v.push(nm(g(r2,c2))||0);}o.cat.rows.push({m:mon(g(r2,1)),v:v,t:nm(g(r2,10))||0});}
    var tr=find('Total',s),pr=find('% of hires',s);
    if(tr){for(var c3=2;c3<=9;c3++){o.cat.total.push(nm(g(tr,c3))||0);}}
    if(pr){for(var c4=2;c4<=9;c4++){o.cat.pct.push(nm(g(pr,c4))||0);}}}
  var top=function(p){var s2=find(p),L=[];if(!s2){return L;}for(var r3=s2+2;r3<=last&&!blank(r3)&&tx(r3,1).indexOf('Top 10 combined')!==0;r3++){L.push({n:tx(r3,1),c:nm(g(r3,2)),p:nm(g(r3,3))});}return L;};
  o.topDept=top('3. Top 10 departments');o.topPos=top('4. Top 10 positions');
  var kv=function(s2,skip){var L=[];if(!s2){return L;}for(var r4=s2+skip;r4<=last&&!blank(r4);r4++){L.push({k:tx(r4,1),v:g(r4,2),n:tx(r4,3)});}return L;};
  o.profile=kv(find('5. New-hire profile'),2);
  o.checks=kv(find('Data checks'),2);
  s=find('6. Leavers - length of service');o.bands=[];
  if(s){var hb=find('Length of service',s+1);for(var r5=hb+1;r5<=last&&!blank(r5)&&tx(r5,1)!=='Total';r5++){o.bands.push({b:tx(r5,1),c:nm(g(r5,2))||0,p:nm(g(r5,3))||0});}}
  var km=find('Key metrics',s||1);o.los=kv(km,1);
  s=find('Length of service by category');o.losCat=[];
  if(s){for(var r6=s+1;r6<=last&&!blank(r6);r6++){o.losCat.push({n:tx(r6,1),c:nm(g(r6,2)),avg:g(r6,3),e:g(r6,4),p:g(r6,5)});}}
  s=find('7. Quality of Hire');
  o.qoh={caveat:s?tx(s+1,1):'',window:nm(g(find('Early-attrition window',s||1),2)),k:[]};
  var q=find('LEAVERS REPORTED',s||1);
  if(q){for(var c5=1;c5<=6;c5++){o.qoh.k.push({l:tx(q,c5),v:g(q+1,c5),n:tx(q+2,c5)});}}
  var kf=find('Key findings',s||1);o.findings=[];
  if(kf){for(var r7=kf+1;r7<=last&&!blank(r7);r7++){o.findings.push(tx(r7,1).replace(/^•\s*/,''));}}
  var sc=find('Quality of Hire scorecard',s||1);o.score=[];
  if(sc){for(var r8=sc+1;r8<=last&&!blank(r8)&&tx(r8,1).indexOf('Targets are')!==0;r8++){o.score.push({k:tx(r8,1),a:g(r8,2),t:g(r8,3),st:tx(r8,4),b:tx(r8,5),cf:tx(r8,6),n:tx(r8,7)});}}
  s=find('Early attrition by hire cohort');o.cohorts=[];
  if(s){for(var r9=s+1;r9<=last&&!blank(r9);r9++){var lab=tx(r9,1),mm=typeof g(r9,1)==='number'?mon(g(r9,1)):lab;if(g(r9,2)===''){continue;}o.cohorts.push({m:mm,h:nm(g(r9,2)),l:nm(g(r9,3)),w:nm(g(r9,4)),pw:nm(g(r9,5)),r:nm(g(r9,6)),n:tx(r9,7)});}}
  var ed=function(p){var s2=find(p),L=[];if(!s2){return L;}for(var r10=s2+1;r10<=last&&!blank(r10);r10++){L.push({n:tx(r10,1),c:nm(g(r10,2)),p:nm(g(r10,3))});}return L;};
  o.earlyDept=ed('Early exits by department');o.earlyPos=ed('Early exits by position');
  return o;
}
async function readTalent(buf){
  var z=unzip(buf),wb=await ent(z,'xl/workbook.xml'),rl=await ent(z,'xl/_rels/workbook.xml.rels');
  if(!wb||!rl){return null;}
  var ssx=await ent(z,'xl/sharedStrings.xml'),SS=ssx?sst(ssx):[],rid=null,re=/<sheet\s([^>]*?)\/>/g,m;
  while((m=re.exec(wb))){if(ux(attr(m[1],'name')||'')==='Talent Acquisition Pulse'){rid=attr(m[1],'r:id');}}
  if(!rid){return null;}
  var tg=null,r3=/<Relationship\s([^>]*?)\/>/g;
  while((m=r3.exec(rl))){if(attr(m[1],'Id')===rid){tg=attr(m[1],'Target');}}
  if(!tg){return null;}
  tg=tg.charAt(0)==='/'?tg.slice(1):'xl/'+tg;
  return parseTalent(sheet(await ent(z,tg),SS));
}





var REPO='SGHEg/workforce-insights';
function b64e(u){var o='';for(var i=0;i<u.length;i+=8192){o+=String.fromCharCode.apply(null,u.subarray(i,i+8192));}return btoa(o);}
function b64d(s){var x=atob(s),u=new Uint8Array(x.length);for(var i=0;i<x.length;i++){u[i]=x.charCodeAt(i);}return u;}
function b64t(s){var b=new TextEncoder().encode(s),o='';for(var i=0;i<b.length;i+=8192){o+=String.fromCharCode.apply(null,b.subarray(i,i+8192));}return btoa(o);}
async function derive(pw,salt,iter,usage){
  var k=await crypto.subtle.importKey('raw',new TextEncoder().encode(pw.trim()),'PBKDF2',false,['deriveKey']);
  return crypto.subtle.deriveKey({name:'PBKDF2',salt:salt,iterations:iter,hash:'SHA-256'},k,{name:'AES-GCM',length:256},false,usage);
}
async function decEnv(env,pw){
  var key=await derive(pw,b64d(env.salt),env.iter,['decrypt']);
  return new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:b64d(env.iv)},key,b64d(env.data)));
}
async function encText(text,pw){
  var salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
  var key=await derive(pw,salt,600000,['encrypt']);
  var ct=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv:iv},key,new TextEncoder().encode(text)));
  return {v:1,alg:'AES-256-GCM/PBKDF2-SHA256',iter:600000,salt:b64e(salt),iv:b64e(iv),data:b64e(ct)};
}
async function readWb(buf){
  var z=unzip(buf),wb=await ent(z,'xl/workbook.xml'),rl=await ent(z,'xl/_rels/workbook.xml.rels');
  if(!wb||!rl){throw new Error('not an Excel workbook');}
  var ssx=await ent(z,'xl/sharedStrings.xml'),SS=ssx?sst(ssx):[];
  async function ld(nm){
    var rid=null,re=/<sheet\s([^>]*?)\/>/g,m;
    while((m=re.exec(wb))){if(ux(attr(m[1],'name')||'')===nm){rid=attr(m[1],'r:id');}}
    if(!rid){return null;}
    var tg=null,r3=/<Relationship\s([^>]*?)\/>/g;
    while((m=r3.exec(rl))){if(attr(m[1],'Id')===rid){tg=attr(m[1],'Target');}}
    if(!tg){return null;}
    tg=tg.charAt(0)==='/'?tg.slice(1):'xl/'+tg;
    return sheet(await ent(z,tg),SS);
  }
  var pe=await ld('Portal_Export');if(!pe){throw new Error('Portal_Export sheet not found');}
  var month=String(((pe[3]||{})[1])||'').trim(),branch=String(((pe[4]||{})[1])||'').trim();
  var gt=await ld('Talent Acquisition Pulse');
  return {month:month,branch:branch,tal:gt?parseTalent(gt):null};
}

function init(){
  var $=function(id){return document.getElementById(id);};
  var inp=$('adi'),box=$('ads');
  if(!inp||!box||inp.getAttribute('data-tal')){return;}
  inp.setAttribute('data-tal','1');
  var cap=null,busy=false;
  inp.addEventListener('change',function(e){var f=e.target.files&&e.target.files[0];cap=f||null;},true);
  function tok(){try{return localStorage.getItem('wi_gh')||'';}catch(x){return '';}}
  function pw(){try{return sessionStorage.getItem('wi_pw')||localStorage.getItem('wi_pw')||'';}catch(x){return '';}}
  async function run(){
    if(busy||!cap){return;}
    busy=true;var f=cap,note='';
    try{
      var t=tok(),p=pw();if(!t||!p){throw new Error('GitHub token or dashboard password not available in this browser');}
      var r=await readWb(await f.arrayBuffer());
      if(!r.tal||!r.month||!r.branch){throw new Error('no Talent Acquisition Pulse sheet in this workbook');}
      var u='https://api.github.com/repos/'+REPO+'/contents/talent.enc',H={Authorization:'Bearer '+t,Accept:'application/vnd.github+json'};
      var g=await fetch(u,{headers:H,cache:'no-store'}),J={v:1,snaps:{}},sha=null;
      if(g.status===401||g.status===403){throw new Error('GitHub rejected the token ('+g.status+')');}
      if(g.ok){
        var j=await g.json();sha=j.sha;
        var env=JSON.parse(new TextDecoder().decode(b64d(j.content.replace(/\s/g,''))));
        try{J=JSON.parse(await decEnv(env,p));}catch(e){throw new Error('the published Talent file uses a different password, nothing was changed');}
        if(!J.snaps){J.snaps={};}
      }else if(g.status!==404){throw new Error('GitHub error '+g.status);}
      J.snaps[r.branch]=J.snaps[r.branch]||{};J.snaps[r.branch][r.month]=r.tal;J.v=1;J.updated=new Date().toISOString();
      var enc=await encText(JSON.stringify(J),p);
      var body={message:'Update Talent Acquisition '+r.month,content:b64t(JSON.stringify(enc))};if(sha){body.sha=sha;}
      var pr=await fetch(u,{method:'PUT',headers:Object.assign({'Content-Type':'application/json'},H),body:JSON.stringify(body)});
      if(!pr.ok){throw new Error('GitHub error '+pr.status);}
      note='\nTalent Acquisition: '+r.month+' saved.';
    }catch(e){note='\nTalent Acquisition not saved: '+e.message;}
    box.textContent=box.textContent+note;busy=false;cap=null;
  }
  new MutationObserver(function(){var tx=box.textContent||'';if(/^Published \d{4}-\d{2}/.test(tx)&&tx.indexOf('Talent Acquisition')<0&&!busy){run();}}).observe(box,{childList:true,characterData:true,subtree:true});
}
if(document.readyState==='complete'){setTimeout(init,0);}else{window.addEventListener('load',function(){setTimeout(init,0);});}
})();
