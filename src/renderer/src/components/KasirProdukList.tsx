import { FiSearch } from 'react-icons/fi'
import ProdukItem from './KasirProdukItem'
import { Produk } from './KasirKeranjang'

export type CartItem = Produk & {
  quantity: number
}

type Props = {
  products: Produk[]
  categories: string[]
  searchTerm: string
  setSearchTerm: (val: string) => void
  activeCategory: string
  setActiveCategory: (val: string) => void
  addToCart: (product: Produk) => void
  handleSort: (field: 'name' | 'price') => void
  sortBy: 'name' | 'price'
  sortOrder: 'asc' | 'desc'
}

const ProdukList = ({
  products,
  categories,
  searchTerm,
  setSearchTerm,
  activeCategory,
  setActiveCategory,
  addToCart,
  handleSort,
  sortBy,
  sortOrder
}: Props) => {
  return (
    <div className="bg-white rounded p-4 h-full flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div className="relative flex-1 mr-4">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Cari produk..."
            className="pl-10 pr-4 py-2 w-full border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="pl-3 pr-8 py-2 border rounded"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-2 border-b pb-2 mb-2 font-medium text-gray-600">
        <div className="col-span-1">No</div>
        <div className="col-span-5 cursor-pointer" onClick={() => handleSort('name')}>
          Nama {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
        </div>
        <div className="col-span-3 cursor-pointer" onClick={() => handleSort('price')}>
          Harga {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
        </div>
        <div className="col-span-3">Aksi</div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {products.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Tidak ada produk ditemukan</div>
        ) : (
          products.map((product, index) => (
            <ProdukItem key={product.id} product={product} index={index} onAdd={addToCart} />
          ))
        )}
      </div>
    </div>
  )
}

export default ProdukList
