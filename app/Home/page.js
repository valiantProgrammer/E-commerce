"use client";

import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const categories = [
  {
    id: 1,
    name: "Electronics",
    icon: "📱",
    description: "Smartphones, Laptops, Gadgets",
    color: "bg-blue-500",
    href: "/categories/electronics"
  },
  {
    id: 2,
    name: "Fashion",
    icon: "👕",
    description: "Clothing, Shoes, Accessories",
    color: "bg-pink-500",
    href: "/categories/fashion"
  },
  {
    id: 3,
    name: "Home & Living",
    icon: "🏠",
    description: "Furniture, Decor, Kitchen",
    color: "bg-green-500",
    href: "/categories/home"
  },
  {
    id: 4,
    name: "Sports",
    icon: "⚽",
    description: "Fitness, Outdoor, Equipment",
    color: "bg-orange-500",
    href: "/categories/sports"
  },
  {
    id: 5,
    name: "Beauty",
    icon: "💄",
    description: "Cosmetics, Skincare, Fragrances",
    color: "bg-purple-500",
    href: "/categories/beauty"
  },
  {
    id: 6,
    name: "Books",
    icon: "📚",
    description: "Fiction, Non-fiction, Educational",
    color: "bg-indigo-500",
    href: "/categories/books"
  },
  {
    id: 7,
    name: "Toys & Games",
    icon: "🎮",
    description: "Video Games, Board Games, Toys",
    color: "bg-yellow-500",
    href: "/categories/toys"
  },
  {
    id: 8,
    name: "Automotive",
    icon: "🚗",
    description: "Car Parts, Accessories, Tools",
    color: "bg-red-500",
    href: "/categories/automotive"
  }
];

const popularSearches = [
  "Wireless Headphones", "Smart Watch", "Running Shoes", 
  "Coffee Maker", "Yoga Mat", "Bluetooth Speaker",
  "Phone Case", "Laptop Stand", "Water Bottle", "Backpack"
];

const deals = [
  {
    id: 1,
    title: "Flash Sale",
    description: "Up to 70% off electronics",
    discount: "70%",
    endTime: "2 hours left",
    color: "bg-red-500"
  },
  {
    id: 2,
    title: "New Arrivals",
    description: "Fresh styles just in",
    discount: "20%",
    endTime: "1 day left",
    color: "bg-blue-500"
  },
  {
    id: 3,
    title: "Weekend Special",
    description: "Home & living essentials",
    discount: "50%",
    endTime: "3 days left",
    color: "bg-green-500"
  },
  {
    id: 4,
    title: "Student Discount",
    description: "Extra savings for students",
    discount: "25%",
    endTime: "1 week left",
    color: "bg-purple-500"
  },
  {
    id: 5,
    title: "Clearance Sale",
    description: "Last chance on select items",
    discount: "60%",
    endTime: "5 days left",
    color: "bg-orange-500"
  },
  {
    id: 6,
    title: "Buy 2 Get 1",
    description: "Free item on select categories",
    discount: "33%",
    endTime: "2 days left",
    color: "bg-pink-500"
  },
  {
    id: 7,
    title: "Early Bird",
    description: "Morning shoppers special",
    discount: "15%",
    endTime: "6 hours left",
    color: "bg-indigo-500"
  },
  {
    id: 8,
    title: "Loyalty Rewards",
    description: "Member exclusive deals",
    discount: "40%",
    endTime: "1 week left",
    color: "bg-teal-500"
  },
  {
    id: 9,
    title: "Seasonal Sale",
    description: "End of season clearance",
    discount: "45%",
    endTime: "4 days left",
    color: "bg-amber-500"
  }
];

