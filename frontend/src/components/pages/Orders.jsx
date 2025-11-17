import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
const { VITE_API_URL } = import.meta.env;

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const response = await fetch(`${VITE_API_URL}/order/${userId}`);
        const data = await response.json();

        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-xl">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error}</p>
          <a
            href="/"
            className="inline-block bg-cyan-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-700 transition"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-cyan-800 mb-4">
            No Orders Yet
          </h2>
          <p className="text-gray-600 mb-6">
            You haven't placed any orders yet.
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
          Your Orders
        </h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="text-lg font-semibold text-cyan-800">
                      {order._id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="text-lg font-semibold">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-lg font-semibold text-cyan-800">
                      ₹ {order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Items ({order.items.length})
                </h3>
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
                    >
                      <img
                        src={`${VITE_API_URL}/${item.image}`}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg mr-4"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.qty}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ₹{(item.price * item.qty).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          ₹ {item.price} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
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
