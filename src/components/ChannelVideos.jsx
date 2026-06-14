import { useState, useEffect } from "react";
import VideoCard from "./VideoCard.jsx";
import authService from "../components/user.js";

function ChannelVideos({ videos, onEditVideo, onDeleteVideo }) {
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await authService.getUser();
        if (user?._id) {
          setCurrentUserId(user._id);
        }
      } catch (error) {
        console.error("Failed to fetch current user for owner menu", error);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {videos.map((video) => {
        const videoOwnerId = video?.owner && typeof video.owner === "object" ? video.owner._id : video.owner;
        const isOwner = currentUserId && videoOwnerId && currentUserId === videoOwnerId;

        return (
          <VideoCard
            key={video._id}
            video={video}
            isOwner={isOwner}
            onEdit={() => onEditVideo?.(video)}
            onDelete={() => onDeleteVideo?.(video)}
          />
        );
      })}
    </div>
  );
}

export default ChannelVideos;
