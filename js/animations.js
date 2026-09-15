(function(){
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  document.body.classList.add('js-animate');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '60px 0px' });

  reveals.forEach(el => obs.observe(el));
})();