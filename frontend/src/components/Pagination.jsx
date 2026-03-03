const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];

  const generatePageNumbers = () => {
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      if (currentPage <= 4) {
        pageNumbers.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pageNumbers.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pageNumbers.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
  };

  generatePageNumbers();

  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 py-1 text-gray-400 disabled:opacity-50"
      >
        &lt;
      </button>

      {pageNumbers.map((num, index) =>
        num === "..." ? (
          <span key={index} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={index}
            onClick={() => onPageChange(num)}
            className={`w-8 h-8 flex items-center justify-center rounded-full
              ${
                num === currentPage
                  ? "bg-teal-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            {num}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 py-1 text-gray-400 disabled:opacity-50"
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
