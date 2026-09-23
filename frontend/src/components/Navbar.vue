<template>
  <div>
    <!-- Left Sidebar Matching Dribbble Shot -->
    <aside class="sidebar-wrapper d-none d-lg-flex">
      <div>
        <!-- Brand / Logo -->
        <router-link 
          to="/admindashboard" 
          class="sidebar-brand text-decoration-none"
        >
          <div class="sidebar-logo-icon">
            <i class="bi bi-geo-alt-fill text-warning"></i>
          </div>
          <div>
            <div class="fw-bold fs-5 text-dark lh-1">LandRegistry</div>
            <small class="text-muted" style="font-size: 0.72rem; letter-spacing: 0.5px;">KENYA NATIONAL PORTAL</small>
          </div>
        </router-link>

        <!-- Main Navigation Links -->
        <div class="nav-section mb-4">
          <div class="text-uppercase text-muted fw-bold px-3 mb-2" style="font-size: 0.68rem; letter-spacing: 1px;">
            Main Menu
          </div>

          <router-link 
            to="/admindashboard" 
            class="sidebar-nav-item text-decoration-none" 
            active-class="active"
          >
            <i class="bi bi-grid-fill"></i>
            <span>Dashboard</span>
          </router-link>

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
        </div>

        <!-- Management Section -->
        <div class="nav-section">
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
            to="/settings"
            class="sidebar-nav-item text-decoration-none"
            active-class="active"
          >
            <i class="bi bi-gear-fill"></i>
            <span>System Settings</span>
          </router-link>

          <router-link to="/profile" class="sidebar-nav-item text-decoration-none" active-class="active">
            <i class="bi bi-person-gear"></i>
            <span>My Profile</span>
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
          to="/admindashboard" 
          class="d-lg-none d-flex align-items-center gap-2 text-decoration-none"
        >
          <div class="sidebar-logo-icon" style="width: 36px; height: 36px; font-size: 1.1rem;">
            <i class="bi bi-geo-alt-fill text-warning"></i>
          </div>
          <span class="fw-bold text-dark">LandRegistry</span>
        </router-link>

        <!-- Welcome Message -->
        <div class="d-none d-lg-block ms-4">
          <div class="d-flex align-items-center gap-2">
            <span class="badge badge-pill-custom badge-soft-yellow">
              <i class="bi bi-shield-check-fill"></i>
              Kenya National Portal
            </span>
          </div>
          <p class="text-muted small mb-0 mt-1">
            <i class="bi bi-calendar3"></i>
            {{ currentDate }}
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
                :class="['dropdown-item-text', notif.read ? '' : 'bg-primary-subtle']"
                style="cursor: pointer;"
                @click="markAsRead(notif._id)">
              <div class="d-flex gap-3 py-2 px-3">
                <div :class="['avatar-circle flex-shrink-0', getNotificationIcon(notif.action).bgClass]" style="width: 40px; height: 40px;">
                  <i :class="['bi', getNotificationIcon(notif.action).icon]"></i>
                </div>
                <div class="flex-grow-1">
                  <div class="d-flex justify-content-between align-items-start mb-1">
                    <strong class="small">{{ getNotificationTitle(notif.action) }}</strong>
                    <small class="text-muted">{{ formatTime(notif.createdAt) }}</small>
                  </div>
                  <p class="small text-muted mb-0">{{ notif.description }}</p>
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
            <li>
              <router-link to="/verify" class="dropdown-item rounded-3 py-2">
                <i class="bi bi-patch-check me-2"></i> Verify Deed
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
        // Fetch from audit logs
        const response = await api.get('/audit-logs?limit=20')
        if (response.data?.data?.logs) {
          notifications.value = response.data.data.logs.map(log => ({
            _id: log._id,
            action: log.action,
            description: log.description,
            entityType: log.entityType,
            createdAt: log.createdAt,
            read: false // You can add a read field to your audit log model
          }))
          
          // Count unread (for now, all are unread - you can enhance this)
          unreadCount.value = notifications.value.filter(n => !n.read).length
        }
      } catch (err) {
        console.error('Error fetching notifications:', err)
      } finally {
        loading.value = false
      }
    }

    const markAsRead = (notifId) => {
      const notif = notifications.value.find(n => n._id === notifId)
      if (notif) {
        notif.read = true
        unreadCount.value = notifications.value.filter(n => !n.read).length
      }
    }

    const markAllAsRead = () => {
      notifications.value.forEach(n => n.read = true)
      unreadCount.value = 0
    }

    const getNotificationIcon = (action) => {
      const icons = {
        'LOGIN': { icon: 'bi-box-arrow-in-right', bgClass: 'bg-success text-white' },
        'LOGOUT': { icon: 'bi-box-arrow-right', bgClass: 'bg-secondary text-white' },
        'USER_CREATED': { icon: 'bi-person-plus-fill', bgClass: 'bg-primary text-white' },
        'PARCEL_CREATED': { icon: 'bi-map', bgClass: 'bg-warning text-dark' },
        'TRANSFER_INITIATED': { icon: 'bi-arrow-left-right', bgClass: 'bg-info text-white' },
        'TRANSFER_APPROVED': { icon: 'bi-check-circle-fill', bgClass: 'bg-success text-white' },
        'TRANSFER_REJECTED': { icon: 'bi-x-circle-fill', bgClass: 'bg-danger text-white' },
        'DOCUMENT_UPLOADED': { icon: 'bi-file-earmark-arrow-up', bgClass: 'bg-primary text-white' },
        'PASSWORD_CHANGED': { icon: 'bi-key-fill', bgClass: 'bg-warning text-dark' },
        'PASSWORD_RESET': { icon: 'bi-shield-lock-fill', bgClass: 'bg-danger text-white' }
      }
      return icons[action] || { icon: 'bi-info-circle-fill', bgClass: 'bg-light text-dark' }
    }

    const getNotificationTitle = (action) => {
      const titles = {
        'LOGIN': 'Login Activity',
        'LOGOUT': 'Logout Activity',
        'USER_CREATED': 'New User Registered',
        'PARCEL_CREATED': 'New Parcel Added',
        'TRANSFER_INITIATED': 'Transfer Initiated',
        'TRANSFER_APPROVED': 'Transfer Approved',
        'TRANSFER_REJECTED': 'Transfer Rejected',
        'DOCUMENT_UPLOADED': 'Document Uploaded',
        'PASSWORD_CHANGED': 'Password Changed',
        'PASSWORD_RESET': 'Password Reset'
      }
      return titles[action] || 'System Activity'
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
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    })

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
    })

    return {
      user,
      userInitials,
      isLandOfficer,
      isAdministrator,
      notifications,
      unreadCount,
      loading,
      formatRole,
      currentDate,
      handleLogout,
      markAsRead,
      markAllAsRead,
      getNotificationIcon,
      getNotificationTitle,
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
</style>
