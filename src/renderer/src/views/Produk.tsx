import axios from 'axios'
import React from 'react'
import * as env from '@renderer/utils/env'
import * as Type from '@renderer/types/produk_type'
import Modal from '@renderer/components/Modal'
import AddButton from '@renderer/components/ui/AddButton'
import ProdukList from '@renderer/components/ProdukList'
import Pagination from '@renderer/components/ui/Pagination'
import ProdukFormUpdate from '@renderer/components/ProdukFormUpdate'
import ProdukFormCreate from '@renderer/components/ProdukFormCreate'

const Produk = () => {
  const [produk, setProduk] = React.useState<Type.Produk[]>([])
  const [currentProduk, setCurrentProduk] = React.useState<Type.Produk | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [paginationInfo, setPaginationInfo] = React.useState({
    total_data: 0,
    data_per_halaman: 0,
    halaman_sekarang: 1
  })

  const fetchProduk = async () => {
    try {
      const res = await axios.get(`${env.BASE_URL}/produk?limit=5&halaman=${currentPage}`)
      const data = await res.data
      setProduk(data.data)
      setTotalPages(data.pagination.total_halaman)
      setPaginationInfo(data.pagination)
    } catch (error) {
      console.error('Gagal memuat data produk:', error)
    }
  }

  React.useEffect(() => {
    fetchProduk()
  }, [currentPage])

  const handleAdd = () => {
    setCurrentProduk(null)
    setIsModalOpen(true)
  }

  const handleEdit = (produk: Type.Produk) => {
    setCurrentProduk(produk)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string | number) => {
    const confirmDelete = window.confirm('Apakah Kamu yakin menghapus produk ini?')

    if (!confirmDelete) return

    try {
      await axios.delete(`${env.BASE_URL}/produk/${id}`)
      fetchProduk()
    } catch (error) {
      console.error('gagal menghapus produk:', error)
      alert('Terjadi kesalahan saat menghapus produk.')
    }
  }

  const handleSubmit = async (newData: Type.FormData) => {
    if (currentProduk) {
      // Update produk
      const { nama, id_kategori, deskripsi, brand, unit } = newData
      await axios.patch(`${env.BASE_URL}/produk/${currentProduk.id}`, {
        nama,
        id_kategori,
        deskripsi,
        brand,
        unit
      })
    } else {
      // Tambah produk
      await axios.post(`${env.BASE_URL}/produk`, newData)
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
