import React from 'react'
import { NavLink } from 'react-router-dom'
import classes from './NavigationLink.module.css'
interface NavigationLinkProps {
  path: string;
  title: string;
  end?: boolean
}

const NavigationLink: React.FC<NavigationLinkProps> = ({path, title }) => {
  return (
    <li>
        <NavLink to={path} className={({isActive}) => isActive ? classes.active : ''} end>
            {title}
        </NavLink>
    </li>
  )
}

export default NavigationLink