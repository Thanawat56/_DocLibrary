// import components
import { useState, useEffect } from "react";
import { Table } from "react-bootstrap";

// import icons
import { LuUndo2 } from "react-icons/lu";
import {
  BsTrash,
  BsChevronDoubleLeft,
  BsChevronLeft,
  BsChevronDoubleRight,
  BsChevronRight,
} from "react-icons/bs";

// import style
import "./Bin.css";
import Approve from "../Approve/Approve";

function Bin() {
  const [bin, setBin] = useState([]); // State สำหรับเก็บข้อมูลในถังขยะ
  const [selectedItems, setSelectedItems] = useState([]); // State สำหรับเก็บรายการที่ถูกเลือก
  const [currentPage, setCurrentPage] = useState(1); // State สำหรับหน้าปัจจุบัน
  const itemsPerPage = 8; // จำนวนรายการต่อหน้า

  const totalPages = Math.ceil(bin.length / itemsPerPage); // คำนวณจำนวนหน้าทั้งหมด

  useEffect(() => {
    // ดึงข้อมูล Bin จาก Local Storage
    try {
      const storedBin = JSON.parse(localStorage.getItem("bin")) || [];
      const sanitizedBin = storedBin.filter((item) => item && item.id); // ลบข้อมูลที่ไม่สมบูรณ์
      setBin(sanitizedBin);
    } catch (error) {
      console.error("Failed to load bin data:", error);
      setBin([]);
    }
  }, []);

  const updateBin = (updatedBin) => {
    // อัปเดตข้อมูลใน State และ Local Storage
    try {
      const sanitizedBin = updatedBin.filter((item) => item && item.id); // ลบข้อมูลที่ไม่สมบูรณ์
      setBin(sanitizedBin);
      localStorage.setItem("bin", JSON.stringify(sanitizedBin));
    } catch (error) {
      console.error("Failed to update bin data:", error);
    }
  };

  const restoreSelectedItems = () => {
    // กู้คืนเอกสารที่เลือกทั้งหมด
    const docsToRestore = bin.filter((doc) => doc && selectedItems.includes(doc.id));
    const updatedBin = bin.filter((doc) => doc && !selectedItems.includes(doc.id));

    const documents = JSON.parse(localStorage.getItem("approveDocuments")) || [];
    documents.push(...docsToRestore);
    localStorage.setItem("approveDocuments", JSON.stringify(documents));

    updateBin(updatedBin);
    setSelectedItems([]); // เคลียร์รายการที่เลือก
  };

  const deleteSelectedItems = () => {
    // ยืนยันก่อนลบรายการที่เลือก
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรายการที่เลือก?")) {
      const updatedBin = bin.filter((doc) => doc && !selectedItems.includes(doc.id));
      updateBin(updatedBin);
      setSelectedItems([]); // เคลียร์รายการที่เลือก
    }
  };

  const restoreDocument = (id) => {
    // กู้คืนเอกสารเดี่ยว
    const docToRestore = bin.find((doc) => doc && doc.id === id);
    const updatedBin = bin.filter((doc) => doc && doc.id !== id);

    const documents = JSON.parse(localStorage.getItem("approveDocuments")) || [];
    if (docToRestore) documents.push(docToRestore);
    localStorage.setItem("approveDocuments", JSON.stringify(documents));

    updateBin(updatedBin);
  };

  const deleteDocument = (id) => {
    // ยืนยันก่อนลบเอกสารเดี่ยว
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบเอกสารนี้?")) {
      const updatedBin = bin.filter((doc) => doc && doc.id !== id);
      updateBin(updatedBin);
    }
  };

  const goToPage = (page) => {
    // เปลี่ยนหน้า
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage; // คำนวณ index เริ่มต้น
  const endIndex = startIndex + itemsPerPage; // คำนวณ index สิ้นสุด
  const currentItems = bin.slice(startIndex, endIndex); // ดึงรายการที่อยู่ในหน้าปัจจุบัน

  return (
    <div className="main_css-container">
      <div className="bin-container">
        <div className="bin-header-content" style={{ textAlign: "center" }}>
          <h1>ถังขยะ</h1>
        </div>
        <div className="bin-body-content">
          {currentItems.length > 0 && (
            <div className="bin-selected-content" style={{ margin: "0 0 0.5rem 0" }}>
              <button
                className="btn btn-outline-secondary"
                onClick={restoreSelectedItems}
              >
                กู้คืนที่เลือก
              </button>
              <button
                className="btn btn-outline-danger"
                style={{ marginLeft: "0.5rem" }}
                onClick={deleteSelectedItems}
              >
                ลบที่เลือก
              </button>
            </div>
          )}
          <Table className="bin-table-content">
            {currentItems.length > 0 && (
              <thead className="bin-thead-content">
                <tr>
                  <th className="text-center" style={{ width: "5%" }}>
                    <input
                      type="checkbox"
                      checked={
                        selectedItems.length === currentItems.length &&
                        currentItems.length > 0
                      }
                      ref={(input) => {
                        if (input) {
                          input.indeterminate =
                            selectedItems.length > 0 &&
                            selectedItems.length < currentItems.length;
                        }
                      }}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        const ids = currentItems.map((doc) => doc.id);
                        setSelectedItems(isChecked ? ids : []);
                      }}
                    />
                  </th>
                  <th style={{ width: "20%" }}>ชื่อ</th>
                  <th style={{ width: "40%", textAlign: "center" }}>รายละเอียด</th>
                  <th style={{ width: "20%", textAlign: "center" }}>วันที่</th>
                  <th style={{ width: "15%" }}></th>
                </tr>
              </thead>
            )}
            {currentItems.length === 0 ? (
              <tbody className="bin-tbody-content">
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    ไม่มีเอกสารในถังขยะ
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className="bin-tbody-content">
                {currentItems.map((doc) => (
                  <tr key={doc.id}>
                    <td className="text-center" style={{ width: "5%" }}>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(doc.id)}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setSelectedItems((prev) =>
                            isChecked
                              ? [...prev, doc.id]
                              : prev.filter((id) => id !== doc.id)
                          );
                        }}
                      />
                    </td>
                    <td style={{ width: "20%" }}>{doc.docNameRaw}</td>
                    <td style={{ width: "40%", textAlign: "center" }}>{doc.description}</td>
                    <td style={{ width: "20%", textAlign: "center" }}>{doc.time}</td>
                    <td style={{ width: "15%", textAlign: "right", paddingRight: "1rem" }}>
                      <button
                        className="btn btn-outline-secondary"
                        style={{ marginRight: "0.5rem", border: "none" }}
                        onClick={() => restoreDocument(doc.id)}
                      >
                        <LuUndo2 size={20} />
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        style={{ border: "none" }}
                        onClick={() => deleteDocument(doc.id)}
                      >
                        <BsTrash size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </Table>
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-outline-dark"
                style={{ border: "none", paddingBottom: "0.5rem" }}
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
              >
                <BsChevronDoubleLeft size={16} />
              </button>
              <button
                className="btn btn-outline-dark"
                style={{ border: "none", paddingBottom: "0.5rem" }}
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <BsChevronLeft size={16} />
              </button>
              <button
                className="btn"
                style={{ border: "none", color: "black" }}
                disabled
              >
                Page {currentPage} / {totalPages}
              </button>
              <button
                className="btn btn-outline-dark"
                style={{ border: "none", paddingBottom: "0.5rem" }}
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <BsChevronRight size={16} />
              </button>
              <button
                className="btn btn-outline-dark"
                style={{ border: "none", paddingBottom: "0.5rem" }}
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <BsChevronDoubleRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default Bin;