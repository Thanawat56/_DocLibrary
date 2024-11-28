import './GrantAccess.css'

import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import SearchDataBar from "./SearchDataBar";
import { SearchResultsLists } from "./searchResultsLists";

function LogoutSuperAdmin() {
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  const handleClose = () => {setShow(false);}
  const handleShow = () => setShow(true);

  const [results, setResults] = useState([]);

  return (
    <>
      <span className="bi bi-box-arrow-right" onClick={handleShow}></span>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{color:"red"}}>Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <span><b>Please confirm your ID and password to log out.</b></span>
              <br />
              <Form.Label>ID:</Form.Label>
              <Form.Control type="ID" autoFocus />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Password:</Form.Label>
              <Form.Control type="password"/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>{setShow2(true); setShow(false)}}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={show2} onHide={()=>setShow2(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{color:"red"}}>New Super Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <span><b>Please add new super admin.</b></span>
              <br />
              <SearchDataBar setResults={setResults}/>
              <SearchResultsLists results={results}/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>{setShow2(false)}}>
            Cancel
          </Button>
          <Button variant="primary" onClick={()=>setShow2(false)}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default LogoutSuperAdmin;
