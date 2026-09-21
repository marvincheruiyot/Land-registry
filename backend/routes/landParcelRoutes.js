const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const landParcelController = require('../controllers/landParcelController');

router.post('/', protect, authorize('Land_Officer', 'Administrator'), landParcelController.createParcel);
router.get('/', protect, landParcelController.getAllParcels);
router.get('/my-parcels', protect, landParcelController.getUserParcels);
router.get('/:id', protect, landParcelController.getParcelById);
router.put('/:id', protect, authorize('Land_Officer', 'Administrator'), landParcelController.updateParcel);
router.delete('/:id', protect, authorize('Administrator'), landParcelController.deleteParcel);
router.post('/:id/flag', protect, authorize('Land_Officer', 'Administrator'), landParcelController.flagParcel);

module.exports = router;
