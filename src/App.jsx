// import components
import { HashRouter, Routes, Route } from "react-router-dom";

// import layout
import Layout from "./Layouts/Layout/Layout";

// import pages
import Home from "./Pages/Home/Home";
import Approve from "./Pages/Approve/Approve";
import GrantAccess from "./Pages/GrantAccess/GrantAccess";
import Notification from "./Pages/Notification/Notification";
import Bin from "./Pages/Bin/bin";


// import style
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "./App.css";

import { useState, useEffect } from "react";

function App() {
  const [data, setData] = useState([]); // State สำหรับเก็บข้อมูล
    // ฟังก์ชันสำหรับโหลดข้อมูลจาก localStorage หรือไฟล์ JSON
    useEffect(() => {
      const localData = localStorage.getItem("userData"); // ดึงข้อมูลจาก localStorage
      if (localData) {
        setData(JSON.parse(localData)); // ใช้ข้อมูลใน localStorage ถ้ามีอยู่
      } else {
        // ถ้าไม่มีข้อมูลใน localStorage ให้โหลดจากไฟล์ JSON
        fetch("./Data/DataUser.json")
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((jsonData) => {
            setData(jsonData); // บันทึกข้อมูลใน state
            localStorage.setItem("userData", JSON.stringify(jsonData)); // บันทึกข้อมูลใน localStorage
          })
          .catch((error) => console.error("Error fetching data:", error));
      }
    }, []);
  return (
    <div className="app-container">
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="*" element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/approve" element={<Approve />} />
            <Route path="/grant-access" element={<GrantAccess data={data} setData={setData} />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/bin" element={<Bin />} />
          </Route>
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;