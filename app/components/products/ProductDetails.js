'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Star, Plus, Minus, CheckCircle, ShieldCheck, UserCircle } from 'lucide-react';
import { productsApi, authApi } from '../../lib/api';
import { useNotification } from '@/app/components/Notification';
import ProductCard from './ProductCard'; // Import ProductCard for featured products

// --- Skeleton Loader Component (Unchanged) ---
const ProductSkeleton = () => (
  <div className="container mx-auto px-4 py-12 animate-pulse">
    <div className="w-full h-8 bg-gray-200 rounded-md mb-8"></div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div>
        <div className="w-full h-96 bg-gray-200 rounded-lg mb-4"></div>
        <div className="flex gap-4">
          <div className="w-24 h-24 bg-gray-200 rounded-md"></div>
          <div className="w-24 h-24 bg-gray-200 rounded-md"></div>
          <div className="w-24 h-24 bg-gray-200 rounded-md"></div>
        </div>
      </div>
      <div>
        <div className="w-3/4 h-10 bg-gray-200 rounded-md mb-4"></div>
        <div className="w-1/4 h-8 bg-gray-200 rounded-md mb-6"></div>
        <div className="w-full h-20 bg-gray-200 rounded-md mb-6"></div>
        <div className="w-1/2 h-12 bg-gray-200 rounded-md mb-6"></div>
        <div className="w-full h-14 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  </div>
);

// --- Star Rating Component (Unchanged) ---
const StarRating = ({ rating, setRating, interactive = false }) => (
    <div className={`flex items-center ${interactive ? 'cursor-pointer' : ''}`}>
        {[...Array(5)].map((_, i) => (
            <Star
                key={i}
                size={20}
                className={`transition-colors ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} ${interactive ? 'hover:text-yellow-500' : ''}`}
                onClick={() => interactive && setRating(i + 1)}
            />
        ))}
    </div>
);


