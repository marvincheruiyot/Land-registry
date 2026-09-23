<template>
  <div class="main-layout-container">
    <Navbar />

    <main class="flex-grow-1 p-3 p-md-4 p-xl-5">
      <!-- Top Bar with Search, Actions, Notification & Profile -->
      <div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4 pb-3 border-bottom">
        <!-- Search Bar -->
        <div class="position-relative flex-grow-1" style="max-width: 450px;">
          <i class="bi bi-search position-absolute text-muted" style="left: 1rem; top: 50%; transform: translateY(-50%);"></i>
          <input
            type="search"
            class="form-control rounded-pill ps-5 py-2 bg-light border-0"
            placeholder="Search your parcels..."
            v-model="searchQuery"
          />
        </div>

        <!-- Action Buttons + Notification + Profile -->
        <div class="d-flex align-items-center gap-2">
          <button @click="showTransferModal = true" class="btn btn-pill btn-warning text-dark d-flex align-items-center gap-2 px-4">
            <i class="bi bi-arrow-left-right"></i> Transfer Land
          </button>
          <router-link to="/verify" class="btn btn-pill btn-dark-pill d-flex align-items-center gap-2 px-4">
            <i class="bi bi-shield-check"></i> Verify
          </router-link>
          
          <!-- Notification Bell -->
          <button class="btn btn-light-pill rounded-circle p-2 position-relative" style="width: 42px; height: 42px;">
            <i class="bi bi-bell fs-6"></i>
            <span v-if="notifications.length > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.65rem;">
              {{ notifications.length }}
            </span>
          </button>

          <!-- Profile Dropdown -->
          <div class="dropdown">
            <button class="btn btn-light-pill rounded-circle p-0 d-flex align-items-center justify-content-center" style="width: 42px; height: 42px;" data-bs-toggle="dropdown">
              <span class="fw-bold text-dark">{{ user?.fullName?.charAt(0) || 'U' }}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2">
              <li><router-link class="dropdown-item" to="/profile"><i class="bi bi-person me-2"></i>Profile</router-link></li>
              <li><router-link class="dropdown-item" to="/settings"><i class="bi bi-gear me-2"></i>Settings</router-link></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item text-danger" href="#" @click.prevent="handleLogout"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Welcome Section -->
      <div class="mb-4">
        <span class="badge badge-pill-custom badge-soft-blue mb-2">
          <i class="bi bi-person-circle"></i> Land Owner Portal
        </span>
        <h1 class="fw-bold text-dark fs-2 mb-1">Welcome, {{ user?.fullName || 'Land Owner' }}</h1>
        <p class="text-muted mb-0">Manage your land parcels, track transfers, and access documents.</p>
      </div>

      <!-- Statistics Cards -->
      <div class="row g-4 mb-4">
        <!-- My Parcels -->
        <div class="col-12 col-md-6 col-xl-3">
          <div class="dash-card card-dark h-100">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="avatar-circle bg-dark-subtle text-white">
                <i class="bi bi-map fs-5"></i>
              </div>
              <span class="badge bg-secondary-subtle text-light rounded-pill px-3 py-1">
                Owned
              </span>
            </div>
            <div>
              <div class="display-5 fw-bold mb-1 lh-1">{{ stats.myParcels }}</div>
              <div class="text-secondary small fw-medium">My Land Parcels</div>
            </div>
            <div class="mt-4 pt-3 border-top border-secondary border-opacity-25">
              <small class="text-secondary">Total area: {{ stats.totalArea }} acres</small>
            </div>
          </div>
        </div>

        <!-- Active Transfers -->
        <div class="col-12 col-md-6 col-xl-3">
          <div class="dash-card card-yellow h-100">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="avatar-circle bg-dark text-warning">
                <i class="bi bi-arrow-repeat fs-5"></i>
              </div>
              <span class="badge bg-dark text-white rounded-pill px-3 py-1">
                In Progress
              </span>
            </div>
            <div>
              <div class="display-5 fw-bold mb-1 lh-1">{{ stats.activeTransfers }}</div>
              <div class="text-dark small fw-medium">Active Transfers</div>
            </div>
            <div class="mt-4 pt-3 border-top border-dark border-opacity-10">
              <small class="text-dark">Pending approval</small>
            </div>
          </div>
        </div>

        <!-- My Documents -->
        <div class="col-12 col-md-6 col-xl-3">
          <div class="dash-card h-100">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="avatar-circle bg-light text-primary">
                <i class="bi bi-file-earmark-text fs-5"></i>
              </div>
              <span class="badge badge-pill-custom badge-soft-blue">
                Secured
              </span>
            </div>
            <div>
              <div class="display-5 fw-bold mb-1 lh-1">{{ stats.myDocuments }}</div>
              <div class="text-muted small fw-medium">My Documents</div>
            </div>
            <div class="mt-4 pt-3 border-top">
              <small class="text-muted">Title deeds & certificates</small>
            </div>
          </div>
        </div>

        <!-- Verification Status -->
        <div class="col-12 col-md-6 col-xl-3">
          <div class="dash-card h-100">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="avatar-circle bg-light text-success">
                <i class="bi bi-shield-check fs-5"></i>
              </div>
              <span class="badge badge-pill-custom badge-soft-green">
                Verified
              </span>
            </div>
            <div>
              <div class="display-5 fw-bold mb-1 lh-1">100%</div>
              <div class="text-muted small fw-medium">Verification Status</div>
            </div>
            <div class="mt-4 pt-3 border-top">
              <small class="text-muted">All parcels verified</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="row g-4 mb-4">
        <!-- My Land Parcels -->
        <div class="col-12 col-lg-8">
          <div class="dash-card h-100">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 class="fw-bold mb-0">My Land Parcels</h5>
                <small class="text-muted">All parcels registered under your ownership</small>
              </div>
              <router-link to="/parcels" class="btn btn-sm btn-light-pill">
                View All
              </router-link>
            </div>

            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

            <div v-else-if="myParcels.length === 0" class="text-center py-5">
              <i class="bi bi-inbox fs-1 text-muted mb-3 d-block"></i>
              <p class="text-muted">No parcels registered yet</p>
            </div>

            <div v-else class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead class="text-muted small">
                  <tr>
                    <th class="border-0 pb-3">PARCEL NO.</th>
                    <th class="border-0 pb-3">LOCATION</th>
                    <th class="border-0 pb-3">SIZE</th>
                    <th class="border-0 pb-3">LAND USE</th>
                    <th class="border-0 pb-3 text-end">ACTION</th>
                  </tr>
                </thead>
                <tbody class="border-top-0">
                  <tr v-for="parcel in myParcels" :key="parcel._id">
                    <td>
                      <div class="d-flex align-items-center gap-2">
                        <div class="avatar-circle bg-light text-dark" style="width: 32px; height: 32px;">
                          <i class="bi bi-geo-alt"></i>
                        </div>
                        <div>
                          <div class="fw-bold text-dark small">{{ parcel.parcelNumber }}</div>
                          <small class="text-muted">{{ parcel.registrationDate ? formatDate(parcel.registrationDate) : 'N/A' }}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="small fw-semibold text-dark">{{ parcel.location?.county || 'N/A' }}</div>
                      <small class="text-muted">{{ parcel.location?.subCounty || '' }}</small>
                    </td>
                    <td>
                      <span class="badge bg-light text-dark rounded-pill px-2 py-1 small">
                        {{ parcel.size?.value || 'N/A' }} {{ parcel.size?.unit || '' }}
                      </span>
                    </td>
                    <td>
                      <small class="text-muted">{{ parcel.landUse || 'N/A' }}</small>
                    </td>
                    <td class="text-end">
                      <div class="btn-group">
                        <button @click="viewParcelDetails(parcel)" class="btn btn-sm btn-primary">
                          <i class="bi bi-eye"></i> View
                        </button>
                        <button @click="initiateTransfer(parcel)" class="btn btn-sm btn-warning text-dark">
                          <i class="bi bi-arrow-left-right"></i> Transfer
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Quick Actions & Activity -->
        <div class="col-12 col-lg-4">
          <!-- Quick Actions -->
          <div class="dash-card mb-4">
            <h5 class="fw-bold mb-3">Quick Actions</h5>
            <div class="d-grid gap-2">
              <button @click="showTransferModal = true" class="btn btn-light-pill text-start d-flex align-items-center gap-3 py-3">
                <div class="avatar-circle bg-warning text-dark">
                  <i class="bi bi-arrow-left-right"></i>
                </div>
                <div>
                  <div class="fw-bold text-dark">Transfer Land</div>
                  <small class="text-muted">Initiate ownership transfer</small>
                </div>
              </button>

              <router-link to="/verify" class="btn btn-light-pill text-start d-flex align-items-center gap-3 py-3 text-decoration-none">
                <div class="avatar-circle bg-primary text-white">
                  <i class="bi bi-shield-check"></i>
                </div>
                <div>
                  <div class="fw-bold text-dark">Verify Document</div>
                  <small class="text-muted">Check authenticity</small>
                </div>
              </router-link>

              <router-link to="/documents" class="btn btn-light-pill text-start d-flex align-items-center gap-3 py-3 text-decoration-none">
                <div class="avatar-circle bg-dark text-white">
                  <i class="bi bi-file-earmark-text"></i>
                </div>
                <div>
                  <div class="fw-bold text-dark">My Documents</div>
                  <small class="text-muted">View title deeds</small>
                </div>
              </router-link>

              <router-link to="/transfers" class="btn btn-light-pill text-start d-flex align-items-center gap-3 py-3 text-decoration-none">
                <div class="avatar-circle bg-success text-white">
                  <i class="bi bi-clock-history"></i>
                </div>
                <div>
                  <div class="fw-bold text-dark">Transfer History</div>
                  <small class="text-muted">Track applications</small>
                </div>
              </router-link>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="dash-card">
            <h5 class="fw-bold mb-3">Recent Activity</h5>
            <div class="activity-list">
              <div v-if="recentActivity.length === 0" class="text-center py-3">
                <small class="text-muted">No recent activity</small>
              </div>
              <div v-else v-for="(activity, idx) in recentActivity" :key="idx" class="activity-item d-flex gap-3 pb-3 mb-3 border-bottom">
                <div :class="['avatar-circle', activity.iconBg]" style="width: 36px; height: 36px;">
                  <i :class="['bi', activity.icon]"></i>
                </div>
                <div class="flex-grow-1">
                  <div class="small fw-semibold text-dark">{{ activity.title }}</div>
                  <small class="text-muted d-block">{{ activity.description }}</small>
                  <small class="text-muted">{{ activity.time }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- My Transfer Requests -->
      <div class="dash-card">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 class="fw-bold mb-0">My Transfer Requests</h5>
            <small class="text-muted">Track your land transfer applications</small>
          </div>
          <router-link to="/transfers" class="btn btn-sm btn-light-pill">
            View All
          </router-link>
        </div>

        <div v-if="myTransfers.length === 0" class="text-center py-5">
          <i class="bi bi-inbox fs-1 text-muted mb-3 d-block"></i>
          <p class="text-muted">No transfer requests yet</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="text-muted small">
              <tr>
                <th class="border-0 pb-3">PARCEL NO.</th>
                <th class="border-0 pb-3">TRANSFER TYPE</th>
                <th class="border-0 pb-3">NEW OWNER</th>
                <th class="border-0 pb-3">SUBMITTED</th>
                <th class="border-0 pb-3">STATUS</th>
                <th class="border-0 pb-3 text-end">ACTION</th>
              </tr>
            </thead>
            <tbody class="border-top-0">
              <tr v-for="transfer in myTransfers" :key="transfer._id">
                <td>
                  <div class="fw-bold text-dark small">{{ transfer.landParcel?.parcelNumber || 'N/A' }}</div>
                </td>
                <td>
                  <small class="text-muted">{{ transfer.transferType || 'N/A' }}</small>
                </td>
                <td>
                  <div class="small fw-semibold text-dark">{{ transfer.newOwner?.fullName || 'N/A' }}</div>
                  <small class="text-muted">{{ transfer.newOwner?.nationalId || '' }}</small>
                </td>
                <td>
                  <small class="text-muted">{{ formatDate(transfer.createdAt) }}</small>
                </td>
                <td>
                  <span :class="['badge badge-pill-custom', getStatusClass(transfer.status)]">
                    {{ transfer.status }}
                  </span>
                </td>
                <td class="text-end">
                  <button class="btn btn-sm btn-light-pill rounded-circle p-2" title="View Details">
                    <i class="bi bi-arrow-up-right"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Transfer Modal -->
    <div v-if="showTransferModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header border-0 pb-0">
            <div>
              <h5 class="modal-title fw-bold">Initiate Land Transfer</h5>
              <p class="text-muted small mb-0">Transfer ownership of your land</p>
            </div>
            <button type="button" class="btn-close" @click="closeTransferModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitTransfer">
              <div class="mb-3">
                <label class="form-label fw-semibold">Select Your Parcel *</label>
                <select v-model="transferForm.parcelId" class="form-select" required>
                  <option value="">Choose a parcel...</option>
                  <option v-for="parcel in myParcels" :key="parcel._id" :value="parcel._id">
                    {{ parcel.parcelNumber }} - {{ parcel.location?.county }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">New Owner National ID *</label>
                <input v-model="transferForm.newOwnerId" type="text" class="form-control" placeholder="12345678" required>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Transfer Type *</label>
                <select v-model="transferForm.transferType" class="form-select" required>
                  <option value="Sale">Sale</option>
                  <option value="Gift">Gift</option>
                  <option value="Inheritance">Inheritance</option>
                  <option value="Lease">Lease</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Transfer Fee (KES)</label>
                <input v-model="transferForm.transferFee" type="number" step="0.01" class="form-control">
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Notes</label>
                <textarea v-model="transferForm.notes" class="form-control" rows="3"></textarea>
              </div>

              <div v-if="transferError" class="alert alert-danger mb-0">
                {{ transferError }}
              </div>
              <div v-if="transferSuccess" class="alert alert-success mb-0">
                {{ transferSuccess }}
              </div>
            </form>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-light" @click="closeTransferModal">Cancel</button>
            <button type="button" class="btn btn-dark" @click="submitTransfer" :disabled="transferLoading">
              <span v-if="transferLoading" class="spinner-border spinner-border-sm me-2"></span>
              Submit Transfer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Parcel Details Modal -->
    <div v-if="showParcelModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-lg">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header border-0 pb-0">
            <div>
              <h5 class="modal-title fw-bold">Parcel Details</h5>
              <p class="text-muted small mb-0">Complete information about your land</p>
            </div>
            <button type="button" class="btn-close" @click="showParcelModal = false"></button>
          </div>
          <div class="modal-body" v-if="selectedParcel">
            <div class="row g-3">
              <div class="col-12">
                <div class="p-3 bg-light rounded">
                  <h6 class="fw-bold mb-2">{{ selectedParcel.parcelNumber }}</h6>
                  <span class="badge badge-pill-custom badge-soft-blue">{{ selectedParcel.landUse }}</span>
                </div>
              </div>
              <div class="col-6">
                <small class="text-muted d-block mb-1">County</small>
                <div class="fw-semibold">{{ selectedParcel.location?.county || 'N/A' }}</div>
              </div>
              <div class="col-6">
                <small class="text-muted d-block mb-1">Sub-County</small>
                <div class="fw-semibold">{{ selectedParcel.location?.subCounty || 'N/A' }}</div>
              </div>
              <div class="col-6">
                <small class="text-muted d-block mb-1">Size</small>
                <div class="fw-semibold">{{ selectedParcel.size?.value }} {{ selectedParcel.size?.unit }}</div>
              </div>
              <div class="col-6">
                <small class="text-muted d-block mb-1">Registration Date</small>
                <div class="fw-semibold">{{ formatDate(selectedParcel.registrationDate) }}</div>
              </div>
              <div class="col-12">
                <small class="text-muted d-block mb-1">Description</small>
                <div class="fw-semibold">{{ selectedParcel.location?.description || 'N/A' }}</div>
              </div>
              <div class="col-12">
                <small class="text-muted d-block mb-1">Boundaries</small>
                <div class="fw-semibold">{{ selectedParcel.boundaries || 'N/A' }}</div>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-light" @click="showParcelModal = false">Close</button>
            <button type="button" class="btn btn-warning text-dark" @click="initiateTransfer(selectedParcel)">
              <i class="bi bi-arrow-left-right me-2"></i>Transfer This Land
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'
import api from '@/services/api'

export default {
  name: 'UserDashboard',
  components: { Navbar },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    const user = computed(() => authStore.user)
    const searchQuery = ref('')
    const loading = ref(false)

    // Statistics
    const stats = ref({
      myParcels: 0,
      totalArea: 0,
      activeTransfers: 0,
      myDocuments: 0
    })

    // Data
    const myParcels = ref([])
    const myTransfers = ref([])
    const notifications = ref([])
    const recentActivity = ref([])

    // Modals
    const showTransferModal = ref(false)
    const showParcelModal = ref(false)
    const selectedParcel = ref(null)

    // Transfer Form
    const transferForm = ref({
      parcelId: '',
      newOwnerId: '',
      transferType: 'Sale',
      transferFee: '',
      notes: ''
    })

    const transferLoading = ref(false)
    const transferError = ref(null)
    const transferSuccess = ref(null)

    // Methods
    const fetchUserData = async () => {
      loading.value = true
      try {
        // Fetch user's parcels
        const parcelsRes = await api.get(`/parcels?owner=${user.value.id}`)
        if (parcelsRes.data?.data?.parcels) {
          myParcels.value = parcelsRes.data.data.parcels
          stats.value.myParcels = myParcels.value.length
          stats.value.totalArea = myParcels.value.reduce((sum, p) => sum + (p.size?.value || 0), 0)
        }

        // Fetch user's transfers
        const transfersRes = await api.get(`/transfers?currentOwner=${user.value.id}`)
        if (transfersRes.data?.data?.transfers) {
          myTransfers.value = transfersRes.data.data.transfers
          stats.value.activeTransfers = myTransfers.value.filter(t => t.status === 'pending').length
        }

        // Set mock document count
        stats.value.myDocuments = myParcels.value.length * 2

        // Set recent activity
        if (myTransfers.value.length > 0) {
          recentActivity.value = myTransfers.value.slice(0, 3).map(t => ({
            title: 'Transfer Submitted',
            description: `Transfer of ${t.landParcel?.parcelNumber || 'parcel'} to ${t.newOwner?.fullName || 'new owner'}`,
            time: formatRelativeTime(t.createdAt),
            icon: 'bi-arrow-left-right',
            iconBg: 'bg-warning text-dark'
          }))
        }
      } catch (err) {
        console.error('Error loading user data:', err)
      } finally {
        loading.value = false
      }
    }

    const submitTransfer = async () => {
      transferLoading.value = true
      transferError.value = null
      transferSuccess.value = null

      try {
        const parcel = myParcels.value.find(p => p._id === transferForm.value.parcelId)
        
        await api.post('/transfers', {
          parcelNumber: parcel.parcelNumber,
          newOwnerNationalId: transferForm.value.newOwnerId,
          transferType: transferForm.value.transferType,
          transferFee: transferForm.value.transferFee ? parseFloat(transferForm.value.transferFee) : undefined,
          notes: transferForm.value.notes
        })

        transferSuccess.value = 'Transfer request submitted successfully!'
        setTimeout(() => {
          closeTransferModal()
          fetchUserData()
        }, 1500)
      } catch (err) {
        transferError.value = err.response?.data?.message || 'Failed to submit transfer'
      } finally {
        transferLoading.value = false
      }
    }

    const closeTransferModal = () => {
      showTransferModal.value = false
      transferForm.value = {
        parcelId: '',
        newOwnerId: '',
        transferType: 'Sale',
        transferFee: '',
        notes: ''
      }
      transferError.value = null
      transferSuccess.value = null
    }

    const viewParcelDetails = (parcel) => {
      selectedParcel.value = parcel
      showParcelModal.value = true
    }

    const initiateTransfer = (parcel) => {
      showParcelModal.value = false
      transferForm.value.parcelId = parcel._id
      showTransferModal.value = true
    }

    const formatDate = (date) => {
      if (!date) return 'N/A'
      const d = new Date(date)
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    const formatRelativeTime = (date) => {
      if (!date) return 'N/A'
      const now = new Date()
      const then = new Date(date)
      const diff = now - then
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      
      if (days === 0) return 'Today'
      if (days === 1) return 'Yesterday'
      if (days < 7) return `${days} days ago`
      return formatDate(date)
    }

    const getStatusClass = (status) => {
      const classes = {
        pending: 'badge-soft-yellow',
        approved: 'badge-soft-green',
        rejected: 'badge-soft-red',
        in_review: 'badge-soft-blue'
      }
      return classes[status] || 'badge-soft-blue'
    }

    const handleLogout = () => {
      authStore.logout()
      router.push('/login')
    }

    onMounted(() => {
      fetchUserData()
    })

    return {
      user,
      searchQuery,
      loading,
      stats,
      myParcels,
      myTransfers,
      notifications,
      recentActivity,
      showTransferModal,
      showParcelModal,
      selectedParcel,
      transferForm,
      transferLoading,
      transferError,
      transferSuccess,
      submitTransfer,
      closeTransferModal,
      viewParcelDetails,
      initiateTransfer,
      formatDate,
      getStatusClass,
      handleLogout
    }
  }
}
</script>

<style scoped>
.activity-item:last-child {
  border-bottom: none !important;
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
}
</style>
