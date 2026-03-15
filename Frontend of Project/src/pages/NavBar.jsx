import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
// import { login, logout, userProfile } from '../components/user';
import authService from '../components/user.js'
import { useTheme } from "../ThemeContext.jsx";
import videoService from '../components/video.js';
import { useSearchParams } from 'react-router-dom'
// import {search} from 'lucide-react'


function NavBar() {
  // --- API Functions (Placeholders) ---
  const cachedUrl = localStorage.getItem('profilePicUrl');
  const [userPic, setUserPic] = useState(cachedUrl || null)
  // --- End of API Functions ---
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const placeholderAvatar = "https://placehold.co/100x100?text=User"
  /**
   * AccountCard component
   * This is the pop-up card.
   */
  function AccountCard({ onClose }) {
    // const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(null)


    const onLogoutClick = async () => {
      try {
        const res = await authService.logout();
        if (res) {
          navigate('/login')
          setIsLoggedIn(false);
          setUserPic("")
        }

      } catch (error) {
        console.error("Error in logging out user", error)
      }
    }

    const handleUserProfile = async () => {
      try {
        const response = await authService.getUser()
        if (response) {
          const newUrl = response.avatar
          setUser(response);
          localStorage.setItem('profilePicUrl', newUrl)
          setUserPic(newUrl)
          setIsLoggedIn(true)
        }
        else {
          setIsLoggedIn(false);
          setUser(null)
          setUserPic(null)
        }
      } catch (error) {
        console.error("Error in fetching data", error)
      }
      finally {
        setIsLoading(false)
      }
    }

    useEffect(() => {
      handleUserProfile();
    }, [user?._id])

    useEffect(() => {
      console.log("isLoggedIn---->", isLoggedIn)
    }, [isLoggedIn])

    const { theme, toggleTheme } = useTheme();

    // const onLogoutClick = async () => {
    //   setError(null);
    //   try {
    //     await handleLogout();
    //     setUser(null);
    //     onClose();
    //   } catch (err) {
    //     setError({ message: 'Failed to logout.' });
    //   }
    // };

    const ActionButton = ({ icon, text, onClick }) => (
      <button
        onClick={onClick}
        className="flex w-full items-center space-x-3 rounded-lg px-4 py-2.5 text-left font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
      >
        <span className="flex-shrink-0">{icon}</span>
        <span>{text}</span>
      </button>
    );

    // --- SVG Icons ---
    const sunIcon = (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-gray-600 dark:text-gray-600"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-6.364-.386l1.591-1.591M3 12H.75m.386-6.364l1.591 1.591" /></svg>);
    const moonIcon = (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-gray-600 dark:text-gray-600"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>);
    // const userPlusIcon = (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 text-gray-600 dark:text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.5 21h-5.25A12.318 12.318 0 014 19.235z" /></svg>);
    const loginIcon = (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 text-gray-600 dark:text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>);
    const registerIcon = (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 text-gray-600 dark:text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v6m-6-6v6m-6-6v6M9 9H3v6h6M15 9h-2m2 6h-2m-6 6H3v-6h6m6 6h-2m2-6h-2m6-6h3v6h-3M9 3H3v6h6M15 3h-2m2 6h-2m-6 6H3v-6h6m6 6h-2m2-6h-2m6-6h3v6h-3" /></svg>);
    const logoutIcon = (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 text-gray-600 dark:text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3 0l-3-3m0 0l3-3m-3 3H9" /></svg>);
    const helpIcon = (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 text-gray-600 dark:text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>);

    if (isLoading) {
      return (
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 flex items-center justify-center h-[300px]">
          <p className="text-gray-700 dark:text-gray-400">Loading Account...</p>
        </div>
      );
    }

    return (
      <div className="w-full m-20  mt-0  ml-0 max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-700 dark:text-white">
        {isLoggedIn ? (
          <div className="flex items-center space-x-4 pb-4">
            <img src={user?.avatar} alt="User Avatar" className="h-12 w-12 rounded-full" />
            <div>
              <p className="font-bold text-gray-900 dark:text-gray-200">{user?.userName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
            </div>
          </div>
        ) : (
          <h2 className="pb-4 text-center text-2xl font-bold text-gray-900 dark:text-white">
            Account
          </h2>
        )}

        <div className="flex items-center justify-between border-t border-b border-gray-200 py-4 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            {theme === 'dark' ? moonIcon : sunIcon}
            <span className="font-medium text-gray-700 dark:text-gray-400">
              {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
            </span>
          </div>
          <button
            onClick={toggleTheme}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") toggleTheme();
            }}
            tabIndex={0}
            role="switch"
            aria-label="Toggle dark mode"
            aria-checked={theme === "dark"}
            className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${theme === "dark" ? "bg-blue-800" : "bg-gray-300"
              }`}
          >
            <span className="sr-only">Toggle theme</span>
            <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition ${theme === "dark" ? "translate-x-5" : "translate-x-0"}`} />
          </button>

        </div>

        {error && (
          <div className="my-4 rounded-lg bg-red-100 p-3 text-center text-sm font-medium text-red-700 dark:bg-red-900 dark:text-red-200">
            {error.message}
          </div>
        )}

        <div className="space-y-2 pt-4">
          {isLoggedIn ? (
            <>
              {/* <ActionButton icon={userPlusIcon} text="Add Account" onClick={() => console.log('Add Account!')} /> */}
              <ActionButton icon={logoutIcon} text="Logout" onClick={() => (onLogoutClick())} />
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={onClose}
                className="flex w-full items-center space-x-3 rounded-lg bg-blue-600 px-4 py-2.5 text-left font-semibold text-white transition-colors hover:bg-blue-700"
              >
                {loginIcon} <span>Login</span>
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="flex w-full items-center space-x-3 rounded-lg bg-gray-600 px-4 py-2.5 text-left font-semibold text-white transition-colors hover:bg-gray-700"
              >
                {registerIcon} <span>Register New Account</span>
              </Link>
            </>
          )}
          <a
            href="#" // Example external link
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center space-x-3 rounded-lg px-4 py-2.5 text-left font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <span className="flex-shrink-0">{helpIcon}</span>
            <span>Help Center</span>
          </a>
        </div>
      </div>
    );
  }


  /**
   * Layout component
   * This was previously SideBar, but it's the persistent layout.
   */
  // State to manage the account card visibility
  const [isCardVisible, setCardVisible] = useState(false);
  const toggleCard = () => setCardVisible(!isCardVisible);

  const [showDropdown, setShowDropdown] = useState(true);
  const [videos, setVideos] = useState([])
  const handleSearch = async () => {
    try {
      const query = document.querySelector('input[type="search"]').value;
      if (query.trim() !== "") {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
    } catch (error) {
      console.error("Error in searching videos", error);
    }
  }
  // const [searchParams] = useSearchParams();
  // const query = searchParams.get("q");
  const [query, setQuery] = useState("");

  useEffect(() => {
    // console.log("Search query changed :", query)
    const fetchVideos = async () => {
      if (query.trim().length < 2) {
        setVideos([]);
        return;
      }
      try {
        const data = await videoService.handleGetAllVideos({ query });
        // console.log("Fetched video for search query :", data)
        setShowDropdown(true);
        setVideos(data.videos || []);
        console.log("SetShowDropDown---->", data)
      } catch (error) {
        console.error("Search error:", error);
      }
    };

    if (query) {
      fetchVideos();
    }
    // const delayDebounce = setTimeout(videos, 300);

    // return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between bg-white px-4 shadow-md dark:bg-gray-900">

        <header className="p-4 flex items-center gap-3 border-b bg-gray-900">
          <button
            onClick={() => setOpen(prev => !prev)}
            aria-expanded={open}
            aria-controls="sidebar"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            {/* Simple icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </header>


        {/* Left Section: Logo and Burger */}
        <div className="flex items-center">
          <button className="mr-2 rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 dark:text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <NavLink to="/home" className="flex flex-shrink-0 items-center">
            <svg className="h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
            </svg>
            <span className="ml-2 text-xl font-bold tracking-tighter dark:text-white">VideoHub</span>
          </NavLink>
        </div>

        {/* Center Section: Search Bar */}
        <div className="hidden flex-1 items-center justify-center px-8 sm:flex">
          <div className="w-full max-w-lg">
            <div className="relative">
              <input value={query} onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query && setShowDropdown(true)} type="search" placeholder="Search" className=" w-full rounded-full border bg-gray-100 py-2 pl-4 pr-12 text-gray-900 shadow-inner outline-none focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500 dark:bg-gray-700 dark:text-white dark:focus:bg-gray-800" />

              <button onClick={() => handleSearch()} className="pl-2 absolute inset-y-0 right-0 flex items-center rounded-r-full border-l border-gray-300 bg-gray-200 px-4 text-gray-600 hover:bg-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>
            </div>

          </div>
          {showDropdown && videos.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-gray-200  dark:bg-gray-900 border border-gray-700 rounded-xl mt-2 shadow-xl z-50 max-h-80 overflow-y-auto">

              {videos.map((video) => (
                <div
                  key={video._id}
                  className="px-4 py-3 hover:bg-zinc-800 cursor-pointer flex items-center gap-3"
                >
                  <span className="text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search-icon lucide-search">
                    <path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></svg></span>
                  <a href={`video-player/${video._id}`} className="text-white dark:bg-gray-700 dark:text-gray-100">{video.title}</a>
                </div>
              ))}

            </div>
          )}
        </div>

        {/* Right Section: Upload and User */}
        <div className="flex flex-shrink-0 items-center space-x-2">
          <button onClick={() => (navigate('/upload-video'))} className="hidden rounded-full p-2 hover:bg-gray-100 sm:block dark:text-white dark:hover:bg-gray-700" title="Upload video">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
          </button>

          {/* User Menu Button & Account Card Anchor */}
          <div className="relative">
            <button
              onClick={toggleCard}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300"
              title="User menu"
            >
              <img src={userPic || placeholderAvatar} alt="User Avatar"
                className="h-full w-full rounded-full object-cover" />
            </button>

            {/* Conditionally Render Account Card and Backdrop */}
            {isCardVisible && (
              <>
                {/* Backdrop to close card on outside click */}
                <div
                  onClick={() => setCardVisible(false)}
                  className="fixed inset-0 z-40 h-full w-full"
                />

                {/* The Account Card, positioned absolutely */}
                <div className="absolute z-50 right-0 top-12 mt-2">
                  <AccountCard onClose={() => setCardVisible(false)} />
                </div>
              </>
            )}
          </div>

        </div>
      </header>





      {/* This is the sidebar navigation */}
      <aside className={`fixed top-16 left-0 z-40 h-screen w-64 -translate-x-full overflow-y-auto border-r border-gray-200
       bg-white p-4 pt-6  dark:bg-gray-900
        dark:border-gray-700 ${open ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300`}>
        <nav className={"space-y-1"}>
          {/* We need to apply active/inactive styles */}
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `flex items-center rounded-lg p-2 text-base font-normal ${isActive
                ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                : 'text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
              }`
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
            <span className="ml-3">Home</span>
          </NavLink>
          <NavLink
            to="/subscriptions"
            className={({ isActive }) =>
              `flex items-center rounded-lg p-2 text-base font-normal ${isActive
                ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                : 'text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
              }`
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0111.186 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12.75h10.5" /></svg>
            <span className="ml-3">Subscriptions</span>
          </NavLink>
          <NavLink
            to="/community"
            className={({ isActive }) =>
              `flex items-center rounded-lg p-2 text-base font-normal ${isActive
                ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                : 'text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
              }`
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A9.06 9.06 0 016 18.719m12 0a9.094 9.094 0 00-3.741-.479 3 3 0 00-4.682-2.72m-3.14.94l.001.031c0 .225.012.447.037.666A11.944 11.944 0 0012 21c2.17 0 4.207-.576 5.963-1.584A9.06 9.06 0 0018 18.719z" /></svg>
            <span className="ml-3">Community</span>
          </NavLink>
          <NavLink
            to={`/playlists`}
            className={({ isActive }) =>
              `flex items-center rounded-lg p-2 text-base font-normal ${isActive
                ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                : 'text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
              }`
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" /></svg>
            <span className="ml-3">Playlists</span>
          </NavLink>
        </nav>

        {/* Subscriptions Section (using <a> tags for external links) */}
      </aside>
    </>
  )
}


// --- Dummy Page Components for Demonstration ---

export default NavBar


/**
 * App component
 * This is the main export. It sets up the router and renders the layout.
 */


