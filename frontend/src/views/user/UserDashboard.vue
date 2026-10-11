<template>
  <div class="main-layout-container">
    <Navbar />

    <main class="flex-grow-1 p-3 p-md-4 p-xl-5">
      <!-- Welcome Section -->
      <div class="mb-4">
        <span class="badge badge-pill-custom badge-soft-blue mb-2">
          <i class="bi bi-person-circle"></i> Land Owner Portal
        </span>
        <h1 class="fw-bold text-dark fs-2 mb-1">Welcome back, {{ user?.fullName || 'Land Owner' }}</h1>
        <p class="text-muted mb-0">Manage your land parcels, track transfers, and access documents securely.</p>
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
                Active
              </span>
            </div>
            <div>
              <div class="display-5 fw-bold mb-1 lh-1">{{ stats.myParcels }}</div>
              <div class="text-secondary small fw-medium">My Land Parcels</div>
            </div>
            <div class="mt-4 pt-3 border-top border-secondary border-opacity-25">
              <small class="text-secondary">Total: {{ stats.totalArea.toFixed(2) }} acres</small>
            </div>
          </div>
        </div>

        <!-- Pending Transfers -->
        <div class="col-12 col-md-6 col-xl-3">
          <div class="dash-card card-yellow h-100">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="avatar-circle bg-dark text-warning">
                <i class="bi bi-arrow-repeat fs-5"></i>
              </div>
              <span class="badge bg-dark text-white rounded-pill px-3 py-1">
                Pending
              </span>
            </div>
            <div>
              <div class="display-5 fw-bold mb-1 lh-1">{{ stats.pendingTransfers }}</div>
              <div class="text-dark small fw-medium">Pending Transfers</div>
            </div>
            <div class="mt-4 pt-3 border-top border-dark border-opacity-10">
              <small class="text-dark">Awaiting approval</small>
            </div>
          </div>
        </div>

        <!-- Completed Transfers -->
        <div class="col-12 col-md-6 col-xl-3">
          <div class="dash-card h-100">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="avatar-circle bg-light text-success">
                <i class="bi bi-check-circle fs-5"></i>
              </div>
              <span class="badge badge-pill-custom badge-soft-green">
                Complete
              </span>
            </div>
            <div>
              <div class="display-5 fw-bold mb-1 lh-1">{{ stats.completedTransfers }}</div>
              <div class="text-muted small fw-medium">Completed Transfers</div>
            </div>
            <div class="mt-4 pt-3 border-top">
              <small class="text-muted">All time</small>
            </div>
          </div>
        </div>

        <!-- Title Deeds -->
        <div class="col-12 col-md-6 col-xl-3">
          <div class="dash-card h-100">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="avatar-circle bg-light text-primary">
                <i class="bi bi-shield-check fs-5"></i>
              </div>
              <span class="badge badge-pill-custom badge-soft-blue">
                Verified
              </span>
            </div>
            <div>
              <div class="display-5 fw-bold mb-1 lh-1">{{ stats.myDocuments }}</div>
              <div class="text-muted small fw-medium">Title Deeds</div>
            </div>
            <div class="mt-4 pt-3 border-top">
              <small class="text-muted">Digitally secured</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Overview Section with Charts -->
      <div class="row g-4 mb-4">
        <!-- Land Portfolio Overview -->
        <div class="col-12 col-lg-8">
          <div class="dash-card h-100">
            <h5 class="fw-bold mb-3">My Land Portfolio Overview</h5>
            <p class="text-muted small mb-4">Distribution of your land holdings by use type and county</p>
            
            <div class="row g-4">
              <!-- Land Use Distribution Pie Chart -->
              <div class="col-12 col-md-6">
                <div class="text-center">
                  <h6 class="fw-semibold mb-3">Land by Use Type</h6>
                  <div class="position-relative d-inline-block" style="width: 200px; height: 200px;">
                    <svg viewBox="0 0 200 200" class="w-100 h-100">
                      <circle
                        v-for="(slice, index) in landUseSlices"
                        :key="index"
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        :stroke="slice.color"
                        stroke-width="40"
                        :stroke-dasharray="slice.dashArray"
                        :stroke-dashoffset="slice.dashOffset"
                        style="transition: all 0.3s ease;"
                      />
                      <text x="100" y="95" text-anchor="middle" class="fw-bold" style="font-size: 24px; fill: #1a1a1a;">
                        {{ stats.myParcels }}
                      </text>
                      <text x="100" y="115" text-anchor="middle" class="text-muted" style="font-size: 12px; fill: #6c757d;">
                        Parcels
                      </text>
                    </svg>
                  </div>
                  <div class="mt-3">
                    <div v-for="(item, index) in landUseData" :key="index" class="d-flex justify-content-between align-items-center mb-2">
                      <div class="d-flex align-items-center gap-2">
                        <span class="badge rounded-circle p-2" :style="{ backgroundColor: item.color, width: '12px', height: '12px' }"></span>
                        <small class="text-muted">{{ item.name }}</small>
                      </div>
                      <small class="fw-bold">{{ item.count }} ({{ item.percentage }}%)</small>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Land by County Distribution -->
              <div class="col-12 col-md-6">
                <div class="text-center">
                  <h6 class="fw-semibold mb-3">Land by County</h6>
                  <div class="position-relative d-inline-block" style="width: 200px; height: 200px;">
                    <svg viewBox="0 0 200 200" class="w-100 h-100">
                      <circle
                        v-for="(slice, index) in countySlices"
                        :key="index"
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        :stroke="slice.color"
                        stroke-width="40"
                        :stroke-dasharray="slice.dashArray"
                        :stroke-dashoffset="slice.dashOffset"
                        style="transition: all 0.3s ease;"
                      />
                      <text x="100" y="95" text-anchor="middle" class="fw-bold" style="font-size: 20px; fill: #1a1a1a;">
                        {{ stats.totalArea.toFixed(1) }}
                      </text>
                      <text x="100" y="115" text-anchor="middle" class="text-muted" style="font-size: 12px; fill: #6c757d;">
                        Acres
                      </text>
                    </svg>
                  </div>
                  <div class="mt-3">
                    <div v-for="(item, index) in countyData" :key="index" class="d-flex justify-content-between align-items-center mb-2">
                      <div class="d-flex align-items-center gap-2">
                        <span class="badge rounded-circle p-2" :style="{ backgroundColor: item.color, width: '12px', height: '12px' }"></span>
                        <small class="text-muted">{{ item.name }}</small>
                      </div>
                      <small class="fw-bold">{{ item.count }} ({{ item.acres.toFixed(1) }} ac)</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="col-12 col-lg-4">
          <div class="dash-card h-100">
            <h5 class="fw-bold mb-3">Quick Actions</h5>
            <div class="d-grid gap-3">
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

              <router-link to="/profile" class="btn btn-light-pill text-start d-flex align-items-center gap-3 py-3 text-decoration-none">
                <div class="avatar-circle bg-success text-white">
                  <i class="bi bi-person-gear"></i>
                </div>
                <div>
                  <div class="fw-bold text-dark">Update Profile</div>
                  <small class="text-muted">Manage account</small>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- My Land Parcels Table -->
      <div class="row g-4 mb-4">
        <div class="col-12">
          <div class="dash-card">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 class="fw-bold mb-0">My Land Parcels</h5>
                <small class="text-muted">All parcels registered under your ownership</small>
              </div>
              <div class="position-relative" style="max-width: 300px;">
                <i class="bi bi-search position-absolute text-muted" style="left: 0.75rem; top: 50%; transform: translateY(-50%); font-size: 0.875rem;"></i>
                <input
                  type="search"
                  class="form-control form-control-sm rounded-pill ps-4 bg-light border-0"
                  placeholder="Search parcels..."
                  v-model="searchQuery"
                />
              </div>
            </div>

            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

            <div v-else-if="filteredParcels.length === 0" class="text-center py-5">
              <i class="bi bi-inbox fs-1 text-muted mb-3 d-block"></i>
              <p class="text-muted">No parcels found</p>
            </div>

            <div v-else class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead class="text-muted small">
                  <tr>
                    <th class="border-0 pb-3">PARCEL NUMBER</th>
                    <th class="border-0 pb-3">LOCATION</th>
                    <th class="border-0 pb-3">SIZE</th>
                    <th class="border-0 pb-3">LAND USE</th>
                    <th class="border-0 pb-3">STATUS</th>
                    <th class="border-0 pb-3 text-end">ACTION</th>
                  </tr>
                </thead>
                <tbody class="border-top-0">
                  <tr v-for="parcel in filteredParcels" :key="parcel._id">
                    <td>
                      <div class="d-flex align-items-center gap-2">
                        <div class="avatar-circle bg-light text-dark" style="width: 36px; height: 36px; font-size: 0.85rem;">
                          <i class="bi bi-geo-alt"></i>
                        </div>
                        <div>
                          <div class="fw-bold text-dark small">{{ parcel.parcelNumber }}</div>
                          <small class="text-muted">{{ formatDate(parcel.registrationDate) }}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="small fw-semibold text-dark">{{ parcel.location?.county || 'N/A' }}</div>
                      <small class="text-muted">{{ parcel.location?.subCounty || '' }}</small>
                    </td>
                    <td>
                      <span class="badge bg-light text-dark rounded-pill px-3 py-2 small">
                        {{ parcel.sizeInAcres || 'N/A' }} acres
                      </span>
                    </td>
                    <td>
                      <small class="text-capitalize">{{ parcel.landUse || 'N/A' }}</small>
                    </td>
                    <td>
                      <span :class="['badge badge-pill-custom', getParcelStatusClass(parcel.status)]">
                        {{ parcel.status || 'active' }}
                      </span>
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
      </div>

      <!-- Recent Transfer Requests -->
      <div class="dash-card">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 class="fw-bold mb-0">Recent Transfer Requests</h5>
            <small class="text-muted">Track your land transfer applications</small>
          </div>
        </div>

        <div v-if="myTransfers.length === 0" class="text-center py-5">
          <i class="bi bi-arrow-left-right fs-1 text-muted mb-3 d-block"></i>
          <p class="text-muted">No transfer requests yet</p>
          <button @click="showTransferModal = true" class="btn btn-pill btn-dark-pill mt-2">
            <i class="bi bi-plus-circle"></i> Initiate Transfer
          </button>
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
              <tr v-for="transfer in myTransfers.slice(0, 5)" :key="transfer._id">
                <td>
                  <div class="fw-bold text-dark small">{{ transfer.landParcel?.parcelNumber || 'N/A' }}</div>
                </td>
                <td>
                  <small class="text-muted text-capitalize">{{ transfer.transferType || 'N/A' }}</small>
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
                  <option value="sale">Sale</option>
                  <option value="gift">Gift</option>
                  <option value="inheritance">Inheritance</option>
                  <option value="other">Other</option>
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
                  <span class="badge badge-pill-custom badge-soft-blue text-capitalize">{{ selectedParcel.landUse }}</span>
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
                <div class="fw-semibold">{{ selectedParcel.sizeInAcres }} acres</div>
              </div>
              <div class="col-6">
                <small class="text-muted d-block mb-1">Title Deed</small>
                <div class="fw-semibold">{{ selectedParcel.titleDeedNumber || 'N/A' }}</div>
              </div>
              <div class="col-6">
                <small class="text-muted d-block mb-1">Registration Date</small>
                <div class="fw-semibold">{{ formatDate(selectedParcel.registrationDate) }}</div>
              </div>
              <div class="col-6">
                <small class="text-muted d-block mb-1">Status</small>
                <div class="fw-semibold text-capitalize">{{ selectedParcel.status || 'active' }}</div>
              </div>
              <div class="col-12">
                <small class="text-muted d-block mb-1">Location Description</small>
                <div class="fw-semibold">{{ selectedParcel.location?.description || 'N/A' }}</div>
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
      pendingTransfers: 0,
      completedTransfers: 0,
      myDocuments: 0
    })

    // Data
    const myParcels = ref([])
    const myTransfers = ref([])
    const landUseData = ref([])
    const countyData = ref([])

    // Modals
    const showTransferModal = ref(false)
    const showParcelModal = ref(false)
    const selectedParcel = ref(null)

    // Transfer Form
    const transferForm = ref({
      parcelId: '',
      newOwnerId: '',
      transferType: 'sale',
      transferFee: '',
      notes: ''
    })

    const transferLoading = ref(false)
    const transferError = ref(null)
    const transferSuccess = ref(null)

    // Computed
    const filteredParcels = computed(() => {
      if (!searchQuery.value) return myParcels.value
      const query = searchQuery.value.toLowerCase()
      return myParcels.value.filter(p => 
        p.parcelNumber?.toLowerCase().includes(query) ||
        p.location?.county?.toLowerCase().includes(query) ||
        p.location?.subCounty?.toLowerCase().includes(query)
      )
    })

    // Pie chart calculations
    const landUseSlices = computed(() => {
      return calculatePieSlices(landUseData.value)
    })

    const countySlices = computed(() => {
      return calculatePieSlices(countyData.value)
    })

    const calculatePieSlices = (data) => {
      const total = data.reduce((sum, item) => sum + item.count, 0)
      if (total === 0) return []

      const circumference = 2 * Math.PI * 80
      let currentOffset = 0

      return data.map(item => {
        const percentage = item.count / total
        const dashArray = `${percentage * circumference} ${circumference}`
        const dashOffset = -currentOffset
        currentOffset += percentage * circumference

        return {
          color: item.color,
          dashArray,
          dashOffset
        }
      })
    }

    // Methods
    const fetchUserData = async () => {
      loading.value = true
      try {
        // Fetch user's parcels using the correct endpoint
        const parcelsRes = await api.get('/land-parcels/my-parcels')
        if (parcelsRes.data?.data?.parcels) {
          myParcels.value = parcelsRes.data.data.parcels
          stats.value.myParcels = myParcels.value.length
          stats.value.totalArea = myParcels.value.reduce((sum, p) => sum + (parseFloat(p.sizeInAcres) || 0), 0)
          
          // Calculate land use distribution
          const useCounts = {}
          myParcels.value.forEach(p => {
            const use = p.landUse || 'other'
            useCounts[use] = (useCounts[use] || 0) + 1
          })

          const colors = {
            residential: '#4F46E5',
            commercial: '#F59E0B',
            agricultural: '#10B981',
            industrial: '#EF4444',
            mixed: '#8B5CF6',
            other: '#6B7280'
          }

          landUseData.value = Object.entries(useCounts).map(([name, count]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            count,
            percentage: Math.round((count / stats.value.myParcels) * 100),
            color: colors[name] || colors.other
          }))

          // Calculate county distribution
          const countyCounts = {}
          const countyAcres = {}
          myParcels.value.forEach(p => {
            const county = p.location?.county || 'Unknown'
            countyCounts[county] = (countyCounts[county] || 0) + 1
            countyAcres[county] = (countyAcres[county] || 0) + (parseFloat(p.sizeInAcres) || 0)
          })

          const countyColors = ['#4F46E5', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#06B6D4']
          countyData.value = Object.entries(countyCounts).map(([name, count], index) => ({
            name,
            count,
            acres: countyAcres[name],
            color: countyColors[index % countyColors.length]
          }))
        }

        // Fetch user's transfers
        const transfersRes = await api.get(`/transfers?currentOwner=${user.value.id}`)
        if (transfersRes.data?.data?.transfers) {
          myTransfers.value = transfersRes.data.data.transfers
          stats.value.pendingTransfers = myTransfers.value.filter(t => t.status === 'pending').length
          stats.value.completedTransfers = myTransfers.value.filter(t => t.status === 'approved' || t.status === 'completed').length
        }

        // Set document count
        stats.value.myDocuments = myParcels.value.length
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
        transferType: 'sale',
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

    const getStatusClass = (status) => {
      const classes = {
        pending: 'badge-soft-yellow',
        approved: 'badge-soft-green',
        rejected: 'badge-soft-red',
        completed: 'badge-soft-green',
        in_review: 'badge-soft-blue'
      }
      return classes[status] || 'badge-soft-blue'
    }

    const getParcelStatusClass = (status) => {
      const classes = {
        active: 'badge-soft-green',
        transferred: 'badge-soft-blue',
        disputed: 'badge-soft-red',
        inactive: 'badge-soft-red',
        pending_transfer: 'badge-soft-yellow'
      }
      return classes[status] || 'badge-soft-green'
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
      landUseData,
      countyData,
      landUseSlices,
      countySlices,
      filteredParcels,
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
      getParcelStatusClass,
      handleLogout
    }
  }
}
</script>

<style scoped>
svg text {
  pointer-events: none;
}
</style>
