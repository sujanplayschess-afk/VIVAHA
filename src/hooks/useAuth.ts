'use client'

import { useCallback, useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import type { ApiResponse } from '@/types'

interface LoginResponse {
  user: {
    id: string
    profileId: string
    email: string
    role: string
    subscription?: string
  }
  accessToken: string
}

export function useAuth() {
  const { user, accessToken, isAuthenticated, isLoading, setAuth, logout: storeLogout, setLoading } = useAuthStore()

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data: ApiResponse<LoginResponse> = await res.json()

      if (!res.ok || !data.success || !data.data) {
        throw new Error(data.error || 'Login failed')
      }

      setAuth(data.data.user, data.data.accessToken)
      return data.data
    } finally {
      setLoading(false)
    }
  }, [setAuth, setLoading])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // proceed with local logout even if API call fails
    }
    storeLogout()
  }, [storeLogout])

  const refreshSession = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/refresh', { method: 'POST' })
      const data: ApiResponse<LoginResponse> = await res.json()

      if (res.ok && data.success && data.data) {
        setAuth(data.data.user, data.data.accessToken)
      } else {
        storeLogout()
      }
    } catch {
      storeLogout()
    } finally {
      setLoading(false)
    }
  }, [setAuth, storeLogout, setLoading])

  const checkAuth = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/me')
      const data: ApiResponse<LoginResponse['user']> = await res.json()

      if (res.ok && data.success && data.data) {
        setAuth(data.data, accessToken || '')
      } else {
        storeLogout()
      }
    } catch {
      storeLogout()
    } finally {
      setLoading(false)
    }
  }, [setAuth, storeLogout, setLoading, accessToken])

  useEffect(() => {
    if (isLoading) {
      checkAuth()
    }
  }, [])

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshSession,
    checkAuth,
  }
}
