import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db, storage } from "../../utils/firebase/firebase.utils";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import './ProductEdit.styles.scss';

const ProductEdit = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [newImage, setNewImage] = useState(null);
  const [changesSaved, setChangesSaved] = useState(false);
  const [editedProduct, setEditedProduct] = useState(product);
  const [errorMessage, setErrorMessage] = useState(null);  // Error state for feedback

  const productDetailRef = doc(db, "Products", id);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const docSnapshot = await getDoc(productDetailRef);
        if (docSnapshot.exists()) {
          const dataRef = docSnapshot.data();
          setProduct(dataRef);
        } else {
          setErrorMessage("Product not found.");
        }
      } catch (error) {
        setErrorMessage("Failed to load product details.");
        console.error(error.message);
      }
    };
    getProduct();
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);
  };

  const uploadImageToStorage = async (file) => {
    try {
      const storageRef = ref(storage, `product_images/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setEditedProduct((prevState) => ({
        ...prevState,
        ProductImg: downloadURL,
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrorMessage("Failed to upload image.");
    }
  };

  const handleSaveChanges = async () => {
    try {
      if (newImage) {
        await uploadImageToStorage(newImage);
      }

      await setDoc(productDetailRef, editedProduct, { merge: true });
      setProduct(editedProduct);
      setChangesSaved(true);
      setErrorMessage(null);  // Clear any previous error
    } catch (error) {
      setErrorMessage("Error saving changes. Please try again.");
      console.error("Error saving changes:", error);
    }
  };

  return (
    <div className="product-edit-container">
      <div className="card product-edit-card" style={{ width: '100%' }}>
        <div className="card-header">
          <h2>{product.ProductName}</h2>
        </div>
        <div className="card-body">
          {errorMessage && (
            <div className="error-message alert alert-danger">{errorMessage}</div>
          )}
          <div className="form-group">
            <label htmlFor="ProductName">Product Name:</label>
            <input
              type="text"
              id="ProductName"
              className="form-control"
              name="ProductName"
              placeholder={product.ProductName || editedProduct.ProductName}
              value={editedProduct.ProductName}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="ProductPrice">Product Price:</label>
            <input
              type="text"
              id="ProductPrice"
              name="ProductPrice"
              placeholder={product.ProductPrice || editedProduct.ProductPrice}
              value={editedProduct.ProductPrice}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="ProductQuant">Product Quantity:</label>
            <input
              type="text"
              id="ProductQuant"
              name="ProductQuant"
              placeholder={product.ProductQuant || editedProduct.ProductQuant}
              value={editedProduct.ProductQuant}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="ProductImg">Product Image:</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {product.ProductImg || editedProduct.ProductImg ? (
              <img
                src={editedProduct.ProductImg}
                alt="Product"
                width="80"
                height="60"
              />
            ) : (
              <p>No image available</p>
            )}
          </div>
        </div>
        <div className="card-footer">
          <button onClick={handleSaveChanges} className="btn btn-primary">
            Save Changes
          </button>
          {changesSaved && (
            <div className="success-message">
              Changes saved!{" "}
              <Link to="/admin" className="btn btn-secondary">
                Back to Admin Page
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductEdit;
