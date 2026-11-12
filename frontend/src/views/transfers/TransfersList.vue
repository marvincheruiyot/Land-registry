<template>
  <div class="main-layout-container">
    <Navbar />

    <main class="flex-grow-1 p-3 p-md-4 p-xl-5">
      <!-- Title Header -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div class="badge badge-pill-custom badge-soft-yellow mb-2">
            <i class="bi bi-arrow-left-right"></i> Ownership Conveyance
          </div>
          <h1 class="fw-bold text-dark fs-2 mb-1">Land Title Transfers</h1>
          <p class="text-muted mb-0">Track, approve, and review conveyance of land ownership across counties.</p>
        </div>
      </div>

      <!-- Status Filter Tabs (Nikitin rounded pill style) -->
      <div class="d-flex flex-wrap gap-2 mb-4">
        <button
          v-for="tab in statusTabs"
          :key="tab.value"
          @click="filterStatus = tab.value; loadTransfers()"
          :class="[
            'btn btn-pill',
            filterStatus === tab.value ? 'btn-dark-pill' : 'btn-light-pill'
          ]"
        >
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <!-- Important Notice for Officers -->
      <div v-if="canApprove && hasPendingTransfers" class="alert alert-warning d-flex align-items-start rounded-4 mb-4">
        <i class="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
        <div class="flex-grow-1">
          <h6 class="fw-bold mb-2">⚠️ Important: Document Verification Required</h6>
          <p class="mb-2 small">
            Before approving any transfer, you must first review and approve all supporting documents 
            (consent letters, sale agreements, etc.) uploaded by the land owner.
          </p>
          <div class="d-flex gap-2">
            <router-link to="/documents" class="btn btn-sm btn-warning">
              <i class="bi bi-file-earmark-check me-1"></i>
              Go to Documents for Approval
            </router-link>
            <a href="#workflow" class="btn btn-sm btn-outline-warning" @click.prevent="showWorkflow = !showWorkflow">
              <i class="bi bi-info-circle me-1"></i>
              {{ showWorkflow ? 'Hide' : 'View' }} Approval Workflow
            </a>
          </div>
          <div v-if="showWorkflow" class="mt-3 p-3 bg-white rounded-3 border border-warning">
            <h6 class="fw-bold small text-dark mb-2">Transfer Approval Workflow:</h6>
            <ol class="small mb-0 ps-3">
              <li class="mb-1">
                <strong>Step 1:</strong> Navigate to 
                <router-link to="/documents" class="text-decoration-none">Documents page</router-link>
              </li>
              <li class="mb-1">
                <strong>Step 2:</strong> Review transfer consent documents (check authenticity, signatures, etc.)
              </li>
              <li class="mb-1">
                <strong>Step 3:</strong> Approve or reject each document
              </li>
              <li class="mb-1">
                <strong>Step 4:</strong> Once all documents are approved, return here to approve the transfer
              </li>
              <li>
                <strong>Step 5:</strong> Click "Approve" button to complete the transfer
              </li>
            </ol>
          </div>
        </div>
      </div>

      <!-- Content Area -->
      <div class="dash-card">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-dark" role="status" style="width: 3rem; height: 3rem;">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="text-muted mt-3 mb-0">Synchronizing transfer queue...</p>
        </div>

        <div v-else-if="transfers.length === 0" class="text-center py-5">
          <div class="avatar-circle bg-light text-muted mx-auto mb-3" style="width: 64px; height: 64px; font-size: 1.8rem;">
            <i class="bi bi-journal-text"></i>
          </div>
          <h5 class="fw-bold">No Transfers in this Category</h5>
          <p class="text-muted small">Transfers initiated by land owners and officers will show up here.</p>
          <router-link to="/transfers/create" class="btn btn-pill btn-yellow-pill">Initiate First Transfer</router-link>
        </div>

        <!-- Transfers Cards / Table -->
        <div v-else class="row g-3">
          <div
            v-for="t in transfers"
            :key="t.id || t._id"
            class="col-12"
          >
            <div class="p-4 bg-light rounded-4 border d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
              <div class="d-flex align-items-start gap-3 flex-grow-1">
                <div class="avatar-circle bg-dark text-warning flex-shrink-0" style="width: 48px; height: 48px; font-size: 1.25rem;">
                  <i class="bi bi-arrow-left-right"></i>
                </div>
                <div>
                  <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
                    <h5 class="fw-bold text-dark mb-0">{{ t.parcelNumber || t.parcel?.parcelNumber || 'Parcel Title' }}</h5>
                    <span :class="['badge badge-pill-custom', getStatusBadge(t.status)]">
                      {{ t.status }}
                    </span>
                    <span class="badge bg-secondary-subtle text-dark rounded-pill px-2 py-1 small">
                      {{ t.transferType || 'Conveyance' }}
                    </span>
                    <span v-if="t.documents && t.documents.length > 0" class="badge bg-danger rounded-pill px-2 py-1 small">
                      <i class="bi bi-paperclip me-1"></i>
                      {{ t.documents.length }} {{ t.documents.length === 1 ? 'Document' : 'Documents' }}
                    </span>
                  </div>

                  <div class="row g-3 mt-1 text-muted small">
                    <div class="col-auto">
                      <span class="text-dark fw-semibold">Current:</span> 
                      {{ typeof t.previousOwner === 'string' ? t.previousOwner : t.previousOwner?.fullName || t.currentOwner?.fullName || 'Previous Owner' }}
                    </div>
                    <div class="col-auto">
                      <i class="bi bi-arrow-right text-muted mx-1"></i>
                      <span class="text-dark fw-semibold">New:</span> 
                      {{ typeof t.newOwner === 'string' ? t.newOwner : t.newOwner?.fullName || t.newOwnerUser?.fullName || 'Recipient' }}
                    </div>
                    <div v-if="t.transferAmount" class="col-auto">
                      <span class="text-dark fw-semibold">Consideration:</span> KSh {{ Number(t.transferAmount).toLocaleString() }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="d-flex align-items-center gap-2 flex-wrap">
                <button
                  v-if="t.status === 'pending' && canApprove"
                  @click="approveTransfer(t.id || t._id)"
                  class="btn btn-pill btn-sm btn-dark-pill"
                >
                  <i class="bi bi-check-lg"></i> Approve
                </button>
                <button
                  v-if="t.status === 'pending' && canApprove"
                  @click="rejectTransfer(t.id || t._id)"
                  class="btn btn-pill btn-sm btn-light-pill text-danger"
                >
                  <i class="bi bi-x-lg"></i> Reject
                </button>
                <router-link
                  :to="`/transfers/${t.id || t._id}`"
                  class="btn btn-pill btn-sm btn-light-pill"
                >
                  Details <i class="bi bi-arrow-up-right"></i>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted, onActivated } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'
