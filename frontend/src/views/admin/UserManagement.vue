<template>
  <div class="main-layout-container">
    <Navbar />

    <main class="flex-grow-1 p-3 p-md-4">
      <div class="container-fluid">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="fw-bold text-dark mb-1">User Management</h2>
            <p class="text-muted mb-0">Manage all system users, their roles, and access permissions</p>
          </div>
          <button @click="showNewUserModal = true" class="btn btn-pill btn-dark-pill">
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
          <div class="dash-card">
            <div class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead class="text-muted small">
                  <tr>
                    <th scope="col" class="border-0 pb-3">USER</th>
                    <th scope="col" class="border-0 pb-3">NATIONAL ID</th>
                    <th scope="col" class="border-0 pb-3">ROLE</th>
                    <th scope="col" class="border-0 pb-3">STATUS</th>
                    <th scope="col" class="border-0 pb-3 text-end">ACTIONS</th>
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
                      <!-- Role Dropdown -->
                      <div class="dropdown role-dropdown">
                        <button 
                          :class="['btn btn-sm dropdown-toggle role-dropdown-btn', getRoleBadgeClass(u.role)]"
                          type="button" 
                          :id="'roleDropdown' + u.id" 
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <i :class="[getRoleIcon(u.role), 'me-2']"></i>
                          <span>{{ formatRole(u.role) }}</span>
                        </button>
                        <ul class="dropdown-menu role-dropdown-menu shadow-lg border-0" :aria-labelledby="'roleDropdown' + u.id">
                          <li class="dropdown-header text-muted small fw-semibold">
                            <i class="bi bi-arrow-repeat me-1"></i> CHANGE ROLE TO
                          </li>
                          <li><hr class="dropdown-divider my-1"></li>
                          <li>
                            <a 
                              class="dropdown-item role-dropdown-item" 
                              :class="{ 'active': u.role === 'Land_Owner', 'disabled': u.role === 'Land_Owner' }"
                              @click="u.role !== 'Land_Owner' && changeUserRole(u.id, 'Land_Owner', u.name)"
                              href="javascript:void(0)"
                            >
                              <div class="d-flex align-items-center">
                                <div class="role-icon-circle bg-secondary-subtle text-secondary me-3">
                                  <i class="bi bi-person-circle"></i>
                                </div>
                                <div class="flex-grow-1">
                                  <div class="fw-semibold">Land Owner</div>
                                  <small class="text-muted">Owns and manages land parcels</small>
                                </div>
                                <i v-if="u.role === 'Land_Owner'" class="bi bi-check-circle-fill text-success ms-2"></i>
                              </div>
                            </a>
                          </li>
                          <li>
                            <a 
                              class="dropdown-item role-dropdown-item" 
                              :class="{ 'active': u.role === 'Land_Officer', 'disabled': u.role === 'Land_Officer' }"
                              @click="u.role !== 'Land_Officer' && changeUserRole(u.id, 'Land_Officer', u.name)"
                              href="javascript:void(0)"
                            >
                              <div class="d-flex align-items-center">
                                <div class="role-icon-circle bg-primary-subtle text-primary me-3">
                                  <i class="bi bi-person-badge"></i>
                                </div>
                                <div class="flex-grow-1">
                                  <div class="fw-semibold">Land Officer</div>
                                  <small class="text-muted">Manages land records & transfers</small>
                                </div>
                                <i v-if="u.role === 'Land_Officer'" class="bi bi-check-circle-fill text-success ms-2"></i>
                              </div>
                            </a>
                          </li>
                          <li>
                            <a 
                              class="dropdown-item role-dropdown-item" 
                              :class="{ 'active': u.role === 'ADMINISTRATOR' || u.role === 'Administrator', 'disabled': u.role === 'ADMINISTRATOR' || u.role === 'Administrator' }"
                              @click="(u.role !== 'ADMINISTRATOR' && u.role !== 'Administrator') && changeUserRole(u.id, 'ADMINISTRATOR', u.name)"
                              href="javascript:void(0)"
                            >
                              <div class="d-flex align-items-center">
                                <div class="role-icon-circle bg-danger-subtle text-danger me-3">
                                  <i class="bi bi-shield-fill-check"></i>
                                </div>
                                <div class="flex-grow-1">
                                  <div class="fw-semibold">Administrator</div>
                                  <small class="text-muted">Full system access & control</small>
                                </div>
                                <i v-if="u.role === 'ADMINISTRATOR' || u.role === 'Administrator'" class="bi bi-check-circle-fill text-success ms-2"></i>
                              </div>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                    <td class="py-3">
                      <span :class="['badge badge-pill-custom', u.isActive !== false ? 'badge-soft-green' : 'badge-soft-red']">
                        {{ u.isActive !== false ? 'Active' : 'Inactive' }}
                      </span>
                    </td>
                    <td class="text-end py-3">
                      <div class="d-flex gap-2 justify-content-end">
                        <button
                          v-if="u.isActive !== false"
                          @click="deactivateUser(u.id)"
                          class="btn btn-sm btn-light text-warning"
                          title="Deactivate user"
                        >
                          <i class="bi bi-person-dash"></i>
                        </button>
                        <button
                          v-else
                          @click="activateUser(u.id)"
                          class="btn btn-sm btn-success"
                          title="Activate user"
                        >
                          <i class="bi bi-person-check"></i>
                        </button>
                        <button
                          @click="deleteUser(u.id, u.name)"
                          class="btn btn-sm btn-danger"
                          title="Delete user permanently"
                        >
                          <i class="bi bi-trash-fill"></i>
                        </button>
                      </div>
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
    </main>

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

    <!-- Role Change Confirmation Modal -->
    <div v-if="showRoleChangeModal" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header bg-warning-subtle border-0">
            <h5 class="modal-title fw-bold">
              <i class="bi bi-exclamation-triangle-fill text-warning me-2"></i>
              Change User Role
            </h5>
            <button @click="showRoleChangeModal = false" type="button" class="btn-close"></button>
          </div>
          <div class="modal-body py-4">
            <p class="mb-3">Are you sure you want to change <strong>{{ roleChangeTarget.userName }}</strong>'s role?</p>
            
            <div class="d-flex align-items-center justify-content-center gap-3 my-4 p-3 bg-light rounded-3">
              <div class="text-center">
                <div class="badge bg-secondary rounded-pill px-3 py-2 mb-2">
                  <i :class="getRoleIcon(roleChangeTarget.currentRole)" class="me-1"></i>
                  {{ formatRole(roleChangeTarget.currentRole) }}
                </div>
                <small class="text-muted d-block">Current Role</small>
              </div>
              
              <i class="bi bi-arrow-right fs-3 text-muted"></i>
              
              <div class="text-center">
                <div class="badge bg-primary rounded-pill px-3 py-2 mb-2">
                  <i :class="getRoleIcon(roleChangeTarget.newRole)" class="me-1"></i>
                  {{ formatRole(roleChangeTarget.newRole) }}
                </div>
                <small class="text-muted d-block">New Role</small>
              </div>
            </div>

            <div class="alert alert-info mb-0">
              <small>
                <i class="bi bi-info-circle me-1"></i>
                <strong>Note:</strong> This will change their access permissions immediately and send them a notification.
              </small>
            </div>
          </div>
          <div class="modal-footer border-0">
            <button @click="showRoleChangeModal = false" class="btn btn-light">Cancel</button>
            <button @click="confirmRoleChange" class="btn btn-primary">
              <i class="bi bi-check-circle me-1"></i>
              Confirm Change
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import api from '@/services/api'

