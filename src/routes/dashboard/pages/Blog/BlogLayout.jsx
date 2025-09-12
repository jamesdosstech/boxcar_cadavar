import React from 'react'
import { Outlet } from 'react-router-dom'
import BlogNavigation from './BlogNavigation'

const BlogLayout = () => {
  return (
    <>
    <BlogNavigation />
    <main>
      <Outlet />
    </main>
  </>
  )
}

export default BlogLayout