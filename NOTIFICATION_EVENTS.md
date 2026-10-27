# Land Registry System - Notification Events

## Overview
The notification system now sends real-time notifications to users for ALL major events in the system. Land owners, officers, and administrators receive timely alerts about activities related to their land parcels, documents, and transfers.

---

## ✅ DOCUMENT EVENTS (NEW - JUST ADDED)

### 1. **Document Uploaded by Land Owner**
- **Triggered When**: A land owner uploads a document
- **Notified Users**:
  - ✅ **All Administrators** (for review) - Priority: HIGH
  - ✅ **All Land Officers** (for review) - Priority: HIGH
  - ✅ **Document Uploader** (confirmation) - Priority: MEDIUM
- **Notification Type**: `DOCUMENT_UPLOADED`
- **Message Example**: 
  - To Officers/Admins: "John Doe (ID: 12345678) uploaded a title_deed. Parcel: NRB/001/2024. Please review and verify the document."
  - To Owner: "Your title_deed has been uploaded successfully and is pending verification by land officers."

### 2. **Document Uploaded by Officer for Owner**
- **Triggered When**: A land officer uploads a title deed for a land owner (e.g., after transfer)
- **Notified Users**:
  - ✅ **Document Owner** (the person it was uploaded for) - Priority: HIGH
  - ✅ **All Administrators** (for visibility) - Priority: MEDIUM
- **Notification Type**: `DOCUMENT_UPLOADED`
- **Message Example**: 
  - To Owner: "A title_deed has been uploaded to your account by Officer Jane Smith. Note: Title deed for parcel NRB/001/2024"
  - To Admins: "Officer Jane Smith uploaded a title_deed for John Doe. Parcel: NRB/001/2024"

### 3. **Document Verified**
- **Triggered When**: An officer verifies/approves a document
- **Notified Users**:
  - ✅ **Document Owner** - Priority: HIGH
  - ✅ **All Administrators** - Priority: LOW
- **Notification Type**: `SYSTEM_ALERT` (for owner), `VERIFICATION_PERFORMED` (for admins)
- **Message Example**: 
  - To Owner: "Your title_deed 'title-deed.pdf' has been verified and approved by Officer Jane Smith. The document is now officially recognized."
  - To Admins: "Officer Jane Smith verified title_deed for John Doe (ID: 12345678)."

### 4. **Document Rejected**
- **Triggered When**: An officer rejects a document
- **Notified Users**:
  - ✅ **Document Owner** - Priority: HIGH
  - ✅ **All Administrators** - Priority: LOW
- **Notification Type**: `SYSTEM_ALERT` (for owner), `VERIFICATION_PERFORMED` (for admins)
- **Message Example**: 
  - To Owner: "Your title_deed 'title-deed.pdf' was rejected by Officer Jane Smith. Please contact the land registry office for more information or to resubmit."
  - To Admins: "Officer Jane Smith rejected title_deed for John Doe (ID: 12345678)."

---

## ✅ TRANSFER EVENTS (ALREADY WORKING)

### 5. **Transfer Initiated**
- **Triggered When**: A land owner initiates a transfer request
- **Notified Users**:
  - ✅ **All Administrators** - Priority: HIGH
  - ✅ **All Land Officers** - Priority: HIGH
  - ✅ **Transfer Initiator** (confirmation) - Priority: MEDIUM
- **Notification Type**: `TRANSFER_INITIATED`
- **Message Example**: 
  - To Officers/Admins: "Transfer request for parcel NRB/001/2024. From: John Doe to Jane Smith. Type: sale. Awaiting your approval."
  - To Initiator: "Your transfer request for parcel NRB/001/2024 has been submitted successfully."

### 6. **Transfer Approved**
- **Triggered When**: A land officer approves a transfer
- **Notified Users**:
  - ✅ **Previous Owner** (seller) - Priority: HIGH
  - ✅ **New Owner** (buyer) - Priority: HIGH
- **Notification Type**: `TRANSFER_APPROVED`
- **Message Example**: 
  - To Previous Owner: "Your transfer request for parcel NRB/001/2024 has been approved. The ownership has been transferred to Jane Smith. Title deed documents have been transferred to the new owner."
  - To New Owner: "Congratulations! You are now the registered owner of parcel NRB/001/2024. The transfer from John Doe has been completed. 2 title deed document(s) have been transferred to your account."

### 7. **Transfer Rejected**
- **Triggered When**: A land officer rejects a transfer
- **Notified Users**:
  - ✅ **Previous Owner** (seller) - Priority: HIGH
  - ✅ **New Owner** (buyer) - Priority: MEDIUM
