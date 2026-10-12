# Testing Guide - Document Upload & Transfer Notifications

## Prerequisites
- Backend server running on `http://localhost:5000`
- Frontend server running on `http://localhost:3000` (or your configured port)
- At least one Land Owner account with registered land parcels
- At least one Administrator or Land Officer account

---

## Test 1: Document Upload (Land Owner)

### Steps:
1. **Login as Land Owner**
   - Use credentials for a land owner account
   - Should redirect to `/userdashboard`

2. **Navigate to My Documents**
   - Click "My Documents" in the sidebar
   - Should see existing documents (if any) with statistics

3. **Click Upload Document Button**
   - Look for blue "Upload Document" button in top right
   - Modal should open with title "Upload Document"

4. **Fill Upload Form**
   - Click "Select File" and choose a PDF or image file
   - Select "Document Type" (e.g., Title Deed)
   - Select a land parcel from dropdown (should show only your parcels)
   - Optionally add description

5. **Submit Upload**
   - Click "Upload Document" button
   - Should show loading spinner
   - On success: Modal closes automatically, alert shows success message
   - Document appears in the list immediately with "Pending" status

6. **Verify Upload**
   - Document should be in the table
   - Status badge should show "Pending" in yellow
   - File name, type, size, and upload date should display correctly

---

## Test 2: View Uploaded Documents (Admin/Officer)

### Steps:
1. **Login as Administrator or Land Officer**
   - Should redirect to `/admindashboard` or `/officer`

2. **Navigate to Documents**
   - Click "Documents" in the sidebar
   - Should see ALL documents from all users

3. **Find Uploaded Document**
   - Look for the document uploaded in Test 1
   - Should show uploader's name
   - Should show related parcel number
   - Status should be "Pending"

---

## Test 3: Transfer Notification Click (Land Owner)

### Steps:
1. **Create a Transfer (Land Owner)**
   - Login as land owner
   - Go to "My Land Parcels"
   - Click "View Details" on any parcel
   - Click "Transfer Land" button
   - Fill in transfer form and submit

2. **Check Notifications**
   - After transfer submission, you should see confirmation
   - Admins and officers should receive notifications

3. **Login as Administrator**
   - Click the notification bell icon (top right)
   - Should see transfer notification (e.g., "Transfer Initiated")
   - Notification should show:
     - Transfer icon with info background color
     - Title: "Transfer Initiated"
     - Message with parcel number and details
     - Time stamp (e.g., "Just now", "5m ago")

4. **Click Notification**
   - Click on the transfer notification
   - Should:
     - Mark notification as read (background changes from blue to white)
     - Close the dropdown automatically
     - Navigate to `/transfers` page
     - Show the transfer in the transfers table

5. **Verify Unread Count**
   - Initially shows unread count badge (red circle with number)
   - After clicking notification, count should decrease
   - Badge should disappear if no unread notifications remain

---

## Test 4: Transfer Notification Click (Land Owner)

### Steps:
1. **Login as Land Owner**
   - Land owner who initiated the transfer

2. **Check Notifications**
   - Click notification bell
   - Should see notifications about transfer status updates

3. **Click Transfer Notification**
   - Click on a transfer notification
   - Should navigate to `/my-transfers` (not `/transfers`)
   - Should show your transfers with status

---

## Test 5: Document Upload Notification Click

### Steps:
1. **Upload Document (Land Owner)**
   - Follow Test 1 to upload a document

2. **Check Admin/Officer Notifications**
   - Login as admin or officer
   - Click notification bell
   - Should see "Document Uploaded" notification

3. **Click Document Notification**
   - Click the notification
   - Should navigate to `/documents` page
   - Should show all documents including newly uploaded one

---

## Test 6: Mark All As Read

### Steps:
1. **Have Multiple Unread Notifications**
   - Perform multiple actions to generate notifications
   - Login as admin/officer

2. **Open Notifications**
   - Click bell icon
   - Should show unread count (e.g., "5 unread notifications")

3. **Click "Mark all read"**
   - Click the "Mark all read" button in notification dropdown header
   - All notification backgrounds should change from blue to white
   - Unread count should become 0
   - Red badge should disappear from bell icon

---

## Test 7: File Validation

### Steps:
1. **Try Invalid File Type**
   - Open upload modal
   - Try to upload .exe, .txt, or other non-allowed file
   - Should show error: "Only PDF and image files (JPEG, PNG, TIFF) are allowed"

2. **Try Large File**
   - Try to upload a file larger than 10MB
   - Should show error: "File size cannot exceed 10MB"

3. **Try Without Selecting Parcel**
   - Select a file
   - Don't select a parcel
   - Click upload
   - Should show error: "Please select a land parcel"

---

## Expected Results Summary

### Document Upload
- ✅ Modal opens and closes properly
- ✅ File validation works
- ✅ Only user's parcels show in dropdown
- ✅ Upload succeeds with valid data
- ✅ Document appears immediately in list
- ✅ Status shows as "Pending"
- ✅ Admins/officers can see the document

### Transfer Notifications
- ✅ Notifications appear for admins/officers when transfer is initiated
- ✅ Clicking notification marks it as read
- ✅ Clicking notification navigates to correct page:
  - Admins/Officers → `/transfers`
  - Land Owners → `/my-transfers`
- ✅ Dropdown closes automatically after click
- ✅ Unread count updates correctly

### Mark All As Read
- ✅ All notifications marked as read
- ✅ Visual state updates (blue → white backgrounds)
- ✅ Unread count becomes 0
- ✅ Badge disappears

---

## Troubleshooting

### Documents Not Appearing
- Check backend console for errors
- Verify uploads directory exists: `backend/uploads`
- Check file permissions on uploads directory
- Verify multer is installed: `npm list multer` in backend directory

### Notifications Not Showing
- Check if notifications API is responding: `GET /api/v1/notifications`
- Verify notification routes are registered in server.js
- Check browser console for API errors
- Try fallback to audit logs

### Upload Fails
- Check backend logs for multer errors
- Verify file size is under 10MB
- Verify file type is allowed (PDF, JPEG, PNG, TIFF)
- Check if uploads directory is writable

### Navigation Not Working
- Check browser console for router errors
- Verify routes are defined in `frontend/src/router/index.js`
- Check if user has correct role permissions

---

## API Endpoints to Test

### Using Postman or curl:

**Get Notifications:**
```bash
GET http://localhost:5000/api/v1/notifications
Headers: Authorization: Bearer {your_token}
```

**Mark Notification as Read:**
```bash
PUT http://localhost:5000/api/v1/notifications/{notification_id}/read
Headers: Authorization: Bearer {your_token}
```

**Upload Document:**
```bash
POST http://localhost:5000/api/v1/documents/upload
Headers: Authorization: Bearer {your_token}
Form Data:
  - file: [select file]
  - documentType: "title_deed"
  - landParcelId: "{parcel_id}"
  - description: "Optional description"
```

**Get Documents:**
```bash
GET http://localhost:5000/api/v1/documents
Headers: Authorization: Bearer {your_token}
```
