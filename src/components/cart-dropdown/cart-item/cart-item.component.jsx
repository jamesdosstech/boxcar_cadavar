import React from 'react'
import './cart-item.styles.scss'

const CartItem = ({cartItem}) => {
    const {
        id,
        ProductPrice,
        ProductImg,
        ProductName,
        quantity,
    } = cartItem;
    return (
        <div className='cart-item-container'>
            <img src={ProductImg} alt={`${ProductName}`} />
            <div className='item-details'>
                <span className='name'>{ProductName}</span>
                <span className='price'>
                    {quantity} x ${ProductPrice}
                </span>
            </div>
        </div>
    )
}

export default CartItem