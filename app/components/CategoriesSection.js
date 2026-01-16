'use client';
import Link from 'next/link';

export default function CategoriesSection() {
  const categories = [
    {
      id: 1,
      name: "Electronics",
      description: "Latest gadgets and tech",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop",
      productCount: "2,847",
      color: "from-blue-500 to-indigo-600"
    },
    {
      id: 2,
      name: "Fashion",
      description: "Trending styles & accessories",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
      productCount: "1,923",
      color: "from-pink-500 to-rose-600"
    },
    {
      id: 3,
      name: "Home & Kitchen",
      description: "Comfort for your space",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      productCount: "1,456",
      color: "from-green-500 to-emerald-600"
    },
    {
      id: 4,
      name: "Sports",
      description: "Active lifestyle gear",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      productCount: "892",
      color: "from-orange-500 to-red-600"
    },
    {
      id: 5,
      name: "Beauty & Health",
      description: "Self-care essentials",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop",
      productCount: "1,234",
      color: "from-purple-500 to-violet-600"
    },
    {
      id: 6,
      name: "Books & Media",
      description: "Knowledge & entertainment",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
      productCount: "567",
      color: "from-yellow-500 to-amber-600"
    }
  ];

  return (
    <section id="categories" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our diverse range of products organized into categories
            that make shopping easy and enjoyable.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link key={category.id} href={`/products?category=${encodeURIComponent(category.name)}`}>
              <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Background Image */}
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-80 group-hover:opacity-90 transition-opacity duration-300`}></div>
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="text-white">
                      <h3 className="text-2xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300">
                        {category.name}
                      </h3>
                      <p className="text-white/90 mb-3 text-sm">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80 text-sm">
                          {category.productCount} products
                        </span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Browse All Categories Button */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-3 border-2 border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-600 hover:text-white transition-colors"
          >
            Browse All Products
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
