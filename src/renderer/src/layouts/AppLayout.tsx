import MenuBar from '@renderer/components/MenuBar'
import { ReactElement } from 'react'
import { Outlet } from 'react-router-dom'

const Layout = (): ReactElement => {
  return (
    <>
      <MenuBar />
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default Layout
