import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/db';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const pipeline = [
      { $sample: { size: 4 } }
    ];
    
    const featuredProducts = await db.collection('products').aggregate(pipeline).toArray();

    return NextResponse.json(featuredProducts);

  } catch (error) {
    console.error('Failed to fetch featured products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
