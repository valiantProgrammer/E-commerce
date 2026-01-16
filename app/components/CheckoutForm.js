'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/app/components/Notification';
import { authApi } from '@/app/lib/api';
import { CreditCard, Truck, Landmark, Wallet } from 'lucide-react';
import Image from 'next/image';

// --- Skeleton Loader ---
const CheckoutSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white h-48 rounded-lg shadow-sm"></div>
            <div className="bg-white h-64 rounded-lg shadow-sm"></div>
        </div>
        <div className="bg-white h-80 rounded-lg shadow-sm"></div>
    </div>
);


export default function CheckoutForm() {
    const [cart, setCart] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [loading, setLoading] = useState(true);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    
    const router = useRouter();
    const { showNotification } = useNotification();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cartData, addressesData] = await Promise.all([
                    authApi.getCart(),
                    authApi.getAddresses()
                ]);
                setCart(cartData);
                setAddresses(addressesData);
                // Pre-select the default address if it exists
                const defaultAddress = addressesData.find(addr => addr.is_default);
                if (defaultAddress) {
                    setSelectedAddress(defaultAddress._id);
                }
            } catch (error) {
                console.error('Failed to load checkout data:', error);
                showNotification(error.message || 'Could not load your cart.', 'error');
                router.push('/cart');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [router, showNotification]);

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            showNotification('Please select a shipping address.', 'error');
            return;
        }
        
        setIsPlacingOrder(true);
        try {
            const shippingAddress = addresses.find(addr => addr._id === selectedAddress);
            const { _id, ...addressDetails } = shippingAddress; // Exclude ID from the address object sent to API

            const result = await authApi.placeOrder({
                shippingAddress: addressDetails,
                paymentMethod,
            });

            showNotification('Your order has been placed successfully!', 'success');
            // Redirect to an order confirmation page
            router.push(`/order-success?orderId=${result.orderId}`);
        } catch (error) {
            console.error('Failed to place order:', error);
            showNotification(error.message || 'There was an issue placing your order.', 'error');
        } finally {
            setIsPlacingOrder(false);
        }
    };

    if (loading) {
        return <CheckoutSkeleton />;
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="text-center bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold">Your cart is empty.</h2>
                <p className="mt-2 text-gray-600">You cannot proceed to checkout without items.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side: Shipping and Payment */}
            <div className="lg:col-span-2 space-y-6">
                {/* Shipping Address */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                    <div className="space-y-4">
                        {addresses.map(addr => (
                            <label key={addr._id} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${selectedAddress === addr._id ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-gray-200'}`}>
                                <input type="radio" name="address" value={addr._id} checked={selectedAddress === addr._id} onChange={(e) => setSelectedAddress(e.target.value)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"/>
                                <div className="ml-4">
                                    <p className="font-medium">{addr.street}, {addr.city}</p>
                                    <p className="text-sm text-gray-600">{addr.state}, {addr.postalCode}, {addr.country}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                    <div className="space-y-4">
                        {/* Card */}
                        <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-gray-200'}`}>
                            <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4 text-indigo-600"/>
                            <CreditCard className="mx-4 text-gray-600" />
                            <span className="font-medium">Credit / Debit Card</span>
                        </label>
                        {/* UPI */}
                        <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-gray-200'}`}>
                            <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4 text-indigo-600"/>
                            <Wallet className="mx-4 text-gray-600" />
                            <span className="font-medium">UPI / Net Banking</span>
                        </label>
                        {/* COD */}
                        <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-gray-200'}`}>
                            <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4 text-indigo-600"/>
                            <Truck className="mx-4 text-gray-600" />
                            <span className="font-medium">Cash on Delivery</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Right Side: Order Summary */}
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-sm sticky top-6">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-4">Order Summary</h2>
                    <div className="space-y-4">
                        {cart.items.map(item => (
                            <div key={item.productId} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Image src={item.imageUrl} alt={item.name} width={48} height={48} className="rounded-md" />
                                    <div className="ml-4">
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                                    </div>
                                </div>
                                <p className="font-medium">${item.subtotal.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                    {/* Bill Details */}
                    <div className="mt-6 pt-6 border-t space-y-3">
                        <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>${cart.subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between text-gray-600"><span>Shipping</span><span>${cart.shipping.toFixed(2)}</span></div>
                        <div className="flex justify-between text-gray-600"><span>Tax</span><span>${cart.tax.toFixed(2)}</span></div>
                        <div className="flex justify-between font-bold text-lg text-gray-900 mt-2 pt-2 border-t"><span>Total</span><span>${cart.total.toFixed(2)}</span></div>
                    </div>
                    <button onClick={handlePlaceOrder} disabled={isPlacingOrder} className="w-full mt-6 bg-indigo-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors">
                        {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                    </button>
                </div>
            </div>
        </div>
    );
}
