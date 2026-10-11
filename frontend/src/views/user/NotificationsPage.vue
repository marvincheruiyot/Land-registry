<template>
  <div class="main-layout-container">
    <Navbar />

    <main class="flex-grow-1 p-3 p-md-4 p-xl-5">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <span class="badge badge-pill-custom badge-soft-blue mb-2">
            <i class="bi bi-bell"></i> Notification Center
          </span>
          <h1 class="fw-bold text-dark fs-2 mb-1">Notifications</h1>
          <p class="text-muted mb-0">Stay updated on your land parcels, transfers, and system activities</p>
        </div>
        <div class="d-flex gap-2">
          <button v-if="unreadCount > 0" @click="markAllAsRead" class="btn btn-pill btn-light-pill">
            <i class="bi bi-check-all me-1"></i> Mark All Read
          </button>
          <button @click="fetchNotifications" class="btn btn-pill btn-light-pill" :disabled="loading">
            <i class="bi bi-arrow-clockwise" :class="{ 'spin': loading }"></i>
          </button>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="dash-card mb-4">
        <div class="d-flex gap-2 flex-wrap">
          <button 
            @click="filterType = 'all'" 
            :class="['btn btn-pill btn-sm', filterType === 'all' ? 'btn-dark-pill' : 'btn-light-pill']"
          >
            All ({{ notifications.length }})
          </button>
          <button 
            @click="filterType = 'unread'" 
            :class="['btn btn-pill btn-sm', filterType === 'unread' ? 'btn-dark-pill' : 'btn-light-pill']"
          >
            Unread ({{ unreadCount }})
          </button>
          <button 
            @click="filterType = 'parcel'" 
            :class="['btn btn-pill btn-sm', filterType === 'parcel' ? 'btn-dark-pill' : 'btn-light-pill']"
          >
            <i class="bi bi-map"></i> Land Parcels
          </button>
          <button 
            @click="filterType = 'transfer'" 
            :class="['btn btn-pill btn-sm', filterType === 'transfer' ? 'btn-dark-pill' : 'btn-light-pill']"
          >
            <i class="bi bi-arrow-left-right"></i> Transfers
          </button>
          <button 
            @click="filterType = 'document'" 
            :class="['btn btn-pill btn-sm', filterType === 'document' ? 'btn-dark-pill' : 'btn-light-pill']"
          >
            <i class="bi bi-file-earmark"></i> Documents
          </button>
        </div>
      </div>

      <!-- Notifications List -->
      <div v-if="loading && notifications.length === 0" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-muted mt-2">Loading notifications...</p>
      </div>

      <div v-else-if="filteredNotifications.length === 0" class="dash-card text-center py-5">
        <i class="bi bi-bell-slash fs-1 text-muted mb-3 d-block"></i>
        <h5 class="text-muted">No notifications found</h5>
        <p class="text-muted small">You're all caught up!</p>
      </div>

      <div v-else class="notifications-list">
        <div 
          v-for="notification in filteredNotifications" 
          :key="notification._id"
          :class="['notification-item dash-card mb-3', { 'unread': !notification.read }]"
          @click="markAsRead(notification._id)"
          style="cursor: pointer;"
        >
          <div class="d-flex gap-3">
            <div :class="['avatar-circle flex-shrink-0', getNotificationIcon(notification.action).bgClass]" style="width: 48px; height: 48px;">
              <i :class="['bi', getNotificationIcon(notification.action).icon]"></i>
            </div>
            <div class="flex-grow-1">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h6 class="fw-bold mb-1">{{ getNotificationTitle(notification.action) }}</h6>
                  <p class="text-muted small mb-0">{{ notification.description }}</p>
                </div>
                <div class="text-end">
                  <small class="text-muted">{{ formatTime(notification.createdAt) }}</small>
                  <span v-if="!notification.read" class="badge bg-primary rounded-pill ms-2">New</span>
                </div>
              </div>
              <div class="d-flex gap-2 align-items-center">
                <span v-if="notification.entityType" class="badge bg-light text-dark small">{{ notification.entityType }}</span>
                <small class="text-muted">{{ formatDate(notification.createdAt) }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="filteredNotifications.length > 0 && filteredNotifications.length >= 20" class="text-center mt-4">
        <button class="btn btn-pill btn-light-pill">
          <i class="bi bi-arrow-down-circle me-1"></i> Load More
        </button>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'
import api from '@/services/api'

export default {
  name: 'NotificationsPage',
  components: { Navbar },
  setup() {
    const authStore = useAuthStore()
    const user = computed(() => authStore.user)

    const notifications = ref([])
    const loading = ref(false)
    const filterType = ref('all')

    const unreadCount = computed(() => {
      return notifications.value.filter(n => !n.read).length
    })

    const filteredNotifications = computed(() => {
      let filtered = notifications.value

      if (filterType.value === 'unread') {
        filtered = filtered.filter(n => !n.read)
      } else if (filterType.value !== 'all') {
        filtered = filtered.filter(n => {
          const action = n.action?.toLowerCase() || ''
          return action.includes(filterType.value)
        })
      }

      return filtered
    })

    const fetchNotifications = async () => {
      loading.value = true
      try {
        // Fetch only notifications for the current user
        const response = await api.get(`/audit-logs?user=${user.value.id}&limit=50`)
        if (response.data?.data?.logs) {
          // Map audit logs to notifications - only logs where user is the subject
          notifications.value = response.data.data.logs
            .filter(log => {
              // Only show logs that are about this user or directed to this user
              return log.user && (log.user._id === user.value.id || log.user === user.value.id)
            })
            .map(log => ({
              _id: log._id,
              action: log.action,
              description: log.description || log.details || 'System activity',
              entityType: log.entityType || log.resourceType,
              createdAt: log.createdAt,
              read: getReadStatus(log._id)
            }))

          // Sort by date (newest first)
          notifications.value.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        }
      } catch (err) {
        console.error('Error fetching notifications:', err)
        // If the API doesn't support user filtering, try getting all and filter client-side
        try {
          const response = await api.get('/audit-logs?limit=50')
          if (response.data?.data?.logs) {
            notifications.value = response.data.data.logs
              .filter(log => {
                // Filter to only show notifications where the current user is the subject
                return log.user && (log.user._id === user.value.id || log.user === user.value.id)
              })
              .map(log => ({
                _id: log._id,
                action: log.action,
                description: log.description || log.details || 'System activity',
                entityType: log.entityType || log.resourceType,
                createdAt: log.createdAt,
                read: getReadStatus(log._id)
              }))
            
            notifications.value.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          }
        } catch (fallbackErr) {
          console.error('Fallback error:', fallbackErr)
        }
      } finally {
        loading.value = false
      }
    }

    const getReadStatus = (notifId) => {
      const readNotifs = JSON.parse(localStorage.getItem('readNotifications') || '[]')
      return readNotifs.includes(notifId)
    }

    const markAsRead = (notifId) => {
      const notification = notifications.value.find(n => n._id === notifId)
      if (notification && !notification.read) {
        notification.read = true
        
        // Save to localStorage
        const readNotifs = JSON.parse(localStorage.getItem('readNotifications') || '[]')
        if (!readNotifs.includes(notifId)) {
          readNotifs.push(notifId)
          localStorage.setItem('readNotifications', JSON.stringify(readNotifs))
        }
      }
    }

    const markAllAsRead = () => {
      const allIds = notifications.value.map(n => n._id)
      localStorage.setItem('readNotifications', JSON.stringify(allIds))
      notifications.value.forEach(n => n.read = true)
    }

    const getNotificationIcon = (action) => {
      const icons = {
        'CREATE_PARCEL': { icon: 'bi-map', bgClass: 'bg-success text-white' },
        'PARCEL_CREATED': { icon: 'bi-map', bgClass: 'bg-success text-white' },
        'PARCEL_ASSIGNED': { icon: 'bi-gift', bgClass: 'bg-primary text-white' },
        'TRANSFER_INITIATED': { icon: 'bi-arrow-left-right', bgClass: 'bg-warning text-dark' },
        'TRANSFER_APPROVED': { icon: 'bi-check-circle-fill', bgClass: 'bg-success text-white' },
        'TRANSFER_REJECTED': { icon: 'bi-x-circle-fill', bgClass: 'bg-danger text-white' },
        'TRANSFER_COMPLETED': { icon: 'bi-check-circle-fill', bgClass: 'bg-success text-white' },
        'DOCUMENT_UPLOADED': { icon: 'bi-file-earmark-arrow-up', bgClass: 'bg-primary text-white' },
        'USER_CREATED': { icon: 'bi-person-plus-fill', bgClass: 'bg-info text-white' },
        'PASSWORD_CHANGED': { icon: 'bi-key-fill', bgClass: 'bg-warning text-dark' },
        'PLACEHOLDER_UPGRADED': { icon: 'bi-person-check-fill', bgClass: 'bg-success text-white' },
        'SUPPORT_REQUEST': { icon: 'bi-envelope-exclamation', bgClass: 'bg-danger text-white' },
        'SUPPORT_REQUEST_SUBMITTED': { icon: 'bi-envelope-check', bgClass: 'bg-success text-white' }
      }
      return icons[action] || { icon: 'bi-info-circle-fill', bgClass: 'bg-light text-dark' }
    }

    const getNotificationTitle = (action) => {
      const titles = {
        'CREATE_PARCEL': 'New Parcel Registered',
        'PARCEL_CREATED': 'Land Parcel Created',
        'PARCEL_ASSIGNED': 'Land Parcel Assigned to You',
        'TRANSFER_INITIATED': 'Transfer Request Submitted',
        'TRANSFER_APPROVED': 'Transfer Approved',
        'TRANSFER_REJECTED': 'Transfer Rejected',
        'TRANSFER_COMPLETED': 'Transfer Completed',
        'DOCUMENT_UPLOADED': 'Document Uploaded',
        'USER_CREATED': 'Account Created',
        'PASSWORD_CHANGED': 'Password Changed',
        'PLACEHOLDER_UPGRADED': 'Account Activated',
        'SUPPORT_REQUEST': 'Support Request Received',
        'SUPPORT_REQUEST_SUBMITTED': 'Support Request Submitted'
      }
      return titles[action] || 'System Notification'
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
      return formatDate(date)
    }

    const formatDate = (date) => {
      if (!date) return ''
      const d = new Date(date)
      return d.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    onMounted(() => {
      fetchNotifications()
    })

    return {
      notifications,
      loading,
      filterType,
      unreadCount,
      filteredNotifications,
      fetchNotifications,
      markAsRead,
      markAllAsRead,
      getNotificationIcon,
      getNotificationTitle,
      formatTime,
      formatDate
    }
  }
}
</script>

<style scoped>
.notification-item {
  transition: all 0.2s ease;
}

.notification-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.notification-item.unread {
  border-left: 4px solid #4F46E5;
  background: linear-gradient(to right, #EEF2FF, #ffffff);
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
