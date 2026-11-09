<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="bi bi-pin-map-fill me-2"></i>
            Pick Location on Map
          </h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        
        <div class="modal-body p-0">
          <!-- Search Bar -->
          <div class="search-bar-container p-3 bg-white border-bottom">
            <div class="input-group">
              <span class="input-group-text bg-light border-0">
                <i class="bi bi-search"></i>
              </span>
              <input
                v-model="searchQuery"
                @keyup.enter="searchLocation"
                type="text"
                class="form-control border-0 bg-light"
                placeholder="Search location (e.g., Mombasa, Nakuru, Nairobi)..."
              />
              <button
                @click="searchLocation"
                class="btn btn-primary"
                type="button"
                :disabled="!searchQuery || searching"
              >
                <span v-if="searching" class="spinner-border spinner-border-sm me-1"></span>
                <i v-else class="bi bi-search me-1"></i>
                Search
              </button>
            </div>
            <div v-if="searchError" class="alert alert-warning small mt-2 mb-0 py-2">
              <i class="bi bi-exclamation-triangle me-1"></i>
              {{ searchError }}
            </div>
          </div>

          <!-- Map Container -->
          <div id="map-picker" ref="mapContainer" class="map-picker-container"></div>
          
          <!-- Coordinate Display -->
          <div class="coordinate-display p-3 bg-light border-top">
            <div class="row g-2">
              <div class="col-md-6">
                <label class="form-label small fw-semibold mb-1">Latitude</label>
                <input
                  :value="selectedLat ? selectedLat.toFixed(6) : ''"
                  type="text"
                  class="form-control form-control-sm"
                  placeholder="Click on map to select"
                  readonly
                />
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-semibold mb-1">Longitude</label>
                <input
                  :value="selectedLng ? selectedLng.toFixed(6) : ''"
                  type="text"
                  class="form-control form-control-sm"
                  placeholder="Click on map to select"
                  readonly
                />
              </div>
            </div>
            
            <div v-if="selectedLat && selectedLng" class="mt-2">
              <small class="text-muted">
                <i class="bi bi-info-circle me-1"></i>
                Click anywhere on the map to update the location
              </small>
            </div>
            
            <div v-if="validationError" class="alert alert-warning small mt-2 mb-0 py-2">
              <i class="bi bi-exclamation-triangle me-1"></i>
              {{ validationError }}
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="confirmSelection"
            :disabled="!selectedLat || !selectedLng || !!validationError"
          >
            <i class="bi bi-check-circle me-1"></i>
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

