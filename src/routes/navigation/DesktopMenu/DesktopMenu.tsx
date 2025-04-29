import React from 'react'
import { Link } from 'react-router-dom'
import AccountButton from '../AccountButton/AccountButton'
import { useIsAdmin } from '../../../hooks/useIsAdmin.hook'

interface DesktopMenuProps {
    state: any,
    dispatch: any,
    user: any
}

const DesktopMenu: React.FC<DesktopMenuProps> = ({state, dispatch, currentUser}) => {
    const isAdmin = useIsAdmin()
    return (
    <div className='navbar-menu'>
        <Link to={'showroom'} className='nav-link'>
            Showroom
        </Link>
        {
            currentUser ? (
                <AccountButton
                    currentUser={currentUser}
                    isModalOpen={state.isModalOpen}
                    toggleModal={() => dispatch({type: 'TOGGLE_MODAL'})}
                />
            ) : (
                <Link to="/sign-in" className="nav-link">
                    Sign In
                </Link>
            )
        }
        {isAdmin && <Link to="/admin" className="nav-link">Admin</Link>}
        <Link to="/shop" className="nav-link">Shop</Link>
    </div>
  )
}

export default DesktopMenu