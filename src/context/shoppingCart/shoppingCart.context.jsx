import { createContext, useContext, useReducer } from "react";

const CartContext = createContext();

const initialState = {
    cartItems: [],
};

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existingItem = state.cartItems.find(item => item.id === action.payload.id);
            if (existingItem) {
                return {
                    ...state,
                    cartItems: state.cartItems.map(item =>
                        item.id === action.payload.id ?
                        { ...item, quantity: item.quantity + 1} :
                        item
                    ),
                };
            }
            return {
                ...state,
                cartItems: [
                    ...state.cartItems,
                    {
                        ...action.payload, 
                        quantity: 1
                    }
                ],
            };
        }

        case 'REMOVE_ITEM':
            return {
                ...state,
                cartItems: state.cartItems.filter(item => item.id !== action.payload),
            };
        
        case 'CLEAR_CART':
            return initialState;

        case 'DECREMENT_ITEM': {
            const item = state.cartItems.find(i => i.id === action.payload);
            if (!item) return state;
            if (item.quantity === 1) {
                return {
                ...state,
                cartItems: state.cartItems.filter(i => i.id !== action.payload),
                };
            }
            return {
                ...state,
                cartItems: state.cartItems.map(i =>
                i.id === action.payload ? { ...i, quantity: i.quantity - 1 } : i
                ),
            };
        }

        default:
            return state;
    }
}

export const CartProvider = ({children}) => {
    const [state,dispatch] = useReducer(cartReducer, initialState);

    const addItem = item => dispatch({ type: 'ADD_ITEM', payload: item})
    const removeItem = item => dispatch({ type: 'REMOVE_ITEM', payload: item})
    const decrementItem = item => dispatch({ type: 'DECREMENT_ITEM', payload: item})
    const clearCart = () => dispatch({ type: 'CLEAR_CART'})

    return (
        <CartContext.Provider
            value={{ cartItems: state.cartItems, addItem, removeItem, decrementItem, clearCart}}
        >
            {children}
        </CartContext.Provider>
    )
}   

export const useCart = () => useContext(CartContext);
