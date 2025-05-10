export interface Cabang {
  id: string | number
  nama: string
}

export interface Produk {
  id: string | number
  nama: string
}

export interface HargaProduk {
  id: string | number
  produk: Produk
  harga: number
  cabang: Cabang
  mulai_berlaku?: string
  created_at?: string
}
