// ============================================================
// CONFIGURACIÓN EDITABLE
// Todo lo que probablemente quieras cambiar está en este archivo.
// ============================================================

// Fecha y hora de la boda (zona horaria de México, UTC-6 en diciembre)
export const WEDDING_DATE = new Date('2026-12-12T13:00:00-06:00')

// Número de WhatsApp para confirmaciones (formato internacional, sin "+", sin espacios)
// Ejemplo México: 52 + 10 dígitos → '5215512345678' o '525512345678'
export const WHATSAPP_NUMBER = '5215500000000'

// Endpoint del backend para RSVP y padrinos. Si lo dejas vacío (''),
// el formulario RSVP usa WhatsApp como flujo principal.
export const RSVP_ENDPOINT = '/api/rsvp'

// Mesa de regalos
export const REGISTRY_URL = 'https://example.com/mesa-de-regalos'

// ---------------------------------------------------------------
// Música de fondo
// ---------------------------------------------------------------
// Fuente activa: reproductor OFICIAL de YouTube embebido (la canción se
// transmite desde YouTube, no se descarga ni se copia el archivo).
// Cambia el ID si quieres otra canción (es lo que va después de "watch?v=").
// Canción actual: https://www.youtube.com/watch?v=aCf_Ugp7vXg
export const WEDDING_YOUTUBE_ID = 'aCf_Ugp7vXg'

// Alternativa: si algún día tienes una versión legal/propia del audio en
// archivo (mp3), colócala en public/audio/wedding-song.mp3 y pon aquí su
// ruta; deja WEDDING_YOUTUBE_ID en '' para usar el archivo en vez de YouTube.
export const WEDDING_AUDIO_SRC = '/audio/wedding-song.mp3'

// Dirección del evento y link de Google Maps (link corto real del lugar)
export const VENUE_ADDRESS =
  'Rómulo Hernández #21 km 1 Col. Lucio Moreno, 62736 Cocoyoc, Mor.'
export const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/jmGXkMx4VsCGCFC49'

// ---------------------------------------------------------------
// Padrinos / aportaciones (NO procesa pagos — solo registra intención;
// las aportaciones se hacen por transferencia bancaria)
// ---------------------------------------------------------------
// Metas por padrinazgo, en MXN. Si una meta está en 0, la barra muestra 0%
// (no divide entre cero). Edita estos montos cuando los tengas.
export const SPONSORSHIP_GOALS = {
  photography: 15000, // Padrinos de fotografía
  audio: 10000, // Padrinos de audio
  cake: 5000, // Padrinos de pastel
  flowers: 5000, // Padrinos de flores
  aisle: 3000, // Padrinos de camino
  bride_presentation: 5000, // Padrinos de presentación de la novia
  toast: 4000, // Padrinos del brindis
  gratitude: 5000, // Padrinos de gratitud
}

// Respaldo local si `/api/sponsorships` falla.
// category: 'photography' | 'audio' | 'cake' | 'flowers' | 'aisle' |
//           'bride_presentation' | 'toast' | 'gratitude'. amount en MXN.
export const SPONSORSHIP_CONTRIBUTIONS = [
  // { id: 'example-1', name: 'Ejemplo', category: 'photography', amount: 0, date: '2026-01-01' },
]

// Opciones de hospedaje recomendadas (nombre, categoría de precio y link a Maps).
// El texto introductorio y la nota de Airbnb viven en las traducciones (i18n).
export const LODGING_OPTIONS = [
  { name: 'The Lorian Club', tier: '$$$', url: 'https://maps.app.goo.gl/p3rb17YgEoUmjaQL8?g_st=iw' },
  { name: 'Hotel Xail', tier: '$$', url: 'https://maps.app.goo.gl/B5dqVKpxhvW8wPmR6?g_st=iw' },
  { name: 'Terrazas Inn', tier: '$', url: 'https://maps.app.goo.gl/kbKPfrsyL3RBDe2T7?g_st=iw' },
]
