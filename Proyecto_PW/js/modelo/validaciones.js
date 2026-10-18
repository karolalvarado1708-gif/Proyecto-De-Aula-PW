/* ===== MODELO · validaciones.js =====
   Reglas para revisar si lo que escribió el usuario está bien.
   Cada función devuelve true (correcto) o false (incorrecto). */

// El campo no puede estar vacío
function campoLleno(valor) {
  return valor.trim() !== '';
}

// Precio: solo números mayores que 0. Se permiten puntos: "38.000"
function precioValido(valor) {
  let numero = valor.replace(/\./g, '').trim();   // "38.000" -> "38000"
  return /^\d+$/.test(numero) && Number(numero) > 0;   // ^\d+$ = solo dígitos
}

// Número entero de 0 o más (cantidad y stock mínimo)
function enteroValido(valor) {
  return /^\d+$/.test(valor.trim());
}

// Correo con forma texto@texto.texto
function correoValido(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}