const express = require('express');
const router = express.Router();
const {
  getAdminStatistics,
  getAllUsers,
  toggleUserStatus,
  getAllDonationsAdmin,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect, authorize('Admin'));

router.get('/statistics', getAdminStatistics);
router.get('/users', getAllUsers);
router.put('/users/:id/status', toggleUserStatus);
router.get('/donations', getAllDonationsAdmin);

module.exports = router;
