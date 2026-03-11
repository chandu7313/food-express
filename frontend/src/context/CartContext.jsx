import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ items: [], totalAmount: 0 });
    const { userInfo } = useContext(AuthContext);

    useEffect(() => {
        if (userInfo) {
            fetchCart();
        } else {
            setCart({ items: [], totalAmount: 0 });
        }
    }, [userInfo]);

    const fetchCart = async () => {
        try {
            const { data } = await api.get('/cart');
            setCart(data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    const addToCart = async (foodId, quantity) => {
        try {
            await api.post('/cart/add', { foodId, quantity });
            
            await fetchCart();
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    };

    const removeFromCart = async (foodId) => {
        try {
            await api.delete(`/cart/remove/${foodId}`);
            
            await fetchCart();
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    const clearCart = () => {
        setCart({ items: [], totalAmount: 0 });
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};
