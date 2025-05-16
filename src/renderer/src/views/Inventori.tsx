import axios from 'axios'
import React from 'react'
import * as env from '@renderer/utils/env'
import * as Type from '@renderer/types/inventori_type'
import Modal from '@renderer/components/Modal'
import Pagination from '@renderer/components/ui/Pagination'
import InventoriList from '@renderer/components/InventoriList'
import InventoriFormUpdate from '@renderer/components/InventoriFormUpdate'
import CabangFilter from '@renderer/components/ui/FilterCabang'
import SortDropdown from '@renderer/components/ui/SortDropdown'
import ExportButton from '@renderer/components/ui/ExportButton'
import SearchInput from '@renderer/components/ui/SearchInput'

const Inventori: React.FC = () => {
  const [inventori, setInventori] = React.useState<Type.Inventori[]>([])
  const [currentInventori, setCurrentInventori] = React.useState<Type.Inventori | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [sortBy, setSortBy] = React.useState('created_at')
  const [sortOrder, setSortOrder] = React.useState('desc')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedCabangId, setSelectedCabangId] = React.useState<number | null>(null)
  const [paginationInfo, setPaginationInfo] = React.useState({
    total_data: 0,
    data_per_halaman: 0,
    halaman_sekarang: 1
  })

  const fetchInventori = async () => {
    try {
      const params = selectedCabangId ? `&cabang=${selectedCabangId}` : ''
      const res = await axios.get(
        `${env.BASE_URL}/inventori?limit=5&halaman=${currentPage}&urut_berdasarkan=${sortBy}&urutan=${sortOrder}&pencarian=${encodeURIComponent(searchQuery)}${params}`
      )
      const data = res.data
      setInventori(data.data)
      setTotalPages(data.pagination.total_halaman)
      setPaginationInfo(data.pagination)
    } catch (error) {
      console.error('Gagal memuat data:', error)
    }
  }

  React.useEffect(() => {
    fetchInventori()
  }, [currentPage, sortBy, sortOrder, selectedCabangId])

  React.useEffect(() => {
    if (searchQuery === '') {
      fetchInventori()
    }
  }, [searchQuery])

  const handleSortChange = (newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy)
    setSortOrder(newSortOrder)
    setCurrentPage(1)
  }

  const hargaInventoriSortOptions = [
    { label: 'Jumlah Stok', value: 'jumlah_stok' },
    { label: 'Stok Minimal', value: 'stok_minimal' },
    { label: 'Nama Produk', value: 'produk' },
    { label: 'Nama Cabang', value: 'cabang' },
    { label: 'Tanggal Dibuat', value: 'created_at' },
    { label: 'Tanggal Diubah', value: 'updated_at' }
  ]

  const handleEdit = (inventori: Type.Inventori) => {
    setCurrentInventori(inventori)
    setIsModalOpen(true)
  }

  const handleSubmit = async (formValues: Type.InventoriFormValues) => {
    if (!currentInventori) return

    try {
      await axios.patch(`${env.BASE_URL}/inventori/${currentInventori.id}`, {
        stok_minimal: formValues.stok_minimal
      })
      setIsModalOpen(false)
      fetchInventori()
    } catch (error) {
      console.error('Gagal mengupdate inventori:', error)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold text-black mb-6">Data Inventori</h1>
      <CabangFilter
        selectedCabang={selectedCabangId}
        onChange={(id) => {
          setSelectedCabangId(id)
          setCurrentPage(1)
        }}
      />
      <SortDropdown
        sortBy={sortBy}
        sortOrder={sortOrder}
        options={hargaInventoriSortOptions}
        onSortChange={handleSortChange}
      />
      <div className="flex flex-wrap justify-between items-center mb-6">
        <SearchInput
          value={searchQuery}
          onChange={(value) => setSearchQuery(value)}
          onSubmit={() => {
            fetchInventori()
          }}
        />
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
      <InventoriList inventori={inventori} onEdit={handleEdit} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalData={paginationInfo.total_data}
        dataPerPage={paginationInfo.data_per_halaman}
        onPageChange={setCurrentPage}
      />

      {isModalOpen && currentInventori && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <InventoriFormUpdate
            initialValues={{
              id: currentInventori.id,
              stok_minimal: currentInventori.stok_minimal
            }}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  )
}

export default Inventori
