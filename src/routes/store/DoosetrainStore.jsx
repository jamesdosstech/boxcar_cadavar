import React, { useEffect, useState } from "react";
import { useProductsContext } from "../../context/product/product.context";
import "./DoosetrainStore.styles.scss";
import UnderConstruction from "../../components/under-construction/under-contstruction.component";
import { getAllProducts } from "../../utils/firebase/firebase.utils";
import ProductCard from "../Product/ProductCard/ProductCard";
import { useCart } from "../../context/shoppingCart/shoppingCart.context";
import { Link, NavLink } from "react-router-dom";

const DoosetrainStore = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [addedProduct, setAddedProduct] = useState(null);

  //context action
  const { addItem } = useCart()


  useEffect(() => {
    getAllProducts().then(setProducts)
  },[]);

  const handleAddToCart = (product) => {
    console.log('added ', product)
    addItem(product);
    setAddedProduct(product.name);
    setTimeout(() => setAddedProduct(null), 2000)
  }

  const categories = [...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="shop-container">
      <div className="shop-title">Shop All Products</div>
      <div className="shop-filters">
        <input
          style={{backgroundColor: 'white'}}
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          style={{backgroundColor: 'white'}}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="shop-grid">
        {filteredProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product}
            actions={
              <>
                <button
                  className="nav-link"
                  // className="add-to-cart-button"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
                <NavLink
                  to={`/product/${product.id}`}
                >
                  Details
                </NavLink>
              </>
            }
          />
        ))}
        {addedProduct && <div className="add-notification">Added {addedProduct} to cart</div>}
      </div>
    </div>
  );
};

export default DoosetrainStore;
