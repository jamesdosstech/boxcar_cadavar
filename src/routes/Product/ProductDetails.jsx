import React, { useEffect, useState } from 'react'
import './ProductDetails.styles.scss';
import { useNavigate, useParams } from 'react-router-dom'
import { getProduct } from '../../utils/firebase/firebase.utils';
import { useCart } from '../../context/shoppingCart/shoppingCart.context';

const ProductDetails = () => {
  const {addItem, cartItems} = useCart();
  const {productId} = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate()

  useEffect(() => {
  const fetchProduct = async () => {
    try {
      const prod = await getProduct(productId);
      setProduct(prod)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  fetchProduct()
  }, [productId]);

  const handleBackToShop = () => {
  navigate('/shop')
  }

  if (loading) return <p>Loading product...</p>;
  if(error) return <p>{error}</p>;
  if (!product) return <p>Product not found.</p>;

  const cartItem = cartItems.find((item) => item.id === product.id);
  const stock = product.quantity;
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = quantityInCart >= stock;

  return (
    <div className="product-details">
      <img src={product.imageUrl} alt={product.name} />
      <div className="details">
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p><strong>Price:</strong> ${(product.price / 100).toFixed(2)}</p>
        <p><strong>Category:</strong> {product.category}</p>
        <button className='nav-link' disabled={isOutOfStock} onClick={() => addItem(product)}>
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
        <button className='nav-link' onClick={() => handleBackToShop()}>Back</button>
      </div>
    </div>
  )
}

export default ProductDetails