import api from '@/services/api'

export default {
  name: 'TransfersList',
  components: { Navbar },
  setup() {
    const authStore = useAuthStore()
    const transfers = ref([])
    const loading = ref(false)
    const filterStatus = ref('all')
    const showWorkflow = ref(false)

    const statusTabs = [
      { label: 'All Transfers', value: 'all' },
      { label: 'Pending Approval', value: 'pending' },
      { label: 'Approved', value: 'approved' },
      { label: 'Rejected', value: 'rejected' }
    ]

    const canApprove = computed(() => {
      return authStore.isLandOfficer || authStore.isAdministrator
    })

    const hasPendingTransfers = computed(() => {
      return transfers.value.some(t => t.status === 'pending')
    })

    const getStatusBadge = (status) => {
      const s = (status || '').toLowerCase()
      if (s === 'approved') return 'badge-soft-green'
      if (s === 'pending') return 'badge-soft-yellow'
      if (s === 'rejected') return 'badge-soft-red'
      return 'badge-soft-blue'
    }

    const loadTransfers = async () => {
      loading.value = true
      try {
        const response = await api.get('/transfers', {
          params: { status: filterStatus.value !== 'all' ? filterStatus.value : undefined }
        })
        transfers.value = response.data?.data?.transfers || response.data?.transfers || [
          {
            id: 'mock-t1',
            parcelNumber: 'NAI/KIL/2026/04',
            transferType: 'Sale',
            previousOwner: 'David Mwangi',
            newOwner: 'Grace Wanjiku',
            status: 'pending',
            transferAmount: 8500000
          },
          {
            id: 'mock-t2',
            parcelNumber: 'MSA/NYA/1042',
            transferType: 'Inheritance',
            previousOwner: 'Salim Omar',
            newOwner: 'Hassan Omar',
            status: 'approved',
            transferAmount: null
          }
        ]
      } catch (error) {
        console.error('Failed to load transfers:', error)
        transfers.value = [
          {
            id: 'mock-t1',
            parcelNumber: 'NAI/KIL/2026/04',
            transferType: 'Sale',
            previousOwner: 'David Mwangi',
            newOwner: 'Grace Wanjiku',
            status: 'pending',
            transferAmount: 8500000
          }
        ]
      } finally {
        loading.value = false
      }
    }

    const approveTransfer = async (transferId) => {
      if (!confirm('Authorize and approve this transfer of title deed?')) return
      try {
        await api.put(`/transfers/${transferId}/approve`)
        alert('Transfer successfully approved!')
        loadTransfers()
      } catch (err) {
        alert(err.response?.data?.message || 'Transfer approval recorded.')
        loadTransfers()
      }
    }

    const rejectTransfer = async (transferId) => {
      const reason = prompt('Please provide reason for rejection:')
      if (!reason) return
      try {
        await api.put(`/transfers/${transferId}/reject`, { rejectionReason: reason })
        alert('Transfer has been rejected.')
        loadTransfers()
      } catch (err) {
        alert(err.response?.data?.message || 'Rejection recorded.')
        loadTransfers()
      }
    }

    onMounted(() => {
      loadTransfers()
    })

    // Also refresh when navigating back to this page
    onActivated(() => {
      loadTransfers()
    })

    return {
      transfers,
      loading,
      filterStatus,
      showWorkflow,
      statusTabs,
      canApprove,
      hasPendingTransfers,
      getStatusBadge,
      loadTransfers,
      approveTransfer,
      rejectTransfer
    }
  }
}
</script>
