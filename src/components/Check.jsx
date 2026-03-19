import React, { useState } from "react";

// ToggleSidebar.jsx
// A simple toggle button that shows/hides a sidebar using Tailwind CSS.
// Default export is a single React component you can drop into your app.

export default function ToggleSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 mt-20 left-0 transform ${open ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out w-64 bg-white shadow-lg z-30`}
        aria-hidden={!open}
      >
        {/* <div className="p-9 border-b bg-gray-500 opacity-0">
        </div> */}
        <nav className="p-4">
          <ul className="space-y-2">
            <li className="px-2 py-1 rounded hover:bg-gray-100">Item 1</li>
            <li className="px-2 py-1 rounded hover:bg-gray-100">Item 2</li>
            <li className="px-2 py-1 rounded hover:bg-gray-100">Item 3</li>
          </ul>
        </nav>
      </aside>

      {/* Overlay for small screens */}
      {open && (
        <button
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="p-4 flex items-center gap-3 border-b bg-white">
          <button
            onClick={() => setOpen(prev => !prev)}
            aria-expanded={open}
            aria-controls="sidebar"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            {/* Simple icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>

            <span>{open ? "Hide Sidebar" : "Show Sidebar"}</span>
          </button>
        </header>

        <main className="p-6">
          <h1 className="text-2xl font-bold mb-4">Main content</h1>
          <p className="text-gray-700">Click the button to toggle the sidebar.</p>
        </main>
      </div>
    </div>
  );
}
