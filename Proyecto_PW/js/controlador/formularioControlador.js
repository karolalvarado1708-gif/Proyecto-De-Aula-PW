/* ===== CONTROLADOR · formularioControlador.js =====
   Formulario de nuevo.html y editar.html: revisa los campos con el modelo,
   guarda los datos y le pide a la vista que muestre los mensajes. */

// Nombre de cada campo para el mensaje de error general
const ETIQUETAS = {
  sku: 'SKU',
  nombre: 'nombre',
  categoria: 'categoría',
  marca: 'marca',
  comp: 'compatibilidad',
  precio: 'precio de venta',
  cant: 'cantidad disponible',
  min: 'stock mínimo',
  ubi: 'ubicación',
  prov: 'proveedor'
};

// ¿El valor del campo cumple su regla? (la regla está en data-rule del HTML)
function campoEsValido(elemento) {
  let regla = elemento.dataset.rule;
  if (regla === 'req') {
    return campoLleno(elemento.value);
  }
  if (regla === 'price') {
    return precioValido(elemento.value);
  }
  if (regla === 'int') {
    return enteroValido(elemento.value);
  }
  return true;
}

// Revisa un campo y muestra u oculta su error. Devuelve true si está bien
function revisarCampo(elemento) {
  let contenedor = elemento.closest('.field');
  if (campoEsValido(elemento)) {
    mostrarErrorCampo(contenedor, '');
    return true;
  }
  mostrarErrorCampo(contenedor, leerMensajeError(contenedor));
  return false;
}

// Último paso: arma el repuesto y lo guarda
function terminarGuardado(foto) {
  let repuesto = {
    sku: leerCampo('sku').toUpperCase(),
    nombre: leerCampo('nombre'),
    categoria: leerCampo('categoria'),
    marca: leerCampo('marca'),
    comp: leerCampo('comp'),
    precio: Number(leerCampo('precio').replace(/\./g, '')),
    stock: Number(leerCampo('cant')),
    min: Number(leerCampo('min')),
    ubi: leerCampo('ubi'),
    prov: leerCampo('prov'),
    desc: leerCampo('desc'),
    foto: foto
  };

  let seGuardo = agregarRepuesto(repuesto);
  if (!seGuardo) {
    mostrarMensajeError('No se pudo guardar: el navegador no tiene espacio. Prueba con una foto más pequeña.', false);
    return;
  }

  mostrarMensajeOk('Repuesto guardado. Te llevamos al inventario…');
  // Esperamos 1,2 segundos para que se alcance a leer el mensaje
  setTimeout(function () {
    window.location.href = 'inventario.html';
  }, 1200);
}

// Guardar un repuesto nuevo
function guardarNuevo() {
  let sku = leerCampo('sku');

  // El SKU no se puede repetir
  if (existeSku(sku)) {
    mostrarErrorCampo(document.getElementById('sku').closest('.field'), 'Ya existe un repuesto con ese SKU. Usa un código distinto.');
    mostrarMensajeError('No se pudo guardar el repuesto. El SKU ya existe.', false);
    document.getElementById('sku').focus();
    return;
  }

  // Si eligió foto, primero se reduce; cuando esté lista se termina de guardar
  let archivo = obtenerArchivoFoto();
  if (archivo) {
    reducirFoto(archivo, 400, function (foto) {
      terminarGuardado(foto);
    });
  } else {
    terminarGuardado('');
  }
}

/* ----- Al cargar la página ----- */

let formulario = document.getElementById('partForm');
let campos = obtenerCampos();

// Al enviar el formulario
formulario.addEventListener('submit', function (evento) {
  evento.preventDefault();

  // 1. Revisar todos los campos
  let incorrectos = [];
  for (let i = 0; i < campos.length; i++) {
    if (!revisarCampo(campos[i])) {
      incorrectos.push(campos[i]);
    }
  }

  // 2. Si hay errores, avisar y parar
  if (incorrectos.length > 0) {
    let nombres = [];
    for (let i = 0; i < incorrectos.length; i++) {
      let nombre = ETIQUETAS[incorrectos[i].id];
      if (nombre === undefined) {
        nombre = incorrectos[i].id;
      }
      nombres.push(nombre);
    }
    let cuales = 'el campo señalado';
    if (incorrectos.length > 1) {
      cuales = 'los ' + incorrectos.length + ' campos señalados';
    }
    mostrarMensajeError('No se pudo guardar el repuesto. Corrige ' + cuales + ': ' + nombres.join(', ') + '. Tus otros datos se conservaron.', true);
    incorrectos[0].focus();
    return;
  }

  // 3. Todo bien: nuevo repuesto o edición (nuevo.html dice data-mode="nuevo")
  if (formulario.dataset.mode === 'nuevo') {
    guardarNuevo();
  } else {
    mostrarMensajeOk('Datos válidos. La edición de repuestos existentes llegará en la siguiente entrega.');
  }
});

// Vista previa de la foto cuando el usuario elige una
let campoFoto = document.getElementById('foto');
if (campoFoto !== null) {
  campoFoto.addEventListener('change', function () {
    mostrarVistaPrevia(campoFoto.files[0]);
  });
}

// Revisar cada campo al salir de él y mientras se corrige
function activarRevision(campo) {
  campo.addEventListener('blur', function () {
    if (campo.value !== '' || campoTieneError(campo)) {
      revisarCampo(campo);
    }
  });
  campo.addEventListener('input', function () {
    if (campoTieneError(campo)) {
      revisarCampo(campo);
    }
  });
}
for (let i = 0; i < campos.length; i++) {
  activarRevision(campos[i]);
}