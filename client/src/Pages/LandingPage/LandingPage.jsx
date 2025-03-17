import { useState } from "react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";

function LandingPage() {
    const navigator = useNavigate()
    const handleExplore = ()=>{
        navigator('/Reault')
    }
    return (
        <div className="home-container">
            <div className="landing">
                <h1 className="landing-title">
                    <span className="highlight">Bid</span>. Win. Own.
                </h1>
                <p className="landing-subtitle">
                    Join the most exciting auction platform and grab amazing deals in real time.
                </p>
                <button 
                    className="explore-btn" onClick={handleExplore}>
                    Explore Auctions
                </button>
            </div>

            <div className="features">
                <div className="feature">
                    <h2>&#128260; Real-Time Bidding</h2>
                    <p>Compete auctions and grab the best deals.</p>
                </div>
                <div className="feature">
                    <h2>&#128230; Wide Range </h2>
                    <p>Bid with Cricket , Football , Volleyball , Tennis ,Badminton and more.</p>
                </div>
                <div className="feature">
                    <h2>&#128274; Secure </h2>
                    <p>Your  personal data are always protected.</p>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
