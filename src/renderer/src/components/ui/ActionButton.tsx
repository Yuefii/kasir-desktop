import React from 'react'

type ActionType = 'edit' | 'delete' | 'detail'

interface Props {
  onEdit?: () => void
  onDelete?: () => void
  onDetail?: () => void
  disabled?: boolean
  actions?: ActionType[]
}

const ActionButton: React.FC<Props> = ({
  onEdit,
  onDelete,
  onDetail,
  disabled = false,
  actions = ['edit', 'delete', 'detail']
}) => {
  return (
    <div className="flex space-x-2">
      {actions.includes('edit') && typeof onEdit === 'function' && (
        <button
          type="button"
          onClick={onEdit}
          disabled={disabled}
          className={`text-sm text-blue-600 hover:text-blue-900 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Edit
        </button>
      )}
      {actions.includes('delete') && typeof onDelete === 'function' && (
        <button
          type="button"
          onClick={onDelete}
          disabled={disabled}
          className={`text-sm text-red-600 hover:text-red-900 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Hapus
        </button>
      )}
      {actions.includes('detail') && typeof onDetail === 'function' && (
        <button
          type="button"
          onClick={onDetail}
          disabled={disabled}
          className={`text-sm text-gray-600 hover:text-gray-900 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Detail
        </button>
      )}
    </div>
  )
}

export default ActionButton
