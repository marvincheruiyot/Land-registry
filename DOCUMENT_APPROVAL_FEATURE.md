# Document Approval Feature - Implementation Summary

## Overview
Added document approval/rejection functionality with parcel information display.

---

## ✅ Features Implemented

### 1. **Approve/Reject Buttons for Officers & Admins**

**Who Can Approve:**
- ✅ Land Officers
- ✅ Administrators

**Where:**
- Documents page (`/documents`)
- Buttons appear ONLY on documents with status "pending"

**Visual Design:**
```
┌────────────────────────────────────┐
│  📄 title-deed.jpg     🟡 pending  │
│  Title Deed                         │
│                                     │
│  📍 Parcel: NRB/001/2024           │
│     Nairobi, Westlands             │
│                                     │
│  👤 Owner: John Doe                │
│     ID: 12345678                   │
│                                     │
│  📅 27 Oct 2026                    │
│                                     │
│  [👁 View] [⬇ Download]            │
│  [✅ Approve] [❌ Reject]           │
└────────────────────────────────────┘
```

### 2. **Status Changes After Approval**

**Before Approval:**
- Status: 🟡 `pending` (Yellow badge)
- Buttons: Approve & Reject visible

**After Approval:**
- Status: ✅ `verified` (Green badge)
- Buttons: Approve & Reject hidden
- Everywhere in system shows "verified"

**After Rejection:**
- Status: 🔴 `rejected` (Red badge)
- Buttons: Approve & Reject hidden
- Rejection reason stored and visible

### 3. **Parcel Information Display**

Each document card now shows:
```
┌─────────────────────────────┐
│ 📍 Parcel: NRB/001/2024    │
│    Nairobi, Westlands       │
└─────────────────────────────┘
```

**Information Shown:**
- ✅ Parcel Number (e.g., NRB/001/2024)
- ✅ County location (e.g., Nairobi)
- ✅ Subcounty if available (e.g., Westlands)
- ✅ Highlighted with green location icon
- ✅ Displayed in white box with border

### 4. **Rejection Modal with Reason**

When officer clicks "Reject":
1. Modal pops up
2. Shows document being rejected
3. Requires rejection reason (textarea)
4. Cannot submit without reason
5. Reason saved to database
6. Owner notified with reason

**Modal Layout:**
```
┌──────────────────────────────────┐
│  Reject Document            [×]  │
├──────────────────────────────────┤
│  ⚠️ You are about to reject     │
│     this document. Please        │
│     provide a reason.            │
│                                  │
│  📄 title-deed.jpg              │
│     Title Deed                   │
│                                  │
│  Rejection Reason *              │
│  ┌──────────────────────────┐  │
│  │ [Text area for reason]   │  │
│  │                          │  │
│  │                          │  │
│  └──────────────────────────┘  │
│                                  │
│  [Reject Document] [Cancel]     │
└──────────────────────────────────┘
```

### 5. **Notifications Sent**

**When Document Approved:**
- ✅ **Owner notified**: "Your title_deed has been verified ✓"
- ✅ **Admins notified**: "Officer approved document for [Owner]"

**When Document Rejected:**
- ✅ **Owner notified**: "Your title_deed was rejected. Reason: [reason]"
- ✅ **Admins notified**: "Officer rejected document for [Owner]. Reason: [reason]"

---

## 📁 Files Modified

### **Backend:**
1. ✅ `backend/models/Document.js`
   - Added `rejectionReason` field to schema

2. ✅ `backend/controllers/documentController.js`
   - Updated `verifyDocument` function to accept `rejectionReason`
   - Enhanced notifications to include rejection reason

### **Frontend:**
1. ✅ `frontend/src/views/documents/DocumentsList.vue`
   - Added parcel information display
   - Added Approve/Reject buttons
   - Added rejection modal
   - Added `approveDocument()` function
   - Added `rejectDocument()` function
   - Added `showRejectModal()` function
   - Real-time status updates after approval/rejection

---

## 🎨 UI Changes

### **Document Card - Before:**
```
┌────────────────────────────────┐
│  📄 title-deed.jpg  🟡 pending│
│  Title Deed                    │
│  👤 Owner: John Doe           │
│  📅 27 Oct 2026               │
│  [View] [Download]            │
└────────────────────────────────┘
```

