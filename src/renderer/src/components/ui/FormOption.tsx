import React from 'react'
import Select, { SingleValue, StylesConfig } from 'react-select'

interface Option {
  label: string
  value: string
}

interface Props {
  label: string
  label_options: string
  name: string
  options: Option[]
  value: string
  onChange: (event: { target: { name: string; value: string } }) => void
}

const FormOption: React.FC<Props> = ({ label, label_options, name, options, value, onChange }) => {
  const selectedOption = options.find((opt) => opt.value === value)

  const customStyles: StylesConfig<Option, false> = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? '#000000' // Hover background
        : state.isSelected
          ? '#222222' // Selected background
          : '#ffffff', // Default
      color: state.isFocused || state.isSelected ? '#ffffff' : '#000000',
      padding: 10
    }),
    control: (provided) => ({
      ...provided,
      borderColor: '#000000',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#000000'
      },
      minHeight: '38px'
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#000000'
    })
  }

  const handleChange = (selected: SingleValue<Option>) => {
    const fakeEvent = {
      target: {
        name,
        value: selected?.value || ''
      }
    }
    onChange(fakeEvent)
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <Select
        name={name}
        options={options}
        value={selectedOption}
        onChange={handleChange}
        styles={customStyles}
        placeholder={`-- ${label_options} --`}
        className="react-select-container"
        classNamePrefix="react-select"
      />
    </div>
  )
}

export default FormOption
