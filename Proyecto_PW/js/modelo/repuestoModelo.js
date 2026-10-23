/* ===== MODELO · repuestoModelo.js =====
   Maneja los DATOS de los repuestos: guardarlos, leerlos, buscarlos,
   editarlos, borrarlos y filtrarlos. Todo se guarda en el navegador
   (localStorage). No toca la pantalla. */

const CLAVE_STORAGE = 'ks_inventario';

// Repuestos con los que empieza el inventario la primera vez que se abre la página
const REPUESTOS_INICIALES = [
];

// Devuelve la lista de repuestos guardada. La primera vez (cuando no hay
// nada guardado) guarda y devuelve los repuestos iniciales.
function obtenerRepuestos() {
  let texto = localStorage.getItem(CLAVE_STORAGE);
  if (texto === null) {
    guardarRepuestos(REPUESTOS_INICIALES);
    return REPUESTOS_INICIALES.slice();
  }
  try {
    return JSON.parse(texto) || [];
  } catch (error) {
    return [];
  }
}

// Guarda la lista completa. Devuelve true si se pudo, false si no hay espacio
function guardarRepuestos(lista) {
  try {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(lista));
    return true;
  } catch (error) {
    return false;
  }
}

// CREAR: agrega un repuesto nuevo a la lista
function agregarRepuesto(repuesto) {
  let lista = obtenerRepuestos();
  lista.push(repuesto);
  return guardarRepuestos(lista);
}

// LEER: busca el repuesto con ese SKU. Si no existe devuelve null
function buscarRepuesto(sku) {
  let lista = obtenerRepuestos();
  for (let i = 0; i < lista.length; i++) {
    if (lista[i].sku.toLowerCase() === sku.toLowerCase()) {
      return lista[i];
    }
  }
  return null;
}

// EDITAR: cambia los datos del repuesto que tenga ese SKU
function actualizarRepuesto(sku, repuestoNuevo) {
  let lista = obtenerRepuestos();
  for (let i = 0; i < lista.length; i++) {
    if (lista[i].sku.toLowerCase() === sku.toLowerCase()) {
      lista[i] = repuestoNuevo;
    }
  }
  return guardarRepuestos(lista);
}

// ELIMINAR: borra el repuesto que tenga ese SKU
function eliminarRepuesto(sku) {
  let lista = obtenerRepuestos();
  let nuevaLista = [];
  for (let i = 0; i < lista.length; i++) {
    if (lista[i].sku.toLowerCase() !== sku.toLowerCase()) {
      nuevaLista.push(lista[i]);
    }
  }
  guardarRepuestos(nuevaLista);
}

// Dice si ya existe un repuesto con ese SKU
function existeSku(sku) {
  return buscarRepuesto(sku) !== null;
}

// Hay stock bajo cuando las unidades son menos que el mínimo
function esStockBajo(stock, minimo) {
  return stock < minimo;
}

// BUSCADOR: devuelve solo los repuestos que cumplen los filtros
// (texto en nombre, SKU o marca; categoría; y solo stock bajo)
function filtrarRepuestos(lista, filtros) {
  let resultado = [];
  for (let i = 0; i < lista.length; i++) {
    let rep = lista[i];
    let coincide = true;

    if (filtros.texto !== '') {
      let enNombre = rep.nombre.toLowerCase().includes(filtros.texto);
      let enSku = rep.sku.toLowerCase().includes(filtros.texto);
      let enMarca = rep.marca.toLowerCase().includes(filtros.texto);
      if (!enNombre && !enSku && !enMarca) {
        coincide = false;
      }
    }
    if (filtros.categoria !== '' && rep.categoria !== filtros.categoria) {
      coincide = false;
    }
    if (filtros.soloBajo && !esStockBajo(rep.stock, rep.min)) {
      coincide = false;
    }

    if (coincide) {
      resultado.push(rep);
    }
  }
  return resultado;
}