import { doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { db, storage } from '../../utils/firebase/firebase.utils';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const ProductEdit = () => {
    const {id} = useParams();
    const [product, setProduct] = useState({})
    const [newImage, setNewImage] = useState(null);
    const [changesSaved, setChangesSaved] = useState(false); // Track changes saved
    const [editedProduct, setEditedProduct] = useState(product); // For editing changes
    const productDetailRef = doc(db, 'Products', id);

    useEffect(() => {
      const getProduct = async () => {
        try {
          const docSnapshot = await getDoc(productDetailRef)
          if (docSnapshot.exists()) {
            const dataRef = docSnapshot.data();
            setProduct(dataRef);     
          } else {
            return;
          }
        } catch (error) {
          console.log(error.message)
        }
      }
      getProduct()
      console.log('product ',product)
    },[newImage]);
    
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      // Update the editedProduct state with the new value
      setEditedProduct({ ...editedProduct, [name]: value });
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
        console.log('downloadUrl: ',downloadURL)
        // Set the editedProduct state with the new image URL
        setEditedProduct({ ...editedProduct, ProductImg: downloadURL });
        console.log('editedProduct from updloadImageStorage: ',editedProduct)
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    };

    const handleSaveChanges = async () => {
      try {
        // Upload the new image to Firebase Storage
        if (newImage) {
          await uploadImageToStorage(newImage);
          console.log('new image uploaded', editedProduct.ProductImg)
        }
  
        // Save the changes to the Firestore database
        await setDoc(productDetailRef, editedProduct, { merge: true });
        console.log('Document updated:', editedProduct)
        // Update the product state to reflect the changes
        setProduct(editedProduct);
        setChangesSaved(true);
      } catch (error) {
        // Handle any errors that occur during data update
        console.error('Error saving changes:', error);
      }
    };

    return (
      <div className="card">
      <div className="card-header">
        <h2>{product.ProductName}</h2>
      </div>
      <div className="card-body">
        <div className="form-group">
          <label htmlFor="ProductName">Product Name:</label>
          <input
            type="text"
            id="ProductName"
            name="ProductName"
            placeholder={product.ProductName || editedProduct.ProductName}
            value={editedProduct.ProductName }
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
          <label htmlFor="ProductImg">Product Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <img src={product.ProductImg || editedProduct.ProductImg} width={'80px'} height={'60'} alt="" />
        </div>
      </div>
      <div className="card-footer">
        <button onClick={handleSaveChanges} className="btn btn-primary">
          Save Changes
        </button>
        {changesSaved && (
          <div>
            Changes saved!{' '}
            <Link to="/admin" className="btn btn-secondary">
              Back to Admin Page
            </Link>
          </div>
        )}
      </div>
    </div>
    )
}

export default ProductEdit