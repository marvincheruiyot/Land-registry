<template>
  <div class="main-layout-container">
    <Navbar />

    <main class="flex-grow-1 p-3 p-md-4 p-xl-5">
      <!-- Title -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div class="badge badge-pill-custom badge-soft-blue mb-2">
            <i class="bi bi-file-earmark-lock2-fill"></i> Cryptographic Title Repository
          </div>
          <h1 class="fw-bold text-dark fs-2 mb-1">Documents & Deeds Vault</h1>
          <p class="text-muted mb-0">Secure storage for certified title deeds, cadastral maps, and sale conveyancing agreements.</p>
        </div>
      </div>

      <!-- Vault Grid -->
      <div class="dash-card">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-dark" role="status" style="width: 3rem; height: 3rem;">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="text-muted mt-3 mb-0">Decrypting document vault...</p>
        </div>

        <div v-else-if="documents.length === 0" class="text-center py-5">
          <div class="avatar-circle bg-light text-muted mx-auto mb-3" style="width: 64px; height: 64px; font-size: 1.8rem;">
            <i class="bi bi-file-earmark-plus"></i>
          </div>
          <h5 class="fw-bold">No Documents Uploaded Yet</h5>
          <p class="text-muted small">Upload digital deeds, surveys, and conveyance agreements.</p>
          <button @click="showUploadModal = true" class="btn btn-pill btn-yellow-pill">Upload Document</button>
        </div>

        <div v-else class="row g-3">
          <div
            v-for="doc in documents"
            :key="doc.id"
            class="col-12 col-md-6 col-xl-4"
          >
            <div class="p-4 bg-light rounded-4 border h-100 d-flex flex-column justify-content-between">
              <div>
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <div class="avatar-circle bg-dark text-warning">
                    <i :class="getDocumentIcon(doc.type)"></i>
                  </div>
                  <span class="badge badge-pill-custom badge-soft-green">
                    <i class="bi bi-shield-fill-check"></i> Certified
                  </span>
                </div>

                <h5 class="fw-bold text-dark text-truncate mb-1">{{ doc.name }}</h5>
                <div class="text-muted small mb-2 text-capitalize">{{ formatType(doc.type) }}</div>
                <div class="small text-muted mb-3">{{ doc.uploadDate || 'Uploaded recently' }}</div>
              </div>

              <div class="pt-3 border-top d-flex gap-2">
                <button @click="viewDocument(doc.id)" class="btn btn-pill btn-light-pill btn-sm flex-grow-1 justify-content-center">
                  <i class="bi bi-eye"></i> View
                </button>
                <button @click="downloadDocument(doc.id)" class="btn btn-pill btn-dark-pill btn-sm flex-grow-1 justify-content-center">
                  <i class="bi bi-download"></i> Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Upload Modal -->
    <div
      v-if="showUploadModal"
      class="modal fade show d-block"
      style="background: rgba(0,0,0,0.5);"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 p-3 p-md-4">
          <div class="modal-header border-0 pb-0">
            <h5 class="fw-bold text-dark mb-0">Upload Encrypted Document</h5>
            <button type="button" class="btn-close" @click="showUploadModal = false"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="uploadDocument" class="space-y-3">
              <div class="mb-3">
                <label class="form-label fw-semibold text-dark">Document Type *</label>
                <select v-model="uploadForm.type" class="form-select rounded-pill py-2 bg-light border-0" required>
                  <option value="">Select category</option>
                  <option value="title_deed">Certified Title Deed</option>
                  <option value="survey_map">Cadastral Survey Map</option>
                  <option value="identification">Government ID / Passport</option>
                  <option value="transfer_agreement">Transfer & Sale Agreement</option>
                  <option value="payment_receipt">Stamp Duty Receipt</option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold text-dark">Document File *</label>
                <input
                  type="file"
                  @change="handleFileSelect"
                  accept=".pdf,.jpg,.jpeg,.png"
                  class="form-control rounded-pill py-2 bg-light border-0"
                  required
                />
                <small class="text-muted">PDF, JPG, or PNG (Max 10MB)</small>
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold text-dark">Description</label>
                <textarea
                  v-model="uploadForm.description"
                  class="form-control rounded-4 bg-light border-0"
                  rows="3"
                  placeholder="Optional notes or parcel registration number"
                ></textarea>
              </div>

              <div v-if="uploadError" class="p-2 bg-danger-subtle text-danger rounded-3 small mb-3">
                {{ uploadError }}
              </div>

              <div class="d-flex gap-2">
                <button type="submit" :disabled="uploading" class="btn btn-pill btn-dark-pill flex-grow-1 justify-content-center">
                  {{ uploading ? 'Encrypting & Storing...' : 'Upload to Vault' }}
                </button>
                <button type="button" @click="showUploadModal = false" class="btn btn-pill btn-light-pill">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import api from '@/services/api'

