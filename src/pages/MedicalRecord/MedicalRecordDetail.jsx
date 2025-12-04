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
import {
  formatDate,
  formatCurrency,
  formatGender,
  formatMedicalDateTime,
} from "../../utils/format";
import PDFModalViewer from "../../components/PdfModal";

const MedicalRecordDetail = ({ selectedRecord, token, onBack }) => {
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fake data để hiển thị trang
  useEffect(() => {
    const loadFakeData = () => {
      if (!selectedRecord) {
        setError("Không có thông tin bản ghi được chọn");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      // Simulate API delay
      setTimeout(() => {
        const fakeDetailData = {
          // Thông tin hành chính (XML1)
          HO_TEN: "Nguyễn Văn Minh",
          NGAY_SINH: "19900315",
          GIOI_TINH: "1",
          SO_CCCD: "024058010001",
          DIEN_THOAI: "0987654321",
          DIA_CHI: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
          MA_THE_BHYT: "DN4010123456789",
          MA_BN: "BN001234",
          MA_LK: selectedRecord?.MA_LK || "LK001234",
          NGAY_VAO: "20241201080000",
          NGAY_RA: "20241205100000",

          // Thông tin thuốc (XML2)
          xml2Data: {
            CHITIEU_CHITIET_THUOC: {
              DSACH_CHI_TIET_THUOC: {
                CHI_TIET_THUOC: [
                  {
                    STT: "1",
                    TEN_THUOC: "Paracetamol 500mg",
                    LIEU_DUNG: "1 viên x 3 lần/ngày",
                    SO_LUONG: "30"
                  },
                  {
                    STT: "2", 
                    TEN_THUOC: "Amoxicillin 250mg",
                    LIEU_DUNG: "1 viên x 2 lần/ngày",
                    SO_LUONG: "14"
                  },
                  {
                    STT: "3",
                    TEN_THUOC: "Vitamin C 1000mg",
                    LIEU_DUNG: "1 viên x 1 lần/ngày",
                    SO_LUONG: "10"
                  }
                ]
              }
            }
          },

          // Thông tin DVKT/VTYT (XML3)
          xml3Data: {
            CHITIEU_CHITIET_DVKT_VTYT: {
              DSACH_CHI_TIET_DVKT: {
                CHI_TIET_DVKT: [
                  {
                    STT: "1",
                    TEN_DICH_VU: "Siêu âm bụng tổng quát",
                    SO_LUONG: "1",
                    DON_VI_TINH: "lần"
                  },
                  {
                    STT: "2",
                    TEN_DICH_VU: "Chụp X-quang phổi thẳng",
                    SO_LUONG: "1", 
                    DON_VI_TINH: "lần"
                  },
                  {
                    STT: "3",
                    TEN_VAT_TU: "Băng gạc y tế",
                    SO_LUONG: "5",
                    DON_VI_TINH: "cuộn"
                  }
                ]
              }
            }
          },

          // Thông tin dịch vụ cận lâm sàng (XML4)
          xml4Data: {
            CHITIEU_CHITIET_DICHVUCANLAMSANG: {
              DSACH_CHI_TIET_CLS: {
                CHI_TIET_CLS: [
                  {
                    STT: "1",
                    MA_CHI_SO: "WBC",
                    TEN_CHI_SO: "Bạch cầu",
                    GIA_TRI: "8.5",
                    DON_VI_DO: "10^9/L",
                    MO_TA: "Số lượng bạch cầu trong máu",
                    KET_LUAN: "Bình thường",
                    NGAY_KQ: "20241202090000"
                  },
                  {
                    STT: "2",
                    MA_CHI_SO: "RBC", 
                    TEN_CHI_SO: "Hồng cầu",
                    GIA_TRI: "4.2",
                    DON_VI_DO: "10^12/L",
                    MO_TA: "Số lượng hồng cầu trong máu",
                    KET_LUAN: "Bình thường",
                    NGAY_KQ: "20241202090000"
                  },
                  {
                    STT: "3",
                    MA_CHI_SO: "GLU",
                    TEN_CHI_SO: "Glucose máu",
                    GIA_TRI: "95",
                    DON_VI_DO: "mg/dL",
                    MO_TA: "Nồng độ đường trong máu",
                    KET_LUAN: "Bình thường", 
                    NGAY_KQ: "20241202090000"
                  }
                ]
              }
            }
          },

          // Thông tin diễn biến lâm sàng (XML5)
          xml5Data: {
            CHITIEU_CHITIET_DIENBIENLAMSANG: {
              DSACH_CHI_TIET_DIEN_BIEN_BENH: {
                CHI_TIET_DIEN_BIEN_BENH: [
                  {
                    THOI_DIEM_DBLS: "20241201080000",
                    DIEN_BIEN_LS: "Bệnh nhân nhập viện với triệu chứng đau bụng, sốt nhẹ.\nThăm khám: \n- Mạch: 80 lần/phút\n- Nhiệt độ: 37.5°C\n- Huyết áp: 120/80 mmHg\n- Bụng mềm, đau nhẹ vùng hạ vị",
                    GIAI_DOAN_BENH: "Giai đoạn cấp tính",
                    HOI_CHAN: "Không",
                    PHAU_THUAT: "Không",
                    NGUOI_THUC_HIEN: "BS. Trần Văn A"
                  },
                  {
                    THOI_DIEM_DBLS: "20241203100000",
                    DIEN_BIEN_LS: "Bệnh nhân có tiến triển tốt sau 2 ngày điều trị.\n- Sốt giảm\n- Đau bụng giảm nhiều\n- Ăn uống được\n- Tinh thần tỉnh táo",
                    GIAI_DOAN_BENH: "Giai đoạn hồi phục",
                    HOI_CHAN: "Không",
                    PHAU_THUAT: "Không", 
                    NGUOI_THUC_HIEN: "BS. Nguyễn Thị B"
                  }
                ]
              }
            }
          },

          // File PDF đính kèm
          pdfFiles: [
            {
              TenNhom: "Kết quả xét nghiệm",
              Url: "https://example.com/xet-nghiem.pdf"
            },
            {
              TenNhom: "Kết quả chẩn đoán hình ảnh", 
              Url: "https://example.com/chan-doan-hinh-anh.pdf"
            },
            {
              TenNhom: "Tờ điều trị",
              Url: "https://example.com/to-dieu-tri.pdf"
            }
          ]
        };

        setDetailData(fakeDetailData);
        toast.success("Tải chi tiết hồ sơ thành công");
        setLoading(false);
      }, 1500); // Simulate 1.5s loading time
    };

    loadFakeData();
  }, [selectedRecord]);

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
            <PDFModalViewer files={detailData.pdfFiles} />
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
                            <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm font-medium text-green-600 border-b">
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
                            <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm font-medium text-green-600 border-b">
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
                            <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm font-medium text-green-600 border-b">
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

export default MedicalRecordDetail;