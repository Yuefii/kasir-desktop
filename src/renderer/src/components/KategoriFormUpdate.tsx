import { ChangeEvent, FormEvent, JSX, useEffect, useState } from 'react'

import FormInput from './ui/FormInput'
import FormAction from './ui/FormAction'

interface Kategori {
  id?: number
  nama: string
  created_at?: string
}

interface Props {
  kategori: Kategori
  onSubmit: (data: Kategori) => void
  onCancel: () => void
}

const KategoriFormUpdate = ({ kategori, onSubmit, onCancel }: Props): JSX.Element => {
  const [formData, setFormData] = useState({ ...kategori })

  useEffect(() => {
    if (kategori) setFormData(kategori)
  }, [kategori])

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
