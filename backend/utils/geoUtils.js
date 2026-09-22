/**
 * Calculates distance in kilometers between two GPS coordinates using Haversine formula.
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;

  const R = 6371; // Earth radius in KM
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Checks address string proximity score (0-100) if GPS coordinates are not provided.
 */
function getAddressMatchScore(addr1 = '', addr2 = '') {
  if (!addr1 || !addr2) return 50;
  const parts1 = addr1.toLowerCase().split(/[,\s]+/);
  const parts2 = addr2.toLowerCase().split(/[,\s]+/);
  const matches = parts1.filter((p) => p.length > 3 && parts2.includes(p));
  return matches.length > 0 ? 85 : 40;
}

module.exports = {
  calculateDistance,
  getAddressMatchScore,
};
