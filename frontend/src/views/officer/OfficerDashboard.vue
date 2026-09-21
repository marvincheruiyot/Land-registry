<template>
  <div class="main-layout-container">
    <Navbar />

    <main class="flex-grow-1 p-3 p-md-4 p-xl-5">
      <!-- Top Bar with Search, Actions, Notification & Profile -->
      <div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4 pb-3 border-bottom">
        <!-- Search Bar -->
        <div class="position-relative flex-grow-1" style="max-width: 450px;">
          <i class="bi bi-search position-absolute text-muted" style="left: 1rem; top: 50%; transform: translateY(-50%);"></i>
          <input
            type="search"
            class="form-control rounded-pill ps-5 py-2 bg-light border-0"
            placeholder="Search parcels, owners, IDs..."
            v-model="searchQuery"
            @keyup.enter="performSearch"
          />
        </div>

        <!-- Action Buttons + Notification + Profile -->
        <div class="d-flex align-items-center gap-2">
          <button @click="showNewParcelModal = true" class="btn btn-pill btn-warning text-dark d-flex align-items-center gap-2 px-4">
            <i class="bi bi-plus-circle"></i> New Parcel
          </button>
          <button @click="showNewTransferModal = true" class="btn btn-pill btn-dark-pill d-flex align-items-center gap-2 px-4">
            <i class="bi bi-arrow-left-right"></i> Transfer
          </button>
          
          <!-- Notification Bell -->
          <button class="btn btn-light-pill rounded-circle p-2 position-relative" style="width: 42px; height: 42px;">
            <i class="bi bi-bell fs-6"></i>
            <span v-if="notifications.length > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.65rem;">
              {{ notifications.length }}
            </span>
          </button>

          <!-- Profile Dropdown -->
          <div class="dropdown">
            <button class="btn btn-light-pill rounded-circle p-0 d-flex align-items-center justify-content-center" style="width: 42px; height: 42px;" data-bs-toggle="dropdown">
              <span class="fw-bold text-dark">{{ user?.fullName?.charAt(0) || 'O' }}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2">
              <li><router-link class="dropdown-item" to="/profile"><i class="bi bi-person me-2"></i>Profile</router-link></li>
              <li><router-link class="dropdown-item" to="/settings"><i class="bi bi-gear me-2"></i>Settings</router-link></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item text-danger" href="#" @click.prevent="handleLogout"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Title & Welcome Header -->
      <div class="mb-4">
        <span class="badge badge-pill-custom badge-soft-blue mb-2">
          <i class="bi bi-briefcase"></i> Land Officer Portal
        </span>
        <h1 class="fw-bold text-dark fs-2 mb-1">Officer Dashboard</h1>
        <p class="text-muted mb-0">Welcome back, {{ user?.fullName || 'Officer' }}. Manage parcels, transfers, and verifications.</p>
      </div>

      <!-- Statistics Cards -->
      <div class="row g-4 mb-4">
        <!-- Pending Approvals -->
        <div class="col-12 col-md-6 col-xl-3">
          <div class="dash-card card-yellow h-100">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="avatar-circle bg-dark text-warning">
                <i class="bi bi-hourglass-split fs-5"></i>
              </div>
              <span class="badge bg-dark text-white rounded-pill px-3 py-1">
                Pending
              </span>
            </div>
            <div>
              <div class="display-5 fw-bold mb-1 lh-1">{{ stats.pendingApprovals }}</div>
              <div class="text-dark small fw-medium">Awaiting Approval</div>
            </div>
            <div class="mt-4 pt-3 border-top border-dark border-opacity-10">
              <small class="text-dark">Transfers & Registrations</small>
            </div>
          </div>
        </div>

        <!-- Total Parcels -->
        <div class="col-12 col-md-6 col-xl-3">
          <div class="dash-card h-100">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="avatar-circle bg-light text-primary">
                <i class="bi bi-map fs-5"></i>
              </div>
              <span class="badge badge-pill-custom badge-soft-blue">
                Active
              </span>
            </div>
            <div>
              <div class="display-5 fw-bold mb-1 lh-1">{{ stats.totalParcels }}</div>
              <div class="text-muted small fw-medium">Registered Parcels</div>
            </div>
            <div class="mt-4 pt-3 border-top">
              <small class="text-muted">Under your jurisdiction</small>
            </div>
          </div>
        </div>

        <!-- Completed Today -->
        <div class="col-12 col-md-6 col-xl-3">
          <div class="dash-card h-100">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="avatar-circle bg-light text-success">
                <i class="bi bi-check-circle fs-5"></i>
              </div>
              <span class="badge badge-pill-custom badge-soft-green">
                Today
              </span>
            </div>
            <div>
              <div class="display-5 fw-bold mb-1 lh-1">{{ stats.completedToday }}</div>
              <div class="text-muted small fw-medium">Completed Tasks</div>
            </div>
            <div class="mt-4 pt-3 border-top">
              <small class="text-muted">Approved transfers</small>
            </div>
          </div>
        </div>

        <!-- Verifications -->
        <div class="col-12 col-md-6 col-xl-3">
          <div class="dash-card card-dark h-100">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="avatar-circle bg-dark-subtle text-white">
                <i class="bi bi-shield-check fs-5"></i>
              </div>
              <span class="badge bg-secondary-subtle text-light rounded-pill px-3 py-1">
                Verified
              </span>
            </div>
            <div>
              <div class="display-5 fw-bold mb-1 lh-1">{{ stats.verifications }}</div>
              <div class="text-secondary small fw-medium">Documents Verified</div>
            </div>
            <div class="mt-4 pt-3 border-top border-secondary border-opacity-25">
              <small class="text-secondary">This month</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="row g-4 mb-4">
        <!-- Pending Transfers List -->
        <div class="col-12 col-lg-8">
          <div class="dash-card h-100">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 class="fw-bold mb-0">Pending Transfer Requests</h5>
                <small class="text-muted">Review and approve ownership transfers</small>
              </div>
              <div class="btn-group">
                <button 
                  :class="['btn btn-sm', transferFilter === 'all' ? 'btn-dark' : 'btn-light']"
                  @click="transferFilter = 'all'"
                >
                  All
                </button>
                <button 
                  :class="['btn btn-sm', transferFilter === 'pending' ? 'btn-warning' : 'btn-light']"
                  @click="transferFilter = 'pending'"
                >
                  Pending
                </button>
                <button 
                  :class="['btn btn-sm', transferFilter === 'review' ? 'btn-info' : 'btn-light']"
                  @click="transferFilter = 'review'"
                >
                  In Review
                </button>
              </div>
            </div>

            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

            <div v-else-if="filteredTransfers.length === 0" class="text-center py-5">
              <i class="bi bi-inbox fs-1 text-muted mb-3 d-block"></i>
              <p class="text-muted">No transfers found</p>
            </div>

            <div v-else class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead class="text-muted small">
                  <tr>
                    <th class="border-0 pb-3">PARCEL</th>
                    <th class="border-0 pb-3">FROM / TO</th>
                    <th class="border-0 pb-3">SUBMITTED</th>
                    <th class="border-0 pb-3">STATUS</th>
                    <th class="border-0 pb-3 text-end">ACTION</th>
                  </tr>
                </thead>
                <tbody class="border-top-0">
                  <tr v-for="transfer in filteredTransfers" :key="transfer._id">
                    <td>
                      <div class="d-flex align-items-center gap-2">
                        <div class="avatar-circle bg-light text-dark" style="width: 32px; height: 32px;">
                          <i class="bi bi-geo-alt"></i>
                        </div>
                        <div>
                          <div class="fw-bold text-dark small">{{ transfer.landParcel?.parcelNumber || 'N/A' }}</div>
                          <small class="text-muted">{{ transfer.landParcel?.location?.county || 'Unknown' }}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="small">
                        <div class="text-muted">From: <span class="fw-semibold text-dark">{{ transfer.currentOwner?.fullName || 'N/A' }}</span></div>
                        <div class="text-muted">To: <span class="fw-semibold text-dark">{{ transfer.newOwner?.fullName || 'N/A' }}</span></div>
                      </div>
                    </td>
                    <td>
                      <small class="text-muted">{{ formatDate(transfer.createdAt) }}</small>
                    </td>
                    <td>
                      <span :class="['badge badge-pill-custom', getStatusClass(transfer.status)]">
                        {{ transfer.status }}
                      </span>
                    </td>
                    <td class="text-end">
                      <button @click="reviewTransfer(transfer)" class="btn btn-sm btn-primary me-2">
                        <i class="bi bi-eye"></i> Review
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Quick Actions & Recent Activity -->
        <div class="col-12 col-lg-4">
          <!-- Quick Actions -->
          <div class="dash-card mb-4">
            <h5 class="fw-bold mb-3">Quick Actions</h5>
            <div class="d-grid gap-2">
              <button @click="showNewParcelModal = true" class="btn btn-light-pill text-start d-flex align-items-center gap-3 py-3">
                <div class="avatar-circle bg-warning text-dark">
                  <i class="bi bi-plus-circle"></i>
                </div>
                <div>
                  <div class="fw-bold text-dark">Register New Parcel</div>
                  <small class="text-muted">Add new land to registry</small>
                </div>
              </button>

              <button @click="showVerifyModal = true" class="btn btn-light-pill text-start d-flex align-items-center gap-3 py-3">
                <div class="avatar-circle bg-primary text-white">
                  <i class="bi bi-shield-check"></i>
                </div>
                <div>
                  <div class="fw-bold text-dark">Verify Document</div>
                  <small class="text-muted">Authenticate deed</small>
                </div>
              </button>

              <router-link to="/parcels" class="btn btn-light-pill text-start d-flex align-items-center gap-3 py-3 text-decoration-none">
                <div class="avatar-circle bg-dark text-white">
                  <i class="bi bi-search"></i>
                </div>
                <div>
                  <div class="fw-bold text-dark">Search Registry</div>
                  <small class="text-muted">Browse all parcels</small>
                </div>
              </router-link>

              <router-link to="/reports" class="btn btn-light-pill text-start d-flex align-items-center gap-3 py-3 text-decoration-none">
                <div class="avatar-circle bg-success text-white">
                  <i class="bi bi-file-earmark-bar-graph"></i>
                </div>
                <div>
                  <div class="fw-bold text-dark">Generate Report</div>
                  <small class="text-muted">Export statistics</small>
                </div>
              </router-link>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="dash-card">
            <h5 class="fw-bold mb-3">Recent Activity</h5>
            <div class="activity-list">
              <div v-for="(activity, idx) in recentActivity" :key="idx" class="activity-item d-flex gap-3 pb-3 mb-3 border-bottom">
                <div :class="['avatar-circle', activity.iconBg]" style="width: 36px; height: 36px;">
                  <i :class="['bi', activity.icon]"></i>
                </div>
                <div class="flex-grow-1">
                  <div class="small fw-semibold text-dark">{{ activity.title }}</div>
                  <small class="text-muted d-block">{{ activity.description }}</small>
                  <small class="text-muted">{{ activity.time }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Parcels -->
      <div class="dash-card">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 class="fw-bold mb-0">Recently Registered Parcels</h5>
            <small class="text-muted">Latest additions to the registry</small>
          </div>
          <router-link to="/parcels" class="btn btn-sm btn-light-pill">
            View All
          </router-link>
        </div>

        <div v-if="recentParcels.length === 0" class="text-center py-5">
          <i class="bi bi-inbox fs-1 text-muted mb-3 d-block"></i>
          <p class="text-muted">No parcels found</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="text-muted small">
              <tr>
                <th class="border-0 pb-3">PARCEL NUMBER</th>
                <th class="border-0 pb-3">OWNER</th>
                <th class="border-0 pb-3">LOCATION</th>
                <th class="border-0 pb-3">SIZE</th>
                <th class="border-0 pb-3">REGISTERED</th>
                <th class="border-0 pb-3 text-end">ACTION</th>
              </tr>
            </thead>
            <tbody class="border-top-0">
              <tr v-for="parcel in recentParcels" :key="parcel._id">
                <td>
                  <div class="fw-bold text-dark small">{{ parcel.parcelNumber }}</div>
                </td>
                <td>
                  <div class="small fw-semibold text-dark">{{ parcel.owner?.fullName || 'N/A' }}</div>
                  <small class="text-muted">ID: {{ parcel.owner?.nationalId || 'N/A' }}</small>
                </td>
                <td>
                  <span class="badge bg-light text-dark rounded-pill px-2 py-1 small">
                    {{ parcel.location?.county || 'Unknown' }}
                  </span>
                </td>
                <td>
                  <small class="text-muted">{{ parcel.size?.value || 'N/A' }} {{ parcel.size?.unit || '' }}</small>
                </td>
                <td>
                  <small class="text-muted">{{ formatDate(parcel.createdAt) }}</small>
                </td>
                <td class="text-end">
                  <button class="btn btn-sm btn-light-pill rounded-circle p-2" title="View Details">
                    <i class="bi bi-arrow-up-right"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- New Parcel Modal -->
    <div v-if="showNewParcelModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header border-0 pb-0">
            <div>
              <h5 class="modal-title fw-bold">Register New Land Parcel</h5>
              <p class="text-muted small mb-0">Add a new parcel to the registry</p>
            </div>
            <button type="button" class="btn-close" @click="closeNewParcelModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitNewParcel">
              <div class="row g-3">
                <div class="col-12 col-md-6">
                  <label class="form-label fw-semibold">Parcel Number *</label>
                  <input v-model="newParcel.parcelNumber" type="text" class="form-control" required>
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label fw-semibold">County *</label>
                  <select v-model="newParcel.county" class="form-select" required>
                    <option value="">Select County</option>
                    <option value="Nairobi">Nairobi</option>
                    <option value="Mombasa">Mombasa</option>
                    <option value="Kisumu">Kisumu</option>
                    <option value="Nakuru">Nakuru</option>
                    <option value="Kiambu">Kiambu</option>
                    <option value="Kajiado">Kajiado</option>
                  </select>
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label fw-semibold">Sub-County</label>
                  <input v-model="newParcel.subCounty" type="text" class="form-control">
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label fw-semibold">Ward</label>
                  <input v-model="newParcel.ward" type="text" class="form-control">
                </div>
                <div class="col-12">
                  <label class="form-label fw-semibold">Location Description</label>
                  <input v-model="newParcel.locationDescription" type="text" class="form-control">
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label fw-semibold">Size (Acres/Hectares) *</label>
                  <input v-model="newParcel.size" type="number" step="0.01" class="form-control" required>
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label fw-semibold">Unit *</label>
                  <select v-model="newParcel.unit" class="form-select" required>
                    <option value="acres">Acres</option>
                    <option value="hectares">Hectares</option>
                  </select>
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label fw-semibold">Land Use *</label>
                  <select v-model="newParcel.landUse" class="form-select" required>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Agricultural">Agricultural</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label fw-semibold">Owner National ID *</label>
                  <input v-model="newParcel.ownerId" type="text" class="form-control" required>
                </div>
                <div class="col-12">
                  <label class="form-label fw-semibold">Boundaries</label>
                  <textarea v-model="newParcel.boundaries" class="form-control" rows="2" placeholder="North: ..., South: ..., East: ..., West: ..."></textarea>
                </div>
                <div class="col-12">
                  <label class="form-label fw-semibold">Notes</label>
                  <textarea v-model="newParcel.notes" class="form-control" rows="2"></textarea>
                </div>
              </div>

              <div v-if="parcelError" class="alert alert-danger mt-3 mb-0">
                {{ parcelError }}
              </div>
              <div v-if="parcelSuccess" class="alert alert-success mt-3 mb-0">
                {{ parcelSuccess }}
              </div>
            </form>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-light" @click="closeNewParcelModal">Cancel</button>
            <button type="button" class="btn btn-dark" @click="submitNewParcel" :disabled="parcelLoading">
              <span v-if="parcelLoading" class="spinner-border spinner-border-sm me-2"></span>
              Register Parcel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- New Transfer Modal -->
    <div v-if="showNewTransferModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header border-0 pb-0">
            <div>
              <h5 class="modal-title fw-bold">Initiate Land Transfer</h5>
              <p class="text-muted small mb-0">Start a new ownership transfer</p>
            </div>
            <button type="button" class="btn-close" @click="closeNewTransferModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitNewTransfer">
              <div class="mb-3">
                <label class="form-label fw-semibold">Parcel Number *</label>
                <input v-model="newTransfer.parcelNumber" type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">New Owner National ID *</label>
                <input v-model="newTransfer.newOwnerId" type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Transfer Type *</label>
                <select v-model="newTransfer.transferType" class="form-select" required>
                  <option value="Sale">Sale</option>
                  <option value="Gift">Gift</option>
                  <option value="Inheritance">Inheritance</option>
                  <option value="Lease">Lease</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Transfer Fee (KES)</label>
                <input v-model="newTransfer.transferFee" type="number" step="0.01" class="form-control">
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Notes</label>
                <textarea v-model="newTransfer.notes" class="form-control" rows="3"></textarea>
              </div>

              <div v-if="transferError" class="alert alert-danger mb-0">
                {{ transferError }}
              </div>
              <div v-if="transferSuccess" class="alert alert-success mb-0">
                {{ transferSuccess }}
              </div>
            </form>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-light" @click="closeNewTransferModal">Cancel</button>
            <button type="button" class="btn btn-dark" @click="submitNewTransfer" :disabled="transferLoading">
              <span v-if="transferLoading" class="spinner-border spinner-border-sm me-2"></span>
              Initiate Transfer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Verify Document Modal -->
    <div v-if="showVerifyModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header border-0 pb-0">
            <div>
              <h5 class="modal-title fw-bold">Verify Document</h5>
              <p class="text-muted small mb-0">Check document authenticity</p>
            </div>
            <button type="button" class="btn-close" @click="showVerifyModal = false"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label fw-semibold">Document ID / Hash</label>
              <input v-model="verifyDocId" type="text" class="form-control" placeholder="Enter document ID or hash">
            </div>
            <div class="text-center">
              <button class="btn btn-primary" @click="verifyDocument">
                <i class="bi bi-shield-check me-2"></i>Verify
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Review Transfer Modal -->
    <div v-if="showReviewModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-lg">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header border-0 pb-0">
            <div>
              <h5 class="modal-title fw-bold">Review Transfer Request</h5>
              <p class="text-muted small mb-0">Approve or reject this transfer</p>
            </div>
            <button type="button" class="btn-close" @click="closeReviewModal"></button>
          </div>
          <div class="modal-body" v-if="selectedTransfer">
            <div class="row g-3 mb-4">
              <div class="col-12">
                <div class="p-3 bg-light rounded">
                  <div class="row">
                    <div class="col-6">
                      <small class="text-muted d-block">Parcel Number</small>
                      <strong>{{ selectedTransfer.landParcel?.parcelNumber || 'N/A' }}</strong>
                    </div>
                    <div class="col-6">
                      <small class="text-muted d-block">Location</small>
                      <strong>{{ selectedTransfer.landParcel?.location?.county || 'N/A' }}</strong>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <small class="text-muted d-block mb-1">Current Owner</small>
                <div class="fw-semibold">{{ selectedTransfer.currentOwner?.fullName || 'N/A' }}</div>
                <small class="text-muted">ID: {{ selectedTransfer.currentOwner?.nationalId || 'N/A' }}</small>
              </div>
              <div class="col-6">
                <small class="text-muted d-block mb-1">New Owner</small>
                <div class="fw-semibold">{{ selectedTransfer.newOwner?.fullName || 'N/A' }}</div>
                <small class="text-muted">ID: {{ selectedTransfer.newOwner?.nationalId || 'N/A' }}</small>
              </div>
              <div class="col-6">
                <small class="text-muted d-block mb-1">Transfer Type</small>
                <div class="fw-semibold">{{ selectedTransfer.transferType || 'N/A' }}</div>
              </div>
              <div class="col-6">
                <small class="text-muted d-block mb-1">Status</small>
                <span :class="['badge badge-pill-custom', getStatusClass(selectedTransfer.status)]">
                  {{ selectedTransfer.status }}
                </span>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">Officer Notes</label>
              <textarea v-model="reviewNotes" class="form-control" rows="3" placeholder="Add your review notes..."></textarea>
            </div>

            <div v-if="reviewError" class="alert alert-danger mb-0">
              {{ reviewError }}
            </div>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-light" @click="closeReviewModal">Cancel</button>
            <button type="button" class="btn btn-danger" @click="rejectTransfer" :disabled="reviewLoading">
              <i class="bi bi-x-circle me-2"></i>Reject
            </button>
            <button type="button" class="btn btn-success" @click="approveTransfer" :disabled="reviewLoading">
              <span v-if="reviewLoading" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-check-circle me-2"></i>Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'
import api from '@/services/api'

export default {
  name: 'OfficerDashboard',
  components: { Navbar },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    const user = computed(() => authStore.user)
    const searchQuery = ref('')
    const loading = ref(false)
    const transferFilter = ref('all')

    // Statistics
    const stats = ref({
      pendingApprovals: 0,
      totalParcels: 0,
      completedToday: 0,
      verifications: 0
    })

    // Data
    const transfers = ref([])
    const recentParcels = ref([])
    const notifications = ref([])
    const recentActivity = ref([
      {
        title: 'Transfer Approved',
        description: 'Parcel KE-NAI-2024-001 ownership transferred',
        time: '2 hours ago',
        icon: 'bi-check-circle',
        iconBg: 'bg-success text-white'
      },
      {
        title: 'New Parcel Registered',
        description: 'KE-MBS-2024-045 added to registry',
        time: '5 hours ago',
        icon: 'bi-plus-circle',
        iconBg: 'bg-warning text-dark'
      },
      {
        title: 'Document Verified',
        description: 'Title deed authentication completed',
        time: '1 day ago',
        icon: 'bi-shield-check',
        iconBg: 'bg-primary text-white'
      }
    ])

    // Modals
    const showNewParcelModal = ref(false)
    const showNewTransferModal = ref(false)
    const showVerifyModal = ref(false)
    const showReviewModal = ref(false)
    const selectedTransfer = ref(null)

    // Forms
    const newParcel = ref({
      parcelNumber: '',
      county: '',
      subCounty: '',
      ward: '',
      locationDescription: '',
      size: '',
      unit: 'acres',
      landUse: '',
      ownerId: '',
      boundaries: '',
      notes: ''
    })

    const newTransfer = ref({
      parcelNumber: '',
      newOwnerId: '',
      transferType: 'Sale',
      transferFee: '',
      notes: ''
    })

    const verifyDocId = ref('')
    const reviewNotes = ref('')

    // Loading states
    const parcelLoading = ref(false)
    const transferLoading = ref(false)
    const reviewLoading = ref(false)

    // Error/Success messages
    const parcelError = ref(null)
    const parcelSuccess = ref(null)
    const transferError = ref(null)
    const transferSuccess = ref(null)
    const reviewError = ref(null)

    // Computed
    const filteredTransfers = computed(() => {
      if (transferFilter.value === 'all') return transfers.value
      return transfers.value.filter(t => t.status === transferFilter.value)
    })

    // Methods
    const fetchDashboardData = async () => {
      loading.value = true
      try {
        const [transfersRes, parcelsRes] = await Promise.allSettled([
          api.get('/transfers?limit=10'),
          api.get('/parcels?limit=5')
        ])

        if (transfersRes.status === 'fulfilled' && transfersRes.value?.data?.data) {
          transfers.value = transfersRes.value.data.data.transfers || []
          stats.value.pendingApprovals = transfers.value.filter(t => t.status === 'pending').length
          stats.value.completedToday = transfers.value.filter(t => {
            const today = new Date().toDateString()
            return new Date(t.updatedAt).toDateString() === today && t.status === 'approved'
          }).length
        }

        if (parcelsRes.status === 'fulfilled' && parcelsRes.value?.data?.data) {
          recentParcels.value = parcelsRes.value.data.data.parcels || []
          stats.value.totalParcels = parcelsRes.value.data.data.total || recentParcels.value.length
        }

        stats.value.verifications = 156 // Mock data
      } catch (err) {
        console.error('Error loading dashboard:', err)
      } finally {
        loading.value = false
      }
    }

    const performSearch = () => {
      if (searchQuery.value.trim()) {
        router.push({ path: '/parcels', query: { search: searchQuery.value } })
      }
    }

    const submitNewParcel = async () => {
      parcelLoading.value = true
      parcelError.value = null
      parcelSuccess.value = null

      try {
        await api.post('/parcels', {
          parcelNumber: newParcel.value.parcelNumber,
          location: {
            county: newParcel.value.county,
            subCounty: newParcel.value.subCounty,
            ward: newParcel.value.ward,
            description: newParcel.value.locationDescription,
            coordinates: { latitude: -1.2921, longitude: 36.8219 }
          },
          size: {
            value: parseFloat(newParcel.value.size),
            unit: newParcel.value.unit
          },
          landUse: newParcel.value.landUse,
          owner: newParcel.value.ownerId,
          boundaries: newParcel.value.boundaries,
          notes: newParcel.value.notes
        })

        parcelSuccess.value = 'Parcel registered successfully!'
        setTimeout(() => {
          closeNewParcelModal()
          fetchDashboardData()
        }, 1500)
      } catch (err) {
        parcelError.value = err.response?.data?.message || 'Failed to register parcel'
      } finally {
        parcelLoading.value = false
      }
    }

    const submitNewTransfer = async () => {
      transferLoading.value = true
      transferError.value = null
      transferSuccess.value = null

      try {
        await api.post('/transfers', {
          parcelNumber: newTransfer.value.parcelNumber,
          newOwnerNationalId: newTransfer.value.newOwnerId,
          transferType: newTransfer.value.transferType,
          transferFee: newTransfer.value.transferFee ? parseFloat(newTransfer.value.transferFee) : undefined,
          notes: newTransfer.value.notes
        })

        transferSuccess.value = 'Transfer initiated successfully!'
        setTimeout(() => {
          closeNewTransferModal()
          fetchDashboardData()
        }, 1500)
      } catch (err) {
        transferError.value = err.response?.data?.message || 'Failed to initiate transfer'
      } finally {
        transferLoading.value = false
      }
    }

    const reviewTransfer = (transfer) => {
      selectedTransfer.value = transfer
      reviewNotes.value = ''
      showReviewModal.value = true
    }

    const approveTransfer = async () => {
      if (!selectedTransfer.value) return
      
      reviewLoading.value = true
      reviewError.value = null

      try {
        await api.patch(`/transfers/${selectedTransfer.value._id}/status`, {
          status: 'approved',
          notes: reviewNotes.value
        })

        closeReviewModal()
        fetchDashboardData()
      } catch (err) {
        reviewError.value = err.response?.data?.message || 'Failed to approve transfer'
      } finally {
        reviewLoading.value = false
      }
    }

    const rejectTransfer = async () => {
      if (!selectedTransfer.value) return
      
      reviewLoading.value = true
      reviewError.value = null

      try {
        await api.patch(`/transfers/${selectedTransfer.value._id}/status`, {
          status: 'rejected',
          notes: reviewNotes.value
        })

        closeReviewModal()
        fetchDashboardData()
      } catch (err) {
        reviewError.value = err.response?.data?.message || 'Failed to reject transfer'
      } finally {
        reviewLoading.value = false
      }
    }

    const verifyDocument = () => {
      alert(`Verifying document: ${verifyDocId.value}`)
      showVerifyModal.value = false
    }

    const closeNewParcelModal = () => {
      showNewParcelModal.value = false
      newParcel.value = {
        parcelNumber: '',
        county: '',
        subCounty: '',
        ward: '',
        locationDescription: '',
        size: '',
        unit: 'acres',
        landUse: '',
        ownerId: '',
        boundaries: '',
        notes: ''
      }
      parcelError.value = null
      parcelSuccess.value = null
    }

    const closeNewTransferModal = () => {
      showNewTransferModal.value = false
      newTransfer.value = {
        parcelNumber: '',
        newOwnerId: '',
        transferType: 'Sale',
        transferFee: '',
        notes: ''
      }
      transferError.value = null
      transferSuccess.value = null
    }

    const closeReviewModal = () => {
      showReviewModal.value = false
      selectedTransfer.value = null
      reviewNotes.value = ''
      reviewError.value = null
    }

    const formatDate = (date) => {
      if (!date) return 'N/A'
      const d = new Date(date)
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    const getStatusClass = (status) => {
      const classes = {
        pending: 'badge-soft-yellow',
        approved: 'badge-soft-green',
        rejected: 'badge-soft-red',
        in_review: 'badge-soft-blue'
      }
      return classes[status] || 'badge-soft-blue'
    }

    const handleLogout = () => {
      authStore.logout()
      router.push('/login')
    }

    onMounted(() => {
      fetchDashboardData()
    })

    return {
      user,
      searchQuery,
      loading,
      transferFilter,
      stats,
      transfers,
      filteredTransfers,
      recentParcels,
      notifications,
      recentActivity,
      showNewParcelModal,
      showNewTransferModal,
      showVerifyModal,
      showReviewModal,
      selectedTransfer,
      newParcel,
      newTransfer,
      verifyDocId,
      reviewNotes,
      parcelLoading,
      transferLoading,
      reviewLoading,
      parcelError,
      parcelSuccess,
      transferError,
      transferSuccess,
      reviewError,
      performSearch,
      submitNewParcel,
      submitNewTransfer,
      reviewTransfer,
      approveTransfer,
      rejectTransfer,
      verifyDocument,
      closeNewParcelModal,
      closeNewTransferModal,
      closeReviewModal,
      formatDate,
      getStatusClass,
      handleLogout,
      authStore
    }
  }
}
</script>

<style scoped>
.activity-item:last-child {
  border-bottom: none !important;
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
}
</style>
