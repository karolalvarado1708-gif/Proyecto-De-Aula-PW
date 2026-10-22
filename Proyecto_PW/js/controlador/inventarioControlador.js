/* ===== CONTROLADOR · inventarioControlador.js =====
   Conecta la pantalla del inventario con los datos:
   listado, buscador, contadores y eliminar repuestos. */

let skuSeleccionado = null;   // SKU del repuesto que se quiere eliminar
let botonQueAbrio = null;      // botón Eliminar que se presionó

// Lee los datos, aplica los filtros, dibuja la tabla y actualiza el resumen
function actualizarInventario() {
  let todos = obtenerRepuestos();
  let visibles = filtrarRepuestos(todos, leerFiltros());
  let unidades = 0;
  let bajos = 0;

  for (let i = 0; i < todos.length; i++) {
    unidades = unidades + todos[i].stock;
    if (esStockBajo(todos[i].stock, todos[i].min)) {
      bajos++;
    }
  }

  pintarTabla(visibles);
  mostrarResumen(todos.length, visibles.length, unidades, bajos);
}

// Cierra la ventana sin eliminar nada
function cancelarEliminar() {
  cerrarModal();
  skuSeleccionado = null;
  if (botonQueAbrio !== null) {
    botonQueAbrio.focus();
  }
}

// Elimina el repuesto elegido (de localStorage y de la tabla)
function confirmarEliminar() {
  eliminarRepuesto(skuSeleccionado);
  skuSeleccionado = null;
  cerrarModal();
  actualizarInventario();
}

/* ----- Al cargar la página ----- */

// 1. Filtros: el buscador filtra mientras se escribe
document.getElementById('q').addEventListener('input', actualizarInventario);
document.getElementById('cat').addEventListener('change', actualizarInventario);
document.getElementById('lowBtn').addEventListener('click', function () {
  alternarBotonStockBajo();
  actualizarInventario();
});

// 2. Botones Eliminar (se escucha en la tabla completa para que
//    también funcionen en las filas que se dibujan con JavaScript)
document.getElementById('table').addEventListener('click', function (evento) {
  let boton = evento.target.closest('[data-delete]');
  if (boton === null) {
    return;
  }
  botonQueAbrio = boton;
  skuSeleccionado = boton.closest('.tr').dataset.sku;
  abrirModal(buscarRepuesto(skuSeleccionado));
});

// 3. Ventana de confirmación
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

// 4. Dibujar la tabla por primera vez
actualizarInventario();