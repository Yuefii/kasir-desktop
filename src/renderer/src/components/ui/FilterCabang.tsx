import React from 'react'
import axios from 'axios'
import * as env from '@renderer/utils/env'

type Cabang = {
  id: number
  nama: string
}

type Props = {
  selectedCabang: number | null
  onChange: (id: number | null) => void
}

const CabangFilter: React.FC<Props> = ({ selectedCabang, onChange }) => {
  const [cabangList, setCabangList] = React.useState<Cabang[]>([])

  React.useEffect(() => {
    const fetchCabang = async () => {
      try {
        const res = await axios.get(`${env.BASE_URL}/cabang?pagination=false`)
        setCabangList(res.data.data)
      } catch (error) {
        console.error('Gagal memuat data cabang:', error)
      }
    }

    fetchCabang()
  }, [])

  const baseSelectClass =
    'appearance-none border border-gray-300 px-3 py-1 rounded text-sm bg-white hover:bg-gray-100 transition cursor-pointer'

  return (
    <div className="flex flex-wrap items-center gap-4 mb-4">
      <label className="text-sm text-gray-700">Filter Cabang:</label>
      <select
        value={selectedCabang ?? ''}
        onChange={(e) => onChange(e.target.value ? parseInt(e.target.value) : null)}
        className={baseSelectClass}
      >
        <option value="">Semua Cabang</option>
        {cabangList.map((cabang) => (
          <option key={cabang.id} value={cabang.id}>
            {cabang.nama}
          </option>
        ))}
      </select>
    </div>
  )
}

export default CabangFilter
