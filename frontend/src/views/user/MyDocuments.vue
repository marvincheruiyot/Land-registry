<template>
  <div class="main-layout-container">
    <Navbar />
    <main class="flex-grow-1 p-3 p-md-4 p-xl-5">
      <!-- Header -->
      <div class="mb-4">
        <span class="badge badge-pill-custom badge-soft-green mb-2">
          <i class="bi bi-file-earmark-text"></i> Document Management
        </span>
        <h1 class="fw-bold text-dark fs-2 mb-1">My Documents</h1>
        <p class="text-muted mb-0">View and manage your land title deeds and related documents</p>
      </div>

      <!-- Statistics Cards -->
      <div class="row g-3 mb-4">
        <div class="col-6 col-md-4">
          <div class="dash-card h-100">
            <div class="d-flex align-items-center gap-3">
              <div class="avatar-circle bg-primary text-white">
                <i class="bi bi-file-earmark-check"></i>
              </div>
              <div>
                <div class="display-6 fw-bold">{{ stats.total }}</div>
                <small class="text-muted">Total Documents</small>
              </div>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-4">
          <div class="dash-card h-100">
            <div class="d-flex align-items-center gap-3">
              <div class="avatar-circle bg-success text-white">
                <i class="bi bi-shield-check"></i>
              </div>
              <div>
                <div class="display-6 fw-bold">{{ stats.verified }}</div>
                <small class="text-muted">Verified</small>
              </div>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-4">
          <div class="dash-card h-100">
            <div class="d-flex align-items-center gap-3">
              <div class="avatar-circle bg-warning text-dark">
                <i class="bi bi-clock-history"></i>
              </div>
              <div>
                <div class="display-6 fw-bold">{{ stats.pending }}</div>
                <small class="text-muted">Pending Review</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Documents Table -->
      <div class="dash-card">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h5 class="fw-bold mb-0">
            <i class="bi bi-folder2-open me-2"></i>All Documents
          </h5>
          <div class="d-flex gap-2">
            <select v-model="typeFilter" @change="filterDocuments" class="form-select form-select-sm" style="width: auto;">
              <option value="all">All Types</option>
              <option value="title_deed">Title Deed</option>
              <option value="survey_plan">Survey Plan</option>
              <option value="transfer_form">Transfer Form</option>
              <option value="id_document">ID Document</option>
            </select>
            <button @click="showUploadModal = true" class="btn btn-sm btn-primary">
              <i class="bi bi-cloud-upload me-1"></i>Upload Document
            </button>
          </div>
        </div>

        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="text-muted mt-2 small">Loading documents...</p>
        </div>

        <div v-else-if="filteredDocuments.length === 0" class="text-center py-5">
          <div class="avatar-circle bg-light text-muted mx-auto mb-3" style="width: 64px; height: 64px; font-size: 1.5rem;">
            <i class="bi bi-inbox"></i>
          </div>
          <h6 class="fw-bold text-dark mb-2">No Documents Found</h6>
          <p class="text-muted small mb-0">You don't have any documents uploaded yet</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr style="border-bottom: 2px solid #e5e7eb;">
                <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.7rem;">Document Name</th>
                <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.7rem;">Type</th>
                <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.7rem;">Parcel</th>
                <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.7rem;">Uploaded</th>
                <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.7rem;">Size</th>
                <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.7rem;">Status</th>
                <th class="py-3 text-muted fw-semibold text-uppercase text-end" style="font-size: 0.7rem;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="doc in filteredDocuments" :key="doc._id" style="border-bottom: 1px solid #f3f4f6;">
                <td class="py-3">
                  <div class="d-flex align-items-center gap-2">
                    <i :class="['bi', getFileIcon(doc.documentType), 'fs-5', getFileColor(doc.documentType)]"></i>
                    <div>
                      <div class="fw-semibold small">{{ doc.documentName || 'Untitled Document' }}</div>
                      <small class="text-muted">{{ doc.fileName }}</small>
                      <div v-if="doc.uploadedFor && doc.uploadedFor._id === user.id" class="mt-1">
                        <span class="badge bg-info text-white" style="font-size: 0.65rem;">
                          <i class="bi bi-person-check-fill me-1"></i>Uploaded by Officer for You
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="py-3">
                  <span class="badge bg-light text-dark px-2 py-1 text-capitalize">{{ formatType(doc.documentType) }}</span>
                </td>
                <td class="py-3">
                  <div class="small">{{ doc.landParcel?.parcelNumber || 'N/A' }}</div>
                </td>
                <td class="py-3">
                  <small class="text-muted">{{ formatDate(doc.createdAt) }}</small>
                </td>
                <td class="py-3">
                  <small class="text-muted">{{ formatFileSize(doc.fileSize) }}</small>
                </td>
                <td class="py-3">
                  <span :class="['badge rounded-pill px-3 py-1', getStatusClass(doc.verificationStatus)]">
                    {{ doc.verificationStatus || 'Pending' }}
                  </span>
                </td>
                <td class="py-3 text-end">
                  <button @click="downloadDocument(doc)" class="btn btn-sm btn-light border me-1" title="Download">
                    <i class="bi bi-download"></i>
                  </button>
                  <button @click="viewDocument(doc)" class="btn btn-sm btn-light border" title="View">
                    <i class="bi bi-eye"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Upload Document Modal -->
      <div v-if="showUploadModal" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow-lg">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title">
                <i class="bi bi-cloud-upload me-2"></i>Upload Document
              </h5>
              <button type="button" class="btn-close btn-close-white" @click="closeUploadModal"></button>
            </div>
            <div class="modal-body p-4">
              <div v-if="uploadError" class="alert alert-danger">
                <i class="bi bi-exclamation-triangle me-2"></i>{{ uploadError }}
              </div>

              <div class="alert alert-info">
                <i class="bi bi-info-circle me-2"></i>
                Your document will be reviewed by land officers and administrators.
              </div>

              <!-- File Input -->
              <div class="mb-3">
                <label class="form-label fw-semibold">
                  <i class="bi bi-paperclip me-2"></i>Select File
                </label>
                <input 
                  type="file" 
                  class="form-control" 
                  @change="handleFileSelect"
                  accept=".pdf,.jpg,.jpeg,.png,.tiff"
                >
                <small class="text-muted">Accepted: PDF, JPEG, PNG, TIFF (Max 10MB)</small>
              </div>

              <!-- Document Type -->
              <div class="mb-3">
                <label class="form-label fw-semibold">
                  <i class="bi bi-file-earmark me-2"></i>Document Type
                </label>
                <select v-model="uploadForm.documentType" class="form-select">
                  <option value="title_deed">Title Deed</option>
                  <option value="survey_map">Survey Map</option>
                  <option value="identification">Identification</option>
                  <option value="transfer_agreement">Transfer Agreement</option>
                  <option value="payment_receipt">Payment Receipt</option>
                  <option value="court_order">Court Order</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <!-- Parcel Selection -->
              <div class="mb-3">
                <label class="form-label fw-semibold">
                  <i class="bi bi-map me-2"></i>Related Land Parcel
                </label>
                <select v-model="uploadForm.parcelId" class="form-select" required>
                  <option value="">Select a parcel...</option>
                  <option v-for="parcel in userParcels" :key="parcel._id" :value="parcel._id">
                    {{ parcel.parcelNumber }} - {{ parcel.location?.county }}
                  </option>
                </select>
              </div>

              <!-- Description -->
              <div class="mb-3">
                <label class="form-label fw-semibold">
                  <i class="bi bi-chat-left-text me-2"></i>Description (Optional)
                </label>
                <textarea 
                  v-model="uploadForm.description" 
                  class="form-control" 
                  rows="3"
                  placeholder="Add any additional information about this document..."
                ></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-light" @click="closeUploadModal" :disabled="uploading">
                Cancel
              </button>
              <button type="button" class="btn btn-primary" @click="uploadDocument" :disabled="uploading">
                <span v-if="uploading">
                  <span class="spinner-border spinner-border-sm me-2"></span>Uploading...
                </span>
                <span v-else>
                  <i class="bi bi-cloud-upload me-2"></i>Upload Document
                </span>
              </button>
            </div>
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
  name: 'MyDocuments',
  components: { Navbar },
  setup() {
    const authStore = useAuthStore()
    const user = computed(() => authStore.user)

    const loading = ref(false)
    const documents = ref([])
    const typeFilter = ref('all')

    const stats = computed(() => {
      return {
        total: documents.value.length,
        verified: documents.value.filter(d => d.verificationStatus === 'verified').length,
        pending: documents.value.filter(d => d.verificationStatus === 'pending').length
      }
    })

    const filteredDocuments = computed(() => {
      if (typeFilter.value === 'all') return documents.value
      return documents.value.filter(d => d.documentType === typeFilter.value)
    })

    const fetchDocuments = async () => {
      loading.value = true
      try {
        const response = await api.get('/documents')
        console.log('📄 Documents API Response:', response.data)
        
        if (response.data?.data?.documents) {
          // Owner sees documents where:
          // 1. They uploaded it themselves (uploadedBy)
          // 2. It was uploaded FOR them by an officer (uploadedFor)
          // 3. It's linked to their parcel (landParcel.currentOwner)
          documents.value = response.data.data.documents.filter(d => {
            const isUploader = d.uploadedBy?._id === user.value.id
            const isRecipient = d.uploadedFor?._id === user.value.id
            const ownsParcel = d.landParcel?.currentOwner === user.value.id
            
            console.log(`Document ${d.documentName}:`, {
              isUploader,
              isRecipient,
              ownsParcel,
              uploadedFor: d.uploadedFor,
              uploadedBy: d.uploadedBy
            })
            
            return isUploader || isRecipient || ownsParcel
          })
          
          console.log(`✅ Filtered ${documents.value.length} documents for user`)
        }
      } catch (err) {
        console.error('Error fetching documents:', err)
      } finally {
        loading.value = false
      }
    }

    const filterDocuments = () => {
      // Filtering is handled by computed property
    }

    const formatDate = (date) => {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('en-KE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const formatType = (type) => {
      if (!type) return 'Unknown'
      return type.replace(/_/g, ' ')
    }

    const formatFileSize = (size) => {
      if (!size) return 'N/A'
      const kb = size / 1024
      if (kb < 1024) return `${kb.toFixed(2)} KB`
      return `${(kb / 1024).toFixed(2)} MB`
    }

    const getFileIcon = (type) => {
      const icons = {
        'title_deed': 'bi-file-earmark-ruled',
        'survey_plan': 'bi-file-earmark-map',
        'transfer_form': 'bi-file-earmark-arrow-up',
        'id_document': 'bi-file-earmark-person'
      }
      return icons[type] || 'bi-file-earmark'
    }

    const getFileColor = (type) => {
      const colors = {
        'title_deed': 'text-primary',
        'survey_plan': 'text-success',
        'transfer_form': 'text-warning',
        'id_document': 'text-info'
      }
      return colors[type] || 'text-secondary'
    }

    const getStatusClass = (status) => {
      const classes = {
        'verified': 'bg-success text-white',
        'pending': 'bg-warning text-dark',
        'rejected': 'bg-danger text-white'
      }
      return classes[status?.toLowerCase()] || 'bg-secondary text-white'
    }

    const downloadDocument = (doc) => {
      if (doc.fileUrl) {
        window.open(doc.fileUrl, '_blank')
      }
    }

    const viewDocument = (doc) => {
      if (doc._id) {
        window.open(`/api/v1/documents/${doc._id}/view`, '_blank')
      } else if (doc.fileUrl) {
        window.open(doc.fileUrl, '_blank')
      }
    }

    // Upload functionality
    const showUploadModal = ref(false)
    const uploadForm = ref({
      file: null,
      documentType: 'title_deed',
      parcelId: '',
      description: ''
    })
    const uploading = ref(false)
    const uploadError = ref('')
    const userParcels = ref([])

    const fetchUserParcels = async () => {
      try {
        const response = await api.get('/parcels')
        if (response.data?.data?.parcels) {
          // Filter for user's own parcels
          userParcels.value = response.data.data.parcels.filter(p => 
            p.currentOwner?._id === user.value.id || p.currentOwner === user.value.id
          )
        }
      } catch (err) {
        console.error('Error fetching parcels:', err)
      }
    }

    const handleFileSelect = (event) => {
      const file = event.target.files[0]
      if (file) {
        // Validate file type
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/tiff']
        if (!allowedTypes.includes(file.type)) {
          uploadError.value = 'Only PDF and image files (JPEG, PNG, TIFF) are allowed'
          return
        }
        // Validate file size (10MB)
        if (file.size > 10485760) {
          uploadError.value = 'File size cannot exceed 10MB'
          return
        }
        uploadForm.value.file = file
        uploadError.value = ''
      }
    }

    const uploadDocument = async () => {
      if (!uploadForm.value.file) {
        uploadError.value = 'Please select a file to upload'
        return
      }
      if (!uploadForm.value.parcelId) {
        uploadError.value = 'Please select a land parcel'
        return
      }

      uploading.value = true
      uploadError.value = ''

      try {
        const formData = new FormData()
        formData.append('file', uploadForm.value.file)
        formData.append('documentType', uploadForm.value.documentType)
        formData.append('landParcelId', uploadForm.value.parcelId)
        formData.append('description', uploadForm.value.description)

        const response = await api.post('/documents/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        if (response.data?.status === 'success') {
          // Close modal and refresh documents
          showUploadModal.value = false
          uploadForm.value = {
            file: null,
            documentType: 'title_deed',
            parcelId: '',
            description: ''
          }
          await fetchDocuments()
          
          // Show success message
          alert('Document uploaded successfully! Admins and officers will review it.')
        }
      } catch (err) {
        uploadError.value = err.response?.data?.message || 'Failed to upload document'
        console.error('Upload error:', err)
      } finally {
        uploading.value = false
      }
    }

    const closeUploadModal = () => {
      showUploadModal.value = false
      uploadForm.value = {
        file: null,
        documentType: 'title_deed',
        parcelId: '',
        description: ''
      }
      uploadError.value = ''
    }

    onMounted(() => {
      fetchDocuments()
      fetchUserParcels()
    })

    return {
      loading,
      documents,
      filteredDocuments,
      typeFilter,
      stats,
      filterDocuments,
      downloadDocument,
      viewDocument,
      formatDate,
      formatType,
      formatFileSize,
      getFileIcon,
      getFileColor,
      getStatusClass,
      showUploadModal,
      uploadForm,
      uploading,
      uploadError,
      userParcels,
      handleFileSelect,
      uploadDocument,
      closeUploadModal
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
</style>
