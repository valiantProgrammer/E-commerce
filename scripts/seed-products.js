/**
 * Seed script to populate the products collection with sample data
 * 
 * Run with: node scripts/seed-products.js
 */

import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config({ path: '.env.local' });

const DB_NAME = process.env.DB_NAME || 'ecommerce';

// Import db after env vars are loaded
const { default: clientPromise } = await import('../app/lib/db.js');

// Sample product data
const products = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.8,
    reviews: 1247,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"],
    category: "Electronics",
    brand: "SoundWave",
    badge: "Best Seller",
    description: "High-quality wireless headphones with noise cancellation and long battery life.",
    stock: 45,
    isDeal: false
  },
  {
    id: 2,
    name: "Premium Cotton T-Shirt",
    price: 24.99,
    originalPrice: 34.99,
    rating: 4.6,
    reviews: 892,
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop"],
    category: "Fashion",
    brand: "ThreadWear",
    badge: "New",
    description: "Soft, comfortable cotton t-shirt with a modern fit.",
    stock: 120,
    isDeal: false
  },
  {
    id: 3,
    name: "Smart Fitness Watch",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.9,
    reviews: 2156,
    images: ["https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&h=400&fit=crop"],
    category: "Electronics",
    brand: "FitTech",
    badge: "Sale",
    description: "Track your fitness goals with this advanced smartwatch featuring heart rate monitoring and GPS.",
    stock: 28,
    isDeal: false
  },
  {
    id: 4,
    name: "Organic Coffee Maker",
    price: 149.99,
    originalPrice: 199.99,
    rating: 4.7,
    reviews: 567,
    images: ["https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400&fit=crop"],
    category: "Home & Kitchen",
    brand: "BrewMaster",
    badge: "Limited",
    description: "Brew perfect coffee with this programmable coffee maker featuring a thermal carafe.",
    stock: 15,
    isDeal: false
  },
  {
    id: 5,
    name: "Running Shoes",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.5,
    reviews: 1432,
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop"],
    category: "Sports",
    brand: "SprintGear",
    badge: "Popular",
    description: "Lightweight, cushioned running shoes with responsive foam for maximum comfort.",
    stock: 62,
    isDeal: false
  },
  {
    id: 6,
    name: "Portable Bluetooth Speaker",
    price: 59.99,
    originalPrice: 79.99,
    rating: 4.4,
    reviews: 756,
    images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop"],
    category: "Electronics",
    brand: "AudioPulse",
    badge: "Deal",
    description: "Waterproof portable speaker with 360° sound and 12-hour battery life.",
    stock: 38,
    isDeal: false
  },
  {
    id: 7,
    name: "Designer Handbag",
    price: 129.99,
    originalPrice: 159.99,
    rating: 4.8,
    reviews: 634,
    images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop"],
    category: "Fashion",
    brand: "LuxeBag",
    badge: "Trending",
    description: "Elegant designer handbag with multiple compartments and premium materials.",
    stock: 23,
    isDeal: false
  },
  {
    id: 8,
    name: "Smart Home Hub",
    price: 179.99,
    originalPrice: 229.99,
    rating: 4.6,
    reviews: 445,
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"],
    category: "Electronics",
    brand: "SmartDwell",
    badge: "Hot",
    description: "Control your smart home devices with voice commands and automation routines.",
    stock: 17,
    isDeal: false
  },
  {
    id: 9,
    name: "Yoga Mat",
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.7,
    reviews: 892,
    images: ["https://images.unsplash.com/photo-1599447292180-45fd84092ef4?w=400&h=400&fit=crop"],
    category: "Sports",
    brand: "ZenFlow",
    badge: null,
    description: "Non-slip, eco-friendly yoga mat with alignment markings for proper positioning.",
    stock: 85,
    isDeal: false
  },
  {
    id: 10,
    name: "Stainless Steel Water Bottle",
    price: 24.99,
    originalPrice: 29.99,
    rating: 4.8,
    reviews: 1245,
    images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop"],
    category: "Home & Kitchen",
    brand: "HydroVault",
    badge: null,
    description: "Double-walled insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
    stock: 112,
    isDeal: false
  },
  {
    id: 11,
    name: "Wireless Charging Pad",
    price: 34.99,
    originalPrice: 44.99,
    rating: 4.5,
    reviews: 723,
    images: ["https://images.unsplash.com/photo-1585338069466-5e852aae3a0e?w=400&h=400&fit=crop"],
    category: "Electronics",
    brand: "ChargeTech",
    badge: null,
    description: "Fast wireless charging pad compatible with all Qi-enabled devices.",
    stock: 54,
    isDeal: false
  },
  {
    id: 12,
    name: "Leather Wallet",
    price: 49.99,
    originalPrice: 59.99,
    rating: 4.6,
    reviews: 512,
    images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop"],
    category: "Fashion",
    brand: "LeatherCraft",
    badge: null,
    description: "Genuine leather wallet with RFID blocking technology and multiple card slots.",
    stock: 67,
    isDeal: false
  },
  
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

async function seedProducts() {
  let client;

  try {
    console.log('🔄 Connecting to MongoDB using project database...');
    
    // Use the same client promise as the application
    client = await clientPromise;
    
    console.log('✅ Connected to MongoDB successfully');

    // Use the default database (same as the app uses)
    const db = client.db();
    const productsCollection = db.collection('products');

    // Clear existing regular products (not deals)
    const deleteResult = await productsCollection.deleteMany({ isDeal: false });
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing products`);

    // Insert new products
    const result = await productsCollection.insertMany(products);
    console.log(`\n✨ Successfully inserted ${result.insertedCount} products\n`);

    // Display inserted products summary
    console.log('📊 Products Summary:');
    console.log('━'.repeat(60));
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Price: $${product.price} | Stock: ${product.stock} | Rating: ${product.rating}⭐`);
      console.log(`   Category: ${product.category} | Badge: ${product.badge || 'None'}`);
      console.log('');
    });

    console.log('━'.repeat(60));
    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('\n❌ Error seeding products database:');
    
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
seedProducts();