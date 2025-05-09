import React from 'react'
import * as date from 'date-fns'
import * as Type from '@renderer/types/produk_type'
import TableRow from '@renderer/components/ui/TableRow'
import TableHead from '@renderer/components/ui/TableHead'

interface Column<T> {
  label: string
  key?: string
  render?: (item: T) => React.ReactNode
}

interface Props {
  produk: Type.Produk[]
  onEdit: (item: Type.Produk) => void
  onDelete: (id: string | number) => void
}

const ProdukList: React.FC<Props> = ({ produk, onEdit, onDelete }) => {
  const columns: Column<Type.Produk>[] = [
    { label: 'No', key: 'index' },
    { label: 'Kode Produk', key: 'kode_produk' },
    { label: 'Nama Produk', key: 'nama' },
    { label: 'Kategori', key: 'kategori.nama' },
    { label: 'Deskripsi', key: 'deskripsi' },
    { label: 'Brand', key: 'brand' },
    { label: 'Unit', key: 'unit' },
    {
      label: 'Dibuat Tanggal',
      render: (item) =>
        item.created_at ? date.format(new Date(item.created_at), 'dd MMM yyyy, HH:mm') : '-'
    },
    {
      label: 'Diubah Tanggal',
      render: (item) =>
        item.updated_at ? date.format(new Date(item.updated_at), 'dd MMM yyyy, HH:mm') : '-'
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
                  actions={['edit', 'delete']}
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
