'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, ChevronUp, ShoppingBag, RotateCw } from 'lucide-react';
import ProductCard from './products/ProductCard'; // Assuming ProductCard is in this path

// --- Individual Order Item (for the list view) ---
const OrderItem = ({ order }) => {
    const [isOpen, setIsOpen] = useState(false);
    const getStatusChipColor = (status) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'shipped': return 'bg-blue-100 text-blue-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <div className="border border-gray-200 rounded-lg">
            <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex-1">
                    <p className="font-semibold text-gray-800">Order #{order._id.slice(-6)}</p>
                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex-1 text-center">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusChipColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                </div>
                <div className="flex-1 text-right">
                    <p className="font-semibold text-gray-800">${order.total.toFixed(2)}</p>
                </div>
                <div className="ml-4">{isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</div>
            </div>

            {isOpen && (
                <div className="p-4 border-t bg-gray-50 space-y-4">
                    {order.items.map(item => (
                        <div key={item.productId} className="flex items-center">
                            <Image src={item.imageUrl} alt={item.name} width={60} height={60} className="rounded-md" />
                            <div className="ml-4 flex-1">
                                <p className="font-medium text-gray-800">{item.name}</p>
                                <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                            </div>
                            <p className="font-medium">${item.subtotal.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- Main Component with Tabs ---
export default function OrderHistory({ orders, previousProducts }) {
    const [activeTab, setActiveTab] = useState('history');

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 mb-4">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button onClick={() => setActiveTab('history')} className={`flex items-center gap-2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'history' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                        <ShoppingBag size={16} /> Order History
                    </button>
                    <button onClick={() => setActiveTab('buy_again')} className={`flex items-center gap-2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'buy_again' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                        <RotateCw size={16} /> Buy Again
                    </button>
                </nav>
            </div>

            <div>
                {activeTab === 'history' && (
                    <div className="space-y-4">
                        {orders && orders.length > 0 ? (
                            orders.map(order => <OrderItem key={order._id} order={order} />)
                        ) : (
                            <p className="text-center text-gray-600 py-8">You haven't placed any orders yet.</p>
                        )}
                    </div>
                )}

                {activeTab === 'buy_again' && (
                    <div>
                        {previousProducts && previousProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {previousProducts.map(product => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        ) : (
                           <p className="text-center text-gray-600 py-8">No previously purchased items found.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}