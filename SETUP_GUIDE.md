# 🚀 Land Registry System - Complete Setup Guide

## Project Overview
**Secure Web-Based Land Registry System for Kenya**
- Backend: Node.js + Express.js + MongoDB
- Frontend: Vue.js 3 + Tailwind CSS
- Author: Cheruiyot, Marvin (169205) - Strathmore University

---

## 📋 Prerequisites

Before starting, ensure you have the following installed:

### 1. Node.js (v16 or higher)
Check if installed:
```bash
node --version
npm --version
```

If not installed, download from: https://nodejs.org/

### 2. MongoDB (v5 or higher)
Check if installed:
```bash
mongod --version
```

If not installed, download from: https://www.mongodb.com/try/download/community

### 3. Git (Optional but recommended)
```bash
git --version
```

---

## 🛠️ Installation Steps

### STEP 1: Setup Backend

1. Open Command Prompt or PowerShell as Administrator

2. Navigate to backend folder:
```bash
cd C:\Users\Administrator\Desktop\Land-Registry\backend
```

3. Install dependencies:
```bash
npm install
```

4. Create environment file:
```bash
copy .env.example .env
```

5. Open `.env` file with notepad and configure:
```bash
notepad .env
```

Update these values:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/land_registry_db
JWT_SECRET=your_super_secret_key_change_this_123456789
JWT_REFRESH_SECRET=your_refresh_secret_key_987654321
BCRYPT_ROUNDS=12
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@landregistry.go.ke
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

6. Start MongoDB Service:

**Option A - Windows Service:**
```bash
net start MongoDB
```

**Option B - Manual Start:**
```bash
mongod --dbpath "C:\data\db"
```

7. Verify MongoDB is running:
```bash
mongo --eval "db.version()"
```

### STEP 2: Setup Frontend

1. Open a NEW Command Prompt/PowerShell window

2. Navigate to frontend folder:
```bash
cd C:\Users\Administrator\Desktop\Land-Registry\frontend
```

3. Install dependencies:
```bash
npm install
```

4. Create environment file:
```bash
echo VITE_API_URL=http://localhost:5000/api/v1 > .env
```

---

## 🚀 Running the Application

### Start Backend Server

In the backend terminal:
```bash
npm run dev
```

You should see:
```
🚀 Land Registry API Server started on port 5000
📍 API Base URL: http://localhost:5000/api/v1
MongoDB Connected: localhost
```

### Start Frontend Server

In the frontend terminal (separate window):
```bash
npm run dev
```

You should see:
```
VITE v5.0.8  ready in XXX ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

---

## 🌐 Access the Application

### 1. Open your web browser (Chrome, Firefox, Edge)

### 2. Go to: **http://localhost:3000**

### 3. You should see the Home Page with:
- 🏘️ Land Registry logo
- "Secure Web-Based Land Registry System" heading
- Navigation menu (Home, Verify Land, Login, Register)
- Features section
- Statistics section

---

## 📱 Application Routes

### Public Pages (No Login Required)
- **Home**: http://localhost:3000/
- **Login**: http://localhost:3000/login
- **Register**: http://localhost:3000/register
- **Verify Land**: http://localhost:3000/verify
- **Forgot Password**: http://localhost:3000/forgot-password

### Protected Pages (Login Required)
- **Dashboard**: http://localhost:3000/dashboard
- **My Parcels**: http://localhost:3000/parcels
- **Transfers**: http://localhost:3000/transfers
- **Documents**: http://localhost:3000/documents
- **Profile**: http://localhost:3000/profile

### Admin Pages (Administrator Only)
- **Admin Dashboard**: http://localhost:3000/admin
- **Reports**: http://localhost:3000/reports

---

## 🧪 Testing the System

### 1. Create a Test User

1. Go to: http://localhost:3000/register
2. Fill in the form:
   - Full Name: John Doe
   - Email: john@test.com
   - Phone: +254712345678
   - National ID: 12345678
   - Password: Test@123
   - Confirm Password: Test@123
   - Role: Land Owner
3. Click "Create Account"

### 2. Login

1. Go to: http://localhost:3000/login
2. Enter credentials:
   - Email: john@test.com
   - Password: Test@123
3. Click "Login"

### 3. You'll be redirected to Dashboard

### 4. Test Public Verification

1. Go to: http://localhost:3000/verify
2. Try verifying a parcel (Note: You need to create a parcel first)

---

## 🔧 Troubleshooting

### Problem: MongoDB connection failed
**Solution:**
```bash
# Check if MongoDB is running
tasklist | findstr mongod

