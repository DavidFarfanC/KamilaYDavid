// Carga todas las fotos de src/assets/photos.
// Si un archivo no existe, el componente <Photo> muestra un placeholder elegante,
// así la página funciona aunque falten imágenes.
const modules = import.meta.glob('./assets/photos/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  import: 'default',
})

const byName = {}
for (const [path, url] of Object.entries(modules)) {
  const name = path
    .split('/')
    .pop()
    .replace(/\.(jpg|jpeg|png|webp)$/i, '')
  byName[name] = url
}

export function photoUrl(name) {
  return byName[name] || null
}
