# Support Tickets - Admin Dashboard Feature

## Summary
Added "Support Tickets" feature to the Administrator sidebar, allowing admins to view, manage, and respond to user support requests.

---

## Changes Made

### 1. Navbar Component
**File:** `frontend/src/components/Navbar.vue`

Added new menu item in Administration section (Admin only):
```vue
<router-link
  v-if="isAdministrator"
  to="/support-tickets"
  class="sidebar-nav-item text-decoration-none"
  active-class="active"
>
  <i class="bi bi-headset"></i>
  <span>Support Tickets</span>
</router-link>
```

**Position:** Between "Audit Trail" and "System Settings"

---

### 2. Router Configuration
**File:** `frontend/src/router/index.js`

Added new route:
```javascript
{
  path: '/support-tickets',
  name: 'SupportTickets',
  component: () => import('@/views/admin/SupportTicketsPage.vue'),
  meta: { requiresAuth: true, roles: ['Administrator'] }
}
```

---

### 3. Support Tickets Page Component
**File:** `frontend/src/views/admin/SupportTicketsPage.vue` *(NEW)*

Complete admin dashboard for managing support tickets with:

#### Statistics Cards
- **Pending** - Yellow badge with clock icon
- **In Progress** - Primary badge with reply icon
- **Resolved** - Green badge with checkmark
- **Total Tickets** - Secondary badge with inbox icon

#### Filters
- **Status Filter**: All / Pending / In Progress / Resolved
- **Priority Filter**: All / Low / Medium / High / Urgent
- **Search**: Search tickets by keywords

#### Tickets Table
Displays all tickets with:
- **Ticket ID** - Last 6 characters in uppercase
- **User Info** - Name and email
- **Subject** - Truncated with category
- **Priority Badge** - Color-coded (Low=Info, Medium=Warning, High/Urgent=Danger)
- **Status Badge** - Color-coded (Pending=Warning, In Progress=Primary, Resolved=Success)
- **Created Date** - Formatted timestamp
- **View Button** - Opens ticket details modal

#### Ticket Details Modal
When admin clicks "View" on a ticket:

**Ticket Information:**
- User who submitted (name & email)
- Created date
- Priority badge
- Status dropdown (editable)
- Subject (bold)
- Message (in light gray box)
- Previous admin response (if any, in blue box)

**Reply Form:** (Hidden if ticket is resolved)
- Large textarea for response
- Send button with icon
- Error handling
- Loading state during submission

---

## Features

### 1. View All Tickets
- Admins see all support tickets from all users
- Table view with sortable columns
- Pagination support (backend ready)

### 2. Filter & Search
- Filter by status (pending/in progress/resolved)
- Filter by priority (low/medium/high/urgent)
- Search across tickets
- Real-time filtering

### 3. Ticket Management
- Change ticket status via dropdown
- Status changes save immediately
- Auto-refresh statistics after status change

### 4. Respond to Tickets
- Send responses directly to users
- Response text area with validation
- Auto-marks ticket as resolved when response sent
- Shows previous responses

### 5. Statistics Dashboard
- Live count of pending tickets
- Track in-progress tickets
- Monitor resolved tickets
- Total tickets overview

---

## API Endpoints (Expected)

The component expects these backend endpoints:

### Get All Tickets
```
GET /api/v1/support-tickets
Authorization: Bearer {admin_token}

Response:
{
  "status": "success",
  "data": {
    "tickets": [
      {
        "_id": "ticket_id",
        "user": {
          "fullName": "John Doe",
          "email": "john@example.com"
        },
        "subject": "Cannot access my parcels",
        "message": "I am unable to see my land parcels...",
        "category": "Technical",
        "priority": "medium",
        "status": "pending",
        "adminResponse": null,
        "createdAt": "2026-10-12T10:30:00Z"
      }
    ]
  }
}
```

### Update Ticket Status
```
PUT /api/v1/support-tickets/{ticketId}
Authorization: Bearer {admin_token}
Content-Type: application/json

Body:
{
  "status": "in_progress"
}
```

### Send Response
```
POST /api/v1/support-tickets/{ticketId}/respond
Authorization: Bearer {admin_token}
Content-Type: application/json

Body:
{
  "response": "Thank you for contacting us. Your issue has been resolved..."
}
```

---

## User Experience

### Administrator Dashboard Navigation:
```
📋 MAIN MENU
├── Dashboard
├── Land Parcels
├── Transfers
├── Documents
└── Verify Land

⚙️ ADMINISTRATION
├── Reports & Analytics
├── User Management
├── Audit Trail
├── Support Tickets ← ✨ NEW
└── System Settings
```

### Workflow:

1. **Admin Opens Support Tickets**
   - Clicks "Support Tickets" in sidebar
   - See statistics at top (pending, in progress, resolved)
   - View all tickets in table

2. **Admin Filters Tickets**
   - Select "Pending" from status filter
   - See only unresolved tickets
   - Can also filter by priority

3. **Admin Views Ticket Details**
   - Clicks "View" button on a ticket
   - Modal opens with full ticket information
   - Sees user details, subject, message, priority

4. **Admin Updates Status**
   - Changes status dropdown from "Pending" to "In Progress"
   - Status saves immediately
   - Statistics update automatically

