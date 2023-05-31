import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import BackgroundForm from "../layouts/BackgroundForm";
import styles from "../styles/Form.module.css";

// Icons
import { FcGoogle } from "react-icons/fc";
import { HiAtSymbol, HiFingerPrint } from "react-icons/hi";

function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: If email and password did not match.

    console.log('Username: ', email, 'Password: ', password);
  }

  return (
    <BackgroundForm>
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <form className="relative z-10 mx-auto w-full max-w-[450px] space-y-5 rounded-md bg-white p-8" onSubmit={handleSubmit}>
        <h2 className="py-4 mb-4 text-4xl font-bold text-center">Sign In</h2>
        <p>Enter your email and password to sign in</p>
        {/* Email */}
        <div className={styles.input_group}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className={styles.input_text}
            onChange={e => setEmail(e.target.value)}
          />
          <span className="flex items-center px-4 icon">
            <HiAtSymbol size={20} />
          </span>
        </div>
        {/* Password */}
        <div className={styles.input_group}>
          <input
            type={`${show ? "text" : "password"}`}
            name="password"
            placeholder="Password"
            className={styles.input_text}
            onChange={e => setPassword(e.target.value)}
          />
          <span
            className="flex items-center px-4 icon"
            onClick={() => setShow(!show)}
          >
            <HiFingerPrint size={20} />
          </span>
        </div>
        <div>
          {/* Error Message */}
          <label className="flex justify-center text-red-500">Invalid input!</label>
          {/* Sign in button */}
          <button className={styles.button}>Sign In</button>
          <div className="flex justify-between">
            <p className="flex items-center mt-2">
              <input className="mr-2 rounded" type="checkbox" />
              Remember Me
            </p>
            <p className="flex items-center mt-2">Forgot Password?</p>
          </div>
        </div>
        <div
          className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
          <p
            className="mx-4 mb-0 font-semibold text-center ">
            or
          </p>
        </div>
        {/* Sign in with Google */}
        <button className={styles.button_custom}>
          <FcGoogle className="mr-2" size={20} />
          <span>Sign in with Google</span>
        </button>
        {/* Got to register */}
        <p className="mt-8 text-center">
          Don't have an account?
          <span className="ml-2 text-indigo-500">
            <Link to="/register">Register</Link>
          </span>
        </p>
      </form>
    </BackgroundForm>
  );
}
export default Login;