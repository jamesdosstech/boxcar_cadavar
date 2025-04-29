import NavigationLink from '../../components/NavigationLink/NavigationLink'
import classes from './AdminNavigation.module.css'

const navigationList = [
    {
        id: 0,
        path: '',
        pathName: 'Home'
    },
    {
        id: 1,
        path: 'users',
        pathName: 'Users'
    },
    {
        id: 2,
        path: 'products',
        pathName: 'Products'
    },
    {
        id: 3,
        path: 'orders',
        pathName: 'Orders'
    },
]

const AdminNavigation = () => {
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

export default AdminNavigation