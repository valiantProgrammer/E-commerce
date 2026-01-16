"use client";
import Image from "next/image";

export default function PreviousOrders({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
        <h2 className="text-md sm:text-xl font-semibold text-gray-800 mb-4">
          Previously Ordered Products
        </h2>

        {/* ✅ Show image when no previous products */}
        <div className="flex justify-center mb-4">
          <Image
            src="/s.png" // from public folder
            alt="No previous orders"
            width={200}
            height={200}
            className="object-contain"
          />
        </div>

        <p className="text-gray-600">No products found in your past orders.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-md sm:text-xl font-semibold text-gray-800 mb-4">
        Previously Ordered Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover rounded-md mb-3"
            />
            <h3 className="text-gray-800 font-medium">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-2">₹{product.price}</p>
            <button className="w-full px-3 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition">
              Buy Again
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
