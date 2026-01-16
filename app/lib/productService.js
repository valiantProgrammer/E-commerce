import clientPromise from './db';
import { ObjectId } from 'mongodb';
import { Product } from './models'; 

export default class ProductService {
  static async getCollection() {
    const client = await clientPromise;
    return client.db().collection('products');
  }

  // Get all products with filters
  static async getProducts({ 
    category, 
    limit = 12, 
    skip = 0,
    sort = 'createdAt',
    order = 'desc'
  }) {
    const collection = await this.getCollection();
    const query = category ? { category } : {};
    const sortOption = { [sort]: order === 'asc' ? 1 : -1 };

    return collection
      .find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .toArray();
  }

  // Get featured products
  static async getFeaturedProducts(limit = 8) {
    const collection = await this.getCollection();
    return collection
      .find({ badge: { $exists: true } })
      .limit(limit)
      .toArray();
  }

  // Get single product
  static async getProductById(id) {
    const collection = await this.getCollection();
    return collection.findOne({ _id: new ObjectId(id) });
  }

  // Search products
  static async searchProducts(query) {
    const collection = await this.getCollection();
    return collection
      .find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ]
      })
      .limit(20)
      .toArray();
  }
}