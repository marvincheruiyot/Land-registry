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

// Land parcel management
router.get('/parcels', adminController.getAllParcels);
router.post('/parcels', adminController.createParcel);

// Dashboard stats
router.get('/dashboard', adminController.getDashboardStats);
router.get('/logs', adminController.getSystemLogs);
router.put('/config', adminController.updateSystemConfig);

module.exports = router;
