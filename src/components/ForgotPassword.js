import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useForm } from "react-hook-form";

import BackgroundForm from "../layouts/BackgroundForm";
import styles from "../styles/Form.module.css";

export default function ForgotPassword() {
  return (
    <HelmetProvider>
      <BackgroundForm>
        <Helmet>
          <title>Forgot Password</title>
        </Helmet>
        <form className="relative z-10 mx-auto w-full max-w-[480px] space-y-5 rounded-md bg-white p-8">
          <h2 className="py-4 mb-4 text-4xl font-bold text-center">Find your account</h2>
          <p>Enter your email address.</p>
          {/* Email */}
          <div className={styles.input_group}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={styles.input_text}
            />
          </div>
          <div>
            {/* Submit button */}
            <button className={styles.button}>Submit</button>
          </div>
          <p class="inline-block mt-4 mb-0 text-base leading-normal">
            If you did not receive an email, you can request another one in
            <span className="ml-1" id="timer">60 seconds</span>.
            <button
              class="inline-block px-2 py-1 font-bold text-center text-sm text-white align-middle bg-indigo-600 border-0 rounded border-none hover:bg-indigo-700 ml-2"
              disabled
            >
              Request Code
            </button>
          </p>
        </form>
      </BackgroundForm >
    </HelmetProvider>
  );
}