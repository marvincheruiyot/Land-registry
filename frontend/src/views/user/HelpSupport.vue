<template>
  <div class="main-layout-container">
    <Navbar />

    <main class="flex-grow-1 p-3 p-md-4 p-xl-5">
      <!-- Header -->
      <div class="mb-4">
        <span class="badge badge-pill-custom badge-soft-blue mb-2">
          <i class="bi bi-question-circle"></i> Support Center
        </span>
        <h1 class="fw-bold text-dark fs-2 mb-1">Help & Support</h1>
        <p class="text-muted mb-0">Find answers to common questions and get assistance with the Land Registry system</p>
      </div>

      <div class="row g-4">
        <!-- FAQs -->
        <div class="col-12">
          <div class="dash-card">
            <h5 class="fw-bold mb-3">Frequently Asked Questions</h5>
            <p class="text-muted small mb-4">Quick answers to common questions about the Land Registry system</p>

            <div class="accordion" id="faqAccordion">
              <!-- FAQ 1 -->
              <div class="accordion-item border-0 mb-2 rounded-3 overflow-hidden">
                <h2 class="accordion-header" id="heading1">
                  <button class="accordion-button bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#faq1" aria-expanded="true" aria-controls="faq1">
                    <i class="bi bi-question-circle me-2 text-primary"></i>
                    How do I view my land parcels?
                  </button>
                </h2>
                <div id="faq1" class="accordion-collapse collapse show" aria-labelledby="heading1" data-bs-parent="#faqAccordion">
                  <div class="accordion-body bg-white">
                    <p class="mb-2"><strong>Step-by-step instructions:</strong></p>
                    <ol class="mb-0">
                      <li>Click on <strong>"My Land Parcels"</strong> from the sidebar menu</li>
                      <li>You'll see a list of all parcels registered under your National ID</li>
                      <li>Click on any parcel card to view detailed information</li>
                      <li>Details include: Location, Size, Title Deed Number, Ownership History</li>
                    </ol>
                  </div>
                </div>
              </div>

              <!-- FAQ 2 -->
              <div class="accordion-item border-0 mb-2 rounded-3 overflow-hidden">
                <h2 class="accordion-header" id="heading2">
                  <button class="accordion-button collapsed bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#faq2" aria-expanded="false" aria-controls="faq2">
                    <i class="bi bi-question-circle me-2 text-primary"></i>
                    How do I transfer land ownership?
                  </button>
                </h2>
                <div id="faq2" class="accordion-collapse collapse" aria-labelledby="heading2" data-bs-parent="#faqAccordion">
                  <div class="accordion-body bg-white">
                    <p class="mb-2"><strong>Follow these steps:</strong></p>
                    <ol class="mb-3">
                      <li>Go to your Dashboard</li>
                      <li>Click <strong>"Transfer Land"</strong> or <strong>"Initiate Transfer"</strong> button</li>
                      <li>Select the parcel you want to transfer from the dropdown</li>
                      <li>Enter the new owner's <strong>National ID number</strong></li>
                      <li>Select transfer type: Sale, Gift, Inheritance, or Court Order</li>
                      <li>If it's a sale, enter the transfer amount</li>
                      <li>Add any additional notes</li>
                      <li>Click <strong>"Submit Transfer Application"</strong></li>
                    </ol>
                    <div class="alert alert-info small mb-0">
                      <i class="bi bi-info-circle me-1"></i>
                      The transfer will be reviewed by a Land Officer. You'll receive a notification once it's processed. Check "My Transfers" to track the status.
                    </div>
                  </div>
                </div>
              </div>

              <!-- FAQ 3 -->
              <div class="accordion-item border-0 mb-2 rounded-3 overflow-hidden">
                <h2 class="accordion-header" id="heading3">
                  <button class="accordion-button collapsed bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#faq3" aria-expanded="false" aria-controls="faq3">
                    <i class="bi bi-question-circle me-2 text-primary"></i>
                    How do I verify a land document?
                  </button>
                </h2>
                <div id="faq3" class="accordion-collapse collapse" aria-labelledby="heading3" data-bs-parent="#faqAccordion">
                  <div class="accordion-body bg-white">
                    <p class="mb-2"><strong>Verification steps:</strong></p>
                    <ol class="mb-3">
                      <li>Click on <strong>"Verify Document"</strong> in the sidebar menu</li>
                      <li>Enter the <strong>Parcel Number</strong> or <strong>Title Deed Number</strong></li>
                      <li>Click <strong>"Verify"</strong> button</li>
                      <li>The system will display:
                        <ul>
                          <li>Current ownership status</li>
                          <li>Document authenticity</li>
                          <li>Parcel location</li>
                          <li>Any pending transfers</li>
                        </ul>
                      </li>
                    </ol>
                    <div class="alert alert-success small mb-0">
                      <i class="bi bi-shield-check me-1"></i>
                      All verifications are logged for security purposes.
                    </div>
                  </div>
                </div>
              </div>

              <!-- FAQ 4 -->
              <div class="accordion-item border-0 mb-2 rounded-3 overflow-hidden">
                <h2 class="accordion-header" id="heading4">
                  <button class="accordion-button collapsed bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#faq4" aria-expanded="false" aria-controls="faq4">
                    <i class="bi bi-question-circle me-2 text-primary"></i>
                    What if I don't see my land parcel?
                  </button>
                </h2>
                <div id="faq4" class="accordion-collapse collapse" aria-labelledby="heading4" data-bs-parent="#faqAccordion">
                  <div class="accordion-body bg-white">
                    <p class="mb-2"><strong>Troubleshooting steps:</strong></p>
                    <ol class="mb-3">
                      <li>Check that your <strong>National ID</strong> in your profile matches the one on your title deed</li>
                      <li>Refresh the page and try again</li>
                      <li>Check if the land needs to be registered in the digital system</li>
                      <li>Contact your local Land Office with your title deed</li>
                      <li>Or submit a support request using the button below</li>
                    </ol>
                    <div class="alert alert-warning small mb-0">
                      <i class="bi bi-exclamation-triangle me-1"></i>
                      If your land was registered before the digital system, it may need to be added by a Land Officer.
                    </div>
                  </div>
                </div>
              </div>

              <!-- FAQ 5 -->
              <div class="accordion-item border-0 mb-2 rounded-3 overflow-hidden">
                <h2 class="accordion-header" id="heading5">
                  <button class="accordion-button collapsed bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#faq5" aria-expanded="false" aria-controls="faq5">
                    <i class="bi bi-question-circle me-2 text-primary"></i>
                    How long does a land transfer take?
                  </button>
                </h2>
                <div id="faq5" class="accordion-collapse collapse" aria-labelledby="heading5" data-bs-parent="#faqAccordion">
                  <div class="accordion-body bg-white">
                    <p class="mb-2"><strong>Expected processing times:</strong></p>
                    <ul class="mb-3">
                      <li><strong>Simple transfers (Sale/Gift):</strong> 5-7 business days</li>
                      <li><strong>Inheritance cases:</strong> 14-21 business days (requires additional documentation)</li>
                      <li><strong>Court order transfers:</strong> 7-14 business days</li>
                      <li><strong>Complex cases:</strong> Up to 30 business days</li>
                    </ul>
                    <p class="mb-2"><strong>Track your transfer:</strong></p>
                    <ol class="mb-0">
                      <li>Go to <strong>"My Transfers"</strong> section</li>
                      <li>View status: Pending, Approved, or Rejected</li>
                      <li>You'll receive email/SMS notifications at each stage</li>
                    </ol>
                  </div>
                </div>
              </div>

              <!-- FAQ 6 -->
              <div class="accordion-item border-0 mb-2 rounded-3 overflow-hidden">
                <h2 class="accordion-header" id="heading6">
                  <button class="accordion-button collapsed bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#faq6" aria-expanded="false" aria-controls="faq6">
                    <i class="bi bi-question-circle me-2 text-primary"></i>
                    How do I update my profile information?
                  </button>
                </h2>
                <div id="faq6" class="accordion-collapse collapse" aria-labelledby="heading6" data-bs-parent="#faqAccordion">
                  <div class="accordion-body bg-white">
                    <p class="mb-2"><strong>Update your information:</strong></p>
                    <ol class="mb-3">
                      <li>Click on <strong>"My Profile"</strong> from the sidebar</li>
                      <li>Update your information:
                        <ul>
                          <li>Full Name</li>
                          <li>Email Address</li>
                          <li>Phone Number</li>
                          <li>Physical Address</li>
                        </ul>
                      </li>
                      <li>Click <strong>"Save Changes"</strong></li>
                    </ol>
                    <div class="alert alert-warning small mb-0">
                      <i class="bi bi-lock me-1"></i>
                      <strong>Note:</strong> You cannot change your National ID number as it's permanently linked to your land records for security.
                    </div>
                  </div>
                </div>
              </div>

              <!-- FAQ 7 -->
              <div class="accordion-item border-0 mb-2 rounded-3 overflow-hidden">
                <h2 class="accordion-header" id="heading7">
                  <button class="accordion-button collapsed bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#faq7" aria-expanded="false" aria-controls="faq7">
                    <i class="bi bi-question-circle me-2 text-primary"></i>
                    What documents do I need for land transfer?
                  </button>
                </h2>
                <div id="faq7" class="accordion-collapse collapse" aria-labelledby="heading7" data-bs-parent="#faqAccordion">
                  <div class="accordion-body bg-white">
                    <p class="mb-2"><strong>Required documents checklist:</strong></p>
                    <ol class="mb-3">
                      <li><strong>Original Title Deed</strong> - Upload digital copy</li>
                      <li><strong>National ID</strong> (both seller and buyer)</li>
                      <li><strong>Sale Agreement</strong> (if selling) - Signed by both parties</li>
                      <li><strong>Tax Clearance Certificate</strong> from KRA</li>
                      <li><strong>Consent from Spouse</strong> (if married)</li>
                      <li><strong>Land Rates Clearance</strong> from County Government</li>
                      <li><strong>Search Certificate</strong> (optional but recommended)</li>
                    </ol>
                    <p class="mb-2"><strong>How to upload:</strong></p>
                    <ol class="mb-0">
                      <li>Go to <strong>"My Documents"</strong></li>
                      <li>Click <strong>"Upload Document"</strong></li>
                      <li>Select document type and upload file</li>
                      <li>Documents will be reviewed by Land Officers</li>
                    </ol>
                  </div>
                </div>
              </div>

              <!-- FAQ 8 -->
              <div class="accordion-item border-0 mb-2 rounded-3 overflow-hidden">
                <h2 class="accordion-header" id="heading8">
                  <button class="accordion-button collapsed bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#faq8" aria-expanded="false" aria-controls="faq8">
                    <i class="bi bi-question-circle me-2 text-primary"></i>
                    How secure is my data?
                  </button>
                </h2>
                <div id="faq8" class="accordion-collapse collapse" aria-labelledby="heading8" data-bs-parent="#faqAccordion">
                  <div class="accordion-body bg-white">
                    <p class="mb-2"><strong>Security measures in place:</strong></p>
                    <ul class="mb-3">
                      <li><strong>256-bit TLS Encryption</strong> - All data transmitted is encrypted</li>
                      <li><strong>Secure Authentication</strong> - Password protected with hashing</li>
                      <li><strong>Regular Security Audits</strong> - System monitored 24/7</li>
                      <li><strong>Government-grade Data Centers</strong> - Located in Kenya</li>
                      <li><strong>Audit Logging</strong> - All activities are tracked</li>
                      <li><strong>Role-based Access</strong> - Users only see their own data</li>
                    </ul>
                    <div class="alert alert-success small mb-0">
                      <i class="bi bi-shield-check me-1"></i>
                      We comply with <strong>Kenya Data Protection Act 2019</strong> and international security standards.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Need More Help Card -->
      <div class="row g-4 mt-2">
        <div class="col-12">
          <div class="dash-card bg-primary-subtle">
            <div class="text-center py-4">
              <i class="bi bi-headset fs-1 text-primary mb-3 d-block"></i>
              <h5 class="fw-bold mb-2">Still Need Help?</h5>
              <p class="text-muted mb-3">
                Can't find the answer you're looking for? Submit a support request and our Land Officers or Administrators will assist you.
              </p>
              <button @click="showTicketModal = true" class="btn btn-pill btn-primary">
                <i class="bi bi-envelope-fill me-1"></i> Submit Support Request
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="row g-4 mt-2">
        <div class="col-12">
          <div class="dash-card">
            <h5 class="fw-bold mb-3">Quick Links & Resources</h5>
            <div class="row g-3">
              <div class="col-12 col-md-6 col-lg-3">
                <a href="https://lands.go.ke" target="_blank" class="btn btn-light-pill w-100 text-start d-flex align-items-center gap-2 py-3 text-decoration-none">
                  <i class="bi bi-globe text-primary"></i>
                  <div>
                    <div class="fw-semibold text-dark small">Ministry of Lands</div>
                    <small class="text-muted">Official website</small>
                  </div>
                </a>
              </div>
              <div class="col-12 col-md-6 col-lg-3">
                <router-link to="/verify" class="btn btn-light-pill w-100 text-start d-flex align-items-center gap-2 py-3 text-decoration-none">
                  <i class="bi bi-shield-check text-success"></i>
                  <div>
                    <div class="fw-semibold text-dark small">Verify Document</div>
                    <small class="text-muted">Check authenticity</small>
                  </div>
                </router-link>
              </div>
              <div class="col-12 col-md-6 col-lg-3">
                <router-link to="/my-documents" class="btn btn-light-pill w-100 text-start d-flex align-items-center gap-2 py-3 text-decoration-none">
                  <i class="bi bi-file-earmark-text text-warning"></i>
                  <div>
                    <div class="fw-semibold text-dark small">My Documents</div>
                    <small class="text-muted">View title deeds</small>
                  </div>
                </router-link>
              </div>
              <div class="col-12 col-md-6 col-lg-3">
                <router-link to="/profile" class="btn btn-light-pill w-100 text-start d-flex align-items-center gap-2 py-3 text-decoration-none">
                  <i class="bi bi-person-gear text-dark"></i>
                  <div>
                    <div class="fw-semibold text-dark small">Update Profile</div>
                    <small class="text-muted">Manage account</small>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Submit Support Request Modal -->
    <div v-if="showTicketModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header border-0">
            <div>
              <h5 class="modal-title fw-bold">Submit Support Request</h5>
              <p class="text-muted small mb-0">Describe your issue and a Land Officer or Administrator will assist you</p>
            </div>
            <button type="button" class="btn-close" @click="closeTicketModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitTicket">
              <div class="mb-3">
                <label class="form-label fw-semibold">Subject *</label>
                <input v-model="ticketForm.subject" type="text" class="form-control" placeholder="Brief description of your issue" required>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Category *</label>
                <select v-model="ticketForm.category" class="form-select" required>
                  <option value="">Select category...</option>
                  <option value="Land Parcel">Land Parcel Issue</option>
                  <option value="Transfer">Transfer Issue</option>
                  <option value="Document">Document Issue</option>
                  <option value="Account">Account Issue</option>
                  <option value="Technical">Technical Problem</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Priority *</label>
                <select v-model="ticketForm.priority" class="form-select" required>
                  <option value="Low">Low - General inquiry</option>
                  <option value="Medium">Medium - Need assistance</option>
                  <option value="High">High - Urgent issue</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Message *</label>
                <textarea v-model="ticketForm.message" class="form-control" rows="5" placeholder="Provide detailed information about your issue..." required></textarea>
                <small class="text-muted">This will be sent to all Land Officers and Administrators</small>
              </div>

              <div v-if="ticketError" class="alert alert-danger">
                <i class="bi bi-exclamation-triangle me-2"></i>{{ ticketError }}
              </div>
              <div v-if="ticketSuccess" class="alert alert-success">
                <i class="bi bi-check-circle me-2"></i>{{ ticketSuccess }}
              </div>
            </form>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-light" @click="closeTicketModal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="submitTicket" :disabled="ticketLoading">
              <span v-if="ticketLoading" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-send me-1"></i>
              Send Support Request
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'
import api from '@/services/api'

