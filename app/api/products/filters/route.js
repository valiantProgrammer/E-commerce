// app/api/products/filters/route.js

import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/db'; // Adjust path to your db connection

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const productsCollection = db.collection('products');

    // Use Promise.all to run aggregation queries in parallel
    const [categories, brands] = await Promise.all([
      // Get distinct non-null/non-empty category values
      productsCollection.distinct('category', { category: { $ne: null, $ne: "" } }),
      // Get distinct non-null/non-empty brand values
      productsCollection.distinct('brand', { brand: { $ne: null, $ne: "" } })
    ]);

    // Sort them alphabetically
    categories.sort();
    brands.sort();

    return NextResponse.json({ categories, brands });
  } catch (error) {
    console.error('Failed to fetch filter options:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}