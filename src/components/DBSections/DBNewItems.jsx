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
    <div>
      <h2>Db New Items</h2>
      <form 
        autoComplete='off'
        className='form-group'
        onSubmit={addProduct}
      >
        <input id='file' type="file"/>
        <br />
        <label htmlFor="product-name">Product Name</label>
        <br />
        <input className='form-control' type="text" required value={productName} onChange={(e) => setProductName(e.target.value)} />
        <label htmlFor="product-price">Product Price</label>
        <br />
        <input className='form-control' type="number" required value={productPrice} onChange={(e) => setProductPrice(e.target.value)} />
        <br />
        <label htmlFor="product-price">Quantity</label>
        <br />
        <input className='form-control' type="number" required value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        <br />
        <label htmlFor="product-price">Description</label>
        <br />
        <input className='form-control' type="text" required value={productDesc} onChange={(e) => setProductDescription(e.target.value)} />
        <br />
        <button>Add</button>
      </form>
      {
        progress.length > 0 && <h3>Uploaded {progress} %</h3>
      }
      {error && <span>{error}</span>}
    </div>
  )
}

export default DBNewItems