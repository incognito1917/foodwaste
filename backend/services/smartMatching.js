const { calculateDistance, getAddressMatchScore } = require('../utils/geoUtils');

/**
 * Ranks available donations for an NGO or Volunteer based on urgency, proximity, and capacity.
 */
function rankDonationsForUser(donations, user) {
  const userLat = user?.location?.latitude;
  const userLon = user?.location?.longitude;
  const userAddress = user?.address || '';

  return donations.map((donation) => {
    let matchScore = 0;
    let distanceKm = null;

    // 1. Proximity Score (Max 40 pts)
    const donLat = donation.location?.latitude;
    const donLon = donation.location?.longitude;

    if (userLat && userLon && donLat && donLon) {
      distanceKm = calculateDistance(userLat, userLon, donLat, donLon);
      if (distanceKm !== null) {
        if (distanceKm < 5) matchScore += 40;
        else if (distanceKm < 15) matchScore += 30;
        else if (distanceKm < 30) matchScore += 20;
        else matchScore += 10;
      }
    } else {
      const addrScore = getAddressMatchScore(userAddress, donation.pickupAddress);
      matchScore += Math.round((addrScore / 100) * 40);
    }

    // 2. Urgency Score based on remaining availability (Max 40 pts)
    const now = new Date().getTime();
    const expiry = new Date(donation.availableUntil).getTime();
    const remainingHours = (expiry - now) / (1000 * 60 * 60);

    if (remainingHours <= 1 && remainingHours > 0) matchScore += 40; // High urgency!
    else if (remainingHours <= 3) matchScore += 30;
    else if (remainingHours <= 6) matchScore += 20;
    else matchScore += 10;

    // 3. Serving Capacity / Quantity bonus (Max 20 pts)
    if (donation.peopleServed >= 50) matchScore += 20;
    else if (donation.peopleServed >= 20) matchScore += 15;
    else matchScore += 10;

    const matchedReason =
      remainingHours <= 2
        ? 'Urgent Pickup Required'
        : distanceKm && distanceKm < 10
        ? `Nearby (${distanceKm} km away)`
        : 'High Capacity Meal';

    return {
      ...donation.toObject ? donation.toObject() : donation,
      matchScore: Math.min(100, matchScore),
      distanceKm,
      matchedReason,
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

module.exports = {
  rankDonationsForUser,
};
