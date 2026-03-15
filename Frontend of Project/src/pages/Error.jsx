import React from 'react'

function Error({ statusCode = 500, message = "An unexpected error occurred.",error }) {
/**
 * A reusable component to display a standardized error page.
 * @param {object} props
 * @param {number} props.statusCode - The HTTP status code (e.g., 404, 500).
 * @param {string} props.message - The error message to display.
 */
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4 font-inter">
      <div className="w-full max-w-md p-8 text-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
        
        {/* Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-16 w-16 text-red-500 mx-auto mb-6"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>

        {/* Status Code */}
        <h1 className="text-8xl font-bold text-red-600 dark:text-red-500 mb-2">
          {statusCode}
        </h1>

        {/* Message */}
        <p className="text-2xl font-medium text-gray-700 dark:text-gray-200 mb-6">
          {message}
        </p>
        <p className="text-2xl font-medium text-gray-700 dark:text-gray-200 mb-6">
          {error}
        </p>
        
        {/* "Go Home" Link */}
        <a
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 ease-in-out"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
};

/**
 * Main App component to demonstrate the ErrorDisplay.
 * In a real app, you would conditionally render this
 * component when you catch an error.
 */
// export default function App() {
//   // Example: Simulate a "Not Found" error
//   const error = {
//     code: 404,
//     msg: "Page Not Found"
//   };

//   // Example: Simulate a "Server Error"
//   // const error = {
//   //   code: 500,
//   //   msg: "Internal Server Error"
//   // };

//   return (
//     <ErrorDisplay 
//       statusCode={error.code} 
//       message={error.msg} 
//     />
//   );
// }

export default Error