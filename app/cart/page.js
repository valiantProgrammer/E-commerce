'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';
// Import both authApi and the new productsApi
import { authApi, productsApi } from '../lib/api';
// Import the ProductCard to display suggestions
import ProductCard from '../components/products/ProductCard';

// A reusable component for the cute bunny loader
const BunnyLoader = () => (
    <div className="flex flex-col items-center justify-center">
        {/* We use style jsx here to define the keyframe animations locally */}
        <style jsx>{`
            .bunny-group {
                animation: hop 0.8s ease-in-out infinite;
            }
            .bunny-shadow {
                animation: shadow-squish 0.8s ease-in-out infinite;
                transform-origin: center;
            }
            @keyframes hop {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-15px); }
            }
            @keyframes shadow-squish {
                0%, 100% { transform: scaleX(1); opacity: 0.2; }
                50% { transform: scaleX(0.7); opacity: 0.1; }
            }
        `}</style>
        <svg width="120" height="120" viewBox="0 0 100 100" className="text-indigo-500">
            {/* The main bunny SVG group that will hop */}
            <g className="bunny-group">
                <path d="M 50,90 C 40,95 30,90 30,80 C 30,60 70,60 70,80 C 70,90 60,95 50,90 Z" fill="currentColor" />
                <circle cx="50" cy="55" r="15" fill="currentColor" />
                <path d="M 42,40 Q 40,20 45,20 Q 50,20 48,40 Z" fill="currentColor" />
                <path d="M 58,40 Q 60,20 55,20 Q 50,20 52,40 Z" fill="currentColor" />
                <circle cx="45" cy="55" r="1.5" fill="#FFFFFF" />
                <circle cx="55" cy="55" r="1.5" fill="#FFFFFF" />
            </g>
             {/* A simple ellipse for the shadow that squishes as the bunny hops */}
            <ellipse cx="50" cy="95" rx="15" ry="3" className="bunny-shadow" fill="#000000" />
        </svg>
    </div>
);


export default function CartPage() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    // Add state to hold suggested products
    const [suggestedProducts, setSuggestedProducts] = useState([]);
    const router = useRouter();

    const fetchPageData = async () => {
        try {
            setLoading(true);
            // Fetch cart and suggested products in parallel for better performance
            const [cartData, suggestedData] = await Promise.all([
                authApi.getCart(),
                productsApi.getProducts({ limit: 4 }) 
            ]);
            setCart(cartData);
            setSuggestedProducts(suggestedData);
        } catch (error) {
            console.error('Error fetching page data:', error);
            toast.error(error.message || 'Failed to load cart');
            // Attempt to load suggested products even if the cart fails
            try {
                const suggestedData = await productsApi.getProducts({ limit: 4 });
                setSuggestedProducts(suggestedData);
            } catch (suggestedError) {
                console.error('Error fetching suggested products:', suggestedError);
            }
            setCart(null); // Set cart to null to show the correct state
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPageData();
    }, []);

    const updateQuantity = async (productId, newQuantity) => {
        try {
            const action = newQuantity > 0 ? 'update' : 'remove';
            const data = await authApi.updateCart(action, productId, newQuantity);
            setCart(data);
            toast.success('Cart updated successfully');
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message || 'Failed to update cart');
        }
    };

    const removeItem = async (productId) => {
        try {
            const data = await authApi.updateCart('remove', productId);
            setCart(data);
            toast.success('Item removed from cart');
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message || 'Failed to remove item');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <BunnyLoader />
                    <p className="mt-2 text-lg font-medium text-gray-600">Hopping to your cart...</p>
                </div>
            </div>
        );
    }
    
    // A reusable component to display the grid of suggested products
    const SuggestedProductsSection = () => (
        <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">You Might Also Like</h2>
            {suggestedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {suggestedProducts.map(product => (
                       <ProductCard product={product} key={product._id} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">Could not load suggestions.</p>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                    <Link
                        href="/products"
                        className="px-6 py-3 text-white font-medium rounded-lg transition-colors
                        bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800
                        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
                        shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200
                        flex items-center justify-center space-x-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                        <span>Continue Shopping</span>
                    </Link>
                </div>

                {!cart || !cart.items || cart.items.length === 0 ? (
                    <div>
                        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h3>
                            <p className="mt-1 text-gray-500">Looks like you haven't added anything yet.</p>
                        </div>
                        <SuggestedProductsSection />
                    </div>
                ) : (
                    <div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                    <div className="p-6 border-b border-gray-200">
                                        <h2 className="text-lg font-semibold text-gray-800">Your Items ({cart.items.length})</h2>
                                    </div>
                                    <div className="divide-y divide-gray-200">
                                        {cart.items.map(item => (
                                            <div key={item.productId} className="p-6 flex flex-col sm:flex-row gap-6">
                                                <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img 
                                                        src={item.imageUrl || '/placeholder-product.jpg'} 
                                                        alt={item.name || 'Product image'} 
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
                                                            <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => removeItem(item.productId)}
                                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    <div className="mt-4 flex items-center justify-between">
                                                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden text-slate-700">
                                                            <button
                                                                onClick={() => updateQuantity(item.productId, item.qty - 1)}
                                                                disabled={item.qty <= 1}
                                                                className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                            >
                                                                -
                                                            </button>
                                                            <div className="w-12 h-10 flex items-center justify-center border-x border-gray-300">
                                                                {item.qty}
                                                            </div>
                                                            <button
                                                                onClick={() => updateQuantity(item.productId, item.qty + 1)}
                                                                className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                        <p className="text-lg font-semibold text-gray-800">${(item.priceAtAdd * item.qty).toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                    <div className="p-6 border-b border-gray-200">
                                        <h2 className="text-lg font-semibold text-gray-800">Order Summary</h2>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-medium text-gray-600">${cart.subtotal?.toFixed(2) || '0.00'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Shipping</span>
                                            <span className="font-medium text-gray-600">${cart.shipping?.toFixed(2) || '0.00'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tax</span>
                                            <span className="font-medium text-gray-600">${cart.tax?.toFixed(2) || '0.00'}</span>
                                        </div>
                                        <div className="border-t border-gray-200 pt-4 flex justify-between">
                                            <span className="text-lg font-semibold text-slate-800">Total</span>
                                            <span className="text-lg font-bold text-gray-600">${cart.total?.toFixed(2) || '0.00'}</span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <button 
                                            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                                            onClick={() => router.push('/checkout')}
                                            disabled={!cart.items || cart.items.length === 0}
                                        >
                                            Proceed to Checkout
                                        </button>
                                        <p className="text-center text-sm text-gray-500 mt-4">
                                            or{' '}
                                            <Link href="/products" className="text-indigo-600 hover:text-indigo-800 font-medium">
                                                Continue Shopping
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <SuggestedProductsSection />
                    </div>
                )}
            </div>
        </div>
    );
}

