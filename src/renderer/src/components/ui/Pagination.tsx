const Pagination = ({ currentPage, totalPages, onPageChange, totalData, dataPerPage }) => {
  const start = (currentPage - 1) * dataPerPage + 1
  const end = Math.min(currentPage * dataPerPage, totalData)

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-500">
        Menampilkan {start}-{end} dari {totalData} data
      </div>

      <nav className="inline-flex rounded-md shadow">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-l-md border ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          &laquo; Prev
        </button>

        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => onPageChange(index + 1)}
            className={`px-3 py-1 border-t border-b ${
              currentPage === index + 1
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-gray-50'
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-r-md border ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Next &raquo;
        </button>
      </nav>
    </div>
  )
}

export default Pagination
