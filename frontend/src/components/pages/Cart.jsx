import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { jwtDecode } from "jwt-decode";
const { VITE_API_URL } = import.meta.env;

export default function Cart() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    clearCart,
  } = useContext(CartContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const totalPrice = getTotalPrice();

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const response = await fetch(`${VITE_API_URL}/order/place`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (response.ok) {
        await clearCart();
        navigate("/orders");
      } else {
        alert(data.msg || "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-cyan-800 mb-4">
            Your Cart is Empty
          </h2>
          <p className="text-gray-600 mb-6">
            Add some products to get started!
          </p>
          <a
            href="/"
            className="inline-block bg-cyan-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-700 transition"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-cyan-800 mb-8 text-center">
          Shopping Cart
        </h1>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            {cartItems.map((item) => (
              <div
                key={item.product._id}
                className="flex items-center border-b border-gray-200 py-4 last:border-b-0"
              >
                <img
                  src={`${VITE_API_URL}/${item.product.image}`}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-lg mr-4"
                />

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.product.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {item.product.description}
                  </p>
                  <p className="text-cyan-800 font-semibold">
                    ${item.product.price}
                  </p>
                </div>

                <div className="flex items-center mr-4">
                  <button
                    onClick={() =>
                      updateQuantity(item.product._id, item.quantity - 1)
                    }
                    className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
                  >
                    -
                  </button>
                  <span className="mx-3 font-semibold">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.product._id, item.quantity + 1)
                    }
                    className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
                  >
                    +
                  </button>
                </div>

                <div className="text-right mr-4">
                  <p className="font-semibold text-lg">
                    ₹ {(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(item.product._id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-800 font-semibold transition"
            >
              Clear Cart
            </button>

            <div className="text-right">
              <p className="text-2xl font-bold text-cyan-800">
                Total: ${totalPrice.toFixed(2)}
              </p>
              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="mt-2 bg-cyan-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Processing..." : "Proceed to Checkout"}
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <a
            href="/"
            className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    </div>
  );
}
