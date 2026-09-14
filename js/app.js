(function(){
  const d=window.TOM_SAX_DATA,$=(s,c=document)=>c.querySelector(s);
  const services=$('#service-list');
  if(services) services.innerHTML=d.services.map((s,i)=>`<article class="service-item reveal"><span class="service-number">0${i+1}</span><div><h3>${s.title}</h3><p class="service-meta">${s.meta}</p></div><p>${s.text}</p></article>`).join('');
  const live=$('#live-grid');
  if(live) live.innerHTML=d.media.map((m,i)=>`<article class="live-card reveal"><span class="live-index">0${i+1}</span><div><p class="live-type">${m.type} · ${m.occasion}</p><h3>${m.title}</h3></div><a href="${m.url}" target="_blank" rel="noreferrer">Voir sur Instagram ↗</a></article>`).join('');
  const reviews=$('#reviews-grid');
  if(reviews) reviews.innerHTML=d.reviews.map(r=>`<article class="review reveal"><div class="stars" aria-label="${r.rating} étoiles">★★★★★</div><blockquote>“${r.text}”</blockquote><footer>${r.name} · ${r.event}${r.city?` · ${r.city}`:''}</footer></article>`).join('');
  const toggle=$('.menu-toggle'),nav=$('.main-nav');
  toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');document.body.classList.toggle('menu-open',open);toggle.setAttribute('aria-expanded',String(open));});
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');document.body.classList.remove('menu-open');toggle?.setAttribute('aria-expanded','false');}));
  const header=$('.site-header'),onScroll=()=>header?.classList.toggle('scrolled',window.scrollY>20);onScroll();window.addEventListener('scroll',onScroll,{passive:true});
})();