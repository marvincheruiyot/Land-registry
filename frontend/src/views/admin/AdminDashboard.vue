<template>
  <div class="d-flex" style="min-height: 100vh;">
    <!-- Dedicated Admin Sidebar (Bootstrap) -->
    <aside class="sidebar-wrapper">
      <!-- Logo/Brand -->
      <div>
        <div class="sidebar-brand">
          <div class="sidebar-logo-icon">
            🏘️
          </div>
          <div>
            <h2 class="fs-5 fw-bold mb-0">Land Registry</h2>
            <small class="text-muted">Admin Panel</small>
          </div>
        </div>

        <!-- Navigation Menu -->
        <nav>
          <button @click="handleSectionChange('overview')" 
            :class="['sidebar-nav-item', activeSection === 'overview' ? 'active' : '']">
            <i class="bi bi-speedometer2"></i>
            <span>Admin Overview</span>
          </button>

          <button @click="handleSectionChange('users')" 
            :class="['sidebar-nav-item', activeSection === 'users' ? 'active' : '']">
            <i class="bi bi-people-fill"></i>
            <span>User Management</span>
          </button>

          <button @click="handleSectionChange('parcels')" 
            :class="['sidebar-nav-item', activeSection === 'parcels' ? 'active' : '']">
            <i class="bi bi-map-fill"></i>
            <span>Land Parcels</span>
          </button>

          <button @click="handleSectionChange('transfers')" 
            :class="['sidebar-nav-item', activeSection === 'transfers' ? 'active' : '']">
            <i class="bi bi-arrow-left-right"></i>
            <span>Transfers</span>
          </button>

          <button @click="handleSectionChange('reports')" 
            :class="['sidebar-nav-item', activeSection === 'reports' ? 'active' : '']">
            <i class="bi bi-bar-chart-fill"></i>
            <span>Reports</span>
          </button>

          <button @click="handleSectionChange('settings')" 
            :class="['sidebar-nav-item', activeSection === 'settings' ? 'active' : '']">
            <i class="bi bi-gear-fill"></i>
            <span>Settings</span>
          </button>
        </nav>
      </div>

      <!-- User Profile Section at Bottom -->
      <div>
        <div class="mb-2">
          <router-link to="/admindashboard" class="sidebar-nav-item text-decoration-none">
            <i class="bi bi-house-fill"></i>
            <span>Exit Admin</span>
          </router-link>
        </div>
        
        <!-- Admin Profile Card -->
        <div class="sidebar-user-card">
          <div class="d-flex align-items-center gap-3 mb-3">
            <div class="avatar-circle bg-primary text-white">
              MA
            </div>
            <div>
              <p class="fw-semibold text-dark small mb-0">Marvin Admin</p>
              <small class="text-muted">Administrator</small>
            </div>
          </div>
          <button @click="handleLogout" class="btn btn-light btn-sm w-100 d-flex justify-content-between align-items-center">
            <span class="small">Sign Out</span>
            <i class="bi bi-box-arrow-right"></i>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="main-layout-container">
      <!-- Top Header Bar -->
      <header class="top-navbar-custom">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h1 class="fs-3 fw-bold mb-1">
              {{ getSectionTitle(activeSection) }}
            </h1>
            <p class="text-muted small mb-0">{{ getSectionDescription(activeSection) }}</p>
          </div>
          <div class="d-flex align-items-center gap-3">
            <button class="btn btn-light rounded-circle position-relative" style="width: 42px; height: 42px;">
              <i class="bi bi-bell-fill"></i>
              <span class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                <span class="visually-hidden">New alerts</span>
              </span>
            </button>
            <button class="btn btn-light rounded-circle" style="width: 42px; height: 42px;">
              <i class="bi bi-gear-fill"></i>
            </button>
          </div>
        </div>
      </header>

      <!-- Users Management View - COMPLETELY OUTSIDE PADDED CONTAINER -->
      <div v-if="activeSection === 'users'" class="bg-white vh-100">
        <div class="container-fluid px-4 py-4">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 class="fw-bold text-dark mb-1">Authorized Users & Officers</h5>
              <p class="text-muted small mb-0">Manage all system users, their roles, and access permissions</p>
            </div>
            <button @click="showNewUserModal = true" class="btn btn-pill btn-sm btn-dark-pill">
              <i class="bi bi-person-plus-fill"></i> New User
            </button>
          </div>

          <div v-if="loadingUsers" class="text-center py-5">
            <div class="spinner-border text-dark" role="status" style="width: 2rem; height: 2rem;"></div>
            <p class="text-muted mt-2 small">Loading user accounts...</p>
          </div>
          <div v-else>
            <!-- Search and Filter Bar -->
            <div class="row g-3 mb-4">
              <div class="col-md-6">
                <div class="input-group">
                  <span class="input-group-text bg-light border-end-0">
                    <i class="bi bi-search"></i>
                  </span>
                  <input v-model="userSearchQuery" @input="searchUsers" type="text" class="form-control border-start-0 bg-light" placeholder="Search users by name, email, or ID...">
                </div>
              </div>
              <div class="col-md-3">
                <select v-model="userRoleFilter" @change="searchUsers" class="form-select bg-light">
                  <option value="all">All Roles</option>
                  <option value="Administrator">Administrator</option>
                  <option value="Land_Officer">Land Officer</option>
                  <option value="Land_Owner">Land Owner</option>
                </select>
              </div>
              <div class="col-md-3">
                <select v-model="userStatusFilter" @change="searchUsers" class="form-select bg-light">
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <!-- User Table -->
            <div class="table-responsive">
              <table class="table table-hover align-middle mb-0 w-100">
                <thead class="text-muted small">
                  <tr>
                    <th scope="col" class="border-0 pb-3">OFFICIAL / CITIZEN</th>
                    <th scope="col" class="border-0 pb-3">NATIONAL ID</th>
                    <th scope="col" class="border-0 pb-3">SECURITY ROLE</th>
                    <th scope="col" class="border-0 pb-3">STATUS</th>
                    <th scope="col" class="border-0 pb-3 text-end">ACTION</th>
                  </tr>
                </thead>
                <tbody class="border-top-0">
                  <tr v-for="(u, i) in usersList" :key="i">
                    <td class="py-3">
                      <div class="d-flex align-items-center gap-2">
                        <div class="avatar-circle bg-dark text-white" style="width: 42px; height: 42px; font-size: 0.9rem;">
                          {{ (u.name || 'U').slice(0, 2).toUpperCase() }}
                        </div>
                        <div>
                          <div class="fw-bold text-dark">{{ u.name }}</div>
                          <small class="text-muted">{{ u.email }}</small>
                        </div>
                      </div>
                    </td>
                    <td class="fw-semibold text-dark py-3">{{ u.nationalId }}</td>
                    <td class="py-3">
                      <span class="badge bg-light text-dark rounded-pill px-3 py-2">
                        {{ (u.role || '').replace('_', ' ') }}
                      </span>
                    </td>
                    <td class="py-3">
                      <span :class="['badge badge-pill-custom', u.isActive !== false ? 'badge-soft-green' : 'badge-soft-red']">
                        {{ u.isActive !== false ? 'Active' : 'Inactive' }}
                      </span>
                    </td>
                    <td class="text-end py-3">
                      <button
                        v-if="u.isActive !== false"
                        @click="deactivateUser(u.id)"
                        class="btn btn-pill btn-sm btn-light-pill text-danger"
                      >
                        <i class="bi bi-person-dash"></i> Deactivate
                      </button>
                      <button
                        v-else
                        @click="activateUser(u.id)"
                        class="btn btn-pill btn-sm btn-dark-pill"
                      >
                        <i class="bi bi-person-check"></i> Activate
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div class="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
              <small class="text-muted">Showing {{ usersList.length }} users</small>
              <nav>
                <ul class="pagination pagination-sm mb-0">
                  <li class="page-item disabled">
                    <a class="page-link" href="#">Previous</a>
                  </li>
                  <li class="page-item active"><a class="page-link" href="#">1</a></li>
                  <li class="page-item">
                    <a class="page-link" href="#">Next</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <!-- New User Modal -->
      <div v-if="showNewUserModal" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title fw-bold">Create New User</h5>
              <button @click="showNewUserModal = false; resetUserForm()" type="button" class="btn-close"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="createNewUser">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">Full Name *</label>
                    <input v-model="newUserForm.fullName" type="text" class="form-control" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Email *</label>
                    <input v-model="newUserForm.email" type="email" class="form-control" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Phone Number *</label>
                    <input v-model="newUserForm.phoneNumber" type="tel" class="form-control" placeholder="+254712345678" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">National ID *</label>
                    <input v-model="newUserForm.nationalId" type="text" class="form-control" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Password *</label>
                    <input v-model="newUserForm.password" type="password" class="form-control" minlength="8" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Role *</label>
                    <select v-model="newUserForm.role" class="form-select" required>
                      <option value="Land_Owner">Land Owner</option>
                      <option value="Land_Officer">Land Officer</option>
                      <option value="Administrator">Administrator</option>
                    </select>
                  </div>
                  <div class="col-12">
                    <label class="form-label">Physical Address</label>
                    <textarea v-model="newUserForm.physicalAddress" class="form-control" rows="2"></textarea>
                  </div>
                </div>
                <div class="d-flex gap-2 justify-content-end mt-4">
                  <button @click="showNewUserModal = false; resetUserForm()" type="button" class="btn btn-light">Cancel</button>
                  <button type="submit" class="btn btn-dark">Create User</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Content for Overview and Other Sections -->
      <div v-if="activeSection !== 'users'"  class="p-4">
        <!-- Only show this section when on Overview -->
        <div v-if="activeSection === 'overview'">
          <!-- Title & Sub-navigation -->
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
            <div>
              <div class="badge badge-pill-custom badge-soft-yellow mb-2">
                <i class="bi bi-shield-lock-fill"></i> Ministry Super-Administrator Portal
              </div>
              <h1 class="fw-bold text-dark fs-2 mb-1">National Cadastral Operations & Control</h1>
              <p class="text-muted mb-0">System health monitoring, registry access controls, and security auditing.</p>
            </div>
          </div>

          <!-- Quick Stats Strip (Nikitin squircle cards) -->
          <div class="row g-4 mb-4">
            <div class="col-12 col-md-4">
              <div class="dash-card card-dark h-100 d-flex flex-column justify-content-between">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <div class="avatar-circle bg-dark-subtle text-white border border-secondary">
                    <i class="bi bi-people-fill fs-5"></i>
                  </div>
                  <span class="badge bg-secondary-subtle text-light rounded-pill px-3 py-1">Active Accounts</span>
                </div>
                <div>
                  <div class="display-5 fw-bold mb-1 lh-1">{{ stats.totalUsers }}</div>
                  <div class="text-secondary small">Total System Registrants</div>
                </div>
                <div class="mt-3 pt-3 border-top border-secondary border-opacity-25 small text-secondary">
                  Admins, Officers & Land Owners
                </div>
              </div>
            </div>

            <div class="col-12 col-md-4">
              <div class="dash-card card-yellow h-100 d-flex flex-column justify-content-between">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <div class="avatar-circle bg-dark text-warning">
                    <i class="bi bi-map-fill fs-5"></i>
                  </div>
                  <span class="badge bg-dark text-white rounded-pill px-3 py-1">Titles Sealed</span>
                </div>
                <div>
                  <div class="display-5 fw-bold mb-1 lh-1">{{ stats.totalParcels }}</div>
                  <div class="text-dark small">Digitized Land Parcels</div>
                </div>
                <div class="mt-3 pt-3 border-top border-dark border-opacity-10 small text-dark">
                  Covering 47 Counties
                </div>
              </div>
            </div>

            <div class="col-12 col-md-4">
              <div class="dash-card h-100 d-flex flex-column justify-content-between">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <div class="avatar-circle bg-light text-success">
                    <i class="bi bi-cpu-fill fs-5"></i>
                  </div>
                  <span class="badge badge-pill-custom badge-soft-green">Operational</span>
                </div>
                <div>
                  <div class="display-5 fw-bold mb-1 lh-1">{{ stats.uptime }}</div>
                  <div class="text-muted small">Infrastructure Uptime</div>
                </div>
                <div class="mt-3 pt-3 border-top small text-muted">
                  Zero Cryptographic Ledger Collisions
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation Filter Pills for Admin Control -->
          <div class="d-flex flex-wrap gap-2 mb-4">
            <button
              v-for="section in ['overview', 'users', 'monitoring', 'logs']"
              :key="section"
              @click="activeSection = section"
              :class="[
                'btn btn-pill text-capitalize',
                activeSection === section ? 'btn-dark-pill' : 'btn-light-pill'
              ]"
            >
              <span>{{ section }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Other sections with padding -->
      <div v-if="activeSection !== 'users' && activeSection !== 'overview'" class="p-4">
        <!-- Admin Content Panel - For other sections -->
        <div class="dash-card">
          <!-- Overview / Admin Overview -->
          <div v-if="activeSection === 'overview'">
            <div class="row g-4">
              <div class="col-12 col-lg-7">
                <h5 class="fw-bold mb-3">Recent Security & Registration Audits</h5>
                <div class="space-y-3">
                  <div class="p-3 bg-light rounded-4 border d-flex justify-content-between align-items-center mb-2">
                    <div class="d-flex align-items-center gap-3">
                      <div class="avatar-circle bg-dark text-warning">
                        <i class="bi bi-person-check-fill"></i>
                      </div>
                      <div>
                        <div class="fw-bold text-dark small">New Land Officer Commissioned</div>
                        <small class="text-muted">Kiambu County Lands Office • Grace Njoroge</small>
                      </div>
                    </div>
                    <span class="badge badge-pill-custom badge-soft-green">Approved</span>
                  </div>

                  <div class="p-3 bg-light rounded-4 border d-flex justify-content-between align-items-center mb-2">
                    <div class="d-flex align-items-center gap-3">
                      <div class="avatar-circle bg-dark text-primary">
                        <i class="bi bi-shield-check"></i>
                      </div>
                      <div>
                        <div class="fw-bold text-dark small">Automated Cadastral Ledger Backup</div>
                        <small class="text-muted">SHA-256 Snapshot Completed to Cold Storage</small>
                      </div>
                    </div>
                    <span class="badge badge-pill-custom badge-soft-blue">Verified</span>
                  </div>

                  <div class="p-3 bg-light rounded-4 border d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center gap-3">
                      <div class="avatar-circle bg-dark text-warning">
                        <i class="bi bi-arrow-left-right"></i>
                      </div>
                      <div>
                        <div class="fw-bold text-dark small">High-Value Commercial Conveyance Sealed</div>
                        <small class="text-muted">Parcel NAI/UPP/2026 • Nairobi Central</small>
                      </div>
                    </div>
                    <span class="badge badge-pill-custom badge-soft-yellow">Logged</span>
                  </div>
                </div>
              </div>

              <div class="col-12 col-lg-5">
                <h5 class="fw-bold mb-3">System Node Performance</h5>
                <div class="p-4 bg-light rounded-4 border">
                  <div class="mb-3">
                    <div class="d-flex justify-content-between small fw-semibold mb-1">
                      <span>Database Connection Pool</span>
                      <span class="text-success">Healthy (8/10)</span>
                    </div>
                    <div class="progress rounded-pill" style="height: 8px;">
                      <div class="progress-bar bg-dark rounded-pill" style="width: 80%"></div>
                    </div>
                  </div>

                  <div class="mb-3">
                    <div class="d-flex justify-content-between small fw-semibold mb-1">
                      <span>Vault Cryptographic Signature Response</span>
                      <span class="text-dark">42ms</span>
                    </div>
                    <div class="progress rounded-pill" style="height: 8px;">
                      <div class="progress-bar bg-warning rounded-pill" style="width: 25%"></div>
                    </div>
                  </div>

                  <div>
                    <div class="d-flex justify-content-between small fw-semibold mb-1">
                      <span>Storage Cluster (Document PDF Vault)</span>
                      <span class="text-muted">1.4 TB / 10 TB</span>
                    </div>
                    <div class="progress rounded-pill" style="height: 8px;">
                      <div class="progress-bar bg-primary rounded-pill" style="width: 14%"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Parcels Management View -->
          <div v-else-if="activeSection === 'parcels'">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h5 class="fw-bold text-dark mb-0">All Land Parcels (System-Wide)</h5>
              <button @click="showNewParcelModal = true; loadUsers()" class="btn btn-pill btn-sm btn-dark-pill">
                <i class="bi bi-plus-circle-fill"></i> Register New Parcel
              </button>
            </div>
            
            <!-- Search and Filter -->
            <div class="row g-3 mb-4">
              <div class="col-md-8">
                <div class="input-group">
                  <span class="input-group-text bg-light">
                    <i class="bi bi-search"></i>
                  </span>
                  <input v-model="parcelSearchQuery" @input="searchParcels" type="text" class="form-control bg-light" placeholder="Search by parcel number or title deed...">
                </div>
              </div>
              <div class="col-md-4">
                <select v-model="parcelCountyFilter" @change="searchParcels" class="form-select bg-light">
                  <option value="all">All Counties</option>
                  <option v-for="county in kenyanCounties" :key="county" :value="county">{{ county }}</option>
                </select>
              </div>
            </div>

            <div v-if="loadingParcels" class="text-center py-5">
              <div class="spinner-border text-dark" role="status"></div>
              <p class="text-muted mt-2">Loading parcels...</p>
            </div>

            <div v-else-if="parcelsList.length === 0" class="alert alert-info">
              <i class="bi bi-info-circle-fill me-2"></i>
              No land parcels found. Click "Register New Parcel" to add one.
            </div>

            <div v-else class="table-responsive">
              <table class="table table-hover align-middle">
                <thead class="text-muted small">
                  <tr>
                    <th>PARCEL NUMBER</th>
                    <th>TITLE DEED</th>
                    <th>COUNTY</th>
                    <th>SIZE (ACRES)</th>
                    <th>OWNER</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="parcel in parcelsList" :key="parcel.id">
                    <td class="fw-bold">{{ parcel.parcelNumber }}</td>
                    <td><small>{{ parcel.titleDeedNumber }}</small></td>
                    <td>{{ parcel.county }}</td>
                    <td>{{ parcel.sizeInAcres }}</td>
                    <td>
                      <div>{{ parcel.ownerName }}</div>
                      <small class="text-muted">{{ parcel.ownerEmail }}</small>
                    </td>
                    <td>
                      <span :class="['badge badge-pill-custom', parcel.status === 'active' ? 'badge-soft-green' : 'badge-soft-yellow']">
                        {{ parcel.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- New Parcel Modal -->
          <div v-if="showNewParcelModal" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-xl">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title fw-bold">Register New Land Parcel</h5>
                  <button @click="showNewParcelModal = false; resetParcelForm()" type="button" class="btn-close"></button>
                </div>
                <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
                  <form @submit.prevent="createNewParcel">
                    <div class="row g-3">
                      <div class="col-md-6">
                        <label class="form-label">Parcel Number *</label>
                        <input v-model="newParcelForm.parcelNumber" type="text" class="form-control" placeholder="e.g., NAI/KIL/2024/001" required>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label">Title</label>
                        <input v-model="newParcelForm.title" type="text" class="form-control">
                      </div>
                      
                      <div class="col-12"><h6 class="mt-2">Location Details</h6></div>
                      <div class="col-md-4">
                        <label class="form-label">County *</label>
                        <select v-model="newParcelForm.county" class="form-select" required>
                          <option value="">Select County</option>
                          <option v-for="county in kenyanCounties" :key="county" :value="county">{{ county }}</option>
                        </select>
                      </div>
                      <div class="col-md-4">
                        <label class="form-label">Sub-County</label>
                        <input v-model="newParcelForm.subCounty" type="text" class="form-control">
                      </div>
                      <div class="col-md-4">
                        <label class="form-label">Ward</label>
                        <input v-model="newParcelForm.ward" type="text" class="form-control">
                      </div>
                      <div class="col-12">
                        <label class="form-label">Location Description</label>
                        <textarea v-model="newParcelForm.locationDescription" class="form-control" rows="2"></textarea>
                      </div>
                      
                      <div class="col-md-6">
                        <label class="form-label">Size in Acres *</label>
                        <input v-model="newParcelForm.sizeInAcres" type="number" step="0.01" class="form-control" required>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label">Land Use *</label>
                        <select v-model="newParcelForm.landUse" class="form-select" required>
                          <option value="residential">Residential</option>
                          <option value="commercial">Commercial</option>
                          <option value="agricultural">Agricultural</option>
                          <option value="industrial">Industrial</option>
                          <option value="mixed">Mixed</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div class="col-12">
                        <label class="form-label">Current Owner *</label>
                        <select v-model="newParcelForm.currentOwnerId" class="form-select" required>
                          <option value="">Select Owner</option>
                          <option v-for="user in usersList" :key="user.id" :value="user.id">
                            {{ user.name }} - {{ user.nationalId }}
                          </option>
                        </select>
                      </div>
                      
                      <div class="col-12"><h6 class="mt-2">Boundaries</h6></div>
                      <div class="col-md-6">
                        <label class="form-label">North</label>
                        <input v-model="newParcelForm.boundaries.north" type="text" class="form-control">
                      </div>
                      <div class="col-md-6">
                        <label class="form-label">South</label>
                        <input v-model="newParcelForm.boundaries.south" type="text" class="form-control">
                      </div>
                      <div class="col-md-6">
                        <label class="form-label">East</label>
                        <input v-model="newParcelForm.boundaries.east" type="text" class="form-control">
                      </div>
                      <div class="col-md-6">
                        <label class="form-label">West</label>
                        <input v-model="newParcelForm.boundaries.west" type="text" class="form-control">
                      </div>
                      
                      <div class="col-12">
                        <label class="form-label">Notes</label>
                        <textarea v-model="newParcelForm.notes" class="form-control" rows="3"></textarea>
                      </div>
                    </div>
                    <div class="d-flex gap-2 justify-content-end mt-4">
                      <button @click="showNewParcelModal = false; resetParcelForm()" type="button" class="btn btn-light">Cancel</button>
                      <button type="submit" class="btn btn-dark">Register Parcel</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <!-- Transfers Management View -->
          <div v-else-if="activeSection === 'transfers'">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h5 class="fw-bold text-dark mb-0">All Transfer Requests (System-Wide)</h5>
              <button class="btn btn-pill btn-sm btn-dark-pill">
                <i class="bi bi-filter-circle-fill"></i> Filter Transfers
              </button>
            </div>
            <div class="alert alert-warning">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              <strong>Admin Control:</strong> Review and approve/reject all land transfer requests. Monitor pending, approved, and rejected transfers.
            </div>
            <div class="text-center py-5">
              <div class="avatar-circle bg-light text-dark mx-auto mb-3" style="width: 60px; height: 60px; font-size: 1.5rem;">
                <i class="bi bi-arrow-left-right"></i>
              </div>
              <h5 class="fw-bold text-dark">{{ stats.activeTransfers }} Active Transfers</h5>
              <p class="text-muted small">Transfer approval and monitoring interface coming soon</p>
            </div>
          </div>

          <!-- Reports View -->
          <div v-else-if="activeSection === 'reports'">
            <h5 class="fw-bold text-dark mb-4">System Reports & Analytics</h5>
            
            <div class="row g-4 mb-4">
              <div class="col-md-6">
                <div class="p-4 bg-light rounded-4 border">
                  <div class="d-flex align-items-center gap-3 mb-3">
                    <div class="avatar-circle bg-dark text-warning">
                      <i class="bi bi-file-earmark-text-fill"></i>
                    </div>
                    <div>
                      <h6 class="fw-bold mb-0">Land Registration Report</h6>
                      <small class="text-muted">Monthly parcel registrations</small>
                    </div>
                  </div>
                  <button class="btn btn-pill btn-dark-pill btn-sm w-100">
                    <i class="bi bi-download me-2"></i> Generate Report
                  </button>
                </div>
              </div>

              <div class="col-md-6">
                <div class="p-4 bg-light rounded-4 border">
                  <div class="d-flex align-items-center gap-3 mb-3">
                    <div class="avatar-circle bg-dark text-primary">
                      <i class="bi bi-arrow-left-right"></i>
                    </div>
                    <div>
                      <h6 class="fw-bold mb-0">Transfer Activity Report</h6>
                      <small class="text-muted">Land ownership transfers</small>
                    </div>
                  </div>
                  <button class="btn btn-pill btn-dark-pill btn-sm w-100">
                    <i class="bi bi-download me-2"></i> Generate Report
                  </button>
                </div>
              </div>

              <div class="col-md-6">
                <div class="p-4 bg-light rounded-4 border">
                  <div class="d-flex align-items-center gap-3 mb-3">
                    <div class="avatar-circle bg-dark text-success">
                      <i class="bi bi-people-fill"></i>
                    </div>
                    <div>
                      <h6 class="fw-bold mb-0">User Activity Report</h6>
                      <small class="text-muted">System usage statistics</small>
                    </div>
                  </div>
                  <button class="btn btn-pill btn-dark-pill btn-sm w-100">
                    <i class="bi bi-download me-2"></i> Generate Report
                  </button>
                </div>
              </div>

              <div class="col-md-6">
                <div class="p-4 bg-light rounded-4 border">
                  <div class="d-flex align-items-center gap-3 mb-3">
                    <div class="avatar-circle bg-dark text-danger">
                      <i class="bi bi-exclamation-triangle-fill"></i>
                    </div>
                    <div>
                      <h6 class="fw-bold mb-0">Audit Trail Report</h6>
                      <small class="text-muted">Security and compliance logs</small>
                    </div>
                  </div>
                  <button class="btn btn-pill btn-dark-pill btn-sm w-100">
                    <i class="bi bi-download me-2"></i> Generate Report
                  </button>
                </div>
              </div>
            </div>

            <div class="alert alert-info">
              <i class="bi bi-info-circle-fill me-2"></i>
              Reports can be generated in PDF, Excel, or CSV formats for comprehensive analysis and record-keeping.
            </div>
          </div>

          <!-- Settings View -->
          <div v-else-if="activeSection === 'settings'">
            <h5 class="fw-bold text-dark mb-4">System Settings & Configuration</h5>
            
            <div class="row g-4">
              <div class="col-md-6">
                <div class="dash-card">
                  <div class="d-flex align-items-center gap-3 mb-3">
                    <i class="bi bi-shield-lock-fill fs-3 text-dark"></i>
                    <div>
                      <h6 class="fw-bold mb-0">Security Settings</h6>
                      <small class="text-muted">Password policies, 2FA, session timeout</small>
                    </div>
                  </div>
                  <button class="btn btn-pill btn-light-pill btn-sm w-100">
                    <i class="bi bi-gear me-2"></i> Configure Security
                  </button>
                </div>
              </div>

              <div class="col-md-6">
                <div class="dash-card">
                  <div class="d-flex align-items-center gap-3 mb-3">
                    <i class="bi bi-envelope-fill fs-3 text-dark"></i>
                    <div>
                      <h6 class="fw-bold mb-0">Email Notifications</h6>
                      <small class="text-muted">Configure email templates and alerts</small>
                    </div>
                  </div>
                  <button class="btn btn-pill btn-light-pill btn-sm w-100">
                    <i class="bi bi-gear me-2"></i> Configure Emails
                  </button>
                </div>
              </div>

              <div class="col-md-6">
                <div class="dash-card">
                  <div class="d-flex align-items-center gap-3 mb-3">
                    <i class="bi bi-database-fill fs-3 text-dark"></i>
                    <div>
                      <h6 class="fw-bold mb-0">Database Backup</h6>
                      <small class="text-muted">Automated backup schedules</small>
                    </div>
                  </div>
                  <button class="btn btn-pill btn-light-pill btn-sm w-100">
                    <i class="bi bi-gear me-2"></i> Configure Backups
                  </button>
                </div>
              </div>

              <div class="col-md-6">
                <div class="dash-card">
                  <div class="d-flex align-items-center gap-3 mb-3">
                    <i class="bi bi-globe fs-3 text-dark"></i>
                    <div>
                      <h6 class="fw-bold mb-0">System Integration</h6>
                      <small class="text-muted">API keys and third-party services</small>
                    </div>
                  </div>
                  <button class="btn btn-pill btn-light-pill btn-sm w-100">
                    <i class="bi bi-gear me-2"></i> Configure Integrations
                  </button>
                </div>
              </div>

              <div class="col-12">
                <div class="alert alert-warning">
                  <i class="bi bi-exclamation-triangle-fill me-2"></i>
                  <strong>Warning:</strong> Changing system settings may affect all users. Please ensure proper testing before applying changes to production.
                </div>
              </div>
            </div>
          </div>

          <!-- Logs View -->
          <div v-else-if="activeSection === 'logs'">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h5 class="fw-bold text-dark mb-0">System Audit Logs</h5>
              <div class="d-flex gap-2">
                <button class="btn btn-pill btn-sm btn-light-pill">
                  <i class="bi bi-filter"></i> Filter
                </button>
                <button class="btn btn-pill btn-sm btn-dark-pill">
                  <i class="bi bi-download"></i> Export
                </button>
              </div>
            </div>

            <div class="mb-3">
              <div class="p-3 bg-light rounded-4 border d-flex justify-content-between align-items-center mb-2">
                <div class="d-flex align-items-center gap-3">
                  <span class="badge badge-pill-custom badge-soft-green">SUCCESS</span>
                  <div>
                    <div class="fw-bold text-dark small">User Login</div>
                    <small class="text-muted">admin@landregistry.go.ke • 2026-09-20 14:35:22</small>
                  </div>
                </div>
                <small class="text-muted">IP: 192.168.1.1</small>
              </div>

              <div class="p-3 bg-light rounded-4 border d-flex justify-content-between align-items-center mb-2">
                <div class="d-flex align-items-center gap-3">
                  <span class="badge badge-pill-custom badge-soft-blue">INFO</span>
                  <div>
                    <div class="fw-bold text-dark small">Parcel Registration</div>
                    <small class="text-muted">officer@landregistry.go.ke • 2026-09-20 14:22:15</small>
                  </div>
                </div>
                <small class="text-muted">Parcel #12345</small>
              </div>

              <div class="p-3 bg-light rounded-4 border d-flex justify-content-between align-items-center mb-2">
                <div class="d-flex align-items-center gap-3">
                  <span class="badge badge-pill-custom badge-soft-yellow">WARNING</span>
                  <div>
                    <div class="fw-bold text-dark small">Failed Login Attempt</div>
                    <small class="text-muted">unknown@example.com • 2026-09-20 13:45:10</small>
                  </div>
                </div>
                <small class="text-muted">IP: 203.0.113.5</small>
              </div>

              <div class="p-3 bg-light rounded-4 border d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center gap-3">
                  <span class="badge badge-pill-custom badge-soft-green">SUCCESS</span>
                  <div>
                    <div class="fw-bold text-dark small">Transfer Approved</div>
                    <small class="text-muted">admin@landregistry.go.ke • 2026-09-20 12:10:33</small>
                  </div>
                </div>
                <small class="text-muted">Transfer #TRF-2026-089</small>
              </div>
            </div>

            <div class="alert alert-info">
              <i class="bi bi-info-circle-fill me-2"></i>
              Audit logs are retained for 90 days and automatically archived for compliance purposes.
            </div>
          </div>

          <!-- Monitoring Section -->
          <div v-else class="text-center py-5">
            <div class="avatar-circle bg-light text-dark mx-auto mb-3" style="width: 60px; height: 60px; font-size: 1.5rem;">
              <i class="bi bi-shield-check"></i>
            </div>
            <h5 class="fw-bold text-dark">All Security Nodes Operating Normally</h5>
            <p class="text-muted small">Continuous telemetry streaming from Ardhi House central datacenter.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

export default {
  name: 'AdminDashboard',
  setup() {
    const router = useRouter()
    const activeSection = ref('overview')
    const usersList = ref([])
    const parcelsList = ref([])
    const loadingUsers = ref(false)
    const loadingParcels = ref(false)
    
    // Search and filter states
    const userSearchQuery = ref('')
    const userRoleFilter = ref('all')
    const userStatusFilter = ref('all')
    const parcelSearchQuery = ref('')
    const parcelCountyFilter = ref('all')
    
    // Modal states
    const showNewUserModal = ref(false)
    const showNewParcelModal = ref(false)
    
    // Form data
    const newUserForm = ref({
      fullName: '',
      email: '',
      phoneNumber: '',
      nationalId: '',
      password: '',
      role: 'Land_Owner',
      physicalAddress: ''
    })
    
    const newParcelForm = ref({
      parcelNumber: '',
      title: '',
      county: '',
      subCounty: '',
      ward: '',
      locationDescription: '',
      latitude: -1.2921,
      longitude: 36.8219,
      sizeInAcres: '',
      currentOwnerId: '',
      landUse: 'residential',
      boundaries: { north: '', south: '', east: '', west: '' },
      notes: ''
    })
    
    const stats = ref({
      totalUsers: 0,
      totalParcels: 0,
      activeTransfers: 0,
      uptime: '99.98%'
    })
    
    const kenyanCounties = [
      'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Kiambu', 'Machakos',
      'Kajiado', 'Nyeri', 'Meru', 'Kakamega', 'Bungoma', 'Kilifi', 'Kwale'
    ]

    const handleLogout = () => {
      localStorage.removeItem('token')
      router.push({ name: 'Login' })
    }

    const getSectionTitle = (section) => {
      const titles = {
        overview: 'Admin Overview',
        users: 'User Management',
        parcels: 'Land Parcels',
        transfers: 'Transfers',
        monitoring: 'System Monitoring',
        reports: 'Reports & Analytics',
        settings: 'System Settings',
        logs: 'System Logs'
      }
      return titles[section] || 'Admin Overview'
    }

    const getSectionDescription = (section) => {
      const descriptions = {
        overview: 'System-wide statistics and administrative controls',
        users: 'Manage system users, roles, and permissions',
        parcels: 'View and manage all registered land parcels',
        transfers: 'Monitor and approve land transfer requests',
        monitoring: 'System health, performance, and security',
        reports: 'Generate and view system reports',
        settings: 'Configure system parameters and preferences',
        logs: 'View system audit logs and activities'
      }
      return descriptions[section] || 'Administrator control panel'
    }

    const loadUsers = async () => {
      loadingUsers.value = true
      try {
        const params = {}
        if (userSearchQuery.value) params.search = userSearchQuery.value
        if (userRoleFilter.value !== 'all') params.role = userRoleFilter.value
        if (userStatusFilter.value !== 'all') params.status = userStatusFilter.value
        
        const response = await api.get('/admin/users', { params })
        usersList.value = (response.data?.data?.users || []).map(u => ({
          name: u.fullName,
          email: u.email,
          nationalId: u.nationalId,
          role: u.role,
          isActive: u.isActive,
          id: u._id
        }))
      } catch (err) {
        console.error('Error loading users:', err)
        if (err.response?.status === 403) {
          alert('Access Denied: You must be logged in as Administrator.\n\nPlease login with:\nEmail: admin@landregistry.go.ke\nPassword: Password@123')
          localStorage.clear()
          router.push({ name: 'Login' })
        }
      } finally {
        loadingUsers.value = false
      }
    }

    const loadParcels = async () => {
      loadingParcels.value = true
      try {
        const params = {}
        if (parcelSearchQuery.value) params.search = parcelSearchQuery.value
        if (parcelCountyFilter.value !== 'all') params.county = parcelCountyFilter.value
        
        const response = await api.get('/admin/parcels', { params })
        parcelsList.value = (response.data?.data?.parcels || []).map(p => ({
          id: p._id,
          parcelNumber: p.parcelNumber,
          titleDeedNumber: p.titleDeedNumber,
          county: p.location?.county,
          sizeInAcres: p.sizeInAcres,
          ownerName: p.currentOwner?.fullName,
          ownerEmail: p.currentOwner?.email,
          status: p.status,
          registrationDate: p.registrationDate
        }))
      } catch (err) {
        console.error('Error loading parcels:', err)
      } finally {
        loadingParcels.value = false
      }
    }

    const loadStats = async () => {
      try {
        const response = await api.get('/admin/dashboard')
        const data = response.data?.data
        if (data) {
          stats.value = {
            totalUsers: data.totalUsers || 0,
            totalParcels: data.totalParcels || 0,
            activeTransfers: data.activeTransfers || 0,
            uptime: '99.98%'
          }
        }
      } catch (err) {
        console.error('Error loading stats:', err)
        if (err.response?.status === 401 || err.response?.status === 403) {
          alert('⚠️ AUTHENTICATION REQUIRED\n\nYou must be logged in as Administrator to access this page.\n\n📧 Email: admin@landregistry.go.ke\n🔑 Password: Password@123\n\nYou will be redirected to the login page.')
          localStorage.clear()
          router.push({ name: 'Login' })
        }
      }
    }

    const createNewUser = async () => {
      try {
        const response = await api.post('/admin/users', newUserForm.value)
        if (response.data.status === 'success') {
          alert('User created successfully!')
          showNewUserModal.value = false
          resetUserForm()
          await loadUsers()
          await loadStats()
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Error creating user')
      }
    }

    const createNewParcel = async () => {
      try {
        const response = await api.post('/admin/parcels', newParcelForm.value)
        if (response.data.status === 'success') {
          alert('Land parcel registered successfully!')
          showNewParcelModal.value = false
          resetParcelForm()
          await loadParcels()
          await loadStats()
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Error creating parcel')
      }
    }

    const resetUserForm = () => {
      newUserForm.value = {
        fullName: '',
        email: '',
        phoneNumber: '',
        nationalId: '',
        password: '',
        role: 'Land_Owner',
        physicalAddress: ''
      }
    }

    const resetParcelForm = () => {
      newParcelForm.value = {
        parcelNumber: '',
        title: '',
        county: '',
        subCounty: '',
        ward: '',
        locationDescription: '',
        latitude: -1.2921,
        longitude: 36.8219,
        sizeInAcres: '',
        currentOwnerId: '',
        landUse: 'residential',
        boundaries: { north: '', south: '', east: '', west: '' },
        notes: ''
      }
    }

    const deactivateUser = async (userId) => {
      if (!userId || !confirm('Deactivate this user account?')) return
      try {
        await api.put(`/admin/users/${userId}/deactivate`)
        alert('User deactivated successfully')
        await loadUsers()
      } catch (err) {
        alert('Error deactivating user')
      }
    }

    const activateUser = async (userId) => {
      if (!userId || !confirm('Activate this user account?')) return
      try {
        await api.put(`/admin/users/${userId}/activate`)
        alert('User activated successfully')
        await loadUsers()
      } catch (err) {
        alert('Error activating user')
      }
    }

    const searchUsers = () => {
      loadUsers()
    }

    const searchParcels = () => {
      loadParcels()
    }

    // Watch for section changes and load data
    const handleSectionChange = (newSection) => {
      activeSection.value = newSection
      if (newSection === 'parcels' && parcelsList.value.length === 0) {
        loadParcels()
      }
    }

    onMounted(() => {
      loadUsers()
      loadStats()
    })

    return {
      activeSection,
      usersList,
      parcelsList,
      loadingUsers,
      loadingParcels,
      userSearchQuery,
      userRoleFilter,
      userStatusFilter,
      parcelSearchQuery,
      parcelCountyFilter,
      showNewUserModal,
      showNewParcelModal,
      newUserForm,
      newParcelForm,
      kenyanCounties,
      stats,
      handleLogout,
      getSectionTitle,
      getSectionDescription,
      createNewUser,
      createNewParcel,
      resetUserForm,
      resetParcelForm,
      deactivateUser,
      activateUser,
      searchUsers,
      searchParcels,
      loadParcels,
      loadUsers,
      handleSectionChange
    }
  }
}
</script>

<style scoped>
/* Admin Dashboard Custom Styles */
.dash-card {
  background-color: #ffffff;
  border-radius: 1.5rem;
  padding: 2rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.card-dark {
  background-color: #1f2937;
  color: white;
  border: none;
}

.card-yellow {
  background-color: #fef3c7;
  color: #78350f;
  border: 1px solid #fde68a;
}

.avatar-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.badge-pill-custom {
  padding: 0.35rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-soft-green {
  background-color: #d1fae5;
  color: #065f46;
}

.badge-soft-blue {
  background-color: #dbeafe;
  color: #1e40af;
}

.badge-soft-yellow {
  background-color: #fef3c7;
  color: #78350f;
}

.badge-soft-red {
  background-color: #fee2e2;
  color: #991b1b;
}

.btn-pill {
  border-radius: 0.75rem;
  padding: 0.5rem 1rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-dark-pill {
  background-color: #1f2937;
  color: white;
  border: none;
}

.btn-dark-pill:hover {
  background-color: #111827;
  color: white;
}

.btn-yellow-pill {
  background-color: #fbbf24;
  color: #78350f;
  border: none;
}

.btn-yellow-pill:hover {
  background-color: #f59e0b;
}

.btn-light-pill {
  background-color: #f3f4f6;
  color: #1f2937;
  border: none;
}

.btn-light-pill:hover {
  background-color: #e5e7eb;
}

.progress {
  background-color: #e5e7eb;
}

.table tbody tr {
  border-bottom: 1px solid #f3f4f6;
}

.table tbody tr:hover {
  background-color: #f9fafb;
}
</style>
