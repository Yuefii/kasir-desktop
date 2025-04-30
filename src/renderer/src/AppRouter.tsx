import { createHashRouter, createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './layouts/AppLayout'
import Kasir from './views/Kasir'
import Category from './views/Kategori'
import User from './views/User'
import Cabang from './views/Cabang'
import Produk from './views/Produk'
import Inventori from './views/Inventori'
import Supplier from './views/Supplier'

const routes = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <div>404 Not Found</div>,
    children: [
      { index: true, element: <Kasir /> },
      { path: 'produk', element: <Produk /> },
      { path: 'kategori', element: <Category /> },
      { path: 'pegawai', element: <User /> },
      { path: 'cabang', element: <Cabang /> },
      { path: 'supplier', element: <Supplier /> },
      { path: 'inventori', element: <Inventori /> }
    ]
  }
]

const router =
  import.meta.env.MODE === 'development' ? createBrowserRouter(routes) : createHashRouter(routes) // 👈 penting di production

export default function Router() {
  return <RouterProvider router={router} />
}
