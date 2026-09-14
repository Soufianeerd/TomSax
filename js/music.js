(function(){
  const data=window.TOM_SAX_DATA?.repertoire||[],list=document.getElementById('music-list'),filters=document.getElementById('music-filters'),search=document.getElementById('music-search');
  if(!list||!filters)return;
  const categories=['Tous',...new Set(data.map(s=>s.category))];let active='Tous';
  filters.innerHTML=categories.map(c=>`<button class="filter-btn${c==='Tous'?' active':''}" type="button" data-cat="${c}">${c}</button>`).join('');
  const render=()=>{const q=(search?.value||'').trim().toLowerCase();const rows=data.filter(s=>s.visible!==false&&(active==='Tous'||s.category===active)&&(!q||`${s.title} ${s.artist}`.toLowerCase().includes(q)));list.innerHTML=rows.length?rows.map(s=>`<div class="music-row"><div><div class="music-title">${s.title}${s.featured?' <span aria-label="mis en avant">★</span>':''}</div><div class="music-artist">${s.artist}</div></div><div class="music-category">${s.category}</div></div>`).join(''):'<p style="padding:1.5rem 0;color:#777">Aucun morceau trouvé.</p>';};
  filters.addEventListener('click',e=>{const b=e.target.closest('[data-cat]');if(!b)return;active=b.dataset.cat;filters.querySelectorAll('.filter-btn').forEach(x=>x.classList.toggle('active',x===b));render();});
  search?.addEventListener('input',render);render();
})();