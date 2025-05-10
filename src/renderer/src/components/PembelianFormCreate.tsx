import * as Type from '@renderer/types/pembelian_type'
import FormInput from './ui/FormInput'
import FormOption from './ui/FormOption'

interface Props {
  suppliers: Type.Supplier[]
  cabangs: Type.Cabang[]
  produks: Type.Produk[]
  handleSubmit: (e: React.FormEvent) => void
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string } },
    index: number | null,
    field: keyof Type.PembelianItem | null
  ) => void
  formData: Type.FormData
  setFormData: React.Dispatch<React.SetStateAction<Type.FormData>>
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}

const PembelianFormCreate: React.FC<Props> = ({
  suppliers,
  cabangs,
  produks,
  handleSubmit,
  handleInputChange,
  formData,
  setFormData,
  setShowModal
}) => {
  const supplierOptions = suppliers.map((supplier) => ({
    value: String(supplier.id),
    label: supplier.nama
  }))

  const cabangOptions = cabangs.map((cabang) => ({
    value: String(cabang.id),
    label: cabang.nama
  }))

  const produkOptions = produks.map((produk) => ({
    value: String(produk.id),
    label: produk.nama
  }))

  return (
    <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold mb-4">Tambah Pembelian</h2>

        <FormInput
          label="Tanggal Pembelian"
          name="tanggal_pembelian"
          value={formData.tanggal_pembelian}
          onChange={(e) => handleInputChange(e, null, null)}
          type="datetime-local"
          required
        />

        <FormOption
          label="Nama Supplier"
          label_options="Pilih Supplier"
          name="id_supplier"
          value={String(formData.id_supplier)}
          onChange={(e) => handleInputChange(e, null, null)}
          options={supplierOptions}
        />

        <FormOption
          label="Untuk Cabang"
          label_options="Pilih Cabang"
          name="id_cabang"
          value={String(formData.id_cabang)}
          onChange={(e) => handleInputChange(e, null, null)}
          options={cabangOptions}
        />

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Item</h3>
          {formData.items.map((item, index) => (
            <div key={index}>
              <FormOption
                label="Nama Produk"
                label_options="Pilih Produk"
                name="id_produk"
                value={String(item.id_produk)}
                onChange={(e) => handleInputChange(e, index, 'id_produk')}
                options={produkOptions}
              />

              <div className="grid grid-cols-2 gap-2 mt-2 mb-2 items-center">
                <FormInput
                  label="Jumlah Produk"
                  name="jumlah"
                  value={item.jumlah}
                  onChange={(e) => handleInputChange(e, index, 'jumlah')}
                  type="number"
                  required
                />

                <FormInput
                  label="Harga Produk"
                  name="harga"
                  value={item.harga}
                  onChange={(e) => handleInputChange(e, index, 'harga')}
                  type="number"
                  required
                />

                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const updatedItems = formData.items.filter((_, i) => i !== index)
                      setFormData({ ...formData, items: updatedItems })
                    }}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Hapus
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => {
              const newItem: Type.PembelianItem = {
                id_produk: '',
                jumlah: '',
                harga: ''
              }

              setFormData({
                ...formData,
                items: [...formData.items, newItem]
              })
            }}
            className="mt-2 px-3 py-1 bg-black text-white rounded hover:bg-opacity-75"
          >
            + Tambah Produk
          </button>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded hover:bg-opacity-75"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  )
}

export default PembelianFormCreate
