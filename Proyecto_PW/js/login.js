'use strict';
/* ===== login.js · Validación del formulario de acceso (index.html) ===== */

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
