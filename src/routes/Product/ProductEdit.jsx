import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProductForm from './ProductForm/ProductForm';
import { getProduct, updateProduct } from '../../utils/firebase/firebase.utils';

const ProductEdit = () => {
    const {productId} = useParams();
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!productId) {
            console.error("Product ID is undefined");
            return;
          }
        
          getProduct(productId)
            .then(data => {
              if (!data) {
                console.warn("No product found for ID:", productId);
              }
              setProduct(data);
            })
            .catch(err => console.error("Error fetching product:", err));
    }, [productId]);

    const handleUpdate = async (data) => {
        await updateProduct(productId, data);
        navigate('/admin/products');
    };

    if(!product) return <p>Loading...</p>;

    return <ProductForm initialData={product} mode='edit' onSave={handleUpdate}/>;
}

export default ProductEdit