import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom';
import userService from '../components/user.js'
import authService from '../components/user.js';

function Register() {
    const [isLoginView, setIsLoginView] = useState(true);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [success, setSuccess] = useState(null);

    const { register, handleSubmit, formState: { errors } } = useForm();


    // const userIcon = (
    //     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-gray-500">
    //         <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    //     </svg>
    // );

    // const emailIcon = (
    //     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-gray-500">
    //         <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    //     </svg>
    // );

    // const lockIcon = (
    //     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-gray-500">
    //         <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 00-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    //     </svg>
    // );

    const AuthInput = ({ type, id, name, placeholder, icon }) => (
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                {icon}
            </span>
            <input
                type={type}
                id={id}
                name={name}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder={placeholder}
                required
            />
        </div>
    );
    const navigate = useNavigate();


    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setCoverImage(file);
            setCoverPreview(URL.createObjectURL(file));
        }
        else {
            alert("Please select a valid image file for Profile Cover.");
        }
    }
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
        else {
            alert("Please select a valid image file for avatar.");
            setAvatarFile(null)
        }
    }

    const handleRegister = async (data) => {
        setIsLoginView(!isLoginView);

        if (data.password !== data.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        const formData = new FormData();

        formData.append('userName', data.username)
        formData.append('fullName', data.fullName)
        formData.append('email', data.email)
        formData.append('password', data.password)
        // formData.append('confirmPassword', data.confirmPassword)
        formData.append("avatar", avatarFile);
        formData.append("coverImage", coverImage);

        console.log("Form Data --- >", formData);
        try {
            const session = await userService.register(formData);
            // console.log("Registration successfull :", res);

            if (session) {
                const getUser = authService.getUser();
                setSuccess(session.message)
                if (getUser) {
                    navigate('/login')
                }
            }
            setAvatarPreview(null)
            setCoverPreview(null)
            setSuccess(true)
        } catch (error) {
            console.error("Error during registration :", error);
            setSuccess(false)
        } finally {
            setSuccess(false)
        }
    }

    // const handleChange = (e) => {
    //     const { name, value, files } = e.target;

    //     setFormData((prev) => ({
    //         ...prev,
    //         [name]: files ? files[0] : value,
    //     }));
    // };

    return (

        <div className="min-h-screen w-full bg-gray-100 dark:bg-black flex items-center justify-center px-4">
            {success && ((
                <div className='text-9xl dark:text-gray-200'>User Registered Successfully </div>))}

            <div className="w-full max-w-3xl rounded-xl bg-white dark:bg-gray-900 shadow-lg p-8">
                <h2 className="mb-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
                    Create Account
                </h2>

                <form onSubmit={handleSubmit(handleRegister)} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            id='fullName'
                            placeholder='Full Name'
                            // onChange={handleChange}
                            {...register("fullName", {
                                required: true,
                            })}
                            className="mt-1 w-full rounded-md border px-3 py-2 dark:bg-gray-800 dark:border-gray-700 text-black dark:text-gray-200" 
                        />
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            User Name
                        </label>
                        <input
                            type="text"
                            name="username"
                            id='userName'
                            placeholder='User Name'
                            // onChange={handleChange}
                            {...register("username", {
                                required: true,

                            })}
                            className="mt-1 w-full rounded-md border px-3 py-2 dark:bg-gray-800 dark:border-gray-700 text-black dark:text-gray-200"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            id='email'
                            placeholder='Email'
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        "Email address must be a valid address",
                                }
                            })}
                            // onChange={handleChange}
                            className="mt-1 w-full rounded-md border px-3 py-2 dark:bg-gray-800 dark:border-gray-700 text-black dark:text-gray-200"
                            required
                        />
                    </div>


                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id='password'
                            placeholder='Password'
                            {...register("password", {
                                required: true
                            })}
                            // onChange={handleChange}
                            className="mt-1 w-full rounded-md border px-3 py-2 text-black dark:text-gray-200 dark:bg-gray-800 dark:border-gray-700"
                            required
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className='md:col-span-2'>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            id='confirmPassword'
                            placeholder='Confirm Password'
                            // onChange={handleChange}
                            {...register("confirmPassword", {
                                required: true
                            })}
                            className="mt-1 w-full rounded-md border px-3 py-2 dark:bg-gray-800 dark:border-gray-700 text-black dark:text-gray-200"
                            required
                        />
                    </div>


                    {/* Avatar */}
                    <div>
                        {avatarPreview && ((
                            <div className="mt-4">
                                <img src={avatarPreview} alt="Thumbnail Preview" className="w-48 rounded-md" />
                            </div>
                        ))}
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Avatar
                        </label>

                        <input
                            type="file"
                            name="avatar"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"

                        />
                    </div>



                    {/* Cover Image */}
                    <div>
                        {coverPreview && ((
                            <div className="mt-4">
                                <img src={coverPreview} alt="Thumbnail Preview" className="w-48 rounded-md" />
                            </div>
                        ))}

                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Cover Image
                        </label>
                        <input
                            type="file"
                            name="coverImage"
                            accept="image/*"
                            onChange={handleCoverImageChange}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                        />
                    </div>



                    {/* Submit */}
                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            className="w-full rounded-lg bg-red-600 py-3 font-semibold text-white hover:bg-red-700 transition"
                        >
                            Register
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
export default Register