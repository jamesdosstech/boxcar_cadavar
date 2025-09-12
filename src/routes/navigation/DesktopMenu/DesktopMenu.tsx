import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import AccountButton from '../AccountButton/AccountButton'
import { useIsAdmin } from '../../../hooks/useIsAdmin.hook'
import CartModal from '../../Cart/Cart'

interface DesktopMenuProps {
    state: any,
    dispatch: any,
    user: any
}

const DesktopMenu: React.FC<DesktopMenuProps> = ({state, dispatch, currentUser}) => {
    const isAdmin = useIsAdmin()
    const [isCartOpen, setIsCartOpen] = useState(false)
    return (
        <>
            <div className='navbar-menu'>
                <NavLink to={'/'}
                >
                    Home
                </NavLink>
                <NavLink to={'showroom'}
                >
                    Showroom
                </NavLink>
                {isAdmin && <Link to="/admin" className="nav-link">Admin</Link>}
                <Link to="/blog" className='nav-link'>Blog</Link>
                {/* remove for full nav access in testing */}
                <Link to="/shop" className="nav-link">Shop</Link>
                <button onClick={() => setIsCartOpen(true)}>Cart</button>
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
            </div>
            {isCartOpen && <CartModal onClose={() => setIsCartOpen(false)}/>}
        </>
    
  )
}

export default DesktopMenu