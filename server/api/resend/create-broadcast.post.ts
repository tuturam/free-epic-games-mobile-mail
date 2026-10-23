const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  // Runtime fallback keeps secrets out of the build output (Netlify secrets scan).
  const broadcastToken = config.broadcastToken || process.env.BROADCAST_TOKEN
  const segmentIdResend = config.segmentIdResend || process.env.RESEND_SEGMENT_ID
  const fromEmailResend = config.fromEmailResend || process.env.RESEND_FROM

  const authHeader = getHeader(event, 'authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : ''
  if (!broadcastToken || token !== broadcastToken) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized.',
    })
  }

  const body = await readBody<{ testTo?: string }>(event).catch(() => ({}) as { testTo?: string })
  const testTo = body?.testTo?.trim()

  if (testTo && !EMAIL_RE.test(testTo)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid test email.',
    })
  }

  if (!segmentIdResend || !fromEmailResend) {
    console.error('[resend:create-broadcast] incomplete configuration', {
      segmentId: !!segmentIdResend,
      from: !!fromEmailResend,
    })
    throw createError({
      statusCode: 500,
      message: 'Broadcast configuration is not available.',
    })
  }

  const games = await fetchEpicFreeGames()
  if (games.length === 0) {
    console.log('[resend:create-broadcast] skip: no active free games today')
    return { skipped: true, reason: 'no-active-free-games' }
  }

  const subject = `[FREE DROP] ${games.map((g) => g.title).join(' & ')} ${games.length > 1 ? 'are' : 'is'} now FREE!`
  const html = buildBroadcastHtml(games)

  if (testTo) {
    const { data, error } = await withRetry(() =>
      resend.emails.send({
        from: fromEmailResend,
        to: [testTo],
        subject: `[TEST] ${subject}`,
        html,
      }),
    )

    if (error) {
      console.error('[resend:create-broadcast] test send failed:', {
        testTo,
        name: error.name,
        statusCode: error.statusCode,
        message: error.message,
      })
      throw createError({
        statusCode: error.statusCode ?? 502,
        message: error.message,
      })
    }

    console.log('[resend:create-broadcast] test email sent:', { testTo, id: data?.id })
    return { success: true, mode: 'test', id: data?.id, subject }
  }

  const name = `free-games:${games.map((g) => g.slug).join('+')}`
  const { data: existing, error: listError } = await withRetry(() => resend.broadcasts.list())
  if (listError) {
    console.error('[resend:create-broadcast] failed to list broadcasts:', listError)
    throw createError({
      statusCode: listError.statusCode ?? 502,
      message: listError.message,
    })
  }

  if (existing?.data?.some((b) => b.name === name)) {
    console.log('[resend:create-broadcast] skip: broadcast already sent:', name)
    return { skipped: true, reason: 'already-sent', name }
  }

  const { data, error } = await withRetry(() =>
    resend.broadcasts.create({
      segmentId: segmentIdResend,
      from: fromEmailResend,
      subject,
      html,
      name,
      send: true,
    }),
  )

  if (error) {
    console.error('[resend:create-broadcast] failed:', {
      name,
      statusCode: error.statusCode,
      message: error.message,
    })
    throw createError({
      statusCode: error.statusCode ?? 502,
      message: error.message,
    })
  }

  console.log('[resend:create-broadcast] broadcast sent:', {
    broadcastId: data?.id,
    name,
    games: games.map((g) => g.title),
  })

  return { success: true, mode: 'broadcast', id: data?.id, name, subject }
})
