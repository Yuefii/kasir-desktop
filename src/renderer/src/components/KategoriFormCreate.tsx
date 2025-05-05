import { useState } from 'react'

import FormInput from './ui/FormInput'
import FormAction from './ui/FormAction'

const KategoriFormCreate = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nama: ''
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
      <h2 className="text-xl font-semibold text-gray-800">Tambah Kategori</h2>
      <FormInput
        label="Nama Kategori"
        name="nama"
        value={formData.nama}
        onChange={handleChange}
        type="text"
        required
      />
      <FormAction label="Tambah Kategori" onCancel={onCancel} />
    </form>
  )
}

export default KategoriFormCreate
