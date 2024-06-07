import React from "react";
import { useProductsContext } from "../../context/product/product.context";
import "./DoosetrainStore.styles.scss";
import ProductCard from "../../components/ProductCard/ProductCard.component";
import UnderConstruction from "../../components/under-construction/under-contstruction.component";

const DoosetrainStore = () => {
  const { productsMap, loading } = useProductsContext();

  return (
    <div>
      <h2>Shop</h2>
      <div className="products-container">
        {/* <UnderConstruction /> */}
        {loading ? (
          <p>loading...</p>
        ) : (
          <>
            {/* productsMap.map((product) => {
            return <ProductCard key={product.id} product={product} />;
          }) */}
            <UnderConstruction />
          </>
        )}
      </div>
    </div>
  );
};

export default DoosetrainStore;
