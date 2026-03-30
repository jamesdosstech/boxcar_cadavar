import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../utils/firebase/firebase.utils";
import "./Products.styles.scss";

const initialFormState = {
  name: "",
  type: "",
  description: "",
  price: "",
  quantity: "",
  image: null,

  // NEW ARTWORK FIELDS
  isPublished: true,
  showInGallery: false,
  showInStore: true,
  featured: false,
  status: "available",
  collection: "",
  medium: "",
  dimensions: "",
  year: "",
  tags: [],
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getDocs(collection(db, "products"));
      setProducts(
        data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    };
    fetchProducts();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Handle product submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('start of submit')
    try {
      let imageUrl = currentProduct?.image || null;

      if (formData.image && formData.image instanceof File) {
        // const storageRef = ref(storage, `images/${file.name}`);
        // Upload image to Firebase Storage
        const imageRef = ref(storage, `images/${formData.image.name}`);
        const uploadTask = uploadBytesResumable(imageRef, formData.image);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              setUploadProgress(progress);
            },
            reject,
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      const productData = {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        year: String(formData.year).trim(),
        tags: Array.isArray(formData.tags) ? formData.tags : [],
        image: imageUrl,
      };

      if (isEditing) {
        // Update product
        const productRef = doc(db, "products", currentProduct.id);
        await updateDoc(productRef, productData);
        setProducts(
          products.map((product) =>
            product.id === currentProduct.id ? { ...product, ...productData } : product
          )
        );
      } else {
        // Add new product
        const docRef = await addDoc(collection(db, "products"), productData);
        setProducts([...products, { id: docRef.id, ...productData }]);
      }

      resetForm();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // Reset form to default state
  const resetForm = () => {
    setFormData(initialFormState);
    setUploadProgress(0);
    setIsEditing(false);
    setCurrentProduct(null);
  };

  // Handle product editing
  const handleEdit = (product) => {
    setIsEditing(true);
    setCurrentProduct(product);

    setFormData({
      ...initialFormState,
      ...product,
      tags: Array.isArray(product.tags) ? product.tags : [],
    });
  };

  // Handle product deletion
  const handleDelete = async (productId) => {
    try {
      await deleteDoc(doc(db, "products", productId));
      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="products-page">
      <h1>Products Management</h1>

      {/* Product List */}
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
            />
            <div className="product-details">
              <h3>{product.name}</h3>
              <p>Type: {product.type}</p>
              <p>{product.description}</p>
              <p>Price: ${product.price}</p>
              <p>Quantity: {product.quantity}</p>
              <button
                className="btn btn-edit"
                onClick={() => handleEdit(product)}
              >
                Edit
              </button>
              <button
                className="btn btn-delete"
                onClick={() => handleDelete(product.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Product Form */}
      <div className="product-form">
        <h2>{isEditing ? "Edit Product" : "Add New Product"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Type</label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) =>
                  setFormData({ ...formData, isPublished: e.target.checked })
                }
              />
              Published
            </label>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.showInStore}
                onChange={(e) =>
                  setFormData({ ...formData, showInStore: e.target.checked })
                }
              />
              Show in Store
            </label>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.showInGallery}
                onChange={(e) =>
                  setFormData({ ...formData, showInGallery: e.target.checked })
                }
              />
              Show in Gallery
            </label>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
              />
              Featured
            </label>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="archive">Archive</option>
              <option value="coming_soon">Coming Soon</option>
            </select>
          </div>

          <div className="form-group">
            <label>Collection</label>
            <input
              type="text"
              name="collection"
              value={formData.collection}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Medium</label>
            <input
              type="text"
              name="medium"
              value={formData.medium}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Dimensions</label>
            <input
              type="text"
              name="dimensions"
              value={formData.dimensions}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Year</label>
            <input
              type="text"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Image</label>
            <input type="file" onChange={handleFileChange} required />
            {uploadProgress > 0 && (
              <progress value={uploadProgress} max="100">
                {uploadProgress}%
              </progress>
            )}
          </div>
          <button type="submit" className="btn btn-save">
            {isEditing ? "Update Product" : "Add Product"}
          </button>
          {isEditing && (
            <button
              type="button"
              className="btn btn-cancel"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Products;
