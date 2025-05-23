import React from 'react'

type Props = {
  label: string
  name: string
  value: string
  type?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
}

const FormInput: React.FC<Props> = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required = false
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded"
      />
    </div>
  )
}

export default FormInput
