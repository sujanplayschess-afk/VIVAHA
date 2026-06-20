import { NextRequest } from 'next/server'
import { apiHandler } from '@/lib/api/handler'
import { requireRole } from '@/lib/auth-helpers'
import { successResponse, errorResponse } from '@/lib/api/response'
import fs from 'fs'
import path from 'path'

const settingsPath = path.join(process.cwd(), 'data', 'site-settings.json')

function readSettings(): Record<string, unknown> {
  try {
    const raw = fs.readFileSync(settingsPath, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function writeSettings(data: Record<string, unknown>): void {
  fs.writeFileSync(settingsPath, JSON.stringify(data, null, 2), 'utf-8')
}

export const GET = apiHandler(async (req: NextRequest) => {
  await requireRole(req, ['ADMIN', 'SUPER_ADMIN'])
  const settings = readSettings()
  return successResponse(settings)
})

export const POST = apiHandler(async (req: NextRequest) => {
  await requireRole(req, ['ADMIN', 'SUPER_ADMIN'])
  const body = await req.json()
  const current = readSettings()
  const updated = { ...current, ...body }
  writeSettings(updated)
  return successResponse(updated, 'Settings updated successfully')
}, { csrfDisabled: true })
