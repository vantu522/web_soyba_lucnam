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
          // Thông tin hành chính
          HO_TEN: "Nguyễn Văn An",
          NGAY_SINH: "1985-03-15",
          GIOI_TINH: 1, // 1: Nam, 2: Nữ
          SO_CCCD: "001085012345",
          DIEN_THOAI: "0912345678",
          DIA_CHI: "123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
          MA_THE_BHYT: "DN4010123456789",
          MA_BN: "BN2024001234",
          MA_LK: selectedRecord?.MA_LK || "2024120100001",
          NGAY_VAO: "2024-12-01T08:30:00",
          NGAY_RA: "2024-12-05T14:00:00",
          
          // File PDF đính kèm
          pdfFiles: [
            {
              TenNhom: "Bảng kê bảo hiểm ngoại trú",
              Url: "https://example.com/bang-ke-ngoai-tru.pdf",
              NgayTao: "2024-12-05T10:00:00",
            },
            {
              TenNhom: "Bảng kê bảo hiểm nội trú",
              Url: "https://example.com/bang-ke-noi-tru.pdf",
              NgayTao: "2024-12-05T10:15:00",
            },
            {
              TenNhom: "Đơn thuốc",
              Url: "https://example.com/don-thuoc.pdf",
              NgayTao: "2024-12-05T09:30:00",
            },
            {
              TenNhom: "Xét nghiệm",
              Url: "https://example.com/xet-nghiem.pdf",
              NgayTao: "2024-12-02T14:00:00",
            },
            {
              TenNhom: "Siêu âm",
              Url: "https://example.com/sieu-am.pdf",
              NgayTao: "2024-12-03T09:00:00",
            },
            {
              TenNhom: "Chụp X-quang",
              Url: "https://example.com/xquang.pdf",
              NgayTao: "2024-12-02T11:00:00",
            },
          ],
          
          // Thông tin thuốc (XML2)
          xml2Data: {
            CHITIEU_CHITIET_THUOC: {
              DSACH_CHI_TIET_THUOC: {
                CHI_TIET_THUOC: [
                  {
                    STT: 1,
                    TEN_THUOC: "Paracetamol 500mg",
                    LIEU_DUNG: "1 viên x 3 lần/ngày sau ăn",
                    SO_LUONG: 30,
                    DON_VI_TINH: "Viên",
                    DON_GIA: 500,
                    THANH_TIEN: 15000,
                  },
                  {
                    STT: 2,
                    TEN_THUOC: "Amoxicillin 500mg",
                    LIEU_DUNG: "1 viên x 2 lần/ngày",
                    SO_LUONG: 20,
                    DON_VI_TINH: "Viên",
                    DON_GIA: 2000,
                    THANH_TIEN: 40000,
                  },
                  {
                    STT: 3,
                    TEN_THUOC: "Vitamin B Complex",
                    LIEU_DUNG: "1 viên x 1 lần/ngày",
                    SO_LUONG: 10,
                    DON_VI_TINH: "Viên",
                    DON_GIA: 1500,
                    THANH_TIEN: 15000,
                  },
                ],
              },
            },
          },
          
          // Thông tin dịch vụ kỹ thuật & vật tư y tế (XML3)
          xml3Data: {
            CHITIEU_CHITIET_DVKT_VTYT: {
              DSACH_CHI_TIET_DVKT: {
                CHI_TIET_DVKT: [
                  {
                    STT: 1,
                    TEN_DICH_VU: "Khám bệnh",
                    SO_LUONG: 1,
                    DON_VI_TINH: "Lần",
                    DON_GIA: 50000,
                    THANH_TIEN: 50000,
                  },
                  {
                    STT: 2,
                    TEN_DICH_VU: "Tiêm tĩnh mạch",
                    SO_LUONG: 3,
                    DON_VI_TINH: "Lần",
                    DON_GIA: 25000,
                    THANH_TIEN: 75000,
                  },
                  {
                    STT: 3,
                    TEN_VAT_TU: "Bông y tế vô trùng",
                    SO_LUONG: 5,
                    DON_VI_TINH: "Gói",
                    DON_GIA: 15000,
                    THANH_TIEN: 75000,
                  },
                  {
                    STT: 4,
                    TEN_VAT_TU: "Kim tiêm 5ml",
                    SO_LUONG: 10,
                    DON_VI_TINH: "Cái",
                    DON_GIA: 2000,
                    THANH_TIEN: 20000,
                  },
                  {
                    STT: 5,
                    TEN_DICH_VU: "Chăm sóc điều dưỡng",
                    SO_LUONG: 4,
                    DON_VI_TINH: "Ngày",
                    DON_GIA: 80000,
                    THANH_TIEN: 320000,
                  },
                ],
              },
            },
          },
          
          // Thông tin dịch vụ cận lâm sàng (XML4)
          xml4Data: {
            CHITIEU_CHITIET_DICHVUCANLAMSANG: {
              DSACH_CHI_TIET_CLS: {
                CHI_TIET_CLS: [
                  {
                    STT: 1,
                    MA_CHI_SO: "WBC",
                    TEN_CHI_SO: "Số lượng bạch cầu",
                    GIA_TRI: "7.5",
                    DON_VI_DO: "G/L",
                    MO_TA: "Trong giới hạn bình thường (4-10 G/L)",
                    KET_LUAN: "Bình thường",
                    NGAY_KQ: "2024-12-02T15:30:00",
                  },
                  {
                    STT: 2,
                    MA_CHI_SO: "RBC",
                    TEN_CHI_SO: "Số lượng hồng cầu",
                    GIA_TRI: "4.8",
                    DON_VI_DO: "T/L",
                    MO_TA: "Trong giới hạn bình thường (4.5-5.5 T/L)",
                    KET_LUAN: "Bình thường",
                    NGAY_KQ: "2024-12-02T15:30:00",
                  },
                  {
                    STT: 3,
                    MA_CHI_SO: "HGB",
                    TEN_CHI_SO: "Hemoglobin",
                    GIA_TRI: "145",
                    DON_VI_DO: "g/L",
                    MO_TA: "Trong giới hạn bình thường (130-170 g/L)",
                    KET_LUAN: "Bình thường",
                    NGAY_KQ: "2024-12-02T15:30:00",
                  },
                  {
                    STT: 4,
                    MA_CHI_SO: "PLT",
                    TEN_CHI_SO: "Tiểu cầu",
                    GIA_TRI: "250",
                    DON_VI_DO: "G/L",
                    MO_TA: "Trong giới hạn bình thường (150-400 G/L)",
                    KET_LUAN: "Bình thường",
                    NGAY_KQ: "2024-12-02T15:30:00",
                  },
                  {
                    STT: 5,
                    MA_CHI_SO: "GLU",
                    TEN_CHI_SO: "Glucose máu",
                    GIA_TRI: "5.2",
                    DON_VI_DO: "mmol/L",
                    MO_TA: "Trong giới hạn bình thường (3.9-6.1 mmol/L)",
                    KET_LUAN: "Bình thường",
                    NGAY_KQ: "2024-12-02T16:00:00",
                  },
                  {
                    STT: 6,
                    MA_CHI_SO: "UREA",
                    TEN_CHI_SO: "Urea",
                    GIA_TRI: "4.5",
                    DON_VI_DO: "mmol/L",
                    MO_TA: "Trong giới hạn bình thường (2.5-7.5 mmol/L)",
                    KET_LUAN: "Bình thường",
                    NGAY_KQ: "2024-12-02T16:00:00",
                  },
                  {
                    STT: 7,
                    MA_CHI_SO: "CREA",
                    TEN_CHI_SO: "Creatinin",
                    GIA_TRI: "95",
                    DON_VI_DO: "µmol/L",
                    MO_TA: "Trong giới hạn bình thường (62-115 µmol/L)",
                    KET_LUAN: "Bình thường",
                    NGAY_KQ: "2024-12-02T16:00:00",
                  },
                ],
              },
            },
          },
          
          // Diễn biến lâm sàng (XML5)
          xml5Data: {
            CHITIEU_CHITIET_DIENBIENLAMSANG: {
              DSACH_CHI_TIET_DIEN_BIEN_BENH: {
                CHI_TIET_DIEN_BIEN_BENH: [
                  {
                    STT: 1,
                    THOI_DIEM_DBLS: "2024-12-01T09:00:00",
                    DIEN_BIEN_LS: `Bệnh nhân vào viện trong tình trạng:
- Ý thức tỉnh
- Mạch: 80 lần/phút
- Huyết áp: 120/80 mmHg
- Nhiệt độ: 37.2°C
- Nhịp thở: 18 lần/phút

Lâm sàng:
- Đau bụng vùng hạ vị
- Buồn nôn, chán ăn
- Không sốt

Chẩn đoán ban đầu: Viêm dạ dày cấp
Xử trí: 
- Cho nhập viện điều trị nội trú
- Chỉ định xét nghiệm máu, nội soi dạ dày`,
                    GIAI_DOAN_BENH: "Cấp tính",
                    NGUOI_THUC_HIEN: "BS. Nguyễn Văn A",
                  },
                  {
                    STT: 2,
                    THOI_DIEM_DBLS: "2024-12-02T08:00:00",
                    DIEN_BIEN_LS: `Ngày thứ 2 điều trị:
- Bệnh nhân tỉnh, tiếp xúc tốt
- Mạch: 75 lần/phút
- Huyết áp: 118/78 mmHg
- Nhiệt độ: 36.8°C
- Đau bụng giảm nhiều
- Ăn uống được chút ít
- Không nôn

Đã có kết quả xét nghiệm máu: các chỉ số trong giới hạn bình thường

Xử trí:
- Tiếp tục điều trị nội khoa
- Truyền dịch bù nước điện giải
- Thuốc giảm đau, bảo vệ niêm mạc dạ dày`,
                    GIAI_DOAN_BENH: "Đáp ứng điều trị",
                    NGUOI_THUC_HIEN: "BS. Trần Thị B",
                  },
                  {
                    STT: 3,
                    THOI_DIEM_DBLS: "2024-12-03T10:00:00",
                    DIEN_BIEN_LS: `Ngày thứ 3 điều trị:
- Tình trạng chung cải thiện rõ rệt
- Mạch: 72 lần/phút
- Huyết áp: 115/75 mmHg
- Nhiệt độ: 36.5°C
- Không còn đau bụng
- Ăn uống tốt
- Đại tiện bình thường

Đã thực hiện siêu âm bụng: Các tạng ổ bụng bình thường

Xử trí:
- Giảm liều thuốc tiêm
- Chuyển sang thuốc uống
- Dự kiến xuất viện 2 ngày nữa`,
                    GIAI_DOAN_BENH: "Hồi phục",
                    NGUOI_THUC_HIEN: "BS. Nguyễn Văn A",
                  },
                  {
                    STT: 4,
                    THOI_DIEM_DBLS: "2024-12-05T09:00:00",
                    DIEN_BIEN_LS: `Ngày xuất viện:
- Bệnh nhân đã ổn định hoàn toàn
- Các triệu chứng lâm sàng thuyên giảm
- Sinh hiệu ổn định
- Ăn uống tốt
- Không còn đau bụng, buồn nôn

Kết luận:
- Viêm dạ dày cấp đã điều trị khỏi
- Cho xuất viện
- Hẹn tái khám sau 1 tuần

Dặn dò:
- Chế độ ăn uống điều độ
- Uống đủ thuốc theo đơn
- Tái khám nếu có triệu chứng bất thường`,
                    GIAI_DOAN_BENH: "Khỏi bệnh",
                    NGUOI_THUC_HIEN: "BS. Nguyễn Văn A",
                  },
                ],
              },
            },
          },
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

export default MedicalRecordDetail;