export default {
  name: 'HelpSupport',
  components: { Navbar },
  setup() {
    const authStore = useAuthStore()
    const user = computed(() => authStore.user)

    const showTicketModal = ref(false)
    const ticketForm = ref({
      subject: '',
      category: '',
      priority: 'Medium',
      message: ''
    })
    const ticketLoading = ref(false)
    const ticketError = ref(null)
    const ticketSuccess = ref(null)

    const submitTicket = async () => {
      ticketLoading.value = true
      ticketError.value = null
      ticketSuccess.value = null

      try {
        // Submit support request - this will create notifications for admins/officers
        await api.post('/support-tickets', {
          subject: ticketForm.value.subject,
          category: ticketForm.value.category,
          priority: ticketForm.value.priority,
          message: ticketForm.value.message
        })

        ticketSuccess.value = 'Support request submitted successfully! A Land Officer or Administrator will respond soon.'
        
        setTimeout(() => {
          closeTicketModal()
        }, 2500)
      } catch (err) {
        ticketError.value = err.response?.data?.message || 'Failed to submit support request. Please try again.'
      } finally {
        ticketLoading.value = false
      }
    }

    const closeTicketModal = () => {
      showTicketModal.value = false
      ticketForm.value = {
        subject: '',
        category: '',
        priority: 'Medium',
        message: ''
      }
      ticketError.value = null
      ticketSuccess.value = null
    }

    return {
      user,
      showTicketModal,
      ticketForm,
      ticketLoading,
      ticketError,
      ticketSuccess,
      submitTicket,
      closeTicketModal
    }
  }
}
</script>
