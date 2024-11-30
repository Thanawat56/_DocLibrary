import React from "react";

// styles
import "./GrantAccess.css";
function ExpandableButton({ isOpen, toggle }) {
  return (
    // สลับไอคอนจาก chevron-down เป็น chevron-up
    <span
      onClick={toggle}
      className={isOpen ? "bi bi-chevron-up" : "bi bi-chevron-down"}
    ></span>
  );
}

export default ExpandableButton;
