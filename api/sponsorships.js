import { getSupabaseAdmin } from '../lib/supabaseAdmin.js'

function json(res, status, payload) {
  return res.status(status).json(payload)
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0')

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return json(res, 405, { ok: false, error: 'Method not allowed.' })
  }

  let supabase
  try {
    supabase = getSupabaseAdmin()
  } catch {
    return json(res, 500, { ok: false, error: 'Server configuration is missing.' })
  }

  const { data, error } = await supabase
    .from('sponsorship_public_contributions')
    .select('id,name,category,amount,date')
    .order('created_at', { ascending: false })

  if (error) {
    return json(res, 500, { ok: false, error: error.message || 'Could not load sponsorship contributions.' })
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log('[sponsorships] rows:', data?.length || 0)
  }

  return json(res, 200, {
    ok: true,
    contributions: Array.isArray(data)
      ? data.map((row) => ({
          id: row.id,
          name: row.name,
          category: row.category,
          amount: Number(row.amount) || 0,
          date: row.date || '',
        }))
      : [],
  })
}
