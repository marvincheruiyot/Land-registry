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
                  <div class="small">{{ transfer.currentOwner?.fullName || 'N/A' }}</div>
                  <small class="text-muted">{{ transfer.currentOwner?.nationalId }}</small>
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
          // Filter transfers where current user is either currentOwner or newOwner
          transfers.value = response.data.data.transfers.filter(t => 
            t.currentOwner?._id === user.value.id || t.newOwner?._id === user.value.id
          )
        }
      } catch (err) {
        console.error('Error fetching transfers:', err)
      } finally {
        loading.value = false
      }
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
    })

    return {
      loading,
      transfers,
      filteredTransfers,
      statusFilter,
      stats,
      filterTransfers,
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
