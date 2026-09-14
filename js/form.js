(function(){
  const form=document.getElementById('event-form'),status=document.getElementById('form-status');if(!form)return;
  const KEY='tomsax_leads_v1';
  form.addEventListener('submit',e=>{e.preventDefault();if(!form.checkValidity()){form.reportValidity();return;}
    const lead=Object.fromEntries(new FormData(form).entries());lead.id=`lead-${Date.now()}`;lead.status='Nouveau';lead.createdAt=new Date().toISOString();lead.demo=false;
    const existing=JSON.parse(localStorage.getItem(KEY)||'null')||window.TOM_SAX_DATA.demo.leads;existing.unshift(lead);localStorage.setItem(KEY,JSON.stringify(existing));
    status.textContent='Demande enregistrée. Elle apparaît maintenant dans l’espace Tom de démonstration.';form.reset();
  });
})();