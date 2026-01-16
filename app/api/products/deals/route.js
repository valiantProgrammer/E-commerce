import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/db'; // Adjust path as needed

// Define how many deals to return per request.
const DEALS_PER_PAGE = 8; 

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 1. Read the page number from the URL (?page=1, ?page=2, etc.)
    // It defaults to 1 if not provided.
    const page = parseInt(searchParams.get('page') || '1', 10);

    const client = await clientPromise;
    const db = client.db();

    // 2. Calculate how many documents to skip in the database.
    // - For page 1, we skip (1-1) * 8 = 0 documents.
    // - For page 2, we skip (2-1) * 8 = 8 documents.
    // - For page 3, we skip (3-1) * 8 = 16 documents.
    const skip = (page - 1) * DEALS_PER_PAGE;

    const dealsQuery = {
      originalPrice: { $exists: true, $ne: null },
      $expr: { $gt: ["$originalPrice", "$price"] }
    };

    // 3. Execute the query using .skip() and .limit()
    const deals = await db.collection('products')
      .find(dealsQuery)
      .sort({ createdAt: -1 })
      .skip(skip) // Bypass the deals we've already seen
      .limit(DEALS_PER_PAGE) // Return only the next set of deals
      .toArray();

    return NextResponse.json(deals);

  } catch (error) {
    console.error('Failed to fetch deals:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

