import { BASE_URL } from '@renderer/utils/env'
import axios from 'axios'
import { useEffect, useState } from 'react'

const ProdukFormCreate = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    kode_produk: '',
    nama: '',
    deskripsi: '',
    brand: '',
    unit: '',
    id_kategori: ''
  })

  const [kategoriList, setKategoriList] = useState<{ id: string; nama: string }[]>([])

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/kategori`)
        setKategoriList(res.data.data) // sesuaikan dengan struktur dari API kamu
      } catch (error) {
        console.error('Gagal mengambil data kategori:', error)
      }
    }

    fetchKategori()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Tambah Produk</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Kode Produk</label>
        <input
          type="text"
          name="kode_produk"
          value={formData.kode_produk}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
        <input
          type="text"
          name="nama"
          value={formData.nama}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
        <textarea
          name="deskripsi"
          value={formData.deskripsi}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
        <input
          type="text"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
        <input
          type="text"
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
        <select
          name="id_kategori"
          value={formData.id_kategori}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          required
        >
          <option value="">-- Pilih Kategori --</option>
          {kategoriList.map((kategori) => (
            <option key={kategori.id} value={kategori.id}>
              {kategori.nama}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded text-gray-700 bg-white"
        >
          Batal
        </button>
        <button type="submit" className="px-4 py-2 text-white bg-black rounded">
          Tambah Produk
        </button>
      </div>
    </form>
  )
}

export default ProdukFormCreate
