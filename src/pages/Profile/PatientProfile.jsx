import React from "react";

const PatientProfile = ({ patientInfo }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Thông tin cá nhân</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Họ và tên */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Họ và tên</label>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-900 font-medium">{patientInfo.hoTen}</p>
            </div>
          </div>

          {/* Ngày sinh */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Ngày sinh</label>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-900">{patientInfo.ngaySinh}</p>
            </div>
          </div>

          {/* Giới tính */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Giới tính</label>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-900">{patientInfo.gioiTinh}</p>
            </div>
          </div>

          {/* Dân tộc */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Dân tộc</label>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-900">{patientInfo.danToc}</p>
            </div>
          </div>

          {/* Quốc tịch */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Quốc tịch</label>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-900">{patientInfo.quocTich}</p>
            </div>
          </div>

          {/* Nghề nghiệp */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Nghề nghiệp</label>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-900">{patientInfo.ngheNghiep}</p>
            </div>
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Số điện thoại</label>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-900">{patientInfo.soDienThoai}</p>
            </div>
          </div>

          {/* Số CCCD */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Số định danh cá nhân</label>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-900">{patientInfo.soCCCD}</p>
            </div>
          </div>

          {/* Địa chỉ - full width */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-2">Địa chỉ cư trú</label>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-900">{patientInfo.diaChiCuTru}</p>
            </div>
          </div>

          {/* Mã thẻ BHYT */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Mã thẻ BHYT</label>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-900 font-medium">{patientInfo.maTheBHYT}</p>
            </div>
          </div>

          {/* Nơi ĐKKCB */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-2">Nơi đăng ký KCB ban đầu</label>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-900">{patientInfo.noiDKKCB}</p>
            </div>
          </div>

          {/* Thời hạn từ ngày */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Thời hạn thẻ BHYT (Từ ngày)</label>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-900">{patientInfo.thoiHanTuNgay}</p>
            </div>
          </div>

          {/* Thời hạn đến ngày */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Thời hạn thẻ BHYT (Đến ngày)</label>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-900">{patientInfo.thoiHanDenNgay}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;