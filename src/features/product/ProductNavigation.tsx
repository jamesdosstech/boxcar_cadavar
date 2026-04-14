import React from 'react'
import classes from './ProductNavigation.module.css'
import NavigationLink from '../../components/NavigationLink/NavigationLink'

const navigationList = [
    {
        id: 0,
        path: '',
        pathName: 'Products'
    },
    {
        id: 1,
        path: 'new-product',
        pathName: 'Add Product'
    }
]

const ProductNavigation = () => {
  return (
    <header className={classes.header}>
        <nav>
            <ul className={classes.list}>
                {
                    navigationList.map((i) => {
                        return (
                            <NavigationLink path={i.path} title={i.pathName}/>
                        )
                    })
                }
            </ul>
        </nav>
    </header>
  )
}

export default ProductNavigation