<template>
  <div>
    <!-- Left Sidebar Matching Dribbble Shot -->
    <aside :class="['sidebar-wrapper d-none d-lg-flex', isLandOwner ? 'sidebar-land-owner' : '']">
      <div>
        <!-- Brand / Logo -->
        <router-link 
          :to="dashboardRoute" 
          class="sidebar-brand text-decoration-none"
        >
          <div :class="['sidebar-logo-icon', isLandOwner ? 'bg-primary' : '']">
            <i class="bi bi-geo-alt-fill" :class="isLandOwner ? 'text-white' : 'text-warning'"></i>
          </div>
          <div>
            <div class="fw-bold fs-5 text-dark lh-1">LandRegistry</div>
            <small :class="['fw-semibold', isLandOwner ? 'text-primary' : 'text-muted']" style="font-size: 0.72rem; letter-spacing: 0.5px;">
              {{ isLandOwner ? 'MY LAND PORTAL' : 'KENYA NATIONAL PORTAL' }}
            </small>
          </div>
        </router-link>

        <!-- Main Navigation Links -->
        <div class="nav-section mb-4">
          <div class="text-uppercase text-muted fw-bold px-3 mb-2" style="font-size: 0.68rem; letter-spacing: 1px;">
            Main Menu
          </div>

          <router-link 
            :to="dashboardRoute" 
            class="sidebar-nav-item text-decoration-none" 
            active-class="active"
          >
            <i class="bi bi-grid-fill"></i>
            <span>Dashboard</span>
          </router-link>

          <!-- Land Owner Menu -->
          <template v-if="isLandOwner">
            <router-link to="/my-parcels" class="sidebar-nav-item text-decoration-none" active-class="active">
              <i class="bi bi-map-fill"></i>
              <span>My Land Parcels</span>
            </router-link>

            <router-link to="/my-transfers" class="sidebar-nav-item text-decoration-none" active-class="active">
              <i class="bi bi-arrow-left-right"></i>
              <span>My Transfers</span>
            </router-link>

            <router-link to="/my-documents" class="sidebar-nav-item text-decoration-none" active-class="active">
              <i class="bi bi-file-earmark-text-fill"></i>
              <span>My Documents</span>
            </router-link>

            <router-link to="/verify" class="sidebar-nav-item text-decoration-none" active-class="active">
              <i class="bi bi-patch-check-fill"></i>
              <span>Verify Document</span>
            </router-link>
          </template>

          <!-- Officer & Admin Menu -->
          <template v-else>
            <router-link to="/parcels" class="sidebar-nav-item text-decoration-none" active-class="active">
              <i class="bi bi-map-fill"></i>
              <span>Land Parcels</span>
            </router-link>

            <router-link to="/transfers" class="sidebar-nav-item text-decoration-none" active-class="active">
              <i class="bi bi-arrow-left-right"></i>
              <span>Transfers</span>
            </router-link>

            <router-link to="/documents" class="sidebar-nav-item text-decoration-none" active-class="active">
              <i class="bi bi-file-earmark-text-fill"></i>
              <span>Documents</span>
            </router-link>

            <router-link to="/verify" class="sidebar-nav-item text-decoration-none" active-class="active">
              <i class="bi bi-patch-check-fill"></i>
              <span>Verify Land</span>
            </router-link>

            <div class="px-2 mt-3" v-if="isLandOfficer || isAdministrator">
              <router-link to="/parcels/create" class="btn btn-pill btn-dark-pill w-100 justify-content-center btn-sm py-2">
                <i class="bi bi-plus-circle-fill me-1 text-warning"></i> Add New Parcel
              </router-link>
            </div>
          </template>
        </div>

        <!-- Management Section -->
        <div class="nav-section" v-if="!isLandOwner">
          <div class="text-uppercase text-muted fw-bold px-3 mb-2" style="font-size: 0.68rem; letter-spacing: 1px;">
            Administration
          </div>

          <router-link
            v-if="isLandOfficer || isAdministrator"
            to="/reports"
            class="sidebar-nav-item text-decoration-none"
            active-class="active"
          >
            <i class="bi bi-bar-chart-line-fill"></i>
            <span>Reports & Analytics</span>
          </router-link>

          <router-link
            v-if="isAdministrator"
            to="/users"
            class="sidebar-nav-item text-decoration-none"
            active-class="active"
          >
            <i class="bi bi-people-fill"></i>
            <span>User Management</span>
          </router-link>

          <router-link
            v-if="isAdministrator"
            to="/audit-trail"
            class="sidebar-nav-item text-decoration-none"
            active-class="active"
          >
            <i class="bi bi-shield-check"></i>
            <span>Audit Trail</span>
          </router-link>

          <router-link
            v-if="isAdministrator"
            to="/settings"
            class="sidebar-nav-item text-decoration-none"
            active-class="active"
          >
            <i class="bi bi-gear-fill"></i>
            <span>System Settings</span>
          </router-link>
        </div>

        <!-- User Settings Section (for all users) -->
        <div class="nav-section">
          <div class="text-uppercase text-muted fw-bold px-3 mb-2" style="font-size: 0.68rem; letter-spacing: 1px;">
            Settings
          </div>

          <router-link to="/profile" class="sidebar-nav-item text-decoration-none" active-class="active">
            <i class="bi bi-person-gear"></i>
            <span>My Profile</span>
          </router-link>

          <router-link v-if="isLandOwner" to="/notifications" class="sidebar-nav-item text-decoration-none" active-class="active">
            <i class="bi bi-bell-fill"></i>
            <span>Notifications</span>
          </router-link>

          <router-link v-if="isLandOwner" to="/help" class="sidebar-nav-item text-decoration-none" active-class="active">
            <i class="bi bi-question-circle-fill"></i>
            <span>Help & Support</span>
          </router-link>
        </div>
      </div>

      <!-- Bottom User Card Matching Nikitin Style -->
      <div>
        <div class="sidebar-user-card mb-3">
          <div class="d-flex align-items-center gap-2">
            <div class="avatar-circle bg-dark text-white">
              {{ userInitials }}
            </div>
            <div class="overflow-hidden flex-grow-1">
              <div class="fw-bold text-dark text-truncate" style="font-size: 0.85rem;">
                {{ user?.fullName || 'Authorized User' }}
              </div>
              <div class="text-muted text-truncate" style="font-size: 0.72rem;">
                {{ formatRole(user?.role) }}
              </div>
            </div>
            <button @click="handleLogout" class="btn btn-sm btn-link text-muted p-1" title="Sign Out">
              <i class="bi bi-box-arrow-right fs-5"></i>
            </button>
          </div>
        </div>

        <div class="d-flex justify-content-between align-items-center px-2 text-muted" style="font-size: 0.75rem;">
          <span>v2.4.0 • Online</span>
          <span class="badge bg-success-subtle text-success rounded-pill px-2 py-1">TLS Encrypted</span>
        </div>
      </div>
    </aside>

    <!-- Top Mobile / Secondary Navbar -->
    <header class="top-navbar-custom d-flex align-items-center justify-content-between">
      <!-- Mobile toggler & search -->
      <div class="d-flex align-items-center gap-3">
        <router-link 
          :to="dashboardRoute" 
          class="d-lg-none d-flex align-items-center gap-2 text-decoration-none"
        >
          <div class="sidebar-logo-icon" style="width: 36px; height: 36px; font-size: 1.1rem;">
            <i class="bi bi-geo-alt-fill text-warning"></i>
          </div>
          <span class="fw-bold text-dark">LandRegistry</span>
        </router-link>

        <!-- Welcome Message with Live Clock -->
        <div class="d-none d-lg-block ms-4">
          <p class="mb-0 fw-semibold text-dark">
            Welcome back, {{ user?.fullName || 'User' }} 👋
          </p>
          <p class="text-muted small mb-0">
            <i class="bi bi-clock"></i>
            {{ currentTime }} • {{ currentDate }}
          </p>
        </div>
      </div>

      <!-- Right Header Actions (notifications, profile) -->
      <div class="d-flex align-items-center gap-2 gap-md-3">
        <!-- Notification Bell -->
        <div class="dropdown">
          <button class="btn btn-light-pill p-2 rounded-circle position-relative" style="width: 42px; height: 42px;" data-bs-toggle="dropdown">
            <i class="bi bi-bell-fill text-dark"></i>
            <span v-if="unreadCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.65rem;">
              {{ unreadCount > 99 ? '99+' : unreadCount }}
            </span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 p-0 mt-2" style="width: 380px; max-height: 500px; overflow-y: auto;">
            <!-- Header -->
            <li class="px-3 py-3 border-bottom bg-light">
              <div class="d-flex justify-content-between align-items-center">
                <h6 class="fw-bold mb-0">Notifications</h6>
                <button v-if="unreadCount > 0" @click="markAllAsRead" class="btn btn-sm btn-link text-primary text-decoration-none p-0">
                  Mark all read
                </button>
              </div>
              <small class="text-muted">{{ unreadCount }} unread notifications</small>
            </li>

            <!-- Notifications List -->
            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
            </div>

            <div v-else-if="notifications.length === 0" class="text-center py-5">
              <i class="bi bi-bell-slash fs-1 text-muted mb-2 d-block"></i>
              <p class="text-muted small mb-0">No notifications yet</p>
            </div>

            <li v-else v-for="notif in notifications" :key="notif._id" 
                :class="['dropdown-item-text', notif.read || notif.isRead ? '' : 'bg-primary-subtle']"
                style="cursor: pointer;"
                @click="handleNotificationClick(notif)">
              <div class="d-flex gap-3 py-2 px-3">
                <div :class="['avatar-circle flex-shrink-0', getNotificationIcon(notif.action || notif.type).bgClass]" style="width: 40px; height: 40px;">
                  <i :class="['bi', getNotificationIcon(notif.action || notif.type).icon]"></i>
                </div>
                <div class="flex-grow-1">
                  <div class="d-flex justify-content-between align-items-start mb-1">
                    <strong class="small">{{ notif.title || getNotificationTitle(notif.action || notif.type) }}</strong>
                    <small class="text-muted">{{ formatTime(notif.createdAt) }}</small>
                  </div>
                  <p class="small text-muted mb-0">{{ notif.message || notif.description }}</p>
                  <div v-if="notif.entityType" class="mt-1">
                    <span class="badge bg-light text-dark small">{{ notif.entityType }}</span>
                  </div>
                </div>
              </div>
            </li>

            <!-- Footer -->
            <li class="px-3 py-2 border-top text-center">
              <router-link to="/notifications" class="small text-decoration-none fw-semibold">
                View All Notifications
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Profile Dropdown -->
        <div class="dropdown">
          <button
            class="btn btn-light-pill d-flex align-items-center gap-2 p-1 pe-3"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <div class="avatar-circle bg-dark text-warning" style="width: 34px; height: 34px; font-size: 0.8rem;">
              {{ userInitials }}
            </div>
            <span class="d-none d-md-inline fw-semibold text-dark" style="font-size: 0.85rem;">
              {{ user?.fullName?.split(' ')[0] || 'Account' }}
            </span>
            <i class="bi bi-chevron-down text-muted" style="font-size: 0.75rem;"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 p-2 mt-2" style="min-width: 220px;">
            <li class="px-3 py-2 border-bottom mb-2">
              <div class="fw-bold text-dark">{{ user?.fullName }}</div>
              <div class="text-muted small">{{ user?.email }}</div>
            </li>
            <li>
              <router-link to="/profile" class="dropdown-item rounded-3 py-2">
                <i class="bi bi-person me-2"></i> View Profile
              </router-link>
            </li>
            <li><hr class="dropdown-divider"></li>
            <li>
              <button @click="handleLogout" class="dropdown-item text-danger rounded-3 py-2">
                <i class="bi bi-box-arrow-right me-2"></i> Sign Out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

