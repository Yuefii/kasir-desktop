const TableHead = ({ columns, withAction = false }) => (
  <thead className="bg-gray-50">
    <tr>
      {columns.map((col, index) => (
        <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500">
          {col.label}
        </th>
      ))}
      {withAction && (
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Aksi</th>
      )}
    </tr>
  </thead>
)

export default TableHead
