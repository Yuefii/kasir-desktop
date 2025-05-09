import React from 'react'

type Props = {
  label: string
  onCancel?: () => void
}

const FormAction: React.FC<Props> = ({ label, onCancel }) => {
  return (
    <div className="flex justify-end space-x-3 pt-4">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 border rounded text-gray-700 bg-white"
      >
        Batal
      </button>
      <button type="submit" className="px-4 py-2 text-white bg-black rounded">
        {label}
      </button>
    </div>
  )
}

export default FormAction
