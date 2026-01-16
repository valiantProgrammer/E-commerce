import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: String,
  imageUrl: String,
  price: { type: Number, required: true },
  qty: { type: Number, default: 1 },
  subtotal: { type: Number, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["processing", "shipped", "delivered", "cancelled"], 
    default: "processing" 
  },
  payment: {
    method: { type: String, enum: ["upi", "card", "cod"], default: "cod" },
    transactionId: { type: String },
    status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" }
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
