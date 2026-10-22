import type { Config, Context } from '@netlify/functions'

export default async (req: Request, _context: Context) => {
  const { next_run } = await req.json().catch(() => ({}) as { next_run?: string })

  const siteUrl = process.env.SITE_URL ?? process.env.URL ?? process.env.DEPLOY_PRIME_URL
  const token = process.env.BROADCAST_TOKEN

  if (!siteUrl || !token) {
    console.error('[scheduled:create-broadcast] missing configuration', {
      siteUrl: !!siteUrl,
      token: !!token,
    })
    return new Response(JSON.stringify({ ok: false, reason: 'missing-configuration' }), { status: 500 })
  }

  console.log('[scheduled:create-broadcast] received event! Next invocation at:', next_run)

  const res = await fetch(`${siteUrl}/api/resend/create-broadcast`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const body = await res.json().catch(() => ({}))

  if (!res.ok) {
    console.error('[scheduled:create-broadcast] endpoint call failed:', { status: res.status, body })
    return new Response(JSON.stringify({ ok: false, status: res.status, body }), { status: 502 })
  }

  console.log('[scheduled:create-broadcast] endpoint call succeeded:', body)
  return new Response(JSON.stringify({ ok: true, result: body }), { status: 200 })
}

export const config: Config = {
  schedule: '@daily',
}
