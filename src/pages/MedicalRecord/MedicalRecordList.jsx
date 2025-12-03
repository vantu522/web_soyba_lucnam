import React from "react";
import { Calendar } from "lucide-react";

const MedicalRecordList = ({ healthRecords, onViewDetail }) => {
  const handleViewDetail = (record) => {
    onViewDetail(record);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Danh sách đợt điều trị</h2>
        <div className="flex space-x-2">
          <button className="px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200">
            Hiển thị toàn bộ
          </button>
          <button className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
            Chọn cột
          </button>
        </div>
      </div>

      {healthRecords?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">STT</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ngày đón tiếp</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden md:table-cell">Ngày ra viện</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Kết luận</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ngày hẹn khám</th>

              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {healthRecords.map((record, index) => (
                <tr key={record.id || index} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleViewDetail(record)}
                      className="text-green-600 hover:text-green-700 font-medium cursor-pointer text-sm"
                    >
                      Xem
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {new Date(record.NgayTao).toLocaleTimeString('vi-VN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}, {new Date(record.NgayTao).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 hidden md:table-cell">
                    {record.NgayRaVien ? new Date(record.NgayRaVien).toLocaleDateString('vi-VN') : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{record.CHAN_DOAN_RV}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{record.NgayRaVien}</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Không tìm thấy lịch sử khám bệnh
          </h3>
          <p className="text-gray-500">
            Vui lòng kiểm tra lại hoặc liên hệ với cơ sở y tế
          </p>
        </div>
      )}
    </div>
  );
};

export default MedicalRecordList;