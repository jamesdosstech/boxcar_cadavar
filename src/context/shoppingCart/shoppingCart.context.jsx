import { createContext, useContext, useEffect, useState } from "react";

export const addCartItems = (cartItems, productToAdd) => {
    console.log(
        cartItems, ' cartItems_var ',
        productToAdd, ' productToAddVar '
    )
    const existingCartItems = cartItems.find(
        (cartItem) => cartItem.id === productToAdd.id
    );
    // If found, increment quantity
    if (existingCartItems) {
        if (productToAdd.ProductQuant > existingCartItems.quantity) {
            console.log('existingCartItem_var ', existingCartItems)
            return cartItems.map((cartItem) =>
                cartItem.id === productToAdd.id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem           
            )
        } 
        return cartItems;
    }
    return [ ...cartItems, { ...productToAdd, quantity: 1 }]
}

export const removeCartItems = (cartItems, cartItemToRemove) => {
    const existingCartItems = cartItems.find(
        (cartItem) => cartItem.id === cartItemToRemove.id
    );

    if (existingCartItems.quantity === 1) {
        return cartItems.filter((cartItem) => cartItem.id !== cartItemToRemove.id);
    };

    return cartItems.map((cartItem) => 
        cartItem.id === cartItemToRemove.id
        ? {...cartItem, quantity: cartItem.quantity - 1}
        : cartItem
    )
}

export const clearCartItems = (cartItems, cartItemToClear) => {
    return cartItems.filter((cartItem) => cartItem.id !== cartItemToClear.id);
}

export const ShoppingCartContext = createContext({
    cartItems: [],
    addItemstoCart: () => {},
    cartCount: 0,
    removeItemsFromCart: () => {},
    clearItemsFromCart: () => {},
    cartTotal: 0,
});

export const CartProvider = ({children}) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [cartTotal, setCartTotal] = useState(0);

    useEffect(() => {
        const newCartCount = cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0)
        setCartCount(newCartCount)
    },[cartItems]);

    useEffect(() => {
        const newCartTotal = cartItems.reduce((total, cartItem) => total + cartItem.quantity * cartItem.price, 0);
        setCartTotal(newCartTotal)
    }, [cartItems])

    const addItemstoCart = (productToAdd) => {
        setCartItems(addCartItems(cartItems, productToAdd))
    }

    const removeItemsFromCart = (cartItemToRemove) => {
        setCartItems(removeCartItems(cartItems, cartItemToRemove))
    }

    const clearItemsFromCart = (cartItemToClear) => {
        setCartItems(clearCartItems(cartItems, cartItemToClear));
    }

    const value = {addItemstoCart, cartItems, cartCount, cartTotal, removeItemsFromCart, clearItemsFromCart};
    return <ShoppingCartContext.Provider value={value}>{children}</ShoppingCartContext.Provider>
}

// export const ShoppingCartProvider = ({children}) => {

// }