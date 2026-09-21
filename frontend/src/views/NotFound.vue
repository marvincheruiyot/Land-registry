<template>
  <div class="d-flex align-items-center justify-content-center" style="min-height: 100vh; background: #f4f5f8;">
    <div class="dash-card text-center p-5" style="max-width: 480px;">
      <div class="avatar-circle bg-dark text-warning mx-auto mb-3" style="width: 72px; height: 72px; font-size: 2rem;">
        <i class="bi bi-compass"></i>
      </div>
      <h1 class="display-3 fw-bold text-dark mb-2">404</h1>
      <h5 class="fw-bold text-dark mb-2">Cadastral Record Not Found</h5>
      <p class="text-muted small mb-4">
        The page or parcel registry endpoint you requested does not exist or has been relocated.
      </p>
      <div class="d-flex justify-content-center gap-2">
        <router-link to="/dashboard" class="btn btn-pill btn-dark-pill">
          <i class="bi bi-grid-fill"></i> Go to Dashboard
        </router-link>
        <router-link to="/" class="btn btn-pill btn-light-pill">
          Portal Home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>
