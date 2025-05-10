import { BASE_URL } from '@renderer/utils/env'
import { useState, useEffect } from 'react'

import axios from 'axios'
import * as Type from '@renderer/types/pembelian_type'
import Pagination from '@renderer/components/ui/Pagination'
import PembelianList from '@renderer/components/PembelianList'
import PembelianFormCreate from '@renderer/components/PembelianFormCreate'

const Pembelian = () => {
  const [pembelian, setPembelian] = useState<Type.Pembelian[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [paginationInfo, setPaginationInfo] = useState({
    total_data: 0,
    data_per_halaman: 0,
    halaman_sekarang: 1
  })
  const [produks, setProduks] = useState<Type.Produk[]>([])
  const [suppliers, setSuppliers] = useState<Type.Supplier[]>([])
  const [cabangs, setCabangs] = useState<Type.Cabang[]>([])
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState<Type.FormData>({
    tanggal_pembelian: '',
    id_supplier: '',
    id_cabang: '',
    items: [{ id_produk: '', jumlah: '', harga: '' }]
  })

  const fetchPembelian = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/pembelian?limit=5&halaman=${currentPage}`)
      const data = await res.data
      setPembelian(data.data)
      setTotalPages(data.pagination.total_halaman)
      setPaginationInfo(data.pagination)
    } catch (error) {
      console.error('Gagal memuat data:', error)
    }
  }

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/supplier?pagination=false`)
      setSuppliers(res.data.data)
    } catch (error) {
      console.error('Gagal memuat supplier:', error)
    }
  }

  const fetchCabangs = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/cabang?pagination=false`)
      setCabangs(res.data.data)
    } catch (error) {
      console.error('Gagal memuat cabang:', error)
    }
  }

  const fetchProduks = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/produk?pagination=false`)
      setProduks(res.data.data)
    } catch (error) {
      console.error('Gagal memuat produk:', error)
    }
  }

  useEffect(() => {
    fetchPembelian()
    fetchSuppliers()
    fetchCabangs()
    fetchProduks()
  }, [currentPage])

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string } },
    index: number | null = null,
    field: keyof Type.PembelianItem | null = null
  ) => {
    const { name, value } = e.target
    if (index !== null && field) {
      const updatedItems = [...formData.items]
      updatedItems[index][field] = value
      setFormData({ ...formData, items: updatedItems })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        tanggal_pembelian: new Date(formData.tanggal_pembelian).toISOString(),
        id_supplier: parseInt(formData.id_supplier),
        id_cabang: parseInt(formData.id_cabang),
        items: formData.items.map((item) => ({
          id_produk: String(item.id_produk),
          jumlah: parseInt(item.jumlah),
          harga: parseInt(item.harga)
        }))
      }
      await axios.post(`${BASE_URL}/pembelian`, payload)
      setShowModal(false)
      setFormData({
        tanggal_pembelian: '',
        id_supplier: '',
        id_cabang: '',
        items: [{ id_produk: '', jumlah: '', harga: '' }]
      })
      fetchPembelian()
    } catch (error) {
      console.error('Gagal mengirim data:', error)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold text-black mb-6">Data Pembelian</h1>
      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="mb-4 px-4 py-2 bg-black text-white rounded hover:bg-opacity-75"
        >
          + Tambah Pembelian
        </button>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <PembelianFormCreate
            suppliers={suppliers}
            cabangs={cabangs}
            produks={produks}
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
            formData={formData}
            setFormData={setFormData}
            setShowModal={setShowModal}
          />
        </div>
      )}
      <PembelianList pembelian={pembelian} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalData={paginationInfo.total_data}
        dataPerPage={paginationInfo.data_per_halaman}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  )
}

export default Pembelian
