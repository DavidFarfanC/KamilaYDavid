# Música de fondo

Coloca aquí la canción de la invitación con el nombre exacto:

    wedding-song.mp3

La ruta es editable en `src/config.js` → `WEDDING_AUDIO_SRC`.

Canción de referencia (deseada): https://www.youtube.com/watch?v=aCf_Ugp7vXg

IMPORTANTE: no se descarga audio desde YouTube. Usa una versión permitida/legal
del audio (comprada, con licencia, o propia) y guárdala como `wedding-song.mp3`.

Mientras el archivo no exista, el botón de música aparece pero no reproduce nada
(se registra un `console.warn`); la página nunca se rompe.