### **Document Card - After (with parcel & buttons):**
```
┌────────────────────────────────┐
│  📄 title-deed.jpg  🟡 pending│
│  Title Deed                    │
│  ┌──────────────────────────┐ │
│  │ 📍 NRB/001/2024         │ │
│  │    Nairobi, Westlands   │ │
│  └──────────────────────────┘ │
│  👤 Owner: John Doe           │
│  💳 ID: 12345678              │
│  📅 27 Oct 2026               │
│  [👁 View] [⬇ Download]       │
│  [✅ Approve] [❌ Reject]      │
└────────────────────────────────┘
```

---

## 🔄 Workflow

### **Approval Flow:**
1. Land Owner uploads document → Status: "pending"
2. Officer/Admin views document in Documents page
3. Officer sees "Approve" and "Reject" buttons
4. Officer clicks **"Approve"**
5. Confirmation dialog appears
6. Officer confirms
7. Status changes to "verified" ✅
8. Buttons disappear
9. Owner receives notification
10. Document shows "verified" everywhere

### **Rejection Flow:**
1. Land Owner uploads document → Status: "pending"
2. Officer/Admin views document
3. Officer clicks **"Reject"**
4. Modal opens requesting reason
5. Officer enters reason (required)
6. Officer submits
7. Status changes to "rejected" 🔴
8. Rejection reason saved
9. Owner receives notification with reason
10. Document shows "rejected" everywhere

---

## 🔑 Key Features

### **Real-Time Updates:**
- ✅ Status updates instantly without page reload
- ✅ Buttons disappear after approval/rejection
- ✅ Badge changes color immediately

### **Conditional Display:**
- ✅ Buttons ONLY show for pending documents
- ✅ Buttons ONLY show for Officers & Admins
- ✅ Land Owners never see approve/reject buttons

### **Parcel Linking:**
- ✅ Shows which parcel the document belongs to
- ✅ Displays location information
- ✅ Visual connection between document and land

### **Validation:**
- ✅ Cannot reject without reason
- ✅ Confirmation before approval
- ✅ Error handling for failed requests

---

## 🧪 Testing Checklist

**As Land Officer:**
- [ ] Navigate to `/documents`
- [ ] Find a document with "pending" status
- [ ] Verify "Approve" and "Reject" buttons are visible
- [ ] Click "Approve" button
- [ ] Confirm approval in dialog
- [ ] Verify status changes to "verified" (green)
- [ ] Verify buttons disappear
- [ ] Refresh page - status still "verified"

**Test Rejection:**
- [ ] Find another pending document
- [ ] Click "Reject" button
- [ ] Verify modal opens
- [ ] Try submitting without reason (should fail)
- [ ] Enter rejection reason
- [ ] Submit rejection
- [ ] Verify status changes to "rejected" (red)
- [ ] Verify buttons disappear

**Test Parcel Display:**
- [ ] Find documents linked to parcels
- [ ] Verify parcel number displays
- [ ] Verify location shows correctly
- [ ] Verify styling (white box, green icon)

**As Land Owner:**
- [ ] Login as land owner
- [ ] Navigate to My Documents
- [ ] Verify NO approve/reject buttons visible
- [ ] Upload a document
- [ ] Wait for officer approval
- [ ] Check notifications for approval/rejection

---

## 📊 Database Changes

**Document Model:**
```javascript
{
  // ... existing fields
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'transferred'],
    default: 'pending'
  },
  rejectionReason: {  // ← NEW FIELD
    type: String
  }
}
```

---

## 🎯 Benefits

1. **Officers can approve documents directly** - No need to go elsewhere
2. **Status updates everywhere** - Consistent across all pages
3. **Parcel information visible** - Clear which land the document is for
4. **Rejection reasons tracked** - Transparency and accountability
5. **Real-time feedback** - Instant status changes
6. **User notifications** - Owners know immediately when approved/rejected

---

## ✅ Complete!

All requested features have been implemented:
- ✅ Approve/Reject buttons for Officers & Admins
- ✅ Status changes from "pending" to "verified" after approval
- ✅ Status shows "verified" everywhere in system
- ✅ Parcel information displays on each document
- ✅ Rejection modal with required reason
- ✅ Notifications sent to owners

The system is now ready for document approval workflow!
