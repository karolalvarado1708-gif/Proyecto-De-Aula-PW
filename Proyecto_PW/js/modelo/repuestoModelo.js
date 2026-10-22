/* ===== MODELO · repuestoModelo.js =====
   Maneja los DATOS de los repuestos: guardarlos, leerlos, buscarlos,
   editarlos, borrarlos y filtrarlos. Todo se guarda en el navegador
   (localStorage). No toca la pantalla. */

const CLAVE_STORAGE = 'ks_inventario';

// Repuestos con los que empieza el inventario la primera vez que se abre la página
const REPUESTOS_INICIALES = [
  {
    sku: 'FIL-001', nombre: 'Filtro de aceite', categoria: 'Filtros', marca: 'Bosch',
    comp: 'Renault Logan / Sandero 1.6 2010–2020', precio: 38000, stock: 18, min: 5,
    ubi: 'Estante A-02', prov: 'Autopartes Andina',
    desc: 'Filtro de aceite roscado Bosch. Referencia 0451103336. Cambio recomendado según el plan de mantenimiento del vehículo.',
    foto: 'images/repuestos/filtro-aceite.jpg'
  },
  {
    sku: 'FRE-002', nombre: 'Pastillas de freno', categoria: 'Frenos', marca: 'Brembo',
    comp: 'Chevrolet Aveo 1.6 2006–2015', precio: 125000, stock: 4, min: 6,
    ubi: 'Estante B-01', prov: 'Autopartes Andina', desc: '',
    foto: 'images/repuestos/pastillas-freno.jpg'
  },
  {
    sku: 'ENC-003', nombre: 'Bujía de encendido', categoria: 'Encendido', marca: 'NGK',
    comp: 'Kia Picanto 1.0 2012–2018', precio: 24000, stock: 24, min: 8,
    ubi: 'Estante C-03', prov: 'Autopartes Andina', desc: '',
    foto: 'images/repuestos/bujia-encendido.jpg'
  },
  {
    sku: 'FIL-004', nombre: 'Filtro de aire', categoria: 'Filtros', marca: 'Mann',
    comp: 'Mazda 3 2.0 2014–2019', precio: 52000, stock: 12, min: 4,
    ubi: 'Estante A-03', prov: 'Autopartes Andina', desc: '',
    foto: 'images/repuestos/filtro-aire.jpg'
  },
  {
    sku: 'SUS-005', nombre: 'Amortiguador delantero', categoria: 'Suspensión', marca: 'Monroe',
    comp: 'Renault Duster 1.6 2013–2020', precio: 285000, stock: 3, min: 4,
    ubi: 'Estante D-01', prov: 'Autopartes Andina', desc: '',
    foto: 'images/repuestos/amortiguador-delantero.jpg'
  },
  {
    sku: 'MOT-006', nombre: 'Correa de distribución', categoria: 'Motor', marca: 'Gates',
    comp: 'Chevrolet Spark 1.0 2005–2015', precio: 96000, stock: 8, min: 3,
    ubi: 'Estante E-02', prov: 'Autopartes Andina', desc: '',
    foto: 'images/repuestos/correa-distribucion.jpg'
  }
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