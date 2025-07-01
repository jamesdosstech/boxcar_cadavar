import { createContext, useContext, useEffect, useReducer } from "react";

const CartContext = createContext();

const initialState = {
    cartItems: [],
};

const getInitialCartState = () => {
  try {
    const storedCart = localStorage.getItem('cart');
    const parsed = storedCart ? JSON.parse(storedCart) : null;

    // Validate shape: must be an object with cartItems as an array
    if (parsed && Array.isArray(parsed.cartItems)) {
      return parsed;
    }
  } catch (error) {
    console.error("Failed to parse cart from localStorage:", error);
  }

  return { cartItems: [] }; // fallback initial state
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
    // This tells React: use cartReducer, start from undefined, call getInitialCartState()
    const [state,dispatch] = useReducer(cartReducer, undefined, getInitialCartState);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(state));
    }, [state]);

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
