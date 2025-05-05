import { useEffect, useState } from 'react'
import FormAction from './ui/FormAction'
import FormInput from './ui/FormInput'

const KategoriFormUpdate = ({ kategori, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ ...kategori })

  useEffect(() => {
    if (kategori) setFormData(kategori)
  }, [kategori])

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
      <h2 className="text-xl font-semibold text-gray-800">Edit Kategori</h2>
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

export default KategoriFormUpdate
