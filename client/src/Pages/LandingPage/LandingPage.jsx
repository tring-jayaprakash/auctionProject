import { useState } from "react";
import "./LandingPage.css";

function LandingPage() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="home-container">
            <div className="hero">
                <h1 className="hero-title">
                    <span className="highlight">Bid</span>. Win. Own.
                </h1>
                <p className="hero-subtitle">
                    Join the most exciting auction platform and grab amazing deals in real time.
                </p>
                <button 
                    className={`explore-btn ${isHovered ? "hovered" : ""}`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    Explore Auctions
                </button>
            </div>

            <div className="features">
                <div className="feature">
                    <h2>&#128260; Real-Time Bidding</h2>
                    <p>Compete in live auctions and grab the best deals.</p>
                </div>
                <div className="feature">
                    <h2>&#128230; Wide Range of Items</h2>
                    <p>Bid on electronics, antiques, cars, and more.</p>
                </div>
                <div className="feature">
                    <h2>&#128274; Secure Transactions</h2>
                    <p>Your payments and personal data are always protected.</p>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
