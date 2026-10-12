import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => {
    // Load from localStorage or use defaults
    const savedSettings = localStorage.getItem('systemSettings')
    const defaults = {
      theme: 'light',
      fontSize: 14,
      sidebarPosition: 'left',
      compactMode: false,
      animations: true,
      tooltips: true,
      tableDensity: 'standard',
      itemsPerPage: 25,
      notifications: {
        email: true,
        browser: true,
        transfers: true,
        documents: true,
        sound: false
      },
      language: 'en',
      timezone: 'Africa/Nairobi',
      dateFormat: 'DD/MM/YYYY',
      currency: 'KES',
      sessionTimeout: 30,
      twoFactor: false,
      activityLogging: true,
      dataExport: true,
      // Officer-specific settings
      defaultCounty: '',
      autoSaveDrafts: true,
      showQuickActions: true,
      dashboardLayout: 'comfortable',
      emailNotifyTransfers: true,
      showStatsWidget: true,
      workStartTime: '08:00',
      workEndTime: '17:00',
      dailyTarget: 10
    }

    return savedSettings ? { ...defaults, ...JSON.parse(savedSettings) } : defaults
  },

  actions: {
    updateSettings(newSettings) {
      Object.assign(this.$state, newSettings)
      this.saveToLocalStorage()
      this.applySettings()
    },

    saveToLocalStorage() {
      localStorage.setItem('systemSettings', JSON.stringify(this.$state))
      localStorage.setItem('settingsSavedAt', new Date().toISOString())
    },

    applySettings() {
      // Apply theme
      if (this.theme === 'dark') {
        document.documentElement.setAttribute('data-bs-theme', 'dark')
        document.body.classList.add('dark-theme')
      } else if (this.theme === 'light') {
        document.documentElement.setAttribute('data-bs-theme', 'light')
        document.body.classList.remove('dark-theme')
      } else if (this.theme === 'auto') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        document.documentElement.setAttribute('data-bs-theme', isDark ? 'dark' : 'light')
        if (isDark) {
          document.body.classList.add('dark-theme')
        } else {
          document.body.classList.remove('dark-theme')
        }
      }

      // Apply font size to root
      document.documentElement.style.fontSize = `${this.fontSize}px`

      // Apply compact mode
      if (this.compactMode) {
        document.body.classList.add('compact-mode')
      } else {
        document.body.classList.remove('compact-mode')
      }

      // Apply animations
      if (!this.animations) {
        document.body.classList.add('no-animations')
      } else {
        document.body.classList.remove('no-animations')
      }

      // Apply sidebar position
      if (this.sidebarPosition === 'right') {
        document.body.classList.add('sidebar-right')
      } else {
        document.body.classList.remove('sidebar-right')
      }

      // Apply table density
      document.body.setAttribute('data-table-density', this.tableDensity)

      // Request browser notification permission if enabled
      if (this.notifications.browser && 'Notification' in window) {
        if (Notification.permission === 'default') {
          Notification.requestPermission()
        }
      }
    },

    resetToDefaults() {
      const defaults = {
        theme: 'light',
        fontSize: 14,
        sidebarPosition: 'left',
        compactMode: false,
        animations: true,
        tooltips: true,
        tableDensity: 'standard',
        itemsPerPage: 25,
        notifications: {
          email: true,
          browser: true,
          transfers: true,
          documents: true,
          sound: false
        },
        language: 'en',
        timezone: 'Africa/Nairobi',
        dateFormat: 'DD/MM/YYYY',
        currency: 'KES',
        sessionTimeout: 30,
        twoFactor: false,
        activityLogging: true,
        dataExport: true,
        // Officer-specific settings
        defaultCounty: '',
        autoSaveDrafts: true,
        showQuickActions: true,
        dashboardLayout: 'comfortable',
        emailNotifyTransfers: true,
        showStatsWidget: true,
        workStartTime: '08:00',
        workEndTime: '17:00',
        dailyTarget: 10
      }
      this.updateSettings(defaults)
    },

    formatDate(date) {
      if (!date) return ''
      const d = new Date(date)
      const day = String(d.getDate()).padStart(2, '0')
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const year = d.getFullYear()

      switch (this.dateFormat) {
        case 'DD/MM/YYYY':
          return `${day}/${month}/${year}`
        case 'MM/DD/YYYY':
          return `${month}/${day}/${year}`
        case 'YYYY-MM-DD':
          return `${year}-${month}-${day}`
        default:
          return `${day}/${month}/${year}`
      }
    },

    formatCurrency(amount) {
      if (!amount) return '0.00'
      const symbols = {
        KES: 'KSh',
        USD: '$',
        EUR: '€',
        GBP: '£'
      }
      const symbol = symbols[this.currency] || 'KSh'
      return `${symbol} ${Number(amount).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    },

    showNotification(title, body, type = 'info') {
      // Browser notification
      if (this.notifications.browser && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        })
      }

      // Play sound if enabled
      if (this.notifications.sound) {
        const audio = new Audio('/notification-sound.mp3')
        audio.play().catch(() => {
          // Ignore audio play errors
        })
      }
    }
  }
})
