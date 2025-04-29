import { createHashRouter, createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './layouts/AppLayout'
import Kasir from './views/Kasir'
import Product from './views/Product'
import Category from './views/Kategori'
import User from './views/User'
import Cabang from './views/Cabang'
import EntriStock from './views/EntriStock'
import RegisterStock from './views/RegisterStock'

const routes = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <div>404 Not Found</div>,
    children: [
      { index: true, element: <Kasir /> },
      { path: 'produk', element: <Product /> },
      { path: 'kategori', element: <Category /> },
      { path: 'pegawai', element: <User /> },
      { path: 'cabang', element: <Cabang /> },
      { path: 'entri-stok', element: <EntriStock /> },
      { path: 'daftar-stok', element: <RegisterStock /> }
    ]
  }
]

const router =
  import.meta.env.MODE === 'development' ? createBrowserRouter(routes) : createHashRouter(routes) // 👈 penting di production

export default function Router() {
  return <RouterProvider router={router} />
}
