<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
    <div class="card max-w-md w-full text-center">
      <div v-if="verifying" class="py-8">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mb-4"></div>
        <p class="text-gray-600">Verifying your email...</p>
      </div>

      <div v-else-if="success" class="py-8">
        <div class="text-6xl mb-4">✅</div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h1>
        <p class="text-gray-600 mb-6">Your email has been successfully verified</p>
        <router-link to="/login" class="btn-primary">Go to Login</router-link>
      </div>

      <div v-else class="py-8">
        <div class="text-6xl mb-4">❌</div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <router-link to="/login" class="btn-primary">Go to Login</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'

export default {
  name: 'VerifyEmail',
  setup() {
    const route = useRoute()
    const verifying = ref(true)
    const success = ref(false)
    const error = ref(null)

    const verifyEmail = async () => {
      try {
        await api.get(`/auth/verify-email/${route.params.token}`)
        success.value = true
      } catch (err) {
        error.value = err.response?.data?.message || 'Invalid or expired verification link'
      } finally {
        verifying.value = false
      }
    }

    onMounted(() => {
      verifyEmail()
    })

    return {
      verifying,
      success,
      error
    }
  }
}
</script>