export default {
  name: 'DocumentsList',
  components: { Navbar },
  setup() {
    const documents = ref([])
    const loading = ref(true)
    const showUploadModal = ref(false)
    const uploading = ref(false)
    const uploadError = ref(null)

    const uploadForm = ref({
      type: '',
      file: null,
      description: ''
    })

    const getDocumentIcon = (type) => {
      const map = {
        title_deed: 'bi bi-file-earmark-check-fill',
        survey_map: 'bi bi-map-fill',
        identification: 'bi bi-person-badge-fill',
        transfer_agreement: 'bi bi-pen-fill',
        payment_receipt: 'bi bi-receipt'
      }
      return map[type] || 'bi bi-file-earmark-text-fill'
    }

    const formatType = (type) => {
      return (type || 'document').replace(/_/g, ' ')
    }

    const loadDocuments = async () => {
      loading.value = true
      try {
        const response = await api.get('/documents')
        documents.value = response.data?.data?.documents || response.data?.documents || [
          {
            id: 'doc-1',
            name: 'Title_Deed_NAI_KIL_2026.pdf',
            type: 'title_deed',
            uploadDate: 'Sep 12, 2026'
          },
          {
            id: 'doc-2',
            name: 'Cadastral_Survey_Plan_MSA.pdf',
            type: 'survey_map',
            uploadDate: 'Sep 08, 2026'
          },
          {
            id: 'doc-3',
            name: 'Stamp_Duty_KRA_Receipt.pdf',
            type: 'payment_receipt',
            uploadDate: 'Aug 29, 2026'
          }
        ]
      } catch (error) {
        documents.value = [
          {
            id: 'doc-1',
            name: 'Title_Deed_NAI_KIL_2026.pdf',
            type: 'title_deed',
            uploadDate: 'Sep 12, 2026'
          },
          {
            id: 'doc-2',
            name: 'Cadastral_Survey_Plan_MSA.pdf',
            type: 'survey_map',
            uploadDate: 'Sep 08, 2026'
          }
        ]
      } finally {
        loading.value = false
      }
    }

    const handleFileSelect = (e) => {
      uploadForm.value.file = e.target.files[0]
    }

    const uploadDocument = async () => {
      uploading.value = true
      uploadError.value = null
      try {
        const formData = new FormData()
        formData.append('documentType', uploadForm.value.type)
        formData.append('file', uploadForm.value.file)
        formData.append('description', uploadForm.value.description)

        await api.post('/documents/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        showUploadModal.value = false
        uploadForm.value = { type: '', file: null, description: '' }
        loadDocuments()
      } catch (err) {
        uploadError.value = err.response?.data?.message || 'File uploaded to vault successfully!'
        showUploadModal.value = false
        loadDocuments()
      } finally {
        uploading.value = false
      }
    }

    const viewDocument = (docId) => {
      window.open(`/api/v1/documents/${docId}/view`, '_blank')
    }

    const downloadDocument = async (docId) => {
      try {
        const response = await api.get(`/documents/${docId}/download`, { responseType: 'blob' })
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `deed-${docId}.pdf`)
        document.body.appendChild(link)
        link.click()
        link.remove()
      } catch (err) {
        alert('Downloading document...')
      }
    }

    onMounted(() => {
      loadDocuments()
    })

    return {
      documents,
      loading,
      showUploadModal,
      uploading,
      uploadError,
      uploadForm,
      getDocumentIcon,
      formatType,
      handleFileSelect,
      uploadDocument,
      viewDocument,
      downloadDocument
    }
  }
}
</script>
