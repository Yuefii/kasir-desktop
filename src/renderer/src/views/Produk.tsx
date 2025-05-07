import { BASE_URL } from '@renderer/utils/env'
import { useEffect, useState } from 'react'

import axios from 'axios'
import Modal from '@renderer/components/Modal'
import AddButton from '@renderer/components/ui/AddButton'
import ProdukList from '@renderer/components/ProdukList'
import Pagination from '@renderer/components/ui/Pagination'
import ProdukFormUpdate from '@renderer/components/ProdukFormUpdate'
import ProdukFormCreate from '@renderer/components/ProdukFormCreate'

interface ProdukType {
  id: number
  kode_produk: string
  nama: string
  deskripsi: string
  brand: string
  unit: string
  id_kategori: number
  created_at: Date
  updated_at: Date
}

const Produk = () => {
  const [produk, setProduk] = useState<ProdukType[]>([])
  const [currentProduk, setCurrentProduk] = useState<ProdukType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [paginationInfo, setPaginationInfo] = useState({
    total_data: 0,
    data_per_halaman: 0,
    halaman_sekarang: 1
  })

  const fetchProduk = async () => {
    try {
      const res = await fetch(`${BASE_URL}/produk?limit=5&halaman=${currentPage}`)
      const data = await res.json()
      setProduk(data.data)
      setTotalPages(data.pagination.total_halaman)
      setPaginationInfo(data.pagination)
    } catch (error) {
      console.error('Gagal memuat data produk:', error)
    }
  }

  useEffect(() => {
    fetchProduk()
  }, [currentPage])

  const handleAdd = () => {
    setCurrentProduk(null)
    setIsModalOpen(true)
  }

  const handleEdit = (produk: ProdukType) => {
    setCurrentProduk(produk)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: ProdukType) => {
    const confirmDelete = window.confirm('Apakah Kamu yakin menghapus produk ini?')

    if (!confirmDelete) return

    try {
      await axios.delete(`${BASE_URL}/produk/${id}`)
      fetchProduk()
    } catch (error) {
      console.error('gagal menghapus produk:', error)
      alert('Terjadi kesalahan saat menghapus produk.')
    }
  }

  const handleSubmit = async (newData: ProdukType) => {
    if (currentProduk) {
      // Update produk
      const { nama, deskripsi, brand, unit } = newData
      await axios.patch(`${BASE_URL}/produk/${currentProduk.id}`, { nama, deskripsi, brand, unit })
    } else {
      // Tambah produk
      await axios.post(`${BASE_URL}/produk`, newData)
    }
    setIsModalOpen(false)
    fetchProduk()
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold text-black mb-6">Data Produk</h1>
      <AddButton onClick={handleAdd} label="Tambah Produk" />
      <ProdukList produk={produk} onEdit={handleEdit} onDelete={handleDelete} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalData={paginationInfo.total_data}
        dataPerPage={paginationInfo.data_per_halaman}
        onPageChange={(page) => setCurrentPage(page)}
      />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {currentProduk ? (
          <ProdukFormUpdate
            produk={currentProduk}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        ) : (
          <ProdukFormCreate onSubmit={handleSubmit} onCancel={() => setIsModalOpen(false)} />
        )}
      </Modal>
    </div>
  )
}

export default Produk
