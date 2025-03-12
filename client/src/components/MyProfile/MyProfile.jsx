import React, { useEffect, useState } from "react";
import "./MyProfile.css";

const MyProfile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
        console.log(storedUser);
    }, []);

    return (
        <>

            <div id='profile-main-div'>
                <div id='profile-inner-div'>
                    <div id='profile-header-div'>
                        <h1>
                            My Profile
                        </h1>
                    </div>
                    <div id='profile-body-div'>
                        <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                            <img src="https://superplayerauction.com/user/static/media/player-logo.b76ff860.png" alt="" id="profile_img" />
                        </div>

                        <div id="profile-data">
                        {user ? (
                            <div className="profile-container">
                                <p><b>Name:</b> {user.user_name}</p>
                                <p><b>Email:</b> {user.email}</p>
                                <p><b>City:</b> {user.city}</p>
                                <p><b>Phone number:</b> {user.ph_number}</p>
                            </div>
                        ) : (
                            <p>Loading user details...</p>
                        )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyProfile;
