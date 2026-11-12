<template>
  <div class="main-layout-container">
    <Navbar />

    <main class="flex-grow-1 p-3 p-md-4">
      <div class="container-fluid">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="fw-bold text-dark mb-1">
              <i class="bi bi-map-fill me-2"></i>
              Interactive Parcel Map
            </h2>
            <p class="text-muted mb-0">View and explore all registered land parcels on an interactive map</p>
          </div>
          <button @click="refreshMap" class="btn btn-outline-primary">
            <i class="bi bi-arrow-clockwise me-2"></i>
            Refresh Map
          </button>
        </div>

        <!-- Map Controls -->
        <div class="row g-3 mb-3">
          <div class="col-md-4">
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0">
                <i class="bi bi-search"></i>
              </span>
              <input 
                v-model="searchQuery" 
                @input="searchParcels" 
                type="text" 
                class="form-control border-start-0 bg-light" 
                placeholder="Search by parcel number, owner name..."
              >
            </div>
          </div>
          <div class="col-md-3">
            <select v-model="filterCounty" @change="filterMap" class="form-select bg-light">
              <option value="">All Counties</option>
              <option v-for="county in counties" :key="county" :value="county">{{ county }}</option>
            </select>
          </div>
          <div class="col-md-3">
            <select v-model="filterLandUse" @change="filterMap" class="form-select bg-light">
              <option value="">All Land Uses</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="agricultural">Agricultural</option>
              <option value="industrial">Industrial</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
          <div class="col-md-2">
            <div class="form-check form-switch mt-2">
              <input 
                v-model="showClusters" 
                @change="toggleClusters" 
                class="form-check-input" 
                type="checkbox" 
                id="clusterSwitch"
              >
              <label class="form-check-label" for="clusterSwitch">
                Cluster View
              </label>
            </div>
          </div>
        </div>

        <!-- Map Container -->
        <div class="row g-3">
          <!-- Map -->
          <div :class="selectedParcel ? 'col-lg-8' : 'col-12'">
            <div class="dash-card p-0" style="height: 70vh; min-height: 500px;">
              <div id="map" style="width: 100%; height: 100%; border-radius: 1rem;"></div>
              
              <!-- Map Loading Overlay -->
              <div v-if="loadingMap" class="position-absolute top-50 start-50 translate-middle">
                <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;"></div>
                <p class="mt-2 text-muted">Loading map...</p>
              </div>
            </div>

            <!-- Map Legend -->
            <div class="dash-card mt-3">
              <h6 class="fw-bold mb-3">Map Legend</h6>
              <div class="row g-3">
                <div class="col-auto">
                  <span class="badge bg-success">🟢</span> Active Parcels
                </div>
                <div class="col-auto">
                  <span class="badge bg-warning">🟡</span> Pending Transfer
                </div>
                <div class="col-auto">
                  <span class="badge bg-danger">🔴</span> Disputed/Flagged
                </div>
                <div class="col-auto">
                  <span class="badge bg-secondary">⚫</span> Inactive
                </div>
              </div>
            </div>
          </div>

          <!-- Parcel Details Panel -->
          <div v-if="selectedParcel" class="col-lg-4">
            <div class="dash-card">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="fw-bold mb-0">Parcel Details</h5>
                <button @click="selectedParcel = null" class="btn btn-sm btn-light rounded-circle">
                  <i class="bi bi-x-lg"></i>
                </button>
              </div>

              <div class="mb-3">
                <img 
                  :src="`https://maps.googleapis.com/maps/api/staticmap?center=${selectedParcel.location.coordinates.latitude},${selectedParcel.location.coordinates.longitude}&zoom=15&size=400x200&markers=color:red%7C${selectedParcel.location.coordinates.latitude},${selectedParcel.location.coordinates.longitude}&key=YOUR_API_KEY`"
                  alt="Parcel location" 
                  class="img-fluid rounded"
                  style="width: 100%; height: 150px; object-fit: cover;"
                >
              </div>

              <div class="mb-3">
                <h6 class="fw-bold text-primary">{{ selectedParcel.parcelNumber }}</h6>
                <p class="text-muted small mb-2">{{ selectedParcel.location.county }}, {{ selectedParcel.location.subCounty }}</p>
                <span :class="['badge', getStatusBadgeClass(selectedParcel.status)]">
                  {{ selectedParcel.status }}
                </span>
              </div>

              <div class="border-top pt-3">
                <div class="row g-2 text-sm">
                  <div class="col-6">
                    <small class="text-muted d-block">Size</small>
                    <strong>{{ selectedParcel.sizeInAcres }} acres</strong>
                  </div>
                  <div class="col-6">
                    <small class="text-muted d-block">Land Use</small>
                    <strong>{{ selectedParcel.landUse || 'N/A' }}</strong>
                  </div>
                  <div class="col-12 mt-2">
                    <small class="text-muted d-block">Owner</small>
                    <strong>{{ selectedParcel.currentOwner?.fullName || 'Unknown' }}</strong>
                  </div>
                  <div class="col-12 mt-2">
                    <small class="text-muted d-block">Title Deed</small>
                    <strong>{{ selectedParcel.titleDeedNumber || 'N/A' }}</strong>
                  </div>
                  <div class="col-12 mt-2">
                    <small class="text-muted d-block">GPS Coordinates</small>
                    <div class="bg-light p-2 rounded mt-1">
                      <small class="font-monospace">
                        Lat: {{ selectedParcel.location.coordinates.latitude?.toFixed(6) }}<br>
                        Lng: {{ selectedParcel.location.coordinates.longitude?.toFixed(6) }}
                      </small>
                      <button 
                        @click="copyCoordinates" 
                        class="btn btn-sm btn-light float-end"
                        title="Copy coordinates"
                      >
                        <i class="bi bi-clipboard"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="border-top pt-3 mt-3">
                <router-link 
                  :to="`/parcels/${selectedParcel._id}`" 
                  class="btn btn-primary w-100"
                >
                  <i class="bi bi-eye me-2"></i>
                  View Full Details
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistics -->
        <div class="row g-3 mt-3">
          <div class="col-md-3">
            <div class="dash-card text-center">
              <div class="text-muted small mb-1">Total Parcels</div>
              <h3 class="fw-bold text-dark mb-0">{{ stats.total }}</h3>
            </div>
          </div>
          <div class="col-md-3">
            <div class="dash-card text-center">
              <div class="text-muted small mb-1">With GPS Data</div>
              <h3 class="fw-bold text-success mb-0">{{ stats.withGPS }}</h3>
            </div>
          </div>
          <div class="col-md-3">
            <div class="dash-card text-center">
              <div class="text-muted small mb-1">Active</div>
              <h3 class="fw-bold text-primary mb-0">{{ stats.active }}</h3>
            </div>
          </div>
          <div class="col-md-3">
            <div class="dash-card text-center">
              <div class="text-muted small mb-1">Flagged</div>
              <h3 class="fw-bold text-danger mb-0">{{ stats.flagged }}</h3>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Navbar from '@/components/Navbar.vue'
