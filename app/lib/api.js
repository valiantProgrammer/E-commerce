// // lib/api.js

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

// class ApiError extends Error {
//   constructor(message, status) {
//     super(message);
//     this.name = 'ApiError';
//     this.status = status;
//   }
// }

// const handleResponse = async (response) => {
//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({}));
//     throw new ApiError(
//       errorData.message || 'An error occurred',
//       response.status
//     );
//   }
//   return response.json();
// };

// const getAuthHeaders = () => {
//   const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
//   return token ? { Authorization: `Bearer ${token}` } : {};
// };

// export const authApi = {
//   // Authentication
//   login: async (credentials) => {
//     const response = await fetch(`${API_BASE_URL}/auth/signin`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(credentials),
//     });
//     return handleResponse(response);
//   },

//   register: async (userData) => {
//     const response = await fetch(`${API_BASE_URL}/auth/signup`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(userData),
//     });
//     return handleResponse(response);
//   },

//   verifyOtp: async (email, otp) => {
//     const response = await fetch(`${API_BASE_URL}/auth/verify`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ email, otp }),
//     });
//     return handleResponse(response);
//   },

//   sendOtp: async (email) => {
//     const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ email }),
//     });
//     return handleResponse(response);
//   },

//   logout: async () => {
//     const response = await fetch(`${API_BASE_URL}/auth/logout`, {
//       method: 'POST',
//       headers: {
//         ...getAuthHeaders(),
//         'Content-Type': 'application/json',
//       },
//     });
//     return handleResponse(response);
//   },

//   refreshToken: async () => {
//     const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
//     if (!refreshToken) {
//       throw new Error('No refresh token available');
//     }

//     const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${refreshToken}`,
//       },
//     });
//     return handleResponse(response);
//   },

//   // User Profile
//   getProfile: async () => {
//     const response = await fetch(`${API_BASE_URL}/user/profile`, {
//       headers: getAuthHeaders(),
//     });
//     return handleResponse(response);
//   },

//   updateProfile: async (profileData) => {
//     const response = await fetch(`${API_BASE_URL}/user/profile`, {
//       method: 'PUT',
//       headers: {
//         ...getAuthHeaders(),
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(profileData),
//     });
//     return handleResponse(response);
//   },

//   // Addresses
//   getAddresses: async () => {
//     const response = await fetch(`${API_BASE_URL}/user/address`, {
//       headers: getAuthHeaders(),
//     });
//     return handleResponse(response);
//   },

//   addAddress: async (addressData) => {
//     const response = await fetch(`${API_BASE_URL}/user/address`, {
//       method: 'POST',
//       headers: {
//         ...getAuthHeaders(),
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(addressData),
//     });
//     return handleResponse(response);
//   },

//   updateAddress: async (addressId, addressData) => {
//     const response = await fetch(`${API_BASE_URL}/user/address`, {
//       method: 'PUT',
//       headers: {
//         ...getAuthHeaders(),
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ addressId, ...addressData }),
//     });
//     return handleResponse(response);
//   },

//   deleteAddress: async (addressId) => {
//     const response = await fetch(`${API_BASE_URL}/user/address`, {
//       method: 'DELETE',
//       headers: {
//         ...getAuthHeaders(),
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ addressId }),
//     });
//     return handleResponse(response);
//   },

//   // Cart Operations
//   getCart: async () => {
//     const response = await fetch(`${API_BASE_URL}/cart`, {
//       headers: getAuthHeaders(),
//     });
//     return handleResponse(response);
//   },

//   updateCart: async (action, productId, quantity = 1) => {
//     const response = await fetch(`${API_BASE_URL}/cart/${action}`, {
//       method: 'POST',
//       headers: {
//         ...getAuthHeaders(),
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ productId, quantity }),
//     });
//     return handleResponse(response);
//   },

//   // Products
//   getProducts: async (query = {}) => {
//     const queryString = new URLSearchParams(query).toString();
//     const response = await fetch(`${API_BASE_URL}/products?${queryString}`, {
//       headers: getAuthHeaders(),
//     });
//     return handleResponse(response);
//   },

