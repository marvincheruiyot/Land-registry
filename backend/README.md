# Land Registry System - Backend API

Secure Web-Based Land Registry System for Kenya - Backend Application

## Author
**Cheruiyot, Marvin** - 169205  
BBIT 4D - Strathmore University

## Description
This is the backend API for the Secure Web-Based Land Registry System designed to enhance transparency and efficiency in land administration in Kenya.

## Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcrypt
- **File Handling**: Multer
- **Email**: Nodemailer
- **Security**: Helmet, express-rate-limit, express-validator
- **Documentation**: PDF generation with PDFKit

## Features
- User authentication and authorization (JWT-based)
- Role-based access control (Land Owner, Land Officer, Administrator)
- Land parcel registration and management
- Land transfer processing with approval workflows
- Document management with encryption
- Real-time ownership verification
- Comprehensive audit trail (10-year retention)
- Email notifications
- Report generation
- Fraud detection and prevention
- Security features (rate limiting, input validation, encryption)

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn package manager

### Steps

1. Clone the repository
```bash
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
   - MongoDB connection string
   - JWT secrets
   - Email configuration
   - Other environment variables

5. Start MongoDB service
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

6. Run the server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password/:token` - Reset password
- `POST /api/v1/auth/change-password` - Change password
- `GET /api/v1/auth/verify-email/:token` - Verify email
- `GET /api/v1/auth/me` - Get current user

### Land Parcels
- `POST /api/v1/parcels` - Create land parcel (Land Officer, Admin)
- `GET /api/v1/parcels` - Get all parcels
- `GET /api/v1/parcels/:id` - Get parcel by ID
- `PUT /api/v1/parcels/:id` - Update parcel (Land Officer, Admin)
- `DELETE /api/v1/parcels/:id` - Delete parcel (Admin)
- `GET /api/v1/parcels/my-parcels` - Get user's parcels
- `POST /api/v1/parcels/:id/flag` - Flag parcel (Land Officer, Admin)

### Transfers
- `POST /api/v1/transfers` - Initiate transfer
- `GET /api/v1/transfers` - Get all transfers
- `GET /api/v1/transfers/:id` - Get transfer by ID
- `PUT /api/v1/transfers/:id/approve` - Approve transfer (Land Officer, Admin)
- `PUT /api/v1/transfers/:id/reject` - Reject transfer (Land Officer, Admin)
- `PUT /api/v1/transfers/:id/cancel` - Cancel transfer

### Documents
- `POST /api/v1/documents/upload` - Upload document
- `GET /api/v1/documents/:id` - Get document
- `GET /api/v1/documents/:id/download` - Download document
- `DELETE /api/v1/documents/:id` - Delete document (Land Officer, Admin)

### Verification (Public)
- `GET /api/v1/verify/token/:token` - Verify by token
- `GET /api/v1/verify/parcel/:parcelNumber` - Verify by parcel number

### Audit Logs
- `GET /api/v1/audit` - Get audit logs (Admin)
- `GET /api/v1/audit/:id` - Get audit log by ID (Admin)
- `GET /api/v1/audit/parcel/:parcelId` - Get parcel history

### Reports
- `POST /api/v1/reports/generate` - Generate report (Land Officer, Admin)
- `GET /api/v1/reports` - Get reports (Land Officer, Admin)
- `GET /api/v1/reports/:id/download` - Download report (Land Officer, Admin)

### Admin
- `GET /api/v1/admin/users` - Get all users
- `GET /api/v1/admin/users/:id` - Get user by ID
- `PUT /api/v1/admin/users/:id/role` - Update user role
- `PUT /api/v1/admin/users/:id/deactivate` - Deactivate user
- `PUT /api/v1/admin/users/:id/activate` - Activate user
- `GET /api/v1/admin/dashboard` - Get dashboard statistics
- `GET /api/v1/admin/logs` - Get system logs
- `PUT /api/v1/admin/config` - Update system configuration

## Database Models

1. **User** - User accounts with authentication
2. **LandParcel** - Land parcel information
3. **Transfer** - Land transfer requests
4. **Document** - Document storage and management
5. **AuditLog** - Comprehensive audit trail
6. **Notification** - User notifications

## Security Features

- JWT-based authentication
- Password hashing with bcrypt (cost factor 12)
- Role-based access control (RBAC)
- Rate limiting (100 requests per minute)
- Input validation and sanitization
- Helmet for HTTP headers security
- HTTPS/TLS encryption
- AES-256 document encryption
- Account lockout after failed login attempts
- Audit logging for all actions

## Project Structure

```
backend/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleware/       # Custom middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── utils/           # Utility functions
├── uploads/         # Uploaded files
├── logs/            # Application logs
├── .env.example     # Environment variables template
├── .gitignore       # Git ignore rules
├── package.json     # Dependencies
├── server.js        # Entry point
└── README.md        # Documentation
```

## Testing

Run tests:
```bash
npm test
```

## License
ISC

## Contact
For questions or support, contact the project supervisor: Mr. Isaac Kigen

---
**Strathmore University**  
School of Computing and Engineering Sciences  
May 2026
