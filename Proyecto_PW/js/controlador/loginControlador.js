/* ===== CONTROLADOR · loginControlador.js =====
   Cuando el usuario envía el formulario de acceso: pide al modelo que valide
   y le dice a la vista qué mostrar. */

let formularioLogin = document.getElementById('loginForm');
let campoCorreo = document.getElementById('email');
let campoClave = document.getElementById('pass');

formularioLogin.addEventListener('submit', function (evento) {
  evento.preventDefault();   // evita que la página se recargue

  // 1. Revisamos el correo
  let errorCorreo = '';
  if (campoCorreo.value.trim() === '') {
    errorCorreo = 'Ingresa tu correo electrónico.';
  } else if (!correoValido(campoCorreo.value)) {
    errorCorreo = 'Escribe un correo válido. Ejemplo: admin@tallerks.com';
  }

  // 2. Revisamos la contraseña
  let errorClave = '';
  if (campoClave.value === '') {
    errorClave = 'Ingresa tu contraseña.';
  } else if (campoClave.value.length < 6) {
    errorClave = 'La contraseña debe tener al menos 6 caracteres.';
  }

  // 3. Mostramos los errores (o los quitamos si no hay)
  mostrarErrorCampo(campoCorreo.parentElement, errorCorreo);
  mostrarErrorCampo(campoClave.parentElement, errorClave);

  // 4. Si todo está bien entramos, si no avisamos
  if (errorCorreo === '' && errorClave === '') {
    ocultarAvisoLogin();
    window.location.href = 'inventario.html';
  } else {
    mostrarAvisoLogin('No se pudo ingresar. Revisa los campos señalados.', true);
    if (errorCorreo !== '') {
      campoCorreo.focus();
    } else {
      campoClave.focus();
    }
  }
});

// Al escribir en un campo se quita su error
campoCorreo.addEventListener('input', function () {
  mostrarErrorCampo(campoCorreo.parentElement, '');
});
campoClave.addEventListener('input', function () {
  mostrarErrorCampo(campoClave.parentElement, '');
});

// Enlace "¿Olvidaste tu clave?"
document.getElementById('forgot').addEventListener('click', function (evento) {
  evento.preventDefault();
  mostrarAvisoLogin('Contacta al responsable del taller para restablecer tu clave.', false);
});
