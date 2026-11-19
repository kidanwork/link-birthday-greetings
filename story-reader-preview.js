(() => {
 'use strict';
 const release=0; // Temporary preview authorized by Daria; restore scheduled reader after review.
 const gate=document.getElementById('story-gate'),reader=document.getElementById('story-reader'),clock=document.getElementById('story-countdown');
 let manifest,index=0,opening=false;
 function save(){try{localStorage.setItem('link-story-position',String(index));}catch{}}
 function show(n,scroll=false){
  index=Math.max(0,Math.min(manifest.pages.length-1,n));const p=manifest.pages[index];
  const img=document.getElementById('reader-image');img.src=p.src;img.alt=p.label;img.width=p.width;img.height=p.height;
  document.getElementById('reader-caption').textContent=p.label;
  document.getElementById('reader-select').value=String(index);
  document.querySelectorAll('[data-prev]').forEach(b=>b.disabled=index===0);
  document.querySelectorAll('[data-next]').forEach(b=>b.disabled=index===manifest.pages.length-1);
  document.querySelectorAll('[data-counter]').forEach(e=>e.textContent=`${index+1} / ${manifest.pages.length}`);
  history.replaceState(null,'',`#page=${index+1}`);save();
  if(scroll)reader.scrollIntoView({behavior:'instant',block:'start'});
 }
 async function open(){
  if(opening)return;opening=true;
  try{
   const r=await fetch('story-manifest.json');if(!r.ok)throw Error();manifest=await r.json();
   const select=document.getElementById('reader-select');
   manifest.pages.forEach((p,i)=>{const option=document.createElement('option');option.value=i;option.textContent=p.label;select.append(option);});
   select.addEventListener('change',()=>show(Number(select.value)));
   document.querySelectorAll('[data-prev]').forEach(b=>b.onclick=()=>show(index-1,true));
   document.querySelectorAll('[data-next]').forEach(b=>b.onclick=()=>show(index+1,true));
   document.addEventListener('keydown',e=>{if(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)||e.altKey||e.ctrlKey||e.metaKey)return;if(e.key==='ArrowRight'){e.preventDefault();show(index+1,true);}if(e.key==='ArrowLeft'){e.preventDefault();show(index-1,true);}});
   const hash=location.hash.match(/^#page=(\d+)$/);let saved=0;try{saved=Number(localStorage.getItem('link-story-position'))||0;}catch{}
   gate.hidden=true;reader.hidden=false;show(hash?Number(hash[1])-1:saved);
  }catch{opening=false;clock.textContent='Не удалось загрузить историю. Попробуйте обновить страницу.';}
 }
 function tick(){
  const left=release-Date.now();if(left<=0){open();return;}
  const seconds=Math.ceil(left/1000),days=Math.floor(seconds/86400),hours=Math.floor(seconds/3600)%24,minutes=Math.floor(seconds/60)%60,s=seconds%60;
  clock.textContent=`${days} дн. ${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
 }
 tick();setInterval(()=>{if(!reader.hidden)return;tick();},1000);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden&&reader.hidden)tick();});
})();
