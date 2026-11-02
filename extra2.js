(function(){var W=window.__wi,F=W.f,S=W.S;
function sp(o){var i=o.Item.indexOf(' @ ');return {pos:mp(o.Group,i<0?o.Item:o.Item.slice(0,i)),dep:i<0?'':o.Item.slice(i+3),div:o.Group,a:o.Approved||0,c:o.Current||0};}
function mp(g,p){return (g==='Nursing'&&/^(senior )?staff nurse$/i.test(String(p).trim()))?'Staff Nurse + Senior Staff Nurse':p;}
/* ---- Nursing Command Radar (styles are in style2.css): Category > Department > Position ---- */
var RD={cat:null,dep:null,sort:'gap'},RDC=['Nursing','Nursing Support','Nursing Internship'],RDK=['Nursing','Nursing Support'];
function rdCat(p){p=String(p||'');if(/caregiver/i.test(p)){return 'Nursing Internship';}if(/pain management/i.test(p)){return 'Nursing';}if(/clerk|technician|coordinator|porter|poter|secretary|phlebotom|cssd head/i.test(p)){return 'Nursing Support';}return 'Nursing';}
function rdRows(){var R=F.get('PosDept',S.mo,S.br).map(sp).filter(function(r){return r.div==='Nursing';}).map(function(r){r.cat=rdCat(r.pos);return r;});var T={};F.get('Workforce_Nursing_Split',S.mo,S.br).forEach(function(o){T[o.Item]=(T[o.Item]||0)+(o.Total||0);});RDC.forEach(function(c){var have=R.filter(function(r){return r.cat===c;}).reduce(function(t,r){return t+(r.c||0);},0),d=(T[c]||0)-have;if(d>0){R.push({pos:'Not on the approved list',dep:'Not on the approved list',div:'Nursing',a:0,c:d,cat:c});}});return R;}
function rdSum(L){return L.reduce(function(t,r){return {a:t.a+(r.a||0),c:t.c+(r.c||0)};},{a:0,c:0});}
function rdHeat(a,c){if(!a){return {c:'#7a5cc7',f:null};}var f=c/a;return {c:f>=1?'#1aa37a':(f>=0.9?'#5fb34a':(f>=0.8?'#e0a100':'#d64545')),f:f};}
function rdPill(a,c){var g=(c||0)-(a||0);if(!a){return "<span class='nr-gp nr-n'>"+F.n0(c)+" people</span>";}if(g===0){return "<span class='nr-gp nr-z'>&#9679; on target</span>";}return g<0?"<span class='nr-gp nr-s'>&#9660; "+F.n0(-g)+" short</span>":"<span class='nr-gp nr-p'>&#9650; +"+F.n0(g)+"</span>";}
function rdGauge(f,col){var C=2*Math.PI*17,p=Math.max(0,Math.min(1,f||0));return "<div class='nr-gauge'><svg viewBox='0 0 44 44'><circle cx='22' cy='22' r='17' fill='none' stroke='rgba(100,116,139,.2)' stroke-width='5'/><circle cx='22' cy='22' r='17' fill='none' stroke='"+col+"' stroke-width='5' stroke-linecap='round' stroke-dasharray='"+(p*C).toFixed(1)+" "+C.toFixed(1)+"'/></svg><b>"+(f==null?'-':Math.round(f*100)+'%')+"</b></div>";}
function rdGrp(rows,key){var G={},O=[];rows.forEach(function(r){var k=r[key];if(!G[k]){G[k]={n:k,a:0,c:0};O.push(G[k]);}G[k].a+=r.a||0;G[k].c+=r.c||0;});return O.filter(function(o){return o.a||o.c;});}
function rdSort(O){var k=RD.sort;return O.sort(function(x,y){if(k==='size'){return (y.a||y.c)-(x.a||x.c)||y.c-x.c;}if(k==='az'){return x.n<y.n?-1:1;}return (x.c-x.a)-(y.c-y.a)||y.a-x.a;});}
function rdRadar(core){
  var O=rdGrp(core,'dep').filter(function(o){return o.a>0;});
  var s="<svg viewBox='-62 -62 124 124' class='nr-rad'><defs><linearGradient id='nrg' x1='0' y1='0' x2='1' y2='0'><stop offset='0' stop-color='#3be8a0' stop-opacity='0'/><stop offset='1' stop-color='#3be8a0' stop-opacity='.6'/></linearGradient></defs><circle r='60' fill='rgba(5,30,40,.35)'/>";
  [20,40,58].forEach(function(r){s+="<circle r='"+r+"' fill='none' stroke='rgba(255,255,255,.3)' stroke-width='.6'/>";});
  s+="<path d='M-58 0H58M0 -58V58' stroke='rgba(255,255,255,.22)' stroke-width='.6'/><g><animateTransform attributeName='transform' type='rotate' from='0 0 0' to='360 0 0' dur='4s' repeatCount='indefinite'/><path d='M0 0L0 -58A58 58 0 0 1 41 -41Z' fill='url(#nrg)'/><path d='M0 0L0 -58' stroke='#7dffc4' stroke-width='1.2'/></g>";
  O.forEach(function(o,i){var f=o.c/o.a,an=i*137.508*Math.PI/180,d=58*Math.max(0.2,Math.min(1,f/1.25)),ht=rdHeat(o.a,o.c),bg=((i%8)*0.3).toFixed(2);s+="<circle class='nr-blip' cx='"+(d*Math.sin(an)).toFixed(1)+"' cy='"+(-d*Math.cos(an)).toFixed(1)+"' r='2.7' fill='"+ht.c+"' stroke='#fff' stroke-width='.6'><title>"+F.esc(o.n)+" - "+F.pc(f)+"</title><animate attributeName='r' values='2.2;3.7;2.2' dur='2.4s' begin='"+bg+"s' repeatCount='indefinite'/><animate attributeName='opacity' values='.6;1;.6' dur='2.4s' begin='"+bg+"s' repeatCount='indefinite'/></circle>";});
  return s+"<circle r='2.2' fill='#7dffc4'/></svg>";
}
function rdRow(o,i,attr,mx){var ht=rdHeat(o.a,o.c);return "<div class='nr-row"+(attr?' go':'')+"' style='--c:"+ht.c+";--i:"+i+"'"+(attr||'')+"><div class='nr-nm'><b>"+F.esc(o.n)+"</b><div class='nr-bar'><i class='ap' style='width:"+(o.a/mx*100).toFixed(1)+"%'></i><i class='cu' style='width:"+(Math.min(o.c,mx)/mx*100).toFixed(1)+"%'></i></div></div><div class='nr-nu'><small>Approved</small><b>"+F.n0(o.a)+"</b></div><div class='nr-nu'><small>Current</small><b>"+F.n0(o.c)+"</b></div>"+rdPill(o.a,o.c)+"<span class='nr-pc'>"+(ht.f==null?'-':Math.round(ht.f*100)+'%')+"</span><i class='nr-go'>"+(attr?'&rsaquo;':'')+"</i></div>";}
function rdSumBar(label,t){var ht=rdHeat(t.a,t.c);return "<div class='nr-sum'><b>"+label+"</b><span>Approved <b>"+F.n0(t.a)+"</b></span><span>Current <b>"+F.n0(t.c)+"</b></span>"+rdPill(t.a,t.c)+"<span style='font-weight:800;color:"+ht.c+"'>"+(ht.f==null?'-':F.pc(ht.f))+"</span></div>";}
function rdInner(){
  var R=rdRows();if(!R.length){return "<div class='nr-body'><p class='mut'>Approved manpower by unit appears after the next publish from the updated workbook.</p></div>";}
  if(RD.cat&&RDC.indexOf(RD.cat)<0){RD.cat=null;RD.dep=null;}
  var isI=RD.cat==='Nursing Internship',L=R.filter(function(r){return !RD.cat||r.cat===RD.cat;});
  if(RD.dep&&!L.some(function(r){return r.dep===RD.dep;})){RD.dep=null;}
  var core=R.filter(function(r){return r.cat!=='Nursing Internship';});
  var bc="<nav class='nr-bc'><button class='nr-pill"+(RD.cat?'':' on')+"' data-rd='root'>&#8962; All nursing</button>";
  if(RD.cat){bc+="<span class='nr-sep'>&rsaquo;</span><button class='nr-pill"+(RD.dep?'':' on')+"' data-rd='cat' data-v='"+F.esc(RD.cat)+"'>"+F.esc(RD.cat)+"</button>";}
  if(RD.dep){bc+="<span class='nr-sep'>&rsaquo;</span><button class='nr-pill on'>"+F.esc(RD.dep)+"</button>";}
  bc+="</nav>";
  var sg="";if(RD.cat&&!isI){sg="<div class='nr-seg'>"+[['gap','Biggest gap'],['size','Largest'],['az','A-Z']].map(function(x){return "<button class='"+(RD.sort===x[0]?'on':'')+"' data-rd='sort' data-v='"+x[0]+"'>"+x[1]+"</button>";}).join('')+"</div>";}
  var h="<div class='nr-body'><div class='nr-top'>"+bc+sg+"</div>";
  if(!RD.cat){
    var iv=R.filter(function(r){return r.cat==='Nursing Internship';}),ic=rdSum(iv).c,iu=rdGrp(iv,'dep').filter(function(o){return o.n!=='Not on the approved list';}).length;
    h+="<div class='nr-cats'>"+RDK.map(function(c,i){var s=rdSum(R.filter(function(r){return r.cat===c;})),ht=rdHeat(s.a,s.c);return "<button class='nr-cat' data-rd='cat' data-v='"+c+"' style='--c:"+ht.c+";--i:"+i+"'>"+rdGauge(ht.f,ht.c)+"<div class='nr-ct'><h4>"+c+"</h4><div class='nr-nums'><span><small>Approved</small><b>"+F.n0(s.a)+"</b></span><span><small>Current</small><b>"+F.n0(s.c)+"</b></span></div></div>"+rdPill(s.a,s.c)+"</button>";}).join('')
      +"<button class='nr-cat nr-int' data-rd='cat' data-v='Nursing Internship' style='--c:#7a5cc7;--i:2'><div class='nr-gauge'><span class='big'>"+F.n0(ic)+"</span></div><div class='nr-ct'><h4>Nursing Internship</h4><div class='nr-nums'><span><small>Interns</small><b>"+F.n0(ic)+"</b></span><span><small>Units</small><b>"+F.n0(iu)+"</b></span></div></div><span class='nr-gp nr-n'>count only &middot; no approved manpower</span></button></div>";
    h+=rdSumBar('All nursing (without interns)',rdSum(core));
  }else if(isI){
    var U=rdGrp(L,'dep').sort(function(x,y){return y.c-x.c;}),mx=Math.max.apply(null,U.map(function(o){return o.c;}).concat([1]));
    h+="<div class='nr-list'>"+U.map(function(o,i){return "<div class='nr-row' style='--c:#7a5cc7;--i:"+i+";grid-template-columns:minmax(140px,4fr) 90px'><div class='nr-nm'><b>"+F.esc(o.n==='Not on the approved list'?'Unit not on the approved list':o.n)+"</b><div class='nr-bar'><i class='cu' style='width:"+(o.c/mx*100).toFixed(1)+"%'></i></div></div><div class='nr-nu'><small>Interns</small><b>"+F.n0(o.c)+"</b></div></div>";}).join('')+"</div>";
    h+="<div class='nr-sum'><b>Interns</b><span><b>"+F.n0(rdSum(L).c)+"</b> people &middot; not counted in approved, gap or percentages</span></div>";
  }else if(!RD.dep){
    var O=rdSort(rdGrp(L,'dep')),mx2=Math.max.apply(null,O.map(function(o){return Math.max(o.a,o.c);}).concat([1]));
    h+="<div class='nr-list'>"+O.map(function(o,i){return rdRow(o,i," data-rd='dep' data-v='"+F.esc(o.n)+"'",mx2);}).join('')+"</div>"+rdSumBar(F.esc(RD.cat),rdSum(L));
  }else{
    var D=L.filter(function(r){return r.dep===RD.dep;}),P=rdSort(rdGrp(D,'pos')),mx3=Math.max.apply(null,P.map(function(o){return Math.max(o.a,o.c);}).concat([1]));
    h+="<div class='nr-list'>"+P.map(function(o,i){return rdRow(o,i,'',mx3);}).join('')+"</div>"+rdSumBar(F.esc(RD.dep),rdSum(D));
  }
  return h+"</div>";
}
function radar(){
  var R=rdRows(),core=R.filter(function(r){return r.cat!=='Nursing Internship';}),s=rdSum(core),ht=rdHeat(s.a,s.c);
  return "<div class='card nr'><div class='nr-hero'><div class='nr-hl'><div class='nr-eye'>"+F.mlabel(S.mo)+" &middot; live manpower coverage</div><h2>Nursing Command Radar</h2><p>Tap a category, then a department, then a position. Gap = current &minus; approved (&#9650; above, &#9660; short).</p><div class='nr-k'><div class='nr-kc'><small>Approved</small><b>"+F.n0(s.a)+"</b></div><div class='nr-kc'><small>Current</small><b>"+F.n0(s.c)+"</b></div><div class='nr-kc'><small>Gap</small><b>"+(s.c-s.a>0?'+':'')+F.n0(s.c-s.a)+"</b></div><div class='nr-kc'><small>Coverage</small><b>"+(ht.f==null?'-':F.pc(ht.f))+"</b></div></div></div><div class='nr-hr'>"+rdRadar(core)+"</div></div>"
    +"<div id='rdr'>"+rdInner()+"</div>"
    +"<div class='nr-key'><span><i style='background:#1aa37a'></i>100%+</span><span><i style='background:#5fb34a'></i>90-99%</span><span><i style='background:#e0a100'></i>80-89%</span><span><i style='background:#d64545'></i>under 80%</span><span><i style='background:#7a5cc7'></i>interns: count only</span><span>Radar dots = departments (closer to the centre = less covered)</span></div>"
    +"<p class='note'>Current = everyone in the Master for that category. <b>Nursing Internship</b> has no approved manpower, so interns are shown as a count only and are left out of totals, gaps and percentages. <b>Not on the approved list</b> = people whose unit or position is not in the approved manpower list.</p></div>";
}
document.addEventListener('click',function(e){var t=e.target&&e.target.closest?e.target.closest('[data-rd]'):null;if(!t){return;}var a=t.getAttribute('data-rd');
  if(a==='root'){RD.cat=null;RD.dep=null;}else if(a==='cat'){RD.cat=t.getAttribute('data-v');RD.dep=null;}else if(a==='dep'){RD.dep=t.getAttribute('data-v');}else if(a==='sort'){RD.sort=t.getAttribute('data-v');}
  var c=document.getElementById('rdr');if(c){c.innerHTML=rdInner();}});
window.WIX=window.WIX||{};window.WIX.radar=radar;
})();