# MongoDB Integration for Pinnacle Labs E-commerce

This document provides instructions for setting up and using MongoDB with the Pinnacle Labs E-commerce application.

## Setup Instructions

### Prerequisites

- MongoDB installed locally or a MongoDB Atlas account
- Node.js and npm installed

### Configuration

1. Ensure your `.env.local` file contains the MongoDB connection string:

```
MONGO_URI=mongodb://localhost:27017/ecommerce
```

Replace with your actual MongoDB connection string if using Atlas or a different configuration.

### Install Dependencies

The project now includes Mongoose for MongoDB object modeling:

```bash
npm install
```

## Database Seeding

A seed script is provided to populate the database with initial product data:

```bash
npm run seed
```

This will:
1. Connect to your MongoDB database
2. Clear any existing products
3. Insert sample product data

## Models

The application uses Mongoose models for data validation and interaction:

- `Product`: Defines the schema for product data including name, price, category, etc.

## API Routes

The following API routes are available for product data:

- `GET /api/products`: Get all products
- `GET /api/products?category=Electronics`: Filter products by category
- `GET /api/products?q=wireless`: Search products by query
- `GET /api/products?id=1`: Get a specific product by ID

## Development

To run the application in development mode:

```bash
npm run dev
```

## Troubleshooting

### Connection Issues

If you encounter MongoDB connection issues:

1. Verify MongoDB is running locally with `mongod` command
2. Check your connection string in `.env.local`
3. Ensure network connectivity if using MongoDB Atlas

### Data Not Appearing

If product data is not appearing:

1. Run the seed script: `npm run seed`
2. Check MongoDB connection in the console logs
3. Verify the database and collection names match in your code