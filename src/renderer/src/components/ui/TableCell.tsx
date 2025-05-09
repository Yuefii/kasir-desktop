import React from 'react'

type Props = {
  children: React.ReactNode
}

const TableCell: React.FC<Props> = ({ children }) => {
  return <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{children}</td>
}

export default TableCell
