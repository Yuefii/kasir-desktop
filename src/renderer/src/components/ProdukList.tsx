import { format } from 'date-fns'

import TableRow from './ui/TableRow'
import TableHead from './ui/TableHead'

const ProdukList = ({ produk, onEdit, onDelete }) => {
  const columns = [
    { label: 'No', key: 'index' },
    { label: 'Kode Produk', key: 'kode_produk' },
    { label: 'Nama Produk', key: 'nama' },
    { label: 'Kategori', key: 'kategori.nama' },
    { label: 'Deskripsi', key: 'deskripsi' },
    { label: 'Brand', key: 'brand' },
    { label: 'Unit', key: 'unit' },
    {
      label: 'Dibuat Tanggal',
      render: (item) => format(new Date(item.created_at), 'dd MMM yyyy, HH:mm')
    },
    {
      label: 'Diubah Tanggal',
      render: (item) => format(new Date(item.created_at), 'dd MMM yyyy, HH:mm')
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto py-5 w-full">
        <table className="min-w-full divide-y divide-gray-200">
          <TableHead columns={columns} withAction />
          <tbody className="bg-white divide-y divide-gray-200">
            {produk.length > 0 ? (
              produk.map((item, index) => (
                <TableRow
                  key={item.id}
                  item={item}
                  index={index}
                  columns={columns}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
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
    </div>
  )
}

export default ProdukList
