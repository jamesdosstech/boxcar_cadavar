import React from 'react'
import { Outlet } from 'react-router-dom'

const MainBlogLayout = () => {
  return (
    <div><h1>Doosetrain Blog</h1><Outlet /></div>
  )
}

export default MainBlogLayout