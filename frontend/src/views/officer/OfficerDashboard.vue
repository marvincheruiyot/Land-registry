<template>
  <div class="main-layout-container">
    <Navbar />

    <main class="flex-grow-1 p-3 p-md-4 p-xl-5">
      <!-- Title & Welcome Header -->
      <div class="mb-4">
        <span class="badge badge-pill-custom badge-soft-blue mb-2">
          <i class="bi bi-briefcase-fill"></i> Land Officer Portal
        </span>
        <h1 class="fw-bold text-dark fs-2 mb-1">Welcome back, {{ user?.fullName || 'Officer' }}</h1>
        <p class="text-muted mb-0">Manage parcels, process transfers, and verify land records efficiently.</p>
      </div>

      <!-- Statistics Cards -->
      <div class="row g-4 mb-4">
        <!-- Pending Approvals -->
        <div class="col-12 col-md-6 col-xl-3">
          <div class="dash-card card-yellow h-100">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="avatar-circle bg-dark text-warning">
                <i class="bi bi-hourglass-split fs-5"></i>
              </div>
              <span class="badge bg-dark text-white rounded-pill px-3 py-1">
                Action Required
              </span>
            </div>
            <div>
              <div class="display-5 fw-bold mb-1 lh-1">{{ stats.pendingApprovals }}</div>
              <div class="text-dark small fw-medium">Pending Approvals</div>
            </div>
            <div class="mt-4 pt-3 border-top border-dark border-opacity-10">
              <small class="text-dark">Transfers awaiting review</small>
            </div>
          </div>
        </div>

        <!-- Total Parcels -->
        <div class="col-12 col-md-6 col-xl-3">
          <div class="dash-card h-100">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="avatar-circle bg-light text-primary">
                <i class="bi bi-map-fill fs-5"></i>
              </div>
              <span class="badge badge-pill-custom badge-soft-blue">
                Registered
              </span>
            </div>
            <div>
              <div class="display-5 fw-bold mb-1 lh-1">{{ stats.totalParcels }}</div>
              <div class="text-muted small fw-medium">Total Parcels</div>
            </div>
            <div class="mt-4 pt-3 border-top">
              <small class="text-muted">{{ stats.totalArea }} acres total</small>
            </div>
          </div>
        </div>

        <!-- Completed This Month -->
        <div class="col-12 col-md-6 col-xl-3">
          <div class="dash-card h-100">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="avatar-circle bg-light text-success">
                <i class="bi bi-check-circle-fill fs-5"></i>
              </div>
              <span class="badge badge-pill-custom badge-soft-green">
                This Month
              </span>
            </div>
            <div>
              <div class="display-5 fw-bold mb-1 lh-1">{{ stats.completedThisMonth }}</div>
              <div class="text-muted small fw-medium">Completed Tasks</div>
            </div>
            <div class="mt-4 pt-3 border-top">
              <small class="text-muted">Approved transfers</small>
            </div>
          </div>
        </div>

        <!-- Registrations by Me -->
        <div class="col-12 col-md-6 col-xl-3">
          <div class="dash-card card-dark h-100">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="avatar-circle bg-dark-subtle text-white">
                <i class="bi bi-person-badge-fill fs-5"></i>
              </div>
              <span class="badge bg-secondary-subtle text-light rounded-pill px-3 py-1">
                Your Work
              </span>
            </div>
            <div>
              <div class="display-5 fw-bold mb-1 lh-1">{{ stats.registeredByMe }}</div>
              <div class="text-secondary small fw-medium">Parcels Registered</div>
            </div>
            <div class="mt-4 pt-3 border-top border-secondary border-opacity-25">
              <small class="text-secondary">By you total</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Workload Distribution -->
      <div class="dash-card mb-4">
        <h5 class="fw-bold mb-4">
          <i class="bi bi-pie-chart-fill me-2"></i>Workload Distribution
        </h5>
        
        <div class="row g-4 mb-4">
          <div class="col-6 col-md-3">
            <div class="text-center p-3 bg-primary bg-opacity-10 rounded">
              <div class="display-6 fw-bold text-primary mb-2">{{ countyStats.nairobi }}</div>
              <small class="text-muted fw-semibold">Nairobi</small>
              <div class="mt-2">
                <small class="text-muted">{{ countyAcres.nairobi.toFixed(1) }} acres</small>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="text-center p-3 bg-success bg-opacity-10 rounded">
              <div class="display-6 fw-bold text-success mb-2">{{ countyStats.kiambu }}</div>
              <small class="text-muted fw-semibold">Kiambu</small>
              <div class="mt-2">
                <small class="text-muted">{{ countyAcres.kiambu.toFixed(1) }} acres</small>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="text-center p-3 bg-warning bg-opacity-10 rounded">
              <div class="display-6 fw-bold text-warning mb-2">{{ countyStats.nakuru }}</div>
              <small class="text-muted fw-semibold">Nakuru</small>
              <div class="mt-2">
                <small class="text-muted">{{ countyAcres.nakuru.toFixed(1) }} acres</small>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="text-center p-3 bg-info bg-opacity-10 rounded">
              <div class="display-6 fw-bold text-info mb-2">{{ countyStats.other }}</div>
              <small class="text-muted fw-semibold">Others</small>
              <div class="mt-2">
                <small class="text-muted">{{ countyAcres.other.toFixed(1) }} acres</small>
              </div>
            </div>
          </div>
        </div>

        <div class="row g-3">
          <div class="col-12">
            <h6 class="fw-bold mb-3">
              <i class="bi bi-graph-up me-2"></i>Transfer Status Breakdown
            </h6>
          </div>
          <div class="col-6 col-md-3">
            <div class="d-flex align-items-center gap-3 p-3 bg-light rounded">
              <div class="avatar-circle bg-warning text-dark flex-shrink-0" style="width: 48px; height: 48px;">
                <i class="bi bi-hourglass-split"></i>
              </div>
              <div>
                <div class="display-6 fw-bold">{{ transferStats.pending }}</div>
                <small class="text-muted">Pending</small>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="d-flex align-items-center gap-3 p-3 bg-light rounded">
              <div class="avatar-circle bg-success text-white flex-shrink-0" style="width: 48px; height: 48px;">
                <i class="bi bi-check-circle-fill"></i>
              </div>
              <div>
                <div class="display-6 fw-bold">{{ transferStats.approved }}</div>
                <small class="text-muted">Approved</small>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="d-flex align-items-center gap-3 p-3 bg-light rounded">
              <div class="avatar-circle bg-danger text-white flex-shrink-0" style="width: 48px; height: 48px;">
                <i class="bi bi-x-circle-fill"></i>
              </div>
              <div>
                <div class="display-6 fw-bold">{{ transferStats.rejected }}</div>
                <small class="text-muted">Rejected</small>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="d-flex align-items-center gap-3 p-3 bg-light rounded">
              <div class="avatar-circle bg-secondary text-white flex-shrink-0" style="width: 48px; height: 48px;">
                <i class="bi bi-slash-circle"></i>
              </div>
              <div>
                <div class="display-6 fw-bold">{{ transferStats.cancelled }}</div>
                <small class="text-muted">Cancelled</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="row g-4 mb-4">
        <!-- Pending Transfer Requests -->
        <div class="col-12 col-xl-8">
          <div class="dash-card h-100">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 class="fw-bold mb-1">Transfer Requests</h5>
                <small class="text-muted">Review and approve ownership transfers</small>
              </div>
              <div class="btn-group btn-group-sm">
                <button 
                  :class="['btn', transferFilter === 'pending' ? 'btn-warning text-dark' : 'btn-outline-secondary']"
                  @click="transferFilter = 'pending'"
                >
                  <i class="bi bi-hourglass me-1"></i>Pending
                </button>
                <button 
                  :class="['btn', transferFilter === 'all' ? 'btn-dark' : 'btn-outline-secondary']"
                  @click="transferFilter = 'all'"
                >
                  <i class="bi bi-list me-1"></i>All
                </button>
              </div>
            </div>

            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status"></div>
              <p class="text-muted mt-2 small">Loading transfers...</p>
            </div>

            <div v-else-if="filteredTransfers.length === 0" class="text-center py-5">
              <i class="bi bi-inbox fs-1 text-muted mb-3 d-block"></i>
              <h6 class="fw-bold text-dark mb-2">No Transfer Requests</h6>
              <p class="text-muted small mb-0">All transfers have been processed</p>
            </div>

            <div v-else class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead>
                  <tr style="border-bottom: 2px solid #e5e7eb;">
                    <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.75rem;">Parcel</th>
                    <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.75rem;">From → To</th>
                    <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.75rem;">Type</th>
                    <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.75rem;">Date</th>
                    <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.75rem;">Status</th>
                    <th class="py-3 text-muted fw-semibold text-uppercase text-end" style="font-size: 0.75rem;">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="transfer in filteredTransfers.slice(0, 10)" :key="transfer._id" style="border-bottom: 1px solid #f3f4f6;">
                    <td class="py-3">
                      <div class="fw-semibold" style="font-size: 0.9rem;">{{ transfer.landParcel?.parcelNumber || 'N/A' }}</div>
                      <small class="text-muted">{{ transfer.landParcel?.location?.county }}</small>
                    </td>
                    <td class="py-3">
                      <div style="font-size: 0.85rem;">
                        <div class="text-truncate" style="max-width: 150px;">{{ transfer.currentOwner?.fullName || 'Unknown' }}</div>
                        <div class="text-muted">→ {{ transfer.newOwner?.fullName || 'Unknown' }}</div>
                      </div>
                    </td>
                    <td class="py-3">
                      <span class="badge bg-light text-dark px-2 py-1" style="font-size: 0.75rem;">
                        {{ transfer.transferType || 'Sale' }}
                      </span>
                    </td>
                    <td class="py-3">
                      <small class="text-muted">{{ formatDate(transfer.createdAt) }}</small>
                    </td>
                    <td class="py-3">
                      <span :class="['badge rounded-pill px-3 py-1', getStatusBadgeClass(transfer.status)]" style="font-size: 0.75rem;">
                        {{ transfer.status }}
                      </span>
                    </td>
                    <td class="py-3 text-end">
                      <button @click="reviewTransfer(transfer)" class="btn btn-sm btn-dark px-3">
                        <i class="bi bi-eye me-1"></i>Review
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-if="filteredTransfers.length > 10" class="text-center pt-3 mt-3 border-top">
              <router-link to="/transfers" class="btn btn-sm btn-light">
                View All {{ filteredTransfers.length }} Transfers
              </router-link>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="col-12 col-xl-4">
          <div class="dash-card h-100">
            <h5 class="fw-bold mb-4">Quick Actions</h5>
            <div class="d-grid gap-3">
              <router-link to="/parcels/create" class="btn btn-warning text-dark text-decoration-none d-flex align-items-center gap-3 py-3">
                <div class="avatar-circle bg-dark text-warning flex-shrink-0">
                  <i class="bi bi-plus-circle-fill"></i>
                </div>
                <div class="text-start">
                  <div class="fw-bold small">Register New Parcel</div>
                  <small>Add land to registry</small>
                </div>
              </router-link>

              <router-link to="/verify" class="btn btn-light-pill text-start d-flex align-items-center gap-3 py-3 border text-decoration-none">
                <div class="avatar-circle bg-primary text-white flex-shrink-0">
                  <i class="bi bi-shield-check-fill"></i>
                </div>
                <div>
                  <div class="fw-bold text-dark small">Verify Document</div>
                  <small class="text-muted">Authenticate title deed</small>
                </div>
              </router-link>

              <router-link to="/parcels" class="btn btn-light-pill text-start d-flex align-items-center gap-3 py-3 border text-decoration-none">
                <div class="avatar-circle bg-dark text-white flex-shrink-0">
                  <i class="bi bi-search"></i>
                </div>
                <div>
                  <div class="fw-bold text-dark small">Search Registry</div>
                  <small class="text-muted">Browse all parcels</small>
                </div>
              </router-link>

              <router-link to="/transfers" class="btn btn-light-pill text-start d-flex align-items-center gap-3 py-3 border text-decoration-none">
                <div class="avatar-circle bg-info text-white flex-shrink-0">
                  <i class="bi bi-arrow-left-right"></i>
                </div>
                <div>
                  <div class="fw-bold text-dark small">View All Transfers</div>
                  <small class="text-muted">Manage transfers</small>
                </div>
              </router-link>

              <router-link to="/reports" class="btn btn-light-pill text-start d-flex align-items-center gap-3 py-3 border text-decoration-none">
                <div class="avatar-circle bg-success text-white flex-shrink-0">
                  <i class="bi bi-file-earmark-bar-graph-fill"></i>
                </div>
                <div>
                  <div class="fw-bold text-dark small">Generate Reports</div>
                  <small class="text-muted">Export statistics</small>
                </div>
              </router-link>

              <router-link to="/settings" class="btn btn-light-pill text-start d-flex align-items-center gap-3 py-3 border text-decoration-none">
                <div class="avatar-circle bg-secondary text-white flex-shrink-0">
                  <i class="bi bi-gear-fill"></i>
                </div>
                <div>
                  <div class="fw-bold text-dark small">Officer Settings</div>
                  <small class="text-muted">Preferences & config</small>
                </div>
              </router-link>
            </div>

            <!-- Performance Metrics -->
            <div class="mt-4 pt-4 border-top">
              <h6 class="fw-bold mb-3">
                <i class="bi bi-graph-up me-2"></i>My Performance
              </h6>
              <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <small class="text-muted">Parcels Registered</small>
                  <small class="fw-bold">{{ stats.registeredByMe }}</small>
                </div>
                <div class="progress" style="height: 6px;">
                  <div class="progress-bar bg-primary" :style="{ width: `${Math.min((stats.registeredByMe / 50) * 100, 100)}%` }"></div>
                </div>
              </div>
              <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <small class="text-muted">Transfers Approved</small>
                  <small class="fw-bold">{{ stats.completedThisMonth }}</small>
                </div>
                <div class="progress" style="height: 6px;">
                  <div class="progress-bar bg-success" :style="{ width: `${Math.min((stats.completedThisMonth / 30) * 100, 100)}%` }"></div>
                </div>
              </div>
              <div>
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <small class="text-muted">Pending Reviews</small>
                  <small class="fw-bold text-warning">{{ stats.pendingApprovals }}</small>
                </div>
                <div class="progress" style="height: 6px;">
                  <div class="progress-bar bg-warning" :style="{ width: `${Math.min((stats.pendingApprovals / 20) * 100, 100)}%` }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity & Parcels Grid -->
      <div class="dash-card">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 class="fw-bold mb-1">Recently Registered Parcels</h5>
            <small class="text-muted">Latest additions to the land registry</small>
          </div>
          <router-link to="/parcels" class="btn btn-sm btn-dark">
            <i class="bi bi-grid-fill me-1"></i>View All Parcels
          </router-link>
        </div>

        <div v-if="loadingParcels" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
        </div>

        <div v-else-if="recentParcels.length === 0" class="text-center py-5">
          <i class="bi bi-inbox fs-1 text-muted mb-3 d-block"></i>
          <p class="text-muted">No parcels registered yet</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr style="border-bottom: 2px solid #e5e7eb;">
                <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.75rem;">Parcel Number</th>
                <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.75rem;">Owner</th>
                <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.75rem;">Location</th>
                <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.75rem;">Size</th>
                <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.75rem;">Land Use</th>
                <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.75rem;">Registered</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="parcel in recentParcels.slice(0, 8)" :key="parcel._id" style="border-bottom: 1px solid #f3f4f6;">
                <td class="py-3">
                  <div class="fw-semibold" style="font-size: 0.9rem;">{{ parcel.parcelNumber }}</div>
                </td>
                <td class="py-3">
                  <div style="font-size: 0.85rem;">{{ parcel.currentOwner?.fullName || 'N/A' }}</div>
                  <small class="text-muted">ID: {{ parcel.currentOwner?.nationalId }}</small>
                </td>
                <td class="py-3">
                  <span class="badge bg-light text-dark px-2 py-1">{{ parcel.location?.county }}</span>
                </td>
                <td class="py-3">
                  <span style="font-size: 0.85rem;">{{ parcel.sizeInAcres }} acres</span>
                </td>
                <td class="py-3">
                  <span class="text-capitalize" style="font-size: 0.85rem;">{{ parcel.landUse }}</span>
                </td>
                <td class="py-3">
                  <small class="text-muted">{{ formatDate(parcel.createdAt) }}</small>
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
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'
import api from '@/services/api'

