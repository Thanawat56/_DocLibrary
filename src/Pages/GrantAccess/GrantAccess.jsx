//styes
import "./GrantAccess/GrantAccess.css";
import Table from "react-bootstrap/Table";
//components
import Expandable from "./GrantAccess/Expandable";
import ExpandableButton from "./GrantAccess/ExpandableButton";

//react
import React, { useState } from "react";

function GrantAccess({ data, setData }) {
  const [openRows, setOpenRows] = useState({}); // State สำหรับจัดการการเปิด/ปิดแถว

  // ฟังก์ชันสำหรับอัปเดต role และบันทึกลง localStorage
  const handleRoleChange = (id, newRole, newDownload, newUpload) => {
    const updatedData = data.map(
      (item) =>
        item.id === id
          ? { ...item, role: newRole, download: newDownload, upload: newUpload }
          : item // อัปเดต role ของผู้ใช้ที่ตรงกับ id
    );
    setData(updatedData); // อัปเดตข้อมูลใน state
    localStorage.setItem("userData", JSON.stringify(updatedData)); // บันทึกข้อมูลใหม่ลงใน localStorage
  };

  // ฟังก์ชันสำหรับเปิด/ปิดแถว
  const toggleRow = (row) => {
    setOpenRows((prevState) => ({
      ...prevState,
      [row]: !prevState[row],
    }));
  };

  return (
    <div className="main_css-container">
      <div className="grantAccess-container">
        <h1 className="grantAccess-title">การจัดการสิทธิ์</h1>
        <div className="grantAccess-form">
          <Table className="grantAccess-table">
            <thead>
              <tr>
                <th className="fs-5">บทบาท</th>
                <th className="fs-5">รายระเอียด</th>
                <th className="text-center fs-5" style={{ width: "200px" }}>
                  จำนวน
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {["Super Admin", "Admin", "Officer"].map((role) => (
                <React.Fragment key={role}>
                  <tr
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      toggleRow(role);
                    }}
                  >
                    <td>
                      {role === "Super Admin"
                        ? "ผู้ดูแลระบบ"
                        : role === "Admin"
                        ? "หัวหน้าแผนก"
                        : "พนักงาน"}
                    </td>
                    <td>
                      {role === "Super Admin"
                        ? "สามารถดาวน์โหลด ลบเอกสาร และจัดการสิทธิ์ผู้ใช้ได้"
                        : role === "Admin"
                        ? "สามารถอนุมัติเอกสารที่เข้ามา แก้ไขข้อมูลของเอกสาร และลบเอกสาร"
                        : "สามารถอัปโหลด และดาวน์โหลดเอกสาร"}
                    </td>
                    <td className="text-center">
                      {data.filter((item) => item.role === role).length}
                    </td>
                    <td className="drop">
                      <ExpandableButton isOpen={openRows[role]} />
                    </td>
                  </tr>
                  {data
                    .filter((item) => item.role === role)
                    .map((item) => (
                      <Expandable
                        key={item.id}
                        data={item}
                        isOpen={openRows[role]}
                        allUsers={data}
                        updateAllUsers={setData}
                        onRoleChange={handleRoleChange} // ส่งฟังก์ชัน handleRoleChange ไป
                      />
                    ))}
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default GrantAccess;
