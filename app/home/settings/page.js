'use client';

import { HiAtSymbol, HiFingerPrint, HiOutlinePhone, HiOutlineUser } from 'react-icons/hi';
import React, { useEffect, useRef, useState } from 'react';

import { AiOutlineClose } from 'react-icons/ai';
import { BsFillExclamationTriangleFill } from 'react-icons/bs';
import Image from 'next/image';
import sanitizeHtml from 'sanitize-html';
import styles from '@/app/Form.module.css';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';

export default function Settings() {
    const { data: session, status } = useSession();

    const [show, setShow] = useState({
        password: false,
        confirmPassword: false,
    });

    const [showSaveModal, setSaveModal] = useState(false);
    const [showDeactivateModal, setDeactivateModal] = useState(false);
    const [isEmailFocused, setEmailFocused] = useState(false);
    const [hasChanged, setHasChanged] = useState(false);
    const [user, setUser] = useState(null);
    const [pathname, setPathname] = useState('');
    const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
    const [showPasswordMismatch, setShowPasswordMismatch] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMismatch, setPasswordMismatch] = useState(false);

    const {
        register,
        formState: { errors },
        handleSubmit,
        watch,
        setValue,
    } = useForm();

    const fetchUser = async () => {
        try {
            const res = await fetch(`/api/users/${session.user.user_id}`);
            const { data, ok, error } = await res.json();
            if (!ok) throw new Error(error);

            setUser(data);
            setValue('email', user.email);
            setValue('firstName', user.first_name);
            setValue('lastName', user.last_name);
            setValue('phoneNumber', user.phone_num);
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleInputChange = e => {
        const formValues = watch();
        let isFormChanged = false;
        let isPasswordMismatch = false;

        for (const fieldName in formValues) {
            if (formValues[fieldName] !== user[fieldName]) {
                isFormChanged = true;
                break;
            }
        }
        if (e.target.name === 'password') {
            if (e.target.value !== formValues.confirmPassword) {
                isFormChanged = true;
                isPasswordMismatch = true;
            }
        } else if (e.target.name === 'confirmPassword') {
            if (e.target.value !== formValues.password) {
                isFormChanged = true;
                isPasswordMismatch = true;
            }
        }

        setHasChanged(isFormChanged);
        setPasswordMismatch(isPasswordMismatch);
    };

    const onSubmit = async data => {
        const formData = new FormData();

        const cleanedData = {
            firstName: sanitizeHtml(data.firstName.trim()),
            password: sanitizeHtml(data.password.length !== 0 ? data.password.trim() : user.password),
            lastName: sanitizeHtml(data.lastName.trim()),
            phoneNumber: sanitizeHtml(data.phoneNumber.trim()),
            email: sanitizeHtml(data.email.trim()),
        };

        formData.append('avatar', data.avatar[0]);
        formData.append('updatedInfo', JSON.stringify(cleanedData));

        try {
            const res = await fetch(`/api/users/${session.user.user_id}`, {
                method: 'PUT',
                body: formData,
            });
            const { data, ok, error } = await res.json();
            if (!ok) throw new Error(error);
        } catch (error) {
            console.log(error.message);
        }
    };

    const watchPassword = watch('password');
    const validatePasswordMatch = value => {
        if (value === watchPassword) {
            return true;
        }
        return 'Password do not match';
    };

    // Account deactivation
    const handleDeactivateAccount = () => {
        // TODO To delete the account, method DELETE and url is /api/users/[user_id]
        try {
            setDeactivateModal(false);
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleSaveButtonClick = () => {
        setShowSaveConfirmation(true);
    };

    const handleSaveConfirmation = () => {
        setShowSaveConfirmation(false);
    };

    useEffect(() => {
        if (session) fetchUser();
    }, [session]);

    if (!user) return null;

    return (
        <>
            <div className="flex items-center justify-center h-full ">
                <form className="relative z-10 mx-auto w-full max-w-[625px] space-y-3 rounded-md bg-white p-8 text-slate-900">
                    <div className="flex justify-center just">
                        <Image
                            className="overflow-hidden rounded-full"
                            src={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/${user.avatar}`}
                            alt=""
                            width={95}
                            height={95}
                            id="profile"
                        />
                    </div>

                    {/* Full Name */}
                    <div className="w-full my-2 text-center">
                        <h1 className="text-xl font-semibold">{user.first_name + ' ' + user.last_name}</h1>
                    </div>

                    <h1 className="text-lg">Profile Information</h1>
                    {/* Full Name */}
                    <div className="flex justify-between space-x-2">
                        {/* First Name */}
                        <div className="flex flex-col">
                            <div
                                className={styles.input_group}
                                style={{
                                    border: errors.firstName ? '1px solid red' : '1px solid #ccc',
                                }}
                            >
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    className={styles.input_text}
                                    {...register('firstName', {
                                        pattern: {
                                            value: /^[\w\s\u00C0-\u017F]{2,}$/, // Accepts alphanumeric characters, spaces, and special characters like "Ñ", "ñ", and letters with a tilde, with a minimum length of 2
                                            message: 'Please enter a valid name',
                                        },
                                    })}
                                    defaultValue={user.first_name}
                                    onChange={handleInputChange}
                                />
                                <span className="flex items-center px-4 ">
                                    <HiOutlineUser size={20} />l
                                </span>
                            </div>

                            {/* Error message */}
                            {errors.firstName && (
                                <p role="alert" className={styles.error_text}>
                                    {errors.firstName?.message}
                                </p>
                            )}
                        </div>
                        {/* Last Name */}
                        <div className="flex flex-col">
                            <div
                                className={styles.input_group}
                                style={{
                                    border: errors.lastName ? '1px solid red' : '1px solid #ccc',
                                }}
                            >
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    className={styles.input_text}
                                    {...register('lastName', {
                                        pattern: {
                                            value: /^[\w\s\u00C0-\u017F]{2,}$/, // Accepts alphanumeric characters, spaces, and special characters like "Ñ", "ñ", and letters with a tilde, with a minimum length of 2
                                            message: 'Please enter a valid name',
                                        },
                                    })}
                                    defaultValue={user.last_name}
                                    onChange={handleInputChange}
                                />
                                <span className="flex items-center px-4 ">
                                    <HiOutlineUser size={20} />
                                </span>
                            </div>
                            {/* Error message */}
                            {errors.lastName && (
                                <p role="alert" className={styles.error_text}>
                                    {errors.lastName.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <h1 className="text-lg">Account Information</h1>
                    {/* Phone Number */}
                    <div className="flex flex-col">
                        <div
                            className={styles.input_group}
                            style={{
                                border: errors.phoneNumber ? '1px solid red' : '1px solid #ccc',
                            }}
                        >
                            <input
                                type="tel"
                                name="phoneNumber"
                                placeholder="Phone Number"
                                className={styles.input_text}
                                {...register('phoneNumber', {
                                    pattern: {
                                        value: /^[\w\s\u00C0-\u017F]{2,}$/, // Accepts alphanumeric characters, spaces, and special characters like "Ñ", "ñ", and letters with a tilde, with a minimum length of 2
                                        message: 'Please enter a valid name',
                                    },
                                })}
                                defaultValue={user.phone_num}
                                onChange={handleInputChange}
                            />
                            <span className="flex items-center px-4 ">
                                <HiOutlinePhone size={20} />
                            </span>
                        </div>
                        {/* Error message */}
                        {errors.phoneNumber && (
                            <p role="alert" className={styles.error_text}>
                                {errors.phoneNumber?.message}
                            </p>
                        )}
                    </div>
                    {/* Email */}
                    {/* Displays user email but doesnt allow the user to edit*/}
                    <div className="flex flex-col">
                        <div
                            className={`${styles.input_group} ${user.email ? styles.read_only : ''}`}
                            style={{
                                border: '1px solid #ccc',
                            }}
                        >
                            <input
                                value={user.email}
                                type="email"
                                name="email"
                                placeholder="Email"
                                className={`${styles.input_text} ${user.email ? styles.read_only_input : ''} ${
                                    isEmailFocused ? styles.light_gray_text : ''
                                }`}
                                readOnly
                                onFocus={() => setEmailFocused(true)}
                                onBlur={() => {
                                    setEmailFocused(false);
                                }}
                                {...register('email', {
                                    pattern: {
                                        value: /^[\w.\-]+[a-zA-Z0-9]*@[a-zA-Z0-9\-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/,
                                        message: 'Please enter a valid email address',
                                    },
                                })}
                                style={{ color: '#aaa' }}
                            />
                            <span className="flex items-center px-4 ">
                                <HiAtSymbol size={20} />
                            </span>
                        </div>
                        {/* Error message */}
                        {errors.email && (
                            <p role="alert" className={styles.error_text}>
                                {errors.email?.message}
                            </p>
                        )}
                        {isEmailFocused && (
                            <p className="text-sm text-gray-500 mt-1">Email cannot be changed after registration.</p>
                        )}
                    </div>
                    {/* Password */}
                    <div className="flex flex-col">
                        <div
                            className={styles.input_group}
                            style={{
                                border: errors.password ? '1px solid red' : '1px solid #ccc',
                            }}
                        >
                            <input
                                type={`${show.password ? 'text' : 'password'}`}
                                name="password"
                                placeholder="New Password"
                                className={styles.input_text}
                                {...register('password', {
                                    pattern: {
                                        value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?!.*\s).{12,64}$/,
                                        message:
                                            'Password length must be at least 12 characters and 64 characters at most. It must also contain at least 1 upper case character, at least 1 lower case character, at least 1 digit, and at least 1 special character',
                                    },
                                })}
                                onChange={handleInputChange}
                            />
                            <span
                                className="flex items-center px-4"
                                onClick={() =>
                                    setShow({
                                        ...show,
                                        password: !show.password,
                                    })
                                }
                            >
                                <HiFingerPrint size={20} />
                            </span>
                        </div>
                        {/* Error message */}
                        {errors.password && (
                            <p role="alert" className={styles.error_text}>
                                {errors.password?.message}
                            </p>
                        )}
                    </div>
                    {/* Confirm Password */}
                    <div className="flex flex-col">
                        <div
                            className={styles.input_group}
                            style={{
                                border: errors.confirmPassword || passwordMismatch ? '1px solid red' : '1px solid #ccc',
                            }}
                        >
                            <input
                                type={`${show.confirmPassword ? 'text' : 'password'}`}
                                name="confirmPassword"
                                placeholder="Confirm New Password"
                                className={styles.input_text}
                                onChange={handleInputChange}
                            />
                            <span
                                className="flex items-center px-4 "
                                onClick={() =>
                                    setShow({
                                        ...show,
                                        confirmPassword: !show.confirmPassword,
                                    })
                                }
                            >
                                <HiFingerPrint size={20} />
                            </span>
                        </div>
                        {/* Error message */}
                        {errors.confirmPassword && (
                            <p role="alert" className={styles.error_text}>
                                {errors.confirmPassword?.message}
                            </p>
                        )}
                        {passwordMismatch && <p className="text-red-500">Password does not match.</p>}
                    </div>
                    {/* Profile Photo */}
                    <div className="flex flex-col">
                        <input
                            className="h-full relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-gray-300  bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-indigo-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-indigo-100 file:px-3 file:py-[0.32rem] file:text-indigo-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-indigo-500 focus:border-primary focus:text-indigo-700 focus:shadow-te-primary focus:outline-none  dark:text-indigo-200 dark:file:bg-indigo-700 dark:file:text-indigo-100 dark:focus:border-primary"
                            type="file"
                            id="profile"
                            {...register('avatar', {})}
                        />
                    </div>
                    {/* Error message */}
                    {errors.avatar && (
                        <p role="alert" className={styles.error_text}>
                            {errors.avatar?.message}
                        </p>
                    )}
                    <div>
                        <div className="flex justify-between space-x-4">
                            {/* Deactivate button */}
                            <button
                                id="deactivate-account"
                                className="w-full px-5 py-3 mt-8 text-white bg-red-600 rounded hover:bg-red-500"
                                type="button"
                                onClick={() => setDeactivateModal(true)}
                            >
                                Deactivate Account
                            </button>
                            {/* Save button */}
                            <button
                                id="save-changes"
                                className={`w-full px-5 py-3 mt-8 text-white ${
                                    hasChanged ? 'bg-green-500' : 'bg-gray-400'
                                } rounded hover:bg-green-500`}
                                onClick={handleSubmit(onSubmit)}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Modals */}
            {/* Save Changes */}
            {/* {showSaveConfirmation && (
				<div className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center">
					<div className="absolute inset-0 bg-gray-800 opacity-80"></div>
					<div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-lg sm:w-full">
						<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
							<h3
								className="text-lg leading-6 font-medium text-gray-900"
								id="modal-title"
							>
								Confirm Changes
							</h3>
							<div className="mt-2">
								<p className="text-sm text-gray-500">
									Kindly confirm the changes by inputting your current password.
								</p>
								<input
									type="password"
									name="confirmPassword"
									placeholder="Password"
									className="mt-2 px-4 py-2 border border-gray-300 rounded-md w-full"
									//value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
								/>
							</div>
						</div>
						<div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
							<button
								type="button"
								className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
								onClick={handleSaveConfirmation}
							>
								Confirm
							</button>
							<button
								type="button"
								className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
								onClick={() => setShowSaveConfirmation(false)} // Close the confirmation pop-up
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)} */}

            {/* Deactivate Account */}
            {showDeactivateModal && (
                <div
                    className="fixed inset-0 z-10 overflow-y-auto "
                    aria-labelledby="modal-title"
                    role="dialog"
                    aria-modal="true"
                    id="deactivate-modal"
                >
                    {/* <!-- Background --> */}
                    <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        {/* <!--  Gray Background --> */}
                        <div
                            className="fixed inset-0 transition-opacity bg-gray-600 bg-opacity-80"
                            aria-hidden="true"
                        ></div>
                        {/* <!--  Center the pop-up message--> */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>

                        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="flex flex-row items-center justify-between p-4">
                                {/* <!--  Top  --> */}
                                <div className="flex flex-wrap">
                                    <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-red-400 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                                        <span className="flex items-center px-4 ">
                                            <BsFillExclamationTriangleFill size={20} />
                                        </span>
                                    </div>
                                    <h1 className="my-2 ml-4 text-xl font-bold leading-6 text-gray-900 uppercase">
                                        Deactivate Account
                                    </h1>
                                </div>
                                <button className="focus:outline-none" onClick={() => setDeactivateModal(false)}>
                                    <span className="flex items-center px-4 text-gray-500">
                                        <AiOutlineClose size={20} />
                                    </span>
                                </button>
                            </div>
                            {/* <!--  Content --> */}
                            <div className="flex flex-col mx-10 my-2 text-gray-500">
                                <p className="mb-2 text-sm text-gray-500 font-raleway">
                                    Please note that after confirming the deactivation of your account, you will not be
                                    allowed to retrieved it. Kindly confirm the deactivation by inputting your current
                                    password.{' '}
                                </p>
                                <div className="flex flex-col">
                                    <div
                                        className={styles.input_group}
                                        style={{
                                            border: errors.password ? '1px solid red' : '1px solid #ccc',
                                        }}
                                    >
                                        <input
                                            type={`${show.password ? 'text' : 'password'}`}
                                            name="password"
                                            placeholder="Password"
                                            className={styles.input_text}
                                        />
                                        <span
                                            className="flex items-center px-4"
                                            onClick={() =>
                                                setShow({
                                                    ...show,
                                                    password: !show.password,
                                                })
                                            }
                                        >
                                            <HiFingerPrint size={20} />
                                        </span>
                                    </div>
                                    {/* Error message */}
                                    {errors.password && (
                                        <p role="alert" className={styles.error_text}>
                                            {errors.password?.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {/* <!--  Bottom --> */}
                            <div className="flex flex-row-reverse justify-between p-2 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    id="save-confirm"
                                    className="px-5 py-3 mt-8 text-white bg-green-600 rounded hover:bg-green-500"
                                    type="submit"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
