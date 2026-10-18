/* ===== MODELO · repuestoModelo.js =====
   Maneja los DATOS de los repuestos: guardarlos, leerlos y borrarlos
   en el navegador (localStorage). No toca la pantalla. */

const CLAVE_STORAGE = 'ks_repuestos';

// SKUs de los 6 repuestos que ya vienen escritos en inventario.html
const SKUS_BASE = ['fil-001', 'fre-002', 'enc-003', 'fil-004', 'sus-005', 'mot-006'];

// Devuelve la lista de repuestos que el usuario ha guardado
function obtenerRepuestos() {
  let texto = localStorage.getItem(CLAVE_STORAGE);
  if (texto === null) {
    return [];
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

// Agrega un repuesto nuevo a la lista
function agregarRepuesto(repuesto) {
  let lista = obtenerRepuestos();
  lista.push(repuesto);
  return guardarRepuestos(lista);
}

// Borra el repuesto que tenga ese SKU
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

// Dice si ya existe un repuesto con ese SKU (base o guardado)
function existeSku(sku) {
  let skuMinuscula = sku.toLowerCase();
  if (SKUS_BASE.includes(skuMinuscula)) {
    return true;
  }
  let lista = obtenerRepuestos();
  for (let i = 0; i < lista.length; i++) {
    if (lista[i].sku.toLowerCase() === skuMinuscula) {
      return true;
    }
  }
  return false;
}

// Hay stock bajo cuando las unidades son menos que el mínimo
function esStockBajo(stock, minimo) {
  return stock < minimo;
}
