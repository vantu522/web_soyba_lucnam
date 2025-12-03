import React, { useState } from "react";
import { Download, ExternalLink } from "lucide-react";

/**
 * PDFModalViewer Component
 * --------------------------------------
 * Props:
 *  - files: Array<{ Url: string, TenNhom: string, NgayTao: string }>
 * --------------------------------------
 * Hiển thị danh sách PDF và xem trực tiếp trong modal.
 */
export default function PDFModalViewer({ files = [] }) {
  const [open, setOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  // Phát hiện thiết bị mobile
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // Phát hiện iOS
  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  };

  const openModal = (url) => {
    // Nếu là iOS, dùng modal như bình thường
    if (isIOS()) {
      setPdfUrl(url);
      setOpen(true);
    } else if (isMobile()) {
      // Android và mobile khác: mở trong tab hiện tại
      window.location.href = url;
    } else {
      // Desktop: dùng modal
      setPdfUrl(url);
      setOpen(true);
    }
  };

  const closeModal = () => {
    setOpen(false);
    setPdfUrl(null);
  };

  return (
    <div className="w-full">
      {/* Danh sách PDF */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-all group"
          >
            <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-pink-100 rounded-lg flex items-center justify-center group-hover:bg-pink-200 transition-colors">
              <Download className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{file.TenNhom}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(file.NgayTao).toLocaleDateString("vi-VN")}
              </p>
            </div>
            <div className="flex gap-2 ml-2">
              {/* Nút xem (Modal cho iOS/Desktop, redirect cho Android) */}
              <button
                onClick={() => openModal(file.Url)}
                className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                title="Xem PDF"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
              {/* Nút tải xuống */}
              <a
                href={file.Url}
                download
                className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                title="Tải xuống"
                onClick={(e) => e.stopPropagation()}
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Modal xem PDF */}
      {open && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden relative animate-fadeIn">
            {/* Header */}
            <div className="p-3 bg-green-600 text-white flex justify-between items-center">
              <h2 className="text-lg font-semibold">Xem tài liệu</h2>
              <button
                onClick={closeModal}
                className="px-3 py-1 bg-red-600 hover:bg-red-600 text-white rounded-lg"
              >
                Đóng
              </button>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 relative">
              <iframe
                src={pdfUrl}
                className="w-full h-full border-0"
                title="PDF Viewer"
              />
              {/* Fallback cho trình duyệt không hỗ trợ iframe PDF */}
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100" style={{ zIndex: -1 }}>
                <div className="text-center p-4">
                  <p className="text-gray-600 mb-3">Không thể xem PDF trong trình duyệt này</p>
                  <a 
                    href={pdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Tải xuống PDF
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}