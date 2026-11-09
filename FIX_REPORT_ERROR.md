# Fix Report Generation Error

## Error
```
ReportsPage.vue:461 Generate report error: AxiosError: Request failed with status code 500
```

## Cause
The backend server is running old code and needs to be restarted to load the new PDF generation changes.

## Solution

### Step 1: Stop Backend Server
In the terminal running the backend:
- Press `Ctrl + C` to stop the server

### Step 2: Restart Backend Server
```bash
cd backend
npm run dev
```

### Step 3: Test Report Generation
1. Go to http://localhost:3000/reports
2. Select a report type (e.g., "Daily Title Registrations")
3. Choose date range
4. Click "Generate Official Report"
5. PDF should download successfully

## If Still Not Working

### Check Backend Logs
Look at the terminal where backend is running for error messages.

### Common Issues:

**1. PDFKit not installed:**
```bash
cd backend
npm install pdfkit
```

**2. Missing dependencies:**
```bash
cd backend
npm install
```

**3. Database connection issue:**
- Check MongoDB is running
- Verify `.env` file has correct `MONGODB_URI`

### Test Backend is Running
Open: http://localhost:5000/api/v1/reports/statistics

Should return JSON with today's counts.

## Expected Result
After restarting backend, report generation should work and PDFs will show individual records in properly formatted tables.
