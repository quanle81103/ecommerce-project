import { createContext, useContext, useState } from "react";
import { getCart, addItem } from "../services/dataService";

// return a context object 
const CartContext = createContext();

// store all cart state
export function CartProvider({ children }) {
    const [cart, setCart] = useState(null);

    const loadCart = async () => {
        const res = await getCart();
        setCart(res);
    };

    const addToCart = async (productId, quantity) => {
        await addItem(productId, quantity);
        await loadCart();
    };

    return (
        <CartContext.Provider value={{ cart, loadCart, addToCart }}>
            {children}
        </CartContext.Provider>
    )
}

// Components can read context by passing it to useContext();
export function useCart() {
    return useContext(CartContext);
}