export const formatDate = (dateString) => {
  if (!dateString) return "Chưa có thông tin";
  try {
    // Format từ YYYYMMDD hoặc YYYYMMDDHHmm
    if (dateString.length === 8) {
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      return `${day}/${month}/${year}`;
    } else if (dateString.length === 12) {
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      const hour = dateString.substring(8, 10);
      const minute = dateString.substring(10, 12);
      return `${day}/${month}/${year} `;
    }
    return dateString;
  } catch {
    return dateString;
  }
};

// Helper function để format số tiền
export const formatCurrency = (amount) => {
  if (!amount || amount === "0") return "0 VNĐ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const formatGender = (genderCode) => {
  switch (genderCode) {
    case "1":
      return "Nam";
    case "2":
      return "Nữ";
    default:
      return "Chưa có thông tin";
  }
};

// Helper function để format ngày giờ y tế
export const formatMedicalDateTime = (dateString) => {
  if (!dateString) return "Chưa có thông tin";
  try {
    if (dateString.length === 12) {
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      const hour = dateString.substring(8, 10);
      const minute = dateString.substring(10, 12);
      return `${day}/${month}/${year} ${hour}:${minute}`;
    }
    return dateString;
  } catch {
    return dateString;
  }
};
