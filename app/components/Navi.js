'use client';

import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { productsApi } from '@/app/lib/api';
import Image from 'next/image';
import { useCart } from '@/app/lib/cartContext';


export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchContainerRef = useRef(null);
  const { itemCount } = useCart();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    // Clear results if the search query is too short
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    // Set a timer to perform the search after the user stops typing
    const debounceTimer = setTimeout(() => {
      const performSearch = async () => {
        setIsSearching(true);
        try {
          const results = await productsApi.searchProducts(searchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error("Search failed:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      };
      performSearch();
    }, 300); // 300ms delay

    // Cleanup: clear the timer if the user types again
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };
  // --- Close search results when clicking outside ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSearchResults([]);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfile = () => router.push('/profile');
  const handleCart = () => router.push('/cart');

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
        ${isScrolled ? 'shadow-md' : ''} bg-gray-900`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-xl md:text-2xl font-bold text-white">
                Belle
              </span>
              <span className="text-xl md:text-2xl font-bold text-indigo-400">
                Mart
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {['Home', 'Products', 'Deals', 'About'].map((item, idx) => {
                const href =
                  item === 'Home'
                    ? '/'
                    : `/${item.toLowerCase()}`;
                return (
                  <Link
                    key={idx}
                    href={href}
                    className="px-3 py-2 text-sm font-medium text-white/90 hover:text-indigo-400 transition-colors"
                  >
                    {item}
                  </Link>
                );
              })}
              <a
                href="#categories"
                className="px-3 py-2 text-sm font-medium text-white/90 hover:text-indigo-400 transition-colors"
              >
                Categories
              </a>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            {/* Search Results Dropdown */}
            {searchQuery.length > 1 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg overflow-hidden max-h-96 overflow-y-auto">
                {isSearching ? (
                  <div className="p-4 text-center text-gray-500">Searching...</div>
                ) : searchResults.length > 0 ? (
                  <ul>
                    {searchResults.map(product => (
                      <li key={product._id}>
                        <Link href={`/products/${product._id}`} onClick={clearSearch} className="flex items-center p-3 hover:bg-gray-100 transition-colors">
                          <Image src={product.imageUrl || product.images[0] || '/placeholder-product.jpg'} alt={product.name} width={40} height={40} className="w-10 h-10 object-cover rounded-md" />
                          <div className="ml-4">
                            <p className="font-semibold text-gray-800">{product.name}</p>
                            <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-gray-500">No products found.</div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Right side icons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleProfile}
              className="p-3 text-white/90 hover:text-indigo-400 hover:bg-gray-800 rounded-lg transition-all"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>

            <button
              onClick={handleCart}
              className="p-3 relative text-white/90 hover:text-indigo-400 hover:bg-gray-800 rounded-lg transition-all"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {
                itemCount > 0 ? (<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {itemCount}
                </span>) : null
              }

            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-3 text-white/90 hover:text-indigo-400 hover:bg-gray-800 rounded-lg"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/"
                className="block px-4 py-3 text-white/90 hover:text-indigo-400 hover:bg-gray-800 rounded-lg transition"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="block px-4 py-3 text-white/90 hover:text-indigo-400 hover:bg-gray-800 rounded-lg transition"
              >
                Products
              </Link>
              <a
                href="#categories"
                className="block px-4 py-3 text-white/90 hover:text-indigo-400 hover:bg-gray-800 rounded-lg transition"
              >
                Categories
              </a>
              <Link
                href="/deals"
                className="block px-4 py-3 text-white/90 hover:text-indigo-400 hover:bg-gray-800 rounded-lg transition"
              >
                Deals
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
