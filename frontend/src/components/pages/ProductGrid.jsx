import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import ProductCard from "../molecules/ProductCard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function ProductsGrid() {
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-xl">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h2 className="text-4xl font-extrabold text-cyan-800 text-center mb-10">
        Our Products
      </h2>
      {products.length === 0 ? (
        <p className="text-center text-gray-600">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={{
                ...product,
                image: `${API_URL}/${product.image}`,
              }}
              addToCart={addToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}
