<template>
  <div class="main-layout-container">
    <Navbar />

    <main class="flex-grow-1 p-3 p-md-4 p-xl-5">
      <!-- Header -->
      <div class="mb-4">
        <span class="badge badge-pill-custom badge-soft-blue mb-2">
          <i class="bi bi-headset"></i> Customer Support Management
        </span>
        <h1 class="fw-bold text-dark fs-2 mb-1">Support Tickets</h1>
        <p class="text-muted mb-0">View and respond to user support requests and inquiries</p>
      </div>

      <!-- Statistics Cards -->
      <div class="row g-3 mb-4">
        <div class="col-6 col-md-3">
          <div class="dash-card h-100">
            <div class="d-flex align-items-center gap-3">
              <div class="avatar-circle bg-warning text-dark">
                <i class="bi bi-clock-history"></i>
              </div>
              <div>
                <div class="display-6 fw-bold">{{ stats.pending }}</div>
                <small class="text-muted">Pending</small>
              </div>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="dash-card h-100">
            <div class="d-flex align-items-center gap-3">
              <div class="avatar-circle bg-primary text-white">
                <i class="bi bi-reply-fill"></i>
              </div>
              <div>
                <div class="display-6 fw-bold">{{ stats.inProgress }}</div>
                <small class="text-muted">In Progress</small>
              </div>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="dash-card h-100">
            <div class="d-flex align-items-center gap-3">
              <div class="avatar-circle bg-success text-white">
                <i class="bi bi-check-circle-fill"></i>
              </div>
              <div>
                <div class="display-6 fw-bold">{{ stats.resolved }}</div>
                <small class="text-muted">Resolved</small>
              </div>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="dash-card h-100">
            <div class="d-flex align-items-center gap-3">
              <div class="avatar-circle bg-secondary text-white">
                <i class="bi bi-inbox-fill"></i>
              </div>
              <div>
                <div class="display-6 fw-bold">{{ stats.total }}</div>
                <small class="text-muted">Total Tickets</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="dash-card mb-4">
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label fw-semibold small text-muted">Filter by Status</label>
            <select v-model="filterStatus" @change="loadTickets" class="form-select">
              <option value="all">All Tickets</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label fw-semibold small text-muted">Filter by Priority</label>
            <select v-model="filterPriority" @change="loadTickets" class="form-select">
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label fw-semibold small text-muted">Search</label>
            <input 
              v-model="searchQuery" 
              @input="loadTickets"
              type="text" 
              class="form-control" 
              placeholder="Search tickets..."
            >
          </div>
        </div>
      </div>

      <!-- Tickets List -->
      <div class="dash-card">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h5 class="fw-bold mb-0">
            <i class="bi bi-ticket-detailed me-2"></i>All Support Tickets
          </h5>
          <button @click="loadTickets" class="btn btn-sm btn-light" :disabled="loading">
            <i class="bi bi-arrow-clockwise me-1"></i>Refresh
          </button>
        </div>

        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="text-muted mt-2 small">Loading tickets...</p>
        </div>

        <div v-else-if="tickets.length === 0" class="text-center py-5">
          <div class="avatar-circle bg-light text-muted mx-auto mb-3" style="width: 64px; height: 64px; font-size: 1.5rem;">
            <i class="bi bi-inbox"></i>
          </div>
          <h6 class="fw-bold text-dark mb-2">No Tickets Found</h6>
          <p class="text-muted small mb-0">There are no support tickets matching your filters</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr style="border-bottom: 2px solid #e5e7eb;">
                <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.7rem;">ID</th>
                <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.7rem;">User</th>
                <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.7rem;">Subject</th>
                <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.7rem;">Priority</th>
                <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.7rem;">Status</th>
                <th class="py-3 text-muted fw-semibold text-uppercase" style="font-size: 0.7rem;">Created</th>
                <th class="py-3 text-muted fw-semibold text-uppercase text-end" style="font-size: 0.7rem;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ticket in tickets" :key="ticket._id" style="border-bottom: 1px solid #f3f4f6;">
                <td class="py-3">
                  <span class="badge bg-light text-dark font-monospace">#{{ ticket._id.slice(-6).toUpperCase() }}</span>
                </td>
                <td class="py-3">
                  <div>
                    <div class="fw-semibold small">{{ ticket.user?.fullName || 'Unknown User' }}</div>
                    <small class="text-muted">{{ ticket.user?.email }}</small>
                  </div>
                </td>
                <td class="py-3">
                  <div class="fw-semibold small text-truncate" style="max-width: 300px;">{{ ticket.subject }}</div>
                  <small class="text-muted">{{ ticket.category }}</small>
                </td>
                <td class="py-3">
                  <span :class="['badge rounded-pill px-3 py-1', getPriorityClass(ticket.priority)]">
                    {{ ticket.priority || 'Medium' }}
                  </span>
                </td>
                <td class="py-3">
                  <span :class="['badge rounded-pill px-3 py-1', getStatusClass(ticket.status)]">
                    {{ formatStatus(ticket.status) }}
                  </span>
                </td>
                <td class="py-3">
                  <small class="text-muted">{{ formatDate(ticket.createdAt) }}</small>
                </td>
                <td class="py-3 text-end">
                  <button @click="viewTicket(ticket)" class="btn btn-sm btn-primary" title="View & Reply">
                    <i class="bi bi-eye-fill me-1"></i>View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- View Ticket Modal -->
      <div v-if="selectedTicket" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content border-0 shadow-lg">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title">
                <i class="bi bi-ticket-detailed me-2"></i>
                Ticket #{{ selectedTicket._id.slice(-6).toUpperCase() }}
              </h5>
              <button type="button" class="btn-close btn-close-white" @click="closeTicketModal"></button>
            </div>
            <div class="modal-body p-4">
              <!-- Ticket Details -->
              <div class="mb-4">
                <div class="row g-3 mb-3">
                  <div class="col-md-6">
                    <label class="small text-muted">Submitted By</label>
                    <div class="fw-semibold">{{ selectedTicket.user?.fullName }}</div>
                    <small class="text-muted">{{ selectedTicket.user?.email }}</small>
                  </div>
                  <div class="col-md-6">
                    <label class="small text-muted">Created</label>
                    <div class="fw-semibold">{{ formatDate(selectedTicket.createdAt) }}</div>
                  </div>
                  <div class="col-md-6">
                    <label class="small text-muted">Priority</label>
                    <div>
                      <span :class="['badge rounded-pill px-3 py-1', getPriorityClass(selectedTicket.priority)]">
                        {{ selectedTicket.priority || 'Medium' }}
                      </span>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="small text-muted">Status</label>
                    <div>
                      <select v-model="selectedTicket.status" @change="updateTicketStatus" class="form-select form-select-sm">
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="small text-muted fw-semibold">Subject</label>
                  <div class="fw-bold">{{ selectedTicket.subject }}</div>
                </div>

                <div class="mb-3">
                  <label class="small text-muted fw-semibold">Message</label>
                  <div class="p-3 bg-light rounded">{{ selectedTicket.message }}</div>
                </div>

                <div v-if="selectedTicket.adminResponse" class="mb-3">
                  <label class="small text-muted fw-semibold">
                    <i class="bi bi-reply-fill me-1"></i>Your Response
                  </label>
                  <div class="p-3 bg-primary-subtle rounded">{{ selectedTicket.adminResponse }}</div>
                </div>
              </div>

              <!-- Reply Form -->
              <div v-if="selectedTicket.status !== 'resolved'" class="border-top pt-4">
                <h6 class="fw-bold mb-3">
                  <i class="bi bi-reply-fill me-2"></i>Send Response
                </h6>
                <textarea 
                  v-model="replyMessage" 
                  class="form-control mb-3" 
                  rows="4"
                  placeholder="Type your response here..."
                ></textarea>
                <div v-if="replyError" class="alert alert-danger">
                  <i class="bi bi-exclamation-triangle me-2"></i>{{ replyError }}
                </div>
                <button @click="sendReply" :disabled="replying || !replyMessage" class="btn btn-primary">
                  <span v-if="replying" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="bi bi-send me-2"></i>
                  {{ replying ? 'Sending...' : 'Send Response' }}
                </button>
              </div>
            </div>
          </div>
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
  name: 'SupportTicketsPage',
  components: { Navbar },
  setup() {
    const loading = ref(false)
    const tickets = ref([])
    const filterStatus = ref('all')
    const filterPriority = ref('all')
    const searchQuery = ref('')
    const selectedTicket = ref(null)
    const replyMessage = ref('')
    const replying = ref(false)
    const replyError = ref('')

    const stats = computed(() => {
      return {
        pending: tickets.value.filter(t => t.status === 'pending').length,
        inProgress: tickets.value.filter(t => t.status === 'in_progress').length,
        resolved: tickets.value.filter(t => t.status === 'resolved').length,
        total: tickets.value.length
      }
    })

    const loadTickets = async () => {
      loading.value = true
      try {
        const response = await api.get('/support-tickets')
        if (response.data?.data?.tickets) {
          tickets.value = response.data.data.tickets
        }
      } catch (err) {
        console.error('Error loading tickets:', err)
      } finally {
        loading.value = false
      }
    }

    const viewTicket = (ticket) => {
      selectedTicket.value = ticket
      replyMessage.value = ''
      replyError.value = ''
    }

    const closeTicketModal = () => {
      selectedTicket.value = null
      replyMessage.value = ''
      replyError.value = ''
    }

    const updateTicketStatus = async () => {
      try {
        await api.put(`/support-tickets/${selectedTicket.value._id}`, {
          status: selectedTicket.value.status
        })
        await loadTickets()
      } catch (err) {
        console.error('Error updating status:', err)
        alert('Failed to update ticket status')
      }
    }

    const sendReply = async () => {
      if (!replyMessage.value.trim()) {
        replyError.value = 'Please enter a response message'
        return
      }

      replying.value = true
      replyError.value = ''

      try {
        await api.post(`/support-tickets/${selectedTicket.value._id}/respond`, {
          response: replyMessage.value
        })

        // Update local ticket
        selectedTicket.value.adminResponse = replyMessage.value
        selectedTicket.value.status = 'resolved'
        
        await loadTickets()
        replyMessage.value = ''
        
        alert('Response sent successfully!')
      } catch (err) {
        console.error('Error sending reply:', err)
        replyError.value = err.response?.data?.message || 'Failed to send response'
      } finally {
        replying.value = false
      }
    }

    const getPriorityClass = (priority) => {
      const classes = {
        'low': 'bg-info text-white',
        'medium': 'bg-warning text-dark',
        'high': 'bg-danger text-white',
        'urgent': 'bg-danger text-white'
      }
      return classes[priority?.toLowerCase()] || 'bg-secondary text-white'
    }

    const getStatusClass = (status) => {
      const classes = {
        'pending': 'bg-warning text-dark',
        'in_progress': 'bg-primary text-white',
        'resolved': 'bg-success text-white'
      }
      return classes[status] || 'bg-secondary text-white'
    }

    const formatStatus = (status) => {
      if (!status) return 'Pending'
      return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
    }

    const formatDate = (date) => {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('en-KE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    onMounted(() => {
      loadTickets()
    })

    return {
      loading,
      tickets,
      filterStatus,
      filterPriority,
      searchQuery,
      stats,
      selectedTicket,
      replyMessage,
      replying,
      replyError,
      loadTickets,
      viewTicket,
      closeTicketModal,
      updateTicketStatus,
      sendReply,
      getPriorityClass,
      getStatusClass,
      formatStatus,
      formatDate
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

.modal {
  display: block;
  overflow-y: auto;
}
</style>
