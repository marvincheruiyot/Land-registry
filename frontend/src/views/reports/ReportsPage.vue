<template>
  <div class="main-layout-container">
    <Navbar />

    <main class="flex-grow-1 p-3 p-md-4 p-xl-5">
      <!-- Title -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div class="badge badge-pill-custom badge-soft-purple mb-2">
            <i class="bi bi-graph-up-arrow"></i> Ministry Analytics & Auditing
          </div>
          <h1 class="fw-bold text-dark fs-2 mb-1">Reports & Cadastral Intelligence</h1>
          <p class="text-muted mb-0">Generate official audit trails, conveyancing revenue reports, and land tenure distribution.</p>
        </div>
      </div>

      <div class="row g-4 mb-4">
        <!-- Generate Report Form -->
        <div class="col-12 col-lg-8">
          <div class="dash-card h-100">
            <h5 class="fw-bold mb-3">
              <i class="bi bi-file-earmark-text me-2"></i>Generate Custom Audit Dossier
            </h5>

            <form @submit.prevent="generateReport">
              <div class="row g-3 mb-3">
                <div class="col-12">
                  <label class="form-label fw-semibold text-dark">Report Classification *</label>
                  <select v-model="reportForm.type" class="form-select rounded-pill py-2 bg-light border-0" required>
                    <option value="">Select report type</option>
                    <option value="daily_registrations">Daily Title Registrations</option>
                    <option value="monthly_transfers">Monthly Conveyancing & Transfers</option>
                    <option value="user_activity">User Authentication & Audit Trail</option>
                    <option value="verification_statistics">Deed Verification Inquiries</option>
                    <option value="pending_requests">Pending Registrar Approvals</option>
                    <option value="system_audit">Ministry Security Audit Dossier</option>
                  </select>
                </div>

                <div class="col-12 col-md-6">
                  <label class="form-label fw-semibold text-dark">Start Date *</label>
                  <input v-model="reportForm.startDate" type="date" class="form-control rounded-pill py-2 bg-light border-0" required />
                </div>

                <div class="col-12 col-md-6">
                  <label class="form-label fw-semibold text-dark">End Date *</label>
                  <input v-model="reportForm.endDate" type="date" class="form-control rounded-pill py-2 bg-light border-0" required />
                </div>

                <div class="col-12">
                  <label class="form-label fw-semibold text-dark d-block">Export Format</label>
                  <div class="d-flex gap-3">
                    <div class="form-check">
                      <input class="form-check-input" type="radio" v-model="reportForm.format" value="pdf" id="fmtPdf" />
                      <label class="form-check-label fw-semibold small" for="fmtPdf">
                        <i class="bi bi-file-pdf me-1"></i>PDF Document
                      </label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="radio" v-model="reportForm.format" value="csv" id="fmtCsv" />
                      <label class="form-check-label fw-semibold small" for="fmtCsv">
                        <i class="bi bi-filetype-csv me-1"></i>CSV Spreadsheet
                      </label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="radio" v-model="reportForm.format" value="excel" id="fmtXls" />
                      <label class="form-check-label fw-semibold small" for="fmtXls">
                        <i class="bi bi-file-excel me-1"></i>Excel Workbook
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="generateError" class="alert alert-danger">
                <i class="bi bi-exclamation-triangle me-2"></i>{{ generateError }}
              </div>

              <div v-if="generateSuccess" class="alert alert-success">
                <i class="bi bi-check-circle me-2"></i>{{ generateSuccess }}
              </div>

              <button type="submit" :disabled="generating" class="btn btn-pill btn-dark-pill px-4">
                <span v-if="generating" class="spinner-border spinner-border-sm me-2" role="status"></span>
                <i v-else class="bi bi-file-earmark-arrow-down-fill me-2"></i>
                <span>{{ generating ? 'Synthesizing...' : 'Generate Official Report' }}</span>
              </button>
            </form>
          </div>
        </div>

        <!-- Right Side Quick Analytics Widgets -->
        <div class="col-12 col-lg-4">
          <div class="dash-card card-dark mb-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h6 class="fw-bold text-white mb-0">
                <i class="bi bi-activity me-2"></i>Today's Activity
              </h6>
              <span class="badge bg-secondary-subtle text-light rounded-pill px-2 py-1 small">
                <i class="bi bi-lightning-charge-fill me-1"></i>Realtime
              </span>
            </div>
            <div v-if="loadingStats" class="text-center py-3">
              <div class="spinner-border spinner-border-sm text-light" role="status"></div>
            </div>
            <div v-else class="space-y-2">
              <div class="d-flex justify-content-between py-2 border-bottom border-secondary border-opacity-25">
                <span class="text-secondary small">New Registrations</span>
                <span class="fw-bold text-white">{{ stats.todayRegistrations }}</span>
              </div>
              <div class="d-flex justify-content-between py-2 border-bottom border-secondary border-opacity-25">
                <span class="text-secondary small">Ownership Transfers</span>
                <span class="fw-bold text-warning">{{ stats.todayTransfers }}</span>
              </div>
              <div class="d-flex justify-content-between py-2">
                <span class="text-secondary small">Deed Verifications</span>
                <span class="fw-bold text-success">{{ stats.todayVerifications }}</span>
              </div>
            </div>
          </div>

          <div class="dash-card card-yellow">
            <h6 class="fw-bold mb-2 text-dark">
              <i class="bi bi-folder-fill me-2"></i>Pre-compiled Audits
            </h6>
            <p class="small text-dark mb-3">Instant one-click exports for standard ministry compliance filing.</p>
            <div class="d-flex flex-column gap-2">
              <button @click="downloadQuickReport('monthly')" :disabled="downloading" class="btn btn-pill btn-sm btn-dark-pill justify-content-between">
                <span>Monthly Registry Summary</span>
                <i class="bi bi-download"></i>
              </button>
              <button @click="downloadQuickReport('revenue')" :disabled="downloading" class="btn btn-pill btn-sm btn-light-pill bg-white text-dark justify-content-between">
                <span>County Land Revenue Report</span>
                <i class="bi bi-download"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Generated Reports Archive -->
      <div class="dash-card">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-bold mb-0">
            <i class="bi bi-archive me-2"></i>Generated Audits Archive
          </h5>
          <button @click="loadReports" class="btn btn-sm btn-light" :disabled="loadingReports">
            <i class="bi bi-arrow-clockwise me-1"></i>Refresh
          </button>
        </div>

        <div v-if="loadingReports" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="text-muted mt-2 small">Loading reports...</p>
        </div>

        <div v-else-if="reports.length === 0" class="text-center py-5">
          <div class="avatar-circle bg-light text-muted mx-auto mb-3" style="width: 64px; height: 64px; font-size: 1.5rem;">
            <i class="bi bi-inbox"></i>
          </div>
          <h6 class="fw-bold text-dark mb-2">No Reports Generated</h6>
          <p class="text-muted small mb-0">Generate your first report using the form above</p>
        </div>

        <div v-else class="row g-3">
          <div
            v-for="rep in reports"
            :key="rep.id"
            class="col-12 col-md-6 col-xl-4"
          >
            <div class="p-3 bg-light rounded-4 border d-flex justify-content-between align-items-center hover-shadow" style="cursor: pointer; transition: all 0.2s;">
              <div class="d-flex align-items-center gap-3">
                <div class="avatar-circle text-white" :class="getFormatColor(rep.format)" style="width: 38px; height: 38px;">
                  <i :class="getFormatIcon(rep.format)"></i>
                </div>
                <div>
                  <div class="fw-bold text-dark text-truncate small" style="max-width: 170px;" :title="rep.name">{{ rep.name }}</div>
                  <small class="text-muted" style="font-size: 0.72rem;">
                    <i class="bi bi-calendar3 me-1"></i>{{ rep.date }}
                  </small>
                </div>
              </div>
              <button @click="downloadReport(rep.id)" class="btn btn-pill btn-light-pill btn-sm" title="Download Report">
                <i class="bi bi-download"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import api from '@/services/api'

