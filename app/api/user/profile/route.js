// app/api/user/profile/route.js
import { getUserIdFromRequest } from '../../../lib/auth';
import clientPromise from '../../../lib/db';
import { sanitizeUser } from '../../../lib/utils';
import { ObjectId } from 'mongodb'; // Add this import

export async function GET(request) {
  try {
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Convert userId to ObjectId
    const userData = await db.collection('users').findOne(
      { _id: new ObjectId(userId) }
    );

    if (!userData) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    console.log(userData)
    return Response.json(sanitizeUser(userData));
  } catch (error) {
    console.error('Profile GET error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const updateData = await request.json();
    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return Response.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Convert userId to ObjectId
    const updatedUser = await db.collection('users').findOne(
      { _id: new ObjectId(userId) }, // Convert to ObjectId
      { projection: { password: 0, refreshToken: 0 } }
    );

    return Response.json(sanitizeUser(updatedUser));
  } catch (error) {
    console.error('Profile PUT error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}