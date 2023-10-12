import React, { useContext, useEffect, useState } from 'react'
import { db } from '../../utils/firebase/firebase.utils';
import { collection, getDocs, query } from 'firebase/firestore';
import { useProductsContext } from '../../context/product/product.context';
import './Doosetrain_store.styles.scss';
import ProductCard from '../../components/ProductCard/ProductCard.component';

const Doosetrain_store = () => {
    const {productsMap, loading} = useProductsContext();
    return (
        <div>
            <h2>Shop</h2>
            <div className='products-container'>
            {
                loading ? (
                    <p>loading...</p>
                ) : (
                    productsMap.map((product) => {
                        return (
                            <ProductCard key={product.id} product={product}/>
                        )
                    })
                )
            }
            </div>
        </div>
    )
}

export default Doosetrain_store