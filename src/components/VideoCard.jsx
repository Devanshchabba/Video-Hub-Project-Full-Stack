import { useState, useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

function VideoCard({ video, isOwner = false, onEdit = () => {}, onDelete = () => {} }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const ownerId = video?.owner && typeof video.owner === 'object' ? video.owner._id : video.owner;
  const showMenu = isOwner && ownerId;

  return (
    <div className="cursor-pointer">
      <div className="relative">
        <img
          src={video.thumbnail}
          alt="thumbnail"
          className="aspect-video w-full rounded-lg"
        />

        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded">
          00/00
        </div>

        {showMenu && (
          <div ref={menuRef} className="absolute top-2 right-2 z-20 text-right">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setMenuOpen((open) => !open);
              }}
              className="rounded-full bg-black/70 p-2 text-white transition hover:bg-black"
              aria-label="Open video actions"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </button>

            {menuOpen && (
              <div className="mt-2 w-36 overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-lg">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setMenuOpen(false);
                    onEdit(video);
                  }}
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setMenuOpen(false);
                    onDelete(video);
                  }}
                  className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

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