//   getProduct: async (productId) => {
//     const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
//       headers: getAuthHeaders(),
//     });
//     return handleResponse(response);
//   },
// };

// // Add interceptors for token refresh
// const originalRequest = authApi.login;
// authApi.login = async (...args) => {
//   try {
//     const response = await originalRequest(...args);
//     if (response.accessToken && response.refreshToken) {
//       localStorage.setItem('access_token', response.accessToken);
//       localStorage.setItem('refresh_token', response.refreshToken);
//     }
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// // Request interceptor for token refresh
// const withAuth = (fn) => {
//   return async (...args) => {
//     try {
//       return await fn(...args);
//     } catch (error) {
//       if (error.status === 401) {
//         try {
//           // Attempt to refresh token
//           const { accessToken, refreshToken } = await authApi.refreshToken();
//           localStorage.setItem('access_token', accessToken);
//           localStorage.setItem('refresh_token', refreshToken);
//           // Retry original request
//           return await fn(...args);
//         } catch (refreshError) {
//           // Clear tokens and redirect to login if refresh fails
//           localStorage.removeItem('access_token');
//           localStorage.removeItem('refresh_token');
//           window.location.href = '/Auth?mode=login';

//           throw refreshError;
//         }
//       }
//       throw error;
//     }
//   };
// };

// // Wrap all API calls that require authentication
// const protectedApis = [
//   'getProfile', 'updateProfile', 
//   'getAddresses', 'addAddress', 'updateAddress', 'deleteAddress',
//   'getCart', 'updateCart',
//   'getProducts', 'getProduct'
// ];

// protectedApis.forEach(apiName => {
//   authApi[apiName] = withAuth(authApi[apiName]);
// });

// export default authApi;

// export const productsApi = {
//   getFeaturedProducts: async () => {
//     const res = await fetch(`${API_BASE_URL}/products/featured`, {
//       next: { revalidate: 3600 } // Revalidate every hour
//     });
//     return res.json();
//   },

//   getProducts: async (query = {}) => {
//     const queryString = new URLSearchParams(query).toString();
//     const res = await fetch(`${API_BASE_URL}/products?${queryString}`);
//     return res.json();
//   },

//   getProductById: async (id) => {
//     const res = await fetch(`${API_BASE_URL}/products/${id}`);
//     return res.json();
//   },

//   searchProducts: async (query) => {
//     const res = await fetch(`${API_BASE_URL}/products/search?q=${query}`);
//     return res.json();
//   }
// };

// lib/api.js
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || `HTTP error! status: ${response.status}`,
      response.status
    );
  }
  return response.json();
};

// Get auth headers from cookies
const getAuthHeaders = () => {
  const token = Cookies.get('accessToken');
  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `${token.toString()}`;
  }

  return headers;
};

