import { useState } from 'react'
import Keranjang from '@renderer/components/KasirKeranjang'
import ProdukList from '@renderer/components/KasirProdukList'

export type Product = {
  id: number
  name: string
  price: number
  category: string
}

export type CartItem = Product & {
  quantity: number
}

const KasirApp = () => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  console.log({ searchTerm })
  const products: Product[] = [
    { id: 1, name: 'Kopi Hitam', price: 15000, category: 'Minuman' },
    { id: 2, name: 'Teh Manis', price: 10000, category: 'Minuman' },
    { id: 3, name: 'Nasi Goreng', price: 25000, category: 'Makanan' },
    { id: 4, name: 'Mie Goreng', price: 20000, category: 'Makanan' },
    { id: 5, name: 'Ayam Goreng', price: 30000, category: 'Makanan' },
    { id: 6, name: 'Es Teh', price: 8000, category: 'Minuman' },
    { id: 7, name: 'Es Jeruk', price: 12000, category: 'Minuman' },
    { id: 8, name: 'Sate Ayam', price: 35000, category: 'Makanan' }
  ]

  const categories = ['Semua', ...new Set(products.map((p) => p.category))]

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    }
    return sortOrder === 'asc' ? a.price - b.price : b.price - a.price
  })

  const filteredProducts = sortedProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (activeCategory === 'Semua' || product.category === activeCategory)
  )

  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.id === product.id)
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      )
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      setCart(cart.filter((item) => item.id !== id))
    } else {
      setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }
  }

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const handleSort = (field: 'name' | 'price') => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="flex h-screen bg-gray-100 p-4">
      <div className="w-2/3 pr-4">
        <ProdukList
          products={filteredProducts}
          categories={categories}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          addToCart={addToCart}
          handleSort={handleSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      </div>
      <div className="w-1/3">
        <Keranjang
          cart={cart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          totalPrice={totalPrice}
          clearCart={() => setCart([])}
        />
      </div>
    </div>
  )
}

export default KasirApp
