import { useState } from "react";
import playlistService from "../components/playlist";

export default function CreatePlaylist() {
  const [playlistName, setPlaylistName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const playlistData = { name: playlistName, description };

    try {
      const res = await playlistService.createPlaylist(playlistData);
      console.log(res);
      setError("");
      setPlaylistName("");
      setDescription("");
    } catch (err) {
      setError(err?.response?.data?.message || "Error creating playlist");
      console.error("Error in Creating Playlist");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8 transition-all">
        
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
          Create New Playlist
        </h1>

        {error && (
          <h2 className="text-red-600 text-sm mb-4 text-center">
            {error}
          </h2>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Playlist Name
            </label>
            <input
              type="text"
              required
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              placeholder="Enter playlist name"
              className="w-full px-4 py-2 rounded-lg border
                         border-gray-300 bg-white text-gray-800
                         focus:outline-none focus:ring-2 focus:ring-indigo-500
                         dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a short description..."
              className="w-full px-4 py-2 rounded-lg border
                         border-gray-300 bg-white text-gray-800
                         focus:outline-none focus:ring-2 focus:ring-indigo-500
                         dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-100"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg font-semibold
                       bg-indigo-600 text-white
                       hover:bg-indigo-700 transition-all duration-300
                       dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            Create Playlist
          </button>

        </form>
      </div>
    </div>
  );
}