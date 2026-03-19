import React, { useState, useEffect } from 'react';
import videoService from '../components/video.js';
import { useNavigate, useParams } from 'react-router-dom'
import { Loading, Player, InlineMessage, Input } from './index.jsx'
import subscriptionService from '../components/subscription.js';
import commentService from '../components/comments.js';
import { useForm } from 'react-hook-form';
import CommentMenu from '../components/CommentMenu.jsx';
import { formatDistanceToNow } from 'date-fns';

/**
 * VideoWatchPage.jsx
 * This component renders the main video player, details, comments, 
 * and a list of related videos in a responsive two-column layout.
 */
function VideoPlayer() {


  const navigate = useNavigate()
  const { handleSubmit, register, reset } = useForm()

  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [video, setVideo] = useState({})
  const [subscribers, setSubscribers] = useState(null)
  const [owner, setOwner] = useState({})
  const { video_id } = useParams();
  const [comments, setComments] = useState([])
  const [showMsg, setShowMsg] = useState(false);
  const [message, setMessage] = useState("");


  const handleVideo = async (video_id) => {
    if (!video_id) return;
    setLoading(true);
    try {
      const res = await videoService.getVideo(video_id)
      setVideo(res.data.data)
      setOwner(res.data.data.owner)
      // console.log("videoFile", res.data.data.videoFile)
    } catch (error) {
      console.error("Error fetching video: ", error)
      setError(error)
    } finally {
      setLoading(false)
    }
  }


  const fetchSubscribers = async (userId) => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await subscriptionService.handleUserSubscribers(userId)
      // console.log(res.data)
      setSubscribers(res.data);
    } catch (error) {
      <Error
        message={"Error in Fetching Subsribers"}
        statusCode={401}
        error={error} />
      console.error("Error in fetching subscribers:", error)
    } finally {
      setLoading(false)
    }
  }

  const addCloudinaryTransform = (url, transform = "f_mp4") => {
    if (!url || typeof url !== "string") {
      setUrl("");
      return "";
    }
    if (!url.includes("/upload/")) {
      setUrl(url);
      return url;
    }
    const optimized = url.replace("/upload/", `/upload/${transform}/`);
    // console.log("This is optized URl ---> ",optimized)
    setUrl(optimized)
    return optimized;
  }
  const [isSubscribed, setIsSubscribed] = useState(null);
  const [toggleSubscribe, setToggleSubscribe] = useState(isSubscribed)


  const initialSubscribed = async () => {
    if (!owner._id) return;
    const res = await subscriptionService.handleIsSubscribed(owner._id);
    console.log("isSubscribed---->", res)
    setIsSubscribed(res);
    setToggleSubscribe(res);
    // return res;
  }
  // console.log("Initial subscribed value --->",res)


  const handleSubscribeToggle = async () => {
    if (!owner?._id) return;

    try {
      const res = await subscriptionService.handleToggleSubscribe(owner._id);
      setToggleSubscribe(res.data.isSubscribed);
      setIsSubscribed(res.data.isSubscribed); // ✅ keep in sync
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    if (!owner?._id) return;
    initialSubscribed();
  }, [owner?._id]);




  const [isLiked, setIsLiked] = useState(null);
  const [likes, setLikes] = useState({});

  const handleGetVideoLikes = async (videoId) => {
    if (!videoId) return;
    try {
      const res = await videoService.getVideoLikes(videoId);
      setLikes(res);
      console.log("Likes fetched --->", res);
      const isUserliked = res.likes?.filter((like) => like.likedBy._id === owner._id);

      if (!isUserliked) setIsLiked(false);
      else setIsLiked(true);

    } catch (error) {
      console.error("Error in fetching likes", error);
    }
  }

  const handleToggleVideoLike = async (videoId) => {
    if (!videoId) return;
    try {
      const res = await videoService.toggleLike(videoId);
      console.log("Toggled Like --->", res);
      setIsLiked(res.isLiked);
      handleGetVideoLikes(videoId);
    }
    catch (error) {
      console.error("Error", error)
    }
  }


  useEffect(() => {
    if (!video?._id) return;
    handleGetVideoLikes(video._id);
  }, [video._id, owner._id])


  const handleComments = async () => {
    try {
      const res = await commentService.getVideoComments(video_id)
      // console.log("Comments are ---->", res)
      setComments(res)
    } catch (error) {
      console.error("Error fetching comments", error);
      setError(error);
      // <Error
      //   message={"Error in fetching comments"}
      //   error={error} />
    }
  }

  const showMessage = (text) => {
    setMessage(text);
    setShowMsg(true);

    setTimeout(() => {
      setShowMsg(false);
      setMessage("");
    }, 2000);
  };


  const handleAddComment = async (data) => {
    if (!video_id) return;
    console.log("Data of comment---->", data)
    try {
      const res = await commentService.addComment(data.comment, video_id);
      // console.log("resppnse is this--->", res)
      showMessage("Comment added Successfully")
      setComments((prev) => [data.comment, ...prev]);
      handleComments()
      reset()

    } catch (error) {
      setError(error)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!commentId) return;
    try {
      setError(null)
      const res = await commentService.deleteComment(commentId);
      setComments((c) => c.filter((x) => x._id !== commentId));
      console.log("Delete comment --->", res);
      showMessage("Comment deleted successfully");
    } catch (error) {
      setError(error)
    }
  }

  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState("");


  const handleEditComment = async (commentId) => {
    if (!editingData.trim()) return;
    setLoading(false);

    try {
      const updated = await commentService.editComment(
        commentId,
        { changeContent: editingData }
      );
      console.log("Updated comment --->", updated)
      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId
            ? { ...c, content: updated.content }
            : c
        )
      );
      setEditingId(null);
      setEditingData("");
      showMessage("Comment edited successfully");
    } catch (error) {
      setError(error)
      console.error(error);
    }
  };

  const [commentLikes, setCommentLikes] = useState([])
  const [isCommentLiked, setIsCommentLiked] = useState(null);


  const handleCommentLikeToggle = async (commentId) => {
    // console.log("Toggle comment func called ", commentId)
    if (!commentId) return;
    try {
      setLoading(false);
      const res = await commentService.toggleCommentLike(commentId);
      console.log("Toggled comment like ---->", res);
      // setIsCommentLiked(res.isLiked)
      handleGetCommentLikes(commentId);
    } catch (error) {
      setError(error);
      console.error("Error in toggling comment like", error);
    }
  }
  const handleGetCommentLikes = async (commentId) => {
    setLoading(true);
    try {
      const res = await commentService.getCommentLikes(commentId);
      console.log("Fetched comment likes  --->", res);
      setCommentLikes((prev) => ({ ...prev, [commentId]: res }));
      setIsCommentLiked(res.likes?.some((like) => like.likedBy === owner._id))
      console.log("Likes of comment  --->", commentLikes)
    } catch (error) {
      setError(error);
      console.log("Error in fetching comment likes", error);
    } finally { setLoading(false); }
  }

  useEffect(() => {
    if (!comments) return;
    comments.forEach((comment) => {
      handleGetCommentLikes(comment._id);
    });
  }, [comments])


  useEffect(() => {
    if (video_id) {
      handleVideo(video_id);
      handleComments();
    }
  }, [video_id])

  // set URL when video file changes
  useEffect(() => {
    if (video?.videoFile) addCloudinaryTransform(video.videoFile)
  }, [video.videoFile])

  useEffect(() => {
    if (owner._id) {
      fetchSubscribers(owner._id);
      fetchVideos();
      // getIsSubscribed(owner._id);
    }
  }, [owner._id]);

  const [videos, setVideos] = useState([]);
  const fetchVideos = async () => {
    try {
      const res = await videoService.handleGetAllVideos({ owner: owner._id, limit: 20 })
      setVideos(res.videos);
    } catch (error) {
      console.error("Error in fetching videos for channel sidebar", error);
      setError(error);
    }
  }


  // useEffect(() => {
  //   console.log('video state updated:', video);
  // }, [video]);


  // useEffect(() => {
  //   console.log('player URL:', url);
  // }, [url]);


  return (
    // Main container with a max-width, centered, and using CSS Grid for the layout
    <div className="mx-auto max-w-screen-2xl p-4 lg:p-6 mt-16 dark:bg-black">

      {loading && (<Loading />)}
      {error && (<Error
        error={error}
        message={"Error in fetching video"}
      />)}
      <InlineMessage
        show={showMsg}
        message={message}
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* ============================================= */}
        {/* Left Column (Main Content)                    */}
        {/* ============================================= */}
        <div className="lg:col-span-2">

          {/* 1. Video Player */}
          <div className="aspect-video w-full rounded-lg shadow-md bg-black">
            <div className="h-full w-full">
              <Player
                className="w-full h-full"
                src={url}
              />
            </div>
          </div>


          {/* 2. Video Title and Actions */}
          <div className="mt-4 ">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-300">
              {video.title}
            </h1>
            <div className="mt-2 flex flex-col items-start justify-between sm:flex-row sm:items-center">
              {/* Views and Date */}
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {video.views} views  &bull; {video.createdAt ? formatDistanceToNow(new Date(video.createdAt)) + ' ago' : ''}
              </p>

              {/* Action Buttons: Like, Save */}
              <div className="mt-2 flex space-x-2 sm:mt-0">
                {/* Like Button */}
                <button onClick={() => handleToggleVideoLike(video?._id)} className="flex items-center rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200
                 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    // fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    fill={!isLiked ? "currentColor" : "none"}
                    className={`h-6 w-6 mr-2 ${!isLiked ? 'text-blue-600' : 'text-gray-600'} dark:text-gray-300 `}

                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 11v10H3V11h4zm14-1a2 2 0 00-2-2h-5.5l.9-3.9.1-.6a1.5 1.5 0 00-.44-1.06L12 1.5 6.5 7v12a2 2 0 002 2h7.2a2 2 0 001.9-1.3l2.6-6.2c.1-.2.2-.5.2-.7v-2.8z"
                    />
                  </svg>
                  {likes.len} Likes
                </button>
                {/* Save Button */}
                <button className="flex items-center rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mr-2 h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0111.186 0z" />
                  </svg>
                  [Save]
                </button>
              </div>
            </div>
          </div>

          {/* 3. Channel Info and Subscribe Button */}
          <div className="my-4 flex items-center justify-between border-b border-t border-gray-200 py-4 dark:text-gray-300">
            <div onClick={() => navigate(`/userChannel/${owner.userName}`)} className="flex items-center">
              <img
                src={owner?.avatar || "https://placehold.co/48x48/3B82F6/FFFFFF?text=C"}

                alt="Channel Avatar"
                className="h-12 w-12 rounded-full"
              />
              <div className="ml-3">
                <a href="#" className="text-base font-semibold text-gray-900 hover:text-red-600 dark:text-gray-300">
                  {owner.fullName}
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400">{subscribers} Subscribers</p>
              </div>
            </div>
            {<button onClick={handleSubscribeToggle}
              className={`rounded-full ${toggleSubscribe ? "bg-gray-600 hover:bg-gray-400" : " bg-red-600 hover:bg-red-700"}  px-4 py-2 font-semibold text-white `}>
              {toggleSubscribe ? "UNSUBSCRIBE" : "SUBSCRIBE"}
            </button>}
          </div>

          {/* 4. Description Box */}
          <div className="mt-4 rounded-lg bg-gray-100 p-4">
            <p className="text-sm font-medium text-gray-800">
              {video.description}
            </p>
            <p className="mt-2 text-sm text-gray-700">
              Here is the main description of the video. It can contain links, hashtags,
              and other important information. It might be a few lines long by default.
            </p>
            <button className="mt-2 text-sm font-semibold text-gray-800 hover:text-black">
              ...more
            </button>
          </div>

          {/* 5. Comments Section */}
          <div className="mt-6">
            {/* Comment Header */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-300 dark:bg-bg-gray-700">
                {comments.length} Comments
              </h2>
              <button className="flex items-center text-sm font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:bg-bg-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mr-2 h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                </svg>
                [Sort By]
              </button>
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleSubmit(handleAddComment)} className="my-4 flex items-start space-x-3">
              <img
                src={owner?.avatar || "https://placehold.co/40x40/7C3AED/FFFFFF?text=U"}
                alt="Your Avatar"
                className="h-10 w-10 rounded-full"
              />
              <input
                type="text"
                name='comment'
                {...register("comment", {
                  required: true,
                })}
                placeholder="[Add a comment...]"
                className={"w-full border-b-2 border-gray-300 bg-transparent py-1 outline-none focus:border-black dark:text-gray-200 dark:bg-bg-gray-700"}
              />
              <button type='submit' className='w-35 h-10 rounded-3xl font-semibold text-xl hover:border-2 border-0 dark:text-gray-300 dark:bg-bg-gray-700'>Comment</button>

            </form>


            <div className="relative"><InlineMessage className={"absolute right-100"}
              show={showMsg}
              message={message}
            /> </div>


            {/* Comment List */}
            {comments.map((comment) => (
              <div className="mt-6 space-y-6 " key={comment._id} >
                {/* Comment 1 */}
                <div className="flex items-start space-x-3 " >
                  <a href={`/userChannel/${comment.user?.userName}`} className="flex-shrink-0">
                    <img
                      src={comment.user?.avatar || "https://placehold.co/40x40/7C3AED/FFFFFF?text=U"}
                      alt="Commenter Avatar"
                      className="h-10 w-10 rounded-full"
                    />
                  </a>
                  {/* onClick={navigate(`/userChannel/${comment.user.userName}`)}  */}
                  <div className="flex-1 relative">
                    <div className="flex items-baseline space-x-2">
                      <a href={`/userChannel/${comment.user?.userName}`} className="text-sm font-semibold text-gray-800 dark:text-gray-300">{comment.user?.fullName}</a>
                      <span className="text-xs text-gray-500">2 days ago</span>
                    </div>
                    <div className='absolute right-0'><CommentMenu
                      onDelete={() => (handleDeleteComment(comment._id))}
                      onEdit={() => {
                        setEditingId(comment._id);
                        setEditingData(comment.content); // preload text
                      }} /></div>

                    {editingId !== comment._id && (
                      <p className="mt-1 text-sm text-gray-700">
                        {comment.content}
                      </p>
                    )}

                    {editingId === comment._id && (
                      <input
                        type="text"
                        value={editingData}
                        onChange={(e) => setEditingData(e.target.value)}
                        className="mt-1 w-full border-b border-gray-300 dark:text-gray-200 bg-transparent outline-none "
                      />
                    )}

                    {editingId === comment._id && (
                      <div className="mt-1 flex gap-3 text-sm">
                        <button
                          onClick={() => handleEditComment(comment._id)}
                          className="text-blue-600"
                        >
                          Save
                        </button>

                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditingData("");
                          }}
                          className="text-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    <div className="mt-1 flex items-center space-x-4">
                      <button onClick={() => handleCommentLikeToggle(comment._id)} className="flex items-center text-xs text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className={`dark:text-gray-300 mr-1 h-4 w-4 ${isCommentLiked ? "fill-blue-500" : "fill-none"} `}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.166 1.712a4.5 4.5 0 01-1.825 5.234c-.98.614-2.185.986-3.417.986H6.633a.75.75 0 01-.75-.75V11.25c0-.414.336-.75.75-.75zM6.633 10.5l-2.221 4.673a.75.75 0 00.22 1.004l.49.245a.75.75 0 001.004-.22l2.221-4.673M6.633 10.5v1.907c0 .835.672 1.507 1.507 1.507h8.493a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75H9.743c-1.216 0-2.27-.775-2.643-1.907a.75.75 0 00-1.004-.22l-.49-.245a.75.75 0 00-.22 1.004l2.221 4.673a.75.75 0 001.224.24l.17-.341a.75.75 0 011.004-.22l.49.245a.75.75 0 01.22 1.004l-2.221 4.673a.75.75 0 01-1.224.24l-.17-.341a.75.75 0 00-1.004-.22l-.49.245a.75.75 0 00-.22 1.004l2.221 4.673a.75.75 0 001.224.24l.17-.341a.75.75 0 011.004-.22l.49.245a.75.75 0 01.22 1.004l-2.221 4.673a.75.75 0 01-1.224.24L4.818 21.03a.75.75 0 01-.22-1.004l.49-.245a.75.75 0 011.004-.22l2.221 4.673.01.021z" />
                        </svg>
                        {/* {commentLikes.len} */}
                        {commentLikes[comment?._id]?.len ?? 0} Likes
                      </button>
                      <button className="text-xs font-medium text-gray-600 hover:text-black">[Reply]</button>
                    </div>
                    {/* Replies... */}
                  </div>
                </div>
              </div>
            ))
            }
          </div>
        </div>














        {/* ============================================= */}
        {/* Right Column (Related Videos)                 */}
        {/* ============================================= */}
        <div className="lg:col-span-1">
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
              Add To Playlist
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Start a new music collection
            </p>
          </div>




          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            [Related Videos]
          </h3>

          {videos.length > 0 &&
            <div className="flex flex-col space-y-4">
              {videos.map((video) => (
                <div className="group flex space-x-3">
                  <a href={`/video-player/${video._id}`} className="flex-shrink-0">
                    <img
                      src={video.thumbnail}
                      alt="Related video thumbnail"
                      className="h-[94px] w-40 rounded-lg object-cover"
                    />
                  </a>
                  <div className="flex-1">
                    <a href={`/video-player/${video._id}`} className=" dark:text-gray-300 text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-red-600">
                      {video.title}
                    </a>
                    <a href={`/channel/${video.owner}`} className="mt-1 block text-xs text-gray-600 hover:text-gray-900">
                      
                    </a>
                    <p className="mt-1 text-xs text-gray-500">
                      {video.views} views &bull; {video.createdAt ? formatDistanceToNow(new Date(video.createdAt)) + ' ago' : ''} 
                    </p>
                  </div>
                </div>
              ))}

            </div>
          }
        </div>

      </div>
    </div>
  );
}

export default VideoPlayer;
