/* ===== VISTA · formularioVista.js =====
   Lo que se ve y se lee en el formulario de nuevo.html / editar.html. */

// Todos los campos que se deben validar (los que tienen data-rule en el HTML)
function obtenerCampos() {
  return document.querySelectorAll('[data-rule]');
}

// Lee lo que escribió el usuario en un campo (sin espacios al inicio ni al final)
function leerCampo(id) {
  return document.getElementById(id).value.trim();
}

// Foto que eligió el usuario (si no eligió ninguna, devuelve undefined)
function obtenerArchivoFoto() {
  let entrada = document.getElementById('foto');
  if (entrada === null) {
    return undefined;
  }
  return entrada.files[0];
}

// Texto del error de un campo: el que dice data-default en el HTML
function leerMensajeError(contenedor) {
  let divError = contenedor.querySelector('.err');
  let mensaje = divError.getAttribute('data-default');
  if (mensaje === null) {
    return 'Revisa este campo.';
  }
  return mensaje;
}

// ¿El campo ya se está mostrando con error?
function campoTieneError(elemento) {
  return elemento.closest('.field').classList.contains('invalid');
}

// Caja roja de error. Si hacerScroll es true, baja la pantalla hasta ella
function mostrarMensajeError(texto, hacerScroll) {
  let cajaError = document.getElementById('formError');
  document.getElementById('formOk').hidden = true;
  cajaError.textContent = texto;
  cajaError.hidden = false;
  if (hacerScroll) {
    cajaError.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// Caja verde de éxito
function mostrarMensajeOk(texto) {
  let cajaOk = document.getElementById('formOk');
  document.getElementById('formError').hidden = true;
  cajaOk.textContent = texto;
  cajaOk.hidden = false;
  cajaOk.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Muestra la foto elegida debajo del campo
function mostrarVistaPrevia(archivo) {
  let imagen = document.getElementById('preview');
  if (!archivo) {
    imagen.hidden = true;
    return;
  }
  imagen.src = URL.createObjectURL(archivo);
  imagen.hidden = false;
}

// Escribe un valor en un campo del formulario
function escribirCampo(id, valor) {
  document.getElementById(id).value = valor;
}

// Solo en editar.html: llena el formulario y los textos con los datos del repuesto
function llenarFormulario(rep) {
  escribirCampo('sku', rep.sku);
  escribirCampo('nombre', rep.nombre);
  escribirCampo('categoria', rep.categoria);
  escribirCampo('marca', rep.marca);
  escribirCampo('comp', rep.comp);
  escribirCampo('precio', rep.precio.toLocaleString('es-CO'));
  escribirCampo('cant', rep.stock);
  escribirCampo('min', rep.min);
  escribirCampo('ubi', rep.ubi);
  escribirCampo('prov', rep.prov);
  escribirCampo('desc', rep.desc);

  let foto = rep.foto;
  if (!foto) {
    foto = SIN_FOTO;
  }
  document.getElementById('preview').src = foto;

  document.getElementById('modoEdicion').textContent = 'MODO EDICIÓN · ' + rep.sku;
  document.getElementById('subtituloEdicion').textContent = 'Actualiza la información de ' + rep.nombre + '. Los cambios se aplicarán al registro ' + rep.sku + '.';
  document.getElementById('resumenIdentidad').innerHTML = '<b>' + escapar(rep.sku) + '</b><br>' + escapar(rep.nombre) + '<br>' + escapar(rep.marca) + ' · ' + escapar(rep.categoria);
  document.getElementById('resumenExistencias').innerHTML = rep.stock + ' unidades disponibles<br>' + escapar(rep.ubi);
}