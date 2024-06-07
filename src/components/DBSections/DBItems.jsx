import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../utils/firebase/firebase.utils";
import { Link } from "react-router-dom";

import './DBitems.styles.scss'

const DBItems = () => {
  const [products, setProducts] = useState([]);
  const productCollectionRef = collection(db, "Products");
  useEffect(() => {
    const getProducts = async () => {
      const data = await getDocs(productCollectionRef);
      console.log(data, 'data')
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
    <div className="card-container" data-bs-theme="dark">
      {products.map((product) => (
        <div key={product.id} className="card" style={{width: '18rem'}}>
          <img src={product.ProductImg} height={'200px'} alt="" className="card-img-top" />
          <div className="card-body">
            <h5 className="card-title">{product.ProductName}</h5>
            <p className="card-text">{product.ProductDesc}</p>
            <p className="card-text">Price: {product.ProductPrice}</p>
            <p className="card-text">Quantity: {product.ProductQuant}</p>
            <Link to={`/admin/Products/${product.id}`} className="btn btn-primary">Edit</Link>
          </div>
        </div>
        // <Link
        //   key={product.id}
        //   style={{ color: "white" }}
        //   to={`/admin/Products/${product.id}`}
        // >
        //   {product.ProductName}
        // </Link>
      ))}
    </div>
  );
};

export default DBItems;
