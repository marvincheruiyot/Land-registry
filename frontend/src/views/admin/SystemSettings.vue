<template>
  <div class="main-layout-container">
    <Navbar />

    <main class="flex-grow-1 p-3 p-md-4 p-xl-5">
      <!-- Header -->
      <div class="mb-4">
        <span class="badge badge-pill-custom mb-2" :class="isAdministrator ? 'badge-soft-blue' : 'badge-soft-green'">
          <i class="bi bi-gear-fill"></i> {{ isAdministrator ? 'System Configuration' : 'Officer Settings' }}
        </span>
        <h1 class="fw-bold text-dark fs-2 mb-1">{{ isAdministrator ? 'System Settings' : 'My Settings' }}</h1>
        <p class="text-muted mb-0">{{ isAdministrator ? 'Customize your Land Registry system preferences' : 'Personalize your workspace and preferences' }}</p>
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
        <div class="col-12" v-if="isAdministrator">
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

        <!-- Officer-Specific Settings -->
        <div class="col-12" v-if="isLandOfficer">
          <div class="dash-card border-success">
            <div class="d-flex align-items-center gap-3 mb-4">
              <div class="avatar-circle bg-success text-white">
                <i class="bi bi-person-workspace"></i>
              </div>
              <div>
                <h5 class="fw-bold mb-0">🏢 Officer Workspace</h5>
                <small class="text-muted">Land Officer specific preferences</small>
              </div>
            </div>

            <div class="row g-4">
              <div class="col-md-6">
                <!-- Default County -->
                <div class="mb-4">
                  <label class="form-label fw-semibold text-dark">Default County</label>
                  <select v-model="settings.defaultCounty" class="form-select" @change="saveSettings">
                    <option value="">Select default county</option>
                    <option value="Nairobi">Nairobi</option>
                    <option value="Mombasa">Mombasa</option>
                    <option value="Kisumu">Kisumu</option>
                    <option value="Nakuru">Nakuru</option>
                    <option value="Kiambu">Kiambu</option>
                    <option value="Kajiado">Kajiado</option>
                    <option value="Machakos">Machakos</option>
                    <option value="Nyeri">Nyeri</option>
                  </select>
                  <small class="text-muted d-block mt-2">Pre-fill county in registration forms</small>
                </div>

                <!-- Auto-save Drafts -->
                <div class="form-check form-switch mb-3">
                  <input class="form-check-input" type="checkbox" id="autoSave" v-model="settings.autoSaveDrafts" @change="saveSettings">
                  <label class="form-check-label fw-semibold" for="autoSave">
                    Auto-save Form Drafts
                  </label>
                  <small class="text-muted d-block">Automatically save incomplete registrations</small>
                </div>

                <!-- Quick Actions Toolbar -->
                <div class="form-check form-switch mb-3">
                  <input class="form-check-input" type="checkbox" id="quickActions" v-model="settings.showQuickActions" @change="saveSettings">
                  <label class="form-check-label fw-semibold" for="quickActions">
                    Show Quick Actions Toolbar
                  </label>
                  <small class="text-muted d-block">Display floating action buttons</small>
                </div>
              </div>

              <div class="col-md-6">
                <!-- Dashboard Layout -->
                <div class="mb-4">
                  <label class="form-label fw-semibold text-dark">Dashboard Layout</label>
                  <select v-model="settings.dashboardLayout" class="form-select" @change="saveSettings">
                    <option value="compact">Compact</option>
                    <option value="comfortable">Comfortable</option>
                    <option value="spacious">Spacious</option>
                  </select>
                  <small class="text-muted d-block mt-2">Card spacing and density</small>
                </div>

                <!-- Email Notifications for Transfers -->
                <div class="form-check form-switch mb-3">
                  <input class="form-check-input" type="checkbox" id="emailNotifTransfers" v-model="settings.emailNotifyTransfers" @change="saveSettings">
                  <label class="form-check-label fw-semibold" for="emailNotifTransfers">
                    Email Alerts for New Transfers
                  </label>
                  <small class="text-muted d-block">Get notified of pending approvals</small>
                </div>

                <!-- Show Statistics Widget -->
                <div class="form-check form-switch mb-3">
                  <input class="form-check-input" type="checkbox" id="statsWidget" v-model="settings.showStatsWidget" @change="saveSettings">
                  <label class="form-check-label fw-semibold" for="statsWidget">
                    Display Performance Metrics
                  </label>
                  <small class="text-muted d-block">Show your productivity stats</small>
                </div>
              </div>

              <!-- Work Hours Preference -->
              <div class="col-12">
                <div class="card bg-light border-0">
                  <div class="card-body">
                    <h6 class="fw-bold mb-3">
                      <i class="bi bi-clock me-2"></i>Working Hours Preference
                    </h6>
                    <div class="row g-3">
                      <div class="col-md-4">
                        <label class="form-label small fw-semibold">Start Time</label>
                        <input type="time" v-model="settings.workStartTime" class="form-control" @change="saveSettings">
                      </div>
                      <div class="col-md-4">
                        <label class="form-label small fw-semibold">End Time</label>
                        <input type="time" v-model="settings.workEndTime" class="form-control" @change="saveSettings">
                      </div>
                      <div class="col-md-4">
                        <label class="form-label small fw-semibold">Daily Target</label>
                        <input type="number" v-model="settings.dailyTarget" class="form-control" placeholder="e.g., 10" @change="saveSettings">
                      </div>
                    </div>
                    <small class="text-muted d-block mt-2">
                      <i class="bi bi-info-circle me-1"></i>Used for workload planning and reminders
                    </small>
                  </div>
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

        <!-- Admin Debug Tools -->
        <div class="col-12" v-if="isAdministrator">
          <div class="dash-card border-warning">
            <div class="d-flex align-items-center gap-3 mb-4">
              <div class="avatar-circle bg-warning text-dark">
                <i class="bi bi-wrench-adjustable-circle-fill"></i>
              </div>
              <div>
                <h5 class="fw-bold mb-0">🔧 Admin Debug Tools</h5>
                <small class="text-muted">Fix ownership and data issues</small>
              </div>
            </div>

            <div class="alert alert-warning">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              <strong>Administrator Only:</strong> These tools fix database issues. Use with caution.
            </div>

            <!-- Check Parcel Ownership -->
            <div class="card bg-light border-0 mb-3">
              <div class="card-body">
                <h6 class="fw-bold mb-3">
                  <i class="bi bi-search me-2"></i>Check Parcel Ownership
                </h6>
                <p class="small text-muted mb-3">
                  Debug tool: Check if a user has parcels registered under their National ID
                </p>
                <div class="row g-2">
                  <div class="col-md-8">
                    <input 
                      v-model="debugNationalId" 
                      type="text" 
                      class="form-control" 
                      placeholder="Enter National ID (e.g., 42207690)"
                    />
                  </div>
                  <div class="col-md-4">
                    <button @click="checkOwnership" :disabled="debugLoading" class="btn btn-warning w-100">
                      <span v-if="debugLoading" class="spinner-border spinner-border-sm me-2"></span>
                      <i v-else class="bi bi-search me-2"></i>
                      Check
                    </button>
                  </div>
                </div>

                <!-- Debug Results -->
                <div v-if="debugResults" class="mt-3">
                  <div class="alert" :class="debugResults.parcelsFound > 0 ? 'alert-success' : 'alert-info'">
                    <strong>Results for National ID: {{ debugResults.nationalId }}</strong>
                    <hr class="my-2">
                    <p class="mb-2"><strong>Users Found:</strong> {{ debugResults.usersFound }}</p>
                    <div v-if="debugResults.usersFound > 0" class="mb-2">
                      <strong>User Details:</strong>
                      <ul class="mb-0 mt-1">
                        <li v-for="user in debugResults.users" :key="user.id" class="small">
                          {{ user.fullName }} ({{ user.email }}) - 
                          <span class="badge" :class="user.isActive ? 'bg-success' : 'bg-secondary'">
                            {{ user.isActive ? 'Active' : 'Inactive' }}
                          </span>
                          <span v-if="user.isPlaceholder" class="badge bg-warning text-dark">Placeholder</span>
                        </li>
                      </ul>
                    </div>
                    <p class="mb-2"><strong>Parcels Found:</strong> {{ debugResults.parcelsFound }}</p>
                    <div v-if="debugResults.parcelsFound > 0">
                      <strong>Parcel Details:</strong>
                      <ul class="mb-0 mt-1">
                        <li v-for="parcel in debugResults.parcels" :key="parcel.id" class="small">
                          <strong>{{ parcel.parcelNumber }}</strong> - {{ parcel.sizeInAcres }} acres in {{ parcel.county }}
                          <br>
                          <span class="text-muted">Owner: {{ parcel.owner.name }} ({{ parcel.owner.email }})</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Fix Ownership -->
            <div class="card bg-light border-0">
              <div class="card-body">
                <h6 class="fw-bold mb-3">
                  <i class="bi bi-tools me-2"></i>Fix Parcel Ownership
                </h6>
                <p class="small text-muted mb-3">
                  If a user can't see their parcels, this tool will fix the ownership links
                </p>
                <div class="row g-2">
                  <div class="col-md-8">
                    <input 
                      v-model="fixNationalId" 
                      type="text" 
                      class="form-control" 
                      placeholder="Enter National ID to fix"
                    />
                  </div>
                  <div class="col-md-4">
                    <button @click="fixOwnership" :disabled="fixLoading" class="btn btn-danger w-100">
                      <span v-if="fixLoading" class="spinner-border spinner-border-sm me-2"></span>
                      <i v-else class="bi bi-wrench me-2"></i>
                      Fix Now
                    </button>
                  </div>
                </div>

                <!-- Fix Results -->
                <div v-if="fixResults" class="mt-3">
                  <div class="alert alert-success">
                    <strong>✅ Fixed Successfully!</strong>
                    <hr class="my-2">
                    <p class="mb-2">{{ fixResults.message }}</p>
                    <p class="mb-0 small">
                      <strong>Correct User:</strong> {{ fixResults.data.correctUser.name }}<br>
                      <strong>Parcels Found:</strong> {{ fixResults.data.parcelsFound }}<br>
                      <strong>Parcels Updated:</strong> {{ fixResults.data.parcelsUpdated }}<br>
                      <strong>Duplicate Users Removed:</strong> {{ fixResults.data.duplicateUsersRemoved }}
                    </p>
                  </div>
                </div>

                <div v-if="fixError" class="mt-3">
                  <div class="alert alert-danger">
                    <strong>❌ Error:</strong> {{ fixError }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { useSettingsStore } from '@/stores/settings'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

export default {
  name: 'SystemSettings',
  components: { Navbar },
  setup() {
    const settingsStore = useSettingsStore()
    const authStore = useAuthStore()

    // Check user role
    const isAdministrator = computed(() => authStore.isAdministrator)
    const isLandOfficer = computed(() => authStore.isLandOfficer)

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

    // Debug Tools
    const debugNationalId = ref('')
    const debugLoading = ref(false)
    const debugResults = ref(null)

    const fixNationalId = ref('')
    const fixLoading = ref(false)
    const fixResults = ref(null)
    const fixError = ref(null)

    const checkOwnership = async () => {
      if (!debugNationalId.value) {
        alert('Please enter a National ID')
        return
      }

      debugLoading.value = true
      debugResults.value = null

      try {
        const response = await api.get(`/admin/debug-parcels?nationalId=${debugNationalId.value}`)
        debugResults.value = response.data.data
      } catch (err) {
        console.error('Debug error:', err)
        alert(err.response?.data?.message || 'Error checking ownership')
      } finally {
        debugLoading.value = false
      }
    }

    const fixOwnership = async () => {
      if (!fixNationalId.value) {
        alert('Please enter a National ID')
        return
      }

      if (!confirm(`Are you sure you want to fix ownership for National ID: ${fixNationalId.value}?\n\nThis will:\n- Consolidate all users with this National ID\n- Move all parcels to the active user\n- Remove placeholder/duplicate users`)) {
        return
      }

      fixLoading.value = true
      fixResults.value = null
      fixError.value = null

      try {
        const response = await api.post('/admin/fix-ownership', {
          nationalId: fixNationalId.value
        })
        fixResults.value = response.data
        
        // Clear the form
        fixNationalId.value = ''
        
        // Show success message
        alert('✅ Ownership fixed successfully! The user should now be able to see their parcels.')
      } catch (err) {
        console.error('Fix error:', err)
        fixError.value = err.response?.data?.message || 'Error fixing ownership'
      } finally {
        fixLoading.value = false
      }
    }

    return {
      settings,
      lastSaved,
      saveSuccess,
      saveSettings,
      resetToDefaults,
      isAdministrator,
      isLandOfficer,
      // Debug tools
      debugNationalId,
      debugLoading,
      debugResults,
      checkOwnership,
      fixNationalId,
      fixLoading,
      fixResults,
      fixError,
      fixOwnership
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
