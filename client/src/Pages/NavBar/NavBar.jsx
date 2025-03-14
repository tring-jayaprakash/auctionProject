import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import "./NavBar.css";

export const NavBar = () => {
    const { user, setUser } = useContext(GlobalContext);

    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setShowDropdown(false);
    }, []);

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
        setShowDropdown(false);
        navigate("/home");
    };


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".profile-container")) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <div id="nav">
            <div>
                <h1 id="logo">PLAYERS AUCTION..!</h1>
            </div>
            <div className="nav_btn">
                <button className="btn" style={{ border: "none" }}>
                    <Link to="/Home" className="link" style={{ fontWeight: "bolder", fontSize: "14px" }}>
                        Home Page
                    </Link>
                </button>
                {user == null ?
                    (<>
                        <button className="btn">
                            <Link className="link" to="/Login" style={{ fontWeight: "bolder" }}>
                                Login
                            </Link>
                        </button>
                        <button className="btn">
                            <Link className="link" to="/Register" style={{ fontWeight: "bolder" }}>
                                Register
                            </Link>
                        </button>
                    </>)
                    :
                    (<>
                        <div className="profile-container">
                            <FaUserCircle className="profile-icon" onClick={() => setShowDropdown((prev) => !prev)} />
                            {showDropdown && (
                                <div className="dropdown-menu">
                                    <Link to="/Dashboard" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                                        Dashboard
                                    </Link>
                                    <Link to="/Dashboard/MyProfile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                                        Profile
                                    </Link>
                                    <button className="dropdown-item logout-btn" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </>)}
            </div>
        </div >
    );
};
