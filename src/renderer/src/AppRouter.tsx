import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './layouts/AppLayout'
import Kasir from './views/Kasir'
import Product from './views/Product'
import Category from './views/Category'
import User from './views/User'
import Branch from './views/Branch'
import EntriStock from './views/EntriStock'
import RegisterStock from './views/RegisterStock'
import { ReactElement } from 'react'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Kasir />
      },
      {
        path: 'produk',
        element: <Product />
      },
      {
        path: 'kategori',
        element: <Category />
      },
      {
        path: 'pegawai',
        element: <User />
      },
      {
        path: 'cabang',
        element: <Branch />
      },
      {
        path: 'entri-stok',
        element: <EntriStock />
      },
      {
        path: 'daftar-stok',
        element: <RegisterStock />
      },
      {
        path: 'entri-stok',
        element: <EntriStock />
      }
    ]
  }
])

export default function Router(): ReactElement {
  return <RouterProvider router={router} />
}
