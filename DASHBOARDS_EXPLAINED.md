# Land Registry System - Dashboards Explained

## 📊 There are TWO Different Dashboards:

### 1. **Regular User Dashboard** (For Everyone)
- **URL:** `http://localhost:5173/dashboard`
- **Route Path:** `/dashboard`
- **File:** `frontend/src/views/DashboardPage.vue`
- **Who Can Access:** All logged-in users (Land Owners, Land Officers, Administrators)

**Features:**
- Personal overview of YOUR land parcels
- YOUR transfer requests
- YOUR documents
- YOUR notifications
- Quick verify functionality
- Links to manage YOUR own data

**Design:**
- Has the shared Navbar component at the top
- Shows "Welcome back, [Your Name]"
- Personal statistics and data
- Black, yellow, and white cards with your stats

---

### 2. **Admin Dashboard** (Administrators Only)
- **URL:** `http://localhost:5173/admin`
- **Route Path:** `/admin`
- **File:** `frontend/src/views/admin/AdminDashboard.vue`
- **Who Can Access:** ONLY users with Administrator role

**Features:**
- Manage ALL users in the system
- Create new users (any role)
- Activate/Deactivate users
- View and manage ALL land parcels system-wide
- Register new land parcels for any owner
- Search and filter across entire database
- System-wide statistics
- System monitoring
- Generate reports
- System settings

**Design:**
- Dedicated admin sidebar (no shared navbar)
- Left sidebar with: Admin Overview, User Management, Land Parcels, Transfers, Monitoring, Reports, Settings
- "Exit Admin" button to go back to regular dashboard
- System-wide data and controls

---

## 🔄 How to Switch Between Dashboards

### When logged in as Administrator:

**From Regular Dashboard → Admin Dashboard:**
1. Click the yellow **"Admin Panel"** button at the top right
2. Or navigate to: `http://localhost:5173/admin`

**From Admin Dashboard → Regular Dashboard:**
1. Click **"Exit Admin"** button in the sidebar
2. Or navigate to: `http://localhost:5173/dashboard`

---

## 🎯 Quick Access Guide

### You are logged in as Administrator, so you can:

1. **See your personal data:**
   - Go to `/dashboard`
   - View your owned parcels
   - Manage your transfers

2. **Manage the entire system:**
   - Click "Admin Panel" button OR go to `/admin`
   - Create users, register parcels for anyone
   - View all system data
   - Monitor system health

---

## 📋 Summary Table

| Feature | Regular Dashboard | Admin Dashboard |
|---------|------------------|-----------------|
| **URL** | `/dashboard` | `/admin` |
| **Access** | All users | Administrators only |
| **Data Scope** | Personal data | System-wide data |
| **Navigation** | Shared Navbar | Dedicated Sidebar |
| **Can Create Users** | ❌ No | ✅ Yes |
| **Can Register Parcels for Others** | ❌ No | ✅ Yes |
| **View All Users** | ❌ No | ✅ Yes |
| **View All Parcels** | ❌ No (only yours) | ✅ Yes |
| **System Settings** | ❌ No | ✅ Yes |

---

## 💡 Tips

- **After login:** You land on Regular Dashboard by default
- **To access Admin features:** Click "Admin Panel" button (only visible to Administrators)
- **To go back:** Click "Exit Admin" in the admin sidebar
- **Both dashboards are available to you** as an Administrator
- **Regular users** (Land Owners, Land Officers) can ONLY see Regular Dashboard

---

## 🔐 Current Login

You are logged in as:
```
Email: admin@landregistry.go.ke
Role: Administrator
```

You have access to BOTH dashboards!

---

**Last Updated:** September 20, 2026
