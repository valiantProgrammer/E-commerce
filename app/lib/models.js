export class User {
  constructor({
    email,
    avatarUrl,
    username,
    password,
    verified = false,
    refreshToken = null,
    addresses = [], // ✅ multiple addresses
    orders = [], // ✅ order history
    previousProducts = [] // ✅ previously ordered products
  }) {
    this.email = email.toLowerCase();
    this.avatarUrl = avatarUrl;
    this.username = username;
    this.password = password;
    this.verified = verified;
    this.refreshToken = refreshToken;


    this.addresses = addresses.map(addr => new Address(addr));
    this.orders = orders.map(order => new Order(order));
    this.previousProducts = previousProducts.map(p => new Product(p));

    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // ✅ Add a new address
  addAddress(address) {
    const addr = new Address({ ...address, userId: this.email });
    if (addr.is_default) {
      this.addresses.forEach(a => (a.is_default = false));
    }
    this.addresses.push(addr);
    this.updatedAt = new Date();
    return addr;
  }

  // ✅ Set default address
  setDefaultAddress(addressId) {
    this.addresses.forEach(a => {
      a.is_default = a.createdAt.getTime() === addressId;
    });
    this.updatedAt = new Date();
  }

  // ✅ Remove address
  removeAddress(addressId) {
    this.addresses = this.addresses.filter(
      a => a.createdAt.getTime() !== addressId
    );
    this.updatedAt = new Date();
  }

  // ✅ Add an order
  addOrder(order) {
    const newOrder = new Order(order);
    this.orders.push(newOrder);

    // Update previousProducts
    order.items.forEach(item => {
      if (!this.previousProducts.some(p => p.name === item.name)) {
        this.previousProducts.push(new Product(item));
      }
    });

    this.updatedAt = new Date();
    return newOrder;
  }
}

export class Product {
  constructor({ 
    name, 
    price, 
    description, 
    images = [], 
    imageUrl = null, 
    category, 
    stock 
  }) {
    this.name = name;
    this.price = price;
    this.description = description;
    this.images = images;
    this.imageUrl = imageUrl || (images.length > 0 ? images[0] : null);
    this.category = category;
    this.stock = stock;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

export class Address {
  constructor({
    addressType,
    userId,
    street,
    city,
    state,
    postalCode,
    country,
    coordinates = null, // ✅ store { lat, lng }
    is_default = false
  }) {
    this.userId = userId;
    this.street = street;
    this.city = city;
    this.state = state;
    this.postalCode = postalCode;
    this.country = country;
    this.coordinates = coordinates;
    this.is_default = is_default;
    this.addressType = addressType;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

export class Order {
  constructor({
    userId,
    items = [], // [{ name, price, qty, image }]
    status = "processing", // "processing" | "shipped" | "delivered" | "cancelled"
    total = 0
  }) {
    this.userId = userId;
    this.items = items.map(i => ({
      ...i,
      subtotal: i.price * (i.qty || 1)
    }));
    this.status = status;
    this.total =
      total ||
      this.items.reduce((sum, i) => sum + i.subtotal, 0);
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

export class OTP {
  constructor({ email, otp, userId, expiresAt }) {
    this.email = email;
    this.otp = otp;
    this.userId = userId;
    this.expiresAt = expiresAt;
    this.createdAt = new Date();
    this.used = false;
    this.invalidated = false;
  }
}
