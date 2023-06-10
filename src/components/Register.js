import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useForm } from "react-hook-form";

import BackgroundForm from "../layouts/BackgroundForm";
import styles from "../styles/Form.module.css";

// Icons
import { HiAtSymbol, HiFingerPrint, HiOutlineUser, HiOutlinePhone } from "react-icons/hi";

function Register() {
  const [show, setShow] = useState({ password: false, confirmPassword: false });
  const { register, formState: { errors }, handleSubmit, watch } = useForm();
  const onSubmit = (data) => console.log(data);

  const watchPassword = watch("password");
  const validatePasswordMatch = (value) => {
    if (value === watchPassword) {
      return true;
    }
    return "Passwords do not match";
  };

  return (
    <HelmetProvider>
      <BackgroundForm>
        <Helmet>
          <title>Sign Up</title>
        </Helmet>
        <form className="relative z-10 mx-auto w-full max-w-[450px] space-y-5 rounded-md bg-white p-8" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="py-4 mb-4 text-4xl font-bold text-center">Register</h2>
          <p>Fill the form below to create an account</p>
          {/* First Name */}
          <div className={styles.input_group}>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className={styles.input_text}
              {...register("firstName", { required: true })}
            />
            <span className="flex items-center px-4 ">
              <HiOutlineUser size={20} />
            </span>
          </div>
          {/* Last Name */}
          <div className={styles.input_group}>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className={styles.input_text}
              {...register("lastName", { required: true })}
            />
            <span className="flex items-center px-4 ">
              <HiOutlineUser size={20} />
            </span>
          </div>
          {/* Phone Number */}
          <div className={styles.input_group} style={{ border: errors.phoneNumber ? "1px solid red" : "1px solid #ccc" }}>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              className={styles.input_text}
              {...register("phoneNumber", { required: true, pattern: /^[0-9]{10,12}$/, })} // Matches a sequence of 10 to 12 digits
            />
            <span className="flex items-center px-4 ">
              <HiOutlinePhone size={20} />
            </span>
          </div>
          {/* Email */}
          <div className={styles.input_group} style={{ border: errors.email ? "1px solid red" : "1px solid #ccc" }}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={styles.input_text}
              {...register("email", { required: true, pattern: /^[\w.\-]+[a-zA-Z0-9]+@[a-zA-Z0-9\-]+\.[a-zA-Z]{2,}$/ })}
            />
            <span className="flex items-center px-4 ">
              <HiAtSymbol size={20} />
            </span>
          </div>
          {/* Password */}
          {/* Assumption: Password length must be at least 12 characters and 64 characters at most. It must also contain at least
                          1 upper case character, at least 1 lower case character, at least 1 digit, and at least 1 special character */}
          <div className={styles.input_group} style={{ border: errors.password ? "1px solid red" : "1px solid #ccc" }}>
            <input
              type={`${show.password ? "text" : "password"}`}
              name="password"
              placeholder="Password"
              className={styles.input_text}
              {...register("password", {
                required: true,
                minLength: 7,
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=])(?=\S+$).{12,64}$/
              })}
            />
            <span
              className="flex items-center px-4"
              onClick={() => setShow({ ...show, password: !show.password })}
            >
              <HiFingerPrint size={20} />
            </span>
          </div>
          {/* Confirm Password */}
          <div className={styles.input_group} style={{ border: errors.confirmPassword ? "1px solid red" : "1px solid #ccc" }}>
            <input
              type={`${show.confirmPassword ? "text" : "password"}`}
              name="confirmPassword"
              placeholder="Confirm Password"
              className={styles.input_text}
              {...register("confirmPassword", {
                required: true,
                validate: validatePasswordMatch, // Add the validate function to check password match
              })}
            />
            <span
              className="flex items-center px-4 "
              onClick={() =>
                setShow({ ...show, confirmPassword: !show.confirmPassword })
              }
            >
              <HiFingerPrint size={20} />
            </span>
          </div>
          <div>
            {/* Sign in button */}
            <button className={styles.button}>Register</button>
          </div>
          {/* Got to register */}
          <p className="mt-8 text-center">
            Already have an account?
            <span className="ml-2 text-indigo-500">
              <Link to="/login">Sign in</Link>
            </span>
          </p>
        </form>
      </BackgroundForm >
    </HelmetProvider>
  );
}

export default Register;
