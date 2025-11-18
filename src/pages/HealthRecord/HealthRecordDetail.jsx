import React, { useState, useEffect } from "react";
import {
  User,
  Stethoscope,
  TestTube,
  Pill,
  MessageCircle,
  ArrowLeft,
  Calendar,
  FileText,
  Activity,
  Download,
  ExternalLink,
} from "lucide-react";
import { getHealthRecordByCCCDAndLK } from "../../services/health_record";
import { toast } from "react-toastify";

const HealthRecordDetail = ({ selectedRecord, token, onBack }) => {
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gọi API để lấy chi tiết khi component mount
  useEffect(() => {
    const fetchDetailData = async () => {
      if (!selectedRecord) {
        setError("Không có thông tin bản ghi được chọn");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await getHealthRecordByCCCDAndLK(
          selectedRecord.SO_CCCD,
          selectedRecord.MA_LK,
          token
        );

        if (
          response &&
          response.success &&
          response.data &&
          Array.isArray(response.data)
        ) {
          // Tìm phần tử chứa NOIDUNGFILE (XML data) - thường là phần tử đầu tiên
          const xmlDataItem = response.data.find(
            (item) => item.NOIDUNGFILE && item.NOIDUNGFILE.GIAMDINHHS
          );

          if (
            xmlDataItem &&
            xmlDataItem.NOIDUNGFILE &&
            xmlDataItem.NOIDUNGFILE.GIAMDINHHS
          ) {
            const hosoData =
              xmlDataItem.NOIDUNGFILE.GIAMDINHHS.THONGTINHOSO.DANHSACHHOSO.HOSO;

            const xml1File = hosoData.FILEHOSO.find(
              (file) => file.LOAIHOSO === "XML1"
            );
            const xml2File = hosoData.FILEHOSO.find(
              (file) => file.LOAIHOSO === "XML2"
            );
            const xml3File = hosoData.FILEHOSO.find(
              (file) => file.LOAIHOSO === "XML3"
            );
            const xml4File = hosoData.FILEHOSO.find(
              (file) => file.LOAIHOSO === "XML4"
            );
            const xml5File = hosoData.FILEHOSO.find(
              (file) => file.LOAIHOSO === "XML5"
            );

            if (
              xml1File &&
              xml1File.NOIDUNGFILE &&
              xml1File.NOIDUNGFILE.TONG_HOP
            ) {
              const processedData = {
                // Thông tin hành chính từ XML1
                ...xml1File.NOIDUNGFILE.TONG_HOP,
                // Thông tin thuốc từ XML2
                xml2Data:
                  xml2File && xml2File.NOIDUNGFILE
                    ? xml2File.NOIDUNGFILE
                    : null,
                // Thông tin DVKT/VTYT từ XML3
                xml3Data:
                  xml3File && xml3File.NOIDUNGFILE
                    ? xml3File.NOIDUNGFILE
                    : null,
                // Thông tin dịch vụ cận lâm sàng từ XML4
                xml4Data:
                  xml4File && xml4File.NOIDUNGFILE
                    ? xml4File.NOIDUNGFILE
                    : null,
                // Thông tin diễn biến lâm sàng từ XML5
                xml5Data:
                  xml5File && xml5File.NOIDUNGFILE
                    ? xml5File.NOIDUNGFILE
                    : null,
              };

              // Lưu các file PDF đính kèm
              const pdfFiles = response.data.filter(
                (item) => item.Url && item.TenNhom
              );

              setDetailData({
                ...processedData,
                pdfFiles: pdfFiles,
              });
              if (!detailData) {
                toast.success("Tải chi tiết hồ sơ thành công");
              }
            } else {
              throw new Error("Không tìm thấy dữ liệu XML1");
            }
          } else {
            throw new Error("Cấu trúc dữ liệu không đúng");
          }
        } else {
          setError("Không tìm thấy chi tiết hồ sơ");
          toast.error("Không tìm thấy chi tiết hồ sơ");
        }
      } catch (err) {
        console.error("Error fetching detail:", err);
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Có lỗi xảy ra khi tải chi tiết hồ sơ";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailData();
  }, [selectedRecord]);

  // Helper functions để format dữ liệu
  const formatDate = (dateString) => {
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

  const formatGender = (genderCode) => {
    switch (genderCode) {
      case "1":
        return "Nam";
      case "2":
        return "Nữ";
      default:
        return "Chưa có thông tin";
    }
  };

  // Helper function để format số tiền
  const formatCurrency = (amount) => {
    if (!amount || amount === "0") return "0 VNĐ";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Helper function để format ngày giờ y tế
  const formatMedicalDateTime = (dateString) => {
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={onBack}
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại danh sách
          </button>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải chi tiết hồ sơ...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container cursor-pointer mx-auto px-4 py-8">
          <button
            onClick={onBack}
            className="inline-flex  items-center text-green-600 hover:text-green-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại danh sách
          </button>
          <div className="bg-white rounded-xl shadow-md border border-red-200 p-8 text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Không thể tải chi tiết hồ sơ
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="mb-4 sm:mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-3 sm:mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            <span className="text-sm sm:text-base">Quay lại danh sách</span>
          </button>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            Chi tiết hồ sơ bệnh án
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-2">
            Mã lần khám: {selectedRecord?.MA_LK} - Ngày vào viện:{" "}
            {formatDate(detailData?.NGAY_VAO)}
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {/* I. Thông tin hành chính */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md border border-gray-100">
            <div className="bg-gray-600 text-white px-3 sm:px-6 py-3 sm:py-4 rounded-t-lg sm:rounded-t-xl">
              <div className="flex items-center">
                <User className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                <h3 className="text-base sm:text-lg md:text-xl font-bold">
                  I. THÔNG TIN HÀNH CHÍNH
                </h3>
              </div>
            </div>
            <div className="p-3 sm:p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-500">
                      Họ và tên
                    </label>
                    <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">
                      {detailData?.HO_TEN || "Chưa có thông tin"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-500">
                      Ngày sinh
                    </label>
                    <p className="text-sm sm:text-base md:text-lg text-gray-800">
                      {formatDate(detailData?.NGAY_SINH)}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-500">
                      Giới tính
                    </label>
                    <p className="text-sm sm:text-base md:text-lg text-gray-800">
                      {formatGender(detailData?.GIOI_TINH)}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-500">
                      Số CCCD
                    </label>
                    <p className="text-sm sm:text-base md:text-lg text-gray-800">
                      {detailData?.SO_CCCD || "Chưa có thông tin"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-500">
                      Điện thoại
                    </label>
                    <p className="text-sm sm:text-base md:text-lg text-gray-800">
                      {detailData?.DIEN_THOAI || "Chưa có thông tin"}
                    </p>
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-500">
                      Địa chỉ
                    </label>
                    <p className="text-sm sm:text-base md:text-lg text-gray-800">
                      {detailData?.DIA_CHI || "Chưa có thông tin"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-500">
                      Mã thẻ BHYT
                    </label>
                    <p className="text-sm sm:text-base md:text-lg text-gray-800">
                      {detailData?.MA_THE_BHYT || "Chưa có thông tin"}
                    </p>
                  </div>
                   <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-500">
                      Mã bệnh nhân
                    </label>
                    <p className="text-sm sm:text-base md:text-lg text-gray-800">
                      {detailData?.MA_BN || "Chưa có thông tin"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-500">
                      Mã lần khám
                    </label>
                    <p className="text-sm sm:text-base md:text-lg text-gray-800">
                      {detailData?.MA_LK || "Chưa có thông tin"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-500">
                      Ngày vào viện
                    </label>
                    <p className="text-sm sm:text-base md:text-lg text-gray-800">
                      {formatDate(detailData?.NGAY_VAO)}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-500">
                      Ngày ra viện
                    </label>
                    <p className="text-sm sm:text-base md:text-lg text-gray-800">
                      {formatDate(detailData?.NGAY_RA)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

           {/*  TÀI LIỆU ĐÍNH KÈM (PDF) */}
          {detailData?.pdfFiles && detailData.pdfFiles.length > 0 && (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-md border border-gray-100">
              <div className="bg-gray-600 text-white px-3 sm:px-6 py-3 sm:py-4 rounded-t-lg sm:rounded-t-xl">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  <h3 className="text-base sm:text-lg md:text-xl font-bold">
                     TÀI LIỆU ĐÍNH KÈM
                  </h3>
                </div>
              </div>
              <div className="p-3 sm:p-4 md:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {detailData.pdfFiles.map((file, index) => (
                    <a
                      key={index}
                      href={file.Url}
                      target="_blank"
                      onClick={(e) => {
                        // fallback cho mobile nếu không mở được tab mới
                        if (window.innerWidth < 768) {
                          window.location.href = file.Url;
                        }
                      }}
                      rel="noopener noreferrer"
                      className="flex items-center p-3 sm:p-4 border-2 border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-all group"
                    >
                      <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-pink-100 rounded-lg flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                        <Download className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" />
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                          {file.TenNhom}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(file.NgayTao).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-pink-600 shrink-0 ml-2" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* II. THÔNG TIN THUỐC (XML2) */}
          {detailData?.xml2Data && (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-md border border-gray-100">
              <div className="bg-gray-600 text-white px-3 sm:px-6 py-3 sm:py-4 rounded-t-lg sm:rounded-t-xl">
                <div className="flex items-center">
                  <Pill className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  <h3 className="text-base sm:text-lg md:text-xl font-bold">
                    II. THÔNG TIN THUỐC
                  </h3>
                </div>
              </div>
              <div className="p-3 sm:p-4 md:p-6">
                {detailData.xml2Data.CHITIEU_CHITIET_THUOC &&
                detailData.xml2Data.CHITIEU_CHITIET_THUOC
                  .DSACH_CHI_TIET_THUOC &&
                detailData.xml2Data.CHITIEU_CHITIET_THUOC.DSACH_CHI_TIET_THUOC
                  .CHI_TIET_THUOC ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            STT
                          </th>
                          <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Tên thuốc
                          </th>
                          <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Liều dùng
                          </th>
                          <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Số lượng
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {/* Kiểm tra nếu CHI_TIET_THUOC là array hay object */}
                        {(Array.isArray(
                          detailData.xml2Data.CHITIEU_CHITIET_THUOC
                            .DSACH_CHI_TIET_THUOC.CHI_TIET_THUOC
                        )
                          ? detailData.xml2Data.CHITIEU_CHITIET_THUOC
                              .DSACH_CHI_TIET_THUOC.CHI_TIET_THUOC
                          : [
                              detailData.xml2Data.CHITIEU_CHITIET_THUOC
                                .DSACH_CHI_TIET_THUOC.CHI_TIET_THUOC,
                            ]
                        ).map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm font-medium text-blue-600 border-b">
                              {item.STT || "N/A"}
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm md:text-base text-gray-900 border-b">
                              <div>
                                <p className="font-medium">
                                  {item.TEN_THUOC || "Chưa có thông tin"}
                                </p>
                              </div>
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm md:text-base text-gray-900 border-b">
                              <div>
                                <p className="font-medium">
                                  {item.LIEU_DUNG || "N/A"}
                                </p>
                              </div>
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm md:text-base text-gray-900 border-b">
                              <div>
                                <p className="text-gray-900 font-medium">
                                  {item.SO_LUONG}
                                </p>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Không có thông tin thuốc</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* III. THÔNG TIN DỊCH VỤ KỸ THUẬT & VẬT TƯ Y TẾ (XML3) */}
          {detailData?.xml3Data && (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-md border border-gray-100">
              <div className="bg-gray-600 text-white px-3 sm:px-6 py-3 sm:py-4 rounded-t-lg sm:rounded-t-xl">
                <div className="flex items-center">
                  <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  <h3 className="text-base sm:text-lg md:text-xl font-bold">
                    III. DỊCH VỤ KỸ THUẬT & VẬT TƯ Y TẾ
                  </h3>
                </div>
              </div>
              <div className="p-3 sm:p-4 md:p-6">
                {detailData.xml3Data.CHITIEU_CHITIET_DVKT_VTYT &&
                detailData.xml3Data.CHITIEU_CHITIET_DVKT_VTYT
                  .DSACH_CHI_TIET_DVKT &&
                detailData.xml3Data.CHITIEU_CHITIET_DVKT_VTYT
                  .DSACH_CHI_TIET_DVKT.CHI_TIET_DVKT ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            STT
                          </th>
                          <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Tên dịch vụ
                          </th>
                          <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Số lượng
                          </th>
                          <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Đơn vị tính
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {/* Kiểm tra nếu CHI_TIET_DVKT là array hay object */}
                        {(Array.isArray(
                          detailData.xml3Data.CHITIEU_CHITIET_DVKT_VTYT
                            .DSACH_CHI_TIET_DVKT.CHI_TIET_DVKT
                        )
                          ? detailData.xml3Data.CHITIEU_CHITIET_DVKT_VTYT
                              .DSACH_CHI_TIET_DVKT.CHI_TIET_DVKT
                          : [
                              detailData.xml3Data.CHITIEU_CHITIET_DVKT_VTYT
                                .DSACH_CHI_TIET_DVKT.CHI_TIET_DVKT,
                            ]
                        ).map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm font-medium text-blue-600 border-b">
                              {item.STT || "N/A"}
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm md:text-base text-gray-900 border-b">
                              <div>
                                <p className="font-medium">
                                  {item.TEN_DICH_VU ||
                                    item.TEN_VAT_TU ||
                                    "Chưa có thông tin"}
                                </p>
                              </div>
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm md:text-base text-gray-900 border-b">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {item.SO_LUONG || "0"}
                                </p>
                              </div>
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm md:text-base text-gray-900 border-b">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {item.DON_VI_TINH || "0"}
                                </p>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      Không có thông tin dịch vụ kỹ thuật/vật tư y tế
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* IV. THÔNG TIN DỊCH VỤ CẬN LÂM SÀNG (XML4) */}
          {detailData?.xml4Data && (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-md border border-gray-100">
              <div className="bg-gray-600 text-white px-3 sm:px-6 py-3 sm:py-4 rounded-t-lg sm:rounded-t-xl">
                <div className="flex items-center">
                  <TestTube className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  <h3 className="text-base sm:text-lg md:text-xl font-bold">
                    IV. KẾT QUẢ DỊCH VỤ CẬN LÂM SÀNG
                  </h3>
                </div>
              </div>
              <div className="p-3 sm:p-4 md:p-6">
                {detailData.xml4Data.CHITIEU_CHITIET_DICHVUCANLAMSANG &&
                detailData.xml4Data.CHITIEU_CHITIET_DICHVUCANLAMSANG
                  .DSACH_CHI_TIET_CLS &&
                detailData.xml4Data.CHITIEU_CHITIET_DICHVUCANLAMSANG
                  .DSACH_CHI_TIET_CLS.CHI_TIET_CLS ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            STT
                          </th>

                          <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Mã chỉ số
                          </th>
                          <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Tên chỉ số
                          </th>
                          <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Giá trị
                          </th>
                          <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Ngày kết quả
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {/* Kiểm tra nếu CHI_TIET_CLS là array hay object */}
                        {(Array.isArray(
                          detailData.xml4Data.CHITIEU_CHITIET_DICHVUCANLAMSANG
                            .DSACH_CHI_TIET_CLS.CHI_TIET_CLS
                        )
                          ? detailData.xml4Data.CHITIEU_CHITIET_DICHVUCANLAMSANG
                              .DSACH_CHI_TIET_CLS.CHI_TIET_CLS
                          : [
                              detailData.xml4Data
                                .CHITIEU_CHITIET_DICHVUCANLAMSANG
                                .DSACH_CHI_TIET_CLS.CHI_TIET_CLS,
                            ]
                        ).map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm font-medium text-blue-600 border-b">
                              {item.STT || "N/A"}
                            </td>

                            <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm md:text-base text-gray-900 border-b">
                              <div>
                                <p className="font-medium">
                                  {item.MA_CHI_SO || "N/A"}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  ĐVĐ: {item.DON_VI_DO || "N/A"}
                                </p>
                              </div>
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm md:text-base text-gray-900 border-b">
                              <div>
                                <p className="font-medium">
                                  {item.TEN_CHI_SO || "Chưa có thông tin"}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Mô tả: {item.MO_TA || "N/A"}
                                </p>
                              </div>
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm md:text-base text-gray-900 border-b">
                              <div>
                                <p className="font-bold text-red-600">
                                  {item.GIA_TRI || "N/A"}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Kết luận: {item.KET_LUAN || "N/A"}
                                </p>
                              </div>
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm md:text-base text-gray-900 border-b">
                              <div>
                                <p className="font-medium">
                                  {formatMedicalDateTime(item.NGAY_KQ)}
                                </p>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      Không có thông tin dịch vụ cận lâm sàng
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* V. DIỄN BIẾN LÂM SÀNG (XML5) */}
          {detailData?.xml5Data && (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-md border border-gray-100">
              <div className="bg-gray-600 text-white px-3 sm:px-6 py-3 sm:py-4 rounded-t-lg sm:rounded-t-xl">
                <div className="flex items-center">
                  <Activity className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  <h3 className="text-base sm:text-lg md:text-xl font-bold">
                    V. DIỄN BIẾN LÂM SÀNG
                  </h3>
                </div>
              </div>
              <div className="p-3 sm:p-4 md:p-6">
                {detailData.xml5Data.CHITIEU_CHITIET_DIENBIENLAMSANG &&
                detailData.xml5Data.CHITIEU_CHITIET_DIENBIENLAMSANG
                  .DSACH_CHI_TIET_DIEN_BIEN_BENH &&
                detailData.xml5Data.CHITIEU_CHITIET_DIENBIENLAMSANG
                  .DSACH_CHI_TIET_DIEN_BIEN_BENH.CHI_TIET_DIEN_BIEN_BENH ? (
                  <div className="space-y-4">
                    {(Array.isArray(
                      detailData.xml5Data.CHITIEU_CHITIET_DIENBIENLAMSANG
                        .DSACH_CHI_TIET_DIEN_BIEN_BENH.CHI_TIET_DIEN_BIEN_BENH
                    )
                      ? detailData.xml5Data.CHITIEU_CHITIET_DIENBIENLAMSANG
                          .DSACH_CHI_TIET_DIEN_BIEN_BENH.CHI_TIET_DIEN_BIEN_BENH
                      : [
                          detailData.xml5Data.CHITIEU_CHITIET_DIENBIENLAMSANG
                            .DSACH_CHI_TIET_DIEN_BIEN_BENH
                            .CHI_TIET_DIEN_BIEN_BENH,
                        ]
                    ).map((item, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-teal-500 pl-4 py-2"
                      >
                        <div className="mb-3">
                          <label className="text-xs sm:text-sm font-semibold text-gray-700">
                            Thời điểm diễn biến:
                          </label>
                          <p className="text-sm sm:text-base text-gray-900 font-medium">
                            {formatMedicalDateTime(item.THOI_DIEM_DBLS)}
                          </p>
                        </div>
                        <div className="mb-3">
                          <label className="text-xs sm:text-sm font-semibold text-gray-700">
                            Diễn biến lâm sàng:
                          </label>
                          <div className="text-sm sm:text-base text-gray-900 whitespace-pre-line bg-gray-50 p-3 rounded-lg mt-1">
                            {item.DIEN_BIEN_LS || "Không có thông tin"}
                          </div>
                        </div>
                        {item.GIAI_DOAN_BENH && (
                          <div className="mb-3">
                            <label className="text-xs sm:text-sm font-semibold text-gray-700">
                              Giai đoạn bệnh:
                            </label>
                            <p className="text-sm sm:text-base text-gray-900">
                              {item.GIAI_DOAN_BENH}
                            </p>
                          </div>
                        )}
                        {item.HOI_CHAN && (
                          <div className="mb-3">
                            <label className="text-xs sm:text-sm font-semibold text-gray-700">
                              Hội chẩn:
                            </label>
                            <p className="text-sm sm:text-base text-gray-900">
                              {item.HOI_CHAN}
                            </p>
                          </div>
                        )}
                        {item.PHAU_THUAT && (
                          <div className="mb-3">
                            <label className="text-xs sm:text-sm font-semibold text-gray-700">
                              Phẫu thuật:
                            </label>
                            <p className="text-sm sm:text-base text-gray-900">
                              {item.PHAU_THUAT}
                            </p>
                          </div>
                        )}
                        <div className="text-xs sm:text-sm text-gray-500 mt-2">
                          Người thực hiện: {item.NGUOI_THUC_HIEN || "N/A"}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      Không có thông tin diễn biến lâm sàng
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

         
        </div>
      </div>
    </div>
  );
};

export default HealthRecordDetail;
