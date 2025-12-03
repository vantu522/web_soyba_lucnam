import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { changePassword } from "../../services/user.login";
import { toast } from "react-toastify";
import logo from "../../assets/logo.jpg";

const ChangePassword = ({ cccd, token, onPasswordChanged, onBack }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate password
    if (newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);

    try {
      // Gọi API đổi mật khẩu với token
      const response = await changePassword(cccd, newPassword, token);
      
      if (response && response.success) {
        toast.success("Đổi mật khẩu thành công!");
        onPasswordChanged();
      } else {
        setError(response?.message || "Có lỗi xảy ra khi đổi mật khẩu");
        toast.error(response?.message || "Có lỗi xảy ra khi đổi mật khẩu");
      }
    } catch (err) {
      console.error("Error changing password:", err);
      const errorMessage = err.response?.data?.message || "Có lỗi xảy ra khi đổi mật khẩu";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full sm:min-h-screen bg-linear-to-br">
      <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-12 md:py-16">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          {/* <img
            src={logo}
            alt="Sổ Y bạ Lục Nam"
            className="mx-auto mb-4 sm:mb-6 w-24 h-24 sm:w-32 sm:h-32 object-contain"
          /> */}
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 px-2">
            Đổi Mật Khẩu
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            Đây là lần đầu tiên bạn đăng nhập. Vui lòng đổi mật khẩu để tiếp tục.
          </p>
        </div>

        <div className="max-w-2xl mx-auto px-2 sm:px-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-green-100">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {error && (
                <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm sm:text-base">
                  {error}
                </div>
              )}

              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  CCCD
                </label>
                <input
                  type="text"
                  value={cccd}
                  disabled
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-200 rounded-lg sm:rounded-xl bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)..."
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-0 transition-colors pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                      <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
                    )}
                  </button>
                </div>
              </div>

              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới..."
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-0 transition-colors pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                      <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xử lý...
                  </div>
                ) : (
                  <div className="flex items-center cursor-pointer justify-center">
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                    Đổi mật khẩu
                  </div>
                )}
              </button>

              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-200 text-sm sm:text-base"
                >
                  Quay lại
                </button>
              )}
            </form>
          </div>

          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-xs sm:text-sm text-gray-500 px-2">
              Mật khẩu phải có ít nhất 6 ký tự
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;