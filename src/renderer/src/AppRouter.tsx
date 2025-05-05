import { createHashRouter, createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './layouts/AppLayout'
import Kasir from './views/Kasir'
import Category from './views/Kategori'
import Cabang from './views/Cabang'
import Produk from './views/Produk'
import Inventori from './views/Inventori'
import Supplier from './views/Supplier'
import Sinkronisasi from './views/Sinkronisasi'
import Pegawai from './views/Pegawai'

const routes = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <div>404 Not Found</div>,
    children: [
      { index: true, element: <Kasir /> },
      { path: 'produk', element: <Produk /> },
      { path: 'kategori', element: <Category /> },
      { path: 'pegawai', element: <Pegawai /> },
      { path: 'cabang', element: <Cabang /> },
      { path: 'supplier', element: <Supplier /> },
      { path: 'inventori', element: <Inventori /> },
      { path: 'sinkronisasi', element: <Sinkronisasi /> }
    ]
  }
]

const router =
  import.meta.env.MODE === 'development' ? createBrowserRouter(routes) : createHashRouter(routes) // 👈 penting di production

export default function Router() {
  return <RouterProvider router={router} />
}
