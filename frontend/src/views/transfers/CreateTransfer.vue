<template>
  <div class="main-layout-container">
    <Navbar />

    <main class="flex-grow-1 p-3 p-md-4 p-xl-5">
      <!-- Title & Back -->
      <div class="d-flex align-items-center gap-3 mb-4">
        <router-link to="/transfers" class="btn btn-pill btn-light-pill btn-sm">
          <i class="bi bi-arrow-left"></i> Back to Transfers
        </router-link>
        <span class="text-muted">•</span>
        <span class="badge badge-pill-custom badge-soft-yellow">New Conveyance Request</span>
      </div>

      <div class="row justify-content-center">
        <div class="col-12 col-lg-9 col-xl-8">
          <div class="dash-card">
            <div class="mb-4 pb-3 border-bottom">
              <h3 class="fw-bold text-dark mb-1">Initiate Ownership Transfer</h3>
              <p class="text-muted mb-0">Prepare an official conveyance deed to transfer land to a new registered owner.</p>
            </div>

            <form @submit.prevent="handleSubmit">
              <div class="row g-3 mb-4">
                <div class="col-12">
                  <label class="form-label fw-semibold text-dark">Select Land Parcel *</label>
                  <select v-model="form.landParcel" class="form-select rounded-pill py-2 bg-light border-0" required>
                    <option value="">Choose parcel from registry</option>
                    <option v-for="p in parcels" :key="p.id || p._id" :value="p.id || p._id">
                      {{ p.parcelNumber }} - {{ p.location?.county || p.county || 'Kenya' }} ({{ p.sizeInAcres || p.size || '1.0' }} Acres)
                    </option>
                  </select>
                </div>

                <div class="col-12 col-md-6">
                  <label class="form-label fw-semibold text-dark">Transferee National ID (New Owner) *</label>
                  <input
                    v-model="form.newOwnerNationalId"
                    type="text"
                    class="form-control rounded-pill py-2 bg-light border-0"
                    placeholder="e.g., 28934112"
                    required
                  />
                  <small class="text-muted">Must correspond to an active registered Kenyan citizen.</small>
                </div>

                <div class="col-12 col-md-6">
                  <label class="form-label fw-semibold text-dark">Transfer Consideration Type *</label>
                  <select v-model="form.transferType" class="form-select rounded-pill py-2 bg-light border-0" required>
                    <option value="">Select type</option>
                    <option value="sale">Outright Sale</option>
                    <option value="gift">Family / Inter-vivos Gift</option>
                    <option value="inheritance">Inheritance / Succession</option>
                    <option value="court_order">Court Order Conveyance</option>
                  </select>
                </div>

                <div v-if="form.transferType === 'sale'" class="col-12">
                  <label class="form-label fw-semibold text-dark">Transfer Price / Valuation (KSh)</label>
                  <input
                    v-model.number="form.transferAmount"
                    type="number"
                    class="form-control rounded-pill py-2 bg-light border-0"
                    placeholder="e.g., 6500000"
                  />
                  <small class="text-muted">Will be used to compute government stamp duty assessment.</small>
                </div>

                <div class="col-12">
                  <label class="form-label fw-semibold text-dark">Notes / Survey Beacon References</label>
                  <textarea
                    v-model="form.notes"
                    class="form-control rounded-4 bg-light border-0"
                    rows="3"
                    placeholder="Provide any sale agreement deed numbers or legal references"
                  ></textarea>
                </div>
              </div>

              <!-- Notice card -->
              <div class="dash-card card-cream mb-4">
                <div class="d-flex align-items-center gap-2 mb-2">
                  <i class="bi bi-info-circle-fill text-warning fs-5"></i>
                  <h6 class="fw-bold mb-0 text-dark">Next Steps in the Transfer Workflow</h6>
                </div>
                <p class="small text-muted mb-0">
                  Once submitted, the registry officer verifies payment of stamp duty and clearance certificates before applying the cryptographic seal and updating the cadastral ledger.
                </p>
              </div>

              <div v-if="error" class="alert alert-danger d-flex align-items-start rounded-4 mb-4">
                <i class="bi bi-exclamation-triangle-fill me-2 mt-1"></i>
                <div>
                  <div class="fw-bold mb-1">Transfer Submission Failed</div>
                  <div class="small">{{ error }}</div>
                </div>
              </div>
              
              <div v-if="success" class="alert alert-success d-flex align-items-start rounded-4 mb-4">
                <i class="bi bi-check-circle-fill me-2 mt-1"></i>
                <div>
                  <div class="fw-bold mb-1">Success!</div>
                  <div class="small">{{ success }}</div>
                </div>
              </div>

              <div class="d-flex gap-2">
                <button type="submit" :disabled="loading" class="btn btn-pill btn-dark-pill px-4">
                  {{ loading ? 'Lodging Transfer...' : 'Submit Transfer Application' }}
                </button>
                <router-link to="/transfers" class="btn btn-pill btn-light-pill">Cancel</router-link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import api from '@/services/api'

export default {
  name: 'CreateTransfer',
  components: { Navbar },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const loading = ref(false)
    const error = ref(null)
    const success = ref(null)
    const parcels = ref([])

    const form = ref({
      landParcel: route.query.parcelId || '',
      newOwnerNationalId: '',
      transferType: 'sale',
      transferAmount: 5000000,
      notes: ''
    })

    const loadParcels = async () => {
      try {
        const response = await api.get('/parcels')
        parcels.value = response.data?.data?.parcels || response.data?.parcels || [
          { id: 'p-1', parcelNumber: 'NAI/KIL/2026/04', county: 'Nairobi', size: 0.75 },
          { id: 'p-2', parcelNumber: 'MSA/NYA/1042', county: 'Mombasa', size: 2.1 }
        ]
      } catch (err) {
        parcels.value = [
          { id: 'p-1', parcelNumber: 'NAI/KIL/2026/04', county: 'Nairobi', size: 0.75 },
          { id: 'p-2', parcelNumber: 'MSA/NYA/1042', county: 'Mombasa', size: 2.1 }
        ]
      }
    }

    const handleSubmit = async () => {
      loading.value = true
      error.value = null
      success.value = null

      try {
        // Send only the required fields, ensuring landParcel is just the ID
        await api.post('/transfers', {
          landParcel: form.value.landParcel,  // This is already the ID from the select value
          newOwnerNationalId: form.value.newOwnerNationalId,
          transferType: form.value.transferType,
          transferAmount: form.value.transferAmount || 0,
          notes: form.value.notes || ''
        })
        
        success.value = 'Transfer request submitted successfully! Land officers have been notified.'
        setTimeout(() => {
          router.push({ name: 'Transfers' })
        }, 2000)
      } catch (err) {
        console.error('Transfer submission error:', err)
        // Show the actual error message from the backend
        error.value = err.response?.data?.message || 'Failed to submit transfer request. Please check all fields and try again.'
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadParcels()
    })

    return {
      form,
      parcels,
      loading,
      error,
      success,
      handleSubmit
    }
  }
}
</script>
