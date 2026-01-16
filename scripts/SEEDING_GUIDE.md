# Database Seeding Guide

This guide explains how to seed your ecommerce database with dummy data.

## Overview

The project includes two separate seeding scripts:
- **seed-products.js** - Seeds 12 regular products
- **seed-deals.js** - Seeds 10 special deal products with high discounts

## Prerequisites

1. **MongoDB Atlas Account** - Ensure your MongoDB cluster is active
2. **.env.local Configuration** - Must contain `MONGO_URI` and `DB_NAME`
3. **Dependencies Installed** - Run `npm install` first

## Setup

### 1. Verify .env.local Configuration

Ensure your `.env.local` file contains:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/databasename
DB_NAME=ecommerce
```

### 2. Install Dependencies

```bash
npm install
```

## Running Seed Scripts

### Option 1: Individual Scripts

**Seed Only Products:**
```bash
npm run seed:products
# or
npm run seed
# or
node scripts/seed-products.js
```

**Seed Only Deals:**
```bash
npm run seed:deals
# or
node scripts/seed-deals.js
```

### Option 2: Seed All Data

```bash
npm run seed:all
```

This will run both scripts sequentially, loading all products and deals.

## Data Loaded

### Products (12 items)
The seed-products.js script loads the following product categories:
- **Electronics**: Headphones, Smart Watch, Bluetooth Speaker, Smart Home Hub, Charging Pad (5 items)
- **Fashion**: T-Shirt, Handbag, Wallet (3 items)
- **Sports**: Running Shoes, Yoga Mat (2 items)
- **Home & Kitchen**: Coffee Maker, Water Bottle (2 items)

**Product Fields:**
- id, name, price, originalPrice
- rating, reviews, category
- image (Unsplash URL)
- badge, description
- stock, isDeal (false)

### Deals (10 items)
The seed-deals.js script loads high-discount products:
- Premium Wireless Earbuds - 62% OFF ($49.99 from $129.99)
- Luxury Leather Jacket - 64% OFF ($89.99 from $249.99)
- 4K Webcam Pro - 60% OFF ($79.99 from $199.99)
- Gaming Mouse Wireless - 67% OFF ($39.99 from $119.99)
- Premium Mattress Queen - 61% OFF ($349.99 from $899.99)
- Professional Camera Bundle - 58% OFF ($549.99 from $1299.99)
- Smart Refrigerator - 56% OFF ($699.99 from $1599.99)
- Ultra HD Monitor 4K - 62% OFF ($299.99 from $799.99)
- Premium Bed Sheets Set - 65% OFF ($44.99 from $129.99)
- Portable Power Bank 50000mAh - 60% OFF ($59.99 from $149.99)

**Deal Fields:**
- id, name, price, originalPrice
- discount (percentage), dealEndDate
- rating, reviews, category
- image (Unsplash URL)
- badge, description
- stock, isDeal (true)

## Script Features

Both scripts include:
- ✅ Smart error handling with helpful messages
- ✅ Progress indicators (loading, success, errors)
- ✅ Beautiful formatted output with summaries
- ✅ Database connection validation
- ✅ Automatic connection cleanup
- ✅ Support for MongoDB Atlas and local MongoDB

## Troubleshooting

### "Cannot find module 'dotenv'"
```bash
npm install dotenv
```

### MongoDB Connection Failed
**Symptoms:** "Could not connect to MongoDB"

**Solutions:**
1. Verify MONGO_URI in .env.local
2. Ensure MongoDB Atlas cluster is running (not paused)
3. Check if your IP is whitelisted in MongoDB Atlas
4. Verify username and password are correct

### DNS Error
**Symptom:** "DNS lookup failed"

**Solutions:**
1. Check internet connection
2. Verify MONGO_URI is correct
3. Try reconnecting to VPN (if applicable)

### Authentication Failed
**Symptom:** "Authentication failed - wrong username or password"

**Solutions:**
1. Double-check username and password in MONGO_URI
2. Regenerate credentials in MongoDB Atlas
3. Ensure special characters are URL-encoded (e.g., @ → %40)

## Data Clearing

The scripts automatically clear existing data:
- **seed-products.js** - Clears all products with `isDeal: false`
- **seed-deals.js** - Clears all products with `isDeal: true`

This prevents duplicates and ensures clean data.

## Database Schema

### Products Collection
```javascript
{
  _id: ObjectId,
  id: Number,
  name: String,
  price: Number,
  originalPrice: Number,
  rating: Number,
  reviews: Number,
  image: String,
  category: String,
  badge: String,
  description: String,
  stock: Number,
  isDeal: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Deals Collection
Same as Products Collection with additional:
```javascript
{
  discount: Number,        // Percentage discount
  dealEndDate: Date,       // When deal expires
}
```

## Customizing Data

To add or modify products:

1. **Edit seed-products.js** or **seed-deals.js**
2. **Modify the products array** at the top of the file
3. **Update the id** to be unique
4. **Run the script** again

Example adding a new product:
```javascript
{
  id: 13,
  name: "Your Product Name",
  price: 99.99,
  originalPrice: 149.99,
  rating: 4.8,
  reviews: 1000,
  image: "https://images.unsplash.com/...",
  category: "Your Category",
  badge: "Badge Text",
  description: "Product description",
  stock: 50,
  isDeal: false
}
```

## Resetting Database

To completely reset the products collection:

```bash
# Clear all products and deals
db.products.deleteMany({})

# Then run seeding again
npm run seed:all
```

## FAQ

**Q: Can I seed data to a local MongoDB?**
A: Yes, use `MONGO_URI=mongodb://127.0.0.1:27017` in .env.local

**Q: Are the images real?**
A: Yes, images are from Unsplash - a free stock photo service. They're real URLs.

**Q: Can I run both scripts simultaneously?**
A: It's recommended to run them sequentially (one after another) to avoid database locks.

**Q: How often should I seed?**
A: Only seed when you need to reset data. Running multiple times will replace existing data.

**Q: Are there test data validations?**
A: The scripts verify database connection but don't validate product data format. Ensure MongoDB schema matches.

## Support

For issues:
1. Check error messages in console output
2. Verify .env.local configuration
3. Check MongoDB Atlas cluster status
4. Ensure all dependencies are installed
