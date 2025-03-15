import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import "./NavBar.css";

export const NavBar = () => {
    const { user, setUser } = useContext(GlobalContext);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    // Check scroll position to dynamically change navbar styles
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Retrieve stored user data
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
        <nav id="nav" className={isScrolled ? "scrolled" : ""}>
            <div>
                <h1 id="logo">PLAYERS AUCTION..!</h1>
            </div>
            <div className="nav_btn">
                <button className="btn" style={{border:"none"}}>
                    <Link to="/Reault" className="link">Explore Auction</Link>
                </button>
                <button className="btn" style={{border:"none"}}>
                    <Link to="/Home" className="link" >Home</Link>
                </button>
                {user ? (
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
                ) : (
                    <>
                        <button className="btn">
                            <Link className="link" to="/Login">Login</Link>
                        </button>
                        <button className="btn">
                            <Link className="link" to="/Register">Register</Link>
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};
