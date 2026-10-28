# Role Management Feature

## Overview
Administrators can now change user roles directly from the User Management page using an interactive dropdown menu.

## Implementation Details

### Backend Changes

**File: `backend/controllers/adminController.js`**
- Enhanced `updateUserRole()` function with:
  - ✅ Role validation (Land_Owner, Land_Officer, ADMINISTRATOR)
  - ✅ Prevent self-role changes
  - ✅ Prevent removing last administrator
  - ✅ Audit logging for all role changes
  - ✅ Automatic notification to user whose role was changed
  - ✅ Returns old and new role in response

**File: `backend/routes/adminRoutes.js`**
- ✅ Route already exists: `PUT /admin/users/:id/role`
- ✅ Protected by `authorize('Administrator')` middleware

### Frontend Changes

**File: `frontend/src/views/admin/UserManagement.vue`**

**Added Features:**
1. **Role Dropdown in User Table**
   - Replaced static role badge with interactive dropdown
   - Shows current role with icon
   - Three options: Land Owner, Land Officer, Administrator
   - Visual checkmark for current role

2. **Role Change Confirmation Modal**
   - Beautiful modal instead of basic confirm dialog
   - Shows current role → new role transition
   - Warning icon and information message
   - Cancel and Confirm buttons

3. **Helper Functions**
   - `changeUserRole()` - Opens modal with role change details
   - `confirmRoleChange()` - Executes the role change via API
   - `formatRole()` - Formats role names for display
   - `getRoleIcon()` - Returns appropriate icon for each role

4. **Styling**
   - Custom dropdown styling with hover effects
   - Active role highlighting
   - Smooth transitions
   - Icons for each role type

## Security Features

### Backend Security
- ✅ **Self-protection**: Users cannot change their own role
- ✅ **Last admin protection**: Cannot remove last administrator
- ✅ **Role validation**: Only valid roles accepted
- ✅ **Admin-only access**: Only administrators can change roles
- ✅ **Audit logging**: Every role change is logged with details
- ✅ **User notification**: User receives notification about role change

### Frontend Security
- ✅ **Confirmation required**: Modal confirmation before role change
- ✅ **Visual feedback**: Shows current vs new role clearly
- ✅ **Error handling**: Displays error messages from backend

## How to Use

### As Administrator:

1. **Navigate to User Management**
   - Go to `/users` (User Management page)
   - You'll see a table of all users

2. **Change User Role**
   - Click the role dropdown button for any user
   - Select new role from dropdown (Land Owner, Land Officer, Administrator)
   - Confirmation modal appears
   - Review the change (old role → new role)
   - Click "Confirm Change" to apply

3. **What Happens**
   - Role changes immediately
   - User receives notification
   - Change is logged in audit trail
   - User table updates automatically

## Role Descriptions

| Role | Icon | Description | Permissions |
|------|------|-------------|-------------|
| **Land Owner** | 👤 | Regular citizen who owns land | View own parcels, initiate transfers, manage documents |
| **Land Officer** | 🎖️ | Government land office staff | Manage all parcels, approve transfers, verify documents |
| **Administrator** | 🛡️ | System administrator | Full system access, user management, system settings |

## API Endpoint

### Change User Role
```
PUT /admin/users/:userId/role
```

**Request Body:**
```json
{
  "newRole": "ADMINISTRATOR"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "User role updated successfully",
  "data": {
    "user": { ... },
    "oldRole": "Land_Owner",
    "newRole": "ADMINISTRATOR"
  }
}
```

**Error Responses:**
- `400` - Invalid role
- `403` - Cannot change own role
- `400` - Cannot remove last administrator
- `404` - User not found

## Notifications

When a role is changed, the affected user receives:
- **Type**: ROLE_CHANGED
- **Priority**: HIGH
- **Title**: "Your Role Has Been Updated"
- **Message**: Details about the change

## Audit Trail

Every role change creates an audit log entry:
- **Action**: ROLE_CHANGED
- **Resource**: User
- **Details**: Changed role from X to Y for user NAME (EMAIL)
- **Performer**: Administrator who made the change
- **Timestamp**: When the change occurred
- **IP Address**: Administrator's IP

## Testing Checklist

- ✅ Admin can change Land Owner to Land Officer
- ✅ Admin can change Land Officer to Administrator
- ✅ Admin can change Administrator to Land Owner (if not last admin)
- ✅ Admin cannot change their own role
- ✅ Cannot remove last administrator
- ✅ Modal shows correct old and new roles
- ✅ Dropdown shows checkmark on current role
- ✅ Role icons display correctly
- ✅ Notification sent to user
- ✅ Audit log created
- ✅ User table updates after change

## Future Enhancements (Optional)

1. **Bulk Role Changes**: Select multiple users and change roles at once
2. **Role History**: Show complete role change history for each user
3. **Temporary Roles**: Assign roles with expiration dates
4. **Custom Roles**: Create custom roles with specific permissions
5. **Role Templates**: Save role configurations as templates

## Files Modified

### Backend
1. `backend/controllers/adminController.js` - Enhanced updateUserRole function
2. `backend/routes/adminRoutes.js` - Route already existed

### Frontend
1. `frontend/src/views/admin/UserManagement.vue` - Added role dropdown and modal

## Notes

- Role names in database: `Land_Owner`, `Land_Officer`, `ADMINISTRATOR`
- Role names in UI: "Land Owner", "Land Officer", "Administrator"
- Old code also used `Administrator` (without underscore) - both are handled
