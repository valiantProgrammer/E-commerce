import mongoose from "mongoose";

const tempUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  username: { type: String, required: true },
  password: { type: String, required: true }, // hashed
  avatarUrl: { type: String },

  // OTP handling
  otp: { type: String, required: true },
  otpExpiresAt: { type: Date, required: true },
  otpAttempts: { type: Number, default: 0 },

  // Status
  verified: { type: Boolean, default: false },

  // Timestamps
}, { timestamps: true });

export default mongoose.models.TempUser || mongoose.model("TempUser", tempUserSchema);
