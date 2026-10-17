'use strict';
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];


/* ---------- Almacenamiento local (localStorage) ---------- */
const STORE_KEY = 'ks_repuestos';
const BASE_SKUS = ['fil-001', 'fre-002', 'enc-003', 'fil-004', 'sus-005', 'mot-006'];
const NO_FOTO = 'images/repuestos/sin-foto.svg';
const loadParts = () => { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch (e) { return []; } };
const saveParts = list => { try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); return true; } catch (e) { return false; } };
const skuExists = sku => BASE_SKUS.includes(sku.toLowerCase()) || loadParts().some(p => p.sku.toLowerCase() === sku.toLowerCase());
const esc = v => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* Reduce la foto a 400x400 (fondo blanco) y la devuelve como texto base64 */
function fileToDataURL(file, size = 400) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const c = document.createElement('canvas'); c.width = c.height = size;
        const g = c.getContext('2d');
        g.fillStyle = '#fff'; g.fillRect(0, 0, size, size);
        const k = Math.min(size / img.width, size / img.height);
        const w = img.width * k, h = img.height * k;
        g.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
        resolve(c.toDataURL('image/jpeg', 0.82));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

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

/* Menú lateral (tableta/celular) */
const menuBtn = $('#menuBtn'), sidebar = $('#sidebar');
if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    const open = sidebar.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') sidebar.classList.remove('open'); });
}

/* Mostrar / ocultar error de un campo */
function setError(field, msg) {
  const err = $('.err', field);
  field.classList.toggle('invalid', !!msg);
  if (err) err.textContent = msg || '';
  const input = $('input,select,textarea', field);
  if (input) input.setAttribute('aria-invalid', !!msg);
}

/* ---------- Login ---------- */
const login = $('#loginForm');
if (login) {
  const email = $('#email'), pass = $('#pass'), box = $('#formError');
  login.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    const eMsg = !email.value.trim() ? 'Ingresa tu correo electrónico.'
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) ? 'Escribe un correo válido. Ejemplo: admin@tallerks.com' : '';
    const pMsg = !pass.value ? 'Ingresa tu contraseña.' : pass.value.length < 6 ? 'La contraseña debe tener al menos 6 caracteres.' : '';
    setError(email.parentElement, eMsg); setError(pass.parentElement, pMsg);
    ok = !eMsg && !pMsg;
    box.hidden = ok;
    if (!ok) { box.textContent = 'No se pudo ingresar. Revisa los campos señalados.'; (eMsg ? email : pass).focus(); }
    else window.location.href = 'inventario.html';
  });
  [email, pass].forEach(i => i.addEventListener('input', () => setError(i.parentElement, '')));
  $('#forgot').addEventListener('click', e => {
    e.preventDefault();
    box.hidden = false; box.className = 'alert'; box.textContent = 'Contacta al responsable del taller para restablecer tu clave.';
  });
}

/* ---------- Formulario de repuesto ---------- */
const form = $('#partForm');
if (form) {
  const rules = {
    req: v => v.trim() !== '',
    price: v => { const n = v.replace(/\./g, '').trim(); return /^\d+$/.test(n) && Number(n) > 0; },
    int: v => /^\d+$/.test(v.trim())
  };
  const labels = { sku: 'SKU', nombre: 'nombre', categoria: 'categoría', marca: 'marca', comp: 'compatibilidad', precio: 'precio de venta', cant: 'cantidad disponible', min: 'stock mínimo', ubi: 'ubicación', prov: 'proveedor' };
  const check = el => {
    const f = el.closest('.field'), ok = rules[el.dataset.rule](el.value);
    const err = $('.err', f);
    setError(f, ok ? '' : (err.dataset.default || err.textContent || 'Revisa este campo.'));
    if (!ok && !err.dataset.default) err.textContent = 'Revisa este campo.';
    return ok;
  };
  const fields = $$('[data-rule]', form);
  const box = $('#formError'), okBox = $('#formOk');
  form.addEventListener('submit', e => {
    e.preventDefault();
    okBox.hidden = true;
    const bad = fields.filter(el => !check(el));
    if (bad.length) {
      const names = bad.map(el => labels[el.id] || el.id).join(', ');
      box.hidden = false;
      box.textContent = `No se pudo guardar el repuesto. Corrige ${bad.length === 1 ? 'el campo señalado' : 'los ' + bad.length + ' campos señalados'}: ${names}. Tus otros datos se conservaron.`;
      box.scrollIntoView({ behavior: 'smooth', block: 'center' });
      bad[0].focus();
    } else if (form.dataset.mode === 'nuevo') {
      const v = id => $('#' + id).value.trim();
      if (skuExists(v('sku'))) {
        setError($('#sku').closest('.field'), 'Ya existe un repuesto con ese SKU. Usa un código distinto.');
        box.hidden = false; box.textContent = 'No se pudo guardar el repuesto. El SKU ya existe.';
        $('#sku').focus(); return;
      }
      (async () => {
        let foto = '';
        const f = $('#foto') && $('#foto').files[0];
        if (f) { try { foto = await fileToDataURL(f); } catch (err) { foto = ''; } }
        const part = {
          sku: v('sku').toUpperCase(), nombre: v('nombre'), categoria: v('categoria'), marca: v('marca'),
          comp: v('comp'), precio: Number(v('precio').replace(/\./g, '')), stock: Number(v('cant')),
          min: Number(v('min')), ubi: v('ubi'), prov: v('prov'), desc: v('desc'), foto
        };
        const list = loadParts(); list.push(part);
        if (!saveParts(list)) {
          box.hidden = false;
          box.textContent = 'No se pudo guardar: el navegador no tiene espacio. Prueba con una foto más pequeña.';
          return;
        }
        box.hidden = true; okBox.hidden = false;
        okBox.textContent = 'Repuesto guardado. Te llevamos al inventario…';
        okBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => { window.location.href = 'inventario.html'; }, 1200);
      })();
    } else {
      box.hidden = true; okBox.hidden = false;
      okBox.textContent = 'Datos válidos. La edición de repuestos existentes llegará en la siguiente entrega.';
      okBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
  /* Vista previa de la foto */
  const foto = $('#foto'), prev = $('#preview');
  if (foto) foto.addEventListener('change', () => {
    const f = foto.files[0];
    if (!f) { prev.hidden = true; return; }
    prev.src = URL.createObjectURL(f); prev.hidden = false;
  });
  fields.forEach(el => {
    el.addEventListener('blur', () => { if (el.value !== '' || el.closest('.field').classList.contains('invalid')) check(el); });
    el.addEventListener('input', () => { if (el.closest('.field').classList.contains('invalid')) check(el); });
  });
}

/* ---------- Inventario: filtros y eliminación ---------- */
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

  /* Modal de confirmación */
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
    refresh(); });

  refresh();
}
