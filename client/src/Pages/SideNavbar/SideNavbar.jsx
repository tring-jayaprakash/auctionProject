import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalContext";
import { GiHamburgerMenu } from "react-icons/gi"; // Import Hamburger Menu Icon
import "./SideNavbar.css";

const SideNavbar = () => {
  const { user, setUser, theme } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar State

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/home");
  };

  const menuItems = [
    { name: "Dashboard", path: "/Dashboard" },
    { name: "New Auction", path: "/Dashboard/NewAuction" },
    { name: "My Auction", path: "/Dashboard/MyAuction" },
    { name: "My Profile", path: "/Dashboard/Myprofile" },
  ];

  return (
    <>
      <div id="hamburgerMenu" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <GiHamburgerMenu size={30} color={"black"} />
      </div>

      <div
        id="SideNavbar"
        className={isSidebarOpen ? "open" : "closed"}>
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="sideNavbarItem"
            onClick={() => {
              navigate(item.path);
              setIsSidebarOpen(false); 
            }}
            style={{ color: theme.sidebarText }}
          >
            <b>{item.name}</b>
          </div>
        ))}
        <div id="logoutNavBar" onClick={handleLogout}>
          <b>Logout</b>
        </div>
      </div>
    </>
  );
};

export default SideNavbar;
