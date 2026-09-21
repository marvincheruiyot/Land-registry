<template>
  <div>
    <!-- Left Sidebar Matching Dribbble Shot -->
    <aside class="sidebar-wrapper d-none d-lg-flex">
      <div>
        <!-- Brand / Logo -->
        <router-link 
          :to="isAdministrator && $route.path.startsWith('/admin') ? '/admin' : '/dashboard'" 
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
            :to="isAdministrator && $route.path.startsWith('/admin') ? '/admin' : '/dashboard'" 
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
            to="/admin"
            class="sidebar-nav-item text-decoration-none"
            active-class="active"
          >
            <i class="bi bi-shield-lock-fill"></i>
            <span>Admin Central</span>
          </router-link>

          <router-link to="/profile" class="sidebar-nav-item text-decoration-none" active-class="active">
            <i class="bi bi-person-gear"></i>
            <span>Settings</span>
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
          :to="isAdministrator && $route.path.startsWith('/admin') ? '/admin' : '/dashboard'" 
          class="d-lg-none d-flex align-items-center gap-2 text-decoration-none"
        >
          <div class="sidebar-logo-icon" style="width: 36px; height: 36px; font-size: 1.1rem;">
            <i class="bi bi-geo-alt-fill text-warning"></i>
          </div>
          <span class="fw-bold text-dark">LandRegistry</span>
        </router-link>

        <div class="position-relative d-none d-sm-block">
          <i class="bi bi-search position-absolute text-muted" style="left: 1rem; top: 50%; transform: translateY(-50%);"></i>
          <input
            type="text"
            class="search-input-pill"
            placeholder="Search parcels, owners, IDs..."
          />
        </div>
      </div>

      <!-- Right Header Actions (Quick actions, notifications, status) -->
      <div class="d-flex align-items-center gap-2 gap-md-3">
        <router-link
          v-if="isLandOfficer || isAdministrator"
          to="/parcels/create"
          class="btn btn-pill btn-yellow-pill d-none d-md-inline-flex"
        >
          <i class="bi bi-plus-lg"></i>
          <span>New Parcel</span>
        </router-link>

        <router-link
          to="/transfers/create"
          class="btn btn-pill btn-dark-pill d-none d-sm-inline-flex"
        >
          <i class="bi bi-arrow-left-right"></i>
          <span>Transfer</span>
        </router-link>

        <!-- Notification Bell -->
        <button class="btn btn-light-pill p-2 rounded-circle position-relative" style="width: 42px; height: 42px;">
          <i class="bi bi-bell-fill text-dark"></i>
          <span class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
        </button>

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
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

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

    const formatRole = (role) => {
      if (!role) return 'Public User'
      return role.replace('_', ' ')
    }

    const handleLogout = async () => {
      await authStore.logout()
      router.push({ name: 'Login' })
    }

    return {
      user,
      userInitials,
      isLandOfficer,
      isAdministrator,
      formatRole,
      handleLogout
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
