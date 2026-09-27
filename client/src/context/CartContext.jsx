import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('khangcoffee_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTable, setActiveTable] = useState(() => {
    return localStorage.getItem('khangcoffee_table') || null;
  });

  useEffect(() => {
    localStorage.setItem('khangcoffee_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (activeTable) {
      localStorage.setItem('khangcoffee_table', activeTable);
    } else {
      localStorage.removeItem('khangcoffee_table');
    }
  }, [activeTable]);

  const addToCart = (product, quantity = 1, options = {}) => {
    setCart(prevCart => {
      // Generate a unique item key based on product id and options
      const optionKey = JSON.stringify(options);
      const existingIndex = prevCart.findIndex(
        item => item.id === product.id && JSON.stringify(item.options) === optionKey
      );

      if (existingIndex > -1) {
        return prevCart.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [
          ...prevCart,
          {
            cartItemId: Date.now() + Math.random(),
            id: product.id,
            name: product.name,
            price: product.price,
            image_url: product.image_url,
            quantity,
            options
          }
        ];
      }
    });
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item => item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item)
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart(prevCart => prevCart.filter(item => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalAmount,
        totalCount,
        activeTable,
        setActiveTable
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
