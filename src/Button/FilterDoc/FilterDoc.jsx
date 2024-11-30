import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import { BsPlusLg, BsUpload } from "react-icons/bs";

function FilterDoc() {
    const [show, setShow] = useState(false);
    const [filters, setFilters] = useState({
        docNumber: "",
        docName: "",
        docDate: "",
        docType: "",
        fiscalYear: "",
        department: "",
    });
    const [filteredData, setFilteredData] = useState([]);
    const [allData, setAllData] = useState([]);

    // ดึงข้อมูลจาก Local Storage เมื่อ component mount
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("documents")) || [];
        setAllData(data);
        setFilteredData(data);
    }, []);

    // ปิด/เปิด Modal
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // อัปเดตค่าฟิลเตอร์
    const handleFilterChange = (e) => {
        const { id, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    // ฟังก์ชันสำหรับกรองข้อมูล
    const handleFilterApply = () => {
        const filtered = allData.filter((item) => {
            return (
                (!filters.docNumber || item.docNumber.includes(filters.docNumber)) &&
                (!filters.docName || item.docName.includes(filters.docName)) &&
                (!filters.docDate || item.docDate === filters.docDate) &&
                (!filters.docType || item.docType === filters.docType) &&
                (!filters.fiscalYear || item.fiscalYear.includes(filters.fiscalYear)) &&
                (!filters.department || item.department.includes(filters.department))
            );
        });
        setFilteredData(filtered);
    };

    // ฟังก์ชันสำหรับบันทึกข้อมูลใหม่ลง Local Storage
    const handleAddDocument = (newDocument) => {
        const updatedData = [...allData, newDocument];
        setAllData(updatedData);
        setFilteredData(updatedData);
        localStorage.setItem("documents", JSON.stringify(updatedData));
    };

    return (
        <div>
            {/* ปุ่มเพิ่มเอกสาร */}
            <Button
                variant="white"
                onClick={handleShow}
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
                Filter
            </Button>

            {/* Modal คัดกรองเอกสาร */}
            <Modal
                size="lg"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <BsPlusLg className="me-2" />
                    <Modal.Title>กรองเอกสาร</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Container className="mt-4">
                        <header className="header-1">
                            <h2>การจัดข้อมูลเอกสาร</h2>
                        </header>

                        {/* ฟอร์มกรองข้อมูล */}
                        <Form className="form-container">
                            <Row className="mb-3">
                                <Col>
                                    <Form.Group controlId="docNumber">
                                        <Form.Label>เลขเอกสาร :</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="ระบุเลขเอกสาร"
                                            value={filters.docNumber}
                                            onChange={handleFilterChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="docName">
                                        <Form.Label>ชื่อเอกสาร :</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="ระบุชื่อเอกสาร"
                                            value={filters.docName}
                                            onChange={handleFilterChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col>
                                    <Form.Group controlId="docDate">
                                        <Form.Label>วันที่รับ :</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={filters.docDate}
                                            onChange={handleFilterChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="docType">
                                        <Form.Label>ประเภทเอกสาร :</Form.Label>
                                        <Form.Select
                                            value={filters.docType}
                                            onChange={handleFilterChange}
                                        >
                                            <option value="">เลือกประเภทเอกสาร</option>
                                            <option value="Type A">Type A</option>
                                            <option value="Type B">Type B</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col>
                                    <Form.Group controlId="fiscalYear">
                                        <Form.Label>ปีงบประมาณ :</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="ระบุปีงบประมาณ"
                                            value={filters.fiscalYear}
                                            onChange={handleFilterChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="department">
                                        <Form.Label>หน่วยงาน :</Form.Label>
                                        <Form.Select
                                            value={filters.department}
                                            onChange={handleFilterChange}
                                        >
                                            <option value="">เลือก</option>
                                            <option value="HR">HR</option>
                                            <option value="Finance">Finance</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Button
                                variant="dark"
                                className="search-button mb-4"
                                onClick={handleFilterApply}
                            >
                                กรอกข้อมูล
                            </Button>
                        </Form>
                    </Container>

                    {/* แสดงข้อมูลที่กรอง */}
                    <div className="result-container">
                        <h2>ผลลัพธ์ที่กรอง:</h2>
                        {filteredData.length > 0 ? (
                            <ul>
                                {filteredData.map((item, index) => (
                                    <li key={index}>
                                        {item.docNumber} - {item.docName} ({item.docType})
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>ไม่พบข้อมูลที่ตรงกับการกรอง</p>
                        )}
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        ปิด
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default FilterDoc;
