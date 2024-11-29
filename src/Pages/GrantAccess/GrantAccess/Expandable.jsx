import "./GrantAccess.css";

import EditButton from "./EditButton";
function Expandable({ data, isOpen, onRoleChange, allUsers, updateAllUsers }) {
  return (
    /* แสดงข้อมูลเมื่อ isOpen เป็น true */
    <>
      {isOpen && (
        <tr>
          <td></td>
          <td style={{ color: "grey" }}>{data.name}</td>
          <td className="text-center" style={{ color: "grey" }}>
            {data.role === "Super Admin"
              ? "หัวหน้าผู้ดูแล"
              : data.role === "Admin"
              ? "ผู้ดูแล"
              : "พนักงาน"}
          </td>
          <td align="right">
            {" "}
            {(data.role === "Officer" && (
              <EditButton
                data={data}
                allUsers={allUsers}
                onRoleChange={onRoleChange}
                updateAllUsers={updateAllUsers}
              />
            )) ||
              (data.role === "Admin" && (
                <EditButton
                  data={data}
                  allUsers={allUsers}
                  onRoleChange={onRoleChange}
                  updateAllUsers={updateAllUsers}
                />
              ))}{" "}
          </td>
        </tr>
      )}
    </>
  );
}

export default Expandable;
