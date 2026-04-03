const API_BASE_URL = 'http://localhost:8080/api';

export async function register(userData) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone || '',
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Registration failed');
  }
  
  return data;
}

export async function login(credentials) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }
  
  return data;
}

export async function logout() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });
  
  return response.ok;
}

export async function verifyEmail(token, email) {
  const emailParam = email ? `&email=${encodeURIComponent(email)}` : '';
  const response = await fetch(`${API_BASE_URL}/auth/verify-email?token=${encodeURIComponent(token)}${emailParam}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Email verification failed');
  }
  
  return data;
}

export async function resendVerificationEmail(email) {
  const response = await fetch(`${API_BASE_URL}/auth/resend-verification?email=${encodeURIComponent(email)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to resend verification email');
  }
  
  return data;
}

export async function getProfile() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/user/profile`, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }
  
  return response.json();
}

export async function updateProfile(data) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/user/profile`, {
    method: 'PUT',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.error || 'Failed to update profile');
  }
  
  return result;
}

export async function changePassword(passwordData) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/user/password`, {
    method: 'PUT',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(passwordData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to change password');
  }

  return result;
}

// Address APIs
export async function getAddress() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/address`, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch address');
  }
  
  return response.json();
}

export async function saveAddress(addressData) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/address`, {
    method: 'POST',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(addressData),
  });

  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.error || 'Failed to save address');
  }
  
  return result;
}

export async function deleteAddress() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/address`, {
    method: 'DELETE',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    let errorMsg = 'Failed to delete address';
    
    if (contentType && contentType.includes('application/json')) {
      const result = await response.json();
      errorMsg = result.error || errorMsg;
    }
    throw new Error(errorMsg);
  }
  
  const text = await response.text();
  return text ? JSON.parse(text) : { message: 'Address deleted' };
}

// Payment Card APIs
export async function getPaymentCards() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/payment-cards`, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch payment cards');
  }
  
  return response.json();
}

export async function addPaymentCard(cardData) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/payment-cards`, {
    method: 'POST',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cardData),
  });

  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.error || 'Failed to add payment card');
  }
  
  return result;
}

export async function deletePaymentCard(cardId) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/payment-cards/${cardId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    let errorMsg = 'Failed to delete payment card';
    
    if (contentType && contentType.includes('application/json')) {
      const result = await response.json();
      errorMsg = result.error || errorMsg;
    }
    throw new Error(errorMsg);
  }
  
  const text = await response.text();
  return text ? JSON.parse(text) : { message: 'Card deleted' };
}

// Favorite APIs
export async function getFavorites() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/favorites`, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch favorites');
  }
  
  return response.json();
}

export async function checkIfFavorite(movieId) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/favorites/check/${movieId}`, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to check favorite status');
  }
  
  return response.json();
}

export async function addFavorite(movieId) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/favorites/${movieId}`, {
    method: 'POST',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    let errorMsg = 'Failed to add favorite';
    
    if (contentType && contentType.includes('application/json')) {
      const result = await response.json();
      errorMsg = result.error || errorMsg;
    }
    throw new Error(errorMsg);
  }
  
  const text = await response.text();
  return text ? JSON.parse(text) : { message: 'Added to favorites' };
}

export async function removeFavorite(movieId) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/favorites/${movieId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    let errorMsg = 'Failed to remove favorite';
    
    if (contentType && contentType.includes('application/json')) {
      const result = await response.json();
      errorMsg = result.error || errorMsg;
    }
    throw new Error(errorMsg);
  }
  
  const text = await response.text();
  return text ? JSON.parse(text) : { message: 'Removed from favorites' };
}