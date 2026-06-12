// ============================================================
// PAYLOAD DE APORTACIÓN DE PADRINOS (para backend y/o registro)
// ============================================================
// Esta función construye el objeto JSON exacto que genera el formulario de
// padrinos. NO procesa pagos: solo registra la intención de aportar. Las
// aportaciones se realizan por transferencia bancaria (paymentMethod siempre
// 'bank_transfer', paymentStatus inicia en 'pending_transfer').
// IMPORTANTE: nunca guarda CLABE ni datos bancarios en el payload.
// Conecta tu backend apuntando SPONSORSHIP_ENDPOINT en src/config.js (o reusa
// tu endpoint) a una URL que reciba este JSON por POST.

export const SPONSORSHIP_EVENT = 'kamila-david-wedding'
export const SPONSORSHIP_SOURCE = 'wedding-website'

// Categorías normalizadas (no dependen del idioma ni del texto visible).
export const SPONSORSHIP_CATEGORIES = ['rings', 'bouquet', 'bible']

/**
 * Construye el payload de la aportación de padrinos.
 * @param {object} form - { name, category, amount, contact, message }
 * @param {string} language - 'es' | 'en' | 'de'
 * @returns {object} payload listo para JSON.stringify y POST a un endpoint
 */
export function buildSponsorshipPayload(form, language) {
  const amount = Number(String(form.amount).replace(/[^\d.]/g, '')) || 0
  return {
    event: SPONSORSHIP_EVENT,
    type: 'sponsorship_contribution',
    language,
    sponsorName: form.name.trim(),
    category: SPONSORSHIP_CATEGORIES.includes(form.category) ? form.category : '',
    amount,
    currency: 'MXN',
    contact: form.contact.trim(),
    messageToCouple: form.message.trim(),
    paymentMethod: 'bank_transfer',
    paymentStatus: 'pending_transfer',
    submittedAt: new Date().toISOString(),
    source: SPONSORSHIP_SOURCE,
  }
}
