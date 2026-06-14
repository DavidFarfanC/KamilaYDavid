import {
  ATTENDANCE_VALUES,
  LODGING_VALUES,
  RSVP_EVENT,
  TRANSPORT_VALUES,
} from '../src/rsvpPayload.js'
import { SPONSORSHIP_CATEGORIES } from '../src/sponsorshipPayload.js'
import { getSupabaseAdmin } from '../lib/supabaseAdmin.js'

const VALID_LANGUAGES = new Set(['es', 'en', 'de'])
const VALID_ATTENDANCE = new Set(Object.values(ATTENDANCE_VALUES))
const VALID_TRANSPORT = new Set([...Object.values(TRANSPORT_VALUES), ''])
const VALID_LODGING = new Set([...Object.values(LODGING_VALUES), ''])
const VALID_SPONSORSHIP_STATUS = new Set(['pending_transfer', 'confirmed', 'cancelled'])
const VALID_SPONSORSHIP_CATEGORIES = new Set(SPONSORSHIP_CATEGORIES)
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function json(res, status, payload) {
  return res.status(status).json(payload)
}

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function parsePayload(body) {
  if (!body) return {}
  if (typeof body === 'string') return JSON.parse(body)
  if (Buffer.isBuffer(body)) return JSON.parse(body.toString('utf8'))
  if (typeof body === 'object') return body
  return {}
}

function pick(payload, keys) {
  return keys.reduce((acc, key) => {
    if (payload[key] !== undefined) acc[key] = payload[key]
    return acc
  }, {})
}

function validateShared(payload) {
  if (normalizeString(payload.event) !== RSVP_EVENT) {
    return 'Invalid event. Expected "kamila-david-wedding".'
  }

  if (!VALID_LANGUAGES.has(payload.language)) {
    return 'Invalid language. Use es, en or de.'
  }

  if (!normalizeString(payload.source)) {
    return 'Missing required field: source.'
  }

  return null
}

function validateRsvp(payload) {
  const sharedError = validateShared(payload)
  if (sharedError) return sharedError

  if (!normalizeString(payload.attendeesNames)) {
    return 'Missing required field: attendeesNames.'
  }

  if (!VALID_ATTENDANCE.has(payload.attendance)) {
    return 'Invalid attendance value.'
  }

  if (!normalizeString(payload.email)) {
    return 'Missing required field: email.'
  }

  if (!EMAIL_RE.test(normalizeString(payload.email))) {
    return 'Invalid email address.'
  }

  if (payload.attendance === 'attending' && !normalizeString(payload.whatsappPhone)) {
    return 'whatsappPhone is required when attendance is attending.'
  }

  if (!VALID_TRANSPORT.has(payload.transportInterest ?? '')) {
    return 'Invalid transportInterest value.'
  }

  if (!VALID_LODGING.has(payload.lodgingInterest ?? '')) {
    return 'Invalid lodgingInterest value.'
  }

  return null
}

function validateSponsorship(payload) {
  const sharedError = validateShared(payload)
  if (sharedError) return sharedError

  if (payload.type !== 'sponsorship_contribution') {
    return 'Invalid type. Expected sponsorship_contribution.'
  }

  if (!normalizeString(payload.sponsorName)) {
    return 'Missing required field: sponsorName.'
  }

  if (!VALID_SPONSORSHIP_CATEGORIES.has(payload.category)) {
    return 'Invalid category value.'
  }

  if (!(Number(payload.amount) > 0)) {
    return 'amount must be a number greater than 0.'
  }

  if (payload.currency !== 'MXN') {
    return 'Invalid currency. Expected MXN.'
  }

  if (payload.paymentMethod !== 'bank_transfer') {
    return 'Invalid paymentMethod. Expected bank_transfer.'
  }

  if (!VALID_SPONSORSHIP_STATUS.has(payload.paymentStatus)) {
    return 'Invalid paymentStatus value.'
  }

  return null
}

function buildInsertPayload(payload, isSponsorship) {
  if (isSponsorship) {
    const picked = pick(payload, [
      'event',
      'type',
      'language',
      'sponsorName',
      'category',
      'amount',
      'currency',
      'contact',
      'messageToCouple',
      'paymentMethod',
      'paymentStatus',
      'submittedAt',
      'source',
    ])

    return {
      ...picked,
      sponsorName: normalizeString(picked.sponsorName),
      category: normalizeString(picked.category),
      amount: Number(picked.amount),
      currency: normalizeString(picked.currency),
      contact: normalizeString(picked.contact),
      messageToCouple: normalizeString(picked.messageToCouple),
      paymentMethod: normalizeString(picked.paymentMethod),
      paymentStatus: normalizeString(picked.paymentStatus),
      source: normalizeString(picked.source),
      submittedAt: normalizeString(picked.submittedAt) || new Date().toISOString(),
    }
  }

  const picked = pick(payload, [
    'event',
    'language',
    'attendeesNames',
    'attendance',
    'transportInterest',
    'lodgingInterest',
    'email',
    'whatsappPhone',
    'messageToCouple',
    'submittedAt',
    'source',
  ])

  return {
    ...picked,
    attendeesNames: normalizeString(picked.attendeesNames),
    attendance: normalizeString(picked.attendance),
    transportInterest: normalizeString(picked.transportInterest),
    lodgingInterest: normalizeString(picked.lodgingInterest),
    email: normalizeString(picked.email),
    whatsappPhone: normalizeString(picked.whatsappPhone),
    messageToCouple: normalizeString(picked.messageToCouple),
    source: normalizeString(picked.source),
    submittedAt: normalizeString(picked.submittedAt) || new Date().toISOString(),
  }
}

function supabaseErrorStatus(error) {
  const validationCodes = new Set(['22001', '22P02', '23502', '23503', '23505', '23514', 'PGRST204'])
  return validationCodes.has(error?.code) ? 400 : 500
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return json(res, 405, { ok: false, error: 'Method not allowed.' })
  }

  let payload

  try {
    payload = parsePayload(req.body)
  } catch {
    return json(res, 400, { ok: false, error: 'Invalid JSON body.' })
  }

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return json(res, 400, { ok: false, error: 'Invalid payload.' })
  }

  const isSponsorship = payload.type === 'sponsorship_contribution'
  const table = isSponsorship ? 'sponsorship_contributions' : 'rsvp_submissions'
  const validationError = isSponsorship ? validateSponsorship(payload) : validateRsvp(payload)

  if (validationError) {
    return json(res, 400, { ok: false, error: validationError })
  }

  let supabase
  try {
    supabase = getSupabaseAdmin()
  } catch {
    return json(res, 500, { ok: false, error: 'Server configuration is missing.' })
  }

  const insertPayload = buildInsertPayload(payload, isSponsorship)
  const { data, error } = await supabase.from(table).insert(insertPayload).select('id').single()

  if (error) {
    const status = supabaseErrorStatus(error)
    const message = status === 400 ? error.message : 'Unexpected server error.'
    return json(res, status, { ok: false, error: message })
  }

  return json(res, 200, {
    ok: true,
    table,
    id: data?.id ?? null,
  })
}
