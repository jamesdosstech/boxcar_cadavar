import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../../utils/firebase/firebase.utils";
import { collection, getDocs } from "firebase/firestore";

export const ProductsContext = createContext();

export function useProductsContext() {
    return useContext(ProductsContext)
}

export const ProductsProvider = ({children, collectionName}) => {
    const [productsMap, setProductsMap] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const getProductsMap = async () => {
            const q = collection(db, collectionName);
            try {
                const querySnapshot = await getDocs(q);
                const collectionData = [];
                querySnapshot.forEach((doc) => {
                    collectionData.push({ id: doc.id, ...doc.data() });
                });
                setProductsMap(collectionData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }finally {
                setLoading(false);
            }
        }
        getProductsMap();
    }, []);
    const value = { productsMap, loading }
    return (
        <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
    )
}

