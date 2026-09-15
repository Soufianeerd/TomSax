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

  // Smart Header : compact au scroll (>24px), auto-hide au scroll bas (>120px), réapparition au scroll haut
  let lastScrollY = window.scrollY;
  const SCROLL_THRESHOLD = 120;
  const DELTA_TOLERANCE = 4;
  let isNavigatingAnchor = false;
  let anchorNavTimeout = null;

  const handleHeader = () => {
    const currentScrollY = window.scrollY;
    const isMobileOpen = mobileNav?.classList.contains('open');

    if (isMobileOpen) {
      header?.classList.remove('header-hidden');
      return;
    }

    if (currentScrollY > 24) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
      header?.classList.remove('header-hidden');
    }

    if (isNavigatingAnchor) {
      header?.classList.remove('header-hidden');
      lastScrollY = currentScrollY;
      return;
    }

    if (currentScrollY > SCROLL_THRESHOLD) {
      if (currentScrollY > lastScrollY + DELTA_TOLERANCE) {
        // Défilement vers le bas : masquer le header
        header?.classList.add('header-hidden');
      } else if (currentScrollY < lastScrollY - DELTA_TOLERANCE) {
        // Défilement vers le haut : réafficher le header compact
        header?.classList.remove('header-hidden');
      }
    } else {
      header?.classList.remove('header-hidden');
    }

    lastScrollY = currentScrollY;
  };

  handleHeader();
  window.addEventListener('scroll', handleHeader, { passive: true });

  // Réaffichage garanti lors d'un clic d'ancre ou changement de hash
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', () => {
      isNavigatingAnchor = true;
      header?.classList.remove('header-hidden');
      clearTimeout(anchorNavTimeout);
      anchorNavTimeout = setTimeout(() => {
        isNavigatingAnchor = false;
        lastScrollY = window.scrollY;
      }, 900);
    });
  });
  window.addEventListener('hashchange', () => {
    isNavigatingAnchor = true;
    header?.classList.remove('header-hidden');
    clearTimeout(anchorNavTimeout);
    anchorNavTimeout = setTimeout(() => {
      isNavigatingAnchor = false;
      lastScrollY = window.scrollY;
    }, 900);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) setMenu(false);
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