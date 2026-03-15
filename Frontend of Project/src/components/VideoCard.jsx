import {formatDistanceToNow} from 'date-fns'
function VideoCard({ video }) {
  return (
    <div className="cursor-pointer">
      <img
        src={video.thumbnail}
        alt="thumbnail"
        className="aspect-video w-full  rounded-lg"
      />

      <h3 className="mt-2 text-sm font-semibold line-clamp-2">
        {video.title}
      </h3>

      <p className="text-xs text-gray-600">
        {video.views} views • {video.createdAt ? formatDistanceToNow(new Date(video.createdAt)) + ' ago' : ''}
      </p>
    </div>
  );
}

export default VideoCard;
