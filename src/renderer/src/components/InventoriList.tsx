import React from 'react'
import * as date from 'date-fns'
import * as Type from '@renderer/types/inventori_type'
import TableRow from '@renderer/components/ui/TableRow'
import TableHead from '@renderer/components/ui/TableHead'

interface Column<T> {
  label: string
  key?: string
  render?: (item: T) => React.ReactNode
}

interface Props {
  inventori: Type.Inventori[]
  onEdit: (item: Type.Inventori) => void
}

const InventoriList: React.FC<Props> = ({ inventori, onEdit }) => {
  const columns: Column<Type.Inventori>[] = [
    { label: 'No', key: 'index' },
    { label: 'Jumlah stok', key: 'jumlah_stok' },
    { label: 'Stok minimal', key: 'stok_minimal' },
    {
      label: 'Cabang',
      render: (item) => item.cabang.nama
    },
    {
      label: 'Produk',
      render: (item) => item.produk.nama
    },
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
      <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-gray-200">
          <TableHead columns={columns} withAction />
          <tbody className="bg-white divide-y divide-gray-200">
            {inventori.length > 0 ? (
              inventori.map((item, index) => (
                <TableRow
                  key={item.id}
                  item={item}
                  index={index}
                  actions={['edit']}
                  columns={columns}
                  onEdit={() => onEdit(item)}
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

export default InventoriList
