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
window.WIX=window.WIX||{};window.WIX.led=led;window.WIX.stfL=stfL;
/* the page can load its data before this file runs (the portal does): then apply the ledger now and redraw */
if(W&&W.f&&W.f.R&&W.f.IX&&W.f.R().some(function(r){return r.Dataset==='Ledger';})){led(W.f.R(),W.f.IX(),W.f.M());try{W.render();}catch(e){}}
})();