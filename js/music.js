(function(){
  const data = window.TOM_SAX_DATA?.repertoire || [];
  const list = document.getElementById('music-list');
  const filters = document.getElementById('music-filters');
  const search = document.getElementById('music-search');
  const toggleBtn = document.getElementById('music-toggle');

  if (!list || !filters) return;

  const categories = ['Tous', ...new Set(data.map(s => s.category))];
  let activeCategory = 'Tous';
  let isExpanded = false;
  const INITIAL_LIMIT = 9;

  // Création des filtres par genre
  filters.innerHTML = categories.map(c =>
    `<button class="filter-btn${c === 'Tous' ? ' active' : ''}" type="button" data-cat="${c}">${c}</button>`
  ).join('');

  const render = () => {
    const q = (search?.value || '').trim().toLowerCase();

    // Filtre sur visibilité, catégorie et recherche
    const matched = data.filter(s =>
      s.visible !== false &&
      (activeCategory === 'Tous' || s.category === activeCategory) &&
      (!q || `${s.title} ${s.artist}`.toLowerCase().includes(q))
    );

    const shouldTruncate = !isExpanded && !q && matched.length > INITIAL_LIMIT;
    const displayed = shouldTruncate ? matched.slice(0, INITIAL_LIMIT) : matched;

    if (!displayed.length) {
      list.innerHTML = '<p style="padding: 2rem 0; color: #888; font-size: 15px;">Aucun morceau trouvé pour cette recherche.</p>';
      if (toggleBtn) toggleBtn.style.display = 'none';
      return;
    }

    list.innerHTML = displayed.map(s => `
      <div class="music-row">
        <div>
          <div class="music-title">${s.title}${s.featured ? ' <span aria-label="Titre recommandé">★</span>' : ''}</div>
          <div class="music-artist">${s.artist}</div>
        </div>
        <div class="music-category">${s.category}</div>
      </div>
    `).join('');

    // Mise à jour du bouton d'extension
    if (toggleBtn) {
      if (q || matched.length <= INITIAL_LIMIT) {
        toggleBtn.style.display = 'none';
      } else {
        toggleBtn.style.display = 'inline-flex';
        toggleBtn.textContent = isExpanded
          ? 'Réduire le répertoire ↑'
          : `Voir tout le répertoire (${matched.length} morceaux) ↓`;
      }
    }
  };

  filters.addEventListener('click', e => {
    const btn = e.target.closest('[data-cat]');
    if (!btn) return;
    activeCategory = btn.dataset.cat;
    filters.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b === btn));
    render();
  });

  search?.addEventListener('input', () => {
    render();
  });

  toggleBtn?.addEventListener('click', () => {
    isExpanded = !isExpanded;
    render();
  });

  render();
})();