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
        <!-- Only show upload button for Officers, not Administrators -->
        <button v-if="isOfficer" @click="showUploadForOwnerModal = true" class="btn btn-pill btn-dark-pill">
          <i class="bi bi-file-earmark-arrow-up me-1"></i> Upload Title Deed for Owner
        </button>
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
            :key="doc._id"
            class="col-12 col-md-6 col-xl-4"
          >
            <div class="p-4 bg-light rounded-4 border h-100 d-flex flex-column justify-content-between">
              <div>
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <div class="avatar-circle bg-dark text-warning">
                    <i :class="getDocumentIcon(doc.documentType)"></i>
                  </div>
                  <span :class="['badge badge-pill-custom', getStatusBadgeClass(doc.verificationStatus)]">
                    <i class="bi bi-shield-fill-check"></i> {{ doc.verificationStatus || 'Pending' }}
                  </span>
                </div>

                <h5 class="fw-bold text-dark text-truncate mb-1">{{ doc.documentName || doc.fileName }}</h5>
                <div class="text-muted small mb-2 text-capitalize">{{ formatType(doc.documentType) }}</div>
                
                <!-- Parcel Information -->
                <div v-if="doc.landParcel" class="mb-2 p-2 bg-white rounded-3 border">
                  <div class="small">
                    <i class="bi bi-geo-alt-fill text-success me-1"></i>
                    <strong>Parcel:</strong> {{ doc.landParcel.parcelNumber }}
                  </div>
                  <div class="small text-muted">
                    📍 {{ doc.landParcel.location?.county }}{{ doc.landParcel.location?.subCounty ? ', ' + doc.landParcel.location.subCounty : '' }}
                  </div>
                </div>
                
                <!-- Owner Information -->
                <div class="mb-2">
                  <div v-if="doc.uploadedFor" class="small">
                    <i class="bi bi-person-fill text-primary me-1"></i>
                    <strong>Owner:</strong> {{ doc.uploadedFor.fullName }}
                  </div>
                  <div v-else-if="doc.uploadedBy" class="small">
                    <i class="bi bi-person-fill text-primary me-1"></i>
                    <strong>Owner:</strong> {{ doc.uploadedBy.fullName }}
                  </div>
                  <div v-if="doc.uploadedFor" class="small text-muted">
                    <i class="bi bi-credit-card me-1"></i>
                    ID: {{ doc.uploadedFor.nationalId }}
                  </div>
                  <div v-else-if="doc.uploadedBy && doc.uploadedBy.nationalId" class="small text-muted">
                    <i class="bi bi-credit-card me-1"></i>
                    ID: {{ doc.uploadedBy.nationalId }}
                  </div>
                </div>
                
                <div class="small text-muted mb-3">{{ formatDate(doc.createdAt) }}</div>
              </div>

              <div class="pt-3 border-top">
                <!-- View and Download Buttons -->
                <div class="d-flex gap-2 mb-2">
                  <button @click="viewDocument(doc)" class="btn btn-pill btn-light-pill btn-sm flex-grow-1 justify-content-center">
                    <i class="bi bi-eye"></i> View
                  </button>
                  <button @click="downloadDocument(doc)" class="btn btn-pill btn-dark-pill btn-sm flex-grow-1 justify-content-center">
                    <i class="bi bi-download"></i> Download
                  </button>
                </div>
                
                <!-- Approve/Reject Buttons (for Officers/Admins on pending documents) -->
                <div v-if="(isOfficer || isAdmin) && doc.verificationStatus === 'pending'" class="d-flex gap-2">
                  <button @click="approveDocument(doc)" class="btn btn-success btn-sm flex-grow-1">
                    <i class="bi bi-check-circle-fill"></i> Approve
                  </button>
                  <button @click="showRejectModal(doc)" class="btn btn-danger btn-sm flex-grow-1">
                    <i class="bi bi-x-circle-fill"></i> Reject
                  </button>
                </div>
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

    <!-- Upload for Owner Modal -->
    <div
      v-if="showUploadForOwnerModal"
      class="modal fade show d-block"
      style="background: rgba(0,0,0,0.5);"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content rounded-4 border-0 p-3 p-md-4">
          <div class="modal-header border-0 pb-0">
            <h5 class="fw-bold text-dark mb-0">Upload Title Deed for New Owner</h5>
            <button type="button" class="btn-close" @click="closeOwnerModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="uploadForOwner" class="space-y-3">
              <div class="mb-3">
                <label class="form-label fw-semibold text-dark">Select Owner (National ID) *</label>
                <input
                  v-model="ownerUploadForm.ownerNationalId"
                  @blur="fetchOwnerDetails"
                  type="text"
                  class="form-control rounded-pill py-2 bg-light border-0"
                  placeholder="Enter owner's National ID"
                  required
                />
                <small v-if="selectedOwner" class="text-success d-block mt-1">
                  <i class="bi bi-check-circle-fill"></i> {{ selectedOwner.fullName }} ({{ selectedOwner.email }})
                </small>
                <small v-if="fetchingOwner" class="text-muted d-block mt-1">
                  <span class="spinner-border spinner-border-sm me-1"></span> Looking up owner...
                </small>
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold text-dark">Related Parcel Number</label>
                <select
                  v-model="ownerUploadForm.parcelId"
                  class="form-select rounded-pill py-2 bg-light border-0"
                  :disabled="!selectedOwner || ownerParcels.length === 0"
                >
                  <option value="">Select parcel (optional)</option>
                  <option v-for="parcel in ownerParcels" :key="parcel._id" :value="parcel._id">
                    {{ parcel.parcelNumber }} - {{ parcel.location?.county }}{{ parcel.location?.subCounty ? ', ' + parcel.location.subCounty : '' }}
                  </option>
                </select>
                <small v-if="selectedOwner && ownerParcels.length === 0" class="text-muted d-block mt-1">
                  No parcels found for this owner
                </small>
                <small v-if="loadingParcels" class="text-muted d-block mt-1">
                  <span class="spinner-border spinner-border-sm me-1"></span> Loading parcels...
                </small>
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold text-dark">Title Deed File *</label>
                <input
                  type="file"
                  @change="handleOwnerFileSelect"
                  accept=".pdf,.jpg,.jpeg,.png"
                  class="form-control rounded-pill py-2 bg-light border-0"
                  required
                />
                <small class="text-muted">PDF, JPG, or PNG (Max 10MB)</small>
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold text-dark">Notes</label>
                <textarea
                  v-model="ownerUploadForm.description"
                  class="form-control rounded-4 bg-light border-0"
                  rows="2"
                  placeholder="Transfer details or remarks"
                ></textarea>
              </div>

              <div v-if="ownerUploadError" class="p-3 bg-danger-subtle text-danger rounded-3 small mb-3">
                {{ ownerUploadError }}
              </div>

              <div v-if="ownerUploadSuccess" class="p-3 bg-success-subtle text-success rounded-3 small mb-3">
                {{ ownerUploadSuccess }}
              </div>

              <div class="d-flex gap-2">
                <button type="submit" :disabled="uploadingForOwner" class="btn btn-pill btn-dark-pill flex-grow-1 justify-content-center">
                  {{ uploadingForOwner ? 'Uploading...' : 'Upload Title Deed' }}
                </button>
                <button type="button" @click="closeOwnerModal" class="btn btn-pill btn-light-pill">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Reject Document Modal -->
    <div
      v-if="showRejectDocumentModal"
      class="modal fade show d-block"
      style="background: rgba(0,0,0,0.5);"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 p-3 p-md-4">
          <div class="modal-header border-0 pb-0">
            <h5 class="fw-bold text-dark mb-0">Reject Document</h5>
            <button type="button" class="btn-close" @click="closeRejectModal"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-warning">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              You are about to reject this document. Please provide a reason.
            </div>
            
            <div v-if="documentToReject" class="mb-3 p-3 bg-light rounded-3">
              <div class="fw-bold">{{ documentToReject.documentName || documentToReject.fileName }}</div>
              <div class="small text-muted">{{ formatType(documentToReject.documentType) }}</div>
            </div>

            <form @submit.prevent="rejectDocument">
              <div class="mb-3">
                <label class="form-label fw-semibold text-dark">Rejection Reason *</label>
                <textarea
                  v-model="rejectionReason"
                  class="form-control rounded-4 bg-light border-0"
                  rows="4"
                  placeholder="Explain why this document is being rejected..."
                  required
                ></textarea>
              </div>

              <div v-if="rejectError" class="alert alert-danger mb-3">
                {{ rejectError }}
              </div>

              <div class="d-flex gap-2">
                <button type="submit" :disabled="rejecting" class="btn btn-danger flex-grow-1">
                  {{ rejecting ? 'Rejecting...' : 'Reject Document' }}
                </button>
                <button type="button" @click="closeRejectModal" class="btn btn-secondary">
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
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'
import api from '@/services/api'

