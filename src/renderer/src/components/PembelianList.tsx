import * as date from 'date-fns'
import * as Type from '@renderer/types/pembelian_type'
import React from 'react'
import TableRow from './ui/TableRow'
import TableHead from './ui/TableHead'

interface Column<T> {
  label: string
  key?: string
  render?: (item: T) => React.ReactNode
}

interface Props {
  pembelian: Type.Pembelian[]
}

const PembelianList: React.FC<Props> = ({ pembelian }) => {
  console.log(pembelian)
  const columns: Column<Type.Pembelian>[] = [
    { label: 'No', key: 'index' },
    {
      label: 'Tanggal Pembelian',
      render: (item) =>
        item.tanggal_pembelian
          ? date.format(new Date(item.tanggal_pembelian), 'dd MMM yyyy, HH:mm')
          : '-'
    },
    {
      label: 'Nama Supplier',
      render: (item) => item.supplier.nama
    },
    {
      label: 'Untuk Cabang',
      render: (item) => item.cabang.nama
    },
    { label: 'Total Pembelian', key: 'total_pembelian' },
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
          {pembelian.length > 0 ? (
            pembelian.map((item, index) => (
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

export default PembelianList
