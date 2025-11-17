export default function ProductCard({ product, addToCart }) {
  return (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col transform transition duration-500 hover:scale-105 hover:shadow-2xl">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-56 object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent"></div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-cyan-800 mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4 flex-1">{product.description}</p>
        <div className="flex justify-between items-center">
          <p className="text-gray-900 font-semibold text-lg">
            ₹ {product.price}
          </p>
          <button
            onClick={() => addToCart(product, 1)}
            className="py-2 px-4 bg-cyan-800 text-white font-semibold rounded-lg shadow hover:bg-cyan-700 hover:shadow-lg transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
