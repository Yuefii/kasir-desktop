export interface Cabang {
  id: string | number
  nama: string
}

export interface Produk {
  id: string | number
  nama: string
}

export interface Inventori {
  id: string | number
  jumlah_stok: number
  stok_minimal: number
  cabang: Cabang
  produk: Produk
  created_at?: string
  updated_at?: string
}

export interface InventoriFormValues {
  stok_minimal: number
}
