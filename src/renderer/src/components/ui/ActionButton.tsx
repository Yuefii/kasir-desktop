const ActionButton = ({ onEdit, onDelete, disabled = false, showIcons = false }) => {
  return (
    <div className="flex space-x-2">
      <button
        type="button"
        onClick={onEdit}
        disabled={disabled}
        className={`text-sm text-blue-600 hover:text-blue-900 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {showIcons ? '✏️ ' : ''}Edit
      </button>
      <button
        type="button"
        onClick={onDelete}
        disabled={disabled}
        className={`text-sm text-red-600 hover:text-red-900 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {showIcons ? '🗑️ ' : ''}Hapus
      </button>
    </div>
  )
}

export default ActionButton
