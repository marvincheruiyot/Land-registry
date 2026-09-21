import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => {
    // Initialize from localStorage on store creation
    const token = localStorage.getItem('accessToken')
    const userRaw = localStorage.getItem('user')
    const storedUser = userRaw ? (() => { try { return JSON.parse(userRaw) } catch { return null } })() : null

    return {
      user: storedUser || null,
      accessToken: token || null,
      refreshToken: localStorage.getItem('refreshToken') || null,
      isAuthenticated: !!(token && storedUser)
    }
  },

  getters: {
    isLandOwner: (state) => state.user?.role === 'Land_Owner',
    isLandOfficer: (state) => state.user?.role === 'Land_Officer',
    isAdministrator: (state) => state.user?.role === 'Administrator',
    userRole: (state) => state.user?.role || null
  },

  actions: {
    async login(credentials) {
      try {
        const response = await api.post('/auth/login', credentials)
        const { user, accessToken, refreshToken } = response.data.data

        this.user = user
        this.accessToken = accessToken
        this.refreshToken = refreshToken
        this.isAuthenticated = true

        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        localStorage.setItem('user', JSON.stringify(user))

        return response.data
      } catch (error) {
        throw error
      }
    },

    async register(userData) {
      try {
        const response = await api.post('/auth/register', userData)
        const { user, accessToken, refreshToken } = response.data.data

        this.user = user
        this.accessToken = accessToken
        this.refreshToken = refreshToken
        this.isAuthenticated = true

        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        localStorage.setItem('user', JSON.stringify(user))

        return response.data
      } catch (error) {
        throw error
      }
    },

    async logout() {
      try {
        if (this.accessToken) {
          await api.post('/auth/logout')
        }
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.user = null
        this.accessToken = null
        this.refreshToken = null
        this.isAuthenticated = false

        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
      }
    },

    async fetchCurrentUser() {
      try {
        const response = await api.get('/auth/me')
        this.user = response.data.data.user
        localStorage.setItem('user', JSON.stringify(this.user))
      } catch (error) {
        console.error('Failed to fetch user:', error)
        this.logout()
      }
    },

    async refreshAccessToken() {
      try {
        const response = await api.post('/auth/refresh-token', {
          refreshToken: this.refreshToken
        })
        const { accessToken, refreshToken } = response.data.data

        this.accessToken = accessToken
        this.refreshToken = refreshToken

        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)

        return accessToken
      } catch (error) {
        this.logout()
        throw error
      }
    },

    initializeAuth() {
      const token = localStorage.getItem('accessToken')
      const user = localStorage.getItem('user')

      if (token && user) {
        try {
          this.accessToken = token
          this.user = JSON.parse(user)
          this.isAuthenticated = true
        } catch {
          this.logout()
        }
      }
    }
  }
})
