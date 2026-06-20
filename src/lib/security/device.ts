export interface DeviceInfo {
  browser: string
  browserVersion: string
  os: string
  osVersion: string
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'unknown'
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

const BROWSER_PATTERNS = [
  { name: 'Edge', regex: /edge\/([\d.]+)/i },
  { name: 'Chrome', regex: /chrome\/([\d.]+)/i },
  { name: 'Firefox', regex: /firefox\/([\d.]+)/i },
  { name: 'Safari', regex: /version\/([\d.]+).*safari/i },
  { name: 'Opera', regex: /(?:opera|opr)\/([\d.]+)/i },
  { name: 'IE', regex: /msie\s([\d.]+)/i },
]

const OS_PATTERNS = [
  { name: 'Windows', regex: /windows\snt\s([\d.]+)/i },
  { name: 'macOS', regex: /mac\sos\sx\s([\d._]+)/i },
  { name: 'iOS', regex: /(?:iphone\sos|ipados)\s([\d._]+)/i },
  { name: 'Android', regex: /android\s([\d.]+)/i },
  { name: 'Linux', regex: /linux/i },
]

const MOBILE_PATTERNS = /mobile|iphone|ipod|android.*mobile|windows\sphone/i
const TABLET_PATTERNS = /tablet|ipad|kindle|silk/i

export function parseUserAgent(ua: string): DeviceInfo {
  const browser = { name: 'Unknown', version: '0' }
  for (const { name, regex } of BROWSER_PATTERNS) {
    const match = ua.match(regex)
    if (match) {
      browser.name = name
      browser.version = match[1] || '0'
      break
    }
  }

  const os = { name: 'Unknown', version: '0' }
  for (const { name, regex } of OS_PATTERNS) {
    const match = ua.match(regex)
    if (match) {
      os.name = name
      os.version = match[1] ? match[1].replace(/_/g, '.') : '0'
      break
    }
  }

  const isMobile = MOBILE_PATTERNS.test(ua)
  const isTablet = TABLET_PATTERNS.test(ua) && !isMobile
  const isDesktop = !isMobile && !isTablet

  let deviceType: DeviceInfo['deviceType'] = 'unknown'
  if (isMobile) deviceType = 'mobile'
  else if (isTablet) deviceType = 'tablet'
  else if (isDesktop) deviceType = 'desktop'

  return {
    browser: browser.name,
    browserVersion: browser.version,
    os: os.name,
    osVersion: os.version,
    deviceType,
    isMobile,
    isTablet,
    isDesktop,
  }
}

export function getDeviceInfo(request: Request): DeviceInfo {
  const ua = request.headers.get('user-agent') || ''
  return parseUserAgent(ua)
}
