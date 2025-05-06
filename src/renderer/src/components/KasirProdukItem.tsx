import { Produk } from './KasirKeranjang'

type Props = {
  product: Produk
  index: number
  onAdd: (product: Produk) => void
}

const ProductItem = ({ product, index, onAdd }: Props) => (
  <div className="grid grid-cols-12 gap-2 items-center py-3 border-b hover:bg-gray-50">
    <div className="col-span-1">{index + 1}</div>
    <div className="col-span-5 font-medium">{product.name}</div>
    <div className="col-span-3">Rp {product.price.toLocaleString()}</div>
    <div className="col-span-3">
      <button
        onClick={() => onAdd(product)}
        className="bg-black text-white px-3 py-1 rounded hover:opacity-85 text-sm"
      >
        Tambah
      </button>
    </div>
  </div>
)

export default ProductItem
