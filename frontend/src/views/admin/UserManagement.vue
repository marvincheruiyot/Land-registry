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
                      <!-- Role Dropdown with Bootstrap Styling -->
                      <div class="dropdown">
                        <button 
                          :class="[
                            'btn btn-sm dropdown-toggle fw-semibold',
                            u.role === 'Land_Owner' ? 'btn-outline-secondary' : '',
                            u.role === 'Land_Officer' ? 'btn-outline-primary' : '',
                            (u.role === 'ADMINISTRATOR' || u.role === 'Administrator') ? 'btn-outline-danger' : ''
                          ]"
                          type="button" 
                          :id="'roleDropdown' + u.id" 
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          style="min-width: 180px;"
                        >
                          <i :class="[getRoleIcon(u.role), 'me-2']"></i>
                          {{ formatRole(u.role) }}
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0" :aria-labelledby="'roleDropdown' + u.id" style="min-width: 350px;">
                          <!-- Header -->
                          <li>
                            <h6 class="dropdown-header text-uppercase fw-bold text-muted small">
                              <i class="bi bi-arrow-repeat me-1"></i>
                              Change Role To
                            </h6>
                          </li>
                          <li><hr class="dropdown-divider"></li>
                          
                          <!-- Land Owner Option -->
                          <li>
                            <a 
                              :class="[
                                'dropdown-item d-flex align-items-center py-3',
                                u.role === 'Land_Owner' ? 'active disabled' : ''
                              ]"
                              @click="u.role !== 'Land_Owner' && changeUserRole(u.id, 'Land_Owner', u.name)"
                              href="javascript:void(0)"
                              :style="u.role === 'Land_Owner' ? 'pointer-events: none; opacity: 0.7;' : ''"
                            >
                              <div class="me-3">
                                <div class="rounded-3 bg-secondary bg-opacity-10 text-secondary p-3">
                                  <i class="bi bi-person-circle fs-4"></i>
                                </div>
                              </div>
                              <div class="flex-grow-1">
                                <div class="fw-bold text-dark">Land Owner</div>
                                <small class="text-muted">Owns and manages land parcels</small>
                              </div>
                              <div v-if="u.role === 'Land_Owner'" class="ms-2">
                                <i class="bi bi-check-circle-fill text-success fs-5"></i>
                              </div>
                            </a>
                          </li>
                          
                          <!-- Land Officer Option -->
                          <li>
                            <a 
                              :class="[
                                'dropdown-item d-flex align-items-center py-3',
                                u.role === 'Land_Officer' ? 'active disabled' : ''
                              ]"
                              @click="u.role !== 'Land_Officer' && changeUserRole(u.id, 'Land_Officer', u.name)"
                              href="javascript:void(0)"
                              :style="u.role === 'Land_Officer' ? 'pointer-events: none; opacity: 0.7;' : ''"
                            >
                              <div class="me-3">
                                <div class="rounded-3 bg-primary bg-opacity-10 text-primary p-3">
                                  <i class="bi bi-person-badge fs-4"></i>
                                </div>
                              </div>
                              <div class="flex-grow-1">
                                <div class="fw-bold text-dark">Land Officer</div>
                                <small class="text-muted">Manages land records & transfers</small>
                              </div>
                              <div v-if="u.role === 'Land_Officer'" class="ms-2">
                                <i class="bi bi-check-circle-fill text-success fs-5"></i>
                              </div>
                            </a>
                          </li>
                          
                          <!-- Administrator Option -->
                          <li>
                            <a 
                              :class="[
                                'dropdown-item d-flex align-items-center py-3',
                                (u.role === 'ADMINISTRATOR' || u.role === 'Administrator') ? 'active disabled' : ''
                              ]"
                              @click="(u.role !== 'ADMINISTRATOR' && u.role !== 'Administrator') && changeUserRole(u.id, 'ADMINISTRATOR', u.name)"
                              href="javascript:void(0)"
                              :style="(u.role === 'ADMINISTRATOR' || u.role === 'Administrator') ? 'pointer-events: none; opacity: 0.7;' : ''"
                            >
                              <div class="me-3">
                                <div class="rounded-3 bg-danger bg-opacity-10 text-danger p-3">
                                  <i class="bi bi-shield-fill-check fs-4"></i>
                                </div>
                              </div>
                              <div class="flex-grow-1">
                                <div class="fw-bold text-dark">Administrator</div>
                                <small class="text-muted">Full system access & control</small>
                              </div>
                              <div v-if="u.role === 'ADMINISTRATOR' || u.role === 'Administrator'" class="ms-2">
                                <i class="bi bi-check-circle-fill text-success fs-5"></i>
                              </div>
                            </a>
                          </li>
                          
                          <li><hr class="dropdown-divider"></li>
                          <li>
                            <div class="px-3 py-2">
                              <small class="text-muted">
                                <i class="bi bi-info-circle me-1"></i>
                                Role changes take effect immediately
                              </small>
                            </div>
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
      getRoleIcon
    }
  }
}
</script>

<style scoped>
/* Avatar Circle */
.avatar-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

/* Status Badges */
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

/* Dropdown Menu Enhancements */
.dropdown-menu {
  border-radius: 1rem;
  padding: 0.5rem;
}

.dropdown-item {
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.dropdown-item:hover:not(.disabled) {
  background-color: #f8f9fa;
  transform: translateX(3px);
}

.dropdown-item.active {
  background-color: #e8f5e9;
  border-left: 3px solid #10b981;
}

/* Smooth transitions for buttons */
.btn {
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn:active {
  transform: translateY(0);
}

/* Checkmark animation */
@keyframes checkBounce {
  0% { transform: scale(0.8); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.bi-check-circle-fill {
  animation: checkBounce 0.3s ease;
}
</style>
