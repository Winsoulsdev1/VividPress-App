'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'vividpress_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch (e) {
      // ignore corrupt storage
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, loaded]);

  function addItem(item) {
    // item: { productId, name, unitPrice, quantity, size, color, brandingRequested, brandingDetails }
    setItems((prev) => [...prev, { ...item, cartId: crypto.randomUUID() }]);
  }

  function removeItem(cartId) {
    setItems((prev) => prev.filter((i) => i.cartId !== cartId));
  }

  function updateQuantity(cartId, quantity) {
    setItems((prev) => prev.map((i) => (i.cartId === cartId ? { ...i, quantity } : i)));
  }

  function clearCart() {
    setItems([]);
  }

  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
