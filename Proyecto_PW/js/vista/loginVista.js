/* ===== VISTA · loginVista.js =====
   Mensajes del cuadro de aviso en la pantalla de acceso. */

// Muestra el aviso. Si esError es true se ve rojo, si no, normal
function mostrarAvisoLogin(texto, esError) {
  let caja = document.getElementById('formError');
  if (esError) {
    caja.className = 'alert error';
  } else {
    caja.className = 'alert';
  }
  caja.textContent = texto;
  caja.hidden = false;
}

function ocultarAvisoLogin() {
  document.getElementById('formError').hidden = true;
}
