'use strict';
/* ===== utils.js · Funciones de ayuda que usan todas las páginas ===== */

/* Atajos para seleccionar elementos */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* Escapa texto para insertarlo de forma segura en HTML */
const esc = v => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* Mostrar / ocultar error de un campo */
function setError(field, msg) {
  const err = $('.err', field);
  field.classList.toggle('invalid', !!msg);
  if (err) err.textContent = msg || '';
  const input = $('input,select,textarea', field);
  if (input) input.setAttribute('aria-invalid', !!msg);
}