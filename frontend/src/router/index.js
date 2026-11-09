import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomePage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/RegisterPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/verify-email/:token',
    name: 'VerifyEmail',
    component: () => import('@/views/auth/VerifyEmail.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/auth/ForgotPassword.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/reset-password/:token',
    name: 'ResetPassword',
    component: () => import('@/views/auth/ResetPassword.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/verify',
    name: 'Verify',
    component: () => import('@/views/VerificationPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/map',
    name: 'MapView',
    component: () => import('@/views/MapView.vue'),
    meta: { requiresAuth: true, roles: ['Land_Officer', 'Administrator'] }
  },
  {
    path: '/admindashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardPage.vue'),
    meta: { requiresAuth: true, roles: ['Administrator'] }
  },
  {
    path: '/userdashboard',
    name: 'UserDashboard',
    component: () => import('@/views/user/UserDashboard.vue'),
    meta: { requiresAuth: true, roles: ['Land_Owner'] }
  },
  {
    path: '/my-parcels',
    name: 'MyParcels',
    component: () => import('@/views/user/MyParcels.vue'),
    meta: { requiresAuth: true, roles: ['Land_Owner'] }
  },
  {
    path: '/my-transfers',
    name: 'MyTransfers',
    component: () => import('@/views/user/MyTransfers.vue'),
    meta: { requiresAuth: true, roles: ['Land_Owner'] }
  },
  {
    path: '/transfer-history',
    name: 'TransferHistory',
    component: () => import('@/views/user/TransferHistory.vue'),
    meta: { requiresAuth: true, roles: ['Land_Owner'] }
  },
  {
    path: '/user-settings',
    name: 'UserSettings',
    component: () => import('@/views/user/UserSettings.vue'),
    meta: { requiresAuth: true, roles: ['Land_Owner'] }
  },
  {
    path: '/my-documents',
    name: 'MyDocuments',
    component: () => import('@/views/user/MyDocuments.vue'),
    meta: { requiresAuth: true, roles: ['Land_Owner'] }
  },
  {
    path: '/help',
    name: 'HelpSupport',
    component: () => import('@/views/user/HelpSupport.vue'),
    meta: { requiresAuth: true, roles: ['Land_Owner'] }
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: () => import('@/views/user/NotificationsPage.vue'),
    meta: { requiresAuth: true, roles: ['Land_Owner'] }
  },
  {
    path: '/officer',
    name: 'OfficerDashboard',
    component: () => import('@/views/officer/OfficerDashboard.vue'),
    meta: { requiresAuth: true, roles: ['Land_Officer', 'Administrator'] }
  },
  {
    path: '/parcels',
    name: 'Parcels',
    component: () => import('@/views/parcels/ParcelsList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/parcels/create',
    name: 'CreateParcel',
    component: () => import('@/views/parcels/CreateParcel.vue'),
    meta: { requiresAuth: true, roles: ['Land_Officer', 'Administrator'] }
  },
  {
    path: '/parcels/:id',
    name: 'ParcelDetails',
    component: () => import('@/views/parcels/ParcelDetails.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/transfers',
    name: 'Transfers',
    component: () => import('@/views/transfers/TransfersList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/transfers/create',
    name: 'CreateTransfer',
    component: () => import('@/views/transfers/CreateTransfer.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/documents',
    name: 'Documents',
    component: () => import('@/views/documents/DocumentsList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('@/views/reports/ReportsPage.vue'),
    meta: { requiresAuth: true, roles: ['Land_Officer', 'Administrator'] }
  },
  {
    path: '/users',
    name: 'UserManagement',
    component: () => import('@/views/admin/UserManagement.vue'),
    meta: { requiresAuth: true, roles: ['Administrator'] }
  },
  {
    path: '/audit-trail',
    name: 'AuditTrail',
    component: () => import('@/views/admin/AuditTrailPage.vue'),
    meta: { requiresAuth: true, roles: ['Administrator'] }
  },
  {
    path: '/support-tickets',
    name: 'SupportTickets',
    component: () => import('@/views/admin/SupportTicketsPage.vue'),
    meta: { requiresAuth: true, roles: ['Administrator'] }
  },
  {
    path: '/settings',
    name: 'SystemSettings',
    component: () => import('@/views/admin/SystemSettings.vue'),
    meta: { requiresAuth: true, roles: ['Administrator', 'Land_Officer'] }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfilePage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  const requiresAuth = to.meta.requiresAuth
  const isAuthenticated = authStore.isAuthenticated
  const requiredRoles = to.meta.roles

  if (requiresAuth && !isAuthenticated) {
    // Redirect to login with a return URL
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }

  // Check role-based access
  if (requiredRoles && requiredRoles.length > 0) {
    const userRole = authStore.user?.role
    if (!userRole || !requiredRoles.includes(userRole)) {
      // Redirect to appropriate dashboard based on role
      if (userRole === 'Land_Owner') {
        return next({ name: 'UserDashboard' })
      } else if (userRole === 'Land_Officer') {
        return next({ name: 'OfficerDashboard' })
      } else if (userRole === 'Administrator') {
        return next({ name: 'Dashboard' })
      } else {
        return next({ name: 'Home' })
      }
    }
  }

  // Allow access to login and register pages even when authenticated
  // Removed the auto-redirect for authenticated users

  next()
})

export default router
