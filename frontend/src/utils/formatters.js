export const formatCurrency = (value, currency = 'USD') => {
  if (value === null || value === undefined) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value);
};

export const formatNumber = (value) => {
  if (value === null || value === undefined) return '0';
  return new Intl.NumberFormat('en-US').format(value);
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export const formatTime = (date) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};
