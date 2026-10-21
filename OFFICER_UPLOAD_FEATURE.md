# Officer Upload Title Deed for Owner - Feature Guide

## Overview
After a transfer is approved, Land Officers can upload title deeds directly for new property owners. This ensures new owners receive their updated title deeds in the system.

---

## How It Works

### For Land Officers:

1. **Navigate to Documents Page**
   - Log in as a Land Officer
   - Go to Documents section
   - Click "Upload Title Deed for Owner" button

2. **Fill Upload Form**
   - **Owner National ID**: Enter the new owner's National ID
   - System will automatically fetch and display owner details (name, email)
   - **Parcel Number**: Enter the related parcel number (e.g., NAI/KIL/2026/04)
   - **File Upload**: Select the title deed PDF/image file
   - **Notes**: Add any transfer details or remarks

3. **Submit**
   - Click "Upload Title Deed"
   - Success message will confirm upload
   - Document is now linked to the owner

### For Land Owners:

1. **View Documents Automatically**
   - Log in to your account
   - Navigate to "My Documents" section
   - You will **automatically** see:
     - Documents you uploaded yourself
     - **Documents uploaded for you by officers** (new title deeds after transfer) ← Shows with special badge
   - No manual refresh needed - documents appear instantly!

2. **Identify Officer Uploads**
   - Documents uploaded by officers for you display a special badge: **"Uploaded by Officer for You"**
   - These are typically new title deeds issued after transfer approval

3. **Actions Available**
   - View document in browser
   - Download document to your device
   - Check verification status

---

## Technical Implementation

### Backend Changes Made:

1. **New Endpoint**: `GET /api/v1/users/by-national-id/:nationalId`
   - Allows officers to lookup users by National ID
   - Returns user details for verification before upload

2. **Document Model Enhancement**:
   - Added `uploadedFor` field to link documents to specific owners
   - Supports officer uploads on behalf of owners

3. **Upload Logic Updated**:
   - When `uploadedFor` is provided, document is linked to that owner
   - Owner will see this document in their documents list
   - Related entity set to User (instead of LandParcel) for post-transfer uploads

4. **Query Enhancement**:
   - Land Owners now see documents where:
     - They are the uploader (`uploadedBy`)
     - OR document was uploaded for them (`uploadedFor`)

### Frontend Implementation:

1. **Modal Form**:
   - National ID lookup with auto-fetch
   - Visual confirmation when owner is found
   - File upload with validation
   - Parcel number and notes fields

2. **User Experience**:
   - Clear success/error messages
   - Auto-close modal after successful upload
   - Document list refreshes automatically

---

## Testing Steps

### Test Case 1: Officer Upload for Owner

1. Log in as Land Officer
2. Go to Documents page
3. Click "Upload Title Deed for Owner"
4. Enter a valid owner's National ID (e.g., Joy Maina's ID)
5. Verify owner details appear
6. Enter parcel number
7. Upload a sample title deed file
8. Submit and verify success message

### Test Case 2: Owner Views Document

1. Log in as the owner (whose National ID was used above)
2. Navigate to Documents page
3. Verify the newly uploaded title deed appears in the list
4. Verify you can view/download the document

### Test Case 3: Invalid National ID

1. Log in as Land Officer
2. Try to upload with an invalid/non-existent National ID
3. Verify error message: "Owner not found. Please verify the National ID."

---

## Database Schema

### Document Model Fields:
```javascript
{
  uploadedBy: ObjectId,      // Who uploaded (officer)
  uploadedFor: ObjectId,     // NEW: Who it's for (owner)
  relatedEntity: {
    entityType: String,      // 'User' for post-transfer uploads
    entityId: ObjectId       // References the owner
  },
  documentType: String,
  fileName: String,
  filePath: String,
  description: String,
  // ... other fields
}
```

---

## API Endpoints

### Get User by National ID
```
GET /api/v1/users/by-national-id/:nationalId
Headers: Authorization: Bearer <token>
Response: {
  status: 'success',
  data: {
    user: {
      _id, fullName, email, nationalId, phoneNumber, role
    }
  }
}
```

### Upload Document for Owner
```
POST /api/v1/documents/upload
Headers: 
  Authorization: Bearer <token>
  Content-Type: multipart/form-data
Body:
  - documentType: 'title_deed'
  - file: <file>
  - uploadedFor: <owner user ID>
  - parcelNumber: 'NAI/KIL/2026/04'
  - description: 'Transfer details'
```

---

## Benefits

✅ Officers can upload title deeds for new owners after transfer approval
✅ Owners automatically see their new title deeds
✅ Complete audit trail (uploadedBy shows officer, uploadedFor shows owner)
✅ No manual notification needed - document appears in owner's account
✅ Supports the complete transfer workflow

---

## Next Steps / Future Enhancements

- Add notification when officer uploads document for owner
- Link document directly to Transfer record
- Auto-suggest parcel number from recent transfers
- Bulk upload for multiple owners
