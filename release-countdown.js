(() => {
 const deadline=Date.parse('2026-11-21T00:01:00+03:00');
 function update(){
  const remaining=deadline-Date.now();
  if(remaining<=0){
   document.querySelectorAll('[data-release-heading]').forEach(e=>e.textContent='История уже началась!');
   return;
  }
  const n=Math.ceil(remaining/1000),d=Math.floor(n/86400),h=Math.floor(n/3600)%24,m=Math.floor(n/60)%60,s=n%60;
  const text=`${d} дн. ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  document.querySelectorAll('[data-release-countdown]').forEach(e=>e.textContent=text);
 }
 update();setInterval(update,1000);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)update()});
})();
