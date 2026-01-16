import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: String,
  imageUrl: String,
  priceAtAdd: { type: Number, required: true },
  qty: { type: Number, default: 1 },
  subtotal: { type: Number, required: true }
}, { _id: false });

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  items: [cartItemSchema],
  subtotal: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);
