export interface Produk {
  id: string | number
  kode_produk: string
  nama: string
  deskripsi: string
  brand: string
  unit: string
  id_kategori: string | number
  kategori?: { nama: string }
  created_at?: string
  updated_at?: string
}

export interface FormData {
  kode_produk: string
  nama: string
  deskripsi: string
  brand: string
  unit: string
  id_kategori: string | number
}

export interface Kategori {
  id: string | number
  nama: string
}
