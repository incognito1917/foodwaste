const express = require('express');
const router = express.Router();
const {
  createDonation,
  getDonations,
  getAvailableDonations,
  getDonationById,
  acceptDonation,
  updateDonation,
  cancelDonation,
} = require('../controllers/donationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
  .post(protect, authorize('Donor'), createDonation)
  .get(getDonations);

router.get('/available', protect, authorize('NGO', 'Admin'), getAvailableDonations);

router.post('/:id/accept', protect, authorize('NGO'), acceptDonation);

router.route('/:id')
  .get(getDonationById)
  .put(protect, updateDonation)
  .delete(protect, cancelDonation);

module.exports = router;
