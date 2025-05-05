import { ChangeEvent, useState, FormEvent, JSX } from 'react'

import FormInput from './ui/FormInput'
import FormAction from './ui/FormAction'

interface Props {
  onSubmit: (data: { nama: string }) => void
  onCancel: () => void
}

const KategoriFormCreate = ({ onSubmit, onCancel }: Props): JSX.Element => {
  const [formData, setFormData] = useState({
    nama: ''
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: FormEvent): void => {
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