export default {
  name: 'MapPicker',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    initialLat: {
      type: Number,
      default: -1.286389 // Nairobi center
    },
    initialLng: {
      type: Number,
      default: 36.817223
    }
  },
  emits: ['close', 'select'],
  setup(props, { emit }) {
    const mapContainer = ref(null)
    const map = ref(null)
    const marker = ref(null)
    const selectedLat = ref(null)
    const selectedLng = ref(null)
    const validationError = ref('')
    const searchQuery = ref('')
    const searchError = ref('')
    const searching = ref(false)

    // Kenya boundaries for validation
    const KENYA_BOUNDS = {
      lat: { min: -4.68, max: 5.03 },
      lng: { min: 33.89, max: 41.86 }
    }

    // Kenya county coordinates for search
    const KENYA_LOCATIONS = {
      'nairobi': [-1.286389, 36.817223],
      'mombasa': [-4.043477, 39.668206],
      'kisumu': [-0.091702, 34.767956],
      'nakuru': [-0.303099, 36.080026],
      'eldoret': [0.514277, 35.269779],
      'thika': [-1.033350, 37.069328],
      'malindi': [-3.219200, 40.116880],
      'kitale': [0.999210, 34.996040],
      'garissa': [-0.453392, 39.646280],
      'kakamega': [0.284154, 34.752197],
      'kilifi': [-3.630706, 39.909100],
      'meru': [0.046620, 37.649040],
      'nyeri': [-0.420974, 36.947582],
      'machakos': [-1.517429, 37.263950],
      'kericho': [-0.367220, 35.286316],
      'kisii': [-0.681679, 34.767956],
      'bomet': [-0.802020, 35.305740],
      'kiambu': [-1.171360, 36.835270]
    }

    const validateCoordinates = (lat, lng) => {
      if (lat < KENYA_BOUNDS.lat.min || lat > KENYA_BOUNDS.lat.max ||
          lng < KENYA_BOUNDS.lng.min || lng > KENYA_BOUNDS.lng.max) {
        validationError.value = 'Location must be within Kenya boundaries'
        return false
      }
      validationError.value = ''
      return true
    }

    const initMap = async () => {
      try {
        await nextTick()

        const initialPosition = [
          props.initialLat || -1.286389,
          props.initialLng || 36.817223
        ]

        // Create map
        map.value = L.map(mapContainer.value).setView(initialPosition, 12)

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(map.value)

        // Create marker
        marker.value = L.marker(initialPosition, {
          draggable: true
        }).addTo(map.value)

        // Set initial coordinates if provided
        if (props.initialLat && props.initialLng) {
          selectedLat.value = parseFloat(props.initialLat.toFixed(6))
          selectedLng.value = parseFloat(props.initialLng.toFixed(6))
          validateCoordinates(props.initialLat, props.initialLng)
        }

        // Add click listener to map
        map.value.on('click', (e) => {
          const lat = parseFloat(e.latlng.lat.toFixed(6))
          const lng = parseFloat(e.latlng.lng.toFixed(6))
          
          marker.value.setLatLng(e.latlng)
          selectedLat.value = lat
          selectedLng.value = lng
          validateCoordinates(lat, lng)
        })

        // Add drag listener to marker
        marker.value.on('dragend', (e) => {
          const position = e.target.getLatLng()
          const lat = parseFloat(position.lat.toFixed(6))
          const lng = parseFloat(position.lng.toFixed(6))
          
          selectedLat.value = lat
          selectedLng.value = lng
          validateCoordinates(lat, lng)
        })

      } catch (error) {
        console.error('Error initializing map:', error)
        validationError.value = 'Failed to load map. Please refresh the page and try again.'
      }
    }

    const searchLocation = () => {
      if (!searchQuery.value.trim()) {
        return
      }

      searching.value = true
      searchError.value = ''

      const query = searchQuery.value.toLowerCase().trim()
      
      // Check if location exists in our Kenya locations
      const location = KENYA_LOCATIONS[query]
      
      if (location) {
        const [lat, lng] = location
        
        // Pan and zoom to location
        map.value.setView([lat, lng], 13)
        
        // Update marker position
        marker.value.setLatLng([lat, lng])
        
        // Update coordinates
        selectedLat.value = parseFloat(lat.toFixed(6))
        selectedLng.value = parseFloat(lng.toFixed(6))
        validateCoordinates(lat, lng)
        
        // Clear search query
        searchQuery.value = ''
        searching.value = false
      } else {
        // Try to use Nominatim geocoding service (free)
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)},Kenya&limit=1`)
          .then(response => response.json())
          .then(data => {
            searching.value = false
            
            if (data && data.length > 0) {
              const lat = parseFloat(parseFloat(data[0].lat).toFixed(6))
              const lng = parseFloat(parseFloat(data[0].lon).toFixed(6))
              
              if (validateCoordinates(lat, lng)) {
                map.value.setView([lat, lng], 13)
                marker.value.setLatLng([lat, lng])
                selectedLat.value = lat
                selectedLng.value = lng
                searchQuery.value = ''
              } else {
                searchError.value = 'Location is outside Kenya boundaries'
              }
            } else {
              searchError.value = `No results found for "${searchQuery.value}". Try: Nairobi, Mombasa, Kisumu, etc.`
            }
          })
          .catch(error => {
            searching.value = false
            searchError.value = 'Error searching location. Try: Nairobi, Mombasa, Nakuru, etc.'
            console.error('Search error:', error)
          })
      }
    }

    const closeModal = () => {
      emit('close')
    }

    const confirmSelection = () => {
      if (selectedLat.value && selectedLng.value && !validationError.value) {
        emit('select', {
          latitude: selectedLat.value,
          longitude: selectedLng.value
        })
        closeModal()
      }
    }

    // Watch for modal open/close
    watch(() => props.isOpen, async (isOpen) => {
      if (isOpen) {
        await nextTick()
        setTimeout(() => {
          initMap()
        }, 100)
      } else if (map.value) {
        map.value.remove()
        map.value = null
      }
    })

    return {
      mapContainer,
      selectedLat,
      selectedLng,
      validationError,
      searchQuery,
      searchError,
      searching,
      searchLocation,
      closeModal,
      confirmSelection
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  overflow-y: auto;
  padding: 20px;
}

.modal-dialog {
  width: 100%;
  max-width: 900px;
  margin: auto;
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding: 1.25rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #212529;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.btn-close:hover {
  opacity: 1;
}

.map-picker-container {
  width: 100%;
  height: 450px;
  background-color: #e9ecef;
}

.search-bar-container {
  position: relative;
  z-index: 1;
}

.input-group-text {
  border-radius: 0.375rem 0 0 0.375rem;
}

.coordinate-display {
  min-height: 120px;
}

.modal-footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .map-picker-container {
    height: 350px;
  }
  
  .modal-dialog {
    max-width: 100%;
    margin: 0;
  }

  .search-bar-container .btn {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }

  .search-bar-container .btn span:not(.spinner-border) {
    display: none;
  }
}
</style>