# If not running, start it:
net start MongoDB
```

### Problem: Port 5000 already in use
**Solution:**
```bash
# Find and kill the process
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Or change port in backend/.env
PORT=5001
```

### Problem: Port 3000 already in use
**Solution:**
```bash
# Find and kill the process
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### Problem: "npm" is not recognized
**Solution:**
- Restart your computer after installing Node.js
- Or add Node.js to PATH manually

### Problem: Module not found errors
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Problem: CORS errors in browser
**Solution:**
- Ensure backend is running on port 5000
- Check FRONTEND_URL in backend/.env is correct

---

## 📊 Default User Roles

### Land Owner (Citizens)
- View owned parcels
- Initiate transfers
- Upload documents
- Verify ownership

### Land Officer (Government Staff)
- All Land Owner features
- Register new parcels
- Approve/reject transfers
- Generate reports

### Administrator (System Admin)
- All features
- User management
- System configuration
- Access audit logs

---

## 🗂️ Project Structure

```
Land-Registry/
├── backend/                 # Node.js API
│   ├── config/             # Database config
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth, validation
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── utils/             # Helper functions
│   ├── server.js          # Entry point
│   └── package.json       # Dependencies
│
├── frontend/               # Vue.js App
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── views/         # Pages
│   │   ├── router/        # Navigation
│   │   ├── stores/        # State management
│   │   ├── services/      # API calls
│   │   └── assets/        # Styles, images
│   ├── index.html
│   └── package.json
│
└── README.md              # Documentation
```

---

## 🎯 API Endpoints

### Base URL: http://localhost:5000/api/v1

### Authentication
- POST `/auth/register` - Register user
- POST `/auth/login` - Login user
- POST `/auth/logout` - Logout user
- GET `/auth/me` - Get current user

### Land Parcels
- POST `/parcels` - Create parcel
- GET `/parcels` - Get all parcels
- GET `/parcels/:id` - Get parcel details
- PUT `/parcels/:id` - Update parcel

### Transfers
- POST `/transfers` - Initiate transfer
- GET `/transfers` - Get transfers
- PUT `/transfers/:id/approve` - Approve transfer
- PUT `/transfers/:id/reject` - Reject transfer

### Verification (Public)
- GET `/verify/token/:token` - Verify by token
- GET `/verify/parcel/:parcelNumber` - Verify by parcel

### Documents
- POST `/documents/upload` - Upload document
- GET `/documents/:id` - Get document
- GET `/documents/:id/download` - Download document

---

## 📧 Email Configuration (Optional)

To enable email notifications:

1. Use a Gmail account
2. Enable 2-Factor Authentication
3. Generate an App Password: https://myaccount.google.com/apppasswords
4. Update backend/.env:
```env
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=your_16_character_app_password
```

---

## 🔒 Security Features

- JWT authentication with refresh tokens
- Bcrypt password hashing (cost factor 12)
- Rate limiting (100 requests/minute)
- Input validation and sanitization
- CORS protection
- Helmet security headers
- MongoDB injection prevention
- XSS protection

---

## 📝 Testing Checklist

- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Home page loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Dashboard displays after login
- [ ] Navigation menu works
- [ ] Public verification page accessible
- [ ] MongoDB connection successful

---

## 🆘 Need Help?

### Check Logs

**Backend logs:**
- Look in `backend/logs/` folder
- Check terminal output

**Browser Console:**
- Press F12 in browser
- Check Console tab for errors

### Common Commands

**Stop servers:**
- Press `Ctrl + C` in terminal

**Restart servers:**
- Re-run `npm run dev`

**Check running processes:**
```bash
# Windows
tasklist | findstr node
tasklist | findstr mongod
```

**Clear browser cache:**
- Press `Ctrl + Shift + Delete`
- Clear cache and cookies

---

## 🎓 Academic Project Information

**Title:** Secure Web-Based Land Registry System for Kenya
**Student:** Cheruiyot, Marvin (169205)
**Program:** BBIT 4D
**Institution:** Strathmore University
**Supervisor:** Mr. Isaac Kigen
**Year:** 2026

---

## ✅ Success Indicators

You'll know everything is working when:

1. ✅ Backend shows: "Server running on port 5000"
2. ✅ Frontend shows: "Local: http://localhost:3000/"
3. ✅ Browser opens home page without errors
4. ✅ You can register and login
5. ✅ Dashboard displays your information

---

## 📞 Support

For technical issues:
- Check troubleshooting section above
- Review error messages in terminal
- Check browser console (F12)

---

**Happy Testing! 🚀**

The system is now ready for demonstration and evaluation.
