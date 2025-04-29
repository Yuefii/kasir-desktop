import { BASE_URL } from '@renderer/utils/env'
import axios from 'axios'
import { useEffect, useState } from 'react'

const InventoriFormUpdate = ({ inventori, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ ...inventori })

  interface Cabang {
    id: number
    nama: string
  }
  interface Produk {
    id: number
    nama: string
  }

  const [cabangList, setCabangList] = useState<Cabang[]>([])
  const [produkList, setProdukList] = useState<Produk[]>([])

  useEffect(() => {
    if (inventori) setFormData(inventori)

    const fetchCabang = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/cabang`)
        setCabangList(res.data.data)
      } catch (error) {
        console.error('Gagal memuat data cabang:', error)
      }
    }

    const fetchProduk = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/produk`)
        setProdukList(res.data.data)
      } catch (error) {
        console.error('Gagal memuat data produk:', error)
      }
    }

    fetchProduk()
    fetchCabang()
  }, [inventori])

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
      <h2 className="text-xl font-semibold text-gray-800">Edit Inventori</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Stok Minimal</label>
        <input
          type="text"
          name="stok_minimal"
          value={formData.stok_minimal}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cabang</label>
        <select
          name="id_cabang"
          value={formData.id_cabang}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          required
        >
          <option value="">-- Pilih Cabang --</option>
          {cabangList.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nama}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Produk</label>
        <select
          name="id_produk"
          value={formData.id_produk}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          required
        >
          <option value="">-- Pilih Produk --</option>
          {produkList.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nama}
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
          Tambah Cabang
        </button>
      </div>
    </form>
  )
}

export default InventoriFormUpdate
