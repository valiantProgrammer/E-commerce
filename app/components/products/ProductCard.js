// components/products/ProductCard.js
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Minus } from 'lucide-react';
import authApi from '../../lib/api';
import { useNotification } from '@/app/components/Notification';


export default function ProductCard({ product }) {
  const minQty = product.minOrderQuantity || 1;
  const [quantity, setQuantity] = useState(minQty);
  const [isAdding, setIsAdding] = useState(false);
  // 2. Get the showNotification function from the context
  const { showNotification } = useNotification();

  const handleIncrement = () => {
    setQuantity(prevQuantity => prevQuantity + minQty);
  };

  const handleDecrement = () => {
    setQuantity(prevQuantity => Math.max(minQty, prevQuantity - minQty));
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await authApi.updateCart('add', product._id, quantity);
      // 3. Show a success notification
      showNotification(`${product.name} added to cart!`, 'success');
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      // 4. Show an error notification
      showNotification('Could not add to cart. Please try again.', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    // The `group` class has been removed from this div.
    // `h-full` is added to ensure the card fills the height of the flex wrapper.
    <div className="relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-square overflow-hidden">
        {/* Product Image */}
        <Link href={`/products/${product._id}`} aria-label={`View ${product.name}`}>
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name || 'Product image'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              width={400}
              height={400}
              priority={false}
              onError={(e) => {
                e.currentTarget.src = '/placeholder-product.jpg';
                e.currentTarget.onerror = null; 
              }}
            />
          ) : (
            <Image
              src="/placeholder-product.jpg"
              alt="Placeholder product image"
              width={400}
              height={400}
              className="w-full h-full object-cover"
            />
          )}
        </Link>
        
        {/* Badge & Wishlist (content is unchanged) */}
        {product.badge && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
              {product.badge}
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            aria-label="Add to wishlist"
          >
            <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </button>
        </div>
      </div>

      {/* Product Info (content is unchanged) */}
      <div className="p-4 flex-grow flex flex-col">
        <div className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-1">
          {product.category || 'Uncategorized'}
        </div>
        
        <Link href={`/products/${product._id}`}>
          <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-indigo-600 transition-colors">
            {product.name || 'Product Name'}
          </h3>
        </Link>
        
        <div className="flex-grow"></div> 
        
        <div className="flex items-center my-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`h-4 w-4 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-2">({product.reviews?.toLocaleString() || 0})</span>
        </div>
        
        <div>
          <span className="text-lg font-bold text-gray-900">${product.price?.toFixed(2) || '0.00'}</span>
          {product.originalPrice && (<span className="text-sm text-gray-400 line-through ml-2">${product.originalPrice.toFixed(2)}</span>)}
        </div>
      </div>
      
      {/* Quantity Selector & Add to Cart (content is unchanged) */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-white/80 backdrop-blur-sm transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
        <div className="flex items-center gap-2">
            <div className="flex items-center border border-gray-300 rounded-lg">
                <button onClick={handleDecrement} className="p-2 text-gray-600 hover:bg-gray-100 rounded-l-md transition-colors"><Minus size={16} /></button>
                <span className="px-3 text-sm font-semibold text-gray-800">{quantity}</span>
                <button onClick={handleIncrement} className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-md transition-colors"><Plus size={16} /></button>
            </div>
            <button 
                onClick={handleAddToCart} 
                disabled={isAdding}
                className="flex-1 bg-indigo-600 text-white text-sm font-semibold py-2.5 px-3 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-indigo-400"
            >
                {isAdding ? 'Adding...' : 'Add'}
            </button>
        </div>
      </div>
    </div>
  );
}
