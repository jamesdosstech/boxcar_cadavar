import React, { useContext, useEffect, useState } from "react";
import "./ProductCard.styles.scss";
import { ShoppingCartContext } from "../../context/shoppingCart/shoppingCart.context";

const ProductCard = ({ product }) => {
  const [stock, setStock] = useState(0);
  const { addItemstoCart, cartItems } = useContext(ShoppingCartContext);
  const addProductToCart = () => addItemstoCart(product);
  const {
    // id,
    ProductImg,
    ProductName,
    // ProductDesc,
    ProductPrice,
    // ProductQuant,
    // quantity,
  } = product;
  // read product
  // console.log("This is ", product);
  useEffect(() => {
    if (product.ProductQuant && cartItems) {
      const cartItem = cartItems.find((item) => item.id === product.id);
      const quantityInCart = cartItem ? cartItem.quantity : 0;
      const stockValue = product.ProductQuant - quantityInCart;
      setStock(stockValue);
    }
  }, [product.ProductQuant, cartItems, product.id]);
  return (
    <div className="product-card-container">
      <img src={ProductImg} alt={`${ProductName}`} />
      <div className="footer">
        <span className="name">{ProductName}</span>
        <span className="price">${ProductPrice}</span>
        <span className="price">Stock:{stock}</span>
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