5. **Admin Sends Response**
   - Types response in textarea
   - Clicks "Send Response"
   - Ticket auto-marked as "Resolved"
   - User receives email notification (if configured)
   - Modal shows success confirmation

6. **Admin Closes Modal**
   - Clicks X or outside modal
   - Returns to tickets list
   - Statistics reflect changes

---

## Access Control

### Administrators ✅
- Can view all support tickets
- Can filter and search tickets
- Can change ticket status
- Can respond to tickets
- Can see ticket statistics

### Land Officers ❌
- Cannot access support tickets
- This is admin-only feature

### Land Owners ❌
- Cannot access admin support page
- Can submit tickets via Help & Support page
- Can view their own tickets only

---

## Backend Integration Status

### ✅ Already Exists (from previous implementation):
- Support ticket model (`backend/models/SupportTicket.js`)
- Support routes (`backend/routes/supportRoutes.js`)
- Support controller (`backend/controllers/supportController.js`)
- Endpoints for creating tickets (user side)

### ⚠️ May Need Enhancement:
- Respond endpoint (`POST /support-tickets/:id/respond`)
- Update status endpoint (`PUT /support-tickets/:id`)
- Admin view all tickets endpoint

---

## Testing Checklist

### Test 1: Access Support Tickets
1. Login as Administrator
2. Look at sidebar under "Administration"
3. ✅ Should see "Support Tickets" with headset icon
4. Click on it
5. ✅ Should navigate to `/support-tickets`
6. ✅ Should see Support Tickets page

### Test 2: View Statistics
1. On Support Tickets page
2. ✅ Should see 4 stat cards at top
3. ✅ Numbers should match ticket counts
4. ✅ Colors should be correct (yellow, blue, green, gray)

### Test 3: View Tickets List
1. Should see table with all tickets
2. ✅ Each row shows: ID, User, Subject, Priority, Status, Date
3. ✅ Priority badges are color-coded
4. ✅ Status badges are color-coded
5. ✅ "View" button on each ticket

### Test 4: Filter Tickets
1. Select "Pending" from status filter
2. ✅ Should show only pending tickets
3. Select "High" from priority filter
4. ✅ Should show only high priority tickets
5. Clear filters
6. ✅ Should show all tickets again

### Test 5: View Ticket Details
1. Click "View" on any ticket
2. ✅ Modal should open
3. ✅ Should show user info, subject, message
4. ✅ Should show priority and status
5. ✅ Should show reply textarea (if not resolved)

### Test 6: Change Ticket Status
1. In ticket modal
2. Change status dropdown from "Pending" to "In Progress"
3. ✅ Status should save
4. Close and reopen modal
5. ✅ Status should persist

### Test 7: Send Response
1. Open a pending ticket
2. Type response in textarea
3. Click "Send Response"
4. ✅ Should show loading spinner
5. ✅ Should show success message
6. ✅ Ticket status should change to "Resolved"
7. ✅ Response should appear in ticket details

### Test 8: Empty State
1. If no tickets exist
2. ✅ Should show "No Tickets Found" message
3. ✅ Should show inbox icon

### Test 9: Refresh
1. Click "Refresh" button
2. ✅ Should reload tickets from server
3. ✅ Statistics should update

### Test 10: Land Officer Access Denied
1. Login as Land Officer
2. ❌ Should NOT see "Support Tickets" in sidebar
3. Try to navigate to `/support-tickets` manually
4. ❌ Should be blocked by route guard

---

## Priority Badge Colors

| Priority | Color | Badge Class |
|----------|-------|-------------|
| Low | Light Blue | `bg-info text-white` |
| Medium | Yellow | `bg-warning text-dark` |
| High | Red | `bg-danger text-white` |
| Urgent | Red | `bg-danger text-white` |

---

## Status Badge Colors

| Status | Color | Badge Class |
|--------|-------|-------------|
| Pending | Yellow | `bg-warning text-dark` |
| In Progress | Blue | `bg-primary text-white` |
| Resolved | Green | `bg-success text-white` |

---

## Files Created/Modified

### Created:
- ✅ `frontend/src/views/admin/SupportTicketsPage.vue` - Complete support tickets management page

### Modified:
- ✅ `frontend/src/components/Navbar.vue` - Added Support Tickets link
- ✅ `frontend/src/router/index.js` - Added support tickets route

---

## Next Steps (If Needed)

1. **Backend Endpoints**: Verify all endpoints exist and return correct data format
2. **Email Notifications**: Set up email sending when admin responds
3. **File Attachments**: Allow users to attach screenshots/files to tickets
4. **Ticket Assignment**: Assign specific tickets to specific admins
5. **Ticket History**: Show full conversation history if ticket has multiple responses
6. **Internal Notes**: Allow admins to add private notes to tickets
7. **Bulk Actions**: Select multiple tickets and change status in bulk
8. **Export**: Export tickets to CSV/PDF
9. **Analytics**: Add charts showing ticket trends over time

---

## Status: ✅ COMPLETE

Support Tickets feature successfully added to Administrator dashboard with full UI for viewing, filtering, and responding to user support requests.
