<template>
  <div class="min-h-screen d-flex align-items-center justify-content-center p-3" style="min-height: 100vh; background: #f4f5f8;">
    <div class="dash-card border-0 shadow-lg p-4 p-sm-5" style="max-width: 440px; width: 100%;">
      <!-- Brand & Title -->
      <div class="text-center mb-4">
        <div class="sidebar-logo-icon mx-auto mb-3" style="width: 52px; height: 52px; font-size: 1.6rem;">
          <i class="bi bi-geo-alt-fill text-warning"></i>
        </div>
        <h3 class="fw-bold text-dark mb-1">Welcome Back</h3>
        <p class="text-muted small">Sign in to your Kenyan Land Registry Account</p>
      </div>

      <form @submit.prevent="handleLogin" autocomplete="off">
        <div class="mb-3">
          <label class="form-label fw-semibold text-dark small">Email or National ID</label>
          <div class="position-relative">
            <i :class="['text-muted position-absolute', isNationalIdInput ? 'bi bi-person-vcard' : 'bi bi-envelope']" 
               style="left: 1rem; top: 50%; transform: translateY(-50%);"></i>
            <input
              v-model="form.emailOrNationalId"
              type="text"
              class="form-control rounded-pill py-2 ps-5 bg-light border-0"
              :placeholder="isNationalIdInput ? 'e.g. 42207690' : 'e.g. admin@landregistry.go.ke'"
              autocomplete="off"
              required
            />
          </div>
          <small class="text-muted d-block mt-1 ms-2">
            You can login with your email address or National ID number
          </small>
        </div>

        <div class="mb-3">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <label class="form-label fw-semibold text-dark small mb-0">Password</label>
            <router-link to="/forgot-password" class="small text-decoration-none text-muted">
              Forgot password?
            </router-link>
          </div>
          <div class="position-relative">
            <i class="bi bi-lock text-muted position-absolute" style="left: 1rem; top: 50%; transform: translateY(-50%);"></i>
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="form-control rounded-pill py-2 ps-5 pe-5 bg-light border-0"
              placeholder="Enter your password"
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

        <div class="form-check mb-4">
          <input class="form-check-input" type="checkbox" id="rememberMe" checked />
          <label class="form-check-label small text-muted" for="rememberMe">
            Remember session on this device
          </label>
        </div>

        <div v-if="error" class="p-3 bg-danger-subtle text-danger rounded-4 small mb-3">
          {{ error }}
        </div>

        <button type="submit" :disabled="loading" class="btn btn-pill btn-dark-pill w-100 py-2 justify-content-center mb-3">
          <span v-if="loading" class="spinner-border spinner-border-sm me-1" role="status"></span>
          <span v-else>Sign In to Registry</span>
        </button>

        <div class="text-center">
          <span class="text-muted small">Don't have an account yet? </span>
          <router-link to="/register" class="fw-bold text-dark text-decoration-none small">
            Create Account
          </router-link>
        </div>

      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const authStore = useAuthStore()

    const form = ref({
      emailOrNationalId: '',
      password: ''
    })
    const showPassword = ref(false)
    const loading = ref(false)
    const error = ref(null)

    // Detect if input looks like a National ID (numbers only)
    const isNationalIdInput = computed(() => {
      return /^\d+$/.test(form.value.emailOrNationalId)
    })

    const handleLogin = async () => {
      loading.value = true
      error.value = null

      try {
        // Determine if it's email or National ID
        const loginData = isNationalIdInput.value
          ? { nationalId: form.value.emailOrNationalId, password: form.value.password }
          : { email: form.value.emailOrNationalId, password: form.value.password }

        await authStore.login(loginData)
        
        // Redirect based on role
        if (authStore.isAdministrator) {
          router.push('/admindashboard') // Admin dashboard
        } else if (authStore.isLandOfficer) {
          router.push('/officer') // Officer dashboard
        } else {
          router.push('/userdashboard') // Land Owner dashboard
        }
      } catch (err) {
        error.value = err.response?.data?.message || 'Login failed. Please check your credentials.'
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      showPassword,
      loading,
      error,
      isNationalIdInput,
      handleLogin
    }
  }
}
</script>
