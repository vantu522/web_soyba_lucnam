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
          // File PDF đính kèm
          pdfFiles: [
            {
              TenNhom: "Bảng kê bảo hiểm ngoại trú",
              Url: "https://example.com/xet-nghiem.pdf",
            },
            {
              TenNhom: "Bảng kê bảo hiểm nội trú",
              Url: "https://example.com/chan-doan-hinh-anh.pdf",
            },
            {
              TenNhom: "Đơn thuốc",
              Url: "https://example.com/to-dieu-tri.pdf",
            },
            {
              TenNhom: "Xét nghiệm",
              Url: "https://example.com/to-dieu-tri.pdf",
            },
            {
              TenNhom: "Siêu âm",
              Url: "https://example.com/to-dieu-tri.pdf",
            },
            {
              TenNhom: "Chụp X-quang",
              Url: "https://example.com/to-dieu-tri.pdf",
            },
          ],
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
          {/* PHIẾU KẾT QUẢ KHÁM BỆNH (PDF) */}
          {detailData?.pdfFiles && detailData.pdfFiles.length > 0 && (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-md border border-gray-100">
              <div className="bg-gray-600 text-white px-3 sm:px-6 py-3 sm:py-4 rounded-t-lg sm:rounded-t-xl">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  <h3 className="text-base sm:text-lg md:text-xl font-bold">
                    PHIẾU KẾT QUẢ KHÁM BỆNH
                  </h3>
                </div>
              </div>
              <div className="p-3 sm:p-4 md:p-6">
                <PDFModalViewer files={detailData.pdfFiles} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordDetail;
