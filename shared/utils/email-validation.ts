/**
 * Blocked email domains, including RFC 2606 / RFC 6761 reserved domains,
 * common tester/dummy domains, and disposable email providers that fail
 * or bounce when Resend broadcasts are dispatched.
 */
export const DISALLOWED_EMAIL_DOMAINS = new Set([
  // RFC 2606 / RFC 6761 reserved domains
  'example.com',
  'example.net',
  'example.org',
  'example.edu',

  // Common tester / dummy domains
  'test.com',
  'testing.com',
  'sample.com',

  // Common disposable / temporary mail domains
  'mailinator.com',
  'tempmail.com',
  'guerrillamail.com',
  '10minutemail.com',
  'throwawaymail.com',
  'trashmail.com',
])

export const DISALLOWED_EMAIL_TLDS = [
  '.example',
  '.test',
  '.invalid',
  '.localhost',
]

/**
 * Checks whether an email address belongs to a tester, reserved, or disallowed domain.
 * @param email - The email address to check
 * @returns true if the email domain is disallowed / tester
 */
export function isTesterEmailDomain(email: string): boolean {
  if (!email || typeof email !== 'string') return false

  const parts = email.trim().toLowerCase().split('@')
  if (parts.length !== 2) return false

  const domain = parts[1]?.trim()
  if (!domain) return false

  // Check exact domain
  if (DISALLOWED_EMAIL_DOMAINS.has(domain)) {
    return true
  }

  // Check subdomains of disallowed domains (e.g. mail.example.com)
  for (const disallowed of DISALLOWED_EMAIL_DOMAINS) {
    if (domain.endsWith('.' + disallowed)) {
      return true
    }
  }

  // Check disallowed RFC TLDs (.test, .example, .invalid, .localhost)
  for (const tld of DISALLOWED_EMAIL_TLDS) {
    if (domain.endsWith(tld)) {
      return true
    }
  }

  return false
}
