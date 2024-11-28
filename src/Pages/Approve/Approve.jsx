import './Approve.css';
import { useState, useEffect } from 'react';
import { LuUndo2 } from 'react-icons/lu';

function Approve() {
    const [userData, setUserData] = useState(null);  // ประกาศ useState สำหรับ userData
    const [showRejectPopup, setShowRejectPopup] = useState(false);
    const [showApprovePopup, setShowApprovePopup] = useState(false);
    const [showInfoPopup, setShowInfoPopup] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [infoItem, setInfoItem] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectAll, setSelectAll] = useState(true);
    const [permissions, setPermissions] = useState({
        superAdmin: true,
        admin: true,
        officer: true,
        guest: true
    });

    const itemsPerPage = 10;

    // ดึงข้อมูลจาก localStorage
    useEffect(() => {
        const storedDocuments = JSON.parse(localStorage.getItem("documents")) || [];
        const pendingDocuments = storedDocuments.filter(doc => !doc.approved || !doc.permissions);
        setDocuments(pendingDocuments);
    }, []);

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === "documents") {
                const updatedDocuments = JSON.parse(localStorage.getItem("documents")) || [];
                setDocuments(updatedDocuments);
            }
        };
        window.addEventListener("storage", handleStorageChange);
    
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);
    

    const totalPages = Math.ceil(documents.length / itemsPerPage);

    const currentDocuments = documents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const openRejectPopup = (item) => {
        setInfoItem(item);
        setShowRejectPopup(true);
    };

    const closePopup = () => {
        setShowRejectPopup(false);
        setRejectReason('');
    };

    const openApprovePopup = (item) => {
        setInfoItem(item);
        setSelectAll(true); // รีเซ็ตค่า selectAll เป็น false
        setPermissions({
            superAdmin: true,
            admin: true,
            officer: true,
            guest: true,
        }); // รีเซ็ต permissions ให้เป็น false ทั้งหมด
        setShowApprovePopup(true);
    };
    
    const closeApprovePopup = () => {
        setShowApprovePopup(false);
        setInfoItem(null);
        setSelectAll(true);
        setPermissions({    
            superAdmin: true,
            admin: false,
            officer: false,
            guest: true,
        });
    };

        // แก้ไขการดึงข้อมูล userData จาก localStorage
    useEffect(() => {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            try {
                setUserData(JSON.parse(storedUserData));
            } catch (error) {
                console.error('Error parsing userData:', error);
            }
        } else {
            console.log('No userData found in localStorage.');
        }
    }, []);  // ใช้ [] ใน useEffect เพื่อให้ทำงานครั้งเดียวตอน mount


        const confirmReject = () => {
            console.log("เหตุผลที่ไม่อนุมัติ:", rejectReason);
        
            // อ่านข้อมูลเอกสารทั้งหมดจาก localStorage
            const storedDocuments = JSON.parse(localStorage.getItem("documents") || "[]");
            const currentNotifications = JSON.parse(localStorage.getItem("notifications") || "[]");
        
            // หาเอกสารที่ถูกปฏิเสธ
            const rejectedDocument = storedDocuments.find(doc => doc.id === infoItem.id);
        
            if (rejectedDocument) {
                // เพิ่มข้อมูลการปฏิเสธไปยัง key `notifications`
                const newNotification = {
                    title : "เอกสารไม่ผ่านการอนุมัติ",
                    id: rejectedDocument.id,
                    docName: rejectedDocument.docName,
                    body: rejectReason,
                    approve: false, // ระบุว่าเอกสารไม่ผ่านการอนุมัติ
                    time: new Date().toLocaleString(), // เวลาที่ปฏิเสธ
                };
        
                // อัปเดต key `notifications` ใน localStorage
                const updatedNotifications = [...currentNotifications, newNotification];
                localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
        
                // ลบเอกสารที่ปฏิเสธออกจาก storedDocuments
                const updatedDocuments = storedDocuments.filter(
                    doc => doc.id !== infoItem.id
                );
                localStorage.setItem("documents", JSON.stringify(updatedDocuments));
        
                // อัปเดต state ของเอกสารในหน้าเว็บ
                setDocuments(updatedDocuments);
            }
        
            // ปิด popup หลังจากยืนยันการปฏิเสธ
            closePopup();
        };
          
        const confirmApprove = () => {
            console.log("อนุมัติเอกสาร:", infoItem.docName);
            console.log("สิทธิ์ที่เลือก:", permissions);
        
            // อ่านข้อมูลเอกสารทั้งหมดจาก localStorage
            const storedDocuments = JSON.parse(localStorage.getItem("documents") || "[]");
            const approvedDocuments = JSON.parse(localStorage.getItem("approveDocuments") || "[]");
            const currentNotifications = JSON.parse(localStorage.getItem("notifications") || "[]");
        
            // หาและอัปเดตเอกสารที่ตรงกับ docNumber
            const updatedDocuments = storedDocuments.map((doc) => {
                if (doc.id === infoItem.id) {
                    // ถ้าเจอเอกสาร ให้เพิ่มข้อมูล permissions และสถานะ approved
                    const approvedDoc = {
                        ...doc,
                        approved: true,
                        permissions: { ...permissions },
                    };
        
                    // เพิ่มเอกสารที่อนุมัติแล้วเข้าไปใน approvedDocuments
                    approvedDocuments.push(approvedDoc);
        
                    // เพิ่มข้อมูลการอนุมัติไปยัง notifications
                    const newNotification = {
                        title: "เอกสารผ่านการอนุมัติ",
                        body: "ยินดีด้วย เอกสารของคุณผ่านการอนุมัติแล้ว",
                        id: doc.id,
                        docName: doc.docName,
                        approve: true, // ระบุว่าเอกสารอนุมัติ
                        time: new Date().toLocaleString(), // เวลาที่อนุมัติ
                    };
                    const updatedNotifications = [...currentNotifications, newNotification];
                    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
        
                    return null; // ลบเอกสารนี้จาก documents
                }
                return doc; // ถ้าไม่ใช่เอกสารที่ต้องการ ให้อยู่เหมือนเดิม
            }).filter(Boolean); // กรองค่า null ออก
        
            // เขียนข้อมูลที่อัปเดตกลับไปใน localStorage
            localStorage.setItem("documents", JSON.stringify(updatedDocuments));
            localStorage.setItem("approveDocuments", JSON.stringify(approvedDocuments));
        
            // อัปเดต state documents หลังจากอนุมัติ
            setDocuments(updatedDocuments);
        
            // ปิดป๊อปอัป
            closeApprovePopup();
        };
           
    const openInfoPopup = (item) => {
        setInfoItem(item);
        setShowInfoPopup(true);
    };

    const closeInfoPopup = () => {
        setShowInfoPopup(false);
        setInfoItem(null);
    };

    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

   const toggleSelectAll = () => {
    const newState = !selectAll;
    setSelectAll(newState);
    setPermissions({
        superAdmin: newState,
        admin: newState,
        officer: newState,
        guest: newState,
    });
    setDocuments(prevDocuments =>
        prevDocuments.map(doc => ({ ...doc, selected: newState }))
    );
};


    const handlePermissionChange = (key) => {
        setPermissions((prev) => {
            const updatedPermissions = { ...prev, [key]: !prev[key] };
            setSelectAll(Object.values(updatedPermissions).every((value) => value));
            return updatedPermissions;
        });
    };

    return (
        
        <div className="main_css-container">
            <div className="Approve-container">
                <div className="Approve-header-content">
                    <h1>เอกสารทั้งหมด</h1>
                </div>
                <div className="Approve-body-content">
                    <div className="document-name">ชื่อเอกสาร</div>
                    <div className="document-uploader">ผู้อัปโหลดเอกสาร</div>
                    <div className="document-date">วันที่อัปโหลด</div>
                    <div className="icons"></div>
                </div>
                <div className="document-list">
                    {currentDocuments.map((doc) => (
                        <div className="document-item" key={doc.id}>
                            <div className="document-name"><span className="pdf-icon bi bi-file-earmark-pdf text-danger"></span>&nbsp;&nbsp;{doc.docNameRaw}</div>
                            <div className="document-uploader "><span className='profile-icon bi bi-person-circle'></span>{doc.uploader}&nbsp;&nbsp;ผู้อัปโหลดเอกสาร(จำลอง)</div>
                            <div className="document-date">{doc.time}</div>
                            <div className="icons">
                                <button className="icon-button icon-check" onClick={() => openApprovePopup(doc)}>
                                    <span className='bi bi-check2-circle text-success'></span>
                                </button>
                                <button className="icon-button icon-delete" onClick={() => openRejectPopup(doc)}>
                                    <span className='text-danger'><LuUndo2 size={28} style={{marginBottom: "8px"}}></LuUndo2></span>
                                </button>
                                <button className="icon-button icon-info" onClick={() => openInfoPopup(doc)}>
                                    <span className='bi bi-info-circle'></span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

              {/* Pagination */}
{totalPages > 1 && (
            <div className="pagination">
                <button
                    className="pagination-button"
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                >
                    <span className='bi bi-chevron-double-left'></span>
                </button>
                <button
                    className="pagination-button"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <span className='bi bi-chevron-left'></span>
                </button>
                <div className="pagination-text">Page {currentPage} / {totalPages}</div>
                <button
                    className="pagination-button"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <span className='bi bi-chevron-right'></span>
                </button>
                <button
                    className="pagination-button"
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                >
                    <span className='bi bi-chevron-double-right'></span>
                </button>
            </div>
        )}


                {/* Popups */}
                {showRejectPopup && infoItem && (
                    <div className="popup-overlay">
                        <div className="popup-container">
                            <div className="popup-header">เอกสารไม่ผ่านการอนุมัติ</div>
                            <textarea
                                className="reason-input"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="กรุณากรอกสาเหตุที่ไม่อนุมัติ..."
                            ></textarea>
                            <div className="popup-buttons">
                                <button className="popup-button popup-cancel btn btn-secondary" onClick={closePopup}>ยกเลิก</button>
                                <button className="popup-button popup-confirm btn btn-success" onClick={confirmReject}>ยืนยัน</button>
                            </div>
                        </div>
                    </div>
                )}

                {showApprovePopup && infoItem && (
                    <div className="popup-overlay">
                        <div className="popup-container">

                            <div className='popup-header'>การอนุมัติเอกสาร<br />
                                </div>
                                <span>คุณยืนยันที่จะอนุมัติเอกสาร&nbsp;<strong>{infoItem.docNameRaw}</strong>&nbsp;หรือไม่?</span>
                            <div className="popup-buttons">
                                <button className="popup-button popup-cancel btn btn-secondary" onClick={closeApprovePopup}>ยกเลิก</button>
                                <button className="popup-button popup-confirm btn btn-success" onClick={confirmApprove}>ยืนยัน</button>
                            </div>
                        </div>
                    </div>
                )}

                {showInfoPopup && infoItem && (
                    <div className="popup-overlay">
                        <div className="popup-container-info">
                            <div className="popup-header">ข้อมูลเอกสาร</div>
                            <div className="popup-content">
                                <div className="form-row">
                                    <label>เลขเอกสาร:</label>
                                    <input type="text" value={infoItem.id} readOnly />
                                    <label>ชื่อเอกสาร:</label>
                                    <input type="text" value={infoItem.docNameRaw} readOnly />
                                </div>
                                <div className="form-row">
                                    <label>ประเภทเอกสาร:</label>
                                    <input type="text" value={infoItem.type} readOnly />
                                    <label>ปีงบประมาณ:</label>
                                    <input type="text" value={infoItem.fiscalYear} readOnly />
                                    <label>วันที่รับ:</label>
                                    <input type="text" value={infoItem.time} readOnly />
                                    <label>หน่วยงาน:</label>
                                    <input type="text" value={infoItem.department} readOnly />
                                </div>
                                <div className="form-row full-width">
                                    <label>คำอธิบาย:</label>
                                    <textarea
                                        value={infoItem.description}
                                        readOnly
                                        className="description-input"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="popup-buttons">
                                <button className="popup-button popup-cancel btn btn-secondary" onClick={closeInfoPopup}>ปิด</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Approve;