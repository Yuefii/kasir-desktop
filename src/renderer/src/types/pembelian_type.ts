export interface Supplier {
  id: string | number
  nama: string
}

export interface Cabang {
  id: string | number
  nama: string
}

export interface Produk {
  id: number
  nama: string
}

export interface PembelianItem {
  id_produk: string | number
  jumlah: string
  harga: string
}

export interface FormData {
  tanggal_pembelian: string
  id_supplier: string
  id_cabang: string
  items: PembelianItem[]
}

export interface Pembelian {
  id: string | number
  tanggal_pembelian: string
  supplier: Supplier
  cabang: Cabang
  total_pembelian: number
  created_at?: string
}
