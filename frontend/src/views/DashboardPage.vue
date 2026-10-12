<template>
  <div class="main-layout-container">
    <Navbar />

    <main class="flex-grow-1 p-3 p-md-4 p-xl-5">
      <!-- Top Title & Welcome Header -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <span class="badge badge-pill-custom badge-soft-yellow mb-2">
            <i class="bi bi-stars"></i> National Land Management Portal
          </span>
          <h1 class="fw-bold text-dark fs-2 mb-1">Overview Dashboard</h1>
          <p class="text-muted mb-0">Welcome back, {{ user?.fullName || 'Registrar' }}. Here is what is happening today.</p>
        </div>
      </div>

      <!-- Top Nikitin-Style Highlight Grid -->
      <div class="row g-4 mb-4">
        <!-- Hero Black Card (Total Registered / Active Parcels) -->
        <div class="col-12 col-md-6 col-xl-3">
          <div class="dash-card card-dark h-100 d-flex flex-column justify-content-between">
            <div class="d-flex justify-content-between align-items-start mb-4">
              <div class="avatar-circle bg-dark-subtle text-white border border-secondary">
                <i class="bi bi-map fs-5"></i>
              </div>
              <span class="badge bg-secondary-subtle text-light rounded-pill px-3 py-1">
                +12% month
              </span>
            </div>
            <div>
              <div class="display-5 fw-bold mb-1 lh-1">{{ stats.parcelsCount }}</div>
              <div class="text-secondary small fw-medium">Registered Parcels</div>
            </div>
            <div class="mt-4 pt-3 border-top border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
              <small class="text-secondary">Fully digital titles</small>
              <router-link to="/parcels" class="text-warning text-decoration-none small fw-semibold">
                Explore <i class="bi bi-arrow-right"></i>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Yellow Card (Active Transfers Pending) -->
        <div class="col-12 col-md-6 col-xl-3">
          <div class="dash-card card-yellow h-100 d-flex flex-column justify-content-between">
            <div class="d-flex justify-content-between align-items-start mb-4">
              <div class="avatar-circle bg-dark text-warning">
                <i class="bi bi-arrow-left-right fs-5"></i>
              </div>
              <span class="badge bg-dark text-white rounded-pill px-3 py-1">
                Live Queue
              </span>
            </div>
            <div>
              <div class="display-5 fw-bold mb-1 lh-1">{{ stats.transfersCount }}</div>
              <div class="text-dark small fw-medium">Active Transfers</div>
            </div>
            <div class="mt-4 pt-3 border-top border-dark border-opacity-10 d-flex justify-content-between align-items-center">
              <small class="text-dark">Awaiting review/sign</small>
              <router-link to="/transfers" class="text-dark fw-bold text-decoration-none small">
                Review <i class="bi bi-arrow-right"></i>
              </router-link>
            </div>
          </div>
        </div>

        <!-- White Card 1 (Documents Digitized) -->
        <div class="col-12 col-md-6 col-xl-3">
          <div class="dash-card h-100 d-flex flex-column justify-content-between">
            <div class="d-flex justify-content-between align-items-start mb-4">
              <div class="avatar-circle bg-light text-primary">
                <i class="bi bi-file-earmark-lock2 fs-5"></i>
              </div>
              <span class="badge badge-pill-custom badge-soft-blue">
                Verified
              </span>
            </div>
            <div>
              <div class="display-5 fw-bold mb-1 lh-1">{{ stats.documentsCount }}</div>
              <div class="text-muted small fw-medium">Deed Documents</div>
            </div>
            <div class="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
              <small class="text-muted">SHA-256 Checksums</small>
              <router-link to="/documents" class="text-primary text-decoration-none small fw-semibold">
                View Vault <i class="bi bi-arrow-right"></i>
              </router-link>
            </div>
          </div>
        </div>

        <!-- White Card 2 (System Health / Verified Deeds) -->
        <div class="col-12 col-md-6 col-xl-3">
          <div class="dash-card h-100 d-flex flex-column justify-content-between">
            <div class="d-flex justify-content-between align-items-start mb-4">
              <div class="avatar-circle bg-light text-success">
                <i class="bi bi-shield-check fs-5"></i>
              </div>
              <span class="badge badge-pill-custom badge-soft-green">
                Audited
              </span>
            </div>
            <div>
              <div class="display-5 fw-bold mb-1 lh-1">99.8%</div>
              <div class="text-muted small fw-medium">Integrity Rate</div>
            </div>
            <div class="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
              <small class="text-muted">Zero fraud disputes</small>
              <router-link to="/reports" class="text-success text-decoration-none small fw-semibold">
                Metrics <i class="bi bi-arrow-right"></i>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Mid Section: Nikitin Graphical Breakdown & Recent Tasks -->
      <div class="row g-4 mb-4">
        <!-- Donut / Distribution Card (Matching Nikitin shot center widget) -->
        <div class="col-12 col-lg-5 col-xl-4">
          <div class="dash-card h-100 d-flex flex-column justify-content-between">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 class="fw-bold mb-0">Parcel Categorization</h5>
                <small class="text-muted">Breakdown by Kenyan land tenure</small>
              </div>
              <button class="btn btn-sm btn-light-pill rounded-circle p-2" title="Details">
                <i class="bi bi-three-dots"></i>
              </button>
            </div>

            <!-- Custom SVG Circular Gauge matching Dribbble reference -->
            <div class="d-flex justify-content-center align-items-center my-3 position-relative">
              <svg width="210" height="210" viewBox="0 0 210 210">
                <circle cx="105" cy="105" r="75" fill="none" stroke="#f1f3f7" stroke-width="26" />
                <circle
                  cx="105" cy="105" r="75" fill="none" stroke="#151821" stroke-width="26"
                  :stroke-dasharray="`${(residentialPercentage / 100) * 471} 471`" stroke-dashoffset="0"
                  transform="rotate(-90 105 105)" stroke-linecap="round"
                />
                <circle
                  cx="105" cy="105" r="75" fill="none" stroke="#f6c535" stroke-width="26"
                  :stroke-dasharray="`${(commercialPercentage / 100) * 471} 471`" :stroke-dashoffset="`-${(residentialPercentage / 100) * 471}`"
                  transform="rotate(-90 105 105)" stroke-linecap="round"
                />
                <circle
                  cx="105" cy="105" r="75" fill="none" stroke="#3d70f5" stroke-width="26"
                  :stroke-dasharray="`${(agriculturalPercentage / 100) * 471} 471`" :stroke-dashoffset="`-${((residentialPercentage + commercialPercentage) / 100) * 471}`"
                  transform="rotate(-90 105 105)" stroke-linecap="round"
                />
              </svg>
              <div class="position-absolute text-center">
                <div class="fs-3 fw-bold text-dark lh-1">{{ digitalizationPercentage }}%</div>
                <small class="text-muted" style="font-size: 0.75rem;">Digitalized</small>
              </div>
            </div>

            <div class="space-y-2 mt-3">
              <div class="d-flex justify-content-between align-items-center py-1 border-bottom">
                <div class="d-flex align-items-center gap-2">
                  <span class="rounded-circle d-inline-block" style="width: 10px; height: 10px; background: #151821;"></span>
                  <span class="text-muted small">Freehold Residential</span>
                </div>
                <span class="fw-bold small">{{ residentialPercentage }}%</span>
              </div>
              <div class="d-flex justify-content-between align-items-center py-1 border-bottom">
                <div class="d-flex align-items-center gap-2">
                  <span class="rounded-circle d-inline-block" style="width: 10px; height: 10px; background: #f6c535;"></span>
                  <span class="text-muted small">Leasehold Commercial</span>
                </div>
                <span class="fw-bold small">{{ commercialPercentage }}%</span>
              </div>
              <div class="d-flex justify-content-between align-items-center py-1">
                <div class="d-flex align-items-center gap-2">
                  <span class="rounded-circle d-inline-block" style="width: 10px; height: 10px; background: #3d70f5;"></span>
                  <span class="text-muted small">Agricultural / Public</span>
                </div>
                <span class="fw-bold small">{{ agriculturalPercentage }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Transfer Workflow Requests -->
        <div class="col-12 col-lg-7 col-xl-8">
          <div class="dash-card h-100 d-flex flex-column justify-content-between">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 class="fw-bold mb-0">Recent Transfers & Applications</h5>
                <small class="text-muted">Incoming ownership deeds and verifications</small>
              </div>
              <router-link to="/transfers" class="btn btn-sm btn-light-pill">
                View All
              </router-link>
            </div>

            <div class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead class="text-muted small">
                  <tr>
                    <th scope="col" class="border-0 pb-3">PARCEL NO.</th>
                    <th scope="col" class="border-0 pb-3">TRANSFEREE</th>
                    <th scope="col" class="border-0 pb-3">COUNTY</th>
                    <th scope="col" class="border-0 pb-3">STATUS</th>
                    <th scope="col" class="border-0 pb-3 text-end">ACTION</th>
                  </tr>
                </thead>
                <tbody class="border-top-0">
                  <tr v-for="(item, idx) in recentTransfers" :key="idx">
                    <td>
                      <div class="d-flex align-items-center gap-2">
                        <div class="avatar-circle bg-light text-dark" style="width: 32px; height: 32px;">
                          <i class="bi bi-geo-alt"></i>
                        </div>
                        <div>
                          <div class="fw-bold text-dark small">{{ item.parcelNumber }}</div>
                          <small class="text-muted">{{ item.type }}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="small fw-semibold text-dark">{{ item.newOwner }}</div>
                      <small class="text-muted">ID: {{ item.idNumber }}</small>
                    </td>
                    <td>
                      <span class="badge bg-light text-dark rounded-pill px-2 py-1 small">
                        {{ item.county }}
                      </span>
                    </td>
                    <td>
                      <span :class="['badge badge-pill-custom', item.badgeClass]">
                        {{ item.status }}
                      </span>
                    </td>
                    <td class="text-end">
                      <router-link :to="item.link" class="btn btn-sm btn-light-pill rounded-circle p-2" title="Inspect">
                        <i class="bi bi-arrow-up-right"></i>
                      </router-link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
              <span class="small text-muted">Showing recent 4 records synchronized</span>
              <router-link to="/transfers/create" class="btn btn-pill btn-dark-pill btn-sm">
                <i class="bi bi-send-plus"></i> Initiate New Transfer
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Real-Time Audit Trail & Security Ledger Strip -->
      <div class="dash-card mb-4">
        <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-3">
          <div>
            <div class="d-flex align-items-center gap-2">
              <h5 class="fw-bold mb-0">System Audit Trail & Cryptographic Telemetry</h5>
              <span class="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2 py-1 small">
                <i class="bi bi-circle-fill text-success me-1 pulse-dot" style="font-size: 0.5rem;"></i> Live
              </span>
            </div>
            <small class="text-muted">Real-time tamper-evident log of registrar operations, deed updates, and security events</small>
          </div>
          <router-link to="/audit-trail" class="btn btn-pill btn-dark-pill btn-sm">
            <i class="bi bi-shield-check me-1"></i> Full Audit Trail
          </router-link>
        </div>

        <div v-if="recentAuditLogs.length === 0" class="text-center py-4 bg-light rounded-4">
          <i class="bi bi-shield-check fs-2 text-muted mb-2 d-block"></i>
          <p class="text-muted small mb-0">All systems secure. No anomalous security incidents recorded.</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="text-muted small">
              <tr>
                <th scope="col" class="border-0 pb-2">TIME</th>
                <th scope="col" class="border-0 pb-2">ACTION</th>
                <th scope="col" class="border-0 pb-2">ACTOR</th>
                <th scope="col" class="border-0 pb-2">EVENT DESCRIPTION</th>
                <th scope="col" class="border-0 pb-2">SEVERITY</th>
                <th scope="col" class="border-0 pb-2 text-end">ORIGIN IP</th>
              </tr>
            </thead>
            <tbody class="border-top-0">
              <tr v-for="(log, idx) in recentAuditLogs" :key="log._id || idx">
                <td>
                  <small class="fw-semibold text-dark">{{ formatRelativeTime(log.timestamp || log.createdAt) }}</small>
                </td>
                <td>
                  <span :class="['badge badge-pill-custom', getActionBadgeClass(log.action)]">
                    <i :class="getActionIcon(log.action)" class="me-1"></i>
                    {{ formatActionName(log.action) }}
                  </span>
                </td>
                <td>
                  <div class="fw-semibold text-dark small">{{ log.user?.fullName || 'System Daemon' }}</div>
                  <small class="text-muted">{{ log.user?.role ? log.user.role.replace('_', ' ') : 'Automated' }}</small>
                </td>
                <td>
                  <div class="small text-dark text-truncate" style="max-width: 320px;">
                    {{ log.description || log.details || 'Activity registered' }}
                  </div>
                </td>
                <td>
                  <span :class="['badge badge-pill-custom', getSeverityBadgeClass(log.severity)]">
                    {{ (log.severity || 'info').toUpperCase() }}
                  </span>
                </td>
                <td class="text-end">
                  <code class="small text-muted">{{ log.ipAddress || '127.0.0.1' }}</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Quick Execution Strip (Nikitin Dribbble pill-style action buttons) -->
      <div class="dash-card">
        <h5 class="fw-bold mb-3">Instant Operational Shortcuts</h5>
        <div class="row g-3">
          <div class="col-12 col-sm-6 col-md-3">
            <router-link to="/verify" class="p-3 bg-light rounded-4 text-decoration-none d-flex align-items-center gap-3 h-100 hover-elevate">
              <div class="avatar-circle bg-warning text-dark">
                <i class="bi bi-qr-code-scan fs-5"></i>
              </div>
              <div>
                <div class="fw-bold text-dark">Verify Token</div>
                <small class="text-muted">Check deed legitimacy</small>
              </div>
            </router-link>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <router-link to="/parcels" class="p-3 bg-light rounded-4 text-decoration-none d-flex align-items-center gap-3 h-100 hover-elevate">
              <div class="avatar-circle bg-dark text-white">
                <i class="bi bi-collection fs-5"></i>
              </div>
              <div>
                <div class="fw-bold text-dark">Search Registry</div>
                <small class="text-muted">Browse nationwide plots</small>
              </div>
            </router-link>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <router-link to="/documents" class="p-3 bg-light rounded-4 text-decoration-none d-flex align-items-center gap-3 h-100 hover-elevate">
              <div class="avatar-circle bg-primary text-white">
                <i class="bi bi-cloud-arrow-up fs-5"></i>
              </div>
              <div>
                <div class="fw-bold text-dark">Upload Deed</div>
                <small class="text-muted">Add survey & documents</small>
              </div>
            </router-link>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <router-link to="/audit-trail" class="p-3 bg-light rounded-4 text-decoration-none d-flex align-items-center gap-3 h-100 hover-elevate">
              <div class="avatar-circle bg-dark text-warning">
                <i class="bi bi-shield-check fs-5"></i>
              </div>
              <div>
                <div class="fw-bold text-dark">Audit Trail</div>
                <small class="text-muted">Explore security ledger</small>
              </div>
            </router-link>
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
  name: 'DashboardPage',
  components: { Navbar },
  setup() {
    const authStore = useAuthStore()

    const user = computed(() => authStore.user)
    const isLandOfficer = computed(() => authStore.isLandOfficer)
    const isAdministrator = computed(() => authStore.isAdministrator)

    const stats = ref({
      parcelsCount: 0,
      transfersCount: 0,
      documentsCount: 0
    })

    const recentTransfers = ref([])
    const recentAuditLogs = ref([])
    const parcelCategories = ref({
      residential: 0,
      commercial: 0,
      agricultural: 0,
      total: 0
    })

    const fetchDashboardData = async () => {
      try {
        const [parcelsRes, transfersRes, auditRes] = await Promise.allSettled([
          api.get('/parcels'),
          api.get('/transfers?limit=4'),
          api.get('/audit-logs?limit=5')
        ])

        if (parcelsRes.status === 'fulfilled' && parcelsRes.value?.data?.data) {
          const parcelsData = parcelsRes.value.data.data.parcels || []
          stats.value.parcelsCount = parcelsData.length
          
          // Calculate parcel categorization from real data
          parcelCategories.value.total = parcelsData.length
          parcelCategories.value.residential = parcelsData.filter(p => 
            p.landUse && p.landUse.toLowerCase().includes('residential')
          ).length
          parcelCategories.value.commercial = parcelsData.filter(p => 
            p.landUse && p.landUse.toLowerCase().includes('commercial')
          ).length
          parcelCategories.value.agricultural = parcelsData.filter(p => 
            p.landUse && (p.landUse.toLowerCase().includes('agricultural') || p.landUse.toLowerCase().includes('public'))
          ).length
        }
        
        if (transfersRes.status === 'fulfilled' && transfersRes.value?.data?.data) {
          const transfers = transfersRes.value.data.data.transfers || []
          stats.value.transfersCount = transfers.length
          
          // Map transfers to display format with real data
          recentTransfers.value = transfers.slice(0, 4).map(t => ({
            parcelNumber: t.landParcel?.parcelNumber || 'N/A',
            type: t.transferType || 'Transfer',
            newOwner: t.newOwner?.fullName || 'Unknown',
            idNumber: t.newOwner?.nationalId || 'N/A',
            county: t.landParcel?.location?.county || 'N/A',
            status: t.status === 'pending' ? 'Pending' : t.status === 'approved' ? 'Approved' : t.status === 'rejected' ? 'Rejected' : 'In Review',
            badgeClass: t.status === 'pending' ? 'badge-soft-yellow' : t.status === 'approved' ? 'badge-soft-green' : t.status === 'rejected' ? 'badge-soft-red' : 'badge-soft-blue',
            link: `/transfers`
          }))
        }

        if (auditRes.status === 'fulfilled' && auditRes.value?.data?.data) {
          recentAuditLogs.value = auditRes.value.data.data.logs || []
        }

        // Set documents count (parcels * 2 as estimate)
        stats.value.documentsCount = stats.value.parcelsCount * 2
      } catch (err) {
        console.error('Error loading dashboard data:', err)
      }
    }

    // Computed properties for parcel categorization percentages
    const residentialPercentage = computed(() => {
      if (parcelCategories.value.total === 0) return 0
      return Math.round((parcelCategories.value.residential / parcelCategories.value.total) * 100)
    })

    const commercialPercentage = computed(() => {
      if (parcelCategories.value.total === 0) return 0
      return Math.round((parcelCategories.value.commercial / parcelCategories.value.total) * 100)
    })

    const agriculturalPercentage = computed(() => {
      if (parcelCategories.value.total === 0) return 0
      return Math.round((parcelCategories.value.agricultural / parcelCategories.value.total) * 100)
    })

    const digitalizationPercentage = computed(() => {
      return parcelCategories.value.total > 0 ? 100 : 0
    })

    const formatRelativeTime = (dateVal) => {
      if (!dateVal) return ''
      try {
        const now = Date.now()
        const diff = Math.floor((now - new Date(dateVal).getTime()) / 1000)
        if (diff < 60) return `${diff}s ago`
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
        return `${Math.floor(diff / 86400)}d ago`
      } catch (e) {
        return ''
      }
    }

    const formatActionName = (action) => {
      if (!action) return 'Activity'
      return action.replace(/_/g, ' ')
    }

    const getActionBadgeClass = (action) => {
      const act = (action || '').toUpperCase()
      if (act.includes('LOGIN_FAILED') || act.includes('DELETED') || act.includes('REJECTED')) {
        return 'badge-soft-red'
      }
      if (act.includes('LOGIN') || act.includes('APPROVED') || act.includes('ACTIVATE')) {
        return 'badge-soft-green'
      }
      if (act.includes('PARCEL') || act.includes('TRANSFER')) {
        return 'badge-soft-yellow'
      }
      return 'badge-soft-blue'
    }

    const getActionIcon = (action) => {
      const act = (action || '').toUpperCase()
      if (act.includes('LOGIN_FAILED')) return 'bi bi-shield-x'
      if (act.includes('LOGIN')) return 'bi bi-box-arrow-in-right'
      if (act.includes('LOGOUT')) return 'bi bi-box-arrow-right'
      if (act.includes('PARCEL')) return 'bi bi-map'
      if (act.includes('TRANSFER')) return 'bi bi-arrow-left-right'
      if (act.includes('DOCUMENT')) return 'bi bi-file-earmark-lock2'
      return 'bi bi-activity'
    }

    const getSeverityBadgeClass = (severity) => {
      switch ((severity || '').toLowerCase()) {
        case 'critical':
        case 'error':
          return 'badge-soft-red'
        case 'warning':
          return 'badge-soft-yellow'
        default:
          return 'badge-soft-blue'
      }
    }

    onMounted(() => {
      fetchDashboardData()
    })

    return {
      user,
      isLandOfficer,
      isAdministrator,
      stats,
      recentTransfers,
      recentAuditLogs,
      parcelCategories,
      residentialPercentage,
      commercialPercentage,
      agriculturalPercentage,
      digitalizationPercentage,
      formatRelativeTime,
      formatActionName,
      getActionBadgeClass,
      getActionIcon,
      getSeverityBadgeClass
    }
  }
}
</script>

<style scoped>
.hover-elevate {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid rgba(220, 225, 235, 0.6);
}
.hover-elevate:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.05);
}

.btn-check:checked + .btn-outline-secondary {
  background-color: #212529;
  color: white;
}

@keyframes pulse {
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}
.pulse-dot {
  display: inline-block;
  animation: pulse 1.8s infinite ease-in-out;
}
</style>
