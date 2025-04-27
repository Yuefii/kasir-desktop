import { useState } from 'react'

const CabangFormCreate = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    kode_cabang: '',
    nama: '',
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
      <h2 className="text-xl font-semibold text-gray-800">Tambah Cabang</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Kode Cabang</label>
        <input
          type="text"
          name="kode_cabang"
          value={formData.kode_cabang}
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
        <textarea
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
          Tambah Cabang
        </button>
      </div>
    </form>
  )
}

export default CabangFormCreate
