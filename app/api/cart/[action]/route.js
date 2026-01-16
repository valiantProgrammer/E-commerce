import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/app/lib/db';
import { getUserIdFromRequest } from '@/app/lib/auth';

// This is a mock function. You should have this utility in your project.
// It calculates the totals based on the items in the cart.
const calculateCartTotals = (items = []) => {
    const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0);
    // These can be based on more complex logic
    const shipping = subtotal > 50 ? 0 : 5; 
    const tax = subtotal * 0.1; // 10% tax for example
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total };
};
 
const validateObjectId = (id) => ObjectId.isValid(id);

export async function POST(request, { params }) { 
  const { action } = await params;

  try {
    // 1. Authenticate user and get their ID
    const userIdString = await getUserIdFromRequest(request);
    if (!userIdString) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = new ObjectId(userIdString);

    const { productId, quantity } = await request.json();
    
    // 2. Validate inputs
    if (!productId || !validateObjectId(productId)) {
      return NextResponse.json({ error: 'Invalid Product ID' }, { status: 400 });
    }
    const productObjectId = new ObjectId(productId);

    const client = await clientPromise;
    const db = client.db();
    const cartsCollection = db.collection('carts');
    
    // 3. Fetch the product from the database
    const product = await db.collection('products').findOne({ _id: productObjectId });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // 4. Fetch the user's cart from the 'carts' collection
    let cart = await cartsCollection.findOne({ userId });
    
    if (!cart) {
        cart = {
            userId,
            items: [],
            createdAt: new Date(),
        };
    }

    // 5. Perform the requested action on the cart items
    switch (action) {
      case 'add': {
        const qtyToAdd = quantity > 0 ? quantity : 1;
        const existingItemIndex = cart.items.findIndex(
          (item) => item.productId.toString() === productId
        );

        if (existingItemIndex > -1) {
          cart.items[existingItemIndex].qty += qtyToAdd;
          cart.items[existingItemIndex].subtotal = cart.items[existingItemIndex].qty * cart.items[existingItemIndex].priceAtAdd;
        } else {
          cart.items.push({
            productId: productObjectId,
            name: product.name,
            imageUrl: product.imageUrl || (product.images ? product.images[0] : '/placeholder.jpg'),
            priceAtAdd: product.price,
            qty: qtyToAdd,
            subtotal: qtyToAdd * product.price,
          });
        }
        break;
      }

      case 'remove':
        cart.items = cart.items.filter(
          (item) => item.productId.toString() !== productId
        );
        break;

      case 'update': {
        const itemToUpdateIndex = cart.items.findIndex(
          (item) => item.productId.toString() === productId
        );

        if (itemToUpdateIndex > -1) {
          if (quantity <= 0) {
            cart.items.splice(itemToUpdateIndex, 1);
          } else {
            cart.items[itemToUpdateIndex].qty = quantity;
            cart.items[itemToUpdateIndex].subtotal = quantity * cart.items[itemToUpdateIndex].priceAtAdd;
          }
        }
        break;
      }
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // 6. Recalculate cart-level totals
    const { subtotal, shipping, tax, total } = calculateCartTotals(cart.items);
    
    const updateData = {
        items: cart.items,
        subtotal,
        shipping,
        tax,
        total,
        updatedAt: new Date(),
    };

    // 7. Save the updated cart using findOneAndUpdate with upsert
    const updatedCart = await cartsCollection.findOneAndUpdate(
      { userId },
      { 
        $set: updateData,
        $setOnInsert: { userId, createdAt: new Date() }
      },
      { 
        upsert: true,
        returnDocument: 'after'
      }
    );

    return NextResponse.json(updatedCart);

  } catch (error) {
    console.error('Cart update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
