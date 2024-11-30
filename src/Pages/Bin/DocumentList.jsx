import React, { useState, useEffect } from "react";
import { BsTrash , BsPlus  } from "react-icons/bs";

function DocumentList() {
  const [documents, setDocuments] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // ดึงข้อมูลเอกสารจาก Local Storage
  useEffect(() => {
    const storedDocuments = JSON.parse(localStorage.getItem("documents")) || [];
    setDocuments(storedDocuments);
  }, []);

  // เพิ่มเอกสารใหม่
  const addDocument = () => {
    const newDocument = {
      id: Date.now(), // รหัสเอกสาร (Document ID)
      title: `Document ${documents.length + 1}`, // รหัสเอกสาร (Document ID)
      content: "Sample content", // เนื้อหาในเอกสาร
      time: new Date().toLocaleString(),
    };
    const updatedDocuments = [...documents, newDocument];
    setDocuments(updatedDocuments);
    localStorage.setItem("documents", JSON.stringify(updatedDocuments));

    // แจ้งเตือนเมื่อเพิ่มเอกสารใหม่
    const notification = {
      icon: "icon.png", // ไอคอนของแจ้งเตือน
      title: "New Document Added", // หัวเรื่องของแจ้งเตือน
      body: "A new document has been added to the list.", // เนื้อหาของแจ้งเตือน
      time: new Date().toLocaleString(), // เวลาที่แจ้งเตือน
    };
    const updatedNotifications = [...notifications, notification];
    setNotifications(updatedNotifications);
    localStorage.setItem("notification", JSON.stringify(updatedNotifications));
  };

  // ย้ายเอกสารไปยัง Bin
  const moveToTrash = (id) => {
    const docToBin = documents.find((doc) => doc.id === id);
    const updatedDocuments = documents.filter((doc) => doc.id !== id);

    const bin = JSON.parse(localStorage.getItem("bin")) || [];
    bin.push(docToBin);
    localStorage.setItem("bin", JSON.stringify(bin));

    setDocuments(updatedDocuments);
    localStorage.setItem("documents", JSON.stringify(updatedDocuments));
  };

  return (
    <div className="main_css-container">
      <h1>Document List</h1>
      <button className="btn btn-outline-secondary" onClick={addDocument}>
        <BsPlus  /> Add Document
      </button>

      <table className="table">
        <thead >
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Content</th>
            <th>Time</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id}>
              <td>{doc.id}</td>
              <td>{doc.title}</td>
              <td>{doc.content}</td>
              <td>{doc.time}</td>
              <td>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => moveToTrash(doc.id)}
                >
                  <BsTrash  /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DocumentList;
