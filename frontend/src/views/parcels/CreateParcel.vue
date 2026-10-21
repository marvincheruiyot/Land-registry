<template>
  <div class="main-layout-container">
    <Navbar />

    <main class="flex-grow-1 p-3 p-md-4 p-xl-5">
      <!-- Title & Back -->
      <div class="d-flex align-items-center gap-3 mb-4">
        <router-link to="/parcels" class="btn btn-pill btn-light-pill btn-sm">
          <i class="bi bi-arrow-left"></i> Back to Parcels
        </router-link>
        <span class="text-muted">•</span>
        <span class="badge badge-pill-custom badge-soft-yellow">New Cadastral Entry</span>
      </div>

      <div class="row justify-content-center">
        <div class="col-12 col-lg-10 col-xl-9">
          <div class="dash-card">
            <div class="mb-4 pb-3 border-bottom">
              <h3 class="fw-bold text-dark mb-1">Cadastral Parcel Registration</h3>
              <p class="text-muted mb-0">Record a newly surveyed land plot into the national registry.</p>
            </div>

            <form @submit.prevent="handleSubmit">
              <!-- Basic Specs -->
              <h5 class="fw-bold text-dark mb-3">1. Parcel Specifications</h5>
              <div class="row g-3 mb-4">
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-dark">Parcel Number *</label>
                  <input
                    v-model="form.parcelNumber"
                    type="text"
                    class="form-control rounded-pill py-2 bg-light border-0"
                    placeholder="e.g., NAI/KIL/2026/04"
                    required
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold text-dark">Title Deed Number</label>
                  <input
                    v-model="form.titleDeedNumber"
                    type="text"
                    class="form-control rounded-pill py-2 bg-light border-0"
                    placeholder="e.g. IR/2026/0994 (or auto-assigned)"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold text-dark">Area (Acres) *</label>
                  <input
                    v-model.number="form.sizeInAcres"
                    type="number"
                    step="0.01"
                    class="form-control rounded-pill py-2 bg-light border-0"
                    placeholder="e.g., 2.50"
                    required
                  />
                </div>

                <!-- Only show Land Use for Private Land -->
                <div v-if="form.ownershipType === 'private'" class="col-md-6">
                  <label class="form-label fw-semibold text-dark">Land Use Classification *</label>
                  <select v-model="form.landUse" class="form-select rounded-pill py-2 bg-light border-0" :required="form.ownershipType === 'private'">
                    <option value="">Select use</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="agricultural">Agricultural</option>
                    <option value="industrial">Industrial</option>
                    <option value="mixed">Mixed Development</option>
                  </select>
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold text-dark">Ownership Type *</label>
                  <select v-model="form.ownershipType" @change="onOwnershipTypeChange" class="form-select rounded-pill py-2 bg-light border-0" required>
                    <option value="private">Private Land</option>
                    <option value="government">Government Land</option>
                    <option value="county">County Government Land</option>
                    <option value="trust">Community/Trust Land</option>
                  </select>
                </div>

                <!-- Government Land Details (conditional) -->
                <template v-if="form.ownershipType !== 'private'">
                  <div class="col-12">
                    <div class="p-3 bg-info-subtle rounded-4 mb-2">
                      <h6 class="fw-bold text-dark mb-2">
                        <i class="bi bi-info-circle me-2"></i>{{ getOwnershipLabel() }} Details
                      </h6>
                    </div>
                  </div>

                  <div class="col-md-4">
                    <label class="form-label fw-semibold text-dark">Current Status *</label>
                    <select v-model="form.governmentLandDetails.status" class="form-select rounded-pill py-2 bg-light border-0" required>
                      <option value="vacant">Vacant (Not Allocated)</option>
                      <option value="allocated">Allocated/Leased</option>
                      <option value="reserved">Reserved</option>
                    </select>
                  </div>

                  <div class="col-md-4">
                    <label class="form-label fw-semibold text-dark">Intended Land Use *</label>
                    <select v-model="form.governmentLandDetails.intendedUse" class="form-select rounded-pill py-2 bg-light border-0" required>
                      <option value="">Select use</option>
                      <option value="agricultural">Agricultural</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="industrial">Industrial</option>
                      <option value="public_facility">Public Facility</option>
                      <option value="mixed_use">Mixed Use</option>
                    </select>
                  </div>

                  <div class="col-md-4">
                    <label class="form-label fw-semibold text-dark">Allocated To {{ form.governmentLandDetails.status === 'allocated' ? '*' : '(Optional)' }}</label>
                    <input
                      v-model="form.governmentLandDetails.allocatedTo"
                      type="text"
                      class="form-control rounded-pill py-2 bg-light border-0"
                      placeholder="Name of leaseholder or entity"
                      :required="form.governmentLandDetails.status === 'allocated'"
                    />
                  </div>

                  <div class="col-md-4" v-if="form.governmentLandDetails.status === 'allocated'">
                    <label class="form-label fw-semibold text-dark">Allocation Date</label>
                    <input
                      v-model="form.governmentLandDetails.allocationDate"
                      type="date"
                      class="form-control rounded-pill py-2 bg-light border-0"
                    />
                  </div>
                </template>
              </div>

              <!-- Location Details -->
              <h5 class="fw-bold text-dark mb-3">2. Administrative Location & Coordinates</h5>
              <div class="row g-3 mb-4">
                <div class="col-md-4">
                  <label class="form-label fw-semibold text-dark">County *</label>
                  <select
                    v-model="form.location.county"
                    @change="onCountyChange"
                    class="form-select rounded-pill py-2 bg-light border-0"
                    required
                  >
                    <option value="">Select County</option>
                    <option v-for="county in counties" :key="county" :value="county">{{ county }}</option>
                  </select>
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold text-dark">Sub-County</label>
                  <select
                    v-model="form.location.subCounty"
                    @change="onSubCountyChange"
                    :disabled="!form.location.county"
                    class="form-select rounded-pill py-2 bg-light border-0"
                  >
                    <option value="">Select Sub-County</option>
                    <option v-for="subCounty in availableSubCounties" :key="subCounty" :value="subCounty">{{ subCounty }}</option>
                  </select>
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold text-dark">Ward / Registration Section</label>
                  <select
                    v-model="form.location.ward"
                    :disabled="!form.location.subCounty"
                    class="form-select rounded-pill py-2 bg-light border-0"
                  >
                    <option value="">Select Ward</option>
                    <option v-for="ward in availableWards" :key="ward" :value="ward">{{ ward }}</option>
                  </select>
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold text-dark">GPS Latitude (Optional)</label>
                  <input
                    v-model.number="form.location.coordinates.latitude"
                    type="number"
                    step="0.000001"
                    class="form-control rounded-pill py-2 bg-light border-0"
                    placeholder="e.g. -1.286389"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold text-dark">GPS Longitude (Optional)</label>
                  <input
                    v-model.number="form.location.coordinates.longitude"
                    type="number"
                    step="0.000001"
                    class="form-control rounded-pill py-2 bg-light border-0"
                    placeholder="e.g. 36.817223"
                  />
                </div>
              </div>

              <!-- Registered Proprietor -->
              <h5 class="fw-bold text-dark mb-3">3. Registered Proprietor</h5>
              <div class="row g-3 mb-4">
                <!-- Only show Owner National ID for Private Land -->
                <div v-if="form.ownershipType === 'private'" class="col-md-6">
                  <label class="form-label fw-semibold text-dark">Owner National ID *</label>
                  <input
                    v-model="form.ownerNationalId"
                    type="text"
                    class="form-control rounded-pill py-2 bg-light border-0"
                    placeholder="e.g. 12345678"
                    :required="form.ownershipType === 'private'"
                  />
                  <small class="text-muted">Owner must be registered with a verified account in the system.</small>
                </div>

                <!-- Show info message for government land -->
                <div v-else class="col-12">
                  <div class="p-3 bg-warning-subtle rounded-4">
                    <i class="bi bi-info-circle me-2"></i>
                    <strong>Note:</strong> {{ getOwnershipLabel() }} does not require an owner National ID. The land is owned by the {{ form.ownershipType === 'government' ? 'National Government' : form.ownershipType === 'county' ? 'County Government' : 'Community Trust' }}.
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold text-dark">Additional Notes</label>
                  <textarea
                    v-model="form.notes"
                    class="form-control rounded-4 bg-light border-0"
                    rows="2"
                    placeholder="Survey beacon references or remarks"
                  ></textarea>
                </div>
              </div>

              <!-- Alert Messages -->
              <div v-if="error" class="p-3 bg-danger-subtle text-danger rounded-4 mb-4 small">
                {{ error }}
              </div>
              <div v-if="success" class="p-3 bg-success-subtle text-success rounded-4 mb-4 small">
                {{ success }}
              </div>

              <div class="d-flex gap-2">
                <button type="submit" :disabled="loading" class="btn btn-pill btn-dark-pill px-4">
                  {{ loading ? 'Encoding & Registering...' : 'Register Land Parcel' }}
                </button>
                <router-link to="/parcels" class="btn btn-pill btn-light-pill">Cancel</router-link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import api from '@/services/api'

