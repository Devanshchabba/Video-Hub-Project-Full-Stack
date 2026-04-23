import { useState, useRef, useEffect } from "react";

function CommentMenu({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* 3 dots button */}
      <button onClick={() => setOpen(!open)}>
        <svg
          className="h-5 w-5 cursor-pointer text-gray-600 hover:text-black"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>

      {/* dropdown */}
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-32 rounded-lg border bg-white shadow-lg">
          <button
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
          >
            Edit
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default CommentMenu;
