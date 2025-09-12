import React from 'react'
import classes from '../../../Product/ProductNavigation.module.css'
// import classes from './ProductNavigation.module.css'
import NavigationLink from '../../../../components/NavigationLink/NavigationLink'

const navigationList = [
    {
        id: 0,
        path: '',
        pathName: 'Blog List'
    },
    {
        id: 1,
        path: 'new-post',
        pathName: 'Blog Entry'
    }
]

const BlogNavigation = () => {
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

export default BlogNavigation