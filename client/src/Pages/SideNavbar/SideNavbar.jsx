import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalContext";
import { GiHamburgerMenu } from "react-icons/gi";
import "./SideNavbar.css";

const SideNavbar = () => {
  const { user, setUser, theme } = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
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
      <div id="SideNavbar" className={ "closed"}>
        {menuItems.map((item, index) => (
          <div key={index} className="sideNavbarItem" onClick={() => { navigate(item.path) }}>
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