export default {
  name: 'Navbar',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    const user = computed(() => authStore.user)
    const isLandOfficer = computed(() => authStore.isLandOfficer)
    const isAdministrator = computed(() => authStore.isAdministrator)
    const isLandOwner = computed(() => authStore.isLandOwner)

    // Computed property for dashboard route based on user role
    const dashboardRoute = computed(() => {
      if (isAdministrator.value) return '/admindashboard'
      if (isLandOfficer.value) return '/officer'
      if (isLandOwner.value) return '/userdashboard'
      return '/admindashboard' // fallback
    })

    const userInitials = computed(() => {
      if (!user.value?.fullName) return 'LR'
      const names = user.value.fullName.trim().split(' ')
      return names.map(n => n[0]).join('').toUpperCase().slice(0, 2)
    })

    // Notifications
    const notifications = ref([])
    const unreadCount = ref(0)
    const loading = ref(false)

    const fetchNotifications = async () => {
      loading.value = true
      try {
        // Fetch real notifications from the notifications API
        const response = await api.get('/notifications?limit=20')
        if (response.data?.data?.notifications) {
          notifications.value = response.data.data.notifications.map(notif => ({
            _id: notif._id,
            type: notif.type,
            title: notif.title,
            message: notif.message,
            action: notif.type, // Use type as action for compatibility
            description: notif.message,
            entityType: notif.relatedEntity?.entityType,
            entityId: notif.relatedEntity?.entityId,
            createdAt: notif.createdAt,
            read: notif.isRead || false,
            isRead: notif.isRead || false
          }))
          
          // Get unread count from server
          unreadCount.value = response.data.data.unreadCount || 0
        }
      } catch (err) {
        console.error('Error fetching notifications:', err)
        // Fallback to audit logs if notifications fail
        try {
          const response = await api.get(`/audit-logs?user=${user.value.id}&limit=20`)
          if (response.data?.data?.logs) {
            notifications.value = response.data.data.logs.map(log => ({
              _id: log._id,
              action: log.action,
              description: log.description || log.details || 'System activity',
              entityType: log.entityType || log.resourceType,
              createdAt: log.createdAt,
              read: false
            }))
            unreadCount.value = notifications.value.filter(n => !n.read).length
          }
        } catch (fallbackErr) {
          console.error('Error fetching audit logs:', fallbackErr)
        }
      } finally {
        loading.value = false
      }
    }

    const markAsRead = async (notifId) => {
      try {
        const response = await api.put(`/notifications/${notifId}/read`)
        if (response.data?.status === 'success') {
          // Update local state
          const notif = notifications.value.find(n => n._id === notifId)
          if (notif) {
            notif.read = true
            notif.isRead = true
          }
          // Update unread count from server response
          if (response.data?.data?.unreadCount !== undefined) {
            unreadCount.value = response.data.data.unreadCount
          } else {
            unreadCount.value = notifications.value.filter(n => !n.read && !n.isRead).length
          }
        }
      } catch (err) {
        console.error('Error marking as read:', err)
        // Fallback to local update
        const notif = notifications.value.find(n => n._id === notifId)
        if (notif) {
          notif.read = true
          notif.isRead = true
        }
        unreadCount.value = notifications.value.filter(n => !n.read && !n.isRead).length
      }
    }

    const markAllAsRead = async () => {
      try {
        const response = await api.put('/notifications/mark-all-read')
        if (response.data?.status === 'success') {
          // Update local state
          notifications.value.forEach(n => {
            n.read = true
            n.isRead = true
          })
          unreadCount.value = 0
        }
      } catch (err) {
        console.error('Error marking all as read:', err)
      }
    }

    const getNotificationIcon = (action) => {
      const icons = {
        'LOGIN': { icon: 'bi-box-arrow-in-right', bgClass: 'bg-success text-white' },
        'LOGOUT': { icon: 'bi-box-arrow-right', bgClass: 'bg-secondary text-white' },
        'USER_CREATED': { icon: 'bi-person-plus-fill', bgClass: 'bg-primary text-white' },
        'PARCEL_CREATED': { icon: 'bi-map', bgClass: 'bg-warning text-dark' },
        'PARCEL_ASSIGNED': { icon: 'bi-gift', bgClass: 'bg-primary text-white' },
        'TRANSFER_INITIATED': { icon: 'bi-arrow-left-right', bgClass: 'bg-info text-white' },
        'TRANSFER_APPROVED': { icon: 'bi-check-circle-fill', bgClass: 'bg-success text-white' },
        'TRANSFER_REJECTED': { icon: 'bi-x-circle-fill', bgClass: 'bg-danger text-white' },
        'DOCUMENT_UPLOADED': { icon: 'bi-file-earmark-arrow-up', bgClass: 'bg-primary text-white' },
        'PASSWORD_CHANGED': { icon: 'bi-key-fill', bgClass: 'bg-warning text-dark' },
        'PASSWORD_RESET': { icon: 'bi-shield-lock-fill', bgClass: 'bg-danger text-white' },
        'SUPPORT_REQUEST': { icon: 'bi-envelope-exclamation', bgClass: 'bg-danger text-white' },
        'SUPPORT_REQUEST_SUBMITTED': { icon: 'bi-envelope-check', bgClass: 'bg-success text-white' },
        'PLACEHOLDER_UPGRADED': { icon: 'bi-person-check-fill', bgClass: 'bg-success text-white' }
      }
      return icons[action] || { icon: 'bi-info-circle-fill', bgClass: 'bg-light text-dark' }
    }

    const getNotificationTitle = (action) => {
      const titles = {
        'LOGIN': 'Login Activity',
        'LOGOUT': 'Logout Activity',
        'USER_CREATED': 'New User Registered',
        'PARCEL_CREATED': 'New Parcel Added',
        'PARCEL_ASSIGNED': 'Land Parcel Assigned',
        'TRANSFER_INITIATED': 'Transfer Initiated',
        'TRANSFER_APPROVED': 'Transfer Approved',
        'TRANSFER_REJECTED': 'Transfer Rejected',
        'DOCUMENT_UPLOADED': 'Document Uploaded',
        'PASSWORD_CHANGED': 'Password Changed',
        'PASSWORD_RESET': 'Password Reset',
        'SUPPORT_REQUEST': 'Support Request Received',
        'SUPPORT_REQUEST_SUBMITTED': 'Support Request Submitted',
        'PLACEHOLDER_UPGRADED': 'Account Activated'
      }
      return titles[action] || 'System Activity'
    }

    const handleNotificationClick = async (notif) => {
      // Mark as read first
      await markAsRead(notif._id)
      
      // Close dropdown
      const dropdown = document.querySelector('.dropdown-menu.show')
      if (dropdown) {
        dropdown.classList.remove('show')
      }
      
      // Navigate based on notification type
      const notifType = notif.type || notif.action
      
      if (notifType === 'TRANSFER_INITIATED' || notifType === 'TRANSFER_APPROVED' || notifType === 'TRANSFER_REJECTED') {
        // For land owners, go to my transfers
        if (isLandOwner.value) {
          router.push('/my-transfers')
        } else {
          // For admins/officers, go to transfers page
          router.push('/transfers')
        }
      } else if (notifType === 'DOCUMENT_UPLOADED') {
        // Navigate to documents page
        if (isLandOwner.value) {
          router.push('/my-documents')
        } else {
          router.push('/documents')
        }
      } else if (notifType === 'PARCEL_CREATED' || notifType === 'PARCEL_ASSIGNED') {
        // Navigate to parcels page
        if (isLandOwner.value) {
          router.push('/my-parcels')
        } else {
          router.push('/parcels')
        }
      }
      // For other types, just mark as read without navigation
    }

    const formatTime = (date) => {
      if (!date) return ''
      const now = new Date()
      const then = new Date(date)
      const diffMs = now - then
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)

      if (diffMins < 1) return 'Just now'
      if (diffMins < 60) return `${diffMins}m ago`
      if (diffHours < 24) return `${diffHours}h ago`
      if (diffDays < 7) return `${diffDays}d ago`
      return then.toLocaleDateString()
    }

    const formatRole = (role) => {
      if (!role) return 'Public User'
      return role.replace('_', ' ')
    }

    const currentDate = computed(() => {
      const now = new Date()
      return now.toLocaleDateString('en-KE', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    })

    const currentTime = ref('')
    
    const updateTime = () => {
      const now = new Date()
      currentTime.value = now.toLocaleTimeString('en-KE', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      })
    }

    const handleLogout = async () => {
      await authStore.logout()
      router.push({ name: 'Login' })
    }

    onMounted(() => {
      if (user.value) {
        fetchNotifications()
        // Refresh notifications every 30 seconds
        setInterval(fetchNotifications, 30000)
      }
      
      // Update time immediately and then every second
      updateTime()
      setInterval(updateTime, 1000)
    })

    return {
      user,
      userInitials,
      isLandOfficer,
      isAdministrator,
      isLandOwner,
      dashboardRoute,
      notifications,
      unreadCount,
      loading,
      formatRole,
      currentDate,
      currentTime,
      handleLogout,
      markAsRead,
      markAllAsRead,
      getNotificationIcon,
      getNotificationTitle,
      handleNotificationClick,
      formatTime
    }
  }
}
</script>

