<template>
  <div class="main-layout-container">
    <Navbar />
    <main class="flex-grow-1 p-3 p-md-4 p-xl-5">
      <!-- Header -->
      <div class="mb-4">
        <span class="badge badge-pill-custom badge-soft-blue mb-2">
          <i class="bi bi-arrow-left-right"></i> Transfer Management
        </span>
        <h1 class="fw-bold text-dark fs-2 mb-1">My Transfers</h1>
        <p class="text-muted mb-0">View and manage your land ownership transfer requests</p>
      </div>

      <!-- Statistics Cards -->
      <div class="row g-3 mb-4">
        <div class="col-6 col-md-3">
          <div class="dash-card h-100">
            <div class="d-flex align-items-center gap-3">
              <div class="avatar-circle bg-warning text-dark">
                <i class="bi bi-hourglass-split"></i>
              </div>
              <div>
                <div class="display-6 fw-bold">{{ stats.pending }}</div>
                <small class="text-muted">Pending</small>
              </div>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="dash-card h-100">
            <div class="d-flex align-items-center gap-3">
              <div class="avatar-circle bg-success text-white">
                <i class="bi bi-check-circle-fill"></i>
              </div>
              <div>
                <div class="display-6 fw-bold">{{ stats.approved }}</div>
                <small class="text-muted">Approved</small>
              </div>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="dash-card h-100">
            <div class="d-flex align-items-center gap-3">
              <div class="avatar-circle bg-danger text-white">
                <i class="bi bi-x-circle-fill"></i>
              </div>
              <div>
                <div class="display-6 fw-bold">{{ stats.rejected }}</div>
                <small class="text-muted">Rejected</small>
              </div>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="dash-card h-100">
            <div class="d-flex align-items-center gap-3">
              <div class="avatar-circle bg-primary text-white">
                <i class="bi bi-collection"></i>
              </div>
              <div>
                <div class="display-6 fw-bold">{{ stats.total }}</div>
                <small class="text-muted">Total</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Transfers Table -->
      <div class="dash-card">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h5 class="fw-bold mb-0">
            <i class="bi bi-list-ul me-2"></i>All Transfer Requests
          </h5>
          <div class="d-flex gap-2">
            <button @click="showTransferModal = true" class="btn btn-primary btn-sm">
              <i class="bi bi-plus-circle me-1"></i>Initiate Transfer
            </button>
            <select v-model="statusFilter" @change="filterTransfers" class="form-select form-select-sm" style="width: auto;">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="text-muted mt-2 small">Loading transfers...</p>
        </div>

        <div v-else-if="filteredTransfers.length === 0" class="text-center py-5">
          <div class="avatar-circle bg-light text-muted mx-auto mb-3" style="width: 64px; height: 64px; font-size: 1.5rem;">
            <i class="bi bi-inbox"></i>
          </div>
          <h6 class="fw-bold text-dark mb-2">No Transfer Requests</h6>
          <p class="text-muted small mb-0">You haven't been involved in any transfer requests yet</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr style="border-bottom: 2px solid #e5e7eb;">
                <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.7rem;">Parcel</th>
                <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.7rem;">From</th>
                <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.7rem;">To</th>
                <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.7rem;">Type</th>
                <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.7rem;">Date</th>
                <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.7rem;">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="transfer in filteredTransfers" :key="transfer._id" style="border-bottom: 1px solid #f3f4f6;">
                <td class="py-3">
                  <div class="fw-semibold">{{ transfer.landParcel?.parcelNumber || 'N/A' }}</div>
                  <small class="text-muted">{{ transfer.landParcel?.location?.county }}</small>
                </td>
                <td class="py-3">
                  <div class="small">{{ transfer.previousOwner?.fullName || 'N/A' }}</div>
                  <small class="text-muted">{{ transfer.previousOwner?.nationalId }}</small>
                </td>
                <td class="py-3">
                  <div class="small fw-semibold">{{ transfer.newOwner?.fullName || 'N/A' }}</div>
                  <small class="text-muted">{{ transfer.newOwner?.nationalId }}</small>
                </td>
                <td class="py-3">
                  <span class="badge bg-light text-dark px-2 py-1">{{ transfer.transferType || 'Sale' }}</span>
                </td>
                <td class="py-3">
                  <small class="text-muted">{{ formatDate(transfer.createdAt) }}</small>
                </td>
                <td class="py-3">
                  <span :class="['badge rounded-pill px-3 py-1', getStatusClass(transfer.status)]">
                    {{ transfer.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Initiate Transfer Modal -->
    <div v-if="showTransferModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog">
        <div class="modal-content border-0 shadow-lg rounded-4">
          <div class="modal-header border-0">
            <div>
              <h5 class="modal-title fw-bold mb-1">
                <i class="bi bi-arrow-left-right me-2 text-primary"></i>Initiate Land Transfer
              </h5>
              <p class="text-muted small mb-0">Transfer ownership of your land parcel</p>
            </div>
            <button type="button" class="btn-close" @click="closeTransferModal"></button>
          </div>
          <div class="modal-body pt-2">
            <form @submit.prevent="submitTransfer">
              <div class="mb-3">
                <label class="form-label fw-semibold text-dark">
                  <i class="bi bi-map me-1"></i>Select Your Parcel *
                </label>
                <select v-model="transferForm.parcelId" class="form-select rounded-3 py-2" required>
                  <option value="">Choose a parcel...</option>
                  <option v-for="parcel in myParcels" :key="parcel._id" :value="parcel._id">
                    {{ parcel.parcelNumber }} - {{ parcel.location?.county }} ({{ parcel.sizeInAcres }} acres)
                  </option>
                </select>
                <small class="text-muted">Select the land parcel you wish to transfer</small>
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold text-dark">
                  <i class="bi bi-person-badge me-1"></i>New Owner National ID *
                </label>
                <input 
                  v-model="transferForm.newOwnerId" 
                  type="text" 
                  class="form-control rounded-3 py-2" 
                  placeholder="e.g., 12345678" 
                  required
                  maxlength="8"
                  pattern="[0-9]{8}"
                >
                <small class="text-muted">Enter the 8-digit National ID of the new owner</small>
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold text-dark">
                  <i class="bi bi-tag me-1"></i>Transfer Type *
                </label>
                <select v-model="transferForm.transferType" class="form-select rounded-3 py-2" required>
                  <option value="">Select transfer type...</option>
                  <option value="sale">Sale - Purchased property</option>
                  <option value="gift">Gift - Family transfer</option>
                  <option value="inheritance">Inheritance - Succession</option>
                  <option value="court_order">Court Order</option>
                </select>
                <small class="text-muted">Choose the reason for this transfer</small>
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold text-dark">
                  <i class="bi bi-pencil me-1"></i>Additional Notes (Optional)
                </label>
                <textarea 
                  v-model="transferForm.notes" 
                  class="form-control rounded-3" 
                  rows="3"
                  placeholder="Add any relevant information about this transfer..."
                ></textarea>
                <small class="text-muted">Provide any additional details or context</small>
              </div>

              <div v-if="transferError" class="alert alert-danger d-flex align-items-center rounded-3 mb-3">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                <div>{{ transferError }}</div>
              </div>
              
              <div v-if="transferSuccess" class="alert alert-success d-flex align-items-center rounded-3 mb-3">
                <i class="bi bi-check-circle-fill me-2"></i>
                <div>{{ transferSuccess }}</div>
              </div>

              <div class="alert alert-info d-flex align-items-start rounded-3 mb-0">
                <i class="bi bi-info-circle-fill me-2 mt-1"></i>
                <small>
                  <strong>Important:</strong> Once submitted, your transfer request will be reviewed by land officers. 
                  You will be notified when it's approved or if additional information is needed.
                </small>
              </div>
            </form>
          </div>
          <div class="modal-footer border-0 bg-light rounded-bottom-4">
            <button type="button" class="btn btn-light rounded-pill px-4" @click="closeTransferModal">
              <i class="bi bi-x-circle me-1"></i>Cancel
            </button>
            <button type="button" class="btn btn-primary rounded-pill px-4" @click="submitTransfer" :disabled="transferLoading">
              <span v-if="transferLoading" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-send-fill me-1"></i>
              {{ transferLoading ? 'Submitting...' : 'Submit Transfer' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'
import api from '@/services/api'

export default {
  name: 'MyTransfers',
  components: { Navbar },
  setup() {
    const authStore = useAuthStore()
    const user = computed(() => authStore.user)

    const loading = ref(false)
    const transfers = ref([])
    const statusFilter = ref('all')
    const myParcels = ref([])

    // Transfer Modal
    const showTransferModal = ref(false)
    const transferForm = ref({
      parcelId: '',
      newOwnerId: '',
      transferType: '',
      notes: ''
    })
    const transferLoading = ref(false)
    const transferError = ref(null)
    const transferSuccess = ref(null)

    const stats = computed(() => {
      return {
        pending: transfers.value.filter(t => t.status === 'pending').length,
        approved: transfers.value.filter(t => t.status === 'approved' || t.status === 'completed').length,
        rejected: transfers.value.filter(t => t.status === 'rejected').length,
        total: transfers.value.length
      }
    })

    const filteredTransfers = computed(() => {
      if (statusFilter.value === 'all') return transfers.value
      return transfers.value.filter(t => t.status === statusFilter.value)
    })

    const fetchTransfers = async () => {
      loading.value = true
      try {
        const response = await api.get('/transfers')
        if (response.data?.data?.transfers) {
          // Backend already filters for land owners, just use the data directly
          transfers.value = response.data.data.transfers
        }
      } catch (err) {
        console.error('Error fetching transfers:', err)
      } finally {
        loading.value = false
      }
    }

    const fetchMyParcels = async () => {
      try {
        const response = await api.get('/parcels/my-parcels')
        if (response.data?.data?.parcels) {
          myParcels.value = response.data.data.parcels
        }
      } catch (err) {
        console.error('Error fetching parcels:', err)
      }
    }

    const submitTransfer = async () => {
      transferLoading.value = true
      transferError.value = null
      transferSuccess.value = null

      try {
        await api.post('/transfers', {
          landParcel: transferForm.value.parcelId,
          newOwnerNationalId: transferForm.value.newOwnerId,
          transferType: transferForm.value.transferType,
          notes: transferForm.value.notes || ''
        })

        transferSuccess.value = 'Transfer request submitted successfully! Land officers have been notified.'
        setTimeout(() => {
          closeTransferModal()
          fetchTransfers()
        }, 2000)
      } catch (err) {
        transferError.value = err.response?.data?.message || 'Failed to submit transfer request. Please try again.'
        setTimeout(() => {
          closeTransferModal()
        }, 3000)
      } finally {
        transferLoading.value = false
      }
    }

    const closeTransferModal = () => {
      showTransferModal.value = false
      transferForm.value = {
        parcelId: '',
        newOwnerId: '',
        transferType: '',
        notes: ''
      }
      transferError.value = null
      transferSuccess.value = null
    }

    const filterTransfers = () => {
      // Filtering is handled by computed property
    }

    const formatDate = (date) => {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('en-KE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const getStatusClass = (status) => {
      const classes = {
        'pending': 'bg-warning text-dark',
        'approved': 'bg-success text-white',
        'completed': 'bg-success text-white',
        'rejected': 'bg-danger text-white',
        'cancelled': 'bg-secondary text-white'
      }
      return classes[status?.toLowerCase()] || 'bg-secondary text-white'
    }

    onMounted(() => {
      fetchTransfers()
      fetchMyParcels()
    })

    return {
      loading,
      transfers,
      filteredTransfers,
      statusFilter,
      stats,
      myParcels,
      showTransferModal,
      transferForm,
      transferLoading,
      transferError,
      transferSuccess,
      filterTransfers,
      submitTransfer,
      closeTransferModal,
      formatDate,
      getStatusClass
    }
  }
}
</script>

<style scoped>
.table tbody tr {
  transition: background-color 0.2s ease;
}

.table tbody tr:hover {
  background-color: #f9fafb;
}
</style>
