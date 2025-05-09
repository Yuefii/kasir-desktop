import React from 'react'
import TableCell from '@renderer/components/ui/TableCell'
import ActionButton from '@renderer/components/ui/ActionButton'
import nestedValue from '@renderer/helper/nested_value'

interface Column<T> {
  label: string
  key?: string
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
    {columns.map((col: Column<T>, i: number) => (
      <TableCell key={i}>
        {typeof col.render === 'function'
          ? col.render(item, index)
          : col.key === 'index'
            ? index + 1
            : col.key
              ? nestedValue(item, col.key)
              : null}
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
