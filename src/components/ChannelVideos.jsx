import VideoCard from "./VideoCard.jsx";
import React from "react";
function ChannelVideos({ videos }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
}

export default ChannelVideos;
