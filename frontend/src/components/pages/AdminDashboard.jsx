import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    desc: "",
    image: null,
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchAllOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchAllOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/order/admin/all`);
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.price ||
      !formData.desc ||
      !formData.image
    ) {
      setMessage("All fields are required");
      return;
    }

    const form = new FormData();
    form.append("name", formData.name);
    form.append("price", formData.price);
    form.append("desc", formData.desc);
    form.append("image", formData.image);

    try {
      const response = await fetch(`${API_URL}/products/add`, {
        method: "POST",
        body: form,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Product added successfully!");
        setFormData({
          name: "",
          price: "",
          desc: "",
          image: null,
        });
        fetchProducts();
      } else {
        setMessage(data.error || "Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage("Error adding product");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-cyan-800">Admin Dashboard</h1>
        </div>

        <div className="flex border-b border-gray-300 mb-6">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === "products"
                ? "border-b-2 border-cyan-800 text-cyan-800"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === "orders"
                ? "border-b-2 border-cyan-800 text-cyan-800"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            All Orders ({orders.length})
          </button>
        </div>

        {activeTab === "products" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-cyan-800 mb-6">
                Add New Product
              </h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-800"
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-800"
                />
                <textarea
                  name="desc"
                  placeholder="Product Description"
                  value={formData.desc}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-800"
                />
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-800"
                  />
                  {formData.image && (
                    <p className="text-sm text-gray-600 mt-2">
                      Selected: {formData.image.name}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-cyan-800 text-white p-3 rounded-lg font-semibold hover:bg-cyan-700 transition"
                >
                  Add Product
                </button>
                {message && (
                  <p
                    className={`text-center p-2 rounded ${
                      message.includes("successfully")
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {message}
                  </p>
                )}
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-cyan-800 mb-6">
                All Products
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {products.length === 0 ? (
                  <p className="text-gray-600">No products available</p>
                ) : (
                  products.map((product) => (
                    <div
                      key={product._id}
                      className="border border-gray-200 p-4 rounded-lg"
                    >
                      <div className="flex gap-4">
                        <img
                          src={`${API_URL}/${product.image}`}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 mb-1">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {product.desc}
                          </p>
                          <p className="text-cyan-800 font-semibold">
                            ₹ {product.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-cyan-800 mb-6">
              All Orders
            </h2>
            {orders.length === 0 ? (
              <p className="text-gray-600">No orders yet</p>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="border border-gray-200 p-4 rounded-lg"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Order ID</p>
                        <p className="font-semibold text-cyan-800 truncate">
                          {order._id}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Customer Name</p>
                        <p className="font-semibold">{order.userName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Order Date</p>
                        <p className="font-semibold">
                          {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="font-semibold text-cyan-800">
                          ₹ {order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm font-semibold text-gray-800 mb-3">
                        Items ({order.items.length})
                      </p>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between text-sm text-gray-700"
                          >
                            <span>
                              {item.name} x{item.qty}
                            </span>
                            <span> ₹ {(item.price * item.qty).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
