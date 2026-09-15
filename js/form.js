(function(){
  const form = document.getElementById('event-form');
  const status = document.getElementById('form-status');
  if (!form) return;

  const KEY = 'tomsax_leads_v1';
  const DRAFT_KEY = 'tomsax_song_request_draft';

  const syncFromDraft = () => {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw);
      if (!draft) return;

      const fields = ['firstName', 'email', 'phone', 'eventType', 'eventDate'];
      fields.forEach(f => {
        const el = form.elements[f];
        if (el && !el.value && draft[f]) {
          el.value = draft[f];
        }
      });

      const messageEl = form.elements['message'];
      if (messageEl && draft.requestedSong) {
        const songNote = `Morceau souhaité : ${draft.requestedSong}${draft.requestedArtist ? ' (Artiste : ' + draft.requestedArtist + ')' : ''}${draft.requestedSongLink ? ' — ' + draft.requestedSongLink : ''}`;
        if (!messageEl.value.includes(draft.requestedSong)) {
          messageEl.value = messageEl.value ? `${songNote}\n\n${messageEl.value}` : songNote;
        }
      }
    } catch(e) {
      console.warn('Erreur synchronisation brouillon:', e);
    }
  };

  window.tomSaxSyncDraft = syncFromDraft;
  syncFromDraft();

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.checkValidity()) {
      const firstInvalid = form.querySelector(':invalid');
      if (firstInvalid) firstInvalid.focus();
      form.reportValidity();
      return;
    }

    const lead = Object.fromEntries(new FormData(form).entries());
    lead.id = `lead-${Date.now()}`;
    lead.status = 'Nouveau';
    lead.createdAt = new Date().toISOString();
    lead.demo = false;

    const existing = JSON.parse(localStorage.getItem(KEY) || 'null') || window.TOM_SAX_DATA?.demo?.leads || [];
    existing.unshift(lead);
    localStorage.setItem(KEY, JSON.stringify(existing));

    if (status) {
      status.textContent = 'Mode démonstration : la demande a été enregistrée uniquement sur cet appareil afin de présenter le fonctionnement de l’espace Tom. Aucun message n’a été envoyé.';
      status.className = 'form-status form-status-success';
    }
    form.reset();
  });
})();