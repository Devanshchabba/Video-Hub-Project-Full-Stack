import React from 'react'
import { useState } from 'react';
import { useForm } from 'react-hook-form'
import { Input } from './index.jsx'
import { useNavigate } from 'react-router-dom';
import authService from '../components/user.js'
// 1. Import 'Link' from react-router-dom
import { Link } from 'react-router-dom';
// import { useForm } from 'react-hook-form'
function Login() {

  const navigate = useNavigate();

  const { register, handleSubmit } = useForm()

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  /**
   * A reusable input field component for the auth form.
  */
  const handleLogin = async (data) => {
    setError("")
    // console.log("Attempting login with data :", data)
    const indentifier = data.identifier
    const password = data.password;
    // Handle form submission logic here
    try {
      const session = await authService.login({ indentifier, password });
      if (session) {
        const getUser = authService.userProfile();
        setSuccess(session.message)
        if (getUser) {
          navigate('/home');
        }
      }
    } catch (error) {
      console.error("Error in login :", error)
      setError(error)
    }
  }

  /**
   * AuthPage
   * A single component that handles both Login and Register views.
  */
  // true = Login view, false = Register view



  // SVG Icons
  const emailIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-gray-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );

  const lockIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-gray-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 00-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="w-full max-w-md rounded-2xl bg-gray-900 p-8 shadow-2xl">
        <h2 className="mb-6 text-center text-3xl font-bold">
          Login Account
        </h2>

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">

          <>
            <Input
              name="identifier"
              icon={emailIcon}
              placeholder="Email or Username"
              {...register("identifier", {
                required: "Email or username is required",
              })}
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              icon={lockIcon}
              {...register("password", {
                required: true,
              })}
            />
          </>

          {(
            <div className="text-right text-sm">
              {/* 2. Replaced <a> tag with <Link> */}
              <Link to="/change-password" className="font-medium text-blue-500 hover:underline">
                Forgot password?
              </Link>
            </div>
          )}
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

          <button
            type="submit"
            className="w-full rounded-lg bg-red-600 py-3 font-semibold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?
          {/* This <button> is correct! It just toggles state. */}
          <button
            className="font-medium text-blue-500 hover:underline focus:outline-none"
          >
          </button>
          <Link to="/register" className="font-medium text-blue-500 hover:underline focus:outline-none">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};


export default Login;