/**
 * Test MongoDB connection
 * 
 * Run with: node scripts/test-mongodb-connection.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env.local
try {
  dotenv.config({ path: '.env.local' });
  console.log('Loaded environment variables from .env.local');
} catch (error) {
  console.log('No .env.local file found, using default configuration');
}

// MongoDB connection string
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce';

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB at:', MONGODB_URI);
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout for server selection
      connectTimeoutMS: 10000 // 10 seconds timeout for initial connection
    });
    
    console.log('✅ Successfully connected to MongoDB!');
    console.log('Connection details:');
    console.log('  - Database name:', mongoose.connection.name);
    console.log('  - Host:', mongoose.connection.host);
    console.log('  - Port:', mongoose.connection.port);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nAvailable collections:');
    if (collections.length === 0) {
      console.log('  No collections found. Database is empty.');
    } else {
      collections.forEach(collection => {
        console.log(`  - ${collection.name}`);
      });
    }
    
    // Close the connection
    await mongoose.disconnect();
    console.log('\nConnection closed successfully');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:');
    if (error.name === 'MongoServerSelectionError') {
      console.error('\nCould not connect to MongoDB server. Please make sure:');
      console.error('1. MongoDB is installed and running on your machine');
      console.error('2. The connection string is correct in .env.local file');
      console.error('\nTo install MongoDB:');
      console.error('- Windows: https://www.mongodb.com/try/download/community');
      console.error('- macOS: brew install mongodb-community');
      console.error('- Linux: Follow distribution-specific instructions');
      console.error('\nTo start MongoDB:');
      console.error('- Windows: Start MongoDB service from Services');
      console.error('- macOS/Linux: mongod --dbpath=/path/to/data/db');
    } else {
      console.error(error);
    }
  }
}

// Run the test
testConnection();