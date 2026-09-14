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

  const onScroll=()=>header?.classList.toggle('scrolled',window.scrollY>24);
  onScroll();
  window.addEventListener('scroll',onScroll,{passive:true});

  window.addEventListener('resize',()=>{
    if(window.innerWidth>820)setMenu(false);
  });
})();