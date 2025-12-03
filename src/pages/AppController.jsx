import React, { useState } from "react";
import { loginUser } from "../services/user.login";
import { getHealthRecordsListByCCCD } from "../services/health_record";
import { toast } from "react-toastify";

// Import các page components
import { Login, ChangePassword } from "./Auth";
import Dashboard from "./Dashboard/Dashboard";
import MedicalRecordDetail from "./MedicalRecord/MedicalRecordDetail";

const AppController = () => {
  const [currentView, setCurrentView] = useState("login"); // 'login', 'changePassword', 'dashboard', 'detail'
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
          localStorage.setItem('accessToken', accessToken);
        }
        
        console.log("mustChangePassword:", res.user?.mustChangePassword);
        console.log("isNewUser:", res.data?.isNewUser);
        console.log("accessToken:", accessToken);
        
        // Kiểm tra nếu là người dùng mới hoặc cần đổi mật khẩu
        if (res.user?.mustChangePassword === false || res.data?.isNewUser === true) {
          setCurrentView("changePassword");
          toast.info("Vui lòng đổi mật khẩu để tiếp tục");
        } else {
          // Đăng nhập thành công, lấy danh sách hồ sơ với token
          if (accessToken) {
            await fetchHealthRecords(cccdInput, accessToken);
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

  const fetchHealthRecords = async (cccdInput, accessToken) => {
    setLoading(true);
    try {
      const res = await getHealthRecordsListByCCCD(cccdInput, accessToken);

      if (res && res?.data && res?.data.length > 0) {
        setHealthRecords(res.data);
        setCurrentView("dashboard");
        toast.success(`Tìm thấy ${res.data.length} hồ sơ khám bệnh`);
      } else {
        setHealthRecords([]);
        setError("Không tìm thấy hồ sơ khám bệnh nào");
        toast.info("Không tìm thấy hồ sơ khám bệnh nào");
        setCurrentView("dashboard");
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
    setSelectedRecord(null);
    setError(null);
    // Xóa token khỏi localStorage khi logout
    localStorage.removeItem('accessToken');
  };

  const handleViewDetail = (record) => {
    setSelectedRecord(record);
    setCurrentView("detail");
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setSelectedRecord(null);
  };

  // Render view tương ứng
  switch (currentView) {
    case "login":
      return (
        <Login
          onLogin={handleLogin}
          loading={loading}
          error={error}
        />
      );

    case "changePassword":
      return (
        <ChangePassword
          cccd={cccd}
          token={token}
          onPasswordChanged={handlePasswordChanged}
          onBack={handleBackToLogin}
        />
      );

    case "dashboard":
      return (
        <Dashboard
          cccd={cccd}
          token={token}
          healthRecords={healthRecords}
          onViewDetail={handleViewDetail}
          onBack={handleBackToLogin}
          loading={loading}
        />
      );

    case "detail":
      return (
        <MedicalRecordDetail
          selectedRecord={selectedRecord}
          token={token}
          onBack={handleBackToDashboard}
        />
      );

    default:
      return <Login onLogin={handleLogin} loading={loading} error={error} />;
  }
};

export default AppController;