const Donation = require('../models/Donation');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { rankDonationsForUser } = require('../services/smartMatching');
const { autoCheckExpiries } = require('../services/expiryChecker');

// @desc    Create a new food donation
// @route   POST /api/donations
// @access  Private (Donor only)
const createDonation = async (req, res) => {
  try {
    const {
      foodName,
      category,
      quantity,
      unit,
      peopleServed,
      preparationTime,
      availableUntil,
      pickupAddress,
      description,
      image,
      location,
    } = req.body;

    if (!foodName || !category || !quantity || !peopleServed || !availableUntil || !pickupAddress) {
      return res.status(400).json({ message: 'Please fill in all required donation fields' });
    }

    const donation = await Donation.create({
      donorId: req.user._id,
      foodName,
      category,
      quantity,
      unit: unit || 'kg',
      peopleServed,
      preparationTime: preparationTime || new Date(),
      availableUntil,
      pickupAddress,
      description: description || '',
      image: image || '',
      location: location || req.user.location || { latitude: 0, longitude: 0 },
      status: 'PENDING',
    });

    // Notify all active NGOs about new available donation
    const ngos = await User.find({ role: 'NGO', isActive: true });
    for (const ngo of ngos) {
      await Notification.create({
        userId: ngo._id,
        message: `New food donation available: "${foodName}" (${quantity} ${unit || 'kg'}) at ${pickupAddress}.`,
        type: 'SYSTEM',
        link: `/ngo/dashboard`,
      });
    }

    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all donations (Filterable)
// @route   GET /api/donations
// @access  Public / Private
const getDonations = async (req, res) => {
  try {
    await autoCheckExpiries();
    const { status, category, donorId } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (donorId) filter.donorId = donorId;

    const donations = await Donation.find(filter)
      .populate('donorId', 'name email phone organizationName address')
      .populate('ngoId', 'name email phone organizationName')
      .populate('volunteerId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get available donations for NGOs (with Smart Matching)
// @route   GET /api/donations/available
// @access  Private / Public
const getAvailableDonations = async (req, res) => {
  try {
    await autoCheckExpiries();
    const now = new Date();

    const donations = await Donation.find({
      status: 'PENDING',
      availableUntil: { $gt: now },
    }).populate('donorId', 'name email phone organizationName address location');

    // Apply Smart Matching priority if user context available
    const ranked = rankDonationsForUser(donations, req.user);

    res.json(ranked);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single donation by ID
// @route   GET /api/donations/:id
// @access  Public / Private
const getDonationById = async (req, res) => {
  try {
    await autoCheckExpiries();
    const donation = await Donation.findById(req.params.id)
      .populate('donorId', 'name email phone organizationName address location')
      .populate('ngoId', 'name email phone organizationName address')
      .populate('volunteerId', 'name email phone');

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    NGO Accepts an available food donation
// @route   POST /api/donations/:id/accept
// @access  Private (NGO only)
const acceptDonation = async (req, res) => {
  try {
    await autoCheckExpiries();
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (donation.status === 'EXPIRED' || new Date() > new Date(donation.availableUntil)) {
      donation.status = 'EXPIRED';
      await donation.save();
      return res.status(400).json({ message: 'This food donation has expired and cannot be accepted' });
    }

    if (donation.status !== 'PENDING') {
      return res.status(400).json({ message: `Donation cannot be accepted as it is currently ${donation.status}` });
    }

    donation.status = 'ACCEPTED';
    donation.ngoId = req.user._id;
    donation.acceptedAt = new Date();
    await donation.save();

    // Create notification for Donor
    await Notification.create({
      userId: donation.donorId,
      message: `Your food donation "${donation.foodName}" has been ACCEPTED by NGO: ${req.user.organizationName || req.user.name}.`,
      type: 'DONATION_ACCEPTED',
      link: `/donor/dashboard`,
    });

    // Create notification for Volunteers (pickup opportunity)
    const volunteers = await User.find({ role: 'Volunteer', isActive: true });
    for (const vol of volunteers) {
      await Notification.create({
        userId: vol._id,
        message: `New pickup request available for food: "${donation.foodName}" at ${donation.pickupAddress}.`,
        type: 'SYSTEM',
        link: `/volunteer/dashboard`,
      });
    }

    res.json({ message: 'Donation accepted successfully', donation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update donation details (Donor)
// @route   PUT /api/donations/:id
// @access  Private (Donor/Admin)
const updateDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (donation.donorId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to edit this donation' });
    }

    Object.assign(donation, req.body);
    await donation.save();

    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel food donation (Donor)
// @route   DELETE /api/donations/:id
// @access  Private (Donor/Admin)
const cancelDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (donation.donorId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this donation' });
    }

    donation.status = 'CANCELLED';
    await donation.save();

    res.json({ message: 'Donation cancelled successfully', donation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDonation,
  getDonations,
  getAvailableDonations,
  getDonationById,
  acceptDonation,
  updateDonation,
  cancelDonation,
};
