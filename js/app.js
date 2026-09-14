(function(){
  const d=window.TOM_SAX_DATA;
  const $=(s,c=document)=>c.querySelector(s);

  const live=$('#live-grid');
  if(live && d?.media){
    live.innerHTML=d.media.slice(0,4).map((m,i)=>`
      <article class="live-card reveal" style="--media:url('${m.thumbnail || ''}')">
        <span class="live-index">0${i+1}</span>
        <div><p class="live-type">${m.type} · ${m.occasion}</p><h3>${m.title}</h3></div>
        <a href="${m.url}" target="_blank" rel="noreferrer">Voir la performance ↗</a>
      </article>`).join('');
  }

  const header=$('.header');
  const nav=$('.nav');
  const menu=$('.menu-button');
  menu?.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');
    menu.setAttribute('aria-expanded',String(open));
    menu.textContent=open?'Fermer':'Menu';
    document.body.style.overflow=open?'hidden':'';
  });
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    nav.classList.remove('open');
    menu?.setAttribute('aria-expanded','false');
    if(menu) menu.textContent='Menu';
    document.body.style.overflow='';
  }));

  const onScroll=()=>header?.classList.toggle('scrolled',window.scrollY>28);
  onScroll();
  window.addEventListener('scroll',onScroll,{passive:true});
})();