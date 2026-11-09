<template>
  <div class="main-layout-container">
    <Navbar />

    <main class="flex-grow-1 p-0">
      <!-- Map Header -->
      <div class="map-header p-3 bg-white border-bottom shadow-sm">
        <div class="container-fluid">
          <div class="row align-items-center">
            <div class="col-md-4">
              <h4 class="fw-bold mb-0">
                <i class="bi bi-map-fill text-primary me-2"></i>
                Land Parcels Map
              </h4>
              <small class="text-muted">
                {{ parcelsWithCoordinates.length }} of {{ filteredParcels.length }} parcels displayed
                <span v-if="parcelsWithoutCoordinates.length > 0" class="text-warning">
                  ({{ parcelsWithoutCoordinates.length }} without GPS)
                </span>
              </small>
            </div>
            <div class="col-md-4">
              <input 
                v-model="searchQuery" 
                type="text" 
                class="form-control" 
                placeholder="Search by parcel number, location..."
              >
            </div>
            <div class="col-md-4 text-end">
              <small class="text-muted">
                <i class="bi bi-info-circle me-1"></i>
                Powered by OpenStreetMap
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- Map Container -->
      <div id="map" ref="mapContainer" class="map-container"></div>

      <!-- Parcel Info Card (shown when parcel is selected) -->
      <div v-if="selectedParcel" class="parcel-info-card">
        <div class="card shadow-lg border-0">
          <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h6 class="mb-0">
              <i class="bi bi-geo-alt-fill me-2"></i>
              {{ selectedParcel.parcelNumber }}
            </h6>
            <button class="btn btn-sm btn-close btn-close-white" @click="selectedParcel = null"></button>
          </div>
          <div class="card-body">
            <div class="row g-2 small">
              <div class="col-6">
                <strong>Location:</strong><br>
                {{ selectedParcel.location?.county }}, {{ selectedParcel.location?.subCounty }}
              </div>
              <div class="col-6">
                <strong>Size:</strong><br>
                {{ selectedParcel.sizeInAcres }} acres
              </div>
              <div class="col-6">
                <strong>Owner:</strong><br>
                {{ selectedParcel.currentOwner?.fullName || 'N/A' }}
              </div>
              <div class="col-6">
                <strong>Status:</strong><br>
                <span :class="getStatusBadge(selectedParcel.status)">
                  {{ selectedParcel.status }}
                </span>
              </div>
              <div class="col-12" v-if="selectedParcel.location?.coordinates">
                <strong>GPS:</strong><br>
                {{ selectedParcel.location.coordinates.latitude?.toFixed(6) }}, 
                {{ selectedParcel.location.coordinates.longitude?.toFixed(6) }}
              </div>
            </div>
            <div class="mt-3">
              <router-link 
                :to="`/parcels/${selectedParcel._id || selectedParcel.id}`" 
                class="btn btn-sm btn-primary w-100"
              >
                <i class="bi bi-eye"></i> View Full Details
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="map-legend">
        <div class="card shadow-sm border-0">
          <div class="card-body p-2">
            <h6 class="fw-bold small mb-2">Legend</h6>
            <div class="d-flex flex-column gap-1 small">
              <div><span class="badge bg-success"></span> Active</div>
              <div><span class="badge bg-warning"></span> Pending Transfer</div>
              <div><span class="badge bg-danger"></span> Disputed</div>
              <div><span class="badge bg-secondary"></span> Inactive</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Parcels Without GPS Warning -->
      <div v-if="parcelsWithoutCoordinates.length > 0" class="no-gps-warning">
        <div class="card shadow-sm border-warning">
          <div class="card-body p-3">
            <h6 class="fw-bold small text-warning mb-2">
              <i class="bi bi-exclamation-triangle me-1"></i>
              Parcels Without GPS
            </h6>
            <p class="small mb-2">
              {{ parcelsWithoutCoordinates.length }} parcel(s) cannot be displayed on the map because they have no GPS coordinates.
            </p>
            <div class="parcel-list small" style="max-height: 200px; overflow-y: auto;">
              <div v-for="parcel in parcelsWithoutCoordinates" :key="parcel._id" class="mb-1">
                <router-link :to="`/parcels/${parcel._id}`" class="text-decoration-none">
                  <i class="bi bi-geo-alt"></i> {{ parcel.parcelNumber }}
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Navbar from '@/components/Navbar.vue'
import api from '@/services/api'

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

