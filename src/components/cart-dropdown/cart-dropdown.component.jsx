import React, { useContext } from 'react'
import { ShoppingCartContext } from '../../context/shoppingCart/shoppingCart.context'
import CartItem from './cart-item/cart-item.component'
import { useNavigate } from 'react-router-dom'
import Button from '../button/button.component'

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
      <Button onClick={goToCheckoutHandler}>Go to Checkout</Button>
    </div>
    
  )
}

export default CartDropdown