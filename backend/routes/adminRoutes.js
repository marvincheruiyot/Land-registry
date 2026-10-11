const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

router.use(protect, authorize('Administrator'));

// User management
router.get('/users', adminController.getAllUsers);
router.post('/users', adminController.createUser);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id/role', adminController.updateUserRole);
router.put('/users/:id/deactivate', adminController.deactivateUser);
router.put('/users/:id/activate', adminController.activateUser);
router.delete('/users/:id', adminController.deleteUser);

// Land parcel management
router.get('/parcels', adminController.getAllParcels);
router.post('/parcels', adminController.createParcel);

// Dashboard stats
router.get('/dashboard', adminController.getDashboardStats);
router.get('/logs', adminController.getSystemLogs);
router.put('/config', adminController.updateSystemConfig);

// Fix parcel ownership (debugging/admin tool)
router.post('/fix-ownership', adminController.fixParcelOwnership);

// Debug: Check user and parcel status
router.get('/debug-parcels', adminController.debugUserParcels);

module.exports = router;
