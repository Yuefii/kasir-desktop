import TableCell from './TableCell'
import ActionButton from './ActionButton'

const TableRow = ({ item, index, columns, onEdit, onDelete }) => (
  <tr className="hover:bg-gray-50">
    {columns.map((col, i) => (
      <TableCell key={i}>
        {typeof col.render === 'function'
          ? col.render(item, index)
          : col.key === 'index'
            ? index + 1
            : item[col.key]}
      </TableCell>
    ))}
    <TableCell>
      <ActionButton onEdit={() => onEdit(item)} onDelete={() => onDelete(item.id)} />
    </TableCell>
  </tr>
)

export default TableRow
