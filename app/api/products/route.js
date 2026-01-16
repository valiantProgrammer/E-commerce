// app/api/products/route.js

import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/db'; 
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const client = await clientPromise;
    const db = client.db();

    const query = {};
 
    const brand = searchParams.get('brand');
    if (brand) { 
      query.brand = { $regex: new RegExp(`^${brand}$`, 'i') };
    }
 
    const category = searchParams.get('category');
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // In Stock Filter
    if (searchParams.get('inStock') === 'true') {
      query.stock = { $gt: 0 };
    }

    // Price Range Filter
    const priceRange = searchParams.get('priceRange');
    if (priceRange) {
      const [min, max] = priceRange.split('-');
      if (min) query.price = { ...query.price, $gte: Number(min) };
      if (max) query.price = { ...query.price, $lte: Number(max) };
    }
    
    // Rating Filter
    const rating = searchParams.get('rating');
    if (rating) {
        query.rating = { $gte: Number(rating) };
    }

    // 2. Build the sort object
    const sortParam = searchParams.get('sort') || 'newest';
    let sortOption = {};
    
    switch (sortParam) {
        case 'price-low':
            sortOption = { price: 1 };
            break;
        case 'price-high':
            sortOption = { price: -1 };
            break;
        case 'rating':
            sortOption = { rating: -1 };
            break;
        default: // 'newest'
            sortOption = { createdAt: -1 };
            break;
    }

    // 3. Execute the query against the database
    const products = await db.collection('products')
      .find(query)
      .sort(sortOption)
      .toArray();

    return NextResponse.json(products);

  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
        { error: 'Internal Server Error' }, 
        { status: 500 }
    );
  }
}