// Format currency values
import {format} from "date-fns";
import {appConst} from "./constant.js";

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
  switch (status) {
    case appConst.STATUS_ORDER.DANG_XU_LY.name:
      return 'warning';
    case appConst.STATUS_ORDER.DA_XU_LY.name:
      return 'info';
    case appConst.STATUS_ORDER.DANG_GIAO_HANG.name:
      return 'success';
    case appConst.STATUS_ORDER.DA_GIAO.name:
      return 'success';
    case appConst.STATUS_ORDER.DA_HUY.name:
      return 'error';
    default:
      return 'info';
  }
};