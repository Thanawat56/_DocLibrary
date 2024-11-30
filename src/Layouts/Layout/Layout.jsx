// import components
import { Outlet } from "react-router";

import Header from "../Header/Header";
import NavbarMain from "../Navbar/NavbarMain";

// import style
import "./Layout.css";

function Layout() {
  return (
    <div className="layout-container">
      <Header />
      <div className="layout-main-container">
      <NavbarMain />
      <Outlet />
      </div>
    </div>
  );
}

export default Layout;