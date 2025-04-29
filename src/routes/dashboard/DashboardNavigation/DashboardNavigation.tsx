import { NavLink } from 'react-router-dom'
import './Dashboard.scss'

const DashboardNavigation = () => {
  return (
    <div className='Dashboard-Nav'>
        <nav >
            <NavLink className={({isActive}) => isActive ? 'active' : ''} to={''} end>Dashboard</NavLink>  
            <NavLink className={({isActive}) => isActive ? 'active' : ''} to={'orders'}>Orders</NavLink>
            <NavLink className={({isActive}) => isActive ? 'active' : ''} to={'products'}>Products</NavLink>
            <NavLink className={({isActive}) => isActive ? 'active' : ''} to={'users'}>Users</NavLink>
        </nav>
    </div>
  )
}

export default DashboardNavigation