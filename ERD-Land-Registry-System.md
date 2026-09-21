# Entity Relationship Diagram (ERD)
## Land Registry System - Database Schema

---

## Entities and Relationships

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              USER                                       │
├─────────────────────────────────────────────────────────────────────────┤
│ PK  _id: ObjectId                                                       │
│     fullName: String                                                    │
│     email: String (unique)                                              │
│     phoneNumber: String                                                 │
│     nationalId: String (unique)                                         │
│     password: String (hashed)                                           │
│     role: Enum [Land_Owner, Land_Officer, Administrator]                │
│     physicalAddress: String                                             │
│     isActive: Boolean                                                   │
│     isEmailVerified: Boolean                                            │
│     emailVerificationToken: String                                      │
│     passwordResetToken: String                                          │
│     passwordResetExpires: Date                                          │
│     lastLogin: Date                                                     │
│     failedLoginAttempts: Number                                         │
│     accountLockedUntil: Date                                            │
│ FK  createdBy: ObjectId → User._id                                      │
│     timestamps: {createdAt, updatedAt}                                  │
└─────────────────────────────────────────────────────────────────────────┘
         │                          │                        │
         │ owns                     │ registers              │ creates
         │ (1:N)                    │ (1:N)                  │ (1:N)
         ▼                          ▼                        ▼
┌─────────────────────────┐  ┌─────────────────┐  ┌────────────────────┐
│     LAND PARCEL         │  │   AUDIT LOG     │  │  NOTIFICATION      │
├─────────────────────────┤  ├─────────────────┤  ├────────────────────┤
│ PK  _id: ObjectId       │  │ PK _id: ObjectId│  │ PK _id: ObjectId   │
│     parcelNumber: String│  │ FK user: User   │  │ FK recipient: User │
│     title: String       │  │    action: Enum │  │    type: Enum      │
│     location: {         │  │    entityType   │  │    title: String   │
│       county            │  │    entityId     │  │    message: String │
│       subCounty         │  │    description  │  │    relatedEntity   │
│       ward              │  │    changes      │  │    isRead: Boolean │
│       description       │  │    ipAddress    │  │    readAt: Date    │
│       coordinates: {    │  │    userAgent    │  │    emailSent       │
│         latitude        │  │    severity     │  │    emailSentAt     │
│         longitude       │  │    metadata     │  │    priority: Enum  │
│       }                 │  │    timestamp    │  │    timestamps      │
│     }                   │  └─────────────────┘  └────────────────────┘
│     sizeInAcres: Number │
│ FK  currentOwner: User  │
│     ownershipHistory[]  │
│     status: Enum        │
│     verificationToken   │
│     titleDeedNumber     │
│     landUse: Enum       │
│ FK  registeredBy: User  │
│     registrationDate    │
│ FK  lastModifiedBy: User│
│     isFlagged: Boolean  │
│     flagReason: String  │
│     flaggedAt: Date     │
│ FK  flaggedBy: User     │
│ FK  documents[]: Document
│     boundaries: {}      │
│     surveyDate: Date    │
│     notes: String       │
│     timestamps          │
└─────────────────────────┘
         │
         │ has
         │ (1:N)
         ▼
┌──────────────────────────────────────────────┐
│              TRANSFER                        │
├──────────────────────────────────────────────┤
│ PK  _id: ObjectId                            │
│ FK  landParcel: LandParcel._id               │
│ FK  previousOwner: User._id                  │
│ FK  newOwner: User._id                       │
│ FK  initiatedBy: User._id                    │
│     status: Enum [pending, approved,         │
│                   rejected, cancelled]       │
│     transferType: Enum [sale, gift,          │
│                  inheritance, subdivision,   │
│                  court_order, other]         │
│     transferAmount: Number                   │
│ FK  documents[]: Document._id                │
│     initiatedDate: Date                      │
│ FK  processedBy: User._id                    │
│     processedDate: Date                      │
│     approvalNotes: String                    │
│     rejectionReason: String                  │
│     verificationChecks: {                    │
│       ownershipVerified: Boolean             │
│       documentsVerified: Boolean             │
│       paymentVerified: Boolean               │
│       surveyConducted: Boolean               │
│     }                                         │
│     notificationsSent: {}                    │
│     remindersSent: Number                    │
│     lastReminderDate: Date                   │
│     timestamps: {createdAt, updatedAt}       │
└──────────────────────────────────────────────┘
         │
         │ has
         │ (1:N)
         ▼
