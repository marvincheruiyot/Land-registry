# Land Registry System - Dashboards Explained

## 📊 There are THREE Different Dashboards (One Per Role):

### 1. **Administrator Dashboard**
- **URL:** `http://localhost:3000/dashboard`
- **Route Path:** `/dashboard`
- **File:** `frontend/src/views/DashboardPage.vue`
- **Who Can Access:** Users with **Administrator** role
- **Login Redirect:** Administrators are automatically redirected here after login

**Features:**
- System-wide overview and statistics
- **Real-time Notifications Panel** (Only for Administrators)
  - Shows all system activities (logins, transfers, parcel registrations, etc.)
  - Auto-updates with audit log data
  - Includes activity icons and timestamps
- Parcel categorization with real data (Residential, Commercial, Agricultural)
- Recent transfers from database
- Quick action shortcuts (Verify Token, Search Registry, Upload Deed, Export Audit)
- Links to User Management, Land Parcels, Transfers, Documents, Reports, Settings

**Design:**
- Black, yellow, and white cards with system stats
- Real-time donut chart showing parcel distribution
- Notifications panel with live activity feed
- Professional Nikitin-style design with hover effects

---

### 2. **Land Officer Dashboard**
- **URL:** `http://localhost:3000/officer`
- **Route Path:** `/officer`
- **File:** `frontend/src/views/officer/OfficerDashboard.vue`
- **Who Can Access:** Users with **Land Officer** role
- **Login Redirect:** Land Officers are automatically redirected here after login

**Features:**
- Pending transfers overview
- Statistics: Total Parcels, Pending Transfers, Approved This Month, Documents Verified
- Quick actions: Register New Parcel, Initiate Transfer, Verify Document, Review Transfer
- Recent activity feed
- Full CRUD operations for parcels and transfers
- Approve/Reject transfer functionality

**Design:**
- Statistics cards with officer-specific metrics
- Pending transfers table
- Quick action modals
- Activity timeline
- Bootstrap-styled interface

---

### 3. **Land Owner Dashboard (User Dashboard)**
- **URL:** `http://localhost:3000/userdashboard`
- **Route Path:** `/userdashboard`
- **File:** `frontend/src/views/user/UserDashboard.vue`
- **Who Can Access:** Users with **Land Owner** role
- **Login Redirect:** Land Owners are automatically redirected here after login

**Features:**
- MY parcels overview (only parcels owned by logged-in user)
- MY transfer requests status
- Top action bar with: Search, Transfer Land, Verify buttons
- Notifications bell
- Quick actions: View Parcel Details, Initiate Transfer, View Documents
- Activity feed for personal transactions

**Design:**
- Personal statistics cards
- My Parcels table
- Transfer requests table
- Quick actions for land owners
- User-friendly interface focused on personal data

---

## 🔄 Role-Based Login Redirects

The system automatically redirects users after login based on their role:

| User Role | Login Email | Redirect URL | Dashboard Name |
|-----------|------------|--------------|----------------|
| **Administrator** | admin@landregistry.go.ke | `/dashboard` | Administrator Dashboard |
| **Land Officer** | officer@landregistry.go.ke | `/officer` | Land Officer Dashboard |
| **Land Owner** | (any land owner email) | `/userdashboard` | User Dashboard |

---

## 🔔 Notifications System

### Where Notifications Appear:

1. **Navbar (All Users):**
   - Bell icon with unread count badge
   - Dropdown showing recent activities
   - Auto-refreshes every 30 seconds
   - Mark as read functionality

2. **Administrator Dashboard Only:**
   - Dedicated **System Notifications Panel** replacing the Recent Transfers section
   - Shows ALL system activities for administrators:
     - User logins/logouts
     - User registrations
     - Parcel creations
     - Transfer initiations/approvals/rejections
     - Document uploads
     - Password changes
   - Real-time activity icons with color coding
   - Timestamp for each activity
   - Refresh button to manually update
   - Limited to latest 10 activities

### Notification Types and Icons:

| Action | Icon | Badge Color | Description |
|--------|------|-------------|-------------|
| LOGIN | 🔓 box-arrow-in-right | Success (Green) | User logged in |
| LOGOUT | 🔒 box-arrow-right | Secondary (Gray) | User logged out |
| USER_CREATED | 👤+ person-plus-fill | Primary (Blue) | New user registered |
| PARCEL_CREATED | 🗺️ map | Warning (Yellow) | New parcel added |
| TRANSFER_INITIATED | ↔️ arrow-left-right | Info (Cyan) | Transfer started |
| TRANSFER_APPROVED | ✅ check-circle-fill | Success (Green) | Transfer approved |
| TRANSFER_REJECTED | ❌ x-circle-fill | Danger (Red) | Transfer rejected |
| DOCUMENT_UPLOADED | 📄↑ file-earmark-arrow-up | Primary (Blue) | Document uploaded |
| PASSWORD_CHANGED | 🔑 key-fill | Warning (Yellow) | Password changed |
| PASSWORD_RESET | 🛡️🔒 shield-lock-fill | Danger (Red) | Password reset |

---

## 🎯 Key Features Per Dashboard

### Administrator Dashboard Features:
- ✅ System-wide statistics (all parcels, transfers, documents)
- ✅ **Real-time notifications panel** (UNIQUE TO ADMINS)
- ✅ Real parcel categorization from database
- ✅ Recent transfers with live data
- ✅ Verify Token shortcut
- ✅ Access to all management pages via sidebar
- ✅ System settings access

### Land Officer Dashboard Features:
- ✅ Pending transfers management
- ✅ Register new parcels
- ✅ Initiate transfers
- ✅ Verify documents
- ✅ Approve/Reject transfers
- ✅ Activity timeline

### Land Owner Dashboard Features:
- ✅ View MY parcels only
- ✅ View MY transfer requests
- ✅ Initiate new transfers
- ✅ Verify land ownership
- ✅ Search functionality
- ✅ Personal activity feed

---

## 📋 Data Sources

All dashboards now pull **REAL DATA** from the database:

1. **Parcel Categorization:**
   - Counts actual parcels by land use type (Residential, Commercial, Agricultural)
   - Calculates real percentages
   - Updates donut chart dynamically

2. **Recent Transfers:**
   - Fetches latest 4 transfers from database
   - Shows actual status (Pending, Approved, Rejected, In Review)
   - Displays real transferee names and parcel numbers

3. **Statistics:**
   - Parcels count: Actual count from database
   - Transfers count: Active transfers count
   - Documents count: Estimated as parcels × 2

4. **Notifications (Admin Only):**
   - Fetches from audit logs API
   - Shows latest 10 system activities
   - Real-time data from AuditLog collection

---

## 🚀 Getting Started

### As Administrator:
1. Login with: `admin@landregistry.go.ke`
2. You'll land on `/dashboard` (Administrator Dashboard)
3. View system statistics and notifications
4. Access management features from sidebar

### As Land Officer:
1. Login with: `officer@landregistry.go.ke`
2. You'll land on `/officer` (Land Officer Dashboard)
3. Manage pending transfers and parcels

### As Land Owner:
1. Login with your credentials
2. You'll land on `/userdashboard` (User Dashboard)
3. View and manage your parcels and transfers

---

## 🔧 System Settings

System Settings (Theme, Font Size, Language, etc.) are accessible via:
- **Sidebar navigation** (under Settings)
- **Only for Administrators**
- Located at route: `/settings`

---

**Last Updated:** September 21, 2026
