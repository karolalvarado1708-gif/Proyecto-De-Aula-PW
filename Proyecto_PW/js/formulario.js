'use strict';
/* ===== formulario.js · Formulario de repuesto (nuevo.html y editar.html) =====
   Necesita: utils.js y storage.js cargados antes. */

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
