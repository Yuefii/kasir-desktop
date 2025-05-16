import * as date from 'date-fns'
import * as Type from '@renderer/types/harga_produk_type'
import TableRow from './ui/TableRow'
import TableHead from './ui/TableHead'
import { formatRupiah } from '@shared/helper/format_rupiah'

interface Column<T> {
  label: string
  key?: string
  render?: (item: T) => React.ReactNode
}

interface Props {
  hargaProduk: Type.HargaProduk[]
}

const HargaProdukList: React.FC<Props> = ({ hargaProduk }) => {
  const columns: Column<Type.HargaProduk>[] = [
    { label: 'No', key: 'index' },
    {
      label: 'Nama Produk',
      render: (item) => item.produk.nama
    },
    {
      label: 'Harga Produk',
      render: (item) => formatRupiah(item.harga)
    },
    {
      label: 'Nama Cabang',
      render: (item) => item.cabang.nama
    },
    {
      label: 'Mulai Berlaku',
      render: (item) =>
        item.mulai_berlaku ? date.format(new Date(item.mulai_berlaku), 'dd MMM yyyy, HH:mm') : '-'
    },
    {
      label: 'Dibuat Tanggal',
      render: (item) =>
        item.created_at ? date.format(new Date(item.created_at), 'dd MMM yyyy, HH:mm') : '-'
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <TableHead columns={columns} />
        <tbody className="bg-white divide-y divide-gray-200">
          {hargaProduk.length > 0 ? (
            hargaProduk.map((item, index) => (
              <TableRow key={item.id} item={item} index={index} columns={columns} />
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                Tidak ada data ditemukan
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default HargaProdukList
