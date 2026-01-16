/**
 * Seed script to populate the database with deals products
 * 
 * Run with: node scripts/seed-deals.js
 */

import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config({ path: '.env.local' });

const DB_NAME = process.env.DB_NAME || 'ecommerce';

// Import db after env vars are loaded
const { default: clientPromise } = await import('../app/lib/db.js');

// Sample deals data - products with special discounts
const deals = [
  {
    id: 101,
    name: "Premium Wireless Earbuds",
    price: 49.99,
    originalPrice: 129.99,
    discount: 62,
    rating: 4.9,
    reviews: 3421,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"],
    category: "Electronics",
    badge: "Flash Sale",
    description: "Latest wireless earbuds with active noise cancellation and 30-hour battery life.",
    stock: 85,
    isDeal: true,
    dealEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: 102,
    name: "Luxury Leather Jacket",
    price: 89.99,
    originalPrice: 249.99,
    discount: 64,
    rating: 4.8,
    reviews: 1876,
    images: ["https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=400&h=400&fit=crop"],
    category: "Fashion",
    badge: "Weekend Deal",
    description: "Premium leather jacket with perfect fit and timeless style.",
    stock: 32,
    isDeal: true,
    dealEndDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: 103,
    name: "4K Webcam Pro",
    price: 79.99,
    originalPrice: 199.99,
    discount: 60,
    rating: 4.7,
    reviews: 2145,
    images: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop"],
    category: "Electronics",
    badge: "Clearance",
    description: "Professional 4K webcam perfect for streaming and video conferences.",
    stock: 48,
    isDeal: true,
    dealEndDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
  },
  {
    id: 104,
    name: "Gaming Mouse Wireless",
    price: 39.99,
    originalPrice: 119.99,
    discount: 67,
    rating: 4.8,
    reviews: 2987,
    images: ["https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop"],
    category: "Electronics",
    badge: "Hot Deal",
    description: "High-precision gaming mouse with customizable RGB lighting and ultra-fast response time.",
    stock: 156,
    isDeal: true,
    dealEndDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: 105,
    name: "Premium Mattress Queen",
    price: 349.99,
    originalPrice: 899.99,
    discount: 61,
    rating: 4.9,
    reviews: 1234,
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=400&fit=crop"],
    category: "Home & Kitchen",
    badge: "Limited Time",
    description: "Luxury memory foam mattress with excellent support and durability.",
    stock: 18,
    isDeal: true,
    dealEndDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
  },
  {
    id: 106,
    name: "Professional Camera Bundle",
    price: 549.99,
    originalPrice: 1299.99,
    discount: 58,
    rating: 4.8,
    reviews: 876,
    images: ["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop"],
    category: "Electronics",
    badge: "Mega Sale",
    description: "Complete photography bundle with camera, lens, and accessories.",
    stock: 12,
    isDeal: true,
    dealEndDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)
  },
  {
    id: 107,
    name: "Smart Refrigerator",
    price: 699.99,
    originalPrice: 1599.99,
    discount: 56,
    rating: 4.7,
    reviews: 654,
    images: ["https://images.unsplash.com/photo-1584568694244-14fbbc50d688?w=400&h=400&fit=crop"],
    category: "Home & Kitchen",
    badge: "Special Offer",
    description: "Energy-efficient smart refrigerator with IoT connectivity and advanced cooling.",
    stock: 8,
    isDeal: true,
    dealEndDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000)
  },
  {
    id: 108,
    name: "Ultra HD Monitor 4K",
    price: 299.99,
    originalPrice: 799.99,
    discount: 62,
    rating: 4.8,
    reviews: 1543,
    images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop"],
    category: "Electronics",
    badge: "Flash Sale",
    description: "65-inch 4K Ultra HD monitor with HDR support and 144Hz refresh rate.",
    stock: 22,
    isDeal: true,
    dealEndDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
  },
  {
    id: 109,
    name: "Premium Bed Sheets Set",
    price: 44.99,
    originalPrice: 129.99,
    discount: 65,
    rating: 4.8,
    reviews: 2098,
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop"],
    category: "Home & Kitchen",
    badge: "Weekend Deal",
    description: "Luxury Egyptian cotton bed sheets with deep pockets and superior softness.",
    stock: 198,
    isDeal: true,
    dealEndDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: 110,
    name: "Portable Power Bank 50000mAh",
    price: 59.99,
    originalPrice: 149.99,
    discount: 60,
    rating: 4.7,
    reviews: 3456,
    images: ["https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop"],
    category: "Electronics",
    badge: "Best Value",
    description: "High-capacity power bank with fast charging support for multiple devices.",
    stock: 267,
    isDeal: true,
    dealEndDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000)
  }
];

async function seedDeals() {
  let client;

  try {
    console.log('🔄 Connecting to MongoDB using project database...');
    
    // Use the same client promise as the application
    client = await clientPromise;
    
    console.log('✅ Connected to MongoDB successfully');

    const db = client.db();
    const dealsCollection = db.collection('deals');

    // Delete existing deals
    const deleteResult = await dealsCollection.deleteMany({});
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing deals`);

    // Insert new deals
    const result = await dealsCollection.insertMany(deals);
    console.log(`\n✨ Successfully inserted ${result.insertedCount} deals\n`);

    // Display inserted deals summary
    console.log('📊 Deals Summary:');
    console.log('━'.repeat(60));
    deals.forEach((deal, index) => {
      const discount = deal.originalPrice - deal.price;
      console.log(`${index + 1}. ${deal.name}`);
      console.log(`   Price: $${deal.price} (was $${deal.originalPrice}) - ${deal.discount}% OFF`);
      console.log(`   Stock: ${deal.stock} | Rating: ${deal.rating}⭐ | Badge: ${deal.badge}`);
      console.log('');
    });

    console.log('━'.repeat(60));
    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('\n❌ Error seeding deals database:');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n⚠️  Could not connect to MongoDB. Please make sure:');
      console.error('   1. MongoDB Atlas cluster is active');
      console.error('   2. MONGO_URI is correct in .env.local file');
      console.error('   3. Your IP address is whitelisted in MongoDB Atlas');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('\n⚠️  DNS error - check your internet connection and MONGO_URI');
    } else if (error.message.includes('authentication failed')) {
      console.error('\n⚠️  Authentication failed - check username and password in MONGO_URI');
    } else {
      console.error(error.message);
    }
  } finally {
    // Close the connection
    if (client) {
      try {
        await client.close();
        console.log('🔌 MongoDB connection closed');
      } catch (err) {
        console.error('Error closing MongoDB connection:', err);
      }
    }
  }
}

// Run the seed function
seedDeals();
