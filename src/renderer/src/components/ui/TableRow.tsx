import TableCell from './TableCell'
import nestedValue from '@renderer/helper/nested_value'
import ActionButton from './ActionButton'
import React from 'react'

interface Column<T> {
  key: string
  render?: (item: T, index: number) => React.ReactNode
}

interface TableRowProps<T> {
  item: T
  index: number
  columns: Column<T>[]
  actions?: ('edit' | 'delete' | 'detail')[]
  onEdit?: (item: T) => void
  onDelete?: (id: string | number) => void
  onDetail?: (item: T) => void
}
const TableRow = <T extends { id: string | number }>({
  item,
  index,
  columns,
  actions = ['edit', 'delete', 'detail'],
  onEdit,
  onDelete,
  onDetail
}: TableRowProps<T>): React.JSX.Element => (
  <tr className="hover:bg-gray-50">
    {columns.map((col, i) => (
      <TableCell key={i}>
        {typeof col.render === 'function'
          ? col.render(item, index)
          : col.key === 'index'
            ? index + 1
            : nestedValue(item, col.key)}
      </TableCell>
    ))}
    <TableCell>
      <ActionButton
        onDetail={onDetail ? () => onDetail(item) : undefined}
        onEdit={onEdit ? () => onEdit(item) : undefined}
        onDelete={onDelete ? () => onDelete(item.id) : undefined}
        actions={actions}
      />
    </TableCell>
  </tr>
)

export default TableRow
