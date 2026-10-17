'use strict';
/* ===== inventario.js · Lista de repuestos: filtros y eliminación (inventario.html) =====
   Necesita: utils.js y storage.js cargados antes. */

/* Fila de la tabla con el mismo formato de las filas fijas */
function rowHTML(p) {
  const low = p.stock < p.min;
  return `<article class="tr" data-custom data-name="${esc(p.nombre.toLowerCase())}" data-sku="${esc(p.sku.toLowerCase())}" data-brand="${esc(p.marca.toLowerCase())}" data-cat="${esc(p.categoria)}" data-stock="${p.stock}" data-min="${p.min}" data-low="${low}">
<div class="item">
    <img class="thumb" src="${esc(p.foto || NO_FOTO)}" alt="${esc(p.nombre + ' ' + p.marca)}" loading="lazy" width="56" height="56">
    <div>
        <div class="name">${esc(p.nombre)}</div>
        <div class="sku">${esc(p.sku)} · ${esc(p.marca)} · ${esc(p.categoria)}</div>
    </div>
</div>
<div><span class="lbl">COMPATIBILIDAD</span>${esc(p.comp)}</div>
<div><span class="lbl">PRECIO COP</span><b>$ ${p.precio.toLocaleString('es-CO')}</b></div>
<div><span class="lbl">STOCK</span>${p.stock} uds. <span class="badge${low ? ' low' : ''}">${low ? 'Stock bajo' : 'Disponible'}</span>
    <span class="min">Mín. ${p.min}</span></div>
<div><span class="lbl">UBICACIÓN</span>${esc(p.ubi)}</div>
<div class="acts">
    <a class="link" href="editar.html">Editar</a>
    <button class="link del" type="button" data-delete>Eliminar</button>
</div>
</article>`;
}

const table = $('#table');
if (table) {
  $('#empty').insertAdjacentHTML('beforebegin', loadParts().map(rowHTML).join(''));
  const rows = () => $$('.tr[data-sku]', table);
  const q = $('#q'), cat = $('#cat'), lowBtn = $('#lowBtn');
  const isLow = r => Number(r.dataset.stock) < Number(r.dataset.min);

  function refresh() {
    const text = q.value.trim().toLowerCase(), onlyLow = lowBtn.getAttribute('aria-pressed') === 'true';
    let shown = 0;
    rows().forEach(r => {
      const match = (!text || [r.dataset.name, r.dataset.sku, r.dataset.brand].some(s => s.includes(text)))
        && (!cat.value || r.dataset.cat === cat.value) && (!onlyLow || isLow(r));
      r.hidden = !match; if (match) shown++;
    });
    const all = rows();
    $('#empty').hidden = shown > 0;
    $('#count').textContent = `Mostrando ${shown} de ${all.length} repuestos`;
    const lows = all.filter(isLow);
    $('#stRef').textContent = all.length;
    $('#stUni').textContent = all.reduce((s, r) => s + Number(r.dataset.stock), 0);
    $('#stLow').textContent = lows.length;
    const a = $('#lowAlert');
    a.hidden = lows.length === 0;
    a.textContent = `${lows.length} repuestos están por debajo del stock mínimo.`;
  }
  q.addEventListener('input', refresh);
  cat.addEventListener('change', refresh);
  lowBtn.addEventListener('click', () => {
    lowBtn.setAttribute('aria-pressed', lowBtn.getAttribute('aria-pressed') !== 'true'); refresh();
  });

  /* Modal de confirmación para eliminar */
  const modal = $('#modal'); let target = null, opener = null;
  const close = () => { modal.classList.remove('open'); target = null; if (opener) opener.focus(); };
  table.addEventListener('click', e => {
    const btn = e.target.closest('[data-delete]'); if (!btn) return;
    opener = btn; target = btn.closest('.tr');
    $('#mInfo').innerHTML = `<b>${esc($('.name', target).textContent)}</b>
    <br>${esc($('.sku', target).textContent)}<br>
    ${target.dataset.stock} 
    unidades · Mínimo ${target.dataset.min}`;
    modal.classList.add('open'); $('#mCancel').focus();
  });
  $('#mCancel').addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });
  $('#mOk').addEventListener('click', () => {
    if (target.hasAttribute('data-custom')) saveParts(loadParts().filter(p => p.sku.toLowerCase() !== target.dataset.sku));
    target.remove(); target = null;
    modal.classList.remove('open');
    refresh();
  });

  refresh();
}