export default {
  name: 'DocumentsList',
  components: { Navbar },
  setup() {
    const authStore = useAuthStore()
    const currentUser = computed(() => authStore.user)
    const isAdmin = computed(() => currentUser.value?.role === 'Administrator')
    const isOfficer = computed(() => currentUser.value?.role === 'Land_Officer')
    
    const documents = ref([])
    const loading = ref(true)
    const showUploadModal = ref(false)
    const uploading = ref(false)
    const uploadError = ref(null)

    // Upload for Owner
    const showUploadForOwnerModal = ref(false)
    const uploadingForOwner = ref(false)
    const ownerUploadError = ref(null)
    const ownerUploadSuccess = ref(null)
    const selectedOwner = ref(null)
    const fetchingOwner = ref(false)
    const ownerParcels = ref([])
    const loadingParcels = ref(false)

    // Approve/Reject
    const showRejectDocumentModal = ref(false)
    const documentToReject = ref(null)
    const rejectionReason = ref('')
    const rejecting = ref(false)
    const rejectError = ref(null)

    const uploadForm = ref({
      type: '',
      file: null,
      description: ''
    })

    const ownerUploadForm = ref({
      ownerNationalId: '',
      parcelId: '',
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
    
    const formatDate = (date) => {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('en-KE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const getStatusBadgeClass = (status) => {
      const classes = {
        'verified': 'badge-soft-green',
        'pending': 'badge-soft-yellow',
        'rejected': 'badge-soft-red'
      }
      return classes[status?.toLowerCase()] || 'badge-soft-blue'
    }

    const loadDocuments = async () => {
      loading.value = true
      try {
        const response = await api.get('/documents')
        documents.value = response.data?.data?.documents || []
        console.log('📄 Loaded documents:', documents.value)
      } catch (error) {
        console.error('Error loading documents:', error)
        documents.value = []
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

    const viewDocument = async (doc) => {
      try {
        const response = await api.get(`/documents/${doc._id}/view`, { 
          responseType: 'blob' 
        })
        
        const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        window.open(url, '_blank')
        
        setTimeout(() => window.URL.revokeObjectURL(url), 100)
      } catch (err) {
        console.error('View error:', err)
        alert('Unable to view document. Please try again.')
      }
    }

    const downloadDocument = async (doc) => {
      try {
        const response = await api.get(`/documents/${doc._id}/download`, { responseType: 'blob' })
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', doc.documentName || doc.fileName || `document-${doc._id}.pdf`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
      } catch (err) {
        console.error('Download error:', err)
        alert('Unable to download document. Please try again.')
      }
    }

    const fetchOwnerDetails = async () => {
      if (!ownerUploadForm.value.ownerNationalId) return
      
      fetchingOwner.value = true
      ownerUploadError.value = null
      selectedOwner.value = null
      ownerParcels.value = []
      
      try {
        const response = await api.get(`/users/by-national-id/${ownerUploadForm.value.ownerNationalId}`)
        selectedOwner.value = response.data?.data?.user || response.data?.user
        
        // Fetch owner's parcels
        if (selectedOwner.value) {
          await fetchOwnerParcels(selectedOwner.value._id)
        }
      } catch (err) {
        selectedOwner.value = null
        ownerParcels.value = []
        ownerUploadError.value = 'Owner not found. Please verify the National ID.'
      } finally {
        fetchingOwner.value = false
      }
    }

    const fetchOwnerParcels = async (ownerId) => {
      loadingParcels.value = true
      try {
        const response = await api.get('/parcels')
        if (response.data?.data?.parcels) {
          // Filter for this owner's parcels
          ownerParcels.value = response.data.data.parcels.filter(p => 
            p.currentOwner?._id === ownerId || p.currentOwner === ownerId
          )
          console.log(`Found ${ownerParcels.value.length} parcels for owner`)
        }
      } catch (err) {
        console.error('Error fetching owner parcels:', err)
        ownerParcels.value = []
      } finally {
        loadingParcels.value = false
      }
    }

    const handleOwnerFileSelect = (e) => {
      ownerUploadForm.value.file = e.target.files[0]
    }

    const uploadForOwner = async () => {
      if (!selectedOwner.value) {
        ownerUploadError.value = 'Please enter a valid National ID first.'
        return
      }

      uploadingForOwner.value = true
      ownerUploadError.value = null
      ownerUploadSuccess.value = null

      try {
        const formData = new FormData()
        formData.append('documentType', 'title_deed')
        formData.append('file', ownerUploadForm.value.file)
        
        // Get parcel number from selected parcel if available
        let parcelNumber = ''
        if (ownerUploadForm.value.parcelId) {
          const selectedParcel = ownerParcels.value.find(p => p._id === ownerUploadForm.value.parcelId)
          parcelNumber = selectedParcel?.parcelNumber || ''
        }
        
        formData.append('description', ownerUploadForm.value.description || `Title deed for ${parcelNumber || 'parcel'}`)
        formData.append('uploadedFor', selectedOwner.value._id || selectedOwner.value.id)
        
        if (ownerUploadForm.value.parcelId) {
          formData.append('parcelNumber', parcelNumber)
          formData.append('landParcelId', ownerUploadForm.value.parcelId)
        }

        await api.post('/documents/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

        ownerUploadSuccess.value = `Title deed uploaded successfully for ${selectedOwner.value.fullName}!`
        
        setTimeout(() => {
          closeOwnerModal()
          loadDocuments()
        }, 2000)
      } catch (err) {
        console.error('Upload error:', err)
        ownerUploadError.value = err.response?.data?.message || 'Failed to upload document. Please try again.'
      } finally {
        uploadingForOwner.value = false
      }
    }

    const closeOwnerModal = () => {
      showUploadForOwnerModal.value = false
      ownerUploadForm.value = {
        ownerNationalId: '',
        parcelId: '',
        file: null,
        description: ''
      }
      selectedOwner.value = null
      ownerParcels.value = []
      ownerUploadError.value = null
      ownerUploadSuccess.value = null
      fetchingOwner.value = false
      loadingParcels.value = false
    }

    const approveDocument = async (doc) => {
      if (!confirm(`Approve this document?\n\n${doc.documentName || doc.fileName}\n\nThis will mark it as verified.`)) {
        return
      }

      try {
        await api.put(`/documents/${doc._id}/verify`, { status: 'verified' })
        
        // Update local document status
        const index = documents.value.findIndex(d => d._id === doc._id)
        if (index !== -1) {
          documents.value[index].verificationStatus = 'verified'
        }
        
        alert('Document approved successfully!')
      } catch (err) {
        console.error('Error approving document:', err)
        alert(err.response?.data?.message || 'Failed to approve document. Please try again.')
      }
    }

    const showRejectModal = (doc) => {
      documentToReject.value = doc
      rejectionReason.value = ''
      rejectError.value = null
      showRejectDocumentModal.value = true
    }

    const closeRejectModal = () => {
      showRejectDocumentModal.value = false
      documentToReject.value = null
      rejectionReason.value = ''
      rejectError.value = null
    }

    const rejectDocument = async () => {
      if (!rejectionReason.value.trim()) {
        rejectError.value = 'Please provide a rejection reason'
        return
      }

      rejecting.value = true
      rejectError.value = null

      try {
        await api.put(`/documents/${documentToReject.value._id}/verify`, { 
          status: 'rejected',
          rejectionReason: rejectionReason.value 
        })
        
        // Update local document status
        const index = documents.value.findIndex(d => d._id === documentToReject.value._id)
        if (index !== -1) {
          documents.value[index].verificationStatus = 'rejected'
        }
        
        closeRejectModal()
        alert('Document rejected successfully!')
      } catch (err) {
        console.error('Error rejecting document:', err)
        rejectError.value = err.response?.data?.message || 'Failed to reject document. Please try again.'
      } finally {
        rejecting.value = false
      }
    }

    onMounted(() => {
      loadDocuments()
    })

    return {
      currentUser,
      isAdmin,
      isOfficer,
      documents,
      loading,
      showUploadModal,
      uploading,
      uploadError,
      uploadForm,
      showUploadForOwnerModal,
      uploadingForOwner,
      ownerUploadError,
      ownerUploadSuccess,
      selectedOwner,
      fetchingOwner,
      ownerParcels,
      loadingParcels,
      ownerUploadForm,
      showRejectDocumentModal,
      documentToReject,
      rejectionReason,
      rejecting,
      rejectError,
      getDocumentIcon,
      formatType,
      formatDate,
      getStatusBadgeClass,
      handleFileSelect,
      uploadDocument,
      viewDocument,
      downloadDocument,
      fetchOwnerDetails,
      handleOwnerFileSelect,
      uploadForOwner,
      closeOwnerModal,
      approveDocument,
      showRejectModal,
      closeRejectModal,
      rejectDocument
    }
  }
}
</script>
