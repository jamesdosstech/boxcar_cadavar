import React from 'react'
import { useNavigate } from 'react-router-dom'
import ProductForm from './ProductForm/ProductForm';
import { createProduct } from '../../utils/firebase/firebase.utils';

const ProductNew = () => {
    const navigate = useNavigate();

    const handleCreate = async (data) => {
        await createProduct(data)
        navigate('/admin/products')
    }
  return (
    <ProductForm onSave={handleCreate} />
  )
}

export default ProductNew