export default {
  name: 'UserManagement',
  components: { Navbar },
  setup() {
    const router = useRouter()
    const usersList = ref([])
    const loadingUsers = ref(false)
    const userSearchQuery = ref('')
    const userRoleFilter = ref('all')
    const userStatusFilter = ref('all')
    const showNewUserModal = ref(false)
    const showRoleChangeModal = ref(false)
    const roleChangeTarget = ref({
      userId: null,
      userName: '',
      currentRole: '',
      newRole: ''
    })
    
    const newUserForm = ref({
      fullName: '',
      email: '',
      phoneNumber: '',
      nationalId: '',
      password: '',
      role: 'Land_Owner',
      physicalAddress: ''
    })

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
          alert('Access Denied: Administrator access required')
          router.push({ name: 'Dashboard' })
        }
      } finally {
        loadingUsers.value = false
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
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Error creating user')
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

    const deleteUser = async (userId, userName) => {
      if (!userId) return
      
      const confirmed = confirm(
        `⚠️ WARNING: DELETE USER\n\n` +
        `Are you sure you want to PERMANENTLY delete "${userName}"?\n\n` +
        `This action will:\n` +
        `• Remove the user account completely\n` +
        `• Cannot be undone\n\n` +
        `Type "DELETE" in the next prompt to confirm.`
      )
      
      if (!confirmed) return
      
      const confirmText = prompt('Type "DELETE" to confirm permanent deletion:')
      if (confirmText !== 'DELETE') {
        alert('Deletion cancelled - confirmation text did not match')
        return
      }
      
      try {
        await api.delete(`/admin/users/${userId}`)
        alert('User deleted successfully')
        await loadUsers()
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting user')
      }
    }

    const searchUsers = () => {
      loadUsers()
    }

    const changeUserRole = async (userId, newRole, userName) => {
      // Find current user to get their role
      const user = usersList.value.find(u => u.id === userId)
      if (!user) return
      
      // Don't show modal if trying to set the same role
      if (user.role === newRole) {
        return
      }
      
      // Set modal data and show modal
      roleChangeTarget.value = {
        userId,
        userName,
        currentRole: user.role,
        newRole
      }
      showRoleChangeModal.value = true
    }

    const confirmRoleChange = async () => {
      const { userId, newRole } = roleChangeTarget.value
      
      try {
        const response = await api.put(`/admin/users/${userId}/role`, { newRole })
        
        if (response.data.status === 'success') {
          // Update user in local list
          const user = usersList.value.find(u => u.id === userId)
          if (user) {
            user.role = newRole
          }
          
          // Close modal
          showRoleChangeModal.value = false
          
          // Show success message
          alert(`✅ Success! User role changed to ${formatRole(newRole)}`)
          
          // Reload users to ensure consistency
          await loadUsers()
        }
      } catch (error) {
        console.error('Error changing role:', error)
        const errorMsg = error.response?.data?.message || 'Failed to change user role'
        alert(`❌ Error: ${errorMsg}`)
        showRoleChangeModal.value = false
      }
    }

    const formatRole = (role) => {
      if (!role) return 'Unknown'
      const roles = {
        'Land_Owner': 'Land Owner',
        'Land_Officer': 'Land Officer',
        'ADMINISTRATOR': 'Administrator',
        'Administrator': 'Administrator'
      }
      return roles[role] || role.replace('_', ' ')
    }

    const getRoleIcon = (role) => {
      const icons = {
        'Land_Owner': 'bi bi-person-circle',
        'Land_Officer': 'bi bi-person-badge',
        'ADMINISTRATOR': 'bi bi-shield-fill-check',
        'Administrator': 'bi bi-shield-fill-check'
      }
      return icons[role] || 'bi bi-person'
    }

    const getRoleBadgeClass = (role) => {
      const classes = {
        'Land_Owner': 'role-badge-owner',
        'Land_Officer': 'role-badge-officer',
        'ADMINISTRATOR': 'role-badge-admin',
        'Administrator': 'role-badge-admin'
      }
      return classes[role] || 'role-badge-owner'
    }

    onMounted(() => {
      loadUsers()
    })

    return {
      usersList,
      loadingUsers,
      userSearchQuery,
      userRoleFilter,
      userStatusFilter,
      showNewUserModal,
      showRoleChangeModal,
      roleChangeTarget,
      newUserForm,
      createNewUser,
      resetUserForm,
      deactivateUser,
      activateUser,
      deleteUser,
      searchUsers,
      changeUserRole,
      confirmRoleChange,
      formatRole,
      getRoleIcon,
      getRoleBadgeClass
    }
  }
}
</script>

