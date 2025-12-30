// src/components/Pagination.jsx
import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const isMobile = window.innerWidth < 640; // Adjust breakpoint if needed
  const maxVisible = isMobile ? 3 : 5; // Fewer numbers on mobile

  const getPageNumbers = () => {
    const pages = [];
    
    if (totalPages <= maxVisible + 2) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    // Ellipsis before current range
    if (currentPage > maxVisible - 1) {
      pages.push('...');
    }

    // Range around current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Ellipsis after current range
    if (currentPage < totalPages - (maxVisible - 2)) {
      pages.push('...');
    }

    // Always show last page
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination-container">
      {/* Previous Button */}
      <button
        className="pagination-btn prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        ← Prev
      </button>

      {/* Page Numbers */}
      <div className="pagination-numbers">
        {pageNumbers.map((page, index) => (
          <button
            key={index}
            className={`pagination-btn number ${
              page === currentPage ? 'active' : ''
            } ${page === '...' ? 'ellipsis' : ''}`}
            onClick={() => page !== '...' && onPageChange(page)}
            disabled={page === '...'}
            aria-current={page === currentPage ? 'page' : undefined}
            aria-label={page === '...' ? 'More pages' : `Go to page ${page}`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        className="pagination-btn next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;