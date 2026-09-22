const User = require('../models/User');
const Donation = require('../models/Donation');
const Pickup = require('../models/Pickup');
const { autoCheckExpiries } = require('../services/expiryChecker');

// @desc    Get Admin Dashboard Statistics & Analytics
// @route   GET /api/admin/statistics
// @access  Private (Admin only)
const getAdminStatistics = async (req, res) => {
  try {
    await autoCheckExpiries();

    const totalUsers = await User.countDocuments();
    const totalDonors = await User.countDocuments({ role: 'Donor' });
    const totalNgos = await User.countDocuments({ role: 'NGO' });
    const totalVolunteers = await User.countDocuments({ role: 'Volunteer' });

    const totalDonations = await Donation.countDocuments();
    const pendingDonations = await Donation.countDocuments({ status: 'PENDING' });
    const acceptedDonations = await Donation.countDocuments({ status: 'ACCEPTED' });
    const deliveredDonations = await Donation.countDocuments({ status: 'DELIVERED' });
    const expiredDonations = await Donation.countDocuments({ status: 'EXPIRED' });

    // Aggregate statistics
    const deliveredItems = await Donation.find({ status: 'DELIVERED' });
    const foodDistributed = deliveredItems.reduce((sum, d) => sum + (d.quantity || 0), 0);
    const peopleHelped = deliveredItems.reduce((sum, d) => sum + (d.peopleServed || 0), 0);

    const successfulPickups = await Pickup.countDocuments({ status: 'DELIVERED' });

    // Status breakdown for Recharts Pie Chart
    const statusDistribution = [
      { name: 'Pending', value: pendingDonations, color: '#f59e0b' },
      { name: 'Accepted', value: acceptedDonations, color: '#3b82f6' },
      { name: 'Delivered', value: deliveredDonations, color: '#10b981' },
      { name: 'Expired', value: expiredDonations, color: '#ef4444' },
    ];

    // User breakdown for Recharts Bar Chart
    const userDistribution = [
      { role: 'Donors', count: totalDonors, color: '#10b981' },
      { role: 'NGOs', count: totalNgos, color: '#f59e0b' },
      { role: 'Volunteers', count: totalVolunteers, color: '#6366f1' },
    ];

    // Monthly donations aggregation (last 6 months)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const allDonationsList = await Donation.find();
    
    const monthlyMap = {};
    allDonationsList.forEach((d) => {
      const monthStr = monthNames[new Date(d.createdAt).getMonth()];
      if (!monthlyMap[monthStr]) {
        monthlyMap[monthStr] = { month: monthStr, donations: 0, delivered: 0 };
      }
      monthlyMap[monthStr].donations += 1;
      if (d.status === 'DELIVERED') monthlyMap[monthStr].delivered += 1;
    });

    const donationsByMonth = Object.values(monthlyMap);

    res.json({
      totalUsers,
      totalDonors,
      totalNgos,
      totalVolunteers,
      totalDonations,
      foodDistributed,
      peopleHelped,
      successfulPickups,
      statusDistribution,
      userDistribution,
      donationsByMonth,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin only)
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ message: `User status updated to ${user.isActive ? 'Active' : 'Inactive'}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all donations (Admin monitoring)
// @route   GET /api/admin/donations
// @access  Private (Admin only)
const getAllDonationsAdmin = async (req, res) => {
  try {
    await autoCheckExpiries();
    const donations = await Donation.find()
      .populate('donorId', 'name email phone organizationName')
      .populate('ngoId', 'name email phone organizationName')
      .populate('volunteerId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminStatistics,
  getAllUsers,
  toggleUserStatus,
  getAllDonationsAdmin,
};
