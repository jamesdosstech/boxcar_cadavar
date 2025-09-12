import React from 'react'
import {ReactComponent as HomeIcon} from '../../../assets/train-icon.svg'
import NavigationLink from '../../../components/NavigationLink/NavigationLink';

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
            <h2 className='pink'>Doosetrain</h2>
        </div>
    </>
  )
}

export default NavbarContainer