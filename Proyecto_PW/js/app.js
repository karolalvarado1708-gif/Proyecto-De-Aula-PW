'use strict';
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

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
    } else {
      box.hidden = true; okBox.hidden = false;
      okBox.textContent = 'Datos válidos. En esta entrega aún no se guardan; la persistencia llegará en la siguiente.';
      okBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
  fields.forEach(el => {
    el.addEventListener('blur', () => { if (el.value !== '' || el.closest('.field').classList.contains('invalid')) check(el); });
    el.addEventListener('input', () => { if (el.closest('.field').classList.contains('invalid')) check(el); });
  });
}

/* ---------- Inventario: filtros y eliminación ---------- */
const table = $('#table');
if (table) {
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
    $('#mInfo').innerHTML = `<b>${$('.name', target).textContent}</b>
    <br>${$('.sku', target).textContent}<br>
    ${target.dataset.stock} 
    unidades · Mínimo ${target.dataset.min}`;
    modal.classList.add('open'); $('#mCancel').focus();
  });
  $('#mCancel').addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });
  $('#mOk').addEventListener('click', () => { target.remove(); target = null; 
    modal.classList.remove('open'); 
    refresh(); });
}