<style scoped>
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

.badge-soft-red {
  background-color: #fee2e2;
  color: #991b1b;
}

/* Enhanced Role Dropdown Styling */
.role-dropdown {
  position: relative;
}

.role-dropdown-btn {
  min-width: 160px;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.85rem;
  text-align: left;
  border: 2px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.role-dropdown-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.role-dropdown-btn:active {
  transform: translateY(0);
}

/* Role-specific badge colors */
.role-badge-owner {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  color: #374151;
  border-color: #d1d5db;
}

.role-badge-owner:hover {
  background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
  color: #1f2937;
  border-color: #9ca3af;
}

.role-badge-officer {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
  border-color: #93c5fd;
}

.role-badge-officer:hover {
  background: linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%);
  color: #1e3a8a;
  border-color: #60a5fa;
}

.role-badge-admin {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #991b1b;
  border-color: #fca5a5;
}

.role-badge-admin:hover {
  background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
  color: #7f1d1d;
  border-color: #f87171;
}

/* Dropdown Menu */
.role-dropdown-menu {
  min-width: 320px;
  padding: 0.5rem;
  border-radius: 1rem;
  margin-top: 0.5rem;
  animation: dropdownSlideIn 0.2s ease-out;
}

@keyframes dropdownSlideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-header {
  padding: 0.5rem 1rem;
  font-size: 0.7rem;
  letter-spacing: 0.5px;
  color: #6b7280;
}

/* Dropdown Items */
.role-dropdown-item {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.role-dropdown-item:hover:not(.disabled) {
  background-color: #f9fafb;
  transform: translateX(4px);
}

.role-dropdown-item.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #f3f4f6;
}

.role-dropdown-item.active {
  background-color: #f0fdf4;
  border-left: 3px solid #10b981;
  padding-left: calc(1rem - 3px);
}

/* Role Icon Circle */
.role-icon-circle {
  width: 40px;
  height: 40px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.2s ease;
}

.role-dropdown-item:hover:not(.disabled) .role-icon-circle {
  transform: scale(1.1) rotate(5deg);
}

.role-dropdown-item.active .role-icon-circle {
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

/* Role descriptions */
.role-dropdown-item small {
  font-size: 0.75rem;
  line-height: 1.2;
  display: block;
  margin-top: 2px;
}

/* Checkmark icon */
.role-dropdown-item .bi-check-circle-fill {
  font-size: 1.25rem;
  animation: checkBounce 0.3s ease;
}

@keyframes checkBounce {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

/* Dropdown divider */
.dropdown-divider {
  opacity: 0.1;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .role-dropdown-btn {
    min-width: 140px;
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
  
  .role-dropdown-menu {
    min-width: 280px;
  }
  
  .role-icon-circle {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
}
</style>
