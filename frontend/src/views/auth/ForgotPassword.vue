<template>
  <div class="min-h-screen d-flex align-items-center justify-content-center p-3" style="min-height: 100vh; background: #f4f5f8;">
    <div class="dash-card border-0 shadow-lg p-4 p-sm-5" style="max-width: 500px; width: 100%;">
      <!-- Brand & Title -->
      <div class="text-center mb-4">
        <div class="sidebar-logo-icon mx-auto mb-3" style="width: 52px; height: 52px; font-size: 1.6rem;">
          <i class="bi bi-key-fill text-warning"></i>
        </div>
        <h3 class="fw-bold text-dark mb-1">Forgot Password?</h3>
        <p class="text-muted small">No worries! Enter your email and we'll send you a reset link</p>
      </div>

      <!-- Success State -->
      <div v-if="success" class="text-center">
        <div class="avatar-circle bg-success-subtle text-success mx-auto mb-3" style="width: 64px; height: 64px;">
          <i class="bi bi-check-circle fs-1"></i>
        </div>
        <h5 class="fw-bold text-dark mb-2">Check Your Email!</h5>
        <p class="text-muted small mb-4">
          We've sent a password reset link to <strong>{{ email }}</strong>. 
          Click the link in the email to reset your password.
        </p>
        <div class="p-3 bg-light rounded-4 mb-4">
          <small class="text-muted d-block mb-2">
            <i class="bi bi-info-circle me-2"></i>Didn't receive the email?
          </small>
          <ul class="text-start small text-muted mb-0 ps-4">
            <li>Check your spam/junk folder</li>
            <li>Make sure you entered the correct email</li>
            <li>Wait a few minutes for the email to arrive</li>
          </ul>
        </div>
        <button @click="resetForm" class="btn btn-pill btn-dark-pill w-100 mb-3">
          Try Another Email
        </button>
        <router-link to="/login" class="btn btn-link text-decoration-none text-dark">
          <i class="bi bi-arrow-left me-2"></i>Back to Login
        </router-link>
      </div>

      <!-- Form State -->
      <form v-else @submit.prevent="handleSubmit" autocomplete="off">
        <div class="mb-3">
          <label class="form-label fw-semibold text-dark small">Email Address</label>
          <div class="position-relative">
            <i class="bi bi-envelope text-muted position-absolute" style="left: 1rem; top: 50%; transform: translateY(-50%);"></i>
            <input
              v-model="email"
              type="email"
              class="form-control rounded-pill py-2 ps-5 bg-light border-0"
              placeholder="your.email@example.com"
              autocomplete="off"
              required
            />
          </div>
          <small class="text-muted d-block mt-2">
            <i class="bi bi-shield-check me-1"></i>
            Enter the email address associated with your Land Registry account
          </small>
        </div>

        <div v-if="error" class="p-3 bg-danger-subtle text-danger rounded-4 small mb-3">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ error }}
        </div>

        <button type="submit" :disabled="loading" class="btn btn-pill btn-dark-pill w-100 py-2 justify-content-center mb-3">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
          <i v-else class="bi bi-send me-2"></i>
          <span>{{ loading ? 'Sending Reset Link...' : 'Send Reset Link' }}</span>
        </button>

        <div class="text-center">
          <router-link to="/login" class="text-decoration-none">
            <i class="bi bi-arrow-left me-2"></i>
            <span class="fw-semibold text-dark small">Back to Login</span>
          </router-link>
        </div>
      </form>

      <!-- Additional Help -->
      <div class="mt-4 pt-4 border-top text-center">
        <small class="text-muted">
          Need more help? Contact support at 
          <a href="mailto:support@landregistry.go.ke" class="text-decoration-none fw-semibold text-dark">
            support@landregistry.go.ke
          </a>
        </small>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import api from '@/services/api'

export default {
  name: 'ForgotPassword',
  setup() {
    const email = ref('')
    const loading = ref(false)
    const error = ref(null)
    const success = ref(false)

    const handleSubmit = async () => {
      loading.value = true
      error.value = null
      success.value = false

      try {
        await api.post('/auth/forgot-password', { email: email.value })
        success.value = true
      } catch (err) {
        error.value = err.response?.data?.message || 'Failed to send reset link. Please try again.'
      } finally {
        loading.value = false
      }
    }

    const resetForm = () => {
      success.value = false
      email.value = ''
      error.value = null
    }

    return {
      email,
      loading,
      error,
      success,
      handleSubmit,
      resetForm
    }
  }
}
</script>
