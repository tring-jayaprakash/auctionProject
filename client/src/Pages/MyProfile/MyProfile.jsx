import React, { useContext, useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { GlobalContext } from "../../context/GlobalContext";
import { GET_USER_BY_USER_ID } from "../../../graphql/query/userQuery";
import { useForm } from "react-hook-form";
import "./MyProfile.css";
import { toast } from "react-toastify";

const UPDATE_USER_BY_EMAIL = gql`
mutation MyMutation($email: String = "", $city: String = "", $phoneNumber: String = "", $userName: String = "") {
  updateUserByEmail(
    input: {userPatch: {city: $city, phoneNumber: $phoneNumber, userName: $userName}, email: $email}
  ) {
    user {
      city
      email
      phoneNumber
      userName
    }
  }
}
`;


const MyProfile = () => {
    const { user, setUser } = useContext(GlobalContext)
    const [userData, setUserData] = useState([]);
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
    const [editFlag, setEditFlag] = useState(false)
    const [updateUserByEmail] = useMutation(UPDATE_USER_BY_EMAIL);
    const { data } = useQuery(GET_USER_BY_USER_ID, {
        variables: {
            userId: user?.user_id
        },
        fetchPolicy: "cache-and-network"
    })

    useEffect(() => {
        if (data) {
            setUserData(...data.allUsers.nodes)
        }
    }, [data])

    const onSubmit = async (userdata) => {
        setEditFlag(!editFlag)
        const res = await updateUserByEmail({
            variables: {
                email: userdata.email,
                city: userdata.city,
                phoneNumber: userdata.phoneNumber,
                userName: userdata.userName
            },
            context: {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        });
        if (res.data) {
            setUserData(res.data.updateUserByEmail.user);
            toast.success("Updated Sucessfully", { position: "top-right", autoClose: 1000 })
        }

    }

    const handleEdit = () => {
        setEditFlag(!editFlag)
        setValue("userName", userData.userName)
        setValue("email", userData.email)
        setValue("city", userData.city)
        setValue("phoneNumber", userData.phoneNumber)
    }

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
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <img src="https://superplayerauction.com/user/static/media/player-logo.b76ff860.png" alt="" id="profile_img" />
                        </div>

                        <div id="profile-data">
                            {userData ? (
                                <>
                                    <div className="profile-container">
                                        <p><b>Name:</b> {userData.userName}</p>
                                        <p><b>Email:</b> {userData.email}</p>
                                        <p><b>City:</b> {userData.city}</p>
                                        <p><b>Phone number:</b> {userData.phoneNumber}</p>
                                        <div id="profile-edit-btn-div">
                                            <button id="profile-edit-btn" onClick={handleEdit}>
                                                Edit
                                            </button>
                                        </div>
                                    </div>

                                </>
                            ) : (
                                <p>Loading user details...</p>
                            )}
                        </div>
                    </div>
                </div>
                {
                    editFlag &&
                    <div id="profile-edit">
                        <div>
                            <form onSubmit={handleSubmit(onSubmit)} id="player-form" style={{ width: "500px" }}>
                                <div className="form-group-players">
                                    <div id="div">
                                        <label >Name </label>
                                        {errors.player_name && <p className="error">{errors.player_name.message}</p>}
                                    </div>
                                    <div>
                                        <input type="text" {...register("userName")} />
                                    </div>
                                </div>
                                <div className="form-group-players">
                                    <div id="div">
                                        <label >Email</label>
                                    </div>
                                    <div>
                                        <input type="text" {...register("email")} readOnly />
                                    </div>
                                </div>
                                <div className="form-group-players">
                                    <div id="div">
                                        <label >City </label>
                                    </div>
                                    <div>
                                        <input type="text" {...register("city")} />
                                    </div>
                                </div>
                                <div className="form-group-players">
                                    <div id="div">
                                        <label >Phone number</label>
                                        {errors.phoneNumber && <p className="error">{errors.phoneNumber.message}</p>}
                                    </div>
                                    <div>
                                        <input type="number" {...register("phoneNumber",
                                            {
                                                required: "Phone number is required",
                                                pattern: {
                                                    value: /^[0-9]{10}$/,
                                                    message: "Phone number must be 10 digits"
                                                }
                                            }
                                        )} />
                                    </div>
                                </div>
                                <div className="form-group-players" id="btn-div">
                                    <button type="submit" className="submit_bt" id="team-submit" ><b>SUBMIT</b></button>
                                    <button type="button" className="submit_bt" id="team-cancel" onClick={() => setEditFlag(!editFlag)}><b>CANCEL</b></button>
                                </div>
                            </form>
                        </div>
                    </div>
                }
            </div>
        </>
    );
};

export default MyProfile;
