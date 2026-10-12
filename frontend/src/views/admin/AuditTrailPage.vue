<template>
  <div class="main-layout-container">
    <Navbar />

    <main class="flex-grow-1 p-3 p-md-4 p-xl-5">
      <!-- Header -->
      <div class="mb-4">
        <span class="badge badge-pill-custom badge-soft-blue mb-2">
          <i class="bi bi-shield-check"></i> Security & Compliance
        </span>
        <h1 class="fw-bold text-dark fs-2 mb-1">System Audit Trail</h1>
        <p class="text-muted mb-0">Comprehensive cryptographic activity logs, tamper-evident timestamps, and security audit telemetry.</p>
      </div>

      <!-- Key Metrics -->
      <div class="row g-3 mb-4">
        <div class="col-12 col-sm-6 col-xl-3">
          <div class="dash-card h-100">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <span class="text-muted small fw-medium">Total Audited Events</span>
              <div class="avatar-circle bg-dark text-white" style="width: 32px; height: 32px; font-size: 0.85rem;">
                <i class="bi bi-clipboard-data-fill"></i>
              </div>
            </div>
            <div class="display-6 fw-bold text-dark lh-1 mb-1">{{ auditTotal }}</div>
            <small class="text-muted" style="font-size: 0.75rem;">10-Year statutory ledger retention</small>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-xl-3">
          <div class="dash-card h-100">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <span class="text-muted small fw-medium">Logged in 24 Hours</span>
              <div class="avatar-circle bg-primary text-white" style="width: 32px; height: 32px; font-size: 0.85rem;">
                <i class="bi bi-clock-history"></i>
              </div>
            </div>
            <div class="display-6 fw-bold text-primary lh-1 mb-1">{{ auditStats.todayCount }}</div>
            <small class="text-muted" style="font-size: 0.75rem;">Recent transactions & authentications</small>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-xl-3">
          <div class="dash-card h-100">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <span class="text-muted small fw-medium">Security Warnings</span>
              <div class="avatar-circle bg-warning text-dark" style="width: 32px; height: 32px; font-size: 0.85rem;">
                <i class="bi bi-exclamation-triangle-fill"></i>
              </div>
            </div>
            <div class="display-6 fw-bold text-warning lh-1 mb-1">{{ auditStats.warningCount }}</div>
            <small class="text-muted" style="font-size: 0.75rem;">Failed logins & permission checks</small>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-xl-3">
          <div class="dash-card h-100">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <span class="text-muted small fw-medium">Critical Alerts</span>
              <div class="avatar-circle bg-danger text-white" style="width: 32px; height: 32px; font-size: 0.85rem;">
                <i class="bi bi-shield-exclamation"></i>
              </div>
            </div>
            <div class="display-6 fw-bold text-danger lh-1 mb-1">{{ auditStats.criticalCount }}</div>
            <small class="text-muted" style="font-size: 0.75rem;">Suspicious activity & system alerts</small>
          </div>
        </div>
      </div>

      <!-- Filters & Actions -->
      <div class="dash-card mb-4">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div class="d-flex align-items-center gap-2">
            <h5 class="fw-bold text-dark mb-0">National Cadastral Audit Trail</h5>
            <span class="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2 py-1 small">
              <i class="bi bi-circle-fill text-success me-1" style="font-size: 0.5rem;"></i> Live Ledger
            </span>
          </div>
          <div class="d-flex gap-2">
            <button @click="loadAuditLogs(true)" class="btn btn-sm btn-light-pill" :disabled="loading">
              <i class="bi bi-arrow-clockwise" :class="{ 'spin': loading }"></i>
              <span class="ms-1">Refresh</span>
            </button>
            <button class="btn btn-sm btn-dark">
              <i class="bi bi-file-earmark-spreadsheet me-1 text-warning"></i>Export CSV
            </button>
          </div>
        </div>

        <!-- Search & Filters -->
        <div class="row g-3 mb-4">
          <div class="col-12 col-md-4">
            <div class="input-group">
              <span class="input-group-text bg-white border-end-0">
                <i class="bi bi-search"></i>
              </span>
              <input
                v-model="searchQuery"
                @input="loadAuditLogs"
                type="text"
                class="form-control border-start-0 bg-white"
                placeholder="Search action, actor, IP, parcel or text..."
              />
            </div>
          </div>

          <div class="col-6 col-md-2">
            <select v-model="actionFilter" @change="loadAuditLogs" class="form-select bg-white">
              <option value="all">All Actions</option>
              <option value="auth">Authentication</option>
              <option value="parcel">Parcel</option>
              <option value="transfer">Transfer</option>
              <option value="user">User</option>
            </select>
          </div>

          <div class="col-6 col-md-2">
            <select v-model="severityFilter" @change="loadAuditLogs" class="form-select bg-white">
              <option value="all">All Severities</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>

          <div class="col-6 col-md-2">
            <select v-model="dateRange" @change="loadAuditLogs" class="form-select bg-white">
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          <div class="col-6 col-md-2">
            <button v-if="hasFilters" @click="resetFilters" class="btn btn-outline-secondary w-100">
              <i class="bi bi-x-circle me-1"></i>Reset
            </button>
          </div>
        </div>

        <!-- Audit Logs Table -->
        <div v-if="loading && auditLogs.length === 0" class="text-center py-5">
          <div class="spinner-border text-dark" role="status"></div>
          <p class="text-muted mt-2 small">Loading audit trail...</p>
        </div>

        <div v-else-if="auditLogs.length === 0" class="text-center py-5 bg-light rounded-4">
          <i class="bi bi-shield-check fs-1 text-muted mb-3 d-block"></i>
          <h6 class="fw-bold text-dark">No Audit Log Entries Found</h6>
          <p class="text-muted small">No records matched the search filters or date range.</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr style="border-bottom: 2px solid #e5e7eb;">
                <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.7rem;">Timestamp</th>
                <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.7rem;">Action Type</th>
                <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.7rem;">Actor</th>
                <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.7rem;">Event Description</th>
                <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.7rem;">Entity</th>
                <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.7rem;">Severity</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in auditLogs" :key="log._id" style="border-bottom: 1px solid #f3f4f6;">
                <td class="py-3">
                  <div class="small">{{ formatDate(log.createdAt) }}</div>
                  <small class="text-muted">{{ formatTime(log.createdAt) }}</small>
                </td>
                <td class="py-3">
                  <span class="badge bg-success text-white px-2 py-1 text-uppercase" style="font-size: 0.7rem;">
                    {{ log.action || 'N/A' }}
                  </span>
                </td>
                <td class="py-3">
                  <div class="d-flex align-items-center gap-2">
                    <div class="avatar-circle bg-dark text-white flex-shrink-0" style="width: 32px; height: 32px; font-size: 0.7rem;">
                      {{ log.user?.fullName?.charAt(0) || '?' }}
                    </div>
                    <div>
                      <div class="fw-semibold small">{{ log.user?.fullName || 'System' }}</div>
                      <small class="text-muted">{{ log.user?.role || 'Administrator' }}</small>
                    </div>
                  </div>
                </td>
                <td class="py-3">
                  <div class="small">{{ log.description || log.details || 'No description' }}</div>
                </td>
                <td class="py-3">
                  <span class="badge bg-light text-dark px-2 py-1">{{ log.entityType || log.resourceType || '—' }}</span>
                </td>
                <td class="py-3">
                  <span :class="['badge px-2 py-1', getSeverityClass(log.severity)]" style="font-size: 0.7rem;">
                    {{ log.severity || 'INFO' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="auditLogs.length > 0" class="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
          <small class="text-muted">Showing {{ auditLogs.length }} of {{ auditTotal }} records</small>
          <button class="btn btn-sm btn-light-pill">Load More</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import api from '@/services/api'

export default {
  name: 'AuditTrailPage',
  components: { Navbar },
  setup() {
    const loading = ref(false)
    const auditLogs = ref([])
    const searchQuery = ref('')
    const actionFilter = ref('all')
    const severityFilter = ref('all')
    const dateRange = ref('all')
    
    const auditStats = ref({
      todayCount: 0,
      warningCount: 0,
      criticalCount: 0
    })

    const auditTotal = computed(() => auditLogs.value.length)

    const hasFilters = computed(() => {
      return searchQuery.value || actionFilter.value !== 'all' || 
             severityFilter.value !== 'all' || dateRange.value !== 'all'
    })

    const loadAuditLogs = async (forceRefresh = false) => {
      loading.value = true
      try {
        const response = await api.get('/audit-logs?limit=100')
        if (response.data?.data?.logs) {
          auditLogs.value = response.data.data.logs

          // Calculate stats
          const now = new Date()
          const today = now.toDateString()
          
          auditStats.value.todayCount = auditLogs.value.filter(log => 
            new Date(log.createdAt).toDateString() === today
          ).length

          auditStats.value.warningCount = auditLogs.value.filter(log => 
            log.severity?.toLowerCase() === 'warning'
          ).length

          auditStats.value.criticalCount = auditLogs.value.filter(log => 
            log.severity?.toLowerCase() === 'error' || log.severity?.toLowerCase() === 'critical'
          ).length
        }
      } catch (err) {
        console.error('Error loading audit logs:', err)
      } finally {
        loading.value = false
      }
    }

    const resetFilters = () => {
      searchQuery.value = ''
      actionFilter.value = 'all'
      severityFilter.value = 'all'
      dateRange.value = 'all'
      loadAuditLogs()
    }

    const formatDate = (date) => {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('en-KE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const formatTime = (date) => {
      if (!date) return ''
      return new Date(date).toLocaleTimeString('en-KE', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const getSeverityClass = (severity) => {
      const classes = {
        'info': 'bg-primary text-white',
        'warning': 'bg-warning text-dark',
        'error': 'bg-danger text-white',
        'critical': 'bg-danger text-white'
      }
      return classes[severity?.toLowerCase()] || 'bg-secondary text-white'
    }

    onMounted(() => {
      loadAuditLogs()
    })

    return {
      loading,
      auditLogs,
      searchQuery,
      actionFilter,
      severityFilter,
      dateRange,
      auditStats,
      auditTotal,
      hasFilters,
      loadAuditLogs,
      resetFilters,
      formatDate,
      formatTime,
      getSeverityClass
    }
  }
}
</script>

<style scoped>
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.table tbody tr {
  transition: background-color 0.2s ease;
}

.table tbody tr:hover {
  background-color: #f9fafb;
}
</style>
