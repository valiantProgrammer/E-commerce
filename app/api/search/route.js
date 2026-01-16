import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/db';
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    if (!query) {
      return NextResponse.json([]);
    }

    const client = await clientPromise;
    const db = client.db();

    const searchQuery = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
      ],
    };

    const products = await db.collection('products')
      .find(searchQuery)
      .limit(20) 
      .toArray();

    return NextResponse.json(products);

  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
