<template>
  <div class="main-layout-container">
    <Navbar />
    <main class="flex-grow-1 p-3 p-md-4 p-xl-5">
      <h1>My Land Parcels</h1>
      <p class="text-muted">This page is under construction. Please use the Dashboard to view your parcels.</p>
      <router-link to="/userdashboard" class="btn btn-primary">Go to Dashboard</router-link>
    </main>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
export default {
  components: { Navbar }
}
</script>
