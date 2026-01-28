(function(){
  const api = {
    list: async (q='') => {
      const url = q ? `/api/customers?q=${encodeURIComponent(q)}` : '/api/customers';
      const res = await fetch(url);
      if(!res.ok) throw new Error('Failed to list customers');
      return res.json();
    },
    create: async (payload) => {
      const res = await fetch('/api/customers', {
        method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload)
      });
      if(!res.ok) throw new Error('Failed to create customer');
      return res.json();
    },
    update: async (id, payload) => {
      const res = await fetch(`/api/customers/${id}`, {
        method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload)
      });
      if(!res.ok) throw new Error('Failed to update customer');
      return res.json();
    }
  };

  async function load(q=''){
    const rows = document.getElementById('rows');
    rows.innerHTML = '<tr><td colspan=5 class="muted">Loading...</td></tr>';
    try{
      const data = await api.list(q);
      rows.innerHTML = '';
      if(data.length === 0){
        rows.innerHTML = '<tr><td colspan=5 class="muted">No customers yet.</td></tr>';
        return;
      }
      for(const c of data){
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td style="padding:8px; border-top:1px solid rgba(255,255,255,0.06)">${escapeHtml(c.name||'')}</td>
          <td style="padding:8px; border-top:1px solid rgba(255,255,255,0.06)">${escapeHtml(c.phone||'')}</td>
          <td style="padding:8px; border-top:1px solid rgba(255,255,255,0.06)">${escapeHtml(c.email||'')}</td>
          <td style="padding:8px; border-top:1px solid rgba(255,255,255,0.06)">
            <input data-id="${c._id}" class="comment-edit" type="text" value="${escapeAttr(c.comment||'')}" style="width:100%; padding:8px; border-radius:8px; background: var(--glass); border:1px solid rgba(255,255,255,0.06); color: var(--text);" />
          </td>
          <td style="padding:8px; border-top:1px solid rgba(255,255,255,0.06)">${formatDate(c.updatedAt)}</td>
        `;
        rows.appendChild(tr);
      }
      wireInlineEditors();
    }catch(err){
      rows.innerHTML = `<tr><td colspan=5 class="muted">Error: ${escapeHtml(err.message)}</td></tr>`;
    }
  }

  function wireInlineEditors(){
    document.querySelectorAll('.comment-edit').forEach(input => {
      input.addEventListener('keydown', async (e) => {
        if(e.key === 'Enter'){
          e.preventDefault();
          await saveComment(input);
        }
      });
      input.addEventListener('blur', async () => {
        await saveComment(input);
      });
    });
  }

  async function saveComment(input){
    const id = input.getAttribute('data-id');
    const tr = input.closest('tr');
    const name = tr.children[0].textContent.trim();
    const phone = tr.children[1].textContent.trim();
    const email = tr.children[2].textContent.trim();
    const comment = input.value;
    input.style.opacity = '0.6';
    try{
      await api.update(id, { name, phone, email, comment });
      input.style.opacity = '1';
    }catch(err){
      alert('Failed to save comment: ' + err.message);
      input.style.opacity = '1';
    }
  }

  function formatDate(s){
    try{ return new Date(s).toLocaleString(); }catch{ return s||''; }
  }

  function escapeHtml(s){
    return String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
  }
  function escapeAttr(s){
    return String(s||'').replace(/["']/g, c => ({'"':'&quot;','\'':'&#39;'}[c]));
  }

  function wireForm(){
    const form = document.getElementById('addForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const payload = {};
      fd.forEach((v,k)=>payload[k]=v);
      try{
        await api.create(payload);
        form.reset();
        load();
      }catch(err){
        alert('Failed to add customer: ' + err.message);
      }
    });
  }

  function wireSearch(){
    const search = document.getElementById('search');
    const refresh = document.getElementById('refresh');
    let t;
    search.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(()=> load(search.value.trim()), 250);
    });
    refresh.addEventListener('click', () => load(search.value.trim()));
  }

  // init
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ()=>{ wireForm(); wireSearch(); load(); });
  }else{ wireForm(); wireSearch(); load(); }
})();
