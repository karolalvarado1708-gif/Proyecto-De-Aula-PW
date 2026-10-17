'use strict';
/* ===== menu.js · Menú lateral (tableta/celular) ===== */

const menuBtn = $('#menuBtn'), sidebar = $('#sidebar');
if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    const open = sidebar.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') sidebar.classList.remove('open'); });
}