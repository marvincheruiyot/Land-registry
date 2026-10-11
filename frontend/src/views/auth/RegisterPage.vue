<template>
  <div class="min-h-screen d-flex align-items-center justify-content-center p-3 py-5" style="min-height: 100vh; background: #f4f5f8;">
    <div class="dash-card border-0 shadow-lg p-4 p-sm-5" style="max-width: 600px; width: 100%;">
      <!-- Brand & Title -->
      <div class="text-center mb-4">
        <div class="sidebar-logo-icon mx-auto mb-3" style="width: 52px; height: 52px; font-size: 1.6rem;">
          <i class="bi bi-geo-alt-fill text-warning"></i>
        </div>
        <h3 class="fw-bold text-dark mb-1">Create Account</h3>
        <p class="text-muted small">Register for verified digital access to Land Registry records</p>
      </div>

      <form @submit.prevent="handleRegister" autocomplete="off">
        <div class="row g-3 mb-3">
          <div class="col-12 col-md-6">
            <label class="form-label fw-semibold text-dark small">Full Name *</label>
            <input
              v-model="form.fullName"
              type="text"
              class="form-control rounded-pill py-2 bg-light border-0"
              placeholder="e.g. John Kipchoge"
              autocomplete="off"
              required
            />
          </div>

          <div class="col-12 col-md-6">
            <label class="form-label fw-semibold text-dark small">Email Address *</label>
            <input
              v-model="form.email"
              type="email"
              class="form-control rounded-pill py-2 bg-light border-0"
              placeholder="e.g. john@example.com"
              autocomplete="off"
              required
            />
          </div>

          <div class="col-12 col-md-6">
            <label class="form-label fw-semibold text-dark small">Phone Number *</label>
            <input
              v-model="form.phoneNumber"
              type="tel"
              class="form-control rounded-pill py-2 bg-light border-0"
              placeholder="e.g. +254 712 345 678"
              autocomplete="off"
              required
            />
          </div>

          <div class="col-12 col-md-6">
            <label class="form-label fw-semibold text-dark small">National ID Number *</label>
            <input
              v-model="form.nationalId"
              type="text"
              class="form-control rounded-pill py-2 bg-light border-0"
              placeholder="e.g. 28934112"
              autocomplete="off"
              required
            />
          </div>

          <div class="col-12 col-md-6">
            <label class="form-label fw-semibold text-dark small">Password *</label>
            <div class="position-relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-control rounded-pill py-2 pe-5 bg-light border-0"
                placeholder="Enter password (min 8 chars)"
                autocomplete="new-password"
                required
              />
              <button
                type="button"
                class="btn btn-link position-absolute text-muted p-0 border-0"
                style="right: 1.1rem; top: 50%; transform: translateY(-50%); text-decoration: none;"
                @click="showPassword = !showPassword"
                :title="showPassword ? 'Hide password' : 'Show password'"
              >
                <i :class="showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
              </button>
            </div>
          </div>

          <div class="col-12 col-md-6">
            <label class="form-label fw-semibold text-dark small">Confirm Password *</label>
            <div class="position-relative">
              <input
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="form-control rounded-pill py-2 pe-5 bg-light border-0"
                placeholder="Confirm password"
                autocomplete="new-password"
                required
              />
              <button
                type="button"
                class="btn btn-link position-absolute text-muted p-0 border-0"
                style="right: 1.1rem; top: 50%; transform: translateY(-50%); text-decoration: none;"
                @click="showConfirmPassword = !showConfirmPassword"
                :title="showConfirmPassword ? 'Hide password' : 'Show password'"
              >
                <i :class="showConfirmPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
              </button>
            </div>
          </div>

          <!-- Password Requirements checklist -->
          <div class="col-12">
            <div class="p-3 rounded-4 bg-light border" style="font-size: 0.78rem;">
              <div class="fw-semibold text-dark mb-2 d-flex align-items-center gap-1">
                <i class="bi bi-shield-check text-warning"></i> Password Requirements:
              </div>
              <div class="row g-2">
                <div class="col-6 col-md-3">
                  <span :class="passwordRequirements.minLength ? 'text-success fw-semibold' : 'text-muted'">
                    <i :class="passwordRequirements.minLength ? 'bi bi-check-circle-fill text-success' : 'bi bi-circle'"></i>
                    Min 8 characters
                  </span>
                </div>
                <div class="col-6 col-md-3">
                  <span :class="passwordRequirements.hasUpper && passwordRequirements.hasLower ? 'text-success fw-semibold' : 'text-muted'">
                    <i :class="passwordRequirements.hasUpper && passwordRequirements.hasLower ? 'bi bi-check-circle-fill text-success' : 'bi bi-circle'"></i>
                    Upper &amp; lowercase
                  </span>
                </div>
                <div class="col-6 col-md-3">
                  <span :class="passwordRequirements.hasNumber ? 'text-success fw-semibold' : 'text-muted'">
                    <i :class="passwordRequirements.hasNumber ? 'bi bi-check-circle-fill text-success' : 'bi bi-circle'"></i>
                    At least 1 number
                  </span>
                </div>
                <div class="col-6 col-md-3">
                  <span :class="passwordRequirements.hasSpecial ? 'text-success fw-semibold' : 'text-muted'">
                    <i :class="passwordRequirements.hasSpecial ? 'bi bi-check-circle-fill text-success' : 'bi bi-circle'"></i>
                    Special symbol (@$!%*?&amp;#)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12">
            <label class="form-label fw-semibold text-dark small">Role / Account Purpose *</label>
            <select v-model="form.role" class="form-select rounded-pill py-2 bg-light border-0" required>
              <option value="Land_Owner">Land Owner / Citizen</option>
              <option value="Land_Officer">Cadastral / Land Officer</option>
              <option value="Administrator">Administrator</option>
            </select>
          </div>
        </div>

        <div v-if="error" class="p-3 bg-danger-subtle text-danger rounded-4 small mb-3">
          {{ error }}
        </div>
        <div v-if="success" class="p-3 bg-success-subtle text-success rounded-4 small mb-3">
          {{ success }}
        </div>

        <button type="submit" :disabled="loading" class="btn btn-pill btn-dark-pill w-100 py-2 justify-content-center mb-3">
          <span v-if="loading" class="spinner-border spinner-border-sm me-1" role="status"></span>
          <span v-else>Complete Registration</span>
        </button>

        <div class="text-center">
          <span class="text-muted small">Already have an account? </span>
          <router-link to="/login" class="fw-bold text-dark text-decoration-none small">
            Sign In here
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'RegisterPage',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    const form = ref({
      fullName: '',
      email: '',
      phoneNumber: '',
      nationalId: '',
      password: '',
      confirmPassword: '',
      physicalAddress: '',
      role: 'Land_Owner'
    })
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)
    const loading = ref(false)
    const error = ref(null)
    const success = ref(null)

    const passwordRequirements = computed(() => {
      const p = form.value.password || ''
      return {
        minLength: p.length >= 8,
        hasUpper: /[A-Z]/.test(p),
        hasLower: /[a-z]/.test(p),
        hasNumber: /\d/.test(p),
        hasSpecial: /[@$!%*?&#]/.test(p)
      }
    })

    const handleRegister = async () => {
      loading.value = true
      error.value = null
      success.value = null

      if (form.value.password !== form.value.confirmPassword) {
        error.value = 'Passwords do not match'
        loading.value = false
        return
      }

      if (!passwordRequirements.value.minLength ||
          !passwordRequirements.value.hasUpper ||
          !passwordRequirements.value.hasLower ||
          !passwordRequirements.value.hasNumber ||
          !passwordRequirements.value.hasSpecial) {
        error.value = 'Please meet all password requirements (min 8 chars, uppercase, lowercase, number, special symbol).'
        loading.value = false
        return
      }

      try {
        const { confirmPassword, ...registerData } = form.value
        // Call backend API directly without auto-login
        const response = await fetch('http://localhost:5000/api/v1/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registerData)
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Registration failed')
        }

        success.value = 'Registration successful! Please login with your credentials.'
        
        // Clear the form
        form.value = {
          fullName: '',
          email: '',
          phoneNumber: '',
          nationalId: '',
          password: '',
          confirmPassword: '',
          role: 'Land_Owner',
          physicalAddress: ''
        }
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          router.push({ name: 'Login' })
        }, 2000)
      } catch (err) {
        error.value = err.message || 'Registration failed. Please verify your details.'
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      showPassword,
      showConfirmPassword,
      passwordRequirements,
      loading,
      error,
      success,
      handleRegister
    }
  }
}
</script>
