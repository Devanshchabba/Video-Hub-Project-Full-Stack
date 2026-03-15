import React from 'react'
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
// import { userProfile, login, logout } from '../components/user'
function Account() {
    /**
     * A reusable, styled button for the card's actions.
     */
    const ActionButton = ({ icon, text, onClick }) => (
        <button
            onClick={onClick}
            className="flex w-full items-center space-x-3 rounded-lg px-4 py-2.5 text-left font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
        >
            <span className="flex-shrink-0">{icon}</span>
            <span>{text}</span>
        </button>
    );
    // const user =  getUserProfile();
    // const login = handleLogin({'userName' :'shivansh','password' :'#@Joker78'})
    // console.log("User logged in ",login)
    // const logout = handleLogout()
    // console.log("user Logout : ", handleLogout())

    // console.log("User Profile:",user)
    /**
     * AccountCard
     * A self-contained card for managing account, auth, and theme settings.
     */
    // 'light' or 'dark'
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

    // true = logged in, false = logged out
    // We simulate this with state.
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Effect to apply the theme to the <html> tag
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    // --- SVG Icons ---
    const sunIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-gray-600 dark:text-gray-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-6.364-.386l1.591-1.591M3 12H.75m.386-6.364l1.591 1.591" />
        </svg>
    );

    const moonIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-gray-600 dark:text-gray-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        </svg>
    );

    const userPlusIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 text-gray-600 dark:text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.5 21h-5.25A12.318 12.318 0 014 19.235z" />
        </svg>
    );

    const loginIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 text-gray-600 dark:text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
        </svg>
    );

    const registerIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 text-gray-600 dark:text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v6m-6-6v6m-6-6v6M9 9H3v6h6M15 9h-2m2 6h-2m-6 6H3v-6h6m6 6h-2m2-6h-2m6-6h3v6h-3M9 3H3v6h6M15 3h-2m2 6h-2m-6 6H3v-6h6m6 6h-2m2-6h-2m6-6h3v6h-3" />
        </svg>
    );

    const logoutIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 text-gray-600 dark:text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3 0l-3-3m0 0l3-3m-3 3H9" />
        </svg>
    );


    return (
        // This outer div centers the card for the demo
        // <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 dark:bg-white">

        <div className="w-full max-w-sm rounded-2xl ml-[1125px] mt-[100px] mb-[100px] bg-white p-6 shadow-2xl dark:bg-white">

            {/* --- Conditional Header (User Info) --- */}
            {isLoggedIn ? (
                <div className="flex items-center space-x-4 pb-4">
                    <img
                        src="https://placehold.co/48x48/E879F9/FFFFFF?text=U"
                        alt="User Avatar"
                        className="h-12 w-12 rounded-full"
                    />
                    <div>
                        {/* This is the "login id" */}
                        <p className="font-bold text-gray-900 dark:text-gray-200">TestUser</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">test.user@example.com</p>
                    </div>
                </div>
            ) : (
                <h2 className="pb-4 text-center text-2xl font-bold text-gray-900 dark:text-black">
                    Account
                </h2>
            )}

            {/* --- Theme Toggle --- */}
            <div className="flex items-center justify-between border-t border-b border-gray-400 py-4 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                    {theme === 'dark' ? moonIcon : sunIcon}
                    <span className="font-medium text-gray-700 dark:text-gray-400">
                        {theme === 'dark' ? 'Dark' : 'Light'} Mode
                    </span>
                </div>

                {/* Toggle Switch */}
                <button
                    onClick={toggleTheme}
                    role="switch"
                    aria-checked={theme === 'dark'}
                    className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                >
                    <span className="sr-only">Toggle theme</span>
                    <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                        }`}
                    />
                </button>
            </div>

            {/* --- Conditional Actions --- */}
            <div className="space-y-2 pt-4">
                {isLoggedIn ? (
                    // --- Logged-IN View ---
                    <>
                        {/* "Add Account" button */}
                        <ActionButton
                            icon={userPlusIcon}
                            text="Add Account"
                            onClick={() => alert('Add Account clicked!')}
                        />
                        {/* "Logout" button */}
                        <ActionButton
                            icon={logoutIcon}
                            text="Logout"
                            onClick={() => setIsLoggedIn(false)} // Simulates logout
                        />
                    </>
                ) : (
                    // --- Logged-OUT View ---
                    <>
                        {/* "Login" button */}
                        <Link to="/auth" className="flex w-full items-center space-x-3 rounded-lg bg-blue-600 px-4 py-2.5 text-left font-semibold text-white transition-colors hover:bg-blue-700">
                            {loginIcon}
                            <span>Login</span>
                        </Link>
                        {/* "Register new account" button */}
                        <Link to="/auth" className="flex w-full items-center space-x-3 rounded-lg bg-gray-600 px-4 py-2.5 text-left font-semibold text-white transition-colors hover:bg-gray-700">
                            {registerIcon}
                            <span>Register New Account</span>
                        </Link>
                        {/* This button is just for the demo */}
                        <button
                            onClick={() => setIsLoggedIn(true)}
                            className="mt-4 w-full rounded-lg border border-gray-700 px-4 py-2 font-semibold text-gray-600 transition-colors hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
                        >
                            (Demo: Simulate Login)
                        </button>
                    </>
                )}
            </div>
        </div>
        // </div>
    );
};



export default Account