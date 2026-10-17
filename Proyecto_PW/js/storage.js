'use strict';
/* ===== storage.js · Almacenamiento local (localStorage) y manejo de fotos ===== */

const STORE_KEY = 'ks_repuestos';
const BASE_SKUS = ['fil-001', 'fre-002', 'enc-003', 'fil-004', 'sus-005', 'mot-006'];
const NO_FOTO = 'images/repuestos/sin-foto.svg';

const loadParts = () => { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch (e) { return []; } };
const saveParts = list => { try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); return true; } catch (e) { return false; } };
const skuExists = sku => BASE_SKUS.includes(sku.toLowerCase()) || loadParts().some(p => p.sku.toLowerCase() === sku.toLowerCase());

/* Reduce la foto a 400x400 (fondo blanco) y la devuelve como texto base64 */
function fileToDataURL(file, size = 400) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const c = document.createElement('canvas'); c.width = c.height = size;
        const g = c.getContext('2d');
        g.fillStyle = '#fff'; g.fillRect(0, 0, size, size);
        const k = Math.min(size / img.width, size / img.height);
        const w = img.width * k, h = img.height * k;
        g.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
        resolve(c.toDataURL('image/jpeg', 0.82));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}