import type { IncomingMessage, ServerResponse } from 'http'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM || 'Stella Imóveis <onboarding@resend.dev>'

export default async function handler(req: IncomingMessage & { method?: string; body?: any }, res: ServerResponse & { status?: any; setHeader?: any; end?: any }) {
  try {
    if (req.method === 'OPTIONS') {
      res.setHeader?.('Access-Control-Allow-Origin', '*')
      res.setHeader?.('Access-Control-Allow-Methods', 'POST, OPTIONS')
      res.setHeader?.('Access-Control-Allow-Headers', 'Content-Type')
      res.statusCode = 204
      return res.end?.()
    }

    if (req.method !== 'POST') {
      res.statusCode = 405
      res.setHeader?.('Content-Type', 'application/json')
      return res.end?.(JSON.stringify({ error: 'Method not allowed' }))
    }

    // Collect body
    const chunks: Buffer[] = []
    await new Promise<void>((resolve) => {
      req.on('data', (c: Buffer) => chunks.push(c))
      req.on('end', () => resolve())
    })
    let payload: any = {}
    try { payload = JSON.parse(Buffer.concat(chunks).toString('utf8')) } catch {}

    const { to, subject, html, name, email, message } = payload
    const finalTo = to || process.env.RESEND_TO || process.env.RESEND_DEFAULT_TO
    if (!finalTo) {
      res.statusCode = 400
      res.setHeader?.('Content-Type', 'application/json')
      return res.end?.(JSON.stringify({ error: 'Missing recipient (RESEND_TO env or request body "to")' }))
    }
    const finalSubject = subject || 'New message from Stella site'
    const finalHtml = html || `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;">
        <h2>Website Contact</h2>
        <p><strong>Name:</strong> ${escapeHtml(name || '')}</p>
        <p><strong>Email:</strong> ${escapeHtml(email || '')}</p>
        <p><strong>Message:</strong></p>
        <pre style="white-space: pre-wrap;">${escapeHtml(message || '')}</pre>
      </div>
    `

    const { error } = await resend.emails.send({
      from: FROM,
      to: finalTo,
      subject: finalSubject,
      html: finalHtml,
      replyTo: email || undefined,
    })

    if (error) {
      res.statusCode = 500
      res.setHeader?.('Content-Type', 'application/json')
      return res.end?.(JSON.stringify({ error: error.message }))
    }

    res.statusCode = 200
    res.setHeader?.('Content-Type', 'application/json')
    return res.end?.(JSON.stringify({ ok: true }))
  } catch (e: any) {
    res.statusCode = 500
    res.setHeader?.('Content-Type', 'application/json')
    return res.end?.(JSON.stringify({ error: e?.message || 'Unknown error' }))
  }
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
