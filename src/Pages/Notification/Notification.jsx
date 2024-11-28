// import components
import { useState, useEffect, useMemo } from "react";
import { Table } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

// import icons
import {
  BsChevronDoubleLeft,
  BsChevronLeft,
  BsChevronRight,
  BsChevronDoubleRight,
  BsCheckCircle,
  BsTrash,
} from "react-icons/bs";

// import style
import "react-toastify/dist/ReactToastify.css";
import "./Notification.css";

function Notification() {
  const [notification, setNotification] = useState([]); // เก็บข้อมูลแจ้งเตือนทั้งหมด
  const [currentPage, setCurrentPage] = useState(1); // หมายเลขหน้าปัจจุบัน
  const [error, setError] = useState(null); // ข้อความ Error
  const [isLoading, setIsLoading] = useState(true); // สถานะกำลังโหลด
  const [searchTerm, setSearchTerm] = useState(""); // คำค้นหา
  const [selectedIds, setSelectedIds] = useState([]); // เก็บ ID ของแจ้งเตือนที่เลือก
  const itemsPerPage = 8; // จำนวนรายการต่อหน้า

  // โหลดข้อมูลแจ้งเตือนจาก Local Storage
  useEffect(() => {
    // เริ่มต้นสถานะการโหลดให้เป็น true เพื่อแสดงว่าแอปกำลังโหลดข้อมูล
    setIsLoading(true);

    try {
      // ดึงข้อมูลการแจ้งเตือนที่เก็บไว้ใน localStorage
      const storedNotification =
        JSON.parse(localStorage.getItem("notifications")) || [];

      // ตรวจสอบว่าข้อมูลที่ได้เป็น array หรือไม่
      if (Array.isArray(storedNotification)) {
        // ถ้าใช่ ให้ตั้งค่า state 'notification' ด้วยข้อมูลที่ได้มา
        setNotification(storedNotification);
      } else {
        // ถ้าไม่ใช่ ให้แจ้งข้อผิดพลาดและโยน error เพื่อจัดการในส่วน catch
        throw new Error("Invalid data format");
      }
    } catch (err) {
      // ถ้ามีข้อผิดพลาดในกระบวนการ เช่น JSON ไม่ถูกต้อง
      console.error("Error loading notifications from localStorage:", err);

      // ตั้งค่า state 'notification' ให้เป็น array ว่าง
      setNotification([]);

      // ลบข้อมูลเก่าใน localStorage ที่อาจมีปัญหา
      localStorage.removeItem("notifications");

      // ตั้งค่า state 'error' เพื่อแจ้งผู้ใช้ว่ามีปัญหาในการโหลดข้อมูล
      setError("ไม่สามารถโหลดการแจ้งเตือนได้");
    } finally {
      // ไม่ว่าจะมีข้อผิดพลาดหรือไม่ ให้เปลี่ยนสถานะการโหลดเป็น false
      setIsLoading(false);
    }
  }, []);

  // กรองรายการแจ้งเตือนตามคำค้นหา
  const filteredNotifications = useMemo(() => {
    return notification.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.body.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [notification, searchTerm]);

  // คำนวณจำนวนหน้าทั้งหมด
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);

  // คำนวณรายการในหน้าปัจจุบัน
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredNotifications.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredNotifications, itemsPerPage]);

  // เปลี่ยนหมายเลขหน้าปัจจุบัน
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // ทำเครื่องหมายว่าแจ้งเตือนนั้นอ่านแล้ว
  const markAsRead = (id) => {
    setNotification((prevNotifications) => {
      const updatedNotification = prevNotifications.map((item) =>
        item.id === id ? { ...item, read: true } : item
      );
      localStorage.setItem(
        "notifications",
        JSON.stringify(updatedNotification)
      );
      return updatedNotification;
    });

    toast.success("ทำเครื่องหมายว่าอ่านแล้ว!", {
      icon: <BsCheckCircle color="green" size={20} />,
    });
  };

  // ทำเครื่องหมายการแจ้งเตือนทั้งหมดว่าอ่านแล้ว
  const markAllAsRead = () => {
    setNotification((prevNotifications) => {
      const updatedNotifications = prevNotifications.map((item) => ({
        ...item,
        read: true,
      }));
      localStorage.setItem(
        "notifications",
        JSON.stringify(updatedNotifications)
      );
      return updatedNotifications;
    });

    toast.success("ทำเครื่องหมายการแจ้งเตือนทั้งหมดว่าอ่านแล้ว!", {
      icon: <BsCheckCircle color="green" size={20} />,
    });
  };

  // ลบแจ้งเตือนเดี่ยว
  const deleteNotification = (id) => {
    const notificationToDelete = notification.find((item) => item.id === id);
  
    if (notificationToDelete.priority === "high") {
      toast.error("ไม่สามารถลบการแจ้งเตือนที่มีความสำคัญสูงได้!");
      return;
    }
  
    if (window.confirm("คุณแน่ใจว่าต้องการลบการแจ้งเตือนนี้?")) {
      const updatedNotification = notification.filter((item) => item.id !== id);
      setNotification(updatedNotification);
      localStorage.setItem(
        "notifications",
        JSON.stringify(updatedNotification)
      );
      toast.success("การแจ้งเตือนถูกลบเรียบร้อยแล้ว!");
    }
  };

  // ลบการแจ้งเตือนหลายรายการ
  const deleteSelectedNotifications = () => {
    if (selectedIds.length === 0) {
      toast.error("กรุณาเลือกแจ้งเตือนที่ต้องการลบ");
      return;
    }
  
    const highPriorityItems = notification.filter(
      (item) => selectedIds.includes(item.id) && item.priority === "high"
    );
  
    if (highPriorityItems.length > 0) {
      toast.error("ไม่สามารถลบการแจ้งเตือนที่มีความสำคัญสูงได้!");
      return;
    }
  
    if (window.confirm("คุณแน่ใจว่าต้องการลบแจ้งเตือนที่เลือก?")) {
      const updatedNotification = notification.filter(
        (item) => !selectedIds.includes(item.id)
      );
      setNotification(updatedNotification);
      setSelectedIds([]);
      localStorage.setItem(
        "notifications",
        JSON.stringify(updatedNotification)
      );
      toast.success("การแจ้งเตือนที่เลือกถูกลบแล้ว");
    }
  };  

  // จัดการเลือกหรือยกเลิกเลือกแจ้งเตือน
  const handleSelectNotification = (id) => {
    setSelectedIds((prevSelectedIds) =>
      prevSelectedIds.includes(id)
        ? prevSelectedIds.filter((selectedId) => selectedId !== id)
        : [...prevSelectedIds, id]
    );
  };

  return (
    <div className="main_css-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="notification-container">
        <div
          className="notification-header-content"
          style={{ textAlign: "center" }}
        >
          <h1>กล่องแจ้งเตือน</h1>
        </div>
        <div className="notification-body-content">
          {isLoading ? (
            <p style={{ textAlign: "center" }}>กำลังโหลด...</p>
          ) : error ? (
            <p style={{ color: "red", textAlign: "center" }}>{error}</p>
          ) : (
            <div>
              {/* แสดงช่องค้นหาและปุ่มต่างๆเฉพาะเมื่อมีข้อความแจ้งเตือน */}
              {notification.length > 0 && (
                <div>
                  <div
                    className="notification-search-container"
                    style={{ textAlign: "center" }}
                  >
                    <input
                      type="text"
                      placeholder="ค้นหาการแจ้งเตือน..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        marginBottom: "10px",
                        padding: "5px",
                        width: "50%",
                      }}
                    />
                  </div>
                  {/* เดี๋ยวกลับมาน่ะจร่ะ */}
                  {/* <button
                    className="btn btn-outline-primary"
                    onClick={markAllAsRead}
                    style={{ marginBottom: "10px" }}
                  >
                    อ่านทั้งหมดแล้ว
                  </button> */}
                  <button
                    className="btn btn-outline-danger"
                    onClick={deleteSelectedNotifications}
                    style={{ marginBottom: "10px", marginLeft: "10px" }}
                  >
                    ลบที่เลือก
                  </button>
                </div>
              )}
              <Table className="notification-table-container">
                {currentItems.length > 0 && (
                  <thead>
                    <tr>
                      <th style={{ textAlign: "center" }}>
                        <input
                          type="checkbox"
                          onChange={(e) =>
                            setSelectedIds(
                              e.target.checked
                                ? currentItems.map((item) => item.id)
                                : []
                            )
                          }
                          checked={
                            selectedIds.length > 0 &&
                            currentItems.every((item) =>
                              selectedIds.includes(item.id)
                            )
                          }
                        />
                      </th>
                      <th>ชื่อ</th>
                      <th>เนื้อหา</th>
                      <th style={{ textAlign: "center" }}>เวลา</th>
                      <th style={{ textAlign: "center" }}>ความสำคัญ</th>
                      <th></th>
                    </tr>
                  </thead>
                )}
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((item) => (
                      <tr
                        key={item.id}
                        style={{
                          backgroundColor: item.read ? "#F5F5F5" : "#FFCF9E",
                        }}
                      >
                        <td style={{ textAlign: "center" }}>
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(item.id)}
                            onChange={() => handleSelectNotification(item.id)}
                          />
                        </td>
                        <td>{item.title}</td>
                        <td>{item.body}</td>
                        <td style={{ textAlign: "center" }}>{item.time}</td>
                        <td
                          style={{
                            textAlign: "center",
                            color: item.priority === "high" ? "red" : "green",
                          }}
                        >
                          {item.priority === "high" ? "สูง" : "ปกติ"}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {/* เดี่ยวมาเปิดทีหลัวง */}
                          {/* <button
                            className="btn btn-outline-secondary"
                            onClick={() => markAsRead(item.id)}
                            style={{ marginRight: "5px" }}
                          >
                            <BsCheckCircle size={16} /> อ่านแล้ว
                          </button> */}
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => deleteNotification(item.id)}
                            
                          >
                            <BsTrash size={16} /> ลบ
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center" }}>
                        {searchTerm
                          ? "ไม่พบผลลัพธ์ที่เกี่ยวข้องกับการค้นหา"
                          : "ไม่มีการแจ้งเตือนในขณะนี้"}
                      </td>
                    </tr>
                  )}
                </tbody>
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
          )}
        </div>
      </div>
    </div>
  );
}

export default Notification;