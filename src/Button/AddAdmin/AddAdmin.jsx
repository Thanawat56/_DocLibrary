// import components
/*----------ปุ่มเพิ่มแอดมิน----------*/
import { useState } from "react";
import {Button, Modal, Form, Col, Row} from "react-bootstrap";
/*---------------จบ-----------------*/

// import style
import "./AddAdmin.css";

function AddAdmin() {
  /* ----------ตัวเชื่อมของ pop_up ปุ่มเพิ่มแอดมิน----------*/
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  /* ------------------------------ */
  return (
    <div className="AddAdmin-container">

      <div className="AddAdmin-button-container">
        {/* ----------ตัวปุ่ม---------- */}
        <Button variant="primary" onClick={handleShow}>
          <span className="bi bi-person-plus-fill"></span>
          &nbsp;&nbsp;Add&nbsp;Admin
        </Button>
        {/* ----------เนื้อหาในปุ่ม---------- */}
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <span className="bi bi-person-plus-fill"></span>
              &nbsp;&nbsp;Add&nbsp;Admin
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Row>
              <Col>
                <Form.Label>ID</Form.Label>
                <Form.Control placeholder="ID" />
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label>Name</Form.Label>
                <Form.Control placeholder="Name" />
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary">
              <span className="bi bi-person-plus-fill"></span>
              &nbsp;&nbsp;Add&nbsp;Admin
            </Button>
          </Modal.Footer>
        </Modal>
        {/* ----------จบ---------- */}
      </div>
    </div>
  );
}

export default AddAdmin;
