import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Login, Playlist, Register, Subscription, CommunityPost, UploadVideo, PlaylistSearch,ChangePassword, ShowPlaylist, VideoPlayer, CreatePlaylist, UserProfile } from './pages/index.jsx'
import Home from './pages/home.jsx'
import { createBrowserRouter, RouterProvider, BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from "./ThemeContext.jsx";

import './components/axiosSetUp.js'
import SearchPage from './pages/SearchPage.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'playlists',
        element: <Playlist />,
      },
      {
        path: 'playlists/show-playlist/:playlistId',
        element: <ShowPlaylist />
      },
      {
        path: 'create-playlist',
        element: <CreatePlaylist />
      },
      {
        path: 'home',
        element: <Home />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      },
      {
        path: 'subscriptions',
        element: <Subscription />
      },
      {
        path: 'community',
        element: <CommunityPost />
      },
      {
        path: '/change-password',
        element: <ChangePassword />
      },
      {
        path: '/video-player/:video_id',
        element: <VideoPlayer />
      },
      {
        path: '/playlists/show-playlist/video-player/:video_id',
        element : <VideoPlayer />
      },
      {
        path: '/upload-video',
        element: <UploadVideo />
      },
      {
        path: '/userChannel/:userName',
        element: <UserProfile />
      },
      {
        path: "search",
        element: <SearchPage />
      },
      {
        path: "/playlist/search-video/:playlistId",
        element: <PlaylistSearch />
      }
    ]
  },



])

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <StrictMode>
      {/* <BrowserRouter> */}
      <RouterProvider router={router} />
      {/* </BrowserRouter> */}
    </StrictMode>
  </ThemeProvider>
);
