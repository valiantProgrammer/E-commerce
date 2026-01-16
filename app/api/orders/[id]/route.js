import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../lib/db';
import { getUserIdFromRequest } from '../../../lib/auth';

export async function GET(request, { params }) {
  try {
    const { id: orderId } = await params;
    const userIdString = await getUserIdFromRequest(request);

    // 1. Authenticate the user
    if (!userIdString) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
     
    if (!ObjectId.isValid(orderId)) {
      return NextResponse.json({ error: 'Invalid order ID format' }, { status: 400 });
    }

    const userId = new ObjectId(userIdString);
    const client = await clientPromise;
    const db = client.db();
 
    const order = await db.collection('orders').findOne({
      _id: new ObjectId(orderId),
      userId: userId, 
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found or access denied' }, { status: 404 });
    }

    return NextResponse.json(order);

  } catch (error) {
    console.error('Failed to fetch order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
