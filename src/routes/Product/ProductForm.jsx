import React, { useState } from 'react'
import './ProductForm.scss'
import Label from './Label';

const ProductForm = ({ initialData = {}, mode = 'create', onSave}) => {
  const [name, setName] = useState(initialData.name || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [price, setPrice] = useState(initialData.price || 0);
  const [currency, setCurrency] = useState(initialData.currency || 'usd');
  const [imageUrl, setImageUrl] = useState(initialData.imageUrl || '');
  const [category, setCategory] = useState(initialData.category || '')
  const [quantity, setQuantity] = useState(initialData.quantity || '')
  const [active, setActive] = useState(initialData.active ?? true);
  const categories = ['shirts', 'canvas', 'prints', 'stickers'];
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, description, price: Number(price), imageUrl, currency, category, quantity})
  }
    return (
    <div className='product-form-container'>
      <h2>{mode === 'edit' ? 'Edit Product' : 'Add New Product'}</h2>
      <form onSubmit={handleSubmit}>
          <Label label={'Name'} value={name} func={(e) => setName(e.target.value)}/>
          <Label label={'Description'} value={description} func={(e) => setDescription(e.target.value)}/>
          <Label label={'Currency'} value={currency} func={(e) => setCurrency(e.target.value)}/>
          <Label label={'Image Url'} value={imageUrl} func={(e) => setImageUrl(e.target.value)}/>
          <Label label={'Price (in cents)'} value={price} func={(e) => setPrice(e.target.value)}/>
          <Label label={'Quantity'} value={quantity} func={(e) => setQuantity(e.target.value)}/>
          <div className='form-group'>
            <label className='form-label'>Category</label>
            <select name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Select a category</option>
              {categories.map((cat, idx) => (
                <option style={{backgroundColor: 'white'}} key={idx} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <button type='submit'>
              {mode === 'edit' ? 'Update' : 'Create'} Product
          </button>
      </form>  
    </div>
    
  )
}

export default ProductForm