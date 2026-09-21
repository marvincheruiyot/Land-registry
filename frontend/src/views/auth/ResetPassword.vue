<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
    <div class="card max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
        <p class="text-gray-600">Enter your new password</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="input-field pr-10"
              placeholder="Min 8 characters"
              required
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              @click="showPassword = !showPassword"
              :title="showPassword ? 'Hide password' : 'Show password'"
            >
              <i :class="showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
          <div class="relative">
            <input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              class="input-field pr-10"
              placeholder="Re-enter password"
              required
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              @click="showConfirmPassword = !showConfirmPassword"
              :title="showConfirmPassword ? 'Hide password' : 'Show password'"
            >
              <i :class="showConfirmPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
            </button>
          </div>
        </div>

        <!-- Requirements checklist -->
        <div class="p-3 bg-gray-50 rounded-lg text-xs space-y-1">
          <div class="font-semibold text-gray-700 mb-1 flex items-center gap-1">
            <i class="bi bi-shield-check text-yellow-600"></i> Password Requirements:
          </div>
          <div class="grid grid-cols-2 gap-1 text-gray-500">
            <div :class="requirements.minLength ? 'text-green-600 font-medium' : ''">
              <i :class="requirements.minLength ? 'bi bi-check-circle-fill text-green-500' : 'bi bi-circle'"></i> Min 8 characters
            </div>
            <div :class="requirements.hasUpper && requirements.hasLower ? 'text-green-600 font-medium' : ''">
              <i :class="requirements.hasUpper && requirements.hasLower ? 'bi bi-check-circle-fill text-green-500' : 'bi bi-circle'"></i> Upper & lowercase
            </div>
            <div :class="requirements.hasNumber ? 'text-green-600 font-medium' : ''">
              <i :class="requirements.hasNumber ? 'bi bi-check-circle-fill text-green-500' : 'bi bi-circle'"></i> At least 1 number
            </div>
            <div :class="requirements.hasSpecial ? 'text-green-600 font-medium' : ''">
              <i :class="requirements.hasSpecial ? 'bi bi-check-circle-fill text-green-500' : 'bi bi-circle'"></i> Special symbol (@$!%*?&#)
            </div>
          </div>
        </div>

        <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {{ error }}
        </div>

        <div v-if="success" class="bg-green-50 text-green-600 p-3 rounded-lg text-sm">
          {{ success }}
        </div>

        <button type="submit" :disabled="loading" class="btn-primary w-full">
          {{ loading ? 'Resetting...' : 'Reset Password' }}
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
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

export default {
  name: 'ResetPassword',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const password = ref('')
    const confirmPassword = ref('')
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)
    const loading = ref(false)
    const error = ref(null)
    const success = ref(null)

    const requirements = computed(() => {
      const p = password.value || ''
      return {
        minLength: p.length >= 8,
        hasUpper: /[A-Z]/.test(p),
        hasLower: /[a-z]/.test(p),
        hasNumber: /\d/.test(p),
        hasSpecial: /[@$!%*?&#]/.test(p)
      }
    })

    const handleSubmit = async () => {
      if (password.value !== confirmPassword.value) {
        error.value = 'Passwords do not match'
        return
      }

      if (!requirements.value.minLength ||
          !requirements.value.hasUpper ||
          !requirements.value.hasLower ||
          !requirements.value.hasNumber ||
          !requirements.value.hasSpecial) {
        error.value = 'Please meet all password requirements.'
        return
      }

      loading.value = true
      error.value = null
      success.value = null

      try {
        await api.post(`/auth/reset-password/${route.params.token}`, {
          password: password.value
        })
        success.value = 'Password reset successfully! Redirecting to login...'
        setTimeout(() => {
          router.push({ name: 'Login' })
        }, 2000)
      } catch (err) {
        error.value = err.response?.data?.message || 'Failed to reset password'
      } finally {
        loading.value = false
      }
    }

    return {
      password,
      confirmPassword,
      showPassword,
      showConfirmPassword,
      requirements,
      loading,
      error,
      success,
      handleSubmit
    }
  }
}
</script>
