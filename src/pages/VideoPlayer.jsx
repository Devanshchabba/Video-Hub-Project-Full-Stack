import React, { useState, useEffect } from 'react';
import videoService from '../components/video.js';
import { useNavigate, useParams } from 'react-router-dom'
import { Loading, Player, InlineMessage, Input, Error } from './index.jsx'
import subscriptionService from '../components/subscription.js';
import commentService from '../components/comments.js';
import { useForm } from 'react-hook-form';
import CommentMenu from '../components/CommentMenu.jsx';
import { formatDistanceToNow } from 'date-fns';
import { getErrorMessage } from '../utils/getErrorMessage.js';

/**
 * VideoWatchPage.jsx
 * This component renders the main video player, details, comments, 
 * and a list of related videos in a responsive two-column layout.
 */
function VideoPlayer() {


  const navigate = useNavigate()
  const { handleSubmit, register, reset } = useForm()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [video, setVideo] = useState({})
  const [subscribers, setSubscribers] = useState(null)
  const [owner, setOwner] = useState({})
  const { video_id } = useParams();
  const [comments, setComments] = useState([])
  const [showMsg, setShowMsg] = useState(false);
  const [message, setMessage] = useState("");

  const toText = (value, fallback = "") => {
    if (value == null) return fallback;
    if (typeof value === "string" || typeof value === "number") return value;
    return getErrorMessage(value, fallback);
  };

  const toCount = (value, fallback = 0) => {
    const count = Number(value);
    return Number.isFinite(count) ? count : fallback;
  };


  const handleVideo = async (video_id) => {
    if (!video_id) return;
    setLoading(true);
    try {
      const res = await videoService.getVideo(video_id)
      const videoData = res && typeof res === "object" ? res : {};
      setVideo(videoData && typeof videoData === "object" ? videoData : {})
      setOwner(videoData?.owner && typeof videoData.owner === "object" ? videoData.owner : {})
      // console.log("videoFile--->", res)
    } catch (error) {
      console.error("Error fetching video: ", error)
      setError(getErrorMessage(error, "Error in fetching video."))
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
      setSubscribers(toCount(res, 0));
    } catch (error) {
      console.error("Error in fetching subscribers:", error)
      setError(getErrorMessage(error, "Error in fetching subscribers."));
    } finally {
      setLoading(false)
    }
  }

  const [isSubscribed, setIsSubscribed] = useState(null);
  const [toggleSubscribe, setToggleSubscribe] = useState(isSubscribed)


  const initialSubscribed = async () => {
    if (!owner._id) return;
    try {
      const res = await subscriptionService.handleIsSubscribed(owner._id);
      console.log("isSubscribed---->", res)
      setIsSubscribed(res);
      setToggleSubscribe(res);
    } catch (error) {
      console.error("Error in initializing subscription state", error);
      setError(getErrorMessage(error, "Error in checking subscription status."));
    }
  }
  // console.log("Initial subscribed value --->",res)


  const handleSubscribeToggle = async () => {
    if (!owner?._id) return;

    try {
      const res = await subscriptionService.handleToggleSubscribe(owner._id);
      setToggleSubscribe(res?.isSubscribed);
      setIsSubscribed(res?.isSubscribed);
    } catch (error) {
      setError(getErrorMessage(error, "Error in toggling subscription."));
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
      setLikes(res && typeof res === "object" ? res : {});
      console.log("Likes fetched --->", res);
      const isUserliked = Array.isArray(res?.likes)
        ? res.likes.filter((like) => like?.likedBy?._id === owner._id)
        : [];

      if (isUserliked.length === 0) setIsLiked(false);
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
      setComments(Array.isArray(res) ? res : [])
    } catch (error) {
      console.error("Error fetching comments", error);
      setError(getErrorMessage(error, "Error in fetching comments."));
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
      await commentService.addComment(data.comment, video_id);
      // console.log("resppnse is this--->", res)
      showMessage("Comment added Successfully")
      handleComments()
      reset()

    } catch (error) {
      setError(getErrorMessage(error, "Error in adding comment."))
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
      setError(getErrorMessage(error, "Error in deleting comment."))
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
      setError(getErrorMessage(error, "Error in editing comment."))
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
      setError(getErrorMessage(error, "Error in toggling comment like."));
      console.error("Error in toggling comment like", error);
    }
  }
  const handleGetCommentLikes = async (commentId) => {
    setLoading(true);
    try {
      const res = await commentService.getCommentLikes(commentId);
      console.log("Fetched comment likes  --->", res);
      setCommentLikes((prev) => ({ ...prev, [commentId]: res && typeof res === "object" ? res : {} }));
      setIsCommentLiked(Array.isArray(res?.likes) ? res.likes.some((like) => like?.likedBy === owner._id) : false)
      console.log("Likes of comment  --->", commentLikes)
    } catch (error) {
      setError(getErrorMessage(error, "Error in fetching comment likes."));
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
    handleVideo(video_id);
    handleComments();
  }, [video_id])

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
      setVideos(Array.isArray(res?.videos) ? res.videos : []);
    } catch (error) {
      console.error("Error in fetching videos for channel sidebar", error);
      setError(getErrorMessage(error, "Error in fetching related videos."));
    }
  }

  const commentItems = Array.isArray(comments)
    ? comments.filter((comment) => comment && typeof comment === "object")
    : [];
  const relatedVideos = Array.isArray(videos)
    ? videos.filter((item) => item && typeof item === "object")
    : [];
  const likeCount = toCount(likes?.len, 0);
  const subscriberCount = toCount(subscribers, 0);
  const videoViews = toText(video?.views, 0);
  const videoTitle = toText(video?.title, "");
  const videoDescription = toText(video?.description, "");
  const ownerName = toText(owner?.fullName, "");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const isHlsUrl = (value) =>
    typeof value === "string" &&
    (value.includes(".m3u8") || value.includes("/stream"));

  const shouldSendCredentials = (value) => {
    if (typeof value !== "string" || !value.trim()) return false;

    try {
      const apiOrigin = new URL(apiBaseUrl, window.location.origin).origin;
      const sourceOrigin = new URL(value, window.location.origin).origin;
      return apiOrigin === sourceOrigin;
    } catch {
      return false;
    }
  };

  const getPlayerSource = () => {
    const explicitStreamUrl =
      video?.hlsUrl ||
      video?.streamUrl ||
      video?.manifestUrl ||
      video?.playbackUrl;

    if (isHlsUrl(explicitStreamUrl)) {
      return {
        src: explicitStreamUrl,
        isHls: true,
        type: "application/x-mpegURL",
        withCredentials: shouldSendCredentials(explicitStreamUrl),
      };
    }

    if (isHlsUrl(video?.videoFile)) {
      return {
        src: video.videoFile,
        isHls: true,
        type: "application/x-mpegURL",
        withCredentials: shouldSendCredentials(video.videoFile),
      };
    }

    if (video_id) {
      const fallbackStreamUrl = `${apiBaseUrl}/videos/video/${video_id}/stream`;
      return {
        src: fallbackStreamUrl,
        isHls: true,
        type: "application/x-mpegURL",
        withCredentials: true,
      };
    }

    return {
      src: video?.videoFile || "",
      isHls: false,
      type: "video/mp4",
      withCredentials: shouldSendCredentials(video?.videoFile || ""),
    };
  };


  // useEffect(() => {
  //   console.log('video state updated:', video);
  // }, [video]);


  // useEffect(() => {
  //   console.log('player URL:', url);
  // }, [url]);


  const [showFullDescription, setShowFullDescription] = useState(false);

  const playerSource = getPlayerSource();
  console.log("Player source --->", playerSource);


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
                src={playerSource}
              />
            </div>
          </div>


          {/* 2. Video Title and Actions */}
          <div className="mt-4 ">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-300">
              {videoTitle}
            </h1>
            <div className="mt-2 flex flex-col items-start justify-between sm:flex-row sm:items-center">
              {/* Views and Date */}
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {videoViews} views  &bull; {video.createdAt ? formatDistanceToNow(new Date(video.createdAt)) + ' ago' : ''}
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
                  {likeCount} Likes
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
                  {ownerName}
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400">{subscriberCount} Subscribers</p>
              </div>
            </div>
            {<button onClick={handleSubscribeToggle}
              className={`rounded-full ${toggleSubscribe ? "bg-gray-600 hover:bg-gray-400" : " bg-red-600 hover:bg-red-700"}  px-4 py-2 font-semibold text-white `}>
              {toggleSubscribe ? "UNSUBSCRIBE" : "SUBSCRIBE"}
            </button>}
          </div>

          {/* 4. Description Box */}
          <div className="mt-4 rounded-lg bg-gray-100 p-4">
            {videoDescription.length > 150 ? videoDescription.substring(0, 150) : videoDescription}
            {videoDescription.length > 150 && !showFullDescription && (
              <span onClick={() => setShowFullDescription(!showFullDescription)} className="text-blue-500 hover:text-blue-400 cursor-pointer ml-1">...Read more</span>
            )}
            {showFullDescription && videoDescription.length > 150 && (<span className="text-gray-300 text-sm whitespace-pre-wrap">{videoDescription.substring(150)}</span>)}
            {showFullDescription && videoDescription.length > 150 && (<span onClick={() => setShowFullDescription(!showFullDescription)} className="text-blue-500 hover:text-blue-400 cursor-pointer ml-1"> Show less</span>)}
          </div>

          {/* 5. Comments Section */}
          <div className="mt-6">
            {/* Comment Header */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-300 dark:bg-bg-gray-700">
                {commentItems.length} Comments
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
            {commentItems.map((comment) => (
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
                      <a href={`/userChannel/${comment.user?.userName}`} className="text-sm font-semibold text-gray-800 dark:text-gray-300">{toText(comment.user?.fullName, "")}</a>

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
                        {toText(comment.content, "")}
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
                        {toCount(commentLikes[comment?._id]?.len, 0)} Likes
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

          {relatedVideos.length > 0 &&
            <div className="flex flex-col space-y-4">
              {relatedVideos.map((video) => (
                <div className="group flex space-x-3" key={video._id}>
                  <a href={`/video-player/${video._id}`} className="flex-shrink-0">
                    <img
                      src={video.thumbnail}
                      alt="Related video thumbnail"
                      className="h-[94px] w-40 rounded-lg object-cover"
                    />
                  </a>
                  <div className="flex-1">
                    <a href={`/video-player/${video._id}`} className=" dark:text-gray-300 text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-red-600">
                      {toText(video.title, "")}
                    </a>
                    <a href={`/channel/${video.owner}`} className="mt-1 block text-xs text-gray-600 hover:text-gray-900">

                    </a>
                    <p className="mt-1 text-xs text-gray-500">
                      {toText(video.views, 0)} views &bull; {video.createdAt ? formatDistanceToNow(new Date(video.createdAt)) + ' ago' : ''}
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

