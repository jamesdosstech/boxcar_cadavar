import React, { useContext } from 'react'
import { UserContext } from '../context/user/user.context'
import { useIsAdmin } from '../hooks/useIsAdmin.hook'
import { Navigate, Outlet } from 'react-router-dom'
import DashboardNavigation from '../routes/dashboard/DashboardNavigation/DashboardNavigation'

const ProtectedGuard = () => {
    const {currentUser} = useContext(UserContext)
  const admin = useIsAdmin()
  if(!currentUser || !admin) return <Navigate to='/' replace />
  // if (!admin) {
  //   return <Navigate to='/' replace />
  // }
  return (
    <div>
        <DashboardNavigation />
        <Outlet />
    </div>
  )
}

export default ProtectedGuard