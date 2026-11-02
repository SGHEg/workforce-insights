(function(){
/* Refresh = new data AND new site code. After a Publish, one click (or opening the page) picks up the new version, no Ctrl+F5 needed. */
function chk(){
  var m=document.querySelector('meta[name=wv]'),cur=m?m.getAttribute('content'):'';
  if(!cur){return;}
  fetch('index.html?t='+Date.now(),{cache:'no-store'}).then(function(r){return r.text();}).then(function(h){
    var x=/name=.wv. content=.([^'"]*)./.exec(h),nv=x?x[1]:'',done='';
    if(!nv||nv===cur){return;}
    try{done=sessionStorage.getItem('wi_rl')||'';}catch(e){}
    if(done===nv){return;}
    try{sessionStorage.setItem('wi_rl',nv);}catch(e){}
    var b=document.getElementById('rf');if(b){b.textContent='New version found, reloading...';}
    setTimeout(function(){location.href=location.pathname+'?v='+encodeURIComponent(nv);},700);
  }).catch(function(){});
}
window.WIX=window.WIX||{};window.WIX.chk=chk;
})();