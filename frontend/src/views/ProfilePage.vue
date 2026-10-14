<template>
  <div class="main-layout-container">
    <Navbar />

    <main class="flex-grow-1 p-3 p-md-4 p-xl-5">
      <!-- Title -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div class="badge badge-pill-custom badge-soft-blue mb-2">
            <i class="bi bi-person-badge-fill"></i> My Profile
          </div>
          <h1 class="fw-bold text-dark fs-2 mb-1">Account Settings</h1>
          <p class="text-muted mb-0">Manage your profile information and account security.</p>
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
            <span class="badge badge-pill-custom badge-soft-blue mb-4">
              <i class="bi bi-person-fill"></i> {{ formatRole(user?.role) }}
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
            </div>
          </div>

          <!-- Security Info Card (Only for Land Owners) -->
          <div v-if="isLandOwner" class="dash-card bg-light">
            <h6 class="fw-bold text-dark mb-2"><i class="bi bi-shield-check text-success"></i> Account Security</h6>
            <p class="text-muted small mb-0">
              Your account is secured with encrypted authentication. Keep your password safe and change it regularly.
            </p>
          </div>

          <!-- Admin/Officer Security Card -->
          <div v-else class="dash-card card-dark">
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
            <h5 class="fw-bold text-dark mb-4">Personal Information</h5>

            <form @submit.prevent="updateProfile">
              <div class="row g-3">
                <div class="col-12 col-md-6">
                  <label class="form-label fw-semibold text-dark">Full Name *</label>
                  <input v-model="profileForm.fullName" type="text" class="form-control rounded-pill py-2 bg-light border-0" required />
                </div>

                <div class="col-12 col-md-6">
                  <label class="form-label fw-semibold text-dark">Email Address *</label>
                  <input v-model="profileForm.email" type="email" class="form-control rounded-pill py-2 bg-light border-0" required />
                </div>

                <div class="col-12 col-md-6">
                  <label class="form-label fw-semibold text-dark">Phone Number *</label>
                  <input v-model="profileForm.phoneNumber" type="tel" class="form-control rounded-pill py-2 bg-light border-0" required />
                </div>

                <div class="col-12 col-md-6">
                  <label class="form-label fw-semibold text-dark">National ID Number</label>
                  <input v-model="profileForm.nationalId" type="text" class="form-control rounded-pill py-2 bg-light border-0" disabled />
                  <small class="text-muted">National ID cannot be changed</small>
                </div>

                <div class="col-12">
                  <label class="form-label fw-semibold text-dark">Physical Address</label>
                  <textarea v-model="profileForm.physicalAddress" class="form-control rounded-4 bg-light border-0" rows="3" placeholder="Optional - Enter your physical address"></textarea>
                  <small class="text-muted">Optional field</small>
                </div>
              </div>

              <div v-if="updateMessage" :class="['p-3 rounded-3 small mt-3', updateSuccess ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger']">
                {{ updateMessage }}
              </div>

              <div class="mt-4">
                <button type="submit" :disabled="updating" class="btn btn-pill btn-dark-pill px-4">
                  {{ updating ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Security Form -->
          <div v-if="activeTab === 'security'" class="dash-card">
            <h5 class="fw-bold text-dark mb-4">Change Password</h5>

            <form @submit.prevent="changePassword">
              <div class="space-y-3">
                <div class="mb-3">
                  <label class="form-label fw-semibold text-dark">Current Password *</label>
                  <input v-model="passwordForm.currentPassword" type="password" class="form-control rounded-pill py-2 bg-light border-0" required />
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold text-dark">New Password *</label>
                  <input 
                    v-model="passwordForm.newPassword" 
                    @input="validatePassword"
                    type="password" 
                    class="form-control rounded-pill py-2 bg-light border-0" 
                    required 
                  />
                  
                  <!-- Password Requirements Checklist -->
                  <div class="mt-2 p-3 bg-light rounded-3">
                    <small class="text-muted fw-semibold d-block mb-2">Password Requirements:</small>
                    <div class="d-flex flex-column gap-1">
                      <small :class="passwordRequirements.minLength ? 'text-success' : 'text-muted'">
                        <i :class="passwordRequirements.minLength ? 'bi bi-check-circle-fill' : 'bi bi-circle'"></i>
                        At least 8 characters
                      </small>
                      <small :class="passwordRequirements.hasUppercase ? 'text-success' : 'text-muted'">
                        <i :class="passwordRequirements.hasUppercase ? 'bi bi-check-circle-fill' : 'bi bi-circle'"></i>
                        One uppercase letter
                      </small>
                      <small :class="passwordRequirements.hasLowercase ? 'text-success' : 'text-muted'">
                        <i :class="passwordRequirements.hasLowercase ? 'bi bi-check-circle-fill' : 'bi bi-circle'"></i>
                        One lowercase letter
                      </small>
                      <small :class="passwordRequirements.hasNumber ? 'text-success' : 'text-muted'">
                        <i :class="passwordRequirements.hasNumber ? 'bi bi-check-circle-fill' : 'bi bi-circle'"></i>
                        One number
                      </small>
                      <small :class="passwordRequirements.hasSpecial ? 'text-success' : 'text-muted'">
                        <i :class="passwordRequirements.hasSpecial ? 'bi bi-check-circle-fill' : 'bi bi-circle'"></i>
                        One special character (!@#$%^&*)
                      </small>
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold text-dark">Confirm New Password *</label>
                  <input 
                    v-model="passwordForm.confirmPassword" 
                    type="password" 
                    class="form-control rounded-pill py-2 bg-light border-0" 
                    required 
                  />
                  <small v-if="passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword" class="text-danger">
                    <i class="bi bi-x-circle-fill"></i> Passwords do not match
                  </small>
                  <small v-else-if="passwordForm.confirmPassword && passwordForm.newPassword === passwordForm.confirmPassword" class="text-success">
                    <i class="bi bi-check-circle-fill"></i> Passwords match
                  </small>
                </div>
              </div>

              <div v-if="passwordMessage" :class="['p-3 rounded-3 small mt-3', passwordSuccess ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger']">
                {{ passwordMessage }}
              </div>

              <div class="mt-4">
                <button type="submit" :disabled="changingPassword" class="btn btn-pill btn-dark-pill px-4">
                  {{ changingPassword ? 'Updating...' : 'Update Password' }}
                </button>
              </div>
            </form>
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
    const isLandOwner = computed(() => authStore.isLandOwner)
    
    const userInitials = computed(() => {
      if (!user.value?.fullName) return 'LR'
      const names = user.value.fullName.trim().split(' ')
      return names.map(n => n[0]).join('').toUpperCase().slice(0, 2)
    })

    const formatRole = (role) => {
      if (!role) return 'User'
      return role.replace('_', ' ')
    }

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

    const passwordRequirements = ref({
      minLength: false,
      hasUppercase: false,
      hasLowercase: false,
      hasNumber: false,
      hasSpecial: false
    })

    const validatePassword = () => {
      const pwd = passwordForm.value.newPassword
      passwordRequirements.value = {
        minLength: pwd.length >= 8,
        hasUppercase: /[A-Z]/.test(pwd),
        hasLowercase: /[a-z]/.test(pwd),
        hasNumber: /\d/.test(pwd),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
      }
    }

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
        const response = await api.put('/users/profile', profileForm.value)
        
        // Update the auth store with new user data
        if (response.data?.data?.user) {
          authStore.user = response.data.data.user
          localStorage.setItem('user', JSON.stringify(response.data.data.user))
        }
        
        updateSuccess.value = true
        updateMessage.value = 'Profile information saved successfully!'
      } catch (err) {
        updateSuccess.value = false
        updateMessage.value = err.response?.data?.message || 'Failed to update profile. Please try again.'
      } finally {
        updating.value = false
        // Clear message after 3 seconds
        setTimeout(() => {
          updateMessage.value = null
        }, 3000)
      }
    }

    const changePassword = async () => {
      // Validate all password requirements are met
      if (!Object.values(passwordRequirements.value).every(req => req)) {
        passwordSuccess.value = false
        passwordMessage.value = 'Please meet all password requirements.'
        return
      }

      if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        passwordSuccess.value = false
        passwordMessage.value = 'Passwords do not match.'
        return
      }

      changingPassword.value = true
      passwordMessage.value = null
      try {
        const response = await api.post('/auth/change-password', {
          currentPassword: passwordForm.value.currentPassword,
          newPassword: passwordForm.value.newPassword
        })
        
        passwordSuccess.value = true
        passwordMessage.value = response.data?.message || 'Password has been updated successfully.'
        passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
        passwordRequirements.value = {
          minLength: false,
          hasUppercase: false,
          hasLowercase: false,
          hasNumber: false,
          hasSpecial: false
        }
      } catch (err) {
        console.error('Change password error:', err)
        passwordSuccess.value = false
        passwordMessage.value = err.response?.data?.message || err.message || 'Failed to change password. Please check your current password and try again.'
      } finally {
        changingPassword.value = false
        setTimeout(() => {
          if (passwordSuccess.value) {
            passwordMessage.value = null
          }
        }, 3000)
      }
    }

    return {
      activeTab,
      user,
      isLandOwner,
      userInitials,
      formatRole,
      profileForm,
      passwordForm,
      updating,
      changingPassword,
      updateMessage,
      updateSuccess,
      passwordMessage,
      passwordSuccess,
      passwordRequirements,
      updateProfile,
      changePassword,
      validatePassword
    }
  }
}
</script>
