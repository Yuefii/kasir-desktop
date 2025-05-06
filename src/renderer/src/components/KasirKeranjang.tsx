import KeranjangItem from './KasirKeranjangItem'

export type Produk = {
  id: number
  name: string
  price: number
  category: string
}

export type KeranjangItemType = Produk & {
  quantity: number
}

type Props = {
  cart: KeranjangItemType[]
  updateQuantity: (id: number, qty: number) => void
  removeFromCart: (id: number) => void
  totalPrice: number
  clearCart: () => void
}

const Keranjang = ({ cart, updateQuantity, removeFromCart, totalPrice, clearCart }: Props) => (
  <div className="bg-white rounded p-4 h-full flex flex-col">
    <h2 className="text-xl font-semibold mb-4">Keranjang Belanja</h2>
    <div className="flex-1 overflow-y-auto mb-4 space-y-3">
      {cart.length === 0 ? (
        <div className="text-center text-gray-500 py-8">Belum ada item di keranjang</div>
      ) : (
        cart.map((item) => (
          <KeranjangItem
            key={item.id}
            item={item}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
          />
        ))
      )}
    </div>
    <div className="border-t py-4">
      <div className="flex justify-between font-semibold text-lg mb-4">
        <span>Total:</span>
        <span>Rp {totalPrice.toLocaleString()}</span>
      </div>
      <button
        disabled={cart.length === 0}
        className={`w-full py-3 rounded font-medium ${cart.length === 0 ? 'bg-gray-300' : 'bg-black text-white hover:bg-opacity-85'}`}
      >
        Bayar (Rp {totalPrice.toLocaleString()})
      </button>
      <button
        onClick={clearCart}
        disabled={cart.length === 0}
        className={`w-full py-2 rounded mt-2 ${cart.length === 0 ? 'bg-gray-100 text-gray-400' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
      >
        Kosongkan Keranjang
      </button>
    </div>
  </div>
)

export default Keranjang
