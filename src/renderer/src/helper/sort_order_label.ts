export function getSortOrderLabel(sortBy: string, sortOrder: string): string {
  const isAsc = sortOrder === 'asc'
  switch (sortBy) {
    case 'harga':
      return isAsc ? 'Termurah → Termahal' : 'Termahal → Termurah'
    case 'mulai_berlaku':
    case 'created_at':
    case 'updated_at':
      return isAsc ? 'Tanggal Terlama → Terbaru' : 'Tanggal Terbaru → Terlama'
    default:
      return isAsc ? 'Urutan Naik' : 'Urutan Turun'
  }
}
