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

  const openModal = (url) => {
    setPdfUrl(url);
    setOpen(true);
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
            onClick={() => openModal(file.Url)}
            className="cursor-pointer flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-all group"
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
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-pink-600 shrink-0 ml-2" />
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
            <iframe
              src={pdfUrl}
              className="w-full flex-1"
            />
          </div>
        </div>
      )}
    </div>
  );
}