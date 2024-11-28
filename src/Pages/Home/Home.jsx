import "./Home.css";
import React, { useState, useEffect } from "react";
import { BsPlusLg } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";

function Home() {
  const downloadFileFromBase64 = (base64Content, fileName, fileType) => {
    const link = document.createElement("a"); // สร้าง <a> สำหรับดาวน์โหลด
    link.href = `data:${fileType};base64,${base64Content}`; // กำหนด Base64 URI
    link.download = fileName; // กำหนดชื่อไฟล์
    link.click(); // กระตุ้นการดาวน์โหลด
  };

  const [selectedDocId, setSelectedDocId] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImage, setCurrentImage] = useState(null); // เก็บภาพ Base64
  const [hoveredRow, setHoveredRow] = React.useState(null);
  const [approveDocments, setApproveDocments] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [home, setHome] = useState([]);

   // โหลดข้อมูลจาก localStorage
   const loadDocuments = () => {
    const storedDocuments = JSON.parse(localStorage.getItem("approveDocuments")) || [];
    setDocuments(storedDocuments);
    setFilteredDocuments(storedDocuments);
  };

  // ฟังก์ชันอัปเดตข้อมูลใน localStorage
  const updateLocalStorage = (data) => {
    localStorage.setItem("approveDocuments", JSON.stringify(data));
    loadDocuments(); // อัปเดต State และ UI
  };

  useEffect(() => {
    loadDocuments(); // โหลดข้อมูลครั้งแรก

    // ฟังการเปลี่ยนแปลงของ localStorage
    const handleStorageChange = () => {
      loadDocuments(); // โหลดข้อมูลใหม่เมื่อมีการเปลี่ยนแปลง
    };

    window.addEventListener("storage", handleStorageChange);

    // ลบ Event Listener เมื่อ Component ถูก Unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // const filterData = (data, filters) => {
  //   return data.filter((item) => {
  //     const matchId = filters.id ? item.id.includes(filters.id) : true;
  //     const matchDocName = filters.docName
  //       ? item.docNameRaw.includes(filters.docName)
  //       : true;
  //     const matchDocDate = filters.docDate
  //       ? item.time && item.time.startsWith(filters.docDate)
  //       : true;
  //     const matchType = filters.type ? item.type === filters.type : true;
  //     const matchFiscalYear = filters.fiscalYear
  //       ? item.fiscalYear.includes(filters.fiscalYear)
  //       : true;
  //     const matchDepartment = filters.department
  //       ? item.department.includes(filters.department)
  //       : true;

  //     return (
  //       matchId &&
  //       matchDocName &&
  //       matchDocDate &&
  //       matchType &&
  //       matchFiscalYear &&
  //       matchDepartment
  //     );
  //   });
  // };


  const [filters, setFilters] = useState({
    id: "",
    docNameRaw: "",
    docDate: "",
    type: "",
    fiscalYear: "",
    department: "",
  });

  const resetFilters = () => {
    setFilters({
      id: "",
      docNameRaw: "",
      type: "",
      fiscalYear: "",
      department: "",
    });
  };
  

  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [id]: value,
    }));
    applyFilters(); // เรียกใช้ applyFilters เพื่อกรองข้อมูลทันที
  };
  

  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);

  useEffect(() => {
    const storedDocuments =
      JSON.parse(localStorage.getItem("approveDocuments")) || [];
    setDocuments(storedDocuments);
    setFilteredDocuments(storedDocuments);
  }, []);

  // ย้ายเอกสารไปยัง Bin
  const moveToTrash = (id) => {
    const docToBin = documents.find((doc) => doc.id === id);
    const updatedDocuments = documents.filter((doc) => doc.id !== id);

    const bin = JSON.parse(localStorage.getItem("bin")) || [];
    bin.push(docToBin);
    localStorage.setItem("bin", JSON.stringify(bin));

    setDocuments(updatedDocuments);
    localStorage.setItem("approveDocuments", JSON.stringify(updatedDocuments));
  };

  const deleteSelectedDocuments = () => {
    const updatedDocuments = documents.filter(
      (doc) => !selectedDocuments.includes(doc.id)
    );
    setDocuments(updatedDocuments);
    setFilteredDocuments(
      filteredDocuments.filter((doc) => selectedDocuments.includes(doc.id))
    );
    const bin = JSON.parse(localStorage.getItem("bin")) || [];
    const newBin = bin.concat(filteredDocuments); // รวม Array เดิมกับ Array ใหม่
    localStorage.setItem("bin", JSON.stringify(newBin)); // บันทึกผลลัพธ์ลง localStorage
    updateLocalStorage(updatedDocuments); // อัปเดต localStorage และ UI
    setSelectedDocuments([]);
    localStorage.setItem("approveDocuments", JSON.stringify(updatedDocuments));
  };

  const handleCloseFilter = () => setShowFilter(false);
  const handleShowFilter = () => setShowFilter(true);

  const handleCloseInfo = () => setShowInfo(false);
  const handleShowInfo = (docId) => {
    setSelectedDocId(docId);
    setShowInfo(true); // เปิด modal เมื่อคลิก
  };

  const handleImageClick = (base64Content) => {
    setCurrentImage(base64Content); // เก็บ Base64 ของภาพ
    setShowImageModal(true); // เปิด Modal
  };

  const applyFilters = () => {
    const filtered = documents.filter((doc) => {
      return (
        (!filters.id || doc.id.includes(filters.id)) &&
        (!filters.docNameRaw || doc.docNameRaw.includes(filters.docNameRaw)) &&
        (!filters.type || doc.type === filters.type) &&
        (!filters.fiscalYear || doc.fiscalYear === Number(filters.fiscalYear)) &&
        (!filters.department || doc.department === filters.department)
      );
    });
    setFilteredDocuments(filtered);
  };
  
  
  const applySearch = () => {
    const filtered = documents.filter((doc) => {
      return (
        !filters.docName ||
        doc.docNameRaw?.toLowerCase().includes(filters.docName.toLowerCase())
      );
    });
    setFilteredDocuments(filtered);
  };

  const toggleMenu = (id) => {
    setMenuOpen((prev) => (prev === id ? null : id));
  };

  const toggleSelectDocument = (id) => {
    setSelectedDocuments((prev) =>
      prev.includes(id) ? prev.filter((docId) => docId !== id) : [...prev, id]
    );
  };

  const selectAllDocuments = (doc) => {
    setSelectedDocuments(filteredDocuments.map((doc) => doc.id));
  };

  const deselectAllDocuments = () => {
    setSelectedDocuments([]);
  };
  return (
    <div className="main_css-container">
      <div className="home-container">
        <h1 style={{ padding: "20px", textAlign: "center" }}>เอกสาร</h1>
{/* Modal Filter */}
<Modal show={showFilter} onHide={handleCloseFilter}>
  <Modal.Header closeButton style={{ backgroundColor: "orange" }}>
    <Modal.Title style={{ color: "white" }}>Filter</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group controlId="id">
        <Form.Label>เลขเอกสาร</Form.Label>
        <Form.Control
          type="text"
          placeholder="ระบุเลขเอกสาร"
          value={filters.id}
          onChange={handleFilterChange}
        />
      </Form.Group>

      <Form.Group controlId="docNameRaw" className="mt-3">
        <Form.Label>ชื่อเอกสาร</Form.Label>
        <Form.Control
          type="text"
          placeholder="ระบุชื่อเอกสาร"
          value={filters.docNameRaw}
          onChange={handleFilterChange}
        />
      </Form.Group>

      <Form.Group controlId="type" className="mt-3">
        <Form.Label>ประเภทเอกสาร</Form.Label>
        <Form.Control
          as="select"
          value={filters.type}
          onChange={handleFilterChange}
        >
          <option value="">เลือกประเภทเอกสาร</option>
          <option value="เอกสารทั่วไป">เอกสารทั่วไป</option>
          <option value="เอกสารบัญชี">เอกสารบัญชี</option>
          <option value="เอกสารราชการ">เอกสารราชการ</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="fiscalYear" className="mt-3">
        <Form.Label>ปีงบประมาณ</Form.Label>
        <Form.Control
          type="number"
          value={filters.fiscalYear}
          onChange={handleFilterChange}
        />
      </Form.Group>

      <Form.Group controlId="department" className="mt-3">
        <Form.Label>หน่วยงาน</Form.Label>
        <Form.Control
          as="select"
          value={filters.department}
          onChange={handleFilterChange}
        >
          <option value="">เลือกหน่วยงาน</option>
          <option value="กระทรวงพลังงาน">กระทรวงพลังงาน</option>
          <option value="กระทรวงการคลัง">กระทรวงการคลัง</option>
        </Form.Control>
      </Form.Group>

      <Button variant="dark" className="mt-4" onClick={applyFilters}>
        ใช้ตัวกรอง
      </Button>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseFilter}>
      ปิด
    </Button>
    <Button variant="outline-danger" onClick={resetFilters}>
      ล้างค่าทั้งหมด
    </Button>
  </Modal.Footer>
