import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  return (
    <div className="flex justify-center items-center space-x-2 my-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
      >
        Précédent
      </button>

      <div className="flex space-x-1">
        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded-md ${
              currentPage === page 
                ? 'bg-primary text-white dark:bg-background dark:text-white' 
                : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
      >
        Suivant
      </button>
    </div>
  );
};

export default Pagination;
