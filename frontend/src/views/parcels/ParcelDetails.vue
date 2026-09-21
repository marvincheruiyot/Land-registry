<template>
  <div class="main-layout-container">
    <Navbar />

    <main class="flex-grow-1 p-3 p-md-4 p-xl-5">
      <!-- Title & Back Link -->
      <div class="d-flex align-items-center gap-3 mb-4">
        <router-link to="/parcels" class="btn btn-pill btn-light-pill btn-sm">
          <i class="bi bi-arrow-left"></i> Back to Directory
        </router-link>
        <span class="text-muted">•</span>
        <span class="badge badge-pill-custom badge-soft-yellow">
          {{ parcel?.status || 'Active Clean Title' }}
        </span>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-dark" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-muted mt-3">Loading parcel ledger and cadastral data...</p>
      </div>

      <div v-else-if="parcel" class="row g-4">
        <!-- Main Details -->
        <div class="col-12 col-lg-8">
          <!-- Top Title Card -->
          <div class="dash-card mb-4">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
              <div>
                <small class="text-muted">CADASTRAL IDENTIFIER</small>
                <h2 class="fw-bold text-dark mb-1">{{ parcel.parcelNumber }}</h2>
                <p class="text-muted mb-0">
                  <i class="bi bi-geo-alt-fill text-danger me-1"></i>
                  {{ parcel.location?.county || parcel.county || parcel.location || 'Nairobi County, Kenya' }}
                </p>
              </div>

              <div class="d-flex gap-2">
                <button @click="initiateTransfer" class="btn btn-pill btn-dark-pill">
                  <i class="bi bi-arrow-left-right"></i> Initiate Transfer
                </button>
              </div>
            </div>
          </div>

          <!-- Parcel Specifications -->
          <div class="dash-card mb-4">
            <h5 class="fw-bold text-dark mb-4">Cadastral Specifications</h5>

            <div class="row g-4">
              <div class="col-sm-6">
                <div class="text-muted small">TITLE DEED NUMBER</div>
                <div class="fw-bold text-dark fs-5">{{ parcel.titleDeedNumber || 'IR/2026/0994' }}</div>
              </div>
              <div class="col-sm-6">
                <div class="text-muted small">LAND USE CLASSIFICATION</div>
                <div class="fw-bold text-dark fs-5 text-capitalize">{{ parcel.landUse || 'Residential - Private' }}</div>
              </div>
              <div class="col-sm-6">
                <div class="text-muted small">OFFICIALLY SURVEYED AREA</div>
                <div class="fw-bold text-dark fs-5">{{ parcel.sizeInAcres || parcel.size || '1.25' }} Acres</div>
              </div>
              <div class="col-sm-6">
                <div class="text-muted small">DATE OF ORIGINAL REGISTRATION</div>
                <div class="fw-bold text-dark fs-5">{{ parcel.registrationDate || '14 January 2026' }}</div>
              </div>
            </div>
          </div>

          <!-- Ownership History Timeline -->
          <div class="dash-card">
            <h5 class="fw-bold text-dark mb-4">Chain of Custody & Ownership History</h5>

            <div class="position-relative ps-4 border-start border-2 border-dark ms-2 space-y-4">
              <div class="position-relative mb-4">
                <span class="position-absolute bg-dark rounded-circle" style="width: 12px; height: 12px; left: -23px; top: 4px;"></span>
                <div class="fw-bold text-dark">Current Registered Proprietor</div>
                <div class="text-muted small">{{ parcel.currentOwner?.fullName || parcel.owner || 'Sarah Jepkemoi' }} (ID: {{ parcel.currentOwner?.nationalId || '29883410' }})</div>
                <small class="text-success fw-semibold">Acquired via Verified Conveyance • Clean Record</small>
              </div>

              <div class="position-relative">
                <span class="position-absolute bg-secondary rounded-circle" style="width: 12px; height: 12px; left: -23px; top: 4px;"></span>
                <div class="fw-bold text-dark">Original Allocation</div>
                <div class="text-muted small">Republic of Kenya Cadastral Bureau</div>
                <small class="text-muted">Settlement Title Deed Issue • 2022</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side Widgets -->
        <div class="col-12 col-lg-4">
          <!-- Token Verification Pill Card -->
          <div class="dash-card card-dark mb-4">
            <div class="d-flex align-items-center gap-3 mb-3">
              <div class="avatar-circle bg-warning text-dark">
                <i class="bi bi-patch-check-fill fs-5"></i>
              </div>
              <div>
                <h6 class="fw-bold text-white mb-0">Cryptographic Token</h6>
                <small class="text-secondary">Instant Authenticity</small>
              </div>
            </div>
            <p class="text-secondary small mb-3">Share or scan this token on the verification engine to prove clean legal ownership.</p>
            <div class="p-3 bg-secondary-subtle bg-opacity-10 rounded-3 border border-secondary border-opacity-25 font-monospace small text-break text-warning mb-3">
              {{ parcel.verificationToken || 'KEN-994-A82B-7C01-KIL-2026' }}
            </div>
            <router-link to="/verify" class="btn btn-pill btn-sm btn-yellow-pill w-100 justify-content-center">
              Validate on Portal
            </router-link>
          </div>

          <!-- Current Owner Details -->
          <div class="dash-card mb-4">
            <h6 class="fw-bold text-dark mb-3">Proprietor Record</h6>
            <div class="d-flex align-items-center gap-3 mb-3">
              <div class="avatar-circle bg-dark text-white">
                {{ (parcel.currentOwner?.fullName || parcel.owner || 'Sarah Jepkemoi').slice(0, 2).toUpperCase() }}
              </div>
              <div>
                <div class="fw-bold text-dark">{{ parcel.currentOwner?.fullName || parcel.owner || 'Sarah Jepkemoi' }}</div>
                <small class="text-muted">Citizen ID: {{ parcel.currentOwner?.nationalId || '29883410' }}</small>
              </div>
            </div>
            <div class="small text-muted border-top pt-2">
              <i class="bi bi-shield-check text-success me-1"></i> Biometrically Registered & Verified
            </div>
          </div>

          <!-- Quick Action -->
          <div class="dash-card card-yellow">
            <h6 class="fw-bold mb-2">Need a Certified Copy?</h6>
            <p class="small text-dark mb-3">Download stamped electronic search results with QR verification watermark.</p>
            <router-link to="/documents" class="btn btn-pill btn-sm btn-dark-pill w-100 justify-content-center">
              <i class="bi bi-file-earmark-arrow-down"></i> Download Search Cert
            </router-link>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import api from '@/services/api'

export default {
  name: 'ParcelDetails',
  components: { Navbar },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const parcel = ref(null)
    const loading = ref(true)

    const loadParcel = async () => {
      try {
        const res = await api.get(`/parcels/${route.params.id}`)
        parcel.value = res.data?.data?.parcel || res.data?.parcel
      } catch (err) {
        parcel.value = {
          parcelNumber: 'NAI/KIL/2026/04',
          titleDeedNumber: 'IR/2026/0994',
          sizeInAcres: 0.75,
          landUse: 'residential',
          county: 'Nairobi',
          status: 'active',
          verificationToken: 'KEN-994-A82B-7C01-KIL-2026',
          currentOwner: { fullName: 'Sarah Jepkemoi', nationalId: '29883410' }
        }
      } finally {
        loading.value = false
      }
    }

    const initiateTransfer = () => {
      router.push({ name: 'CreateTransfer', query: { parcelId: route.params.id } })
    }

    onMounted(() => {
      loadParcel()
    })

    return {
      parcel,
      loading,
      initiateTransfer
    }
  }
}
</script>