<style scoped>
.nav-section {
  display: flex;
  flex-direction: column;
}

/* Land Owner Sidebar Styling - White & Black Theme */
.sidebar-land-owner {
  background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%) !important;
  border-right: 3px solid #212529 !important;
  box-shadow: 2px 0 15px rgba(0, 0, 0, 0.1);
}

.sidebar-land-owner .sidebar-brand {
  background: linear-gradient(135deg, #212529 0%, #343a40 100%);
  padding: 1.25rem;
  border-radius: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.3);
  border: 2px solid #495057;
}

.sidebar-land-owner .sidebar-brand .sidebar-logo-icon {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.2);
}

.sidebar-land-owner .sidebar-brand .sidebar-logo-icon i {
  color: #ffffff !important;
}

.sidebar-land-owner .sidebar-brand .fw-bold {
  color: #ffffff !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  font-weight: 800 !important;
}

.sidebar-land-owner .sidebar-brand small {
  color: #ffffff !important;
  font-weight: 700 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.sidebar-land-owner .nav-section {
  padding: 0 0.75rem;
}

.sidebar-land-owner .text-uppercase {
  color: #495057 !important;
  font-weight: 700 !important;
  font-size: 0.7rem !important;
  letter-spacing: 1.2px;
}

.sidebar-land-owner .sidebar-nav-item {
  margin-bottom: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  background: #ffffff;
  color: #212529;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.sidebar-land-owner .sidebar-nav-item:hover {
  background: linear-gradient(135deg, #212529 0%, #343a40 100%);
  color: #ffffff !important;
  transform: translateX(8px) scale(1.03);
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.3);
  border-color: #495057;
}

.sidebar-land-owner .sidebar-nav-item:hover i {
  color: #ffffff !important;
  transform: scale(1.15) rotate(5deg);
}

.sidebar-land-owner .sidebar-nav-item.active {
  background: linear-gradient(135deg, #212529 0%, #343a40 100%);
  color: #ffffff !important;
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.4);
  border-color: #495057;
  transform: translateX(8px);
}

.sidebar-land-owner .sidebar-nav-item.active i {
  color: #ffffff !important;
  animation: pulse 2s infinite;
}

.sidebar-land-owner .sidebar-nav-item i {
  transition: all 0.3s ease;
  font-size: 1.1rem;
  color: #212529;
}

.sidebar-land-owner .btn-pill {
  border-radius: 50rem !important;
  padding: 0.625rem 1.25rem;
  font-weight: 700;
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.2);
  border: 2px solid #212529;
  background: linear-gradient(135deg, #212529 0%, #343a40 100%);
  color: #ffffff;
  transition: all 0.3s ease;
}

.sidebar-land-owner .btn-pill:hover {
  transform: translateY(-3px);
  box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, 0.3);
  border-color: #495057;
}

