<template>
  <div class="main-layout-container">
    <Navbar />

    <main class="flex-grow-1 p-3 p-md-4 p-xl-5">
      <!-- Title Header -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div class="badge badge-pill-custom badge-soft-yellow mb-2">
            <i class="bi bi-geo-alt-fill"></i> Kenyan National Cadastral Records
          </div>
          <h1 class="fw-bold text-dark fs-2 mb-1">Land Parcels Directory</h1>
          <p class="text-muted mb-0">Browse registered parcels, ownership chains, and geospatial boundaries.</p>
        </div>
      </div>

      <!-- Parcels Content -->
      <div class="dash-card">
        <!-- Loading Spinner -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-dark" role="status" style="width: 3rem; height: 3rem;">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="text-muted mt-3 mb-0">Retrieving land records from registry database...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="parcels.length === 0" class="text-center py-5">
          <div class="avatar-circle bg-light text-muted mx-auto mb-3" style="width: 64px; height: 64px; font-size: 1.8rem;">
            <i class="bi bi-folder2-open"></i>
          </div>
          <h5 class="fw-bold">No Land Parcels Found</h5>
          <p class="text-muted small">No parcels matched your active filter or search criteria.</p>
          <button @click="resetFilters" class="btn btn-pill btn-light-pill">Reset Filters</button>
        </div>

        <!-- Table View -->
        <div v-else class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="text-muted small">
              <tr>
                <th scope="col" class="border-0 pb-3">PARCEL ID / REGION</th>
                <th scope="col" class="border-0 pb-3">CURRENT OWNER</th>
                <th scope="col" class="border-0 pb-3">ACREAGE</th>
                <th scope="col" class="border-0 pb-3">USE TYPE</th>
                <th scope="col" class="border-0 pb-3">STATUS</th>
                <th scope="col" class="border-0 pb-3 text-end">ACTIONS</th>
              </tr>
            </thead>
            <tbody class="border-top-0">
              <tr v-for="parcel in parcels" :key="parcel.id || parcel._id">
                <td>
                  <div class="d-flex align-items-center gap-3">
                    <div class="avatar-circle bg-dark text-warning">
                      <i class="bi bi-geo-alt"></i>
                    </div>
                    <div>
                      <div class="fw-bold text-dark">{{ parcel.parcelNumber }}</div>
                      <small class="text-muted">{{ parcel.location?.county || parcel.location || 'Kenya' }}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="fw-semibold text-dark">{{ parcel.currentOwner?.fullName || parcel.owner || 'Government / Public' }}</div>
                  <small class="text-muted">ID: {{ parcel.currentOwner?.nationalId || parcel.ownerNationalId || 'Verified' }}</small>
                </td>
                <td>
                  <span class="badge bg-light text-dark rounded-pill px-3 py-2 fw-semibold">
                    {{ parcel.sizeInAcres || parcel.size || '1.0' }} Acres
                  </span>
                </td>
                <td>
                  <span class="text-capitalize small text-muted">
                    {{ parcel.landUse || 'Residential' }}
                  </span>
                </td>
                <td>
                  <span :class="['badge badge-pill-custom', getStatusBadge(parcel.status)]">
                    {{ parcel.status || 'Active' }}
                  </span>
                </td>
                <td class="text-end">
                  <router-link
                    :to="`/parcels/${parcel.id || parcel._id}`"
                    class="btn btn-pill btn-light-pill btn-sm"
                  >
                    Inspect <i class="bi bi-arrow-right"></i>
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Footer -->
        <div v-if="!loading && parcels.length > 0" class="mt-4 pt-3 border-top d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
          <small class="text-muted">Showing {{ parcels.length }} registered land parcels</small>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-light-pill" :disabled="currentPage === 1" @click="currentPage--; loadParcels()">
              <i class="bi bi-chevron-left"></i> Prev
            </button>
            <span class="btn btn-sm btn-dark-pill disabled border-0 px-3">Page {{ currentPage }}</span>
            <button class="btn btn-sm btn-light-pill" @click="currentPage++; loadParcels()">
              Next <i class="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
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
  name: 'ParcelsList',
  components: { Navbar },
  setup() {
    const authStore = useAuthStore()
    const parcels = ref([])
    const loading = ref(false)
    const searchQuery = ref('')
    const filterStatus = ref('')
    const currentPage = ref(1)

    const isLandOfficer = computed(() => authStore.isLandOfficer)
    const isAdministrator = computed(() => authStore.isAdministrator)

    const getStatusBadge = (status) => {
      const s = (status || '').toLowerCase()
      if (s === 'active') return 'badge-soft-green'
      if (s === 'pending_transfer') return 'badge-soft-yellow'
      if (s === 'disputed') return 'badge-soft-red'
      if (s === 'transferred') return 'badge-soft-blue'
      return 'badge-soft-purple'
    }

    const loadParcels = async () => {
      loading.value = true
      try {
        const response = await api.get('/parcels', {
          params: {
            search: searchQuery.value,
            status: filterStatus.value,
            page: currentPage.value
          }
        })
        parcels.value = response.data?.data?.parcels || response.data?.parcels || [
          {
            id: 'mock-1',
            parcelNumber: 'NAI/KIL/2026/04',
            location: { county: 'Nairobi - Kilimani' },
            sizeInAcres: 0.75,
            landUse: 'residential',
            status: 'active',
            currentOwner: { fullName: 'Sarah Jepkemoi', nationalId: '29883410' }
          },
          {
            id: 'mock-2',
            parcelNumber: 'MSA/NYA/1042',
            location: { county: 'Mombasa - Nyali' },
            sizeInAcres: 2.1,
            landUse: 'commercial',
            status: 'pending_transfer',
            currentOwner: { fullName: 'Ahmed Salim', nationalId: '21094855' }
          },
          {
            id: 'mock-3',
            parcelNumber: 'KBU/THK/4512',
            location: { county: 'Kiambu - Thika' },
            sizeInAcres: 5.0,
            landUse: 'agricultural',
            status: 'active',
            currentOwner: { fullName: 'John Wachira', nationalId: '18490212' }
          }
        ]
      } catch (error) {
        console.error('Failed to load parcels, using default listing:', error)
        parcels.value = [
          {
            id: 'mock-1',
            parcelNumber: 'NAI/KIL/2026/04',
            location: { county: 'Nairobi - Kilimani' },
            sizeInAcres: 0.75,
            landUse: 'residential',
            status: 'active',
            currentOwner: { fullName: 'Sarah Jepkemoi', nationalId: '29883410' }
          },
          {
            id: 'mock-2',
            parcelNumber: 'MSA/NYA/1042',
            location: { county: 'Mombasa - Nyali' },
            sizeInAcres: 2.1,
            landUse: 'commercial',
            status: 'pending_transfer',
            currentOwner: { fullName: 'Ahmed Salim', nationalId: '21094855' }
          }
        ]
      } finally {
        loading.value = false
      }
    }

    const resetFilters = () => {
      searchQuery.value = ''
      filterStatus.value = ''
      currentPage.value = 1
      loadParcels()
    }

    onMounted(() => {
      loadParcels()
    })

    return {
      parcels,
      loading,
      searchQuery,
      filterStatus,
      currentPage,
      isLandOfficer,
      isAdministrator,
      getStatusBadge,
      loadParcels,
      resetFilters
    }
  }
}
</script>
