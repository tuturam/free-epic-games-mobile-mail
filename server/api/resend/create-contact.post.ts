import { isTesterEmailDomain } from '~~/shared/utils/email-validation'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const segmentId = config.segmentIdResend || process.env.RESEND_SEGMENT_ID
  const fromEmail = config.fromEmailResend || process.env.RESEND_FROM

  const body = await readBody<{ email?: string }>(event)
  const email = body?.email?.trim().toLowerCase()

  if (!email || !EMAIL_RE.test(email)) {
    console.warn('[resend:create-contact] invalid email:', body)
    throw createError({
      statusCode: 400,
      message: 'Invalid email.',
    })
  }

  if (isTesterEmailDomain(email)) {
    console.warn('[resend:create-contact] rejected tester domain email:', email)
    throw createError({
      statusCode: 400,
      message: 'Test or example email domains are not allowed.',
    })
  }

  if (!segmentId) {
    console.error('[resend:create-contact] RESEND_SEGMENT_ID is not configured')
    throw createError({
      statusCode: 500,
      message: 'Segment configuration is not available.',
    })
  }

    // 1. Check if contact already exists in Resend
    const { data: existingContact } = await resend.contacts.get({ email }).catch(() => ({ data: null }))
  const isExisting = !!existingContact?.id

  // 2. Add contact to segment (idempotent upsert in Resend)
  const { data: contactData, error: contactError } = await resend.contacts.create({
      email,
      segments: [{ id: segmentId }],
    })

        if(contactError) {
          console.error('[resend:create-contact] failed to register contact:', {
            email,
            segmentId,
            name: contactError.name,
            statusCode: contactError.statusCode,
            message: contactError.message,
          })
          throw createError({
            statusCode: contactError.statusCode ?? 502,
            message: contactError.message,
          })
        }

  const contactId = contactData?.id || existingContact?.id

  // 3. If contact was already registered, do not re-send welcome email to prevent quota abuse & spam
  if(isExisting) {
          console.log('[resend:create-contact] already subscribed:', { contactId, email })
          return {
            success: true,
            status: 'already-subscribed',
            id: contactId,
            message: "You're already subscribed! Radar is active for upcoming drops.",
          }
        }

  // 4. For new subscribers, immediately send welcome email with currently active free games
  if(fromEmail) {
          try {
            const games = await fetchEpicFreeGames()
            if (games.length > 0) {
              const gameTitles = games.map((g) => g.title).join(' & ')
              const verb = games.length > 1 ? 'are' : 'is'
              const subject = `Welcome! [FREE DROP] ${gameTitles} ${verb} now FREE!`
              const html = buildBroadcastHtml(games)

              const { data: emailData, error: emailError } = await withRetry(() =>
                resend.emails.send({
                  from: fromEmail,
                  to: [email],
                  subject,
                  html,
                }),
              )

              if (emailError) {
                console.error('[resend:create-contact] welcome email failed to send:', emailError)
              } else {
                console.log('[resend:create-contact] welcome email sent:', { email, emailId: emailData?.id })
              }
            }
          } catch (err) {
            // Do not fail the subscription response if the welcome email fails
            console.error('[resend:create-contact] failed to fetch games or send welcome email:', err)
          }
        }

  console.log('[resend:create-contact] new subscriber registered:', { contactId, email, segmentId })

  return {
          success: true,
          status: 'new-subscriber',
          id: contactId,
          message: 'Welcome drop sent to your inbox! Radar active for Android & iOS.',
        }
      })
