/* ===== VISTA · inventarioVista.js =====
   Todo lo que se ve en la pantalla del inventario (tabla, resumen y ventana
   de confirmación). */

const SIN_FOTO = 'images/repuestos/sin-foto.svg';

// Crea el HTML de una fila de la tabla para un repuesto guardado
function crearFilaHTML(rep) {
  let bajo = esStockBajo(rep.stock, rep.min);
  let foto = rep.foto;
  if (!foto) {
    foto = SIN_FOTO;
  }
  let claseEstado = 'badge';
  let textoEstado = 'Disponible';
  if (bajo) {
    claseEstado = 'badge low';
    textoEstado = 'Stock bajo';
  }

  let html = '';
  html += '<article class="tr" data-custom';
  html += ' data-name="' + escapar(rep.nombre.toLowerCase()) + '"';
  html += ' data-sku="' + escapar(rep.sku.toLowerCase()) + '"';
  html += ' data-brand="' + escapar(rep.marca.toLowerCase()) + '"';
  html += ' data-cat="' + escapar(rep.categoria) + '"';
  html += ' data-stock="' + rep.stock + '"';
  html += ' data-min="' + rep.min + '"';
  html += ' data-low="' + bajo + '">';
  html += '<div class="item">';
  html += '<img class="thumb" src="' + escapar(foto) + '" alt="' + escapar(rep.nombre + ' ' + rep.marca) + '" loading="lazy" width="56" height="56">';
  html += '<div>';
  html += '<div class="name">' + escapar(rep.nombre) + '</div>';
  html += '<div class="sku">' + escapar(rep.sku) + ' · ' + escapar(rep.marca) + ' · ' + escapar(rep.categoria) + '</div>';
  html += '</div></div>';
  html += '<div><span class="lbl">COMPATIBILIDAD</span>' + escapar(rep.comp) + '</div>';
  html += '<div><span class="lbl">PRECIO COP</span><b>$ ' + rep.precio.toLocaleString('es-CO') + '</b></div>';
  html += '<div><span class="lbl">STOCK</span>' + rep.stock + ' uds. ';
  html += '<span class="' + claseEstado + '">' + textoEstado + '</span>';
  html += '<span class="min">Mín. ' + rep.min + '</span></div>';
  html += '<div><span class="lbl">UBICACIÓN</span>' + escapar(rep.ubi) + '</div>';
  html += '<div class="acts">';
  html += '<a class="link" href="editar.html">Editar</a>';
  html += '<button class="link del" type="button" data-delete>Eliminar</button>';
  html += '</div>';
  html += '</article>';
  return html;
}

// Agrega a la tabla los repuestos que el usuario guardó
function pintarRepuestosGuardados(lista) {
  let html = '';
  for (let i = 0; i < lista.length; i++) {
    html += crearFilaHTML(lista[i]);
  }
  document.getElementById('empty').insertAdjacentHTML('beforebegin', html);
}

// Todas las filas de repuestos de la tabla
function obtenerFilas() {
  return document.querySelectorAll('#table .tr[data-sku]');
}

// Lee los datos de una fila (están guardados en sus atributos data-...)
function leerFila(fila) {
  return {
    nombre: fila.dataset.name,
    sku: fila.dataset.sku,
    marca: fila.dataset.brand,
    categoria: fila.dataset.cat,
    stock: Number(fila.dataset.stock),
    minimo: Number(fila.dataset.min)
  };
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

function ocultarFila(fila, ocultar) {
  fila.hidden = ocultar;
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

// Abre la ventana "¿Eliminar este repuesto?" con los datos de la fila
function abrirModal(fila) {
  let info = '<b>' + escapar(fila.querySelector('.name').textContent) + '</b><br>';
  info += escapar(fila.querySelector('.sku').textContent) + '<br>';
  info += fila.dataset.stock + ' unidades · Mínimo ' + fila.dataset.min;
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
