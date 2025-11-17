import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const CartContext = createContext();

const { VITE_API_URL } = import.meta.env;

const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        setUserId(decoded.id);
        loadCartFromDatabase(decoded.id);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const loadCartFromDatabase = async (id) => {
    try {
      const response = await fetch(`${VITE_API_URL}/cart/${id}`);
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        const formattedItems = data.items.map((item) => ({
          product: {
            _id: item.productId,
            name: item.name,
            price: item.price,
            image: item.image,
          },
          quantity: item.qty,
        }));
        setCartItems(formattedItems);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    setCartItems((prev) => {
      const existingItem = prev.find(
        (item) => item.product._id === product._id
      );
      if (existingItem) {
        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    if (userId) {
      try {
        const response = await fetch(`${VITE_API_URL}/cart/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            productId: product._id,
            quantity,
          }),
        });
        const data = await response.json();
        if (data.items) {
          const formattedItems = data.items.map((item) => ({
            product: {
              _id: item.productId,
              name: item.name,
              price: item.price,
              image: item.image,
            },
            quantity: item.qty,
          }));
          setCartItems(formattedItems);
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );

    if (userId) {
      try {
        const response = await fetch(`${VITE_API_URL}/cart/update`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            productId,
            quantity,
          }),
        });
        const data = await response.json();
        if (data.items) {
          const formattedItems = data.items.map((item) => ({
            product: {
              _id: item.productId,
              name: item.name,
              price: item.price,
              image: item.image,
            },
            quantity: item.qty,
          }));
          setCartItems(formattedItems);
        }
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    }
  };

  const removeFromCart = async (productId) => {
    setCartItems((prev) =>
      prev.filter((item) => item.product._id !== productId)
    );

    if (userId) {
      try {
        const response = await fetch(`${VITE_API_URL}/cart/remove`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            productId,
          }),
        });
        const data = await response.json();
        if (data.items) {
          const formattedItems = data.items.map((item) => ({
            product: {
              _id: item.productId,
              name: item.name,
              price: item.price,
              image: item.image,
            },
            quantity: item.qty,
          }));
          setCartItems(formattedItems);
        }
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const clearCart = async () => {
    setCartItems([]);

    if (userId) {
      try {
        await fetch(`${VITE_API_URL}/cart/clear`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });
      } catch (error) {
        console.error("Error clearing cart:", error);
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        getTotalItems,
        getTotalPrice,
        clearCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