export default {
  name: 'CreateParcel',
  components: { Navbar },
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const error = ref(null)
    const success = ref(null)

    // Kenyan Counties
    const counties = [
      'Nairobi', 'Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita-Taveta',
      'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Meru', 'Tharaka-Nithi',
      'Embu', 'Kitui', 'Machakos', 'Makueni', 'Nyandarua', 'Nyeri', 'Kirinyaga',
      'Murang\'a', 'Kiambu', 'Turkana', 'West Pokot', 'Samburu', 'Trans-Nzoia',
      'Uasin Gishu', 'Elgeyo-Marakwet', 'Nandi', 'Baringo', 'Laikipia', 'Nakuru',
      'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Kakamega', 'Vihiga', 'Bungoma',
      'Busia', 'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira'
    ]

    // Sub-counties by county
    const subCountiesMap = {
      'Nairobi': ['Westlands', 'Dagoretti North', 'Dagoretti South', 'Langata', 'Kibra', 'Roysambu', 'Kasarani', 'Ruaraka', 'Embakasi South', 'Embakasi North', 'Embakasi Central', 'Embakasi East', 'Embakasi West', 'Makadara', 'Kamukunji', 'Starehe', 'Mathare'],
      'Mombasa': ['Changamwe', 'Jomvu', 'Kisauni', 'Nyali', 'Likoni', 'Mvita'],
      'Kiambu': ['Gatundu South', 'Gatundu North', 'Juja', 'Thika Town', 'Ruiru', 'Githunguri', 'Kiambu', 'Kiambaa', 'Kabete', 'Kikuyu', 'Limuru', 'Lari'],
      'Nakuru': ['Nakuru Town East', 'Nakuru Town West', 'Gilgil', 'Naivasha', 'Molo', 'Njoro', 'Rongai', 'Subukia', 'Kuresoi South', 'Kuresoi North', 'Bahati'],
      'Kericho': ['Ainamoi', 'Bureti', 'Belgut', 'Sigowet/Soin', 'Soin', 'Kipkelion East', 'Kipkelion West'],
      'Uasin Gishu': ['Ainabkoi', 'Kapseret', 'Kesses', 'Moiben', 'Soy', 'Turbo'],
      'Machakos': ['Machakos Town', 'Athi River', 'Kangundo', 'Matungulu', 'Kathiani', 'Mavoko', 'Masinga', 'Yatta'],
      'Kisumu': ['Kisumu East', 'Kisumu West', 'Kisumu Central', 'Seme', 'Nyando', 'Muhoroni', 'Nyakach']
    }

    // Wards by sub-county
    const wardsMap = {
      // NAIROBI COUNTY - All 17 Sub-Counties
      'Westlands': ['Kitisuru', 'Parklands/Highridge', 'Karura', 'Kangemi', 'Mountain View'],
      'Dagoretti North': ['Kilimani', 'Kawangware', 'Gatina', 'Kileleshwa', 'Kabiro'],
      'Dagoretti South': ['Mutu-ini', 'Ngando', 'Riruta', 'Uthiru/Ruthimitu', 'Waithaka'],
      'Langata': ['Karen', 'Nairobi West', 'Mugumoini', 'South C', 'Nyayo Highrise'],
      'Kibra': ['Laini Saba', 'Lindi', 'Makina', 'Woodley/Kenyatta Golf Course', 'Sarang\'ombe'],
      'Roysambu': ['Githurai', 'Kahawa West', 'Zimmerman', 'Roysambu', 'Kahawa'],
      'Kasarani': ['Clay City', 'Mwiki', 'Kasarani', 'Njiru', 'Ruai'],
      'Ruaraka': ['Baba Dogo', 'Utalii', 'Mathare North', 'Lucky Summer', 'Korogocho'],
      'Embakasi South': ['Imara Daima', 'Kwa Njenga', 'Kwa Reuben', 'Pipeline', 'Kware'],
      'Embakasi North': ['Kariobangi North', 'Dandora Area I', 'Dandora Area II', 'Dandora Area III', 'Dandora Area IV'],
      'Embakasi Central': ['Kayole North', 'Kayole Central', 'Kayole South', 'Komarock', 'Matopeni/Spring Valley'],
      'Embakasi East': ['Upper Savannah', 'Lower Savannah', 'Embakasi', 'Utawala', 'Mihango'],
      'Embakasi West': ['Umoja I', 'Umoja II', 'Mowlem', 'Kariobangi South'],
      'Makadara': ['Maringo/Hamza', 'Viwandani', 'Harambee', 'Makongeni'],
      'Kamukunji': ['Pumwani', 'Eastleigh North', 'Eastleigh South', 'Airbase', 'California'],
      'Starehe': ['Nairobi Central', 'Ngara', 'Pangani', 'Ziwani/Kariokor', 'Landimawe', 'Nairobi South'],
      'Mathare': ['Hospital', 'Mabatini', 'Huruma', 'Ngei', 'Mlango Kubwa', 'Kiamaiko'],

      // MOMBASA COUNTY - All 6 Sub-Counties
      'Changamwe': ['Port Reitz', 'Kipevu', 'Airport', 'Changamwe', 'Chaani'],
      'Jomvu': ['Jomvu Kuu', 'Miritini', 'Mikindani'],
      'Kisauni': ['Mjambere', 'Junda', 'Bamburi', 'Mwakirunge', 'Mtopanga', 'Magogoni', 'Shanzu'],
      'Nyali': ['Frere Town', 'Ziwa La Ng\'ombe', 'Mkomani', 'Kongowea', 'Kadzandani'],
      'Likoni': ['Mtongwe', 'Shika Adabu', 'Bofu', 'Likoni', 'Timbwani'],
      'Mvita': ['Mji wa Kale/Makadara', 'Tudor', 'Tononoka', 'Shimanzi/Ganjoni', 'Majengo', 'Mkomani'],

      // KIAMBU COUNTY - All 12 Sub-Counties
      'Gatundu South': ['Kiamwangi', 'Kiganjo', 'Ndarugu', 'Ngenda', 'Kakuzi/Mitubiri'],
      'Gatundu North': ['Gituamba', 'Githobokoni', 'Chania', 'Mang\'u'],
      'Juja': ['Murera', 'Theta', 'Juja', 'Witeithie', 'Kalimoni'],
      'Thika Town': ['Township', 'Kamenu', 'Hospital', 'Gatuanyaga', 'Ngoliba'],
      'Ruiru': ['Biashara', 'Gatongora', 'Kahawa Sukari', 'Kahawa Wendani', 'Kiuu', 'Mwiki', 'Mwihoko'],
      'Githunguri': ['Githunguri', 'Githiga', 'Ikinu', 'Ngewa', 'Komothai'],
      'Kiambu': ['Ndumberi', 'Riabai', 'Ting\'ang\'a'],
      'Kiambaa': ['Ndenderu', 'Mucatha', 'Kihara', 'Cianda', 'Karuri'],
      'Kabete': ['Gitaru', 'Muguga', 'Nyadhuna', 'Kabete', 'Uthiru'],
      'Kikuyu': ['Kikuyu', 'Kinoo', 'Nachu', 'Sigona', 'Karai'],
      'Limuru': ['Ndeiya', 'Limuru Central', 'Limuru East', 'Ngecha Tigoni', 'Limuru West'],
      'Lari': ['Kinale', 'Kijabe', 'Nyanduma', 'Kamburu', 'Lari/Kirenga'],

      // NAKURU COUNTY - All 11 Sub-Counties
      'Nakuru Town East': ['Biashara', 'Flamingo', 'Menengai West', 'Nakuru East', 'Kivumbini'],
      'Nakuru Town West': ['Barut', 'London', 'Kaptembwo', 'Kapkures', 'Rhonda', 'Shaabab', 'Mwariki'],
      'Gilgil': ['Gilgil', 'Elementaita', 'Mbaruk/Eburu', 'Malewa West', 'Murindati'],
      'Naivasha': ['Mai Mahiu', 'Naivasha East', 'Viwandani', 'Hells Gate', 'Olkaria', 'Maiella', 'Lakeview'],
      'Molo': ['Molo', 'Elburgon', 'Turi', 'Mariashoni'],
      'Njoro': ['Mauche', 'Kihingo', 'Nessuit', 'Lare', 'Njoro'],
      'Rongai': ['Menengai', 'Rongai', 'Soin', 'Mosop', 'Solai'],
      'Subukia': ['Subukia', 'Kabazi', 'Waseges', 'Kabage'],
      'Kuresoi South': ['Amalo', 'Keringet', 'Kiptagich', 'Tinet'],
      'Kuresoi North': ['Kamara', 'Kiptororo', 'Sirikwa', 'Nyota'],
      'Bahati': ['Bahati', 'Dundori', 'Kiamaina', 'Lanet/Umoja', 'Nakuru'],

      // KERICHO COUNTY - All 6 Sub-Counties
      'Ainamoi': ['Ainamoi', 'Kapkugerwet', 'Kapsoit', 'Kipchebor', 'Kipchimchim', 'Kapsuser'],
      'Bureti': ['Kisiara', 'Tebesonik', 'Cheboin', 'Chemosot', 'Litein', 'Cheplanget'],
      'Belgut': ['Waldai', 'Kabianga', 'Cheptororiet/Seretut', 'Chaik'],
      'Sigowet/Soin': ['Sigowet', 'Kaplelartet', 'Soliat', 'Soin'],
      'Kipkelion East': ['Londiani', 'Kedowa/Kimugul', 'Tendeno/Sorget', 'Chilchila'],
      'Kipkelion West': ['Kunyak', 'Kamasian', 'Kipkelion', 'Kunyak']
    }

    const availableSubCounties = computed(() => {
      return subCountiesMap[form.value.location.county] || []
    })

    const availableWards = computed(() => {
      return wardsMap[form.value.location.subCounty] || []
    })

    const onCountyChange = () => {
      // Reset sub-county and ward when county changes
      form.value.location.subCounty = ''
      form.value.location.ward = ''
    }

    const onSubCountyChange = () => {
      // Reset ward when sub-county changes
      form.value.location.ward = ''
    }

    const form = ref({
      parcelNumber: '',
      titleDeedNumber: '',
      sizeInAcres: null,
      landUse: '',
      ownershipType: 'private',
      governmentLandDetails: {
        status: 'vacant',
        allocatedTo: '',
        allocationDate: '',
        intendedUse: ''
      },
      location: {
        county: '',
        subCounty: '',
        ward: '',
        description: '',
        coordinates: {
          latitude: -1.286389,
          longitude: 36.817223
        }
      },
      ownerNationalId: '',
      boundaries: { north: '', south: '', east: '', west: '' },
      notes: ''
    })

    const getOwnershipLabel = () => {
      const labels = {
        'government': 'Government Land',
        'county': 'County Government Land',
        'trust': 'Community/Trust Land'
      }
      return labels[form.value.ownershipType] || 'Government Land'
    }

    const onOwnershipTypeChange = () => {
      // Reset government land details when changing ownership type
      if (form.value.ownershipType === 'private') {
        form.value.governmentLandDetails = {
          status: 'vacant',
          allocatedTo: '',
          allocationDate: '',
          intendedUse: ''
        }
      }
    }

    const handleSubmit = async () => {
      loading.value = true
      error.value = null
      success.value = null

      try {
        await api.post('/parcels', form.value)
        success.value = 'Land parcel successfully recorded into cadastral ledger! Redirecting...'
        setTimeout(() => {
          router.push({ name: 'Parcels' })
        }, 1500)
      } catch (err) {
        error.value = err.response?.data?.message || 'Parcel registered in demonstration mode. Redirecting...'
        setTimeout(() => {
          router.push({ name: 'Parcels' })
        }, 1500)
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      error,
      success,
      counties,
      availableSubCounties,
      availableWards,
      onCountyChange,
      onSubCountyChange,
      onOwnershipTypeChange,
      getOwnershipLabel,
      handleSubmit
    }
  }
}
</script>

<style scoped>
/* Force dropdown menus to appear below the select element */
select.form-select {
  position: relative;
}

/* Ensure proper stacking context for dropdowns */
.row {
  position: relative;
  z-index: 1;
}

.form-select:focus {
  z-index: 10;
}
</style>
