'use client';

import { useState, useEffect } from 'react';
import { productsApi } from '../lib/api';
import ProductCard from './products/ProductCard';
import { Clock } from 'lucide-react';

// --- Countdown Timer Component ---
const CountdownTimer = () => {
    // Target a fixed future date for the countdown
    const countdownDate = new Date("2025-12-31T23:59:59").getTime();
    
    const calculateTimeLeft = () => {
        const now = new Date().getTime();
        const difference = countdownDate - now;

        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    // FIX: Add state to track if the component has mounted on the client
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        // This effect runs only on the client, after the component mounts
        setHasMounted(true);

        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        
        return () => clearTimeout(timer);
    });

    // FIX: Prevent rendering on the server to avoid hydration mismatch
    if (!hasMounted) {
        // Render a placeholder on the server and initial client render
        return (
             <div className="flex items-center space-x-4 text-center">
                <div className="flex flex-col items-center"><span className="text-3xl md:text-4xl font-bold">--</span><span className="text-xs uppercase tracking-wider">days</span></div>
                <div className="flex flex-col items-center"><span className="text-3xl md:text-4xl font-bold">--</span><span className="text-xs uppercase tracking-wider">hours</span></div>
                <div className="flex flex-col items-center"><span className="text-3xl md:text-4xl font-bold">--</span><span className="text-xs uppercase tracking-wider">minutes</span></div>
                <div className="flex flex-col items-center"><span className="text-3xl md:text-4xl font-bold">--</span><span className="text-xs uppercase tracking-wider">seconds</span></div>
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-4 text-center">
            {Object.keys(timeLeft).length > 0 ? (
                Object.entries(timeLeft).map(([interval, value]) => (
                    <div key={interval} className="flex flex-col items-center">
                        <span className="text-3xl md:text-4xl font-bold">{String(value).padStart(2, '0')}</span>
                        <span className="text-xs uppercase tracking-wider">{interval}</span>
                    </div>
                ))
            ) : (
                 <p className="text-lg font-medium">The sale has ended!</p>
            )}
        </div>
    );
};

// --- Main Deals Page Component ---
export default function DealsPageContent() {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const fetchDeals = async () => {
            // Only show the full skeleton on the very first load.
            // For subsequent "Load More" clicks, we'll show a smaller indicator.
            if (page === 1) setLoading(true);

            try {
                const newDeals = await productsApi.getDeals(page);
                
                if (newDeals.length === 0) {
                    setHasMore(false);
                }
                
                // Append new deals to the existing list, ensuring no duplicates are added
                setDeals(prevDeals => {
                    const existingIds = new Set(prevDeals.map(d => d._id));
                    const filteredNewDeals = newDeals.filter(d => !existingIds.has(d._id));
                    return [...prevDeals, ...filteredNewDeals];
                });

            } catch (error) {
                console.error("Failed to fetch deals:", error);
                // Optionally, set an error state here to show a message to the user
            } finally {
                setLoading(false);
            }
        };

        fetchDeals();
    }, [page]);

    const handleLoadMore = () => {
        // Prevent fetching more pages if there are no more or if a fetch is already in progress
        if (!loading && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };
    
    // An improved skeleton loader for the initial page load
    const DealsSkeleton = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm h-96">
                    <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
                    <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white text-center py-16 px-4">
                <Clock size={48} className="mx-auto mb-4" />
                <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Flash Deals Frenzy</h1>
                <p className="text-lg text-indigo-200 mb-8">Hurry! These offers won't last forever.</p>
                <div className="inline-block bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                    <CountdownTimer />
                </div>
            </div>
            
            {/* Deals Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading && page === 1 ? (
                    <DealsSkeleton />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {deals.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}

                {/* Loading More Indicator & Button */}
                <div className="text-center mt-12 h-10">
                    {loading && page > 1 && <p>Loading more deals...</p>}
                    {!loading && hasMore && (
                        <button
                            onClick={handleLoadMore}
                            className="bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
                        >
                            Load More Deals
                        </button>
                    )}
                    {!loading && !hasMore && deals.length > 0 && (
                        <p className="text-gray-500">You've seen all the deals for now!</p>
                    )}
                     {!loading && !hasMore && deals.length === 0 && (
                        <p className="text-gray-500">No deals available at the moment. Check back soon!</p>
                    )}
                </div>
            </div>
        </div>
    );
}