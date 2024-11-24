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
      {/* Store Header */}
      <header className="store-header">
        <h2 className="store-title glitch" data-text="Shop">
          Shop
        </h2>
      </header>

      <div className="products-container">
        {/* Loading State */}
        {loading ? (
          <p className="loading-message">Loading products...</p>
        ) : Object.keys(categorizedProducts).length > 0 ? (
          // Categories Section
          Object.keys(categorizedProducts).map((category) => {
            const products = categorizedProducts[category];

            return (
              <div key={category} className="category-section">
                <h3 className="category-title glitch" data-text={category}>
                  {category}
                </h3>
                <div className="products-grid">
                  {products.length > 0 ? (
                    products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))
                  ) : (
                    <p className="empty-category-message">
                      No products available in this category.
                    </p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          // No Products Fallback
          <UnderConstruction />
        )}
      </div>
    </div>
  );
};

export default DoosetrainStore;
