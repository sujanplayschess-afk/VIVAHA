const ALLOWED_TAGS = ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li']
const ALLOWED_ATTRS = ['href', 'target', 'rel']

function stripHtmlTags(str: string): string {
  return str.replace(/<[^>]*>/g, '')
}

function basicSanitize(str: string, allowedTags: string[] = []): string {
  if (allowedTags.length === 0) {
    return stripHtmlTags(str)
  }
  const allowedSet = new Set(allowedTags)
  return str.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g, (match, tag) => {
    return allowedSet.has(tag.toLowerCase()) ? match : ''
  })
}

export function sanitizeHtml(dirty: string): string {
  if (typeof dirty !== 'string') return ''
  return basicSanitize(dirty, ALLOWED_TAGS)
}

export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return ''
  return stripHtmlTags(input.trim())
}

export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') return ''
  return email.trim().toLowerCase()
}

export function sanitizePhone(phone: string): string {
  if (typeof phone !== 'string') return ''
  return phone.replace(/[^\d+]/g, '').trim()
}

export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  fields: (keyof T)[],
): T {
  const sanitized = { ...obj } as Record<string, unknown>
  for (const field of fields) {
    const value = sanitized[field as string]
    if (typeof value === 'string') {
      sanitized[field as string] = sanitizeString(value)
    }
  }
  return sanitized as T
}
