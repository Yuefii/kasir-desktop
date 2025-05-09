import React from 'react'

type AddButtonProps = {
  onClick: () => void
  label?: string
  icon?: boolean
}

const AddButton: React.FC<AddButtonProps> = ({ onClick, label = 'Tambah Data', icon = true }) => {
  return (
    <div className="flex justify-end mb-4">
      <button
        onClick={onClick}
        className="bg-black hover:opacity-80 text-white px-4 py-2 rounded flex items-center"
      >
        {icon && (
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
        )}
        {label}
      </button>
    </div>
  )
}

export default AddButton
