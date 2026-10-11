<template>
  <div class="main-layout-container">
    <Navbar />
    <main class="flex-grow-1 p-3 p-md-4 p-xl-5">
      <!-- Header Section -->
      <div class="mb-4">
        <div class="d-flex align-items-center gap-2 text-muted mb-2" style="font-size: 0.875rem;">
          <i class="bi bi-geo-alt-fill text-warning"></i>
          <span>Kenyan National Cadastral Records</span>
        </div>
        <h1 class="fw-bold mb-2" style="font-size: 1.75rem; color: #1a1a1a;">Land Parcels Directory</h1>
        <p class="text-muted mb-0">Browse registered parcels, ownership chains, and geospatial boundaries.</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="dash-card text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-muted mt-3 mb-0">Loading your parcels...</p>
      </div>

      <!-- No Parcels State -->
      <div v-else-if="myParcels.length === 0" class="dash-card text-center py-5">
        <i class="bi bi-inbox fs-1 text-muted mb-3 d-block"></i>
        <h4 class="fw-bold mb-2">No Land Parcels Found</h4>
        <p class="text-muted mb-4">You don't have any registered land parcels yet.</p>
        <router-link to="/userdashboard" class="btn btn-dark">
          <i class="bi bi-grid-fill me-2"></i>Go to Dashboard
        </router-link>
      </div>

      <!-- Parcels Directory Table -->
      <div v-else class="dash-card">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr style="border-bottom: 2px solid #e5e7eb;">
                <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.75rem; letter-spacing: 0.5px;">
                  PARCEL ID / REGION
                </th>
                <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.75rem; letter-spacing: 0.5px;">
                  CURRENT OWNER
                </th>
                <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.75rem; letter-spacing: 0.5px;">
                  ACREAGE
                </th>
                <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.75rem; letter-spacing: 0.5px;">
                  USE TYPE
                </th>
                <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.75rem; letter-spacing: 0.5px;">
                  STATUS
                </th>
                <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.75rem; letter-spacing: 0.5px;">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="parcel in myParcels" :key="parcel._id" style="border-bottom: 1px solid #f3f4f6;">
                <!-- Parcel ID / Region -->
                <td class="py-3">
                  <div class="d-flex align-items-center gap-3">
                    <div class="avatar-circle bg-dark text-white" style="width: 42px; height: 42px; font-size: 0.9rem;">
                      <i class="bi bi-geo-alt-fill"></i>
                    </div>
                    <div>
                      <div class="fw-bold text-dark mb-1" style="font-size: 0.9rem;">
                        {{ parcel.parcelNumber }}
                      </div>
                      <div class="text-muted" style="font-size: 0.8rem;">
                        {{ parcel.location?.county || 'N/A' }}
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Current Owner -->
                <td class="py-3">
                  <div class="fw-semibold text-dark" style="font-size: 0.9rem;">
                    {{ parcel.currentOwner?.fullName || user?.fullName || 'N/A' }}
                  </div>
                  <div class="text-muted" style="font-size: 0.8rem;">
                    ID: {{ parcel.currentOwner?.nationalId || user?.nationalId || 'N/A' }}
                  </div>
                </td>

                <!-- Acreage -->
                <td class="py-3">
                  <div class="fw-semibold text-dark" style="font-size: 0.9rem;">
                    {{ parcel.sizeInAcres || 'N/A' }} Acres
                  </div>
                </td>

                <!-- Use Type -->
                <td class="py-3">
                  <div class="text-capitalize" style="font-size: 0.9rem; color: #4b5563;">
                    {{ parcel.landUse || 'N/A' }}
                  </div>
                </td>

                <!-- Status -->
                <td class="py-3">
                  <span class="badge rounded-pill px-3 py-2" 
                        :class="getStatusBadgeClass(parcel.status)"
                        style="font-size: 0.8rem; font-weight: 600;">
                    {{ parcel.status || 'active' }}
                  </span>
                </td>

                <!-- Actions -->
                <td class="py-3">
                  <button @click="viewParcelDetails(parcel)" 
                          class="btn btn-sm btn-light border-0 rounded-pill px-3 py-2"
                          style="font-size: 0.85rem; font-weight: 600; color: #1a1a1a;">
                    Inspect
                    <i class="bi bi-arrow-right ms-1"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer -->
        <div class="d-flex justify-content-between align-items-center pt-4 mt-4" style="border-top: 1px solid #e5e7eb;">
          <div class="text-muted" style="font-size: 0.875rem;">
            Showing {{ myParcels.length }} registered land {{ myParcels.length === 1 ? 'parcel' : 'parcels' }}
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-light border rounded px-3 py-2" disabled style="font-size: 0.85rem;">
              <i class="bi bi-chevron-left"></i> Prev
            </button>
            <button class="btn btn-sm btn-dark rounded px-3 py-2" style="font-size: 0.85rem;">
              Page 1
            </button>
            <button class="btn btn-sm btn-light border rounded px-3 py-2" disabled style="font-size: 0.85rem;">
              Next <i class="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Parcel Details Modal -->
      <div v-if="showParcelModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content border-0 shadow-lg rounded-4">
            <div class="modal-header border-0 pb-0">
              <div>
                <h5 class="modal-title fw-bold">Parcel Details</h5>
                <p class="text-muted small mb-0">Complete information about this land parcel</p>
              </div>
              <button type="button" class="btn-close" @click="showParcelModal = false"></button>
            </div>
            <div class="modal-body pt-2" v-if="selectedParcel">
              <div class="p-4 bg-light rounded-3 mb-4">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 class="fw-bold mb-2">{{ selectedParcel.parcelNumber }}</h5>
                    <span class="badge bg-dark text-white px-3 py-2 text-capitalize">
                      {{ selectedParcel.landUse || 'N/A' }}
                    </span>
                  </div>
                  <span class="badge rounded-pill px-3 py-2" 
                        :class="getStatusBadgeClass(selectedParcel.status)">
                    {{ selectedParcel.status || 'active' }}
                  </span>
                </div>
              </div>

              <div class="row g-4">
                <div class="col-6">
                  <small class="text-muted d-block mb-1 text-uppercase" style="font-size: 0.7rem; letter-spacing: 0.5px;">
                    Current Owner
                  </small>
                  <div class="fw-bold" style="font-size: 0.95rem;">
                    {{ selectedParcel.currentOwner?.fullName || user?.fullName || 'N/A' }}
                  </div>
                  <small class="text-muted">ID: {{ selectedParcel.currentOwner?.nationalId || user?.nationalId || 'N/A' }}</small>
                </div>
                <div class="col-6">
                  <small class="text-muted d-block mb-1 text-uppercase" style="font-size: 0.7rem; letter-spacing: 0.5px;">
                    Title Deed Number
                  </small>
                  <div class="fw-bold" style="font-size: 0.95rem;">
                    {{ selectedParcel.titleDeedNumber || 'Not assigned' }}
                  </div>
                </div>
                <div class="col-6">
                  <small class="text-muted d-block mb-1 text-uppercase" style="font-size: 0.7rem; letter-spacing: 0.5px;">
                    County
                  </small>
                  <div class="fw-bold" style="font-size: 0.95rem;">
                    {{ selectedParcel.location?.county || 'N/A' }}
                  </div>
                </div>
                <div class="col-6">
                  <small class="text-muted d-block mb-1 text-uppercase" style="font-size: 0.7rem; letter-spacing: 0.5px;">
                    Sub-County
                  </small>
                  <div class="fw-bold" style="font-size: 0.95rem;">
                    {{ selectedParcel.location?.subCounty || 'N/A' }}
                  </div>
                </div>
                <div class="col-6">
                  <small class="text-muted d-block mb-1 text-uppercase" style="font-size: 0.7rem; letter-spacing: 0.5px;">
                    Size (Acreage)
                  </small>
                  <div class="fw-bold" style="font-size: 0.95rem;">
                    {{ selectedParcel.sizeInAcres || 'N/A' }} acres
                  </div>
                </div>
                <div class="col-6">
                  <small class="text-muted d-block mb-1 text-uppercase" style="font-size: 0.7rem; letter-spacing: 0.5px;">
                    Registration Date
                  </small>
                  <div class="fw-bold" style="font-size: 0.95rem;">
                    {{ formatDate(selectedParcel.registrationDate) }}
                  </div>
                </div>
                <div class="col-12">
                  <small class="text-muted d-block mb-1 text-uppercase" style="font-size: 0.7rem; letter-spacing: 0.5px;">
                    Location Description
                  </small>
                  <div class="fw-semibold" style="font-size: 0.9rem;">
                    {{ selectedParcel.location?.description || 'No description available' }}
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer border-0 pt-0">
              <button type="button" class="btn btn-light px-4 py-2" @click="showParcelModal = false">
                Close
              </button>
              <button type="button" class="btn btn-dark px-4 py-2">
                <i class="bi bi-arrow-left-right me-2"></i>Transfer Land
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'
import api from '@/services/api'

