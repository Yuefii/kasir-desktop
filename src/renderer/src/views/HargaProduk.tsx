import axios from 'axios'
import React from 'react'
import * as env from '@renderer/utils/env'
import Pagination from '@renderer/components/ui/Pagination'
import SearchInput from '@renderer/components/ui/SearchInput'
import ExportButton from '@renderer/components/ui/ExportButton'
import SortDropdown from '@renderer/components/ui/SortDropdown'
import HargaProdukList from '@renderer/components/HargaProdukList'

const HargaProduk = () => {
  const [hargaProduk, setHargaProduk] = React.useState([])
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [sortBy, setSortBy] = React.useState('created_at')
  const [sortOrder, setSortOrder] = React.useState('desc')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [paginationInfo, setPaginationInfo] = React.useState({
    total_data: 0,
    data_per_halaman: 0,
    halaman_sekarang: 1
  })

  const fetchHargaProduk = async () => {
    try {
      const res = await axios.get(
        `${env.BASE_URL}/harga-produk?limit=5&halaman=${currentPage}&urut_berdasarkan=${sortBy}&urutan=${sortOrder}&pencarian=${encodeURIComponent(searchQuery)}`
      )
      const data = await res.data
      setHargaProduk(data.data)
      setTotalPages(data.pagination.total_halaman)
      setPaginationInfo(data.pagination)
    } catch (error) {
      console.error('Gagal memuat data:', error)
    }
  }

  React.useEffect(() => {
    fetchHargaProduk()
  }, [currentPage, sortBy, sortOrder])

  React.useEffect(() => {
    if (searchQuery === '') {
      fetchHargaProduk()
    }
  }, [searchQuery])

  const handleSortChange = (newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy)
    setSortOrder(newSortOrder)
    setCurrentPage(1)
  }

  const hargaProdukSortOptions = [
    { label: 'Harga', value: 'harga' },
    { label: 'Tanggal Berlaku', value: 'mulai_berlaku' },
    { label: 'Tanggal Dibuat', value: 'created_at' },
    { label: 'Tanggal Diubah', value: 'updated_at' }
  ]

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold text-black mb-6">Data Harga Produk</h1>
      <SortDropdown
        sortBy={sortBy}
        sortOrder={sortOrder}
        options={hargaProdukSortOptions}
        onSortChange={handleSortChange}
      />
      <SearchInput
        value={searchQuery}
        onChange={(value) => setSearchQuery(value)}
        onSubmit={() => {
          fetchHargaProduk()
        }}
      />
      <div className="flex justify-end items-center mb-4">
        <ExportButton
          exportUrl={`${env.BASE_URL}/harga-produk/export`}
          fileName="Data Harga Produk"
          query={{
            urut_berdasarkan: sortBy,
            urutan: sortOrder,
            pencarian: searchQuery
          }}
        />
      </div>
      <HargaProdukList hargaProduk={hargaProduk} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalData={paginationInfo.total_data}
        dataPerPage={paginationInfo.data_per_halaman}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  )
}

export default HargaProduk
