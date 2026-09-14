(function(){
  if(!localStorage.getItem('tomsax_demo_auth')){location.href='login.html';return;}
  const D=window.TOM_SAX_DATA,app=document.getElementById('admin-app');
  const K={leads:'tomsax_leads_v1',events:'tomsax_events_v1',songs:'tomsax_songs_v1'};
  const clone=x=>JSON.parse(JSON.stringify(x));
  const load=(key,seed)=>{const raw=localStorage.getItem(key);if(raw)return JSON.parse(raw);localStorage.setItem(key,JSON.stringify(seed));return clone(seed)};
  let state={leads:load(K.leads,D.demo.leads),events:load(K.events,D.demo.events),songs:load(K.songs,D.repertoire),view:'dashboard'};
  const save=()=>{localStorage.setItem(K.leads,JSON.stringify(state.leads));localStorage.setItem(K.events,JSON.stringify(state.events));localStorage.setItem(K.songs,JSON.stringify(state.songs))};
  const euro=n=>new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(Number(n)||0);
  const cls=s=>s==='Confirmé'?'confirm':s==='Option'?'option':s==='Nouveau'?'new':'';
  const views=['dashboard','demandes','calendrier','evenements','clients','repertoire','finances','devis','parametres'];
  const labels={dashboard:'Vue d’ensemble',demandes:'Demandes',calendrier:'Calendrier',evenements:'Événements',clients:'Clients',repertoire:'Répertoire',finances:'Finances',devis:'Devis',parametres:'Paramètres'};

  function shell(){
    app.innerHTML=`<div class="admin-shell">
      <aside class="admin-sidebar">
        <div class="admin-brand"><strong>TOM SAX</strong><button class="admin-menu-toggle" id="admin-menu">Menu</button></div>
        <nav class="admin-nav" id="admin-nav">
          ${views.map(v=>`<button data-view="${v}">${labels[v]}</button>`).join('')}
          <a class="small-link" href="../index.html">← Voir le site</a>
        </nav>
      </aside>
      <main class="admin-main">
        <div class="admin-top"><div><p>MVP · Business + aperçu Signature</p><h1 id="view-title"></h1></div><span class="demo-pill">DONNÉES DE DÉMO</span></div>
        <div id="view"></div>
      </main>
    </div>`;
    document.getElementById('admin-menu').onclick=()=>document.getElementById('admin-nav').classList.toggle('open');
    document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{state.view=b.dataset.view;render()});
  }

  function leadTable(rows){
    return `<table class="admin-table"><thead><tr><th>Client</th><th>Événement</th><th>Date</th><th>Lieu</th><th>Statut</th><th></th></tr></thead><tbody>
      ${rows.map(l=>`<tr><td>${l.firstName} ${l.lastName}</td><td>${l.eventType}</td><td>${l.eventDate||'—'}</td><td>${l.location||'—'}</td><td><span class="chip ${cls(l.status)}">${l.status}</span></td><td><button class="admin-action" data-lead="${l.id}">Ouvrir</button></td></tr>`).join('')}
    </tbody></table>`;
  }

  function eventMini(){
    return `<div class="calendar-list">${state.events.map(e=>`<div class="calendar-row"><b>${e.date}</b><span>${e.client}<br><small>${e.location} · ${e.service}</small></span><span class="chip ${cls(e.status)}">${e.status}</span></div>`).join('')}</div>`;
  }

  function dashboard(){
    const signed=state.events.filter(e=>e.status==='Confirmé').reduce((a,e)=>a+Number(e.amount||0),0);
    return `<div class="stats">
      <div class="stat"><b>${state.leads.filter(l=>l.status==='Nouveau').length}</b><span>Nouvelles demandes</span></div>
      <div class="stat"><b>${state.events.length}</b><span>Événements à venir</span></div>
      <div class="stat"><b>${state.songs.filter(s=>s.visible!==false).length}</b><span>Morceaux visibles</span></div>
      <div class="stat"><b>${euro(signed)}</b><span>CA signé</span></div>
    </div><div class="admin-grid two"><section class="panel"><h2>Dernières demandes</h2>${leadTable(state.leads.slice(0,6))}</section><section class="panel"><h2>Prochaines prestations</h2>${eventMini()}</section></div>`;
  }

  function demandes(){
    return `<section class="panel"><div class="toolbar"><select id="lead-filter"><option value="">Tous les statuts</option>${['Nouveau','À contacter','Devis envoyé','Option','Confirmé','Refusé','Terminé'].map(s=>`<option>${s}</option>`).join('')}</select></div><div id="lead-table-wrap">${leadTable(state.leads)}</div><div id="lead-detail"></div></section>`;
  }

  function openLead(id){
    const l=state.leads.find(x=>x.id===id);if(!l)return;
    document.getElementById('lead-detail').innerHTML=`<hr style="margin:1.5rem 0;border:0;border-top:1px solid #ddd">
      <div class="lead-detail"><h2>${l.firstName} ${l.lastName}</h2>
      <dl><dt>Événement</dt><dd>${l.eventType}</dd><dt>Date</dt><dd>${l.eventDate}</dd><dt>Lieu</dt><dd>${l.location}</dd><dt>Invités</dt><dd>${l.guestCount||'—'}</dd><dt>Moment</dt><dd>${l.moment||'—'}</dd><dt>Email</dt><dd>${l.email}</dd><dt>Téléphone</dt><dd>${l.phone||'—'}</dd><dt>Message</dt><dd>${l.message||'—'}</dd></dl>
      <label>Statut <select id="lead-status">${['Nouveau','À contacter','Devis envoyé','Option','Confirmé','Refusé','Terminé'].map(s=>`<option ${s===l.status?'selected':''}>${s}</option>`).join('')}</select></label>
      <button class="admin-primary" id="save-lead" style="max-width:220px">Enregistrer</button></div>`;
    document.getElementById('save-lead').onclick=()=>{l.status=document.getElementById('lead-status').value;save();toast('Statut mis à jour');render()};
  }

  function calendrier(){
    return `<section class="panel"><h2>Calendrier & disponibilités</h2><p class="empty">Vue simplifiée du MVP. Les événements confirmés et les options remontent automatiquement.</p>${eventMini()}</section>`;
  }

  function evenements(){
    return `<section class="panel"><h2>Événements</h2>
      <form class="inline-form" id="event-add"><input name="client" placeholder="Client" required><input name="date" type="date" required><input name="location" placeholder="Lieu" required><input name="service" placeholder="Prestation" required><input name="amount" type="number" placeholder="Montant €"><input name="deposit" type="number" placeholder="Acompte €"><select name="status"><option>Option</option><option>Confirmé</option><option>Terminé</option></select><button>Ajouter</button></form>
      <table class="admin-table"><thead><tr><th>Date</th><th>Client</th><th>Lieu</th><th>Prestation</th><th>Montant</th><th>Acompte</th><th>Reste</th><th>Statut</th></tr></thead><tbody>
      ${state.events.map(e=>`<tr><td>${e.date}</td><td>${e.client}</td><td>${e.location}</td><td>${e.service}</td><td>${euro(e.amount)}</td><td>${euro(e.deposit)}</td><td>${euro((e.amount||0)-(e.deposit||0))}</td><td><span class="chip ${cls(e.status)}">${e.status}</span></td></tr><tr><td colspan="8"><b>Playlist :</b> ${Object.entries(e.playlist||{}).map(([k,v])=>`<span class="song-tag">${k}: ${v.join(', ')}</span>`).join(' ')||'À préparer'}</td></tr>`).join('')}
      </tbody></table></section>`;
  }

  function clients(){
    return `<section class="panel"><h2>Fiches clients</h2><table class="admin-table"><thead><tr><th>Client</th><th>Prochaine date</th><th>Lieu</th><th>Montant</th><th>Acompte</th><th>Reste</th></tr></thead><tbody>
      ${state.events.map(e=>`<tr><td>${e.client}</td><td>${e.date}</td><td>${e.location}</td><td>${euro(e.amount)}</td><td>${euro(e.deposit)}</td><td>${euro(e.amount-e.deposit)}</td></tr>`).join('')}
    </tbody></table></section>`;
  }

  function repertoire(){
    return `<section class="panel"><h2>Répertoire musical</h2>
      <form class="inline-form" id="song-add"><input name="title" placeholder="Titre" required><input name="artist" placeholder="Artiste" required><input name="category" placeholder="Catégorie" required><button>Ajouter</button></form>
      <div class="toolbar"><button id="export-songs">Exporter JSON</button></div>
      <table class="admin-table"><thead><tr><th>Titre</th><th>Artiste</th><th>Catégorie</th><th>Visible</th><th></th></tr></thead><tbody>
      ${state.songs.map(s=>`<tr><td>${s.title}</td><td>${s.artist}</td><td>${s.category}</td><td>${s.visible!==false?'Oui':'Non'}</td><td><button class="admin-action" data-song-toggle="${s.id}">${s.visible!==false?'Masquer':'Afficher'}</button></td></tr>`).join('')}
      </tbody></table></section>`;
  }

  function finances(){
    const signed=state.events.filter(e=>e.status==='Confirmé').reduce((a,e)=>a+Number(e.amount||0),0);
    const dep=state.events.reduce((a,e)=>a+Number(e.deposit||0),0);
    const rest=state.events.reduce((a,e)=>a+Math.max(0,Number(e.amount||0)-Number(e.deposit||0)),0);
    return `<section class="panel"><h2>Suivi commercial</h2><div class="finance-summary"><div><strong>${euro(signed)}</strong><span>CA signé</span></div><div><strong>${euro(dep)}</strong><span>Acomptes reçus</span></div><div><strong>${euro(rest)}</strong><span>Reste à encaisser</span></div></div>
      <table class="admin-table"><thead><tr><th>Client</th><th>Montant</th><th>Acompte</th><th>Reste</th><th>Statut</th></tr></thead><tbody>${state.events.map(e=>`<tr><td>${e.client}</td><td>${euro(e.amount)}</td><td>${euro(e.deposit)}</td><td>${euro(e.amount-e.deposit)}</td><td>${e.status}</td></tr>`).join('')}</tbody></table></section>`;
  }

  function devis(){
    return `<section class="panel"><h2>Devis simplifié</h2><form class="inline-form" id="quote-form"><input name="client" placeholder="Client" required><input name="service" placeholder="Prestation" required><input name="amount" type="number" placeholder="Montant €" required><input name="travel" type="number" placeholder="Déplacement €" value="0"><button class="full">Préparer le devis</button></form><div id="quote-preview"></div></section>`;
  }

  function parametres(){
    return `<section class="panel"><h2>Paramètres de démonstration</h2><p class="empty">Réinitialise les demandes, événements et morceaux aux données initiales du MVP.</p><button class="admin-primary" id="reset-demo" style="max-width:260px">Réinitialiser la démo</button></section>`;
  }

  function render(){
    if(!app.innerHTML)shell();
    document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===state.view));
    document.getElementById('view-title').textContent=labels[state.view];
    document.getElementById('view').innerHTML=({dashboard,demandes,calendrier,evenements,clients,repertoire,finances,devis,parametres}[state.view])();
    bind();
  }

  function bind(){
    document.querySelectorAll('[data-lead]').forEach(b=>b.onclick=()=>openLead(b.dataset.lead));
    const lf=document.getElementById('lead-filter');if(lf)lf.onchange=()=>{document.getElementById('lead-table-wrap').innerHTML=leadTable(lf.value?state.leads.filter(l=>l.status===lf.value):state.leads);bind()};
    const ef=document.getElementById('event-add');if(ef)ef.onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(ef).entries());state.events.push({id:'evt-'+Date.now(),client:f.client,date:f.date,location:f.location,type:'Événement',service:f.service,amount:Number(f.amount||0),deposit:Number(f.deposit||0),status:f.status,notes:'',playlist:{},demo:false});save();toast('Événement ajouté');render()};
    const sf=document.getElementById('song-add');if(sf)sf.onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(sf).entries());state.songs.unshift({id:'song-'+Date.now(),title:f.title,artist:f.artist,category:f.category,visible:true,featured:false});save();toast('Morceau ajouté');render()};
    document.querySelectorAll('[data-song-toggle]').forEach(b=>b.onclick=()=>{const s=state.songs.find(x=>x.id===b.dataset.songToggle);s.visible=!s.visible;save();render()});
    const ex=document.getElementById('export-songs');if(ex)ex.onclick=()=>{const blob=new Blob([JSON.stringify(state.songs,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='tomsax-repertoire.json';a.click();URL.revokeObjectURL(a.href)};
    const q=document.getElementById('quote-form');if(q)q.onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(q).entries()),total=Number(f.amount)+Number(f.travel||0);document.getElementById('quote-preview').innerHTML=`<div class="quote-box"><p>TOM SAX</p><h3>Devis de démonstration</h3><div class="quote-line"><span>Client</span><b>${f.client}</b></div><div class="quote-line"><span>${f.service}</span><b>${euro(f.amount)}</b></div><div class="quote-line"><span>Déplacement</span><b>${euro(f.travel)}</b></div><div class="quote-line quote-total"><span>Total</span><span>${euro(total)}</span></div><button class="admin-primary" onclick="window.print()">Imprimer / PDF</button></div>`};
    const reset=document.getElementById('reset-demo');if(reset)reset.onclick=()=>{Object.values(K).forEach(k=>localStorage.removeItem(k));state.leads=load(K.leads,D.demo.leads);state.events=load(K.events,D.demo.events);state.songs=load(K.songs,D.repertoire);toast('Démo réinitialisée');render()};
  }

  function toast(msg){const t=document.createElement('div');t.className='toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),1800)}
  shell();render();
})();