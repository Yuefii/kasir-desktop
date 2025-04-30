import { useState } from 'react'

const SupplierFormCreate = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nama: '',
    no_telp: '',
    alamat: ''
  })

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
      <h2 className="text-xl font-semibold text-gray-800">Tambah Supplier</h2>

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
        <label className="block text-sm font-medium text-gray-700 mb-1">No Telp</label>
        <input
          type="text"
          name="no_telp"
          value={formData.no_telp}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
        <input
          type="text"
          name="alamat"
          value={formData.alamat}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          required
        />
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
          Tambah Kategori
        </button>
      </div>
    </form>
  )
}

export default SupplierFormCreate
