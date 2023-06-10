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
  const onSubmit = (data) => {
    // Trim the input values
    const trimmedData = {
      ...data,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim(),
    };
    console.log(trimmedData);
  };

  const watchPassword = watch("password");
  const validatePasswordMatch = (value) => {
    if (value === watchPassword) {
      return true;
    }
    return "Password do not match";
  };

  return (
    <HelmetProvider>
      <BackgroundForm>
        <Helmet>
          <title>Sign Up</title>
        </Helmet>
        <form className="relative z-10 mx-auto w-full max-w-[625px] space-y-3 rounded-md bg-white p-8" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="py-3 mb-4 text-4xl font-bold text-center">Create an Account</h2>
          {/* Full Name */}
          <div className="flex justify-between">
            {/* First Name */}
            <div className="flex flex-col">
              <div className={styles.input_group} style={{ border: errors.firstName ? "1px solid red" : "1px solid #ccc" }}>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className={styles.input_text}
                  {...register("firstName", {
                    required: "First name is required",
                    pattern: {
                      value: /^[\w\s]{2,}$/, // Accepts alphanumeric characters and spaces, with a minimum length of 2
                      message: "Please enter a valid name"
                    }
                  })}
                />
                <span className="flex items-center px-4 ">
                  <HiOutlineUser size={20} />
                </span>
              </div>
              {/* Error message */}
              {errors.firstName && <p role="alert" className={styles.error_text}>{errors.firstName?.message}</p>}
            </div>
            {/* Last Name */}
            <div className="flex flex-col">
              <div className={styles.input_group} style={{ border: errors.lastName ? "1px solid red" : "1px solid #ccc" }}>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className={styles.input_text}
                  {...register("lastName", {
                    required: "Last name is required",
                    pattern: {
                      value: /^[\w\s]{2,}$/, // Accepts alphanumeric characters and spaces, with a minimum length of 2
                      message: "Please enter a valid name"
                    }
                  })}
                />
                <span className="flex items-center px-4 ">
                  <HiOutlineUser size={20} />
                </span>
              </div>
              {/* Error message */}
              {errors.lastName && <p role="alert" className={styles.error_text}>{errors.lastName?.message}</p>}
            </div>
          </div>
          {/* Phone Number */}
          <div className="flex flex-col">
            <div className={styles.input_group} style={{ border: errors.phoneNumber ? "1px solid red" : "1px solid #ccc" }}>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                className={styles.input_text}
                {...register("phoneNumber", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^09\d{9}$/,
                    message: "Please enter a valid phone number (09xxxxxxxxx)"
                  }
                })} // Matches a sequence of 10 to 12 digits
              />
              <span className="flex items-center px-4 ">
                <HiOutlinePhone size={20} />
              </span>
            </div>
            {/* Error message */}
            {errors.phoneNumber && <p role="alert" className={styles.error_text}>{errors.phoneNumber?.message}</p>}
          </div>
          {/* Email */}
          <div className="flex flex-col">
            <div className={styles.input_group} style={{ border: errors.email ? "1px solid red" : "1px solid #ccc" }}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className={styles.input_text}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[\w.\-]+[a-zA-Z0-9]+@[a-zA-Z0-9\-]+\.[a-zA-Z]{2,}$/,
                    message: "Please enter a valid email address"
                  }
                })}
              />
              <span className="flex items-center px-4 ">
                <HiAtSymbol size={20} />
              </span>
            </div>
            {/* Error message */}
            {errors.email && <p role="alert" className={styles.error_text}>{errors.email?.message}</p>}
          </div>
          {/* Password */}
          <div className="flex flex-col">
            <div className={styles.input_group} style={{ border: errors.password ? "1px solid red" : "1px solid #ccc" }}>
              <input
                type={`${show.password ? "text" : "password"}`}
                name="password"
                placeholder="Password"
                className={styles.input_text}
                {...register("password", {
                  required: "Password is required",
                  minLength: 7,
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=])(?=\S+$).{12,64}$/,
                    message: "Password length must be at least 12 characters and 64 characters at most. It must also contain at least 1 upper case character, at least 1 lower case character, at least 1 digit, and at least 1 special character"
                  }
                })}
              />
              <span
                className="flex items-center px-4"
                onClick={() => setShow({ ...show, password: !show.password })}
              >
                <HiFingerPrint size={20} />
              </span>
            </div>
            {/* Error message */}
            {errors.password && <p role="alert" className={styles.error_text}>{errors.password?.message}</p>}
          </div>
          {/* Confirm Password */}
          <div className="flex flex-col">
            <div className={styles.input_group} style={{ border: errors.confirmPassword ? "1px solid red" : "1px solid #ccc" }}>
              <input
                type={`${show.confirmPassword ? "text" : "password"}`}
                name="confirmPassword"
                placeholder="Confirm Password"
                className={styles.input_text}
                {...register("confirmPassword", {
                  required: "Confirm password is required",
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
            {/* Error message */}
            {errors.confirmPassword && <p role="alert" className={styles.error_text}>{errors.confirmPassword?.message}</p>}
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
