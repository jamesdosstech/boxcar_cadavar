import React, { useContext } from 'react'
import { ShoppingCartContext } from '../../context/shoppingCart/shoppingCart.context';
import './checkout-item.styles.scss';
const CheckoutItem = ({cartItem}) => {
    const {ProductName, ProductImg, quantity, ProductPrice} = cartItem;
    const { clearItemsFromCart, addItemstoCart, removeItemsFromCart } = useContext(ShoppingCartContext);
    const clearItemHandler = () => clearItemsFromCart(cartItem);
    const addItemHandler = () => addItemstoCart(cartItem);
    const removeItemHandler = () => removeItemsFromCart(cartItem);
    return (
        <div className="checkout-item-container">
            <div className="image-container">
                <img src={ProductImg} alt="" />
            </div>
            <span className="name">{ProductName}</span>
            <span className="quantity">
                <div className="arrow" onClick={removeItemHandler}>
                    &#10094;
                </div>
                <span className="value">{quantity}</span>
                <div className="arrow" onClick={addItemHandler}>
                    &#10095;
                </div>
            </span>
            <span className="price">${ProductPrice * quantity}</span>
            <span onClick={clearItemHandler} className="remove-button">
                &#10005;
            </span>

        </div>
    )
}

export default CheckoutItem