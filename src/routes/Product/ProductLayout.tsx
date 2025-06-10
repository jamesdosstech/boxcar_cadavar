import React from 'react'
import { Outlet } from 'react-router-dom'
import ProductNavigation from './ProductNavigation'

const ProductLayout = () => {
  return (
    <>
    <ProductNavigation />
    <main>
      <Outlet />
    </main>
  </>
  )
}

export default ProductLayout