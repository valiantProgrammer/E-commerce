import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/app/lib/db';
import { getUserIdFromRequest } from '@/app/lib/auth';

export async function GET(request) {
  try {
    const userIdString = await getUserIdFromRequest(request);
    if (!userIdString) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = new ObjectId(userIdString);
    const client = await clientPromise;
    const db = client.db();
 
    const pipeline = [ 
      { $match: { userId: userId } }, 
      { $unwind: '$items' }, 
      { $group: { _id: '$items.productId' } }, 
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails'
        }
      }, 
      { $unwind: '$productDetails' }, 
      { $replaceRoot: { newRoot: '$productDetails' } }
    ];

    const previousProducts = await db.collection('orders').aggregate(pipeline).toArray();
    console.log('Previous Products:', previousProducts);
    return NextResponse.json(previousProducts);

  } catch (error) {
    console.error('Failed to fetch previous products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
