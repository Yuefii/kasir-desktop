export interface InventoriInterface {
  id?: number
  jumlah_stok: number
  stok_minimal: number
  id_produk?: number
  id_cabang?: number
  is_aktif: boolean
  isSynced?: boolean
  created_at?: Date
  updated_at?: Date
}
