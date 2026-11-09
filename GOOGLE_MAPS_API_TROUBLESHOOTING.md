# Google Maps API Troubleshooting

## Current Issue
The Map Picker is showing: "Oops! Something went wrong. This page didn't load Google Maps correctly."

## Possible Causes & Solutions

### 1. API Key Issues

**Current API Key**: `AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`

#### Check if API Key is Valid:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to: APIs & Services > Credentials
3. Find the API key and check:
   - ✅ Key is not restricted to specific URLs (or includes your localhost)
   - ✅ Key has no IP restrictions blocking localhost
   - ✅ Key is not expired

#### Required APIs to Enable:
The following APIs must be enabled in Google Cloud Console:
- ✅ **Maps JavaScript API** (for displaying maps)
- ✅ **Geocoding API** (for location search)
- ✅ **Places API** (optional, for autocomplete)

**How to Enable:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to: APIs & Services > Library
3. Search for each API above
4. Click "Enable" for each one

### 2. Billing Requirements

Google Maps requires a billing account to be set up, even though they provide $200 free credit per month.

**To Set Up Billing:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to: Billing
3. Link a billing account
4. No charges will apply if you stay within the free tier ($200/month)

**Free Tier Limits:**
- 28,000 map loads per month (free)
- 40,000 geocoding requests per month (free)
- This is more than enough for development and small production use

### 3. API Key Restrictions (Current Issue)

The error usually means the API key has restrictions that block localhost.

**Solution - Remove or Update Restrictions:**

#### Option A: Remove All Restrictions (Development Only)
1. Go to Google Cloud Console > Credentials
2. Click on your API key
3. Under "Application restrictions", select "None"
4. Under "API restrictions", select "Don't restrict key"
5. Click "Save"

#### Option B: Allow Localhost (Recommended)
1. Go to Google Cloud Console > Credentials
2. Click on your API key
3. Under "Application restrictions", select "HTTP referrers"
4. Add these referrers:
   ```
   http://localhost:*
   http://localhost:3000/*
   http://127.0.0.1:*
   http://127.0.0.1:3000/*
   ```
5. Under "API restrictions", select "Restrict key"
6. Enable only the APIs you need:
   - Maps JavaScript API
   - Geocoding API
7. Click "Save"

### 4. Alternative: Use a New API Key

If the current key has issues, create a fresh one:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to: APIs & Services > Credentials
3. Click "+ CREATE CREDENTIALS" > "API key"
4. Copy the new key
5. Enable required APIs (Maps JavaScript API, Geocoding API)
6. Set up billing if not already done
7. Update the key in your code

**Where to update the key:**
- `frontend/src/components/MapPicker.vue` (line ~95)
- `frontend/src/views/MapView.vue` (line ~187)

### 5. Quick Test

To test if the API key works, open this URL in your browser:
```
https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8
```

**Expected Results:**
- ✅ **If it works**: You'll see JavaScript code (the Google Maps library)
- ❌ **If it fails**: You'll see an error message explaining the issue

### 6. Temporary Solution: Use a Different Approach

If you can't fix the API key immediately, you can:

**Option 1: Manual Coordinates Only**
- Remove the map picker temporarily
- Users enter coordinates manually
- Can add coordinate validation

**Option 2: Use OpenStreetMap (Free Alternative)**
- Replace Google Maps with Leaflet.js + OpenStreetMap
- No API key required
- Free and open source
- Similar functionality

### 7. Console Error Details

Check the browser console (F12) for specific error messages:
- Look for errors containing "Google Maps" or "API key"
- The error message usually tells you exactly what's wrong:
  - "This API key is not authorized..."
  - "This API project is not authorized..."
  - "Billing must be enabled..."
  - "RefererNotAllowedMapError"

## Recommended Steps (In Order)

1. **Check Browser Console** - See the exact error message
2. **Test API Key** - Open the test URL above
3. **Enable Required APIs** - Maps JavaScript API and Geocoding API
4. **Set Up Billing** - Link a billing account (free tier available)
5. **Remove Restrictions** - Allow localhost access
6. **Create New Key** - If current key is problematic
7. **Test Again** - Refresh the page and try the map picker

## Contact Support

If none of the above works:
- Check [Google Maps Platform Status](https://status.cloud.google.com/)
- Visit [Google Maps Platform Support](https://developers.google.com/maps/support)
- Check [Stack Overflow](https://stackoverflow.com/questions/tagged/google-maps-api-3)

---

**Note**: The most common issue is that billing is not enabled or the API key is restricted. Fix these first before trying other solutions.
