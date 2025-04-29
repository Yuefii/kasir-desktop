import { format } from 'date-fns'

const InventoriList = ({ inventori, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs text-center font-medium text-gray-500">No</th>
              <th className="px-6 py-3 text-xs text-center font-medium text-gray-500">
                Jumlah Stok
              </th>
              <th className="px-6 py-3 text-xs text-center font-medium text-gray-500">
                Stok Minimal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Cabang</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Produk</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Dibuat Tanggal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Diperbarui Tanggal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventori.length > 0 ? (
              inventori.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                    {item.jumlah_stok}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                    {item.stok_minimal}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.cabang.nama}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.produk.nama}
                  </td>
                  <td className="px-7 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(item.created_at), 'dd MMM yyyy, HH:mm')}
                  </td>
                  <td className="px-7 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(item.updated_at), 'dd MMM yyyy, HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onEdit(item)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  Tidak ada inventori ditemukan
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
