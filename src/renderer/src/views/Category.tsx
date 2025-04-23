import CategoryForm from '@renderer/components/CategoryForm'
import CategoryList from '@renderer/components/CategoryList'
import Modal from '@renderer/components/Modal'
import { ReactElement, useEffect, useState } from 'react'

const Category = (): ReactElement => {
  interface Category {
    id: number
    name: string
  }

  const [categories, setCategories] = useState<Category[]>([])
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [categoriesPerPage] = useState(7)

  useEffect(() => {
    // Data dummy kategori
    const mockCategories = [
      { id: 1, name: 'Furniture' },
      { id: 2, name: 'Elektronik' },
      { id: 3, name: 'Aksesoris' }
    ]
    setCategories(mockCategories)
  }, [])

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastCategory = currentPage * categoriesPerPage
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage
  const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const handleAddCategory = () => {
    setCurrentCategory(null)
    setIsModalOpen(true)
    setCurrentPage(1)
  }

  const handleEditCategory = (category) => {
    setCurrentCategory(category)
    setIsModalOpen(true)
  }

  const handleDeleteCategory = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      setCategories(categories.filter((category) => category.id !== id))
      if (currentCategories.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
    }
  }

  const handleSubmit = (categoryData) => {
    if (currentCategory) {
      // Update kategori
      setCategories(
        categories.map((p) => (p.id === currentCategory.id ? { ...p, ...categoryData } : p))
      )
    } else {
      // Tambah kategori baru
      const newCategory = {
        ...categoryData,
        id: Math.max(...categories.map((p) => p.id), 0) + 1
      }
      setCategories([...categories, newCategory])
      const totalPages = Math.ceil((filteredCategories.length + 1) / categoriesPerPage)
      setCurrentPage(totalPages)
    }
    setIsModalOpen(false)
  }
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold text-black mb-6">Data Kategori</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Cari kategori..."
            className="pl-10 pr-4 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-black"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>

        <button
          onClick={handleAddCategory}
          className="bg-black hover:opacity-80 text-white px-4 py-2 rounded flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          Tambah Kategori
        </button>
      </div>

      <CategoryList
        categories={currentCategories}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
      />

      {/* Pagination Component */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 mt-2 text-center">
          Menampilkan {indexOfFirstCategory + 1}-
          {Math.min(indexOfLastCategory, filteredCategories.length)} dari{' '}
          {filteredCategories.length} produk
        </div>

        <div className="flex justify-center mt-6">
          <nav className="inline-flex rounded-md shadow">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-l-md border ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              &laquo; Prev
            </button>

            {Array.from({ length: Math.ceil(filteredCategories.length / categoriesPerPage) }).map(
              (_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`px-3 py-1 border-t border-b ${currentPage === index + 1 ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'}`}
                >
                  {index + 1}
                </button>
              )
            )}

            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, Math.ceil(filteredCategories.length / categoriesPerPage))
                )
              }
              disabled={currentPage === Math.ceil(filteredCategories.length / categoriesPerPage)}
              className={`px-3 py-1 rounded-r-md border ${currentPage === Math.ceil(filteredCategories.length / categoriesPerPage) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              Next &raquo;
            </button>
          </nav>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CategoryForm
          category={currentCategory}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  )
}

export default Category
