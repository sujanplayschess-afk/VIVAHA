const otpStore = new Map<string, { otp: string; expiresAt: number }>()

const OTP_TTL = 5 * 60 * 1000
const CLEANUP_INTERVAL = 60 * 1000

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function storeOtp(identifier: string, otp: string): void {
  otpStore.set(identifier, { otp, expiresAt: Date.now() + OTP_TTL })
}

export function verifyOtp(identifier: string, otp: string): boolean {
  const entry = otpStore.get(identifier)
  if (!entry) return false
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(identifier)
    return false
  }
  if (entry.otp !== otp) return false
  otpStore.delete(identifier)
  return true
}

if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, value] of otpStore) {
      if (now > value.expiresAt) {
        otpStore.delete(key)
      }
    }
  }, CLEANUP_INTERVAL)
}
