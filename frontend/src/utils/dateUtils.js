export function getRemainingTime(availableUntilStr) {
  if (!availableUntilStr) return { text: 'N/A', isExpired: false, urgent: false };

  const now = new Date().getTime();
  const expiry = new Date(availableUntilStr).getTime();
  const diff = expiry - now;

  if (diff <= 0) {
    return { text: 'Expired', isExpired: true, urgent: false };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return {
      text: `${hours}h ${minutes}m left`,
      isExpired: false,
      urgent: hours < 2,
    };
  }

  return {
    text: `${minutes}m remaining`,
    isExpired: false,
    urgent: true,
  };
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
