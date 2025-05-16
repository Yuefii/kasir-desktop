import React from 'react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, onSubmit }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="w-1/2 flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cari berdasarkan nama produk..."
        className="border border-gray-300 text-sm px-4 py-1.5 rounded w-full"
      />
      <button
        type="submit"
        className="bg-black text-white text-sm px-4 py-1.5 rounded hover:bg-opacity-85"
      >
        Cari
      </button>
    </form>
  )
}

export default SearchInput
