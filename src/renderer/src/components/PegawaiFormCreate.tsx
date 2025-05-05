import { useState } from 'react'
import FormInput from './ui/FormInput'
import FormOption from './ui/FormOption'
import FormAction from './ui/FormAction'

const PegawaiFormCreate = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    no_telp: '',
    jenis_kelamin: '',
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

  const jenisKelaminOptions = [
    { label: 'Laki-laki', value: 'Laki-Laki' },
    { label: 'Perempuan', value: 'Perempuan' }
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Tambah Pegawai</h2>

      <FormInput label="Nama" name="nama" value={formData.nama} onChange={handleChange} required />
      <FormInput
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        type="email"
        required
      />
      <FormInput
        label="Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        type="password"
        required
      />
      <FormInput
        label="No Telepon"
        name="no_telp"
        value={formData.no_telp}
        onChange={handleChange}
      />
      <FormOption
        label="Jenis Kelamin"
        name="jenis_kelamin"
        value={formData.jenis_kelamin}
        onChange={handleChange}
        options={jenisKelaminOptions}
      />
      <FormInput label="Alamat" name="alamat" value={formData.alamat} onChange={handleChange} />
      <FormAction label="Tambah Pegawai" onCancel={onCancel} />
    </form>
  )
}

export default PegawaiFormCreate
