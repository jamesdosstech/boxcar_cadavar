import React from 'react'
import 'bootstrap-icons/font/bootstrap-icons.json'
import { Link } from 'react-router-dom'

const DBLeftSection = () => {
  return (
    <div className='bg-white sidebar'>
      <div className='m-2'>
        <i className="bi bi-bootstrap-fill me-2 fs-4"></i>
        <span className="brand-name fs-4">Doosetrain</span>
      </div>
      <hr className="text-dark" />
      <div className="list-group list-group-flush">
        <Link className="list-group-item py-2" to={'/admin/Home'}>
          <i className="bi bi-speedometer2 fs-5 me-2"></i>
          <span className="fs-5">Home</span>
        </Link>
        <Link className="list-group-item py-2" to={'/admin/Orders'}>
          <i className="bi bi-house fs-5 me-2"></i>
          <span className="fs-5">Orders</span>
        </Link>
        <Link className="list-group-item py-2" to={'/admin/Products'}>
          <i className="bi bi-house fs-5 me-2"></i>
          <span className="fs-5">Products</span>
        </Link>
        <Link className="list-group-item py-2" to={'/admin/NewProducts'}>
          <i className="bi bi-house fs-5 me-2"></i>
          <span className="fs-5">Add Prod</span>
        </Link>
        <Link className="list-group-item py-2" to={'/admin/Users'}>
          <i className="bi bi-house fs-5 me-2"></i>
          <span className="fs-5">Users</span>
        </Link>
      </div>
    </div>
  )
}

export default DBLeftSection