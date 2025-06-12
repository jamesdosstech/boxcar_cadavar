import React from 'react'
import { Link } from 'react-router-dom';
import {ReactComponent as HomeIcon} from '../../../assets/train-icon.svg'

interface NavbarContainerProps {
    state: any,
    dispatch: any
}

const NavbarContainer: React.FC<NavbarContainerProps> = ({state, dispatch}) => {
  return (
    <>
        <div className='navbar-brand'>
            <HomeIcon 
                className={`icon ${state.isMenuOpen ? 'spinning' : ''}`}
                onClick={() => dispatch({ type: 'TOGGLE_MENU'})}
            />
            <Link className='custom-link' to='/'>
                Doosetrain
            </Link>
        </div>
    </>
  )
}

export default NavbarContainer