import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../../utils/firebase/firebase.utils';
import { Link } from 'react-router-dom';

const DBItems = () => {

  const [products, setProducts] = useState([]);
  const productCollectionRef = collection(db, 'Products');
  useEffect(() => {
    const getProducts = async () => {
      const data = await getDocs(productCollectionRef)
      setProducts(data.docs.map((doc) => ({
        ...doc.data(), id: doc.id
      })));
      console.log(products)
    }

    getProducts()
  },[])

  return (
    <div>
      {
        products.map((product) => {
          return (
            <>
              <Link style={{color: 'white'}} to={`/admin/Products/${product.id}`}>{product.ProductName}</Link>
            </>
          )
        })
      }
    </div>
  )
}

export default DBItems