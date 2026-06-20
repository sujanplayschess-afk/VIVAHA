import { NextResponse } from 'next/server'

interface ApiResponseBody<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
  code?: string
}

interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export function successResponse<T>(
  data: T,
  message?: string,
  status = 200,
) {
  const body: ApiResponseBody<T> = { success: true, data }
  if (message) body.message = message
  return NextResponse.json(body, { status })
}

export function errorResponse(
  error: string,
  status = 400,
  code?: string,
) {
  const body: ApiResponseBody = { success: false, error }
  if (code) body.code = code
  return NextResponse.json(body, { status })
}

export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
) {
  const totalPages = Math.ceil(total / limit)
  const meta: PaginationMeta = {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  }
  const body: ApiResponseBody<T[]> & { meta: PaginationMeta } = {
    success: true,
    data,
    meta,
  }
  return NextResponse.json(body, { status: 200 })
}

export function createdResponse<T>(data: T, message = 'Created successfully') {
  return successResponse(data, message, 201)
}

export function noContentResponse() {
  return new NextResponse(null, { status: 204 })
}
