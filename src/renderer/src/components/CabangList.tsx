const CabangList = ({ cabangs, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Kode</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Nama</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Alamat</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Aksi</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {cabangs.length > 0 ? (
            cabangs.map((cabang) => (
              <tr key={cabang.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{cabang.kode_cabang}</td>
                <td className="px-6 py-4 text-sm">{cabang.nama}</td>
                <td className="px-6 py-4 text-sm">{cabang.alamat}</td>
                <td className="px-6 py-4 text-sm">
                  <button onClick={() => onEdit(cabang)} className="text-blue-600 mr-2">
                    Edit
                  </button>
                  <button onClick={() => onDelete(cabang.id)} className="text-red-600">
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                Tidak ada cabang ditemukan
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default CabangList
