export const formatCurrency = (value) => {
  if (!value && value !== 0) return "0đ";
  return `${value.toLocaleString("vi-VN")} VNĐ`;
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
  if (status === 0) return "Chờ Thanh Toán";
  if (status === 1) return "Chờ xác Nhận";
  if (status === 2) return "Đang Giao";
  if (status === 3) return "Đợi người dùng xác nhận";
  if (status === 4) return "Đã Hủy";
  if (status === 5) return "Hoàn Thành";
  return "N/A";
};

export const getOrderStatusSeverity = (status) => {
  if (status === 0) return "warning";
  if (status === 1) return "info";
  if (status === 2) return "primary";
  if (status === 3) return "help";
  if (status === 4) return "danger";
  if (status === 5) return "success";
  return "secondary";
};
