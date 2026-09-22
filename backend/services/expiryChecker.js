const Donation = require('../models/Donation');
const Notification = require('../models/Notification');

/**
 * Checks all non-terminal donations in DB and updates any past availableUntil to EXPIRED status.
 */
async function autoCheckExpiries() {
  try {
    const now = new Date();
    const expiredDonations = await Donation.find({
      status: { $in: ['PENDING', 'ACCEPTED', 'PICKUP_ASSIGNED'] },
      availableUntil: { $lt: now },
    });

    for (const donation of expiredDonations) {
      donation.status = 'EXPIRED';
      await donation.save();

      // Notify donor
      await Notification.create({
        userId: donation.donorId,
        message: `Your food donation "${donation.foodName}" has passed its availability time and is marked EXPIRED.`,
        type: 'EXPIRY_WARNING',
      });
    }

    if (expiredDonations.length > 0) {
      console.log(`Auto-expired ${expiredDonations.length} overdue donation(s).`);
    }
  } catch (error) {
    console.error('Error in autoCheckExpiries:', error.message);
  }
}

module.exports = {
  autoCheckExpiries,
};
