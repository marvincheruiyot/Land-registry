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
                      <input class="form-check-input" type="radio" v-model="reportForm.format" value="excel" id="fmtXls" />
                      <label class="form-check-label fw-semibold small" for="fmtXls">
                        <i class="bi bi-file-excel me-1"></i>Excel Workbook
                      </label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="radio" v-model="reportForm.format" value="csv" id="fmtCsv" />
                      <label class="form-check-label fw-semibold small" for="fmtCsv">
                        <i class="bi bi-filetype-csv me-1"></i>CSV Spreadsheet
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
            <div v-else>
              <div class="space-y-2 mb-3">
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
              <button 
                @click="generateTodayActivity" 
                :disabled="generatingToday"
                class="btn btn-sm btn-light-pill w-100 d-flex justify-content-between align-items-center"
              >
                <span>
                  <i class="bi bi-file-earmark-pdf me-1"></i>
                  {{ generatingToday ? 'Generating...' : 'Generate Report' }}
                </span>
                <i v-if="!generatingToday" class="bi bi-download"></i>
                <span v-else class="spinner-border spinner-border-sm" role="status"></span>
              </button>
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

      <!-- Today's Data Tables -->
      <div class="dash-card mb-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-bold mb-0">
            <i class="bi bi-table me-2"></i>Today's Detailed Records
          </h5>
          <button @click="loadDetailedData" class="btn btn-sm btn-light" :disabled="loadingDetails">
            <i class="bi bi-arrow-clockwise me-1"></i>Refresh
          </button>
        </div>

        <!-- Tabs for different data types -->
        <ul class="nav nav-tabs mb-3" role="tablist">
          <li class="nav-item" role="presentation">
            <button 
              class="nav-link" 
              :class="{ active: activeTab === 'registrations' }"
              @click="activeTab = 'registrations'"
              type="button"
            >
              <i class="bi bi-house-add me-1"></i>
              Registrations ({{ detailedData.registrations.length }})
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button 
              class="nav-link" 
              :class="{ active: activeTab === 'transfers' }"
              @click="activeTab = 'transfers'"
              type="button"
            >
              <i class="bi bi-arrow-left-right me-1"></i>
              Transfers ({{ detailedData.transfers.length }})
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button 
              class="nav-link" 
              :class="{ active: activeTab === 'verifications' }"
              @click="activeTab = 'verifications'"
              type="button"
            >
              <i class="bi bi-check-circle me-1"></i>
              Verifications ({{ detailedData.verifications.length }})
            </button>
          </li>
        </ul>

        <!-- Loading State -->
        <div v-if="loadingDetails" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="text-muted mt-2 small">Loading detailed records...</p>
        </div>

        <!-- Tab Content -->
        <div v-else class="tab-content">
          <!-- Registrations Table -->
          <div v-if="activeTab === 'registrations'" class="tab-pane fade show active">
            <div v-if="detailedData.registrations.length === 0" class="text-center py-4">
              <i class="bi bi-inbox text-muted" style="font-size: 2rem;"></i>
              <p class="text-muted mt-2">No registrations today</p>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-hover">
                <thead class="table-light">
                  <tr>
                    <th>Parcel Number</th>
                    <th>Owner</th>
                    <th>Location</th>
                    <th>Size (Acres)</th>
                    <th>Land Use</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="parcel in detailedData.registrations" :key="parcel._id">
                    <td><span class="badge bg-primary">{{ parcel.parcelNumber }}</span></td>
                    <td>
                      <div class="fw-semibold">{{ parcel.ownerName }}</div>
                      <small class="text-muted">ID: {{ parcel.nationalId }}</small>
                    </td>
                    <td>
                      <div>{{ parcel.county }}</div>
                      <small class="text-muted">{{ parcel.subCounty }}</small>
                    </td>
                    <td>{{ parcel.sizeInAcres }}</td>
                    <td><span class="badge bg-info">{{ parcel.landUse }}</span></td>
                    <td><small>{{ parcel.time }}</small></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Transfers Table -->
          <div v-if="activeTab === 'transfers'" class="tab-pane fade show active">
            <div v-if="detailedData.transfers.length === 0" class="text-center py-4">
              <i class="bi bi-inbox text-muted" style="font-size: 2rem;"></i>
              <p class="text-muted mt-2">No transfers today</p>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-hover">
                <thead class="table-light">
                  <tr>
                    <th>Parcel Number</th>
                    <th>Previous Owner</th>
                    <th>New Owner</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="transfer in detailedData.transfers" :key="transfer._id">
                    <td><span class="badge bg-primary">{{ transfer.parcelNumber }}</span></td>
                    <td>
                      <div class="fw-semibold">{{ transfer.previousOwner }}</div>
                      <small class="text-muted">{{ transfer.previousOwnerPhone }}</small>
                    </td>
                    <td>
                      <div class="fw-semibold">{{ transfer.newOwner }}</div>
                      <small class="text-muted">{{ transfer.newOwnerPhone }}</small>
                    </td>
                    <td><span class="badge bg-secondary">{{ transfer.transferType }}</span></td>
                    <td>
                      <span 
                        class="badge" 
                        :class="{
                          'bg-warning': transfer.status === 'pending',
                          'bg-success': transfer.status === 'approved',
                          'bg-danger': transfer.status === 'rejected'
                        }"
                      >
                        {{ transfer.status }}
                      </span>
                    </td>
                    <td>{{ transfer.amount }}</td>
                    <td><small>{{ transfer.time }}</small></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Verifications Table -->
          <div v-if="activeTab === 'verifications'" class="tab-pane fade show active">
            <div v-if="detailedData.verifications.length === 0" class="text-center py-4">
              <i class="bi bi-inbox text-muted" style="font-size: 2rem;"></i>
              <p class="text-muted mt-2">No verifications today</p>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-hover">
                <thead class="table-light">
                  <tr>
                    <th>Action</th>
                    <th>Performed By</th>
                    <th>Role</th>
                    <th>Entity Type</th>
                    <th>IP Address</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="verification in detailedData.verifications" :key="verification._id">
                    <td><span class="badge bg-success">{{ verification.action }}</span></td>
                    <td class="fw-semibold">{{ verification.performedBy }}</td>
                    <td><span class="badge bg-info">{{ verification.role }}</span></td>
                    <td>{{ verification.entityType }}</td>
                    <td><small class="text-muted">{{ verification.ipAddress }}</small></td>
                    <td><small>{{ verification.time }}</small></td>
                  </tr>
                </tbody>
              </table>
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
    const generatingToday = ref(false)
    const generateError = ref(null)
    const generateSuccess = ref(null)
    const loadingReports = ref(false)
    const loadingStats = ref(false)
    const loadingDetails = ref(false)
    const downloading = ref(false)
    const activeTab = ref('registrations')
    
    const reports = ref([])
    const stats = ref({
      todayRegistrations: 0,
      todayTransfers: 0,
      todayVerifications: 0
    })
    
    const detailedData = ref({
      registrations: [],
      transfers: [],
      verifications: []
    })

    const reportForm = ref({
      type: '',
      startDate: '',
      endDate: '',
      format: 'excel'
    })

    const generateReport = async () => {
      generating.value = true
      generateError.value = null
      generateSuccess.value = null
      
      // Validate format - only allow Excel or CSV
      if (reportForm.value.format !== 'excel' && reportForm.value.format !== 'csv') {
        generateError.value = '❌ PDF format is not supported. Please select Excel Workbook or CSV Spreadsheet.'
        generating.value = false
        return
      }
      
      try {
        const response = await api.post('/reports/generate', reportForm.value, {
          responseType: 'blob'
        })
        
        // Download the file with correct extension (both use CSV)
        const reportTitle = (reportForm.value.type || 'Registry').replace(/_/g, ' ').toUpperCase();
        const filename = `${reportTitle}_Report_${new Date().toISOString().split('T')[0]}.csv`;
        
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
        
        const formatName = reportForm.value.format === 'excel' ? 'Excel-compatible CSV' : 'CSV';
        generateSuccess.value = `✅ ${formatName} report generated and downloaded successfully!`
        
        // Reload reports archive
        await loadReports()
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          generateSuccess.value = null
        }, 3000)
        
        // Reset form
        reportForm.value = { type: '', startDate: '', endDate: '', format: 'excel' }
      } catch (err) {
        console.error('Generate report error:', err)
        generateError.value = err.response?.data?.message || 'Failed to generate report'
      } finally {
        generating.value = false
      }
    }

    const generateTodayActivity = async () => {
      generatingToday.value = true
      
      try {
        const response = await api.post('/reports/today-activity', {}, {
          responseType: 'blob'
        })
        
        // Download the PDF
        const filename = `Todays_Activity_${new Date().toISOString().split('T')[0]}.pdf`;
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
        
        // Reload reports archive to show the new report
        await loadReports()
        
        // Show success notification
        alert('Today\'s Activity report generated and saved to archive!')
      } catch (err) {
        console.error('Generate today activity error:', err)
        alert('Failed to generate today\'s activity report. Please try again.')
      } finally {
        generatingToday.value = false
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
    
    const loadDetailedData = async () => {
      loadingDetails.value = true
      try {
        const response = await api.get('/reports/detailed')
        if (response.data?.data) {
          // Format registrations data
          detailedData.value.registrations = response.data.data.registrations.map(parcel => ({
            _id: parcel._id,
            parcelNumber: parcel.parcelNumber,
            ownerName: parcel.currentOwner?.fullName || 'N/A',
            nationalId: parcel.currentOwner?.nationalId || 'N/A',
            county: parcel.location?.county || 'N/A',
            subCounty: parcel.location?.subCounty || 'N/A',
            sizeInAcres: parcel.sizeInAcres || 0,
            landUse: parcel.landUse || 'N/A',
            time: new Date(parcel.createdAt).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })
          }))
          
          // Format transfers data
          detailedData.value.transfers = response.data.data.transfers.map(transfer => ({
            _id: transfer._id,
            parcelNumber: transfer.landParcel?.parcelNumber || 'N/A',
            previousOwner: transfer.previousOwner?.fullName || 'N/A',
            previousOwnerPhone: transfer.previousOwner?.phoneNumber || 'N/A',
            newOwner: transfer.newOwner?.fullName || 'N/A',
            newOwnerPhone: transfer.newOwner?.phoneNumber || 'N/A',
            transferType: transfer.transferType || 'N/A',
            status: transfer.status || 'pending',
            amount: transfer.transferAmount ? `KSh ${transfer.transferAmount.toLocaleString()}` : 'N/A',
            time: new Date(transfer.createdAt).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })
          }))
          
          // Format verifications data
          detailedData.value.verifications = response.data.data.verifications.map(log => ({
            _id: log._id,
            action: log.action,
            performedBy: log.performedBy?.fullName || 'System',
            role: log.performedBy?.role || 'System',
            entityType: log.entityType || 'N/A',
            ipAddress: log.ipAddress || '127.0.0.1',
            time: new Date(log.createdAt).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })
          }))
        }
      } catch (err) {
        console.error('Load detailed data error:', err)
        // Keep empty arrays
      } finally {
        loadingDetails.value = false
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
      loadDetailedData()
      
      // Refresh stats every 30 seconds
      setInterval(loadStats, 30000)
    })

    return {
      generating,
      generatingToday,
      generateError,
      generateSuccess,
      loadingReports,
      loadingStats,
      loadingDetails,
      downloading,
      activeTab,
      reports,
      stats,
      detailedData,
      reportForm,
      generateReport,
      generateTodayActivity,
      downloadReport,
      downloadQuickReport,
      loadReports,
      loadDetailedData,
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

.nav-tabs {
  border-bottom: 2px solid #e9ecef;
}

.nav-tabs .nav-link {
  color: #6c757d;
  border: none;
  border-bottom: 3px solid transparent;
  padding: 0.75rem 1.5rem;
  transition: all 0.3s ease;
}

.nav-tabs .nav-link:hover {
  border-color: #dee2e6;
  color: #495057;
}

.nav-tabs .nav-link.active {
  color: #495057;
  font-weight: 600;
  background-color: transparent;
  border-color: transparent;
  border-bottom-color: #0d6efd;
}

.table {
  font-size: 0.9rem;
}

.table thead th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  color: #6c757d;
  border-bottom: 2px solid #dee2e6;
}

.table tbody tr {
  transition: all 0.2s ease;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
  transform: scale(1.01);
}

.badge {
  padding: 0.35rem 0.65rem;
  font-weight: 500;
  font-size: 0.75rem;
}

.table-responsive {
  border-radius: 0.5rem;
  overflow: hidden;
}
</style>
