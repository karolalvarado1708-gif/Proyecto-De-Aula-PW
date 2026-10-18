/* ===== CONTROLADOR · inventarioControlador.js =====
   Conecta la pantalla del inventario con los datos:
   filtros, contadores y eliminar repuestos. */

let filaSeleccionada = null;   // fila que se quiere eliminar
let botonQueAbrio = null;      // botón Eliminar que se presionó

// Revisa los filtros, oculta las filas que no coinciden y actualiza el resumen
function actualizarInventario() {
  let filtros = leerFiltros();
  let filas = obtenerFilas();
  let mostradas = 0;
  let unidades = 0;
  let bajos = 0;

  for (let i = 0; i < filas.length; i++) {
    let datos = leerFila(filas[i]);
    let bajo = esStockBajo(datos.stock, datos.minimo);
    let coincide = true;

    // Filtro del buscador: nombre, SKU o marca
    if (filtros.texto !== '') {
      let enNombre = datos.nombre.includes(filtros.texto);
      let enSku = datos.sku.includes(filtros.texto);
      let enMarca = datos.marca.includes(filtros.texto);
      if (!enNombre && !enSku && !enMarca) {
        coincide = false;
      }
    }
    // Filtro de categoría
    if (filtros.categoria !== '' && datos.categoria !== filtros.categoria) {
      coincide = false;
    }
    // Filtro de stock bajo
    if (filtros.soloBajo && !bajo) {
      coincide = false;
    }

    ocultarFila(filas[i], !coincide);

    if (coincide) {
      mostradas++;
    }
    unidades = unidades + datos.stock;
    if (bajo) {
      bajos++;
    }
  }

  mostrarResumen(filas.length, mostradas, unidades, bajos);
}

// Cierra la ventana sin eliminar nada
function cancelarEliminar() {
  cerrarModal();
  filaSeleccionada = null;
  if (botonQueAbrio !== null) {
    botonQueAbrio.focus();
  }
}

// Elimina la fila elegida
function confirmarEliminar() {
  // Si es un repuesto guardado por el usuario, también se borra de localStorage
  if (filaSeleccionada.hasAttribute('data-custom')) {
    eliminarRepuesto(filaSeleccionada.dataset.sku);
  }
  filaSeleccionada.remove();
  filaSeleccionada = null;
  cerrarModal();
  actualizarInventario();
}

/* ----- Al cargar la página ----- */

// 1. Mostrar los repuestos que el usuario guardó
pintarRepuestosGuardados(obtenerRepuestos());

// 2. Filtros
document.getElementById('q').addEventListener('input', actualizarInventario);
document.getElementById('cat').addEventListener('change', actualizarInventario);
document.getElementById('lowBtn').addEventListener('click', function () {
  alternarBotonStockBajo();
  actualizarInventario();
});

// 3. Botones Eliminar (se escucha en la tabla completa para que
//    también funcionen en las filas que se agregaron con JavaScript)
document.getElementById('table').addEventListener('click', function (evento) {
  let boton = evento.target.closest('[data-delete]');
  if (boton === null) {
    return;
  }
  botonQueAbrio = boton;
  filaSeleccionada = boton.closest('.tr');
  abrirModal(filaSeleccionada);
});

// 4. Ventana de confirmación
document.getElementById('mCancel').addEventListener('click', cancelarEliminar);
document.getElementById('mOk').addEventListener('click', confirmarEliminar);
document.getElementById('modal').addEventListener('click', function (evento) {
  // Clic en el fondo oscuro (fuera de la ventana) = cancelar
  if (evento.target === document.getElementById('modal')) {
    cancelarEliminar();
  }
});
document.addEventListener('keydown', function (evento) {
  if (evento.key === 'Escape' && modalEstaAbierto()) {
    cancelarEliminar();
  }
});

// 5. Primera actualización de contadores
actualizarInventario();
