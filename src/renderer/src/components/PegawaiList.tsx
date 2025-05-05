import { format } from 'date-fns'
import TableHead from './ui/TableHead'
import TableRow from './ui/TableRow'

const PegawaiList = ({ pegawai, onEdit, onDelete }) => {
  const columns = [
    { label: 'No', key: 'index' },
    { label: 'Nama Pegawai', key: 'nama' },
    { label: 'Jenis Kelamin', key: 'jenis_kelamin' },
    { label: 'No Telepon', key: 'no_telp' },
    { label: 'Alamat', key: 'alamat' },
    { label: 'Email', key: 'email' },
    { label: 'Role', key: 'role' },
    {
      label: 'Dibuat Tanggal',
      render: (item) => format(new Date(item.created_at), 'dd MMM yyyy, HH:mm')
    },
    {
      label: 'Diupdate Tanggal',
      render: (item) => format(new Date(item.updated_at), 'dd MMM yyyy, HH:mm')
    }
  ]
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto py-5 w-full">
        <table className="min-w-full divide-y divide-gray-200">
          <TableHead columns={columns} withAction />
          <tbody className="bg-white divide-y divide-gray-200">
            {pegawai.length > 0 ? (
              pegawai.map((item, index) => (
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

export default PegawaiList
