import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi'
import { KeranjangItemType } from './KasirKeranjang'

type Props = {
  item: KeranjangItemType
  updateQuantity: (id: number, qty: number) => void
  removeFromCart: (id: number) => void
}

const KeranjangItem = ({ item, updateQuantity, removeFromCart }: Props) => (
  <div className="flex justify-between items-center border-b pb-2">
    <div className="flex-1">
      <h4 className="font-medium">{item.name}</h4>
      <p className="text-sm text-gray-600">
        Rp {item.price.toLocaleString()} × {item.quantity}
      </p>
    </div>
    <div className="flex items-center space-x-2">
      <button
        onClick={() => updateQuantity(item.id, item.quantity - 1)}
        className="p-1 rounded-full hover:bg-gray-200"
      >
        <FiMinus size={16} />
      </button>
      <span className="w-8 text-center">{item.quantity}</span>
      <button
        onClick={() => updateQuantity(item.id, item.quantity + 1)}
        className="p-1 rounded-full hover:bg-gray-200"
      >
        <FiPlus size={16} />
      </button>
      <button
        onClick={() => removeFromCart(item.id)}
        className="p-1 rounded-full hover:bg-red-100 text-red-500"
      >
        <FiTrash2 size={16} />
      </button>
    </div>
  </div>
)

export default KeranjangItem
