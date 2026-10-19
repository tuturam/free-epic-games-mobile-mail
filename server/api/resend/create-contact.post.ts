const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string }>(event)
  const email = body?.email?.trim().toLowerCase()

  if (!email || !EMAIL_RE.test(email)) {
    console.warn('[resend:create-contact] invalid email:', body)
    throw createError({
      statusCode: 400,
      message: 'Email tidak valid.',
    })
  }

  const config = useRuntimeConfig()
  const segmentId = config.segmentIdResend

  if (!segmentId) {
    console.error('[resend:create-contact] RESEND_SEGMENT_ID belum dikonfigurasi')
    throw createError({
      statusCode: 500,
      message: 'Konfigurasi segment belum tersedia.',
    })
  }

  const { data, error } = await resend.contacts.create({
    email,
    segments: [{ id: segmentId }],
  })

  if (error) {
    console.error('[resend:create-contact] gagal:', {
      email,
      segmentId,
      name: error.name,
      statusCode: error.statusCode,
      message: error.message,
    })
    throw createError({
      statusCode: error.statusCode ?? 502,
      message: error.message,
    })
  }

  console.log('[resend:create-contact] sukses:', {
    contactId: data?.id,
    email,
    segmentId,
  })

  return { success: true, id: data?.id }
})
