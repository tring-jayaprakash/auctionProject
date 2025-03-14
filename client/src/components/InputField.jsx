import React from "react";

const InputField = ({ label, type, placeholder, register, name, error }) => {
    return (
        <div className="input-field">
            <label>{label}:</label>
            <input {...register(name, { required: `${label} is required` })} type={type} placeholder={placeholder} className="input" />
            {error && <p className="error">{error.message}</p>}
        </div>
    );
};

export default InputField;
