<template>
  <div class="main-layout-container">
    <Navbar />

    <main class="flex-grow-1 p-3 p-md-4 p-xl-5">
      <!-- Header -->
      <div class="mb-4">
        <span class="badge badge-pill-custom badge-soft-blue mb-2">
          <i class="bi bi-sliders"></i> My Preferences
        </span>
        <h1 class="fw-bold text-dark fs-2 mb-1">Settings</h1>
        <p class="text-muted mb-0">Customize your Land Registry experience</p>
      </div>

      <!-- Success Message -->
      <div v-if="showSuccess" class="alert alert-success alert-dismissible fade show rounded-4 mb-4" role="alert">
        <i class="bi bi-check-circle-fill me-2"></i>
        <strong>Saved!</strong> Your settings have been updated successfully.
        <button type="button" class="btn-close" @click="showSuccess = false"></button>
      </div>

      <div class="row g-4">
        <!-- Language & Region -->
        <div class="col-12 col-lg-6">
          <div class="dash-card h-100">
            <div class="d-flex align-items-center gap-3 mb-4">
              <div class="avatar-circle bg-primary text-white" style="width: 48px; height: 48px;">
                <i class="bi bi-translate fs-5"></i>
              </div>
              <div>
                <h5 class="fw-bold mb-0 text-dark">Language & Region</h5>
                <small class="text-muted">Choose your preferred language</small>
              </div>
            </div>

            <!-- Language Selection -->
            <div class="mb-4">
              <label class="form-label fw-semibold text-dark">Display Language</label>
              <select class="form-select rounded-pill bg-light border-0 py-2" v-model="settings.language" @change="changeLanguage">
                <option value="en">🇬🇧 English</option>
                <option value="sw">🇰🇪 Kiswahili</option>
                <option value="fr">🇫🇷 French</option>
                <option value="ar">🇸🇦 Arabic</option>
              </select>
              <small class="text-muted d-block mt-2">
                <i class="bi bi-info-circle me-1"></i>
                Interface language for menus and labels
              </small>
            </div>

            <!-- Date Format -->
            <div class="mb-4">
              <label class="form-label fw-semibold text-dark">Date Format</label>
              <select class="form-select rounded-pill bg-light border-0 py-2" v-model="settings.dateFormat" @change="saveSettings">
                <option value="DD/MM/YYYY">DD/MM/YYYY (27/10/2026)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (10/27/2026)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (2026-10-27)</option>
              </select>
              <small class="text-muted d-block mt-2">How dates are displayed</small>
            </div>

            <!-- Currency Format -->
            <div class="mb-4">
              <label class="form-label fw-semibold text-dark">Currency Display</label>
              <select class="form-select rounded-pill bg-light border-0 py-2" v-model="settings.currency" @change="saveSettings">
                <option value="KES">KES (Kenyan Shilling)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="EUR">EUR (Euro)</option>
                <option value="GBP">GBP (British Pound)</option>
              </select>
              <small class="text-muted d-block mt-2">Currency for amounts and prices</small>
            </div>

            <!-- Timezone -->
            <div>
              <label class="form-label fw-semibold text-dark">Time Zone</label>
              <select class="form-select rounded-pill bg-light border-0 py-2" v-model="settings.timezone" @change="saveSettings">
                <option value="Africa/Nairobi">East Africa Time (EAT)</option>
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="Africa/Lagos">West Africa Time (WAT)</option>
                <option value="Africa/Cairo">Egypt Time (EET)</option>
              </select>
              <small class="text-muted d-block mt-2">Your local time zone</small>
            </div>
          </div>
        </div>

        <!-- Display Preferences -->
        <div class="col-12 col-lg-6">
          <div class="dash-card h-100">
            <div class="d-flex align-items-center gap-3 mb-4">
              <div class="avatar-circle bg-success text-white" style="width: 48px; height: 48px;">
                <i class="bi bi-eye-fill fs-5"></i>
              </div>
              <div>
                <h5 class="fw-bold mb-0 text-dark">Display Preferences</h5>
                <small class="text-muted">Customize your view</small>
              </div>
            </div>

            <!-- Font Size -->
            <div class="mb-4">
              <label class="form-label fw-semibold text-dark">Text Size</label>
              <div class="d-flex align-items-center gap-3">
                <button class="btn btn-light rounded-circle" @click="decreaseFontSize" :disabled="settings.fontSize <= 14">
                  <i class="bi bi-dash-lg"></i>
                </button>
                <div class="flex-grow-1">
                  <input 
                    type="range" 
                    class="form-range" 
                    min="14" 
                    max="20" 
                    step="1" 
                    v-model="settings.fontSize" 
                    @change="saveSettings"
                  >
                </div>
                <button class="btn btn-light rounded-circle" @click="increaseFontSize" :disabled="settings.fontSize >= 20">
                  <i class="bi bi-plus-lg"></i>
                </button>
                <span class="badge bg-primary px-3 py-2" style="min-width: 55px;">{{ settings.fontSize }}px</span>
              </div>
              <div class="mt-3 p-3 bg-light rounded-3">
                <p class="mb-0" :style="{ fontSize: settings.fontSize + 'px' }">
                  Sample text preview at {{ settings.fontSize }}px
                </p>
              </div>
            </div>

            <!-- Items Per Page -->
            <div class="mb-4">
              <label class="form-label fw-semibold text-dark">Items Per Page</label>
              <select class="form-select rounded-pill bg-light border-0 py-2" v-model.number="settings.itemsPerPage" @change="saveSettings">
                <option :value="10">10 items</option>
                <option :value="20">20 items</option>
                <option :value="50">50 items</option>
                <option :value="100">100 items</option>
              </select>
              <small class="text-muted d-block mt-2">Number of items shown in lists</small>
            </div>

            <!-- Visual Options -->
            <div class="mb-3">
              <label class="form-label fw-semibold text-dark">Visual Options</label>
              
              <div class="form-check form-switch mb-2">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="animations" 
                  v-model="settings.animations" 
                  @change="saveSettings"
                >
                <label class="form-check-label" for="animations">
                  <span class="fw-semibold">Enable Animations</span>
                  <small class="text-muted d-block">Smooth transitions and effects</small>
                </label>
              </div>

              <div class="form-check form-switch mb-2">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="highContrast" 
                  v-model="settings.highContrast" 
                  @change="saveSettings"
                >
                <label class="form-check-label" for="highContrast">
                  <span class="fw-semibold">High Contrast Mode</span>
                  <small class="text-muted d-block">Better visibility for text</small>
                </label>
              </div>

              <div class="form-check form-switch">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="compactView" 
                  v-model="settings.compactView" 
                  @change="saveSettings"
                >
                <label class="form-check-label" for="compactView">
                  <span class="fw-semibold">Compact View</span>
                  <small class="text-muted d-block">Show more content on screen</small>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Notifications Settings -->
        <div class="col-12 col-lg-6">
          <div class="dash-card h-100">
            <div class="d-flex align-items-center gap-3 mb-4">
              <div class="avatar-circle bg-warning text-dark" style="width: 48px; height: 48px;">
                <i class="bi bi-bell-fill fs-5"></i>
              </div>
              <div>
                <h5 class="fw-bold mb-0 text-dark">Notifications</h5>
                <small class="text-muted">Manage your alerts</small>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold text-dark">Email Notifications</label>
              
              <div class="form-check form-switch mb-2">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="emailTransfers" 
                  v-model="settings.notifications.transfers" 
                  @change="saveSettings"
                >
                <label class="form-check-label" for="emailTransfers">
                  <span class="fw-semibold">Transfer Updates</span>
                  <small class="text-muted d-block">When transfer status changes</small>
                </label>
              </div>

              <div class="form-check form-switch mb-2">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="emailDocuments" 
                  v-model="settings.notifications.documents" 
                  @change="saveSettings"
                >
                <label class="form-check-label" for="emailDocuments">
                  <span class="fw-semibold">Document Updates</span>
                  <small class="text-muted d-block">When documents are verified or rejected</small>
                </label>
              </div>

              <div class="form-check form-switch mb-2">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="emailParcels" 
                  v-model="settings.notifications.parcels" 
                  @change="saveSettings"
                >
                <label class="form-check-label" for="emailParcels">
                  <span class="fw-semibold">Parcel Updates</span>
                  <small class="text-muted d-block">Changes to your land parcels</small>
                </label>
              </div>

              <div class="form-check form-switch">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="emailWeekly" 
                  v-model="settings.notifications.weeklyDigest" 
                  @change="saveSettings"
                >
                <label class="form-check-label" for="emailWeekly">
                  <span class="fw-semibold">Weekly Digest</span>
                  <small class="text-muted d-block">Summary of all activities</small>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Privacy & Security -->
        <div class="col-12 col-lg-6">
          <div class="dash-card h-100">
            <div class="d-flex align-items-center gap-3 mb-4">
              <div class="avatar-circle bg-danger text-white" style="width: 48px; height: 48px;">
                <i class="bi bi-shield-lock-fill fs-5"></i>
              </div>
              <div>
                <h5 class="fw-bold mb-0 text-dark">Privacy & Security</h5>
                <small class="text-muted">Protect your account</small>
              </div>
            </div>

            <div class="mb-3">
              <div class="form-check form-switch mb-3">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="twoFactor" 
                  v-model="settings.security.twoFactorAuth" 
                  @change="saveSettings"
                >
                <label class="form-check-label" for="twoFactor">
                  <span class="fw-semibold">Two-Factor Authentication</span>
                  <small class="text-muted d-block">Extra security for your account</small>
                </label>
              </div>

              <div class="form-check form-switch mb-3">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="loginAlerts" 
                  v-model="settings.security.loginAlerts" 
                  @change="saveSettings"
                >
                <label class="form-check-label" for="loginAlerts">
                  <span class="fw-semibold">Login Alerts</span>
                  <small class="text-muted d-block">Notify me of new sign-ins</small>
                </label>
              </div>

              <div class="form-check form-switch">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="shareData" 
                  v-model="settings.privacy.shareData" 
                  @change="saveSettings"
                >
                <label class="form-check-label" for="shareData">
                  <span class="fw-semibold">Share Analytics Data</span>
                  <small class="text-muted d-block">Help improve the system</small>
                </label>
              </div>
            </div>

            <div class="mt-4 pt-3 border-top">
              <router-link to="/profile" class="btn btn-pill btn-light-pill w-100 justify-content-center mb-2">
                <i class="bi bi-person-gear me-2"></i>
                Edit My Profile
              </router-link>
              <button class="btn btn-pill btn-outline-danger w-100 justify-content-center">
                <i class="bi bi-shield-x me-2"></i>
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="dash-card mt-4">
        <div class="d-flex flex-column flex-md-row gap-3 justify-content-between align-items-md-center">
          <div>
            <h6 class="fw-bold mb-1 text-dark">Reset to Default</h6>
            <small class="text-muted">Restore all settings to their original values</small>
          </div>
          <button class="btn btn-pill btn-outline-secondary" @click="resetToDefault">
            <i class="bi bi-arrow-counterclockwise me-2"></i>
            Reset All Settings
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Navbar from '@/components/Navbar.vue';

