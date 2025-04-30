export interface ProdukInterface {
  id?: number
  kode_produk: string
  nama: string
  deskripsi: string
  brand: string
  unit: string
  id_kategori?: number
  is_aktif: boolean
  isSynced?: boolean
  created_at?: Date
  updated_at?: Date
}
