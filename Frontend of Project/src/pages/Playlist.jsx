import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import playlistService from '../components/playlist.js';
import { Outlet } from "react-router-dom";

const PlaylistCard = ({ id, thumbnailUrl, title, channelName, videoCount }) => {
  return (
    <div key={id} className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-xl">
      {/* Thumbnail Section */}
      <div className="relative flex-shrink-0">
        <img
          className="h-48 w-full object-cover"
          src={thumbnailUrl}
          alt={`Thumbnail for ${title}`}
        />
        {/* Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 right-0 m-2 flex items-center justify-center rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white">
          {/* Playlist Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5 h-4 w-4">
            <path d="M2 12h20" />
            <path d="M2 6h20" />
            <path d="M2 18h20" />
          </svg>
          <span>{videoCount} videos</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
            {title}
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {channelName}
          </p>
        </div>
        <div className="mt-4">
          <Link to={`show-playlist/${id}`} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
            View full playlist
          </Link>
        </div>
      </div>
    </div>
  );
};
function Playlist() {

  const [error, setError] = useState("");
  const [playlists, setPlaylists] = useState([])


  const handleFetchPlaylists = async () => {
    try {
      setError("")
      const res = await playlistService.fetchPlaylists();
      setPlaylists(res);
      console.log("Fetching playlist :", playlists);
    } catch (error) {
      setError(error);
    }
  }

  useEffect(() => {
    handleFetchPlaylists();
  }, []);


  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 md:pl-60 pt-16">
      <main className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
          My Playlists
        </h1>


        <div onClick={() => navigate('/create-playlist')}
          class="group cursor-pointer w-full h-40 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed
           bg-white text-gray-800 border-gray-300 transition-all duration-300  hover:shadow-lg hover:scale-105 hover:border-indigo-500
           dark:bg-zinc-900 dark:text-gray-200 dark:border-zinc-700
           dark:hover:border-indigo-400 dark:hover:bg-zinc-800">
          <div
            class="p-3 mb-3 rounded-full
             bg-indigo-100 text-indigo-600
             transition-all duration-300
             group-hover:bg-indigo-600 group-hover:text-white
             
             dark:bg-zinc-800 dark:text-indigo-400
             dark:group-hover:bg-indigo-500 dark:group-hover:text-white">


            <svg xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2">
              <path stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold">
            Create Playlist
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Start a new music collection
          </p>
        </div>

        {/* Responsive Grid for Playlist Cards */}
        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {playlists?.length > 0 ? (
            playlists.map((playlist) => (
              <PlaylistCard
                key={playlist._id}
                id={playlist._id}   // 🔥 use _id if coming from MongoDB
                title={playlist.name}   // 🔥 match backend field
                channelName={playlist.owner?.userName} // adjust if needed
                videoCount={playlist.videos?.length || 0}
                thumbnailUrl={playlist.thumbnail || "https://via.placeholder.com/400x300?text=No+Thumbnail"} // fallback thumbnail
              />
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 col-span-full text-center">
              No playlists found
            </p>
          )}
        </div>
      </main>
    </div>
  );

}

export default Playlist