import api from '@/services/api'

export default {
  name: 'ParcelMapView',
  components: { Navbar },
  setup() {
    const map = ref(null)
    const markers = ref([])
    const parcels = ref([])
    const selectedParcel = ref(null)
    const loadingMap = ref(true)
    const searchQuery = ref('')
    const filterCounty = ref('')
    const filterLandUse = ref('')
    const showClusters = ref(true)
    const counties = ref([
      'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu', 'Machakos', 'Kajiado',
      'Meru', 'Nyeri', 'Murang\'a', 'Embu', 'Kitui', 'Kilifi', 'Kwale'
    ])

    const stats = ref({
      total: 0,
      withGPS: 0,
      active: 0,
      flagged: 0
    })

    const loadParcels = async () => {
      try {
        // Request all parcels for map view
        const response = await api.get('/parcels?limit=1000')
        parcels.value = response.data?.data?.parcels || []
        
        // Calculate stats
        stats.value = {
          total: parcels.value.length,
          withGPS: parcels.value.filter(p => p.location?.coordinates?.latitude).length,
          active: parcels.value.filter(p => p.status === 'active').length,
          flagged: parcels.value.filter(p => p.isFlagged).length
        }

        if (map.value) {
          plotParcelsOnMap()
        }
      } catch (err) {
        console.error('Error loading parcels:', err)
      }
    }

    const initMap = () => {
      loadingMap.value = true

      // Kenya center coordinates
      const kenyaCenter = { lat: -0.0236, lng: 37.9062 }

      map.value = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: kenyaCenter,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      })

      loadingMap.value = false
      plotParcelsOnMap()
    }

    const plotParcelsOnMap = () => {
      // Clear existing markers
      markers.value.forEach(marker => marker.setMap(null))
      markers.value = []

      // Filter parcels
      let filtered = parcels.value.filter(p => 
        p.location?.coordinates?.latitude && p.location?.coordinates?.longitude
      )

      if (filterCounty.value) {
        filtered = filtered.filter(p => p.location.county === filterCounty.value)
      }

      if (filterLandUse.value) {
        filtered = filtered.filter(p => p.landUse === filterLandUse.value)
      }

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(p => 
          p.parcelNumber.toLowerCase().includes(query) ||
          p.currentOwner?.fullName?.toLowerCase().includes(query)
        )
      }

      // Plot markers
      filtered.forEach(parcel => {
        const marker = new window.google.maps.Marker({
          position: {
            lat: parcel.location.coordinates.latitude,
            lng: parcel.location.coordinates.longitude
          },
          map: map.value,
          title: parcel.parcelNumber,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: getMarkerColor(parcel),
            fillOpacity: 0.9,
            strokeColor: '#ffffff',
            strokeWeight: 2
          }
        })

        marker.addListener('click', () => {
          selectedParcel.value = parcel
          map.value.panTo(marker.getPosition())
          map.value.setZoom(15)
        })

        markers.value.push(marker)
      })
    }

    const getMarkerColor = (parcel) => {
      if (parcel.isFlagged) return '#dc3545' // Red
      if (parcel.status === 'pending_transfer') return '#ffc107' // Yellow
      if (parcel.status === 'active') return '#198754' // Green
      return '#6c757d' // Gray
    }

    const getStatusBadgeClass = (status) => {
      const classes = {
        'active': 'bg-success',
        'pending_transfer': 'bg-warning',
        'disputed': 'bg-danger',
        'inactive': 'bg-secondary'
      }
      return classes[status] || 'bg-secondary'
    }

    const searchParcels = () => {
      plotParcelsOnMap()
    }

    const filterMap = () => {
      plotParcelsOnMap()
    }

    const toggleClusters = () => {
      // TODO: Implement marker clustering
      console.log('Clustering:', showClusters.value)
    }

    const refreshMap = async () => {
      loadingMap.value = true
      await loadParcels()
      loadingMap.value = false
    }

    const copyCoordinates = () => {
      if (selectedParcel.value) {
        const coords = `${selectedParcel.value.location.coordinates.latitude}, ${selectedParcel.value.location.coordinates.longitude}`
        navigator.clipboard.writeText(coords)
        alert('Coordinates copied to clipboard!')
      }
    }

    onMounted(async () => {
      // Load Google Maps script
      if (!window.google) {
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=geometry,places`
        script.async = true
        script.defer = true
        script.onload = () => {
          initMap()
        }
        document.head.appendChild(script)
      } else {
        initMap()
      }

      await loadParcels()
    })

    onBeforeUnmount(() => {
      markers.value.forEach(marker => marker.setMap(null))
    })

    return {
      map,
      parcels,
      selectedParcel,
      loadingMap,
      searchQuery,
      filterCounty,
      filterLandUse,
      showClusters,
      counties,
      stats,
      searchParcels,
      filterMap,
      toggleClusters,
      refreshMap,
      copyCoordinates,
      getStatusBadgeClass
    }
  }
}
</script>

<style scoped>
#map {
  position: relative;
}

.font-monospace {
  font-family: 'Courier New', monospace;
}
</style>
