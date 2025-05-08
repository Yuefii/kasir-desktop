export interface ItemPembelianInterface {
  id_produk: number
  jumlah: number
  harga: number
  is_synced?: boolean
  created_at?: Date
}

export interface PembelianInterface {
  id?: number
  tanggal_pembelian: Date
  total_pembelian?: number
  status?: 'selesai' | 'draft' | string
  isSynced?: boolean
  id_supplier: number
  id_cabang: number
  created_at?: Date
  updated_at?: Date
  items: ItemPembelianInterface[]
}
