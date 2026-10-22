/* ===== VISTA · inventarioVista.js =====
   Todo lo que se ve en la pantalla del inventario (tabla, resumen y ventana
   de confirmación). La tabla se construye con JavaScript usando el DOM. */

// Crea un elemento (div, span, img...) con su clase y su texto
function crearElemento(etiqueta, clase, texto) {
  let elemento = document.createElement(etiqueta);
  if (clase !== '') {
    elemento.className = clase;
  }
  if (texto !== '') {
    elemento.textContent = texto;
  }
  return elemento;
}

// Crea una celda de la fila: un título pequeño (lbl) y su contenido
function crearCelda(titulo, contenido) {
  let celda = document.createElement('div');
  celda.appendChild(crearElemento('span', 'lbl', titulo));
  celda.append(contenido);
  return celda;
}

// Celda con la foto, el nombre y el SKU
function crearCeldaRepuesto(rep) {
  let foto = rep.foto;
  if (!foto) {
    foto = SIN_FOTO;
  }
  let imagen = crearElemento('img', 'thumb', '');
  imagen.src = foto;
  imagen.alt = rep.nombre + ' ' + rep.marca;
  imagen.loading = 'lazy';
  imagen.width = 56;
  imagen.height = 56;

  let textos = document.createElement('div');
  textos.appendChild(crearElemento('div', 'name', rep.nombre));
  textos.appendChild(crearElemento('div', 'sku', rep.sku + ' · ' + rep.marca + ' · ' + rep.categoria));

  let celda = crearElemento('div', 'item', '');
  celda.appendChild(imagen);
  celda.appendChild(textos);
  return celda;
}

// Celda de stock: unidades, estado (Disponible / Stock bajo) y mínimo
function crearCeldaStock(rep) {
  let claseEstado = 'badge';
  let textoEstado = 'Disponible';
  if (esStockBajo(rep.stock, rep.min)) {
    claseEstado = 'badge low';
    textoEstado = 'Stock bajo';
  }
  let celda = crearCelda('STOCK', rep.stock + ' uds. ');
  celda.appendChild(crearElemento('span', claseEstado, textoEstado));
  celda.appendChild(crearElemento('span', 'min', 'Mín. ' + rep.min));
  return celda;
}

// Celda con los botones Editar y Eliminar
function crearCeldaAcciones(rep) {
  let enlaceEditar = crearElemento('a', 'link', 'Editar');
  enlaceEditar.href = 'editar.html?sku=' + encodeURIComponent(rep.sku);

  let botonEliminar = crearElemento('button', 'link del', 'Eliminar');
  botonEliminar.type = 'button';
  botonEliminar.setAttribute('data-delete', '');

  let celda = crearElemento('div', 'acts', '');
  celda.appendChild(enlaceEditar);
  celda.appendChild(botonEliminar);
  return celda;
}

// Crea la fila completa de la tabla para un repuesto
function crearFila(rep) {
  let fila = crearElemento('article', 'tr', '');
  fila.dataset.sku = rep.sku;
  fila.appendChild(crearCeldaRepuesto(rep));
  fila.appendChild(crearCelda('COMPATIBILIDAD', rep.comp));
  fila.appendChild(crearCelda('PRECIO COP', crearElemento('b', '', '$ ' + rep.precio.toLocaleString('es-CO'))));
  fila.appendChild(crearCeldaStock(rep));
  fila.appendChild(crearCelda('UBICACIÓN', rep.ubi));
  fila.appendChild(crearCeldaAcciones(rep));
  return fila;
}

// Borra las filas que hay en la tabla y dibuja las de la lista
function pintarTabla(lista) {
  let filasViejas = document.querySelectorAll('#table .tr[data-sku]');
  for (let i = 0; i < filasViejas.length; i++) {
    filasViejas[i].remove();
  }
  let vacio = document.getElementById('empty');
  for (let i = 0; i < lista.length; i++) {
    vacio.before(crearFila(lista[i]));
  }
}

// Lee lo que el usuario puso en el buscador, la categoría y el botón Stock bajo
function leerFiltros() {
  return {
    texto: document.getElementById('q').value.trim().toLowerCase(),
    categoria: document.getElementById('cat').value,
    soloBajo: document.getElementById('lowBtn').getAttribute('aria-pressed') === 'true'
  };
}

// Prende o apaga el botón "Stock bajo"
function alternarBotonStockBajo() {
  let boton = document.getElementById('lowBtn');
  let activo = boton.getAttribute('aria-pressed') === 'true';
  boton.setAttribute('aria-pressed', !activo);
}

// Actualiza los números de arriba, el contador y los avisos
function mostrarResumen(totalFilas, mostradas, unidades, bajos) {
  document.getElementById('empty').hidden = mostradas > 0;
  document.getElementById('count').textContent = 'Mostrando ' + mostradas + ' de ' + totalFilas + ' repuestos';
  document.getElementById('stRef').textContent = totalFilas;
  document.getElementById('stUni').textContent = unidades;
  document.getElementById('stLow').textContent = bajos;

  let alerta = document.getElementById('lowAlert');
  alerta.hidden = (bajos === 0);
  alerta.textContent = bajos + ' repuestos están por debajo del stock mínimo.';
}

// Abre la ventana "¿Eliminar este repuesto?" con los datos del repuesto
function abrirModal(rep) {
  let info = '<b>' + escapar(rep.nombre) + '</b><br>';
  info += escapar(rep.sku + ' · ' + rep.marca + ' · ' + rep.categoria) + '<br>';
  info += rep.stock + ' unidades · Mínimo ' + rep.min;
  document.getElementById('mInfo').innerHTML = info;
  document.getElementById('modal').classList.add('open');
  document.getElementById('mCancel').focus();
}

function cerrarModal() {
  document.getElementById('modal').classList.remove('open');
}

function modalEstaAbierto() {
  return document.getElementById('modal').classList.contains('open');
}