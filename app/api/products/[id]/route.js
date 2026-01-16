import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/app/lib/db';
import { getUserIdFromRequest } from '@/app/lib/auth';

// Helper to validate ObjectId
const validateObjectId = (id) => ObjectId.isValid(id);

// --- GET: Fetch a single product with its reviews and ratings ---
export async function GET(request, { params }) {
  const { id } = await params;
  console.log(id);
  if (!id || !validateObjectId(id)) {
    return NextResponse.json({ error: 'Invalid product ID format' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const productObjectId = new ObjectId(id);

    // Use an aggregation pipeline to fetch the product and join its reviews
    const pipeline = [
      // Stage 1: Match the specific product
      { $match: { _id: productObjectId } },
      
      // Stage 2: Join with the 'reviews' collection
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'productId',
          as: 'reviewData'
        }
      },
      
      // Stage 3: Add new fields for calculated stats and the review list
      {
        $addFields: {
          reviews: '$reviewData', // The full list of reviews for the frontend to display
          reviewCount: { $size: '$reviewData' }, // The total number of reviews
          // Calculate the average rating, defaulting to 0 if there are no reviews
          rating: { $ifNull: [ { $avg: '$reviewData.rating' }, 0 ] }
        }
      },

      // Stage 4: Remove the temporary field
      { $project: { reviewData: 0 } }
    ];

    const results = await db.collection('products').aggregate(pipeline).toArray();

    if (results.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // The result of the aggregation is an array, we need the first element
    const product = results[0];
    
    return NextResponse.json(product);

  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// --- POST: Submit a new review for a product ---
export async function POST(request, { params }) {
    const { id } = await params;
    console.log(id);
    if (!id || !validateObjectId(id)) {
        return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    try {
        // 1. Authenticate the user to ensure only logged-in users can review
        const userIdString = await getUserIdFromRequest(request);
        if (!userIdString) {
            return NextResponse.json({ error: 'Unauthorized. Please log in to leave a review.' }, { status: 401 });
        }
        const userId = new ObjectId(userIdString);

        // 2. Get the rating and comment from the request body
        const { rating, comment } = await request.json();
        console.log(rating, comment);

        // 3. Validate the submitted data
        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'A rating between 1 and 5 is required.' }, { status: 400 });
        }
        // if (!comment || comment.trim() === '') {
        //     return NextResponse.json({ error: 'A comment is required.' }, { status: 400 });
        // }

        const client = await clientPromise;
        const db = client.db();
        const productObjectId = new ObjectId(id);

        // Get the username to store with the review (denormalization for efficiency)
        const user = await db.collection('users').findOne({ _id: userId }, { projection: { username: 1 } });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // 4. Create and insert the new review document
        const newReview = {
            productId: productObjectId,
            userId,
            username: user.username,
            rating,
            comment,
            createdAt: new Date(),
        };
        await db.collection('reviews').insertOne(newReview);

        // 5. After adding the review, recalculate the product's average rating and review count
        const statsPipeline = [
            { $match: { productId: productObjectId } },
            { 
                $group: { 
                    _id: '$productId', 
                    averageRating: { $avg: '$rating' },
                    reviewCount: { $sum: 1 }
                }
            }
        ];
        const stats = await db.collection('reviews').aggregate(statsPipeline).toArray();

        // 6. Update the main product document with these new stats for faster lookups on product list pages
        if (stats.length > 0) {
            await db.collection('products').updateOne(
                { _id: productObjectId },
                { 
                    $set: {
                        rating: stats[0].averageRating,
                        reviews: stats[0].reviewCount
                    }
                }
            );
        }

        return NextResponse.json({ success: true, message: 'Review submitted successfully!', review: newReview }, { status: 201 });

    } catch (error) {
        console.error('Failed to submit review:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

