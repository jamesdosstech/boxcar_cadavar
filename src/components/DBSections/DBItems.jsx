import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../utils/firebase/firebase.utils";
import { Link } from "react-router-dom";

// import './DBitems.styles.scss';

const DBItems = () => {
  const [products, setProducts] = useState([]);
  const productCollectionRef = collection(db, "Products");

  useEffect(() => {
    const getProducts = async () => {
      const data = await getDocs(productCollectionRef);
      console.log(data, 'data');
      setProducts(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
      console.log(products);
    };

    getProducts();
  }, []);

  return (
    <div className="card-container">
      {products.map((product) => (
        <div key={product.id} className="card">
          <img
            src={product.ProductImg}
            alt={product.ProductName}
            className="card-img-top"
            height="200px"
          />
          <div className="card-body">
            <h5 className="card-title">{product.ProductName}</h5>
            <p className="card-text">{product.ProductDesc}</p>
            <p className="card-text">Price: ${product.ProductPrice}</p>
            <p className="card-text">Quantity: {product.ProductQuant}</p>
            <Link to={`/admin/Products/${product.id}`} className="btn btn-edit">
              Edit
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DBItems;