export default {
  name: 'OfficerDashboard',
  components: { Navbar },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const user = computed(() => authStore.user)

    // State
    const loading = ref(false)
    const loadingParcels = ref(false)
    const transferFilter = ref('pending')

    // Statistics
    const stats = ref({
      pendingApprovals: 0,
      totalParcels: 0,
      totalArea: 0,
      completedThisMonth: 0,
      registeredByMe: 0
    })

    // Data
    const transfers = ref([])
    const recentParcels = ref([])
    const recentActivity = ref([])
    
    const countyStats = ref({
      nairobi: 0,
      kiambu: 0,
      nakuru: 0,
      other: 0
    })

    const countyAcres = ref({
      nairobi: 0,
      kiambu: 0,
      nakuru: 0,
      other: 0
    })

    const transferStats = ref({
      pending: 0,
      approved: 0,
      rejected: 0,
      cancelled: 0
    })

    // Computed
    const filteredTransfers = computed(() => {
      if (transferFilter.value === 'all') {
        return transfers.value
      }
      return transfers.value.filter(t => t.status === transferFilter.value)
    })

    // Methods
    const fetchDashboardData = async () => {
      loading.value = true
      loadingParcels.value = true

      console.log('🔍 Fetching Officer Dashboard data...')

      try {
        // Fetch transfers
        console.log('📊 Fetching transfers...')
        const transfersRes = await api.get('/transfers')
        console.log('✅ Transfers response:', transfersRes.data)
        
        if (transfersRes.data?.data?.transfers) {
          transfers.value = transfersRes.data.data.transfers
          stats.value.pendingApprovals = transfers.value.filter(t => t.status === 'pending').length
          
          console.log(`✅ Found ${transfers.value.length} transfers, ${stats.value.pendingApprovals} pending`)
          
          // Count completed this month
          const now = new Date()
          const thisMonth = transfers.value.filter(t => {
            if (t.status !== 'approved' && t.status !== 'completed') return false
            const date = new Date(t.updatedAt || t.createdAt)
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
          })
          stats.value.completedThisMonth = thisMonth.length
          console.log(`✅ Completed this month: ${stats.value.completedThisMonth}`)
        } else {
          console.warn('⚠️ No transfers found in response')
        }

        // Fetch parcels
        console.log('🗺️ Fetching land parcels...')
        const parcelsRes = await api.get('/parcels')
        console.log('✅ Parcels response:', parcelsRes.data)
        
        if (parcelsRes.data?.data?.parcels) {
          recentParcels.value = parcelsRes.data.data.parcels
          stats.value.totalParcels = recentParcels.value.length
          stats.value.totalArea = recentParcels.value.reduce((sum, p) => sum + (parseFloat(p.sizeInAcres) || 0), 0).toFixed(2)
          
          console.log(`✅ Found ${recentParcels.value.length} parcels, ${stats.value.totalArea} total acres`)
          
          // Count registered by current officer
          stats.value.registeredByMe = recentParcels.value.filter(
            p => p.registeredBy === user.value.id
          ).length
          console.log(`✅ Parcels registered by me: ${stats.value.registeredByMe}`)

          // Calculate county distribution (counts and acreage)
          const nairobiParcels = recentParcels.value.filter(p => p.location?.county === 'Nairobi')
          const kiambuParcels = recentParcels.value.filter(p => p.location?.county === 'Kiambu')
          const nakuruParcels = recentParcels.value.filter(p => p.location?.county === 'Nakuru')
          const otherParcels = recentParcels.value.filter(p => p.location?.county && !['Nairobi', 'Kiambu', 'Nakuru'].includes(p.location.county))

          countyStats.value = {
            nairobi: nairobiParcels.length,
            kiambu: kiambuParcels.length,
            nakuru: nakuruParcels.length,
            other: otherParcels.length
          }

          countyAcres.value = {
            nairobi: nairobiParcels.reduce((sum, p) => sum + (parseFloat(p.sizeInAcres) || 0), 0),
            kiambu: kiambuParcels.reduce((sum, p) => sum + (parseFloat(p.sizeInAcres) || 0), 0),
            nakuru: nakuruParcels.reduce((sum, p) => sum + (parseFloat(p.sizeInAcres) || 0), 0),
            other: otherParcels.reduce((sum, p) => sum + (parseFloat(p.sizeInAcres) || 0), 0)
          }

          console.log('🏘️ County distribution:', countyStats.value)
          console.log('📐 County acreage:', countyAcres.value)

          // Generate recent activity from parcels
          const recentParcelActivities = recentParcels.value.slice(0, 3).map(p => ({
            title: 'New Parcel Registered',
            description: `${p.parcelNumber} in ${p.location?.county || 'Unknown'}`,
            time: formatRelativeTime(p.createdAt),
            icon: 'bi-map-fill',
            iconBg: 'bg-primary text-white'
          }))

          // Generate activity from transfers
          const recentTransferActivities = transfers.value.slice(0, 2).map(t => ({
            title: t.status === 'approved' ? 'Transfer Approved' : 'Transfer Pending',
            description: `${t.landParcel?.parcelNumber || 'Parcel'} ownership change`,
            time: formatRelativeTime(t.createdAt),
            icon: t.status === 'approved' ? 'bi-check-circle-fill' : 'bi-hourglass-split',
            iconBg: t.status === 'approved' ? 'bg-success text-white' : 'bg-warning text-dark'
          }))

          recentActivity.value = [...recentTransferActivities, ...recentParcelActivities].slice(0, 5)
        } else {
          console.warn('⚠️ No parcels found in response')
        }

        // Calculate transfer statistics
        transferStats.value = {
          pending: transfers.value.filter(t => t.status === 'pending').length,
          approved: transfers.value.filter(t => t.status === 'approved' || t.status === 'completed').length,
          rejected: transfers.value.filter(t => t.status === 'rejected').length,
          cancelled: transfers.value.filter(t => t.status === 'cancelled').length
        }
        
        console.log('📋 Transfer statistics:', transferStats.value)
        console.log('✅ Dashboard data loaded successfully')
      } catch (err) {
        console.error('❌ Error loading dashboard data:', err)
        console.error('Error details:', err.response?.data || err.message)
      } finally {
        loading.value = false
        loadingParcels.value = false
      }
    }

    const formatRelativeTime = (date) => {
      if (!date) return 'Recently'
      const now = new Date()
      const then = new Date(date)
      const diffMs = now - then
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)

      if (diffMins < 1) return 'Just now'
      if (diffMins < 60) return `${diffMins} min ago`
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
      return formatDate(date)
    }

    const reviewTransfer = (transfer) => {
      router.push(`/transfers/${transfer._id}`)
    }

    const formatDate = (date) => {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('en-KE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const getStatusBadgeClass = (status) => {
      const statusMap = {
        'pending': 'bg-warning text-dark',
        'approved': 'bg-success text-white',
        'completed': 'bg-success text-white',
        'rejected': 'bg-danger text-white',
        'cancelled': 'bg-secondary text-white'
      }
      return statusMap[status?.toLowerCase()] || 'bg-secondary text-white'
    }

    onMounted(() => {
      fetchDashboardData()
    })

    return {
      user,
      loading,
      loadingParcels,
      transferFilter,
      stats,
      transfers,
      recentParcels,
      recentActivity,
      countyStats,
      countyAcres,
      transferStats,
      filteredTransfers,
      reviewTransfer,
      formatDate,
      fetchDashboardData,
      getStatusBadgeClass
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

.activity-feed {
  max-height: 400px;
  overflow-y: auto;
}

.activity-feed::-webkit-scrollbar {
  width: 4px;
}

.activity-feed::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.activity-feed::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.activity-feed::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.progress {
  background-color: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar {
  transition: width 0.6s ease;
}
</style>
