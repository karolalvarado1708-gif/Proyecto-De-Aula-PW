/* ===== VISTA · comunVista.js =====
   Funciones que cambian lo que se ve en pantalla y usan varias páginas. */

// Imagen que se muestra cuando un repuesto no tiene foto
const SIN_FOTO = 'images/repuestos/sin-foto.svg';

// Cambia caracteres especiales (<, >, &...) para que el texto no se
// interprete como HTML. Se usa cuando metemos texto del usuario en la página.
function escapar(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Muestra (o quita) el mensaje de error debajo de un campo.
// "campo" es el div con clase "field". Si mensaje es '' se quita el error.
function mostrarErrorCampo(campo, mensaje) {
  let divError = campo.querySelector('.err');
  let entrada = campo.querySelector('input, select, textarea');

  if (mensaje !== '') {
    campo.classList.add('invalid');
  } else {
    campo.classList.remove('invalid');
  }

  if (divError !== null) {
    divError.textContent = mensaje;
  }
  if (entrada !== null) {
    entrada.setAttribute('aria-invalid', mensaje !== '');
  }
}

// Abre o cierra el menú lateral (en tableta y celular)
function alternarMenu() {
  let barra = document.getElementById('sidebar');
  let boton = document.getElementById('menuBtn');
  let abierto = barra.classList.toggle('open');
  boton.setAttribute('aria-expanded', abierto);
}

function cerrarMenu() {
  document.getElementById('sidebar').classList.remove('open');
}