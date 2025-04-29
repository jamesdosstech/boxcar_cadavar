import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminNavigation from './AdminNavigation'

const AdminLayout = () => {
  return (
    <>
      <AdminNavigation />
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default AdminLayout