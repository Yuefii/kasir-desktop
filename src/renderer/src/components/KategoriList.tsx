import { format } from 'date-fns'

import TableRow from './ui/TableRow'
import TableHead from './ui/TableHead'
import { JSX } from 'react'

interface Kategori {
  id: number
  nama: string
  created_at: string
}

interface Props {
  kategori: Kategori[]
  onEdit: (item: Kategori) => void
  onDelete: (item: Kategori) => void
}

const KategoriList = ({ kategori, onEdit, onDelete }: Props): JSX.Element => {
  const columns = [
    { label: 'No', key: 'index' },
    { label: 'Nama Kategori', key: 'nama' },
    {
      label: 'Dibuat Tanggal',
      render: (item: Kategori) => format(new Date(item.created_at), 'dd MMM yyyy, HH:mm')
    }
  ]
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <TableHead columns={columns} withAction />
        <tbody className="bg-white divide-y divide-gray-200">
          {kategori.length > 0 ? (
            kategori.map((item, index) => (
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
  )
}

export default KategoriList
