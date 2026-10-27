<template>
  <div class="main-layout-container">
    <Navbar />

    <main class="flex-grow-1 p-3 p-md-4 p-xl-5">
      <!-- Header -->
      <div class="mb-4">
        <span class="badge badge-pill-custom badge-soft-blue mb-2">
          <i class="bi bi-clock-history"></i> Transaction History
        </span>
        <h1 class="fw-bold text-dark fs-2 mb-1">Transfer History</h1>
        <p class="text-muted mb-0">Complete record of all your land transfer transactions</p>
      </div>

      <!-- Statistics Cards -->
      <div class="row g-3 g-md-4 mb-4">
        <div class="col-6 col-md-3">
          <div class="dash-card h-100 text-center">
            <div class="avatar-circle bg-primary text-white mx-auto mb-3" style="width: 48px; height: 48px;">
              <i class="bi bi-arrow-left-right fs-5"></i>
            </div>
            <h3 class="fw-bold text-dark mb-1">{{ stats.total }}</h3>
            <p class="text-muted small mb-0">Total Transfers</p>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="dash-card h-100 text-center">
            <div class="avatar-circle bg-warning text-dark mx-auto mb-3" style="width: 48px; height: 48px;">
              <i class="bi bi-arrow-right-circle fs-5"></i>
            </div>
            <h3 class="fw-bold text-dark mb-1">{{ stats.sent }}</h3>
            <p class="text-muted small mb-0">Sent (Sold)</p>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="dash-card h-100 text-center">
            <div class="avatar-circle bg-success text-white mx-auto mb-3" style="width: 48px; height: 48px;">
              <i class="bi bi-arrow-left-circle fs-5"></i>
            </div>
            <h3 class="fw-bold text-dark mb-1">{{ stats.received }}</h3>
            <p class="text-muted small mb-0">Received (Bought)</p>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="dash-card h-100 text-center">
            <div class="avatar-circle bg-info text-white mx-auto mb-3" style="width: 48px; height: 48px;">
              <i class="bi bi-clock-history fs-5"></i>
            </div>
            <h3 class="fw-bold text-dark mb-1">{{ stats.pending }}</h3>
            <p class="text-muted small mb-0">Pending</p>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="dash-card mb-4">
        <div class="row g-3">
          <div class="col-md-3">
            <label class="form-label small fw-semibold text-dark">Transfer Type</label>
            <select v-model="filters.type" class="form-select rounded-pill bg-light border-0" @change="applyFilters">
              <option value="all">All Transfers</option>
              <option value="sent">Sent (Outgoing)</option>
              <option value="received">Received (Incoming)</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label small fw-semibold text-dark">Status</label>
            <select v-model="filters.status" class="form-select rounded-pill bg-light border-0" @change="applyFilters">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label small fw-semibold text-dark">Search</label>
            <input 
              type="text" 
              v-model="filters.search" 
              class="form-control rounded-pill bg-light border-0" 
              placeholder="Search by parcel number or name..."
              @input="applyFilters"
            >
          </div>
          <div class="col-md-2 d-flex align-items-end">
            <button class="btn btn-pill btn-light-pill w-100" @click="resetFilters">
              <i class="bi bi-x-circle"></i> Reset
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="dash-card text-center py-5">
        <div class="spinner-border text-dark" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-muted mt-3 mb-0">Loading transfer history...</p>
      </div>

      <!-- No Transfers -->
      <div v-else-if="filteredTransfers.length === 0" class="dash-card text-center py-5">
        <div class="avatar-circle bg-light text-muted mx-auto mb-3" style="width: 64px; height: 64px; font-size: 1.8rem;">
          <i class="bi bi-inbox"></i>
        </div>
        <h5 class="fw-bold text-dark">No Transfer Records Found</h5>
        <p class="text-muted mb-0">
          {{ filters.type !== 'all' || filters.status !== 'all' || filters.search 
            ? 'Try adjusting your filters' 
            : 'You have no transfer history yet' 
          }}
        </p>
      </div>

      <!-- Transfer List -->
      <div v-else>
        <div 
          v-for="transfer in paginatedTransfers" 
          :key="transfer._id"
          class="dash-card mb-3 transfer-card"
          @click="viewDetails(transfer)"
        >
          <div class="d-flex gap-3">
            <!-- Icon & Direction -->
            <div class="flex-shrink-0">
              <div 
                class="avatar-circle"
                :class="getTransferDirection(transfer) === 'sent' ? 'bg-warning text-dark' : 'bg-success text-white'"
                style="width: 56px; height: 56px;"
              >
                <i 
                  class="bi fs-4"
                  :class="getTransferDirection(transfer) === 'sent' ? 'bi-arrow-right-circle' : 'bi-arrow-left-circle'"
                ></i>
              </div>
            </div>

            <!-- Transfer Details -->
            <div class="flex-grow-1">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h5 class="fw-bold text-dark mb-1">
                    <span class="badge badge-pill-custom badge-soft-blue me-2">{{ transfer.landParcel?.parcelNumber || 'N/A' }}</span>
                    <span v-if="getTransferDirection(transfer) === 'sent'" class="text-dark">
                      → {{ transfer.newOwner?.fullName || 'Unknown' }}
                    </span>
                    <span v-else class="text-dark">
                      ← {{ transfer.previousOwner?.fullName || 'Unknown' }}
                    </span>
                  </h5>
                  <div class="text-muted small">
                    <i class="bi bi-geo-alt-fill"></i> 
                    {{ transfer.landParcel?.location?.county || 'N/A' }}{{ transfer.landParcel?.location?.subCounty ? ', ' + transfer.landParcel.location.subCounty : '' }}
                  </div>
                </div>

                <!-- Status Badge -->
                <span 
                  class="badge badge-pill-custom"
                  :class="getStatusBadgeClass(transfer.status)"
                >
                  {{ getStatusText(transfer.status) }}
                </span>
              </div>

              <div class="d-flex flex-wrap gap-2 mb-2">
                <span class="badge bg-light text-dark">
                  <i class="bi bi-tag-fill"></i> {{ transfer.transferType || 'sale' }}
                </span>
                <span class="badge bg-light text-dark" v-if="transfer.transferAmount">
                  <i class="bi bi-cash"></i> KES {{ formatCurrency(transfer.transferAmount) }}
                </span>
                <span class="badge bg-light text-dark">
                  <i class="bi bi-calendar-event"></i> {{ formatDate(transfer.createdAt) }}
                </span>
              </div>

              <!-- Rejection Reason -->
              <div v-if="transfer.status === 'rejected' && transfer.rejectionReason" class="alert alert-danger mb-2 py-2">
                <i class="bi bi-exclamation-triangle-fill me-1"></i> 
                <strong>Rejected:</strong> {{ transfer.rejectionReason }}
              </div>

              <!-- Processing Info -->
              <div v-if="transfer.processedDate" class="small text-muted">
                <i class="bi bi-check-circle-fill text-success me-1"></i> 
                Processed by {{ transfer.processedBy?.fullName || 'System' }} on {{ formatDate(transfer.processedDate) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="d-flex justify-content-center mt-4">
          <nav>
            <ul class="pagination">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link rounded-pill me-1" href="#" @click.prevent="currentPage > 1 && (currentPage = 1)">First</a>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link rounded-pill me-1" href="#" @click.prevent="currentPage > 1 && currentPage--">
                  <i class="bi bi-chevron-left"></i>
                </a>
              </li>
              <li 
                v-for="page in visiblePages" 
                :key="page"
                class="page-item" 
                :class="{ active: currentPage === page }"
              >
                <a class="page-link rounded-pill me-1" href="#" @click.prevent="currentPage = page">{{ page }}</a>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <a class="page-link rounded-pill me-1" href="#" @click.prevent="currentPage < totalPages && currentPage++">
                  <i class="bi bi-chevron-right"></i>
                </a>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <a class="page-link rounded-pill" href="#" @click.prevent="currentPage < totalPages && (currentPage = totalPages)">Last</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </main>

    <!-- Details Modal -->
    <div class="modal fade" id="detailsModal" tabindex="-1" ref="detailsModal">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content rounded-4 border-0" v-if="selectedTransfer">
          <div class="modal-header border-0 pb-0">
            <h5 class="fw-bold text-dark mb-0">Transfer Details</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="text-muted small fw-semibold">Transfer ID</label>
                <p class="fw-bold text-dark mb-0">{{ selectedTransfer._id }}</p>
              </div>
              <div class="col-md-6">
                <label class="text-muted small fw-semibold">Status</label>
                <p class="mb-0">
                  <span class="badge badge-pill-custom" :class="getStatusBadgeClass(selectedTransfer.status)">
                    {{ getStatusText(selectedTransfer.status) }}
                  </span>
                </p>
              </div>
              <div class="col-md-12">
                <label class="text-muted small fw-semibold">Land Parcel</label>
                <p class="fw-bold text-dark mb-0">
                  {{ selectedTransfer.landParcel?.parcelNumber || 'N/A' }}
                </p>
                <p class="text-muted small mb-0">
                  {{ selectedTransfer.landParcel?.location?.county }}{{ selectedTransfer.landParcel?.location?.subCounty ? ', ' + selectedTransfer.landParcel.location.subCounty : '' }}{{ selectedTransfer.landParcel?.location?.ward ? ', ' + selectedTransfer.landParcel.location.ward : '' }}
                </p>
              </div>
              <div class="col-md-6">
                <label class="text-muted small fw-semibold">Previous Owner</label>
                <p class="fw-bold text-dark mb-0">
                  {{ selectedTransfer.previousOwner?.fullName || 'N/A' }}
                </p>
                <p class="text-muted small mb-0">ID: {{ selectedTransfer.previousOwner?.nationalId || 'N/A' }}</p>
              </div>
              <div class="col-md-6">
                <label class="text-muted small fw-semibold">New Owner</label>
                <p class="fw-bold text-dark mb-0">
                  {{ selectedTransfer.newOwner?.fullName || 'N/A' }}
                </p>
                <p class="text-muted small mb-0">ID: {{ selectedTransfer.newOwner?.nationalId || 'N/A' }}</p>
              </div>
              <div class="col-md-6">
                <label class="text-muted small fw-semibold">Transfer Type</label>
                <p class="fw-bold text-dark mb-0 text-capitalize">{{ selectedTransfer.transferType || 'sale' }}</p>
              </div>
              <div class="col-md-6">
                <label class="text-muted small fw-semibold">Transfer Amount</label>
                <p class="fw-bold text-dark mb-0">
                  {{ selectedTransfer.transferAmount ? 'KES ' + formatCurrency(selectedTransfer.transferAmount) : 'N/A' }}
                </p>
              </div>
              <div class="col-md-6">
                <label class="text-muted small fw-semibold">Date Initiated</label>
                <p class="text-dark mb-0">{{ formatDateFull(selectedTransfer.createdAt) }}</p>
              </div>
              <div class="col-md-6" v-if="selectedTransfer.processedDate">
                <label class="text-muted small fw-semibold">Date Processed</label>
                <p class="text-dark mb-0">{{ formatDateFull(selectedTransfer.processedDate) }}</p>
              </div>
              <div class="col-md-12" v-if="selectedTransfer.processedBy">
                <label class="text-muted small fw-semibold">Processed By</label>
                <p class="fw-bold text-dark mb-0">{{ selectedTransfer.processedBy?.fullName || 'N/A' }}</p>
              </div>
              <div class="col-md-12" v-if="selectedTransfer.rejectionReason">
                <label class="text-muted small fw-semibold">Rejection Reason</label>
                <div class="alert alert-danger mb-0">{{ selectedTransfer.rejectionReason }}</div>
              </div>
              <div class="col-md-12" v-if="selectedTransfer.approvalNotes">
                <label class="text-muted small fw-semibold">Notes</label>
                <p class="text-muted mb-0">{{ selectedTransfer.approvalNotes }}</p>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-pill btn-light-pill" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import Navbar from '@/components/Navbar.vue';
import api from '@/services/api';
import { Modal } from 'bootstrap';

export default {
  name: 'TransferHistory',
  components: { Navbar },
  setup() {
    const transfers = ref([]);
    const loading = ref(false);
    const currentUser = ref(null);
    const selectedTransfer = ref(null);
    const detailsModal = ref(null);
    const modalInstance = ref(null);

    const filters = ref({
      type: 'all',
      status: 'all',
      search: ''
    });

    const currentPage = ref(1);
    const itemsPerPage = 10;

    const stats = computed(() => {
      const sent = transfers.value.filter(t => 
        t.previousOwner?._id === currentUser.value?._id
      ).length;
      
      const received = transfers.value.filter(t => 
        t.newOwner?._id === currentUser.value?._id
      ).length;

      const pending = transfers.value.filter(t => t.status === 'pending').length;

      return {
        total: transfers.value.length,
        sent,
        received,
        pending
      };
    });

    const filteredTransfers = computed(() => {
      let result = [...transfers.value];

      if (filters.value.type === 'sent') {
        result = result.filter(t => t.previousOwner?._id === currentUser.value?._id);
      } else if (filters.value.type === 'received') {
        result = result.filter(t => t.newOwner?._id === currentUser.value?._id);
      }

      if (filters.value.status !== 'all') {
        result = result.filter(t => t.status === filters.value.status);
      }

      if (filters.value.search) {
        const search = filters.value.search.toLowerCase();
        result = result.filter(t => 
          t.landParcel?.parcelNumber?.toLowerCase().includes(search) ||
          t.previousOwner?.fullName?.toLowerCase().includes(search) ||
          t.newOwner?.fullName?.toLowerCase().includes(search)
        );
      }

      return result;
    });

    const paginatedTransfers = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredTransfers.value.slice(start, end);
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredTransfers.value.length / itemsPerPage);
    });

    const visiblePages = computed(() => {
      const pages = [];
      const start = Math.max(1, currentPage.value - 2);
      const end = Math.min(totalPages.value, currentPage.value + 2);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    });

    const fetchTransfers = async () => {
      loading.value = true;
      try {
        const response = await api.get('/transfers');
        transfers.value = response.data.data.transfers || [];
      } catch (error) {
        console.error('Error fetching transfers:', error);
        alert('Failed to load transfer history');
      } finally {
        loading.value = false;
      }
    };

    const fetchCurrentUser = () => {
      const user = localStorage.getItem('user');
      if (user) {
        currentUser.value = JSON.parse(user);
      }
    };

    const getTransferDirection = (transfer) => {
      return transfer.previousOwner?._id === currentUser.value?._id ? 'sent' : 'received';
    };

    const getStatusBadgeClass = (status) => {
      const classes = {
        pending: 'badge-soft-yellow',
        approved: 'badge-soft-green',
        rejected: 'badge-soft-red',
        cancelled: 'badge-soft-blue'
      };
      return classes[status] || 'badge-soft-blue';
    };

    const getStatusText = (status) => {
      const texts = {
        pending: '⏳ Pending',
        approved: '✅ Approved',
        rejected: '❌ Rejected',
        cancelled: '🚫 Cancelled'
      };
      return texts[status] || status;
    };

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-KE').format(amount);
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-KE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    const formatDateFull = (date) => {
      return new Date(date).toLocaleDateString('en-KE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const applyFilters = () => {
      currentPage.value = 1;
    };

    const resetFilters = () => {
      filters.value = {
        type: 'all',
        status: 'all',
        search: ''
      };
      currentPage.value = 1;
    };

    const viewDetails = (transfer) => {
      selectedTransfer.value = transfer;
      if (!modalInstance.value) {
        modalInstance.value = new Modal(detailsModal.value);
      }
      modalInstance.value.show();
    };

    onMounted(() => {
      fetchCurrentUser();
      fetchTransfers();
    });

    return {
      transfers,
      loading,
      filters,
      stats,
      filteredTransfers,
      paginatedTransfers,
      currentPage,
      totalPages,
      visiblePages,
      selectedTransfer,
      detailsModal,
      getTransferDirection,
      getStatusBadgeClass,
      getStatusText,
      formatCurrency,
      formatDate,
      formatDateFull,
      applyFilters,
      resetFilters,
      viewDetails
    };
  }
};
</script>

<style scoped>
.transfer-card {
  transition: all 0.2s ease;
  cursor: pointer;
}

.transfer-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1) !important;
}

.pagination .page-link {
  color: #212529;
  border: 0;
  margin: 0 2px;
}

.pagination .page-item.active .page-link {
  background: linear-gradient(135deg, #212529 0%, #343a40 100%);
  color: white;
}

.pagination .page-link:hover {
  background-color: #f8f9fa;
}
</style>
