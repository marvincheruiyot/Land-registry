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
                <h2 class="accordion-header">
                  <button class="accordion-button bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#faq1" aria-expanded="true">
                    <i class="bi bi-question-circle me-2 text-primary"></i>
                    How do I view my land parcels?
                  </button>
                </h2>
                <div id="faq1" class="accordion-collapse collapse show" aria-labelledby="faq1">
                  <div class="accordion-body">
                    Navigate to <strong>"My Land Parcels"</strong> from the sidebar menu. You'll see all parcels registered under your National ID. Click on any parcel to view detailed information including location, size, and title deed number.
                  </div>
                </div>
              </div>

              <!-- FAQ 2 -->
              <div class="accordion-item border-0 mb-2 rounded-3 overflow-hidden">
                <h2 class="accordion-header">
                  <button class="accordion-button bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#faq2" aria-expanded="true">
                    <i class="bi bi-question-circle me-2 text-primary"></i>
                    How do I transfer land ownership?
                  </button>
                </h2>
                <div id="faq2" class="accordion-collapse collapse show" aria-labelledby="faq2">
                  <div class="accordion-body">
                    <ol class="mb-0">
                      <li>Go to your Dashboard and click <strong>"Transfer Land"</strong></li>
                      <li>Select the parcel you want to transfer</li>
                      <li>Enter the new owner's National ID number</li>
                      <li>Select transfer type (Sale, Gift, Inheritance, etc.)</li>
                      <li>Submit the request for approval</li>
                    </ol>
                    <p class="mt-2 mb-0">The transfer will be reviewed by a Land Officer and you'll receive a notification once processed.</p>
                  </div>
                </div>
              </div>

              <!-- FAQ 3 -->
              <div class="accordion-item border-0 mb-2 rounded-3 overflow-hidden">
                <h2 class="accordion-header">
                  <button class="accordion-button bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#faq3" aria-expanded="true">
                    <i class="bi bi-question-circle me-2 text-primary"></i>
                    How do I verify a land document?
                  </button>
                </h2>
                <div id="faq3" class="accordion-collapse collapse show" aria-labelledby="faq3">
                  <div class="accordion-body">
                    Click on <strong>"Verify Document"</strong> in the sidebar menu. Enter the parcel number or title deed number and click "Verify". The system will display the current ownership status and document authenticity.
                  </div>
                </div>
              </div>

              <!-- FAQ 4 -->
              <div class="accordion-item border-0 mb-2 rounded-3 overflow-hidden">
                <h2 class="accordion-header">
                  <button class="accordion-button bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#faq4" aria-expanded="true">
                    <i class="bi bi-question-circle me-2 text-primary"></i>
                    What if I don't see my land parcel?
                  </button>
                </h2>
                <div id="faq4" class="accordion-collapse collapse show" aria-labelledby="faq4">
                  <div class="accordion-body">
                    If you own land but don't see it in your account, it may need to be registered in the system. Contact your local Land Office or submit a support ticket. Ensure your National ID matches the one on your title deed.
                  </div>
                </div>
              </div>

              <!-- FAQ 5 -->
              <div class="accordion-item border-0 mb-2 rounded-3 overflow-hidden">
                <h2 class="accordion-header">
                  <button class="accordion-button bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#faq5" aria-expanded="true">
                    <i class="bi bi-question-circle me-2 text-primary"></i>
                    How long does a land transfer take?
                  </button>
                </h2>
                <div id="faq5" class="accordion-collapse collapse show" aria-labelledby="faq5">
                  <div class="accordion-body">
                    Transfer processing time varies:
                    <ul class="mb-0">
                      <li><strong>Simple transfers:</strong> 5-7 business days</li>
                      <li><strong>Inheritance cases:</strong> 14-21 business days</li>
                      <li><strong>Complex cases:</strong> Up to 30 business days</li>
                    </ul>
                    <p class="mt-2 mb-0">You can track your transfer status in <strong>"My Transfers"</strong> section.</p>
                  </div>
                </div>
              </div>

              <!-- FAQ 6 -->
              <div class="accordion-item border-0 mb-2 rounded-3 overflow-hidden">
                <h2 class="accordion-header">
                  <button class="accordion-button bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#faq6" aria-expanded="true">
                    <i class="bi bi-question-circle me-2 text-primary"></i>
                    How do I update my profile information?
                  </button>
                </h2>
                <div id="faq6" class="accordion-collapse collapse show" aria-labelledby="faq6">
                  <div class="accordion-body">
                    Go to <strong>"My Profile"</strong> from the sidebar, update your information (name, email, phone, address), and click <strong>"Save Changes"</strong>. Note: You cannot change your National ID number as it's linked to your land records.
                  </div>
                </div>
              </div>

              <!-- FAQ 7 -->
              <div class="accordion-item border-0 mb-2 rounded-3 overflow-hidden">
                <h2 class="accordion-header">
                  <button class="accordion-button bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#faq7" aria-expanded="true">
                    <i class="bi bi-question-circle me-2 text-primary"></i>
                    What documents do I need for land transfer?
                  </button>
                </h2>
                <div id="faq7" class="accordion-collapse collapse show" aria-labelledby="faq7">
                  <div class="accordion-body">
                    Required documents:
                    <ul class="mb-0">
                      <li>Original Title Deed</li>
                      <li>National ID (both parties)</li>
                      <li>Sale Agreement (if applicable)</li>
                      <li>Tax Clearance Certificate</li>
                      <li>Consent from spouse (if married)</li>
                      <li>Land Rates Clearance Certificate</li>
                    </ul>
                    <p class="mt-2 mb-0">Upload digital copies through the system during transfer application.</p>
                  </div>
                </div>
              </div>

              <!-- FAQ 8 -->
              <div class="accordion-item border-0 mb-2 rounded-3 overflow-hidden">
                <h2 class="accordion-header">
                  <button class="accordion-button bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#faq8" aria-expanded="true">
                    <i class="bi bi-question-circle me-2 text-primary"></i>
                    How secure is my data?
                  </button>
                </h2>
                <div id="faq8" class="accordion-collapse collapse show" aria-labelledby="faq8">
                  <div class="accordion-body">
                    Your data is protected with:
                    <ul class="mb-0">
                      <li>256-bit TLS encryption</li>
                      <li>Secure authentication</li>
                      <li>Regular security audits</li>
                      <li>Government-grade data centers</li>
                      <li>Audit logging of all activities</li>
                    </ul>
                    <p class="mt-2 mb-0">We comply with Kenya Data Protection Act 2019.</p>
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