┌──────────────────────────────────────────────────────────────┐
│                        DOCUMENT                              │
├──────────────────────────────────────────────────────────────┤
│ PK  _id: ObjectId                                            │
│     documentType: Enum [title_deed, survey_map,              │
│                   identification, transfer_agreement,        │
│                   payment_receipt, court_order, other]       │
│     fileName: String                                         │
│     originalName: String                                     │
│     mimeType: Enum [pdf, jpeg, png, tiff]                    │
│     fileSize: Number                                         │
│     filePath: String                                         │
│     checksum: String                                         │
│     isEncrypted: Boolean                                     │
│ FK  uploadedBy: User._id                                     │
│     relatedEntity: {                                         │
│       entityType: Enum [LandParcel, Transfer, User]          │
│       entityId: ObjectId                                     │
│     }                                                         │
│     verificationToken: String                                │
│     version: Number                                          │
│     previousVersions[]: Array                                │
│     accessLog[]: [{                                          │
│       accessedBy: User._id                                   │
│       accessedAt: Date                                       │
│       action: Enum                                           │
│       ipAddress: String                                      │
│     }]                                                        │
│     isPublic: Boolean                                        │
│     description: String                                      │
│     tags[]: String                                           │
│     timestamps: {createdAt, updatedAt}                       │
└──────────────────────────────────────────────────────────────┘
```

---

## Relationships Summary

### 1. USER Relationships
- **USER ↔ USER** (Self-referencing)
  - One user can create other users (createdBy)
  
- **USER → LAND PARCEL** (One-to-Many)
  - One user can own multiple land parcels (currentOwner)
  - One user can register multiple land parcels (registeredBy)
  - One user can modify multiple land parcels (lastModifiedBy)
  - One user can flag multiple land parcels (flaggedBy)

- **USER → TRANSFER** (One-to-Many)
  - One user can be previous owner in multiple transfers (previousOwner)
  - One user can be new owner in multiple transfers (newOwner)
  - One user can initiate multiple transfers (initiatedBy)
  - One user can process multiple transfers (processedBy)

- **USER → DOCUMENT** (One-to-Many)
  - One user can upload multiple documents (uploadedBy)
  - One user can access multiple documents (accessLog)

- **USER → AUDIT LOG** (One-to-Many)
  - One user can have multiple audit log entries (user)

- **USER → NOTIFICATION** (One-to-Many)
  - One user can receive multiple notifications (recipient)

### 2. LAND PARCEL Relationships
- **LAND PARCEL → USER** (Many-to-One)
  - Many land parcels belong to one user (currentOwner)

- **LAND PARCEL → TRANSFER** (One-to-Many)
  - One land parcel can have multiple transfers

- **LAND PARCEL → DOCUMENT** (One-to-Many)
  - One land parcel can have multiple documents (documents array)

### 3. TRANSFER Relationships
- **TRANSFER → LAND PARCEL** (Many-to-One)
  - Many transfers belong to one land parcel

- **TRANSFER → USER** (Many-to-One relationships)
  - Many transfers have one previousOwner
  - Many transfers have one newOwner
  - Many transfers have one initiator
  - Many transfers have one processor

- **TRANSFER → DOCUMENT** (One-to-Many)
  - One transfer can have multiple documents

### 4. DOCUMENT Relationships
- **DOCUMENT → USER** (Many-to-One)
  - Many documents uploaded by one user

- **DOCUMENT → LAND PARCEL/TRANSFER/USER** (Polymorphic)
  - Documents can be related to LandParcel, Transfer, or User
  - Uses relatedEntity.entityType and relatedEntity.entityId

### 5. AUDIT LOG Relationships
- **AUDIT LOG → USER** (Many-to-One)
  - Many audit logs belong to one user

- **AUDIT LOG → Any Entity** (Polymorphic)
  - Can reference any entity via entityType and entityId

### 6. NOTIFICATION Relationships
- **NOTIFICATION → USER** (Many-to-One)
  - Many notifications sent to one user

- **NOTIFICATION → Any Entity** (Polymorphic)
  - Can reference any entity via relatedEntity

---

## Cardinality Notation

```
1:1   = One-to-One
1:N   = One-to-Many
N:M   = Many-to-Many (via junction table or embedded arrays)
```

---

## Key Features

### Indexes
- **USER**: email, nationalId, role, isActive
- **LAND PARCEL**: parcelNumber, verificationToken, titleDeedNumber, currentOwner, status, coordinates (2dsphere), county, registrationDate, isFlagged
- **TRANSFER**: landParcel, previousOwner, newOwner, status, initiatedDate, processedBy
- **DOCUMENT**: relatedEntity, uploadedBy, documentType, verificationToken, createdAt
- **AUDIT LOG**: user+timestamp, entityType+entityId, action, timestamp, severity, ipAddress (with TTL)
- **NOTIFICATION**: recipient+createdAt, isRead, type, emailSent+emailDeliveryStatus (with TTL)

### Constraints
- **Unique**: User.email, User.nationalId, LandParcel.parcelNumber, LandParcel.verificationToken, LandParcel.titleDeedNumber
- **Enums**: Defined for role, status, transferType, documentType, action types, notification types
- **Validations**: Email format, phone number format, national ID format, GPS coordinates within Kenya boundaries, file size limits
- **Business Rules**: Only one pending transfer per land parcel, account locking after failed login attempts

### Special Features
- **Soft Delete**: User.isActive
- **Audit Trail**: Complete audit logging with IP addresses and user agents
- **Document Versioning**: Previous versions tracked
- **Document Access Log**: Who accessed what and when
- **Auto TTL**: Audit logs (10 years), Notifications (90 days)
- **Geospatial**: 2dsphere index for location-based queries
- **Token-based Verification**: For land parcels and documents

---

## Database: MongoDB (NoSQL)
## ODM: Mongoose

---

**Generated for**: Land Registry System - Kenya
**Date**: 2026-09-12
**Student**: Cheruiyot, Marvin (169205)
**Institution**: Strathmore University - BBIT 4D
