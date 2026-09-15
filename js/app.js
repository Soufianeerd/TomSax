(function(){
  const header=document.querySelector('.site-header');
  const menu=document.querySelector('.menu-btn');
  const mobileNav=document.querySelector('.mobile-nav');

  const setMenu=(open)=>{
    if(!menu||!mobileNav)return;
    mobileNav.classList.toggle('open',open);
    menu.setAttribute('aria-expanded',String(open));
    menu.textContent=open?'Fermer':'Menu';
    document.body.style.overflow=open?'hidden':'';
  };

  menu?.addEventListener('click',()=>{
    setMenu(!mobileNav.classList.contains('open'));
  });

  mobileNav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));

  // Fermeture du menu mobile avec Escape
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&mobileNav?.classList.contains('open')){
      setMenu(false);
      menu?.focus();
    }
  });

  const onScroll=()=>header?.classList.toggle('scrolled',window.scrollY>24);
  onScroll();
  window.addEventListener('scroll',onScroll,{passive:true});

  window.addEventListener('resize',()=>{
    if(window.innerWidth>820)setMenu(false);
  });

  // Actions contextuelles des cartes prestations
  document.querySelectorAll('.service-action').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const s=btn.dataset.service;
      const form=document.getElementById('event-form');
      if(!form)return;

      const typeSelect=form.elements['eventType'];
      const momentSelect=form.elements['moment'];

      if(s==='ceremonie'){
        if(typeSelect&&!typeSelect.value)typeSelect.value='Mariage';
        if(momentSelect)momentSelect.value='Cérémonie uniquement';
      }else if(s==='cocktail'){
        if(typeSelect&&!typeSelect.value)typeSelect.value="Cocktail / Vin d'honneur";
        if(momentSelect)momentSelect.value="Cocktail & Vin d'honneur";
      }else if(s==='djsax'){
        if(typeSelect&&!typeSelect.value)typeSelect.value='Soirée privée';
        if(momentSelect)momentSelect.value='Soirée dansante / DJ + Sax live';
      }
      // Pour 'corporate', aucun préremplissage agressif
    });
  });
})();