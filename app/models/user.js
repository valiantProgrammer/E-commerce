import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  addressType: { type: String, enum: ["home", "work", "other"], default: "home" },
  street: String,
  city: String,
  state: String,
  postalCode: String,
  country: String,
  coordinates: {
    lat: Number,
    lng: Number
  },
  is_default: { type: Boolean, default: false },
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  username: { type: String, required: true },
  password: { type: String, required: true }, // hashed
  avatarUrl: String,
  verified: { type: Boolean, default: false },
  refreshToken: { type: String, default: null },
  addresses: [addressSchema],
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
