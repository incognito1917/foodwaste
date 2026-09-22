const express = require('express');
const router = express.Router();
const {
  getAvailablePickups,
  acceptPickup,
  updatePickupStatus,
} = require('../controllers/pickupController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/available', protect, authorize('Volunteer', 'Admin'), getAvailablePickups);
router.post('/:id/accept', protect, authorize('Volunteer'), acceptPickup);
router.put('/:id/status', protect, authorize('Volunteer', 'Admin'), updatePickupStatus);

module.exports = router;
