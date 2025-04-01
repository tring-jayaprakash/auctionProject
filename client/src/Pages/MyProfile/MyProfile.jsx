import React, { useContext, useEffect, useState } from "react";
import "./MyProfile.css";
import { gql, useQuery } from "@apollo/client";
import { GlobalContext } from "../../context/GlobalContext";

const GET_USER_BY_USER_ID = gql`
query MyQuery($userId: Int = 0) {
  allUsers(condition: {userId: $userId}) {
    nodes {
      city
      email
      phoneNumber
      userName
    }
  }
}
`

const MyProfile = () => {
    const {user, setUser}=useContext(GlobalContext)
    const [userData, setUserData] = useState([]);
    const {data} = useQuery(GET_USER_BY_USER_ID,{
        variables :{
            userId : user?.user_id
        },
        fetchPolicy:"cache-and-network"
    })

    useEffect(()=>{
        if(data){
            console.log(data.allUsers.nodes); 
            setUserData(...data.allUsers.nodes)
        }
    },[data])

    



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
                        {userData ? (
                            <div className="profile-container">
                                <p><b>Name:</b> {userData.userName}</p>
                                <p><b>Email:</b> {userData.email}</p>
                                <p><b>City:</b> {userData.city}</p>
                                <p><b>Phone number:</b> {userData.phoneNumber}</p>
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
