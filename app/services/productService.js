// services/productService.js
import clientPromise from '../lib/db';
import { Product } from '../lib/models';

class ProductService {
  async getCollection() {
    const client = await clientPromise;
    const db = client.db(); // Your database name if not in connection string
    return db.collection('products');
  }

  // Get all products with optional filters
  async getProducts({ category, limit = 10, skip = 0 } = {}) {
    const collection = await this.getCollection();
    const query = category ? { category } : {};
    
    const products = await collection
      .find(query)
      .skip(skip)
      .limit(limit)
      .toArray();

    return products.map(p => new Product(p));
  }

  // Get featured products
  async getFeaturedProducts(limit = 8) {
    const collection = await this.getCollection();
    const products = await collection
      .find({ badge: { $exists: true } }) // Or any other "featured" criteria
      .limit(limit)
      .toArray();

    return products.map(p => new Product(p));
  }

  // Get single product by ID
  async getProductById(id) {
    const collection = await this.getCollection();
    const product = await collection.findOne({ _id: new ObjectId(id) });
    return product ? new Product(product) : null;
  }

  // Search products
  async searchProducts(query) {
    const collection = await this.getCollection();
    const products = await collection
      .find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ]
      })
      .limit(20)
      .toArray();

    return products.map(p => new Product(p));
  }
}

export default new ProductService();