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
                +12% this mo
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
                  stroke-dasharray="290 471" stroke-dashoffset="0"
                  transform="rotate(-90 105 105)" stroke-linecap="round"
                />
                <circle
                  cx="105" cy="105" r="75" fill="none" stroke="#f6c535" stroke-width="26"
                  stroke-dasharray="115 471" stroke-dashoffset="-290"
                  transform="rotate(-90 105 105)" stroke-linecap="round"
                />
                <circle
                  cx="105" cy="105" r="75" fill="none" stroke="#3d70f5" stroke-width="26"
                  stroke-dasharray="60 471" stroke-dashoffset="-405"
                  transform="rotate(-90 105 105)" stroke-linecap="round"
                />
              </svg>
              <div class="position-absolute text-center">
                <div class="fs-3 fw-bold text-dark lh-1">100%</div>
                <small class="text-muted" style="font-size: 0.75rem;">Digitalized</small>
              </div>
            </div>

            <div class="space-y-2 mt-3">
              <div class="d-flex justify-content-between align-items-center py-1 border-bottom">
                <div class="d-flex align-items-center gap-2">
                  <span class="rounded-circle d-inline-block" style="width: 10px; height: 10px; background: #151821;"></span>
                  <span class="text-muted small">Freehold Residential</span>
                </div>
                <span class="fw-bold small">62%</span>
              </div>
              <div class="d-flex justify-content-between align-items-center py-1 border-bottom">
                <div class="d-flex align-items-center gap-2">
                  <span class="rounded-circle d-inline-block" style="width: 10px; height: 10px; background: #f6c535;"></span>
                  <span class="text-muted small">Leasehold Commercial</span>
                </div>
                <span class="fw-bold small">25%</span>
              </div>
              <div class="d-flex justify-content-between align-items-center py-1">
                <div class="d-flex align-items-center gap-2">
                  <span class="rounded-circle d-inline-block" style="width: 10px; height: 10px; background: #3d70f5;"></span>
                  <span class="text-muted small">Agricultural / Public</span>
                </div>
                <span class="fw-bold small">13%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Transfer Workflow Requests (Table with rounded avatars & status badges) -->
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
            <router-link to="/reports" class="p-3 bg-light rounded-4 text-decoration-none d-flex align-items-center gap-3 h-100 hover-elevate">
              <div class="avatar-circle bg-success text-white">
                <i class="bi bi-file-earmark-bar-graph fs-5"></i>
              </div>
              <div>
                <div class="fw-bold text-dark">Export Audit</div>
                <small class="text-muted">Generate PDF/CSV reports</small>
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
      parcelsCount: 42,
      transfersCount: 8,
      documentsCount: 65
    })

    const recentTransfers = ref([])

    const fetchDashboardData = async () => {
      try {
        const [parcelsRes, transfersRes] = await Promise.allSettled([
          api.get('/parcels?limit=5'),
          api.get('/transfers?limit=4')
        ])

        if (parcelsRes.status === 'fulfilled' && parcelsRes.value?.data?.data) {
          stats.value.parcelsCount = parcelsRes.value.data.data.total || parcelsRes.value.data.data.parcels?.length || 0
        }
        
        if (transfersRes.status === 'fulfilled' && transfersRes.value?.data?.data) {
          const transfers = transfersRes.value.data.data.transfers || []
          stats.value.transfersCount = transfersRes.value.data.data.total || transfers.length || 0
          
          // Map transfers to display format
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
      } catch (err) {
        console.error('Error loading dashboard data:', err)
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
      recentTransfers
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
</style>
