import React from 'react'
import DBHeader from './DBHeader'
import DBOrders from './DBOrders'
import DBItems from './DBItems'
import DBNewItems from './DBNewItems'
import DBUsers from './DBUsers';

import DBHome from './DBHome'
import { Routes, Route } from 'react-router-dom'
import ProductEdit from '../../routes/ProductEdit/ProductEdit'

const DBRightSection = () => {
  return (
    <div>
      <DBHeader />
      <div>
        <Routes>
            <Route path='/Home' element={<DBHome />}/>
            <Route path='/Orders' element={<DBOrders />}/>
            <Route path='/Products' element={<DBItems />} />
            <Route path='/NewProducts' element={<DBNewItems />}/>
            <Route path='/Users' element={<DBUsers />}/>
            <Route path='/Products/:id' element={<ProductEdit />} />
        </Routes>
      </div>
    </div>
  )
}

export default DBRightSection