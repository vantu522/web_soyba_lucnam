import React, { useState, useEffect } from "react";
import { loginUser } from "../../services/user.login";
import { getHealthRecordsListByCCCD } from "../../services/health_record";
import { toast } from "react-toastify";
import HealthRecordSearch from "./HealthRecordSearch";
import HealthRecordList from "./HealthRecordList";
import HealthRecordDetail from "./HealthRecordDetail";
import ChangePassword from "./ChangePassword";

const HealthRecordLookup = () => {
  const [currentView, setCurrentView] = useState("login"); // 'login', 'changePassword', 'records', 'detail'
  const [cccd, setCccd] = useState("");
  const [token, setToken] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (cccdInput, password) => {
    setLoading(true);
    setError(null);

    try {
      const res = await loginUser(cccdInput, password);
      console.log("Login Response:", res);
      if (res && res.success) {
        setCccd(cccdInput);
        
        // Lưu token từ response
        let accessToken = "";
        if (res.token) {
          accessToken = res.token;
        } else if (res.data?.token) {
          accessToken = res.data.token;
        }
        
        if (accessToken) {
          setToken(accessToken);
          // Lưu token vào localStorage để sử dụng cho các API khác
          localStorage.setItem('accessToken', accessToken);
        }
        
        // Kiểm tra nếu là người dùng mới hoặc cần đổi mật khẩu
        console.log("mustChangePassword:", res.user?.mustChangePassword);
        console.log("isNewUser:", res.user?.isNewUser);
        console.log("accessToken:", accessToken);
        
        if (res.user?.mustChangePassword === false || res.data?.isNewUser === true) {
          setCurrentView("changePassword");
          toast.info("Vui lòng đổi mật khẩu để tiếp tục");
        } else {
          // Đăng nhập thành công, lấy danh sách hồ sơ với token
          if (accessToken) {
            await fetchHealthRecords( accessToken);
          } else {
            toast.error("Không thể lấy token từ server");
          }
        }
      } else {
        setError(res?.message || "Đăng nhập không thành công");
        toast.error(res?.message || "Đăng nhập không thành công");
      }
    } catch (err) {
      console.error("Login Error:", err);
      const errorMessage = err.response?.data?.message || "Sai CCCD hoặc mật khẩu";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchHealthRecords = async (accessToken) => {
    setLoading(true);
    try {
      const res = await getHealthRecordsListByCCCD( accessToken);

      if (res && res?.data && res?.data.length > 0) {
        setHealthRecords(res.data);
        setCurrentView("records");
        toast.success(`Tìm thấy ${res.data.length} hồ sơ khám bệnh`);
      } else {
        setHealthRecords([]);
        setError("Không tìm thấy hồ sơ khám bệnh nào");
        toast.info("Không tìm thấy hồ sơ khám bệnh nào");
        setCurrentView("records");
      }
    } catch (err) {
      console.error("API Error:", err);
      setHealthRecords([]);
      const errorMessage = err.response?.data?.message || "Có lỗi xảy ra khi tìm kiếm hồ sơ";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChanged = async () => {
    toast.success("Đổi mật khẩu thành công!");
    // Sau khi đổi mật khẩu thành công, lấy danh sách hồ sơ
    await fetchHealthRecords(cccd, token);
  };

  const handleBackToLogin = () => {
    setCurrentView("login");
    setCccd("");
    setToken("");
    setHealthRecords([]);
    setError(null);
    // Xóa token khỏi localStorage khi logout
    localStorage.removeItem('accessToken');
  };

  const handleViewDetail = (record) => {
    setSelectedRecord(record);
    setCurrentView("detail");
  };

  const handleBackToList = () => {
    setCurrentView("records");
    setSelectedRecord(null);
  };

  return (
    <div className="px-2 sm:px-4 md:px-8 lg:px-20 py-3 sm:py-5">
      {currentView === "login" && (
        <HealthRecordSearch
          onLogin={handleLogin}
          loading={loading}
          error={error}
        />
      )}

      {currentView === "changePassword" && (
        <ChangePassword
          cccd={cccd}
          token={token}
          onPasswordChanged={handlePasswordChanged}
          onBack={handleBackToLogin}
        />
      )}

      {currentView === "records" && (
        <HealthRecordList
          searchCCCD={cccd}
          healthRecords={healthRecords}
          loading={loading}
          onBack={handleBackToLogin}
          onViewDetail={handleViewDetail}
        />
      )}

      {currentView === "detail" && (
        <HealthRecordDetail
          selectedRecord={selectedRecord}
          token={token}
          onBack={handleBackToList}
        />
      )}
    </div>
  );
};

export default HealthRecordLookup;
