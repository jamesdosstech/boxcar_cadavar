import React, { useContext } from 'react'
import { ShoppingCartContext } from '../../context/shoppingCart/shoppingCart.context'
import CartItem from './cart-item/cart-item.component'
import { useNavigate } from 'react-router-dom'

const CartDropdown = () => {
  const {cartItems} = useContext(ShoppingCartContext)
  const navigate = useNavigate();

  const goToCheckoutHandler = () => {
    navigate('/checkout')
  }
  return (
    <div className='cart-dropdown-container'>
      <div className="cart-items">
        {
          cartItems.map((item) => {
            return (
              <CartItem 
                key={item.id}
                cartItem={item}
              />  
            )
          })
        }
      </div>
      <button onClick={goToCheckoutHandler}>Go to Checkout</button>
    </div>
    
  )
}

export default CartDropdown