export default {
  name: 'MapView',
  components: { Navbar },
  setup() {
    const mapContainer = ref(null)
    const map = ref(null)
    const markers = ref([])
    const parcels = ref([])
    const selectedParcel = ref(null)
    const searchQuery = ref('')
    const loading = ref(false)

    // Kenya center coordinates
    const kenyaCenter = { lat: -1.286389, lng: 36.817223 }

    const filteredParcels = computed(() => {
      if (!searchQuery.value) return parcels.value
      
      const query = searchQuery.value.toLowerCase()
      return parcels.value.filter(p => 
        p.parcelNumber?.toLowerCase().includes(query) ||
        p.location?.county?.toLowerCase().includes(query) ||
        p.location?.subCounty?.toLowerCase().includes(query)
      )
    })

    const parcelsWithCoordinates = computed(() => {
      return filteredParcels.value.filter(p => 
        p.location?.coordinates?.latitude && p.location?.coordinates?.longitude
      )
    })

    const parcelsWithoutCoordinates = computed(() => {
      return filteredParcels.value.filter(p => 
        !p.location?.coordinates?.latitude || !p.location?.coordinates?.longitude
      )
    })

    const getStatusBadge = (status) => {
      const badges = {
        'active': 'badge bg-success',
        'pending_transfer': 'badge bg-warning',
        'disputed': 'badge bg-danger',
        'inactive': 'badge bg-secondary'
      }
      return badges[status] || 'badge bg-secondary'
    }

    const getMarkerColor = (status) => {
      const colors = {
        'active': '#10b981',
        'pending_transfer': '#f59e0b',
        'disputed': '#ef4444',
        'inactive': '#6b7280'
      }
      return colors[status] || '#6b7280'
    }

    const initMap = async () => {
      try {
        // Create Leaflet map
        map.value = L.map(mapContainer.value).setView([kenyaCenter.lat, kenyaCenter.lng], 7)

        // Add OpenStreetMap tiles
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        })

        tileLayer.addTo(map.value)

        // Load parcels after map is ready
        loadParcels()
      } catch (error) {
        console.error('Error initializing map:', error)
      }
    }

    const loadParcels = async () => {
      loading.value = true
      try {
        const response = await api.get('/parcels')
        parcels.value = response.data?.data?.parcels || []
        addMarkersToMap()
      } catch (error) {
        console.error('Error loading parcels:', error)
      } finally {
        loading.value = false
      }
    }

    const addMarkersToMap = () => {
      // Clear existing markers
      markers.value.forEach(marker => marker.remove())
      markers.value = []

      parcelsWithCoordinates.value.forEach(parcel => {
        const position = [
          parcel.location.coordinates.latitude,
          parcel.location.coordinates.longitude
        ]

        const markerColor = getMarkerColor(parcel.status)

        // Create custom icon with color
        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="
            background-color: ${markerColor};
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          "></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        })

        const marker = L.marker(position, {
          icon: customIcon,
          title: parcel.parcelNumber
        }).addTo(map.value)

        // Add click listener
        marker.on('click', () => {
          selectedParcel.value = parcel
          console.log('Selected parcel:', parcel.parcelNumber, 'ID:', parcel._id || parcel.id)
          map.value.setView(position, 15)
        })

        // Draw polygon if boundary coordinates exist
        if (parcel.boundaryCoordinates && parcel.boundaryCoordinates.length > 2) {
          const polygonCoords = parcel.boundaryCoordinates.map(coord => [
            coord.latitude,
            coord.longitude
          ])

          L.polygon(polygonCoords, {
            color: markerColor,
            weight: 2,
            opacity: 0.8,
            fillColor: markerColor,
            fillOpacity: 0.2
          }).addTo(map.value)
        }

        markers.value.push(marker)
      })
    }

    watch(searchQuery, () => {
      if (map.value) {
        addMarkersToMap()
        
        // If there's exactly one filtered parcel with coordinates, zoom to it
        if (parcelsWithCoordinates.value.length === 1) {
          const parcel = parcelsWithCoordinates.value[0]
          const position = [
            parcel.location.coordinates.latitude,
            parcel.location.coordinates.longitude
          ]
          map.value.setView(position, 13)
          selectedParcel.value = parcel
        }
      }
    })

    onMounted(() => {
      initMap()
    })

    onBeforeUnmount(() => {
      if (map.value) {
        map.value.remove()
      }
    })

    return {
      mapContainer,
      map,
      markers,
      parcels,
      selectedParcel,
      searchQuery,
      loading,
      filteredParcels,
      parcelsWithCoordinates,
      parcelsWithoutCoordinates,
      getStatusBadge
    }
  }
}
</script>

<style scoped>
.map-container {
  width: 100%;
  height: calc(100vh - 120px);
}

.map-header {
  position: relative;
  z-index: 10;
}

.parcel-info-card {
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: 350px;
  z-index: 1000;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.map-legend {
  position: absolute;
  top: 100px;
  right: 20px;
  z-index: 1000;
}

.no-gps-warning {
  position: absolute;
  top: 100px;
  left: 20px;
  width: 300px;
  z-index: 1000;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.btn-group .btn.active {
  background-color: #0d6efd;
  color: white;
}

@media (max-width: 768px) {
  .parcel-info-card {
    width: calc(100% - 40px);
    bottom: 10px;
    left: 20px;
  }

  .map-legend {
    top: 80px;
    right: 10px;
  }
}
</style>
