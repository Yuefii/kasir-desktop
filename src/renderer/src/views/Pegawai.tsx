import { useEffect, useState } from 'react'
import { BASE_URL } from '@renderer/utils/env'

import axios from 'axios'
import Modal from '../components/Modal'
import PegawaiList from '@renderer/components/PegawaiList'
import PegawaiFormUpdate from '@renderer/components/PegawaiFromUpdate'
import PegawaiFormCreate from '@renderer/components/PegawaiFormCreate'
import Pagination from '@renderer/components/ui/Pagination'
import AddButton from '@renderer/components/ui/AddButton'

interface PegawaiType {
  id: number
  nama: string
}

const Pegawai = () => {
  const [pegawai, setPegawai] = useState<PegawaiType[]>([])
  const [currentPegawai, setCurrentPegawai] = useState<PegawaiType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [paginationInfo, setPaginationInfo] = useState({
    total_data: 0,
    data_per_halaman: 0,
    halaman_sekarang: 1
  })

  const fetchPegawai = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/pegawai?limit=5&halaman=${currentPage}`)
      const data = await res.data
      setPegawai(data.data)
      setTotalPages(data.pagination.total_halaman)
      setPaginationInfo(data.pagination)
    } catch (error) {
      console.error('Gagal memuat data pegawai:', error)
    }
  }

  useEffect(() => {
    fetchPegawai()
  }, [currentPage])

  const handleAdd = () => {
    setCurrentPegawai(null)
    setIsModalOpen(true)
  }

  const handleEdit = (pegawai: PegawaiType) => {
    setCurrentPegawai(pegawai)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: PegawaiType) => {
    const confirmDelete = window.confirm('Apakah Kamu yakin menghapus pegawai ini?')

    if (!confirmDelete) return

    try {
      await axios.delete(`${BASE_URL}/pegawai/${id}`)
      fetchPegawai()
    } catch (error) {
      console.error('gagal menghapus pegawai:', error)
      alert('Terjadi kesalahan saat menghapus pegawai.')
    }
  }

  const handleSubmit = async (newData: PegawaiType) => {
    if (currentPegawai) {
      // Update pegawai
      const { nama } = newData
      await axios.patch(`${BASE_URL}/pegawai/${currentPegawai.id}`, { nama })
    } else {
      // Tambah pegawai
      await axios.post(`${BASE_URL}/pegawai`, newData)
    }
    setIsModalOpen(false)
    fetchPegawai()
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold text-black mb-6">Data Pegawai</h1>
      <AddButton onClick={handleAdd} label="Tambah Pegawai" />
      <PegawaiList pegawai={pegawai} onEdit={handleEdit} onDelete={handleDelete} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalData={paginationInfo.total_data}
        dataPerPage={paginationInfo.data_per_halaman}
        onPageChange={(page) => setCurrentPage(page)}
      />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {currentPegawai ? (
          <PegawaiFormUpdate
            pegawai={currentPegawai}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        ) : (
          <PegawaiFormCreate onSubmit={handleSubmit} onCancel={() => setIsModalOpen(false)} />
        )}
      </Modal>
    </div>
  )
}

export default Pegawai
