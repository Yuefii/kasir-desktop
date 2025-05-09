import axios from 'axios'
import React from 'react'
import * as env from '@renderer/utils/env'
import * as Type from '@renderer/types/produk_type'
import FormInput from '@renderer/components/ui/FormInput'
import FormAction from '@renderer/components/ui/FormAction'
import FormOption from '@renderer/components/ui/FormOption'
import FormTextarea from '@renderer/components/ui/FormTextArea'

interface Props {
  onSubmit?: (formData: Type.FormData) => void
  onCancel?: () => void
}

const ProdukFormCreate: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = React.useState<Type.FormData>({
    kode_produk: '',
    nama: '',
    deskripsi: '',
    brand: '',
    unit: '',
    id_kategori: ''
  })

  const [kategoriList, setKategoriList] = React.useState<Type.Kategori[]>([])
  React.useEffect(() => {
    const fetchKategori = async () => {
      try {
        const res = await axios.get(`${env.BASE_URL}/kategori?pagination=false`)
        setKategoriList(res.data.data)
      } catch (error) {
        console.error('Gagal mengambil data kategori:', error)
      }
    }

    fetchKategori()
  }, [])

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (onSubmit) onSubmit(formData)
  }

  const kategoriOptions = kategoriList.map((kategori) => ({
    value: String(kategori.id),
    label: kategori.nama
  }))

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Tambah Produk</h2>
      <FormInput
        label="Kode Produk"
        name="kode_produk"
        value={formData.kode_produk}
        onChange={handleChange}
        type="text"
        required
      />
      <FormInput
        label="Nama Produk"
        name="nama"
        value={formData.nama}
        onChange={handleChange}
        type="text"
        required
      />
      <FormOption
        label="Kategori"
        label_options="Pilih Kategori"
        name="id_kategori"
        value={String(formData.id_kategori)}
        onChange={handleChange}
        options={kategoriOptions}
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
      <FormAction label="Tambah Produk" onCancel={onCancel} />
    </form>
  )
}

export default ProdukFormCreate
