import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;

let client;
let clientPromise;

if (!process.env.MONGO_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

client = new MongoClient(uri);
clientPromise = client.connect();

// Export a client that is guaranteed to be connected
export default clientPromise;