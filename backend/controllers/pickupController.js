const Donation = require('../models/Donation');
const Pickup = require('../models/Pickup');
const Notification = require('../models/Notification');
const { autoCheckExpiries } = require('../services/expiryChecker');

// @desc    Get available pickup requests for Volunteers
// @route   GET /api/pickups/available
// @access  Private (Volunteer / Admin)
const getAvailablePickups = async (req, res) => {
  try {
    await autoCheckExpiries();
    const now = new Date();

    const pickups = await Donation.find({
      status: 'ACCEPTED',
      availableUntil: { $gt: now },
    })
      .populate('donorId', 'name email phone organizationName address location')
      .populate('ngoId', 'name email phone organizationName address location')
      .sort({ createdAt: -1 });

    res.json(pickups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Volunteer accepts a pickup request
// @route   POST /api/pickups/:id/accept
// @access  Private (Volunteer only)
const acceptPickup = async (req, res) => {
  try {
    await autoCheckExpiries();
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (donation.status !== 'ACCEPTED') {
      return res.status(400).json({ message: `Pickup cannot be accepted. Donation status is ${donation.status}` });
    }

    if (new Date() > new Date(donation.availableUntil)) {
      donation.status = 'EXPIRED';
      await donation.save();
      return res.status(400).json({ message: 'Donation has expired and cannot be picked up' });
    }

    donation.status = 'PICKUP_ASSIGNED';
    donation.volunteerId = req.user._id;
    await donation.save();

    // Create or update Pickup record
    let pickup = await Pickup.findOne({ donationId: donation._id });
    if (!pickup) {
      pickup = await Pickup.create({
        donationId: donation._id,
        volunteerId: req.user._id,
        ngoId: donation.ngoId,
        status: 'ASSIGNED',
      });
    } else {
      pickup.volunteerId = req.user._id;
      pickup.status = 'ASSIGNED';
      await pickup.save();
    }

    // Notify Donor
    await Notification.create({
      userId: donation.donorId,
      message: `Volunteer ${req.user.name} (${req.user.phone}) has accepted pickup for "${donation.foodName}".`,
      type: 'PICKUP_ASSIGNED',
      link: `/donor/dashboard`,
    });

    // Notify NGO
    await Notification.create({
      userId: donation.ngoId,
      message: `Volunteer ${req.user.name} has been assigned to transport food: "${donation.foodName}".`,
      type: 'PICKUP_ASSIGNED',
      link: `/ngo/dashboard`,
    });

    res.json({ message: 'Pickup assigned successfully', donation, pickup });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update status of a pickup (PICKED_UP or DELIVERED)
// @route   PUT /api/pickups/:id/status
// @access  Private (Volunteer / Admin)
const updatePickupStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'PICKED_UP' or 'DELIVERED'

    if (!['PICKED_UP', 'DELIVERED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status update. Must be PICKED_UP or DELIVERED' });
    }

    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    donation.status = status;
    if (status === 'DELIVERED') {
      donation.deliveredAt = new Date();
    }
    await donation.save();

    // Update Pickup document
    const pickup = await Pickup.findOne({ donationId: donation._id });
    if (pickup) {
      if (status === 'PICKED_UP') {
        pickup.pickupTime = new Date();
        pickup.status = 'IN_TRANSIT';
      } else if (status === 'DELIVERED') {
        pickup.deliveryTime = new Date();
        pickup.status = 'DELIVERED';
      }
      await pickup.save();
    }

    // Notifications
    if (status === 'PICKED_UP') {
      await Notification.create({
        userId: donation.donorId,
        message: `Volunteer has collected your donated food "${donation.foodName}" and is in transit.`,
        type: 'FOOD_PICKED_UP',
      });
      await Notification.create({
        userId: donation.ngoId,
        message: `Food "${donation.foodName}" has been collected from donor and is on the way.`,
        type: 'FOOD_PICKED_UP',
      });
    } else if (status === 'DELIVERED') {
      await Notification.create({
        userId: donation.donorId,
        message: `🎉 Great news! Your donated food "${donation.foodName}" has been successfully delivered to the NGO!`,
        type: 'FOOD_DELIVERED',
      });
      await Notification.create({
        userId: donation.ngoId,
        message: `Food "${donation.foodName}" (${donation.quantity} ${donation.unit}) has been delivered successfully.`,
        type: 'FOOD_DELIVERED',
      });
    }

    res.json({ message: `Donation status updated to ${status}`, donation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAvailablePickups,
  acceptPickup,
  updatePickupStatus,
};
