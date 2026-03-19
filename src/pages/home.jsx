import React, { useState, useEffect } from 'react';
import '../index.css'
import { Link, NavLink } from 'react-router-dom'
import { Loading, Error, Pagination } from './index.jsx'
import videoService from '../components/video';
import { formatDistanceToNow } from 'date-fns';
// import Error from './Error';


function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [videos, setVideos] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  // const [totalVideos, setTotalVideos] = useState(0);



  /**
   * In a real React app, you would add the Google Font <link> to your public/index.html file
   * and set the default font-family in your src/index.css file like this:
  *
  * body {
  * font-family: 'Inter', sans-serif;
  * }
  *
  * This component assumes Tailwind is already set up in your project.
  */


  const fetchVideos = async (page = 1) => {
    const opts = {
      limit: 10,
      page: page,
      sortBy: "createdAt",
      sortType: "desc",
    }
    // console.log(opts)
    try {
      setLoading(false)
      setError(null);
      const response = await videoService.handleGetAllVideos(opts)
      // console.log(response)
      setVideos(response.videos)
      setTotalPage(response.totalPages)
      setCurrentPage(response.currentPage)
      // setTotalVideos(response.total)
    } catch (error) {
      setError(error.message)
      console.error("Error in fetching :", error)
      // throw new Error("Error during fetching videos", error)
    }
  }
  const handlePageChange = (newPage) => {
    // Scroll to the top of the page for a smooth transition
    setCurrentPage(newPage)
    window.scrollTo(0, 0);

  };

  const formatDuration = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  useEffect(() => {
    fetchVideos(currentPage)
  }, [currentPage])
  return (
    // This main div replaces the <body> tag
    <div className="bg-gray-100 dark:bg-black dark:text-white text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>
      <h1 className="text-2xl font-bold mb-4">Home</h1>
      {/* ============================================= */}
      {/* HEADER (Navbar)                               */}
      {/* Fixed at the top, uses flexbox for alignment  */}
      {/* ============================================= */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <Loading />
        </div>
      )}
      {
        error && (
          <Error
            error={error}
          />
        )
      }


      {/* ============================================= */}
      {/* MAIN CONTENT AREA                             */}
      {/* Has margin-left to offset sidebar (md:ml-64)  */}
      {/* Has padding-top to offset header (pt-16)      */}
      {/* ============================================= */}
      <main className={`min-h-screen p-6 pt-20 `}> {/*md:ml-60 */}

        {/* <p className="text-gray-600">This is where the page content (e.g., video grid, watch page, dashboard) will be rendered.</p> */}

        {/* Placeholder: Video Grid */}
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {videos.map((video) => (
            <div className="group rounded-lg bg-white shadow-md dark:bg-gray-800 " key={video._id} >
              <a href={`/video-player/${video._id}`} className="relative w-full sm:w-72 flex-shrink-0">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-44 object-cover rounded-xl"
                />
                <span className="absolute bottom-2 right-2 bg-black  text-white bg-opacity-80 text-xs px-2 py-1 rounded">
                  {formatDuration(video.duration)}
                </span>
              </a>
              <div className="p-4">
                <div className="flex items-start">
                  <a href={`userChannel/${video.owner.userName}`} className="flex-shrink-0">
                    <img src={video.owner.avatar} alt="Channel" className="h-10 w-10 rounded-full dark:hover:text-white" />
                  </a>
                  <div className="ml-3">
                    <a href={`/video-player/${video._id}`} className="text-base font-semibold dark:text-white text-gray-900 group-hover:text-red-600">
                      {video.title}
                    </a>
                    <a href={`userChannel/${video.owner.userName}`} className="mt-1 block text-sm dark:text-gray-400 text-gray-600 hover:text-gray-900 dark:hover:text-white">
                      {video.owner.fullName}
                    </a>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 ">
                      {video.views} Views &bull;  {video.createdAt ? formatDistanceToNow(new Date(video.createdAt)) + ' ago' : ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPage}
          onPageChange={handlePageChange}
        />
      </main >
    </div >
  );
}

export default Home;
