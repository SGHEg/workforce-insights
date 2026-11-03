(function(){
/* Movement ledger bridge: one list of hires and leavers (each person once, one set of rules) replaces the old monthly Hire/Resign rows for the months it covers.
   Every year has its own ledger (the latest published month of that year carries it), so a new year never breaks the earlier years. */
var W=window.__wi;
function led(R,IDX,MONTHS){
  var parts0=R.filter(function(r){return r.Dataset==='Ledger';});
  if(!parts0.length){return;}
  for(var q=R.length-1;q>=0;q--){if(R[q].Dataset==='Ledger'){R.splice(q,1);}}
  Object.keys(IDX).forEach(function(k){if(k.split('|')[1]==='Ledger'){delete IDX[k];}});
  var byMonth={};parts0.forEach(function(r){(byMonth[r.Month]=byMonth[r.Month]||[]).push(r);});
  var best={};
  Object.keys(byMonth).forEach(function(mo){var D=null;byMonth[mo].forEach(function(r){var o;try{o=JSON.parse(r.Item);}catch(e){return;}if(o.k==='D'){D=o;}});if(!D){return;}var y=D.from.slice(0,4);if(!best[y]||mo>best[y].mo){best[y]={mo:mo,D:D};}});
  window.WIX=window.WIX||{};window.WIX.ledgerByYear=window.WIX.ledgerByYear||{};
  Object.keys(best).forEach(function(y){
    var mo0=best[y].mo,D=best[y].D,H=[],Lv=[],parts=byMonth[mo0];
    parts.forEach(function(r){var o;try{o=JSON.parse(r.Item);}catch(e){return;}if(o.k==='H'){H=H.concat(o.a);}else if(o.k==='L'){Lv=Lv.concat(o.a);}});
    var y0=+D.from.slice(0,4),m0=+D.from.slice(5,7);
    var mm=function(i){var t=m0-1+i,yy=y0+Math.floor(t/12),m=t%12+1;return yy+'-'+(m<10?'0'+m:m);};
    var cover={},i;for(i=0;i<36;i++){var mo=mm(i);if(mo>D.to){break;}cover[mo]=1;}
    for(var k2=R.length-1;k2>=0;k2--){var r=R[k2];if((r.Dataset==='Hire'||r.Dataset==='Resign')&&cover[r.Month]){R.splice(k2,1);}}
    Object.keys(IDX).forEach(function(key){var p=key.split('|');if((p[1]==='Hire'||p[1]==='Resign')&&cover[p[0]]){delete IDX[key];}});
    var branch=parts[0].Branch,CL={X:'counted',F:'first 3 months',C:'contract end',T:'trainee'};
    var add=function(ds,e,isL){var mo2=mm(e[0]),cls=isL?e[9]:e[8],row={Month:mo2,Branch:branch,Dataset:ds,Group:D.cats[e[2]],Item:D.deps[e[3]]+' @ '+D.poss[e[4]]+' @ '+D.secs[e[5]]+' @ '+(isL?(CL[cls]||''):''),Approved:e[1],Current:(isL&&e[8]>=0)?e[8]:null,Male:e[6]==='M'?1:0,Female:e[6]==='F'?1:0,Insured:e[7]?1:0,Not_Insured:e[7]?0:1,Total:null,Net_Gap:null,Shortage_or_ToHire:null,Surplus:null,Fill_or_Coverage_Pct:null,cls:cls};
      R.push(row);var key=mo2+'|'+ds;(IDX[key]=IDX[key]||[]).push(row);};
    H.forEach(function(e){add('Hire',e,false);});
    Lv.forEach(function(e){add('Resign',e,true);});
    window.WIX.ledgerByYear[y]=D;window.WIX.ledgerInfo=D;
  });
}
function stfL(m){var B=window.WIX&&window.WIX.ledgerByYear,D=B&&B[String(m).slice(0,4)];if(!D||!D.staff){return null;}var y0=+D.from.slice(0,4),m0=+D.from.slice(5,7),i=(+m.slice(0,4)-y0)*12+(+m.slice(5,7)-m0);return (i>=0&&D.staff[i])?D.staff[i]:null;}
/* Division headcount straight from the published Master_Count rows (trainees never counted; Corporate Management belongs to Admin; Handicapped is its own line).
   Months without Master_Count rows return null and keep the older way of counting. */
function hcDiv(m,b){var Rr=(W&&W.f&&W.f.R)?W.f.R():null;if(!Rr){return null;}var T={},n=0;Rr.forEach(function(r){if(r.Dataset==='Master_Count'&&r.Month===m&&(!b||b==='ALL'||r.Branch===b)){T[r.Group]=(T[r.Group]||0)+(+r.Current||0);n++;}});if(!n){return null;}return {'Nursing':T['Nursing']||0,'Operation':T['Operation']||0,'Allied Health':T['Allied Health']||0,'Doctors':T['Doctors']||0,'Admin':(T['Admin']||0)+(T['Corporate Management']||0)};}
window.WIX=window.WIX||{};window.WIX.led=led;window.WIX.stfL=stfL;if(!window.WIX.hcDiv){window.WIX.hcDiv=hcDiv;}
/* "+N interns" next to the Division numbers (they are never counted) and one line that explains what is outside the divisions */
function intn(){var Rr=(W&&W.f&&W.f.R)?W.f.R():null,mo=W&&W.S&&W.S.mo;if(!Rr||!mo){return null;}var by={},tot=0,hc=0,n=0;Rr.forEach(function(r){if(r.Dataset==='Master_Count'&&r.Month===mo){var k=r.Group==='Corporate Management'?'Admin':r.Group;by[k]=(by[k]||0)+(+r.Total||0);tot+=(+r.Total||0);if(r.Group==='Handicapped'){hc+=(+r.Current||0);}n++;}});return n?{by:by,tot:tot,hc:hc}:null;}
function dec(){var I=intn();document.querySelectorAll('table').forEach(function(t){var h=t.querySelector('tr');if(!h){return;}var c=[].slice.call(h.children).map(function(x){return (x.textContent||'').trim();});if(c[0]!=='Division'||c[2]!=='Current'){return;}
  [].slice.call(t.querySelectorAll('.intn')).forEach(function(x){if(!I){x.parentNode.removeChild(x);}});
  var nx=t.nextElementSibling;if(!I){if(nx&&nx.className==='mut intnote'){nx.parentNode.removeChild(nx);}return;}
  [].slice.call(t.querySelectorAll('tr')).forEach(function(tr){var d=tr.children;if(d.length<3){return;}var k=(d[0].textContent||'').trim(),v=I.by[k];if(v&&!d[2].querySelector('.intn')){var s=document.createElement('small');s.className='intn';s.style.cssText='opacity:.6;font-weight:400;margin-left:6px;white-space:nowrap';s.textContent='+'+v+' interns';d[2].appendChild(s);}});
  var txt='Not counted: '+I.tot+' interns/trainees ('+Object.keys(I.by).filter(function(k){return I.by[k];}).map(function(k){return (k==='Interns'?'not tied to a division':k)+' '+I.by[k];}).join(', ')+'). Handicapped ('+I.hc+') are counted on their own, outside the divisions.';
  if(!nx||nx.className!=='mut intnote'){var p=document.createElement('p');p.className='mut intnote';p.style.cssText='font-size:12px;margin:6px 2px';p.textContent=txt;t.parentNode.insertBefore(p,t.nextSibling);}else if(nx.textContent!==txt){nx.textContent=txt;}});}
var dTm=null;function sched(){if(dTm){return;}dTm=setTimeout(function(){dTm=null;try{dec();}catch(e){}},120);}
try{new MutationObserver(sched).observe(document.body,{childList:true,subtree:true});sched();}catch(e){}
/* the page can load its data before this file runs (the portal does): then apply the ledger now and redraw */
if(W&&W.f&&W.f.R&&W.f.IX&&W.f.R().some(function(r){return r.Dataset==='Ledger';})){led(W.f.R(),W.f.IX(),W.f.M());try{W.render();}catch(e){}}
})();