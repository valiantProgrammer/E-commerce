import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/db';
import { getUserIdFromRequest } from '../../lib/auth';

export async function GET(request) {
    try {

        const userIdString = await getUserIdFromRequest(request);
        if (!userIdString) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = new ObjectId(userIdString);
        const client = await clientPromise;
        const db = client.db();

        const orders = await db.collection('orders').find({
            userId: userId,
        }).sort({ createdAt: -1 }).toArray();

        return NextResponse.json(orders);

    } catch (error) {
        console.error('Failed to fetch orders:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
