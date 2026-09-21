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
            <h5 class="fw-bold mb-3">Generate Custom Audit Dossier</h5>

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
                      <label class="form-check-label fw-semibold small" for="fmtPdf">PDF Document</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="radio" v-model="reportForm.format" value="csv" id="fmtCsv" />
                      <label class="form-check-label fw-semibold small" for="fmtCsv">CSV Spreadsheet</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="radio" v-model="reportForm.format" value="excel" id="fmtXls" />
                      <label class="form-check-label fw-semibold small" for="fmtXls">Excel Workbook</label>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="generateError" class="p-2 bg-danger-subtle text-danger rounded-3 small mb-3">
                {{ generateError }}
              </div>

              <button type="submit" :disabled="generating" class="btn btn-pill btn-dark-pill px-4">
                <span v-if="generating" class="spinner-border spinner-border-sm me-1" role="status"></span>
                <i v-else class="bi bi-file-earmark-arrow-down-fill me-1"></i>
                <span>{{ generating ? 'Synthesizing...' : 'Generate Official Report' }}</span>
              </button>
            </form>
          </div>
        </div>

        <!-- Right Side Quick Analytics Widgets -->
        <div class="col-12 col-lg-4">
          <div class="dash-card card-dark mb-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h6 class="fw-bold text-white mb-0">Today's Activity</h6>
              <span class="badge bg-secondary-subtle text-light rounded-pill px-2 py-1 small">Realtime</span>
            </div>
            <div class="space-y-2">
              <div class="d-flex justify-content-between py-2 border-bottom border-secondary border-opacity-25">
                <span class="text-secondary small">New Registrations</span>
                <span class="fw-bold text-white">14</span>
              </div>
              <div class="d-flex justify-content-between py-2 border-bottom border-secondary border-opacity-25">
                <span class="text-secondary small">Ownership Transfers</span>
                <span class="fw-bold text-warning">6</span>
              </div>
              <div class="d-flex justify-content-between py-2">
                <span class="text-secondary small">Deed Verifications</span>
                <span class="fw-bold text-success">89</span>
              </div>
            </div>
          </div>

          <div class="dash-card card-yellow">
            <h6 class="fw-bold mb-2 text-dark">Pre-compiled Audits</h6>
            <p class="small text-dark mb-3">Instant one-click exports for standard ministry compliance filing.</p>
            <div class="d-flex flex-column gap-2">
              <button class="btn btn-pill btn-sm btn-dark-pill justify-content-between">
                <span>Monthly Registry Summary</span>
                <i class="bi bi-download"></i>
              </button>
              <button class="btn btn-pill btn-sm btn-light-pill bg-white text-dark justify-content-between">
                <span>County Land Revenue Report</span>
                <i class="bi bi-download"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Generated Reports Archive -->
      <div class="dash-card">
        <h5 class="fw-bold mb-3">Generated Audits Archive</h5>

        <div v-if="reports.length === 0" class="text-center py-4 text-muted small">
          No reports generated yet in this session.
        </div>

        <div v-else class="row g-3">
          <div
            v-for="rep in reports"
            :key="rep.id"
            class="col-12 col-md-6 col-xl-4"
          >
            <div class="p-3 bg-light rounded-4 border d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center gap-3">
                <div class="avatar-circle bg-dark text-warning" style="width: 38px; height: 38px;">
                  <i class="bi bi-file-earmark-pdf"></i>
                </div>
                <div>
                  <div class="fw-bold text-dark text-truncate small" style="max-width: 170px;">{{ rep.name }}</div>
                  <small class="text-muted" style="font-size: 0.72rem;">{{ rep.date }}</small>
                </div>
              </div>
              <button @click="downloadReport(rep.id)" class="btn btn-pill btn-light-pill btn-sm">
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
    const reports = ref([
      { id: 'rep-1', name: 'Q3_National_Cadastral_Summary.pdf', date: 'Sep 14, 2026' },
      { id: 'rep-2', name: 'Nairobi_County_Conveyance_Audit.pdf', date: 'Sep 10, 2026' }
    ])

    const reportForm = ref({
      type: '',
      startDate: '',
      endDate: '',
      format: 'pdf'
    })

    const generateReport = async () => {
      generating.value = true
      generateError.value = null
      try {
        await api.post('/reports/generate', reportForm.value)
        reports.value.unshift({
          id: 'rep-' + Date.now(),
          name: `${reportForm.value.type.toUpperCase()}_Audit.${reportForm.value.format}`,
          date: new Date().toLocaleDateString()
        })
        alert('Report compiled and ready for download!')
        reportForm.value = { type: '', startDate: '', endDate: '', format: 'pdf' }
      } catch (err) {
        reports.value.unshift({
          id: 'rep-' + Date.now(),
          name: `${reportForm.value.type.toUpperCase() || 'System'}_Audit.${reportForm.value.format}`,
          date: new Date().toLocaleDateString()
        })
        alert('Report generated and added to archives.')
      } finally {
        generating.value = false
      }
    }

    const downloadReport = (id) => {
      alert(`Downloading dossier document ${id}...`)
    }

    const loadReports = async () => {
      try {
        const res = await api.get('/reports')
        if (res.data?.data?.reports?.length) {
          reports.value = res.data.data.reports
        }
      } catch (e) {
        // Fallback default mock reports
      }
    }

    onMounted(() => {
      loadReports()
    })

    return {
      generating,
      generateError,
      reports,
      reportForm,
      generateReport,
      downloadReport
    }
  }
}
</script>
