export function getSortOrderLabel(sortBy: string, sortOrder: string): string {
  const isAsc = sortOrder === 'asc'
  switch (sortBy) {
    case 'harga':
      return isAsc ? 'Termurah → Termahal' : 'Termahal → Termurah'
    case 'cabang':
      return isAsc ? 'A → Z (Nama Cabang)' : 'Z → A (Nama Cabang)'
    case 'produk':
      return isAsc ? 'A → Z (Nama Produk)' : 'Z → A (Nama Produk)'
    case 'mulai_berlaku':
    case 'created_at':
    case 'updated_at':
      return isAsc ? 'Tanggal Terlama → Terbaru' : 'Tanggal Terbaru → Terlama'
    default:
      return isAsc ? 'Urutan Naik' : 'Urutan Turun'
  }
}