const heroSlides = [
  {
    id: 1,
    title: "Flash Sale",
    subtitle: "Up to 70% Off",
    description: "Don't miss out on these incredible flash deals. Limited quantities available!",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    buttonText: "Shop Now",
    color: "from-red-600/70 to-pink-600/70",
    discount: "70%",
    endTime: "2 hours left"
  },
  {
    id: 2,
    title: "New Arrivals",
    subtitle: "Fresh Styles",
    description: "Explore the newest trends and latest arrivals just in at Belle Mart!",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    buttonText: "Explore",
    color: "from-blue-600/70 to-indigo-600/70",
    discount: "20%",
    endTime: "1 day left"
  },
  {
    id: 3,
    title: "Weekend Special",
    subtitle: "Limited Time",
    description: "Home & living essentials with amazing weekend discounts!",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    buttonText: "View Deals",
    color: "from-green-600/70 to-emerald-600/70",
    discount: "50%",
    endTime: "3 days left"
  },
  {
    id: 4,
    title: "Student Discount",
    subtitle: "Extra Savings",
    description: "Special discounts for students on electronics and books!",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    buttonText: "Get Discount",
    color: "from-purple-600/70 to-violet-600/70",
    discount: "25%",
    endTime: "1 week left"
  },
  {
    id: 5,
    title: "Clearance Sale",
    subtitle: "Last Chance",
    description: "Final clearance on select items. Don't miss these incredible prices!",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    buttonText: "Shop Clearance",
    color: "from-orange-600/70 to-red-600/70",
    discount: "60%",
    endTime: "5 days left"
  },
  {
    id: 6,
    title: "Buy 2 Get 1",
    subtitle: "Free Item",
    description: "Buy any 2 items and get the 3rd one absolutely free!",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    buttonText: "Shop Now",
    color: "from-pink-600/70 to-rose-600/70",
    discount: "33%",
    endTime: "2 days left"
  },
  {
    id: 7,
    title: "Early Bird",
    subtitle: "Morning Special",
    description: "Early bird shoppers get exclusive morning discounts!",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    buttonText: "Early Access",
    color: "from-indigo-600/70 to-blue-600/70",
    discount: "15%",
    endTime: "6 hours left"
  },
  {
    id: 8,
    title: "Loyalty Rewards",
    subtitle: "Member Exclusive",
    description: "Special deals for our loyal members. Join now for exclusive benefits!",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    buttonText: "Join Now",
    color: "from-teal-600/70 to-cyan-600/70",
    discount: "40%",
    endTime: "1 week left"
  },
  {
    id: 9,
    title: "Seasonal Sale",
    subtitle: "End of Season",
    description: "End of season clearance with massive discounts on all categories!",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    buttonText: "Shop Sale",
    color: "from-amber-600/70 to-yellow-600/70",
    discount: "45%",
    endTime: "4 days left"
  }
];

