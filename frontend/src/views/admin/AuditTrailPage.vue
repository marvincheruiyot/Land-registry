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
              <span class="text-muted small fw-medium">Transfer Activities</span>
              <div class="avatar-circle bg-success text-white" style="width: 32px; height: 32px; font-size: 0.85rem;">
                <i class="bi bi-arrow-left-right"></i>
              </div>
            </div>
            <div class="display-6 fw-bold text-success lh-1 mb-1">{{ auditStats.transferCount }}</div>
            <small class="text-muted" style="font-size: 0.75rem;">Initiated, approved & rejected transfers</small>
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
              <option value="document">Document</option>
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
              <tr v-for="log in displayedLogs" :key="log._id" style="border-bottom: 1px solid #f3f4f6;">
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
                  <div class="small">{{ getEventDescription(log) }}</div>
                  <small v-if="log.details" class="text-muted d-block mt-1">
                    {{ getTransferDetails(log) }}
                  </small>
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
        <div v-if="auditLogs.length > 0" class="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mt-4 pt-3 border-top">
          <div class="d-flex align-items-center gap-3">
            <small class="text-muted">
              Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, auditTotal) }} of {{ auditTotal }} records
            </small>
            <div class="d-flex align-items-center gap-2">
              <label class="text-muted small mb-0">Items per page:</label>
              <select v-model.number="itemsPerPage" @change="changeItemsPerPage" class="form-select form-select-sm" style="width: auto;">
                <option :value="10">10</option>
                <option :value="20">20</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
              </select>
            </div>
          </div>
          
          <nav>
            <ul class="pagination pagination-sm mb-0">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
                  <i class="bi bi-chevron-left"></i>
                </button>
              </li>
              
              <li v-if="currentPage > 2" class="page-item">
                <button class="page-link" @click="goToPage(1)">1</button>
              </li>
              
              <li v-if="currentPage > 3" class="page-item disabled">
                <span class="page-link">...</span>
              </li>
              
              <li v-if="currentPage > 1" class="page-item">
                <button class="page-link" @click="goToPage(currentPage - 1)">{{ currentPage - 1 }}</button>
              </li>
              
              <li class="page-item active">
                <span class="page-link">{{ currentPage }}</span>
              </li>
              
              <li v-if="currentPage < totalPages" class="page-item">
                <button class="page-link" @click="goToPage(currentPage + 1)">{{ currentPage + 1 }}</button>
              </li>
              
              <li v-if="currentPage < totalPages - 2" class="page-item disabled">
                <span class="page-link">...</span>
              </li>
              
              <li v-if="currentPage < totalPages - 1" class="page-item">
                <button class="page-link" @click="goToPage(totalPages)">{{ totalPages }}</button>
              </li>
              
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button class="page-link" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">
                  <i class="bi bi-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
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
    const currentPage = ref(1)
    const itemsPerPage = ref(20)
    const totalRecords = ref(0)
    
    const auditStats = ref({
      todayCount: 0,
      transferCount: 0,
      criticalCount: 0
    })

    const auditTotal = computed(() => totalRecords.value)
    const totalPages = computed(() => Math.ceil(totalRecords.value / itemsPerPage.value))
    const displayedLogs = computed(() => {
      let filtered = [...auditLogs.value]
      
      // Apply search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(log => 
          log.action?.toLowerCase().includes(query) ||
          log.user?.fullName?.toLowerCase().includes(query) ||
          log.user?.role?.toLowerCase().includes(query) ||
          log.description?.toLowerCase().includes(query) ||
          log.details?.parcelNumber?.toLowerCase().includes(query) ||
          log.ipAddress?.includes(query)
        )
      }
      
      // Apply action filter
      if (actionFilter.value !== 'all') {
        filtered = filtered.filter(log => {
          const action = log.action?.toLowerCase() || ''
          switch(actionFilter.value) {
            case 'auth':
              return action.includes('login') || action.includes('logout') || action.includes('auth')
            case 'parcel':
              return action.includes('parcel') && !action.includes('transfer')
            case 'transfer':
              return action.includes('transfer')
            case 'user':
              return action.includes('user') && !action.includes('login')
            case 'document':
              return action.includes('document')
            default:
              return true
          }
        })
      }
      
      // Apply severity filter
      if (severityFilter.value !== 'all') {
        filtered = filtered.filter(log => 
          log.severity?.toLowerCase() === severityFilter.value.toLowerCase()
        )
      }
      
      // Apply date range filter
      if (dateRange.value !== 'all') {
        const now = new Date()
        filtered = filtered.filter(log => {
          const logDate = new Date(log.createdAt)
          switch(dateRange.value) {
            case 'today':
              return logDate.toDateString() === now.toDateString()
            case 'week':
              const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
              return logDate >= weekAgo
            case 'month':
              const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
              return logDate >= monthAgo
            default:
              return true
          }
        })
      }
      
      // Update total records for pagination
      totalRecords.value = filtered.length
      
      // Apply pagination
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filtered.slice(start, end)
    })

    const hasFilters = computed(() => {
      return searchQuery.value || actionFilter.value !== 'all' || 
             severityFilter.value !== 'all' || dateRange.value !== 'all'
    })

    const loadAuditLogs = async (forceRefresh = false) => {
      loading.value = true
      try {
        const response = await api.get('/audit-logs?limit=1000')
        if (response.data?.data?.logs) {
          auditLogs.value = response.data.data.logs
          
          // Reset to first page when filters change
          if (!forceRefresh) {
            currentPage.value = 1
          }

          // Calculate stats from all logs (not filtered)
          const now = new Date()
          const today = now.toDateString()
          
          auditStats.value.todayCount = auditLogs.value.filter(log => 
            new Date(log.createdAt).toDateString() === today
          ).length

          auditStats.value.transferCount = auditLogs.value.filter(log => 
            log.action?.includes('TRANSFER')
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
      currentPage.value = 1
      loadAuditLogs()
    }

    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
      }
    }

    const changeItemsPerPage = () => {
      currentPage.value = 1
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

    const getEventDescription = (log) => {
      if (log.description) return log.description
      
      // Format transfer actions nicely
      if (log.action?.includes('TRANSFER')) {
        const details = log.details || {}
        if (log.action === 'TRANSFER_INITIATED') {
          return `Transfer initiated from ${details.previousOwner || 'Unknown'} to ${details.newOwner || 'Unknown'}`
        } else if (log.action === 'TRANSFER_APPROVED') {
          return `Transfer approved by ${details.approvedBy || 'Officer'}`
        } else if (log.action === 'TRANSFER_REJECTED') {
          return `Transfer rejected: ${details.rejectionReason || 'No reason provided'}`
        } else if (log.action === 'TRANSFER_CANCELLED') {
          return `Transfer cancelled by ${details.cancelledBy || 'User'}`
        }
      }
      
      return log.action || 'No description'
    }

    const getTransferDetails = (log) => {
      if (!log.action?.includes('TRANSFER')) return ''
      
      const details = log.details || {}
      const parts = []
      
      if (details.parcelNumber) parts.push(`Parcel: ${details.parcelNumber}`)
      if (details.transferType) parts.push(`Type: ${details.transferType}`)
      if (details.previousOwnerNationalId) parts.push(`From ID: ${details.previousOwnerNationalId}`)
      if (details.newOwnerNationalId) parts.push(`To ID: ${details.newOwnerNationalId}`)
      
      return parts.join(' • ')
    }

    onMounted(() => {
      loadAuditLogs()
    })

    return {
      loading,
      auditLogs,
      displayedLogs,
      searchQuery,
      actionFilter,
      severityFilter,
      dateRange,
      auditStats,
      auditTotal,
      currentPage,
      itemsPerPage,
      totalPages,
      hasFilters,
      loadAuditLogs,
      resetFilters,
      goToPage,
      changeItemsPerPage,
      formatDate,
      formatTime,
      getSeverityClass,
      getEventDescription,
      getTransferDetails
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
