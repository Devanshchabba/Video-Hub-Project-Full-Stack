import React, { useState } from 'react';
// import {changePassword} from '../components/user'
import authService from '../components/user.js'
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Input } from './index.jsx'
function ChangePassword() {
    /**
     * A reusable input field component for the form.
     */
    const { register, handleSubmit } = useForm()
    const navigate = useNavigate()
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null);


    const handlePasswordChange = async ({ oldPassword, newPassword }) => {
        const userData = {
            oldPassword: oldPassword,
            newPassword: newPassword
        }
        try {
            setError(null)
            const res = await authService.changePassword(userData)
            const statusCode = res.statusCode;
            const message = res.message
            setSuccess(message);
            navigate('/login')
            console.log(statusCode, "  ", message)
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            setError(errorMessage);
        }

    }
    // const FormInput = ({ id, label, type, placeholder, value, onChange }) => (
    //     <div>
    //         <label
    //             htmlFor={id}
    //             className="block text-sm font-semibold text-gray-300 mb-2"
    //         >
    //             {label}
    //         </label>
    //         <input
    //             type={type}
    //             id={id}
    //             name={id}
    //             value={value}
    //             onChange={onChange}
    //             placeholder={placeholder}
    //             className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
    //             required
    //         />
    //     </div>
    // );

    /**
     * The main Change Password page component.
     */
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const onSubmit = (data) => {
        const { oldPassword, newPassword, confirmPassword } = data;
        console.log(oldPassword)
        setError(null);
        setSuccess(null);
        // 1. Check if new passwords match
        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }
        // 2. Add any other validation (e.g., password length)
        if (!newPassword || newPassword.length < 8) {
            setError("New password must be at least 8 characters long.");
            return;
        }
        handlePasswordChange({ oldPassword, newPassword });
        setFormData({currentPassword: '',
        newPassword: '',
        confirmPassword: ''})

        // 3. If all checks pass, simulate API call
        // console.log("Changing password with data:", formData);

    };

    return (
        <div className="min-h-screen bg-black text-white py-8">
            <div className="container mx-auto max-w-2xl px-4">

                <h1 className="text-3xl font-bold text-white mb-8">
                    Change Password
                </h1>

                <div className="bg-gray-900 p-6 sm:p-8 rounded-lg shadow-md border border-gray-800">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <Input
                            type="password"
                            name="oldPassword"
                            placeholder="Old Password"
                            onChange={handleChange}
                            // icon={lockIcon}
                            {...register("password", {
                                required: true,
                            })}
                        />
                        <Input
                            type="password"
                            name="newPassword"
                            placeholder="New Password"
                            onChange={handleChange}
                            // icon={lockIcon}
                            {...register("password", {
                                required: "Please confirm your new password"
                            })}
                        />

                        {/* <FormInput
                            id="newPassword"
                            label="New Password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.newPassword}
                            onChange={handleChange}
                        /> */}

                        <Input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm New Password"
                            onChange={handleChange}
                            // icon={lockIcon}
                            {...register("password", {
                                required: true,
                            })}
                        />
                        {/* <FormInput
                            id="confirmPassword"
                            label="Confirm New Password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        /> */}

                        {/* Display Error or Success Messages */}
                        {error && (
                            <div className="rounded-lg bg-red-900 p-3 text-center text-sm font-medium text-red-200">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="rounded-lg bg-green-900 p-3 text-center text-sm font-medium text-green-200">
                                {success}
                            </div>
                        )}

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};


export default ChangePassword

