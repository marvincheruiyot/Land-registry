# Land Registry Admin Dashboard - Quick Start Guide

## 🔐 Admin Login Credentials

To access the Admin Dashboard, you must login with Administrator credentials:

```
Email: admin@landregistry.go.ke
Password: Password@123
```

## 📋 Steps to Access Admin Dashboard

### Step 1: Start the Servers

**Backend Server:**
```bash
cd backend
npm start
```
Server runs on: `http://localhost:5000`

**Frontend Server:**
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:5173`

### Step 2: Login as Administrator

1. Open your browser and go to: `http://localhost:5173`
2. Click on **"Login"** button
3. Enter the admin credentials:
   - **Email:** `admin@landregistry.go.ke`
   - **Password:** `Password@123`
4. Click **"Sign In"**

### Step 3: Access Admin Dashboard

After successful login:
1. Navigate to: `http://localhost:5173/admin/dashboard`
2. Or click on "Admin Dashboard" link if available in the navigation

## ✅ Admin Dashboard Features

### 1. **User Management**
- **Create New Users:** Click "New User" button
  - Fill in: Full Name, Email, Phone, National ID, Password, Role, Address
  - Roles: Land Owner, Land Officer, Administrator
- **Search Users:** Type in search box (searches name, email, or national ID)
- **Filter Users:** 
  - By Role: All Roles, Administrator, Land Officer, Land Owner
  - By Status: All Status, Active, Inactive
- **Activate/Deactivate:** Click button next to each user

### 2. **Land Parcel Management**
- **Register New Parcels:** Click "Register New Parcel" button
  - Required fields:
    - Parcel Number (e.g., NAI/KIL/2024/001)
    - County (select from dropdown)
    - Latitude & Longitude
    - Size in Acres
    - Current Owner (select from users)
    - Land Use
  - Optional: Sub-County, Ward, Location Description, Boundaries, Notes
- **Search Parcels:** Search by parcel number or title deed
- **Filter Parcels:** Filter by county
- **View All Parcels:** See all registered parcels with owner details

### 3. **Dashboard Statistics**
- Total Users
- Total Land Parcels
- Active Transfers
- System Uptime

## 🗂️ Other Default User Accounts

### Land Officer Account
```
Email: officer@landregistry.go.ke
Password: Password@123
Role: Land_Officer
```

### Land Owner Account
```
Email: owner@landregistry.go.ke  
Password: Password@123
Role: Land_Owner
```

## 🔧 Troubleshooting

### 401 Unauthorized Error
**Problem:** You see "401 Unauthorized" or "Failed to load resource"
**Solution:** 
1. You need to login first
2. Make sure you're logged in with Administrator account
3. Clear browser cache and localStorage: `localStorage.clear()`
4. Re-login with admin credentials

### 403 Forbidden Error
**Problem:** You see "403 Forbidden" or "Access Denied"
**Solution:**
1. You're logged in but NOT as Administrator
2. Logout from current account
3. Login with admin credentials: `admin@landregistry.go.ke`

### Cannot Access Admin Routes
**Problem:** Admin dashboard shows errors or blank page
**Solution:**
1. Check if backend server is running: `http://localhost:5000`
2. Check browser console for errors (F12)
3. Verify you're logged in as Administrator
4. Check if MongoDB is running

## 📊 Database Information

- **Database:** MongoDB
- **Connection:** Check `backend/.env` file for `MONGODB_URI`
- All data is persisted in MongoDB collections:
  - `users` - User accounts
  - `landparcels` - Land parcels
  - `transfers` - Transfer requests
  - `auditlogs` - System audit logs

## 🎯 API Endpoints (for reference)

### Admin Endpoints (require Administrator role)
```
GET    /api/v1/admin/users          - List all users
POST   /api/v1/admin/users          - Create new user
GET    /api/v1/admin/parcels        - List all parcels
POST   /api/v1/admin/parcels        - Register new parcel
PUT    /api/v1/admin/users/:id/activate   - Activate user
PUT    /api/v1/admin/users/:id/deactivate - Deactivate user
GET    /api/v1/admin/dashboard      - Get dashboard stats
```

## 💡 Tips

1. **Always login as Administrator** to access admin features
2. **Use Search** to quickly find users or parcels
3. **Check Audit Logs** to monitor system activities
4. **Regular Backups** - Admin can view backup status in Settings
5. **User Roles Matter** - Only Administrators can access admin dashboard

## 📞 Support

If you encounter issues:
1. Check the browser console (F12) for error messages
2. Check backend logs in `backend/logs/` directory
3. Verify all required services are running (MongoDB, Backend, Frontend)
4. Ensure you're using the correct credentials

---

**Last Updated:** September 20, 2026
**System Version:** 1.0.0
