import { getSortOrderLabel } from '@renderer/helper/sort_order_label'
import React from 'react'

interface SortOption {
  label: string
  value: string
}

interface SortDropdownProps {
  sortBy: string
  sortOrder: string
  options: SortOption[]
  onSortChange: (sortBy: string, sortOrder: string) => void
}

const SortDropdown: React.FC<SortDropdownProps> = ({
  sortBy,
  sortOrder,
  options,
  onSortChange
}) => {
  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value, sortOrder)
  }

  const toggleSortOrder = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc'
    onSortChange(sortBy, newOrder)
  }

  const baseButtonClass =
    'flex items-center gap-1 border border-gray-300 px-3 py-1 rounded text-sm bg-white hover:bg-gray-100 transition'

  const baseSelectClass =
    'appearance-none border border-gray-300 px-3 py-1 rounded text-sm bg-white hover:bg-gray-100 transition cursor-pointer'

  return (
    <div className="flex flex-wrap items-center gap-4 mb-4">
      <label className="text-sm text-gray-700">Urut Berdasarkan:</label>

      <select value={sortBy} onChange={handleSortByChange} className={baseSelectClass}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <button
        onClick={toggleSortOrder}
        className={baseButtonClass}
        title={`Klik untuk urut ${sortOrder === 'asc' ? 'turun' : 'naik'}`}
      >
        {sortOrder === 'asc' ? (
          <>
            ▼{' '}
            <span className="text-gray-400 text-xs">({getSortOrderLabel(sortBy, sortOrder)})</span>
          </>
        ) : (
          <>
            ▲{' '}
            <span className="text-gray-400 text-xs">({getSortOrderLabel(sortBy, sortOrder)})</span>
          </>
        )}
      </button>
    </div>
  )
}

export default SortDropdown
