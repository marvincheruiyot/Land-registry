<template>
  <div class="main-layout-container">
    <Navbar />
    <main class="flex-grow-1 p-3 p-md-4 p-xl-5">
      <div class="dash-card text-center py-5">
        <i class="bi bi-map fs-1 text-primary mb-3 d-block"></i>
        <h3 class="fw-bold mb-2">My Land Parcels</h3>
        <p class="text-muted mb-4">View all your registered land parcels on the dashboard</p>
        <router-link to="/userdashboard" class="btn btn-pill btn-primary">
          <i class="bi bi-grid-fill me-1"></i> Go to Dashboard
        </router-link>
      </div>
    </main>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'MyParcels',
  components: { Navbar },
  setup() {
    const router = useRouter()
    
    // Auto-redirect to dashboard after 2 seconds
    onMounted(() => {
      setTimeout(() => {
        router.push('/userdashboard')
      }, 2000)
    })
  }
}
</script>
