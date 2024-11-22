import React from "react";
import { useProductsContext } from "../../context/product/product.context";
import "./DoosetrainStore.styles.scss";
import ProductCard from "../../components/ProductCard/ProductCard.component";
import UnderConstruction from "../../components/under-construction/under-contstruction.component";

const DoosetrainStore = () => {
  const { productsMap = [], loading = true } = useProductsContext();

  // Group products by category if category data exists
  const categorizedProducts = productsMap.reduce((acc, product) => {
    const category = product.ProductCategory || "Uncategorized"; // Default to 'Uncategorized' if no category
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  return (
    <div className="doosetrain-store">
      <h2 className="store-title">Shop</h2>
      <div className="products-container">
        {loading ? (
          <p className="loading-message">Loading products...</p>
        ) : Object.keys(categorizedProducts).length > 0 ? (
          Object.keys(categorizedProducts).map((category) => {
            const products = categorizedProducts[category];

            return (
              <div key={category} className="category-section">
                <h3 className="category-title">{category}</h3>
                <div className="products-grid">
                  {products.length > 0 ? (
                    products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))
                  ) : (
                    <p>No products available in this category.</p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <UnderConstruction />
        )}
      </div>
    </div>
  );
};

export default DoosetrainStore;
