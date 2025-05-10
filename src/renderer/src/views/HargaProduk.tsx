import axios from 'axios'
import React from 'react'
import * as env from '@renderer/utils/env'
import Pagination from '@renderer/components/ui/Pagination'
import HargaProdukList from '@renderer/components/HargaProdukList'

const HargaProduk = () => {
  const [hargaProduk, setHargaProduk] = React.useState([])
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [paginationInfo, setPaginationInfo] = React.useState({
    total_data: 0,
    data_per_halaman: 0,
    halaman_sekarang: 1
  })

  const fetchHargaProduk = async () => {
    try {
      const res = await axios.get(`${env.BASE_URL}/harga-produk?limit=5&halaman=${currentPage}`)
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
  }, [currentPage])

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold text-black mb-6">Data Harga Produk</h1>
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
