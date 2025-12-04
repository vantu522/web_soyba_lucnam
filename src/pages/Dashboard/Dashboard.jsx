import React, { useState } from "react";
import { Calendar, User, ClipboardList, Lock, LogOut, IdCard } from "lucide-react";
import MedicalRecordList from "../MedicalRecord/MedicalRecordList";
import PatientProfile from "../Profile/PatientProfile";
import ChangePassword from "../Auth/ChangePassword";
import logo from "../../assets/logo.jpg";
import { NAME_HOSPITAL } from "../../configs/constants";
import "../../styles/dashboard.css";

const Dashboard = ({ 
  cccd, 
  token, 
  healthRecords, 
  onViewDetail, 
  onBack, 
  loading 
}) => {
  const [currentView, setCurrentView] = useState("records"); // 'records', 'profile', 'changePassword'
  
  // Lấy tên từ hồ sơ đầu tiên
  const patientName = healthRecords?.[0]?.HO_TEN || "Bệnh nhân";
  
  // Fake data thông tin bệnh nhân
  const patientInfo = {
    hoTen: healthRecords?.[0]?.HO_TEN || "Nguyễn Văn A",
    ngaySinh: "15/03/1990",
    gioiTinh: "Nam",
    danToc: "Kinh",
    quocTich: "Việt Nam",
    ngheNghiep: "Giáo viên",
    soDienThoai: "0987654321",
    soCCCD: cccd || "024058010001",
    diaChiCuTru: "Số 123, Đường ABC, Phường XYZ, Quận 1, TP. Hà Nội",
    maTheBHYT: "DN4010123456789",
    noiDKKCB: "Bệnh viện Đa khoa Trung ương Quân đội 108",
    thoiHanTuNgay: "01/01/2025",
    thoiHanDenNgay: "31/12/2025"
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-2xl shadow-2xl border border-gray-100">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full bg-emerald-100 opacity-20 animate-pulse"></div>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-800">Đang tải dữ liệu</h3>
            <p className="text-gray-600">Vui lòng chờ trong giây lát...</p>
            <div className="flex justify-center space-x-2 pt-4">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  flex">
      {/* Sidebar bên trái */}
      <div className="hidden md:flex md:w-80 bg-white shadow-xl border-r border-gray-100 flex-col">
        {/* Header sidebar */}
        <div className="p-8 border-b border-gray-100 bg-emerald-600 text-white">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <img 
                src={logo} 
                alt="Logo" 
                className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg" 
              />
           
            </div>
          </div>
          <h2 className="text-center font-bold text-xl text-white mb-2">{patientName}</h2>
          <p className="text-center text-emerald-100 text-sm">Sổ sức khỏe điện tử</p>
        </div>

        {/* Menu sidebar */}
        <div className="flex-1 p-6 bg-gray-50">
          <h3 className="text-xs font-bold text-gray-500 uppercase mb-6 tracking-wider">CHỨC NĂNG CHÍNH</h3>
          <nav className="space-y-3">
            <button 
              onClick={() => setCurrentView("records")}
              className={`w-full flex items-center px-5 py-4 rounded-xl font-medium transition-all duration-200 ${
                currentView === "records" 
                  ? "text-emerald-700 bg-emerald-50 border-l-4 border-emerald-500 shadow-md" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-800 hover:shadow-sm"
              }`}
            >
              <ClipboardList className="w-5 h-5 mr-4" />
              <span>Đợt điều trị</span>
            </button>
            <button 
              onClick={() => setCurrentView("profile")}
              className={`w-full flex items-center px-5 py-4 rounded-xl font-medium transition-all duration-200 ${
                currentView === "profile" 
                  ? "text-emerald-700 bg-emerald-50 border-l-4 border-emerald-500 shadow-md" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-800 hover:shadow-sm"
              }`}
            >
              <IdCard className="w-5 h-5 mr-4" />
              <span>Thông tin cá nhân</span>
            </button>
            <button 
              onClick={() => setCurrentView("changePassword")}
              className={`w-full flex items-center px-5 py-4 rounded-xl font-medium transition-all duration-200 ${
                currentView === "changePassword" 
                  ? "text-emerald-700 bg-emerald-50 border-l-4 border-emerald-500 shadow-md" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-800 hover:shadow-sm"
              }`}
            >
              <Lock className="w-5 h-5 mr-4" />
              <span>Đổi mật khẩu</span>
            </button>
          </nav>
        </div>

        {/* Logout button */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onBack}
            className="w-full flex items-center justify-center px-5 py-4 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-all duration-200 hover:shadow-md border border-red-200 hover:border-red-300"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-lg border-b-4 border-emerald-500">
          <div className="bg-emerald-600 py-6 px-6">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center">
                <img src={logo} alt="Logo" className="w-14 h-14 mr-4 rounded-full border-2 border-white shadow-md md:hidden" />
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                   {NAME_HOSPITAL}
                  </h1>
                  <p className="text-emerald-100 text-sm hidden md:block">Hệ thống quản lý sức khỏe điện tử</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <button className="relative group">
                 
                </button>
                <div className="hidden md:flex items-center space-x-4 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg status-online">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-white">
                    <p className="text-sm opacity-80">Xin chào</p>
                    <p className="font-semibold">{patientName}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 md:p-8 overflow-auto bg-emerald-50">
          <div className="max-w-full mx-auto">
            {/* Mobile navigation */}
            <div className="md:hidden mb-6">
              <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">Menu</h3>
                  <button
                    onClick={onBack}
                    className="flex items-center text-red-600 font-medium px-3 py-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Đăng xuất
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setCurrentView("records")}
                    className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                      currentView === "records"
                        ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-300"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <ClipboardList className="w-6 h-6 mb-2" />
                    <span className="text-xs font-medium">Điều trị</span>
                  </button>
                  <button
                    onClick={() => setCurrentView("profile")}
                    className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                      currentView === "profile"
                        ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-300"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <IdCard className="w-6 h-6 mb-2" />
                    <span className="text-xs font-medium">Thông tin</span>
                  </button>
                  <button
                    onClick={() => setCurrentView("changePassword")}
                    className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                      currentView === "changePassword"
                        ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-300"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Lock className="w-6 h-6 mb-2" />
                    <span className="text-xs font-medium">Mật khẩu</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Dynamic content based on currentView */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden card-hover">
              {/* Content Header */}
              <div className="bg-emerald-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center">
                  {currentView === "records" && <ClipboardList className="w-6 h-6 text-emerald-600 mr-3" />}
                  {currentView === "profile" && <IdCard className="w-6 h-6 text-emerald-600 mr-3" />}
                  {currentView === "changePassword" && <Lock className="w-6 h-6 text-emerald-600 mr-3" />}
                  <h2 className="text-xl font-semibold text-gray-800">
                    {currentView === "records" && "Danh sách đợt điều trị"}
                    {currentView === "profile" && "Thông tin cá nhân"}
                    {currentView === "changePassword" && "Đổi mật khẩu"}
                  </h2>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6">
                {currentView === "records" && (
                  <MedicalRecordList 
                    healthRecords={healthRecords}
                    onViewDetail={onViewDetail}
                  />
                )}

                {currentView === "profile" && (
                  <PatientProfile patientInfo={patientInfo} />
                )}

                {currentView === "changePassword" && (
                  <ChangePassword 
                    cccd={cccd}
                    token={token}
                    onPasswordChanged={() => setCurrentView("records")}
                    onBack={() => setCurrentView("records")}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;