import { Outlet, Link } from 'react-router-dom'
const Navigation = () => {
  return (
    <>
      <Link to='/showroom'>Show</Link>
      <Outlet />
    </>
  )
}

export default Navigation
