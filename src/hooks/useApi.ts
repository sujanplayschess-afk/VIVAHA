'use client'

import { useCallback } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { useUIStore } from '@/stores/ui-store'
import type { ApiResponse } from '@/types'

interface UseApiOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
}

export async function apiFetch<T>(url: string, options: UseApiOptions = {}): Promise<ApiResponse<T>> {
  const token = useAuthStore.getState().accessToken
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(url, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const data: ApiResponse<T> = await res.json()

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`)
  }

  return data
}

interface MutationMessages {
  loading?: string
  success: string
  error?: string
}

export function useMutationWithToast<TData, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  messages: MutationMessages
) {
  const addToast = useUIStore((state) => state.addToast)

  const execute = useCallback(
    async (variables: TVariables): Promise<ApiResponse<TData> | null> => {
      if (messages.loading) {
        addToast({ type: 'info', title: messages.loading })
      }

      try {
        const result = await mutationFn(variables)
        addToast({ type: 'success', title: messages.success })
        return result
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An unexpected error occurred'
        addToast({ type: 'error', title: messages.error || message })
        return null
      }
    },
    [mutationFn, messages, addToast]
  )

  return { execute }
}