export const authApi = {
  // Authentication
  login: async (credentials) => {
    const response = await fetch(`/api/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await handleResponse(response);

    if (data.accessToken && data.refreshToken) {
      // Store tokens in cookies instead of localStorage
      Cookies.set('accessToken', data.accessToken, {
        expires: 1, // 1 day
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      Cookies.set('refreshToken', data.refreshToken, {
        expires: 30, // 30 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
    }

    return data;
  },

  register: async (userData) => {
    const response = await fetch(`/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  verifyOtp: async (email, otp) => {
    const response = await fetch(`/api/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });
    return handleResponse(response);
  },

  sendOtp: async (email) => {
    const response = await fetch(`/api/auth/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    return handleResponse(response);
  },

  logout: async () => {
    const response = await fetch(`/api/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    // Clear cookies regardless of API response
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');

    return handleResponse(response);
  },
  getOrderById: async (orderId) => {
    const response = await fetch(`/api/orders/${orderId}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
  refreshToken: async () => {
    const refreshToken = Cookies.get('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    return handleResponse(response);
  },

  // User Profile
  getProfile: async () => {
    const response = await fetch(`/api/user/profile`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateProfile: async (profileData) => {
    const response = await fetch(`/api/user/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    return handleResponse(response);
  },

  // Addresses
  getAddresses: async () => {
    const response = await fetch(`/api/user/address`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  addAddress: async (addressData) => {
    const response = await fetch(`/api/user/address`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(addressData),
    });
    return handleResponse(response);
  },

  updateAddress: async (addressId, addressData) => {
    const response = await fetch(`/api/user/address`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ addressId, ...addressData }),
    });
    return handleResponse(response);
  },

  deleteAddress: async (addressId) => {
    const response = await fetch(`/api/user/address`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify({ addressId }),
    });
    return handleResponse(response);
  },

  //  Cart Operations
  getCart: async () => {
    const response = await fetch(`/api/cart`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateCart: async (action, productId, quantity = 1) => {
    const response = await fetch(`/api/cart/${action}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId, quantity }),
    });
    return handleResponse(response);
  },

  // Products
  getProducts: async (query = {}) => {
    const queryString = new URLSearchParams(query).toString();
    const response = await fetch(`/api/products?${queryString}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getProduct: async (productId) => {
    const response = await fetch(`/api/products/${productId}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
  submitReview: async (productId, reviewData) => {
    const response = await fetch(`/api/products/${productId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData),
    });
    return handleResponse(response);
  },
  placeOrder: async (orderData) => {
    const response = await fetch(`/api/checkout`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    return handleResponse(response);
  },

  getOrderHistory: async () => {
    const response = await fetch(`/api/orders`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // --- NEW FUNCTION TO GET PREVIOUSLY BOUGHT PRODUCTS ---
  getPreviousProducts: async () => {
    const response = await fetch(`/api/orders/previous-products`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

};

// Enhanced withAuth wrapper with better error handling
const withAuth = (fn) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      if (error.status === 401) {
        console.log('Token expired, attempting refresh...');
        try {
          const refreshResponse = await authApi.refreshToken();

          if (refreshResponse.accessToken && refreshResponse.refreshToken) {
            // Update cookies with new tokens
            Cookies.set('accessToken', refreshResponse.accessToken, {
              expires: 1,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict'
            });
            Cookies.set('refresh_token', refreshResponse.refreshToken, {
              expires: 30,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict'
            });

            // Retry original request with new token
            return await fn(...args);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // Clear cookies and redirect to login
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');

          // Only redirect if we're in the browser
          if (typeof window !== 'undefined') {
            window.location.href = '/Auth?mode=signin';
          }

          throw new ApiError('Session expired. Please login again.', 401);
        }
      }
      throw error;
    }
  };
};

// Wrap protected APIs
const protectedApis = [
  'getProfile', 'updateProfile',
  'getAddresses', 'addAddress', 'updateAddress', 'deleteAddress',
  'getCart', 'updateCart',
  'getProducts', 'getProduct'
];

protectedApis.forEach(apiName => {
  if (authApi[apiName]) {
    const originalFn = authApi[apiName];
    authApi[apiName] = withAuth(originalFn);
  }
});

// ADD THE MISSING productsApi EXPORT
export const productsApi = {
  getFeaturedProducts: async () => {
    const res = await fetch(`/api/products/featured`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch featured products: ${res.status}`);
    }
    return res.json();
  },

  getProducts: async (query = {}) => {
    const queryString = new URLSearchParams(query).toString();
    const res = await fetch(`/api/products?${queryString}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.status}`);
    }
    return res.json();
  },

  getProductById: async (id) => {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch product: ${res.status}`);
    }
    return res.json();
  },

  searchProducts: async (query) => {
    if (!query || query.trim() === '') {
      return [];
    }
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) {
      throw new Error(`Failed to search products: ${res.status}`);
    }
    return res.json();
  },

  getDeals: async (page = 1) => {
    const res = await fetch(`/api/products/deals?page=${page}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch deals: ${res.status}`);
    }
    return res.json();
  },
};

export default authApi;



