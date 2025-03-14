import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css'
import axios from "axios";
import { GlobalContext } from "../../context/GlobalContext";
import { LOGIN_USER_QUERY } from "../../../graphql/query/userQuery";
import InputField from "../../components/InputField";


function Login() {
    const navigate = useNavigate();
    const { auction, setAuction, teamAuction, setTeamAuction, playerAuction, setPlayerAuction, user, setUser } = useContext(GlobalContext)
    const { register, handleSubmit, formState: { errors } } = useForm();


    const onSubmit = async (data) => {

        const email = data.email;
        const password = data.password;

        const query = LOGIN_USER_QUERY;
        const variables = {
            email: data.email,
            password: data.password,
        };

        console.log("Sending variables:", variables);
        try {
            const response = await axios.post("http://localhost:2500/graphql", { query, variables });

            console.log("Response:", response);
            if (response.data.errors) {
                toast.warn("Invalid email or password", { position: "top-right", autoClose: 1000 });
                return;
            }

            const userData = response.data.data.login;

            if (userData) {
                setUser(userData);
                localStorage.setItem("user", JSON.stringify(userData));

                toast.success("Login successful..!", { position: "top-right", autoClose: 1000 });
                setTimeout(() => navigate("/Dashboard"), 1000);
            } else {
                toast.warn("Invalid email or password", { position: "top-right", autoClose: 1000 });
            }

        } catch (error) {
            console.error("Login Error:", error);
            toast.error("Login failed. Please try again.", { position: "top-right", autoClose: 2000 });
        }


    }

    return (
        <>
            <div id="login_wrap">
                <div id="login_box">
                    <h2 id="title">Login </h2>
                    <form onSubmit={handleSubmit(onSubmit)} id="formData">
                        <InputField label="Email" type="email" placeholder="Enter the Email" register={register} name="email" error={errors.email} />
                        <InputField label="Password" type="password" placeholder="Enter the Password" register={register} name="password" error={errors.password} />


                        <div id="login-box-footer" >
                            <button type="submit" id="log_btn">
                                <b> Login</b>
                            </button>
                            <p id="registed">
                                Not a member yet? <Link to="/register">Register</Link>
                            </p>
                        </div>
                    </form>

                </div>
            </div>
        </>
    );
}

export default Login;
