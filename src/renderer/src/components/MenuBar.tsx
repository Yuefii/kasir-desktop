import React, { ReactElement, useState } from 'react'
import { Link } from 'react-router-dom'

interface MenuItem {
  name: string
  href?: string
  shortcut?: string
  type?: string
}

interface Menu {
  name: string
  is_direct_link?: boolean
  href?: string
  items: MenuItem[]
}

const MenuBar = (): ReactElement => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  const menus: Menu[] = [
    {
      name: 'Data Master',
      items: [
        { name: 'Cabang', href: '/cabang' },
        { name: 'Kategori', href: '/kategori' },
        { name: 'Produk', href: '/produk' },
        { name: 'Operator', href: '/pegawai' },
        { name: 'Supplier', href: '/supplier' }
      ]
    },
    {
      name: 'Inventori',
      items: [],
      href: '/inventori',
      is_direct_link: true
    },
    {
      name: 'Data Pesanan',
      items: [{ name: 'Semua Pesanan' }, { name: 'Pesanan Tunai' }, { name: 'Pesanan Non-Tunai' }]
    },
    {
      name: 'Akutansi',
      items: [{ name: 'Buku Besar' }, { name: 'Transaksi Keuangan' }, { name: 'Cash Flow' }]
    },
    {
      name: 'Laporan',
      items: [
        { name: 'Semua Transaksi Penjualan' },
        { name: 'Riwayat Transaksi Per Produk' },
        { name: 'Laporan Cash Flow' }
      ]
    },
    {
      name: 'Sinkronisasi',
      items: [],
      href: '/sinkronisasi',
      is_direct_link: true
    }
  ]

  const handleMenuClick = (menuName: string): void => {
    setActiveMenu(activeMenu === menuName ? null : menuName)
  }

  const handleBlur = (): void => {
    setTimeout(() => {
      setActiveMenu(null)
    }, 200)
  }

  return (
    <div className="max-w-full bg-black text-sm select-none">
      <div className="flex items-center h-8">
        {menus.map((menu) =>
          menu.is_direct_link ? (
            <div className="relative">
              <Link
                key={menu.name}
                to={menu.href || ''}
                className="px-3 text-white h-full hover:bg-gray-100 hover:text-black flex items-center"
              >
                {menu.name}
              </Link>
            </div>
          ) : (
            <div key={menu.name} className="relative" onBlur={handleBlur} tabIndex={0}>
              <button
                className={`px-3 h-full hover:bg-gray-100 hover:text-black ${activeMenu === menu.name ? 'bg-gray-100 text-black' : 'text-white'}`}
                onClick={() => handleMenuClick(menu.name)}
              >
                {menu.name}
              </button>

              {activeMenu === menu.name && (
                <div className="absolute left-1 p-1.5 top-7 bg-white shadow-lg border border-gray-300 z-10 min-w-[250px]">
                  {menu.items.map((item, index) => (
                    <React.Fragment key={index}>
                      {item.type === 'divider' ? (
                        <div className="border-t border-gray-200 my-1"></div>
                      ) : (
                        <Link
                          to={item.href || '#'}
                          className="px-3 py-1 hover:bg-black hover:text-white flex justify-between items-center"
                        >
                          <span>{item.name}</span>
                          {item.shortcut && (
                            <span className="text-xs text-gray-500 ml-8">{item.shortcut}</span>
                          )}
                        </Link>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default MenuBar
