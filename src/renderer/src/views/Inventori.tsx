import { useEffect, useState } from 'react'
import Modal from '../components/Modal'
import axios from 'axios'
import { BASE_URL } from '@renderer/utils/env'
import InventoriList from '@renderer/components/InventoriList'
import InventoriFormCreate from '@renderer/components/InventoriFormCreate'
import InventoriFormUpdate from '@renderer/components/InventoriFormUpdate'

interface InventoriType {
  id: number
  jumlah_stok: string
  stok_minimal: string
  id_produk: string
  id_cabang: string
  created_at: Date
  updated_at: Date
}

const Inventori = () => {
  const [inventori, setInventori] = useState<InventoriType[]>([])
  const [currentInventori, setCurrentInventori] = useState<InventoriType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [paginationInfo, setPaginationInfo] = useState({
    total_data: 0,
    data_per_halaman: 0,
    halaman_sekarang: 1
  })

  const fetchInventori = async () => {
    try {
      const res = await fetch(`${BASE_URL}/inventori?limit=5&halaman=${currentPage}`)
      const data = await res.json()
      setInventori(data.data)
      setTotalPages(data.pagination.total_halaman)
      setPaginationInfo(data.pagination)
    } catch (error) {
      console.error('Gagal memuat data produk:', error)
    }
  }

  useEffect(() => {
    fetchInventori()
  }, [currentPage])

  const handleAdd = () => {
    setCurrentInventori(null)
    setIsModalOpen(true)
  }

  const handleEdit = (inventori: InventoriType) => {
    setCurrentInventori(inventori)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: InventoriType) => {
    const confirmDelete = window.confirm('Apakah Kamu yakin menghapus inventori ini?')

    if (!confirmDelete) return

    try {
      await axios.delete(`${BASE_URL}/inventori/${id}`)
      fetchInventori()
    } catch (error) {
      console.error('gagal menghapus inventori:', error)
      alert('Terjadi kesalahan saat menghapus inventori.')
    }
  }

  const handleSubmit = async (newData: InventoriType) => {
    if (currentInventori) {
      // Update inventori
      const { stok_minimal } = newData
      await axios.patch(`${BASE_URL}/inventori/${currentInventori.id}`, { stok_minimal })
    } else {
      // Tambah inventori
      await axios.post(`${BASE_URL}/inventori`, newData)
    }
    setIsModalOpen(false)
    fetchInventori()
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold text-black mb-6">Data Inventori</h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={handleAdd}
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
          Tambah Inventori
        </button>
      </div>

      <InventoriList inventori={inventori} onEdit={handleEdit} onDelete={handleDelete} />

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 mt-2 text-center">
          Menampilkan {(paginationInfo.halaman_sekarang - 1) * paginationInfo.data_per_halaman + 1}-
          {Math.min(
            paginationInfo.halaman_sekarang * paginationInfo.data_per_halaman,
            paginationInfo.total_data
          )}{' '}
          dari {paginationInfo.total_data} produk
        </div>

        <div className="flex justify-center mt-6">
          <nav className="inline-flex rounded-md shadow">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                onClick={() => setCurrentPage(index + 1)}
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
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {currentInventori ? (
          <InventoriFormUpdate
            inventori={currentInventori}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        ) : (
          <InventoriFormCreate onSubmit={handleSubmit} onCancel={() => setIsModalOpen(false)} />
        )}
      </Modal>
    </div>
  )
}

export default Inventori
