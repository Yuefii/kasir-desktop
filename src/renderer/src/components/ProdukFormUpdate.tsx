import { BASE_URL } from '@renderer/utils/env'
import { useEffect, useState } from 'react'

import axios from 'axios'
import FormInput from './ui/FormInput'
import FormAction from './ui/FormAction'
import FormOption from './ui/FormOption'
import FormTextarea from './ui/FormTextArea'

const ProdukFormUpdate = ({ produk, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ ...produk })
  interface Kategori {
    id: number
    nama: string
  }

  const [kategoriList, setKategoriList] = useState<Kategori[]>([])

  useEffect(() => {
    if (produk) setFormData(produk)

    const fetchKategori = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/kategori`)
        setKategoriList(res.data.data) // sesuaikan dengan struktur API
      } catch (error) {
        console.error('Gagal memuat data kategori:', error)
      }
    }

    fetchKategori()
  }, [produk])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const kategoriOptions = kategoriList.map((kategori) => ({
    value: kategori.id,
    label: kategori.nama
  }))

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Edit Produk</h2>
      <FormInput
        label="Nama Produk"
        name="nama"
        value={formData.nama}
        onChange={handleChange}
        type="text"
        required
      />
      <FormTextarea
        label="Keterangan"
        name="deskripsi"
        value={formData.deskripsi}
        onChange={handleChange}
        required
      />
      <FormInput
        label="Brand Produk"
        name="brand"
        value={formData.brand}
        onChange={handleChange}
        type="text"
        required
      />
      <FormInput
        label="Unit Produk"
        name="unit"
        value={formData.unit}
        onChange={handleChange}
        type="text"
        required
      />
      <FormOption
        label="Kategori"
        label_options="Pilih Kategori"
        name="id_kategori"
        value={formData.id_kategori}
        onChange={handleChange}
        options={kategoriOptions}
      />
      <FormAction label="Tambah Produk" onCancel={onCancel} />
    </form>
  )
}

export default ProdukFormUpdate
