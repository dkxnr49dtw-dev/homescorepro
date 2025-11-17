// API Client for HomeScorePro Backend
// Handles all API communication with the backend server

// Use window.API_BASE_URL if set, otherwise use default
// Can be configured in HTML: <script>window.API_BASE_URL = 'your-api-url';</script>
const API_BASE_URL = window.API_BASE_URL || 'http://localhost:3000/api';

// Get auth token from localStorage
function getAuthToken() {
  return localStorage.getItem('auth_token');
}

// Set auth token in localStorage
function setAuthToken(token) {
  localStorage.setItem('auth_token', token);
}

// Remove auth token
function removeAuthToken() {
  localStorage.removeItem('auth_token');
}

// Make API request
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    }
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      // Handle 401 (unauthorized) - redirect to login
      if (response.status === 401) {
        removeAuthToken();
        if (window.location.pathname !== '/index.html' && !window.location.pathname.includes('login')) {
          window.location.href = '/index.html';
        }
      }
      throw new Error(data.error?.message || data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// Authentication API
const authAPI = {
  register: async (email, password, firstName, lastName) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: { email, password, firstName, lastName }
    });
    if (response.token) {
      setAuthToken(response.token);
    }
    return response;
  },

  login: async (email, password, rememberMe = false) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password, rememberMe }
    });
    if (response.token) {
      setAuthToken(response.token);
    }
    return response;
  },

  logout: () => {
    removeAuthToken();
  },

  getCurrentUser: async () => {
    return await apiRequest('/auth/me');
  },

  verifyEmail: async (token) => {
    return await apiRequest(`/auth/verify-email/${token}`, {
      method: 'GET'
    });
  },

  forgotPassword: async (email) => {
    return await apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: { email }
    });
  },

  resetPassword: async (token, password) => {
    return await apiRequest('/auth/reset-password', {
      method: 'POST',
      body: { token, password }
    });
  }
};

// Properties API
const propertiesAPI = {
  getAll: async () => {
    return await apiRequest('/properties');
  },

  getById: async (id) => {
    return await apiRequest(`/properties/${id}`);
  },

  create: async (propertyData) => {
    return await apiRequest('/properties', {
      method: 'POST',
      body: propertyData
    });
  },

  update: async (id, propertyData) => {
    return await apiRequest(`/properties/${id}`, {
      method: 'PUT',
      body: propertyData
    });
  },

  delete: async (id) => {
    return await apiRequest(`/properties/${id}`, {
      method: 'DELETE'
    });
  }
};

// Users API
const usersAPI = {
  getProfile: async () => {
    return await apiRequest('/users/profile');
  },

  updateProfile: async (profileData) => {
    return await apiRequest('/users/profile', {
      method: 'PUT',
      body: profileData
    });
  },

  changePassword: async (currentPassword, newPassword) => {
    return await apiRequest('/users/password', {
      method: 'PUT',
      body: { currentPassword, password: newPassword }
    });
  },

  getPreferences: async () => {
    return await apiRequest('/users/preferences');
  },

  updatePreferences: async (preferences) => {
    return await apiRequest('/users/preferences', {
      method: 'PUT',
      body: preferences
    });
  }
};

// Suburbs API
const suburbsAPI = {
  search: async (query, limit = 10) => {
    return await apiRequest('/suburbs/search', {
      method: 'POST',
      body: { query, limit }
    });
  },

  getByName: async (name) => {
    return await apiRequest(`/suburbs/${encodeURIComponent(name)}`);
  },

  getFavorites: async () => {
    return await apiRequest('/suburbs/favorites/list');
  },

  addFavorite: async (suburbName, postcode) => {
    return await apiRequest('/suburbs/favorites', {
      method: 'POST',
      body: { suburbName, postcode }
    });
  },

  removeFavorite: async (id) => {
    return await apiRequest(`/suburbs/favorites/${id}`, {
      method: 'DELETE'
    });
  }
};

// Payments API
const paymentsAPI = {
  createIntent: async (plan, priceId) => {
    return await apiRequest('/payments/create-intent', {
      method: 'POST',
      body: { plan, priceId }
    });
  },

  getPaymentMethods: async () => {
    return await apiRequest('/payments/payment-methods');
  },

  getHistory: async () => {
    return await apiRequest('/payments/history');
  }
};

// Subscriptions API
const subscriptionsAPI = {
  getCurrent: async () => {
    return await apiRequest('/subscriptions/current');
  },

  cancel: async () => {
    return await apiRequest('/subscriptions/cancel', {
      method: 'POST'
    });
  },

  reactivate: async () => {
    return await apiRequest('/subscriptions/reactivate', {
      method: 'POST'
    });
  },

  updatePaymentMethod: async (paymentMethodId) => {
    return await apiRequest('/subscriptions/payment-method', {
      method: 'PUT',
      body: { paymentMethodId }
    });
  }
};

// Contact API
const contactAPI = {
  submit: async (name, email, subject, message) => {
    return await apiRequest('/contact', {
      method: 'POST',
      body: { name, email, subject, message }
    });
  }
};

// Export API object
window.API = {
  auth: authAPI,
  properties: propertiesAPI,
  users: usersAPI,
  suburbs: suburbsAPI,
  payments: paymentsAPI,
  subscriptions: subscriptionsAPI,
  contact: contactAPI
};