- **Notification Type**: `TRANSFER_REJECTED`
- **Message Example**: 
  - To Previous Owner: "Your transfer request for parcel NRB/001/2024 has been rejected. Reason: Missing required documents. You may contact land registry for more information."
  - To New Owner: "The transfer request for parcel NRB/001/2024 from John Doe has been rejected. Reason: Missing required documents."

---

## ✅ LAND PARCEL EVENTS

### 8. **Parcel Registered**
- **Triggered When**: A new land parcel is registered (private land only)
- **Notified Users**:
  - ✅ **Parcel Owner** - Priority: HIGH
- **Notification Type**: `SYSTEM_ALERT`
- **Message Example**: "Your land parcel NRB/001/2024 in Nairobi has been successfully registered in the National Land Registry. Size: 2.5 acres."

### 9. **Parcel Updated (Important Fields)**
- **Triggered When**: Important parcel fields change (status, size, boundaries)
- **Notified Users**:
  - ✅ **Parcel Owner** - Priority: HIGH
- **Notification Type**: `SYSTEM_ALERT`
- **Message Example**: "Your land parcel NRB/001/2024 has been updated by Officer Jane Smith. Status changed from active to pending_transfer."

### 10. **Parcel Flagged**
- **Triggered When**: A parcel is flagged/disputed
- **Notified Users**:
  - ✅ **Parcel Owner** - Priority: CRITICAL
  - ✅ **All Administrators** - Priority: HIGH
- **Notification Type**: `PARCEL_FLAGGED`
- **Message Example**: 
  - To Owner: "Your land parcel NRB/001/2024 has been flagged by Officer Jane Smith. Reason: Boundary dispute. Please contact the land registry office immediately to resolve this issue."
  - To Admins: "Jane Smith flagged parcel NRB/001/2024 (Owner: John Doe). Reason: Boundary dispute"

---

## 📊 NOTIFICATION SUMMARY

| Event | Owner Notified | Officers Notified | Admins Notified |
|-------|---------------|-------------------|-----------------|
| Document Uploaded (by Owner) | ✅ Confirmation | ✅ Review Request | ✅ Review Request |
| Document Uploaded (by Officer) | ✅ New Document | ❌ | ✅ For Visibility |
| Document Verified | ✅ Approval | ❌ | ✅ For Records |
| Document Rejected | ✅ Rejection Notice | ❌ | ✅ For Records |
| Transfer Initiated | ✅ Confirmation | ✅ Approval Request | ✅ Approval Request |
| Transfer Approved | ✅ Both Owners | ❌ | ❌ |
| Transfer Rejected | ✅ Both Owners | ❌ | ❌ |
| Parcel Registered | ✅ Owner | ❌ | ❌ |
| Parcel Updated | ✅ If Important | ❌ | ❌ |
| Parcel Flagged | ✅ Owner | ❌ | ✅ Alert |

---

## 🔧 TECHNICAL DETAILS

### Files Modified:
1. **backend/controllers/documentController.js** - Added notifications for:
   - Document uploads (by owners and officers)
   - Document verification (approved/rejected)

2. **backend/controllers/landParcelController.js** - Added notifications for:
   - Parcel flagging
   - Parcel updates (important fields only)

3. **backend/controllers/transferController.js** - Already had notifications for:
   - Transfer initiation
   - Transfer approval
   - Transfer rejection

### Notification Types Used:
- `DOCUMENT_UPLOADED` - For document upload events
- `VERIFICATION_PERFORMED` - For document verification by officers
- `TRANSFER_INITIATED` - For transfer requests
- `TRANSFER_APPROVED` - For approved transfers
- `TRANSFER_REJECTED` - For rejected transfers
- `PARCEL_FLAGGED` - For flagged/disputed parcels
- `SYSTEM_ALERT` - For general system notifications (parcel registered, updated, document verified/rejected)

### Priority Levels:
- **CRITICAL** - Urgent action required (parcel flagged)
- **HIGH** - Important, review soon (transfers, document approvals, new uploads)
- **MEDIUM** - Informational (confirmations, officer actions)
- **LOW** - For records (admin notifications about verification)

---

## ✅ COMPLETE

All major events in the Land Registry system now generate notifications. Land owners will be kept informed about:
- All changes to their parcels
- All document activities (uploads, verifications, rejections)
- All transfer activities (initiated, approved, rejected)
- Critical issues (parcel flagged)

Officers and administrators receive notifications about:
- New documents requiring review
- New transfer requests
- Parcel flags and disputes
