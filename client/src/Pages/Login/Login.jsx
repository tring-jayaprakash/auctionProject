import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css'
import { GlobalContext } from "../../context/GlobalContext";
import InputField from "../../components/InputField";
import { gql, useMutation } from "@apollo/client";
import { LOGIN_USER } from "../../../graphql/mutation/userMutation";


function Login() {
    const url = import.meta.env.VITE_GRAPHQL_URL
    const navigate = useNavigate();
    const { user, setUser, active, setActive } = useContext(GlobalContext)
    const { register, handleSubmit, formState: { errors } } = useForm();


    // const LOGIN_USER = gql`
    // mutation MyMutation($email: String = "", $password: String = "") {
    //     login(email: $email, password: $password)
    //   }
    // `

    const [loginUser, { loading, error }] = useMutation(LOGIN_USER)

    const onSubmit = async (user) => {
        try {
            const { email, password } = user;

            const res = await loginUser({
                variables: {
                    email,
                    password
                }
            })
            if (res.data.login) {
                // console.log("response", res.data.login)
                localStorage.setItem("token", res.data.login)
                setActive(active + 1)
                toast.success("Login successful..!", { position: "top-right", autoClose: 1000 });
                setTimeout(() => navigate("/Dashboard"), 1000);
            }
        } catch (err) {
            // console.table("err", err)
            toast.error("Insert valid username & password", { position: "top-right", autoClose: 2000 });
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