import Modal from '@renderer/components/Modal'
import ProductForm from '@renderer/components/ProductForm'
import ProductList from '@renderer/components/ProductList'
import { ReactElement, useEffect, useState } from 'react'

const Product = (): ReactElement => {
  interface Product {
    id: number
    name: string
    category: string
    price: number
    stock: number
  }

  const [products, setProducts] = useState<Product[]>([])
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(7)
  const [sortConfig, setSortConfig] = useState<{
    key: 'stock' | 'category' | 'price' | null
    direction: 'ascending' | 'descending'
  }>({ key: null, direction: 'ascending' })

  useEffect(() => {
    // Data dummy produk
    const mockProducts = [
      { id: 1, name: 'Laptop', category: 'Elektronik', price: 12000000, stock: 15 },
      { id: 2, name: 'Smartphone', category: 'Elektronik', price: 8000000, stock: 30 },
      { id: 3, name: 'Meja Kantor', category: 'Furniture', price: 1500000, stock: 10 },
      { id: 4, name: 'Kursi Ergonomis', category: 'Furniture', price: 2500000, stock: 8 },
      { id: 5, name: 'Monitor 24"', category: 'Elektronik', price: 3500000, stock: 12 },
      { id: 6, name: 'Keyboard Mechanical', category: 'Aksesoris', price: 1200000, stock: 20 },
      { id: 7, name: 'Mouse Wireless', category: 'Aksesoris', price: 500000, stock: 25 },
      { id: 8, name: 'Headphone Bluetooth', category: 'Elektronik', price: 1800000, stock: 15 },
      { id: 9, name: 'Printer Laser', category: 'Elektronik', price: 4500000, stock: 5 },
      { id: 10, name: 'Scanner Dokumen', category: 'Elektronik', price: 3200000, stock: 7 },
      { id: 11, name: 'Proyektor Mini', category: 'Elektronik', price: 2800000, stock: 9 },
      { id: 12, name: 'Webcam HD', category: 'Aksesoris', price: 800000, stock: 18 }
    ]
    setProducts(mockProducts)
  }, [])

  const requestSort = (key: 'stock' | 'category' | 'price') => {
    let direction: 'ascending' | 'descending' = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
    setCurrentPage(1)
  }

  const filteredProducts = [...products]
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortConfig.key) {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
      }
      return 0
    })

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const handleAddProduct = () => {
    setCurrentProduct(null)
    setIsModalOpen(true)
    setCurrentPage(1)
  }

  const handleEditProduct = (product) => {
    setCurrentProduct(product)
    setIsModalOpen(true)
  }

  const handleDeleteProduct = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      setProducts(products.filter((product) => product.id !== id))
      if (currentProducts.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
    }
  }

  const handleSubmit = (productData) => {
    if (currentProduct) {
      // Update produk
      setProducts(products.map((p) => (p.id === currentProduct.id ? { ...p, ...productData } : p)))
    } else {
      // Tambah produk baru
      const newProduct = {
        ...productData,
        id: Math.max(...products.map((p) => p.id), 0) + 1
      }
      setProducts([...products, newProduct])
      const totalPages = Math.ceil((filteredProducts.length + 1) / productsPerPage)
      setCurrentPage(totalPages)
    }
    setIsModalOpen(false)
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold text-black mb-6">Data Produk</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Cari produk..."
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
          onClick={handleAddProduct}
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
          Tambah Produk
        </button>
      </div>

      {/* Sorting Controls */}
      <div className="mb-4 flex items-center space-x-4">
        <span className="text-sm font-medium text-black">Urutkan berdasarkan:</span>
        <button
          onClick={() => requestSort('price')}
          className={`text-sm px-3 py-1 rounded ${sortConfig.key === 'price' ? 'bg-black text-white' : 'bg-gray-100 text-black hover:bg-gray-200'}`}
        >
          Harga {sortConfig.key === 'price' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
        </button>
        <button
          onClick={() => requestSort('stock')}
          className={`text-sm px-3 py-1 rounded ${sortConfig.key === 'stock' ? 'bg-black text-white' : 'bg-gray-100 text-black hover:bg-gray-200'}`}
        >
          Stok {sortConfig.key === 'stock' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
        </button>
        <button
          onClick={() => requestSort('category')}
          className={`text-sm px-3 py-1 rounded ${sortConfig.key === 'category' ? 'bg-black text-white' : 'bg-gray-100 text-black hover:bg-gray-200'}`}
        >
          Kategori{' '}
          {sortConfig.key === 'category' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
        </button>
      </div>

      <ProductList
        products={currentProducts}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      {/* Pagination Component */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 mt-2 text-center">
          Menampilkan {indexOfFirstProduct + 1}-
          {Math.min(indexOfLastProduct, filteredProducts.length)} dari {filteredProducts.length}{' '}
          produk
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

            {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }).map(
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
                  Math.min(prev + 1, Math.ceil(filteredProducts.length / productsPerPage))
                )
              }
              disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}
              className={`px-3 py-1 rounded-r-md border ${currentPage === Math.ceil(filteredProducts.length / productsPerPage) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              Next &raquo;
            </button>
          </nav>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ProductForm
          product={currentProduct}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  )
}

export default Product
