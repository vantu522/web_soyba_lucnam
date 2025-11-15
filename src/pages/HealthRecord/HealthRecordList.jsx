import React from "react";
import { Calendar, ArrowLeft, Eye } from "lucide-react";

const HealthRecordList = ({
  searchCCCD,
  healthRecords,
  loading,
  onBack,
  onViewDetail,
}) => {
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }
  const handleViewDetail = (record) => {
    onViewDetail(record);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="text-center mb-8 mt-10 sm:mb-10 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 px-2">
            Danh sách lịch sử khám bệnh
          </h2>
        </div>
        <div className="mb-4 sm:mb-8">
          <button
            onClick={onBack}
            className="inline-flex cursor-pointer items-center text-green-600 hover:text-green-700 mb-3 sm:mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            <span className="text-sm sm:text-base">Quay lại tra cứu</span>
          </button>
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            Kết quả tìm kiếm cho CCCD: {searchCCCD}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Tìm thấy {healthRecords?.length} hồ sơ khám bệnh
          </p>
        </div>

        {healthRecords?.length > 0 ? (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-green-50 border-b border-green-100">
                  <tr>
                    <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs sm:text-sm font-semibold text-green-800 uppercase tracking-wider">
                      STT
                    </th>
                    <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs sm:text-sm font-semibold text-green-800 uppercase tracking-wider">
                      Họ tên
                    </th>
                    <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs sm:text-sm font-semibold text-green-800 uppercase tracking-wider">
                      Ngày khám
                    </th>
                    <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs sm:text-sm font-semibold text-green-800 uppercase tracking-wider hidden sm:table-cell">
                      Chẩn đoán
                    </th>
                    <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs sm:text-sm font-semibold text-green-800 uppercase tracking-wider hidden md:table-cell">
                      Mã lần khám
                    </th>
                    <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-center text-xs sm:text-sm font-semibold text-green-800 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {healthRecords.map((record, index) => (
                    <tr
                      key={record.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                       <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                        {record.HO_TEN}
                      </td>
                      <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                          </div>
                          <div className="flex flex-col sm:block">
                            <span className="text-xs sm:text-sm font-medium text-gray-900">
                              {record.NgayTao.split("T")[0]}
                            </span>
                            <span className="text-xs text-gray-500 sm:hidden truncate max-w-[100px]">
                              {record.CHAN_DOAN_RV}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 hidden sm:table-cell">
                        <div className="text-xs sm:text-sm text-gray-900 max-w-xs truncate">
                          {record.CHAN_DOAN_RV}
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 hidden md:table-cell">
                        <div className="text-xs sm:text-sm text-gray-900 max-w-xs">
                          {record.MA_LK}
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleViewDetail(record)}
                          className="inline-flex cursor-pointer items-center px-2 sm:px-3 py-1 sm:py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm font-medium rounded-md transition-colors"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-0 sm:mr-1" />
                          <span className="hidden sm:inline">Xem</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination (optional) */}
            <div className="bg-gray-50 px-3 sm:px-6 py-2 sm:py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 gap-2 sm:gap-0">
              <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
                Hiển thị <span className="font-medium">1</span> đến{" "}
                <span className="font-medium">{healthRecords.length}</span>{" "}
                trong tổng số{" "}
                <span className="font-medium">{healthRecords.length}</span> kết
                quả
              </div>
              <div className="text-xs sm:text-sm text-gray-500">
                Trang 1 / 1
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md border border-gray-100">
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Không tìm thấy lịch sử khám bệnh
              </h3>
              <p className="text-gray-500">
                Vui lòng kiểm tra lại mã tra cứu hoặc liên hệ với cơ sở y tế
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthRecordList;
