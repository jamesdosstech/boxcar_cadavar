import React, { useState } from 'react'
import { db, storage } from '../../utils/firebase/firebase.utils'
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';

const DBNewItems = () => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [productDesc, setProductDescription] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [productImg, setProductImg] = useState(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const types = ['image/png', 'image/jpeg'];

  const addProduct = (e) => {
    e.preventDefault();
    const file = e.target[0].files[0];
    if(file && types.includes(file.type)){
      setProductImg(file);
      uploadFile(file);
      setError('');
    }
    else {
      setProductImg(null);
      setError('Please select a valid image type png or jpeg')
    }
    
    // const imageRef = ref(storage, `images/${productImg.name}`);

  }

  const uploadFile = (file) => {
    if(!file) return;
    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on("state_changed", (snapshot) => {
      const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(prog)
    }, 
    (err) => console.log(err),
    () => {
      getDownloadURL(uploadTask.snapshot.ref)
      .then(url => {
        setProductImg(url);
        addDoc(collection(db, 'Products'), {
          ProductName: productName,
          ProductPrice: Number(productPrice),
          ProductImg: url,
          ProductQuant: Number(quantity),
          ProductDesc: productDesc
        }).then(() => {
          setProductImg(null);
          setProductName('');
          setProductPrice(0);
          setQuantity(0);
          setProductDescription('')
          setError('');
          setProgress(0)
          document.getElementById('file').value = '';
        }).catch(err => setError(err.message))
      })
    }
    )
  }

  return (
    <div className="container" data-bs-theme="dark">
      <div className="card" style={{width: '100%'}}>
        <div className="card-header">
          <h2>Db New Items</h2>
        </div>
        <div className="card-body">
      <form autoComplete="off" className="form-group" onSubmit={addProduct}>
        <div className="mb-3">
          <label htmlFor="file" className="form-label">
            Product Image
          </label>
          <input id="file" type="file" className="form-control" />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="product-name" className="form-label">
            Product Name
          </label>
          <input
            className="form-control"
            type="text"
            id="product-name"
            required
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="product-price" className="form-label">
            Product Price
          </label>
          <input
            className="form-control"
            type="number"
            id="product-price"
            required
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="quantity" className="form-label">
            Quantity
          </label>
          <input
            className="form-control"
            type="number"
            id="quantity"
            required
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="product-desc" className="form-label">
            Description
          </label>
          <input
            className="form-control"
            type="text"
            id="product-desc"
            required
            value={productDesc}
            onChange={(e) => setProductDescription(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add
        </button>
      </form>
      {progress > 0 && <h3>Uploaded {progress} %</h3>}
      {error && <span>{error}</span>}
    </div>
      </div></div>
  )
}

export default DBNewItems