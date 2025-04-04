import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { REGISTER_USER} from "../../../graphql/mutation/userMutation";
import InputField from "../../components/InputField";
import { useMutation } from "@apollo/client";
import "./Register.css";

const Register = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [registerUser, { loading, error }] = useMutation(REGISTER_USER)
    
    const onSubmit = async (user) => {
        try {
            console.log(user);

            const { user_city, user_email, user_password, user_phone, user_name } = user;

            const res = await registerUser({
                variables: {
                    city: user_city,
                    email: user_email,
                    password: user_password,
                    phone_number: user_phone,
                    user_name: user_name
                }
            })
            console.log(res.data);
            
            if (res.data.register) {
                console.log("response", res.data.register)
                toast.success("register successful..!", { position: "top-right", autoClose: 1000 });
            setTimeout(() => navigate("/login"), 1000);
            }
        } catch (err) {
            console.table("err", err)
            alert("cannot login")
        }
    }

    return (
        <>
            <div id="register-container">
                <div id="register-box">
                    <h1 id="title">Register</h1>
                    <form onSubmit={handleSubmit(onSubmit)} id="form">
                        <div className="sub-div">
                            <div className='input-group'>
                                <label htmlFor="">Enter your name :</label>
                                <input
                                    {...register("user_name", { required: "Username is required" })}
                                    placeholder="Enter your name"
                                    className='input'
                                />
                                {errors.user_name && <p className='error-message'>{errors.user_name.message}</p>}
                            </div>
                            <div className='input-group'>
                                <label htmlFor="">Enter your city:</label>
                                <input
                                    {...register("user_city", { required: "city is required" })}
                                    placeholder="Enter your city"
                                    className='input'
                                />
                                {errors.user_city && <p className='error-message'>{errors.user_city.message}</p>}
                            </div>
                        </div>
                        <div style={{ marginTop: "-20px" }}>

                            <InputField
                                label="Enter your phone number"
                                type="tel"
                                placeholder="Enter your phone number"
                                register={register}
                                name="user_phone"
                                error={errors.user_phone}
                                validation={{
                                    required: "Phone number is required",
                                    pattern: {
                                        value: /^\d{10}$/,
                                        message: "Phone number must be exactly 10 digits",
                                    },
                                }}
                            />
                        </div>

                        <div>

                            <InputField
                                label="Enter your email"
                                type="email"
                                placeholder="Enter your email"
                                register={register}
                                name="user_email"
                                error={errors.user_email}
                                validation={{
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: "Invalid email address",
                                    },
                                }}
                            />
                        </div>


                        <div className="sub-div">
                            <div className='input-group'>
                                <label htmlFor="">Enter your password :</label>
                                <input
                                    type="password"
                                    {...register("user_password", {
                                        required: "Password is required",
                                        minLength: { value: 6, message: "Password must be at least 6 characters long" }
                                    })}
                                    placeholder="Enter your password"
                                    className='input'
                                />
                                {errors.user_password && <p className='error-message'>{errors.user_password.message}</p>}
                            </div>

                            <div className='input-group'>
                                <label htmlFor="">Confirm your password :</label>
                                <input
                                    type="password"
                                    {...register("confirmPassword", {
                                        required: "Confirm Password is required",
                                        validate: (value) => value === watch("user_password") || "Passwords do not match"
                                    })}
                                    placeholder="Confirm your password"
                                    className='input'
                                />
                                {errors.confirmPassword && <p className='error-message'>{errors.confirmPassword.message}</p>}
                            </div>
                        </div>
                        <div id="register-box-footer" >
                            <button type="submit" id="reg-btn">
                                <b>Register</b>
                            </button>
                            <p id="registed">
                                Already Registered? <Link to="/Login">Login</Link>
                            </p>
                        </div>
                    </form>
                </div >
            </div >
        </>
    );
};

export default Register;
