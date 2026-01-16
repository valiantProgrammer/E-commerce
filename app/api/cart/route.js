// app/api/cart/route.js

import { NextResponse } from 'next/server';
import clientPromise from '../../lib/db';
import { getUserIdFromRequest } from '../../lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try { 
    const userIdString = await getUserIdFromRequest(request);
    if (!userIdString) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
 
    const client = await clientPromise;
    const db = client.db();
    const cartsCollection = db.collection('carts');
    const userId = new ObjectId(userIdString); 
 
    let cart = await cartsCollection.findOne({ userId: userId });
 
    if (!cart) {
      const newCart = {
        userId: userId,
        items: [],
        subtotal: 0,
        shipping: 0,
        tax: 0,
        total: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await cartsCollection.insertOne(newCart);
      cart = newCart;
    } 
    return NextResponse.json(cart);
    
  } catch (error) {
    console.error("Failed to get cart:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}