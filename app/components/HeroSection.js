'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      category: "Electronics",
      subtitle: "Latest Tech",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      color: "bg-indigo-500"
    },
    {
      id: 2,
      category: "Fashion",
      subtitle: "Trending Styles",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      color: "bg-purple-500"
    },
    {
      id: 3,
      category: "Home & Living",
      subtitle: "Comfort & Style",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80",
      color: "bg-pink-500"
    },
    {
      id: 4,
      category: "Sports",
      subtitle: "Active Lifestyle",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      color: "bg-green-500"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev === slides.length - 1) {
          // When reaching the last slide, reset to first after a brief pause
          setTimeout(() => setCurrentSlide(0), 500);
          return prev; // Keep current slide visible during pause
        }
        return prev + 1;
      });
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative bg-cover bg-center bg-no-repeat overflow-hidden" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')" }}>
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/50"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-32">
        
        {/* Mobile Layout */}
        <div className="block md:hidden">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
              Discover
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Amazing Products
              </span>
              at Belle Mart
            </h1>
            <p className="text-lg text-gray-200 mb-6">
              Your premier destination for quality products with exceptional service.
            </p>
            
            {/* Mobile CTA Buttons */}
            <div className="flex flex-col gap-3 mb-8">
              <Link 
                href="/products"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Shop Now
                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link 
                href="/deals"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-200"
              >
                View Deals
              </Link>
            </div>

            {/* Mobile Trust Indicators */}
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-center text-gray-300">
                <svg className="h-4 w-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Free Shipping</span>
              </div>
              <div className="flex items-center justify-center text-gray-300">
                <svg className="h-4 w-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">30-Day Returns</span>
              </div>
            </div>
          </div>

          {/* Mobile Product Carousel */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="relative h-48 overflow-hidden">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    index === currentSlide 
                      ? 'translate-x-0' 
                      : index < currentSlide
                        ? '-translate-x-full'
                        : 'translate-x-full'
                  }`}
                  style={{
                    transitionDelay: currentSlide === 0 && index === 0 ? '500ms' : '0ms'
                  }}
                >
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-lg overflow-hidden mb-3 shadow-lg">
                      <img 
                        src={slide.image} 
                        alt={slide.category}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-white font-semibold text-base mb-1">{slide.category}</h3>
                    <p className="text-gray-300 text-xs">{slide.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center space-x-2 mt-4">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-white scale-125' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Tablet Layout */}
        <div className="hidden md:block lg:hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Discover
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  Amazing Products
                </span>
                at Belle Mart
              </h1>
              <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto lg:mx-0">
                Your premier destination for quality products. From cutting-edge technology to 
                timeless fashion, we bring you the best with exceptional service and unbeatable prices.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  href="/products"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Shop Now
                  <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link 
                  href="/deals"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-200"
                >
                  View Deals
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-8">
                <div className="flex items-center text-gray-300">
                  <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Free Shipping</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">30-Day Returns</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">24/7 Support</span>
                </div>
              </div>
            </div>

            {/* Dynamic Products Box */}
            <div className="relative">
              <div className="relative z-10">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 overflow-hidden">
                  {/* Slide Container */}
                  <div className="relative h-64">
                    {slides.map((slide, index) => (
                      <div
                        key={slide.id}
                        className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                          index === currentSlide 
                            ? 'translate-x-0' 
                            : index < currentSlide
                              ? '-translate-x-full'
                              : 'translate-x-full'
                        }`}
                        style={{
                          transitionDelay: currentSlide === 0 && index === 0 ? '500ms' : '0ms'
                        }}
                      >
                        <div className="h-full flex flex-col items-center justify-center text-center">
                          {/* Product Image */}
                          <div className="w-24 h-24 rounded-xl overflow-hidden mb-4 shadow-lg">
                            <img 
                              src={slide.image} 
                              alt={slide.category}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <h3 className="text-white font-semibold text-lg mb-1">{slide.category}</h3>
                          <p className="text-gray-300 text-sm">{slide.subtitle}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Slide Indicators */}
                  <div className="flex justify-center space-x-2 mt-6">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentSlide 
                            ? 'bg-white scale-125' 
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Discover
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  Amazing Products
                </span>
                at Belle Mart
              </h1>
              <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto lg:mx-0">
                Your premier destination for quality products. From cutting-edge technology to 
                timeless fashion, we bring you the best with exceptional service and unbeatable prices.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  href="/products"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Shop Now
                  <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link 
                  href="/deals"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-200"
                >
                  View Deals
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-8">
                <div className="flex items-center text-gray-300">
                  <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Free Shipping</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">30-Day Returns</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">24/7 Support</span>
                </div>
              </div>
            </div>

            {/* Dynamic Products Box */}
            <div className="relative">
              <div className="relative z-10">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 overflow-hidden">
                  {/* Slide Container */}
                  <div className="relative h-64">
                    {slides.map((slide, index) => (
                      <div
                        key={slide.id}
                        className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                          index === currentSlide 
                            ? 'translate-x-0' 
                            : index < currentSlide
                              ? '-translate-x-full'
                              : 'translate-x-full'
                        }`}
                        style={{
                          transitionDelay: currentSlide === 0 && index === 0 ? '500ms' : '0ms'
                        }}
                      >
                        <div className="h-full flex flex-col items-center justify-center text-center">
                          {/* Product Image */}
                          <div className="w-24 h-24 rounded-xl overflow-hidden mb-4 shadow-lg">
                            <img 
                              src={slide.image} 
                              alt={slide.category}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <h3 className="text-white font-semibold text-lg mb-1">{slide.category}</h3>
                          <p className="text-gray-300 text-sm">{slide.subtitle}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Slide Indicators */}
                  <div className="flex justify-center space-x-2 mt-6">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentSlide 
                            ? 'bg-white scale-125' 
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Curved Wave at Bottom */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg 
          className="w-full h-16 md:h-20 lg:h-24" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,100 C400,40 800,100 1200,60 L1200,120 L0,120 Z" 
            fill="white"
            className="drop-shadow-lg"
          />
        </svg>
      </div>
    </div>
  );
} 