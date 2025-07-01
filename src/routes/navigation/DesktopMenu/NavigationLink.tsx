import React from 'react'
import { NavLink } from 'react-router-dom'
import classes from './Navigation.module.css'
interface NavigationLinkProps {
  path: string;
  title: string;
  end?: boolean
}

const NavigationLink: React.FC<NavigationLinkProps> = ({path, title }) => {
  return (
    <>
        <NavLink to={path} className={({isActive}) => isActive ? classes.active : classes.basic} end>
            {title}
        </NavLink>
    </>
  )
}

export default NavigationLink