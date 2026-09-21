# Land Registry System - Frontend

Secure Web-Based Land Registry System for Kenya - Frontend Application

## Author
**Cheruiyot, Marvin** - 169205  
BBIT 4D - Strathmore University

## Description
This is the frontend application for the Secure Web-Based Land Registry System built with Vue.js 3.

## Technology Stack
- **Framework**: Vue.js 3 (Composition API)
- **State Management**: Pinia
- **Routing**: Vue Router
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Validation**: Vuelidate

## Features
- User authentication (Login/Register)
- Role-based dashboards (Land Owner, Land Officer, Administrator)
- Land parcel management
- Transfer processing
- Real-time ownership verification
- Document management
- Notifications
- Reports generation
- Responsive design (mobile-friendly)

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Steps

1. Navigate to frontend directory
```bash
cd frontend
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
# Create .env file
echo "VITE_API_URL=http://localhost:5000/api/v1" > .env
```

4. Start development server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
frontend/
├── public/           # Static assets
├── src/
│   ├── assets/      # Images, styles
│   ├── components/  # Reusable components
│   ├── router/      # Vue Router configuration
│   ├── services/    # API services
│   ├── stores/      # Pinia stores
│   ├── views/       # Page components
│   ├── App.vue      # Root component
│   └── main.js      # Entry point
├── index.html       # HTML template
├── vite.config.js   # Vite configuration
├── tailwind.config.js # Tailwind configuration
└── package.json     # Dependencies
```

## Available Routes

### Public Routes
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/verify` - Public verification page
- `/forgot-password` - Password reset request
- `/reset-password/:token` - Password reset
- `/verify-email/:token` - Email verification

### Protected Routes (Requires Authentication)
- `/dashboard` - User dashboard
- `/profile` - User profile
- `/parcels` - Land parcels list
- `/parcels/create` - Create new parcel (Land Officer/Admin only)
- `/parcels/:id` - Parcel details
- `/transfers` - Transfers list
- `/transfers/create` - Initiate transfer
- `/documents` - Documents list
- `/reports` - Reports (Land Officer/Admin only)
- `/admin` - Admin dashboard (Administrator only)

## User Roles

1. **Land Owner** - Citizens who own land
   - View owned parcels
   - Initiate transfers
   - Verify ownership
   - Manage documents

2. **Land Officer** - Government officials
   - Register new parcels
   - Approve/reject transfers
   - Generate reports
   - Verify documents

3. **Administrator** - System administrators
   - All Land Officer permissions
   - User management
   - System configuration
   - Access audit logs

## Environment Variables

Create a `.env` file with:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

## License
ISC

## Contact
For questions or support, contact the project supervisor: Mr. Isaac Kigen

---
**Strathmore University**  
School of Computing and Engineering Sciences  
May 2026
