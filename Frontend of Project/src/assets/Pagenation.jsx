// src/components/Pagination.jsx
import React from 'react';

function Pagination({ currentPage, totalPages, onPageChange }) {
  
  // Create an array of page numbers, e.g., [1, 2, 3, 4, 5]
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Don't show the pagination box if there's only 1 page
  if (totalPages <= 1) {
    return null; 
  }

  // --- Handlers ---
  const handlePrevious = () => {
    // Only go back if not on the first page
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    // Only go forward if not on the last page
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    // This is the "box"
    <div className="flex justify-center items-center space-x-2 my-8">
      
      {/* Previous Button */}
      <button 
        onClick={handlePrevious}
        disabled={currentPage === 1} // Disable if on page 1
        className="px-4 py-2 bg-white text-gray-800 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((number) => (
        <button 
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-4 py-2 rounded-md ${
            currentPage === number 
              ? 'bg-red-600 text-white' // Active page style
              : 'bg-white text-gray-800 shadow-sm' // Inactive page style
          }`}
        >
          {number}
        </button>
      ))}

      {/* Next Button */}
      <button 
        onClick={handleNext}
        disabled={currentPage === totalPages} // Disable if on last page
        className="px-4 py-2 bg-white text-gray-800 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;