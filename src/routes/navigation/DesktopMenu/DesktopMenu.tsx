import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import AccountButton from '../AccountButton/AccountButton'
import { useIsAdmin } from '../../../hooks/useIsAdmin.hook'
import CartModal from '../../Cart/Cart'
import NavigationLink from './NavigationLink'

interface DesktopMenuProps {
    state: any,
    dispatch: any,
    currentUser: any
}

const DesktopMenu: React.FC<DesktopMenuProps> = ({state, dispatch, currentUser}) => {
    const isAdmin = useIsAdmin()
    const [isCartOpen, setIsCartOpen] = useState(false)
    return (
        <>
            <div className='navbar-menu'>
                <NavigationLink path='showroom' title='Showroom' />
                {isAdmin && <NavigationLink path="/admin" title="Admin"/>}
                {/* remove for full nav access in testing */}
                <NavigationLink path="/shop" title="Shop"/>
                <button onClick={() => setIsCartOpen(true)}>Cart</button>
                {
                    currentUser ? (
                        <AccountButton
                            currentUser={currentUser}
                            isModalOpen={state.isModalOpen}
                            toggleModal={() => dispatch({type: 'TOGGLE_MODAL'})}
                        />
                    ) : (
                        <NavigationLink path="/sign-in" title="Sign In" />
                    )
                }
            </div>
            {isCartOpen && <CartModal onClose={() => setIsCartOpen(false)}/>}
        </>
    
  )
}

export default DesktopMenu