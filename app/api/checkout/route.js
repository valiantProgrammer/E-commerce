import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/app/lib/db';
import { getUserIdFromRequest } from '@/app/lib/auth';

export async function POST(request) {
  const session = (await clientPromise).startSession();

  try {
    const userIdString = await getUserIdFromRequest(request);
    if (!userIdString) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = new ObjectId(userIdString);

    const { shippingAddress, paymentMethod } = await request.json();

    // Basic validation
    if (!shippingAddress || !paymentMethod) {
        return NextResponse.json({ error: 'Missing shipping address or payment method.' }, { status: 400 });
    }

    let orderId;

    await session.withTransaction(async () => {
      const db = (await clientPromise).db();
      
      // 1. Get the user's current cart
      const cart = await db.collection('carts').findOne({ userId }, { session });
      if (!cart || cart.items.length === 0) {
        throw new Error('Your cart is empty.');
      }

      // 2. Create the order document
      const newOrder = {
        userId,
        items: cart.items.map(item => ({
            productId: item.productId,
            name: item.name,
            imageUrl: item.imageUrl,
            price: item.priceAtAdd, // Price at the time of order
            qty: item.qty,
            subtotal: item.subtotal
        })),
        total: cart.total,
        status: 'processing',
        payment: {
          method: paymentMethod,
          status: 'pending', // Assume payment is processed externally or on delivery
        },
        shippingAddress: shippingAddress,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const orderResult = await db.collection('orders').insertOne(newOrder, { session });
      orderId = orderResult.insertedId;

      // 3. Clear the user's cart
      await db.collection('carts').updateOne(
        { userId },
        { 
            $set: { 
                items: [],
                subtotal: 0,
                shipping: 0,
                tax: 0,
                total: 0,
                updatedAt: new Date()
            } 
        },
        { session }
      );
    });

    return NextResponse.json({ success: true, orderId: orderId.toString() });

  } catch (error) {
    console.error('Checkout failed:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  } finally {
    await session.endSession();
  }
}
