// components/products/ProductFilters.js
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function ProductFilters({ isOpen, onClose }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State for filter values remains the same
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    priceRange: searchParams.get("priceRange") || "",
    sort: searchParams.get("sort") || "newest",
    inStock: searchParams.get("inStock") === "true" || false,
    brand: searchParams.get("brand") || "",
    rating: searchParams.get("rating") || "",
    shipping: searchParams.get("shipping") || "",
  });

  // New state for dynamic filter options and loading
  const [filterOptions, setFilterOptions] = useState({ categories: [], brands: [] });
  const [loading, setLoading] = useState(true);

  // Hardcoded options that are not fetched from DB
  const priceRanges = [
    { value: "", label: "All Prices" },
    { value: "0-50", label: "Under $50" },
    { value: "50-100", label: "$50 - $100" },
    { value: "100-200", label: "$100 - $200" },
    { value: "200-", label: "Over $200" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest Arrivals" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
  ];

  const ratingOptions = [
    { value: "", label: "All Ratings" },
    { value: "4", label: "4★ & up" },
    { value: "3", label: "3★ & up" },
    { value: "2", label: "2★ & up" },
  ];

  // Fetch dynamic filter options on component mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products/filters');
        if (!response.ok) {
          throw new Error('Failed to fetch filter options');
        }
        const data = await response.json();
        setFilterOptions(data);
      } catch (error) {
        console.error(error);
        // Set empty arrays on error to prevent crashes
        setFilterOptions({ categories: [], brands: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchFilterOptions();
  }, []);

  // useEffect for updating URL params remains the same
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (filters.category) params.set("category", filters.category);
    else params.delete("category");

    if (filters.priceRange) params.set("priceRange", filters.priceRange);
    else params.delete("priceRange");

    params.set("sort", filters.sort);

    if (filters.inStock) params.set("inStock", "true");
    else params.delete("inStock");

    if (filters.brand) params.set("brand", filters.brand);
    else params.delete("brand");

    if (filters.rating) params.set("rating", filters.rating);
    else params.delete("rating");

    if (filters.shipping) params.set("shipping", filters.shipping);
    else params.delete("shipping");

    router.replace(`${pathname}?${params.toString()}`);
  }, [filters, router, pathname, searchParams]);
  
  // handleFilterChange and clearFilters functions remain the same
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      priceRange: "",
      sort: "newest",
      inStock: false,
      brand: "",
      rating: "",
      shipping: "",
    });
  };

  const FilterContent = (
    <div className="bg-white border-r border-gray-200 flex flex-col p-6 no-scrollbar">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
        <button
          onClick={clearFilters}
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
        >
          Clear all
        </button>
      </div>

      {/* Category Dropdown (now dynamic) */}
      <div className="mb-6">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
        <select
          id="category"
          value={filters.category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          className="w-full text-black p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          disabled={loading}
        >
          <option value="">{loading ? 'Loading...' : 'All Categories'}</option>
          {filterOptions.categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Price Dropdown (unchanged) */}
      <div className="mb-6">
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
        <select
          id="price"
          value={filters.priceRange}
          onChange={(e) => handleFilterChange("priceRange", e.target.value)}
          className="w-full text-black p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        >
          {priceRanges.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Brand Dropdown (now dynamic) */}
      <div className="mb-6">
        <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
        <select
          id="brand"
          value={filters.brand}
          onChange={(e) => handleFilterChange("brand", e.target.value)}
          className="w-full text-black p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          disabled={loading}
        >
          <option value="">{loading ? 'Loading...' : 'All Brands'}</option>
          {filterOptions.brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>
      
      {/* Other filters (Rating, Sort, In Stock) remain the same... */}
       <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700  mb-2">Customer Rating</h3>
        {ratingOptions.map((option) => (
          <div key={option.value} className="flex items-center mb-2">
            <input
              type="radio"
              id={`rating-${option.value}`}
              name="rating"
              checked={filters.rating === option.value}
              onChange={() => handleFilterChange("rating", option.value)}
              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <label htmlFor={`rating-${option.value}`} className="ml-3 text-sm text-gray-600">
              {option.label}
            </label>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700  mb-2">Sort By</h3>
        {sortOptions.map((option) => (
          <div key={option.value} className="flex items-center mb-2">
            <input
              type="radio"
              id={`sort-${option.value}`}
              name="sort"
              checked={filters.sort === option.value}
              onChange={() => handleFilterChange("sort", option.value)}
              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <label htmlFor={`sort-${option.value}`} className="ml-3 text-sm text-gray-600">
              {option.label}
            </label>
          </div>
        ))}
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center">
            <input
              id="in-stock"
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => handleFilterChange("inStock", e.target.checked)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="in-stock" className="ml-3 text-sm text-gray-600">
              In Stock Only
            </label>
        </div>
      </div>
    </div>
  );

  // The return with Desktop/Mobile views remains the same
  return (
    <>
      <div className="hidden lg:block w-64 xl:w-72 fixed top-16 left-0 h-[calc(100vh-64px)] overflow-y-auto bg-white border-r border-gray-200 no-scrollbar">
        {FilterContent}
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex"
          onClick={onClose}
        >
          <div
            className="w-72 bg-white shadow-xl h-full transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {FilterContent}
          </div>
          <div className="flex-1 bg-black bg-opacity-50" />
        </div>
      )}
    </>
  );
}