export default {
  name: 'MyParcels',
  components: { Navbar },
  setup() {
    const authStore = useAuthStore()
    const user = computed(() => authStore.user)

    const loading = ref(false)
    const myParcels = ref([])
    const showParcelModal = ref(false)
    const selectedParcel = ref(null)

    const fetchMyParcels = async () => {
      loading.value = true
      try {
        // Use the correct endpoint: /my-parcels instead of /user/:id
        const response = await api.get('/land-parcels/my-parcels')
        if (response.data?.data?.parcels) {
          myParcels.value = response.data.data.parcels
        }
      } catch (err) {
        console.error('Error fetching parcels:', err)
      } finally {
        loading.value = false
      }
    }

    const viewParcelDetails = (parcel) => {
      selectedParcel.value = parcel
      showParcelModal.value = true
    }

    const getStatusBadgeClass = (status) => {
      const statusMap = {
        'active': 'bg-success text-white',
        'pending': 'bg-warning text-dark',
        'inactive': 'bg-secondary text-white',
        'disputed': 'bg-danger text-white'
      }
      return statusMap[status?.toLowerCase()] || 'bg-success text-white'
    }

    const formatDate = (date) => {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('en-KE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    onMounted(() => {
      if (user.value?.id) {
        fetchMyParcels()
      }
    })

    return {
      user,
      loading,
      myParcels,
      showParcelModal,
      selectedParcel,
      viewParcelDetails,
      getStatusBadgeClass,
      formatDate
    }
  }
}
</script>

<style scoped>
.table th {
  font-weight: 600;
  background-color: transparent;
}

.table tbody tr {
  transition: background-color 0.2s ease;
}

.table tbody tr:hover {
  background-color: #f9fafb;
}

.avatar-circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.btn:hover {
  transform: translateY(-1px);
  transition: all 0.2s ease;
}
</style>
