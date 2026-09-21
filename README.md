# Secure Web-Based Land Registry System for Kenya

A comprehensive land administration system designed to enhance transparency and efficiency in Kenya's land registry operations.

## Project Information

**Title**: A Secure Web-Based Land Registry System for Enhancing Transparency and Efficiency in Kenya

**Author**: Cheruiyot, Marvin (169205)  
**Program**: BBIT 4D  
**Institution**: Strathmore University  
**School**: Computing and Engineering Sciences  
**Supervisor**: Mr. Isaac Kigen  
**Year**: May 2026

## Project Overview

This system addresses critical challenges in Kenya's land administration including:
- Manual/semi-digital systems causing delays
- Lack of transparency leading to corruption
- Fake title deeds and double allocation
- Poor record management
- Difficult verification processes
- Limited public access to land information

## Features

### Core Functionality
- **User Management**: Registration, authentication, role-based access control
- **Land Parcel Registration**: Digital land record creation and management
- **Ownership Management**: Comprehensive ownership tracking and history
- **Land Transfer Processing**: Secure ownership transfer workflows
- **Document Management**: Encrypted storage of title deeds and supporting documents
- **Real-Time Verification**: Public API for ownership verification
- **Audit Trail**: 10-year comprehensive activity logging
- **Fraud Prevention**: Duplicate detection, suspicious activity monitoring
- **Report Generation**: PDF, CSV, Excel reports for stakeholders
- **Email Notifications**: Automated alerts for key events

### Security Features
- JWT-based authentication with refresh tokens
- Bcrypt password hashing (cost factor 12)
- AES-256 document encryption
- Role-based access control (RBAC)
- Rate limiting (100 requests/minute)
- Input validation and sanitization
- HTTPS/TLS encryption
- Account lockout after failed attempts
- Comprehensive audit logging

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, bcrypt
- **Email**: Nodemailer
- **File Upload**: Multer
- **PDF Generation**: PDFKit
- **Security**: Helmet, express-rate-limit, express-validator

### Frontend
- **Framework**: Vue.js 3 (Composition API)
- **State Management**: Pinia
- **Routing**: Vue Router
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Validation**: Vuelidate

## System Architecture

**3-Tier Architecture:**
1. **Presentation Layer**: Vue.js frontend (responsive web interface)
2. **Application Layer**: Node.js/Express.js API (business logic, authentication)
3. **Data Layer**: MongoDB database (land records, users, audit logs)

## Installation & Setup

### Prerequisites
- Node.js v16 or higher
- MongoDB v5 or higher
- npm or yarn package manager

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:5000/api/v1" > .env
npm run dev
```

Frontend will run on `http://localhost:3000`

## User Roles

1. **Land Owner** (Citizens)
   - View owned parcels
   - Initiate transfers
   - Verify ownership
   - Manage documents

2. **Land Officer** (Government Officials)
   - Register new parcels
   - Approve/reject transfers
   - Generate reports
   - Verify documents

3. **Administrator** (System Admins)
   - All Land Officer permissions
   - User management
   - System configuration
   - Access audit logs

## API Endpoints

### Authentication
- POST `/api/v1/auth/register` - Register user
- POST `/api/v1/auth/login` - Login
- POST `/api/v1/auth/logout` - Logout
- POST `/api/v1/auth/refresh-token` - Refresh token
- POST `/api/v1/auth/forgot-password` - Request password reset
- GET `/api/v1/auth/me` - Get current user

### Land Parcels
- POST `/api/v1/parcels` - Create parcel (Officer/Admin)
- GET `/api/v1/parcels` - List parcels
- GET `/api/v1/parcels/:id` - Get parcel details
- PUT `/api/v1/parcels/:id` - Update parcel (Officer/Admin)

### Transfers
- POST `/api/v1/transfers` - Initiate transfer
- PUT `/api/v1/transfers/:id/approve` - Approve transfer (Officer/Admin)
- PUT `/api/v1/transfers/:id/reject` - Reject transfer (Officer/Admin)

### Verification (Public)
- GET `/api/v1/verify/token/:token` - Verify by token
- GET `/api/v1/verify/parcel/:parcelNumber` - Verify by parcel number

## Project Structure

```
Land-Registry/
├── backend/              # Node.js/Express backend
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── server.js        # Entry point
│   └── package.json
│
├── frontend/            # Vue.js frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── router/      # Routing configuration
│   │   ├── stores/      # Pinia state stores
│   │   ├── views/       # Page components
│   │   ├── services/    # API services
│   │   └── main.js      # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .kiro/               # Kiro spec files
│   └── specs/
│       └── land-registry-system/
│           ├── requirements.md
│           └── .config.kiro
│
└── README.md            # This file
```

## Development Methodology

**Prototyping Model** with the following phases:
1. Requirements Gathering and Analysis
2. Quick System Design
3. Prototype Development
4. Prototype Evaluation and Refinement
5. Final Development and Implementation
6. System Testing (Unit, Integration, System, Security, UAT)

**Design Approach**: Object-Oriented Analysis and Design (OOAD) with UML diagrams

## Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## System Requirements

### Functional Requirements
- User registration and authentication
- Land parcel registration and management
- Ownership transfer workflows
- Document upload and storage
- Real-time verification
- Audit trail logging
- Report generation

### Non-Functional Requirements
- **Security**: JWT authentication, encryption, RBAC
- **Performance**: 99.5% uptime, <3s response times
- **Scalability**: Support 500+ concurrent users
- **Reliability**: Automated daily backups
- **Usability**: Responsive design, mobile-friendly

## Limitations
- Prototype system (not nationwide deployment)
- Requires internet connectivity
- Limited to land registration/verification (excludes valuation/taxation)
- Sample data for testing purposes

## Future Enhancements
- GIS integration for boundary mapping
- Mobile applications (iOS/Android)
- Blockchain integration for immutable records
- AI-powered fraud detection
- Multi-language support (Swahili)
- Integration with other government systems

## License
ISC

## Acknowledgements
- Almighty God
- Mr. Isaac Kigen (Project Supervisor)
- School of Computing and Engineering Sciences, Strathmore University
- Family and friends for support

## Contact
For questions or support regarding this project, please contact:
- **Student**: Cheruiyot, Marvin (169205)
- **Supervisor**: Mr. Isaac Kigen
- **Institution**: Strathmore University

---

**© 2026 Kenya Land Registry System. All rights reserved.**  
**Strathmore University - School of Computing and Engineering Sciences**
