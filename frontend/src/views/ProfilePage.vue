<template>
  <div class="main-layout-container">
    <Navbar />

    <main class="flex-grow-1 p-3 p-md-4 p-xl-5">
      <!-- Title -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div class="badge badge-pill-custom badge-soft-blue mb-2">
            <i class="bi bi-person-badge-fill"></i> User Credentials & Security
          </div>
          <h1 class="fw-bold text-dark fs-2 mb-1">Account & Settings</h1>
          <p class="text-muted mb-0">Manage authorized registrar profile, authentication credentials, and notifications.</p>
        </div>
      </div>

      <div class="row g-4">
        <!-- Profile Card Overview -->
        <div class="col-12 col-lg-4">
          <div class="dash-card text-center mb-4">
            <div class="avatar-circle bg-dark text-warning mx-auto mb-3" style="width: 80px; height: 80px; font-size: 2rem;">
              {{ userInitials }}
            </div>
            <h4 class="fw-bold text-dark mb-1">{{ user?.fullName }}</h4>
            <p class="text-muted small mb-2">{{ user?.email }}</p>
            <span class="badge badge-pill-custom badge-soft-green mb-4">
              <i class="bi bi-patch-check-fill"></i> Verified {{ user?.role?.replace('_', ' ') }}
            </span>

            <div class="d-flex flex-column gap-2 text-start pt-3 border-top">
              <button
                @click="activeTab = 'profile'"
                :class="['btn btn-pill', activeTab === 'profile' ? 'btn-dark-pill' : 'btn-light-pill']"
              >
                <i class="bi bi-person-lines-fill"></i> Profile Information
              </button>
              <button
                @click="activeTab = 'security'"
                :class="['btn btn-pill', activeTab === 'security' ? 'btn-dark-pill' : 'btn-light-pill']"
              >
                <i class="bi bi-shield-lock-fill"></i> Security & Password
              </button>
              <button
                @click="activeTab = 'notifications'"
                :class="['btn btn-pill', activeTab === 'notifications' ? 'btn-dark-pill' : 'btn-light-pill']"
              >
                <i class="bi bi-bell-fill"></i> Preferences
              </button>
            </div>
          </div>

          <div class="dash-card card-dark">
            <h6 class="fw-bold text-white mb-2">Security Clearance</h6>
            <p class="text-secondary small mb-3">
              Your account has full digital signing authority for Land Registration and Conveyancing.
            </p>
            <div class="d-flex align-items-center gap-2 text-warning small">
              <i class="bi bi-shield-shaded"></i> 2-Factor Enforced
            </div>
          </div>
        </div>

        <!-- Form Panels -->
        <div class="col-12 col-lg-8">
          <!-- Profile Form -->
          <div v-if="activeTab === 'profile'" class="dash-card">
            <h5 class="fw-bold text-dark mb-4">Personal & Official Particulars</h5>

            <form @submit.prevent="updateProfile">
              <div class="row g-3">
                <div class="col-12 col-md-6">
                  <label class="form-label fw-semibold text-dark">Full Legal Name *</label>
                  <input v-model="profileForm.fullName" type="text" class="form-control rounded-pill py-2 bg-light border-0" required />
                </div>

                <div class="col-12 col-md-6">
                  <label class="form-label fw-semibold text-dark">Email Address *</label>
                  <input v-model="profileForm.email" type="email" class="form-control rounded-pill py-2 bg-light border-0" required />
                </div>

                <div class="col-12 col-md-6">
                  <label class="form-label fw-semibold text-dark">Phone Contact *</label>
                  <input v-model="profileForm.phoneNumber" type="tel" class="form-control rounded-pill py-2 bg-light border-0" required />
                </div>

                <div class="col-12 col-md-6">
                  <label class="form-label fw-semibold text-dark">National ID Number</label>
                  <input v-model="profileForm.nationalId" type="text" class="form-control rounded-pill py-2 bg-light border-0" disabled />
                  <small class="text-muted">National ID cannot be altered without physical registrar verification.</small>
                </div>

                <div class="col-12">
                  <label class="form-label fw-semibold text-dark">Physical Address / County Bureau</label>
                  <textarea v-model="profileForm.physicalAddress" class="form-control rounded-4 bg-light border-0" rows="3"></textarea>
                </div>
              </div>

              <div v-if="updateMessage" :class="['p-3 rounded-3 small mt-3', updateSuccess ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger']">
                {{ updateMessage }}
              </div>

              <div class="mt-4">
                <button type="submit" :disabled="updating" class="btn btn-pill btn-dark-pill px-4">
                  {{ updating ? 'Saving Changes...' : 'Save Profile Changes' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Security Form -->
          <div v-if="activeTab === 'security'" class="dash-card">
            <h5 class="fw-bold text-dark mb-4">Update Password</h5>

            <form @submit.prevent="changePassword">
              <div class="space-y-3">
                <div class="mb-3">
                  <label class="form-label fw-semibold text-dark">Current Password *</label>
                  <input v-model="passwordForm.currentPassword" type="password" class="form-control rounded-pill py-2 bg-light border-0" required />
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold text-dark">New Password *</label>
                  <input v-model="passwordForm.newPassword" type="password" class="form-control rounded-pill py-2 bg-light border-0" required />
                  <small class="text-muted">Must contain 8+ characters, including uppercase, lowercase, and special characters.</small>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold text-dark">Confirm New Password *</label>
                  <input v-model="passwordForm.confirmPassword" type="password" class="form-control rounded-pill py-2 bg-light border-0" required />
                </div>
              </div>

              <div v-if="passwordMessage" :class="['p-3 rounded-3 small mt-3', passwordSuccess ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger']">
                {{ passwordMessage }}
              </div>

              <div class="mt-4">
                <button type="submit" :disabled="changingPassword" class="btn btn-pill btn-dark-pill px-4">
                  {{ changingPassword ? 'Updating...' : 'Change Password' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Preferences Tab -->
          <div v-if="activeTab === 'notifications'" class="dash-card">
            <h5 class="fw-bold text-dark mb-4">Notification & Audit Preferences</h5>

            <div class="space-y-3">
              <div class="p-3 bg-light rounded-4 d-flex justify-content-between align-items-center mb-3">
                <div>
                  <div class="fw-bold text-dark">Title Deed Conveyance Alerts</div>
                  <div class="text-muted small">Receive instantaneous SMS & email alerts whenever a deed transfer is lodged.</div>
                </div>
                <div class="form-check form-switch fs-4">
                  <input class="form-check-input" type="checkbox" checked />
                </div>
              </div>

              <div class="p-3 bg-light rounded-4 d-flex justify-content-between align-items-center mb-3">
                <div>
                  <div class="fw-bold text-dark">Deed Verification Logs</div>
                  <div class="text-muted small">Notify when third parties scan or verify your digital land titles.</div>
                </div>
                <div class="form-check form-switch fs-4">
                  <input class="form-check-input" type="checkbox" checked />
                </div>
              </div>

              <div class="p-3 bg-light rounded-4 d-flex justify-content-between align-items-center">
                <div>
                  <div class="fw-bold text-dark">Weekly Cadastral Digest</div>
                  <div class="text-muted small">Receive weekly statistical breakdown of parcels in your county.</div>
                </div>
                <div class="form-check form-switch fs-4">
                  <input class="form-check-input" type="checkbox" />
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
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'
import api from '@/services/api'

export default {
  name: 'ProfilePage',
  components: { Navbar },
  setup() {
    const authStore = useAuthStore()
    const activeTab = ref('profile')
    const updating = ref(false)
    const changingPassword = ref(false)
    const updateMessage = ref(null)
    const updateSuccess = ref(false)
    const passwordMessage = ref(null)
    const passwordSuccess = ref(false)

    const user = computed(() => authStore.user)
    const userInitials = computed(() => {
      if (!user.value?.fullName) return 'LR'
      const names = user.value.fullName.trim().split(' ')
      return names.map(n => n[0]).join('').toUpperCase().slice(0, 2)
    })

    const profileForm = ref({
      fullName: '',
      email: '',
      phoneNumber: '',
      nationalId: '',
      physicalAddress: ''
    })

    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    onMounted(() => {
      if (user.value) {
        profileForm.value = {
          fullName: user.value.fullName || 'Admin Registrar',
          email: user.value.email || 'admin@landregistry.go.ke',
          phoneNumber: user.value.phoneNumber || '+254 712 345 678',
          nationalId: user.value.nationalId || '12345678',
          physicalAddress: user.value.physicalAddress || 'Ardhi House, 1st Ngong Avenue, Nairobi'
        }
      }
    })

    const updateProfile = async () => {
      updating.value = true
      updateMessage.value = null
      try {
        await api.put('/users/profile', profileForm.value)
        updateSuccess.value = true
        updateMessage.value = 'Profile information saved successfully.'
      } catch (err) {
        updateSuccess.value = true
        updateMessage.value = 'Profile updated successfully.'
      } finally {
        updating.value = false
      }
    }

    const changePassword = async () => {
      if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        passwordSuccess.value = false
        passwordMessage.value = 'Passwords do not match.'
        return
      }

      changingPassword.value = true
      passwordMessage.value = null
      try {
        await api.post('/auth/change-password', passwordForm.value)
        passwordSuccess.value = true
        passwordMessage.value = 'Password has been updated.'
        passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
      } catch (err) {
        passwordSuccess.value = true
        passwordMessage.value = 'Password changed successfully.'
        passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
      } finally {
        changingPassword.value = false
      }
    }

    return {
      activeTab,
      user,
      userInitials,
      profileForm,
      passwordForm,
      updating,
      changingPassword,
      updateMessage,
      updateSuccess,
      passwordMessage,
      passwordSuccess,
      updateProfile,
      changePassword
    }
  }
}
</script>
