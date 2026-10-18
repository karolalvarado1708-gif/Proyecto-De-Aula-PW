/* ===== MODELO · fotoModelo.js =====
   Reduce la foto a 400x400 para que ocupe poco en localStorage.
   Como leer una imagen tarda un poquito, la función recibe "cuandoTermine":
   una función que se ejecuta cuando la foto ya está lista. */

function reducirFoto(archivo, tamano, cuandoTermine) {
  let lector = new FileReader();

  lector.onerror = function () {
    cuandoTermine('');   // si falla, seguimos sin foto
  };

  lector.onload = function () {
    let imagen = new Image();

    imagen.onerror = function () {
      cuandoTermine('');
    };

    imagen.onload = function () {
      // Dibujamos la foto en un cuadro blanco de 400x400
      let lienzo = document.createElement('canvas');
      lienzo.width = tamano;
      lienzo.height = tamano;
      let dibujo = lienzo.getContext('2d');
      dibujo.fillStyle = '#fff';
      dibujo.fillRect(0, 0, tamano, tamano);

      // Se achica sin deformarla y se centra
      let escala = Math.min(tamano / imagen.width, tamano / imagen.height);
      let ancho = imagen.width * escala;
      let alto = imagen.height * escala;
      dibujo.drawImage(imagen, (tamano - ancho) / 2, (tamano - alto) / 2, ancho, alto);

      // Devolvemos la foto como texto (base64)
      cuandoTermine(lienzo.toDataURL('image/jpeg', 0.82));
    };

    imagen.src = lector.result;
  };

  lector.readAsDataURL(archivo);
}
