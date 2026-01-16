import { ObjectId } from 'mongodb';

export const validateObjectId = (id) => {
  return ObjectId.isValid(id);
};

export const calculateCartTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const tax = parseFloat((subtotal * 0.1).toFixed(2));
  const total = parseFloat((subtotal + shipping + tax).toFixed(2));

  return { subtotal, shipping, tax, total };
};

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, ...userWithoutPassword } = user;
  return {
    ...userWithoutPassword,
    _id: user._id.toString()
  };
};