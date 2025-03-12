import auctionLogo from "../../assets/playersAuction.png";
import { Link } from "react-router-dom";
import '../NavBar/NavBar.css';
import { useContext, useEffect } from "react";
import { GlobalContext } from "../../context/GlobalContext";

export const NavBar = () => {
    const { user, setUser } = useContext(GlobalContext);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleClick = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <div id='nav'>
            <div>
                <h1 id='logo'>PLAYERS  AUCTION..!</h1>
            </div>
            {user == null ? (
                <div className='nav_btn'>
                    <button className='btn'><Link className='link' to='/Login' style={{ fontWeight: "bolder" }}>Login</Link></button>
                    <button className='btn'><Link className='link' to='/Register' style={{ fontWeight: "bolder" }}>Register</Link></button>
                </div>
            ) : (
                <div className='nav_btn'>
                    <button className='btn'><Link to='/Register' className='link' onClick={handleClick} style={{ fontWeight: "bolder" }}> Log Out </Link></button>
                </div>
            )}
        </div>
    );
};
