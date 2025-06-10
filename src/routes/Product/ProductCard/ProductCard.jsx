import React from 'react';
import './ProductCard.scss'; // create this for custom styles

const ProductCard = ({ product, actions }) => {
  return (
    <div className="product-card">
      <img src={product.imageUrl} alt={product.name} />
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="description">{product.description.slice(0, 100)}...</p>
        <p><strong>Price:</strong> {(product.price / 100).toFixed(2)} {product.currency.toUpperCase()}</p>
        <p><strong>Category:</strong> {product.category}</p>
        <p><strong>Quantity:</strong> {product.quantity ?? 'N/A'}</p>
        {actions && <div className='product-actions'>{actions}</div>}
      </div>
    </div>
  );
};

export default ProductCard;
