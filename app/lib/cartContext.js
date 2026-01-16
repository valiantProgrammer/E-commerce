'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from './api';
import Cookies from 'js-cookie';

const CartContext = createContext();

// A custom hook to make it easy to use the cart context in any component
export const useCart = () => useContext(CartContext);

// The provider component that will wrap your application
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetches the user's cart from the API
    const fetchCart = useCallback(async () => {
        // Only fetch if a user is logged in (an accessToken cookie exists)
        const token = Cookies.get('accessToken');
        if (!token) {
            setCart(null); // Clear cart data if the user is logged out
            setLoading(false);
            return;
        }

        try {
            const cartData = await authApi.getCart();
            setCart(cartData);
        } catch (error) {
            console.error('Failed to fetch cart:', error);
            // Clear the cart state on error (e.g., if the token is invalid)
            setCart(null); 
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch when the component mounts
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // A single function to handle all cart updates (add, remove, update quantity)
    const updateCartState = async (action, productId, quantity) => {
        try {
            const updatedCart = await authApi.updateCart(action, productId, quantity);
            setCart(updatedCart); // Update the global state with the new cart
            return updatedCart;
        } catch (error) {
            console.error(`Failed to ${action} cart item:`, error);
            await fetchCart(); // Re-fetch cart to ensure consistency on error
            throw error;
        }
    };

    const value = {
        cart,
        loading,
        fetchCart,
        updateCart: updateCartState,
        // We calculate the number of unique items here for the badge
        itemCount: cart?.items?.length || 0,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};