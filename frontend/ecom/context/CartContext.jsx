import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { addItem, getCart, removeCartItem, updateCartItem } from "../services/dataService";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const [cart, setCart] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const loadCart = useCallback(async () => {
        if (!isAuthenticated) {
            setCart(null);
            return null;
        }
        setIsLoading(true);
        try {
            const response = await getCart();
            setCart(response);
            return response;
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    const addToCart = useCallback(async (productId, quantity) => {
        await addItem(productId, quantity);
        return loadCart();
    }, [loadCart]);
    const updateQuantity = useCallback(async (productId, quantity) => {
        await updateCartItem(productId, quantity);
        return loadCart();
    }, [loadCart]);
    const removeItem = useCallback(async (productId) => {
        await removeCartItem(productId);
        return loadCart();
    }, [loadCart]);

    const value = useMemo(() => ({
        cart, isLoading, loadCart, addToCart, updateQuantity, removeItem
    }), [cart, isLoading, loadCart, addToCart, updateQuantity, removeItem]);
    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used inside CartProvider");
    return context;
}