.sidebar-land-owner .sidebar-user-card {
  background: linear-gradient(135deg, #212529 0%, #343a40 100%);
  border: 3px solid #495057;
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.3);
  padding: 1.25rem;
  border-radius: 1rem;
}

.sidebar-land-owner .sidebar-user-card .avatar-circle {
  background: rgba(255, 255, 255, 0.2) !important;
  color: #ffffff !important;
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.2);
  font-weight: 800;
}

.sidebar-land-owner .sidebar-user-card .fw-bold {
  color: #ffffff !important;
  font-size: 0.9rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  font-weight: 700;
}

.sidebar-land-owner .sidebar-user-card .text-muted {
  color: #ffffff !important;
  opacity: 0.9;
  font-size: 0.75rem;
  font-weight: 600;
}

.sidebar-land-owner .sidebar-user-card button {
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.25);
  color: #ffffff;
  font-weight: 700;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
}

.sidebar-land-owner .sidebar-user-card button:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.3);
}

.sidebar-land-owner .badge {
  background: rgba(0, 0, 0, 0.15);
  color: #212529;
  border: 2px solid rgba(0, 0, 0, 0.2);
  font-weight: 700;
  padding: 0.35rem 0.75rem;
}

/* Animation */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

/* Smooth scrollbar for Land Owner sidebar */
.sidebar-land-owner::-webkit-scrollbar {
  width: 6px;
}

.sidebar-land-owner::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}

.sidebar-land-owner::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #212529 0%, #343a40 100%);
  border-radius: 10px;
}

.sidebar-land-owner::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #343a40 0%, #495057 100%);
}

/* Glow effect for active items */
.sidebar-land-owner .sidebar-nav-item.active::before {
  content: '';
  position: absolute;
  left: -3px;
  top: 50%;
  transform: translateY(-50%);
  width: 5px;
  height: 70%;
  background: linear-gradient(135deg, #212529 0%, #343a40 100%);
  border-radius: 0 4px 4px 0;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
}

/* Subtle white/gray background for non-active items */
.sidebar-land-owner .sidebar-nav-item:not(.active):not(:hover) {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
}
</style>
