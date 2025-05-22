// Format currency values
import {format} from "date-fns";

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format date values
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

// Format date with time
export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Format date BE
export const formatDateTimeBE = (dateString) => {
  const date = new Date(dateString);
  return dateString ? format(date, "yyyy-MM-dd") : null;
};

// Format status with color
export const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'delivered':
    case 'active':
      return 'success';
    case 'processing':
    case 'pending':
      return 'warning';
    case 'cancelled':
    case 'failed':
    case 'archived':
      return 'error';
    default:
      return 'info';
  }
};