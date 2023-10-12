import React, { useContext } from 'react'
import './ProductCard.styles.scss'
import { ShoppingCartContext } from '../../context/shoppingCart/shoppingCart.context';

const ProductCard = ({product}) => {
    const { addItemstoCart } = useContext(ShoppingCartContext)
    const addProductToCart = () => addItemstoCart(product)
    const {id, ProductImg, ProductName, ProductDesc, ProductPrice, ProductQuant} = product
  return (
    <div className='product-card-container'>
        <img src={ProductImg} alt={`${ProductName}`} />
        <div className='footer'>
            <span className='name'>{ProductName}</span>
            <span className='price'>${ProductPrice}</span>
            <span className='price'>Stock:{ProductQuant}</span>
        </div>
        {
            ProductQuant >= 1 ? (
                <button onClick={addProductToCart} className='btn btn-success'>Add to Cart</button>
            ) : (
                <button className='btn btn-danger' disabled>Out of Stock</button>
            )
        }
    </div>
  )
}

export default ProductCard