import React, { useState,useEffect } from "react";
import { getHealthRecordsListByCCCD } from "../../services/health_record";
import { toast } from "react-toastify";
import HealthRecordSearch from "./HealthRecordSearch";
import HealthRecordList from "./HealthRecordList";
import HealthRecordDetail from "./HealthRecordDetail";

const HealthRecordLookup = () => {
  const [currentView, setCurrentView] = useState("search"); // 'search', 'records', 'detail'
  const [searchCCCD, setSearchCCCD] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);



const handleSearch = async (cccd) => {
  setLoading(true);
  setError(null);

  try {
    const res = await getHealthRecordsListByCCCD(cccd);

    if (res && res?.data && res?.data.length > 0) {
      setHealthRecords(res.data); // Chỉ set 1 lần ở đây
      setSearchCCCD(cccd);
      setCurrentView("records");
      toast.success(`Tìm thấy ${res.data.length} hồ sơ khám bệnh`);
    } else {
      setHealthRecords([]); // Set mảng rỗng nếu không có data
      setError("Không tìm thấy hồ sơ khám bệnh nào với CCCD này");
      toast.info("Không tìm thấy hồ sơ khám bệnh nào");
    }
  } catch (err) {
    console.error("API Error:", err);
    setHealthRecords([]); // Reset về mảng rỗng khi có lỗi
    const errorMessage = err.response?.data?.message || "Có lỗi xảy ra khi tìm kiếm hồ sơ";
    setError(errorMessage);
    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};

  const handleBackToSearch = () => {
    setCurrentView("search");
    setSearchCCCD("");
    setHealthRecords([]);
    setError(null);
  };

  const handleViewDetail = (record) => {
    setSelectedRecord(record);
    setCurrentView("detail");
  };

  const handleBackToList = () => {
    setCurrentView("records");
    setSelectedRecord(null);
  };

  return (
    <div className="px-2 sm:px-4 md:px-8 lg:px-20 py-3 sm:py-5">
      {currentView === "search" && (
        <HealthRecordSearch
          onSearch={handleSearch}
          loading={loading}
          error={error}
        />
      )}

      {currentView === "records" && (
        <HealthRecordList
          searchCCCD={searchCCCD}
          healthRecords={healthRecords}
          loading={loading}
          onBack={handleBackToSearch}
          onViewDetail={handleViewDetail}
        />
      )}

      {currentView === "detail" && (
        <HealthRecordDetail
          selectedRecord={selectedRecord}
          onBack={handleBackToList}
        />
      )}
    </div>
  );
};

export default HealthRecordLookup;
