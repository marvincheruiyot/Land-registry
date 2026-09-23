<template>
  <div class="main-layout-container">
    <Navbar />

    <main class="flex-grow-1 p-3 p-md-4 p-xl-5">
      <!-- Header -->
      <div class="mb-4">
        <span class="badge badge-pill-custom badge-soft-blue mb-2">
          <i class="bi bi-gear-fill"></i> System Configuration
        </span>
        <h1 class="fw-bold text-dark fs-2 mb-1">System Settings</h1>
        <p class="text-muted mb-0">Customize your Land Registry system preferences</p>
      </div>

      <div class="row g-4">
        <!-- Appearance Settings -->
        <div class="col-12 col-lg-6">
          <div class="dash-card h-100">
            <div class="d-flex align-items-center gap-3 mb-4">
              <div class="avatar-circle bg-primary text-white">
                <i class="bi bi-palette-fill"></i>
              </div>
              <div>
                <h5 class="fw-bold mb-0">Appearance</h5>
                <small class="text-muted">Customize the look and feel</small>
              </div>
            </div>

            <!-- Theme Mode -->
            <div class="mb-4">
              <label class="form-label fw-semibold text-dark">Theme Mode</label>
              <div class="btn-group w-100" role="group">
                <input type="radio" class="btn-check" name="theme" id="light" value="light" v-model="settings.theme" @change="saveSettings">
                <label class="btn btn-outline-secondary" for="light">
                  <i class="bi bi-sun-fill me-2"></i>Light
                </label>

                <input type="radio" class="btn-check" name="theme" id="dark" value="dark" v-model="settings.theme" @change="saveSettings">
                <label class="btn btn-outline-secondary" for="dark">
                  <i class="bi bi-moon-stars-fill me-2"></i>Dark
                </label>

                <input type="radio" class="btn-check" name="theme" id="auto" value="auto" v-model="settings.theme" @change="saveSettings">
                <label class="btn btn-outline-secondary" for="auto">
                  <i class="bi bi-circle-half me-2"></i>Auto
                </label>
              </div>
              <small class="text-muted d-block mt-2">Choose your preferred color scheme</small>
            </div>

            <!-- Font Size -->
            <div class="mb-4">
              <label class="form-label fw-semibold text-dark">Font Size</label>
              <div class="d-flex align-items-center gap-3">
                <input type="range" class="form-range flex-grow-1" min="12" max="20" step="1" v-model="settings.fontSize" @change="saveSettings">
                <span class="badge bg-light text-dark px-3 py-2" style="min-width: 60px;">{{ settings.fontSize }}px</span>
              </div>
              <small class="text-muted d-block mt-2">Adjust text size for better readability</small>
            </div>

            <!-- Sidebar Position -->
            <div class="mb-4">
              <label class="form-label fw-semibold text-dark">Sidebar Position</label>
              <select class="form-select" v-model="settings.sidebarPosition" @change="saveSettings">
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
              <small class="text-muted d-block mt-2">Choose sidebar placement</small>
            </div>

            <!-- Compact Mode -->
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="compactMode" v-model="settings.compactMode" @change="saveSettings">
              <label class="form-check-label fw-semibold" for="compactMode">
                Compact Mode
              </label>
              <small class="text-muted d-block">Reduce spacing for more content</small>
            </div>
          </div>
        </div>

        <!-- Display Settings -->
        <div class="col-12 col-lg-6">
          <div class="dash-card h-100">
            <div class="d-flex align-items-center gap-3 mb-4">
              <div class="avatar-circle bg-warning text-dark">
                <i class="bi bi-display-fill"></i>
              </div>
              <div>
                <h5 class="fw-bold mb-0">Display</h5>
                <small class="text-muted">Control what you see</small>
              </div>
            </div>

            <!-- Show Animations -->
            <div class="form-check form-switch mb-3">
              <input class="form-check-input" type="checkbox" id="animations" v-model="settings.animations" @change="saveSettings">
              <label class="form-check-label fw-semibold" for="animations">
                Enable Animations
              </label>
              <small class="text-muted d-block">Smooth transitions and effects</small>
            </div>

            <!-- Show Tooltips -->
            <div class="form-check form-switch mb-3">
              <input class="form-check-input" type="checkbox" id="tooltips" v-model="settings.tooltips" @change="saveSettings">
              <label class="form-check-label fw-semibold" for="tooltips">
                Show Tooltips
              </label>
              <small class="text-muted d-block">Helpful hints on hover</small>
            </div>

            <!-- Table Density -->
            <div class="mb-4">
              <label class="form-label fw-semibold text-dark">Table Density</label>
              <select class="form-select" v-model="settings.tableDensity" @change="saveSettings">
                <option value="comfortable">Comfortable</option>
                <option value="standard">Standard</option>
                <option value="compact">Compact</option>
              </select>
              <small class="text-muted d-block mt-2">Row spacing in tables</small>
            </div>

            <!-- Items Per Page -->
            <div class="mb-4">
              <label class="form-label fw-semibold text-dark">Items Per Page</label>
              <select class="form-select" v-model="settings.itemsPerPage" @change="saveSettings">
                <option :value="10">10</option>
                <option :value="25">25</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
              </select>
              <small class="text-muted d-block mt-2">Default pagination size</small>
            </div>
          </div>
        </div>

        <!-- Notification Settings -->
        <div class="col-12 col-lg-6">
          <div class="dash-card h-100">
            <div class="d-flex align-items-center gap-3 mb-4">
              <div class="avatar-circle bg-success text-white">
                <i class="bi bi-bell-fill"></i>
              </div>
              <div>
                <h5 class="fw-bold mb-0">Notifications</h5>
                <small class="text-muted">Manage alerts and updates</small>
              </div>
            </div>

            <!-- Email Notifications -->
            <div class="form-check form-switch mb-3">
              <input class="form-check-input" type="checkbox" id="emailNotif" v-model="settings.notifications.email" @change="saveSettings">
              <label class="form-check-label fw-semibold" for="emailNotif">
                Email Notifications
              </label>
              <small class="text-muted d-block">Receive updates via email</small>
            </div>

            <!-- Browser Notifications -->
            <div class="form-check form-switch mb-3">
              <input class="form-check-input" type="checkbox" id="browserNotif" v-model="settings.notifications.browser" @change="saveSettings">
              <label class="form-check-label fw-semibold" for="browserNotif">
                Browser Notifications
              </label>
              <small class="text-muted d-block">Desktop push notifications</small>
            </div>

            <!-- Transfer Alerts -->
            <div class="form-check form-switch mb-3">
              <input class="form-check-input" type="checkbox" id="transferAlerts" v-model="settings.notifications.transfers" @change="saveSettings">
              <label class="form-check-label fw-semibold" for="transferAlerts">
                Transfer Alerts
              </label>
              <small class="text-muted d-block">Notify on transfer updates</small>
            </div>

            <!-- Document Alerts -->
            <div class="form-check form-switch mb-3">
              <input class="form-check-input" type="checkbox" id="docAlerts" v-model="settings.notifications.documents" @change="saveSettings">
              <label class="form-check-label fw-semibold" for="docAlerts">
                Document Alerts
              </label>
              <small class="text-muted d-block">Notify on document changes</small>
            </div>

            <!-- Sound -->
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="sound" v-model="settings.notifications.sound" @change="saveSettings">
              <label class="form-check-label fw-semibold" for="sound">
                Notification Sound
              </label>
              <small class="text-muted d-block">Play sound for alerts</small>
            </div>
          </div>
        </div>

        <!-- Language & Regional Settings -->
        <div class="col-12 col-lg-6">
          <div class="dash-card h-100">
            <div class="d-flex align-items-center gap-3 mb-4">
              <div class="avatar-circle bg-dark text-white">
                <i class="bi bi-globe-americas"></i>
              </div>
              <div>
                <h5 class="fw-bold mb-0">Language & Region</h5>
                <small class="text-muted">Localization preferences</small>
              </div>
            </div>

            <!-- Language -->
            <div class="mb-4">
              <label class="form-label fw-semibold text-dark">Language</label>
              <select class="form-select" v-model="settings.language" @change="saveSettings">
                <option value="en">English</option>
                <option value="sw">Kiswahili</option>
              </select>
              <small class="text-muted d-block mt-2">System display language</small>
            </div>

            <!-- Timezone -->
            <div class="mb-4">
              <label class="form-label fw-semibold text-dark">Timezone</label>
              <select class="form-select" v-model="settings.timezone" @change="saveSettings">
                <option value="Africa/Nairobi">East Africa Time (EAT)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="Europe/London">GMT</option>
              </select>
              <small class="text-muted d-block mt-2">Your local timezone</small>
            </div>

            <!-- Date Format -->
            <div class="mb-4">
              <label class="form-label fw-semibold text-dark">Date Format</label>
              <select class="form-select" v-model="settings.dateFormat" @change="saveSettings">
                <option value="DD/MM/YYYY">DD/MM/YYYY (21/09/2026)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (09/21/2026)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (2026-09-21)</option>
              </select>
              <small class="text-muted d-block mt-2">Date display format</small>
            </div>

            <!-- Currency -->
            <div class="mb-4">
              <label class="form-label fw-semibold text-dark">Currency</label>
              <select class="form-select" v-model="settings.currency" @change="saveSettings">
                <option value="KES">Kenyan Shilling (KES)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">British Pound (GBP)</option>
              </select>
              <small class="text-muted d-block mt-2">Monetary values display</small>
            </div>
          </div>
        </div>

        <!-- Privacy & Security -->
        <div class="col-12">
          <div class="dash-card">
            <div class="d-flex align-items-center gap-3 mb-4">
              <div class="avatar-circle bg-danger text-white">
                <i class="bi bi-shield-lock-fill"></i>
              </div>
              <div>
                <h5 class="fw-bold mb-0">Privacy & Security</h5>
                <small class="text-muted">Control your data and security</small>
              </div>
            </div>

            <div class="row g-4">
              <div class="col-12 col-md-6">
                <!-- Session Timeout -->
                <div class="mb-4">
                  <label class="form-label fw-semibold text-dark">Session Timeout</label>
                  <select class="form-select" v-model="settings.sessionTimeout" @change="saveSettings">
                    <option :value="15">15 minutes</option>
                    <option :value="30">30 minutes</option>
                    <option :value="60">1 hour</option>
                    <option :value="120">2 hours</option>
                  </select>
                  <small class="text-muted d-block mt-2">Auto-logout after inactivity</small>
                </div>

                <!-- Two-Factor Authentication -->
                <div class="form-check form-switch mb-3">
                  <input class="form-check-input" type="checkbox" id="twoFactor" v-model="settings.twoFactor" @change="saveSettings">
                  <label class="form-check-label fw-semibold" for="twoFactor">
                    Two-Factor Authentication
                  </label>
                  <small class="text-muted d-block">Extra security layer</small>
                </div>
              </div>

              <div class="col-12 col-md-6">
                <!-- Activity Logging -->
                <div class="form-check form-switch mb-3">
                  <input class="form-check-input" type="checkbox" id="activityLog" v-model="settings.activityLogging" @change="saveSettings">
                  <label class="form-check-label fw-semibold" for="activityLog">
                    Activity Logging
                  </label>
                  <small class="text-muted d-block">Track all user actions</small>
                </div>

                <!-- Data Export -->
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" id="dataExport" v-model="settings.dataExport" @change="saveSettings">
                  <label class="form-check-label fw-semibold" for="dataExport">
                    Allow Data Export
                  </label>
                  <small class="text-muted d-block">Enable CSV/PDF downloads</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="col-12">
          <div class="dash-card">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <small class="text-muted">Last saved: {{ lastSaved }}</small>
              </div>
              <div class="d-flex gap-2">
                <button @click="resetToDefaults" class="btn btn-light">
                  <i class="bi bi-arrow-counterclockwise me-2"></i>Reset to Defaults
                </button>
                <button @click="saveSettings" class="btn btn-dark">
                  <i class="bi bi-check-circle me-2"></i>{{ saveSuccess ? 'Saved!' : 'Save Changes' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { computed } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { useSettingsStore } from '@/stores/settings'

export default {
  name: 'SystemSettings',
  components: { Navbar },
  setup() {
    const settingsStore = useSettingsStore()

    const settings = computed({
      get: () => settingsStore.$state,
      set: (val) => settingsStore.updateSettings(val)
    })

    const lastSaved = computed(() => {
      const savedTime = localStorage.getItem('settingsSavedAt')
      if (savedTime) {
        return new Date(savedTime).toLocaleString('en-KE', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
      return 'Never'
    })

    const saveSuccess = computed(() => {
      // This will be true briefly after saving
      return false
    })

    const saveSettings = () => {
      settingsStore.updateSettings(settings.value)
      
      // Show success message
      const event = new CustomEvent('show-toast', {
        detail: {
          message: 'Settings saved successfully!',
          type: 'success'
        }
      })
      window.dispatchEvent(event)
    }

    const resetToDefaults = () => {
      if (confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
        settingsStore.resetToDefaults()
        
        const event = new CustomEvent('show-toast', {
          detail: {
            message: 'Settings reset to defaults',
            type: 'info'
          }
        })
        window.dispatchEvent(event)
      }
    }

    return {
      settings,
      lastSaved,
      saveSuccess,
      saveSettings,
      resetToDefaults
    }
  }
}
</script>

<style scoped>
.btn-check:checked + .btn-outline-secondary {
  background-color: #212529;
  color: white;
}
</style>
