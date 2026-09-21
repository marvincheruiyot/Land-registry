# ⚡ Quick Start Guide - 5 Minutes Setup

## Step 1: Open Two Command Prompts

Press `Win + R`, type `cmd`, press Enter (do this twice to have 2 windows)

---

## Step 2: Start Backend (Command Prompt 1)

```bash
cd C:\Users\Administrator\Desktop\Land-Registry\backend

npm install

copy .env.example .env

net start MongoDB

npm run dev
```

**Wait for:** ✅ "Server running on port 5000"

---

## Step 3: Start Frontend (Command Prompt 2)

```bash
cd C:\Users\Administrator\Desktop\Land-Registry\frontend

npm install

echo VITE_API_URL=http://localhost:5000/api/v1 > .env

npm run dev
```

**Wait for:** ✅ "Local: http://localhost:3000/"

---

## Step 4: Open Browser

Go to: **http://localhost:3000**

---

## Step 5: Create Account & Login

1. Click "Register"
2. Fill form:
   - Name: Test User
   - Email: test@test.com
   - Phone: +254712345678
   - National ID: 12345678
   - Password: Test@123
   - Role: Land Owner
3. Click "Create Account"
4. Login with same credentials

---

## 🎉 Done!

You should now see the Dashboard.

---

## 🛑 To Stop:

Press `Ctrl + C` in both command prompts

---

## ⚠️ Troubleshooting:

**MongoDB error?**
```bash
mongod --dbpath C:\data\db
```

**Port busy?**
- Close other applications
- Or change port in `.env` file

**Module errors?**
```bash
npm install --force
```

---

**Full Guide:** See SETUP_GUIDE.md for detailed instructions
