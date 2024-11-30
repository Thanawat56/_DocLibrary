// import components
import React, { useState, useEffect } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import AddDoc from "../../Button/AddDoc/AddDoc"

// import icons
import {
  BsHouseDoor,
  BsTrash,
  BsPersonUp,
  BsBell,
  BsFolder2,
  BsUpload,
  BsBraces,
} from "react-icons/bs";

// import style
import "./NavbarMain.css";

// เปลี่ยนชื่อไฟล์จาก Navbar เป็น NavbarMain
// เพราะชื่อไฟล์มันทับกับชื่อ import ใน bootstrap มันทำให้ error

function NavbarMain() {
  // ใช้ State สำหรับ role และ activeButton
  const [role, setRole] = useState(null);
  const [activeButton, setActiveButton] = useState("home");

  // ดึง role จาก localStorage เมื่อ component ถูก mount
  useEffect(() => {
    const userLogin = JSON.parse(localStorage.getItem("userLogin"));
    if (userLogin) {
      setRole(userLogin.role);
    }else{
      setRole(null); // ถ้าไม่พบข้อมูลผู้ใช้จะให้ role เป็น null
    }
  }, []);

  // ฟังก์ชันเพื่อเปลี่ยนปุ่มที่ถูกเลือกเมื่อกด
  const handleSelect = (buttonName) => {
    setActiveButton(buttonName);
  };

  return (
    
    <div className="navbar-container">
      <Container
        fluid
        style={{
          width: "100%",
          height: "100%",
          background: "none",
        }}
      >
        <Row className="justify-content-center py-2">
          <Col className="text-center">
            {role == "Officer" && (
            
                <AddDoc/> 
            
            )}
          </Col>
        </Row>

        {/* เมนูลิงก์สำหรับการนำทางไปยังหน้าแต่ละหน้า */}
        <Nav className="flex-column px-3">
          {/* ลิงก์ไปหน้าแรก */}
          <Nav.Link
            as={Link}
            to="/home"
            style={{ border: "none", borderRadius: "20px", color: "black" }}
            className={`d-flex align-items-center ${
              activeButton === "home" ? "bg-danger text-white" : ""
            }`}
            onClick={() => handleSelect("home")}
          >
            <BsHouseDoor className="me-2" /> หน้าแรก{" "}
          </Nav.Link>

          

          {/* เงื่อนไขแสดงปุ่มตาม Role */}
          {role === "Officer" && (
            <>
              {/* ลิงก์ไปหน้าแจ้งเตือน */}
              <Nav.Link
                as={Link}
                to="/notification"
                style={{
                  border: "none",
                  borderRadius: "20px",
                  color: "black",
                }}
                className={`d-flex align-items-center ${
                  activeButton === "notification" ? "bg-danger text-white" : ""
                }`}
                onClick={() => handleSelect("notification")}
              >
                <BsBell className="me-2" /> แจ้งเตือน
              </Nav.Link>
            </>
          )}

          {role == "Admin" && (
            <>
              {/* ลิงก์ไปหน้าอนุมัติเอกสาร */}
              <Nav.Link
                as={Link}
                to="/approve"
                style={{
                  border: "none",
                  borderRadius: "20px",
                  color: "black",
                }}
                className={`d-flex align-items-center ${
                  activeButton === "approve" ? "bg-danger text-white" : ""
                }`}
                onClick={() => handleSelect("approve")}
              >
                <BsFolder2 className="me-2" /> อนุมัติเอกสาร
              </Nav.Link>

              {/* ลิงก์ไปหน้าแจ้งเตือน */}
              <Nav.Link
                as={Link}
                to="/notification"
                style={{
                  border: "none",
                  borderRadius: "20px",
                  color: "black",
                }}
                className={`d-flex align-items-center ${
                  activeButton === "notification" ? "bg-danger text-white" : ""
                }`}
                onClick={() => handleSelect("notification")}
              >
                <BsBell className="me-2" /> แจ้งเตือน
              </Nav.Link>

              {/* ลิงก์ไปหน้าถังขยะ */}
              <Nav.Link
                as={Link}
                to="/bin"
                style={{
                  color: "black",
                  border: "none",
                  borderRadius: "20px",
                  marginTop: "2rem",
                }}
                className={`d-flex align-items-center ${
                  activeButton === "bin" ? "bg-danger text-white" : ""
                }`}
                onClick={() => handleSelect("bin")}
              >
                <BsTrash className="me-2" /> ถังขยะ
              </Nav.Link>

            
            </>
          )}

          {role == "Super Admin" && (
            <>
              {/* ลิงก์ไปหน้าอนุมัติเอกสาร */}
              <Nav.Link
                as={Link}
                to="/approve"
                style={{
                  border: "none",
                  borderRadius: "20px",
                  color: "black",
                }}
                className={`d-flex align-items-center ${
                  activeButton === "approve" ? "bg-danger text-white" : ""
                }`}
                onClick={() => handleSelect("approve")}
              >
                <BsFolder2 className="me-2" /> อนุมัติเอกสาร
              </Nav.Link>

              {/* ลิงก์ไปหน้าการจัดการสิทธิ์ */}
              <Nav.Link
                as={Link}
                to="/grant-access"
                style={{
                  border: "none",
                  borderRadius: "20px",
                  color: "black",
                }}
                className={`d-flex align-items-center ${
                  activeButton === "grant-access" ? "bg-danger text-white" : ""
                }`}
                onClick={() => handleSelect("grant-access")}
              >
                <BsPersonUp className="me-2" /> การจัดการสิทธิ์
              </Nav.Link>

              {/* ลิงก์ไปหน้าแจ้งเตือน */}
              <Nav.Link
                as={Link}
                to="/notification"
                style={{
                  border: "none",
                  borderRadius: "20px",
                  color: "black",
                }}
                className={`d-flex align-items-center ${
                  activeButton === "notification" ? "bg-danger text-white" : ""
                }`}
                onClick={() => handleSelect("notification")}
              >
                <BsBell className="me-2" /> แจ้งเตือน
              </Nav.Link>

              {/* ลิงก์ไปหน้าถังขยะ */}
              <Nav.Link
                as={Link}
                to="/bin"
                style={{
                  color: "black",
                  border: "none",
                  borderRadius: "20px",
                  marginTop: "2rem",
                }}
                className={`d-flex align-items-center ${
                  activeButton === "bin" ? "bg-danger text-white" : ""
                }`}
                onClick={() => handleSelect("bin")}
              >
                <BsTrash className="me-2" /> ถังขยะ
              </Nav.Link>

              {/* ลิงก์ไปหน้า AboutDev */}

              
            </>
          )}
          <Nav.Link
            as={Link}
            to="/aboutDev"
            style={{ border: "none", borderRadius: "20px", color: "black" }}
            className={`d-flex align-items-center ${
              activeButton === "aboutDev" ? "bg-danger text-white" : ""
            }`}
            onClick={() => handleSelect("aboutDev")}
          >
            <p className="me-2" /> AboutDev{" "}
          </Nav.Link>
        </Nav>
      </Container>
    </div>
  );
}

export default NavbarMain;