import { productsApi } from '../lib/api';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showAllDeals, setShowAllDeals] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentSlide((prev) => {
          if (prev === heroSlides.length - 1) {
            setTimeout(() => setCurrentSlide(0), 500);
            return prev;
          }
          return prev + 1;
        });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [heroSlides.length, isPaused]);
  
  // Fetch featured products
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoadingProducts(true);
        const products = await productsApi.getFeaturedProducts();
        
        // Validate products data
        if (!products || !Array.isArray(products)) {
          console.error('Invalid products data received:', products);
          setFeaturedProducts([]);
          return;
        }
        
        // Take only the first 4 products
        const topProducts = products.slice(0, 4).map(product => ({
          ...product,
          discount: product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) + '%' : '0%',
          image: product.image ? product.image.replace('w=400&h=400', 'w=300&h=300') : '/placeholder-image.jpg' // Resize image for better fit with fallback
        }));
        setFeaturedProducts(topProducts);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setFeaturedProducts([]); // Set empty array on error
      } finally {
        setLoadingProducts(false);
      }
    };
    
    fetchFeaturedProducts();
  }, []);

  const handleSlideClick = (index) => {
    setCurrentSlide(index);
    setIsPaused(true);
    
    // Resume auto-sliding after 30 seconds
    setTimeout(() => {
      setIsPaused(false);
    }, 30000);
  };

  // Show first 6 deals initially, then all 9 when "Show More" is clicked
  const displayedDeals = showAllDeals ? deals : deals.slice(0, 6);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation />
      
      {/* Custom Hero Section for Home Page */}
      <div className="relative bg-white">
        {/* Hero Slider */}
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentSlide
                  ? 'translate-x-0 opacity-100'
                  : index < currentSlide
                    ? '-translate-x-full opacity-0'
                    : 'translate-x-full opacity-0'
              }`}
              style={{
                transitionDelay: currentSlide === 0 && index === 0 ? '500ms' : '0ms'
              }}
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('${slide.image}')` }}
              >
                <div className="absolute inset-0 bg-black/30"></div>
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.color}`}></div>
              </div>

              {/* Content */}
              <div className="relative h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-2xl">
                    <div className="text-white">
                      <div className="flex items-center mb-4">
                        <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold">
                          {slide.discount} OFF
                        </span>
                        <span className="ml-4 text-white/80 text-sm">
                          ⏰ {slide.endTime}
                        </span>
                      </div>
                      <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                        {slide.title}
                      </h1>
                      <div className="text-2xl md:text-4xl font-bold mb-4 text-yellow-300">
                        {slide.subtitle}
                      </div>
                      <p className="text-lg md:text-xl mb-8 text-white/95">
                        {slide.description}
                      </p>
                      <Link
                        href="/deals"
                        className="inline-block bg-white/90 backdrop-blur-sm text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white transition-colors shadow-lg"
                      >
                        {slide.buttonText}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Slide Indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSlideClick(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Featured Products Section */}
        <div className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
              <p className="text-gray-600">Get your hands on these amazing deals before they're gone!</p>
            </div>

            {loadingProducts ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                <div key={product.id} className="group">
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow border border-gray-100">
                    <div className="relative">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="absolute top-2 left-2">
                        <span className="bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {product.discount} OFF
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm">{product.name}</h3>
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-lg font-bold text-gray-900">${product.price}</span>
                        <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                      </div>
                      <button className="w-full bg-slate-700 text-white py-2 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}

            <div className="text-center mt-8">
              <Link
                href="/products"
                className="inline-block bg-slate-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
              >
                View All Products →
              </Link>
            </div>
          </div>
        </div>

        {/* Curved Wave at Bottom */}
        <div className="relative">
          <svg
            className="w-full h-16 md:h-20 lg:h-24"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,100 C400,40 800,100 1200,60 L1200,120 L0,120 Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      {/* Search & Categories Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
                             <input
                 type="text"
                 placeholder="Search for products, brands, or categories..."
                 className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent text-lg text-gray-900 placeholder-gray-500"
               />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Popular Searches:</h3>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>

          {/* Categories Grid */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Link key={category.id} href={category.href}>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow cursor-pointer group">
                    <div className="text-center">
                      <div className="text-3xl mb-3">{category.icon}</div>
                      <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                      <p className="text-xs text-gray-600">{category.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/orders" className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:bg-slate-100 transition-colors">
              <div className="text-center">
                <div className="text-2xl mb-2">📦</div>
                <h3 className="font-medium text-slate-900">My Orders</h3>
                <p className="text-xs text-slate-700">Track purchases</p>
              </div>
            </Link>
            <Link href="/wishlist" className="bg-amber-50 border border-amber-200 rounded-xl p-4 hover:bg-amber-100 transition-colors">
              <div className="text-center">
                <div className="text-2xl mb-2">❤️</div>
                <h3 className="font-medium text-amber-900">Wishlist</h3>
                <p className="text-xs text-amber-700">Saved items</p>
              </div>
            </Link>
            <Link href="/deals" className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 hover:bg-emerald-100 transition-colors">
              <div className="text-center">
                <div className="text-2xl mb-2">🎯</div>
                <h3 className="font-medium text-emerald-900">Deals</h3>
                <p className="text-xs text-emerald-700">Special offers</p>
              </div>
            </Link>
            <Link href="/cart" className="bg-teal-50 border border-teal-200 rounded-xl p-4 hover:bg-teal-100 transition-colors">
              <div className="text-center">
                <div className="text-2xl mb-2">🛒</div>
                <h3 className="font-medium text-teal-900">Cart</h3>
                <p className="text-xs text-teal-700">3 items</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Deals Section */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Today's Deals</h2>
            <Link href="/deals" className="text-slate-600 hover:text-slate-700 text-sm font-medium">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayedDeals.map((deal) => (
              <div key={deal.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`${deal.color} p-4 text-white`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-sm">{deal.title}</h3>
                      <p className="text-xs opacity-90 mt-1">{deal.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">{deal.discount}</div>
                      <div className="text-xs opacity-90">OFF</div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">⏰ {deal.endTime}</span>
                    <Link href="/deals" className="text-slate-600 hover:text-slate-700 text-xs font-medium">
                      Shop Now →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {deals.length > 6 && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowAllDeals(!showAllDeals)}
                className="inline-block bg-slate-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors text-sm"
              >
                {showAllDeals ? "Show Less" : "Show More Deals"}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}