export default {
  name: 'UserSettings',
  components: { Navbar },
  setup() {
    const showSuccess = ref(false);
    
    const settings = ref({
      language: 'en',
      dateFormat: 'DD/MM/YYYY',
      currency: 'KES',
      timezone: 'Africa/Nairobi',
      fontSize: 16,
      itemsPerPage: 20,
      animations: true,
      highContrast: false,
      compactView: false,
      notifications: {
        transfers: true,
        documents: true,
        parcels: true,
        weeklyDigest: false
      },
      security: {
        twoFactorAuth: false,
        loginAlerts: true
      },
      privacy: {
        shareData: true
      }
    });

    const loadSettings = () => {
      const saved = localStorage.getItem('userSettings');
      if (saved) {
        settings.value = { ...settings.value, ...JSON.parse(saved) };
      }
    };

    const saveSettings = () => {
      localStorage.setItem('userSettings', JSON.stringify(settings.value));
      showSuccess.value = true;
      setTimeout(() => {
        showSuccess.value = false;
      }, 3000);
      
      // Apply settings immediately
      applySettings();
    };

    const changeLanguage = () => {
      // Store language preference
      localStorage.setItem('selectedLanguage', settings.value.language);
      saveSettings();
      
      // Show language change message
      const languageNames = {
        'en': 'English',
        'sw': 'Kiswahili',
        'fr': 'French',
        'ar': 'Arabic'
      };
      
      alert(`Language changed to ${languageNames[settings.value.language]}. Some labels will update immediately, full translation coming soon!`);
    };

    const applySettings = () => {
      // Apply font size
      document.documentElement.style.fontSize = settings.value.fontSize + 'px';
      
      // Apply high contrast
      if (settings.value.highContrast) {
        document.body.classList.add('high-contrast');
      } else {
        document.body.classList.remove('high-contrast');
      }
      
      // Apply animations
      if (!settings.value.animations) {
        document.body.classList.add('no-animations');
      } else {
        document.body.classList.remove('no-animations');
      }
    };

    const increaseFontSize = () => {
      if (settings.value.fontSize < 20) {
        settings.value.fontSize++;
        saveSettings();
      }
    };

    const decreaseFontSize = () => {
      if (settings.value.fontSize > 14) {
        settings.value.fontSize--;
        saveSettings();
      }
    };

    const resetToDefault = () => {
      if (confirm('Are you sure you want to reset all settings to default? This cannot be undone.')) {
        settings.value = {
          language: 'en',
          dateFormat: 'DD/MM/YYYY',
          currency: 'KES',
          timezone: 'Africa/Nairobi',
          fontSize: 16,
          itemsPerPage: 20,
          animations: true,
          highContrast: false,
          compactView: false,
          notifications: {
            transfers: true,
            documents: true,
            parcels: true,
            weeklyDigest: false
          },
          security: {
            twoFactorAuth: false,
            loginAlerts: true
          },
          privacy: {
            shareData: true
          }
        };
        saveSettings();
        alert('Settings have been reset to default values.');
      }
    };

    onMounted(() => {
      loadSettings();
      applySettings();
    });

    return {
      settings,
      showSuccess,
      saveSettings,
      changeLanguage,
      increaseFontSize,
      decreaseFontSize,
      resetToDefault
    };
  }
};
</script>

<style scoped>
.form-check-input:checked {
  background-color: #212529;
  border-color: #212529;
}

.form-range::-webkit-slider-thumb {
  background: #212529;
}

.form-range::-moz-range-thumb {
  background: #212529;
}

/* High contrast mode styles */
:global(body.high-contrast) {
  filter: contrast(1.5);
}

/* No animations */
:global(body.no-animations) * {
  animation: none !important;
  transition: none !important;
}
</style>
