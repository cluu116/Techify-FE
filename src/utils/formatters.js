export const formatCurrency = (value) => {
  if (!value && value !== 0) return "0đ";
  return `${value.toLocaleString("vi-VN")}đ`;
};

export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (!(date instanceof Date) || isNaN(date)) return "N/A";

  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

export const getOrderStatusName = (status) => {
  if (status === 0) return "Chờ Xác Nhận";
  if (status === 1) return "Đang Giao";
  if (status === 2) return "Đã Giao";
  if (status === 3) return "Đã Hủy";
  return "N/A";
};

export const getOrderStatusSeverity = (status) => {
  if (status === 0) return "primary";
  if (status === 1) return "info";
  if (status === 2) return "success";
  if (status === 3) return "danger";
  return "secondary";
};

export const calculateFinalTotal = (total, discount) => {
  if (!total) return 0;
  return total - (discount || 0);
};
