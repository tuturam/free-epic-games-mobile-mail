const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const authHeader = getHeader(event, 'authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : ''
  if (!config.broadcastToken || token !== config.broadcastToken) {
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
      message: 'Email test tidak valid.',
    })
  }

  if (!config.segmentIdResend || !config.fromEmailResend) {
    console.error('[resend:create-broadcast] konfigurasi belum lengkap', {
      segmentId: !!config.segmentIdResend,
      from: !!config.fromEmailResend,
    })
    throw createError({
      statusCode: 500,
      message: 'Konfigurasi broadcast belum tersedia.',
    })
  }

  const games = await fetchEpicFreeGames(config.epicCountry || 'US')
  if (games.length === 0) {
    console.log('[resend:create-broadcast] skip: tidak ada free game aktif hari ini')
    return { skipped: true, reason: 'no-active-free-games' }
  }

  const subject = `[FREE DROP] ${games.map((g) => g.title).join(' & ')} ${games.length > 1 ? 'are' : 'is'} now FREE!`
  const html = buildBroadcastHtml(games)

  if (testTo) {
    const { data, error } = await withRetry(() =>
      resend.emails.send({
        from: config.fromEmailResend,
        to: [testTo],
        subject: `[TEST] ${subject}`,
        html,
      }),
    )

    if (error) {
      console.error('[resend:create-broadcast] test send gagal:', {
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

    console.log('[resend:create-broadcast] test email terkirim:', { testTo, id: data?.id })
    return { success: true, mode: 'test', id: data?.id, subject }
  }

  const name = `free-games:${games.map((g) => g.slug).join('+')}`
  const { data: existing, error: listError } = await withRetry(() => resend.broadcasts.list())
  if (listError) {
    console.error('[resend:create-broadcast] gagal list broadcast:', listError)
    throw createError({
      statusCode: listError.statusCode ?? 502,
      message: listError.message,
    })
  }

  if (existing?.data?.some((b) => b.name === name)) {
    console.log('[resend:create-broadcast] skip: broadcast sudah pernah dikirim:', name)
    return { skipped: true, reason: 'already-sent', name }
  }

  const { data, error } = await withRetry(() =>
    resend.broadcasts.create({
      segmentId: config.segmentIdResend,
      from: config.fromEmailResend,
      subject,
      html,
      name,
      send: true,
    }),
  )

  if (error) {
    console.error('[resend:create-broadcast] gagal:', {
      name,
      statusCode: error.statusCode,
      message: error.message,
    })
    throw createError({
      statusCode: error.statusCode ?? 502,
      message: error.message,
    })
  }

  console.log('[resend:create-broadcast] broadcast terkirim:', {
    broadcastId: data?.id,
    name,
    games: games.map((g) => g.title),
  })

  return { success: true, mode: 'broadcast', id: data?.id, name, subject }
})
