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
  const suggestArtistInput = document.getElementById('suggest-artist');
  const suggestLinkInput = document.getElementById('suggest-link');
  const suggestSubmitBtn = document.getElementById('suggest-submit-btn');
  const suggestStatus = document.getElementById('suggest-status');
  let lastFocusedElement = null;
  let successCloseTimeout = null;

  if (!list || !filters) return;

  const categories = ['Tous', ...new Set(data.map(s => s.category))];
  let activeCategory = 'Tous';
  let isExpanded = false;
  const INITIAL_LIMIT = 8;

  // Mise à jour dynamique de la description avec le nombre réel de morceaux
  const descEl = document.getElementById('repertoire-desc');
  if (descEl && data.length) {
    descEl.textContent = `Un répertoire de ${data.length} titres soigneusement sélectionnés, des classiques intemporels aux hits électro et pop actuels. Recherchez un titre ou filtrez selon l'ambiance souhaitée.`;
  }

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
          : `Voir les ${matched.length} morceaux ↓`;
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

  const updateSubmitState = () => {
    if (!suggestSubmitBtn || !suggestSongInput) return;
    const hasSong = Boolean(suggestSongInput.value.trim());
    suggestSubmitBtn.disabled = !hasSong;
  };

  suggestSongInput?.addEventListener('input', () => {
    updateSubmitState();
    suggestSongInput.closest('.modal-field')?.classList.remove('has-error');
  });

  const openSuggestModal = (initialQuery, triggerEl) => {
    if (!modal) return;
    lastFocusedElement = triggerEl || document.activeElement;

    if (successCloseTimeout) {
      clearTimeout(successCloseTimeout);
      successCloseTimeout = null;
    }

    // Réinitialiser le formulaire et retirer la carte de succès si présente
    const successCard = modal.querySelector('.modal-success-card');
    if (successCard) successCard.remove();
    if (suggestForm) {
      suggestForm.style.display = 'flex';
      suggestForm.reset();
      suggestForm.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
    }
    if (suggestStatus) {
      suggestStatus.textContent = '';
      suggestStatus.className = 'form-status';
    }

    // Pré-remplissage avec la recherche ou le brouillon
    if (suggestSongInput) {
      if (initialQuery) {
        suggestSongInput.value = initialQuery;
      } else {
        try {
          const raw = sessionStorage.getItem('tomsax_song_request_draft');
          if (raw) {
            const draft = JSON.parse(raw);
            if (draft?.requestedSong) suggestSongInput.value = draft.requestedSong;
            if (draft?.requestedArtist && suggestArtistInput) suggestArtistInput.value = draft.requestedArtist;
            if (draft?.requestedSongLink && suggestLinkInput) suggestLinkInput.value = draft.requestedSongLink;
          }
        } catch (e) {
          console.warn('Erreur lecture brouillon modal:', e);
        }
      }
    }

    updateSubmitState();

    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';

    // Autofocus sur "Morceau recherché"
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (suggestSongInput) {
          suggestSongInput.focus();
          if (suggestSongInput.value) {
            suggestSongInput.select();
          }
        }
      }, 40);
    });
  };

  const closeSuggestModal = () => {
    if (!modal || modal.hasAttribute('hidden')) return;
    if (successCloseTimeout) {
      clearTimeout(successCloseTimeout);
      successCloseTimeout = null;
    }
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
    const focusable = modal.querySelectorAll('button:not(:disabled), input:not(:disabled), [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
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

    const song = (suggestSongInput?.value || '').trim();
    if (!song) {
      suggestSongInput?.closest('.modal-field')?.classList.add('has-error');
      suggestSongInput?.focus();
      return;
    }

    const artist = (suggestArtistInput?.value || '').trim();
    const link = (suggestLinkInput?.value || '').trim();

    // 1. Sauvegarde du brouillon temporaire en sessionStorage
    const draft = {
      requestedSong: song,
      requestedArtist: artist,
      requestedSongLink: link
    };
    try {
      sessionStorage.setItem('tomsax_song_request_draft', JSON.stringify(draft));
    } catch(err) {
      console.warn('Erreur écriture sessionStorage:', err);
    }

    // 2. Création du lead dans localStorage (espace Tom / démo)
    const LEADS_KEY = 'tomsax_leads_v1';
    const lead = {
      id: `lead-song-${Date.now()}`,
      source: 'repertoire',
      requestedSong: song,
      requestedArtist: artist,
      requestedSongLink: link,
      eventType: 'Proposition de morceau',
      eventDate: '—',
      firstName: 'Proposition',
      lastName: 'Morceau',
      email: '—',
      phone: '—',
      location: '—',
      message: artist ? `Morceau : ${song} (Artiste : ${artist})` : `Morceau : ${song}`,
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

    // 3. Synchronisation avec le formulaire de réservation principal
    if (typeof window.tomSaxSyncDraft === 'function') {
      window.tomSaxSyncDraft();
    }

    // 4. Affichage du message de confirmation élégant
    suggestForm.style.display = 'none';

    const card = modal.querySelector('.modal-card');
    const successCard = document.createElement('div');
    successCard.className = 'modal-success-card';
    successCard.innerHTML = `
      <div class="modal-success-icon" aria-hidden="true">✓</div>
      <p class="modal-success-title">Demande transmise</p>
      <p class="modal-success-text">Votre demande a bien été envoyée à Tom.</p>
      <p class="modal-success-sub">Tom étudiera la faisabilité selon le style du morceau et le contexte de la prestation.</p>
      <button type="button" class="btn btn-outline-gold btn-modal-close-confirm" id="btn-close-modal-confirm">Fermer</button>
    `;
    card.appendChild(successCard);

    document.getElementById('btn-close-modal-confirm')?.addEventListener('click', closeSuggestModal);

    // Fermeture automatique fluide après 3.2 secondes
    successCloseTimeout = setTimeout(() => {
      closeSuggestModal();
    }, 3200);
  });

  window.openSuggestModal = openSuggestModal;

  render();
})();