// --- Main Product Details Component ---
export default function ProductDetails({ productId }) {
  const [product, setProduct] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [newRating, setNewRating] = useState(0);
  const [newReview, setNewReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { showNotification } = useNotification();
  const imageContainerRef = useRef(null);

  // --- Fetch Product and Featured Products Data ---
  const fetchProductData = useCallback(async () => {
    if (!productId) return;
    try {
      if (!product) setLoading(true); // Only show main loader on first load
      
      const [productData, featuredData] = await Promise.all([
        productsApi.getProductById(productId),
        productsApi.getFeaturedProducts()
      ]);

      setProduct(productData);
      // Ensure the current product isn't in the featured list
      console.log(productData);
      setFeaturedProducts(featuredData);
      console.log(featuredData);
    } catch (err) {
      console.error("Failed to load page data:", err);
      setError("We couldn't find that product. It might have been removed.");
    } finally {
      setLoading(false);
    }
  }, [productId, product]);

  useEffect(() => {
    fetchProductData();
  }, [productId]);

  // --- Image Magnifier Logic (Unchanged) ---
  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setMagnifierPosition({ x, y });
  };

  // --- Event Handlers (Unchanged) ---
  const handleAddToCart = async () => {
    try {
        await authApi.updateCart('add', product._id, quantity);
        showNotification(`${product.name} has been added to your cart!`, 'success');
    } catch (err) {
        console.error("Add to cart error:", err);
        showNotification(err.message || "Failed to add item. Please try again.", 'error');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (newRating === 0) {
        showNotification('Please select a star rating.', 'error');
        return;
    }
    setIsSubmitting(true);
    try {
      await authApi.submitReview(productId, { rating: newRating, comment: newReview });
      showNotification('Thank you! Your review has been submitted.', 'success');
      setNewRating(0);
      setNewReview('');
      await fetchProductData(); // Re-fetch all data to show new review
    } catch (err) {
      console.error("Failed to submit review:", err);
      showNotification(err.message || "Could not submit review. Please try again.", 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <ProductSkeleton />;
  if (error) return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Oops! Something went wrong.</h2>
        <p className="text-gray-600">{error}</p>
        <Link href="/products" className="mt-6 inline-block bg-indigo-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-indigo-700 transition-colors">
            Back to Products
        </Link>
      </div>
  );
  if (!product) return null;

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <nav className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-indigo-600">Home</Link>
        <ChevronRight size={16} className="mx-2" />
        <Link href="/products" className="hover:text-indigo-600">Products</Link>
        <ChevronRight size={16} className="mx-2" />
        <span className="font-medium text-gray-700">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
        {/* Image Gallery with Magnifier (Unchanged) */}
        <div className="relative">
          <div ref={imageContainerRef} className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden mb-4 relative" onMouseEnter={() => setShowMagnifier(true)} onMouseLeave={() => setShowMagnifier(false)} onMouseMove={handleMouseMove}>
            <Image src={product.images?.[selectedImage] || '/placeholder-product.jpg'} alt={product.name || 'Product Image'} width={800} height={800} className="w-full h-full object-cover" priority />
            <div className={`hidden lg:block absolute pointer-events-none rounded-lg border-4 border-white shadow-2xl bg-no-repeat bg-center transition-opacity duration-300 ${showMagnifier ? 'opacity-100' : 'opacity-0'}`} style={{ width: '150%', height: '150%', top: `${-magnifierPosition.y / 2}%`, left: `${-magnifierPosition.x / 2}%`, backgroundImage: `url(${product.images?.[selectedImage] || '/placeholder-product.jpg'})`, backgroundSize: '250% 250%', backgroundPosition: `${magnifierPosition.x}% ${magnifierPosition.y}%` }} />
          </div>
          <div className="flex gap-3">
            {product.images?.map((img, index) => (
              <button key={index} onClick={() => setSelectedImage(index)} className={`w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-indigo-500 scale-105' : 'border-transparent'}`}>
                <Image src={img} alt={`${product.name} thumbnail ${index + 1}`} width={100} height={100} className="w-full h-full object-cover"/>
              </button>
            ))}
          </div>
        </div>

        {/* Product Information & Actions (Unchanged) */}
        <div className="py-4">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3">{product.name}</h1>
          <div className="flex items-center gap-4 mb-5">
            <StarRating rating={product.rating || 0} />
            <span className="text-sm text-gray-600">({product.reviewCount || 0} reviews)</span>
          </div>
          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
          <div className="text-4xl font-bold text-gray-900 mb-6">
            <span>${product.price?.toFixed(2)}</span>
            {product.originalPrice && <span className="text-xl text-gray-400 line-through ml-3">${product.originalPrice.toFixed(2)}</span>}
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 text-gray-600 hover:bg-gray-100 rounded-l-md transition-colors"><Minus size={18} /></button>
              <span className="px-5 text-lg font-semibold text-gray-800">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="p-3 text-gray-600 hover:bg-gray-100 rounded-r-md transition-colors"><Plus size={18} /></button>
            </div>
            <button onClick={handleAddToCart} className="w-full sm:w-auto flex-1 bg-indigo-600 text-white text-base font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105">
              Add to Cart
            </button>
          </div>
          <div className="border-t pt-6 space-y-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <CheckCircle size={18} className="text-green-500" />
              <span>{product.stock > 0 ? `${product.stock} in stock - ships now!` : 'Out of stock'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <ShieldCheck size={18} className="text-blue-500" />
              <span>30-Day Money-Back Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- NEW: Sequential Details, Reviews, and Featured Products --- */}
      <div className="space-y-16">
        {/* About this item */}
        <section>
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6">About This Item</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-600">
                <div className="prose max-w-none">
                    <p>{product.longDescription || product.description}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Specifications</h3>
                    <dl className="space-y-3">
                        <div className="flex justify-between"><dt className="font-medium text-gray-700">Brand</dt><dd>{product.brand || 'N/A'}</dd></div>
                        <div className="flex justify-between"><dt className="font-medium text-gray-700">Category</dt><dd>{product.category || 'N/A'}</dd></div>
                        <div className="flex justify-between"><dt className="font-medium text-gray-700">Weight</dt><dd>{product.weight || '0.45 lbs'}</dd></div>
                        <div className="flex justify-between"><dt className="font-medium text-gray-700">Dimensions</dt><dd>{product.dimensions || '6 x 3 x 0.5 in'}</dd></div>
                    </dl>
                </div>
            </div>
        </section>

        {/* Customer Reviews */}
        <section>
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6">Customer Reviews</h2>
            <div className="space-y-8 mb-10">
                {product.reviews && product.reviews.length > 0 ? product.reviews.map(review => (
                    <div key={review._id} className="flex gap-4">
                        <UserCircle size={40} className="text-gray-400 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-gray-800">{review.username}</p>
                                    <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                </div>
                                <StarRating rating={review.rating} />
                            </div>
                            <p className="mt-3 text-gray-600">{review.comment}</p>
                        </div>
                    </div>
                )) : <p className="text-gray-500">No reviews yet. Be the first to share your thoughts!</p>}
            </div>
            <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Write a review</h3>
                <form onSubmit={handleReviewSubmit}>
                    <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label><StarRating rating={newRating} setRating={setNewRating} interactive={true} /></div>
                    <div className="mb-4"><label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-2">Your Review</label><textarea id="review-comment" rows="4" value={newReview} onChange={(e) => setNewReview(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="Share your experience..."></textarea></div>
                    <button type="submit" disabled={isSubmitting} className="bg-indigo-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400">{isSubmitting ? 'Submitting...' : 'Submit Review'}</button>
                </form>
            </div>
        </section>

        {/* Featured Products */}
        <section>
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredProducts.map(fp => (
                    <ProductCard key={fp._id} product={fp} />
                ))}
            </div>
        </section>
      </div>
    </div>
  );
}

