import { BASE_URL } from '@renderer/utils/env'
import { useEffect, useState } from 'react'

import axios from 'axios'
import Modal from '@renderer/components/Modal'
import AddButton from '@renderer/components/ui/AddButton'
import Pagination from '@renderer/components/ui/Pagination'
import KategoriList from '@renderer/components/KategoriList'
import KategoriFormUpdate from '@renderer/components/KategoriFormUpdate'
import KategoriFormCreate from '@renderer/components/KategoriFormCreate'

interface KategoriType {
  id: number
  nama: string
}

const Kategori = () => {
  const [kategori, setKategori] = useState<KategoriType[]>([])
  const [currentKategori, setCurrentKategori] = useState<KategoriType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [paginationInfo, setPaginationInfo] = useState({
    total_data: 0,
    data_per_halaman: 0,
    halaman_sekarang: 1
  })

  const fetchKategori = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/kategori?limit=5&halaman=${currentPage}`)
      const data = await res.data
      setKategori(data.data)
      setTotalPages(data.pagination.total_halaman)
      setPaginationInfo(data.pagination)
    } catch (error) {
      console.error('Gagal memuat data kategori:', error)
    }
  }

  useEffect(() => {
    fetchKategori()
  }, [currentPage])

  const handleAdd = () => {
    setCurrentKategori(null)
    setIsModalOpen(true)
  }

  const handleEdit = (kategori: KategoriType) => {
    setCurrentKategori(kategori)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: KategoriType) => {
    const confirmDelete = window.confirm('Apakah Kamu yakin menghapus kategori ini?')

    if (!confirmDelete) return

    try {
      await axios.delete(`${BASE_URL}/kategori/${id}`)
      fetchKategori()
    } catch (error) {
      console.error('gagal menghapus kategori:', error)
      alert('Terjadi kesalahan saat menghapus kategori.')
    }
  }

  const handleSubmit = async (newData: KategoriType) => {
    if (currentKategori) {
      // Update kategori
      const { nama } = newData
      await axios.patch(`${BASE_URL}/kategori/${currentKategori.id}`, { nama })
    } else {
      // Tambah kategori
      await axios.post(`${BASE_URL}/kategori`, newData)
    }
    setIsModalOpen(false)
    fetchKategori()
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold text-black mb-6">Data Kategori</h1>
      <AddButton onClick={handleAdd} label="Tambah Kategori" />
      <KategoriList kategori={kategori} onEdit={handleEdit} onDelete={handleDelete} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalData={paginationInfo.total_data}
        dataPerPage={paginationInfo.data_per_halaman}
        onPageChange={(page) => setCurrentPage(page)}
      />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {currentKategori ? (
          <KategoriFormUpdate
            kategori={currentKategori}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        ) : (
          <KategoriFormCreate onSubmit={handleSubmit} onCancel={() => setIsModalOpen(false)} />
        )}
      </Modal>
    </div>
  )
}

export default Kategori
