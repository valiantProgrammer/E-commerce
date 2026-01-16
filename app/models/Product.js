import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  images: [String],
  imageUrl: String,
  category: String,
  brand: String,
  stock: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", productSchema);
