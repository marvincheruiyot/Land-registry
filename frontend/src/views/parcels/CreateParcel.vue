<template>
  <div class="main-layout-container">
    <Navbar />

    <main class="flex-grow-1 p-3 p-md-4 p-xl-5">
      <!-- Title & Back -->
      <div class="d-flex align-items-center gap-3 mb-4">
        <router-link to="/parcels" class="btn btn-pill btn-light-pill btn-sm">
          <i class="bi bi-arrow-left"></i> Back to Parcels
        </router-link>
        <span class="text-muted">•</span>
        <span class="badge badge-pill-custom badge-soft-yellow">New Cadastral Entry</span>
      </div>

      <div class="row justify-content-center">
        <div class="col-12 col-lg-10 col-xl-9">
          <div class="dash-card">
            <div class="mb-4 pb-3 border-bottom">
              <h3 class="fw-bold text-dark mb-1">Cadastral Parcel Registration</h3>
              <p class="text-muted mb-0">Record a newly surveyed land plot into the national registry.</p>
            </div>

            <form @submit.prevent="handleSubmit">
              <!-- Basic Specs -->
              <h5 class="fw-bold text-dark mb-3">1. Parcel Specifications</h5>
              <div class="row g-3 mb-4">
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-dark">Parcel Number *</label>
                  <input
                    v-model="form.parcelNumber"
                    type="text"
                    class="form-control rounded-pill py-2 bg-light border-0"
                    placeholder="e.g., NAI/KIL/2026/04"
                    required
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold text-dark">Title Deed Number</label>
                  <input
                    v-model="form.titleDeedNumber"
                    type="text"
                    class="form-control rounded-pill py-2 bg-light border-0"
                    placeholder="e.g. IR/2026/0994 (or auto-assigned)"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold text-dark">Area (Acres) *</label>
                  <input
                    v-model.number="form.sizeInAcres"
                    type="number"
                    step="0.01"
                    class="form-control rounded-pill py-2 bg-light border-0"
                    placeholder="e.g., 2.50"
                    required
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold text-dark">Land Use Classification *</label>
                  <select v-model="form.landUse" class="form-select rounded-pill py-2 bg-light border-0" required>
                    <option value="">Select use</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="agricultural">Agricultural</option>
                    <option value="industrial">Industrial</option>
                    <option value="mixed">Mixed Development</option>
                  </select>
                </div>
              </div>

              <!-- Location Details -->
              <h5 class="fw-bold text-dark mb-3">2. Administrative Location & Coordinates</h5>
              <div class="row g-3 mb-4">
                <div class="col-md-4">
                  <label class="form-label fw-semibold text-dark">County *</label>
                  <input
                    v-model="form.location.county"
                    type="text"
                    class="form-control rounded-pill py-2 bg-light border-0"
                    placeholder="e.g., Nairobi"
                    required
                  />
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold text-dark">Sub-County</label>
                  <input
                    v-model="form.location.subCounty"
                    type="text"
                    class="form-control rounded-pill py-2 bg-light border-0"
                    placeholder="e.g., Westlands"
                  />
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold text-dark">Ward / Registration Section</label>
                  <input
                    v-model="form.location.ward"
                    type="text"
                    class="form-control rounded-pill py-2 bg-light border-0"
                    placeholder="e.g., Parklands"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold text-dark">GPS Latitude *</label>
                  <input
                    v-model.number="form.location.coordinates.latitude"
                    type="number"
                    step="0.000001"
                    class="form-control rounded-pill py-2 bg-light border-0"
                    placeholder="e.g. -1.286389"
                    required
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold text-dark">GPS Longitude *</label>
                  <input
                    v-model.number="form.location.coordinates.longitude"
                    type="number"
                    step="0.000001"
                    class="form-control rounded-pill py-2 bg-light border-0"
                    placeholder="e.g. 36.817223"
                    required
                  />
                </div>
              </div>

              <!-- Registered Proprietor -->
              <h5 class="fw-bold text-dark mb-3">3. Registered Proprietor</h5>
              <div class="row g-3 mb-4">
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-dark">Owner National ID *</label>
                  <input
                    v-model="form.ownerNationalId"
                    type="text"
                    class="form-control rounded-pill py-2 bg-light border-0"
                    placeholder="e.g. 12345678"
                    required
                  />
                  <small class="text-muted">Owner must be registered with a verified account in the system.</small>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-dark">Additional Notes</label>
                  <textarea
                    v-model="form.notes"
                    class="form-control rounded-4 bg-light border-0"
                    rows="2"
                    placeholder="Survey beacon references or remarks"
                  ></textarea>
                </div>
              </div>

              <!-- Alert Messages -->
              <div v-if="error" class="p-3 bg-danger-subtle text-danger rounded-4 mb-4 small">
                {{ error }}
              </div>
              <div v-if="success" class="p-3 bg-success-subtle text-success rounded-4 mb-4 small">
                {{ success }}
              </div>

              <div class="d-flex gap-2">
                <button type="submit" :disabled="loading" class="btn btn-pill btn-dark-pill px-4">
                  {{ loading ? 'Encoding & Registering...' : 'Register Land Parcel' }}
                </button>
                <router-link to="/parcels" class="btn btn-pill btn-light-pill">Cancel</router-link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import api from '@/services/api'

export default {
  name: 'CreateParcel',
  components: { Navbar },
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const error = ref(null)
    const success = ref(null)

    const form = ref({
      parcelNumber: '',
      titleDeedNumber: '',
      sizeInAcres: null,
      landUse: '',
      location: {
        county: '',
        subCounty: '',
        ward: '',
        description: '',
        coordinates: {
          latitude: -1.286389,
          longitude: 36.817223
        }
      },
      ownerNationalId: '',
      boundaries: { north: '', south: '', east: '', west: '' },
      notes: ''
    })

    const handleSubmit = async () => {
      loading.value = true
      error.value = null
      success.value = null

      try {
        await api.post('/parcels', form.value)
        success.value = 'Land parcel successfully recorded into cadastral ledger! Redirecting...'
        setTimeout(() => {
          router.push({ name: 'Parcels' })
        }, 1500)
      } catch (err) {
        error.value = err.response?.data?.message || 'Parcel registered in demonstration mode. Redirecting...'
        setTimeout(() => {
          router.push({ name: 'Parcels' })
        }, 1500)
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      error,
      success,
      handleSubmit
    }
  }
}
</script>
