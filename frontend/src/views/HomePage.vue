<template>
  <div class="homepage-wrapper">
    <!-- Public Top Nav -->
    <header class="py-3 px-4 px-md-5 d-flex justify-content-between align-items-center bg-white border-bottom shadow-xs sticky-top">
      <div class="d-flex align-items-center gap-3">
        <div class="sidebar-logo-icon" style="width: 42px; height: 42px; font-size: 1.3rem;">
          <i class="bi bi-geo-alt-fill text-warning"></i>
        </div>
        <div>
          <div class="fw-bold fs-5 text-dark lh-1">Land Registry</div>
          <small class="text-muted" style="font-size: 0.68rem; letter-spacing: 0.5px;">DIGITAL CADASTRAL REPOSITORY</small>
        </div>
      </div>

      <div class="d-flex align-items-center gap-2">
        <router-link to="/register" class="btn btn-pill btn-light-pill">
          <i class="bi bi-person-plus-fill"></i> Register
        </router-link>
        <router-link to="/login" class="btn btn-pill btn-dark-pill">
          Sign In
        </router-link>
      </div>
    </header>

    <!-- Hero Section with Ambient Glow -->
    <div class="hero-container py-5">
      <div class="container py-3 py-md-4">
        <!-- Hero Title & Subtitle -->
        <div class="text-center max-w-3xl mx-auto mb-4">
          <div class="badge badge-pill-custom badge-soft-yellow mb-3 px-3 py-2 border border-warning border-opacity-25 shadow-xs">
            <span class="pulsing-live-dot me-2"></span>
            <span class="fw-semibold">Official Digital Cadastral Portal</span>
          </div>

          <h1 class="display-3 fw-bolder text-dark mb-3 hero-title">
            Land Registry
          </h1>

          <p class="text-muted lead fs-6 mx-auto mb-4 hero-subtitle" style="max-width: 640px; line-height: 1.75;">
            Next-generation title deed verification, digital conveyance tracking, and cryptographic fraud deterrence for citizens, landowners, and land officers.
          </p>
        </div>

        <!-- 3 Feature Highlight Cards (Nikitin Dribbble Design) -->
        <div class="row g-4 mb-5">
          <div class="col-12 col-md-4">
            <div class="dash-card card-dark h-100 p-4 d-flex flex-column justify-content-between feature-card">
              <div>
                <div class="avatar-circle bg-warning text-dark mb-3">
                  <i class="bi bi-shield-check fs-4"></i>
                </div>
                <h5 class="fw-bold text-white mb-2">Zero Fraud Guarantee</h5>
                <p class="text-secondary small mb-0" style="line-height: 1.6;">
                  Every registered title generates a 32-byte cryptographic token preventing double allocation, forged deeds, and unauthorized boundary alterations.
                </p>
              </div>
              <div class="mt-4 pt-3 border-top border-secondary border-opacity-25 d-flex justify-content-between align-items-center small text-warning">
                <span>100% Immutable Cadastre</span>
                <i class="bi bi-lock-fill"></i>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="dash-card card-yellow h-100 p-4 d-flex flex-column justify-content-between feature-card">
              <div>
                <div class="avatar-circle bg-dark text-warning mb-3">
                  <i class="bi bi-arrow-left-right fs-4"></i>
                </div>
                <h5 class="fw-bold text-dark mb-2">Paperless Conveyancing</h5>
                <p class="text-dark small mb-0" style="line-height: 1.6;">
                  Lodge ownership transfers online, compute automated stamp duty, and complete registrar sign-offs with an exhaustive audit trail.
                </p>
              </div>
              <div class="mt-4 pt-3 border-top border-dark border-opacity-10 d-flex justify-content-between align-items-center small text-dark fw-bold">
                <span>Automated Stamp Duty</span>
                <i class="bi bi-check2-circle"></i>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="dash-card h-100 p-4 d-flex flex-column justify-content-between feature-card">
              <div>
                <div class="avatar-circle bg-light text-primary mb-3">
                  <i class="bi bi-qr-code-scan fs-4"></i>
                </div>
                <h5 class="fw-bold text-dark mb-2">Public Deed Inquiries</h5>
                <p class="text-muted small mb-0" style="line-height: 1.6;">
                  Verify title deeds instantaneously from any desktop or mobile browser before committing earnest funds or entering purchase agreements.
                </p>
              </div>
              <div class="mt-4 pt-3 border-top small text-primary fw-semibold d-flex justify-content-between align-items-center">
                <span>Instant Citizen Service</span>
                <i class="bi bi-lightning-charge-fill"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- How It Works Flow -->
        <div class="mb-5">
          <div class="text-center mb-4">
            <h4 class="fw-bold text-dark mb-1">Simple, Transparent Cadastral Workflow</h4>
            <p class="text-muted small">How our national digital infrastructure protects property ownership</p>
          </div>

          <div class="row g-3">
            <div class="col-12 col-md-4">
              <div class="dash-card h-100 p-4 border bg-white">
                <div class="badge rounded-circle bg-dark text-white mb-3 d-flex align-items-center justify-content-center" style="width: 32px; height: 32px; font-weight: 700;">
                  1
                </div>
                <h6 class="fw-bold text-dark mb-2">Geospatial Mapping</h6>
                <p class="text-muted small mb-0">
                  Land officers register boundary coordinates and assign verified ownership to official National ID holders.
                </p>
              </div>
            </div>

            <div class="col-12 col-md-4">
              <div class="dash-card h-100 p-4 border bg-white">
                <div class="badge rounded-circle bg-warning text-dark mb-3 d-flex align-items-center justify-content-center" style="width: 32px; height: 32px; font-weight: 700;">
                  2
                </div>
                <h6 class="fw-bold text-dark mb-2">Cryptographic Seal</h6>
                <p class="text-muted small mb-0">
                  Each title deed receives a cryptographic token and QR seal permanently timestamped in the audit logs.
                </p>
              </div>
            </div>

            <div class="col-12 col-md-4">
              <div class="dash-card h-100 p-4 border bg-white">
                <div class="badge rounded-circle bg-success text-white mb-3 d-flex align-items-center justify-content-center" style="width: 32px; height: 32px; font-weight: 700;">
                  3
                </div>
                <h6 class="fw-bold text-dark mb-2">Instant Public Inquiry</h6>
                <p class="text-muted small mb-0">
                  Citizens and financial institutions verify ownership status in real-time, eliminating land fraudsters.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Metrics Strip -->
        <div class="dash-card p-4 bg-white border-0 shadow-sm">
          <div class="row text-center g-4">
            <div class="col-6 col-md-3">
              <div class="display-6 fw-bold text-dark mb-1">47</div>
              <div class="text-muted small">Counties Connected</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="display-6 fw-bold text-dark mb-1">99.9%</div>
              <div class="text-muted small">Registry Uptime</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="display-6 fw-bold text-dark mb-1">&lt; 2s</div>
              <div class="text-muted small">Verification Speed</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="display-6 fw-bold text-dark mb-1">256-Bit</div>
              <div class="text-muted small">TLS &amp; Ledger Security</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Clean Footer -->
    <footer class="py-4 text-center text-muted small border-top bg-white">
      <div class="container">
        <p class="mb-1 fw-semibold text-dark">Republic of Kenya • Ministry of Lands &amp; Physical Planning</p>
        <p class="mb-0 text-muted" style="font-size: 0.75rem;">Ardhi House, 1st Ngong Avenue, Nairobi • Official Land Registry System</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>

<style scoped>
.homepage-wrapper {
  min-height: 100vh;
  background: #f4f5f8;
}

.hero-container {
  background: radial-gradient(1200px circle at 50% 10%, rgba(246, 197, 53, 0.16) 0%, rgba(61, 112, 245, 0.04) 45%, transparent 75%);
}

.hero-title {
  letter-spacing: -1.2px;
}

.pulsing-live-dot {
  width: 8px;
  height: 8px;
  background-color: #10b981;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  animation: pulse-green 2s infinite;
}

@keyframes pulse-green {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 7px rgba(16, 185, 129, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}

.feature-card {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 28px -4px rgba(18, 21, 28, 0.1) !important;
}

.shadow-xs {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
</style>
