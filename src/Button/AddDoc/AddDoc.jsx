import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import { BsPlusLg, BsUpload } from "react-icons/bs";

import "./AddDoc.css";

function AddDoc() {
  const [show, setShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    docNameRaw: "",
    docType: "",
    fiscalYear: "",
    department: "",
    description: "",
  });
  const [documents, setDocuments] = useState([]);

  const handleClose = () => {
    setShow(false); // ปิด Modal หรือ Dialog
  };

  useEffect(() => {
    const storedDocuments = JSON.parse(localStorage.getItem("documents")) || [];
    setDocuments(storedDocuments);
  }, []);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "documents") {
        const updatedDocuments = JSON.parse(event.newValue) || [];
        setDocuments(updatedDocuments);
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Content = e.target.result.split(",")[1]; // นำเฉพาะข้อมูล Base64
        setSelectedFile({
          name: file.name,
          size: file.size,
          type: file.type,
          content: base64Content,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    const { id, docNameRaw, type, fiscalYear, department, description } =
      formData;

    // Check if all required fields are filled
    if (!id || !docNameRaw || !type || !fiscalYear || !department) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วนและเลือกไฟล์ก่อนอัปโหลด");
      return;
    }

    // Check if the ID already exists
    const currentData =
      JSON.parse(localStorage.getItem("approveDocument")) || [];
    const existingDocument = currentData.find((doc) => doc.id === id);
    if (existingDocument) {
      alert("ไอดีซ้ำ! กรุณาระบุเลขเอกสารที่ไม่ซ้ำ");
      return;
    }

    const userLogin = JSON.parse(localStorage.getItem("userLogin"));
    if (!userLogin || !userLogin.name) {
      alert("ไม่พบข้อมูลผู้ใช้งาน กรุณาล็อกอินใหม่อีกครั้ง");
      return;
    }

    const newDocument = {
      id,
      docNameRaw,
      type,
      fiscalYear,
      department,
      description,
      file: selectedFile,
      name: userLogin.name,
      role: userLogin.role,
      userDepartment: userLogin.userDepartment,
      time: new Date().toLocaleDateString(),
    };

    // **เพิ่มการสร้าง Notification**
    const newNotification = {
      id: Date.now(), // สร้าง ID ที่ไม่ซ้ำกัน
      title: "เพิ่มเอกสารใหม่",
      body: `เอกสาร "${docNameRaw}" ถูกเพิ่มโดย ${userLogin.name}`,
      time: new Date().toLocaleString(),
      priority: "normal", // สามารถเปลี่ยนเป็น "high" ได้หากจำเป็น
      read: false, // สถานะการแจ้งเตือน (ยังไม่อ่าน)
    };

    // บันทึก Notification ใน Local Storage
    const currentNotifications =
      JSON.parse(localStorage.getItem("notifications")) || [];
    const updatedNotifications = [...currentNotifications, newNotification];
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));

    // Save the new document to localStorage
    const updatedDocuments = [...currentData, newDocument];
    if (updatedDocuments) {
      localStorage.setItem("documents", JSON.stringify(updatedDocuments));
      setDocuments(updatedDocuments);

      setSelectedFile(null);
      setFormData({
        id: "",
        docNameRaw: "",
        type: "",
        fiscalYear: "",
        department: "",
        description: "",
      });

      alert("อัปโหลดข้อมูลสำเร็จ!");
      handleClose();
    } else {
      alert("ไม่สามารถบันทึกเอกสารได้");
    }
  };

  // ฟังก์ชันแปลงค่า 'type' เป็นชื่อ

  return (
    <div>
      <Button
        variant="white"
        onClick={() => setShow(true)}
        style={{
          margin: "1rem 0.5rem 1rem 0.5rem",
          padding: "0.5rem",
          borderRadius: "10px",
          width: "8rem",
          height: "3rem",
          boxShadow: "0px 2px 4px lightgray",
        }}
      >
        <BsPlusLg className="me-2" />
        เพิ่มเอกสาร
      </Button>

      <Modal
        size="lg"
        show={show}
        onHide={() => setShow(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <BsPlusLg className="me-2" />
          <Modal.Title>เพิ่มเอกสาร</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Container className="mt-4">
            <header className="header-1">
              <h2>การจัดข้อมูลเอกสาร</h2>
            </header>

            <Form className="form-container">
              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="id">
                    <Form.Label>เลขเอกสาร :</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="ระบุเลขเอกสาร"
                      value={formData.id}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="docNameRaw">
                    <Form.Label>ชื่อเอกสาร :</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="ระบุชื่อเอกสาร"
                      value={formData.docNameRaw}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="type">
                    <Form.Label>ประเภทเอกสาร :</Form.Label>
                    <Form.Select
                      value={formData.type}
                      onChange={handleInputChange}
                    >
                      <option value="">เลือกประเภทเอกสาร</option>
                      <option value="เอกสารทั่วไป">เอกสารทั่วไป</option>
                      <option value="เอกสารบัญชี">เอกสารบัญชี</option>
                      <option value="เอกสารราชการ">เอกสารราชการ</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="fiscalYear">
                    <Form.Label>ปีงบประมาณ :</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="ระบุปีงบประมาณ"
                      value={formData.fiscalYear}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="department">
                    <Form.Label>หน่วยงาน :</Form.Label>
                    <Form.Select
                      value={formData.department}
                      onChange={handleInputChange}
                    >
                      <option value="">เลือกหน่วยงาน</option>
                      <option value="กระทรวงพลังงาน">กระทรวงพลังงาน</option>
                      <option value="กระทรวงการคลัง">กระทรวงการคลัง</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="description">
                    <Form.Label>คำอธิบาย :</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="ระบุคำอธิบาย"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group controlId="fileUpload" className="mb-3">
                <Form.Label>อัปโหลดไฟล์ :</Form.Label>
                <Form.Control type="file" onChange={handleFileChange} />
              </Form.Group>

              {selectedFile && (
                <div className="file-info">
                  <p>
                    <strong>ชื่อไฟล์:</strong> {selectedFile.name}
                  </p>
                  <p>
                    <strong>ขนาดไฟล์:</strong>{" "}
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                  <p>
                    <strong>วันที่/เวลาปัจจุบัน:</strong>{" "}
                    {new Date().toLocaleString()}
                  </p>
                </div>
              )}
            </Form>
          </Container>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            ปิด
          </Button>
          <Button variant="success" onClick={handleUpload}>
            <BsUpload className="me-2" /> อัปโหลด
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AddDoc;
