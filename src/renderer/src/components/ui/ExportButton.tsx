import React from 'react'
import axios from 'axios'
import { format } from 'date-fns'

interface ExportButtonProps {
  exportUrl: string
  fileName?: string
  query?: Record<string, string>
  label?: string
}

const ExportButton: React.FC<ExportButtonProps> = ({
  exportUrl,
  fileName = '',
  query = {},
  label = 'Export CSV'
}) => {
  const handleExport = async () => {
    try {
      const today = format(new Date(), 'dd MMM yyyy')
      const actualFileName = `${fileName} - ${today}.csv`
      const params = new URLSearchParams(query).toString()
      const res = await axios.get(`${exportUrl}?${params}`, {
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', actualFileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Gagal export data:', error)
    }
  }

  return (
    <button
      onClick={handleExport}
      className="bg-black text-white text-sm px-4 py-1.5 rounded hover:bg-opacity-85 ml-2"
    >
      {label}
    </button>
  )
}

export default ExportButton
