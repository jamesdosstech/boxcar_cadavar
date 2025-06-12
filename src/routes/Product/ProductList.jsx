import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { deleteProduct, getAllProducts } from '../../utils/firebase/firebase.utils';
import ProductCard from './ProductCard/ProductCard';
import './ProductList.scss';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    useEffect(() => {
        getAllProducts().then(setProducts)
    }, [])

    const handleDelete = async (id) => {
        await deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
    }

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter ? p.category === categoryFilter : true;
        return matchesSearch && matchesCategory
    })

    const categories = [...new Set(products.map(p => p.category))];

    return (
        <div style={{padding: '1rem', color: 'white'}}>
            <h2>Product Admin</h2>
            {/* <Link to="new-product">Add Product</Link> */}
            <div style={{marginBottom: '1rem', display: 'flex', gap: '1rem'}}>
                <input 
                    type="text" 
                    placeholder='Search by Name...' 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                />
                <select
                    style={{backgroundColor: 'white'}}
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="">
                        All Categories
                    </option>
                    {
                        categories.map(cat => (
                            <option
                                key={cat}
                                value={cat}
                            >
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                        ))
                    }
                </select>
            </div>
            <div className='product-grid'>
                {filteredProducts.map(product => (
                    <>
                        <ProductCard 
                            key={product.id} 
                            product={product}
                            actions={
                                <>
                                    <Link to={`edit/${product.id}`}>Edit</Link>
                                    <button style={{marginLeft: '0.5rem',backgroundColor: 'white'}} onClick={() => handleDelete(product.id)}>Delete</button>
                                </>
                            }
                        />
                    </>
                    
                ))}
            </div>
        </div>
    )
}

export default ProductList