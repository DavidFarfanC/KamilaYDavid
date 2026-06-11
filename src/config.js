// ============================================================
// CONFIGURACIÓN EDITABLE
// Todo lo que probablemente quieras cambiar está en este archivo.
// ============================================================

// Fecha y hora de la boda (zona horaria de México, UTC-6 en diciembre)
export const WEDDING_DATE = new Date('2026-12-12T13:00:00-06:00')

// Número de WhatsApp para confirmaciones (formato internacional, sin "+", sin espacios)
// Ejemplo México: 52 + 10 dígitos → '5215512345678' o '525512345678'
export const WHATSAPP_NUMBER = '5215500000000'

// Endpoint opcional para el RSVP (Formspree, Google Apps Script, API propia…).
// Si lo dejas vacío (''), el formulario enviará la confirmación por WhatsApp.
export const RSVP_ENDPOINT = ''

// Mesa de regalos
export const REGISTRY_URL = 'https://example.com/mesa-de-regalos'

// Dirección del evento y link de Google Maps
export const VENUE_ADDRESS =
  'Rómulo Hernández #21 km 1 Col. Lucio Moreno, 62736 Cocoyoc, Mor.'
export const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(VENUE_ADDRESS)

// Opciones de hospedaje (edita nombre, descripción y link; deja url vacía si aún no hay link)
export const LODGING_OPTIONS = [
  { name: 'Hotel 1 — por confirmar', note: 'A pocos minutos del lugar de la celebración.', url: '' },
  { name: 'Hotel 2 — por confirmar', note: 'Opción cómoda para familias.', url: '' },
  { name: 'Hotel 3 — por confirmar', note: 'Alternativa cercana con buena relación calidad-precio.', url: '' },
  { name: 'Airbnb — zona recomendada: Cocoyoc / Oaxtepec', note: 'Busca alojamientos cerca de Cocoyoc, Morelos.', url: '' },
]
