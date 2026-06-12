// ============================================================
// PAYLOAD DEL RSVP (para backend y/o registro)
// ============================================================
// Esta función construye el objeto JSON exacto que genera el formulario.
// Es la ÚNICA fuente de verdad del payload: la usa RSVPSection.jsx tanto para
// enviar al backend (si hay RSVP_ENDPOINT) como para mantener consistencia con
// el mensaje de WhatsApp. Conecta tu backend apuntando RSVP_ENDPOINT en
// src/config.js a una URL que reciba este JSON por POST.

export const RSVP_EVENT = 'kamila-david-wedding'
export const RSVP_SOURCE = 'wedding-website'

// Mapas de normalización: del valor interno del formulario al valor estable
// que recibe el backend (no depende del idioma ni del texto visible).
export const ATTENDANCE_VALUES = {
  yes: 'attending',
  no: 'not_attending',
}

export const TRANSPORT_VALUES = {
  yes: 'interested',
  no: 'self_transport',
  maybe: 'unsure',
}

export const LODGING_VALUES = {
  shared: 'shared_group_option',
  own: 'self_managed',
  unsure: 'unsure',
}

/**
 * Construye el payload del RSVP.
 * @param {object} form - estado del formulario { names, attendance, shuttle, lodging, email, phone, message }
 * @param {string} language - idioma actual: 'es' | 'en' | 'de'
 * @returns {object} payload listo para JSON.stringify y POST a un endpoint
 */
export function buildRsvpPayload(form, language) {
  return {
    event: RSVP_EVENT,
    language,
    attendeesNames: form.names.trim(),
    attendance: ATTENDANCE_VALUES[form.attendance] || '',
    transportInterest: TRANSPORT_VALUES[form.shuttle] || '',
    lodgingInterest: LODGING_VALUES[form.lodging] || '',
    email: form.email.trim(),
    whatsappPhone: form.phone.trim(),
    messageToCouple: form.message.trim(),
    submittedAt: new Date().toISOString(),
    source: RSVP_SOURCE,
  }
}
