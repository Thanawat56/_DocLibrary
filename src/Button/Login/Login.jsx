// import components
import { useState, useRef, useMemo } from "react";
import {
  Button,
  Modal,
  Form,
  Col,
  Row,
  Dropdown,
  Toast,
  ToastContainer,
  Alert,
} from "react-bootstrap";

// import icon
import {
  BsPersonBadge,
  BsPersonCircle,
  BsFillDoorOpenFill,
  BsExclamationDiamond,
  BsEmojiLaughing,
} from "react-icons/bs";

// import style
import "./Login.css";

function Login() {
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("userLogin")) || null
  ); // ดึงข้อมูลผู้ใช้จาก local storage
  const [showAlert, setShowAlert] = useState(false); // แสดง/ซ่อน Alert
  const [showToast, setShowToast] = useState(false); // แสดง/ซ่อน Toast Notification
  const userRef = useRef();
  const passRef = useRef();

  // ระบบ Login
  const handleLogin = () => {
    const userID = userRef.current.value.trim();
    const pass = passRef.current.value.trim();

    userRef.current.value = "";
    passRef.current.value = "";

    // ดึงข้อมูลผู้ใช้ทั้งหมดจาก local storage
    const allUsers = JSON.parse(localStorage.getItem("userData")) || [];
    const user = allUsers.find((u) => u.id == userID && u.password == pass);

    if (!user) {
      setShowAlert(true); // แสดง Alert
      // ตั้งเวลาให้ Alert ปิดเองหลัง 2 วินาที
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
      userRef.current.focus();
    } else {
      // เก็บข้อมูลผู้ใช้ที่ล็อกอินลงใน local storage
      localStorage.setItem("userLogin", JSON.stringify(user));
      setUserInfo(user); // เก็บข้อมูลใน state
      setShowAlert(false); // ซ่อน Alert
      setShowToast(true); // แสดงแจ้งเตือน (Toast Notification)

      // แจ้ง NavbarMain ว่ามีการเปลี่ยนแปลง
      window.dispatchEvent(new Event("storage"));

      // เปลี่ยนเส้นทางไปยังหน้า Home
      window.location.href = "home";
    }
  };

  // ระบบ Logout
  const handleLogout = () => {
    setUserInfo(null); // รีเซ็ตข้อมูลผู้ใช้
    localStorage.removeItem("userLogin"); // ลบข้อมูลผู้ใช้จาก local storage

    // แจ้ง NavbarMain ว่ามีการเปลี่ยนแปลง
    window.dispatchEvent(new Event("storage"));

    // กลับไปที่หน้า Home
    window.location.href = "home";
  };

  // popUp Login
  const [showLogin, setShowLogin] = useState(false);
  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);

  // เปลี่ยนสีตาม "role" นั้นๆ
  const roleColor = useMemo(() => {
    if (!userInfo) return "#6c757d"; // ค่าเริ่มต้นถ้ายังไม่ได้ล็อกอิน
    switch (userInfo.role) {
      case "Super Admin":
        return "#DC3545";
      case "Admin":
        return "#FF834E";
      case "Officer":
        return "#FFB40D";
      default:
        return "#6c757d";
    }
  }, [userInfo]);

  // หากยังไม่ได้ล็อกอิน
  if (!userInfo) {
    return (
      <div className="Login-container">
        <Button
          variant="light"
          onClick={handleShowLogin}
          style={{
            background: "white",
            border: "2px solid orange",
            boxShadow: " 0px 0px 4px #ddd",
            marginRight: "1rem",
          }}
        >
          เข้าสู่ระบบ
          <BsPersonCircle
            size={24}
            style={{
              color: "#4d4d4d",
              background: "none",
              borderRadius: "30px",
              margin: "0 0 0 0.5rem",
            }}
          />
        </Button>
        <Modal
          show={showLogin}
          onHide={handleCloseLogin}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <BsPersonBadge
                className="me-3"
                style={{ marginLeft: "0.5rem" }}
              />
              ลงชื่อเข้าสู่ระบบ
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form className="mt-2 mb-2 mx-3">
              <Form.Group as={Row} controlId="username">
                <Form.Label column sm="3">
                  รหัสพนักงาน
                </Form.Label>
                <Col sm="9">
                  <Form.Control type="id" placeholder="Id" ref={userRef} />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="password" className="mt-3">
                <Form.Label column sm="3">
                  รหัสผ่าน
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    ref={passRef}
                  />
                </Col>
              </Form.Group>
            </Form>
            {/* แสดง Alert */}
            {showAlert && (
              <Alert
                variant="danger"
                style={{
                  margin: "2rem 0.5rem -0.25rem 0.5rem",
                  height: "2rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <BsExclamationDiamond className="me-2" />
                Invalid username or password
              </Alert>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseLogin}>
              ยกเลิก
            </Button>
            <Button variant="success" onClick={handleLogin}>
              เข้าสู่ระบบ
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  // หากล็อกอินแล้ว
  return (
    <div className="Login-container">
      <Dropdown align="end" style={{ background: "none", border: "none" }}>
        <Dropdown.Toggle
          as={Button}
          className="align-items-center"
          style={{
            background: "white",
            boxShadow: " 0px 0px 4px #ccc",
            marginRight: "0.5rem",
            color: "#4d4d4d",
            border: "2px solid orange",
          }}
        >
          <span style={{ color: roleColor }}>
            <BsPersonBadge size={24} className="me-2" />
          </span>
          {userInfo.name}&nbsp; (
          <span style={{ color: roleColor }}>{userInfo.role}</span>)&nbsp;&nbsp;
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {/* <Dropdown.Item href="#/profile">View Profile</Dropdown.Item>
          <Dropdown.Item href="#/settings">Settings</Dropdown.Item>
          <Dropdown.Divider /> */}
          <Dropdown.Item onClick={handleLogout} style={{ color: "red" }}>
            <BsFillDoorOpenFill size={16} className="me-2" />
            Logout
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* Toast Notification */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg="success"
          show={showToast}
          onClose={() => setShowToast(false)}
          //จะปิดอัตโนมัติหลังจาก 3 วินาที (autohide)
          delay={3000}
          autohide
        >
          <Toast.Header>
            <BsEmojiLaughing className="me-2 text-success" />
            <strong className="me-auto">Success</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            ยินดีต้อนรับคุณ&nbsp;{userInfo.name}&nbsp;({userInfo.role}
            )&nbsp;เข้าสู่ระบบ
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default Login;