</Modal>


        <Modal
          size="lg"
          show={showInfo}
          onHide={handleCloseInfo}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>ข้อมูลเอกสาร</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Container>
              {/* เช็คว่าเอกสารที่เลือกมีข้อมูลหรือไม่ */}
              {filteredDocuments.length > 0 && selectedDocId && (
                <Form>
                  {/* หาตัวเอกสารที่ตรงกับ selectedDocId */}
                  {filteredDocuments
                    .filter((doc) => doc.id === selectedDocId)
                    .map((doc) => (
                      <div key={doc.id}>
                        <Row className="mb-3">
                          <Col>
                            <Form.Group controlId="docNumber">
                              <Form.Label>เลขเอกสาร :</Form.Label>
                              <Form.Control
                                type="text"
                                value={doc.id}
                                readOnly
                              />
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group controlId="docNameRaw">
                              <Form.Label>ชื่อเอกสาร :</Form.Label>
                              <Form.Control
                                type="text"
                                value={doc.docNameRaw}
                                readOnly
                              />
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group controlId="docTime">
                              <Form.Label>เวลา :</Form.Label>
                              <Form.Control
                                type="text"
                                value={doc.time}
                                readOnly
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row className="mb-3">
                          <Col>
                            <Form.Group controlId="docDepartment">
                              <Form.Label>หน่วยงาน :</Form.Label>
                              <Form.Control
                                type="text"
                                value={doc.department}
                                readOnly
                              />
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group controlId="docType">
                              <Form.Label>ประเภท :</Form.Label>
                              <Form.Control
                                type="text"
                                value={doc.type}
                                readOnly
                              />
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group controlId="docType">
                              <Form.Label>งบประมาณประจำปี :</Form.Label>
                              <Form.Control
                                type="text"
                                value={doc.fiscalYear}
                                readOnly
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row className="mb-3">
                          <Col>
                            <Form.Group controlId="docDescription">
                              <Form.Label>คำอธิบาย :</Form.Label>
                              <Form.Control
                                type="text"
                                value={doc.description}
                                readOnly
                              />
                              <Form.Group controlId="docTitle">
                                <Form.Label>ผู้อัปโหลด :</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={`ชื่อ: ${doc.name} | ตำเเหน่ง:${doc.role} | เเผนก: ${doc.userDepartment}`}
                                  readOnly
                                />
                              </Form.Group>
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>
                    ))}
                </Form>
              )}
            </Container>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseInfo}>
              ปิด
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showImageModal}
          onHide={() => setShowImageModal(false)}
          centered
          dialogClassName="custom-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Preview Image</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div
              style={{
                width: "100%",
                height: "100%",
                overflow: "auto", // เพิ่ม scroll ถ้าภาพใหญ่เกินไป
                display: "flex", // จัดกึ่งกลางภาพ
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {currentImage ? (
                <img
                  src={`data:image/png;base64,${currentImage}`}
                  alt="Preview"
                  style={{
                    width: "auto",
                    height: "auto",
                    maxWidth: "100%", // ภาพจะไม่กว้างเกินกรอบ Modal
                    maxHeight: "100%", // ภาพจะไม่สูงเกินกรอบ Modal
                    objectFit: "contain",
                  }}
                />
              ) : (
                <p>Loading image...</p>
              )}
            </div>
          </Modal.Body>
        </Modal>

        {/* Search and Filter */}
        <span className="search-container">
          <Form>
            <Form.Control
              type="text"
              placeholder="ระบุชื่อเอกสาร"
              className="me-2"
              aria-label="Search"
              style={{ width: "25rem", border: "orange 2px solid" }}
              value={filters.docName}
              onChange={handleFilterChange}
              id="docName"
            />
          </Form>

          <div>
            <Button
              onClick={applySearch}
              style={{ border: "orange 2px solid", backgroundColor: "orange" }}
            >
              ค้นหา
            </Button>

            <Button
              onClick={handleShowFilter}
              className="ms-2"
              style={{ border: "orange 2px solid", backgroundColor: "orange" }}
            >
              ฟิลเตอร์
            </Button>
          </div>
        </span>

        {/* Select All */}
        <div style={{ margin: "20px 0" }}>
          <Button
            variant="primary"
            onClick={selectAllDocuments}
            style={{ marginLeft: "20px" }}
          >
            เลือกทั้งหมด
          </Button>
          <Button
            variant="secondary"
            onClick={deselectAllDocuments}
            style={{ marginLeft: "10px" }}
            disabled={selectedDocuments.length === 0}
          >
            ยกเลิกการเลือกทั้งหมด
          </Button>
          <Button
            variant="danger"
            // onClick={deleteSelectedDocuments}
            onClick={(doc) => deleteSelectedDocuments(doc.id)}
            style={{ marginLeft: "10px" }}
            disabled={selectedDocuments.length === 0}
          >
            ลบที่เลือก
          </Button>
        </div>

        {/* Table for Documents */}
        <div className="file-container">
          <table className="table-container">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      e.target.checked
                        ? selectAllDocuments()
                        : deselectAllDocuments()
                    }
                    checked={
                      selectedDocuments.length > 0 &&
                      selectedDocuments.length === filteredDocuments.length
                    }
                  />
                </th>
                <th>ID</th>
                <th>Name</th>
                <th>Date</th>
                <th>Type</th>
                <th>Describe</th>
                <th>Uploader</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((doc) => (
              
              < tr key={doc.id}
              
                onMouseEnter={() => setHoveredRow(doc.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
              <td>
                  <input
                      type="checkbox"
                      checked={selectedDocuments.includes(doc.id)}
                      onChange={() => toggleSelectDocument(doc.id)}
                  />
              </td>
              <td onClick={() => handleImageClick(doc.file.content)} style={{ cursor: "pointer" }}>
                  {doc.id}
              </td>
              <td onClick={() => handleImageClick(doc.file.content)} style={{ cursor: "pointer" }}>
                  {doc.docNameRaw}
              </td>
              <td onClick={() => handleImageClick(doc.file.content)} style={{ cursor: "pointer" }}>
                  {doc.time}
              </td>
              <td onClick={() => handleImageClick(doc.file.content)} style={{ cursor: "pointer" }}>
                  {doc.type}
              </td>
              <td onClick={() => handleImageClick(doc.file.content)} style={{ cursor: "pointer" }}>
                  {doc.description}
              </td>
              <td onClick={() => handleImageClick(doc.file.content)} style={{ cursor: "pointer" }}>
                  {doc.name}
              </td>
          
                  <td style={{ textAlign: "end" }}>
                    {/* ถ้า hoveredRow ตรงกับ doc.id ให้แสดงไอคอน action; ถ้าไม่ตรง ให้แสดง 3 จุด */}
                    {hoveredRow === doc.id ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: "10px",
                        }}
                      >
                        {/* View Details */}
                        <button
                          onClick={() => handleShowInfo(doc.id)}
                          title="View Details"
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "1.2em",
                          }}
                        >
                          <i className="bi bi-info-circle"></i>
                        </button>
                        {/* Download */}
                        <button
                          onClick={() =>
                            downloadFileFromBase64(
                              doc.file.content,
                              doc.file.name,
                              doc.file.type
                            )
                          }
                          title="Download"
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "1.2em",
                          }}
                        >
                          <i className="bi bi-download"></i>
                        </button>
                        {/* Delete */}
                        <button
                          onClick={() => moveToTrash(doc.id)}
                          title="Delete"
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "1.2em",
                            color: "red",
                          }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ) : (
                      // แสดง 3 จุดเมื่อไม่ได้ hover
                      <button
                        style={{
                          cursor: "pointer",
                          background: "none",
                          border: "none",
                          color: "#4d4d4d",
                          fontSize: "1.2em",
                        }}
                        onClick={() => toggleMenu(doc.id)}
                        title="More Actions"
                      >
                        <i className="bi bi-three-dots-vertical"></i>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Home;
