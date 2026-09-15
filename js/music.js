(function(){
  const data = window.TOM_SAX_DATA?.repertoire || [];
  const list = document.getElementById('music-list');
  const filters = document.getElementById('music-filters');
  const search = document.getElementById('music-search');
  const toggleBtn = document.getElementById('music-toggle');

  // Éléments de la modale "Proposer un morceau"
  const modal = document.getElementById('suggest-modal');
  const modalClose = document.getElementById('close-suggest-modal');
  const suggestForm = document.getElementById('suggest-form');
  const suggestSongInput = document.getElementById('suggest-song');
  const suggestStatus = document.getElementById('suggest-status');
  let lastFocusedElement = null;

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
      if (q) {
        list.innerHTML = `
          <div class="music-empty-state">
            <p class="music-empty-title">Vous ne trouvez pas votre morceau ?</p>
            <p class="music-empty-desc">Tom peut peut-être le préparer spécialement pour votre événement.</p>
            <button type="button" class="btn btn-gold music-suggest-btn" id="open-suggest-modal">Proposer ce morceau <span>→</span></button>
          </div>
        `;
        document.getElementById('open-suggest-modal')?.addEventListener('click', (e) => {
          openSuggestModal((search?.value || '').trim(), e.currentTarget);
        });
      } else {
        list.innerHTML = '<p class="music-empty-simple">Aucun morceau dans cette catégorie.</p>';
      }
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

  // =========================================================================
  // Gestion accessible de la modale "Proposer un morceau"
  // =========================================================================

  const openSuggestModal = (initialQuery, triggerEl) => {
    if (!modal) return;
    lastFocusedElement = triggerEl || document.activeElement;

    if (suggestSongInput && initialQuery) {
      suggestSongInput.value = initialQuery;
    }

    // Préremplissage depuis le brouillon sessionStorage si disponible
    try {
      const raw = sessionStorage.getItem('tomsax_song_request_draft');
      if (raw) {
        const draft = JSON.parse(raw);
        if (draft) {
          const mapping = {
            'suggest-artist': 'requestedArtist',
            'suggest-link': 'requestedSongLink',
            'suggest-event-type': 'eventType',
            'suggest-event-date': 'eventDate',
            'suggest-first-name': 'firstName',
            'suggest-email': 'email',
            'suggest-phone': 'phone'
          };
          Object.entries(mapping).forEach(([elId, key]) => {
            const input = document.getElementById(elId);
            if (input && !input.value && draft[key]) {
              input.value = draft[key];
            }
          });
        }
      }
    } catch(e) {
      console.warn('Erreur lecture brouillon modal:', e);
    }

    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';

    // Focus sur le champ le plus pertinent
    const artistInput = document.getElementById('suggest-artist');
    if (suggestSongInput && !suggestSongInput.value) {
      suggestSongInput.focus();
    } else if (artistInput) {
      artistInput.focus();
    } else {
      modalClose?.focus();
    }
  };

  const closeSuggestModal = () => {
    if (!modal || modal.hasAttribute('hidden')) return;
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
    if (suggestStatus) suggestStatus.textContent = '';
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  };

  modalClose?.addEventListener('click', closeSuggestModal);

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeSuggestModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.hasAttribute('hidden')) {
      closeSuggestModal();
    }
  });

  // Focus trap à l'intérieur de la modale
  modal?.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusable = modal.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      last.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === last) {
      first.focus();
      e.preventDefault();
    }
  });

  // Soumission de la demande de morceau
  suggestForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!suggestForm.checkValidity()) {
      const firstInvalid = suggestForm.querySelector(':invalid');
      if (firstInvalid) firstInvalid.focus();
      suggestForm.reportValidity();
      return;
    }

    const fd = Object.fromEntries(new FormData(suggestForm).entries());

    // 1. Sauvegarde du brouillon temporaire en sessionStorage
    const draft = {
      firstName: fd.firstName || '',
      email: fd.email || '',
      phone: fd.phone || '',
      eventType: fd.eventType || '',
      eventDate: fd.eventDate || '',
      requestedSong: fd.requestedSong || '',
      requestedArtist: fd.requestedArtist || '',
      requestedSongLink: fd.requestedSongLink || ''
    };
    try {
      sessionStorage.setItem('tomsax_song_request_draft', JSON.stringify(draft));
    } catch(err) {
      console.warn('Erreur écriture sessionStorage:', err);
    }

    // 2. Création d'un lead compatible dans localStorage (démo Tom Sax)
    const LEADS_KEY = 'tomsax_leads_v1';
    const lead = {
      id: `lead-song-${Date.now()}`,
      source: 'repertoire',
      requestedSong: fd.requestedSong || '',
      requestedArtist: fd.requestedArtist || '',
      requestedSongLink: fd.requestedSongLink || '',
      eventType: fd.eventType || '',
      eventDate: fd.eventDate || '',
      firstName: fd.firstName || '',
      lastName: '',
      email: fd.email || '',
      phone: fd.phone || '',
      message: fd.message ? `[Demande morceau] ${fd.message}` : '[Demande morceau]',
      location: 'À préciser',
      status: 'Nouveau',
      createdAt: new Date().toISOString(),
      demo: false
    };

    try {
      const existing = JSON.parse(localStorage.getItem(LEADS_KEY) || 'null') || window.TOM_SAX_DATA?.demo?.leads || [];
      existing.unshift(lead);
      localStorage.setItem(LEADS_KEY, JSON.stringify(existing));
    } catch(err) {
      console.warn('Erreur écriture localStorage lead:', err);
    }

    // 3. Synchronisation immédiate avec le formulaire principal
    if (typeof window.tomSaxSyncDraft === 'function') {
      window.tomSaxSyncDraft();
    }

    // 4. Message honnête sur le mode démonstration
    if (suggestStatus) {
      suggestStatus.textContent = 'Mode démonstration : la demande a été enregistrée uniquement sur cet appareil afin de présenter le fonctionnement de l’espace Tom. Aucun message n’a été envoyé.';
      suggestStatus.className = 'form-status form-status-success';
    }

    // Fermeture après quelques secondes
    setTimeout(() => {
      closeSuggestModal();
      suggestForm.reset();
    }, 2800);
  });

  render();
})();