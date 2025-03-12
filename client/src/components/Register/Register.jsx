import { useForm } from 'react-hook-form';
import '../Register/Register.css'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { REGISTER_USER_MUTATION } from '../../../graphql/mutation/userMutation';


const Register = () => {

    const navigate = useNavigate()

    const onSubmit = async (userData) => {
        async function registerUser() {
                const query = REGISTER_USER_MUTATION
                const variables = {
                    city : userData.city,
                    ph_number : userData.number,
                    user_name : userData.username,
                    email : userData.email,
                    password : userData.password
                }

            try {
                const response = await axios.post("http://localhost:2500/graphql", { query , variables})
                console.log(response.data.data.register)

                if (response.data.errors) {
                    toast.error(response.data.errors[0].message, { position: "top-right", autoClose: 2000 });
                    return;
                }

                toast.success("Registration successful..! You can now login.", { position: "top-right", autoClose: 1000 });
                setTimeout(() => navigate("/login"), 1000);

            } catch (error) {
                toast.error("Registration failed. Please try again.", { position: "top-right", autoClose: 2000 });
            }
        }


        registerUser()
    };


    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    return (
        <>
            <div id='register-container'>
                <div id='register-box'>
                    <h1 id='title'>Register </h1>
                    <form onSubmit={handleSubmit(onSubmit)} id='from'>
                        <div className='sub-div'>
                            <div className='input-group'>
                                <label htmlFor="">Enter your name :</label>
                                <input
                                    {...register("username", { required: "Username is required" })}
                                    placeholder="Enter your name"
                                    className='input'
                                />
                                {errors.username && <p className='error-message'>{errors.username.message}</p>}
                            </div>
                            <div className='input-group'>
                                <label htmlFor="">Enter your city:</label>
                                <input
                                    {...register("city", { required: "city is required" })}
                                    placeholder="Enter your city"
                                    className='input'
                                />
                                {errors.city && <p className='error-message'>{errors.city.message}</p>}
                            </div>
                        </div>

                        <div className='input-group'>
                            <label htmlFor="">Enter your phone number :</label>
                            <input
                                type="number"
                                {...register("number", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^\d{10}$/,
                                        message: "Phone number must be exactly 10 digits"
                                    }
                                })}
                                placeholder="Enter your phone number "
                                className='input'
                            />
                            {errors.number && <p className='error-message'>{errors.number.message}</p>}
                        </div>
                        <div className='input-group'>
                            <label htmlFor="">Enter your email :</label>
                            <input
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: "Invalid email address"
                                    }
                                })}
                                placeholder="Enter your email"
                                className='input'
                            />
                            {errors.email && <p className='error-message'>{errors.email.message}</p>}
                        </div>

                        <div className='sub-div'>
                            <div className='input-group'>
                                <label htmlFor="">Enter your password :</label>
                                <input
                                    type="password"
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: { value: 6, message: "Password must be at least 6 characters long" }
                                    })}
                                    placeholder="Enter your password"
                                    className='input'
                                />
                                {errors.password && <p className='error-message'>{errors.password.message}</p>}
                            </div>

                            <div className='input-group'>
                                <label htmlFor="">Confirm your password :</label>
                                <input
                                    type="password"
                                    {...register("confirmPassword", {
                                        required: "Confirm Password is required",
                                        validate: (value) => value === watch("password") || "Passwords do not match"
                                    })}
                                    placeholder="Confirm your password"
                                    className='input'
                                />
                                {errors.confirmPassword && <p className='error-message'>{errors.confirmPassword.message}</p>}
                            </div>
                        </div>
                        <div id='register-box-footer'>
                            <button type="submit" id='reg-btn' style={{ border: "1px solid #132E35" }}><b>Register</b></button>
                            <p id='registed'>Already Registered? <Link to="/Login">Login</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );

};

export default Register;