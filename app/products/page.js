// app/products/page.js
'use client'; 

import { useState, Suspense } from 'react';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilters from '../components/products/ProductFilters';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Nav from '../components/Navi';
import { SlidersHorizontal } from 'lucide-react';

export default function ProductsPage({ searchParams }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <>
      <Nav />
      <div className="flex h-screen pt-16">
        
        {/* Left Aside: Filters */}
        {/* Added `no-scrollbar` class to hide the scrollbar while keeping it scrollable */}
        <aside className="hidden lg:block w-64 h-full flex-shrink-0 overflow-y-auto bg-white border-r border-gray-200 no-scrollbar">
          <div className="p-4">
            <ProductFilters />
          </div>
        </aside>

        {/* Right Aside: Product Cards */}
        <aside className="flex-grow h-full flex flex-col items-center overflow-y-auto bg-slate-50">
          <main className="p-4 lg:p-6">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 w-full justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <SlidersHorizontal size={16} />
                <span>Filters</span>
              </button>
            </div>
            
            {/* Product Grid */}
            <Suspense fallback={<div className="h-full flex items-center justify-center"><LoadingSpinner /></div>}>
              <ProductGrid searchParams={searchParams} />
            </Suspense>
          </main>
        </aside>
        
      </div>
      
      {/* Mobile drawer for filters */}
      <ProductFilters isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </>
  );
}