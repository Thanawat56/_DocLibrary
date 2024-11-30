// import components

// import button
import Login from "../../Button/Login/Login";

// import icon

// import style
import "./Header.css";

function Header() {
  return (
    <div className="Header-container">
      <div className="logo-img">
        <img src="./LogoAPP.png" alt="" />
      </div>
      <div className="Right-Box ">
        <Login />
      </div>
    </div>
  );
}

export default Header;
