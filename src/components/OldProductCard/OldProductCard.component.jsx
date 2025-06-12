import React, { useContext, useEffect, useState } from "react";
import "./OldProductCard.styles.scss";
import { ShoppingCartContext } from "../../context/shoppingCart/shoppingCart.context";

const ProductCard = ({ product, key }) => {
  const [stock, setStock] = useState(0);
  const { addItemstoCart, cartItems } = useContext(ShoppingCartContext);
  const addProductToCart = () => addItemstoCart(product);
  const {
    image,
    name,
    price,
    quantity
  } = product;

  useEffect(() => {
    if (quantity && cartItems) {
      const cartItem = cartItems.find((item) => item.id === key);
      const quantityInCart = cartItem ? cartItem.quantity : 0;
      const stockValue = quantity - quantityInCart;
      setStock(stockValue);
    }
  }, [quantity, cartItems, key]);

  return (
    <div className="product-card-container">
      <img src={image} alt={`${name}`} className="product-img"/>
      <div className="footer">
        <span className="name">{name}</span>
        <span className="price">${price}</span>
        <span className="stock">Stock: {stock}</span>
      </div>
      {stock >= 1 ? (
        <button onClick={addProductToCart} className="btn btn-success">
          Add to Cart
        </button>
      ) : (
        <button className="btn btn-danger" disabled>
          Out of Stock
        </button>
      )}
    </div>
  );
};

export default ProductCard;
