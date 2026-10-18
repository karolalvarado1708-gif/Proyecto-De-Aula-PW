/* ===== CONTROLADOR · menuControlador.js =====
   Conecta el botón ☰ con la vista del menú. */

let botonMenu = document.getElementById('menuBtn');

if (botonMenu !== null) {
  botonMenu.addEventListener('click', function () {
    alternarMenu();
  });

  // Con la tecla Escape se cierra el menú
  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape') {
      cerrarMenu();
    }
  });
}