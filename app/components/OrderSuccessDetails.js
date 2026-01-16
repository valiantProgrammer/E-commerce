'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Lottie from 'react-lottie-player';
import { authApi } from '../lib/api';

// --- Skeleton Loader ---
const OrderSuccessSkeleton = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 animate-pulse">
        <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-lg">
            <div className="h-40 w-40 bg-gray-200 rounded-full mx-auto mb-6"></div>
            <div className="h-8 w-3/4 bg-gray-200 rounded-md mx-auto mb-4"></div>
            <div className="h-6 w-1/2 bg-gray-200 rounded-md mx-auto mb-8"></div>
            <div className="space-y-4">
                <div className="h-16 bg-gray-200 rounded-lg"></div>
                <div className="h-24 bg-gray-200 rounded-lg"></div>
            </div>
        </div>
    </div>
);

export default function OrderSuccessDetails() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get('orderId');

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [animationData, setAnimationData] = useState(null);

    useEffect(() => {
        // Fetch the Lottie animation JSON
        fetch('/animations/success-animation.json')
            .then(res => res.json())
            .then(data => setAnimationData(data));
        
        if (!orderId) {
            setError("No order ID found. You will be redirected.");
            setTimeout(() => router.push('/'), 3000);
            return;
        }

        const fetchOrder = async () => {
            try {
                const orderData = await authApi.getOrderById(orderId);
                setOrder(orderData);
            } catch (err) {
                console.error("Failed to fetch order details:", err);
                setError(err.message || "Could not find your order details.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId, router]);

    if (loading) {
        return <OrderSuccessSkeleton />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-red-600">An Error Occurred</h2>
                    <p className="mt-2 text-gray-600">{error}</p>
                </div>
            </div>
        );
    }
    
    if (!order) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-lg text-center text-gray-800">
                <Lottie
                    loop={true}
                    play
                    animationData={animationData}
                    style={{ width: 160, height: 160, margin: '0 auto' }}
                />

                <h1 className="text-3xl font-bold text-gray-900 mt-4">Thank You For Your Order!</h1>
                <p className="text-gray-600 mt-2">Your order has been placed and is being processed.</p>
                <p className="text-sm text-gray-500 mt-2">Order ID: <span className="font-mono text-gray-800">{order._id}</span></p>

                <div className="text-left mt-8 border-t pt-6">
                    <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                    <div className="space-y-4 mb-6">
                        {order.items.map(item => (
                            <div key={item.productId} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Image src={item.imageUrl} alt={item.name} width={64} height={64} className="rounded-md" />
                                    <div className="ml-4">
                                        <p className="font-medium text-gray-800">{item.name}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                                    </div>
                                </div>
                                <p className="font-medium text-gray-800">${item.subtotal.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>

                    <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>${order.items.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2)}</span></div>
                        <div className="flex justify-between font-bold text-lg text-gray-900 mt-2"><span>Total Paid</span><span>${order.total.toFixed(2)}</span></div>
                    </div>
                </div>

                <div className="text-left mt-6 border-t pt-6">
                    <h2 className="text-lg font-semibold mb-2 text-gray-800">Shipping To</h2>
                    <address className="not-italic text-gray-600">
                        {order.shippingAddress.street}<br/>
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br/>
                        {order.shippingAddress.country}
                    </address>
                </div>

                <div className="mt-8">
                    <Link href="/products" className="w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}