export default {
  name: 'ReportsPage',
  components: { Navbar },
  setup() {
    const generating = ref(false)
    const generateError = ref(null)
    const generateSuccess = ref(null)
    const loadingReports = ref(false)
    const loadingStats = ref(false)
    const downloading = ref(false)
    
    const reports = ref([])
    const stats = ref({
      todayRegistrations: 0,
      todayTransfers: 0,
      todayVerifications: 0
    })

    const reportForm = ref({
      type: '',
      startDate: '',
      endDate: '',
      format: 'pdf'
    })

    const generateReport = async () => {
      generating.value = true
      generateError.value = null
      generateSuccess.value = null
      
      try {
        const response = await api.post('/reports/generate', reportForm.value, {
          responseType: 'blob'
        })
        
        // Download the PDF directly
        const reportTitle = (reportForm.value.type || 'Registry').replace(/_/g, ' ').toUpperCase();
        const filename = `${reportTitle}_Report_${new Date().toISOString().split('T')[0]}.pdf`;
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
        
        generateSuccess.value = 'Report generated and downloaded successfully!'
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          generateSuccess.value = null
        }, 3000)
        
        // Reset form
        reportForm.value = { type: '', startDate: '', endDate: '', format: 'pdf' }
      } catch (err) {
        console.error('Generate report error:', err)
        generateError.value = err.response?.data?.message || 'Failed to generate report'
      } finally {
        generating.value = false
      }
    }

    const downloadReport = async (reportId) => {
      try {
        downloading.value = true
        const response = await api.get(`/reports/${reportId}/download`, {
          responseType: 'blob'
        })
        
        // Create blob URL and trigger download
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `Report-${reportId}.pdf`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
      } catch (err) {
        console.error('Download error:', err)
        alert('Failed to download report. Please try again.')
      } finally {
        downloading.value = false
      }
    }

    const downloadQuickReport = async (type) => {
      try {
        downloading.value = true
        const response = await api.get(`/reports/quick/${type}`, {
          responseType: 'blob'
        })
        
        const filename = type === 'monthly' ? 'Monthly_Registry_Summary.pdf' : 'County_Land_Revenue.pdf'
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
      } catch (err) {
        console.error('Download quick report error:', err)
        alert('Failed to download report. Please try again.')
      } finally {
        downloading.value = false
      }
    }

    const loadReports = async () => {
      loadingReports.value = true
      try {
        const response = await api.get('/reports')
        if (response.data?.data?.reports) {
          reports.value = response.data.data.reports
        }
      } catch (err) {
        console.error('Load reports error:', err)
        // Keep existing reports or show empty
      } finally {
        loadingReports.value = false
      }
    }

    const loadStats = async () => {
      loadingStats.value = true
      try {
        const response = await api.get('/reports/statistics')
        if (response.data?.data) {
          stats.value = {
            todayRegistrations: response.data.data.todayRegistrations || 0,
            todayTransfers: response.data.data.todayTransfers || 0,
            todayVerifications: response.data.data.todayVerifications || 0
          }
        }
      } catch (err) {
        console.error('Load stats error:', err)
        // Keep default stats (0s)
      } finally {
        loadingStats.value = false
      }
    }

    const getFormatIcon = (format) => {
      const icons = {
        'pdf': 'bi-file-pdf',
        'csv': 'bi-filetype-csv',
        'excel': 'bi-file-excel',
        'xlsx': 'bi-file-excel'
      }
      return icons[format?.toLowerCase()] || 'bi-file-earmark'
    }

    const getFormatColor = (format) => {
      const colors = {
        'pdf': 'bg-danger',
        'csv': 'bg-success',
        'excel': 'bg-primary',
        'xlsx': 'bg-primary'
      }
      return colors[format?.toLowerCase()] || 'bg-dark'
    }

    onMounted(() => {
      loadReports()
      loadStats()
      
      // Refresh stats every 30 seconds
      setInterval(loadStats, 30000)
    })

    return {
      generating,
      generateError,
      generateSuccess,
      loadingReports,
      loadingStats,
      downloading,
      reports,
      stats,
      reportForm,
      generateReport,
      downloadReport,
      downloadQuickReport,
      loadReports,
      getFormatIcon,
      getFormatColor
    }
  }
}
</script>

<style scoped>
.hover-shadow:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}
</style>
