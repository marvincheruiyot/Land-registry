<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
    <div class="card max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
        <p class="text-gray-600">Enter your email to reset your password</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            v-model="email"
            type="email"
            class="input-field"
            placeholder="your.email@example.com"
            required
          />
        </div>

        <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {{ error }}
        </div>

        <div v-if="success" class="bg-green-50 text-green-600 p-3 rounded-lg text-sm">
          {{ success }}
        </div>

        <button type="submit" :disabled="loading" class="btn-primary w-full">
          {{ loading ? 'Sending...' : 'Send Reset Link' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <router-link to="/login" class="text-primary-600 hover:text-primary-700">
          Back to Login
        </router-link>
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
    const success = ref(null)

    const handleSubmit = async () => {
      loading.value = true
      error.value = null
      success.value = null

      try {
        await api.post('/auth/forgot-password', { email: email.value })
        success.value = 'Password reset link has been sent to your email'
      } catch (err) {
        error.value = err.response?.data?.message || 'Failed to send reset link'
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      loading,
      error,
      success,
      handleSubmit
    }
  }
}
</script>
